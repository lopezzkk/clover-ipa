// Demônios e chefes: aura de fumaça escura com brasas da cor do chefe, olhos brilhando e um círculo de poder no chão.
// Só visual: vida, ataques, fases e comportamento continuam 100% do jogo.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateDisc } from '@babylonjs/core/Meshes/Builders/discBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Constants } from '@babylonjs/core/Engines/constants';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

interface Fx { e: T3; fumaca: ParticleSystem; brasa: ParticleSystem; olhos: Mesh[]; anel: Mesh; mat: StandardMaterial; visto: number; }

export class Chefes {
  private fx = new Map<T3, Fx>(); private texF: DynamicTexture; private texB: DynamicTexture; private texA: DynamicTexture; private q = 0; private t = 0; ativos = 0;
  constructor(private s: Scene) {
    const mk = (n: string, f: (c: CanvasRenderingContext2D) => void, sz = 64) => { const t = new DynamicTexture(n, sz, s, true); f(t.getContext() as unknown as CanvasRenderingContext2D); t.hasAlpha = true; t.update(true); return t; };
    this.texF = mk('fumaca', c => { for (let i = 0; i < 7; i++) { const x = 20 + Math.random() * 24, y = 20 + Math.random() * 24, r = 12 + Math.random() * 10; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); } });
    this.texB = mk('brasa', c => { const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 32, 32); }, 32);
    // círculo de poder (desenho original: anéis, runas simples e raios)
    this.texA = mk('anelChefe', c => { c.translate(128, 128); c.strokeStyle = '#fff'; c.lineWidth = 5; c.beginPath(); c.arc(0, 0, 118, 0, 6.283); c.stroke(); c.lineWidth = 2.5; c.beginPath(); c.arc(0, 0, 100, 0, 6.283); c.stroke();
      c.beginPath(); c.arc(0, 0, 58, 0, 6.283); c.stroke(); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283, b = a + 6.283 / 3 * 1.5; c.beginPath(); c.moveTo(Math.cos(a) * 100, Math.sin(a) * 100); c.lineTo(Math.cos(b) * 100, Math.sin(b) * 100); c.stroke(); }
      c.font = 'bold 13px serif'; c.fillStyle = '#fff'; for (let i = 0; i < 24; i++) { c.save(); c.rotate(i / 24 * 6.283); c.fillText('ᚱᛟᚾᛞᚨᛉ'[i % 6], -5, -104); c.restore(); } }, 256);
  }
  private cor(e: T3): Color3 {
    const G = jogo('GR'); const g = e.gr && G && G[e.gr]; const h = g ? g.c : 0x9a2aff; let c = new Color3(((h >> 16) & 255) / 255, ((h >> 8) & 255) / 255, (h & 255) / 255);
    if (c.r + c.g + c.b < 0.4) c = new Color3(0.9, 0.1, 0.15); // anti-magia e sombras: vermelho demoníaco
    return c;
  }
  private criar(e: T3): Fx {
    const s = this.s; const c = this.cor(e);
    const fumaca = new ParticleSystem('auraFum', 120, s); fumaca.particleTexture = this.texF; fumaca.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    fumaca.color1 = new Color4(0.06, 0.03, 0.08, 0.55); fumaca.color2 = new Color4(c.r * 0.25, c.g * 0.1, c.b * 0.25, 0.45); fumaca.colorDead = new Color4(0, 0, 0, 0);
    fumaca.minSize = 0.6; fumaca.maxSize = 1.4; fumaca.minLifeTime = 1.2; fumaca.maxLifeTime = 2.2; fumaca.emitRate = 28; fumaca.gravity = new Vector3(0, 0.9, 0); fumaca.minEmitPower = 0.2; fumaca.maxEmitPower = 0.6;
    fumaca.createCylinderEmitter(0.7, 0.2, 0.4, 0); fumaca.minAngularSpeed = -0.6; fumaca.maxAngularSpeed = 0.6; fumaca.emitter = Vector3.Zero(); fumaca.updateSpeed = 0.016;
    const brasa = new ParticleSystem('auraBrasa', 90, s); brasa.particleTexture = this.texB; brasa.blendMode = ParticleSystem.BLENDMODE_ADD;
    brasa.color1 = new Color4(c.r, c.g, c.b, 1); brasa.color2 = new Color4(Math.min(1, c.r + 0.35), Math.min(1, c.g + 0.2), Math.min(1, c.b + 0.35), 1); brasa.colorDead = new Color4(c.r * 0.3, 0, c.b * 0.3, 0);
    brasa.minSize = 0.05; brasa.maxSize = 0.14; brasa.minLifeTime = 0.7; brasa.maxLifeTime = 1.5; brasa.emitRate = 26; brasa.gravity = new Vector3(0, 1.8, 0); brasa.minEmitPower = 0.3; brasa.maxEmitPower = 1;
    brasa.createCylinderEmitter(0.8, 1.6, 0.3, 0); brasa.emitter = Vector3.Zero(); brasa.updateSpeed = 0.016;
    const mo = new StandardMaterial('olhoChefe', s); mo.disableLighting = true; mo.emissiveColor = new Color3(Math.min(1, c.r * 1.3 + 0.2), Math.min(1, c.g * 1.1 + 0.05), Math.min(1, c.b * 1.3 + 0.1)); mo.metadata = { brilha: true, corBasica: mo.emissiveColor };
    const olhos = [0, 1].map(() => { const o = CreateSphere('olhoC', { diameter: 0.07, segments: 8 }, s); o.material = mo; o.isPickable = false; o.scaling.set(1.3, 0.75, 0.6); return o; });
    const mat = new StandardMaterial('anelC', s); mat.disableLighting = true; mat.diffuseTexture = this.texA; mat.opacityTexture = this.texA; mat.emissiveColor = c.scale(0.9); mat.alphaMode = Constants.ALPHA_ADD; mat.backFaceCulling = false; mat.disableDepthWrite = true; mat.metadata = { brilha: true, corBasica: c };
    const anel = CreateDisc('anelChefe', { radius: 2.2, tessellation: 40 }, s); anel.rotation.x = Math.PI / 2; anel.material = mat; anel.isPickable = false;
    fumaca.start(); brasa.start();
    const f: Fx = { e, fumaca, brasa, olhos, anel, mat, visto: 0 }; this.fx.set(e, f); return f;
  }
  private apagar(f: Fx) { f.fumaca.dispose(false); f.brasa.dispose(false); for (const o of f.olhos) o.dispose(); f.anel.dispose(); f.mat.dispose(); this.fx.delete(f.e); }

  atualizar(dt: number, nivel: string, cam: Vector3) {
    this.q++; this.t += dt; const en: T3[] = jogo('enemies') || []; let n = 0; const max = nivel === 'muitobaixo' ? 0 : nivel === 'baixo' ? 2 : 4;
    const lista = en.filter(e => e && e.m && e.hp > 0 && (e.boss || e.dboss || e.demon || e.dm2 || /dem[oô]n|zagred|lich|rei das trevas/i.test(e.name || '')) && e.m.parent && e.m.visible !== false)
      .map(e => ({ e, d: Math.hypot(e.x - cam.x, e.z - cam.z) })).filter(x => x.d < 70).sort((a, b) => a.d - b.d).slice(0, max);
    for (const { e } of lista) {
      const f = this.fx.get(e) || this.criar(e); f.visto = this.q; n++;
      const p = e.m.position; const pul = 1 + Math.sin(this.t * 2.4) * 0.06; const sc = Math.max(0.6, Math.min(3, e.m.scale ? e.m.scale.y : 1));
      f.anel.position.set(p.x, 0.06, p.z); f.anel.rotation.y = this.t * 0.4; f.anel.scaling.set(sc * pul, sc * pul, 1); f.mat.alpha = 0.55 + Math.sin(this.t * 3) * 0.15; f.anel.setEnabled(true);
      const alto = nivel !== 'baixo';
      (f.fumaca.emitter as Vector3).set(p.x, p.y + 0.2, p.z); (f.brasa.emitter as Vector3).set(p.x, p.y + 0.3, p.z);
      f.fumaca.emitRate = alto ? 28 : 0; f.brasa.emitRate = alto ? (nivel === 'medio' ? 16 : 26) : 8;
      // olhos: pelos olhos do modelo do jogo, um pouco à frente
      const L = e.L; const ol = (L && L.eyes) || [];
      for (let i = 0; i < 2; i++) { const o = f.olhos[i]; const ey = ol[i]; if (!ey || !ey.matrixWorld) { o.setEnabled(false); continue; } const m = ey.matrixWorld.elements; const hd = ey.parent && ey.parent.matrixWorld.elements;
        const fx = hd ? hd[8] : 0, fy = hd ? hd[9] : 0, fz = hd ? hd[10] : 1; const fl = Math.hypot(fx, fy, fz) || 1; o.position.set(m[12] + fx / fl * 0.03, m[13] + fy / fl * 0.03, m[14] + fz / fl * 0.03); o.setEnabled(true);
        const sk = 1 + Math.sin(this.t * 5 + i) * 0.12; o.scaling.set(1.3 * sk * sc, 0.75 * sk * sc, 0.6 * sc); }
    }
    for (const [, f] of this.fx) if (f.visto !== this.q) this.apagar(f);
    this.ativos = n;
  }
}
