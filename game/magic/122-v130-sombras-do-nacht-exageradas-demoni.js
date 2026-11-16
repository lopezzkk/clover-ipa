// ================= V130 · SOMBRAS DO NACHT EXAGERADAS: demônio gigante, demônio morcego, garras e energia sombria =================
// Baseado nos vídeos: grimório escuro soltando fumaça, energia roxa girando no corpo, demônio enorme de braços longos
// que sai do chão e esmaga, demônio morcego que paira sobre a cabeça, mergulha e dispara um raio rosa-roxo, cortes de garra.
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const PU=0x9a40ff,PK=0xff4fd8,DK=0x0b0612,RE=0xff2244;
const isN=()=>!!(P.g&&P.g.id=='sombra'&&P.on);
const GC={};const geo=(k,f)=>{if(!GC[k]){GC[k]=f();GC[k]._keep=1}return GC[k]};
const dkM=(o)=>new T.MeshLambertMaterial({color:0x0d0716,emissive:0x12062a,transparent:o!=null,opacity:o==null?1:o});
// energia roxa espiralando no corpo + fumaça (toda magia de sombra)
function aura(dur){const L=[];const n=Math.round(6*Math.min(1,Q()))+3;for(let k=0;k<n;k++){const s=X.smoke(k%2?0x1a0830:0x05020a,1.4,0);S.add(s);L.push({s,a:k/n*6.28,y:Math.random()*2,sp:2+Math.random()*2})}
 const w=[];for(let k=0;k<3;k++){const g=X.glow(k==1?PK:PU,.35,.9);S.add(g);w.push({g,a:k*2.1})}
 kfx({u:(F,dt)=>{const t=F.t,o=Math.min(1,t*4)*(t>dur-.4?Math.max(0,(dur-t)/.4):1);L.forEach(q=>{q.a+=dt*q.sp*.6;q.y+=dt*.8;if(q.y>2.6)q.y=0;q.s.position.set(P.x+Math.cos(q.a)*.8,(P.y||0)+q.y,P.z+Math.sin(q.a)*.8);q.s.material.opacity=.55*o*(1-q.y/2.6)});
   w.forEach(q=>{q.a+=dt*6;const yy=(P.y||0)+.3+((t*1.5+q.a*.2)%2.2);q.g.position.set(P.x+Math.cos(q.a)*.6,yy,P.z+Math.sin(q.a)*.6);q.g.material.opacity=.9*o;if(Math.random()<.5*Q())fxp({x:q.g.position.x,y:q.g.position.y,z:q.g.position.z,c:PU,n:1,sp:.1,sz:.06,life:.35})});return t<dur},end:()=>{L.forEach(q=>X.dispose(q.s));w.forEach(q=>X.dispose(q.g))}})}
// garras: 3 cortes paralelos
function claws(x,z,ang,col){const L=[];for(let k=-1;k<=1;k++){const m=new T.Mesh(geo('claw',()=>new T.PlaneGeometry(3,.12)),X.addM(k?col||PU:0xffd0ff,.95));m.material.side=T.DoubleSide;m.position.set(x+Math.cos(ang)*k*.35,1.2+k*.15,z-Math.sin(ang)*k*.35);m.rotation.set(0,ang+Math.PI/2,.6);S.add(m);L.push(m)}
 kfx({u:F=>{L.forEach((m,i)=>{m.scale.x=Math.min(1,F.t*8);m.material.opacity=Math.max(0,.95-F.t*2.6)});return F.t<.38},end:()=>L.forEach(X.dispose)})}
// poça roxa grande
function pool(x,z,R,dur){const g=new T.Group();g.position.set(x,.05,z);S.add(g);const a=new T.Mesh(X.geo('disc'),X.darkM(0x05020a,0)),b=new T.Mesh(geo('pring',()=>new T.RingGeometry(.8,1,40)),X.addM(PU,0));a.rotation.x=b.rotation.x=-Math.PI/2;b.position.y=.01;g.add(a,b);g.scale.setScalar(R);
 kfx({u:F=>{const t=F.t,o=Math.min(1,t*4)*(t>dur-.4?Math.max(0,(dur-t)/.4):1);a.material.opacity=.85*o;b.material.opacity=.8*o;b.rotation.z+=.05;return t<dur},end:()=>X.dispose(g)})}
// ---------------- DEMÔNIO GIGANTE (braços longos, chifres, olhos vermelhos) ----------------
function giant(){const g=new T.Group(),m=dkM(),rim=X.addM(PU,.28);
 const torso=new T.Mesh(geo('gt',()=>new T.CylinderGeometry(.9,.55,2.6,8)),m);torso.position.y=3.2;g.add(torso);const tr=new T.Mesh(geo('gt',()=>null)||torso.geometry,rim);tr.position.copy(torso.position);tr.scale.setScalar(1.07);g.add(tr);
 const head=new T.Mesh(geo('gh',()=>new T.SphereGeometry(.62,12,10)),m);head.position.set(0,4.95,.15);head.scale.set(1,1.1,1.05);g.add(head);
 for(const s of[-1,1]){const h=new T.Mesh(geo('ghorn',()=>{const c=new T.ConeGeometry(.16,1.3,6);c.translate(0,.65,0);return c}),m);h.position.set(s*.4,5.3,0);h.rotation.set(-.3,0,-s*.6);g.add(h);const e=X.glow(RE,.55,1);e.position.set(s*.22,5.0,.68);g.add(e);
  const sh=new T.Group();sh.position.set(s*1.05,4.1,0);g.add(sh);const up=new T.Mesh(geo('garm',()=>{const c=new T.CylinderGeometry(.26,.18,2.4,7);c.translate(0,-1.2,0);return c}),m);sh.add(up);const el=new T.Group();el.position.y=-2.4;sh.add(el);const lo=new T.Mesh(geo('garm',()=>null)||up.geometry,m);el.add(lo);
  for(let k=-1;k<=1;k++){const c=new T.Mesh(geo('gclaw',()=>{const c=new T.ConeGeometry(.07,.7,5);c.translate(0,-.35,0);return c}),m);c.position.set(k*.12,-2.4,.1);c.rotation.x=.3;el.add(c)}
  g.userData['sh'+s]=sh;g.userData['el'+s]=el}
 const lg=new T.Mesh(geo('gleg',()=>new T.CylinderGeometry(.6,.25,2.2,7)),m);lg.position.y=1;g.add(lg);
 g.traverse(o=>{if(o.isMesh)o.frustumCulled=false});return g}
function giantSlam(d,dx,dz){X.word('SHADOW DEMON: COLOSSUS!','shd124');X.snd('shadow',1);const bx=P.x-dx*2.2,bz=P.z-dz*2.2,ang=Math.atan2(dx,dz);pool(bx,bz,3.2,2.6);const g=giant();g.scale.setScalar(1.45);g.position.set(bx,-6,bz);g.rotation.y=ang;S.add(g);
 const tx=P.x+dx*5,tz=P.z+dz*5;
 kfx({u:(F,dt)=>{const t=F.t;g.position.y=t<.6?-6+6*(t/.6):t>2.1?-6*Math.min(1,(t-2.1)/.5):0;
   for(const s of[-1,1]){const sh=g.userData['sh'+s],el=g.userData['el'+s];if(!sh)continue;const raise=t<1?Math.min(1,Math.max(0,(t-.4)/.5)):Math.max(0,1-(t-1)/.15);sh.rotation.x=-raise*2.6+(t>1.05&&t<2?-.9:0);sh.rotation.z=s*(.25+raise*.3);el.rotation.x=-raise*.6}
   if(t>1.1&&!F.s){F.s=1;X.snd('boom',1);X.snd('thunder',.5);P.shake=Math.max(P.shake||0,.8);X.flash('#1a0026',.55,.25);kShock(tx,tz,7,PU,.5,.2);kShock(tx,tz,4,PK,.4,.4);for(let k=0;k<Math.round(30*Q());k++)fxp({x:tx+(Math.random()-.5)*5,y:.3,z:tz+(Math.random()-.5)*5,c:k%3?PU:DK,n:1,sp:6,sz:.18,life:.6,up:5});
    X.hitArea(tx,tz,5.5,d*.6,{b:1}).forEach(e=>{X.stun(e,1.2);X.push(e,e.x-tx,e.z-tz,12,.4)});
    const cr=new T.Group();for(let k=0;k<7;k++){const c=new T.Mesh(X.geo('crack'),X.addM(PU,.9));c.rotation.set(-Math.PI/2,0,k/7*6.28);c.scale.setScalar(1.4+Math.random());cr.add(c)}cr.position.set(tx,.06,tz);S.add(cr);kfx({u:G=>{cr.children.forEach(c=>c.material.opacity=Math.max(0,.9-G.t*.7));return G.t<1.3},end:()=>X.dispose(cr)})}
   return t<2.6},end:()=>X.dispose(g)})}
// ---------------- DEMÔNIO MORCEGO (paira, mergulha, raio rosa-roxo) ----------------
function bat(){const g=new T.Group(),m=dkM();const b=new T.Mesh(geo('bb',()=>new T.SphereGeometry(.45,12,10)),m);b.scale.set(1,1.15,.9);g.add(b);const r=new T.Mesh(b.geometry,X.addM(PU,.3));r.scale.set(1.12,1.28,1);g.add(r);
 for(const s of[-1,1]){const e=X.glow(RE,.3,1);e.position.set(s*.16,.15,.4);g.add(e);const ear=new T.Mesh(geo('bear',()=>new T.ConeGeometry(.1,.4,5)),m);ear.position.set(s*.25,.55,0);ear.rotation.z=-s*.4;g.add(ear);
  const w=new T.Mesh(geo('bw',()=>{const sh=new T.Shape();sh.moveTo(0,0);sh.lineTo(1.6,.7);sh.lineTo(1.3,.15);sh.lineTo(1.9,-.2);sh.lineTo(1.1,-.3);sh.lineTo(1.2,-.75);sh.lineTo(.5,-.35);sh.lineTo(.1,-.45);return new T.ShapeGeometry(sh)}),X.darkM(0x1c0b30,.92));w.position.set(s*.35,.15,-.05);w.scale.x=s;g.add(w);g.userData['w'+s]=w}
 g.traverse(o=>{if(o.isMesh)o.frustumCulled=false});return g}
function batDive(d,dx,dz){X.word('SHADOW DEMON: NIGHT BAT!','shd124');X.snd('wing',.8);X.snd('shadow',.6);const g=bat();g.scale.setScalar(1.6);S.add(g);const tg=chronoTarget(18),tx=tg?tg.x:P.x+dx*9,tz=tg?tg.z:P.z+dz*9;let beam=null;
 kfx({u:(F,dt)=>{const t=F.t,fl=Math.sin(t*16)*.6;['w-1','w1'].forEach((k,i)=>{const w=g.userData[k];if(w)w.rotation.y=(i?1:-1)*fl});
   if(t<.7){g.position.set(P.x,(P.y||0)+3.3+Math.sin(t*5)*.15,P.z);g.rotation.y=P.f}
   else if(t<1.1){const u=(t-.7)/.4;g.position.set(P.x+(tx-P.x)*u,3.3-2.1*Math.sin(u*Math.PI*.5),P.z+(tz-P.z)*u);g.lookAt(tx,1,tz)}
   else if(!F.b){F.b=1;X.snd('boom',.6);kShock(tx,tz,3.5,PU,.35,.2);X.hitArea(tx,tz,3,d*.4,{}).forEach(e=>X.stun(e,.6));claws(tx,tz,Math.atan2(dx,dz),PK)}
   else if(t<1.6){g.position.y+=dt*4}
   else if(t<2.4){if(!beam){beam=new T.Group();const o=new T.Mesh(X.geo('beam'),X.addM(PK,.75)),i2=new T.Mesh(X.geo('beam'),X.addM(0xffffff,.9));i2.scale.set(.35,1,.35);beam.add(o,i2);S.add(beam);X.snd('black',.7);F.hit=new Set()}
    const A=g.position.clone(),B=new T.Vector3(P.x+(tx-P.x)*1.6,0,P.z+(tz-P.z)*1.6),L=A.distanceTo(B);beam.position.copy(A).lerp(B,.5);beam.lookAt(B);beam.rotateX(Math.PI/2);beam.scale.set(.7+Math.sin(t*40)*.08,L,.7);beam.children.forEach(c=>c.material.opacity=(c.scale.x<1?.9:.75)*Math.min(1,(2.4-t)*3));
    if(Math.random()<.6*Q())fxp({x:B.x,y:.3,z:B.z,c:Math.random()<.5?PK:PU,n:2,sp:4,sz:.14,life:.4,up:3});
    if(!F.k||t-F.k>.2){F.k=t;const dx2=B.x-A.x,dz2=B.z-A.z,l=Math.hypot(dx2,dz2)||1;X.hitLine(A.x,A.z,dx2/l,dz2/l,l,1,d*.12,{})}}
   else{g.position.y+=dt*6;g.traverse(o=>{if(o.material&&o.material.opacity!=null){o.material.transparent=true;o.material.opacity=Math.max(0,o.material.opacity-dt*3)}});if(beam){X.dispose(beam);beam=null}}
   return t<2.8},end:()=>{X.dispose(g);if(beam)X.dispose(beam)}})}
// ---------------- assassino sombrio: rastro + garras ----------------
function assassin(d,dx,dz){for(let k=0;k<5;k++)setTimeout(()=>{try{const g=X.ghostCopy(0x1a0830,.6,true);S.add(g);kfx({u:F=>{g.userData.m.opacity=.6*Math.max(0,1-F.t/.5);return F.t<.5},end:()=>X.dispose(g)})}catch(e){}},k*60);
 setTimeout(()=>{const tg=X.nearest(P.x,P.z,4);const x=tg?tg.x:P.x+Math.sin(P.f)*1.5,z=tg?tg.z:P.z+Math.cos(P.f)*1.5;claws(x,z,P.f,PU);if(tg)hitE(tg,d*.3,{});X.snd('shadow',.5)},300)}
const OV={nsdom:giantSlam,nsdev:batDive,nassa:assassin,
 k82_12:(d)=>{pool(P.x,P.z,2.4,1.2);kShock(P.x,P.z,4,PU,.4,.2)},
 k82_13:(d,dx,dz)=>{const x=P.x+dx*6,z=P.z+dz*6;pool(x,z,4,2);setTimeout(()=>{kShock(x,z,5,PK,.4,.2);X.flash('#14001f',.4,.2)},600)},
 k82_14:()=>{X.flash('#14001f',.5,.3);kShock(P.x,P.z,6,PU,.5,.3)},
 nsimp:()=>{},nswing:()=>{}};
X.OV130=OV;
{const _xc=xCast;xCast=function(t,d,dx,dz){const r=_xc.apply(this,arguments);try{if(isN()&&OV[t]){aura(1.6);OV[t](d,dx,dz);P.shake=Math.max(P.shake||0,.15)}}catch(e){try{ERR122(e)}catch(_){}}return r}}
})();

