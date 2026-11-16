// ================= V125 · MAGIA DO TEMPO (7ª e 8ª) e MAGIA DAS SOMBRAS DO NACHT (7ª e 8ª) =================
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const G0=0xffd75a,G1=0x7dffb0,G2=0x9ad8ff,PU=0x9a40ff,PK=0x0b0612;
// cópia leve do personagem (só as malhas visíveis, com um material só) — usada nos ecos e no retrocesso
function ghostCopy(col,op,dark){const m=dark?X.darkM(col,op):new T.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false});const g=new T.Group();pm.updateMatrixWorld(true);const inv=new T.Matrix4().copy(pm.matrixWorld).invert();let n=0;
 pm.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||o.material===olm||o.layers.mask!==1||n>45)return;for(let p=o;p&&p!==pm;p=p.parent)if(!p.visible)return;const c=new T.Mesh(o.geometry,m);c.matrixAutoUpdate=false;c.matrix.multiplyMatrices(inv,o.matrixWorld);g.add(c);n++});g.userData.m=m;return g}
X.ghostCopy=ghostCopy;
const NMT={tneedle:'Chrono: Clock Hand Storm',techo:'Chrono: Afterimage Echoes'},NMS={nsimp:'Shadow: Shadow Imps',nswing:'Shadow: Night Wings'};
// ---------- histórico do jogador (para o retrocesso): 4 s, guardado 10x por segundo ----------

// ================= TEMPO 7: TEMPESTADE DE PONTEIROS (relógio gigante dispara os ponteiros) =================
function tNeedles(d){X.word('CLOCK HAND STORM!','gold');try{tEyes(1)}catch(e){}X.snd('tick',.7);P.lock=Math.max(P.lock||0,.5);
 const clk=tClock(1.6,'g');S.add(clk);const N=Math.max(8,Math.round(12*Math.min(1,Q())));const nd=[];
 for(let k=0;k<N;k++){const g=new T.Group(),m=new T.Mesh(X.geo('needle'),X.addM(k%3?G0:0xffffff,.95)),gl=X.glow(G0,.7,.7);g.add(m,gl);S.add(g);nd.push({g,a:k/N*6.283,st:0,hit:new Set(),tg:null,v:new T.Vector3()})}
 const tr=[];let fireK=0;
 kfx({u:(F,dt)=>{return ndU(F,dt)},end:()=>ndEnd()});function ndU(F,dt){const t=F.t,c=new T.Vector3(P.x-Math.sin(P.f)*.8,2.7+(P.y||0),P.z-Math.cos(P.f)*.8);clk.position.copy(c);clk.lookAt(cam.position);tClockTick(clk,dt,Math.min(1,t*3)*(t>2.2?Math.max(0,1-(t-2.2)*3):1),[-6,-1.5,-.4]);
  // fase 1: os ponteiros saem do centro e giram em volta do relógio
  nd.forEach((o,k)=>{if(o.st==0){const u=Math.min(1,t/.5),a=o.a+t*3;o.g.position.set(c.x+Math.cos(a)*1.9*u,c.y+Math.sin(a)*1.9*u,c.z);o.g.lookAt(c);if(t>.75+k*.07){o.st=1;X.snd('tick',.4);o.tg=X.nearest(P.x,P.z,20)||null;if(o.tg){const pool=enemies.filter(e=>e.hp>0&&!e.dummy&&Math.hypot(e.x-P.x,e.z-P.z)<20);if(pool.length)o.tg=pool[k%pool.length]}const tp=o.tg?new T.Vector3(o.tg.x,1.2,o.tg.z):X.front(16,1.2).add(new T.Vector3((Math.random()-.5)*6,0,(Math.random()-.5)*6));o.v.subVectors(tp,o.g.position).normalize().multiplyScalar(40);o.g.lookAt(tp);o.life=0}}
   else if(o.st==1){const p0=o.g.position.clone();o.g.position.addScaledVector(o.v,dt);o.life+=dt;o.g.lookAt(o.g.position.clone().add(o.v));if(Math.random()<.6*Q())fxp({x:o.g.position.x,y:o.g.position.y,z:o.g.position.z,c:G0,n:1,sp:.2,sz:.07,life:.25});
    for(const e of enemies){if(e.hp<=0||o.hit.has(e))continue;const p1=o.g.position,sx=p1.x-p0.x,sz=p1.z-p0.z,L2=sx*sx+sz*sz||1,u=Math.max(0,Math.min(1,((e.x-p0.x)*sx+(e.z-p0.z)*sz)/L2)),qx=p0.x+sx*u,qz=p0.z+sz*u,qy=p0.y+(p1.y-p0.y)*u;if(Math.hypot(e.x-qx,e.z-qz)<1.1&&qy<3){o.hit.add(e);hitE(e,d*.13,{sl:1});try{tShards(e.x,1.3,e.z,Math.round(5*Q()),2,1)}catch(_){}o.st=2;o.g.visible=false;break}}
    if(o.life>.8||o.g.position.y<.1){o.st=2;o.g.visible=false;kShock(o.g.position.x,o.g.position.z,1,G0,.2,.2)}}});
  return t<2.5}function ndEnd(){X.dispose(clk);nd.forEach(o=>X.dispose(o.g));try{tEyes(0)}catch(e){}}}
// ================= TEMPO 8: ECOS DO INSTANTE (clones dourados atacando em sequência) =================
function tEchoes(d,dx,dz){X.word('AFTERIMAGE ECHOES!','gold');try{tEyes(1)}catch(e){}const tg=chronoTarget(18),cx=tg?tg.x:P.x+dx*8,cz=tg?tg.z:P.z+dz*8,N=Math.max(3,Math.round(5*Math.min(1,Q()))),R=3.2;
 const clones=[];for(let k=0;k<N;k++){const a=k/N*6.28+P.f,g=X.ghostCopy(0xffc83a,0);const ol=X.glow(G0,2.6,.35);ol.position.y=1.1;g.add(ol);g.position.set(cx+Math.sin(a)*R,0,cz+Math.cos(a)*R);g.rotation.y=Math.atan2(cx-g.position.x,cz-g.position.z);S.add(g);const ck=tClock(.45,'w');ck.position.set(g.position.x,2.4,g.position.z);S.add(ck);clones.push({g,a,ck,s:g.position.clone(),hit:false})}
 const ground=tClock(R*1.15,'g');ground.position.set(cx,.06,cz);ground.rotation.x=-Math.PI/2;S.add(ground);const slashes=[];X.snd('echo',.7);
 kfx({u:(F,dt)=>{const t=F.t;tClockTick(ground,dt,Math.min(1,t*3)*(t>2.2?Math.max(0,1-(t-2.2)*3):1),[-1.5,-.5,-.1]);
  clones.forEach((c,i)=>{const st=.35+i*.22,u=(t-st)/.18;c.ck.lookAt(cam.position);tClockTick(c.ck,dt,Math.min(1,t*4)*(u>1?Math.max(0,1-(u-1)):1),[4,1,0]);
   if(t<st){c.g.userData.m.opacity=Math.min(.6,t*2)}else if(u<1){// atravessa o alvo
    const e=new T.Vector3(cx+(cx-c.s.x),0,cz+(cz-c.s.z));c.g.position.lerpVectors(c.s,e,u);if(!c.hit&&u>.5){c.hit=true;X.snd('tick',.6);X.snd('echo',.4);X.hitArea(cx,cz,1.8,d*.2,{sl:1}).forEach(e=>X.stun(e,.25));
     const sl=new T.Mesh(X.geo('slash'),X.addM(i%2?G0:0xffffff,.9));sl.position.set(cx,1.2,cz);sl.rotation.y=Math.atan2(e.x-c.s.x,e.z-c.s.z);sl.rotation.z=(Math.random()-.5)*1.2;S.add(sl);slashes.push({m:sl,t:0});fxp({x:cx,y:1.2,z:cz,c:G0,n:Math.round(8*Q()),sp:4,sz:.1,life:.35})}}
   else if(t<2){c.g.userData.m.opacity=.4}
   else{// todos convergem e estilhaçam
    const v=Math.min(1,(t-2)/.25);c.g.position.lerp(new T.Vector3(cx,0,cz),v*.3);c.g.userData.m.opacity=Math.max(0,.55*(1-v))}});
  if(t>2.25&&!F.f125){F.f125=1;X.snd('thunder',.5);X.snd('rewind',.3);P.shake=Math.max(P.shake||0,.25);try{tShards(cx,1.2,cz,Math.round(30*Q()),5,3)}catch(e){}kShock(cx,cz,4.5,G0,.4,.3);kShock(cx,cz,2.5,G2,.3,1);X.hitArea(cx,cz,3,d*.6,{sl:1}).forEach(e=>X.stun(e,.8))}
  for(const s of slashes){s.t+=dt;s.m.scale.set(1+s.t*3,1,1);s.m.material.opacity=Math.max(0,.9-s.t*3)}return t<2.8},
  end:()=>{clones.forEach(c=>{X.dispose(c.g);X.dispose(c.ck)});X.dispose(ground);slashes.forEach(s=>X.dispose(s.m));try{tEyes(0)}catch(e){}}})}
// ================= SOMBRA 7: DIABRETES SOMBRIOS =================
const IMPS=[];
function impMesh(){const g=new T.Group(),body=new T.Group();g.add(body);const dk=new T.MeshLambertMaterial({color:0x120a1c}),rim=X.addM(PU,.35);
 const b=new T.Mesh(X.geo('impb'),dk);b.position.y=.38;b.scale.set(1,1.15,.9);body.add(b);const br=new T.Mesh(X.geo('impb'),rim);br.position.copy(b.position);br.scale.set(1.12,1.27,1.02);body.add(br);
 const h=new T.Mesh(X.geo('imph'),dk);h.position.set(0,.72,.05);body.add(h);
 for(const s of[-1,1]){const hr=new T.Mesh(X.geo('imphorn'),dk);hr.position.set(s*.11,.88,.02);hr.rotation.z=-s*.5;body.add(hr);const e=X.glow(0xf4e8ff,.26,1);e.position.set(s*.06,.74,.17);body.add(e);
  const w=new T.Mesh(X.geo('impw'),X.darkM(0x1a0c2a,.9));w.position.set(s*.16,.5,-.08);w.rotation.y=s*.6;w.scale.x=s;body.add(w);body.userData['w'+s]=w;
  const lg=new T.Mesh(X.geo('impl'),dk);lg.position.set(s*.08,.13,0);body.add(lg)}
 const tl=new T.Mesh(X.geo('impt'),dk);tl.position.set(0,.3,-.22);tl.rotation.x=-1;body.add(tl);g.userData.body=body;return g}
function puddle(x,z,r){const g=new T.Group(),a=new T.Mesh(X.geo('disc'),X.darkM(0x05020a,.0)),b=new T.Mesh(X.geo('swirl'),X.addM(PU,0));a.rotation.x=b.rotation.x=-Math.PI/2;a.position.y=.04;b.position.y=.05;g.add(a,b);g.position.set(x,0,z);g.scale.setScalar(r);S.add(g);g.userData.a=a;g.userData.b=b;return g}
function nImps(d){X.word('SHADOW IMPS!','shd124');X.snd('shadow',.8);const N=Math.max(3,Math.round(5*Math.min(1,Q())));
 for(let k=0;k<N;k++){const a=P.f+(k-(N-1)/2)*.7,x=P.x+Math.sin(a)*2.2,z=P.z+Math.cos(a)*2.2,pd=puddle(x,z,.9),im=impMesh();im.position.set(x,-.9,z);im.rotation.y=P.f;S.add(im);
  IMPS.push({g:im,pd,t:-k*.12,life:9,cd:.4,x,z,ph:Math.random()*6,d})}}
function impTick(dt){for(let i=IMPS.length-1;i>=0;i--){const o=IMPS[i],g=o.g,b=g.userData.body;o.t+=dt;const t=o.t;
 if(t<0)continue;const pa=o.pd.userData.a,pb=o.pd.userData.b;
 if(t<.5){const u=t/.5;pa.material.opacity=.85*u;pb.material.opacity=.7*u;pb.rotation.z+=dt*5;g.position.y=-.9+u*.9;if(Math.random()<.4*Q())fxp({x:o.x,y:.2,z:o.z,c:PU,n:1,sp:.6,sz:.12,life:.4,up:2});if(t+dt>=.5)X.snd('imp',.4);continue}
 if(t<o.life){if(o.pd.visible){pa.material.opacity=Math.max(0,pa.material.opacity-dt*1.5);pb.material.opacity=Math.max(0,pb.material.opacity-dt*1.5);if(pa.material.opacity<=0)o.pd.visible=false}
  const e=X.nearest(g.position.x,g.position.z,14);let tx,tz;if(e){tx=e.x;tz=e.z}else{const a=t*.8+i*1.3;tx=P.x+Math.cos(a)*2;tz=P.z+Math.sin(a)*2}
  const vx=tx-g.position.x,vz=tz-g.position.z,l=Math.hypot(vx,vz);g.rotation.y=Math.atan2(vx,vz);
  if(l>1.1){const st=Math.min(l-1,7.5*dt);g.position.x+=vx/l*st;g.position.z+=vz/l*st;g.position.y=Math.abs(Math.sin((t+o.ph)*12))*.35}else g.position.y=Math.max(0,g.position.y-dt*3);
  b.userData['w-1'].rotation.y=-.6-Math.sin(t*22)*.5;b.userData['w1'].rotation.y=.6+Math.sin(t*22)*.5;b.rotation.x=0;
  o.cd-=dt;if(e&&l<1.6&&o.cd<=0){o.cd=.6;b.rotation.x=.5;hitE(e,o.d*.2,null);X.snd('imp',.25);fxp({x:e.x,y:1,z:e.z,c:Math.random()<.5?PU:0x2a0a3a,n:Math.round(5*Q()),sp:3,sz:.12,life:.3})}
  if(Math.random()<.15*Q())fxp({x:g.position.x,y:.5,z:g.position.z,c:0x1a0a2a,n:1,sp:.3,sz:.18,life:.5,up:1})
 }else{// derretem de volta para a sombra
  if(!o.end){o.end=1;o.pd.visible=true;o.pd.position.set(g.position.x,0,g.position.z)}const u=Math.min(1,(t-o.life)/.6);g.position.y=-u*.9;pa.material.opacity=.85*(1-u*.5);pb.material.opacity=.7*(1-u);pb.rotation.z-=dt*6;
  if(u>=1){X.dispose(g);X.dispose(o.pd);IMPS.splice(i,1)}}}}
// ================= SOMBRA 8: ASAS DA NOITE (voo planado + rajada de penas) =================
function wingMesh(s){const g=new T.Group(),dk=X.darkM(0x0e0718,.95),rim=X.addM(PU,.5);for(let k=0;k<7;k++){const f=new T.Group(),a=new T.Mesh(X.geo('feather'),dk),r=new T.Mesh(X.geo('feather'),rim);r.scale.set(1.15,1.08,1);r.position.z=-.01;f.add(r,a);f.rotation.z=s*(.25+k*.2);f.scale.setScalar(1-k*.06);g.add(f)}g.scale.x=s;return g}
function nWings(d,dx,dz){X.word('NIGHT WINGS!','shd124');X.snd('wing',.8);X.snd('shadow',.5);P.iv=Math.max(P.iv||0,1.2);
 const wings=[-1,1].map(s=>{const w=wingMesh(s);w.position.set(s*.12,1.45,-.18);w.scale.set(0.01,0.01,0.01);pm.add(w);return w});
 const smokes=[];const f0=P.f,ax=Math.sin(f0),az=Math.cos(f0);let dashed=false,shot=false;const feathers=[];const hit=new Set();
 kfx({u:(F,dt)=>{const t=F.t;
  if(t<.4){const u=t/.4;wings.forEach((w,i)=>{const s=i?1:-1;w.scale.set(s*u*1.3,u*1.3,u*1.3);w.rotation.y=s*(.9-u*.6)});if(Math.random()<.8*Q()){const sm=X.smoke(0x0a0512,.6,.7);sm.position.set(P.x+(Math.random()-.5),.3,P.z+(Math.random()-.5));S.add(sm);smokes.push({s:sm,t:0})}}
  else if(!dashed){dashed=true;X.snd('wing',1);P.dt2=.5;P.dv=[ax*30,az*30];kShock(P.x,P.z,2.4,PU,.3,.3)}
  if(t>.4&&t<.95){wings.forEach((w,i)=>{const s=i?1:-1;w.rotation.y=s*(.3+Math.sin(t*16)*.25)});for(const e of enemies){if(e.hp>0&&!hit.has(e)&&Math.hypot(e.x-P.x,e.z-P.z)<1.8){hit.add(e);hitE(e,d*.35,null);X.push(e,e.x-P.x,e.z-P.z,6,.3)}}
   if(Math.random()<.7*Q()){const fe=new T.Mesh(X.geo('feather'),X.darkM(0x120a1e,.9));fe.position.set(P.x+(Math.random()-.5),1+Math.random(),P.z+(Math.random()-.5));fe.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);S.add(fe);smokes.push({s:fe,t:0,fall:1})}}
  if(t>.95&&!shot){shot=true;X.snd('wing',.7);const n=Math.round(8*Math.min(1,Q())+2);for(let k=0;k<n;k++){const a=P.f+(k-(n-1)/2)*.13,fe=new T.Group(),c=new T.Mesh(X.geo('feather'),X.darkM(0x0e0718,.95)),r=new T.Mesh(X.geo('feather'),X.addM(PU,.7));r.scale.set(1.2,1.1,1);fe.add(r,c);fe.scale.setScalar(.8);fe.position.set(P.x,1.4,P.z);fe.rotation.set(Math.PI/2,0,0);fe.rotation.y=a;S.add(fe);feathers.push({m:fe,vx:Math.sin(a)*26,vz:Math.cos(a)*26,l:0,hit:new Set()})}}
  for(const f of feathers){if(f.done)continue;const st=dt;f.m.position.x+=f.vx*st;f.m.position.z+=f.vz*st;f.l+=26*st;const hs=X.hitLine(f.m.position.x-f.vx*st,f.m.position.z-f.vz*st,f.vx/26,f.vz/26,26*st+.4,.45,d*.3,null,f.hit);if(hs.length){fxp({x:f.m.position.x,y:1.3,z:f.m.position.z,c:PU,n:Math.round(5*Q()),sp:3,sz:.1,life:.3})}if(f.l>22){f.done=1;f.m.visible=false}}
  if(t>.95){const u=Math.min(1,(t-.95)/.4);wings.forEach((w,i)=>{const s=i?1:-1,k=1.3*(1-u)+.01;w.scale.set(s*k,k,k)});if(u<1&&Math.random()<.5*Q()){const sm=X.smoke(0x0a0512,.5,.6);sm.position.set(P.x,1.4,P.z);S.add(sm);smokes.push({s:sm,t:0})}}
  for(const o of smokes){o.t+=dt;if(o.fall){o.s.position.y=Math.max(.05,o.s.position.y-dt*1.2);o.s.rotation.z+=dt*3;o.s.material.opacity=Math.max(0,.9-o.t*.8)}else{o.s.position.y+=dt*.9;o.s.scale.setScalar(.6+o.t*1.5);o.s.material.opacity=Math.max(0,.7-o.t*.9)}}
  return t<2},end:()=>{wings.forEach(w=>{if(w.parent)w.parent.remove(w)});smokes.forEach(o=>X.dispose(o.s));feathers.forEach(f=>X.dispose(f.m))}})}
// ---------- formas próprias ----------
{const g=X.geo;const GEO2={slash:()=>{const s=new T.PlaneGeometry(3.2,.18);return s},impb:()=>new T.SphereGeometry(.22,10,8),imph:()=>new T.SphereGeometry(.16,10,8),imphorn:()=>new T.ConeGeometry(.04,.16,5),impw:()=>{const s=new T.Shape();s.moveTo(0,0);s.lineTo(.32,.18);s.lineTo(.26,.02);s.lineTo(.36,-.08);s.lineTo(.2,-.06);s.lineTo(.14,-.16);s.lineTo(0,-.04);return new T.ShapeGeometry(s)},impl:()=>new T.CylinderGeometry(.05,.04,.26,6),impt:()=>new T.ConeGeometry(.035,.4,5),
  swirl:()=>new T.RingGeometry(.55,1,32,1,0,4.8),needle:()=>{const c=new T.ConeGeometry(.06,1.1,4);c.rotateX(Math.PI/2);return c},feather:()=>{const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(.16,.5,0,1.25);s.quadraticCurveTo(-.08,.55,0,0);return new T.ShapeGeometry(s,6)}};
 const G2C={};X.geo=function(k){if(GEO2[k]){if(!G2C[k]){G2C[k]=GEO2[k]();G2C[k]._keep=1}return G2C[k]}return g(k)}}
// ---------- registro ----------
const IC={tneedle:'<circle cx="12" cy="12" r="8" fill="none" stroke="C" stroke-width="1.6"/><path d="M12 12L5 4M12 12l9-2M12 12l-2 9M12 12l7 7" stroke="L" stroke-width="1.6"/><circle cx="12" cy="12" r="1.6" fill="C"/>',
 techo:'<circle cx="7" cy="8" r="2.5" fill="C" opacity=".5"/><circle cx="12" cy="7" r="2.5" fill="C" opacity=".75"/><circle cx="17" cy="8" r="2.5" fill="C"/><path d="M4 20l16-8" stroke="L" stroke-width="2"/>',
 nsimp:'<circle cx="8" cy="14" r="3.2" fill="C"/><circle cx="16" cy="14" r="3.2" fill="C"/><path d="M6 11l-1-3 3 2M10 11l1-3-3 2M14 11l-1-3 3 2M18 11l1-3-3 2" fill="L"/><circle cx="7" cy="14" r=".7" fill="L"/><circle cx="9" cy="14" r=".7" fill="L"/><circle cx="15" cy="14" r=".7" fill="L"/><circle cx="17" cy="14" r=".7" fill="L"/>',
 nswing:'<path d="M12 12C8 4 3 5 2 9c3-1 5 0 6 2-3 0-5 2-5 4 3-2 6-2 9-3zM12 12c4-8 9-7 10-3-3-1-5 0-6 2 3 0 5 2 5 4-3-2-6-2-9-3z" fill="C"/><path d="M12 12v8" stroke="L" stroke-width="1.6"/>'};
// o jogo redefine as listas de Tempo e Sombra depois de carregar: as magias novas entram no fim da lista sempre que faltarem
const ADD={tempo:[[NMT.tneedle,30,60,'tneedle',null,16],[NMT.techo,38,70,'techo',null,26]],sombra:[[NMS.nsimp,26,20,'nsimp',null,22],[NMS.nswing,30,44,'nswing',null,14]]};
function ensureSk(){for(const id in ADD){const g=GR[id];if(!g||!g.s)continue;for(const sk of ADD[id])if(!g.s.some(s=>s&&s[3]==sk[3])&&g.s.length<8){g.s.push(sk);try{if(P.g===g)buildBtns()}catch(e){}}}}ensureSk();X.ensureSk=ensureSk;
{const _c=cast;cast=function(){try{ensureSk()}catch(e){}return _c.apply(this,arguments)}}
{const _r=renderSkills;renderSkills=function(){try{ensureSk()}catch(e){}return _r.apply(this,arguments)}}
X.meta('tempo',[[NMT.tneedle,'raise',IC.tneedle,['l',20,''],'A','tneedle'],[NMT.techo,'kdom',IC.techo,['m',18,''],'A','techo'],[NMS.nsimp,'raise',IC.nsimp,['m',14,''],'A','nsimp'],[NMS.nswing,'dash',IC.nswing,['l',22,''],'A','nswing']]);
X.reg('tneedle',tNeedles);X.reg('techo',tEchoes);X.reg('nsimp',nImps);X.reg('nswing',nWings);
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(IMPS.length)impTick(dt||0);if((ensureSk.k=(ensureSk.k||0)+1)%60==1)ensureSk()}catch(e){try{ERR122(e)}catch(_){}}return r}}
const st=document.createElement('style');st.textContent='body.rew125 canvas{filter:sepia(.55) saturate(.8) hue-rotate(-10deg)}';document.head.appendChild(st);
})();

