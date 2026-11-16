// Servidor multiplayer do Clover RP.
//   PORT                 porta (padrão 2567)
//   FIREBASE_PROJECT_ID  opcional: só aceita jogadores com conta (token do Firebase)
import { Server } from 'colyseus';
import { WebSocketTransport } from '@colyseus/ws-transport';
import { createServer } from 'node:http';
import { SalaClover } from './sala.js';

const PORT = Number(process.env.PORT || 2567);

const http = createServer((req, res) => {
  // verificação de saúde para a hospedagem
  if (req.url === '/' || req.url === '/saude') { res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' }); res.end('Clover RP servidor ok'); return; }
  res.writeHead(404); res.end();
});

const jogo = new Server({ transport: new WebSocketTransport({ server: http }) });
jogo.define('clover', SalaClover).filterBy(['name']);
jogo.listen(PORT).then(() => console.log(`Clover RP: servidor na porta ${PORT}`));

export { jogo };
