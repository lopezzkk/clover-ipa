# Arquitetura do Clover RP (Etapa 1)

## Como o jogo carrega

1. `index.html` mostra a tela de abertura e baixa o motor 3D (three.js r128, com dois servidores reserva).
2. O **carregador** (`src/boot/loader.ts`, embutido no `index.html`) baixa, com até 4 downloads ao mesmo tempo:
   o núcleo (`js/core.*.js`), os modelos 3D (`models/*`) e o jogo (`js/game.*.js`).
   A barra de carregamento mostra os bytes realmente baixados. Se a internet falhar, tenta de novo 3 vezes.
3. O núcleo restaura do IndexedDB os dados locais que o navegador tenha apagado do localStorage.
4. O jogo roda. Depois, o núcleo liga a cópia contínua para o IndexedDB e o ajuste automático de efeitos (se o jogador ligou).

Se nada disso terminar, a tela "Tentar de novo / Abrir no modo leve" aparece — na hora, se houve erro,
ou depois de 30 s sem nenhum progresso de download.

Os nomes dos arquivos têm uma impressão digital (`game.b96ff1f8a4.js`). Assim, numa atualização,
o jogador só baixa de novo o que mudou: os modelos 3D ficam salvos no aparelho.

## O jogo dividido por sistema (`game/`)

O jogo antigo era um único arquivo montado por remendos de texto. Ele foi dividido em 133 arquivos,
**sem mudar nenhum comando**: juntar todos na ordem do `manifest.json` dá exatamente o código anterior
(conferido automaticamente na divisão). A divisão só acontece entre instruções inteiras.

| Pasta | O que tem |
|---|---|
| `core/` | estado do jogo, entrada (teclado/toque), laço quadro a quadro |
| `render/` | cena, câmera, otimizações (níveis gráficos, FPS, orçamento de efeitos) |
| `world/` | mapa, reinos, vilas, casas, interiores, água, mundo vivo |
| `characters/` | corpo 3D, demônios, uniões, equipamentos, modelos GLB |
| `magic/` | grimórios, magias, formas, combos |
| `combat/` | chefes com fases, impacto, primeiros passos |
| `progression/` | exame dos cavaleiros, cerimônias |
| `missions/` | missões diárias/semanais e eventos |
| `multiplayer/` | perfil, salas, chat de voz, esquadrões, Rei Mago, admin |
| `ui/` | menu principal, HUD, grimório 3D, novidades, cenas |
| `assets-data/` | tabelas dos modelos 3D (os bytes ficam em `assets/models/`) |
| `vendor/` | GLTFLoader (three.js, MIT) |

Regra para editar: **mude o arquivo do sistema certo** e não crie mais remendos de texto.
Os sistemas ainda se comunicam "embrulhando" funções globais (ex.: `tUpdate`, `cast`); isso continua
funcionando, mas código novo deve usar o barramento de eventos do núcleo (`Clover.bus`).
A conversão dos arquivos de `game/` para TypeScript será feita aos poucos, um sistema por vez, sempre com os testes completos.

## Núcleo TypeScript (`src/core/`)

| Arquivo | Função |
|---|---|
| `events.ts` | barramento de eventos tipado (`Clover.bus.on` / `emit`) |
| `storage.ts` | IndexedDB com o localStorage como cópia rápida; restaura o que o navegador apagar |
| `autofx.ts` | efeitos automáticos: opção em Ajustes, **desligada por padrão**; só reduz partículas, nunca o nível gráfico |
| `index.ts` | junta tudo em `window.Clover` |

## Publicação

- `npm run build` → `dist/` vai para o GitHub Pages.
- `npm run build:single` → um arquivo só, usado na prévia do Claude e como reserva.
- O GitHub Actions (`.github/workflows/build.yml`) compila e testa a cada envio, mas **só publica quando o dono
  manda** ("Run workflow" com publicar = sim).
- A versão do cache offline (`sw.js`) muda sozinha a cada build diferente.

# Etapas 2 a 8

| Etapa | Onde está | O que faz |
|---|---|---|
| 2 · Controles | `game/core/133-e2-teclas-configuraveis.js`, `game/ui/072-v84…` | todas as teclas do PC podem ser trocadas; barra de magias cabe no celular em pé |
| 3 · Mundo | `game/world/135-e3-setores-memoria.js` | setores longe liberam a memória de vídeo e voltam sozinhos (Vila Hage: ~1.100 → ~300 formas na GPU) |
| 4 · RPG | `game/progression/136-e4-reputacao-reinos.js` | reputação por reino com consequências (loja, recompensas, avisos, Status); salva no campo `rep` |
| 5 · Multiplayer | `server/`, `game/multiplayer/137-e5-servidor-colyseus.js`, `docs/SERVIDOR.md` | servidor Colyseus com regras de validação; o jogo usa quando `CLOVER_SERVER_URL` existe |
| 6 · Interface | `game/ui/138-e6-hud-telas-grandes.js` | HUD cresce em monitores grandes; menus conferidos de 320 px a 2560 px |
| 7 · Otimização e testes | — | auditoria completa (magias, 163 casas, sistemas, regressões) em Chromium e WebKit |
| 8 · Publicação | `src-tauri/`, `.github/workflows/windows.yml` | instalador do Windows gerado no GitHub; versão web pelo GitHub Pages quando o dono autorizar |

## Coisas que ainda não foram feitas (e por quê)

- **Oclusão** (esconder o que está atrás de prédios) e **compressão de texturas (KTX2)**: exigem mudar como o mapa e os modelos
  são desenhados; ficaram para uma etapa própria, com testes de imagem.
- **Atualizar o three.js** (r128 → atual): muda muitas funções usadas pelas magias e modelos; é uma etapa grande por si só.
- **Instancing de árvores e objetos**: o v139 já junta as peças paradas, que dá um ganho parecido sem mexer no mapa.
- **Monstros comuns, XP e moedas decididos pelo servidor**: o servidor precisa de credencial de administrador do Firebase.
