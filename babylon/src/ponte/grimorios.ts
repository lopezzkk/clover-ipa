// Grimórios em 3D por atributo: emblema em relevo na capa (forma própria de cada atributo), pedra brilhante,
// fragmentos de mana girando em volta e partículas da cor do atributo. Tudo segue o grimório do jogo
// (abrir, fechar, levitar, virar páginas), que continua sendo controlado pelo jogo.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3, Matrix, Quaternion } from '@babylonjs/core/Maths/math.vector';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder';
import { CreatePolyhedron } from '@babylonjs/core/Meshes/Builders/polyhedronBuilder';
import { CreateTorusKnot } from '@babylonjs/core/Meshes/Builders/torusKnotBuilder';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Constants } from '@babylonjs/core/Engines/constants';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

export class Grimorios {
  private raiz: TransformNode; private emb: Record<string, Mesh> = {}; private ouro: StandardMaterial; private fr: Mesh[] = []; private frMat: StandardMaterial;
  private ps: ParticleSystem; private id = ''; private cor = new Color3(1, 1, 1); private capas: { node: TransformNode; gema: Mesh; emb: Mesh | null }[] = [];
  private t = 0; ativo = false;
  constructor(private s: Scene) {
    this.raiz = new TransformNode('grim3d', s);
    const ouro = this.ouro = new StandardMaterial('grimOuro', s); ouro.diffuseColor = new Color3(0.85, 0.66, 0.25); ouro.specularColor = new Color3(1, 0.85, 0.5); ouro.specularPower = 48; ouro.emissiveColor = new Color3(0.12, 0.08, 0.02);
    const fm = this.frMat = new StandardMaterial('grimFrag', s); fm.disableLighting = true; fm.alphaMode = Constants.ALPHA_ADD; fm.alpha = 0.85; fm.emissiveColor = new Color3(1, 1, 1); fm.metadata = { brilha: true, corBasica: fm.emissiveColor };
    for (let i = 0; i < 5; i++) { const f = CreatePolyhedron('frag', { type: 1, size: 0.035 }, s); f.material = fm; f.isPickable = false; f.parent = this.raiz; this.fr.push(f); }
    // partículas
    const tx = new DynamicTexture('grimPt', 32, s, false); const c = tx.getContext() as CanvasRenderingContext2D; const g = c.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, 32, 32); tx.update(); tx.hasAlpha = true;
    const ps = this.ps = new ParticleSystem('grimPs', 60, s); ps.particleTexture = tx; ps.blendMode = ParticleSystem.BLENDMODE_ADD; ps.minSize = 0.02; ps.maxSize = 0.06; ps.minLifeTime = 0.5; ps.maxLifeTime = 1.2; ps.emitRate = 18;
    ps.gravity = new Vector3(0, 0.35, 0); ps.minEmitPower = 0.02; ps.maxEmitPower = 0.08; ps.createSphereEmitter(0.22); ps.emitter = Vector3.Zero(); ps.updateSpeed = 0.016;
    this.setEnabled(false);
  }
  private setEnabled(v: boolean) { this.raiz.setEnabled(v); if (v) { if (!this.ps.isStarted()) this.ps.start(); } else if (this.ps.isStarted()) this.ps.stop(); this.ativo = v; }

  /** emblema em relevo de cada atributo (formas originais, feitas de peças simples) */
  private emblema(id: string, cor: Color3): Mesh {
    const k = id; if (this.emb[k]) return this.emb[k].clone('emb_' + id, null)!;
    const s = this.s; const ps: Mesh[] = []; const add = (m: Mesh) => { m.bakeCurrentTransformIntoVertices(); ps.push(m); return m; };
    const cil = (h: number, r1: number, r2: number) => CreateCylinder('e', { height: h, diameterTop: r1, diameterBottom: r2, tessellation: 10 }, s);
    switch (id) {
      case 'fogo': { const a = cil(0.11, 0, 0.07); a.position.y = 0.02; add(a); const b = cil(0.07, 0, 0.04); b.position.set(0.03, 0.0, 0.01); b.rotation.z = -0.4; add(b); const c = cil(0.07, 0, 0.04); c.position.set(-0.03, 0, 0.01); c.rotation.z = 0.4; add(c); break; }
      case 'agua': case 'sangue': { const a = CreateSphere('e', { diameter: 0.07, segments: 10 }, s); add(a); const b = cil(0.06, 0, 0.068); b.position.y = 0.05; add(b); break; }
      case 'vento': { for (let i = 0; i < 3; i++) { const t = CreateTorus('e', { diameter: 0.05 + i * 0.03, thickness: 0.008, tessellation: 18 }, s); t.rotation.x = Math.PI / 2; t.position.y = i * 0.004; add(t); } break; }
      case 'luz': { for (let i = 0; i < 4; i++) { const b = CreateBox('e', { width: 0.13, height: 0.012, depth: 0.012 }, s); b.rotation.z = i * Math.PI / 4; add(b); } add(CreateSphere('e', { diameter: 0.045, segments: 10 }, s)); break; }
      case 'tempo': { const t = CreateTorus('e', { diameter: 0.11, thickness: 0.01, tessellation: 24 }, s); t.rotation.x = Math.PI / 2; add(t); const h1 = CreateBox('e', { width: 0.008, height: 0.045, depth: 0.008 }, s); h1.position.y = 0.022; add(h1); const h2 = CreateBox('e', { width: 0.032, height: 0.008, depth: 0.008 }, s); h2.position.x = 0.016; add(h2); break; }
      case 'raio': { const pts = [[0.02, 0.05], [-0.02, 0.0], [0.015, 0.0], [-0.02, -0.05]]; for (let i = 0; i < 3; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; const L = Math.hypot(x2 - x1, y2 - y1); const b = CreateBox('e', { width: 0.014, height: L, depth: 0.01 }, s); b.position.set((x1 + x2) / 2, (y1 + y2) / 2, 0); b.rotation.z = Math.atan2(x1 - x2, y2 - y1); add(b); } break; }
      case 'sombra': { const t = CreateTorus('e', { diameter: 0.09, thickness: 0.018, tessellation: 24 }, s); t.rotation.x = Math.PI / 2; add(t); const o = CreateSphere('e', { diameter: 0.07, segments: 10 }, s); o.position.x = 0.022; add(o); break; }
      case 'espacial': { const k2 = CreateTorusKnot('e', { radius: 0.035, tube: 0.007, radialSegments: 48, tubularSegments: 8 }, s); add(k2); break; }
      case 'sonhos': { const a = CreateSphere('e', { diameter: 0.06, segments: 10 }, s); add(a); const t = CreateTorus('e', { diameter: 0.1, thickness: 0.006, tessellation: 20 }, s); t.rotation.set(1.1, 0, 0.3); add(t); break; }
      case 'kotodama': add(CreatePolyhedron('e', { type: 3, size: 0.04 }, s)); break;
      default: add(CreatePolyhedron('e', { type: 1, size: 0.045 }, s));
    }
    const m = Mesh.MergeMeshes(ps, true, true)!; m.material = this.ouro; m.isPickable = false; m.setEnabled(false); this.emb[k] = m; void cor;
    return this.emb[k].clone('emb_' + id, null)!;
  }

  private montar(id: string, capas: number) {
    for (const c of this.capas) { c.node.dispose(); } this.capas = [];
    const G = jogo('GR'); const g = G && G[id]; const hex = g ? g.c : 0x888888; this.cor = new Color3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
    if (id === 'anti') this.cor = new Color3(0.85, 0.12, 0.15);
    const gm = new StandardMaterial('gema_' + id, this.s); gm.diffuseColor = this.cor.scale(0.5); gm.emissiveColor = this.cor.scale(0.9); gm.specularColor = new Color3(1, 1, 1); gm.specularPower = 96; gm.metadata = { brilha: true, corBasica: this.cor };
    for (let i = 0; i < capas; i++) {
      const node = new TransformNode('capa' + i, this.s); node.parent = this.raiz; node.rotationQuaternion = new Quaternion();
      const gema = CreatePolyhedron('gema', { type: 1, size: 0.022 }, this.s); gema.material = gm; gema.parent = node; gema.scaling.set(1, 0.6, 1.3); gema.isPickable = false;
      let emb: Mesh | null = null; if (id !== 'anti' && id !== 'nenhum') { emb = this.emblema(id, this.cor); emb.setEnabled(true); emb.parent = node; emb.rotation.x = Math.PI / 2; }
      this.capas.push({ node, gema, emb });
    }
    this.frMat.emissiveColor = this.cor.clone(); this.frMat.metadata.corBasica = this.cor;
    this.ps.color1 = new Color4(this.cor.r, this.cor.g, this.cor.b, 0.9); this.ps.color2 = new Color4(Math.min(1, this.cor.r + 0.3), Math.min(1, this.cor.g + 0.3), Math.min(1, this.cor.b + 0.3), 0.7); this.ps.colorDead = new Color4(this.cor.r, this.cor.g, this.cor.b, 0);
    this.id = id;
  }

  atualizar(dt: number, nivel: string) {
    const book = jogo('book'); const P = jogo('P'); const G126 = (window as any).G126;
    const id = P && P.g && P.g.id; let vis = !!(book && id && id !== 'nenhum');
    if (vis) { let p = book; while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; } }
    if (!vis || nivel === 'muitobaixo') { if (this.ativo) this.setEnabled(false); return; }
    // capas do jogo: grimórios novos (G126) têm duas capas; o de Anti-Magia usa o próprio grimório
    const capas3: T3[] = []; if (G126 && G126.m && G126.m.visible !== false && G126.id === id) for (const c of G126.m.userData.covers || []) { const cb = c.h.children[0]; if (cb) capas3.push(cb); }
    // Anti-Magia (modelo enviado pelo jogador) e grimórios sem capa nova: só fragmentos e partículas, sem mexer no modelo
    if (id !== this.id || this.capas.length !== capas3.length) this.montar(id, capas3.length);
    if (!this.ativo) this.setEnabled(true);
    this.t += dt;
    const W = Matrix.FromArray(book.matrixWorld.elements); const centro = Vector3.TransformCoordinates(Vector3.Zero(), W);
    for (let i = 0; i < this.capas.length; i++) {
      const c = this.capas[i], o = capas3[i]; const M = Matrix.FromArray(o.matrixWorld.elements);
      // lado de fora da capa (embaixo da caixa da capa no modelo do jogo)
      const L = Matrix.Translation(0, o === book ? 0.05 : -0.024, 0).multiply(M); const sc = new Vector3(); L.decompose(sc, c.node.rotationQuaternion!, c.node.position); c.node.scaling.copyFrom(sc);
      if (o === book) c.node.rotationQuaternion!.multiplyInPlace(Quaternion.RotationAxis(Vector3.Right(), Math.PI));
      const pul = 1 + Math.sin(this.t * 3 + i) * 0.12; c.gema.scaling.set(pul, 0.6 * pul, 1.3 * pul); c.gema.position.set(0, -0.012, 0.13);
      if (c.emb) { c.emb.position.set(0, -0.004, -0.02); c.emb.rotation.x = Math.PI / 2; c.emb.scaling.setAll(1); }
    }
    // fragmentos girando em volta do grimório
    const nF = nivel === 'baixo' ? 2 : nivel === 'medio' ? 3 : 5;
    for (let i = 0; i < this.fr.length; i++) { const f = this.fr[i]; if (i >= nF) { f.setEnabled(false); continue; } f.setEnabled(true); const a = this.t * 1.4 + i * Math.PI * 2 / nF; const r = 0.38 + Math.sin(this.t * 2 + i) * 0.04;
      f.position.set(centro.x + Math.cos(a) * r, centro.y + 0.12 + Math.sin(this.t * 2.2 + i * 1.7) * 0.08, centro.z + Math.sin(a) * r); f.rotation.set(this.t * 2 + i, this.t * 3, 0); }
    (this.ps.emitter as Vector3).copyFrom(centro); this.ps.emitRate = nivel === 'baixo' ? 6 : nivel === 'medio' ? 14 : 24;
  }
}
