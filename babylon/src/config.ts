// Níveis gráficos da versão experimental (mesmos nomes do jogo atual).
// A qualidade só muda quando o jogador escolhe.

export type Nivel = 'muitobaixo' | 'baixo' | 'medio' | 'alto' | 'ultra';

export interface Preset {
  nome: string;
  escala: number;        // resolução (1 = nativa; 2 = metade)
  sombras: 0 | 1 | 2;    // 0 nenhuma · 1 simples · 2 em cascata (suaves e longas)
  sombraRes: number;
  posProc: boolean;      // bloom, tone mapping, FXAA
  ssao: boolean;         // oclusão de ambiente (cantos mais escuros)
  distancia: number;     // distância de visão (m)
  grama: number;         // tufos de grama (0 = sem)
  flores: number;
  arvoreDet: number;     // detalhe das copas (subdivisões)
  brilho: boolean;       // brilho em lampiões e magias (glow)
}

export const PRESETS: Record<Nivel, Preset> = {
  muitobaixo: { nome: 'Muito baixo', escala: 2, sombras: 0, sombraRes: 512, posProc: false, ssao: false, distancia: 90, grama: 0, flores: 60, arvoreDet: 1, brilho: false },
  baixo: { nome: 'Baixo', escala: 1.5, sombras: 1, sombraRes: 1024, posProc: false, ssao: false, distancia: 130, grama: 0, flores: 140, arvoreDet: 1, brilho: true },
  medio: { nome: 'Médio', escala: 1.25, sombras: 1, sombraRes: 2048, posProc: true, ssao: false, distancia: 170, grama: 1500, flores: 260, arvoreDet: 2, brilho: true },
  alto: { nome: 'Alto', escala: 1, sombras: 2, sombraRes: 2048, posProc: true, ssao: false, distancia: 220, grama: 4000, flores: 400, arvoreDet: 2, brilho: true },
  ultra: { nome: 'Ultra', escala: 1 / Math.min(1.5, Math.max(1, devicePixelRatio || 1)), sombras: 2, sombraRes: 4096, posProc: true, ssao: true, distancia: 280, grama: 9000, flores: 700, arvoreDet: 3, brilho: true },
};

const KEY = 'clover_bjs_nivel';
export function nivelSalvo(): Nivel {
  try { const v = localStorage.getItem(KEY) as Nivel | null; if (v && v in PRESETS) return v; } catch { /* sem armazenamento */ }
  // padrão conservador: celular começa no Baixo, PC no Médio (o jogador troca quando quiser)
  return matchMedia('(pointer:coarse)').matches ? 'baixo' : 'medio';
}
export function salvarNivel(n: Nivel) { try { localStorage.setItem(KEY, n); } catch { /* sem armazenamento */ } }
