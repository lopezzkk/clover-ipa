// Ajuste automático de efeitos (opção em Ajustes › Ajuste fino; DESLIGADA por padrão).
// Quando ligada, mede o tempo dos quadros. Se o jogo ficar lento por alguns segundos,
// reduz aos poucos a quantidade de partículas dos efeitos; quando volta a ficar fluido, devolve.
// NUNCA muda o nível gráfico, a sombra, a distância nem a resolução: só o volume de partículas.

import type { EventBus, CloverEvents } from './events';

const MIN = 0.4;

export class AutoFx {
  private times: number[] = [];
  private last = 0;
  private slow = 0;
  private fast = 0;
  private raf = 0;
  factor = 1;

  constructor(private bus: EventBus<CloverEvents>) {}

  get enabled(): boolean { return typeof CFG !== 'undefined' && !!CFG && CFG.auto141 === true; }

  set(on: boolean): void {
    if (typeof CFG === 'undefined' || !CFG) return;
    CFG.auto141 = !!on;
    try { localStorage.setItem('cloverCfg', JSON.stringify(CFG)); } catch { /* sem espaço */ }
    if (!on) this.apply(1, 'off');
    try { cfgRefresh113(); } catch { /* menu fechado */ }
  }

  /** alvo de tempo por quadro: respeita o limite de FPS escolhido pelo jogador */
  private target(): number {
    const f = (typeof CFG !== 'undefined' && CFG && +(CFG.fps140 as number)) || 60;
    return 1000 / Math.min(f || 60, 60);
  }

  private apply(f: number, reason: 'slow' | 'fast' | 'off'): void {
    f = Math.max(MIN, Math.min(1, Math.round(f * 100) / 100));
    if (f === this.factor) return;
    this.factor = f;
    if (typeof VB140 !== 'undefined' && VB140) VB140.auto = f;
    this.bus.emit('autofx:change', { factor: f, reason });
  }

  private tick = (t: number): void => {
    this.raf = requestAnimationFrame(this.tick);
    if (!this.enabled || document.hidden || typeof run === 'undefined' || !run) { this.last = 0; this.times.length = 0; return; }
    if (this.last) { const dt = t - this.last; if (dt < 500) this.times.push(dt); }
    this.last = t;
    if (this.times.length < 60) return; // ~1 s de amostra
    const avg = this.times.reduce((a, b) => a + b, 0) / this.times.length; this.times.length = 0;
    const tg = this.target();
    if (avg > tg * 1.35) { this.slow++; this.fast = 0; } else if (avg < tg * 1.1) { this.fast++; this.slow = 0; } else { this.slow = 0; this.fast = 0; }
    if (this.slow >= 3) { this.slow = 0; this.apply(this.factor - 0.15, 'slow'); }     // 3 s lento → menos partículas
    if (this.fast >= 5) { this.fast = 0; this.apply(this.factor + 0.1, 'fast'); }      // 5 s fluido → devolve
  };

  start(): void { if (!this.raf) this.raf = requestAnimationFrame(this.tick); }
}
