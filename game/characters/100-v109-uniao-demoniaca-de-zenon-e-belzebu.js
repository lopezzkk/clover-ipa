// ================= V109 · UNIÃO DEMONÍACA DE ZENON E BELZEBU =================
// Estados separados: magia original (Ossos) · magia demoníaca (Espacial, pelo ALTERAR MAGIA) · Manifestação do poder demoníaco (estágio 1)
// · Forma demoníaca (estágio 2, com transformação em 7 fases) · União de Magias (habilidades combinadas, só na forma demoníaca).
// Botão Fundir (U): desligado → Manifestação → Forma Demoníaca → encerra. Visual original do Clover RPG.
{
const rnd=(a,b)=>a+Math.random()*(b-a),Q=()=>KQ(),ww=(w,c)=>{try{xWord(w,c)}catch(e){}},snd=k=>{try{xSnd(k)}catch(e){}};
const O=window.O107,B8=window.BZ108,SV=0x7a4aff,SC=0x5ad8ff,BLK=0x07060c,RED=0xff3050;
const dkM=c=>new T.MeshToonMaterial({color:c||0x0a0812,gradientMap:gmap});const glM=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?.8:o,blending:T.AdditiveBlending,depthWrite:false});
const ZB={st:0,busy:false,prevG:null,F1:null,F2:null,t:0};window.ZB109=ZB;
// ---------- ESTÁGIO 1 · MANIFESTAÇÃO DO PODER DEMONÍACO: chifres, asas demoníacas articuladas, marcas no rosto, olhos e energia escura
function zbStage1(L){L=L||PP;const g=new T.Group(),parts=[],tor=L.tspace||L.root;let hd=L.hs||null;const extra=[];if(!hd){hd=new T.Group();hd.position.set(0,1.95,0);L.root.add(hd);extra.push(hd)}
 const add=(m,par,x,y,z)=>{m.position.set(x,y,z);par.add(m);parts.push(m);return m};const hornM=dkM(0x120a1a),bone=O.oMat('ivory');
 // chifres: um par grande curvado para trás e um par pequeno de osso
 for(const s of[-1,1]){const h=add(new T.Mesh(O.gHorn(s>0?0:1),hornM),hd,s*.12,.2,-.02);h.rotation.set(-.9,0,s*.6);h.scale.set(.42,.6,.42);const h2=add(new T.Mesh(O.gHorn(2),bone),hd,s*.17,.1,.03);h2.rotation.set(-.4,0,s*1.15);h2.scale.set(.18,.24,.18)}
 // marcas faciais (riscos escuros sob os olhos e na testa)
 const mk=new T.MeshBasicMaterial({color:0x1a0a2a,side:T.DoubleSide});for(const s of[-1,1]){for(let k=0;k<2;k++){const p=add(new T.Mesh(new T.PlaneGeometry(.02,.12-k*.03),mk),hd,s*(.08+k*.04),-.05,.245);p.rotation.z=s*(.25+k*.2)}}const fm=add(new T.Mesh(new T.PlaneGeometry(.02,.09),mk),hd,0,.12,.25);
 // asas demoníacas: braço → antebraço → 4 dedos com membrana escura (articuladas)
 const W=[];for(const s of[-1,1]){const w=new T.Group();add(w,tor,s*.14,1.55,-.24);const a1=new T.Mesh(O.gLong(0),hornM);a1.scale.set(1.6,1.0,1.6);a1.rotation.z=-s*Math.PI/2;a1.position.x=s*.5;w.add(a1);const el=new T.Group();el.position.x=s*1.0;w.add(el);const a2=new T.Mesh(O.gLong(1),hornM);a2.scale.set(1.3,.9,1.3);a2.rotation.z=-s*Math.PI/2;a2.position.x=s*.45;el.add(a2);
  const tip=new T.Group();tip.position.x=s*.9;el.add(tip);const fing=[];for(let k=0;k<4;k++){const fg=new T.Group();fg.rotation.z=-s*(.3+k*.42);const f=new T.Mesh(O.gLong(k),hornM);f.scale.set(.9,1.25-k*.18,.9);f.rotation.z=-s*Math.PI/2;f.position.x=s*(.62-k*.08);fg.add(f);const c=new T.Mesh(O.gClaw(),bone);c.scale.setScalar(.3);c.position.x=s*(1.25-k*.16);c.rotation.z=-s*Math.PI/2;fg.add(c);tip.add(fg);fing.push(fg)}
  const mg=new T.BufferGeometry();mg.setAttribute('position',new T.Float32BufferAttribute(new Array(54).fill(0),3));const mem=new T.Mesh(mg,new T.MeshBasicMaterial({color:0x1a0c2e,transparent:true,opacity:.78,side:T.DoubleSide,depthWrite:false}));w.add(mem);W.push({w,el,tip,fing,s,mem})}
 const memUp=Wg=>{Wg.w.updateMatrixWorld(true);const inv=new T.Matrix4().copy(Wg.w.matrixWorld).invert(),v=p=>p.applyMatrix4(inv);const el=v(Wg.el.getWorldPosition(new T.Vector3())),tp=v(Wg.tip.getWorldPosition(new T.Vector3()));const tips=Wg.fing.map((f,k)=>v(f.localToWorld(new T.Vector3(Wg.s*(1.25-k*.16),0,0))));const o=new T.Vector3(0,0,0),r=new T.Vector3(0,-.5,0);
  const a=[];const P3=(p,q,w)=>a.push(p.x,p.y,p.z,q.x,q.y,q.z,w.x,w.y,w.z);P3(o,el,tips[0]);P3(tp,tips[0],tips[1]);P3(tp,tips[1],tips[2]);P3(tp,tips[2],tips[3]);P3(o,tp,tips[3]);P3(o,tips[3],r);Wg.mem.geometry.attributes.position.array.set(a);Wg.mem.geometry.attributes.position.needsUpdate=true;Wg.mem.geometry.computeBoundingSphere()};
 // energia escura em volta
 const au=new T.Mesh(new T.SphereGeometry(1.1,14,10),glM(0x2a1050,.12));au.position.y=1.15;au.scale.y=1.35;g.add(au);
 const F={g,parts,W,big:1,anim(t,mv){au.material.opacity=.1+Math.sin(t*3)*.04;W.forEach(Wg=>{const fl=(mv?.35:.12)*Math.sin(t*(mv?5:2));Wg.w.rotation.set(-.35,Wg.s*(.5-F.big*.15),Wg.s*(.15+fl));Wg.el.rotation.z=Wg.s*(-.35+fl*.6);Wg.fing.forEach((f,k)=>f.rotation.y=Wg.s*fl*.2);Wg.w.scale.setScalar(F.big);memUp(Wg)})},
  detach(){parts.forEach(p=>{if(p.parent)p.parent.remove(p)});extra.forEach(p=>{if(p.parent)p.parent.remove(p)});if(g.parent)g.parent.remove(g)}};return F}
// ---------- ESTÁGIO 2 · FORMA DEMONÍACA: armadura óssea integrada (peito, costas, ombros, braços, pernas, cabeça) e cauda articulada com ponta de tridente
function zbStage2(L){L=L||PP;const parts=[],tor=L.tspace||L.root,hd=L.hs||L.root,bone=O.oMat('ivory'),old=O.oMat('old'),dk=dkM(0x120a1a),glow=glM(SV,.85);let dl=0;
 const add=(geo,m,par,x,y,z,rx,ry,rz,s,d)=>{const p=O.oPiece(geo,m,{d:d==null?(dl+=.035):d,dur:.25,ax:'all'});p.position.set(x,y,z);p.rotation.set(rx||0,ry||0,rz||0);if(s)(Array.isArray(s)?p.scale.set(...s):p.scale.setScalar(s));p.userData.f.s0=p.scale.clone();p.visible=false;par.add(p);parts.push(p);return p};
 // peito: caixa torácica + esterno + linha de energia
 add(O.gLong(1),bone,tor,0,1.33,.29,0,0,0,[1.6,.5,1.25]);for(let k=0;k<5;k++)add(window.O107.gCage?O107.gCage(k%3):O.gRib(k%3),k%2?bone:old,tor,0,1.57-k*.1,.02,0,.3927,0,[1.15-k*.04,1,1]);
 // costas: vértebras e apêndices ósseos (espinhos longos em leque)
 for(let k=0;k<6;k++)add(O.gVert(),old,tor,0,1.7-k*.14,-.37,-Math.PI/2+.2,0,0,.38);for(const s of[-1,1])for(let k=0;k<3;k++)add(O.gHorn(k),k%2?old:bone,tor,s*(.12+k*.07),1.62-k*.17,-.4,-1.1+k*.15,0,s*(.45+k*.3),[.5-k*.08,.85-k*.15,.5-k*.08]);
 // ombros (3 placas em camada + espinho), antebraços (placa + lâmina), mãos (garras)
 (L.arms||[]).forEach((a,i)=>{const s=i?1:-1;for(let k=0;k<3;k++)add(O.gPlate(),k%2?old:bone,a[0],0,.02-k*.09,0,0,s>0?Math.PI:0,0,[1.15-k*.15,.7,1.15-k*.15]);add(O.gHorn(i),dk,a[0],s*.04,.1,-.02,-.3,0,s*-1.0,[.42,.6,.42]);
  if(a[1]){add(O.gPlate(),bone,a[1],0,-.15,0,0,s>0?Math.PI:0,0,[.8,.95,.8]);add(O.gHorn(i+1),old,a[1],0,-.06,-.08,2.5,0,0,[.38,.55,.38]);for(let k=0;k<4;k++)add(O.gClaw(),bone,a[1],(k-1.5)*.026,-.34,.04,.5,0,0,.36)}});
 // pernas (coxa, joelho pontudo, canela, pé)
 (L.legs||[]).forEach((l,i)=>{add(O.gPlate(),old,l[0],0,-.18,0,0,Math.PI,0,[1,1.15,1]);if(l[1]){add(O.gPlate(),bone,l[1],0,-.2,0,0,Math.PI,0,[.85,1.15,.85]);add(O.gHorn(i),bone,l[1],0,.03,.09,1.2,0,0,[.4,.5,.4]);add(O.gClaw(),bone,l[1],0,-.42,.12,1.5,0,0,.4)}});
 // cabeça: máscara óssea na testa, maçãs do rosto e chifres extras
 add(O.gPlate(),bone,hd,0,.14,.06,-.25,0,0,[1.15,.45,1.2]);for(const s of[-1,1]){add(O.gHorn(2),old,hd,s*.13,-.02,.15,.2,0,s*1.4,[.16,.2,.16]);add(O.gHorn(s>0?1:0),dk,hd,s*.09,.27,-.04,-1.3,0,s*.35,[.3,.45,.3])}
 // olhos/linhas de energia espacial
 for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.03,8,6),glow);e.position.set(s*.08,.03,.235);e.visible=false;hd.add(e);parts.push(e);e.userData.f={d:1.0,dur:.2,ax:'all',s0:e.scale.clone()}}
 // cauda: 9 articulações saindo da base da coluna, ponta em tridente
 const tail=[];let par=new T.Group();par.position.set(0,.98,-.22);tor.add(par);parts.push(par);par.userData.f={d:0,dur:.01,ax:'all',s0:par.scale.clone()};const root=par;
 for(let k=0;k<9;k++){const j=new T.Group();j.position.z=k?-.2:0;par.add(j);const v=O.oPiece(O.gVert(),k%2?bone:old,{d:1.2+k*.05,dur:.2,ax:'all'});v.rotation.x=-Math.PI/2;v.scale.setScalar(.32-k*.02);v.userData.f.s0=v.scale.clone();v.visible=false;j.add(v);parts.push(v);tail.push(j);par=j}
 const tri=new T.Group();tri.position.z=-.2;par.add(tri);for(let k=-1;k<=1;k++){const p=O.oPiece(O.gHorn(k+1),bone,{d:1.75,dur:.2,ax:'all'});p.rotation.set(-Math.PI/2,0,k*.45);p.scale.set(.22,k?.38:.5,.22);p.userData.f.s0=p.scale.clone();p.visible=false;tri.add(p);parts.push(p)}{const gl=new T.Mesh(new T.SphereGeometry(.07,8,6),glow);gl.position.z=-.05;tri.add(gl);parts.push(gl)}
 let lastF=P.f;
 return{parts,tail,root,form(t){parts.forEach(p=>{const f=p.userData.f;if(!f)return;const u=Math.max(0,Math.min(1,(t-f.d)/f.dur)),e=u<1?1-Math.pow(1-u,3):1;p.visible=u>0;p.scale.set(f.s0.x*Math.max(.001,e),f.s0.y*Math.max(.001,e),f.s0.z*Math.max(.001,e))})},
  anim(t,mv,turn){tail.forEach((j,k)=>{j.rotation.y=Math.sin(t*2.2-k*.55)*(.12+k*.02)-turn*.25;j.rotation.x=(k==0?.55:-.08)+Math.sin(t*1.6-k*.4)*.05+(mv?-.04:0)})},
  crumble(t){parts.forEach(p=>{if(!p.userData.f)return;p.scale.multiplyScalar(.9);p.position.y-=.003})},
  detach(){parts.forEach(p=>{if(p.parent)p.parent.remove(p)});if(root.parent)root.parent.remove(root)}}}
// estágio 1 substitui a forma antiga do Belzebu (os ossos da União de antes viram a armadura da forma demoníaca)
bz106Form=function(L){return zbStage1(L)};
// ---------- GRIMÓRIO DA UNIÃO DE MAGIAS (só na forma demoníaca)
const N9={zbman:'Union: Bone Spatial Manifestation',zbprison:'Union: Spatial Bone Prison',zbrift:'Union: Demon Spatial Rift',zbdom:'Union: Bone Dominion',zbdomain:'Union: Demonic Spatial Domain',zbsword:'Demon Sword: Dainsleif'};window.N109=N9;
// espada demoníaca (desenho próprio): lâmina longa e serrilhada preta com espinha de vértebras, fio violeta, guarda de chifres, empunhadura de vértebras
function dainsleif(){const g=new T.Group(),blk=dkM(0x0a0812),bone=O.oMat('ivory'),old=O.oMat('old'),edge=glM(SV,.9);const L=2.1;
 const sh=new T.Shape();sh.moveTo(-.07,0);for(let i=0;i<=10;i++){const y=i/10*L;sh.lineTo(-.075+(i%2?.02:0)-(i>8?(i-8)*.03:0),y)}sh.lineTo(0,L+.25);for(let i=10;i>=0;i--){const y=i/10*L;sh.lineTo(.095-(i%2?.025:0)-(i>8?(i-8)*.035:0),y)}sh.lineTo(-.07,0);
 const bl=new T.Mesh(new T.ExtrudeGeometry(sh,{depth:.035,bevelEnabled:true,bevelThickness:.012,bevelSize:.012,bevelSegments:1}),blk);bl.position.z=-.0175;g.add(bl);
 const ed=new T.Mesh(new T.ShapeGeometry(sh),edge);ed.scale.set(1.15,1.02,1);ed.position.z=-.03;g.add(ed);
 for(let k=0;k<7;k++){const v=new T.Mesh(O.gVert(),k%2?bone:old);v.scale.setScalar(.09);v.position.set(0,.18+k*.27,.03);g.add(v)}
 for(const s of[-1,1]){const h=new T.Mesh(O.gHorn(s>0?0:1),bone);h.position.set(s*.08,-.02,0);h.rotation.z=-s*1.6;h.scale.set(.25,.4,.25);g.add(h)}
 for(let k=0;k<4;k++){const v=new T.Mesh(O.gVert(),old);v.scale.setScalar(.08);v.position.y=-.08-k*.07;g.add(v)}const pm2=new T.Mesh(new T.SphereGeometry(.05,8,6),edge);pm2.position.y=-.38;g.add(pm2);return g}
function zbMan(d){ww('BONE SPATIAL MANIFESTATION!','space');startPose('ob_dom');snd('soportal');const P0={x:P.x,z:P.z},ps=[];for(let k=0;k<5;k++){const a=P.f+(k-2)*.45,p=B8.spPortal(.8);p.position.set(P.x+Math.sin(a)*2.2,2.4+(k%2)*.6,P.z+Math.cos(a)*2.2);p.rotation.y=a;p.scale.setScalar(.01);S.add(p);ps.push({p,a,fired:0})}
 kfx({u:(q,dt)=>{const t=q.t;ps.forEach((o,i)=>{o.p.userData.tick(t);o.p.scale.setScalar(Math.max(.01,t<.3?t/.3:t>1.6?Math.max(0,(2-t)/.4):1));if(!o.fired&&t>.45+i*.12){o.fired=1;snd('naslam');const s=new T.Group(),m=new T.Mesh(O.gSpear(),O.oMat('ivory'));m.scale.set(1.5,1.5,1.4);s.add(m);let e=window.H93.near(P.x,P.z,28),ax=Math.sin(o.a),az=Math.cos(o.a);if(e){const L=Math.hypot(e.x-o.p.position.x,e.z-o.p.position.z)||1;ax=(e.x-o.p.position.x)/L;az=(e.z-o.p.position.z)/L}
   window.H93.wave(s,o.p.position.x,o.p.position.y-.6,o.p.position.z,ax,az,48,30,1.2,d*1.4,{sl:1},{tick:mm=>{if(Math.random()<.6*Q())fxp({x:mm.position.x,y:mm.position.y,z:mm.position.z,c:SV,n:1,sp:.4,sz:.12,life:.3})}})}});return t<2},end:()=>ps.forEach(o=>kDispose(o.p))})}
function zbPrison(d,dx,dz){ww('SPATIAL BONE PRISON!','space');startPose('ob_prison');snd('eswarp');try{C94.oprison(d*.6,dx,dz)}catch(e){}let tg=null;try{tg=chronoTarget(20)}catch(e){}const cx=tg?tg.x:P.x+dx*9,cz=tg?tg.z:P.z+dz*9,w=B8.spWarp(2.6);w.position.set(cx,1.6,cz);S.add(w);
 kfx({u:(q,dt)=>{const t=q.t;w.userData.tick(t*2);w.material.opacity=.25*Math.min(1,t*2);w.scale.setScalar(1-Math.max(0,t-1.2)*.5);if(t>2.4&&!q.b){q.b=1;snd('escollapse');window.H93.hitR(cx,cz,2.8,d*1.6,{st:1});kShock(cx,cz,3,SV,.4,1.6)}return t<2.8},end:()=>kDispose(w)})}
function zbRift(d,dx,dz){ww('DEMON SPATIAL RIFT!','space');startPose('ob_spear');snd('esrift');const f=Math.atan2(dx,dz),rf=B8.spRift(6,1.6);rf.position.set(P.x+dx*4,3,P.z+dz*4);rf.rotation.y=f;rf.scale.x=.01;try{rf.userData.parts.ed.material.color.setHex(RED)}catch(e){}S.add(rf);
 const teeth=[];for(let k=0;k<10;k++){const h=new T.Mesh(O.gHorn(k%3),O.oMat('ivory'));const s=k%2?1:-1;h.position.set(s*.6,(k/9-.5)*5,.05);h.rotation.z=s*Math.PI/2;h.scale.set(.25,.6,.25);rf.add(h);teeth.push(h)}const hit=new Set();
 kfx({u:(q,dt)=>{const t=q.t,o=t<.3?t/.3:t<1.6?1:Math.max(.01,1-(t-1.6)/.3);rf.scale.x=Math.max(.01,o);teeth.forEach((h,i)=>h.position.x=(i%2?1:-1)*(.6+Math.sin(t*12+i)*.08)*o);
  if(t>.35&&t<1.5){const L=(t-.35)*16;window.H93.hitR(P.x+dx*(4+L),P.z+dz*(4+L),2.6,d*1.2,{st:.3},hit);if(Math.random()<Q())fxp({x:P.x+dx*(4+L),y:1.5,z:P.z+dz*(4+L),c:Math.random()<.5?RED:SV,n:2,sp:2,sz:.14,life:.4})}return t<1.95},end:()=>kDispose(rf)})}
function zbDom(d){ww('BONE DOMINION!','shadow');startPose('ob_spike');snd('naslam');const cx=P.x,cz=P.z,G=[],mat=O.oMatF('ivory');for(let w=0;w<4;w++)tmr.push({t:.25+w*.28,f:()=>{const R=2.5+w*2.6,n=8+w*5;snd('naslam');for(let k=0;k<n;k++){const a=k/n*6.283+w,g=new T.Group();g.position.set(cx+Math.cos(a)*R,0,cz+Math.sin(a)*R);const s=O.oPiece(O.gHorn(k),k%2?mat:O.oMat('old'),{d:0,dur:.15});s.scale.setScalar(1.6+w*.35);s.userData.f.s0=s.scale.clone();s.rotation.set(Math.sin(a)*.35,0,-Math.cos(a)*.35);g.add(s);S.add(g);G.push({g,t0:performance.now()})}window.H93.hitR(cx,cz,R+1,d*.7,{st:.4});kShock(cx,cz,R,SV,.3,.2)}});
 kfx({u:(q,dt)=>{G.forEach(o=>{const a=(performance.now()-o.t0)/1000;if(a<.3)O.oForm(o.g,a,mat);else if(a>1.6)O.oCrumble(o.g,a-1.6)});return q.t<3.4},end:()=>G.forEach(o=>kDispose(o.g))})}
function zbDomain(d){ww('DEMONIC SPATIAL DOMAIN!','space');startPose('ob_dom');snd('eshum');try{C94.bzdom(d*.8)}catch(e){}const cx=P.x,cz=P.z,g=new T.Group();g.position.set(cx,0,cz);S.add(g);const mat=O.oMatF('ivory');
 for(let k=0;k<8;k++){const a=k/8*6.283,lb=O.oPiece(O.gLong(k),k%2?mat:O.oMat('old'),{d:.2+k*.06,dur:.4});lb.scale.set(4,5,4);lb.userData.f.s0=lb.scale.clone();lb.position.set(Math.cos(a)*9,2.5,Math.sin(a)*9);g.add(lb);const v=O.oPiece(O.gVert(),mat,{d:.6+k*.05,dur:.3,ax:'all'});v.position.set(Math.cos(a+.4)*5,3.5,Math.sin(a+.4)*5);g.add(v)}
 kfx({u:(q,dt)=>{const t=q.t;O.oForm(g,t,mat);g.children.forEach((c,i)=>{if(i%2)c.position.y=3.5+Math.sin(t*2+i)*.4;c.rotation.y+=dt*(i%2?1:0)});P.mp=Math.min(P.mmp,P.mp+dt*4);if(t>5.6)O.oCrumble(g,t-5.6);return t<6.3},end:()=>kDispose(g)})}
function zbSword(d,dx,dz){ww('DAINSLEIF!','space');snd('esrift');const sw=dainsleif(),rf=B8.spRift(2.6,.5);const hand=PP.arms[1][1];rf.position.set(P.x+Math.sin(P.f+1.2)*.8,2.2,P.z+Math.cos(P.f+1.2)*.8);rf.rotation.y=P.f;rf.scale.x=.01;S.add(rf);S.add(sw);sw.scale.setScalar(.01);let inHand=false;
 kfx({u:(q,dt)=>{const t=q.t;rf.scale.x=Math.max(.01,t<.25?t/.25:t<.7?1:Math.max(.01,1-(t-.7)/.25));
  if(t<.7){const u=t/.7;sw.position.set(rf.position.x,rf.position.y-1.4+u*1.2,rf.position.z);sw.rotation.set(0,P.f,0);sw.scale.setScalar(Math.max(.01,u))}
  else if(!inHand){inHand=true;S.remove(sw);sw.position.set(0,-.33,.02);sw.rotation.set(Math.PI/2,0,0);sw.scale.setScalar(.9);hand.add(sw);snd('nawhoosh')}
  if(inHand){const k=Math.floor((t-.75)/.38);if(k>=0&&k<3&&q.k!==k){q.k=k;startPose(k==1?'throw':'ob_spear');snd('naslam');const g=new T.Group(),c=window.H93.crescent(2.4,.45,SV,0xffffff,Math.PI*1.1);c.rotation.x=-Math.PI/2*(k==1?0:1);c.rotation.z=k==2?.8:0;g.add(c);window.H93.wave(g,P.x,1.3,P.z,Math.sin(P.f),Math.cos(P.f),34,22,2.2,d*1.6,{st:.3},{cut:1})}
   if(t>2.1){const u=Math.min(1,(t-2.1)/.4);sw.scale.setScalar(.9*(1-u)+.001);if(Math.random()<.7*Q())fxp({x:P.x,y:1.4,z:P.z,c:SV,n:2,sp:1,sz:.12,life:.4})}}return t<2.6},end:()=>{if(sw.parent)sw.parent.remove(sw);kDispose(rf)}})}
Object.assign(window.C94,{zbman:zbMan,zbprison:zbPrison,zbrift:zbRift,zbdom:d=>zbDom(d),zbdomain:d=>zbDomain(d),zbsword:zbSword});try{XT.push(...Object.keys(N9))}catch(e){}
GR.zbunion={n:'União de Magias',l:5,c:0x1a0c2e,id:'zbunion',dem:'belzebu',s:[[N9.zbman,24,40,'zbman',null,8],[N9.zbprison,30,50,'zbprison',null,14],[N9.zbrift,26,60,'zbrift',null,10],[N9.zbdom,40,45,'zbdom',null,18],[N9.zbdomain,50,30,'zbdomain',null,35],[N9.zbsword,30,70,'zbsword',null,12]],p:{t:'Ossos + Espaço: só na Forma Demoníaca com Belzebu',dmg:.15}};
try{if(typeof MCF!='undefined')MCF.zbunion=.86}catch(e){}try{ELP.zbunion=[SV,0xeae2cc,0,1]}catch(e){}
Object.assign(ANI,{[N9.zbman]:'ob_dom',[N9.zbprison]:'ob_prison',[N9.zbrift]:'ob_spear',[N9.zbdom]:'ob_spike',[N9.zbdomain]:'ob_dom',[N9.zbsword]:'ob_spear'});
Object.assign(RNG,{zbman:['l',28],zbprison:['m',20,'prisão'],zbrift:['l',26],zbdom:['c',12,'área'],zbdomain:['c',11,'área'],zbsword:['m',22,'espada']});
Object.assign(SKI,{[N9.zbman]:'<circle cx="6" cy="8" r="3" fill="none" stroke="L" stroke-width="1.6"/><circle cx="18" cy="8" r="3" fill="none" stroke="L" stroke-width="1.6"/><path d="M6 11l4 10M18 11l-4 10" stroke="C" stroke-width="2.4"/>',
 [N9.zbprison]:'<circle cx="12" cy="12" r="9" fill="none" stroke="L" stroke-width="1.4" stroke-dasharray="2 2"/><path d="M7 5v14M12 3v18M17 5v14" stroke="C" stroke-width="1.8"/>',
 [N9.zbrift]:'<path d="M12 2c4 5-3 7 1 10s-3 6 0 10c-5-3-1-6-3-10s4-6 2-10z" fill="C"/><path d="M8 6l-3 1M16 9l3-1M8 14l-3 1M16 17l3-1" stroke="L" stroke-width="1.6"/>',
 [N9.zbdom]:'<path d="M2 20l3-9 3 9M8 20l4-14 4 14M16 20l3-9 3 9" fill="C"/><circle cx="12" cy="12" r="10" fill="none" stroke="L" stroke-width="1"/>',
 [N9.zbdomain]:'<circle cx="12" cy="12" r="10" fill="L"/><path d="M5 20V9M12 21V6M19 20V9" stroke="C" stroke-width="2.4"/>',
 [N9.zbsword]:'<path d="M5 19L18 4l1 3-12 13z" fill="C"/><path d="M4 17l3 3M3 21l2-2" stroke="L" stroke-width="2"/>'});
{const _xp=xPre;xPre=function(t){if(N9[t]){if(!(P.g&&P.g.id=='zbunion')){toast('Só na Forma Demoníaca com Belzebu.');return false}return true}return _xp.apply(this,arguments)}}
// sons próprios para a Magia Espacial
{const SN={bzrift:'esrift',bztele:'eswarp',bzbar:'eshum',bzcomp:'escollapse',bzportal:'soportal',bzdom:'eshum',bzdim:'sowarp'};for(const k in SN){const f=window.C94[k];if(f)window.C94[k]=function(){snd(SN[k]);return f.apply(this,arguments)}}}
// ---------- ESTADOS E TRANSFORMAÇÃO
const ZBDIST={};
function zbNorm(){return P.g&&['ossos','bzesp','zbunion'].includes(P.g.id)}
function zbPress(end){if(!zbNorm())return;if(ZB.busy)return;
 if(end){if(ZB.st==2)zbEnd2(true);if(P.bz)zbToggle0(1);return}
 if(!P.bz){zbToggle0();return}// estágio 0 → 1 (fluxo do contrato e cutscene)
 if(ZB.st<2){if(P.mp<P.mmp*.5){toast('Precisa de pelo menos metade da mana para a Forma Demoníaca.');return}zbStart2();return}
 zbEnd2(false)}
// fluxo original (contrato, cutscene, estágio 1)
let zbToggle0=null;
// estágio 2: sequência cinematográfica em 7 fases
function zbStart2(){ZB.busy=true;ZB.st=2;ZB.prevG=P.g.id=='zbunion'?(ZB.prevG||'ossos'):P.g.id;P.lock=3.4;P.iv=Math.max(P.iv||0,3.6);const d0=typeof dist!='undefined'?dist:9;try{dist=Math.max(5,d0*.7)}catch(e){}
 const F2=zbStage2(PP);ZB.F2=F2;const skin0=P.look&&P.look.sk!=null?P.look.sk:0xcfd6c0,top0=PP.mT.color.getHex(),c0=new T.Color(0xcfd6c0),c1=new T.Color(0x2a2236),t0=new T.Color(top0),t1=new T.Color(BLK);envSet(.85,4,'shadow');const warp=B8.spWarp(1.4);S.add(warp);const rings=[];for(let k=0;k<3;k++){const r=B8.spRing(1.4+k*.3,.04,k%2?SC:SV,.8);S.add(r);rings.push(r)}
 const lbl=k=>{try{ww(['ATIVAÇÃO','MANIFESTAÇÃO','ALTERAÇÃO','ARMADURA ÓSSEA','FORMA DEMONÍACA'][k],'space')}catch(e){}};snd('naunion');lbl(0);
 kfx({u:(q,dt)=>{const t=q.t;warp.position.set(P.x,1.2,P.z);rings.forEach((r,i)=>{r.position.set(P.x,.4+i*.55,P.z);r.rotation.set(Math.PI/2+Math.sin(t*2+i)*.4,t*(i%2?2:-2),0)});
  // fase 1 · ativação: energia escura subindo
  if(t<.7){if(Math.random()<Q())fxp({x:P.x+rnd(-.8,.8),y:rnd(0,.6),z:P.z+rnd(-.8,.8),c:0x1a0a2a,n:2,sp:.3,sz:.25,life:.9,up:3});warp.material.opacity=0}
  // fase 2 · manifestação espacial em volta do corpo
  if(t>=.7&&!q.p2){q.p2=1;lbl(1);snd('eswarp')}if(t>=.7&&t<1.4){warp.userData.tick(t);warp.material.opacity=.25*Math.min(1,(t-.7)*3);rings.forEach(r=>r.material.opacity=.8)}
  // fase 3 · alteração física: pele e roupa escurecem, olhos brilham
  if(t>=1.4&&!q.p3){q.p3=1;lbl(2);snd('nasigil')}if(t>=1.4){const u=Math.min(1,(t-1.4)/.6);PP.mS.color.copy(c0).lerp(c1,u);PP.mT.color.copy(t0).lerp(t1,u);try{PP.mE.color.setHex(0xc9a8ff)}catch(e){}if(ZB.F1)ZB.F1.big=1+u*.45}
  // fase 4 · armadura óssea se formando peça por peça
  if(t>=2.0&&!q.p4){q.p4=1;lbl(3);snd('naslam')}if(t>=2.0)F2.form((t-2.0)*1.6);
  // fase 5 · finalização: onda de choque
  if(t>=3.3&&!q.p5){q.p5=1;lbl(4);snd('esboom');kShock(P.x,P.z,5,SV,.5,1);P.shake=Math.max(P.shake,.35);fxp({x:P.x,y:1.4,z:P.z,c:SV,n:Math.round(30*Q()),sp:5,sz:.18,life:.6})}
  rings.forEach(r=>r.material.opacity=t>3.3?Math.max(0,.8-(t-3.3)*2):r.material.opacity);warp.material.opacity=t>3.3?Math.max(0,.25-(t-3.3)):warp.material.opacity;return t<3.8},
  end:()=>{kDispose(warp);rings.forEach(r=>kDispose(r));F2.form(99);try{dist=d0}catch(e){}ZB.busy=false;
   // fase 6 · estado demoníaco: União de Magias no grimório
   const m=window.alt108Mem?null:null;try{const v=v82S();v.xpm=v.xpm||{};v.xpm[P.g.id]=(P.xp||[]).slice();P.g=GR.zbunion;P.xp=Array.isArray(v.xpm.zbunion)?v.xpm.zbunion.slice():[0,0,0,0,0,0];renderSkills();hudNow()}catch(e){}
   toast('Forma Demoníaca: armadura óssea, cauda e União de Magias liberadas · aperte Fundir de novo para encerrar')}})}
// fase 7 · encerramento: energia some, armadura esfarela e o corpo volta ao normal
function zbEnd2(silent){if(ZB.st!=2)return;ZB.st=1;ZB.busy=true;const F2=ZB.F2;ZB.F2=null;const back=ZB.prevG&&GR[ZB.prevG]?ZB.prevG:'ossos';try{const v=v82S();v.xpm=v.xpm||{};if(P.g.id=='zbunion')v.xpm.zbunion=(P.xp||[]).slice();P.g=GR[back];P.xp=Array.isArray(v.xpm[back])?v.xpm[back].slice():[0,0,0,0,0,0,0,0,0];renderSkills();hudNow()}catch(e){}
 const c0=PP.mS.color.clone(),c1=new T.Color(0xcfd6c0),t0=PP.mT.color.clone(),t1=new T.Color(P.look&&P.look.tc!=null?P.look.tc:SK2top());if(!silent){snd('escollapse');ww('ENCERRAMENTO','space')}
 kfx({u:(q,dt)=>{const t=q.t,u=Math.min(1,t/.8);if(F2)F2.crumble(t);PP.mS.color.copy(c0).lerp(c1,u);PP.mT.color.copy(t0).lerp(t1,u);if(ZB.F1)ZB.F1.big=1.45-.45*u;if(Math.random()<.6*Q())fxp({x:P.x+rnd(-.6,.6),y:rnd(.5,2),z:P.z+rnd(-.6,.6),c:SV,n:1,sp:.4,sz:.12,life:.5,up:1});return t<.9},end:()=>{if(F2)F2.detach();ZB.busy=false;try{skin(P.eq||'civil')}catch(e){}}})}
function SK2top(){try{return(SK[P.eq]||SK.civil)[2]}catch(e){return 0x6a4a3a}}
// liga ao botão Fundir e ao fim da União
{const _tb=togBelz;zbToggle0=function(end){return _tb(end)};togBelz=function(end){if(end){zbPress(true);return}zbPress(false)}}
{const _tu=togUnion;togUnion=function(end){if(P.g&&P.g.id=='zbunion'){if(run||end)zbPress(!!end);return}return _tu.apply(this,arguments)}}
{const _bz=bzToggle;bzToggle=function(end){if(P.g&&P.g.id=='zbunion'){if(ZB.st==2)zbEnd2(true)}const r=(P.g&&P.g.id=='zbunion')?(()=>{const g=P.g;P.g=GR.ossos;try{return _bz.apply(this,arguments)}finally{P.g=g}})():_bz.apply(this,arguments);if(!P.bz){ZB.st=0;ZB.F1=null}else{ZB.st=Math.max(ZB.st,1);ZB.F1=P.bzF}return r}}
{const _hn=hudNow;hudNow=function(){const r=_hn.apply(this,arguments);try{if(P.g&&P.g.id=='zbunion'){const u=$('a-union');if(u){u.classList.remove('hide');u.classList.add('on')}}const u=$('a-union');if(u&&zbNorm()){const sm=u.querySelector('small');if(sm)sm.textContent=!P.bz?'Fundir':ZB.st<2?'Forma':'Encerrar'}}catch(e){}return r}}
// por quadro: animação das asas, da cauda e dreno de mana da forma demoníaca
let zbLastF=0;{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{const t=performance.now()/1000;if(P.bz&&P.bzF&&P.bzF.anim&&P.bzF.W)P.bzF.anim(t,mv>.1);
 if(ZB.st==2&&ZB.F2&&!ZB.busy){let df=P.f-zbLastF;while(df>Math.PI)df-=6.283;while(df<-Math.PI)df+=6.283;ZB.F2.anim(t,mv>.1,Math.max(-1,Math.min(1,df/dt*.05)));P.mp-=1.6*dt;if(P.mp<=0){P.mp=0;zbEnd2(false);toast('A Forma Demoníaca se desfez: sem mana.')}if(Math.random()<dt*2*KQ())fxp({x:P.x+rnd(-.6,.6),y:rnd(.3,2),z:P.z+rnd(-.6,.6),c:Math.random()<.5?SV:0x1a0a2a,n:1,sp:.2,sz:.1,life:.6,up:.8})}else if(ZB.st==2&&ZB.F2&&ZB.busy){ZB.F2.anim(t,false,0)}zbLastF=P.f;
 if(P.g&&P.g.id=='zbunion'&&!P.bz){const back=ZB.prevG&&GR[ZB.prevG]?ZB.prevG:'ossos';P.g=GR[back];renderSkills();hudNow();ZB.st=0}}catch(e){}return r}}
// multiplayer: os outros veem a Forma Demoníaca (armadura e cauda)
{const _xl=xLk;xLk=function(){const o=_xl.apply(this,arguments);try{o.zb2=ZB.st==2?1:0}catch(e){}return o}}
{const _xa=xApplyOther;xApplyOther=function(o,lk){const r=_xa.apply(this,arguments);try{const want=!!(lk&&lk.zb2&&lk.nf=='belzebu');if(want&&!o.zb2F){o.zb2F=zbStage2(o.L);o.zb2F.form(99);o.L.mS&&o.L.mS.color.setHex(0x2a2236)}else if(!want&&o.zb2F){o.zb2F.detach();o.zb2F=null}if(o.zb2F)o.zb2F.anim(performance.now()/1000,true,0)}catch(e){}return r}}
}

