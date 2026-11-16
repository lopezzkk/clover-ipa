// ================= V133 · impacto, reações de elemento, inimigos com estilos, chefes avisando e maestria das magias =================
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
// ---------- barramento de eventos (missões diárias, combos e livro usam) ----------
const EVL={};X.on=function(k,f){(EVL[k]=EVL[k]||[]).push(f)};X.ev=function(k,n,info){(EVL[k]||[]).forEach(f=>{try{f(n==null?1:n,info)}catch(e){}})};
const elOf=id=>({fogo:'fogo',agua:'agua',vento:'vento',luz:'luz',raio:'raio',tempo:'tempo',sombra:'sombra',anti:'anti',terra:'terra',sangue:'fogo',sonhos:'luz',kotodama:'vento',espacial:'sombra',bzesp:'sombra'})[id]||'arcano';X.elOf=elOf;
// ================= 11 · PAUSA NO IMPACTO =================
const HS={t:0,last:0};X.HS133=HS;
{const _u=tUpdate;let lt=performance.now();tUpdate=function(dt){const now=performance.now(),real=Math.min(.1,(now-lt)/1000);lt=now;if(HS.t>0){HS.t-=real;return _u.call(this,dt*.06)}return _u.apply(this,arguments)}}
function hitStop(s){const now=performance.now();if(now-HS.last<220)return;HS.last=now;HS.t=Math.max(HS.t,s)}
// ================= 12 · REAÇÕES DE ELEMENTO + 7 · ESTILOS DE INIMIGO =================
const RX={fogo:{n:'QUEIMANDO',c:0xff7a1a},agua:{n:'CONGELADO',c:0x9fe8ff},raio:{n:'ELETROCUTADO',c:0x6ff4ff},tempo:{n:'TRAVADO NO TEMPO',c:0xffd75a},sombra:{n:'CORROÍDO',c:0x9a40ff},luz:{n:'OFUSCADO',c:0xfff3b0},vento:{n:'DESEQUILIBRADO',c:0xb8ffd8},terra:{n:'SOTERRADO',c:0xc89a5a}};
const LIVE=new Set();
function react(e,el,d){const r=RX[el];if(!r||e.dummy&&!e.rx0)return;const now=performance.now()/1000;if(e.rxcd&&e.rxcd>now)return;e.rxcd=now+2.2;
 let k=el,dur=2.5;if(el=='agua'){if(Math.random()<.35){X.stun(e,1.1);dur=1.1}else{e.sl=Math.max(e.sl||0,2);k='agua_l'}}
 else if(el=='raio'){X.stun(e,.4);dur=.8;const o=enemies.find(o=>o!==e&&o.hp>0&&Math.hypot(o.x-e.x,o.z-e.z)<4);if(o){o.hp-=Math.max(2,d*.25);dmgNum(o.x,2.3,o.z,Math.round(Math.max(2,d*.25)),0);const b=X.bolt(r.c,.04,.9,6);S.add(b);b.userData.set(new T.Vector3(e.x,1.2,e.z),new T.Vector3(o.x,1.2,o.z),.4);kfx({u:F=>{b.material.opacity=Math.max(0,.9-F.t*4);return F.t<.25},end:()=>X.dispose(b)})}}
 else if(el=='tempo'){e.sl=Math.max(e.sl||0,2.5)}
 else if(el=='luz'||el=='vento'){e.sl=Math.max(e.sl||0,1.5);dur=1.5}
 else if(el=='terra'){X.stun(e,.6);dur=1}
 e.rx={k,el,t:dur,dot:(el=='fogo'||el=='sombra')?Math.max(2,e.mhp*.012):0,acc:0};LIVE.add(e);
 try{dmgNum(e.x,2.9,e.z,r.n,0,'xp')}catch(_){}X.ev('reacao',1,el)}
function rxTick(dt){for(const e of LIVE){const r=e.rx;if(!r||e.hp<=0||!enemies.includes(e)){if(e.rxg){X.dispose(e.rxg);e.rxg=null}LIVE.delete(e);continue}r.t-=dt;
  if(!e.rxg){const g=new T.Group();const gl=X.glow(RX[r.el].c,1.4,.55);gl.position.y=1.1;g.add(gl);if(r.el=='tempo'){const c=tClock(.38,'g');c.position.y=2.6;g.add(c);g.userData.ck=c}if(r.el=='agua'&&r.k=='agua'){const ice=new T.Mesh(X.geo('sphw'),new T.MeshBasicMaterial({color:0xcff4ff,transparent:true,opacity:.35,depthWrite:false}));ice.scale.set(1.3,2.2,1.3);ice.position.y=1;g.add(ice)}S.add(g);e.rxg=g}
  e.rxg.position.set(e.x,0,e.z);if(e.rxg.userData.ck){e.rxg.userData.ck.lookAt(cam.position);tClockTick(e.rxg.userData.ck,dt,1,[-1,-.3,0])}
  if(r.dot){r.acc+=dt;if(r.acc>=.5){r.acc=0;const v=Math.round(r.dot*.5);e.hp-=v;dmgNum(e.x,2.2,e.z,v,0)}}
  if(Math.random()<.35*Q())fxp({x:e.x+(Math.random()-.5)*.6,y:.4+Math.random()*1.6,z:e.z+(Math.random()-.5)*.6,c:RX[r.el].c,n:1,sp:.4,sz:.07,life:.45,up:r.el=='fogo'?2:.3});
  if(r.t<=0){X.dispose(e.rxg);e.rxg=null;e.rx=null;LIVE.delete(e)}}}
// estilos: escudo (bloqueia de frente), à distância (magos recuam), chamador (pede reforços)
function role(e){if(e.role!==undefined)return e.role;if(e.boss||e.dummy||e.qid){e.role=null;return null}const r=Math.random();e.role=e.gr?'longe':r<.22?'escudo':r<.36?'chamador':null;
 if(e.role=='escudo'){try{const sh=new T.Mesh(new T.CylinderGeometry(.42,.42,.07,10),new T.MeshLambertMaterial({color:0x6a5a3a}));sh.rotation.x=Math.PI/2;sh.position.set(0,1.05,.42);const rim=new T.Mesh(new T.TorusGeometry(.42,.035,5,18),new T.MeshLambertMaterial({color:0xb8b8b8}));rim.position.copy(sh.position);e.m.add(sh,rim);e.shM=sh}catch(_){}}
 return e.role}
const rTick=dt=>{for(const e of enemies){if(e.hp<=0)continue;const ro=role(e);if(!ro)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz)||1;
  if(ro=='longe'&&d<7&&!(e.st>0)&&e.ag){const sp=3.2*dt;e.x+=dx/d*sp;e.z+=dz/d*sp}
  if(ro=='chamador'&&!e.called&&e.hp<e.mhp*.5){e.called=1;try{dmgNum(e.x,3,e.z,'REFORÇOS!',0,'xp')}catch(_){}const n0=enemies.length;for(let k=0;k<2;k++){try{spawn()}catch(_){}}for(let k=n0;k<enemies.length;k++){const o=enemies[k];const a=Math.random()*6.28;o.x=e.x+Math.cos(a)*3;o.z=e.z+Math.sin(a)*3;o.m.position.set(o.x,0,o.z);o.ag=1;o.role=null;kShock(o.x,o.z,1.5,0xffffff,.3,.1)}}}};
// ---------- chefes avisam antes do golpe (círculo vermelho no chão durante a preparação) ----------
const TELE=new Map();function teleTick(dt){for(const e of enemies){if(!e.boss||e.hp<=0)continue;let m=TELE.get(e);const on=(e.cast||0)>0;if(on&&!m){m=new T.Mesh(new T.RingGeometry(.2,3.2,40),new T.MeshBasicMaterial({color:0xff2a2a,transparent:true,opacity:.0,depthWrite:false,side:T.DoubleSide}));m.rotation.x=-Math.PI/2;S.add(m);TELE.set(e,m)}if(m){m.position.set(e.x,.07,e.z);m.material.opacity=on?.25+Math.sin(performance.now()/60)*.12:Math.max(0,m.material.opacity-dt*3);if(!on&&m.material.opacity<=0){X.dispose(m);TELE.delete(e)}}}
 for(const [e,m] of TELE)if(!enemies.includes(e)||e.hp<=0){X.dispose(m);TELE.delete(e)}}
// ---------- golpe acertado: impacto, reação, escudo, contagem de abates ----------
{const _h=hitE;hitE=function(e,d,ef){const alive=e&&e.hp>0;let dd=d;try{if(e&&e.role=='escudo'&&alive){const fx=Math.sin(e.f||Math.atan2(P.x-e.x,P.z-e.z)),toP=Math.atan2(P.x-e.x,P.z-e.z),face=e.m?e.m.rotation.y:toP;let df=Math.abs(((toP-face)+Math.PI*3)%(Math.PI*2)-Math.PI);if(df<.9&&!(e.st>0)){dd=d*.45;if(!e.blk||performance.now()-e.blk>600){e.blk=performance.now();try{dmgNum(e.x,2.9,e.z,'BLOQUEOU',0,'xp')}catch(_){}fxp({x:e.x+Math.sin(face)*.5,y:1.1,z:e.z+Math.cos(face)*.5,c:0xffffff,n:6,sp:3,sz:.08,life:.25});try{X.snd('tick',.4)}catch(_){}}}}}catch(_){}
  const r=_h.call(this,e,dd,ef);try{if(alive&&!e.dummy){if(dd>=Math.max(60,e.mhp*.12))hitStop(.07);if(P.g&&P.on)react(e,elOf(P.g.id),dd);if(e.hp<=0){X.ev('kill',1,e);if(e.boss)X.ev('boss',1,e)}}else if(alive&&e.dummy&&P.g&&P.on){react(e,elOf(P.g.id),dd)}}catch(_){}return r}}
// ================= 9 · MAESTRIA: magia no nível 10 ganha visual dourado e selo no botão =================
const lv=i=>Math.min(10,1+Math.floor(((P.xp||[])[i]||0)/5));X.skLv=lv;
const MST={};function mastered(i){return P.g&&P.g.s&&P.g.s[i]&&lv(i)>=10}
{const _c=cast;cast=function(i){const id=P.g&&P.g.id,b=P.cd?(P.cd[i]||0):0,mp=P.mp,before=i>=0?lv(i):0;const r=_c.apply(this,arguments);
 try{if(i>=0&&P.g&&P.g.s&&P.g.s[i]&&((P.cd[i]||0)>b+.05||P.mp<mp-.5)){X.ev('cast',1,{i,id});const after=lv(i);
   if(after>before&&after>=2){try{dmgNum(P.x,3.1,P.z,'Magia Nv '+after,0,'xp')}catch(_){}}
   if(after>=10&&before<10){try{banner('MAESTRIA!',P.g.s[i][0],'#ffd23f');toast('★ Você dominou '+P.g.s[i][0]+'! O visual dela mudou.')}catch(_){}}
   if(mastered(i))masterFx(id)}}catch(_){}return r}}
function masterFx(id){const col=(()=>{try{return XIC(id)}catch(e){return 0xffd23f}})();const L=[];for(let k=0;k<2;k++){const m=new T.Mesh(new T.TorusGeometry(.9+k*.4,.03,4,40),X.addM(k?0xffd23f:col,.9));m.rotation.x=-Math.PI/2;S.add(m);L.push(m)}
 kfx({u:(F,dt)=>{L.forEach((m,k)=>{m.position.set(P.x,(P.y||0)+.15+F.t*(1.6+k*.6),P.z);m.scale.setScalar(1+F.t*.8);m.material.opacity=Math.max(0,.9-F.t*1.5)});if(Math.random()<.6*Q())fxp({x:P.x+(Math.random()-.5),y:(P.y||0)+Math.random()*2,z:P.z+(Math.random()-.5),c:0xffd23f,n:1,sp:.4,sz:.07,life:.5,up:2});return F.t<.6},end:()=>L.forEach(X.dispose)})}
// selo ★ nos botões das magias dominadas e nível pequeno
function badges(){if(!P.g||!P.g.s)return;for(let i=0;i<8;i++){const b=document.getElementById('sk'+i);if(!b)continue;const l=P.g.s[i]?lv(i):0,key=l+'|'+(P.g.id);if(b._b133===key)continue;b._b133=key;let s=b.querySelector('.m133');if(!s){s=document.createElement('span');s.className='m133';b.appendChild(s)}s.textContent=l>=10?'★':l>1?String(l):'';s.classList.toggle('max',l>=10);b.classList.toggle('mst133',l>=10)}}
{const _u=tUpdate;let k=0;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(run){rxTick(dt);rTick(dt);teleTick(dt)}if(++k%15==0)badges()}catch(e){}return r}}
const css=document.createElement('style');css.textContent='.sk .m133{position:absolute;top:1px;right:3px;font:700 9px/1 system-ui;color:#fff;text-shadow:0 0 3px #000;pointer-events:none}.sk .m133.max{color:#ffd23f;font-size:12px;text-shadow:0 0 6px #ffb000}.sk.mst133{box-shadow:0 0 10px #ffd23f,inset 0 0 8px #ffd23f66!important;border-color:#ffd23f!important}';document.head.appendChild(css);
})();

