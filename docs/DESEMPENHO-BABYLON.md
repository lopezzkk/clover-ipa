# Desempenho da versão Babylon.js

Medições feitas com o perfilador do Chrome (sem placa de vídeo, renderização por software — os números absolutos são piores que num celular/PC real; servem para comparar antes e depois).

## Metas (orçamento)
| Item | Meta |
|---|---|
| Quadros por segundo | 60 no PC, 30 no celular |
| Tempo da ponte (cópia da cena para o Babylon) | abaixo de 4 ms por quadro em aparelho real |
| Desenhos por quadro (nível alto, Vila Hage) | até 450 |
| Memória JS | até 300 MB |

## Medição de 17/11/2026 (Vila Hage, nível alto, 15 s de perfil, tela pequena para isolar o JavaScript)
| | Antes | Depois |
|---|---|---|
| Tempo total da ponte por quadro | 27–33 ms | 27–28 ms |
| Tempo só da cópia da cena | 12–15 ms | 10–12 ms |
| Desenhos por quadro | 939 (tela 1000×560) | 939 |

### Gargalos encontrados e corrigidos
1. Luzes do jogo eram ligadas de novo a cada quadro → o Babylon recalculava as luzes de todas as malhas (`_resyncMeshes`). Agora só quando muda.
2. Cor por vértice/transparência das malhas eram regravadas a cada quadro → materiais marcados como "sujos" sem motivo. Agora só quando muda.
3. Posição das luzes criava um vetor novo por quadro (lixo de memória). Agora reaproveita.

### Ainda a investigar
- A cópia da cena (percorrer ~2000 objetos do three.js por quadro) continua sendo o maior custo do lado do JavaScript; só some quando cada parte do jogo for montada direto no Babylon.
- Medir em aparelho real (celular e PC) — aqui não há placa de vídeo.
