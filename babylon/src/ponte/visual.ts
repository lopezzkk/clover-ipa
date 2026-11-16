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
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import '@babylonjs/core/Particles/particleSystemComponent';
import { Color4 } from '@babylonjs/core/Maths/math.color';


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

// ---------- texturas de detalhe em tons de cinza (mantêm a cor original do jogo) ----------
type Pinta = (c: CanvasRenderingContext2D, S: number, r: () => number) => void;
const cacheDet = new Map<string, Texture>();
function det(s: Scene, nome: string, pinta: Pinta) {
  const o = cacheDet.get(nome); if (o) return o;
  const S = 256, t = new DynamicTexture('det_' + nome, { width: S, height: S }, s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
  let sd = nome.length * 7919; const r = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
  c.fillStyle = '#ebebeb'; c.fillRect(0, 0, S, S); pinta(c, S, r);
  t.update(true); t.wrapU = t.wrapV = Texture.WRAP_ADDRESSMODE; t.anisotropicFilteringLevel = 8; t.coordinatesIndex = 1; cacheDet.set(nome, t); return t;
}
const g = (v: number, a = 1) => `rgba(${v | 0},${v | 0},${v | 0},${a})`;
const PINTAS: Record<string, Pinta> = {
  reboco: (c, S, r) => { for (let i = 0; i < 7000; i++) { c.fillStyle = g(195 + r() * 60, 0.25); const z = 1 + r() * 3; c.fillRect(r() * S, r() * S, z, z); } for (let i = 0; i < 26; i++) { c.fillStyle = g(150 + r() * 50, 0.08 + r() * 0.07); c.beginPath(); c.ellipse(r() * S, r() * S, 8 + r() * 30, 5 + r() * 18, r() * 3, 0, 7); c.fill(); } },
  madeira: (c, S, r) => { for (let y = 0; y < S; y += 2) { c.fillStyle = g(150 + r() * 90, 0.35 + r() * 0.3); c.fillRect(0, y, S, 1 + r() * 1.5); } for (let i = 0; i < 10; i++) { c.strokeStyle = g(90, 0.45); c.beginPath(); c.ellipse(r() * S, r() * S, 4 + r() * 5, 1.6, 0, 0, 7); c.stroke(); } for (let x = 0; x < S; x += S / 4) { c.fillStyle = g(80, 0.5); c.fillRect(x, 0, 2, S); } },
  pedra: (c, S, r) => { const h = S / 6; for (let y = 0; y < S; y += h) for (let x = -(y / h % 2) * h; x < S; x += h * 1.5) { c.fillStyle = g(175 + r() * 70); c.beginPath(); (c as any).roundRect(x + 2, y + 2, h * 1.5 - 4, h - 4, 6); c.fill(); } c.fillStyle = g(110, 1); for (let i = 0; i < 3000; i++) { c.globalAlpha = r() * 0.2; c.fillRect(r() * S, r() * S, 1.5, 1.5); } c.globalAlpha = 1; },
  telha: (c, S, r) => { const h = S / 8, w = S / 7; for (let y = 0; y < S; y += h) for (let x = -(y / h % 2) * w / 2; x < S; x += w) { c.fillStyle = g(175 + r() * 70); c.beginPath(); c.moveTo(x + 1, y); c.lineTo(x + w - 1, y); c.lineTo(x + w - 2, y + h - 2); c.quadraticCurveTo(x + w / 2, y + h + 3, x + 2, y + h - 2); c.fill(); c.fillStyle = g(90, 0.45); c.fillRect(x, y + h - 3, w, 2); } },
  geral: (c, S, r) => { for (let i = 0; i < 6000; i++) { c.fillStyle = g(190 + r() * 65, 0.3); const z = 1 + r() * 2; c.fillRect(r() * S, r() * S, z, z); } },
};
function hsl(cr: number, cg: number, cb: number) { const mx = Math.max(cr, cg, cb), mn = Math.min(cr, cg, cb), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0; if (d > 1e-4) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === cr ? ((cg - cb) / d) % 6 : mx === cg ? (cb - cr) / d + 2 : (cr - cg) / d + 4; h *= 60; if (h < 0) h += 360; } return [h, s, l]; }
function inclinado(obj: T3) { try { const n = obj.geometry.attributes.normal; if (!n) return false; let k = 0, t = 0; for (let i = 1; i < n.array.length; i += 9) { const y = Math.abs(n.array[i]); t++; if (y > 0.3 && y < 0.97) k++; } return t > 0 && k / t > 0.35; } catch { return false; } }
let PERS: Set<any> | null = null, persT = 0;
function personagens() { const now = performance.now(); if (PERS && now - persT < 3000) return PERS; PERS = new Set(); persT = now;
  try { for (const n of jogo('NPCS') || []) n.g && PERS.add(n.g); } catch { /* */ } try { for (const e of jogo('enemies') || []) e.m && PERS.add(e.m); } catch { /* */ }
  try { const mp = jogo('MP'); for (const k in (mp && mp.others) || {}) mp.others[k].g && PERS.add(mp.others[k].g); } catch { /* */ } try { const pp = jogo('PP'); pp && pp.g && PERS.add(pp.g); } catch { /* */ }
  return PERS; }
function cenario(obj: T3) { const P = personagens(); let p = obj, d = 0, chunk = false; const ch = jogo('chunks'); const vals = ch ? new Set(Object.values(ch)) : null;
  while (p && d < 12) { if (P.has(p)) return false; if (vals && vals.has(p)) chunk = true; p = p.parent; d++; } return chunk; }
function categoria(src: T3, obj: T3): string { const c = src.color; if (!c) return 'geral'; const [h, s, l] = hsl(c.r, c.g, c.b);
  if (l > 0.68 && s < 0.45) return 'reboco';
  if ((h < 22 || h > 340) && s > 0.35 && l > 0.2 && l < 0.62 && inclinado(obj)) return 'telha';
  if (h > 190 && h < 250 && s > 0.15 && l < 0.6 && inclinado(obj)) return 'telha';
  if (h >= 18 && h <= 48 && s > 0.2 && l < 0.5) return 'madeira';
  if (s < 0.16 && l >= 0.22 && l <= 0.68) return 'pedra';
  return 'geral'; }

/** chamado uma vez por material novo */
export function melhorarMaterial(s: Scene, m: StandardMaterial, src: T3, obj: T3) {
  if (src.type === 'MeshToonMaterial' || src.type === 'MeshLambertMaterial') { m.specularColor = new Color3(0.07, 0.07, 0.07); m.specularPower = 24; }
  // metais dourados do jogo (cantos dos grimórios, coroas, enfeites): brilho de metal
  if (src.color && src.type !== 'MeshBasicMaterial') { const h = src.color.getHex ? src.color.getHex() : 0; if (h === 0xd8b24a || h === 0xd4af37 || h === 0xd0a040 || h === 0xe8c766) { m.specularColor = new Color3(1, 0.82, 0.45); m.specularPower = 56; } }
  // construções e objetos do cenário (não personagens): textura de detalhe pela cor original
  if (!src.map && !src.transparent && src.type !== 'MeshBasicMaterial' && obj !== jogo('ground') && cenario(obj)) {
    const cat = categoria(src, obj); const t = det(s, cat, PINTAS[cat]); m.diffuseTexture = t; m.metadata = Object.assign(m.metadata || {}, { texDet: t, cat });
    if (cat === 'telha') { m.specularColor = new Color3(0.12, 0.1, 0.09); m.specularPower = 40; }
  }
  const chao = jogo('ground');
  if (chao && obj === chao && !src.map) {
    const t = texDetalhe(s); const p = chao.geometry.parameters || { width: 1200, height: 1100 };
    t.uScale = p.width / 4; t.vScale = p.height / 4; m.diffuseTexture = t; m.metadata = Object.assign(m.metadata || {}, { chao: true });
  }
}

// ---------- grama em volta do jogador ----------
export class Grama {
  private m: Mesh | null = null; private cel = ''; private pisos: { c?: [number, number, number]; b?: [number, number, number, number] }[] = []; private cores: Float32Array | null = null; private grade: { cols: number; rows: number; x0: number; z0: number; dx: number; dz: number } | null = null;
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
    // pisos: praças, calçamentos e terra batida (peças baixas e planas por cima do chão) não ganham grama
    const S3 = jogo('S'); const T = (window as any).THREE;
    if (S3 && T) { const bx = new T.Box3(); S3.traverse((o: any) => { if (!o.isMesh || o === g || !o.geometry) return; const gt = o.geometry.type;
      if (gt !== 'CircleGeometry' && gt !== 'PlaneGeometry' && gt !== 'RingGeometry' && gt !== 'BoxGeometry' && gt !== 'CylinderGeometry') return;
      bx.setFromObject(o); if (bx.max.y > 0.45 || bx.min.y < -0.5) return; const w = bx.max.x - bx.min.x, d = bx.max.z - bx.min.z; if (w < 2.5 || d < 2.5 || w > 400) return;
      if (gt === 'CircleGeometry' || gt === 'CylinderGeometry') this.pisos.push({ c: [(bx.min.x + bx.max.x) / 2, (bx.min.z + bx.max.z) / 2, Math.max(w, d) / 2 + 0.4] });
      else this.pisos.push({ b: [bx.min.x - 0.3, bx.min.z - 0.3, bx.max.x + 0.3, bx.max.z + 0.3] }); }); }
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
        if (this.pisos.some(q => q.c ? Math.hypot(x - q.c[0], z - q.c[1]) < q.c[2] : x > q.b![0] && x < q.b![2] && z > q.b![1] && z < q.b![3])) continue;
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

// ---------- partículas das magias ----------
// cada efeito de magia que aparece na tela solta faíscas da própria cor (e um rastro enquanto se move).
// Um sistema por faixa de cor; a quantidade por quadro tem limite pelo nível gráfico.

export class Faiscas {
  private sis: { ps: ParticleSystem; fila: Vector3[]; cor: Color3; el: string }[] = [];
  private tex: Texture | null = null; private ultimo = new Map<string, number>();
  constructor(private s: Scene) {}
  private textura() {
    if (this.tex) return this.tex; const t = new DynamicTexture('faisca', { width: 64, height: 64 }, this.s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
    const gr = c.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gr; c.fillRect(0, 0, 64, 64);
    t.hasAlpha = true; t.update(true); this.tex = t; return t;
  }
  /** elemento do efeito pela cor (e pelo atributo do jogador quando a cor bate com o grimório dele) */
  private elemento(cor: Color3): string {
    try { const P = jogo('P'); const g = P && P.g; if (g && typeof g.c === 'number') { const r = ((g.c >> 16) & 255) / 255, gg = ((g.c >> 8) & 255) / 255, b = (g.c & 255) / 255; if (Math.abs(r - cor.r) + Math.abs(gg - cor.g) + Math.abs(b - cor.b) < 0.45) { const m: Record<string, string> = { fogo: 'fogo', agua: 'agua', vento: 'vento', luz: 'luz', tempo: 'tempo', raio: 'raio', sangue: 'sangue', sonhos: 'astral', espacial: 'astral', sombra: 'astral', kotodama: 'astral' }; if (m[g.id]) return m[g.id]; } } } catch { /* segue pela cor */ }
    const mx = Math.max(cor.r, cor.g, cor.b), mn = Math.min(cor.r, cor.g, cor.b), sat = mx ? (mx - mn) / mx : 0;
    if (sat < 0.25) return mx > 0.7 ? 'luz' : 'astral';
    let h = 0; const d = mx - mn || 1;
    if (mx === cor.r) h = ((cor.g - cor.b) / d) % 6; else if (mx === cor.g) h = (cor.b - cor.r) / d + 2; else h = (cor.r - cor.g) / d + 4; h = (h * 60 + 360) % 360;
    if (h < 12 || h >= 340) return cor.g < 0.12 && cor.r < 0.85 ? 'sangue' : 'fogo';
    if (h < 40) return 'fogo'; if (h < 65) return 'luz'; if (h < 170) return 'vento'; if (h < 200) return sat < 0.5 ? 'raio' : 'agua'; if (h < 245) return 'agua'; return 'astral';
  }
  private sistema(cor: Color3) {
    // agrupa por elemento e cor parecida (até 12 sistemas)
    const el = this.elemento(cor);
    let melhor = null as null | (typeof this.sis)[0], dm = 1e9;
    for (const x of this.sis) { if (x.el !== el && this.sis.length < 12) continue; const d = Math.abs(x.cor.r - cor.r) + Math.abs(x.cor.g - cor.g) + Math.abs(x.cor.b - cor.b); if (d < dm) { dm = d; melhor = x; } }
    if (melhor && (dm < 0.35 || this.sis.length >= 12)) return melhor;
    const ps = new ParticleSystem('magia_' + el, 900, this.s); ps.particleTexture = this.textura(); ps.blendMode = ParticleSystem.BLENDMODE_ADD;
    const c = new Color4(Math.min(1, cor.r * 1.2 + 0.1), Math.min(1, cor.g * 1.2 + 0.1), Math.min(1, cor.b * 1.2 + 0.1), 1);
    ps.color1 = c; ps.color2 = new Color4(1, 1, 1, 0.9); ps.colorDead = new Color4(cor.r * 0.5, cor.g * 0.5, cor.b * 0.5, 0);
    ps.minSize = 0.08; ps.maxSize = 0.32; ps.minLifeTime = 0.25; ps.maxLifeTime = 0.7; ps.minEmitPower = 1.5; ps.maxEmitPower = 5; ps.gravity = new Vector3(0, -2.5, 0);
    ps.direction1 = new Vector3(-1, 1.2, -1); ps.direction2 = new Vector3(1, 2, 1); ps.emitRate = 0; ps.updateSpeed = 0.016; ps.isLocal = false;
    // comportamento de cada elemento
    switch (el) {
      case 'fogo': // brasas subindo e apagando em laranja escuro
        ps.gravity = new Vector3(0, 3.2, 0); ps.direction1 = new Vector3(-0.6, 0.6, -0.6); ps.direction2 = new Vector3(0.6, 1.6, 0.6); ps.minEmitPower = 0.6; ps.maxEmitPower = 2.2; ps.minLifeTime = 0.4; ps.maxLifeTime = 0.95;
        ps.addSizeGradient(0, 0.3); ps.addSizeGradient(1, 0.04); ps.colorDead = new Color4(0.35, 0.05, 0, 0); ps.color2 = new Color4(1, 0.85, 0.3, 1); break;
      case 'agua': // gotas que espirram e caem
        ps.gravity = new Vector3(0, -9, 0); ps.minEmitPower = 2; ps.maxEmitPower = 4.5; ps.minSize = 0.05; ps.maxSize = 0.14; ps.minLifeTime = 0.35; ps.maxLifeTime = 0.8; ps.color2 = new Color4(0.8, 0.95, 1, 0.9); break;
      case 'vento': // riscos rápidos na horizontal
        ps.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; ps.gravity = Vector3.Zero(); ps.direction1 = new Vector3(-2, 0.1, -2); ps.direction2 = new Vector3(2, 0.6, 2); ps.minEmitPower = 4; ps.maxEmitPower = 8; ps.minLifeTime = 0.18; ps.maxLifeTime = 0.4; ps.minSize = 0.05; ps.maxSize = 0.12; ps.minScaleY = 2.5; ps.maxScaleY = 4; ps.color2 = new Color4(0.9, 1, 0.95, 0.7); break;
      case 'raio': // faíscas elétricas muito rápidas
        ps.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; ps.gravity = Vector3.Zero(); ps.direction1 = new Vector3(-3, -1, -3); ps.direction2 = new Vector3(3, 3, 3); ps.minEmitPower = 7; ps.maxEmitPower = 12; ps.minLifeTime = 0.08; ps.maxLifeTime = 0.2; ps.minSize = 0.04; ps.maxSize = 0.09; ps.minScaleY = 3; ps.maxScaleY = 6; ps.color2 = new Color4(1, 1, 1, 1); break;
      case 'luz': // brilhos que piscam e sobem devagar
        ps.gravity = new Vector3(0, 0.6, 0); ps.minEmitPower = 0.3; ps.maxEmitPower = 1.2; ps.minLifeTime = 0.5; ps.maxLifeTime = 1.1; ps.addSizeGradient(0, 0.02); ps.addSizeGradient(0.3, 0.3); ps.addSizeGradient(1, 0); break;
      case 'tempo': // partículas lentas em órbita, douradas
        ps.gravity = Vector3.Zero(); ps.minEmitPower = 0.2; ps.maxEmitPower = 0.7; ps.minLifeTime = 1; ps.maxLifeTime = 1.6; ps.minSize = 0.05; ps.maxSize = 0.16; ps.minAngularSpeed = -2; ps.maxAngularSpeed = 2; break;
      case 'sangue': // gotas escuras que caem pesadas
        ps.gravity = new Vector3(0, -11, 0); ps.minEmitPower = 1.5; ps.maxEmitPower = 3.5; ps.minSize = 0.06; ps.maxSize = 0.16; ps.color2 = new Color4(0.7, 0.02, 0.08, 1); ps.colorDead = new Color4(0.2, 0, 0.02, 0); break;
      case 'astral': // estrelas lentas que flutuam (sonhos, espaço, sombra, kotodama)
        ps.gravity = new Vector3(0, 0.25, 0); ps.minEmitPower = 0.2; ps.maxEmitPower = 0.9; ps.minLifeTime = 0.8; ps.maxLifeTime = 1.5; ps.addSizeGradient(0, 0); ps.addSizeGradient(0.4, 0.22); ps.addSizeGradient(1, 0); ps.minAngularSpeed = -3; ps.maxAngularSpeed = 3; break;
    }
    const fila: Vector3[] = []; ps.emitter = Vector3.Zero();
    ps.startPositionFunction = (_w, pos) => { const p = fila.pop(); if (p) pos.copyFrom(p); };
    ps.start(); const x = { ps, fila, cor: cor.clone(), el }; this.sis.push(x); return x;
  }
  get elementos() { const o: Record<string, number> = {}; for (const x of this.sis) o[x.el] = (o[x.el] || 0) + x.ps.getActiveCount(); return o; }
  /** chamado uma vez por quadro com os efeitos visíveis */
  quadro(efeitos: { x: number; y: number; z: number; r: number; c: Color3 }[], limite: number) {
    if (limite <= 0 || !efeitos.length) return;
    let total = 0; const porEf = Math.max(1, Math.min(5, Math.floor(limite / efeitos.length)));
    for (const e of efeitos) {
      if (total >= limite) break; if (e.c.r + e.c.g + e.c.b < 0.15) continue;
      const k = Math.round(e.x * 2) + ',' + Math.round(e.y * 2) + ',' + Math.round(e.z * 2); const parado = this.ultimo.get(k) === undefined ? 0 : 1; this.ultimo.set(k, 1);
      const n = parado ? Math.max(1, porEf >> 1) : porEf; const sis = this.sistema(e.c);
      for (let i = 0; i < n; i++) { const a = Math.random() * 6.283, rr = Math.random() * e.r * 0.8; sis.fila.push(new Vector3(e.x + Math.cos(a) * rr, e.y + (Math.random() - 0.5) * e.r, e.z + Math.sin(a) * rr)); }
      sis.ps.manualEmitCount = (sis.ps.manualEmitCount > 0 ? sis.ps.manualEmitCount : 0) + n; total += n;
    }
    if (this.ultimo.size > 4000) this.ultimo.clear();
  }
  get ativos() { return this.sis.reduce((a, x) => a + x.ps.getActiveCount(), 0); }
}
