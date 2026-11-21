// CENÁRIO 100% BABYLON: as construções, cercas, árvores, postes, bancos e todo o resto do mapa que o jogo junta
// por pedaço de 40 m (as peças "juntadas" pelo v139) passam a existir só no Babylon.
// Elas são convertidas uma vez, saem da cena do three.js e não precisam mais ser copiadas a cada quadro.
// O que se mexe ou é especial (moinhos, enfeites flutuando, vidro, textura, moradores) continua como antes.
// Mostrar/esconder por distância segue as mesmas regras do jogo (pedaço visível e distâncias de detalhe LODD).
import { Scene } from '@babylonjs/core/scene';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Matrix } from '@babylonjs/core/Maths/math.vector';
import type { Tradutor } from './tradutor';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };
interface Peca { g: T3; c: T3; b: Mesh; cl: 'o' | 'd' | 'b'; }
interface Fixo { o: T3; b: Mesh; m3: T3; usaCor: boolean; mw: Float32Array; raiz: T3; }

export class CenarioNativo {
  private pecas: Peca[] = []; private porChunk = new Map<T3, Peca[]>(); private q = 0; convertidas = 0; ligado = true;
  private fixos: Fixo[] = []; private tCong = 0; private estab = new WeakMap<T3, { m: Float32Array; n: number }>(); fixados = 0;
  constructor(private s: Scene, private tr: Tradutor) {}

  /** converte as peças juntadas que ainda estão no three.js (o jogo pode juntar mais depois) */
  private converter() {
    const chunks = jogo('chunks'); if (!chunks) return;
    for (const k in chunks) {
      const g = chunks[k]; const lo = new Set(g._lo || []), ld = new Set(g._ld || []);
      for (const c of g.children.slice()) {
        if (!c.isMesh || c.isSkinnedMesh || c.matrixAutoUpdate !== false || !c.geometry || !c.geometry._keep || c.__nativo) continue;
        const m = Array.isArray(c.material) ? c.material[0] : c.material; if (!m || m.transparent || m.map) continue;
        const b = new Mesh('cenario', this.s); b.isPickable = false;
        const info = this.tr.geometria(c.geometry, b); const usaCor = info.temCor && !!m.vertexColors;
        b.useVertexColors = usaCor; b.material = this.tr.material(m, usaCor, c);
        c.updateMatrixWorld(true); b.freezeWorldMatrix(Matrix.FromArray(c.matrixWorld.elements)); b.doNotSyncBoundingInfo = true;
        b.receiveShadows = true; if (c.castShadow) this.tr.sombraAdd?.(b);
        const p: Peca = { g, c, b, cl: lo.has(c) ? 'o' : ld.has(c) ? 'd' : 'b' };
        this.pecas.push(p); let L = this.porChunk.get(g); if (!L) this.porChunk.set(g, L = []); L.push(p);
        c.__nativo = b; g.remove(c); this.convertidas++;
      }
    }
  }
  /** mostra/esconde igual ao jogo: pedaço visível e distâncias de detalhe */
  private visibilidade() {
    const P = jogo('P'), L = jogo('LODD'); if (!P) return;
    for (const [g, lista] of this.porChunk) {
      const vis = g.visible !== false && (!g.parent || g.parent.visible !== false); const d = Math.hypot((g.cx ?? 0) - P.x, (g.cz ?? 0) - P.z);
      for (const p of lista) { const v = vis && (p.cl === 'o' ? !L || d < L.o : p.cl === 'd' ? !L || d < L.d : true); if (p.b.isEnabled(false) !== v) p.b.setEnabled(v); }
    }
  }
  /** personagens (jogador, moradores, inimigos, outros jogadores) não entram no congelamento: eles se mexem */
  private gruposDePersonagem() {
    const set = new Set<T3>(); const PP = jogo('PP'); if (PP && PP.g) set.add(PP.g);
    for (const n of jogo('NPCS') || []) if (n && n.g) set.add(n.g);
    for (const e of jogo('enemies') || []) { if (e && e.m) set.add(e.m); if (e && e.L && e.L.g) set.add(e.L.g); }
    const MP = jogo('MP'); if (MP && MP.others) for (const k in MP.others) { const o = MP.others[k]; if (o && o.g) set.add(o.g); if (o && o.p && o.p.g) set.add(o.p.g); }
    return set;
  }
  /** CONGELAMENTO GERAL: qualquer peça sólida que ficou parada por ~3 conferências seguidas (cenário solto, interiores,
   *  enfeites, móveis) passa a ser desenhada só pelo Babylon e deixa de ser copiada; se o jogo mexer nela depois,
   *  a posição é corrigida na próxima conferência; se o jogo apagar a peça, ela some do Babylon também. */
  private congelar(S3: T3) {
    const pers = this.gruposDePersonagem(); const raizes: T3[] = [];
    for (const c of S3.children) if (!c.isLight && !c.isCamera && !pers.has(c)) raizes.push(c);
    const visita = (o: T3, raiz: T3) => {
      if (pers.has(o)) return;
      if (o.isMesh && !o.__nativo && !o.isSkinnedMesh && !o.isInstancedMesh && o.geometry && o.geometry.attributes && o.geometry.attributes.position) {
        const m3 = Array.isArray(o.material) ? o.material[0] : o.material; const dr = o.geometry.drawRange;
        const ok = m3 && m3.blending !== 2 && m3.visible !== false && (o.layers.mask & 1) !== 0 && !(dr && (dr.start > 0 || dr.count !== Infinity)) && !o.morphTargetInfluences;
        if (ok) {
          const e = o.matrixWorld.elements; let st = this.estab.get(o);
          if (!st) { st = { m: new Float32Array(e), n: 0 }; this.estab.set(o, st); }
          else { let igual = true; for (let i = 0; i < 16; i++) if (st.m[i] !== e[i]) { igual = false; st.m[i] = e[i]; } st.n = igual ? st.n + 1 : 0;
            if (st.n >= 3) this.fixar(o, m3, raiz); }
        }
      }
      const ch = o.children; for (let i = 0; i < ch.length; i++) visita(ch[i], raiz);
    };
    for (const r of raizes) visita(r, r);
  }
  private fixar(o: T3, m3: T3, raiz: T3) {
    const b = new Mesh('fixo', this.s); b.isPickable = false;
    const info = this.tr.geometria(o.geometry, b); const usaCor = info.temCor && !!m3.vertexColors;
    b.useVertexColors = usaCor; b.material = this.tr.material(m3, usaCor, o);
    const mw = new Float32Array(o.matrixWorld.elements); b.freezeWorldMatrix(Matrix.FromArray(mw)); b.doNotSyncBoundingInfo = false;
    b.receiveShadows = true; if (o.castShadow) this.tr.sombraAdd?.(b); if (o.renderOrder) b.alphaIndex = o.renderOrder;
    o.__nativo = b; this.fixos.push({ o, b, m3, usaCor, mw, raiz }); this.fixados++;
  }
  /** confere as peças congeladas: visível/escondida, posição, material e se ainda existem */
  alcance = 130;
  private conferirFixos(S3: T3, completo: boolean) {
    const vivos: Fixo[] = []; const vistos = new Set<T3>(); const P = jogo('P'); const px = P ? P.x : 0, pz = P ? P.z : 0, A = this.alcance;
    for (const f of this.fixos) {
      const o = f.o; let p = o; let vis = true; while (p && p !== S3) { if (p.visible === false) vis = false; p = p.parent; }
      if (p !== S3) { this.tr.sombraRem?.(f.b); f.b.dispose(false, false); o.__nativo = null; continue; } // a peça saiu da cena
      const m3 = Array.isArray(o.material) ? o.material[0] : o.material;
      if (m3 !== f.m3 || o.geometry.drawRange.count !== Infinity) { this.tr.sombraRem?.(f.b); f.b.dispose(false, false); o.__nativo = null; this.estab.delete(o); continue; } // mudou de material: volta para a cópia normal
      if (vis) { const bs = f.b.getBoundingInfo().boundingSphere; const r = bs.radiusWorld; if (r < 25 && Math.hypot(bs.centerWorld.x - px, bs.centerWorld.z - pz) - r > A) vis = false; } // longe: igual ao corte por distância da cópia
      if ((o.layers.mask & 1) === 0 || (m3 && m3.visible === false)) vis = false; // camada escondida do jogo ou material invisível
      if (f.b.isEnabled(false) !== vis) f.b.setEnabled(vis);
      if (completo && vis) {
        const e = o.matrixWorld.elements; let mudou = false; for (let i = 0; i < 16; i++) if (f.mw[i] !== e[i]) { mudou = true; f.mw[i] = e[i]; }
        if (mudou) f.b.freezeWorldMatrix(Matrix.FromArray(f.mw));
        if (!vistos.has(m3)) { vistos.add(m3); this.tr.material(m3, f.usaCor, o); }
        this.tr.geometria(o.geometry, f.b);
      }
      vivos.push(f);
    }
    this.fixos = vivos;
  }
  atualizar(S3?: T3) {
    if (!this.ligado) return; this.q++;
    if (this.q % 60 === 2) this.converter();
    if (this.q % 4 === 0) this.visibilidade();
    if (S3) { const t = performance.now(); if (t - this.tCong > 700) { this.tCong = t; this.congelar(S3); } if (this.q % 3 === 0) this.conferirFixos(S3, this.q % 15 === 0); }
  }
  /** se a ponte desligar (erro), devolve as peças para o three.js, para o desenho de reserva mostrar o mapa inteiro */
  restaurar() { for (const f of this.fixos) { f.o.__nativo = null; this.tr.sombraRem?.(f.b); f.b.dispose(false, false); } this.fixos = [];
    for (const p of this.pecas) { if (!p.c.parent) p.g.add(p.c); p.c.__nativo = null; this.tr.sombraRem?.(p.b); p.b.dispose(false, false); } this.pecas = []; this.porChunk.clear(); this.ligado = false; }
  get info() { return { convertidas: this.convertidas, pedacos: this.porChunk.size, congeladas: this.fixos.length }; }
}
