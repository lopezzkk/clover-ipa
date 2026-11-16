// ================= V135 · MISSÕES DIÁRIAS E SEMANAIS + EVENTO DO DEMÔNIO GIGANTE NA VILA =================
(function(){
const X=window.X124;if(!X||!X.on)return;
// ---------- missões ----------
const POOL_D=[{k:'kill',n:'Derrote {n} inimigos',a:[15,25,35]},{k:'cast',n:'Use {n} magias',a:[30,45,60]},{k:'reacao',n:'Cause {n} reações de elemento',a:[12,20]},{k:'dash',n:'Dê {n} esquivas',a:[15,25]},{k:'combo',n:'Faça {n} combos com amigos',a:[1,2,3]},{k:'boss',n:'Derrote {n} chefe',a:[1]}];
const POOL_W=[{k:'kill',n:'Derrote {n} inimigos',a:[150,200]},{k:'combo',n:'Faça {n} combos com amigos',a:[10,15]},{k:'evento',n:'Derrote {n} Demônio Gigante da Vila',a:[1,2]},{k:'boss',n:'Derrote {n} chefes',a:[3,5]}];
const uidK=()=>{try{return(CLOUD&&CLOUD.user&&CLOUD.user.uid)||'local'}catch(e){return'local'}};
const day=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
const week=()=>{const d=new Date(),j=new Date(d.getFullYear(),0,1);return d.getFullYear()+'w'+Math.ceil(((d-j)/864e5+j.getDay()+1)/7)};
function rnd(seed){let s=0;for(const c of seed)s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296}}
function gen(pool,n,seed,mult){const r=rnd(seed),p=pool.slice(),out=[];while(out.length<n&&p.length){const i=Math.floor(r()*p.length),m=p.splice(i,1)[0];const need=m.a[Math.floor(r()*m.a.length)];out.push({k:m.k,t:m.n.replace('{n}',need),need,v:0,got:0,rc:Math.round((m.k=='combo'||m.k=='boss'||m.k=='evento'?2:1)*mult*(60+need*2))})}return out}
let D=null;function load(){const key='clv_dm135_'+uidK();let o=null;try{o=JSON.parse(localStorage.getItem(key)||'null')}catch(e){}if(!o)o={};if(o.d!==day()){o.d=day();o.dl=gen(POOL_D,3,'d'+day()+uidK(),1)}if(o.w!==week()){o.w=week();o.wl=gen(POOL_W,2,'w'+week()+uidK(),4)}o.key=key;D=o;save();return D}
function save(){try{localStorage.setItem(D.key,JSON.stringify(D))}catch(e){}}
X.DM135=()=>D||load();
function prog(k,n){const d=load();let done=null;for(const m of d.dl.concat(d.wl)){if(m.k!==k||m.v>=m.need)continue;m.v=Math.min(m.need,m.v+n);if(m.v>=m.need)done=m}save();if(done){try{toast('📜 Missão cumprida: '+done.t+' — resgate em Menu › Missões')}catch(e){}}}
['kill','cast','reacao','combo','boss','evento','dash'].forEach(k=>X.on(k,n=>prog(k,n)));
{const _dg=dodge;dodge=function(){const b=P.dg||0;const r=_dg.apply(this,arguments);try{if((P.dg||0)>b+.5)X.ev('dash',1)}catch(e){}return r};window.dodge=dodge}
window.dm135Get=function(w,i){const d=load(),m=(w?d.wl:d.dl)[i];if(!m||m.v<m.need||m.got)return;m.got=1;save();P.coins+=m.rc;try{gainXP(Math.round(needXP(P.lv)*(w?.25:.08)))}catch(e){}try{saveGame()}catch(e){}try{toast('Recompensa: +'+m.rc+' moedas e XP!')}catch(e){}try{openMenu('q')}catch(e){}};
function block(){const d=load();const row=(m,i,w)=>'<div class="dm"><div><b>'+m.t+'</b><small>'+m.v+'/'+m.need+' · '+m.rc+' moedas</small><i><u style="width:'+Math.round(m.v/m.need*100)+'%"></u></i></div>'+(m.got?'<span class="ok">✔</span>':m.v>=m.need?'<button class="k sm" onclick="dm135Get('+(w?1:0)+','+i+')">Resgatar</button>':'')+'</div>';
 const nx=new Date();nx.setHours(24,0,0,0);const h=Math.floor((nx-Date.now())/36e5);return '<div class="dm135"><h3>📜 Missões diárias <small>(renovam em '+h+' h)</small></h3>'+d.dl.map((m,i)=>row(m,i,0)).join('')+'<h3>🗓️ Missões da semana</h3>'+d.wl.map((m,i)=>row(m,i,1)).join('')+'</div>'}
{const _om=openMenu;openMenu=function(t){const r=_om.apply(this,arguments);try{if(mt=='q'&&P.g){const c=document.querySelector('#ov .card');if(c&&!c.querySelector('.dm135')){const tb=c.querySelector('.tabs');const w=document.createElement('div');w.innerHTML=block();(tb&&tb.nextSibling)?c.insertBefore(w.firstChild,tb.nextSibling):c.appendChild(w.firstChild)}}}catch(e){}return r}}
// ---------- EVENTO: DEMÔNIO GIGANTE NA VILA HAGE ----------
try{BOSSES.demonio={n:'Demônio Gigante da Vila',x:6,z:-16,lv:35,gr:null,rnd:0,lk:{top:0x14060a,pants:0x0a0306,hs:3,hair:0x0a0a0a,coat:1,cape:0x3a0610,h:2.7,w:2.4,skin:0x2a1418,eye:0xff2020,boots:1,belt:1},book:0x3a0610}}catch(e){}
const EV={last:'',slam:4,adm:0};X.EV135=EV;
function evBoss(){return enemies.find(e=>e.boss&&e.bt2==='demonio'&&e.hp>0)}
function startEvent(src){if(evBoss())return null;if(MP&&MP.r&&!MP.host){return null}// numa sala só quem é anfitrião cria (os outros recebem do anfitrião)
 const lv=Math.max(30,P.lv||1),e=spawnBoss('demonio',{x:6,z:-16,lv,mhp:Math.round(2500+260*lv)});if(!e)return null;e.ev135=1;
 try{banner('EVENTO: DEMÔNIO GIGANTE!','Ele apareceu na praça da Vila Hage — chame seus amigos!','#ff4060')}catch(_){}try{toast('👹 Evento: um Demônio Gigante apareceu na Vila Hage!'+(src=='adm'?' (iniciado por um administrador)':''))}catch(_){}
 return e}
X.startEvent135=startEvent;
// visual do demônio: modelo de demônio alado (o mesmo dos contratos), gigante, no lugar do boneco
function deco(e){if(!e||e.dm135)return;try{const dm=D120.build.walgner();dm.scale.setScalar(3.4);e.m.children.forEach(c=>c.visible=false);e.m.add(dm);e.dm135=dm}catch(_){}}
{const _sb=spawnBoss;spawnBoss=function(type,o){const e=_sb.apply(this,arguments);try{if(type==='demonio')deco(e)}catch(_){}return e};window.spawnBoss=spawnBoss}
function animTick(){const t=performance.now()/1000;for(const e of enemies){if(e.dm135&&e.hp>0){const u=e.dm135.userData;if(u&&u.anim115)try{u.anim115(t,e.ag?1:0)}catch(_){}e.dm135.rotation.y=0}}}
// todo começo de hora (minutos 0 a 9) o demônio aparece se você estiver perto da Vila Hage
function sched(){const d=new Date(),k=d.toDateString()+d.getHours();if(d.getMinutes()<10&&EV.last!==k&&Math.hypot(P.x,P.z)<140&&run){EV.last=k;startEvent('hora')}}
// golpe forte do demônio: avisa com círculo vermelho e depois esmaga
function slamTick(dt){const e=evBoss();if(!e||!run)return;EV.slam-=dt;if(EV.slam>0)return;EV.slam=7;const tx=P.x,tz=P.z;if(Math.hypot(tx-e.x,tz-e.z)>16)return;
 const m=new T.Mesh(new T.CircleGeometry(4,40),new T.MeshBasicMaterial({color:0xff2020,transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(tx,.07,tz);S.add(m);const rg=new T.Mesh(new T.RingGeometry(3.8,4,48),X.addM(0xff4040,.9));rg.rotation.x=-Math.PI/2;rg.position.set(tx,.08,tz);S.add(rg);
 try{dmgNum(e.x,4.5,e.z,'GOLPE FORTE!',0,'xp')}catch(_){}e.cast=1.3;
 kfx({u:F=>{const t=F.t;m.material.opacity=.15+.25*Math.min(1,t/1.3);m.scale.setScalar(Math.min(1,t/1.3));if(t>1.3&&!F.h){F.h=1;kShock(tx,tz,4.5,0xff2040,.4,.2);P.shake=Math.max(P.shake||0,.5);try{X.snd('boom',.8)}catch(_){}if(Math.hypot(P.x-tx,P.z-tz)<4)hurt(Math.round(P.mhp*.28))}return t<1.6},end:()=>{X.dispose(m);X.dispose(rg)}})}
// recompensa extra do evento
X.on('boss',(n,e)=>{if(e&&e.bt2==='demonio'){X.ev('evento',1);P.coins+=500;try{banner('DEMÔNIO DERROTADO!','+500 moedas do evento','#ffd23f')}catch(_){}}});
{const _u=tUpdate;let k=0;tUpdate=function(dt){const r=_u.apply(this,arguments);try{slamTick(dt);animTick();if(++k%60==0){sched();admPoll()}}catch(e){}return r}}
// administrador pode começar o evento agora (Firestore: realm/event, as regras já permitem só admin gravar)
let admLast=0,admSeen=null;async function admPoll(){if(Date.now()-admLast<45000)return;admLast=Date.now();try{if(typeof CLOUD=='undefined'||!CLOUD.user||!CLOUD.db)return;const d=await CLOUD.db.collection('realm').doc('event').get();if(!d.exists)return;const v=d.data()||{};const at=v.at&&v.at.toMillis?v.at.toMillis():0;if(admSeen==null){admSeen=at;if(Date.now()-at<10*60000&&Math.hypot(P.x,P.z)<140)startEvent('adm');return}if(at>admSeen){admSeen=at;if(Date.now()-at<10*60000)startEvent('adm')}}catch(e){}}
window.ev135Adm=async function(){if(typeof NK82=='undefined'||!NK82.admin){toast('Acesso negado pelo servidor.');return}try{await CLOUD.db.collection('realm').doc('event').set({kind:'demonio',at:firebase.firestore.FieldValue.serverTimestamp(),by:CLOUD.user.uid});toast('Evento iniciado para todos os jogadores perto da Vila Hage!');startEvent('adm')}catch(e){toast('O servidor recusou ('+((e&&e.code)||'erro')+').')}};
setInterval(()=>{try{const o=document.getElementById('adm82');if(!o||!o.classList.contains('on'))return;if(o.querySelector('.ev135'))return;const h=o.querySelector('.ah');const d=document.createElement('div');d.className='ev135';d.innerHTML='<button onclick="ev135Adm()">👹 Começar evento do Demônio Gigante agora</button>';(h&&h.parentNode?h.parentNode:o).insertBefore(d,h?h.nextSibling:o.firstChild)}catch(e){}},500);
const css=document.createElement('style');css.textContent='.dm135{margin:8px 0;padding:8px;border:1px solid #ffd23f55;border-radius:10px;background:#00000022}.dm135 h3{margin:4px 0;font-size:15px}.dm135 h3 small{opacity:.7;font-weight:400}.dm135 .dm{display:flex;gap:8px;align-items:center;margin:5px 0}.dm135 .dm>div{flex:1}.dm135 .dm b{display:block;font-size:13px}.dm135 .dm small{opacity:.75;font-size:11px}.dm135 i{display:block;height:5px;border-radius:3px;background:#0004;margin-top:3px;overflow:hidden}.dm135 u{display:block;height:100%;background:linear-gradient(90deg,#ffb000,#ffe27a)}.dm135 .ok{color:#7dff9a;font-weight:700}.ev135{margin:6px 0}.ev135 button{width:100%;padding:8px;border-radius:8px;border:1px solid #ff4060;background:#3a0612;color:#ffd0d8;font:inherit}';document.head.appendChild(css);
})();

