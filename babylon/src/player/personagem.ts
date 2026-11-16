// Personagem novo: esqueleto de articulações (quadril, tronco, pescoço, cabeça, ombros, cotovelos, joelhos, pés)
// com peças arredondadas, rosto com olhos e sobrancelhas, cabelo espetado original, capa, botas e cinto com grimório.
// Animações por código: parado (respiração), andar, correr, pular, cair, aterrissar e esquiva com rolamento.
import { Color3, Mesh, MeshBuilder, Scene, StandardMaterial, TransformNode, Vector3, AbstractMesh } from '@babylonjs/core';

export interface Visual { cabelo: string; olhos: string; pele: string; roupa: string; calca: string; capa: string }
export const VISUAL_PADRAO: Visual = { cabelo: '#2a2a33', olhos: '#3a8a5a', pele: '#e9c3a0', roupa: '#2e3a5a', calca: '#3a3026', capa: '#1c1c22' };

type Estado = 'parado' | 'andando' | 'correndo' | 'pulando' | 'caindo' | 'esquiva';

export class Personagem {
  raiz: TransformNode; corpo: TransformNode; malhas: AbstractMesh[] = [];
  private j: Record<string, TransformNode> = {}; private t = 0; private esqT = 0; private pouso = 0; private capa!: Mesh;
  estado: Estado = 'parado';

  constructor(private s: Scene, v: Visual = VISUAL_PADRAO) {
    this.raiz = new TransformNode('jogador', s);
    this.corpo = new TransformNode('corpo', s); this.corpo.parent = this.raiz;
    const mat = (n: string, c: string, sp = 0.05, em = 0) => { const m = new StandardMaterial('pj_' + n, s); m.diffuseColor = Color3.FromHexString(c); m.specularColor = new Color3(sp, sp, sp); if (em) m.emissiveColor = Color3.FromHexString(c).scale(em); return m; };
    const M = { pele: mat('pele', v.pele, 0.08), roupa: mat('roupa', v.roupa), calca: mat('calca', v.calca), bota: mat('bota', '#3b2a1e', 0.2), cinto: mat('cinto', '#5a3b20', 0.2), metal: mat('metal', '#c9a24a', 0.6),
      cabelo: mat('cabelo', v.cabelo, 0.15), olhoB: mat('olhoB', '#ffffff', 0.3), iris: mat('iris', v.olhos, 0.5, 0.15), escuro: mat('escuro', '#1a1414'), capa: mat('capa', v.capa, 0.05), livro: mat('livro', '#7a2a2a', 0.2) };
    M.capa.backFaceCulling = false;
    const no = (n: string, pai: TransformNode, x: number, y: number, z: number) => { const t = new TransformNode(n, s); t.parent = pai; t.position.set(x, y, z); this.j[n] = t; return t; };
    const peca = (m: Mesh, pai: TransformNode, mt: StandardMaterial, x = 0, y = 0, z = 0) => { m.parent = pai; m.position.set(x, y, z); m.material = mt; this.malhas.push(m); return m; };
    const cap = (h: number, r: number, rt?: number) => MeshBuilder.CreateCapsule('c', { height: h, radius: r, radiusTop: rt ?? r, tessellation: 12, subdivisions: 2 }, s);

    // quadril e pernas
    const quad = no('quadril', this.corpo, 0, 0.98, 0);
    peca(cap(0.42, 0.2), quad, M.calca, 0, 0.02, 0).scaling.set(1.45, 1, 0.95);
    peca(MeshBuilder.CreateTorus('cinto', { diameter: 0.5, thickness: 0.07, tessellation: 20 }, s), quad, M.cinto, 0, 0.1, 0).scaling.set(1.12, 1, 0.85);
    peca(MeshBuilder.CreateBox('fivela', { width: 0.1, height: 0.08, depth: 0.04 }, s), quad, M.metal, 0, 0.1, 0.22);
    const liv = peca(MeshBuilder.CreateBox('grimorio', { width: 0.24, height: 0.3, depth: 0.08 }, s), quad, M.livro, 0.3, -0.02, 0.02); liv.rotation.z = -0.12;
    for (const lado of [1, -1]) {
      const n = lado > 0 ? 'E' : 'D';
      const coxa = no('coxa' + n, quad, lado * 0.13, -0.05, 0); peca(cap(0.5, 0.095, 0.085), coxa, M.calca, 0, -0.22, 0);
      const can = no('canela' + n, coxa, 0, -0.46, 0); peca(cap(0.48, 0.085, 0.075), can, M.calca, 0, -0.2, 0);
      peca(cap(0.3, 0.1, 0.095), can, M.bota, 0, -0.32, 0);
      const pe = no('pe' + n, can, 0, -0.44, 0); const b = peca(cap(0.3, 0.075), pe, M.bota, 0, -0.02, 0.07); b.rotation.x = Math.PI / 2;
    }
    // tronco
    const col = no('tronco', quad, 0, 0.16, 0);
    const torso = peca(cap(0.62, 0.21, 0.24), col, M.roupa, 0, 0.3, 0); torso.scaling.set(1.25, 1, 0.82);
    peca(MeshBuilder.CreateBox('gola', { width: 0.36, height: 0.08, depth: 0.28 }, s), col, M.cinto, 0, 0.58, 0);
    // capa (balança com o movimento)
    this.capa = peca(MeshBuilder.CreatePlane('capa', { width: 0.62, height: 0.95 }, s), col, M.capa, 0, 0.12, -0.21);
    this.capa.setPivotPoint(new Vector3(0, 0.47, 0)); this.capa.rotation.x = 0.1;
    for (const lado of [1, -1]) peca(MeshBuilder.CreateSphere('broche', { diameter: 0.07, segments: 8 }, s), col, M.metal, lado * 0.2, 0.55, 0.1);
    // braços
    for (const lado of [1, -1]) {
      const n = lado > 0 ? 'E' : 'D';
      const omb = no('ombro' + n, col, lado * 0.3, 0.5, 0); peca(MeshBuilder.CreateSphere('o', { diameter: 0.2, segments: 10 }, s), omb, M.roupa);
      peca(cap(0.4, 0.07, 0.065), omb, M.roupa, 0, -0.18, 0);
      const cot = no('cotovelo' + n, omb, 0, -0.36, 0); peca(cap(0.36, 0.06, 0.055), cot, M.pele, 0, -0.16, 0);
      peca(MeshBuilder.CreateTorus('punho', { diameter: 0.13, thickness: 0.035, tessellation: 14 }, s), cot, M.roupa, 0, -0.06, 0);
      const mao = no('mao' + n, cot, 0, -0.34, 0); peca(MeshBuilder.CreateSphere('m', { diameter: 0.12, segments: 8 }, s), mao, M.pele).scaling.set(0.9, 1.15, 0.7);
    }
    // cabeça e rosto
    const pes = no('pescoco', col, 0, 0.62, 0); peca(cap(0.16, 0.06), pes, M.pele, 0, 0.04, 0);
    const cab = no('cabeca', pes, 0, 0.12, 0);
    peca(MeshBuilder.CreateSphere('cranio', { diameter: 0.38, segments: 20 }, s), cab, M.pele, 0, 0.16, 0).scaling.set(0.92, 1.05, 0.95);
    peca(MeshBuilder.CreateSphere('queixo', { diameter: 0.24, segments: 14 }, s), cab, M.pele, 0, 0.06, 0.04).scaling.set(1, 0.8, 1);
    for (const lado of [1, -1]) {
      peca(MeshBuilder.CreateSphere('olho', { diameter: 0.075, segments: 10 }, s), cab, M.olhoB, lado * 0.068, 0.17, 0.15).scaling.set(1, 1.25, 0.5);
      peca(MeshBuilder.CreateSphere('iris', { diameter: 0.045, segments: 10 }, s), cab, M.iris, lado * 0.068, 0.165, 0.172).scaling.set(1, 1.3, 0.4);
      peca(MeshBuilder.CreateSphere('pupila', { diameter: 0.02, segments: 6 }, s), cab, M.escuro, lado * 0.068, 0.165, 0.18);
      const so = peca(MeshBuilder.CreateBox('sobr', { width: 0.08, height: 0.016, depth: 0.02 }, s), cab, M.cabelo, lado * 0.07, 0.225, 0.165); so.rotation.z = -lado * 0.18;
      peca(MeshBuilder.CreateSphere('orelha', { diameter: 0.07, segments: 8 }, s), cab, M.pele, lado * 0.175, 0.15, 0).scaling.set(0.5, 1, 0.8);
    }
    peca(MeshBuilder.CreateBox('boca', { width: 0.06, height: 0.012, depth: 0.01 }, s), cab, M.escuro, 0, 0.07, 0.155);
    peca(MeshBuilder.CreateSphere('nariz', { diameter: 0.04, segments: 6 }, s), cab, M.pele, 0, 0.12, 0.175);
    // cabelo espetado (formato próprio do Clover RP)
    peca(MeshBuilder.CreateSphere('cabeloBase', { diameter: 0.41, segments: 16, slice: 0.55 }, s), cab, M.cabelo, 0, 0.19, -0.01).scaling.set(0.98, 1.05, 1);
    const espetos: [number, number, number, number, number, number][] = [
      [0, 0.38, -0.02, -0.3, 0, 0.16], [0.1, 0.36, 0.06, 0.4, 0, -0.5], [-0.1, 0.36, 0.06, 0.4, 0, 0.5], [0.16, 0.3, -0.06, 0, 0, -0.95], [-0.16, 0.3, -0.06, 0, 0, 0.95],
      [0.05, 0.36, -0.12, -0.7, 0, -0.3], [-0.05, 0.36, -0.12, -0.7, 0, 0.3], [0, 0.3, -0.17, -1.2, 0, 0], [0.08, 0.32, 0.12, 0.9, 0, -0.3], [-0.06, 0.32, 0.13, 1.0, 0, 0.35], [0.18, 0.22, 0.02, 0.2, 0, -1.3], [-0.18, 0.22, 0.02, 0.2, 0, 1.3],
    ];
    for (const [x, y, z, rx, ry, rz] of espetos) { const c = peca(MeshBuilder.CreateCylinder('esp', { diameterTop: 0, diameterBottom: 0.13, height: 0.24, tessellation: 6 }, s), cab, M.cabelo, x, y, z); c.rotation.set(rx, ry, rz); }
    for (const m of this.malhas) { m.isPickable = false; (m as Mesh).receiveShadows = true; }
  }

  /** atualiza a pose. vel: velocidade horizontal (m/s); noAr; vy: velocidade vertical */
  animar(dt: number, vel: number, noAr: boolean, vy: number) {
    const j = this.j; this.t += dt;
    const ant = this.estado;
    if (this.esqT > 0) { this.esqT -= dt; this.estado = 'esquiva'; }
    else if (noAr) this.estado = vy > 0 ? 'pulando' : 'caindo';
    else this.estado = vel > 6.5 ? 'correndo' : vel > 0.4 ? 'andando' : 'parado';
    if ((ant === 'caindo' || ant === 'pulando') && !noAr) this.pouso = 0.18;
    this.pouso = Math.max(0, this.pouso - dt);
    const L = (a: TransformNode, x: number, y = 0, z = 0, k = 12) => { const f = Math.min(1, dt * k); a.rotation.x += (x - a.rotation.x) * f; a.rotation.y += (y - a.rotation.y) * f; a.rotation.z += (z - a.rotation.z) * f; };
    const e = this.estado; const fr = e === 'correndo' ? 11 : 7.5 * Math.max(0.6, vel / 4); const p = this.t * fr;
    let bob = 0, incl = 0, perna = 0, braco = 0;
    if (e === 'andando') { perna = 0.55; braco = 0.45; bob = Math.abs(Math.sin(p)) * 0.05; incl = 0.06; }
    if (e === 'correndo') { perna = 0.95; braco = 0.85; bob = Math.abs(Math.sin(p)) * 0.09; incl = 0.28; }
    const sw = Math.sin(p);
    if (e === 'andando' || e === 'correndo') {
      L(j.coxaE, sw * perna); L(j.coxaD, -sw * perna);
      L(j.canelaE, Math.max(0, -Math.cos(p)) * perna * 1.3); L(j.canelaD, Math.max(0, Math.cos(p)) * perna * 1.3);
      L(j.ombroE, -sw * braco, 0, 0.08); L(j.ombroD, sw * braco, 0, -0.08); L(j.cotoveloE, -0.35 - (e === 'correndo' ? 0.9 : 0.2)); L(j.cotoveloD, -0.35 - (e === 'correndo' ? 0.9 : 0.2));
      L(j.tronco, incl, sw * 0.12); L(j.cabeca, -incl * 0.6, -sw * 0.08);
    } else if (e === 'parado') {
      const r = Math.sin(this.t * 1.6);
      L(j.coxaE, 0, 0, 0.03, 6); L(j.coxaD, 0, 0, -0.03, 6); L(j.canelaE, 0.02, 0, 0, 6); L(j.canelaD, 0.02, 0, 0, 6);
      L(j.ombroE, r * 0.03, 0, 0.1, 6); L(j.ombroD, -r * 0.03, 0, -0.1, 6); L(j.cotoveloE, -0.12, 0, 0, 6); L(j.cotoveloD, -0.12, 0, 0, 6);
      L(j.tronco, r * 0.015, 0, 0, 6); L(j.cabeca, -r * 0.02, Math.sin(this.t * 0.4) * 0.15, 0, 3); bob = r * 0.008;
    } else if (e === 'pulando' || e === 'caindo') {
      const k = e === 'pulando' ? 1 : 0.4;
      L(j.coxaE, -0.9 * k, 0, 0.1); L(j.coxaD, -0.2, 0, -0.1); L(j.canelaE, 1.3 * k); L(j.canelaD, 0.5);
      L(j.ombroE, -0.4, 0, 0.9); L(j.ombroD, -0.4, 0, -0.9); L(j.cotoveloE, -0.6); L(j.cotoveloD, -0.6); L(j.tronco, 0.12); L(j.cabeca, -0.05);
    } else if (e === 'esquiva') {
      L(j.coxaE, -1.6, 0, 0, 25); L(j.coxaD, -1.6, 0, 0, 25); L(j.canelaE, 2.2, 0, 0, 25); L(j.canelaD, 2.2, 0, 0, 25);
      L(j.ombroE, -1.2, 0, 0.3, 25); L(j.ombroD, -1.2, 0, -0.3, 25); L(j.tronco, 0.9, 0, 0, 25); L(j.cabeca, 0.4, 0, 0, 25);
    }
    // rolamento da esquiva: o corpo dá uma volta para frente
    if (e === 'esquiva') { const k = 1 - this.esqT / 0.45; this.corpo.rotation.x = k * Math.PI * 2; this.corpo.position.y = Math.sin(k * Math.PI) * 0.35 - 0.25; }
    else { this.corpo.rotation.x = 0; this.corpo.position.y = bob - this.pouso * 0.9; }
    j.quadril.position.y = 0.98 - this.pouso * 0.5;
    // capa: balança com a velocidade e com o ar
    const alvo = 0.1 + Math.min(1.1, vel * 0.09) + (noAr ? 0.5 : 0) + Math.sin(this.t * 3) * 0.04;
    this.capa.rotation.x += (alvo - this.capa.rotation.x) * Math.min(1, dt * 6);
  }
  esquivar() { if (this.esqT <= 0) this.esqT = 0.45; }
  get esquivando() { return this.esqT > 0; }
}
