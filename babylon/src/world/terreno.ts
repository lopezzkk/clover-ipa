// Terreno da Vila Hage e arredores: colinas suaves, praça plana, estradas de terra e montanhas ao fundo.
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3, VertexData } from '@babylonjs/core';
import { textura, grama, terra } from './texturas';

export const TAM = 520; // lado do terreno (m)
export const ESTRADAS: [number, number][][] = [
  [[0, -20], [0, -70], [-6, -120], [-10, -200]],       // norte: para o Reino Comum / Capital
  [[20, 6], [70, 0], [120, -10], [200, -20]],          // leste: Colina do Crânio
  [[-20, 4], [-60, 30], [-110, 40], [-200, 60]],       // oeste: Campo de Treino
  [[0, 22], [6, 80], [20, 140], [40, 220]],            // sul
  [[-14, -16], [-40, -40], [-64, -52]],                // Torre dos Grimórios
];

function ruido(x: number, z: number) {
  return Math.sin(x * 0.021) * Math.cos(z * 0.017) * 2.2 + Math.sin(x * 0.053 + 1.3) * Math.sin(z * 0.047 + 0.7) * 0.9 + Math.sin((x + z) * 0.011) * 1.4;
}
function distSeg(px: number, pz: number, a: number[], b: number[]) {
  const dx = b[0] - a[0], dz = b[1] - a[1]; const t = Math.max(0, Math.min(1, ((px - a[0]) * dx + (pz - a[1]) * dz) / (dx * dx + dz * dz)));
  return Math.hypot(px - a[0] - dx * t, pz - a[1] - dz * t);
}
export function distEstrada(x: number, z: number) {
  let d = 1e9; for (const e of ESTRADAS) for (let i = 0; i < e.length - 1; i++) d = Math.min(d, distSeg(x, z, e[i], e[i + 1])); return d;
}
/** altura do chão em (x, z) */
export function altura(x: number, z: number) {
  const r = Math.hypot(x, z);
  const plano = Math.min(1, Math.max(0, (r - 30) / 40));           // praça e arredores planos
  let h = ruido(x, z) * plano;
  const borda = Math.max(0, (Math.max(Math.abs(x), Math.abs(z)) - 170) / 80); // montanhas nas bordas
  h += borda * borda * 38 * (0.7 + 0.3 * Math.sin(x * 0.05 + z * 0.03));
  const de = distEstrada(x, z); if (de < 6) h *= 0.6 + 0.4 * de / 6; // estradas alisadas
  return h;
}

export function criarTerreno(scene: Scene, detalhe: number) {
  const N = Math.round(120 * detalhe), pos: number[] = [], cor: number[] = [], uv: number[] = [], ind: number[] = [];
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const x = -TAM / 2 + TAM * i / N, z = -TAM / 2 + TAM * j / N, y = altura(x, z);
    pos.push(x, y, z); uv.push(x / 6, z / 6);
    const r = Math.hypot(x, z), de = distEstrada(x, z);
    const terraK = Math.max(r < 26 ? 1 - Math.max(0, r - 22) / 4 : 0, de < 4.5 ? 1 - Math.max(0, de - 3) / 1.5 : 0);
    const rocha = Math.min(1, Math.max(0, (y - 14) / 12));
    const v = 0.88 + 0.12 * Math.sin(x * 0.13) * Math.cos(z * 0.11);
    // cores multiplicam a textura de grama: terra (marrom) · rocha (cinza) · grama (variações)
    const g = [0.92 * v, 0.86 * v, 0.72 * v], t = [1.55, 1.08, 0.78], k = [1.05, 1.02, 1.0];
    const m = (a: number[], b: number[], f: number) => a.map((q, n) => q + (b[n] - q) * f);
    let c = m(g, t, terraK); c = m(c, k.map(q => q * 1.25), rocha);
    cor.push(c[0], c[1], c[2], 1);
  }
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1; ind.push(a, b, c, b, d, c); }
  const nor: number[] = []; VertexData.ComputeNormals(pos, ind, nor);
  const vd = new VertexData(); vd.positions = pos; vd.indices = ind; vd.normals = nor; vd.colors = cor; vd.uvs = uv;
  const chao = new Mesh('terreno', scene); vd.applyToMesh(chao); chao.receiveShadows = true;
  const mat = new StandardMaterial('m_terreno', scene);
  mat.diffuseTexture = textura(scene, 'grama', 256, grama); mat.specularColor = new Color3(0.03, 0.03, 0.03);
  chao.material = mat; chao.freezeWorldMatrix(); chao.isPickable = true;
  // estradas: faixas de terra que acompanham o chão
  const mt = new StandardMaterial('m_estrada', scene); const te = textura(scene, 'terra', 256, terra, 1); mt.diffuseTexture = te; mt.specularColor = Color3.Black();
  mt.zOffset = -2;
  for (const e of ESTRADAS) {
    const pts: Vector3[] = []; for (let i = 0; i < e.length - 1; i++) for (let t = 0; t < 1; t += 0.08) pts.push(new Vector3(e[i][0] + (e[i + 1][0] - e[i][0]) * t, 0, e[i][1] + (e[i + 1][1] - e[i][1]) * t));
    const L: Vector3[] = [], R: Vector3[] = [];
    pts.forEach((p, i) => { const q = pts[Math.min(pts.length - 1, i + 1)], o = pts[Math.max(0, i - 1)]; const d = q.subtract(o).normalize(); const n = new Vector3(-d.z, 0, d.x).scale(3.2);
      for (const [arr, s] of [[L, 1], [R, -1]] as [Vector3[], number][]) { const v = p.add(n.scale(s)); v.y = altura(v.x, v.z) + 0.06; arr.push(v); } });
    const fita = MeshBuilder.CreateRibbon('estrada', { pathArray: [R, L] }, scene); { const uvs = fita.getVerticesData('uv')!; let len = 0; for (let i = 1; i < L.length; i++) len += Vector3.Distance(L[i], L[i - 1]); for (let i = 0; i < uvs.length; i += 2) uvs[i] *= len / 7; fita.setVerticesData('uv', uvs); } fita.material = mt; fita.receiveShadows = true; fita.freezeWorldMatrix();
  }
  // praça de terra batida
  const pr = MeshBuilder.CreateDisc('praca', { radius: 23, tessellation: 64 }, scene); pr.rotation.x = Math.PI / 2; pr.position.y = 0.04;
  const mp = new StandardMaterial('m_praca', scene); mp.diffuseTexture = textura(scene, 'terra', 256, terra, 7); mp.specularColor = Color3.Black(); mp.zOffset = -1; pr.material = mp; pr.receiveShadows = true; pr.freezeWorldMatrix();
  return chao;
}
