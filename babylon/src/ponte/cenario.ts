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

export class CenarioNativo {
  private pecas: Peca[] = []; private porChunk = new Map<T3, Peca[]>(); private q = 0; convertidas = 0; ligado = true;
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
  atualizar() {
    if (!this.ligado) return; this.q++;
    if (this.q % 60 === 2) this.converter();
    if (this.q % 4 === 0) this.visibilidade();
  }
  /** se a ponte desligar (erro), devolve as peças para o three.js, para o desenho de reserva mostrar o mapa inteiro */
  restaurar() { for (const p of this.pecas) { if (!p.c.parent) p.g.add(p.c); p.c.__nativo = null; this.tr.sombraRem?.(p.b); p.b.dispose(false, false); } this.pecas = []; this.porChunk.clear(); this.ligado = false; }
  get info() { return { convertidas: this.convertidas, pedacos: this.porChunk.size }; }
}
