// Vilas e castelos com visual novo (Babylon nativo):
// - janelas acendem à noite (luz quente; nem todas as casas acendem, como numa vila de verdade)
// - lampião de ferro ao lado de cada porta (dois nos prédios importantes), que brilha à noite
// - degrau de pedra na entrada e vaso de flores nas casas
// - fumaça saindo de algumas chaminés/telhados nas vilas
// Tudo usa as posições de porta que o jogo já registra; nada muda na lógica. Desenhado por setores, só perto do jogador.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Material } from '@babylonjs/core/Materials/material';
import { MaterialPluginBase } from '@babylonjs/core/Materials/materialPluginBase';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { UniformBuffer } from '@babylonjs/core/Materials/uniformBuffer';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Clima } from './clima';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

/** janelas do jogo (vidro azul-escuro 0x2c3a4c) ganham luz à noite, direto no shader do cenário */
export class JanelaPlugin extends MaterialPluginBase {
  static noite = 0;
  constructor(m: Material) { super(m, 'Janela', 210, { JANELA: false }); this._enable(true); }
  prepareDefines(d: any) { d.JANELA = true; }
  getClassName() { return 'JanelaPlugin'; }
  getUniforms() { return { ubo: [{ name: 'janelaN', size: 1, type: 'float' }, { name: 'chuvaK', size: 1, type: 'float' }], fragment: 'uniform float janelaN; uniform float chuvaK;' }; }
  bindForSubMesh(ubo: UniformBuffer) { ubo.updateFloat('janelaN', JanelaPlugin.noite); ubo.updateFloat('chuvaK', Clima.chuva); }
  getCustomCode(tipo: string): any {
    if (tipo !== 'fragment') return null;
    return {
      CUSTOM_FRAGMENT_BEFORE_FOG: `
#if defined(JANELA)
  color.rgb *= 1.0 - 0.16 * chuvaK; // cenário molhado na chuva
#endif
#if defined(JANELA) && defined(VERTEXCOLOR)
  if (janelaN > 0.01) {
    vec3 jc = vColor.rgb;
    if (distance(jc, vec3(0.1725, 0.2275, 0.2980)) < 0.025) {
      float jr = fract(sin(dot(floor(vPositionW.xz * 0.12), vec2(12.9898, 78.233))) * 43758.5453);
      float jf = 0.85 + 0.15 * sin(vPositionW.y * 3.0 + jr * 20.0);
      if (jr < 0.86) color.rgb = mix(color.rgb, vec3(1.0, 0.74, 0.38) * 1.6 * jf, janelaN);
    }
  }
#endif
`,
    };
  }
}

const SET = 160;
interface Setor { x: number; z: number; ms: Mesh[]; fumacas: ParticleSystem[]; }

export class Vilas {
  pronto = false; private setores = new Map<number, Setor>(); private vidro!: StandardMaterial; private plugados = new WeakSet<Material>(); private q = 0; total = 0;
  private texF: DynamicTexture | null = null;
  constructor(private s: Scene) {}

  private montar() {
    const D: T3[] = jogo('DOORS86'); const P = jogo('P'); const WB = jogo('WB83');
    if (!D || D.length < 20 || !P || !P.on || !WB || WB.x1 - WB.x0 < 300) return false;
    const s = this.s;
    const ferro = new StandardMaterial('vilaFerro', s); ferro.diffuseColor = new Color3(0.13, 0.12, 0.12); ferro.specularColor = new Color3(0.3, 0.3, 0.3);
    const vidro = this.vidro = new StandardMaterial('vilaLampiao', s); vidro.diffuseColor = new Color3(0.9, 0.75, 0.45); vidro.emissiveColor = new Color3(0.25, 0.18, 0.08); vidro.metadata = { brilha: true, corBasica: new Color3(1, 0.7, 0.35) };
    const pedra = new StandardMaterial('vilaPedra', s); pedra.diffuseColor = new Color3(0.55, 0.53, 0.5); pedra.specularColor = new Color3(0.05, 0.05, 0.05);
    const barro = new StandardMaterial('vilaVaso', s); barro.diffuseColor = new Color3(1, 1, 1); barro.specularColor = new Color3(0.04, 0.04, 0.04);
    // peças (origem no chão da porta, frente da casa = +z local)
    const juntar = (ps: Mesh[], mt: StandardMaterial) => { for (const m of ps) m.bakeCurrentTransformIntoVertices(); const r = Mesh.MergeMeshes(ps, true, true)!; r.material = mt; r.isVisible = false; r.setEnabled(false); return r; };
    const bx = (w: number, h: number, d: number, x: number, y: number, z: number) => { const b = CreateBox('b', { width: w, height: h, depth: d }, s); b.position.set(x, y, z); return b; };
    const suporte = juntar([bx(0.05, 0.05, 0.42, 0, 2.55, -0.2), bx(0.05, 0.4, 0.05, 0, 2.38, 0), bx(0.26, 0.04, 0.26, 0, 2.18, 0), bx(0.3, 0.05, 0.3, 0, 1.86, 0), (() => { const c = CreateCylinder('t', { height: 0.1, diameterTop: 0, diameterBottom: 0.34, tessellation: 4 }, s); c.position.set(0, 2.25, 0); c.rotation.y = Math.PI / 4; return c; })()], ferro);
    const luz = juntar([bx(0.2, 0.28, 0.2, 0, 2.02, 0)], vidro);
    const degrau = juntar([bx(1.7, 0.12, 0.85, 0, 0.06, 0)], pedra);
    const vaso = (() => { const v = CreateCylinder('v', { height: 0.42, diameterTop: 0.5, diameterBottom: 0.34, tessellation: 9 }, s); v.position.y = 0.21; const cv: number[] = []; for (let i = 0; i < v.getTotalVertices(); i++) cv.push(0.62, 0.33, 0.2, 1); v.setVerticesData('color', cv);
      const fl: Mesh[] = [v]; const cores = [[0.95, 0.35, 0.45], [0.98, 0.85, 0.3], [0.7, 0.45, 0.95], [1, 1, 1]];
      for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; const f = CreateIcoSphere('f', { radius: 0.11, subdivisions: 1, flat: true }, s); f.position.set(Math.cos(a) * 0.14, 0.52 + (i % 2) * 0.06, Math.sin(a) * 0.14); const c = i % 3 === 0 ? [0.3, 0.6, 0.25] : cores[i % 4]; const cc: number[] = []; for (let k = 0; k < f.getTotalVertices(); k++) cc.push(c[0], c[1], c[2], 1); f.setVerticesData('color', cc); fl.push(f); }
      return juntar(fl, barro); })();
    const tipos: Record<string, Mesh> = { suporte, luz, degrau, vaso };
    const por = new Map<number, Record<string, number[]>>(); const q = new Quaternion(), m = new Matrix(), um = new Vector3(1, 1, 1), p = new Vector3();
    const add = (tipo: string, x: number, y: number, z: number, ry: number, sc = 1) => { const si = Math.floor((x + 2000) / SET), sj = Math.floor((z + 2000) / SET), k = sj * 1000 + si; let o = por.get(k); if (!o) por.set(k, o = {});
      Quaternion.RotationYawPitchRollToRef(ry, 0, 0, q); p.set(x, y, z); um.setAll(sc); Matrix.ComposeToRef(um, q, p, m); const a = o[tipo] || (o[tipo] = []); for (let i = 0; i < 16; i++) a.push(m.m[i]); };
    const casas = new Set(['cottage', 'two', 'stone', 'merchant', 'rich', 'tudor']);
    for (const d of D) {
      if (d.x > WB.x1 + 50 || d.x < WB.x0 - 50 || d.z > WB.z1 + 50 || d.z < WB.z0 - 50) continue; // portas dentro dos interiores
      const ry = d.ry || 0, fx = Math.sin(ry), fz = Math.cos(ry), lx = Math.cos(ry), lz = -Math.sin(ry);
      const parede = (x: number, z: number) => [x - fx * 1.12, z - fz * 1.12];
      const imp = !casas.has(d.kind);
      const lados = imp ? [-1, 1] : [((d.id || 0) % 2) ? 1 : -1];
      for (const s2 of lados) { const [wx, wz] = parede(d.x + lx * s2 * (imp ? 1.6 : 0.95), d.z + lz * s2 * (imp ? 1.6 : 0.95)); add('suporte', wx + fx * 0.22, 0, wz + fz * 0.22, ry); add('luz', wx + fx * 0.22, 0, wz + fz * 0.22, ry); }
      const [sx, sz] = parede(d.x, d.z); add('degrau', sx + fx * 0.45, 0, sz + fz * 0.45, ry, imp ? 1.4 : 1);
      if (!imp && ((d.id || 0) % 3) !== 0) { const s2 = ((d.id || 0) % 2) ? -1 : 1; const [vx, vz] = parede(d.x + lx * s2 * 1.05, d.z + lz * s2 * 1.05); add('vaso', vx + fx * 0.3, 0, vz + fz * 0.3, ry * 3.1); }
      this.total++;
    }
    for (const [k, o] of por) {
      const st: Setor = { x: (k % 1000) * SET - 2000 + SET / 2, z: Math.floor(k / 1000) * SET - 2000 + SET / 2, ms: [], fumacas: [] };
      for (const t in o) { const mm = tipos[t].clone('vila_' + t + '_' + k, null, true, false)!; mm.makeGeometryUnique(); mm.material = tipos[t].material; mm.isVisible = true; mm.setEnabled(true);
        mm.thinInstanceSetBuffer('matrix', new Float32Array(o[t]), 16, true); mm.thinInstanceRefreshBoundingInfo(false); mm.receiveShadows = t === 'degrau'; mm.isPickable = false; mm.freezeWorldMatrix(); st.ms.push(mm); }
      this.setores.set(k, st);
    }
    for (const k in tipos) tipos[k].dispose();
    this.fumacas(D, WB);
    this.pronto = true; return true;
  }

  /** fumaça de chaminé em algumas casas (só nas próximas, e só nos níveis médio para cima) */
  private fumacas(D: T3[], WB: T3) {
    const s = this.s; const t = this.texF = new DynamicTexture('fumacaVila', 64, s, true); const c = t.getContext() as unknown as CanvasRenderingContext2D;
    for (let i = 0; i < 6; i++) { const x = 18 + Math.random() * 28, y = 18 + Math.random() * 28, r = 12 + Math.random() * 10; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 64, 64); }
    t.hasAlpha = true; t.update(true);
    const casas = D.filter(d => ['cottage', 'two', 'stone', 'tudor'].includes(d.kind) && d.x < WB.x1 && d.x > WB.x0 && d.z < WB.z1 && d.z > WB.z0 && (d.id % 4) === 1);
    for (const d of casas) {
      const ry = d.ry || 0; const x = d.x - Math.sin(ry) * 4.2, z = d.z - Math.cos(ry) * 4.2; const k = Math.floor((z + 2000) / SET) * 1000 + Math.floor((x + 2000) / SET); const st = this.setores.get(k); if (!st) continue;
      const ps = new ParticleSystem('fumaca', 26, s); ps.particleTexture = t; ps.blendMode = ParticleSystem.BLENDMODE_STANDARD; ps.emitter = new Vector3(x + Math.cos(ry) * 1.2, 6.2, z - Math.sin(ry) * 1.2);
      ps.minEmitBox = new Vector3(-0.15, 0, -0.15); ps.maxEmitBox = new Vector3(0.15, 0, 0.15); ps.color1 = new Color4(0.75, 0.74, 0.72, 0.4); ps.color2 = new Color4(0.6, 0.6, 0.6, 0.3); ps.colorDead = new Color4(0.6, 0.6, 0.6, 0);
      ps.minSize = 0.5; ps.maxSize = 1.2; ps.minLifeTime = 2.5; ps.maxLifeTime = 4; ps.emitRate = 5; ps.gravity = new Vector3(0.25, 0.5, 0.1); ps.direction1 = new Vector3(-0.1, 0.6, -0.1); ps.direction2 = new Vector3(0.1, 1, 0.1);
      ps.minEmitPower = 0.3; ps.maxEmitPower = 0.6; ps.addSizeGradient(0, 0.4); ps.addSizeGradient(1, 1.8); ps.minAngularSpeed = -0.4; ps.maxAngularSpeed = 0.4; ps.updateSpeed = 0.016; st.fumacas.push(ps);
    }
  }

  atualizar(_dt: number, nivel: string, cam: Vector3) {
    if (!this.pronto) { if (++this.q % 40 === 2) this.montar(); return; }
    this.q++;
    // noite: janelas e lampiões acendem
    const W = (window as any).W113; const dia = W && typeof W.dayK === 'number' ? W.dayK : 1; const noite = Math.max(0, Math.min(1, (0.75 - dia) / 0.6));
    JanelaPlugin.noite = nivel === 'muitobaixo' ? 0 : noite;
    const k = 0.25 + noite * 1.7; this.vidro.emissiveColor.set(1 * k, 0.72 * k, 0.36 * k); this.vidro.metadata.corBasica = noite > 0.2 ? new Color3(1, 0.7, 0.35) : new Color3(0, 0, 0);
    if (this.q % 30 === 3) for (const m of this.s.materials) if (!this.plugados.has(m) && m.metadata && m.metadata.cat && m instanceof StandardMaterial) { new JanelaPlugin(m); this.plugados.add(m); }
    if (this.q % 10 !== 0) return;
    const alc = ({ muitobaixo: 90, baixo: 130, medio: 180, alto: 240, ultra: 320 } as Record<string, number>)[nivel] || 180;
    const fum = nivel === 'medio' || nivel === 'alto' || nivel === 'ultra';
    for (const st of this.setores.values()) {
      const d = Math.hypot(st.x - cam.x, st.z - cam.z) - SET * 0.7; const v = d < alc;
      for (const m of st.ms) if (m.isEnabled(false) !== v) m.setEnabled(v);
      const fv = fum && d < 70; for (const ps of st.fumacas) { if (fv && !ps.isStarted()) ps.start(); else if (!fv && ps.isStarted()) ps.stop(); }
    }
  }
  get info() { return this.pronto ? { portas: this.total, setores: this.setores.size, noite: +JanelaPlugin.noite.toFixed(2) } : null; }
}
