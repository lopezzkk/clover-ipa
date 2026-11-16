// Vegetação: árvores com copas irregulares (cores por vértice), pinheiros, arbustos, grama e flores.
// Árvores usam instâncias; grama e flores usam "thin instances" (milhares de cópias em 1 desenho).
import { Color4, Mesh, MeshBuilder, Scene, StandardMaterial, Color3, Matrix, Quaternion, Vector3, VertexBuffer, Material } from '@babylonjs/core';
import type { Mats } from './construcoes';

function pintar(m: Mesh, base: Color3, varia: number, seed: number) {
  const pos = m.getVerticesData(VertexBuffer.PositionKind)!; const cols: number[] = [];
  let s = seed; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < pos.length; i += 3) { const y = pos[i + 1]; const k = 0.75 + 0.35 * r() + y * 0.04; cols.push(base.r * k * (1 + (r() - 0.5) * varia), base.g * k, base.b * k * (1 + (r() - 0.5) * varia), 1); }
  m.setVerticesData(VertexBuffer.ColorKind, cols);
}
function deformar(m: Mesh, amp: number, seed: number) {
  const pos = m.getVerticesData(VertexBuffer.PositionKind)!;
  for (let i = 0; i < pos.length; i += 3) { const x = pos[i], y = pos[i + 1], z = pos[i + 2]; const n = Math.sin(x * 3.1 + seed) * Math.cos(y * 2.7 + seed * 2) * Math.sin(z * 3.3 + seed * 3); const f = 1 + n * amp; pos[i] *= f; pos[i + 1] *= f; pos[i + 2] *= f; }
  m.updateVerticesData(VertexBuffer.PositionKind, pos); m.createNormals(true);
}
function juntar(nome: string, partes: [Mesh, Material][]): Mesh[] {
  const g = new Map<Material, Mesh[]>(); for (const [m, mat] of partes) { if (!g.has(mat)) g.set(mat, []); g.get(mat)!.push(m); }
  const out: Mesh[] = []; for (const [mat, ms] of g) { const j = Mesh.MergeMeshes(ms, true, true)!; j.name = nome; j.material = mat; j.isVisible = false; j.receiveShadows = true; out.push(j); } return out;
}

export function prototipoArvore(s: Scene, M: Mats, tipo: number, det: number): Mesh[] {
  const P: [Mesh, Material][] = [];
  const tr = MeshBuilder.CreateCylinder('tronco', { diameterTop: 0.35, diameterBottom: 0.75, height: 4.4, tessellation: 8 }, s); tr.position.y = 2.2; P.push([tr, M.casca]);
  for (const a of [0.6, 2.4, 4.3]) { const g = MeshBuilder.CreateCylinder('galho', { diameterTop: 0.08, diameterBottom: 0.22, height: 2.2, tessellation: 5 }, s); g.position.set(Math.cos(a) * 0.6, 3.6, Math.sin(a) * 0.6); g.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); P.push([g, M.casca]); }
  const verdes = [new Color3(0.32, 0.55, 0.2), new Color3(0.42, 0.6, 0.22), new Color3(0.55, 0.62, 0.2), new Color3(0.3, 0.48, 0.24)];
  const n = 4 + tipo % 3;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2 + tipo, rr = i === 0 ? 0 : 1.4;
    const c = MeshBuilder.CreateIcoSphere('copa', { radius: 1.8 + (i === 0 ? 0.8 : 0), subdivisions: det + 1, flat: false }, s);
    deformar(c, 0.22, i * 3 + tipo); c.position.set(Math.cos(a) * rr, 5.6 + (i === 0 ? 0.9 : (i % 2) * 0.6), Math.sin(a) * rr); c.scaling.y = 0.82;
    c.bakeCurrentTransformIntoVertices(); pintar(c, verdes[(tipo + i) % 4], 0.25, 7 + i + tipo * 13); P.push([c, M.folha]);
  }
  return juntar('arvore' + tipo, P);
}
export function prototipoPinheiro(s: Scene, M: Mats): Mesh[] {
  const P: [Mesh, Material][] = [];
  const tr = MeshBuilder.CreateCylinder('tronco', { diameterTop: 0.25, diameterBottom: 0.6, height: 3, tessellation: 7 }, s); tr.position.y = 1.5; P.push([tr, M.casca]);
  for (let i = 0; i < 4; i++) { const c = MeshBuilder.CreateCylinder('cone', { diameterTop: 0, diameterBottom: 4.2 - i * 0.85, height: 3 - i * 0.3, tessellation: 9 }, s); c.position.y = 2.6 + i * 1.7; deformar(c, 0.08, i); c.bakeCurrentTransformIntoVertices(); pintar(c, new Color3(0.18, 0.38, 0.22), 0.2, 99 + i); P.push([c, M.folha]); }
  return juntar('pinheiro', P);
}
export function prototipoArbusto(s: Scene, M: Mats, k: number): Mesh[] {
  const P: [Mesh, Material][] = [];
  for (let i = 0; i < 3; i++) { const c = MeshBuilder.CreateIcoSphere('arb', { radius: 0.7 + i * 0.15, subdivisions: 2, flat: false }, s); deformar(c, 0.2, i + k); c.position.set((i - 1) * 0.7, 0.55, (i % 2) * 0.4); c.bakeCurrentTransformIntoVertices(); pintar(c, new Color3(0.3, 0.52, 0.22), 0.3, 5 + i + k); P.push([c, M.folha]); }
  return juntar('arbusto' + k, P);
}

/** grama e flores: um mesh pequeno repetido milhares de vezes num único desenho */
export function espalhar(s: Scene, qtd: number, tipo: 'grama' | 'flor', onde: (r: () => number) => [number, number, number] | null, seed: number) {
  if (qtd <= 0) return null;
  let m: Mesh;
  if (tipo === 'grama') {
    m = new Mesh('grama', s); const P: number[] = [], C: number[] = [], I: number[] = [];
    for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + 0.3, ox = Math.cos(a) * 0.12, oz = Math.sin(a) * 0.12, h = 0.45 + (k % 3) * 0.12, dx = Math.cos(a + 1.6) * 0.05, dz = Math.sin(a + 1.6) * 0.05, b = P.length / 3;
      P.push(ox - dx, 0, oz - dz, ox + dx, 0, oz + dz, ox * 1.8, h, oz * 1.8); C.push(0.22, 0.4, 0.12, 1, 0.22, 0.4, 0.12, 1, 0.55, 0.78, 0.3, 1); I.push(b, b + 1, b + 2, b + 2, b + 1, b); }
    m.setVerticesData(VertexBuffer.PositionKind, P); m.setVerticesData(VertexBuffer.ColorKind, C); m.setIndices(I); m.setVerticesData(VertexBuffer.NormalKind, P.map((_, i) => i % 3 === 1 ? 1 : 0));
    const mat = new StandardMaterial('m_grama', s); mat.specularColor = Color3.Black(); mat.backFaceCulling = false; m.material = mat;
  } else {
    m = MeshBuilder.CreateIcoSphere('flor', { radius: 0.12, subdivisions: 1 }, s);
    const mat = new StandardMaterial('m_flor', s); mat.specularColor = Color3.Black(); m.material = mat;
  }
  let sd = seed; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  const mats = new Float32Array(qtd * 16); const cores = tipo === 'flor' ? new Float32Array(qtd * 4) : null; let n = 0;
  const pal = [[1, 0.85, 0.3], [0.95, 0.4, 0.5], [0.75, 0.55, 1], [1, 1, 1], [1, 0.6, 0.25]];
  for (let t = 0; t < qtd * 3 && n < qtd; t++) { const p = onde(r); if (!p) continue;
    const e = tipo === 'grama' ? 0.7 + r() * 0.9 : 0.8 + r() * 0.7;
    Matrix.Compose(new Vector3(e, e * (0.8 + r() * 0.5), e), Quaternion.RotationYawPitchRoll(r() * 6.28, 0, 0), new Vector3(p[0], p[1] + (tipo === 'flor' ? 0.25 : 0), p[2])).copyToArray(mats, n * 16);
    if (cores) { const c = pal[Math.floor(r() * pal.length)]; cores.set([c[0], c[1], c[2], 1], n * 4); }
    n++; }
  m.thinInstanceSetBuffer('matrix', mats.subarray(0, n * 16), 16, true);
  if (cores) m.thinInstanceSetBuffer('color', cores.subarray(0, n * 4), 4, true);
  m.thinInstanceRefreshBoundingInfo(false);
  m.isPickable = false; m.alwaysSelectAsActiveMesh = false; m.receiveShadows = true; m.freezeWorldMatrix();
  return m;
}
export { Color4 };
