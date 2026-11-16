// Regras do servidor: tudo que um jogador manda passa por aqui antes de chegar aos outros.
// Funções puras (sem Colyseus), para poderem ser testadas sozinhas.

export const LIMITES = {
  presencaBytes: 8_000,      // tamanho máximo da presença de um jogador (JSON)
  textoMax: 200,             // tamanho máximo de qualquer texto (nome, chat, etc.)
  nomeMax: 16,
  atualizacoesPorSeg: 20,    // atualizações por segundo aceitas de cada jogador
  mundo: { x0: -600, x1: 600, z0: -670, z1: 450 },
  velocidadeMax: 32,         // m/s (correr, voar, dash curto)
  saltoMin: 40,              // acima disso é um teleporte (viagem rápida, interior)
  teleporteIntervalo: 3_000, // no máximo 1 teleporte a cada 3 s
  golpesPorSeg: 8,           // dano em chefe compartilhado: golpes por segundo
  danoPorNivel: 60,          // dano máximo de um golpe = 50 + nível × 60
};

export type Presenca = Record<string, unknown>;

export interface EstadoJogador {
  presenca: Presenca;
  ultimaPos?: { x: number; z: number; t: number };
  ultimoTeleporte: number;
  janela: { t: number; n: number };
  golpes: { t: number; n: number };
  ultimoGolpeN: number;
  nivel: number;
  avisos: number;
}

export function novoJogador(): EstadoJogador {
  return { presenca: {}, ultimoTeleporte: 0, janela: { t: 0, n: 0 }, golpes: { t: 0, n: 0 }, ultimoGolpeN: 0, nivel: 50, avisos: 0 };
}

const limpaTexto = (s: string, max = LIMITES.textoMax) => s.replace(/[<>&"'`]/g, '').slice(0, max);

/** limpa recursivamente: textos sem HTML e curtos, números finitos, profundidade e tamanho limitados */
export function limpar(v: unknown, prof = 0): unknown {
  if (prof > 6) return null;
  if (typeof v === 'string') return limpaTexto(v);
  if (typeof v === 'number') return Number.isFinite(v) ? v : 0;
  if (typeof v === 'boolean' || v === null) return v;
  if (Array.isArray(v)) return v.slice(0, 64).map(x => limpar(x, prof + 1));
  if (typeof v === 'object' && v) {
    const o: Record<string, unknown> = {};
    let n = 0;
    for (const [k, x] of Object.entries(v)) { if (n++ >= 64) break; if (k === '__proto__' || k === 'constructor') continue; o[limpaTexto(k, 32)] = limpar(x, prof + 1); }
    return o;
  }
  return null;
}

export type Resultado = { ok: true; patch: Presenca; avisos: string[] } | { ok: false; motivo: string };

/** valida uma atualização de presença (patch: chave → valor; null apaga a chave) */
export function validarPatch(j: EstadoJogador, bruto: unknown, agora: number): Resultado {
  if (!bruto || typeof bruto !== 'object' || Array.isArray(bruto)) return { ok: false, motivo: 'formato' };
  // limite de frequência
  if (agora - j.janela.t >= 1000) { j.janela = { t: agora, n: 0 }; }
  if (++j.janela.n > LIMITES.atualizacoesPorSeg) return { ok: false, motivo: 'frequencia' };

  const patch = limpar(bruto) as Presenca;
  const avisos: string[] = [];

  if (typeof patch.nm === 'string') patch.nm = limpaTexto(patch.nm, LIMITES.nomeMax).trim() || 'Jogador';
  if (typeof patch.lv === 'number') { patch.lv = Math.max(1, Math.min(50, Math.round(patch.lv))); j.nivel = patch.lv as number; }

  // posição: p = [x, z, ...]
  if (Array.isArray(patch.p) && patch.p.length >= 2) {
    const p = patch.p as number[];
    let x = +p[0], z = +p[1];
    if (!Number.isFinite(x) || !Number.isFinite(z)) return { ok: false, motivo: 'posicao' };
    const W = LIMITES.mundo;
    x = Math.max(W.x0, Math.min(W.x1, x)); z = Math.max(W.z0, Math.min(W.z1, z));
    const u = j.ultimaPos;
    if (u) {
      const dt = Math.max(0.05, (agora - u.t) / 1000);
      const d = Math.hypot(x - u.x, z - u.z);
      if (d > LIMITES.saltoMin) {
        if (agora - j.ultimoTeleporte < LIMITES.teleporteIntervalo) { avisos.push('teleporte'); x = u.x; z = u.z; }
        else j.ultimoTeleporte = agora;
      } else if (d > LIMITES.velocidadeMax * dt + 2) {
        // rápido demais: anda só o máximo permitido na direção pedida
        const k = (LIMITES.velocidadeMax * dt + 2) / d; x = u.x + (x - u.x) * k; z = u.z + (z - u.z) * k; avisos.push('velocidade');
      }
    }
    p[0] = Math.round(x * 10) / 10; p[1] = Math.round(z * 10) / 10;
    j.ultimaPos = { x: p[0], z: p[1], t: agora };
  }

  // dano em chefe compartilhado: bh = [{n, id, d}]
  if (Array.isArray(patch.bh)) {
    const max = 50 + j.nivel * LIMITES.danoPorNivel;
    const ok: unknown[] = [];
    for (const h of patch.bh as Record<string, unknown>[]) {
      if (!h || typeof h !== 'object') continue;
      const n = +(h.n as number), d = +(h.d as number);
      if (!Number.isFinite(n) || !Number.isFinite(d) || d < 0) continue;
      if (n <= j.ultimoGolpeN) { ok.push(h); continue; } // já aceito antes (a lista é repetida até 10)
      if (agora - j.golpes.t >= 1000) j.golpes = { t: agora, n: 0 };
      if (++j.golpes.n > LIMITES.golpesPorSeg) { avisos.push('golpes'); continue; }
      j.ultimoGolpeN = n;
      if (d > max) avisos.push('dano');
      ok.push({ ...h, d: Math.min(max, Math.round(d)) });
    }
    patch.bh = ok.slice(-10);
  }

  // aplica e confere o tamanho final
  const nova: Presenca = { ...j.presenca };
  for (const [k, v] of Object.entries(patch)) { if (v === null) delete nova[k]; else nova[k] = v; }
  if (JSON.stringify(nova).length > LIMITES.presencaBytes) return { ok: false, motivo: 'tamanho' };
  j.presenca = nova;
  if (avisos.length) j.avisos += avisos.length;
  return { ok: true, patch, avisos };
}

/** nome de sala aceito: "main" ou "clv-xxxxxx" */
export function nomeSala(n: unknown): string | null {
  if (typeof n !== 'string') return null;
  const s = n.toLowerCase();
  return /^(main|clv-[a-z0-9]{4,12})$/.test(s) ? s : null;
}
