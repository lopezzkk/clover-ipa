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
