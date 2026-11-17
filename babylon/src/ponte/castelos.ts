// Castelos e prédios importantes com visual novo (Babylon nativo):
// - mastros com estandartes balançando ao vento na entrada do castelo, palácio, fortaleza, templo, igreja, quartéis,
//   torre, esconderijo dos Touros Negros e nos 8 quartéis-generais dos esquadrões (cada esquadrão com sua cor e símbolo)
// - tochas acesas com fogo de partículas nas entradas dos prédios grandes (o fogo só roda perto do jogador)
// Símbolos são desenhos originais simples. Posições vêm das portas que o jogo já registra; a lógica não muda.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Material } from '@babylonjs/core/Materials/material';
import { MaterialPluginBase } from '@babylonjs/core/Materials/materialPluginBase';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { UniformBuffer } from '@babylonjs/core/Materials/uniformBuffer';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

/** pano balançando: a parte de baixo do estandarte mexe mais que a de cima (shader, sem custo no processador) */
class PanoPlugin extends MaterialPluginBase {
  static t = 0;
  constructor(m: Material) { super(m, 'Pano', 220, { PANO: false }); this._enable(true); }
  prepareDefines(d: any) { d.PANO = true; }
  getClassName() { return 'PanoPlugin'; }
  getUniforms() { return { ubo: [{ name: 'panoT', size: 1, type: 'float' }], vertex: 'uniform float panoT;' }; }
  bindForSubMesh(ubo: UniformBuffer) { ubo.updateFloat('panoT', PanoPlugin.t); }
  getCustomCode(tipo: string): any {
    if (tipo !== 'vertex') return null;
    return { CUSTOM_VERTEX_UPDATE_POSITION: `
#if defined(PANO) && defined(UV1)
  float pw = 1.0 - uv.y;
  positionUpdated.y += sin(panoT * 2.7 + uv.y * 5.5 + uv.x * 2.0) * 0.16 * pw;
  positionUpdated.x += sin(panoT * 1.9 + uv.y * 3.0) * 0.05 * pw;
#endif
` };
  }
}

// cores e símbolos (originais) de cada lugar
const ESTILO: Record<string, { c: string; c2: string; s: string }> = {
  castle: { c: '#8e1b22', c2: '#e2c25a', s: 'coroa' }, palace: { c: '#5b1f6e', c2: '#e2c25a', s: 'coroa' }, fortress: { c: '#2f3a48', c2: '#c9ced6', s: 'escudo' },
  temple: { c: '#e9e2cf', c2: '#b48a2c', s: 'sol' }, church: { c: '#f1ece0', c2: '#b48a2c', s: 'estrela' }, barracks: { c: '#3a4a2a', c2: '#d8c27a', s: 'espadas' },
  tower: { c: '#24305e', c2: '#c9b8ff', s: 'estrela' }, bulls: { c: '#151515', c2: '#d63a2a', s: 'chifres' },
  'hq:dourado': { c: '#c99a1c', c2: '#fff1b8', s: 'sol' }, 'hq:aguia': { c: '#2c4f86', c2: '#e8eef8', s: 'asas' }, 'hq:leao': { c: '#a8241e', c2: '#f2c95a', s: 'coroa' },
  'hq:rosa': { c: '#c2447a', c2: '#ffe0ec', s: 'flor' }, 'hq:louva': { c: '#2f7a3a', c2: '#d8f0b0', s: 'folha' }, 'hq:pavao': { c: '#1d6f78', c2: '#7fe0c8', s: 'pena' },
  'hq:orca': { c: '#162a44', c2: '#9fd2ff', s: 'onda' }, 'hq:cervo': { c: '#6a4a2a', c2: '#f0dcb4', s: 'galhada' },
};
const GRANDES = new Set(['castle', 'palace', 'fortress', 'temple', 'church', 'barracks', 'tower', 'bulls']);

function simbolo(c: CanvasRenderingContext2D, s: string, cor: string) {
  c.save(); c.translate(64, 120); c.fillStyle = cor; c.strokeStyle = cor; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
  const P = (pts: number[][]) => { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (const p of pts.slice(1)) c.lineTo(p[0], p[1]); c.closePath(); c.fill(); };
  switch (s) {
    case 'coroa': P([[-34, 22], [-34, -14], [-18, 4], [0, -26], [18, 4], [34, -14], [34, 22]]); break;
    case 'escudo': c.beginPath(); c.moveTo(-28, -28); c.lineTo(28, -28); c.lineTo(28, 4); c.quadraticCurveTo(0, 40, 0, 40); c.quadraticCurveTo(0, 40, -28, 4); c.closePath(); c.fill(); break;
    case 'sol': c.beginPath(); c.arc(0, 0, 16, 0, 6.283); c.fill(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.beginPath(); c.moveTo(Math.cos(a) * 22, Math.sin(a) * 22); c.lineTo(Math.cos(a) * 34, Math.sin(a) * 34); c.stroke(); } break;
    case 'estrela': { const p: number[][] = []; for (let i = 0; i < 10; i++) { const r = i % 2 ? 14 : 34, a = i / 10 * 6.283 - 1.571; p.push([Math.cos(a) * r, Math.sin(a) * r]); } P(p); break; }
    case 'espadas': for (const k of [-1, 1]) { c.save(); c.rotate(k * 0.6); c.fillRect(-4, -36, 8, 60); c.fillRect(-14, 14, 28, 6); c.restore(); } break;
    case 'chifres': c.lineWidth = 9; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 8, 18); c.quadraticCurveTo(k * 40, 10, k * 30, -30); c.stroke(); } c.beginPath(); c.arc(0, 18, 12, 0, 6.283); c.fill(); break;
    case 'asas': for (const k of [-1, 1]) for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(0, -4 + i * 12); c.quadraticCurveTo(k * 22, -24 + i * 10, k * 40, -18 + i * 14); c.stroke(); } break;
    case 'flor': for (let i = 0; i < 5; i++) { const a = i / 5 * 6.283; c.beginPath(); c.ellipse(Math.cos(a) * 15, Math.sin(a) * 15, 13, 8, a, 0, 6.283); c.fill(); } c.fillStyle = '#fff6'; c.beginPath(); c.arc(0, 0, 8, 0, 6.283); c.fill(); break;
    case 'folha': c.beginPath(); c.moveTo(0, -36); c.quadraticCurveTo(32, 0, 0, 36); c.quadraticCurveTo(-32, 0, 0, -36); c.fill(); c.strokeStyle = '#0005'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -30); c.lineTo(0, 30); c.stroke(); break;
    case 'pena': c.beginPath(); c.ellipse(0, 0, 18, 34, 0, 0, 6.283); c.fill(); c.fillStyle = '#0a2a30'; c.beginPath(); c.ellipse(0, -8, 9, 12, 0, 0, 6.283); c.fill(); break;
    case 'onda': for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-34, -16 + i * 16); c.bezierCurveTo(-18, -28 + i * 16, -6, -4 + i * 16, 8, -16 + i * 16); c.bezierCurveTo(20, -26 + i * 16, 28, -10 + i * 16, 34, -16 + i * 16); c.stroke(); } break;
    case 'galhada': c.lineWidth = 6; for (const k of [-1, 1]) { c.beginPath(); c.moveTo(k * 6, 26); c.lineTo(k * 18, -2); c.lineTo(k * 34, -30); c.moveTo(k * 18, -2); c.lineTo(k * 34, -4); c.moveTo(k * 26, -16); c.lineTo(k * 16, -34); c.stroke(); } break;
  }
  c.restore();
}

interface Peca { x: number; z: number; ms: Mesh[]; fogo: ParticleSystem[]; }

export class Castelos {
  pronto = false; private pecas: Peca[] = []; private chamas: Mesh[] = []; private mChama!: StandardMaterial; private t = 0; private q = 0; total = 0;
  constructor(private s: Scene) {}

  private textura(k: string) {
    const e = ESTILO[k]; const t = new DynamicTexture('estandarte_' + k, { width: 128, height: 256 }, this.s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
    c.fillStyle = e.c; c.fillRect(0, 0, 128, 256);
    c.fillStyle = e.c2; c.fillRect(0, 0, 128, 10); c.fillRect(0, 0, 8, 256); c.fillRect(120, 0, 8, 256);
    // ponta em "V" embaixo (o resto fica transparente)
    c.globalCompositeOperation = 'destination-out'; c.beginPath(); c.moveTo(0, 256); c.lineTo(64, 214); c.lineTo(128, 256); c.closePath(); c.fill(); c.globalCompositeOperation = 'source-over';
    c.strokeStyle = e.c2; c.lineWidth = 7; c.beginPath(); c.moveTo(4, 252); c.lineTo(64, 216); c.lineTo(124, 252); c.stroke();
    simbolo(c, e.s, e.c2); t.hasAlpha = true; t.update(true); return t;
  }

  private montar() {
    const D: T3[] = jogo('DOORS86'); const P = jogo('P'); const WB = jogo('WB83');
    if (!D || D.length < 20 || !P || !P.on || !WB || WB.x1 - WB.x0 < 300) return false;
    const s = this.s;
    const madeira = new StandardMaterial('mastro', s); madeira.diffuseColor = new Color3(0.32, 0.22, 0.14); madeira.specularColor = new Color3(0.05, 0.05, 0.05);
    const ouro = new StandardMaterial('mastroPonta', s); ouro.diffuseColor = new Color3(0.85, 0.66, 0.25); ouro.specularColor = new Color3(1, 0.85, 0.5); ouro.specularPower = 48;
    const ferro = new StandardMaterial('tochaFerro', s); ferro.diffuseColor = new Color3(0.14, 0.13, 0.13);
    const mc = this.mChama = new StandardMaterial('tochaChama', s); mc.disableLighting = true; mc.emissiveColor = new Color3(1, 0.6, 0.2); mc.alpha = 0.92; mc.metadata = { brilha: true, corBasica: new Color3(1, 0.55, 0.15) };
    const matsPano: Record<string, StandardMaterial> = {};
    const pano = (k: string) => { let m = matsPano[k]; if (!m) { m = matsPano[k] = new StandardMaterial('pano_' + k, s); m.diffuseTexture = this.textura(k); m.diffuseTexture.hasAlpha = true; m.useAlphaFromDiffuseTexture = false; m.backFaceCulling = false; m.specularColor = new Color3(0.05, 0.05, 0.05); new PanoPlugin(m); } return m; };
    const fogoTex = new DynamicTexture('fogoTocha', 32, s, true); { const c = fogoTex.getContext() as unknown as CanvasRenderingContext2D; const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.5, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 32, 32); fogoTex.hasAlpha = true; fogoTex.update(true); }
    for (const d of D) {
      const k = d.kind in ESTILO ? d.kind : d.kind.split(':')[0] === 'hq' ? d.kind : ''; if (!k || !ESTILO[k]) continue;
      if (d.x > WB.x1 + 50 || d.x < WB.x0 - 50 || d.z > WB.z1 + 50 || d.z < WB.z0 - 50) continue;
      const ry = d.ry || 0, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      const grande = k === 'castle' || k === 'palace' || k === 'fortress'; const H = grande ? 9 : 6.5; const lat = grande ? 5.5 : k.startsWith('hq') ? 3.2 : 2.6;
      const pc: Peca = { x: d.x, z: d.z, ms: [], fogo: [] };
      for (const sd of [-1, 1]) {
        const x = d.x + lx * sd * lat + fx * 0.6, z = d.z + lz * sd * lat + fz * 0.6;
        const m = CreateCylinder('mastro', { height: H, diameterTop: 0.12, diameterBottom: 0.18, tessellation: 8 }, s); m.position.set(x, H / 2, z); m.material = madeira;
        const bar = CreateCylinder('barra', { height: 1.5, diameter: 0.08, tessellation: 6 }, s); bar.rotation.z = Math.PI / 2; bar.rotation.y = ry; bar.position.set(x + fx * 0.08, H - 0.35, z + fz * 0.08); bar.material = madeira;
        const pt = CreateSphere('ponta', { diameter: 0.26, segments: 8 }, s); pt.position.set(x, H + 0.1, z); pt.material = ouro;
        const b = CreateGround('estandarte', { width: 1.3, height: 2.6, subdivisions: 10 }, s); b.rotation.set(-Math.PI / 2, ry, 0); b.position.set(x + fx * 0.1, H - 0.38 - 1.3, z + fz * 0.1); b.material = pano(k);
        for (const q of [m, bar, pt, b]) { q.isPickable = false; q.freezeWorldMatrix(); pc.ms.push(q); }
        if (GRANDES.has(k)) { // tocha
          const tx = d.x + lx * sd * (lat + 1.4) + fx * 0.6, tz = d.z + lz * sd * (lat + 1.4) + fz * 0.6;
          const po = CreateCylinder('tocha', { height: 2.1, diameterTop: 0.1, diameterBottom: 0.16, tessellation: 6 }, s); po.position.set(tx, 1.05, tz); po.material = ferro;
          const cu = CreateCylinder('cuia', { height: 0.3, diameterTop: 0.42, diameterBottom: 0.2, tessellation: 8 }, s); cu.position.set(tx, 2.2, tz); cu.material = ferro;
          const ch = CreateCylinder('chama', { height: 0.6, diameterTop: 0, diameterBottom: 0.34, tessellation: 7 }, s); ch.position.set(tx, 2.62, tz); ch.material = mc; this.chamas.push(ch);
          for (const q of [po, cu]) { q.isPickable = false; q.freezeWorldMatrix(); pc.ms.push(q); } ch.isPickable = false; pc.ms.push(ch);
          const ps = new ParticleSystem('fogoTocha', 60, s); ps.particleTexture = fogoTex; ps.blendMode = ParticleSystem.BLENDMODE_ADD; ps.emitter = new Vector3(tx, 2.45, tz);
          ps.minEmitBox = new Vector3(-0.1, 0, -0.1); ps.maxEmitBox = new Vector3(0.1, 0.05, 0.1); ps.color1 = new Color4(1, 0.7, 0.25, 1); ps.color2 = new Color4(1, 0.45, 0.1, 1); ps.colorDead = new Color4(0.3, 0.05, 0, 0);
          ps.minSize = 0.12; ps.maxSize = 0.32; ps.minLifeTime = 0.25; ps.maxLifeTime = 0.6; ps.emitRate = 40; ps.gravity = new Vector3(0, 2.6, 0); ps.direction1 = new Vector3(-0.15, 1, -0.15); ps.direction2 = new Vector3(0.15, 1.4, 0.15);
          ps.minEmitPower = 0.4; ps.maxEmitPower = 0.9; ps.addSizeGradient(0, 0.3); ps.addSizeGradient(1, 0.05); ps.updateSpeed = 0.016; pc.fogo.push(ps);
        }
      }
      this.pecas.push(pc); this.total++;
    }
    this.pronto = true; return true;
  }

  atualizar(dt: number, nivel: string, cam: Vector3) {
    if (!this.pronto) { if (++this.q % 40 === 5) this.montar(); return; }
    this.t += dt; this.q++; PanoPlugin.t = this.t;
    // chama tremendo
    const f = 0.85 + Math.sin(this.t * 17) * 0.08 + Math.sin(this.t * 7.3) * 0.07; this.mChama.emissiveColor.set(1 * f, 0.58 * f, 0.18 * f);
    for (let i = 0; i < this.chamas.length; i++) { const c = this.chamas[i]; c.scaling.set(1, 0.85 + Math.sin(this.t * 13 + i * 2.1) * 0.15, 1); }
    if (this.q % 10 !== 0) return;
    const alc = ({ muitobaixo: 110, baixo: 160, medio: 220, alto: 300, ultra: 400 } as Record<string, number>)[nivel] || 220;
    const fogoOk = nivel !== 'muitobaixo' && nivel !== 'baixo';
    for (const p of this.pecas) {
      const d = Math.hypot(p.x - cam.x, p.z - cam.z); const v = d < alc;
      for (const m of p.ms) if (m.isEnabled(false) !== v) m.setEnabled(v);
      const fv = fogoOk && d < 75; for (const ps of p.fogo) { if (fv && !ps.isStarted()) ps.start(); else if (!fv && ps.isStarted()) ps.stop(); }
    }
  }
  get info() { return this.pronto ? { lugares: this.total, tochas: this.chamas.length } : null; }
}
