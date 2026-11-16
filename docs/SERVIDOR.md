# Servidor multiplayer (Etapa 5)

Servidor em **Node.js + Colyseus** (pasta `server/`). Ele fala a mesma "linguagem de sala" que o multiplayer do jogo
já usava (presença de cada jogador + lista de jogadores), então salas, chefes compartilhados, combos e eventos
funcionam sem reescrever o jogo — mas agora **tudo passa pelas regras do servidor** antes de chegar aos outros.

## O que o servidor confere

| Regra | O que acontece |
|---|---|
| Nomes e textos | sem HTML, tamanho limitado (nome até 16 letras) |
| Nível | entre 1 e 50 |
| Velocidade | mais rápido que 32 m/s é freado |
| Teleporte | 1 a cada 3 s (viagem rápida e interiores continuam funcionando) |
| Mapa | posição fora do mapa vira a borda |
| Dano em chefe compartilhado | no máximo 50 + nível × 60 por golpe e 8 golpes por segundo |
| Mensagens | até 20 por segundo e 8 KB por jogador; quem insiste em dados inválidos é desconectado |
| Salas de partida | até 4 jogadores; a sala cheia recusa o 5º |
| Conta (opcional) | com `FIREBASE_PROJECT_ID`, só entra quem tem login |

Ainda decidido no aparelho do jogador (próximos passos): monstros comuns, XP e moedas. Para o servidor decidir isso,
ele precisa gravar no Firestore com uma credencial de administrador (conta de serviço), que é do dono do projeto.

## Como ligar

1. Crie uma conta em um serviço de hospedagem com Docker (ex.: **Render.com**). O arquivo `render.yaml` já está pronto:
   em Render → *New* → *Blueprint* → escolha o repositório `clover-ipa`.
   - Plano gratuito do Render: o servidor "dorme" após 15 min sem uso e leva ~1 min para acordar. Para jogo sem espera, plano pago.
2. Quando o servidor estiver no ar, copie o endereço (ex.: `https://clover-rp-servidor.onrender.com`) e troque `https://` por `wss://`.
3. No GitHub: *Settings → Secrets and variables → Actions → Variables* → crie `CLOVER_SERVER_URL` com esse endereço.
4. O próximo build do jogo já usa o servidor. Se o servidor cair, o jogo volta sozinho para o P2P.

Para testar sem publicar: no navegador, `localStorage.setItem('clover_srv','wss://SEU-SERVIDOR')` e recarregar.

## Limitação conhecida

O chat de voz usa conexão direta entre jogadores (P2P) e não funciona pela sala do servidor; o resto do multiplayer funciona.

## Testes

`cd server && npm install && npm test` — regras (12 testes) e integração com o cliente oficial do Colyseus (9 testes).
Rodam no GitHub Actions a cada envio.
