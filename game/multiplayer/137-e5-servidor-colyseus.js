// ================= ETAPA 5 · MULTIPLAYER PELO SERVIDOR (Node.js + Colyseus) =================
// O multiplayer do jogo conversa com uma "sala" que tem presença por jogador e lista de jogadores.
// Este módulo cria essa mesma sala usando o servidor Colyseus, onde tudo passa pelas regras do servidor
// (nomes limpos, velocidade, teleporte, dano em chefe compartilhado, tamanho e frequência das mensagens).
// Só é usado quando o endereço do servidor está configurado; sem ele, o jogo continua no P2P como antes.
(function(){
const SRV={tries:0};window.srv141=SRV;
SRV.url=()=>{try{const l=localStorage.getItem('clover_srv');if(l)return l}catch(e){}return (window.CLOVER_SERVER||'').trim()};
function lib(){return new Promise((res,rej)=>{if(window.Colyseus&&Colyseus.Client)return res(Colyseus);
 const urls=[window.__COLY_URL,'https://unpkg.com/colyseus.js@0.16/dist/colyseus.js'].filter(Boolean);let i=0;
 const next=()=>{if(i>=urls.length)return rej(new Error('cliente do servidor indisponível'));const s=document.createElement('script');s.src=urls[i++];s.onload=()=>window.Colyseus?res(Colyseus):next();s.onerror=next;document.head.appendChild(s)};next()})}
async function token(){try{const a=window.firebase&&firebase.auth&&firebase.auth();const u=a&&a.currentUser;if(u)return await u.getIdToken()}catch(e){}return undefined}
async function abrir(client,name){
 const room=await client.joinOrCreate('clover',{name,token:await token()});
 const S={room,eu:room.sessionId,peers:new Map(),uids:new Map(),con:true,lsP:[],lsE:[],lsC:[],my:{},q:null,qt:0,list:Object.freeze([])};
 const mk=(id)=>Object.freeze({peer:id,by:S.uids.get(id)||null,isMe:id===S.eu,sameTab:id===S.eu,kind:'viewer',guest:!S.uids.get(id),presence:S.peers.get(id)||{},updatedAt:Date.now()});
 const emit=(joined,left,updated)=>{S.list=Object.freeze([...S.peers.keys()].map(mk));const ch={peers:S.list,joined:joined.map(mk),left:left.map(id=>({peer:id})),updated:updated.map(mk)};S.lsP.slice().forEach(f=>{try{f(ch)}catch(e){}})};
 const setCon=v=>{S.con=v;S.lsC.slice().forEach(f=>{try{f(v)}catch(e){}})};
 room.onMessage('ola',m=>{for(const p of m.peers){S.peers.set(p.id,p.presenca||{});if(p.uid)S.uids.set(p.id,p.uid)}emit([...S.peers.keys()],[],[])});
 room.onMessage('entrou',m=>{S.peers.set(m.id,{});if(m.uid)S.uids.set(m.id,m.uid);emit([m.id],[],[])});
 room.onMessage('saiu',m=>{S.peers.delete(m.id);emit([],[m.id],[])});
 room.onMessage('p',m=>{const o=Object.assign({},S.peers.get(m.id)||{});for(const k in m.patch){if(m.patch[k]===null)delete o[k];else o[k]=m.patch[k]}S.peers.set(m.id,o);emit([],[],[m.id])});
 room.onMessage('aviso',m=>{SRV.aviso=m&&m.motivo});
 room.onLeave(()=>{setCon(false);S.lsE.slice().forEach(f=>{try{f({code:'left'})}catch(e){}})});
 room.onError(()=>{});
 // junta atualizações: no máximo ~12 por segundo
 const flush=()=>{S.qt=0;if(!S.q||!S.con)return;const q=S.q;S.q=null;try{room.send('p',q)}catch(e){}};
 const api={
  presence(patch){for(const k in patch){if(patch[k]===null)delete S.my[k];else S.my[k]=patch[k]}S.q=Object.assign(S.q||{},patch);if(!S.qt)S.qt=setTimeout(flush,80);return Promise.resolve()},
  peers:()=>S.list,
  onPeers(fn,err){S.lsP.push(fn);if(err)S.lsE.push(err);setTimeout(()=>{if(S.lsP.includes(fn))fn({peers:S.list,joined:S.list,left:[],updated:[]})},0);return()=>{S.lsP=S.lsP.filter(f=>f!==fn)}},
  connected:()=>S.con,
  onConnection(fn,err){S.lsC.push(fn);if(err)S.lsE.push(err);setTimeout(()=>fn(S.con),0);return()=>{S.lsC=S.lsC.filter(f=>f!==fn)}},
  on(){return()=>{}},emit(){return Promise.resolve()},
  join(n){return abrir(client,String(n||'').toLowerCase())},
  leave(){try{room.leave()}catch(e){}setCon(false);return Promise.resolve()}
 };
 return api;
}
SRV.lobby=async()=>{const url=SRV.url();if(!url)throw new Error('sem servidor');const C=await lib();const client=new C.Client(url);SRV.client=client;return abrir(client,'main')};
// o jogo tenta o servidor primeiro (se configurado) e cai para o P2P se não conseguir
{const _i=mpInit;mpInit=async function(){if(SRV.url()&&!MP.lobby){try{MP.nick=getNick();MP.lobby=await SRV.lobby();MP.net='servidor';MP.ready=1;
   MP.lobby.presence({app:'clover',nm:MP.nick}).catch(()=>{});MP.lobby.onPeers(()=>mpRefresh(),()=>{MP.lobby=null;mpRefresh()});MP.lobby.onConnection(c=>{MP.ok=c;mpRefresh()},()=>{});mpRefresh();return}
  catch(e){console.warn('[Clover] servidor indisponível, usando P2P',e);MP.lobby=null}}
 return _i.apply(this,arguments)};window.mpInit=mpInit}
{const _r=mpRefresh;mpRefresh=function(){const r=_r.apply(this,arguments);try{if(MP.net==='servidor'){const n=$('mp-note');if(n)n.textContent=n.textContent.replace(/\[Rede: [^·]*·/,'[Rede: servidor Clover ·')}}catch(e){}return r};window.mpRefresh=mpRefresh}
})();
