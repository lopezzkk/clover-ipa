// ===================== V92 · Magias novas: Fogo (estilo Magna) e Tempo (estilo Rei Mago) =====================
// Fogo: Explosive Vanishing Scattershot, Timed Explosion Scattershot, Prison Kill Buckshot (+ Soul Chain, Maximum Fireball e Tag Deathmatch mantidas)
// Tempo: Time Steal, Time Halt, Time Return, Chrono Anastasis (+ Chrono Stasis e Divine Acceleration mantidas)
// As magias antigas continuam no código (não foram apagadas); só saíram da lista de 6 do grimório.
{
const rnd=(a,b)=>a+Math.random()*(b-a),Q=()=>KQ(),TG=0xffd75a,TB=0x9ad8ff,TW=0xfff6c8;
const tgPoint=(R,dx,dz,def)=>{let e=null;try{e=chronoTarget(R)}catch(_){}return e?{x:e.x,z:e.z,e}:{x:P.x+dx*def,z:P.z+dz*def,e:null}};
const nearest=(x,z,r,skip)=>{let b=null,bd=1e9;for(const e of enemies){if(e.hp<=0||e.gwx||(skip&&skip.has(e)))continue;const d=Math.hypot(e.x-x,e.z-z);if(d<r&&d<bd){bd=d;b=e}}return b};
const hitPlayerNear=(x,z,r)=>{if(!MP.r)return null;for(const k in MP.others){const o=MP.others[k];if(Math.hypot(o.x-x,o.z-z)<r)return o}return null};
const starTex=()=>kCanvas('v92star',(x,W)=>{const c=W/2;let g=x.createRadialGradient(c,c,0,c,c,c);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.12,'rgba(255,250,220,.9)');g.addColorStop(.35,'rgba(255,220,120,.25)');g.addColorStop(1,'rgba(255,200,80,0)');x.fillStyle=g;x.fillRect(0,0,W,W);x.fillStyle='rgba(255,255,255,.95)';for(let k=0;k<4;k++){x.save();x.translate(c,c);x.rotate(k*Math.PI/2);x.beginPath();x.moveTo(0,-c*.95);x.lineTo(c*.05,0);x.lineTo(0,c*.05);x.lineTo(-c*.05,0);x.closePath();x.fill();x.restore()}for(let k=0;k<4;k++){x.save();x.translate(c,c);x.rotate(Math.PI/4+k*Math.PI/2);x.beginPath();x.moveTo(0,-c*.5);x.lineTo(c*.03,0);x.lineTo(-c*.03,0);x.closePath();x.fill();x.restore()}});
const pageTex=()=>kCanvas('v92page',(x,W)=>{x.fillStyle='#fff8e6';x.fillRect(0,0,W,W);x.strokeStyle='rgba(150,110,40,.35)';x.lineWidth=3;for(let y=W*.14;y<W*.9;y+=W*.07){x.beginPath();x.moveTo(W*.12,y);x.lineTo(W*.88,y);x.stroke()}x.strokeStyle='rgba(200,150,40,.8)';x.lineWidth=10;x.strokeRect(6,6,W-12,W-12);x.fillStyle='rgba(190,140,30,.55)';x.font='bold '+Math.round(W*.16)+'px Georgia,serif';x.textAlign='center';x.fillText('XII',W/2,W*.62)});

// ---------------- grimório do Tempo em leque: as páginas abrem em um círculo completo (inspirado na referência) ----------------
function v92Wheel(R,H,n){const g=new T.Group(),pages=[],pm2=new T.MeshBasicMaterial({map:pageTex()||null,color:0xffffff,side:T.DoubleSide,transparent:true,opacity:.97}),em=GLM(TG,.75);
 const geo=new T.PlaneGeometry(R,H);geo.translate(R/2,0,0);const eg=new T.PlaneGeometry(R,.035);eg.translate(R/2,H/2,0);const eg2=new T.PlaneGeometry(R,.035);eg2.translate(R/2,-H/2,0);
 for(let k=0;k<n;k++){const p=new T.Mesh(geo,pm2);p.add(new T.Mesh(eg,em),new T.Mesh(eg2,em));g.add(p);pages.push(p)}
 const spine=new T.Mesh(new T.CylinderGeometry(.05,.05,H*1.08,10),new T.MeshToonMaterial({color:0x8a6a10,gradientMap:gmap}));g.add(spine);
 const top=kPlane(tTexRoman(),R*2.25,TG,0);top.rotation.x=-Math.PI/2;top.position.y=H/2+.03;g.add(top);
 const rt=new T.Mesh(new T.TorusGeometry(R*1.04,.022,6,72),GLM(TG,0));rt.rotation.x=Math.PI/2;rt.position.y=H/2;const rb=rt.clone();rb.material=GLM(TB,0);rb.position.y=-H/2;g.add(rt,rb);
 const star=kPlane(starTex(),H*1.5,TW,0);g.add(star);const core=new T.Mesh(new T.SphereGeometry(H*.08,12,8),GLM(0xffffff,0));g.add(core);
 Object.assign(UD(g),{pages,top,rt,rb,star,core,n});return g}
function v92WheelTick(g,open,t){const u=UD(g);const a=Math.max(0,Math.min(1,open));u.pages.forEach((p,k)=>{p.rotation.y=a*(k/u.n)*6.2832+Math.sin(t*3+k)*.015*a});
 u.star.lookAt(cam.position);u.top.material.opacity=.85*a;u.top.rotation.z=-t*.6;u.rt.material.opacity=.8*a;u.rb.material.opacity=.6*a;u.star.material.opacity=.95*a;u.core.material.opacity=a;u.star.scale.setScalar(.85+Math.sin(t*6)*.12)}

// pequena explosão de fogo (reaproveitada pelas 3 magias)
function v92Boom(x,y,z,d,R,big){fSound('boom');fGroundWave(x,z,R*1.4,big?.55:.35);kShock(x,z,R*1.1,FY,.25,y);if(big)kShock(x,z,R*.8,FW,.2,y);const bl=new T.Mesh(new T.SphereGeometry(1,14,10),fMat(fTexFlame(),FO,.9));bl.position.set(x,y,z);S.add(bl);
 kfx({u:f=>{const u=f.t/(big?.45:.3);bl.scale.setScalar(.3+R*(big?1.1:.8)*Math.pow(Math.min(1,u),.5));bl.material.opacity=.9*(1-u);bl.material.color.setHex(u<.3?FY:u<.6?FO:FR);return u<1},end:()=>kDispose(bl)});
 fEmbers(x,y,z,Math.round((big?18:8)*Q()),big?6:4,big?4:2.5);fLight(x,y+.8,z,big?2.2:1,FO);
 for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-x,e.z-z)<R){hitE(e,d,{b:1});kb(e,(e.x-x)||.01,(e.z-z)||.01,big?5:2.5,.15)}pvpHit(x,z,R,d)}

// ================= FOGO 1 · EXPLOSIVE VANISHING SCATTERSHOT =================
// 5 bolas de fogo giram em anel na mão, saem em leque, SOMEM e REAPARECEM ao lado em trajetórias imprevisíveis até o alvo
function fVanish(d,dx,dz){fWord('VANISHING SCATTERSHOT!');fSound('charge');const N=5,pc=fCircle(.62,'w');S.add(pc);let tg=null;try{tg=chronoTarget(28)}catch(_){}
 const B=[];for(let k=0;k<N;k++){const o=fOrb(.26);o.scale.setScalar(.01);S.add(o);B.push({o,a:k/N*6.2832,st:0,p:new T.Vector3(),v:new T.Vector3(),hid:0,bl:[rnd(.1,.18),rnd(.3,.42)],bi:0,dl:.045*k,dist:0,seed:Math.random()*6})}
 kfx({u:(q,dt)=>{const t=q.t,h=aHand(),fx=Math.sin(P.f),fz=Math.cos(P.f);kCircleTick(pc,dt,Math.min(1,t/.15)*(t>.5?Math.max(0,1-(t-.5)*4):1),Math.max(0,Math.sin(t*22))*.3);pc.position.set(h.x+fx*.3,h.y,h.z+fz*.3);pc.rotation.y=P.f;let alive=false;
  B.forEach((b,k)=>{if(b.st==2)return;alive=true;fOrbTick(b.o,t+b.seed);
   if(b.st==0){const a=b.a+t*10,r=.58,cx=h.x+fx*.45,cz=h.z+fz*.45;b.o.position.set(cx+Math.cos(a)*r*fz,h.y+Math.sin(a)*r,cz-Math.cos(a)*r*fx);b.o.scale.setScalar(Math.min(1,t/.25));
    if(Math.random()<.5*Q())fxp({x:b.o.position.x,y:b.o.position.y,z:b.o.position.z,c:FY,n:1,sp:.6,sz:.1,life:.25,up:.6});
    if(t>.38+b.dl){b.st=1;b.p.copy(b.o.position);const f=P.f+(k-(N-1)/2)*.34;b.v.set(Math.sin(f),0,Math.cos(f)).multiplyScalar(25);b.t0=t;kShock(b.p.x,b.p.z,.7,FY,.16,b.p.y);if(k==0){fSound('boom');P.shake=Math.max(P.shake,.08)}}return}
   const tt=t-b.t0;
   if(b.hid<=0&&b.bi<2&&tt>b.bl[b.bi]){b.bi++;b.hid=rnd(.1,.17);b.o.visible=false;fEmbers(b.p.x,b.p.y,b.p.z,Math.round(7*Q())+2,3,1);kShock(b.p.x,b.p.z,.6,FO,.14,b.p.y);
    const side=(Math.random()<.5?-1:1)*rnd(1.3,2.6),vx=b.v.x,vz=b.v.z,L=Math.hypot(vx,vz)||1;b.p.x+=vz/L*side+vx/L*1.2;b.p.z+=-vx/L*side+vz/L*1.2;b.p.y=Math.max(.6,b.p.y+rnd(-.4,.7))}
   if(b.hid>0){b.hid-=dt;if(b.hid<=0){b.o.visible=true;kShock(b.p.x,b.p.z,.65,FW,.14,b.p.y);fEmbers(b.p.x,b.p.y,b.p.z,Math.round(5*Q())+2,2.5,1)}return}
   const T0=tg&&tg.hp>0?tg:null;if(T0){const ax=T0.x-b.p.x,az=T0.z-b.p.z,L=Math.hypot(ax,az)||1,k2=Math.min(1,dt*(tt>.3?6:2.5));b.v.x+=(ax/L*27-b.v.x)*k2;b.v.z+=(az/L*27-b.v.z)*k2}else{const w=Math.sin(tt*13+b.seed)*22*dt,L=Math.hypot(b.v.x,b.v.z)||1;b.v.x+=b.v.z/L*w;b.v.z-=b.v.x/L*w}
   b.p.y+=((1.25-b.p.y)*4)*dt;b.p.addScaledVector(b.v,dt);b.dist+=Math.hypot(b.v.x,b.v.z)*dt;b.o.position.copy(b.p);
   if(Math.random()<.9*Q())fxp({x:b.p.x,y:b.p.y,z:b.p.z,c:Math.random()<.5?FO:FY,n:1,dx:-b.v.x,dz:-b.v.z,sp:2,spread:.5,sz:.16,life:.3,up:.6});
   let hit=false;for(const e of enemies)if(e.hp>0&&Math.hypot(e.x-b.p.x,e.z-b.p.z)<1.1){hit=true;break}if(!hit&&hitPlayerNear(b.p.x,b.p.z,1))hit=true;
   if(hit||b.dist>30||tt>2.2){b.st=2;b.o.visible=false;v92Boom(b.p.x,b.p.y,b.p.z,d,1.9,false)}});
  return alive||t<.6},end:()=>{kDispose(pc);B.forEach(b=>kDispose(b.o))}})}

// ================= FOGO 2 · TIMED EXPLOSION SCATTERSHOT =================
// 6 bombas de fogo caem em volta do alvo, cravam no chão com contagem (3, 2, 1) e explodem em sequência com pilares de fogo
function fTimed(d,dx,dz){fWord('TIMED EXPLOSION SCATTERSHOT!');fSound('charge');const c=tgPoint(18,dx,dz,11),N=6,h0=aHand(),M=[];
 for(let k=0;k<N;k++){const a=k/N*6.2832+rnd(-.35,.35),r=k==0?0:rnd(1.8,3.3),tx=c.x+Math.cos(a)*r,tz=c.z+Math.sin(a)*r;const o=fOrb(.24);o.position.copy(h0);o.scale.setScalar(.01);S.add(o);
  const ci=fCircle(1.05,'g');ci.position.set(tx,.09,tz);S.add(ci);const fuse=new T.Mesh(new T.RingGeometry(.9,1.02,48),fMat(null,FY,0));fuse.rotation.x=-Math.PI/2;fuse.position.set(tx,.13,tz);S.add(fuse);
  M.push({o,ci,fuse,tx,tz,dl:k*.07,fz:1.25+k*.24,st:0,n:4,x0:h0.x,y0:h0.y,z0:h0.z})}
 kfx({u:(q,dt)=>{const t=q.t;let alive=false;
  M.forEach((m,k)=>{if(m.st==3)return;alive=true;fOrbTick(m.o,t+k);const u=t-m.dl;if(u<0)return;
   if(m.st==0){const f=Math.min(1,u/.42),y=m.y0+(1-m.y0)*f+Math.sin(f*Math.PI)*3.2;m.o.position.set(m.x0+(m.tx-m.x0)*f,y,m.z0+(m.tz-m.z0)*f);m.o.scale.setScalar(Math.min(1,u/.12));if(Math.random()<.8*Q())fxp({x:m.o.position.x,y,z:m.o.position.z,c:FO,n:1,sp:.8,sz:.16,life:.35,up:.3});
    if(f>=1){m.st=1;m.t1=t;m.o.position.set(m.tx,.45,m.tz);kShock(m.tx,m.tz,1.2,FO,.2,.2);fEmbers(m.tx,.3,m.tz,Math.round(6*Q()),3,2);fSound('charge')}return}
   if(m.st==1){const w=t-m.t1,rem=m.fz-w,fr=Math.max(0,rem/m.fz);kCircleTick(m.ci,dt,Math.min(1,w/.2),Math.max(0,Math.sin(w*(8+(1-fr)*26)))*.5);m.fuse.material.opacity=.9;m.fuse.scale.setScalar(.15+.85*fr);
    const bl=Math.sin(w*(6+(1-fr)*30))>0;m.o.scale.setScalar(bl?1.15:.85);m.o.position.y=.45+Math.sin(w*5)*.06;
    const nn=Math.ceil(rem/(m.fz/3));if(nn<m.n&&nn>0){m.n=nn;dmgNum(m.tx,1.4,m.tz,String(nn),0,'xp')}
    if(Math.random()<.5*Q())fxp({x:m.tx,y:.8,z:m.tz,c:FY,n:1,sp:.4,sz:.08,life:.4,up:2});
    if(rem<=0){m.st=3;m.o.visible=false;m.fuse.visible=false;const x=m.tx,z=m.tz;v92Boom(x,1,z,d,2.7,true);P.shake=Math.max(P.shake,.14);
     const pil=new T.Mesh(new T.CylinderGeometry(.55,.9,6,14,1,true),fMat(fTexFlame(),FO,.85)),pil2=new T.Mesh(new T.CylinderGeometry(.25,.4,7,10,1,true),fMat(fTexFlame(),FW,.8));pil.position.set(x,3,z);pil2.position.set(x,3.5,z);S.add(pil,pil2);
     kfx({u:f=>{const v=f.t/.5;pil.scale.set(1+v*.6,Math.min(1,v*4),1+v*.6);pil2.scale.set(1,Math.min(1,v*5),1);pil.material.opacity=.85*(1-v);pil2.material.opacity=.8*(1-v);pil.rotation.y+=.2;return v<1},end:()=>{kDispose(pil);kDispose(pil2)}});
     kfx({u:f=>{kCircleTick(m.ci,.016,Math.max(0,1-f.t*3),0);return f.t<.35},end:()=>kDispose(m.ci)})}}});
  return alive},end:()=>M.forEach(m=>{kDispose(m.o);kDispose(m.fuse);if(m.st!=3)kDispose(m.ci)})})}

// ================= FOGO 3 · PRISON KILL BUCKSHOT =================
// Uma jaula de pilares de fogo prende o alvo; Magna dispara 3 rajadas de chumbinhos de fogo e a jaula desaba em uma explosão
function fBuck(d,dx,dz){fWord('PRISON KILL BUCKSHOT!');fSound('charge');const c=tgPoint(18,dx,dz,9),R=3.1,n=Math.round(8*Q())+4,P0=[],ci=fCircle(R*1.05,'g',1);ci.position.set(c.x,.08,c.z);S.add(ci);
 for(let k=0;k<n;k++){const a=k/n*6.2832,g=new T.Group(),c1=new T.Mesh(new T.CylinderGeometry(.2,.26,4.4,10,1,true),fMat(fTexFlame(),FY,.6)),c2=new T.Mesh(new T.CylinderGeometry(.4,.48,4.6,10,1,true),fMat(fTexFlame(),FR,.35)),tip=fFlames(3,.25,1.2);c1.position.y=2.2;c2.position.y=2.3;tip.position.y=4.4;g.add(c1,c2,tip);g.position.set(c.x+Math.cos(a)*R,0,c.z+Math.sin(a)*R);g.scale.y=.01;S.add(g);P0.push({g,a,c1,c2,tip})}
 const top=new T.Mesh(new T.TorusGeometry(R,.08,6,64),fMat(null,FO,0));top.rotation.x=-Math.PI/2;top.position.set(c.x,4.3,c.z);S.add(top);
 let trapped=[],vol=0;const pel=[];fLight(c.x,2,c.z,1.6,FO);
 kfx({u:(q,dt)=>{const t=q.t,rise=Math.min(1,t/.35);kCircleTick(ci,dt,rise*(t>2.1?Math.max(0,1-(t-2.1)*4):1),Math.max(0,Math.sin(t*10))*.25);
  P0.forEach((p,k)=>{const col=t>1.85?Math.min(1,(t-1.85)/.3):0;p.g.scale.y=Math.max(.01,rise*(1-col*.9));const r=R*(1-col*.92);p.g.position.set(c.x+Math.cos(p.a+t*.6)*r,0,c.z+Math.sin(p.a+t*.6)*r);p.c1.rotation.y+=dt*3;p.c2.rotation.y-=dt*2;fFlamesTick(p.tip,t+k,1,cam.position);p.c1.material.opacity=.6*(.8+Math.sin(t*20+k)*.2)});
  top.material.opacity=.8*rise*(t>1.85?Math.max(0,1-(t-1.85)*3):1);
  if(t>.35&&!trapped.length&&!q.tr){q.tr=1;trapped=xNear(c.x,c.z,R+.4);trapped.forEach(e=>{e.st=Math.max(e.st||0,2.4);e.cast=0;e.mc=Math.max(e.mc||0,2.4)});fSound('boom');kShock(c.x,c.z,R,FY,.3,.4)}
  if(t>.55&&vol<3&&t>.55+vol*.38){vol++;const h=aHand();P.f=Math.atan2(c.x-P.x,c.z-P.z);startPose('push');fSound('boom');P.shake=Math.max(P.shake,.1);kShock(h.x,h.z,.9,FW,.15,h.y);
   for(let j=0;j<Math.round(6*Q())+4;j++){const ang=Math.atan2(c.x-h.x,c.z-h.z)+rnd(-.22,.22),sp=rnd(36,46),m=new T.Mesh(sgG('v92pel',()=>new T.SphereGeometry(.09,6,4)),BM(FW)),gl=new T.Mesh(sgG('v92pelg',()=>new T.SphereGeometry(.2,6,4)),fMat(null,FY,.7));gl.scale.set(1,1,2.4);m.add(gl);m.position.copy(h);m.rotation.y=ang;S.add(m);
    pel.push({m,vx:Math.sin(ang)*sp,vz:Math.cos(ang)*sp,vy:rnd(-1.2,.4),life:.9})}}
  for(let i=pel.length-1;i>=0;i--){const p=pel[i];p.m.position.x+=p.vx*dt;p.m.position.z+=p.vz*dt;p.m.position.y=Math.max(.3,p.m.position.y+p.vy*dt);p.life-=dt;if(Math.random()<.5*Q())fxp({x:p.m.position.x,y:p.m.position.y,z:p.m.position.z,c:FO,n:1,sp:.3,sz:.08,life:.18});
   const px=p.m.position.x,pz=p.m.position.z;let e=nearest(px,pz,.95);const dc=Math.hypot(px-c.x,pz-c.z);if(e||dc<.6||p.life<=0||(dc<R&&Math.random()<dt*3)){if(e){hitE(e,d,{b:1})}pvpHit(px,pz,.9,d);fEmbers(px,p.m.position.y,pz,Math.round(4*Q())+1,3,1.5);kShock(px,pz,.5,FY,.12,p.m.position.y);S.remove(p.m);pel.splice(i,1)}}
  if(t>2.15&&!q.bm){q.bm=1;v92Boom(c.x,1.2,c.z,d*3,R+1.4,true);P.shake=Math.max(P.shake,.3);const col=new T.Mesh(new T.CylinderGeometry(R*.8,R*1.1,7,20,1,true),fMat(fTexFlame(),FO,.8));col.position.set(c.x,3.5,c.z);S.add(col);kfx({u:f=>{const v=f.t/.6;col.scale.set(1-v*.5,Math.min(1,v*5),1-v*.5);col.material.opacity=.8*(1-v);col.rotation.y+=.25;return v<1},end:()=>kDispose(col)})}
  return t<2.6||pel.length>0},end:()=>{kDispose(ci);kDispose(top);P0.forEach(p=>kDispose(p.g));pel.forEach(p=>S.remove(p.m))}})}

// ================= TEMPO 1 · TIME STEAL (roubar o tempo) =================
// Um ponteiro de relógio dourado gira até o alvo; ao acertar (ou se o inimigo estiver encostado) o tempo dele é puxado em uma fita de luz até você
function v92Hand(L){const g=new T.Group(),gm=GLM(TG,.95),wm=BM(TW);const sh=new T.Mesh(new T.BoxGeometry(.06,.06,L),gm);g.add(sh);const core=new T.Mesh(new T.BoxGeometry(.025,.025,L*1.02),wm);g.add(core);
 const tip=new T.Mesh(new T.OctahedronGeometry(.16,0),gm);tip.scale.set(.8,.8,2.2);tip.position.z=L/2+.2;g.add(tip);const tip2=new T.Mesh(new T.OctahedronGeometry(.08,0),wm);tip2.scale.set(.8,.8,2.2);tip2.position.z=L/2+.22;g.add(tip2);
 const ring=new T.Mesh(new T.TorusGeometry(.14,.025,6,20),gm);ring.position.z=-L*.3;g.add(ring);const tail=new T.Mesh(new T.ConeGeometry(.1,.35,4),gm);tail.rotation.x=-Math.PI/2;tail.position.z=-L/2-.1;g.add(tail);
 const glow=new T.Mesh(new T.SphereGeometry(.35,10,8),GLM(TG,.22));glow.scale.set(.7,.7,L*1.6);g.add(glow);return g}
function v92StealStream(e,amt){const N=Math.round(10*Q())+4,M=[],ck=[];for(let k=0;k<N;k++){const m=new T.Mesh(sgG('v92mote',()=>new T.OctahedronGeometry(.07,0)),GLM(k%3==0?TB:TG,.95));S.add(m);M.push({m,o:k/N,ph:Math.random()*6})}
 for(let k=0;k<Math.max(1,Math.round(2*Q()));k++){const c=tClock(.2,'w');S.add(c);ck.push({c,o:k*.35})}const top=tClock(.7,'w');S.add(top);const ex=e.x,ez=e.z;
 kfx({u:(q,dt)=>{const t=q.t,sx=(e.hp>0?e.x:ex),sz=(e.hp>0?e.z:ez);top.position.set(sx,3,sz);top.lookAt(cam.position);tClockTick(top,dt,t<.15?t/.15:Math.max(0,1-(t-.9)/.3),[-8,-2.5,-.4]);
  const path=(u,ph)=>{const x=sx+(P.x-sx)*u,z=sz+(P.z-sz)*u,y=1.5+Math.sin(u*Math.PI)*1.6;const w=Math.sin(u*9+ph+t*6)*.25;return[x+w*.6,y+Math.cos(u*7+ph)*.15,z-w*.6]};
  M.forEach(o=>{const u=((t*1.5+o.o)%1);const p=path(u,o.ph);o.m.position.set(p[0],p[1],p[2]);o.m.rotation.x+=dt*6;o.m.material.opacity=.95*(t>1?Math.max(0,1-(t-1)/.2):1)*Math.sin(Math.PI*u)});
  ck.forEach(o=>{const u=Math.min(1,Math.max(0,(t-o.o)/.75));const p=path(u,0);o.c.position.set(p[0],p[1],p[2]);o.c.lookAt(cam.position);tClockTick(o.c,dt,u<1?Math.min(1,(t-o.o)/.1):0,[-5,-1,0]);if(u>=1&&!o.done){o.done=1;kShock(P.x,P.z,1.2,TG,.25,1.2);tShards(P.x,1.4,P.z,Math.round(6*Q()),3,2)}});
  if(Math.random()<.6*Q())fxp({x:sx,y:1.6,z:sz,c:TG,n:1,sp:1,sz:.1,life:.5,up:1});
  return t<1.2},end:()=>{M.forEach(o=>kDispose(o.m));ck.forEach(o=>kDispose(o.c));kDispose(top)}});dmgNum(P.x,2.7,P.z,'+'+amt+' ⏳',0,'xp');trAdd(amt)}
function tSteal(d,dx,dz){tEyes(1);tSound('tick');const touch=nearest(P.x,P.z,2.4);let tg=null;try{tg=chronoTarget(26)}catch(_){}
 const ck=tClock(.55,'w');S.add(ck);const hnd=v92Hand(1.3);S.add(hnd);const pos=new T.Vector3(),v=new T.Vector3();let fired=false,dist=0,done=false;
 if(touch){hitE(touch,d*1.3,{sl:1});v92StealStream(touch,14);chronoHit(touch);tShards(touch.x,1.5,touch.z,Math.round(10*Q()),4,2)}
 kfx({u:(q,dt)=>{const t=q.t,h=aHand(),fx=Math.sin(P.f),fz=Math.cos(P.f);ck.position.set(h.x+fx*.35,h.y+.1,h.z+fz*.35);ck.rotation.y=P.f;tClockTick(ck,dt,t<.15?t/.15:Math.max(0,1-(t-.3)/.2),[-6,-1.5,-.2]);
  if(!fired){hnd.position.set(h.x+fx*.4,h.y+.1,h.z+fz*.4);hnd.rotation.set(0,P.f,0);hnd.rotateZ(t*20);if(t>.16){fired=true;pos.copy(hnd.position);v.set(dx,0,dz).multiplyScalar(36);kShock(pos.x,pos.z,.8,TG,.15,pos.y)}return true}
  if(!done){const T0=tg&&tg.hp>0?tg:null;if(T0){const ax=T0.x-pos.x,az=T0.z-pos.z,L=Math.hypot(ax,az)||1,k2=Math.min(1,dt*5);v.x+=(ax/L*36-v.x)*k2;v.z+=(az/L*36-v.z)*k2}
   pos.addScaledVector(v,dt);pos.y+=((1.35-pos.y)*5)*dt;dist+=36*dt;hnd.position.copy(pos);hnd.rotation.set(0,Math.atan2(v.x,v.z),0);hnd.rotateZ(t*24);if(Math.random()<.9*Q())fxp({x:pos.x,y:pos.y,z:pos.z,c:Math.random()<.7?TG:TB,n:1,dx:-v.x,dz:-v.z,sp:1.5,spread:.4,sz:.1,life:.35});
   const e=nearest(pos.x,pos.z,1.1);const pl=!e&&hitPlayerNear(pos.x,pos.z,1);if(e||pl||dist>27){done=true;hnd.visible=false;kShock(pos.x,pos.z,1.4,TG,.25,1.3);tShards(pos.x,1.4,pos.z,Math.round(10*Q()),4,2);if(e){hitE(e,d,{sl:1});chronoHit(e);v92StealStream(e,8)}pvpHit(pos.x,pos.z,1.1,d)}}
  return t<.5||!done},end:()=>{kDispose(ck);kDispose(hnd)}})}

// ================= TEMPO 2 · TIME HALT (parar o tempo) =================
// O grimório abre em leque acima de você, o relógio do céu para e TUDO congela: inimigos, projéteis e poeira. Ao voltar, todos os golpes chegam de uma vez.
let HALT=null;
function v92Overlay(on){let el=document.getElementById('v92halt');if(!el){el=document.createElement('div');el.id='v92halt';el.innerHTML='<svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="92" fill="none" stroke="#f0cf72" stroke-width="2"/><circle cx="100" cy="100" r="70" fill="none" stroke="#f0cf72" stroke-width="1"/>'+['XII','I','II','III','IV','V','VI','VII','VIII','IX','X','XI'].map((n,k)=>{const a=k/12*6.2832-Math.PI/2;return '<text x="'+(100+Math.cos(a)*81).toFixed(1)+'" y="'+(104+Math.sin(a)*81).toFixed(1)+'" fill="#f0cf72" font-family="Georgia,serif" font-size="11" text-anchor="middle">'+n+'</text>'}).join('')+'<path d="M100 100V40" stroke="#f0cf72" stroke-width="3"/><path d="M100 100L140 112" stroke="#f0cf72" stroke-width="2"/></svg>';document.body.appendChild(el);
  const st=document.createElement('style');st.textContent='#v92halt{position:fixed;inset:0;pointer-events:none;z-index:3;opacity:0;transition:opacity .35s;background:radial-gradient(ellipse at center,transparent 35%,rgba(40,28,6,.55) 100%);display:grid;place-items:center}#v92halt svg{width:min(80vh,80vw);height:min(80vh,80vw);opacity:.16;animation:v92spin 40s linear infinite}#v92halt.on{opacity:1}@keyframes v92spin{to{transform:rotate(360deg)}}body.inmenu #v92halt{display:none}';document.head.appendChild(st)}
 el.classList.toggle('on',!!on);try{const cv=R.domElement;if(on&&CFG.gfx!='baixo'){cv._v92f=cv.style.filter||'';cv.style.filter='sepia(.5) saturate(.5) brightness(.86) contrast(1.1)'}else if(!on)cv.style.filter=cv._v92f||''}catch(e){}}
function tHalt(d){if(HALT)return;tWord('TIME HALT!');tSound('stop');tEyes(1);P.shake=Math.max(P.shake,.25);const R=26,bonus=(P.tr||0)>=30;if(bonus)trAdd(-30);const dur=(5+(bonus?2:0))*(1+cb('dur')),cx=P.x,cz=P.z;
 const wh=v92Wheel(1.6,.9,Math.round(30*Q())+10);S.add(wh);const gc=tClock(7,'g');gc.position.set(cx,.07,cz);S.add(gc);const sky=tClock(5,'w');S.add(sky);try{tWave(cx,cz,12,.8,2)}catch(e){}
 const caught=xNear(cx,cz,R).slice(0,14).map(e=>{try{stasisOn(e,dur)}catch(_){e.st=Math.max(e.st||0,dur)}return{e,h0:e.hp}});
 const sh=[];for(const q of eshots){if(Math.hypot(q.m.position.x-cx,q.m.position.z-cz)<R){sh.push({q,vx:q.vx,vz:q.vz});q.vx=0;q.vz=0;q.life+=dur+.5}}
 const dust=[];for(let k=0;k<Math.round(26*Q())+8;k++){const m=new T.Mesh(sgG('v92dust',()=>new T.OctahedronGeometry(.06,0)),GLM(k%4?TG:TB,0));const a=Math.random()*6.28,r=Math.sqrt(Math.random())*12;m.position.set(cx+Math.cos(a)*r,rnd(.4,3.6),cz+Math.sin(a)*r);m.rotation.set(Math.random()*3,Math.random()*3,0);S.add(m);dust.push(m)}
 v92Overlay(1);HALT={t:0};let ended=false;
 const finish=()=>{if(ended)return;ended=true;HALT=null;v92Overlay(0);tSound('tick');tEyes(0);
  for(const o of sh){if(eshots.includes(o.q)){o.q.vx=o.vx;o.q.vz=o.vz}}
  caught.forEach((o,i)=>{const e=o.e;if(!enemies.includes(e)||e.hp<=0)return;const extra=Math.max(0,o.h0-e.hp)*.35;tmr.push({t:i*.06,f:()=>{if(e.hp<=0)return;hitE(e,d+extra,{sl:1});tShards(e.x,1.5,e.z,Math.round(12*Q()),5,3);kShock(e.x,e.z,2.2,TG,.35,1.4);kShock(e.x,e.z,1.4,TW,.25,1.6);kb(e,(e.x-cx)||.01,(e.z-cz)||.01,3,.2)}})});
  xPvp(cx,cz,R*.5,d);P.shake=Math.max(P.shake,.3)};
 kfx({u:(q,dt)=>{const t=q.t;if(HALT)HALT.t=t;const open=t<.6?t/.6:t>dur?Math.max(0,1-(t-dur)/.5):1;
  wh.position.set(P.x,3.6+Math.sin(t*1.5)*.08,P.z);wh.lookAt(cam.position);wh.rotateX(.62);wh.rotateY(t*.35);v92WheelTick(wh,open,t);
  sky.position.set(cx,8.5,cz);sky.lookAt(cam.position);const frz=t>.6&&t<dur;tClockTick(sky,dt,open,frz?[0,0,0]:t<.6?[-3*(1-t/.6),-1,0]:[6,2,.5]);tClockTick(gc,dt,open,frz?[0,0,0]:[-2,-.5,0]);for(const c of[sky,gc])UD(c).L.forEach(l=>l.m.material.opacity*=.45);UD(gc).T3.forEach(r=>r.rotation.set(0,0,0));
  dust.forEach((m,k)=>{m.material.opacity=.9*open*(.6+.4*Math.sin(k+t*.5))});
  if(t<dur){for(const o of caught){const e=o.e;if(e.hp>0&&enemies.includes(e)){e.st=Math.max(e.st||0,.2);e.cast=0}}
   for(const q2 of eshots){if(!sh.some(o=>o.q===q2)&&Math.hypot(q2.m.position.x-cx,q2.m.position.z-cz)<R){sh.push({q:q2,vx:q2.vx,vz:q2.vz});q2.vx=0;q2.vz=0;q2.life+=dur}}}
  if(t>=dur)finish();return t<dur+.55},end:()=>{finish();kDispose(wh);kDispose(gc);kDispose(sky);dust.forEach(kDispose)}})}

// ================= TEMPO 3 · TIME RETURN (desacelerar e devolver) =================
// Uma esfera de tempo lento segura os projéteis inimigos no ar; depois eles voltam 3× mais rápido, junto com ponteiros dourados, contra os inimigos
function tReturn(d){tWord('TIME RETURN!');tSound('tick');tEyes(1);const R=7.5,dur=2.2,cx=P.x,cz=P.z;const dome=new T.Mesh(new T.SphereGeometry(R,28,16,0,6.2832,0,Math.PI/2),GLM(TB,0)),wire=new T.Mesh(new T.SphereGeometry(R*1.01,18,10,0,6.2832,0,Math.PI/2),new T.MeshBasicMaterial({color:TW,wireframe:true,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));dome.position.set(cx,0,cz);wire.position.set(cx,0,cz);S.add(dome,wire);
 const gc=tClock(R*.92,'g');gc.position.set(cx,.08,cz);S.add(gc);const rings=[];for(let k=0;k<3;k++){const r=new T.Mesh(new T.TorusGeometry(R*(.28+k*.12),.035,6,72),GLM(k%2?TB:TG,0));r.position.set(cx,1.6+k*.5,cz);S.add(r);rings.push(r)}
 const caught=[],bolts=[];let rel=false;
 kfx({u:(q,dt)=>{const t=q.t,g=t<.25?t/.25:t>dur+.2?Math.max(0,1-(t-dur-.2)/.4):1;dome.material.opacity=.05*g;wire.material.opacity=.07*g;dome.scale.setScalar(.2+.8*Math.min(1,t/.25));wire.scale.copy(dome.scale);
  tClockTick(gc,dt,g,rel?[8,2,.4]:[-.3,-.08,0]);UD(gc).T3.forEach(r=>r.rotation.set(0,0,0));rings.forEach((r,k)=>{r.material.opacity=.45*g;r.rotation.x=Math.PI/2+Math.sin(t*(rel?6:.8)+k)*.25;r.rotation.y=t*(rel?(k%2?6:-6):(k%2?.4:-.4))});
  if(Math.random()<1.2*Q()*g){const a=Math.random()*6.28,r=Math.random()*R*.9;fxp({x:cx+Math.cos(a)*r,y:3.5,z:cz+Math.sin(a)*r,c:TG,n:1,sp:.1,sz:.07,life:1.2,g:2})}
  if(!rel){for(const q2 of eshots){if(caught.some(o=>o.q===q2))continue;if(Math.hypot(q2.m.position.x-cx,q2.m.position.z-cz)<R){const sp=Math.hypot(q2.vx,q2.vz)||14;caught.push({q:q2,sp});q2.vx*=.06;q2.vz*=.06;q2.life+=dur+1;if(caught.length<=8){const ck=tClock(.45,'w');q2.m.add(ck);caught[caught.length-1].ck=ck}}}
   for(const e of xNear(cx,cz,R))e.sl=Math.max(e.sl||0,.4);for(const o of caught){if(o.ck){o.ck.lookAt(cam.position);tClockTick(o.ck,dt,1,[.8,.2,0])}}}
  if(t>=dur&&!rel){rel=true;tSound('stop');kShock(cx,cz,R,TG,.35,1.2);kShock(cx,cz,R*.6,TW,.3,1.6);P.shake=Math.max(P.shake,.15);const used=new Set();
   for(const o of caught){const q2=o.q;const i=eshots.indexOf(q2);if(i<0)continue;eshots.splice(i,1);if(o.ck){q2.m.remove(o.ck);kDispose(o.ck)}const e=nearest(q2.m.position.x,q2.m.position.z,30);bolts.push({m:q2.m,own:false,e,sp:Math.max(30,o.sp*3),vx:-o.q.vx,vz:-o.q.vz,life:1.4})}
   const n=3;for(let k=0;k<n;k++){const e=nearest(cx,cz,22,used);if(e)used.add(e);const m=v92Hand(1);m.position.set(P.x,1.5+k*.25,P.z);S.add(m);bolts.push({m,own:true,e,sp:34,vx:Math.sin(P.f+(k-1)*.5),vz:Math.cos(P.f+(k-1)*.5),life:1.3})}}
  for(let i=bolts.length-1;i>=0;i--){const b=bolts[i],p=b.m.position;b.life-=dt;if(b.e&&b.e.hp>0){const ax=b.e.x-p.x,az=b.e.z-p.z,L=Math.hypot(ax,az)||1;b.vx+=(ax/L-b.vx)*Math.min(1,dt*8);b.vz+=(az/L-b.vz)*Math.min(1,dt*8)}const L=Math.hypot(b.vx,b.vz)||1;p.x+=b.vx/L*b.sp*dt;p.z+=b.vz/L*b.sp*dt;p.y+=((1.35-p.y)*5)*dt;b.m.rotation.set(0,Math.atan2(b.vx,b.vz),0);if(b.own)b.m.rotateZ(t*20);
   if(Math.random()<.9*Q())fxp({x:p.x,y:p.y,z:p.z,c:b.own?TG:TB,n:1,sp:1,sz:.12,life:.3});const e=nearest(p.x,p.z,1.1);const pl=!e&&hitPlayerNear(p.x,p.z,1);
   if(e||pl||b.life<=0){if(e){hitE(e,b.own?d*.8:d,{sl:1});chronoHit(e)}pvpHit(p.x,p.z,1.1,d);tShards(p.x,1.4,p.z,Math.round(8*Q()),4,2);kShock(p.x,p.z,1.2,TG,.2,1.3);if(b.own)kDispose(b.m);else S.remove(b.m);bolts.splice(i,1)}}
  return t<dur+.6||bolts.length>0},end:()=>{kDispose(dome);kDispose(wire);kDispose(gc);rings.forEach(kDispose);tEyes(0);
   for(const o of caught){if(o.ck&&o.ck.parent){o.ck.parent.remove(o.ck);kDispose(o.ck)}}bolts.forEach(b=>{if(b.own)kDispose(b.m);else S.remove(b.m)})}})}

// ================= TEMPO 4 · CHRONO ANASTASIS (voltar o tempo) =================
// O relógio gira ao contrário, suas imagens do passado voltam até você e os ferimentos dos últimos 5 segundos são desfeitos
const PH=[];
function tRewind(){tWord('CHRONO ANASTASIS!');tSound('tick');tEyes(1);const H=(P.hh||[]).slice(-20);let peak=P.hp;for(const v of H)if(v>peak)peak=v;const bonus=(P.tr||0)>=20;if(bonus)trAdd(-20);
 const tgt=Math.min(P.mhp,Math.max(peak,P.hp+P.mhp*(bonus?.25:.15))),h0=P.hp,heal=Math.max(0,Math.round(tgt-h0));
 const ck=tClock(1.9,'w');S.add(ck);const gc=tClock(2.4,'g');gc.position.set(P.x,.07,P.z);S.add(gc);
 const gm=new T.MeshBasicMaterial({color:TG,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false});const G=[];
 if(CFG.fx){const pts=PH.slice(-30).filter((p,i,a)=>i%5==0).slice(-6);for(const p of pts){try{const g=pm.clone(true);g.traverse(o=>{if(o.isMesh){const m0=o.material,m1=Array.isArray(m0)?m0[0]:m0;if(!m1||(m1.transparent&&m1.opacity<.5)||m1.blending===T.AdditiveBlending||m1.side===T.BackSide){o.visible=false;return}o.material=gm;o.castShadow=false;o.receiveShadow=false}});g.position.set(p[0],pm.position.y,p[1]);g.rotation.y=p[2];S.add(g);G.push({g,x:p[0],z:p[1]})}catch(e){}}}
 const sh=new T.Mesh(new T.TorusGeometry(1,.07,6,64),GLM(TB,.9));sh.rotation.x=-Math.PI/2;S.add(sh);
 kfx({u:(q,dt)=>{const t=q.t,g=t<.2?t/.2:t>1.3?Math.max(0,1-(t-1.3)/.3):1,fx=Math.sin(P.f),fz=Math.cos(P.f);{const vx=P.x-cam.position.x,vz=P.z-cam.position.z,L=Math.hypot(vx,vz)||1;ck.position.set(P.x+vx/L*1.1,1.9,P.z+vz/L*1.1)}ck.lookAt(cam.position);tClockTick(ck,dt,g,[7,2,.5]);gc.position.set(P.x,.07,P.z);tClockTick(gc,dt,g,[3,.8,0]);UD(gc).T3.forEach(r=>r.rotation.set(0,0,0));
  const u=Math.min(1,t/1);P.hp=Math.max(P.hp,h0+(tgt-h0)*u*u*(3-2*u));
  G.forEach((o,k)=>{const v=Math.min(1,t/(.4+k*.12));o.g.position.x=o.x+(P.x-o.x)*v;o.g.position.z=o.z+(P.z-o.z)*v;gm.opacity=.35*g});
  const s2=Math.max(.2,3*(1-Math.min(1,t/.9)));sh.scale.setScalar(s2);sh.position.set(P.x,.3,P.z);sh.material.opacity=.9*g;
  if(Math.random()<1.5*Q()){const a=Math.random()*6.28;fxp({x:P.x+Math.cos(a)*1.6,y:rnd(.3,2.4),z:P.z+Math.sin(a)*1.6,c:Math.random()<.6?TG:TB,n:1,sp:.3,sz:.1,life:.5,up:1.5})}
  return t<1.6},end:()=>{kDispose(ck);kDispose(gc);kDispose(sh);G.forEach(o=>S.remove(o.g));gm.dispose();tEyes(0)}});
 if(heal>0)dmgNum(P.x,2.7,P.z,'+'+heal,0,'xp');toast('Chrono Anastasis: o tempo voltou e '+(heal>0?'você recuperou '+heal+' de vida.':'não havia ferimentos para desfazer.'))}

// ---------------- registro no jogo ----------------
const V92C={fvanish:fVanish,ftimed:fTimed,fbuck:fBuck,tsteal:tSteal,thalt:(d)=>tHalt(d),treturn:(d)=>tReturn(d),trewind:()=>tRewind()};
window.V92={C:V92C,fVanish,fTimed,fBuck,tSteal,tHalt,tReturn,tRewind,v92Wheel,v92WheelTick};
XT.push(...Object.keys(V92C));
{const _xc=xCast;xCast=function(t,d,dx,dz){const f=V92C[t];if(f){try{f(d,dx,dz)}catch(e){console.warn('v92',t,e)}return}return _xc.apply(this,arguments)}}
{const _xp=xPre;xPre=function(t){if(V92C[t]){if(t=='thalt'&&HALT)return false;return true}return _xp.apply(this,arguments)}}
try{BATSK.add('fvanish')}catch(e){}
const NM={fvanish:'Flame Magic: Explosive Vanishing Scattershot',ftimed:'Flame Magic: Timed Explosion Scattershot',fbuck:'Flame Magic: Prison Kill Buckshot',tsteal:'Chrono: Time Steal',thalt:'Chrono: Time Halt',treturn:'Chrono: Time Return',trewind:'Time Magic: Chrono Anastasis'};
{const F=GR.fogo.s,find=id=>F.find(s=>s&&s[3]==id);const so=find('fsoul'),mx=find('finferno'),tg=find('mtag');
 GR.fogo.s=[[NM.fvanish,9,12,'fvanish',{b:1},1.3],[NM.ftimed,18,30,'ftimed',null,9],so,mx,[NM.fbuck,26,9,'fbuck',null,12],tg].filter(Boolean);
 const Tm=GR.tempo.s,ft=id=>Tm.find(s=>s&&s[3]==id);const st=ft('tprison'),ac=ft('taccel');
 GR.tempo.s=[[NM.tsteal,8,26,'tsteal',{sl:1},.9],st,ac,[NM.thalt,50,60,'thalt',null,55],[NM.treturn,22,40,'treturn',null,14],[NM.trewind,30,0,'trewind',null,30]].filter(Boolean);
 GR.tempo.p.t='Reserva Temporal: o Time Steal e seus acertos roubam tempo. Com reserva, o Time Halt dura mais, a Chrono Anastasis cura mais e a Chrono Stasis e a Aceleração ficam mais longas';
 GR.fogo.p.t='Brasa: +10% de dano (inimigos queimam). Estilo Magna Swing: tiros que somem e reaparecem, bombas com contagem, jaula de fogo e a Soul Chain, que iguala o poder mágico com o alvo'}
Object.assign(ANI,{[NM.fvanish]:'throw',[NM.ftimed]:'raise',[NM.fbuck]:'push',[NM.tsteal]:'tarrow',[NM.thalt]:'treq',[NM.treturn]:'cross',[NM.trewind]:'taccel'});
Object.assign(RNG,{fvanish:['l',28],ftimed:['m',18,'área'],fbuck:['m',18,'prisão'],tsteal:['l',26],thalt:['c',26,'área enorme'],treturn:['c',7.5,'contra-ataque'],trewind:['c',0,'cura']});
try{Object.assign(TAG82,{[NM.fvanish]:'O',[NM.ftimed]:'O',[NM.fbuck]:'O',[NM.trewind]:'OA'})}catch(e){}
Object.assign(SKI,{
 [NM.fvanish]:'<circle cx="5" cy="17" r="2.6" fill="C"/><circle cx="10.5" cy="9.5" r="2.1" fill="L"/><circle cx="17.5" cy="5.5" r="2.6" fill="C"/><circle cx="19.5" cy="14.5" r="2" fill="L"/><circle cx="13" cy="19" r="1.6" fill="C" opacity=".6"/><path d="M3 21q5-9 13-15" stroke="C" stroke-width="1.2" stroke-dasharray="2 2" fill="none"/>',
 [NM.ftimed]:'<circle cx="11" cy="14" r="7.5" fill="none" stroke="C" stroke-width="1.8" stroke-dasharray="3 2"/><circle cx="11" cy="14" r="4.2" fill="C"/><path d="M11 14v-3M11 14l2 1.2" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/><path d="M15.5 6.5l3-3M18.5 8l3-1M16.5 3.5l.8-2" stroke="L" stroke-width="1.4" stroke-linecap="round"/>',
 [NM.fbuck]:'<path d="M4 21V7M9 21V4M15 21V4M20 21V7" stroke="C" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="12" cy="21" rx="9.5" ry="2" fill="none" stroke="L" stroke-width="1.2"/><circle cx="12" cy="10" r="1.5" fill="L"/><circle cx="12" cy="15" r="1.3" fill="L"/><circle cx="6.5" cy="12.5" r="1" fill="#fff"/><circle cx="17.5" cy="11.5" r="1" fill="#fff"/>',
 [NM.tsteal]:'<circle cx="8" cy="12" r="6.2" fill="none" stroke="C" stroke-width="1.6"/><path d="M8 12V8M8 12l3 1" stroke="L" stroke-width="1.6" stroke-linecap="round"/><path d="M15 12h7M19 9l3 3-3 3" stroke="C" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="16" cy="7" r=".9" fill="L"/><circle cx="17" cy="17" r=".9" fill="L"/>',
 [NM.thalt]:'<circle cx="12" cy="12" r="10" fill="L" opacity=".25" stroke="C" stroke-width="1.6"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2" stroke="C" stroke-width="1.4"/><rect x="8" y="7" width="2.6" height="10" rx="1" fill="C"/><rect x="13.4" y="7" width="2.6" height="10" rx="1" fill="C"/>',
 [NM.treturn]:'<path d="M20 12a8 8 0 1 1-3-6.2" stroke="C" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M17.5 2.2v4h4" stroke="C" stroke-width="1.8" fill="none" stroke-linecap="round"/><circle cx="12" cy="12" r="2.4" fill="L"/><path d="M4 12h5.5" stroke="L" stroke-width="1.4" stroke-linecap="round"/>',
 [NM.trewind]:'<circle cx="12.5" cy="12.5" r="8.5" fill="none" stroke="C" stroke-width="1.5"/><path d="M12.5 7.5v5l-3 2" stroke="L" stroke-width="1.6" stroke-linecap="round"/><path d="M2.5 3.5v5h5" stroke="C" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M4 8a9 9 0 0 1 3-3.5" stroke="C" stroke-width="1.5" fill="none"/>'});
// visual para os outros jogadores (multiplayer)
function v92Remote(o,c){const nm=c.nm||'';const id=Object.keys(NM).find(k=>NM[k]===nm);if(!id)return false;const f=+c.f||0,dx=Math.sin(f),dz=Math.cos(f);
 if(id[0]=='f'){const n=id=='ftimed'?4:3;for(let k=0;k<n;k++){const b=fOrb(.2);b.position.set(o.x+dx,1.4,o.z+dz);S.add(b);const a=f+(k-(n-1)/2)*.3;kfx({u:q=>{fOrbTick(b,q.t);b.position.x+=Math.sin(a)*20*.016;b.position.z+=Math.cos(a)*20*.016;return q.t<.7},end:()=>{kShock(b.position.x,b.position.z,1.6,FY,.25,1);kDispose(b)}})}if(id=='fbuck')kShock(o.x+dx*9,o.z+dz*9,3,FO,.6,.3)}
 else{const ck=tClock(id=='thalt'?4:1.4,id=='thalt'?'g':'w');ck.position.set(o.x,id=='thalt'?.08:2,o.z);S.add(ck);kfx({u:(q,dt)=>{if(id!='thalt')ck.lookAt(cam.position);tClockTick(ck,dt,q.t<1?Math.min(1,q.t/.2):Math.max(0,1-(q.t-1)/.4),[id=='trewind'?5:-4,-1,0]);return q.t<1.4},end:()=>kDispose(ck)})}return true}
{const _xr=xRemote;xRemote=function(o,c){try{if(v92Remote(o,c))return true}catch(e){}return _xr.apply(this,arguments)}}
// histórico de posição (imagens do passado da Chrono Anastasis) e emblema de relógio no grimório do Tempo
let phT=0,emb=null;
{const _tu=tUpdate;tUpdate=function(dt,mv){_tu(dt,mv);try{phT-=dt;if(phT<=0){phT=.1;PH.push([P.x,P.z,pm.rotation.y]);if(PH.length>40)PH.shift()}
 const on=P.g&&P.g.id=='tempo'&&book.visible;if(on&&!emb){emb=tClock(.15,'w');emb.rotation.x=-Math.PI/2;emb.position.set(0,.1,0);book.add(emb)}if(emb){emb.visible=!!on;if(on)tClockTick(emb,dt,1,[-1,-.08,-.01])}}catch(e){}}}
// ao equipar o grimório do Tempo, as páginas abrem em leque (círculo completo) por um instante
{const _bo=tBookOpen;tBookOpen=function(){_bo.apply(this,arguments);try{const wp=new T.Vector3();book.getWorldPosition(wp);const w=v92Wheel(.42,.34,Math.round(20*Q())+8);S.add(w);
 kfx({u:(q,dt)=>{const t=q.t,o=t<.35?t/.35:t>1.1?Math.max(0,1-(t-1.1)/.35):1;book.getWorldPosition(wp);w.position.set(wp.x,wp.y+.55,wp.z);w.lookAt(cam.position);w.rotateX(.62);w.rotateY(t*1.2);v92WheelTick(w,o,t);return t<1.5},end:()=>kDispose(w)})}catch(e){}}}
}

// ================= V95 · guarda as listas de magias de cada versão (para a tela "Escolher magias") =================
try{window.GRHIST=window.GRHIST||{};for(const k in GR){if(GR[k]&&Array.isArray(GR[k].s))(GRHIST[k]=GRHIST[k]||[]).push(GR[k].s.slice())}}catch(e){}

