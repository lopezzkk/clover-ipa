# Perfil de desempenho — versão Babylon (ramo `babylon-completo`)

Gerado em 21/11/2026, seguindo o método da skill `perf-profile` (Claude Code Game Studios):
medir antes de otimizar, separar o que foi medido do que não foi, e nunca dar "passou" sem dado.

## Como foi medido

- Navegador sem placa de vídeo (Chromium com renderização por software), Vila Hage e Capital, gráfico **alto**.
- Tempo de processador por parte da ponte, com `PONTE141.info().perfil` (média móvel em ms por quadro).
- Desenhos por quadro com o contador do Babylon (`desenhos`), ligando e desligando sombra e brilho para separar cada passada.

## Metas

| Métrica | Meta | Medido | Situação |
|---|---|---|---|
| Quadros por segundo no celular | nenhuma meta definida | não dá para medir sem aparelho real | NÃO AVALIADO |
| Desenhos por quadro (alto, vila) | nenhuma meta definida | **723 → 354** | melhorou 51% |
| Memória JS | nenhuma meta definida | ~174 MB | NÃO AVALIADO (sem meta) |
| Tempo da cópia da cena (three → Babylon) | nenhuma meta definida | ~8,5–9 ms por quadro | ponto mais caro do processador |

O tempo de desenho (`desenhoBabylon`, ~90–120 ms) vem da renderização por software do teste e **não** representa um celular com placa de vídeo.

## Pontos quentes encontrados

| # | Onde | Problema | Correção | Situação |
|---|---|---|---|---|
| 1 | Camada de brilho | A regra "só desenha o que brilha" não estava valendo no Babylon 8 (a regra fica numa camada interna) — ~250 desenhos a mais por quadro | Regra aplicada também na camada interna | **Corrigido** |
| 2 | Sombras | 224 objetos faziam sombra, inclusive longe do jogador, onde a sombra nem aparece | Só fazem sombra os objetos a até 60 m do jogador (revisado a cada meio segundo) | **Corrigido** (224 → 74) |
| 3 | Cópia da cena (three.js → Babylon) | ~9 ms por quadro percorrendo a cena do three.js | Só some quando cada parte do jogo for refeita direto em Babylon | Pendente (fase de tirar o three.js) |
| 4 | Montagem do mapa novo | ~0,9 s uma vez ao entrar no jogo | Aceitável por enquanto; pode ir para um trabalhador em segundo plano | A investigar |

Sem mudança visual: as fotos de antes e depois são iguais.

## O que precisa de teste em aparelho real

- Quadros por segundo nos 5 níveis gráficos (celular Android e iPhone).
- Memória depois de 30 minutos jogando.

## Rodada 2 — cópia da cena (21/11/2026)

Medido com amostras sem média (`PONTE141.bruto = {}`), 35–40 quadros por rodada, Vila Hage, gráfico alto:

- A cópia percorre **~5.800 nós** da cena do three.js e traduz **~580 malhas** por quadro; a tradução das malhas é ~2/3 do tempo.
- **Teste 1: "cenário parado"** (conferir cada pedaço do mapa só a cada 8 quadros): 4,5 ms contra 4,8 ms sem ele — ganho de ~6%, dentro do ruído, com risco de atraso visual. **Desfeito.**
- **Teste 2: tradução de materiais sem montar texto a cada objeto** e geometria sem criar objeto novo a cada chamada: em rodadas alternadas, 6,9 / 8,9 ms (antes) contra 7,3 / 7,8 ms (depois). **Sem diferença que dê para provar aqui** (o ruído desta máquina é de ±25%). Mantido porque gera menos lixo na memória, mas sem ganho medido.
- Conclusão: neste computador de testes a cópia da cena custa ~7 ms por quadro e não cai com ajustes pequenos. O ganho grande só vem de **não precisar copiar**: as partes do jogo refeitas direto em Babylon (já feito: terreno, florestas, água, grama, céu, chuva, interface, vilas, castelos, interiores).
- Medir em aparelho real continua pendente.

## Rodada 3 — tirando trabalho do three.js (21/11/2026)

- **Cenário fixo só no Babylon:** 1.565 peças juntadas do mapa (563 pedaços) saem da cena do three.js. Partes percorridas por quadro: 5.792 → 4.230; objetos traduzidos: 579 → 456.
- **Congelamento geral:** peças sólidas paradas por ~2 s viram só Babylon (com correção automática de posição, visibilidade, material e remoção). Personagens ficam de fora. Corrigido depois: peças na camada escondida do jogo (originais já juntadas) e materiais invisíveis não entram.
- **Formas das magias compartilhadas:** formas iguais (mesmo tipo e medidas) usam uma forma pronta no Babylon. Teste com 24 magias: 177 de 200 formas reaproveitadas, 23 novas.
- **Ondas de choque (kShock) nativas:** 0 objetos criados em 33 ondas (antes 66).
- **Materiais das magias:** reserva para reaproveitar quando o jogo libera o material (no teste o jogo não liberou nenhum, então sem efeito medido).

## Rodada 4 — carregamento dos modelos 3D (21/11/2026)

- **Antes:** os 7 modelos .glb (Nero, Grimório do Asta, Espada Destruidora, Slotos, Plumede, Walgner, Belzebu) eram lidos pelo GLTFLoader do three.js (`vendor/089-gl100.js`).
- **Testado e descartado:** o carregador oficial de glTF do Babylon. Ele soma ~970 KB à ponte (materiais PBR e shaders que o jogo não usa). Ficaria mais pesado, não mais leve.
- **Feito:** leitor próprio de .glb na ponte (`modelos.ts`, ~5 KB): lê o arquivo, monta a mesma estrutura que o jogo esperava, e as texturas são carregadas pelo Babylon e usadas direto no desenho (sem converter de novo). O `vendor/089` não entra mais no build Babylon (só no Babylon; a versão publicada não muda).
- **Conferência dado a dado** contra o leitor antigo, nos 7 modelos: nomes, matrizes, posições, normais, UV, cores dos vértices, índices, tipo e cor do material, transparência, lado e tamanho/repetição das texturas — **0 diferenças** (no Nero só a ordem de irmãos na árvore muda, porque o leitor antigo ordenava por quem terminava de carregar primeiro; comparando por nome, 0 diferenças). Caixas de tamanho idênticas.
- **Tempo para ler os 7 modelos** (computador de testes): ~2.930 ms (three.js) → ~140 ms (novo).
- **Tamanho:** −42 KB do leitor antigo, +~5 KB do novo.

## Camada própria — fase 1: matemática (21/11/2026)

- `babylon/src/compat/matematica.ts`: Vector2/3/4, Quaternion, Euler, Matrix3, Matrix4, Color, Box3, Sphere, Plane, Ray e MathUtils com os mesmos nomes e comportamento do three.js r128.
- Teste `babylon/testes/matematica.mjs`: 174 métodos × 1.000 contas aleatórias cada = **185.000 contas iguais ao three.js, 0 diferenças**. Teste de sabotagem (erros colocados de propósito) confirma que o teste pega erros.
- Ainda não ligada no jogo: entra junto com a fase 2 (objetos 3D próprios em cima do Babylon), porque as posições/giros dos objetos usam essa matemática.

## Camada própria — fase 2: sem a biblioteca three.js (26/11/2026)

- O build Babylon **não baixa mais o three.js r128** (603 KB, vindo do cdnjs/jsdelivr/unpkg). No lugar entra a camada própria (`montar-compat.mjs`): só as partes de dados (objetos, formas, materiais, luzes, câmera, texturas, curvas) — **200 KB**, dentro do arquivo do jogo — com a **matemática própria ligada** (as 12 classes de matemática do three.js não entram mais).
- Ficaram de fora: renderizador WebGL, carregadores, áudio, ajudantes. O desenho é só do Babylon. O desenho de reserva (three.js) deixou de existir: se a ponte der erro, o Babylon continua desenhando e o erro fica registrado.
- Teste `testes/camada.mjs` contra o three.js original: todas as 13 geometrias com medidas aleatórias (40 cada), torno, tubo, forma, extrusão, operações de forma, árvore de objetos (giros, mira, posição no mundo, `attach`, clone), câmera e projeção, clique (Raycaster), caixa de tamanho, valores padrão de 24 classes e as constantes — **562 conferências iguais, 0 diferenças**. Teste de sabotagem confirma que ele pega erros.
- Medido no computador de testes (2 rodadas, sem contar o download, que no teste vem do disco): página pronta 2,02–2,12 s → 1,85–1,96 s; memória JS 215–229 MB → 209–215 MB. Diferença pequena, perto do ruído; o ganho real é não baixar 603 KB de fora e não depender desses servidores.

## Rodada 5 — menos objetos copiados por quadro (26/11/2026)

- Medido quem é copiado a cada quadro (Vila Hage, alto): ~425 objetos, quase todos se mexendo. Os maiores grupos: roupas extras de moradores a 120–160 m (o corpo novo já some depois de ~132 m, mas as roupas continuavam soltas no ar e sendo copiadas) e enfeites pequenos que se mexem a 80–180 m (bandeiras, folhas, placas).
- **Correção 1:** morador longe some por inteiro (corpo + roupas extras) — também corrige as roupas "flutuando".
- **Correção 2:** alcance por tamanho: peças com raio < 1 m somem a 55% do alcance do nível, < 3 m a 80%, as grandes vão até o alcance (vale também para as peças congeladas).
- Resultado: **~425 → ~268 objetos por quadro (−37%)**. O tempo em ms ficou dentro do ruído desta máquina (renderização por software, ~1 quadro/s). Desenhos por quadro iguais (~362). Fotos perto e longe iguais.
- Desenhos no passo principal (~227): 92 de malhas copiadas, 40 de cenário juntado, 23 do terreno, 31 de florestas, 158 instâncias em lote (personagens etc.).
