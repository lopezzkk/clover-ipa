# Clover RP

RPG 3D de mundo aberto inspirado em Black Clover, que roda no navegador (Android, iPhone, iPad e PC).
Motor 3D: three.js. Contas e progresso: Firebase. Multiplayer: PeerJS (servidor Colyseus previsto na Etapa 5).

## Comandos

| Comando | O que faz |
|---|---|
| `npm install` | instala as ferramentas (precisa de internet) |
| `npm run build` | gera o site em `dist/` (vários arquivos, com cache por arquivo) |
| `npm run build:single` | gera `dist-single/clover-rpg.html` (um arquivo só, formato antigo) |
| `npm run typecheck` | confere os tipos do código TypeScript |
| `npm test` | testa o ajuste automático de efeitos |
| `npm run dev` | abre o jogo para desenvolvimento e recarrega quando um arquivo muda (Vite) |

O build também funciona sem `npm install` se o esbuild já estiver instalado na máquina: `node scripts/build.mjs`.

## Pastas

| Pasta | Conteúdo |
|---|---|
| `src/core/` | núcleo novo em TypeScript: eventos, salvamento local (IndexedDB), efeitos automáticos |
| `src/boot/` | carregador: baixa o jogo e os modelos mostrando o progresso real |
| `game/` | o jogo, dividido por sistema (mundo, magias, personagens, interface…). A ordem de carregamento está em `game/manifest.json` |
| `assets/models/` | modelos 3D (GLB e malhas), fora do código |
| `public/` | ícones, manifest e o modo offline (`sw.js`) |
| `scripts/` | build |
| `docs/` | documentação técnica |

Detalhes em [docs/ARQUITETURA.md](docs/ARQUITETURA.md).

## Segurança

O build **para com erro** se encontrar e-mail de administrador ou código secreto no que vai para o jogador.
A permissão de administrador é decidida só pelas regras do Firestore, nunca pelo código do jogo.

## Créditos dos modelos 3D

Nero (BlackCube), grimório do Asta (Ash Kelly), Destruidora (PixilatedRaven), asa (Natsu dragneel), Gimodelo (Reggie),
Espírito de Zéfiro (bbonless) — CC-BY 4.0 via Sketchfab. Demônios: Tor Halle-McIntyre (CC-BY 3.0), Grefuntor/Atmostatic (CC-BY 3.0),
Fat Demon (CC0) — OpenGameArt. three.js e GLTFLoader — licença MIT.
