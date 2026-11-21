// MAPA NOVO (Babylon nativo): os mesmos reinos, nos mesmos lugares, num mundo bem mais bonito.
// - Relevo de verdade: colinas e montanhas nos campos vazios entre os reinos, cordilheira na fronteira de Spade (com passagens
//   onde passam as estradas), vulcão Yultim com cratera de lava e uma serra em volta do mundo inteiro.
// - Tudo onde se anda (vilas, estradas, portas, moradores, missões, lojas) continua plano e no mesmo lugar: os sistemas não mudam.
// - Florestas novas (pinheiros, árvores de copa redonda, árvores escuras das bruxas e árvores secas) e pedras, desenhadas por setores.
// - Montanhas e troncos têm colisão (entram no mesmo sistema de colisão do jogo).
// Otimização: terreno e florestas divididos em setores de 160 m; cada setor de floresta só é desenhado perto do jogador
// (alcance de cada nível gráfico) e só os setores próximos fazem sombra.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Vector3, Quaternion } from '@babylonjs/core/Maths/math.vector';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
import { CreateDisc } from '@babylonjs/core/Meshes/Builders/discBuilder';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { VentoPlugin } from './natureza';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

// ---------- ruído (determinístico: o mapa é sempre o mesmo) ----------
function hash(x: number, z: number) { let h = (x * 374761393 + z * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function ruido(x: number, z: number) {
  const xi = Math.floor(x), zi = Math.floor(z), fx = x - xi, fz = z - zi; const u = fx * fx * (3 - 2 * fx), v = fz * fz * (3 - 2 * fz);
  const a = hash(xi, zi), b = hash(xi + 1, zi), c = hash(xi, zi + 1), d = hash(xi + 1, zi + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, z: number, o = 4) { let s = 0, a = 0.5, f = 1, t = 0; for (let i = 0; i < o; i++) { s += ruido(x * f, z * f) * a; t += a; a *= 0.5; f *= 2.03; } return s / t; }
function cume(x: number, z: number) { let s = 0, a = 0.5, f = 1, t = 0; for (let i = 0; i < 4; i++) { const n = 1 - Math.abs(ruido(x * f, z * f) * 2 - 1); s += n * n * a; t += a; a *= 0.5; f *= 2.1; } return s / t; }
const passo = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

const C = 4; // tamanho da célula do terreno (m)
const SET = 160; // tamanho do setor (m)

interface Setor { x: number; z: number; terreno: Mesh; arvores: Mesh[]; sombra: boolean; }

export class Mundo {
  pronto = false; private s: Scene; private X0 = 0; private Z0 = 0; private nx = 0; private nz = 0; private H!: Float32Array; private D!: Float32Array;
  private setores: Setor[] = []; private col: Record<string, { x: number; z: number; r: number }[]> = {}; private mats: StandardMaterial[] = [];
  private lava: Mesh | null = null; private t = 0; private q = 0; arvoresTotal = 0; colisores = 0; private nS = 1; private ok: [number, number] | null = null; private ult: [number, number] | null = null; private chao3: T3 = null;
  constructor(s: Scene, private sombraAdd: (m: AbstractMesh) => void, private sombraRem: (m: AbstractMesh) => void, private texChao: () => Texture) { this.s = s; }

  /** altura do terreno (0 em tudo onde se anda) */
  altura(x: number, z: number) {
    if (!this.pronto) return 0; const fx = (x - this.X0) / C, fz = (z - this.Z0) / C; const i = Math.floor(fx), j = Math.floor(fz);
    if (i < 0 || j < 0 || i >= this.nx - 1 || j >= this.nz - 1) return 0; /* fora do mapa (interiores, arenas): plano */ const u = fx - i, v = fz - j, H = this.H, n = this.nx;
    return (H[j * n + i] * (1 - u) + H[j * n + i + 1] * u) * (1 - v) + (H[(j + 1) * n + i] * (1 - u) + H[(j + 1) * n + i + 1] * u) * v;
  }
  /** o jogo usa: objetos do cenário novo que esse objeto do three deve esconder (o chão antigo) */
  esconder(o: T3) { return this.pronto && o === this.chao3; }

  /** monta o mundo novo (uma vez, quando o mapa do jogo já existe) */
  tentarMontar() {
    if (this.pronto) return false;
    const WB = jogo('WB83'), REG = jogo('REG83'), SOL = jogo('SOL'), ROADS = jogo('ROADS'), inW = jogo('inWater83'), P = jogo('P');
    if (!WB || !REG || !SOL || !ROADS || !inW || !P || !P.on || SOL.length < 50) return false;
    if (WB.x1 - WB.x0 < 300 || WB.z1 - WB.z0 < 300) return false; // dentro de um interior o jogo troca os limites: espera sair
    const t0 = performance.now();
    const M = 170; this.X0 = Math.floor((WB.x0 - M) / C) * C; this.Z0 = Math.floor((WB.z0 - M) / C) * C;
    const X1 = WB.x1 + M, Z1 = WB.z1 + M; const nx = this.nx = Math.ceil((X1 - this.X0) / C) + 1, nz = this.nz = Math.ceil((Z1 - this.Z0) / C) + 1;
    // 1) onde se anda: tudo que o jogo colocou vira "ocupado" (fica plano)
    const OC = new Uint8Array(nx * nz); const AG = new Uint8Array(nx * nz);
    const marcarC = (x: number, z: number, r: number) => { const i0 = Math.max(0, Math.floor((x - r - this.X0) / C)), i1 = Math.min(nx - 1, Math.ceil((x + r - this.X0) / C)), j0 = Math.max(0, Math.floor((z - r - this.Z0) / C)), j1 = Math.min(nz - 1, Math.ceil((z + r - this.Z0) / C));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const px = this.X0 + i * C, pz = this.Z0 + j * C; if ((px - x) ** 2 + (pz - z) ** 2 <= r * r) OC[j * nx + i] = 1; } };
    const marcarB = (x: number, z: number, hx: number, hz: number) => { const i0 = Math.max(0, Math.floor((x - hx - this.X0) / C)), i1 = Math.min(nx - 1, Math.ceil((x + hx - this.X0) / C)), j0 = Math.max(0, Math.floor((z - hz - this.Z0) / C)), j1 = Math.min(nz - 1, Math.ceil((z + hz - this.Z0) / C));
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) OC[j * nx + i] = 1; };
    for (const o of SOL) { if (o.r) marcarC(o.x, o.z, o.r + 5); else marcarB(o.x, o.z, (o.hx || 1) + 5, (o.hz || 1) + 5); }
    for (const r of ROADS) { const [x1, z1, x2, z2] = r; const L = Math.hypot(x2 - x1, z2 - z1); const n = Math.max(1, Math.ceil(L / 3)); for (let k = 0; k <= n; k++) marcarC(x1 + (x2 - x1) * k / n, z1 + (z2 - z1) * k / n, 8); }
    for (const n of jogo('NPCS') || []) if (n && n.g) marcarC(n.g.position.x, n.g.position.z, 7);
    for (const d of jogo('TODAS86') || jogo('DOORS86') || []) marcarC(d.x, d.z, 6);
    for (const r of REG) if (r.r <= 160) marcarC(r.x, r.z, Math.min(70, r.r * (r.id === 'bruxas' ? 0.3 : 0.55)));
    marcarC(0, 0, 45);
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = this.X0 + i * C, z = this.Z0 + j * C; if (x >= WB.x0 - 4 && x <= WB.x1 + 4 && z >= WB.z0 - 4 && z <= WB.z1 + 4 && inW(x, z)) { AG[j * nx + i] = 1; OC[j * nx + i] = 1; } }
    // 2) distância até o ocupado (transformada de distância em 2 passadas)
    const D = this.D = new Float32Array(nx * nz); const INF = 1e6; for (let k = 0; k < D.length; k++) D[k] = OC[k] ? 0 : INF; const d1 = C, d2 = C * Math.SQRT2;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const k = j * nx + i; let v = D[k]; if (i > 0) v = Math.min(v, D[k - 1] + d1); if (j > 0) { v = Math.min(v, D[k - nx] + d1); if (i > 0) v = Math.min(v, D[k - nx - 1] + d2); if (i < nx - 1) v = Math.min(v, D[k - nx + 1] + d2); } D[k] = v; }
    for (let j = nz - 1; j >= 0; j--) for (let i = nx - 1; i >= 0; i--) { const k = j * nx + i; let v = D[k]; if (i < nx - 1) v = Math.min(v, D[k + 1] + d1); if (j < nz - 1) { v = Math.min(v, D[k + nx] + d1); if (i < nx - 1) v = Math.min(v, D[k + nx + 1] + d2); if (i > 0) v = Math.min(v, D[k + nx - 1] + d2); } D[k] = v; }
    // 3) altura
    const H = this.H = new Float32Array(nx * nz);
    const yu = REG.find((r: T3) => r.id === 'yultim'), cap = REG.find((r: T3) => r.id === 'capital'), sp = REG.find((r: T3) => r.id === 'spade');
    const zCord = cap && sp ? (cap.z - cap.r + sp.z + sp.r * 0.55) / 2 : -490;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
      const k = j * nx + i, x = this.X0 + i * C, z = this.Z0 + j * C; if (AG[k]) { H[k] = -1.6; continue; }
      const d = D[k]; const fora = Math.max(WB.x0 - x, x - WB.x1, WB.z0 - z, z - WB.z1, 0);
      const b = fbm(x * 0.0065 + 11, z * 0.0065 - 7), rg = cume(x * 0.009, z * 0.009);
      let f = passo(20, 70, d) * passo(0.3, 0.6, b + 0.1); // colinas só nos campos vazios
      let amp = 7 + 24 * rg;
      const cord = Math.exp(-(((z - zCord) / 26) ** 2)); if (cord > 0.02) { f = Math.max(f, cord * passo(9, 26, d)); amp = Math.max(amp, 30 + 26 * rg * cord); } // cordilheira de Spade
      if (fora > 0) { const e = passo(0, 90, fora); f = Math.max(f, e * passo(4, 20, d + fora)); amp += 55 * e * (0.6 + rg * 0.6); } // serra em volta do mundo
      let h = f * amp * (0.75 + 0.5 * fbm(x * 0.03, z * 0.03, 3));
      if (yu) { const r = Math.hypot(x - yu.x, z - yu.z); const cone = Math.max(0, 1 - r / (yu.r * 0.95)); if (cone > 0) { const v = passo(8, 22, d) * (Math.pow(cone, 1.4) * 48 - Math.max(0, 1 - r / 13) * 22); h = Math.max(h, v); } }
      H[k] = Math.max(0, h);
    }
    // costa: o fundo vai descendo perto da água
    for (let j = 1; j < nz - 1; j++) for (let i = 1; i < nx - 1; i++) { const k = j * nx + i; if (!AG[k] && (AG[k - 1] || AG[k + 1] || AG[k - nx] || AG[k + nx])) H[k] = Math.min(H[k], -0.25); }
    // 4) malha do terreno por setores, com cores por região, pedra nas encostas, neve no alto, areia na água
    const mt = new StandardMaterial('terreno', this.s); mt.specularColor = new Color3(0.04, 0.04, 0.04); const tx = this.texChao(); tx.uScale = 1; tx.vScale = 1; mt.diffuseTexture = tx; mt.metadata = { chao: true }; this.mats.push(mt);
    const regC = REG.map((r: T3) => ({ x: r.x, z: r.z, r: r.r, c: Color3.FromHexString('#' + r.c.toString(16).padStart(6, '0')) }));
    const corEm = (i: number, j: number, out: number[]) => {
      const k = j * nx + i, x = this.X0 + i * C, z = this.Z0 + j * C, h = H[k];
      let c = new Color3(0.42, 0.56, 0.29); for (const r of regC) { const d = Math.hypot(x - r.x, z - r.z) / (r.r * 1.25); if (d < 1) c = Color3.Lerp(c, r.c, Math.min(1, (1 - d) * 1.6) * 0.7); }
      const n = fbm(x * 0.05, z * 0.05, 3) - 0.5; c = c.scale(1 + n * 0.22);
      const hx = H[j * nx + Math.min(nx - 1, i + 1)] - H[j * nx + Math.max(0, i - 1)], hz = H[Math.min(nz - 1, j + 1) * nx + i] - H[Math.max(0, j - 1) * nx + i]; const inc = Math.hypot(hx, hz) / (2 * C);
      const pedra = new Color3(0.42, 0.39, 0.35).scale(0.9 + n * 0.4); c = Color3.Lerp(c, pedra, passo(0.35, 0.8, inc) * passo(1.5, 6, h));
      if (yu) { const r = Math.hypot(x - yu.x, z - yu.z); if (r < yu.r) c = Color3.Lerp(c, new Color3(0.22, 0.18, 0.17), passo(yu.r, yu.r * 0.4, r)); }
      c = Color3.Lerp(c, new Color3(0.93, 0.94, 0.97), passo(30, 40, h + n * 6));
      if (h < 0) c = Color3.Lerp(new Color3(0.78, 0.7, 0.5), new Color3(0.36, 0.32, 0.25), passo(-0.2, -1.6, h));
      out.push(c.r, c.g, c.b, 1);
    };
    const n1 = SET / C; this.nS = Math.ceil((nx - 1) / n1);
    for (let sj = 0; sj * n1 < nz - 1; sj++) for (let si = 0; si * n1 < nx - 1; si++) {
      const i0 = si * n1, j0 = sj * n1, i1 = Math.min(nx - 1, i0 + n1), j1 = Math.min(nz - 1, j0 + n1); const w = i1 - i0 + 1;
      const Pp: number[] = [], Cc: number[] = [], U: number[] = [], I: number[] = [];
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const x = this.X0 + i * C, z = this.Z0 + j * C; Pp.push(x, H[j * nx + i], z); U.push(x / 4, z / 4); corEm(i, j, Cc); }
      for (let j = 0; j < j1 - j0; j++) for (let i = 0; i < i1 - i0; i++) { const a = j * w + i, b2 = a + 1, c2 = a + w, d2 = c2 + 1; I.push(a, c2, b2, b2, c2, d2); }
      const No: number[] = []; VertexData.ComputeNormals(Pp, I, No);
      const m = new Mesh('terreno_' + si + '_' + sj, this.s); const vd = new VertexData(); vd.positions = Pp; vd.indices = I; vd.normals = No; vd.colors = Cc; vd.uvs = U; vd.applyToMesh(m);
      m.material = mt; m.receiveShadows = true; m.isPickable = false; m.freezeWorldMatrix(); m.doNotSyncBoundingInfo = true;
      this.setores.push({ x: this.X0 + (i0 + i1) / 2 * C, z: this.Z0 + (j0 + j1) / 2 * C, terreno: m, arvores: [], sombra: false });
    }
    // checa a orientação das faces (mão direita): se a normal sair para baixo, inverte
    { const m = this.setores[0].terreno; const nn = m.getVerticesData('normal')!; let s = 0; for (let k = 1; k < nn.length; k += 3) s += nn[k]; if (s < 0) for (const st of this.setores) { const ii = st.terreno.getIndices()!; for (let k = 0; k < ii.length; k += 3) { const t = ii[k + 1]; ii[k + 1] = ii[k + 2]; ii[k + 2] = t; } st.terreno.setIndices(ii); const p2 = st.terreno.getVerticesData('position')!; const n2: number[] = []; VertexData.ComputeNormals(p2, ii, n2); st.terreno.setVerticesData('normal', n2); } }
    // 5) lava na cratera do vulcão
    if (yu) { const lm = new StandardMaterial('lava', this.s); lm.disableLighting = true; lm.emissiveColor = new Color3(1, 0.38, 0.08); lm.metadata = { brilha: true, corBasica: new Color3(1, 0.4, 0.1) };
      const l = CreateDisc('lava', { radius: 11, tessellation: 36 }, this.s); l.rotation.x = Math.PI / 2; l.position.set(yu.x, this.altura(yu.x, yu.z) + 0.6, yu.z); l.material = lm; l.isPickable = false; this.lava = l; this.mats.push(lm); }
    // 6) florestas e pedras
    this.florestas(REG, inW);
    // 7) colisão das montanhas (células altas) — entra no mesmo sistema de colisão do jogo
    for (let j = 0; j < nz; j += 2) for (let i = 0; i < nx; i += 2) { const k = j * nx + i; if (H[k] > 0.9) this.colisor(this.X0 + i * C, this.Z0 + j * C, C * 1.5); }
    this.ligarColisao();
    this.chao3 = jogo('ground');
    this.relevoMinimapa();
    this.pronto = true; (window as any).MUNDO_NOVO = { ms: Math.round(performance.now() - t0), setores: this.setores.length, arvores: this.arvoresTotal, colisores: this.colisores };
    return true;
  }

  /** desenho do relevo para o minimapa do jogo (morros em marrom, neve em branco, lava em vermelho; o plano fica transparente) */
  private relevoMinimapa() {
    const cv = document.createElement('canvas'); cv.width = this.nx; cv.height = this.nz; const c = cv.getContext('2d')!; const img = c.createImageData(this.nx, this.nz);
    for (let j = 0; j < this.nz; j++) for (let i = 0; i < this.nx; i++) { const h = this.H[j * this.nx + i], k = (j * this.nx + i) * 4; if (h < 0.5) continue;
      const t = Math.min(1, h / 40); let r = 120 - t * 40, g = 104 - t * 30, b = 78 - t * 20; if (h > 30) { r = g = b = 225; }
      img.data[k] = r; img.data[k + 1] = g; img.data[k + 2] = b; img.data[k + 3] = 90 + Math.min(150, h * 8); }
    c.putImageData(img, 0, 0); (window as any).MUNDO_RELEVO = { c: cv, x0: this.X0, z0: this.Z0, w: this.nx * C, h: this.nz * C };
  }
  private colisor(x: number, z: number, r: number) { const k = Math.floor(x / 20) + ',' + Math.floor(z / 20); (this.col[k] || (this.col[k] = [])).push({ x, z, r }); this.colisores++;
    // círculos que passam da borda da célula também entram na vizinha
    const fx = x / 20 - Math.floor(x / 20), fz = z / 20 - Math.floor(z / 20); const ex = fx * 20 < r ? -1 : (1 - fx) * 20 < r ? 1 : 0, ez = fz * 20 < r ? -1 : (1 - fz) * 20 < r ? 1 : 0;
    if (ex) (this.col[(Math.floor(x / 20) + ex) + ',' + Math.floor(z / 20)] ||= []).push({ x, z, r }); if (ez) (this.col[Math.floor(x / 20) + ',' + (Math.floor(z / 20) + ez)] ||= []).push({ x, z, r }); }
  private ligarColisao() {
    const w = window as any; const orig = w.solNear; if (typeof orig !== 'function' || orig.__mundo) return; const self = this;
    const nova = function (x: number, z: number) { const a = orig(x, z); const m = self.col[Math.floor(x / 20) + ',' + Math.floor(z / 20)]; return m ? (a && a.length ? a.concat(m) : m) : a; };
    (nova as any).__mundo = 1; w.solNear = nova;
  }

  private florestas(REG: T3[], inW: (x: number, z: number) => boolean) {
    const s = this.s; const nx = this.nx, H = this.H, D = this.D;
    const mt = new StandardMaterial('arvores', s); mt.specularColor = new Color3(0.03, 0.03, 0.03); this.mats.push(mt); new VentoPlugin(mt, false);
    const juntar = (partes: [Mesh, Color3][]) => { for (const [m, c] of partes) { const n = m.getTotalVertices(); const cc: number[] = []; for (let i = 0; i < n; i++) cc.push(c.r, c.g, c.b, 1); m.setVerticesData('color', cc); m.bakeCurrentTransformIntoVertices(); } const r = Mesh.MergeMeshes(partes.map(p => p[0]), true, true)!; r.material = mt; r.isVisible = false; r.setEnabled(false); return r; };
    const tronco = (h: number, r: number, cor = new Color3(0.36, 0.25, 0.16)) => { const t = CreateCylinder('t', { height: h, diameterTop: r * 0.7, diameterBottom: r, tessellation: 7 }, s); t.position.y = h / 2; return [t, cor] as [Mesh, Color3]; };
    const cone = (y: number, h: number, r: number, c: Color3) => { const k = CreateCylinder('c', { height: h, diameterTop: 0, diameterBottom: r * 2, tessellation: 9 }, s); k.position.y = y + h / 2; return [k, c] as [Mesh, Color3]; };
    const bola = (x: number, y: number, z: number, r: number, c: Color3) => { const b = CreateIcoSphere('b', { radius: r, subdivisions: 1, flat: true }, s); b.position.set(x, y, z); return [b, c] as [Mesh, Color3]; };
    const galho = (y: number, a: number, L: number) => { const g = CreateCylinder('g', { height: L, diameterTop: 0.05, diameterBottom: 0.16, tessellation: 5 }, s); g.position.set(Math.cos(a) * L * 0.35, y + L * 0.3, Math.sin(a) * L * 0.35); g.rotation.set(Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9); return [g, new Color3(0.3, 0.24, 0.19)] as [Mesh, Color3]; };
    const V = (r: number, g: number, b: number) => new Color3(r, g, b);
    const tipos: Record<string, Mesh> = {
      pinheiro: juntar([tronco(2.2, 0.45), cone(1.4, 3.2, 1.9, V(0.2, 0.42, 0.24)), cone(3.2, 2.8, 1.5, V(0.24, 0.48, 0.27)), cone(4.8, 2.4, 1.05, V(0.28, 0.54, 0.3))]),
      redonda: juntar([tronco(2.6, 0.5), bola(0, 3.6, 0, 1.9, V(0.36, 0.58, 0.26)), bola(1.1, 3.1, 0.4, 1.3, V(0.4, 0.62, 0.28)), bola(-0.9, 3.3, -0.5, 1.35, V(0.33, 0.55, 0.24)), bola(0.2, 4.6, -0.2, 1.2, V(0.42, 0.65, 0.3))]),
      escura: juntar([tronco(2.6, 0.55, V(0.22, 0.18, 0.2)), cone(1.6, 3.6, 2.1, V(0.16, 0.24, 0.22)), cone(3.6, 3.0, 1.6, V(0.18, 0.27, 0.25)), cone(5.4, 2.4, 1.0, V(0.2, 0.3, 0.27))]),
      seca: juntar([tronco(3.4, 0.5, V(0.32, 0.26, 0.21)), galho(1.6, 0.3, 1.9), galho(2.1, 2.4, 1.7), galho(2.6, 4.3, 1.5), galho(3.0, 1.2, 1.2)]),
      florida: juntar([tronco(2.4, 0.45), bola(0, 3.3, 0, 1.8, V(0.93, 0.62, 0.72)), bola(0.9, 2.9, 0.4, 1.2, V(0.97, 0.7, 0.78)), bola(-0.8, 3.1, -0.4, 1.25, V(0.9, 0.56, 0.68))]),
      pedra: (() => { const p = CreateIcoSphere('p', { radius: 1, subdivisions: 1, flat: true }, s); p.scaling.set(1.3, 0.7, 1); p.position.y = 0.25; const r = juntar([[p, V(0.55, 0.53, 0.5)]]); return r; })(),
    };
    const reg = (x: number, z: number) => { let b: T3 = null, bd = 1e9; for (const r of REG) { const d = Math.hypot(x - r.x, z - r.z) / r.r; if (d < 1 && d < bd) { bd = d; b = r; } } return b ? b.id : ''; };
    const por = new Map<number, Record<string, number[]>>();
    const quat = new Quaternion(), mat = new Matrix(), sc = new Vector3(), pos = new Vector3();
    for (let j = 1; j < this.nz - 1; j++) for (let i = 1; i < nx - 1; i++) {
      const k = j * nx + i; const d = D[k], h = H[k]; if (d < 7 || h < -0.05 || h > 30) continue;
      const x = this.X0 + i * C + (hash(i, j) - 0.5) * C * 0.9, z = this.Z0 + j * C + (hash(j, i + 7) - 0.5) * C * 0.9;
      if (inW(x, z)) continue;
      const id = reg(x, z); const den = fbm(x * 0.012 + 40, z * 0.012 - 13, 3);
      let lim = id === 'bruxas' ? 0.36 : id === 'spade' || id === 'sombras' ? 0.55 : id === 'yultim' ? 0.9 : 0.5; if (h > 18) lim += 0.25; if (d < 14) lim += 0.15;
      const r = hash(i * 3 + 1, j * 5 + 2);
      let tipo = '';
      // campos onde se anda continuam abertos (a câmera não fica atrás de árvores): floresta cheia só longe dos caminhos ou nos morros
      const aberto = h <= 2.5 && d < 34; if (aberto && r > (d < 18 ? 0.03 : 0.08)) { if (r > 0.985) { /* uma pedra de vez em quando */ } else continue; }
      if (den > lim && r < 0.75) {
        if (id === 'bruxas') tipo = r < 0.65 ? 'escura' : 'seca'; else if (id === 'spade' || id === 'sombras') tipo = r < 0.5 ? 'seca' : 'escura'; else if (id === 'yultim') tipo = 'seca'; else if (id === 'heart') tipo = r < 0.3 ? 'florida' : 'redonda'; else if (id === 'hino') tipo = r < 0.5 ? 'florida' : 'pinheiro'; else tipo = h > 6 || r < 0.45 ? 'pinheiro' : 'redonda';
      } else if (r > 0.965 || (h > 4 && r > 0.88)) tipo = 'pedra';
      if (!tipo) continue;
      const y = this.altura(x, z) - 0.15; const e = tipo === 'pedra' ? 0.4 + hash(i, j * 3) * 1.2 : 0.75 + hash(i * 7, j) * 0.65;
      Quaternion.RotationYawPitchRollToRef(hash(i + 3, j) * 6.28, 0, 0, quat); sc.set(e, e * (tipo === 'pedra' ? 1 : 0.9 + hash(j, i) * 0.3), e); pos.set(x, y, z); Matrix.ComposeToRef(sc, quat, pos, mat);
      const si = Math.floor((x - this.X0) / SET), sj = Math.floor((z - this.Z0) / SET); const key = sj * 1000 + si; let o = por.get(key); if (!o) por.set(key, o = {});
      const arr = o[tipo] || (o[tipo] = []); for (let q = 0; q < 16; q++) arr.push(mat.m[q]);
      if (h < 0.8 && tipo !== 'pedra') this.colisor(x, z, 0.55 * e); else if (h < 0.8 && e > 0.9) this.colisor(x, z, 0.9 * e);
      this.arvoresTotal++;
    }
    const nS = this.nS;
    for (const [key, o] of por) {
      const si = key % 1000, sj = Math.floor(key / 1000); const st = this.setores[sj * nS + si] || this.setores.find(s2 => Math.floor((s2.x - this.X0) / SET) === si && Math.floor((s2.z - this.Z0) / SET) === sj); if (!st) continue;
      for (const tipo in o) { const src = tipos[tipo]; const m = src.clone('floresta_' + tipo + '_' + key, null, true, false)!; m.makeGeometryUnique(); m.isVisible = true; m.setEnabled(true); m.material = mt;
        m.thinInstanceSetBuffer('matrix', new Float32Array(o[tipo]), 16, true); m.thinInstanceRefreshBoundingInfo(false); m.receiveShadows = true; m.isPickable = false; m.alwaysSelectAsActiveMesh = false; m.freezeWorldMatrix(); st.arvores.push(m); }
    }
    for (const k in tipos) tipos[k].dispose();
  }

  /** a cada quadro: setores de floresta perto aparecem, longe somem; só os de perto fazem sombra; lava pulsando */
  atualizar(dt: number, nivel: string, cam: Vector3) {
    if (!this.pronto) { if (++this.q % 30 === 1) this.tentarMontar(); return; }
    this.t += dt; this.q++;
    const alc = ({ muitobaixo: 170, baixo: 240, medio: 340, alto: 460, ultra: 620 } as Record<string, number>)[nivel] || 340;
    const sombraR = nivel === 'muitobaixo' ? 0 : 130;
    if (this.q % 10 === 0) for (const st of this.setores) {
      const d = Math.hypot(st.x - cam.x, st.z - cam.z) - SET * 0.7; const v = d < alc;
      for (const m of st.arvores) if (m.isEnabled(false) !== v) m.setEnabled(v);
      const sb = v && d < sombraR; if (sb !== st.sombra) { st.sombra = sb; for (const m of st.arvores) sb ? this.sombraAdd(m) : this.sombraRem(m); }
    }
    if (this.lava) { const lm = this.lava.material as StandardMaterial; const k = 0.85 + Math.sin(this.t * 2) * 0.15; lm.emissiveColor.set(1 * k, 0.38 * k, 0.08 * k); }
    // montanha é parede: se o jogador entrar no morro (andando, voando, dash ou teleporte), volta para o último lugar plano
    { const P = jogo('P'); if (P && typeof P.x === 'number') {
      // pulos grandes (teleporte de porta, interiores, arenas, mapa): o jogo decidiu o lugar, então a parede desliga até pisar no plano
      if (this.ult && Math.hypot(P.x - this.ult[0], P.z - this.ult[1]) > 8) this.ok = null; this.ult = [P.x, P.z];
      const h = this.altura(P.x, P.z); if (h > 0.6) { if (this.ok) { P.x = this.ok[0]; P.z = this.ok[1]; this.ult = [P.x, P.z]; if (P.vx) P.vx = 0; if (P.vz) P.vz = 0; } } else this.ok = [P.x, P.z]; } }
    // inimigos não ficam presos dentro do morro: empurra para fora (só visual de posição; a lógica de combate é a mesma)
    if (this.q % 6 === 0) for (const e of jogo('enemies') || []) { if (!e || e.hp <= 0) continue; if (this.altura(e.x, e.z) > 0.9) { const k = this.col[Math.floor(e.x / 20) + ',' + Math.floor(e.z / 20)]; if (!k) continue; for (const o of k) { const dx = e.x - o.x, dz = e.z - o.z, dd = Math.hypot(dx, dz); if (dd < o.r && dd > 0.01) { e.x = o.x + dx / dd * o.r; e.z = o.z + dz / dd * o.r; } } } }
  }
  get info() { return this.pronto ? { setores: this.setores.length, arvores: this.arvoresTotal, colisores: this.colisores, visiveis: this.setores.reduce((a, s) => a + (s.arvores[0] && s.arvores[0].isEnabled(false) ? 1 : 0), 0) } : null; }
}
