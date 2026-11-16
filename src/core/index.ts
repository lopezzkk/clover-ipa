// Núcleo novo do Clover RP (TypeScript). Carrega antes do jogo e fica disponível em window.Clover.

import { EventBus, type CloverEvents } from './events';
import { LocalStore } from './storage';
import { AutoFx } from './autofx';

export class CloverCore {
  readonly version = '141';
  readonly bus = new EventBus<CloverEvents>();
  readonly store = new LocalStore();
  readonly autofx = new AutoFx(this.bus);

  /** antes do jogo: restaura dados locais */
  async beforeGame(): Promise<void> {
    const keys = await this.store.restore();
    if (keys.length) this.bus.emit('storage:restored', { keys });
  }

  /** depois que o script do jogo rodou */
  afterGame(ms: number): void {
    this.store.start();
    if (typeof VB140 !== 'undefined' && VB140 && VB140.auto == null) VB140.auto = 1;
    this.autofx.start();
    // o jogo registrava o modo offline no evento "load", que agora já passou quando ele começa
    try { if ('serviceWorker' in navigator && document.readyState === 'complete') navigator.serviceWorker.register('sw.js').catch(() => {}); } catch { /* sem suporte */ }
    this.bus.emit('boot:ready', { ms });
  }
}

window.Clover = new CloverCore();
