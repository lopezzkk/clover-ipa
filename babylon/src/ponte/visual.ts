// Melhorias visuais aplicadas por cima do jogo (não mudam a lógica, só a aparência).
// 1) chão com textura de detalhe; 2) grama de verdade em volta do jogador (cor do chão embaixo dela,
//    fora de estradas, água e construções); 3) brilho de materiais.
import { Scene } from '@babylonjs/core/scene';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

let detalhe: Texture | null = null;
function texDetalhe(s: Scene) {
  if (detalhe) return detalhe;
  const t = new DynamicTexture('detalheChao', { width: 256, height: 256 }, s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
  c.fillStyle = '#e8e8e8'; c.fillRect(0, 0, 256, 256);
  let sd = 9; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  for (let i = 0; i < 9000; i++) { const v = 170 + r() * 85 | 0; c.fillStyle = `rgba(${v},${v},${v},.35)`; const z = 1 + r() * 2; c.fillRect(r() * 256, r() * 256, z, z); }
  for (let i = 0; i < 900; i++) { const x = r() * 256, y = r() * 256; c.strokeStyle = `rgba(${120 + r() * 60 | 0},${130 + r() * 60 | 0},${110 + r() * 50 | 0},.35)`; c.beginPath(); c.moveTo(x, y); c.lineTo(x + (r() - .5) * 3, y - 2 - r() * 4); c.stroke(); }
  t.update(true); t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; detalhe = t; return t;
}

export function ajustarCena(s: Scene) { s.ambientColor = new Color3(0.22, 0.22, 0.24); }

/** chamado uma vez por material novo */
export function melhorarMaterial(s: Scene, m: StandardMaterial, src: T3, obj: T3) {
  if (src.type === 'MeshToonMaterial' || src.type === 'MeshLambertMaterial') { m.specularColor = new Color3(0.07, 0.07, 0.07); m.specularPower = 24; }
  const chao = jogo('ground');
  if (chao && obj === chao && !src.map) {
    const t = texDetalhe(s); const p = chao.geometry.parameters || { width: 1200, height: 1100 };
    t.uScale = p.width / 4; t.vScale = p.height / 4; m.diffuseTexture = t; m.metadata = Object.assign(m.metadata || {}, { chao: true });
  }
}

// ---------- grama em volta do jogador ----------
export class Grama {
  private m: Mesh | null = null; private cel = ''; private cores: Float32Array | null = null; private grade: { cols: number; rows: number; x0: number; z0: number; dx: number; dz: number } | null = null;
  constructor(private s: Scene) {}
  private malha() {
    const m = new Mesh('grama', this.s); const P: number[] = [], C: number[] = [], I: number[] = [], N: number[] = [];
    for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2 + 0.4, ox = Math.cos(a) * 0.1, oz = Math.sin(a) * 0.1, h = 0.38 + (k % 3) * 0.1, dx = Math.cos(a + 1.6) * 0.045, dz = Math.sin(a + 1.6) * 0.045, b = P.length / 3;
      P.push(ox - dx, 0, oz - dz, ox + dx, 0, oz + dz, ox * 2, h, oz * 2); C.push(0.55, 0.55, 0.55, 1, 0.55, 0.55, 0.55, 1, 1.15, 1.15, 1.05, 1); N.push(0, 1, 0, 0, 1, 0, 0, 1, 0); I.push(b, b + 1, b + 2, b + 2, b + 1, b); }
    m.setVerticesData(VertexBuffer.PositionKind, P); m.setVerticesData(VertexBuffer.ColorKind, C); m.setVerticesData(VertexBuffer.NormalKind, N); m.setIndices(I);
    const mat = new StandardMaterial('m_grama', this.s); mat.specularColor = Color3.Black(); mat.backFaceCulling = false; m.material = mat;
    m.isPickable = false; m.receiveShadows = true; m.alwaysSelectAsActiveMesh = true; return m;
  }
  private lerChao() {
    const g = jogo('ground'); if (!g || !g.geometry.attributes.color) return false;
    const p = g.geometry.parameters; this.cores = g.geometry.attributes.color.array;
    this.grade = { cols: p.widthSegments + 1, rows: p.heightSegments + 1, x0: g.position.x - p.width / 2, z0: g.position.z - p.height / 2, dx: p.width / p.widthSegments, dz: p.height / p.heightSegments };
    return true;
  }
  /** cor do chão em (x,z), ou null fora do mapa */
  private corChao(x: number, z: number): [number, number, number] | null {
    const G = this.grade!; const i = Math.round((x - G.x0) / G.dx), j = Math.round((z - G.z0) / G.dz); if (i < 0 || j < 0 || i >= G.cols || j >= G.rows) return null;
    const k = (j * G.cols + i) * 3, a = this.cores!; return [a[k], a[k + 1], a[k + 2]];
  }
  atualizar(raio: number, densidade: number) {
    const P = jogo('P'); if (!P || raio <= 0) { if (this.m) this.m.setEnabled(false); return; }
    if (!this.grade && !this.lerChao()) return;
    const CEL = 14; const cx = Math.floor(P.x / CEL), cz = Math.floor(P.z / CEL); const chave = cx + ',' + cz + ',' + raio + ',' + densidade;
    if (chave === this.cel) return; this.cel = chave;
    if (!this.m) this.m = this.malha(); this.m.setEnabled(true);
    const SOL: any[] = jogo('SOL') || []; const agua = jogo('inWater83'); const nr = jogo('nearRoad');
    const solidos = SOL.filter(o => Math.abs(o.x - P.x) < raio + 30 && Math.abs(o.z - P.z) < raio + 30);
    const R = Math.ceil(raio / CEL); const mats: number[] = [], cols: number[] = [];
    for (let i = -R; i <= R; i++) for (let j = -R; j <= R; j++) {
      const bx = (cx + i) * CEL, bz = (cz + j) * CEL; if (Math.hypot(bx + CEL / 2 - P.x, bz + CEL / 2 - P.z) > raio) continue;
      let sd = ((cx + i) * 73856093) ^ ((cz + j) * 19349663); const r = () => { sd = (sd * 1103515245 + 12345) & 0x7fffffff; return sd / 0x7fffffff; };
      for (let n = 0; n < densidade; n++) {
        const x = bx + r() * CEL, z = bz + r() * CEL; const c = this.corChao(x, z); const rr = r(), rot = r(), e = 0.7 + r() * 0.9;
        if (!c || !(c[1] > c[0] * 1.05 && c[1] > c[2] * 1.15)) continue; // só onde o chão é verde
        if (agua && agua(x, z)) continue; if (nr && nr(x, z, 2.2)) continue;
        if (solidos.some(o => o.r ? Math.hypot(x - o.x, z - o.z) < o.r + 0.3 : Math.abs(x - o.x) < o.hx + 0.3 && Math.abs(z - o.z) < o.hz + 0.3)) continue;
        const M = Matrix.Compose(new Vector3(e, e * (0.8 + rr * 0.6), e), Quaternion.RotationYawPitchRoll(rot * 6.28, 0, 0), new Vector3(x, 0.01, z));
        for (let q = 0; q < 16; q++) mats.push(M.m[q]); cols.push(c[0] * 1.05, c[1] * 1.08, c[2], 1);
      }
    }
    this.m.thinInstanceSetBuffer('matrix', new Float32Array(mats), 16, true);
    this.m.thinInstanceSetBuffer('color', new Float32Array(cols), 4, true);
    this.m.thinInstanceRefreshBoundingInfo(false);
  }
  get total() { return this.m ? this.m.thinInstanceCount : 0; }
}
