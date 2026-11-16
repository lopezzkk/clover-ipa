// ================= V127 · presentes do administrador (nível, moedas, grimório, aviso) =================
// O admin cria um pedido em grants/{id}; só o servidor (regras do Firestore) decide quem pode criar.
// O jogador recebe ao entrar e a cada 40 s, aplica e marca como entregue. Nenhum e-mail fica no código.
(function(){
const fv=()=>firebase.firestore.FieldValue.serverTimestamp();
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const G127={busy:false,last:0,seen:new Set()};window.G127=G127;
function upTo(lv){lv=Math.max(1,Math.min(typeof LVMAX=='number'?LVMAX:50,Math.round(lv)));let n=0;while(P.lv<lv&&n<80){n++;const need=needXP(P.lv)-(P.exp||0);gainXP(Math.max(1,need))}}
async function apply(doc){const g=doc.data()||{};if(G127.seen.has(doc.id))return;G127.seen.add(doc.id);const out=[];
 try{if(typeof g.lv=='number'&&g.lv>P.lv){const a=P.lv;upTo(g.lv);out.push('nível '+a+' → '+P.lv)}}catch(e){}
 try{if(typeof g.coins=='number'&&g.coins>0){P.coins+=Math.round(g.coins);out.push('+'+Math.round(g.coins)+' moedas')}}catch(e){}
 try{if(typeof g.xp=='number'&&g.xp>0){gainXP(Math.round(g.xp));out.push('+'+Math.round(g.xp)+' XP')}}catch(e){}
 try{if(typeof g.giros=='number'&&g.giros>0){P.giros=(P.giros||0)+Math.round(g.giros);out.push('+'+Math.round(g.giros)+' giros de clã')}}catch(e){}
 try{if(g.g&&GR[g.g]&&(!P.g||P.g.id!==g.g)){giveGrim(g.g);out.push('grimório '+GR[g.g].n)}}catch(e){}
 try{saveGame()}catch(e){}
 try{await doc.ref.update({done:true,at:fv()})}catch(e){}
 const msg=g.msg?String(g.msg).slice(0,140):'';
 if(out.length||msg){try{banner('PRESENTE DO ADMIN',(out.join(' · ')||'').slice(0,90),'#ffd23f')}catch(e){}try{toast('🛡️ Administrador: '+(out.length?out.join(', '):'')+(msg?(out.length?' — ':'')+msg:''))}catch(e){}}}
async function poll(){if(G127.busy)return;try{if(typeof CLOUD=='undefined'||!CLOUD.user||!CLOUD.db||!P.g)return}catch(e){return}G127.busy=true;G127.last=Date.now();
 try{const q=await CLOUD.db.collection('grants').where('uid','==',CLOUD.user.uid).where('done','==',false).limit(10).get();for(const d of q.docs)await apply(d)}catch(e){}G127.busy=false}
G127.poll=poll;G127.apply=apply;
setInterval(()=>{try{if(Date.now()-G127.last>40000)poll()}catch(e){}},5000);
// ---------- painel do admin: bloco de presentes dentro da ficha do jogador ----------
function grimOpts(){return Object.keys(GR).filter(k=>GR[k]&&GR[k].n&&Array.isArray(GR[k].s)).sort((a,b)=>String(GR[a].n).localeCompare(String(GR[b].n))).map(k=>'<option value="'+esc(k)+'">'+esc(GR[k].n)+'</option>').join('')}
function box(uid){const p=(ADM.list||[]).find(x=>x.uid===uid)||{};return '<div class="g127" onclick="event.stopPropagation()"><b>🎁 Dar para '+esc(p.nick||'jogador')+'</b>'+
 '<div class="r"><input id="g127lv" type="number" min="1" max="50" placeholder="nível (1–50)"><button onclick="g127Send(\''+esc(uid)+'\',\'lv\')">Dar nível</button></div>'+
 '<div class="r"><input id="g127c" type="number" min="1" max="1000000" placeholder="moedas"><button onclick="g127Send(\''+esc(uid)+'\',\'coins\')">Dar moedas</button></div>'+
 '<div class="r"><input id="g127x" type="number" min="1" max="1000000" placeholder="XP"><button onclick="g127Send(\''+esc(uid)+'\',\'xp\')">Dar XP</button></div>'+
 '<div class="r"><input id="g127gi" type="number" min="1" max="100" placeholder="giros de clã"><button onclick="g127Send(\''+esc(uid)+'\',\'giros\')">Dar giros</button></div>'+
 '<div class="r"><select id="g127g">'+grimOpts()+'</select><button onclick="g127Send(\''+esc(uid)+'\',\'g\')">Dar grimório</button></div>'+
 '<div class="r"><input id="g127m" maxlength="140" placeholder="aviso para o jogador"><button onclick="g127Send(\''+esc(uid)+'\',\'msg\')">Enviar aviso</button></div>'+
 '<small id="g127s">O jogador recebe quando estiver online (em até 40 s).</small></div>'}
window.g127Send=async function(uid,k){const st=document.getElementById('g127s');const say=t=>{if(st)st.textContent=t};
 if(typeof NK82=='undefined'||!NK82.admin){say('Acesso negado pelo servidor.');return}
 const d={uid,by:CLOUD.user.uid,done:false,ts:fv()};
 const num=(id,a,b)=>{const v=Math.round(+((document.getElementById(id)||{}).value));return isFinite(v)&&v>=a&&v<=b?v:null};
 if(k=='lv'){const v=num('g127lv',1,50);if(v==null)return say('Digite um nível de 1 a 50.');d.lv=v}
 else if(k=='coins'){const v=num('g127c',1,1000000);if(v==null)return say('Digite uma quantidade de moedas.');d.coins=v}
 else if(k=='xp'){const v=num('g127x',1,1000000);if(v==null)return say('Digite uma quantidade de XP.');d.xp=v}
 else if(k=='giros'){const v=num('g127gi',1,100);if(v==null)return say('Digite de 1 a 100 giros.');d.giros=v}
 else if(k=='g'){const v=(document.getElementById('g127g')||{}).value;if(!GR[v])return say('Escolha um grimório.');d.g=v}
 else if(k=='msg'){const v=String((document.getElementById('g127m')||{}).value||'').trim().slice(0,140);if(!v)return say('Escreva o aviso.');d.msg=v}
 say('Enviando…');
 try{await CLOUD.db.collection('grants').add(d);say('Enviado! O jogador recebe quando estiver online.');try{CLOUD.db.collection('rlog').add({uid:CLOUD.user.uid,t:'admin-presente',k,alvo:uid,v:String(d[k]),ts:fv()})}catch(e){}
  if(uid===CLOUD.user.uid)setTimeout(poll,800)}
 catch(e){say('O servidor recusou ('+((e&&e.code)||'erro')+'). Publique as regras novas do Firestore.')}};
setInterval(()=>{try{const o=document.getElementById('adm82');if(!o||!o.classList.contains('on')||typeof ADM=='undefined'||!ADM.open)return;const lg=document.querySelector('#adm82l .lg');if(lg&&!lg.querySelector('.g127'))lg.insertAdjacentHTML('afterbegin',box(ADM.open))}catch(e){}},400);
try{const _d=admDraw;admDraw=function(){const r=_d.apply(this,arguments);try{if(ADM.open){const lg=document.querySelector('#adm82l .lg');if(lg&&!lg.querySelector('.g127'))lg.insertAdjacentHTML('afterbegin',box(ADM.open))}}catch(e){}return r};window.admDraw=admDraw}catch(e){}
const css=document.createElement('style');css.textContent='.g127{margin:6px 0 10px;padding:8px;border:1px solid #ffd23f66;border-radius:10px;background:#1a1408cc}.g127 b{display:block;margin-bottom:6px;color:#ffd23f}.g127 .r{display:flex;gap:6px;margin:4px 0}.g127 input,.g127 select{flex:1;min-width:0;padding:6px;border-radius:8px;border:1px solid #ffffff33;background:#0b0b0b;color:#fff;font:inherit}.g127 button{padding:6px 10px;border-radius:8px;border:1px solid #ffd23f;background:#3a2a05;color:#ffe9a8;font:inherit;white-space:nowrap}.g127 small{opacity:.75}';document.head.appendChild(css);
})();

