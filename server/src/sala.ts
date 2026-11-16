// Sala do Clover RP no Colyseus. Fala o mesmo "idioma" de presença que o jogo já usa
// (presença por jogador + lista de jogadores), então o multiplayer do jogo funciona sem reescrever,
// só que agora tudo passa pelas regras do servidor (regras.ts).
import { Room, type Client } from 'colyseus';
import { novoJogador, validarPatch, nomeSala, type EstadoJogador } from './regras.js';
import { verificarToken } from './auth.js';

interface Opcoes { name?: string; token?: string }

export class SalaClover extends Room {
  maxClients = 64;
  private static abertas = new Set<string>();
  private nome = 'main';
  private js = new Map<string, EstadoJogador>();
  private uids = new Map<string, string>();

  onCreate(op: Opcoes) {
    const nome = nomeSala(op.name) ?? 'main';
    // sala de partida cheia: o Colyseus criaria outra com o mesmo código; aqui isso é recusado
    if (nome !== 'main' && SalaClover.abertas.has(nome)) throw new Error('sala cheia');
    this.nome = nome;
    if (nome !== 'main') { SalaClover.abertas.add(nome); this.maxClients = 4; } // como no jogo: até 4 por sala
    void this.setMetadata({ nome });
    this.autoDispose = true;

    this.onMessage('p', (c, msg) => {
      const j = this.js.get(c.sessionId); if (!j) return;
      const r = validarPatch(j, msg, Date.now());
      if (!r.ok) { if (r.motivo !== 'frequencia') c.send('aviso', { motivo: r.motivo }); return; }
      if (r.avisos.length) c.send('aviso', { motivo: r.avisos[0] });
      // corrige a cópia do próprio jogador e avisa todos
      this.broadcast('p', { id: c.sessionId, patch: r.patch, t: Date.now() });
      if (j.avisos > 200) c.leave(4001); // insiste em mandar dados inválidos
    });
  }

  async onAuth(_c: Client, op: Opcoes) {
    // com FIREBASE_PROJECT_ID configurado, só entra quem tem conta; sem ele, convidados também entram (como hoje)
    const uid = await verificarToken(op?.token);
    if (uid === false) throw new Error('conta inválida');
    return { uid: uid || null };
  }

  onJoin(c: Client, _op: Opcoes, auth?: { uid: string | null }) {
    this.js.set(c.sessionId, novoJogador());
    if (auth?.uid) this.uids.set(c.sessionId, auth.uid);
    const peers = [...this.js.entries()].map(([id, j]) => ({ id, presenca: j.presenca, uid: this.uids.get(id) ?? null }));
    c.send('ola', { eu: c.sessionId, peers, nome: this.nome });
    this.broadcast('entrou', { id: c.sessionId, uid: this.uids.get(c.sessionId) ?? null }, { except: c });
  }

  onDispose() { if (this.nome !== 'main') SalaClover.abertas.delete(this.nome); }

  onLeave(c: Client) {
    this.js.delete(c.sessionId); this.uids.delete(c.sessionId);
    this.broadcast('saiu', { id: c.sessionId });
  }
}
