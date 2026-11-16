// Tipos das partes do jogo antigo (pasta game/) que o núcleo novo usa.
// Conforme os sistemas forem convertidos para TypeScript, os tipos saem daqui e vão para os módulos.

interface CloverCfg {
  gfx?: 'baixo' | 'medio' | 'alto';
  ultra?: number;
  perf?: number;
  fps?: number;
  fps140?: number;
  tx140?: 'baixa' | 'media' | 'alta';
  /** Etapa 1: ajuste automático de efeitos (desligado por padrão) */
  auto141?: boolean;
  [k: string]: unknown;
}

interface EffectsBudget {
  /** fator final aplicado às partículas (0..1) */
  f: number;
  n: number;
  /** fator do ajuste automático (0.4..1); 1 = sem redução */
  auto?: number;
}

declare var CFG: CloverCfg | undefined;
declare var VB140: EffectsBudget | undefined;
declare var run: boolean | undefined;
declare function cfgRefresh113(): void;

interface CloverAssetEntry { id: string; file: string; bytes: number }

interface Window {
  /** modelos 3D baixados pelo carregador, em base64, por id */
  __AS: Record<string, string>;
  __A: (id: string) => string;
  Clover: import('../core/index').CloverCore;
}
