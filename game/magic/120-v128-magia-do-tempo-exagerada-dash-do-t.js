// ================= V128 · MAGIA DO TEMPO EXAGERADA: dash do tempo, voo, relógios nos braços e efeitos grandes =================
// Baseado nos vídeos: relógios girando nos antebraços, explosões douradas radiais, cúpula do tempo, ponteiros gigantes,
// pilares dourados, redemoinho no chão, parada do tempo (tela sem cor), dash com ecos dourados e voo com rastro de luz.
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const G0=0xffd75a,GW=0xfff3c4,TE=0x5fffd0,BL=0x9ad8ff,BR=0x8a5a20;
const isT=()=>!!(P.g&&P.g.id=='tempo'&&P.on);
const GC={};const geo=(k,f)=>{if(!GC[k]){GC[k]=f();GC[k]._keep=1}return GC[k]};
const gDome=()=>geo('dome',()=>new T.SphereGeometry(1,28,14,0,Math.PI*2,0,Math.PI/2));
const gDomeW=()=>geo('domew',()=>new T.SphereGeometry(1.01,16,8,0,Math.PI*2,0,Math.PI/2));
const gPil=()=>geo('pil',()=>{const g=new T.CylinderGeometry(.18,.32,1,6,1,true);g.translate(0,.5,0);return g});
const gSpk=()=>geo('spk',()=>{const g=new T.ConeGeometry(.12,1,4);g.translate(0,.5,0);return g});
const gHand=()=>geo('hand',()=>{const s=new T.Shape();s.moveTo(-.09,0);s.lineTo(.09,0);s.lineTo(.05,2.6);s.lineTo(0,3.2);s.lineTo(-.05,2.6);s.closePath();const g=new T.ShapeGeometry(s);return g});
const gSwirl=()=>geo('swirl',()=>new T.RingGeometry(.25,1,48,1,0,5.2));
const gRing=()=>geo('ring',()=>new T.TorusGeometry(1,.035,6,48));
const add=X.addM;
// ---------------- relógios girando nos antebraços (aparecem em toda magia do tempo) ----------------
function armClocks(dur,col){const cl=[];for(const i of[0,1])for(let k=0;k<2;k++){const c=tClock(.26+k*.06,'g');S.add(c);cl.push({c,i,k})}
 kfx({u:(F,dt)=>{const t=F.t,g=Math.min(1,t*5)*(t>dur-.25?Math.max(0,(dur-t)/.25):1);cl.forEach(o=>{let a;try{const el=PP.arms[o.i][1];el.updateWorldMatrix(true,false);a=el.localToWorld(new T.Vector3(0,-.12-o.k*.16,0))}catch(e){a=X.hand(o.i)}o.c.position.copy(a);o.c.lookAt(cam.position);o.c.rotation.z+=(o.k?-1:1)*dt*4;tClockTick(o.c,dt,g,[o.k?-8:8,2,.5])});return t<dur},end:()=>cl.forEach(o=>X.dispose(o.c))})}
X.armClocks=armClocks;
// explosão dourada radial (raios de luz saindo de um ponto)
function goldBurst(x,y,z,R,col,n){col=col||G0;R*=1.4;n=n||Math.round(14*Math.min(1,Q()))+6;const g=new T.Group();g.position.set(x,y,z);S.add(g);const sp=[];
 for(let k=0;k<n;k++){const m=new T.Mesh(gSpk(),add(k%3?col:0xffffff,.95));m.rotation.set(Math.random()*6.28,Math.random()*6.28,Math.random()*6.28);m.scale.set(1,.01,1);g.add(m);sp.push({m,l:R*(.6+Math.random()*.6)})}
 const fl=X.glow(0xffffff,R*1.4,1);g.add(fl);const fl2=X.glow(col,R*2.6,.6);g.add(fl2);kShock(x,z,R*1.2,col,.35,y>.5?.3:y);
 kfx({u:(F,dt)=>{const t=F.t,u=Math.min(1,t/.12),f=Math.max(0,1-(t-.12)/.4);sp.forEach(o=>{o.m.scale.set(1+u,o.l*u,1+u);o.m.material.opacity=.95*f});fl.material.opacity=Math.max(0,1-t*4);fl2.material.opacity=.6*f;fl2.scale.setScalar(R*2.6*(1+t));return t<.55},end:()=>X.dispose(g)})}
X.goldBurst=goldBurst;
// cúpula do tempo (meia esfera translúcida com linhas e relógio no chão)
function dome(x,z,R,dur,cb){const g=new T.Group();g.position.set(x,0,z);S.add(g);const a=new T.Mesh(gDome(),add(BL,.0)),w=new T.Mesh(gDomeW(),new T.MeshBasicMaterial({color:GW,wireframe:true,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));a.material.side=T.DoubleSide;g.add(a,w);g.scale.setScalar(R);
 const ck=tClock(R*.95,'g');ck.rotation.x=-Math.PI/2;ck.position.set(x,.08,z);S.add(ck);const rg=new T.Mesh(gRing(),add(G0,.8));rg.rotation.x=-Math.PI/2;rg.position.set(x,.1,z);rg.scale.setScalar(R);S.add(rg);
 kfx({u:(F,dt)=>{const t=F.t,o=Math.min(1,t*4)*(t>dur-.4?Math.max(0,(dur-t)/.4):1);a.material.opacity=.16*o;w.material.opacity=.45*o;g.scale.setScalar(R*(.2+.8*Math.min(1,t*3)));w.rotation.y+=dt*.6;tClockTick(ck,dt,o,[-3,-1,-.2]);rg.material.opacity=.8*o;rg.scale.setScalar(R*(1+Math.sin(t*6)*.03));if(cb)cb(t,dt,o);if(Math.random()<.4*Q())fxp({x:x+(Math.random()-.5)*R*1.6,y:Math.random()*R*.8,z:z+(Math.random()-.5)*R*1.6,c:Math.random()<.5?G0:BL,n:1,sp:.3,sz:.08,life:.6});return t<dur},end:()=>{X.dispose(g);X.dispose(ck);X.dispose(rg)}})}
// pilares dourados que nascem do chão
function pillars(x,z,R,n,d){n=Math.round(n*Math.min(1,Q()))+3;const L=[];for(let k=0;k<n;k++){const a=Math.random()*6.28,r=Math.sqrt(Math.random())*R,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r,h=2.5+Math.random()*4;
  const m=new T.Mesh(gPil(),add(k%3?G0:0xffffff,.9));m.position.set(px,0,pz);m.scale.set(1+Math.random(),.01,1+Math.random());S.add(m);L.push({m,h,dl:k*.05,px,pz,hit:false})}
 kfx({u:(F,dt)=>{const t=F.t;L.forEach(o=>{const u=(t-o.dl)/.15;if(u<0)return;if(!o.hit){o.hit=true;kShock(o.px,o.pz,1,G0,.25,.1);if(d)X.hitArea(o.px,o.pz,1.1,d,{sl:1})}o.m.scale.y=o.h*Math.min(1,u);o.m.material.opacity=.9*Math.max(0,1-(t-o.dl-.3)/.5)});return t<1.2},end:()=>L.forEach(o=>X.dispose(o.m))})}
// redemoinho de tempo no chão
function vortex(x,z,R,dur,col){const g=new T.Group();g.position.set(x,.07,z);S.add(g);const L=[];for(let k=0;k<3;k++){const m=new T.Mesh(gSwirl(),add(k==1?(col||BR):G0,.0));m.rotation.x=-Math.PI/2;m.position.y=k*.01;m.scale.setScalar(R*(1-k*.25));g.add(m);L.push(m)}
 kfx({u:(F,dt)=>{const t=F.t,o=Math.min(1,t*3)*(t>dur-.4?Math.max(0,(dur-t)/.4):1);L.forEach((m,k)=>{m.rotation.z+=dt*(3+k*2)*(k%2?-1:1);m.material.opacity=(k==1?.55:.7)*o});return t<dur},end:()=>X.dispose(g)})}
// ponteiros gigantes varrendo
function bigHands(x,z,ang,d){const L=[];for(let k=0;k<3;k++){const m=new T.Mesh(gHand(),add(k==1?0xffffff:G0,.9));m.material.side=T.DoubleSide;m.position.set(x,1.2,z);m.scale.setScalar(1.2+k*.25);S.add(m);L.push({m,k,hit:new Set()})}X.snd('tick',.8);
 kfx({u:(F,dt)=>{const t=F.t;L.forEach(o=>{const u=Math.min(1,Math.max(0,(t-o.k*.08)/.35)),a=ang-1.6+u*3.2+o.k*.25;o.m.rotation.set(-Math.PI/2,0,-a);o.m.material.opacity=.9*Math.max(0,1-(t-.4-o.k*.08)/.3);
  if(u>0&&u<1){for(const e of enemies){if(e.hp<=0||o.hit.has(e))continue;const ex=e.x-x,ez=e.z-z,dd=Math.hypot(ex,ez);if(dd>4.2*o.m.scale.x/1.2)continue;const ea=Math.atan2(ex,ez);let df=Math.abs(((ea-a)+Math.PI*3)%(Math.PI*2)-Math.PI);if(df<.35){o.hit.add(e);hitE(e,d,{sl:1});X.push(e,ex,ez,9,.3);fxp({x:e.x,y:1.2,z:e.z,c:G0,n:Math.round(10*Q()),sp:5,sz:.1,life:.35})}}}});return t<.9},end:()=>L.forEach(o=>X.dispose(o.m))})}
// tela sem cor (tempo parado)
function stopScreen(dur){try{let el=document.getElementById('ts128');if(!el){el=document.createElement('div');el.id='ts128';el.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:23;opacity:0;transition:opacity .25s;background:radial-gradient(circle at 50% 50%,rgba(255,250,230,.0) 30%,rgba(230,236,255,.38) 100%)';document.body.appendChild(el)}el.style.opacity='1';clearTimeout(stopScreen.t);stopScreen.t=setTimeout(()=>{el.style.opacity='0'},dur*1000)}catch(e){}}
// raios dourados (faíscas tipo relâmpago dourado da aceleração)
function goldArcs(dur){const L=[];const n=Math.round(5*Math.min(1,Q()))+2;for(let k=0;k<n;k++){const b=X.bolt(G0,.04,.95,6);S.add(b);L.push(b)}
 kfx({u:(F,dt)=>{const t=F.t;L.forEach(b=>{b.visible=Math.random()<.7;if(b.visible){const a=Math.random()*6.28,r=.4+Math.random()*1.2,A=new T.Vector3(P.x+Math.cos(a)*r,(P.y||0)+.2+Math.random()*2.2,P.z+Math.sin(a)*r),a2=a+(Math.random()-.5)*2,B=new T.Vector3(P.x+Math.cos(a2)*(r+.6),(P.y||0)+.2+Math.random()*2.2,P.z+Math.sin(a2)*(r+.6));b.userData.set(A,B,.35)}});return t<dur},end:()=>L.forEach(X.dispose)})}
// ---------------- sobreposição exagerada em cada magia do tempo ----------------
const OV={
 tsteal:(d,dx,dz)=>{const tg=chronoTarget(14),x=tg?tg.x:P.x+dx*5,z=tg?tg.z:P.z+dz*5;bigHands(P.x+dx*1.5,P.z+dz*1.5,Math.atan2(dx,dz),d*.35);setTimeout(()=>X.goldBurst(x,1.2,z,2.4),200)},
 tprison:(d,dx,dz)=>{const tg=chronoTarget(16),x=tg?tg.x:P.x+dx*7,z=tg?tg.z:P.z+dz*7;X.snd('rewind',.5);dome(x,z,4.2,3.2,(t,dt,o)=>{if(o>.5)for(const e of enemies){if(e.hp>0&&Math.hypot(e.x-x,e.z-z)<4.2){e.sl=Math.max(e.sl||0,.4)}}})},
 taccel:()=>{goldArcs(2.2);X.goldBurst(P.x,1.1+(P.y||0),P.z,2.2);for(let k=0;k<6;k++)setTimeout(()=>{try{const g=X.ghostCopy(0xffc83a,.5);g.rotation.y+=k*1.05;S.add(g);kfx({u:(F)=>{g.userData.m.opacity=.5*Math.max(0,1-F.t/.5);g.scale.setScalar(1+F.t*.6);return F.t<.5},end:()=>X.dispose(g)})}catch(e){}},k*70)},
 thalt:()=>{stopScreen(2.6);const c=tClock(4.5,'w');c.position.set(P.x,9,P.z);S.add(c);X.snd('tick',1);setTimeout(()=>X.snd('tick',1),500);kfx({u:(F,dt)=>{c.lookAt(cam.position);tClockTick(c,dt,Math.min(1,F.t*3)*(F.t>2.3?Math.max(0,(2.7-F.t)/.4):1),[F.t<1.2?-2:0,0,0]);return F.t<2.7},end:()=>X.dispose(c)});X.goldBurst(P.x,1.4+(P.y||0),P.z,3.5,0xffffff)},
 treturn:()=>{vortex(P.x,P.z,3.2,1.6,0x5fffd0);const c=tClock(1.6,'g');S.add(c);kfx({u:(F,dt)=>{c.position.set(P.x,(P.y||0)+3.4,P.z);c.lookAt(cam.position);tClockTick(c,dt,Math.min(1,F.t*4)*Math.max(0,1-(F.t-1.2)/.4),[6,2,.6]);return F.t<1.6},end:()=>X.dispose(c)})},
 trewind:(d,dx,dz)=>{const tg=chronoTarget(18),x=tg?tg.x:P.x+dx*6,z=tg?tg.z:P.z+dz*6;vortex(x,z,6,3,BR);setTimeout(()=>{pillars(x,z,6,14,d*.12);P.shake=Math.max(P.shake||0,.5)},500);setTimeout(()=>{X.flash('#fff6d8',.9,.25);X.goldBurst(x,1.5,z,5)},1300)},
 tneedle:()=>{const c=tClock(3.2,'g');c.rotation.x=-Math.PI/2;c.position.set(P.x,.08,P.z);S.add(c);kfx({u:(F,dt)=>{tClockTick(c,dt,Math.min(1,F.t*3)*Math.max(0,1-(F.t-2)/.4),[-4,-1,-.3]);return F.t<2.4},end:()=>X.dispose(c)})},
 techo:(d,dx,dz)=>{const tg=chronoTarget(18),x=tg?tg.x:P.x+dx*8,z=tg?tg.z:P.z+dz*8;setTimeout(()=>{X.flash('#fff3c4',.6,.2);X.goldBurst(x,1.2,z,4.5);pillars(x,z,3.5,8,0)},2200)}
};
X.OV128=OV;
{const _xc=xCast;xCast=function(t,d,dx,dz){const r=_xc.apply(this,arguments);try{if(isT()){X.armClocks(1.3);if(OV[t])OV[t](d,dx,dz);P.shake=Math.max(P.shake||0,.1)}}catch(e){try{ERR122(e)}catch(_){}}return r}}
// ---------------- DASH DO TEMPO (esquiva com ecos dourados) ----------------
{const _dg=dodge;dodge=function(){const before=P.dg||0;const r=_dg.apply(this,arguments);try{if(isT()&&(P.dg||0)>before+.5){const l=Math.hypot(P.dv[0],P.dv[1])||1,wx=P.dv[0]/l,wz=P.dv[1]/l;P.dv=[wx*36,wz*36];P.dt2=Math.max(P.dt2,.3);P.iv=Math.max(P.iv||0,.5);
  const hit=new Set();try{X.timeDashFx&&X.timeDashFx(wx,wz)}catch(e){}X.snd('tick',.6);X.snd('echo',.35);
  kfx({u:(F,dt)=>{const t=F.t;if(t<.32){for(const e of enemies){if(e.hp<=0||hit.has(e))continue;if(Math.hypot(e.x-P.x,e.z-P.z)<1.6){hit.add(e);hitE(e,8+(P.lv||1),{sl:1});X.stun(e,.3)}}}return t<.4}})}}catch(e){try{ERR122(e)}catch(_){}}return r};window.dodge=dodge}
// ---------------- VOO DO TEMPO ----------------
const FL={on:false,h:5.5,parts:[],t:0};X.FL128=FL;
function wingsOn(){const g=new T.Group();const fm=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.92,side:T.DoubleSide,depthWrite:false}),gm=add(G0,.55);
 const fg=geo('feat',()=>{const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(.18,.55,0,1.4);s.quadraticCurveTo(-.09,.6,0,0);return new T.ShapeGeometry(s,6)});
 for(const sd of[-1,1]){const w=new T.Group();w.position.set(sd*.18,1.45,-.22);for(let k=0;k<7;k++){const f=new T.Mesh(fg,fm);f.rotation.z=sd*(-.35-k*.2);f.position.set(sd*k*.06,0,-k*.01);f.scale.setScalar(1-k*.06);w.add(f);const gl=new T.Mesh(fg,gm);gl.rotation.copy(f.rotation);gl.position.copy(f.position);gl.position.z-=.01;gl.scale.setScalar((1-k*.06)*1.12);w.add(gl)}g.add(w);g.userData['w'+sd]=w}
 pm.add(g);FL.parts.push(g);FL.wg=g;const halo=tClock(.45,'g');S.add(halo);FL.halo=halo;FL.parts.push(halo)}
function flyOn(){if(FL.on)return;if(!isT())return;if(P.mp<10){toast('Mana insuficiente para voar.');return}FL.on=true;FL.h=Math.max(7,(P.y||0)+4);FL.t=0;try{X.flyFxOn()}catch(e){}X.snd('transform',.5);X.snd('tick',.6);try{P.vy=6}catch(e){}flyBtn()}
function flyOff(silent){if(!FL.on)return;FL.on=false;FL.parts.forEach(p=>{try{if(p.parent)p.parent.remove(p)}catch(e){}X.dispose(p)});FL.parts=[];FL.wg=null;FL.halo=null;try{P.fly=0}catch(e){}try{X.flyFxOff()}catch(e){}if(!silent){X.snd('crackle',.3);fxp({x:P.x,y:(P.y||0)+1.2,z:P.z,c:G0,n:Math.round(16*Q()),sp:3,sz:.12,life:.6})}flyBtn()}
X.flyOn=flyOn;X.flyOff=flyOff;
{const _j=jump;jump=function(){if(FL.on){FL.h=Math.min(16,FL.h+2.5);X.snd('wing',.4);return}return _j.apply(this,arguments)};window.jump=jump}
{const _u=tUpdate;tUpdate=function(dt){if(FL.on){if(!isT()||P.hp<=0){flyOff(true)}else{P.fly=Math.max(P.fly||0,.15)}}const y0=P.y;const r=_u.apply(this,arguments);
 try{if(FL.on&&run){FL.t+=dt;P.mp=Math.max(0,P.mp-dt*3.5);if(P.mp<=0){flyOff();toast('A mana acabou: você pousou.')}else{const tg=Math.max((P.gy||0)+1.5,FL.h);P.y=y0+(tg-y0)*Math.min(1,dt*3)+Math.sin(FL.t*2.2)*.01;P.vy=0;
   const wg=FL.wg;if(wg){const fl=Math.sin(FL.t*7)*.35;if(wg.userData['w-1'])wg.userData['w-1'].rotation.y=-.35-fl;if(wg.userData['w1'])wg.userData['w1'].rotation.y=.35+fl}
   if(FL.halo){FL.halo.position.set(P.x,P.y+2.55,P.z);FL.halo.lookAt(cam.position);tClockTick(FL.halo,dt,1,[3,1,.3])}
   const mv=Math.hypot(P.x-(FL.px==null?P.x:FL.px),P.z-(FL.pz==null?P.z:FL.pz))/Math.max(dt,1e-3);FL.px=P.x;FL.pz=P.z;try{X.flyFxTick(dt,mv)}catch(e){}}}

  // ponto de vida mínimo: se cair abaixo do chão, segura
 }catch(e){}flyBtnTick();return r}}
// botão de voo (só aparece com o grimório do Tempo)
function flyBtn(){let b=document.getElementById('a-tfly');if(!b){b=document.createElement('button');b.id='a-tfly';b.className='ab';b.title='Voo do Tempo (L)';b.setAttribute('aria-label','Voo do Tempo');b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="4.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M12 9V6.6M12 9l1.8 1" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M2 14c3-1 5.5-.5 8 1.5M22 14c-3-1-5.5-.5-8 1.5M3.5 17.5c2.5-.5 4.5 0 6.5 1M20.5 17.5c-2.5-.5-4.5 0-6.5 1" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>';
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!run)return;FL.on?flyOff():flyOn()});const ref=document.getElementById('a-dodge');(ref&&ref.parentNode?ref.parentNode:document.body).appendChild(b)}
 b.classList.toggle('on128',FL.on)}
function flyBtnTick(){const b=document.getElementById('a-tfly');const show=isT()&&run;if(!b){if(show)flyBtn();return}const want=show?'':'none';if(b.style.display!==want)b.style.display=want;if(!show)return}

addEventListener('keydown',e=>{if(e.code==='KeyL'&&!e.repeat&&run&&isT()&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))){FL.on?flyOff():flyOn()}});
const css=document.createElement('style');css.textContent='#a-tfly{z-index:6}#a-tfly.on128{box-shadow:0 0 14px #ffd75a,inset 0 0 10px #ffd75a88;color:#ffe9a8;border-color:#ffd75a}';document.head.appendChild(css);
})();

