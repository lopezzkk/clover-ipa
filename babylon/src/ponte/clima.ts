// Clima e céu (Babylon nativo), seguindo o clima e a hora do jogo (W113: hora, chuva, neblina, relâmpago):
// - nuvens de verdade se movendo no céu, brancas de dia, alaranjadas no pôr do sol, escuras à noite e cinzentas na chuva
// - chuva com gotas em riscos caindo em volta da câmera e respingos no chão (quantidade por nível gráfico)
// - chão e cenário escurecem e ficam molhados quando chove
// - relâmpago com raio desenhado no céu durante as tempestades
// O jogo continua decidindo quando chove e que horas são; aqui só muda o desenho.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { CreateTube } from '@babylonjs/core/Meshes/Builders/tubeBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Constants } from '@babylonjs/core/Engines/constants';

type T3 = any;
export class Clima {
  static chuva = 0; // 0..1, usado pelo shader do cenário (chão molhado)
  private nuvens: Mesh; private mN: StandardMaterial; private tN: DynamicTexture; private chuva: ParticleSystem; private resp: ParticleSystem;
  private raio: Mesh | null = null; private mRaio: StandardMaterial; private raioT = 0; private flashAnt = 0; private t = 0;
  constructor(private s: Scene) {
    // textura de nuvens (ruído suave que repete nas bordas)
    const N = 256; const tN = this.tN = new DynamicTexture('nuvens', N, s, true); const c = tN.getContext() as unknown as CanvasRenderingContext2D; const img = c.createImageData(N, N);
    const ondas: number[][] = []; for (let i = 0; i < 22; i++) ondas.push([1 + Math.floor(Math.random() * 7), Math.floor(Math.random() * 9) - 4, Math.random() * 6.283, 0.3 + Math.random()]);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let v = 0; for (const [a, b, f, w] of ondas) v += Math.sin((a * x + b * y) / N * 6.283 + f) * w / Math.hypot(a, b); v = v / 3.2 + 0.5;
      const al = Math.max(0, Math.min(1, (v - 0.48) * 3.2)); const k = (y * N + x) * 4; const sh = 200 + al * 55; img.data[k] = sh; img.data[k + 1] = sh; img.data[k + 2] = sh; img.data[k + 3] = al * 235; }
    c.putImageData(img, 0, 0); tN.hasAlpha = true; tN.update(true); tN.wrapU = tN.wrapV = Texture.WRAP_ADDRESSMODE; tN.uScale = tN.vScale = 3;
    const mN = this.mN = new StandardMaterial('nuvens', s); mN.disableLighting = true; mN.emissiveTexture = tN; mN.opacityTexture = tN; mN.emissiveColor = new Color3(1, 1, 1); mN.backFaceCulling = false; mN.disableDepthWrite = true; mN.alpha = 0.9;
    this.nuvens = CreateGround('nuvens', { width: 3000, height: 3000, subdivisions: 1 }, s); this.nuvens.material = mN; this.nuvens.isPickable = false; this.nuvens.applyFog = false; this.nuvens.position.y = 210; this.nuvens.renderingGroupId = 0;
    // chuva
    const tg = new DynamicTexture('gota', { width: 8, height: 64 }, s, true); { const g = tg.getContext() as unknown as CanvasRenderingContext2D; const gr = g.createLinearGradient(0, 0, 0, 64); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(255,255,255,.9)'); g.fillStyle = gr; g.fillRect(2, 0, 4, 64); tg.hasAlpha = true; tg.update(true); }
    const ch = this.chuva = new ParticleSystem('chuva', 3200, s); ch.particleTexture = tg; ch.billboardMode = ParticleSystem.BILLBOARDMODE_STRETCHED; ch.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    ch.emitter = Vector3.Zero(); ch.minEmitBox = new Vector3(-22, -12, -22); ch.maxEmitBox = new Vector3(22, 16, 22); ch.direction1 = new Vector3(0.6, -1, 0.3); ch.direction2 = new Vector3(0.9, -1, 0.5);
    ch.minEmitPower = 22; ch.maxEmitPower = 28; ch.minLifeTime = 0.75; ch.maxLifeTime = 0.9; ch.minSize = 0.07; ch.maxSize = 0.1; ch.minScaleY = 6; ch.maxScaleY = 9;
    ch.color1 = new Color4(0.8, 0.86, 0.97, 0.6); ch.color2 = new Color4(0.7, 0.77, 0.9, 0.5); ch.colorDead = new Color4(0.7, 0.78, 0.9, 0.2); ch.gravity = Vector3.Zero(); ch.updateSpeed = 0.016; ch.emitRate = 0;
    const tr = new DynamicTexture('respingo', 32, s, true); { const g = tr.getContext() as unknown as CanvasRenderingContext2D; g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 3; g.beginPath(); g.arc(16, 16, 11, 0, 6.283); g.stroke(); tr.hasAlpha = true; tr.update(true); }
    const rp = this.resp = new ParticleSystem('respingos', 600, s); rp.particleTexture = tr; rp.billboardMode = ParticleSystem.BILLBOARDMODE_ALL; rp.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    rp.emitter = Vector3.Zero(); rp.minEmitBox = new Vector3(-14, 0.05, -14); rp.maxEmitBox = new Vector3(14, 0.06, 14); rp.direction1 = rp.direction2 = new Vector3(0, 0.01, 0); rp.minEmitPower = rp.maxEmitPower = 0;
    rp.minLifeTime = 0.18; rp.maxLifeTime = 0.3; rp.addSizeGradient(0, 0.05); rp.addSizeGradient(1, 0.3); rp.color1 = new Color4(0.85, 0.9, 1, 0.55); rp.colorDead = new Color4(0.85, 0.9, 1, 0); rp.updateSpeed = 0.016; rp.emitRate = 0;
    ch.start(); rp.start();
    const mr = this.mRaio = new StandardMaterial('raioCeu', s); mr.disableLighting = true; mr.emissiveColor = new Color3(0.85, 0.9, 1); mr.metadata = { brilha: true, corBasica: new Color3(0.8, 0.85, 1) };
  }
  /** o jogo desenha sua chuva antiga em linhas: a ponte não desenha mais ela */
  esconder(o: T3) { const W = (window as any).W113; return !!W && o === W.rain; }

  private relampago(cam: Vector3) {
    if (this.raio) this.raio.dispose(); const a = Math.random() * 6.283, d = 160 + Math.random() * 160; let x = cam.x + Math.cos(a) * d, z = cam.z + Math.sin(a) * d, y = 190; const pts: Vector3[] = [];
    while (y > 0) { pts.push(new Vector3(x, y, z)); y -= 12 + Math.random() * 14; x += (Math.random() - 0.5) * 22; z += (Math.random() - 0.5) * 22; } pts.push(new Vector3(x, 0, z));
    const m = this.raio = CreateTube('raio', { path: pts, radius: 0.9, tessellation: 5 }, this.s); m.material = this.mRaio; m.isPickable = false; m.applyFog = false; this.raioT = 0.22;
  }

  atualizar(dt: number, nivel: string, cam: Vector3) {
    this.t += dt; const W = (window as any).W113; const rk = W ? Math.max(0, Math.min(1, W.rainK || 0)) : 0; const dia = W && typeof W.dayK === 'number' ? W.dayK : 1; const tod = W ? W.tod : 12;
    // nuvens seguem a câmera e andam com o vento
    this.nuvens.position.x = cam.x; this.nuvens.position.z = cam.z; this.tN.uOffset = (this.t * 0.0035 + cam.x / 9000) % 1; this.tN.vOffset = (this.t * 0.0018 + cam.z / 9000) % 1;
    const porSol = Math.max(0, 1 - Math.min(Math.abs(tod - 18.2), Math.abs(tod - 6)) / 1.6); // perto do nascer/pôr do sol
    let cor = Color3.Lerp(new Color3(0.13, 0.15, 0.24), new Color3(1, 1, 1), Math.max(0, Math.min(1, dia)));
    cor = Color3.Lerp(cor, new Color3(1, 0.62, 0.42), porSol * 0.75); cor = Color3.Lerp(cor, new Color3(0.42, 0.44, 0.48).scale(0.3 + dia * 0.7), rk * 0.85);
    this.mN.emissiveColor = cor; this.mN.alpha = 0.72 + rk * 0.28; this.nuvens.setEnabled(nivel !== 'muitobaixo');
    // chuva
    const fat = ({ muitobaixo: 0.15, baixo: 0.35, medio: 0.6, alto: 0.85, ultra: 1 } as Record<string, number>)[nivel] ?? 0.6;
    (this.chuva.emitter as Vector3).set(cam.x, cam.y - 2, cam.z); this.chuva.emitRate = rk * 3600 * fat;
    (this.resp.emitter as Vector3).set(cam.x, 0, cam.z); this.resp.emitRate = nivel === 'muitobaixo' || nivel === 'baixo' ? 0 : rk * 420 * fat;
    Clima.chuva += (rk - Clima.chuva) * Math.min(1, dt * 1.2);
    const ter = this.s.getMaterialByName('terreno') as StandardMaterial | null; if (ter) { const k = 1 - Clima.chuva * 0.22; ter.diffuseColor.set(k, k, k * 1.02); ter.specularColor.set(0.04 + Clima.chuva * 0.3, 0.04 + Clima.chuva * 0.3, 0.05 + Clima.chuva * 0.32); ter.specularPower = 24 + Clima.chuva * 40; }
    // relâmpago
    const fl = W ? W.flash || 0 : 0; if (fl > 0.5 && this.flashAnt <= 0.5 && nivel !== 'muitobaixo') this.relampago(cam); this.flashAnt = fl;
    if (this.raio) { this.raioT -= dt; const v = this.raioT > 0 && (Math.floor(this.raioT * 40) % 3 !== 0); this.raio.setEnabled(v); if (this.raioT < -0.1) { this.raio.dispose(); this.raio = null; } }
    if (fl > 0.05) for (const l of this.s.lights) if (l.name === 'ceuLuz') l.intensity += fl * 0.35;
  }
  get info() { return { chuva: +Clima.chuva.toFixed(2), gotas: this.chuva.getActiveCount() }; }
}
void Constants;
