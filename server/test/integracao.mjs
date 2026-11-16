// Teste de verdade: liga o servidor, conecta jogadores com o cliente oficial do Colyseus e confere tudo.
process.env.PORT = process.env.PORT || '25690';
const { Client } = await import('colyseus.js');
await import('../dist/index.js');
await new Promise(r => setTimeout(r, 800));

const URL = 'ws://127.0.0.1:' + process.env.PORT;
let ok = true; const c = (v, t) => { console.log((v ? 'OK   ' : 'FALHA') + ' ' + t); if (!v) ok = false };
const espera = ms => new Promise(r => setTimeout(r, ms));
function jogador() {
  const cl = new Client(URL); const log = { ola: null, p: [], entrou: [], saiu: [], aviso: [] };
  return { cl, log, async entra(name) {
    const room = await cl.joinOrCreate('clover', { name });
    for (const k of ['ola', 'p', 'entrou', 'saiu', 'aviso']) room.onMessage(k, m => { if (k === 'ola') log.ola = m; else log[k].push(m) });
    this.room = room; await espera(300); return room;
  } };
}

try {
  const a = jogador(), b = jogador();
  await a.entra('main'); await b.entra('main');
  c(a.log.ola && b.log.ola && b.log.ola.peers.length === 2, 'dois jogadores na sala principal');
  c(a.log.entrou.some(e => e.id === b.room.sessionId), 'o primeiro vê o segundo entrar');

  a.room.send('p', { nm: '<script>Yuno', lv: 30, p: [0, 0] }); await espera(300);
  const vista = b.log.p.find(m => m.id === a.room.sessionId);
  c(vista && vista.patch.nm === 'scriptYuno' && vista.patch.lv === 30, 'presença chega limpa no outro jogador');

  a.room.send('p', { p: [3, 0] }); await espera(80); a.room.send('p', { p: [200, 0] }); await espera(80); a.room.send('p', { p: [-200, 0] }); await espera(300);
  c(a.log.aviso.some(x => x.motivo === 'teleporte'), 'servidor nega teleportes seguidos e avisa');

  a.room.send('p', { bh: [{ n: 1, id: 'boss1', d: 999999 }] }); await espera(300);
  const golpe = b.log.p.filter(m => m.id === a.room.sessionId && m.patch.bh).pop();
  c(golpe && golpe.patch.bh[0].d === 50 + 30 * 60, 'dano exagerado no chefe chega cortado para os outros (' + (golpe && golpe.patch.bh[0].d) + ')');

  // salas de partida separadas, com no máximo 4 jogadores
  const s = [jogador(), jogador(), jogador(), jogador()];
  for (const x of s) await x.entra('clv-abc123');
  c(s[3].log.ola.peers.length === 4 && s[0].log.ola.nome === 'clv-abc123', 'sala de partida com 4 jogadores');
  let cheio = false; try { await jogador().entra('clv-abc123'); } catch { cheio = true; }
  c(cheio, 'quinto jogador não entra na sala cheia');
  c(!a.log.p.some(m => s.some(x => x.room.sessionId === m.id)), 'salas não se misturam');

  await b.room.leave(); await espera(300);
  c(a.log.saiu.some(e => e.id === b.room.sessionId), 'saída avisada aos outros');
  for (const x of s) await x.room.leave(); await a.room.leave();
} catch (e) { console.error(e); ok = false; }
console.log(ok ? 'TUDO OK' : 'HOUVE FALHA');
process.exit(ok ? 0 : 1);
