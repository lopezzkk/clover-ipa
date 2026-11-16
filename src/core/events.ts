// Barramento de eventos tipado: os sistemas avisam uns aos outros sem um sobrescrever a função do outro.

export interface CloverEvents {
  'boot:progress': { pct: number; stage: string };
  'boot:ready': { ms: number };
  'storage:restored': { keys: string[] };
  'autofx:change': { factor: number; reason: 'slow' | 'fast' | 'off' };
}

type Handler<T> = (data: T) => void;

export class EventBus<E extends object = CloverEvents> {
  private map = new Map<keyof E, Set<Handler<any>>>();

  on<K extends keyof E>(name: K, fn: Handler<E[K]>): () => void {
    let set = this.map.get(name);
    if (!set) this.map.set(name, (set = new Set()));
    set.add(fn);
    return () => set!.delete(fn);
  }

  emit<K extends keyof E>(name: K, data: E[K]): void {
    const set = this.map.get(name);
    if (!set) return;
    for (const fn of set) {
      try { fn(data); } catch (e) { console.error('[Clover] erro no evento', String(name), e); }
    }
  }
}
