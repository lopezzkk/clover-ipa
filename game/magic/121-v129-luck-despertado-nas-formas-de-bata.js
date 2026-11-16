// ================= V129 · LUCK DESPERTADO: nas formas de batalha as 4 primeiras magias viram golpes exagerados =================
// Inspirado no vídeo de demonstração (modo despertado): Fantasma Relâmpago, Rajada de Trovões,
// Aniquilação Divina (velocidade divina) e Julgamento do Deus Trovão. Corpo brilhando enquanto a forma dura.
(function(){
const X=window.X124;if(!X||!X.L)return;const L=X.L;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const CY=0x6ff4ff,CYW=0xd8fdff,RD=0xff1e3c,BK=0x12000a;
const isB=()=>L.form=='black';const col=()=>isB()?RD:CY;
const clampXZ=(x,z)=>{try{return[Math.max(WB83.x0,Math.min(WB83.x1,x)),Math.max(WB83.z0,Math.min(WB83.z1,z))]}catch(e){return[x,z]}};
function ghost(){try{const g=X.ghostCopy(isB()?0x2a0008:0x9ff8ff,.55,isB());S.add(g);kfx({u:F=>{g.userData.m.opacity=.55*Math.max(0,1-F.t/.45);return F.t<.45},end:()=>X.dispose(g)})}catch(e){}}
function strike(x,z,h,w,dark){w=(w||.12)*1.5;const b=X.bolt(dark?RD:CY,w||.12,.95,12,dark);S.add(b);const gl=X.glow(dark?RD:CYW,3,.9);gl.position.set(x,1,z);S.add(gl);kShock(x,z,2.4,dark?RD:CY,.3,.15);
 kfx({u:F=>{const t=F.t;b.visible=Math.random()<.9;b.userData.set(new T.Vector3(x+(Math.random()-.5),h||22,z+(Math.random()-.5)),new T.Vector3(x,0,z),1.2);gl.material.opacity=Math.max(0,.9-t*3);b.material.opacity=Math.max(0,.95-t*2.5);return t<.4},end:()=>{X.dispose(b);X.dispose(gl)}})}
function slashLine(A,B,dark){const b=X.bolt(dark?RD:CY,.08,.95,6,dark);S.add(b);const b2=X.bolt(0xffffff,.025,.9,6);S.add(b2);kfx({u:F=>{b.userData.set(A,B,.25);b2.userData.set(A,B,.12);b.material.opacity=Math.max(0,.95-F.t*3);b2.material.opacity=Math.max(0,.9-F.t*3);return F.t<.32},end:()=>{X.dispose(b);X.dispose(b2)}})}
// ---------- 1 · Fantasma Relâmpago: some e aparece atrás de até 3 inimigos ----------
function phantom(d,dx,dz){X.word(isB()?'BLACK LIGHTNING PHANTOM!':'LIGHTNING PHANTOM!',isB()?'luckb':'luck');X.snd('zap',.8);const dk=isB();
 const list=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-P.x,e.z-P.z)<15).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,3);
 const pts=list.length?list:[{x:P.x+dx*6,z:P.z+dz*6,fake:1}];P.iv=Math.max(P.iv||0,.9);P.lock=Math.max(P.lock||0,.8);
 pts.forEach((e,k)=>tmr.push({t:k*.22,f:()=>{ghost();const A=new T.Vector3(P.x,1.1+(P.y||0),P.z);const a=Math.atan2(e.x-P.x,e.z-P.z),[nx,nz]=clampXZ(e.x+Math.sin(a)*1.6,e.z+Math.cos(a)*1.6);P.x=nx;P.z=nz;P.f=Math.atan2(e.x-nx,e.z-nz);
  slashLine(A,new T.Vector3(P.x,1.1,P.z),dk);X.snd('zap',.6);startPose(k%2?'push':'throw');if(!e.fake){hitE(e,d*.45,{b:1});X.stun(e,.5);X.push(e,Math.sin(a),Math.cos(a),8,.25)}strike(e.x,e.z,10,.07,dk);fxp({x:e.x,y:1.2,z:e.z,c:dk?RD:CY,n:Math.round(14*Q()),sp:6,sz:.1,life:.35})}}))}
// ---------- 2 · Rajada de Trovões: corre até o alvo e solta 8 socos com explosões ----------
function barrage(d,dx,dz){X.word(isB()?'BLACK THUNDERCLAP BARRAGE!':'THUNDERCLAP BARRAGE!',isB()?'luckb':'luck');const dk=isB();const tg=X.nearest(P.x,P.z,12);
 if(tg){const a=Math.atan2(tg.x-P.x,tg.z-P.z);ghost();const[nx,nz]=clampXZ(tg.x-Math.sin(a)*1.5,tg.z-Math.cos(a)*1.5);P.x=nx;P.z=nz;P.f=a}
 P.lock=Math.max(P.lock||0,1.3);P.iv=Math.max(P.iv||0,1.2);X.armArcs(1.4,dk?RD:CY,dk);
 for(let k=0;k<8;k++)tmr.push({t:.1+k*.12,f:()=>{const i=k%2;startPose(i?'push':'throw');const h=X.front(1.6,1.2);const sp=new T.Mesh(X.geo('sphw'),X.addM(dk?RD:CY,.85));sp.position.copy(h);S.add(sp);const gl=X.glow(dk?0xff6070:CYW,2,.9);gl.position.copy(h);S.add(gl);X.snd(k%3?'zap':'crackle',.5);P.shake=Math.max(P.shake||0,.12);
   kfx({u:F=>{sp.scale.setScalar(.6+F.t*5);sp.material.opacity=Math.max(0,.85-F.t*4);gl.material.opacity=Math.max(0,.9-F.t*4);return F.t<.25},end:()=>{X.dispose(sp);X.dispose(gl)}});X.hitArea(h.x,h.z,1.9,d*.09,{}).forEach(e=>X.stun(e,.25))}});
 tmr.push({t:1.15,f:()=>{startPose('slam');const h=X.front(1.8,.5);X.snd('boom',.8);X.flash(dk?'#300008':'#cffbff',.4,.15);P.shake=Math.max(P.shake||0,.4);strike(h.x,h.z,16,.15,dk);kShock(h.x,h.z,5,dk?RD:CY,.45,.2);X.hitArea(h.x,h.z,3.6,d*.35,{b:1}).forEach(e=>{X.stun(e,1);X.push(e,e.x-P.x,e.z-P.z,14,.35)})}})}
// ---------- 3 · Aniquilação Divina: velocidade divina, vários cortes e um raio final ----------
function godspeed(d){const dk=isB();X.word(dk?'BLACK GODSPEED ANNIHILATION!':'GODSPEED ANNIHILATION!',dk?'luckb':'luck');X.snd('charge',.9);X.flash(dk?'#1a0006':'#002030',.6,.5);
 const list=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-P.x,e.z-P.z)<18).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,6);
 const ox=P.x,oz=P.z;P.iv=Math.max(P.iv||0,2.4);P.lock=Math.max(P.lock||0,.5);
 const N=Math.max(6,list.length*2);const hits=new Set();
 for(let k=0;k<N;k++)tmr.push({t:.35+k*.13,f:()=>{const e=list.length?list[k%list.length]:null;const A=new T.Vector3(P.x,1.1,P.z);let tx,tz;if(e&&e.hp>0){const a=Math.random()*6.28;[tx,tz]=clampXZ(e.x+Math.sin(a)*2,e.z+Math.cos(a)*2);P.f=Math.atan2(e.x-tx,e.z-tz)}else{const a=k*1.3;[tx,tz]=clampXZ(ox+Math.sin(a)*4,oz+Math.cos(a)*4)}
   ghost();P.x=tx;P.z=tz;slashLine(A,new T.Vector3(tx,1.1,tz),dk);slashLine(new T.Vector3(tx-1.5,.4,tz+1.5),new T.Vector3(tx+1.5,2.2,tz-1.5),true);X.snd('zap',.7);startPose(k%2?'spin':'dash');P.shake=Math.max(P.shake||0,.2);
   if(e&&e.hp>0){hits.add(e);hitE(e,d*.07,{});X.stun(e,1.2);fxp({x:e.x,y:1.2,z:e.z,c:k%2?RD:(dk?0xff7080:CY),n:Math.round(12*Q()),sp:7,sz:.1,life:.3})}}});
 tmr.push({t:.5+N*.13,f:()=>{const[bx,bz]=clampXZ(ox,oz);P.x=bx;P.z=bz;startPose('raise');X.snd('thunder',1);X.flash('#ffffff',.95,.3);P.shake=Math.max(P.shake||0,.7);
   const tgs=hits.size?[...hits]:[{x:ox+Math.sin(P.f)*6,z:oz+Math.cos(P.f)*6}];tgs.forEach((e,i)=>tmr.push({t:i*.05,f:()=>{strike(e.x,e.z,30,.35,dk);strike(e.x+.6,e.z-.4,30,.12,!dk);if(e.hp>0){hitE(e,d*.45,{b:1});X.push(e,e.x-P.x,e.z-P.z,10,.3)}const cr=new T.Mesh(X.geo('crack'),X.addM(dk?RD:CY,.9));cr.rotation.x=-Math.PI/2;cr.position.set(e.x,.06,e.z);cr.scale.setScalar(1.6);S.add(cr);kfx({u:F=>{cr.material.opacity=Math.max(0,.9-F.t);return F.t<1},end:()=>X.dispose(cr)})}}));
   }})}
// ---------- 4 · Julgamento do Deus Trovão: sobe, ergue os braços e chove relâmpago gigante ----------
function judgment(d){const dk=isB();X.word(dk?"BLACK THUNDER GOD'S JUDGMENT!":"THUNDER GOD'S JUDGMENT!",dk?'luckb':'luck');X.snd('charge',1);startPose('raise');P.lock=Math.max(P.lock||0,.5);P.iv=Math.max(P.iv||0,1);
 const cx=P.x,cz=P.z,R=18;const cloud=new T.Group();for(let k=0;k<Math.round(10*Math.min(1,Q()))+4;k++){const s=X.smoke?X.smoke(dk?0x1a0008:0x223040,10,.0):X.glow(dk?0x200008:0x203048,10,.0);s.position.set(cx+(Math.random()-.5)*R*1.6,18+Math.random()*3,cz+(Math.random()-.5)*R*1.6);cloud.add(s)}S.add(cloud);
 const ring=new T.Mesh(new T.RingGeometry(R-.4,R,64),X.addM(dk?RD:CY,.0));ring.rotation.x=-Math.PI/2;ring.position.set(cx,.08,cz);S.add(ring);X.armArcs(2.3,dk?RD:CY,dk);
 const tg=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-cx,e.z-cz)<R);const n=Math.max(10,tg.length);
 kfx({u:(F,dt)=>{const t=F.t;cloud.children.forEach(c=>{c.material.opacity=Math.min(.55,t*.6)*(t>2.6?Math.max(0,1-(t-2.6)):1)});ring.material.opacity=Math.min(.6,t)*(t>2.6?Math.max(0,1-(t-2.6)*2):1);
   if(t<.7&&P.y!=null){P.vy=0;P.y=Math.min((P.y||0)+dt*5,2.6)}
   if(t>.8&&!F.f1){F.f1=1;X.flash('#ffffff',1,.35);X.snd('thunder',1);P.shake=Math.max(P.shake||0,.9)}
   if(t>.8&&t<2.4){F.k=(F.k||0)+dt;while(F.k>1.6/n){F.k-=1.6/n;const e=tg.length?tg[Math.floor(Math.random()*tg.length)]:null;const x=e&&e.hp>0?e.x+(Math.random()-.5):cx+(Math.random()-.5)*R*1.4,z=e&&e.hp>0?e.z+(Math.random()-.5):cz+(Math.random()-.5)*R*1.4;strike(x,z,26,.3+Math.random()*.2,dk);X.snd(Math.random()<.5?'boom':'zap',.6);X.hitArea(x,z,2.4,d*.12,{}).forEach(e2=>X.stun(e2,.6))}}
   return t<3.2},end:()=>{X.dispose(cloud);X.dispose(ring)}})}
// ---------- registro e troca dos botões enquanto a forma de batalha está ativa ----------
const NEW={lkphant:phantom,lkbarr:barrage,lkgod:godspeed,lkjudge:judgment};for(const k in NEW)X.reg(k,NEW[k]);
const IC={lkphant:'<path d="M4 18l6-6M10 12l4 2 6-8" stroke="C" stroke-width="1.8" fill="none"/><circle cx="6" cy="8" r="2.4" fill="L" opacity=".5"/>',
 lkbarr:'<circle cx="8" cy="12" r="3.5" fill="none" stroke="C" stroke-width="1.6"/><circle cx="16" cy="12" r="3.5" fill="none" stroke="L" stroke-width="1.6"/><path d="M12 4l-2 4h4l-2 4" stroke="C" stroke-width="1.5" fill="none"/>',
 lkgod:'<path d="M3 20L21 4M3 12l9 3M21 12l-9-3" stroke="C" stroke-width="1.8"/><circle cx="12" cy="12" r="2" fill="L"/>',
 lkjudge:'<path d="M5 6h14M12 6l-3 7h4l-3 8" stroke="C" stroke-width="1.8" fill="none"/><path d="M4 4c3-2 13-2 16 0" stroke="L" stroke-width="1.3" fill="none"/>'};
const META=[['Fantasma Relâmpago','dash','lkphant',['m',15,''],30,40,6],['Rajada de Trovões','push','lkbarr',['c',3,''],32,70,8],['Aniquilação Divina','spin','lkgod',['m',18,''],44,170,16],['Julgamento do Deus Trovão','raise','lkjudge',['m',18,''],48,150,18]];
function entry(i){const m=META[i],b=isB(),nm=(b?'Relâmpago Negro: ':'Relâmpago Despertado: ')+m[0];try{ANI[nm]=m[1]}catch(e){}try{SKI[nm]=IC[m[2]]}catch(e){}try{RNG[m[2]]=m[3]}catch(e){}try{TAG82[nm]='A'}catch(e){}return[nm,m[4],Math.round(m[5]*(b?1.25:1)),m[2],null,m[6]]}
const ST={orig:null,form:null,mats:null};X.AW129=ST;
function swapIn(){const s=GR.raio&&GR.raio.s;if(!s)return;if(!ST.orig)ST.orig=s.slice(0,4);for(let i=0;i<4;i++)s[i]=entry(i);try{buildBtns()}catch(e){}}
function swapOut(){const s=GR.raio&&GR.raio.s;if(s&&ST.orig){for(let i=0;i<4;i++)s[i]=ST.orig[i]}ST.orig=null;try{buildBtns()}catch(e){}}
// corpo brilhando (modo despertado)
function glowOn(){if(ST.mats)return;ST.mats=[];const seen=new Set(),c=isB()?0x8a0018:0x38c8ff;try{pm.traverse(o=>{if(!o.isMesh||o===olm)return;const ms=Array.isArray(o.material)?o.material:[o.material];ms.forEach(m=>{if(!m||seen.has(m)||!m.emissive)return;seen.add(m);ST.mats.push([m,m.emissive.getHex()]);m.emissive.setHex(c)})})}catch(e){}}
function glowOff(){if(!ST.mats)return;ST.mats.forEach(([m,h])=>{try{m.emissive.setHex(h)}catch(e){}});ST.mats=null}
X.glowOff129=glowOff;
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{const f=(P.g&&P.g.id=='raio'&&(L.form=='battle'||L.form=='black'))?L.form:null;if(f!==ST.form){const was=ST.form;ST.form=f;if(f){if(was)swapOut();glowOff();swapIn();glowOn();0}else{swapOut();glowOff()}}
  if(ST.mats&&Math.random()<.5*Q()){const h=X.hand(Math.random()<.5?0:1);fxp({x:h.x,y:h.y,z:h.z,c:isB()?RD:CY,n:1,sp:.6,sz:.07,life:.25})}}catch(e){}return r}}
})();

