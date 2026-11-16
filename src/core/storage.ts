// Salvamento local em IndexedDB, com o localStorage como cópia rápida.
// O jogo antigo lê e grava no localStorage na hora (síncrono). Este módulo:
//  1) antes do jogo começar, devolve ao localStorage o que estiver só no IndexedDB
//     (ex.: o navegador limpou o localStorage, comum no iPhone);
//  2) enquanto o jogo roda, copia para o IndexedDB as chaves do jogo que mudaram.
// O progresso principal continua na nuvem (Firebase); isto protege configurações e dados locais.

const DB = 'clover-rp';
const STORE = 'kv';
const KEY_RE = /^(clover|clv_)/;
const MAX_VALUE = 2_000_000; // valores muito grandes ficam só no localStorage

function openDb(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

function reqP<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}

function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return Promise.race([p, new Promise<T>(r => setTimeout(() => r(fallback), ms))]);
}

export class LocalStore {
  private db: IDBDatabase | null = null;
  private last = new Map<string, string>();
  private timer = 0;
  ok = false;

  /** Abre o IndexedDB e restaura chaves que sumiram do localStorage. Nunca trava o jogo: desiste em 1,5 s. */
  async restore(): Promise<string[]> {
    try {
      if (!('indexedDB' in window)) return [];
      this.db = await withTimeout(openDb(), 1500, null as unknown as IDBDatabase);
      if (!this.db) return [];
      const tx = this.db.transaction(STORE, 'readonly').objectStore(STORE);
      const keys = (await withTimeout(reqP(tx.getAllKeys()), 1500, [])) as string[];
      const vals = (await withTimeout(reqP(tx.getAll()), 1500, [])) as string[];
      const restored: string[] = [];
      keys.forEach((k, i) => {
        try {
          if (localStorage.getItem(k) == null && typeof vals[i] === 'string') { localStorage.setItem(k, vals[i]); restored.push(k); }
          this.last.set(k, localStorage.getItem(k) ?? '');
        } catch { /* armazenamento cheio ou bloqueado */ }
      });
      this.ok = true;
      return restored;
    } catch { return []; }
  }

  /** Copia para o IndexedDB as chaves do jogo que mudaram desde a última cópia. */
  sync(): void {
    if (!this.db) return;
    try {
      const tx = this.db.transaction(STORE, 'readwrite').objectStore(STORE);
      const seen = new Set<string>();
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i); if (!k || !KEY_RE.test(k)) continue;
        seen.add(k);
        const v = localStorage.getItem(k); if (v == null || v.length > MAX_VALUE) continue;
        if (this.last.get(k) !== v) { tx.put(v, k); this.last.set(k, v); }
      }
      // chave apagada pelo próprio jogo também sai do IndexedDB
      for (const k of [...this.last.keys()]) if (!seen.has(k)) { tx.delete(k); this.last.delete(k); }
    } catch { /* ignora: tenta de novo na próxima */ }
  }

  start(): void {
    if (this.timer) return;
    this.timer = window.setInterval(() => this.sync(), 5000);
    addEventListener('pagehide', () => this.sync());
    document.addEventListener('visibilitychange', () => { if (document.hidden) this.sync(); });
  }
}
