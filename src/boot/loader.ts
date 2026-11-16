// Carregador do Clover RP: vai dentro do index.html.
// Baixa o núcleo, os modelos 3D e o jogo mostrando o progresso real (bytes baixados),
// tenta de novo se a internet falhar e só então inicia o jogo.

declare const __BOOT__: {
  core: string;
  game: string;
  assets: { id: string; url: string; bytes: number }[];
  gameBytes: number;
};

(() => {
  const B = __BOOT__;
  const t0 = performance.now();
  const root = document.documentElement;
  const total = B.assets.reduce((a, x) => a + x.bytes, 0) + B.gameBytes;
  let done = 0;
  // a barra já está em 45% (motor 3D carregado); o download vai de 45% a 84%
  const show = () => { (window as any).__bootBusy = Date.now(); root.style.setProperty('--bpn', String(Math.min(84, 45 + Math.floor((done / total) * 39)))); };

  async function get(url: string, kind: 'buf' | 'none'): Promise<ArrayBuffer | null> {
    let err: unknown;
    for (let tent = 0; tent < 3; tent++) {
      let got = 0;
      try {
        const r = await fetch(url);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        if (r.body && 'getReader' in r.body) {
          const rd = r.body.getReader(); const parts: Uint8Array[] = [];
          for (;;) { const { done: end, value } = await rd.read(); if (end) break; parts.push(value); got += value.length; done += value.length; show(); }
          if (kind === 'none') return null;
          const out = new Uint8Array(got); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; }
          return out.buffer;
        }
        const buf = await r.arrayBuffer(); got = buf.byteLength; done += got; show();
        return kind === 'none' ? null : buf;
      } catch (e) { err = e; done -= got; await new Promise(r => setTimeout(r, 800 * (tent + 1))); }
    }
    throw err;
  }

  function toB64(buf: ArrayBuffer): string {
    const u = new Uint8Array(buf); let s = '';
    for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000) as unknown as number[]);
    return btoa(s);
  }

  function script(src: string): Promise<void> {
    return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = () => res(); s.onerror = () => rej(new Error('script ' + src)); document.body.appendChild(s); });
  }

  const AS: Record<string, string> = {};
  window.__AS = AS;
  window.__A = (id: string) => { const v = AS[id]; if (v == null) throw new Error('modelo não carregado: ' + id); return v; };

  (async () => {
    try {
      await script(B.core);
      const prep = window.Clover.beforeGame().catch(() => {});
      // até 4 downloads ao mesmo tempo
      const q = B.assets.slice();
      const work = async () => { for (let a = q.shift(); a; a = q.shift()) AS[a.id] = toB64((await get(a.url, 'buf'))!); };
      await Promise.all([work(), work(), work(), work(), get(B.game, 'none'), prep]);
      await script(B.game);
      window.Clover.afterGame(Math.round(performance.now() - t0));
    } catch (e) {
      console.error('[Clover] falha ao carregar', e);
      root.dataset.bootErr = String(e);
      // mostra na hora a tela "Tentar de novo / Modo leve" do index
      try { (window as any).__bw && (window as any).__bw(); } catch { /* nada */ }
    }
  })();
})();
