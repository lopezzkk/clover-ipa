// ================= V137 · painel admin dentro do menu + coroar qualquer jogador como Rei Mago =================
// Quem autoriza é o servidor (regras do Firestore: realm/king e kings só aceitam gravação de administrador).
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fv=()=>firebase.firestore.FieldValue.serverTimestamp();
const A={pend:null};window.A137=A;
// ciclo do Reino (mesma conta do torneio: mês no fuso configurado pelo administrador)
function cyc(){const c=Object.assign({tz:-3},(typeof RS!='undefined'&&RS.cfg)||{});const d=new Date(Date.now()+c.tz*3600000);return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')}
const king=()=>(typeof RS!='undefined'&&RS.king)||null;
// ---------- botão do painel dentro do jogo: menu rápido (☰) e abas do Menu ----------
function qmBtn(){const q=document.getElementById('qm');if(!q)return;let b=q.querySelector('.adm137q');const ok=typeof NK82!='undefined'&&NK82.admin;if(!ok){if(b)b.remove();return}if(b)return;b=document.createElement('button');b.className='adm137q';b.innerHTML='<span>🛡️</span>Painel Admin';b.onclick=()=>{try{q.classList.remove('on');const qb=document.getElementById('qm-btn');if(qb)qb.classList.remove('on')}catch(e){}openAdm()};q.appendChild(b)}
function openAdm(){try{if(typeof closeOv=='function')closeOv()}catch(e){}try{admOpen()}catch(e){}}
window.adm137Open=openAdm;
{const _o=openMenu;openMenu=function(t){const r=_o.apply(this,arguments);try{if(typeof NK82!='undefined'&&NK82.admin){const tb=document.querySelector('#ov .tabs');if(tb&&!tb.querySelector('[data-adm137]'))tb.insertAdjacentHTML('beforeend','<button class="k" data-adm137="1" onclick="adm137Open()">🛡️ Painel Admin</button>')}}catch(e){}return r}}
setInterval(()=>{try{qmBtn()}catch(e){}},1200);
// ---------- na ficha do jogador: coroar como Rei Mago ----------
function box(uid){const p=(ADM.list||[]).find(x=>x.uid===uid)||{},k=king(),is=k&&k.uid===uid;
 return '<div class="a137" onclick="event.stopPropagation()"><b>👑 Rei Mago</b><small>Rei atual: '+(k&&k.uid?esc(k.nick||'—'):'trono vago')+'</small>'+
  (is?'<small>'+esc(p.nick||'Este jogador')+' já é o Rei Mago.</small>':'')+
  '<input id="a137w" maxlength="120" placeholder="motivo (ex.: venceu o evento da comunidade)">'+
  '<div class="r">'+(is?'':'<button onclick="adm137King(\''+esc(uid)+'\')">Tornar Rei Mago</button>')+(k&&k.uid?'<button class="rm" onclick="adm137King(\'\')">Deixar o trono vago</button>':'')+'</div><small id="a137s"></small></div>'}
window.adm137King=async function(uid){const st=document.getElementById('a137s');const say=t=>{if(st)st.textContent=t};
 if(typeof NK82=='undefined'||!NK82.admin)return say('Acesso negado pelo servidor.');
 const why=String((document.getElementById('a137w')||{}).value||'').trim().slice(0,120);if(!why)return say('Escreva o motivo.');
 const key=uid||'_vago';if(A.pend!==key){A.pend=key;return say('Toque de novo para confirmar.')}A.pend=null;
 const p=uid?(ADM.list||[]).find(x=>x.uid===uid):null;if(uid&&!p)return say('Jogador não encontrado.');say('Enviando…');
 try{const db=CLOUD.db,c=cyc(),k=king(),b=db.batch();
  b.set(db.collection('realm').doc('king'),p?{uid:p.uid,nick:String(p.nick||''),cycle:c,since:fv(),adm:true,why}:{uid:null,nick:'',cycle:c,since:fv(),adm:true,why});
  if(p)b.set(db.collection('kings').doc(c+'-adm'+Date.now()),{uid:p.uid,nick:String(p.nick||''),ts:fv(),adm:true,why});
  await b.commit();try{db.collection('rlog').add({uid:CLOUD.user.uid,t:'admin-rei',alvo:uid||'vago',why,ts:fv()})}catch(e){}
  say(p?'👑 '+p.nick+' agora é o Rei Mago!':'O trono ficou vago.');try{toast(p?'👑 '+p.nick+' foi coroado Rei Mago.':'Trono do Rei Mago vago.')}catch(e){}setTimeout(redraw,800)}
 catch(e){const c=(e&&e.code)||'erro';say(c=='permission-denied'?'O servidor recusou (sem permissão). Confira se as regras novas do Firestore foram publicadas e se você entrou com a conta de administrador.':c=='unavailable'?'Sem internet agora. Tente de novo.':'Não deu certo ('+c+').')}};
function redraw(){const lg=document.querySelector('#adm82l .lg');if(!lg)return;const o=lg.querySelector('.a137');if(o)o.outerHTML=box(ADM.open)}
setInterval(()=>{try{const o=document.getElementById('adm82');if(!o||!o.classList.contains('on'))return;if(typeof ADM!='undefined'&&ADM.open){const lg=document.querySelector('#adm82l .lg');if(lg&&!lg.querySelector('.a137'))lg.insertAdjacentHTML('afterbegin',box(ADM.open))}}catch(e){}},500);
const css=document.createElement('style');css.textContent='.a137{margin:6px 0 10px;padding:8px;border:1px solid #f0cf7288;border-radius:10px;background:#1c1606cc}.a137 b{display:block;color:#f0cf72;margin-bottom:4px}.a137 small{display:block;opacity:.85;margin:3px 0}.a137 input{width:100%;box-sizing:border-box;padding:7px;border-radius:8px;border:1px solid #ffffff33;background:#0b0b0b;color:#fff;font:inherit;margin:4px 0}.a137 .r{display:flex;gap:6px;flex-wrap:wrap}.a137 button{padding:7px 12px;border-radius:8px;border:1px solid #f0cf72;background:#3a2a05;color:#ffe9a8;font:inherit}.a137 button.rm{border-color:#ff6a6a;background:#3a0a0a;color:#ffd0d0}';document.head.appendChild(css);
})();

