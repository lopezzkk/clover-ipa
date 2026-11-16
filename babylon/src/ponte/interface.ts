// Interface no mundo feita com o Babylon GUI (desenhada junto com a cena, sem criar/apagar elementos HTML a cada golpe):
// - números de dano/cura/XP com pulo, brilho e sumiço suave (crítico dourado e maior, dano no jogador em vermelho)
// - placas de nome com nível e barra de vida dos inimigos (chefes com moldura dourada e barra maior; inimigo calmo em cinza)
// Os valores continuam vindo do jogo (nome, nível, vida, se está bravo) — só o desenho mudou.
import { Scene } from '@babylonjs/core/scene';
import { Vector3, Matrix } from '@babylonjs/core/Maths/math.vector';
import { AdvancedDynamicTexture } from '@babylonjs/gui/2D/advancedDynamicTexture';
import { TextBlock } from '@babylonjs/gui/2D/controls/textBlock';
import { Rectangle } from '@babylonjs/gui/2D/controls/rectangle';
import { Control } from '@babylonjs/gui/2D/controls/control';

type T3 = any;
const jogo = (n: string): any => { try { return (0, eval)(`typeof ${n}!=='undefined'?${n}:undefined`); } catch { return undefined; } };

interface Num { t: TextBlock; x: number; y: number; z: number; v: number; vida: number; tipo: string; ativo: boolean; dx: number; }
interface Placa { box: Rectangle; nome: TextBlock; fundo: Rectangle; barra: Rectangle; atraso: Rectangle; vis: boolean; w: number; wa: number; chefe: boolean; visto: number; }

export class Interface {
  private ui: AdvancedDynamicTexture; private nums: Num[] = []; private placas = new Map<T3, Placa>(); private q = 0; private vp = new Vector3(); ligada = false;
  private mOrig: T3 = null;
  constructor(private s: Scene) {
    this.ui = AdvancedDynamicTexture.CreateFullscreenUI('interface', true, s);
    this.ui.useInvalidateRectOptimization = true;
    for (let i = 0; i < 48; i++) {
      const t = new TextBlock('dano' + i, ''); t.fontFamily = 'Georgia, serif'; t.fontWeight = '700'; t.fontSize = 20; t.color = '#fff'; t.outlineWidth = 4; t.outlineColor = '#1a0d08';
      t.shadowColor = '#000a'; t.shadowBlur = 6; t.resizeToFit = true; t.isVisible = false; t.isHitTestVisible = false;
      t.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; t.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP; this.ui.addControl(t);
      this.nums.push({ t, x: 0, y: 0, z: 0, v: 0, vida: 0, tipo: '', ativo: false, dx: 0 });
    }
    // estilo: esconde as placas e números antigos em HTML (os de outros jogadores continuam)
    const st = document.createElement('style'); st.textContent = '#lbl .elb:not(.ply){visibility:hidden!important}#lbl .dn{display:none!important}'; document.head.appendChild(st);
    this.ligar();
  }
  /** o jogo passa a chamar o número novo */
  private ligar() {
    const w = window as any; if (typeof w.dmgNum !== 'function' || w.dmgNum.__babylon) return; this.mOrig = w.dmgNum; const self = this;
    const novo = function (x: number, y: number, z: number, v: T3, cr?: boolean, cls?: string) { try { self.numero(x, y, z, v, !!cr, cls || ''); } catch { try { self.mOrig(x, y, z, v, cr, cls); } catch { /* nada */ } } };
    (novo as any).__babylon = 1; w.dmgNum = novo; this.ligada = true;
  }
  numero(x: number, y: number, z: number, v: T3, cr: boolean, cls: string) {
    let n = this.nums.find(k => !k.ativo); if (!n) { n = this.nums.reduce((a, b) => (a.vida > b.vida ? a : b)); }
    const txt = typeof v === 'number' ? Math.round(v) + (cr ? '!' : '') : String(v);
    n.t.text = txt; n.x = x; n.y = y; n.z = z; n.vida = 0; n.ativo = true; n.tipo = cr ? 'cr' : cls; n.dx = (Math.random() - 0.5) * 0.6;
    const t = n.t;
    if (cr) { t.color = '#ffd23f'; t.fontSize = 30; t.outlineColor = '#5a2a00'; }
    else if (cls.includes('pl')) { t.color = '#ff5a5a'; t.fontSize = 22; t.outlineColor = '#2a0000'; }
    else if (cls.includes('xp')) { t.color = '#9fe870'; t.fontSize = 15; t.outlineColor = '#0f2a08'; }
    else if (cls.includes('heal') || cls.includes('cura')) { t.color = '#7dffb0'; t.fontSize = 20; t.outlineColor = '#00301a'; }
    else { t.color = '#ffffff'; t.fontSize = 21; t.outlineColor = '#1a0d08'; }
    t.isVisible = true;
  }
  private proj(x: number, y: number, z: number): [number, number, boolean] {
    const eng = this.s.getEngine(); const w = eng.getRenderWidth(), h = eng.getRenderHeight(); const cam = this.s.activeCamera; if (!cam) return [0, 0, false];
    this.vp.set(x, y, z); const p = Vector3.Project(this.vp, Matrix.IdentityReadOnly, this.s.getTransformMatrix(), cam.viewport.toGlobal(w, h));
    const sc = this.ui.getSize(); const k = sc.width / w; return [p.x * k, p.y * k, p.z > 0 && p.z < 1];
  }
  private placa(chefe: boolean): Placa {
    const box = new Rectangle(); box.width = chefe ? '170px' : '112px'; box.height = chefe ? '30px' : '24px'; box.thickness = chefe ? 1.5 : 0; box.color = '#d8b45a'; box.cornerRadius = 5; box.background = '#0c0a14b0';
    box.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; box.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP; box.isHitTestVisible = false; box.isVisible = false;
    const nome = new TextBlock(); nome.fontSize = chefe ? 12 : 10; nome.fontFamily = 'Georgia, serif'; nome.fontWeight = '700'; nome.color = '#ffd8cc'; nome.top = chefe ? '-5px' : '-4px'; nome.outlineWidth = 2; nome.outlineColor = '#000';
    const fundo = new Rectangle(); fundo.height = chefe ? '6px' : '4px'; fundo.width = '88%'; fundo.top = chefe ? '8px' : '6px'; fundo.thickness = 0; fundo.background = '#2a1a1a'; fundo.cornerRadius = 2;
    const atraso = new Rectangle(); atraso.height = '100%'; atraso.width = '100%'; atraso.thickness = 0; atraso.background = '#ffe0a0'; atraso.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; atraso.cornerRadius = 2;
    const barra = new Rectangle(); barra.height = '100%'; barra.width = '100%'; barra.thickness = 0; barra.background = '#d8493e'; barra.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT; barra.cornerRadius = 2;
    fundo.addControl(atraso); fundo.addControl(barra); box.addControl(nome); box.addControl(fundo); this.ui.addControl(box);
    return { box, nome, fundo, barra, atraso, vis: false, w: 1, wa: 1, chefe, visto: 0 };
  }
  atualizar(dt: number, cam: Vector3) {
    this.q++; if (!this.ligada) this.ligar();
    // números: sobem, aumentam no começo e somem
    for (const n of this.nums) { if (!n.ativo) continue; n.vida += dt; const T = n.tipo === 'cr' ? 1.05 : 0.85; if (n.vida >= T) { n.ativo = false; n.t.isVisible = false; continue; }
      const k = n.vida / T; const [sx, sy, ok] = this.proj(n.x + n.dx * k, n.y + 0.4 + k * 1.3, n.z); if (!ok) { n.t.isVisible = false; continue; } n.t.isVisible = true;
      const pop = k < 0.15 ? 1 + (0.15 - k) * (n.tipo === 'cr' ? 5 : 3) : 1; n.t.scaleX = n.t.scaleY = pop; n.t.alpha = k > 0.6 ? 1 - (k - 0.6) / 0.4 : 1;
      n.t.left = (sx - 30) + 'px'; n.t.top = (sy - 14) + 'px'; }
    // placas dos inimigos
    const en: T3[] = jogo('enemies') || [];
    for (const e of en) {
      if (!e || !e.lb) continue; const vis = e._lv === true && e.hp > 0 && Math.hypot(e.x - cam.x, e.z - cam.z) < 60;
      let p = this.placas.get(e); if (!p) { if (!vis) continue; p = this.placa(!!e.boss); this.placas.set(e, p); p.nome.text = (e.lt && e.lt.textContent) || ((e.name || '') + ' Nv ' + (e.lv || '')); }
      p.visto = this.q;
      if (!vis) { if (p.vis) { p.vis = false; p.box.isVisible = false; } continue; }
      const [sx, sy, ok] = this.proj(e.x, e.boss ? 3.7 : 2.7, e.z); if (!ok) { p.box.isVisible = false; p.vis = false; continue; }
      p.vis = true; p.box.isVisible = true; const bw = p.chefe ? 170 : 112; p.box.left = (sx - bw / 2) + 'px'; p.box.top = (sy - 14) + 'px';
      const w = Math.max(0, Math.min(1, e.hp / (e.mhp || 1))); p.w = w; p.wa = Math.max(w, p.wa - dt * 0.6); // barra amarela "atrasada" mostra o dano recebido
      p.barra.width = (w * 100).toFixed(1) + '%'; p.atraso.width = (p.wa * 100).toFixed(1) + '%';
      const bravo = (e._cn || '').indexOf(' n') < 0; p.barra.background = bravo ? (p.chefe ? '#e0322a' : '#d8493e') : '#9a9a9a'; p.nome.color = bravo ? '#ffd8cc' : '#dddddd';
    }
    for (const [e, p] of this.placas) if (p.visto !== this.q || !en.includes(e)) { p.box.dispose(); this.placas.delete(e); }
  }
  get info() { return { numeros: this.nums.filter(n => n.ativo).length, placas: this.placas.size, ligada: this.ligada }; }
}
