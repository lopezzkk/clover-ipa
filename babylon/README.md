# Clover RP · versão experimental (Babylon.js)

Versão de testes. **Não é publicada** (nem GitHub Pages, nem APK, nem instalador) sem autorização do dono do jogo.

## Como funciona

O jogo original continua inteiro: lógica, menus, magias, missões, online, salvamento.
Só o desenho da tela passa pela **ponte** (`src/ponte/`), que lê a cena do jogo a cada quadro e desenha com o Babylon.js.
Se a ponte der erro 5 vezes, o jogo volta sozinho a desenhar como antes (nada trava).

Montar: `node montar-jogo.mjs [--saida=teste.html]` gera `dist/clover-rp-babylon.html`.

## Módulos da ponte

| Arquivo | O que faz |
|---|---|
| `index.ts` | Motor, câmera, luzes, sombras, céu, brilho, pós-processamento, 5 níveis gráficos, corte por distância |
| `tradutor.ts` | Converte malhas, materiais, texturas e sprites do jogo para o Babylon |
| `visual.ts` | Texturas de detalhe do cenário, grama, partículas de magia por elemento |
| `personagens.ts` | Corpo e rosto novos do jogador, moradores, inimigos humanos e outros jogadores (segue as articulações do jogo) |
| `grimorios.ts` | Emblema 3D por atributo, pedra brilhante, fragmentos e partículas em volta do grimório |
| `chefes.ts` | Aura de fumaça, brasas, olhos brilhando e círculo de poder nos chefes e demônios (comportamento é do jogo) |
| `natureza.ts` | Água com ondas (lagos, rio, mar) e vento na grama e nas copas |

## Otimização (por nível)

| | Muito baixo | Baixo | Médio | Alto | Ultra |
|---|---|---|---|---|---|
| Alcance de objetos pequenos | 70 m | 95 m | 130 m | 170 m | 240 m |
| Sombras | não | 1024 | 2048 (36 m) | 2048 (48 m) | 4096 (48 m) |
| Partículas de magia por quadro | 0 | 12 | 30 | 50 | 80 |
| Grama | não | não | 32 m | 48 m | 64 m |
| Chefes com aura | 0 | 2 (sem fumaça) | 4 | 4 | 4 |
| Vento | não | fraco | sim | sim | sim |
| Pós-processamento | não | não | sim | sim + nitidez | sim + SSAO |

- Personagens: todas as peças do mesmo tipo são **um único desenho com instâncias** (cada personagem custa quase nada a mais).
- Personagens longe: atualizados 1 a cada 3 quadros; muito longe: não desenhados.
- O corpo antigo com esqueleto do jogador deixou de ser calculado no processador (era o item mais caro da ponte).
- Objetos que somem há 600 quadros e saíram da cena são liberados da memória; personagens após 900 quadros.
- `PONTE141.info()` mostra: tempo da ponte (`ms`), tempo só da cópia da cena (`msSync`), desenhos, objetos cortados, personagens, chefes, partículas por elemento.

## Créditos

Mantidos os mesmos do jogo original (modelos e sons CC-BY/CC0 listados no jogo). Todos os modelos novos da ponte são originais, feitos com formas simples.
