// Interiores importantes com visual novo (Babylon nativo), só enquanto o jogador está dentro:
// - luz quente de verdade no salão (luz pontual que ilumina paredes, chão e móveis), tremendo de leve como chama
// - lustre de ferro com velas acesas no teto dos salões grandes (castelo, palácio, igreja, templo, biblioteca, taverna, quartéis...)
// - poeira brilhando no ar (partículas lentas) nos níveis médio para cima
// - cantos da tela um pouco mais escuros (vinheta) para dar clima de lugar fechado
// A lógica dos interiores (entrar, sair, tapete verde, NPCs, lojas) é do jogo e não muda.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Constants } from '@babylonjs/core/Engines/constants';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };
const SALOES = /^(castle|palace|church|temple|library|tavern|barracks|hq|fortress|bulls|tower)/;

export class Interiores {
  private luzes: PointLight[] = []; private lustre: TransformNode; private chamas: Mesh[] = []; private mChama: StandardMaterial; private poeira: ParticleSystem;
  private atual: T3 = null; private t = 0; dentro = false; vinheta: ((on: boolean) => void) | null = null;
  constructor(private s: Scene) {
    for (let i = 0; i < 2; i++) { const l = new PointLight('luzInterior' + i, Vector3.Zero(), s); l.diffuse = new Color3(1, 0.78, 0.5); l.specular = new Color3(0.4, 0.3, 0.2); l.intensity = 0; l.range = 14; l.setEnabled(false); this.luzes.push(l); }
    const ferro = new StandardMaterial('lustreFerro', s); ferro.diffuseColor = new Color3(0.12, 0.11, 0.1); ferro.specularColor = new Color3(0.3, 0.3, 0.3);
    const vela = new StandardMaterial('lustreVela', s); vela.diffuseColor = new Color3(0.95, 0.92, 0.82); vela.emissiveColor = new Color3(0.25, 0.22, 0.18);
    const mc = this.mChama = new StandardMaterial('lustreChama', s); mc.disableLighting = true; mc.emissiveColor = new Color3(1, 0.7, 0.3); mc.metadata = { brilha: true, corBasica: new Color3(1, 0.65, 0.25) };
    this.lustre = new TransformNode('lustre', s);
    const aro = CreateTorus('aro', { diameter: 1.6, thickness: 0.06, tessellation: 28 }, s); aro.material = ferro; aro.parent = this.lustre;
    const aro2 = CreateTorus('aro2', { diameter: 0.9, thickness: 0.05, tessellation: 22 }, s); aro2.position.y = 0.35; aro2.material = ferro; aro2.parent = this.lustre;
    const haste = CreateCylinder('haste', { height: 2.4, diameter: 0.05, tessellation: 6 }, s); haste.position.y = 1.2; haste.material = ferro; haste.parent = this.lustre;
    for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; const v = CreateCylinder('vela', { height: 0.22, diameter: 0.07, tessellation: 6 }, s); v.position.set(Math.cos(a) * 0.8, 0.13, Math.sin(a) * 0.8); v.material = vela; v.parent = this.lustre;
      const c = CreateCylinder('chamaV', { height: 0.13, diameterTop: 0, diameterBottom: 0.07, tessellation: 5 }, s); c.position.set(Math.cos(a) * 0.8, 0.31, Math.sin(a) * 0.8); c.material = mc; c.parent = this.lustre; this.chamas.push(c); }
    for (const m of this.lustre.getChildMeshes()) m.isPickable = false;
    this.lustre.setEnabled(false);
    const tx = new DynamicTexture('poeira', 32, s, true); const c = tx.getContext() as unknown as CanvasRenderingContext2D; const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 32, 32); tx.hasAlpha = true; tx.update(true);
    const ps = this.poeira = new ParticleSystem('poeira', 160, s); ps.particleTexture = tx; ps.blendMode = ParticleSystem.BLENDMODE_ADD; ps.emitter = Vector3.Zero();
    ps.color1 = new Color4(1, 0.9, 0.7, 0.35); ps.color2 = new Color4(1, 0.85, 0.6, 0.2); ps.colorDead = new Color4(1, 0.8, 0.6, 0); ps.minSize = 0.03; ps.maxSize = 0.07; ps.minLifeTime = 4; ps.maxLifeTime = 8; ps.emitRate = 22;
    ps.gravity = new Vector3(0, 0.02, 0); ps.direction1 = new Vector3(-0.15, -0.05, -0.15); ps.direction2 = new Vector3(0.15, 0.08, 0.15); ps.minEmitPower = 0.05; ps.maxEmitPower = 0.15; ps.updateSpeed = 0.016;
  }

  private entrar(R: T3, nivel: string) {
    let key = ''; const I = jogo('INT86'); if (I && I.rooms) for (const k in I.rooms) if (I.rooms[k] === R) key = k;
    const salao = SALOES.test(key) || (R.w * R.d > 180); const h = R.h || 4;
    const L0 = this.luzes[0], L1 = this.luzes[1]; const raio = Math.max(R.w, R.d) * 0.6 + 6;
    L0.position.set(R.ox - R.w * 0.22, h - 0.9, R.oz); L1.position.set(R.ox + R.w * 0.22, h - 0.9, R.oz);
    for (const l of this.luzes) { l.range = raio; l.setEnabled(nivel !== 'muitobaixo'); }
    L1.setEnabled(nivel !== 'muitobaixo' && nivel !== 'baixo' && R.w > 8);
    if (salao && h > 3.2) { this.lustre.position.set(R.ox, h - 1.6, R.oz); this.lustre.setEnabled(true); } else this.lustre.setEnabled(false);
    const ps = this.poeira; ps.minEmitBox = new Vector3(-R.w * 0.45, 0.3, -R.d * 0.45); ps.maxEmitBox = new Vector3(R.w * 0.45, h - 0.5, R.d * 0.45); (ps.emitter as Vector3).set(R.ox, 0, R.oz);
    ps.emitRate = Math.min(40, R.w * R.d * 0.12); if (nivel === 'medio' || nivel === 'alto' || nivel === 'ultra') ps.start();
    this.vinheta?.(true); this.dentro = true; this.sujar();
  }
  private sair() { for (const l of this.luzes) l.setEnabled(false); this.lustre.setEnabled(false); this.poeira.stop(); this.vinheta?.(false); this.dentro = false; this.sujar(); }
  /** avisa os materiais que as luzes mudaram (senão eles continuam usando as luzes de antes) */
  private sujar() { for (const m of this.s.meshes) (m as any)._resyncLightSources?.(); this.s.markAllMaterialsAsDirty(Constants.MATERIAL_LightDirtyFlag); }

  atualizar(dt: number, nivel: string) {
    const I = jogo('INT86'); const R = I && I.on ? I.cur : null;
    if (R !== this.atual) { if (this.atual) this.sair(); this.atual = R; if (R && typeof R.ox === 'number') this.entrar(R, nivel); }
    if (!this.dentro) return;
    this.t += dt; const f = 1 + Math.sin(this.t * 9) * 0.04 + Math.sin(this.t * 23) * 0.03;
    this.luzes[0].intensity = 1.45 * f; this.luzes[1].intensity = 1.2 * (2 - f);
    // lugar fechado: o sol e o céu iluminam bem menos (a luz quente das velas é que manda)
    for (const l of this.s.lights) if (l.name === 'ceuLuz' || l.name === 'sol') l.intensity *= nivel === 'muitobaixo' ? 0.8 : 0.5;
    for (let i = 0; i < this.chamas.length; i++) this.chamas[i].scaling.y = 0.85 + Math.sin(this.t * 14 + i * 1.7) * 0.18;
    this.lustre.rotation.y = Math.sin(this.t * 0.4) * 0.05;
  }
}
