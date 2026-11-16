// Personagens novos (jogador, moradores e outros jogadores).
// O corpo novo segue as articulações do modelo do jogo a cada quadro (ombros, cotovelos, quadris, joelhos, cabeça),
// então todas as animações do jogo continuam iguais (andar, magias, golpes, formas) e o que o jogo põe na mão continua no lugar.
// Cores vêm da personalização do jogo (pele, cabelo, olhos, roupa, calça, sapatos); o estilo de cabelo segue o escolhido.
// Peças extras de roupa do jogo (armaduras, coletes, cachecóis...) continuam aparecendo por cima.
// Desempenho: cada tipo de peça é UM mesh com instâncias coloridas — todos os personagens juntos custam poucos desenhos.
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { InstancedMesh } from '@babylonjs/core/Meshes/instancedMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3, Quaternion, Matrix } from '@babylonjs/core/Maths/math.vector';
import { CreateCapsule } from '@babylonjs/core/Meshes/Builders/capsuleBuilder';
import { CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder';
import { CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder';
import { CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder';
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };
const C3 = (m: T3, pad: string) => (m && m.color) ? new Color4(m.color.r, m.color.g, m.color.b, 1) : Color4.FromHexString(pad + 'ff');

// tipos de peça (cada um vira um mesh com instâncias)
type Peca = 'membro' | 'tronco' | 'quadril' | 'cabeca' | 'mao' | 'bota' | 'olhoB' | 'iris' | 'pupila' | 'brilho' | 'boca' | 'sobr' | 'orelha' | 'nariz' | 'gola' | 'cinto' | 'punho' | 'pescoco' | 'cab0' | 'cab1' | 'cab2' | 'cab3';

interface Boneco { rig: T3; inst: Record<string, InstancedMesh[]>; visto: number; cores: string; lod: number; }

export class Personagens {
  private src = new Map<Peca, Mesh>();
  private bonecos = new Map<T3, Boneco>();
  private quadro = 0;
  /** materiais do jogo que o corpo novo substitui (a ponte deixa de desenhar essas peças) */
  corpo = new Set<T3>(); pele = new Set<T3>();
  ativos = 0;
  constructor(private s: Scene, private sombra: (m: AbstractMesh) => void) { this.criarPecas(); }

  private criarPecas() {
    const s = this.s; const mat = new StandardMaterial('pers', s); mat.specularColor = new Color3(0.12, 0.12, 0.12); mat.specularPower = 32;
    const brilho = new StandardMaterial('persBrilho', s); brilho.disableLighting = true; brilho.emissiveColor = new Color3(1, 1, 1);
    const reg = (n: Peca, m: Mesh, mt = mat, sombra = true) => { m.bakeCurrentTransformIntoVertices(); m.material = mt; m.isVisible = true; m.setEnabled(true); m.isPickable = false; m.receiveShadows = true;
      m.registerInstancedBuffer('color', 4); m.instancedBuffers.color = new Color4(1, 1, 1, 1); m.alwaysSelectAsActiveMesh = false; m.position.y = -9999; if (sombra) this.sombra(m); this.src.set(n, m); };
    // membro: cápsula de 1 m apontando para baixo a partir do topo (a escala dá o comprimento e a espessura)
    { const c = CreateCapsule('membro', { height: 1, radius: 0.5, tessellation: 14, subdivisions: 2, capSubdivisions: 5 }, s); c.position.y = -0.5; c.scaling.set(1, 1, 1); reg('membro', c); }
    { const t = CreateCapsule('tronco', { height: 1.15, radius: 0.5, radiusTop: 0.56, tessellation: 18, subdivisions: 3, capSubdivisions: 5 }, s); t.position.y = 0.5; t.scaling.set(1, 1, 0.62); reg('tronco', t); }
    { const q = CreateCapsule('quadril', { height: 0.6, radius: 0.5, tessellation: 16 }, s); q.scaling.set(1, 1, 0.7); reg('quadril', q); }
    { const h = CreateSphere('cabeca', { diameter: 1, segments: 24 }, s); h.scaling.set(0.92, 1.04, 0.96); reg('cabeca', h); }
    { const m = CreateSphere('mao', { diameter: 1, segments: 10 }, s); m.scaling.set(0.8, 1, 0.65); reg('mao', m); }
    { const b = CreateCapsule('bota', { height: 1, radius: 0.32, tessellation: 12 }, s); b.rotation.x = Math.PI / 2; b.position.z = 0.18; b.scaling.set(1, 1, 0.75); reg('bota', b); }
    { const o = CreateSphere('olhoB', { diameter: 1, segments: 12 }, s); o.scaling.set(1, 1.25, 0.45); reg('olhoB', o, mat, false); }
    { const o = CreateSphere('iris', { diameter: 1, segments: 12 }, s); o.scaling.set(1, 1.25, 0.4); reg('iris', o, mat, false); }
    { const o = CreateSphere('pupila', { diameter: 1, segments: 8 }, s); reg('pupila', o, mat, false); }
    { const o = CreateSphere('brilho', { diameter: 1, segments: 6 }, s); reg('brilho', o, brilho, false); }
    { const b = CreateBox('boca', { width: 1, height: 0.22, depth: 0.3 }, s); reg('boca', b, mat, false); }
    { const b = CreateBox('sobr', { width: 1, height: 0.22, depth: 0.3 }, s); reg('sobr', b, mat, false); }
    { const o = CreateSphere('orelha', { diameter: 1, segments: 10 }, s); o.scaling.set(0.45, 1, 0.75); reg('orelha', o, mat, false); }
    { const n = CreateSphere('nariz', { diameter: 1, segments: 8 }, s); n.scaling.set(0.8, 1, 1.1); reg('nariz', n, mat, false); }
    { const g = CreateTorus('gola', { diameter: 1, thickness: 0.22, tessellation: 20 }, s); g.scaling.set(1, 1.6, 0.8); reg('gola', g); }
    { const g = CreateTorus('cinto', { diameter: 1, thickness: 0.12, tessellation: 22 }, s); g.scaling.set(1, 1.4, 0.72); reg('cinto', g); }
    { const g = CreateTorus('punho', { diameter: 1, thickness: 0.28, tessellation: 16 }, s); reg('punho', g); }
    { const p = CreateCylinder('pescoco', { diameterTop: 0.85, diameterBottom: 1, height: 1, tessellation: 12 }, s); p.position.y = 0.5; reg('pescoco', p); }
    // cabelos (unidade = raio da cabeça): 0 espetado · 1 curto com franja · 2 longo · 3 preso
    this.cabelos(reg);
  }

  private cabelos(reg: (n: Peca, m: Mesh) => void) {
    const s = this.s;
    const juntar = (ms: Mesh[]) => { for (const m of ms) m.bakeCurrentTransformIntoVertices(); return Mesh.MergeMeshes(ms, true, true)!; };
    const base = () => { const b = CreateSphere('cb', { diameter: 2.14, segments: 18, slice: 0.5 }, s); b.rotation.x = -0.22; b.position.set(0, 0.16, -0.06); b.scaling.set(1, 1.02, 1.06); return b; };
    const espeto = (x: number, y: number, z: number, rx: number, rz: number, h = 0.7, d = 0.42) => { const c = CreateCylinder('e', { diameterTop: 0, diameterBottom: d, height: h, tessellation: 6 }, s); c.position.set(x, y, z); c.rotation.set(rx, 0, rz); return c; };
    // 0 espetado
    reg('cab0', juntar([base(), espeto(0, 1.05, -0.05, -0.3, 0.1), espeto(0.35, 0.95, 0.2, 0.5, -0.55), espeto(-0.35, 0.95, 0.2, 0.5, 0.55), espeto(0.55, 0.75, -0.15, 0, -1.0), espeto(-0.55, 0.75, -0.15, 0, 1.0),
      espeto(0.15, 0.95, -0.45, -0.8, -0.3), espeto(-0.15, 0.95, -0.45, -0.8, 0.3), espeto(0, 0.75, -0.7, -1.3, 0), espeto(0.25, 0.85, 0.45, 1.0, -0.3, 0.6, 0.36), espeto(-0.2, 0.85, 0.48, 1.1, 0.35, 0.6, 0.36), espeto(0.62, 0.45, 0.05, 0.2, -1.45, 0.55), espeto(-0.62, 0.45, 0.05, 0.2, 1.45, 0.55)]));
    // 1 curto com franja
    { const f = CreateBox('fr', { width: 1.7, height: 0.35, depth: 0.35 }, s); f.position.set(0, 0.62, 0.78); f.rotation.x = 0.35; const l1 = CreateBox('l', { width: 0.3, height: 0.7, depth: 0.5 }, s); l1.position.set(0.82, 0.15, 0.25); const l2 = l1.clone('l2'); l2.position.x = -0.82;
      reg('cab1', juntar([base(), f, l1, l2])); }
    // 2 longo
    { const tr = CreateCapsule('lg', { height: 2.2, radius: 0.85, tessellation: 16 }, s); tr.position.set(0, -0.55, -0.45); tr.scaling.set(1.05, 1, 0.55); const f = CreateBox('fr', { width: 1.6, height: 0.3, depth: 0.3 }, s); f.position.set(0, 0.65, 0.8); f.rotation.x = 0.4;
      reg('cab2', juntar([base(), tr, f])); }
    // 3 preso (rabo de cavalo)
    { const n = CreateSphere('nó', { diameter: 0.6, segments: 10 }, s); n.position.set(0, 0.55, -0.95); const r = CreateCapsule('rabo', { height: 1.5, radius: 0.28, tessellation: 10 }, s); r.position.set(0, -0.1, -1.15); r.rotation.x = 0.35;
      const f = CreateBox('fr', { width: 1.6, height: 0.28, depth: 0.3 }, s); f.position.set(0, 0.68, 0.78); f.rotation.x = 0.35; reg('cab3', juntar([base(), n, r, f])); }
  }

  private inst(b: Boneco, n: Peca, k: number, cor: Color4) {
    const arr = b.inst[n] || (b.inst[n] = []); let i = arr[k];
    if (!i) { i = this.src.get(n)!.createInstance(n + '_i'); i.isPickable = false; i.rotationQuaternion = new Quaternion(); arr[k] = i; }
    i.instancedBuffers.color = cor; if (!i.isEnabled(false)) i.setEnabled(true); return i;
  }

  /** registra quais materiais do jogo o corpo novo substitui */
  private marcar(rig: T3) {
    for (const k of ['mT', 'mC', 'mH', 'mP', 'mS', 'mSh', 'mE', 'mLip']) if (rig[k]) this.corpo.add(rig[k]);
    if (rig.mS) this.pele.add(rig.mS);
    for (const k of ['skm', 'skmO', 'mouth']) if (rig[k]) this.corpo.add(rig[k]);
    if (rig.eyes) for (const e of rig.eyes) e && e.traverse && e.traverse((o: T3) => { if (o.isMesh) this.corpo.add(o); });
  }

  private visivel(o: T3, S3: T3) { let p = o; while (p) { if (p.visible === false) return false; if (p === S3) return true; p = p.parent; } return false; }

  atualizar(S3: T3, cam: Vector3, raioLod: number) {
    this.quadro++; const lista: T3[] = [];
    const PP = jogo('PP'); if (PP && PP.legs) lista.push(PP);
    for (const n of jogo('NPCS') || []) if (n && n.legs) lista.push(n);
    const MP = jogo('MP'); if (MP && MP.others) for (const k in MP.others) { const o = MP.others[k]; const r = o && (o.legs ? o : o.p && o.p.legs ? o.p : null); if (r) lista.push(r); }
    // inimigos humanos (bandidos, cavaleiros, chefes) usam o mesmo corpo base do jogo
    for (const e of jogo('enemies') || []) { const L = e && e.L; if (L && L.g && L.legs && L.legs.length === 2 && L.arms && L.arms.length === 2 && L.eyes && L.eyes.length === 2 && L.mT) lista.push(L); }
    let ativos = 0;
    for (const rig of lista) {
      if (!rig.g || !this.visivel(rig.g, S3)) continue;
      let b = this.bonecos.get(rig); if (!b) { b = { rig, inst: {}, visto: 0, cores: '', lod: 0 }; this.bonecos.set(rig, b); this.marcar(rig); }
      const e = rig.g.matrixWorld.elements; const d = Math.hypot(e[12] - cam.x, e[14] - cam.z);
      if (d > raioLod * 2.2) continue; // longe demais: o jogo já esconde detalhes
      b.lod = d > raioLod ? 2 : 1;
      if (b.lod === 2 && (this.quadro + (b.visto & 3)) % 3 !== 0 && b.visto > 0) { b.visto = this.quadro; this.manter(b); ativos++; continue; } // longe: atualiza 1 a cada 3 quadros
      b.visto = this.quadro; this.montar(b); ativos++;
    }
    // esconde quem não apareceu
    for (const [rig, b] of this.bonecos) if (b.visto !== this.quadro) { for (const k in b.inst) for (const i of b.inst[k]) if (i && i.isEnabled(false)) i.setEnabled(false); if (this.quadro - b.visto > 900 && !rig.g.parent) { for (const k in b.inst) for (const i of b.inst[k]) i && i.dispose(); this.bonecos.delete(rig); } }
    this.ativos = ativos;
  }
  private manter(b: Boneco) { for (const k in b.inst) for (const i of b.inst[k]) if (i && !i.isEnabled(false)) i.setEnabled(true); }

  private montar(b: Boneco) {
    const r = b.rig; const W = (o: T3) => new Vector3(o.matrixWorld.elements[12], o.matrixWorld.elements[13], o.matrixWorld.elements[14]);
    const local = (o: T3, x: number, y: number, z: number) => Vector3.TransformCoordinates(new Vector3(x, y, z), Matrix.FromArray(o.matrixWorld.elements));
    const pele = C3(r.mS, '#f1c9a0'), topo = C3(r.mT, '#a9825a'), gola = C3(r.mC, '#7a5a3a'), calca = C3(r.mP, '#3a2f2a'), bota = C3(r.mSh, '#3a2418'), cab = C3(r.mH, '#2a2018'), olho = C3(r.mE, '#2a6fd0'), lab = r.mLip ? C3(r.mLip, '#da9279') : new Color4(pele.r * 0.85, pele.g * 0.6, pele.b * 0.55, 1);
    const esc = Math.hypot(r.g.matrixWorld.elements[0], r.g.matrixWorld.elements[1], r.g.matrixWorld.elements[2]) || 1;
    // segmento de A até B (cápsula pelo topo), espessura em metros
    const seg = (n: Peca, k: number, A: Vector3, B: Vector3, esp: number, cor: Color4) => { const i = this.inst(b, n, k, cor); const d = B.subtract(A); const L = d.length() || 0.001; i.position.copyFrom(A);
      Quaternion.FromUnitVectorsToRef(new Vector3(0, -1, 0), d.scale(1 / L), i.rotationQuaternion!); i.scaling.set(esp, L + esp * 0.35, esp); return i; };
    const ponto = (n: Peca, k: number, P: Vector3, sz: number, q: Quaternion, cor: Color4, sx = 1, sy = 1, sz2 = 1) => { const i = this.inst(b, n, k, cor); i.position.copyFrom(P); i.rotationQuaternion!.copyFrom(q); i.scaling.set(sz * sx, sz * sy, sz * sz2); return i; };
    // orientação do corpo (raiz) e da cabeça
    const qRaiz = new Quaternion(); Matrix.FromArray(r.root ? r.root.matrixWorld.elements : r.g.matrixWorld.elements).decompose(undefined, qRaiz);
    // braços: ombro → cotovelo → mão
    let k = 0;
    for (const lado of [0, 1]) {
      const a = r.arms[lado]; if (!a || !a[0] || !a[1]) continue;
      const S = W(a[0]), E = W(a[1]), H = local(a[1], 0, -0.3, 0);
      seg('membro', k, S, E, 0.13 * esc, topo); seg('membro', k + 1, E, H, 0.105 * esc, pele);
      const pu = this.inst(b, 'punho', lado, topo); pu.position.copyFrom(E.add(H.subtract(E).scale(0.12))); Quaternion.FromUnitVectorsToRef(new Vector3(0, 1, 0), H.subtract(E).normalize(), pu.rotationQuaternion!); pu.scaling.setAll(0.12 * esc);
      const qm = new Quaternion(); Matrix.FromArray(a[1].matrixWorld.elements).decompose(undefined, qm); ponto('mao', lado, H.add(H.subtract(E).normalize().scale(0.03 * esc)), 0.11 * esc, qm, pele);
      k += 2;
    }
    // pernas: quadril → joelho → pé
    let hipC = Vector3.Zero(); let nh = 0;
    for (const lado of [0, 1]) {
      const l = r.legs[lado]; if (!l || !l[0] || !l[1]) continue;
      const Hq = W(l[0]), K = W(l[1]); const comp = Vector3.Distance(Hq, K) * 1.02; const F = local(l[1], 0, -comp * 1.62 / esc, 0);
      seg('membro', k, Hq, K, 0.16 * esc, calca); seg('membro', k + 1, K, F, 0.13 * esc, calca); k += 2;
      const qp = new Quaternion(); Matrix.FromArray(l[1].matrixWorld.elements).decompose(undefined, qp); const bt = ponto('bota', lado, F.add(new Vector3(0, 0.02, 0)), 0.3 * esc, qp, bota, 0.55, 1, 1); void bt;
      hipC = hipC.add(Hq); nh++;
    }
    if (nh) hipC.scaleInPlace(1 / nh);
    // tronco: do quadril até a linha dos ombros, virado como o corpo
    const SL = r.arms[0] && r.arms[0][0] ? W(r.arms[0][0]) : hipC.add(new Vector3(0, 0.7, 0)), SR = r.arms[1] && r.arms[1][0] ? W(r.arms[1][0]) : SL;
    const ombC = SL.add(SR).scale(0.5); const larg = Math.max(0.3, Vector3.Distance(SL, SR));
    const up = ombC.subtract(hipC); const alt = up.length(); const fwd = Vector3.TransformNormal(new Vector3(0, 0, 1), Matrix.FromArray(r.root ? r.root.matrixWorld.elements : r.g.matrixWorld.elements)).normalize();
    const qT = Quaternion.FromLookDirectionRH ? Quaternion.FromLookDirectionRH(fwd, up.normalize()) : qRaiz;
    const tr = this.inst(b, 'tronco', 0, topo); tr.position.copyFrom(hipC.add(up.scale(0.08))); tr.rotationQuaternion!.copyFrom(qT); tr.scaling.set(larg * 0.86, alt * 0.84, larg * 0.86);
    ponto('quadril', 0, hipC.add(up.scale(0.02)), 1, qT, calca, larg * 0.78, alt * 0.38, larg * 0.78);
    ponto('cinto', 0, hipC.add(up.scale(0.16)), 1, qT, gola, larg * 0.74, 1, larg * 0.74);
    ponto('gola', 0, ombC.add(up.normalize().scale(0.02)), 1, qT, gola, larg * 0.42, 1, larg * 0.42);
    // cabeça: pelos olhos do jogo (posição e direção do olhar)
    const eyes = r.eyes || []; const e0 = eyes[0], e1 = eyes[1];
    if (e0 && e1) {
      const O1 = W(e0), O2 = W(e1); const oc = O1.add(O2).scale(0.5); const hd = e0.parent; const qH = new Quaternion(); Matrix.FromArray(hd.matrixWorld.elements).decompose(undefined, qH);
      const M = Matrix.FromArray(hd.matrixWorld.elements); const F = Vector3.TransformNormal(new Vector3(0, 0, 1), M).normalize(), U = Vector3.TransformNormal(new Vector3(0, 1, 0), M).normalize(), R = Vector3.TransformNormal(new Vector3(1, 0, 0), M).normalize();
      const de = Math.max(0.06, Vector3.Distance(O1, O2)); const rc = de * 1.5; const C = oc.subtract(F.scale(rc * 0.72)).add(U.scale(rc * 0.12));
      ponto('cabeca', 0, C, rc * 2, qH, pele);
      seg('membro', k++, ombC.subtract(up.normalize().scale(0.04)), C.subtract(U.scale(rc * 0.5)), 0.12 * esc, pele);
      // rosto
      let j = 0; for (const O of [O1, O2]) { const s0 = j ? 1 : -1; const P = O.add(F.scale(rc * 0.1));
        ponto('olhoB', j, P, de * 0.56, qH, new Color4(1, 1, 1, 1)); ponto('iris', j, P.add(F.scale(de * 0.07)), de * 0.38, qH, olho); ponto('pupila', j, P.add(F.scale(de * 0.11)), de * 0.17, qH, new Color4(0.05, 0.04, 0.05, 1));
        ponto('brilho', j, P.add(F.scale(de * 0.13)).add(U.scale(de * 0.07)).add(R.scale(de * 0.05)), de * 0.06, qH, new Color4(1, 1, 1, 1));
        const sb = ponto('sobr', j, P.add(U.scale(de * 0.38)).add(F.scale(de * 0.05)), de * 0.5, qH, cab); void sb; void s0;
        ponto('orelha', j, C.add(R.scale((j ? 1 : -1) * rc * 0.98)).add(U.scale(rc * 0.02)), rc * 0.38, qH, pele); j++; }
      ponto('nariz', 0, oc.subtract(U.scale(de * 0.42)).add(F.scale(rc * 0.18)), de * 0.16, qH, pele);
      ponto('boca', 0, oc.subtract(U.scale(de * 0.85)).add(F.scale(rc * 0.02)), de * 0.42, qH, lab);
      // cabelo pelo estilo escolhido
      const look = r === jogo('PP') ? (jogo('P') || {}).look : r.look; const est = (look && typeof look.hair === 'number' ? look.hair : (r.hshape === 'long' ? 2 : 0)) % 4;
      for (let z = 0; z < 4; z++) { const arr = b.inst['cab' + z]; if (z !== est && arr) for (const i of arr) i && i.isEnabled(false) && i.setEnabled(false); }
      ponto(('cab' + est) as Peca, 0, C, rc, qH, cab);
    }
  }
  /** a ponte não desenha as peças antigas do corpo (o corpo novo as substitui); acessórios e roupas extras continuam */
  pular(o: T3): boolean {
    if (this.corpo.has(o)) return true;
    const m = Array.isArray(o.material) ? o.material[0] : o.material; if (m && this.corpo.has(m)) return true;
    const p = o.parent; if (m && m.side === 1 && p && p.isMesh) { const pm = Array.isArray(p.material) ? p.material[0] : p.material; if (this.corpo.has(p) || (pm && this.corpo.has(pm))) return true; }
    return false;
  }
  get desenhos() { return this.src.size; }
}
