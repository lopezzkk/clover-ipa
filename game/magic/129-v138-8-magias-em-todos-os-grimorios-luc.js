// ================= V138 · 8 MAGIAS EM TODOS OS GRIMÓRIOS + LUCK COM 8 MAGIAS E 8 PRÓPRIAS EM CADA FORMA =================
// Motor de magias por "estilo" (rajada teleguiada, lança perfurante, raio contínuo, onda, campo, chuva, avanço, teleporte,
// redemoinho, prisão, invocação, bênção, corrente, giro, linha de espinhos, barreira, sequência de golpes).
// Cada magia nova tem nome, forma, cores, pose e números próprios — nenhuma é cópia de outra.
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const GC={};const geo=(k,f)=>{if(!GC[k]){GC[k]=f();GC[k]._keep=1}return GC[k]};
const SH={orb:()=>geo('orb',()=>new T.SphereGeometry(.22,12,10)),blade:()=>geo('blade',()=>{const g=new T.TorusGeometry(.5,.07,4,20,Math.PI);g.rotateX(Math.PI/2);return g}),
 spike:()=>geo('spk',()=>{const g=new T.ConeGeometry(.13,.9,5);g.rotateX(Math.PI/2);return g}),card:()=>geo('card',()=>new T.PlaneGeometry(.32,.46)),
 arrow:()=>X.geo('arrow'),feather:()=>geo('fth',()=>{const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(.12,.4,0,.9);s.quadraticCurveTo(-.06,.4,0,0);const g=new T.ShapeGeometry(s,5);g.rotateX(Math.PI/2);return g}),
 petal:()=>geo('pet',()=>{const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(.2,.25,0,.55);s.quadraticCurveTo(-.2,.25,0,0);const g=new T.ShapeGeometry(s,5);g.rotateX(Math.PI/2);return g}),
 cube:()=>geo('cub',()=>new T.BoxGeometry(.3,.3,.3)),ring:()=>geo('rng',()=>new T.TorusGeometry(.3,.05,5,20)),fang:()=>geo('fng',()=>{const g=new T.ConeGeometry(.18,.7,4);g.rotateX(Math.PI/2);return g})};
const add=X.addM;
function tgt(r){try{return chronoTarget(r||16)}catch(e){return X.nearest(P.x,P.z,r||16)}}
function front(d){return{x:P.x+Math.sin(P.f)*d,z:P.z+Math.cos(P.f)*d}}
function clampXZ(x,z){try{return[Math.max(WB83.x0,Math.min(WB83.x1,x)),Math.max(WB83.z0,Math.min(WB83.z1,z))]}catch(e){return[x,z]}}
function fx(x,y,z,c,n,sp,sz,life,up){if(Math.random()<Q()+.2)fxp({x,y,z,c,n:Math.max(1,Math.round(n*Math.min(1,Q()))),sp,sz,life,up})}
function ring(x,z,R,c,dur,y){const m=new T.Mesh(geo('rr',()=>new T.RingGeometry(.92,1,48)),add(c,0));m.rotation.x=-Math.PI/2;m.position.set(x,y||.08,z);S.add(m);kfx({u:F=>{const u=F.t/dur;m.scale.setScalar(R*(.3+u*.7));m.material.opacity=.85*(1-u);return F.t<dur},end:()=>X.dispose(m)})}
function src(o){if(o.from=='beast')return new T.Vector3(P.x-Math.sin(P.f)*1.5,(P.y||0)+3.4,P.z-Math.cos(P.f)*1.5);if(o.from=='sky')return new T.Vector3(P.x,(P.y||0)+5,P.z);return X.hand(Math.random()<.5?0:1)}
// ---------------- estilos ----------------
const A={
 // rajada de projéteis teleguiados
 volley(d,o){const n=o.n||5,L=[];const used=new Set();for(let k=0;k<n;k++)tmr.push({t:k*(o.gap||.07),f:()=>{const s=src(o),m=new T.Mesh(SH[o.sh||'orb'](),add(k%2?o.c:o.c2,.95));m.position.copy(s);const gl=X.glow(o.c,.8,.8);m.add(gl);S.add(m);
   let e=X.nearest(P.x,P.z,18,o.spread?used:null);if(e&&o.spread)used.add(e);const a=P.f+(k-(n-1)/2)*(o.fan||.18);const v0=(o.from&&e)?new T.Vector3(e.x-s.x,1.1-s.y,e.z-s.z):new T.Vector3(Math.sin(a),o.from=='sky'?-.3:.05,Math.cos(a));L.push({m,e,v:v0.normalize().multiplyScalar(o.sp||22),life:1.6,hit:new Set()});try{X.snd(o.snd||'zap',.35)}catch(_){}}});
  kfx({u:(F,dt)=>{for(const p of L){if(p.life<=0)continue;p.life-=dt;const pos=p.m.position;if(p.e&&p.e.hp>0){const to=new T.Vector3(p.e.x-pos.x,1.1-pos.y,p.e.z-pos.z).normalize().multiplyScalar(p.v.length());p.v.lerp(to,Math.min(1,dt*(o.home||6)))}pos.addScaledVector(p.v,dt);p.m.lookAt(pos.clone().add(p.v));if(o.spin)p.m.rotation.z+=dt*12;fx(pos.x,pos.y,pos.z,o.c,1,.2,.06,.25);
    for(const e of enemies){if(e.hp<=0||p.hit.has(e))continue;if(Math.hypot(e.x-pos.x,e.z-pos.z)<.9&&pos.y<2.6){p.hit.add(e);hitE(e,d*(o.k||.3),o.ef||{});fx(e.x,1.2,e.z,o.c2,6,3,.08,.3);if(!o.pierce){p.life=0;break}}}if(p.life<=0||pos.y<.05){p.life=0;p.m.visible=false;ring(pos.x,pos.z,1.2,o.c,.3)}}
   return F.t<(n*(o.gap||.07)+1.5)},end:()=>L.forEach(p=>X.dispose(p.m))})},
 // lança que atravessa a fila
 lance(d,o){const s=X.hand(1),dir=new T.Vector3(Math.sin(P.f),0,Math.cos(P.f)),len=o.len||16;const g=new T.Group();const core=new T.Mesh(geo('lnc',()=>{const c=new T.CylinderGeometry(.06,.12,2.6,8);c.rotateX(Math.PI/2);return c}),add(0xffffff,.95)),out=new T.Mesh(geo('lnc2',()=>{const c=new T.CylinderGeometry(.16,.3,3.2,8);c.rotateX(Math.PI/2);return c}),add(o.c,.6));g.add(core,out);g.position.copy(s);g.lookAt(s.clone().add(dir));S.add(g);
  const rb=X.ribbon?X.ribbon(14,.28,o.c,o.c2):null;if(rb)S.add(rb.m);const hit=new Set();try{X.snd(o.snd||'charge',.5)}catch(_){}
  kfx({u:(F,dt)=>{const u=Math.min(1,F.t/.35);g.position.copy(s).addScaledVector(dir,len*u);if(rb){rb.add(g.position);rb.upd(1-Math.max(0,F.t-.35)*3)}
   for(const e of enemies){if(e.hp<=0||hit.has(e))continue;const ex=e.x-s.x,ez=e.z-s.z,al=ex*dir.x+ez*dir.z;if(al<0||al>len*u)continue;if(Math.abs(ex*dir.z-ez*dir.x)<1.1){hit.add(e);hitE(e,d*(o.k||.9),o.ef||{});X.push(e,dir.x,dir.z,o.kb||8,.25);fx(e.x,1.2,e.z,o.c,8,4,.09,.3)}}
   g.visible=F.t<.4;return F.t<.75},end:()=>{X.dispose(g);if(rb)X.dispose(rb.m)}})},
 // raio contínuo
 beam(d,o){const g=new T.Group(),a=new T.Mesh(X.geo('beam'),add(o.c,.65)),b=new T.Mesh(X.geo('beam'),add(0xffffff,.9));b.scale.set(.35,1,.35);g.add(a,b);S.add(g);const dur=o.dur||1.4,len=o.len||14;let acc=0;try{X.snd(o.snd||'charge',.5)}catch(_){}P.lock=Math.max(P.lock||0,dur*.6);
  kfx({u:(F,dt)=>{const s=X.front(.8,1.2),e2=X.front(len,1.1),L=s.distanceTo(e2);g.position.copy(s).lerp(e2,.5);g.lookAt(e2);g.rotateX(Math.PI/2);const w=(o.w||.9)*(1+Math.sin(F.t*40)*.08)*Math.min(1,F.t*6)*Math.min(1,(dur-F.t)*5);g.scale.set(w,L,w);
   if((acc+=dt)>.15){acc=0;X.hitLine(P.x,P.z,Math.sin(P.f),Math.cos(P.f),len,o.bw||1.1,d*(o.k||.12),o.ef||{})}fx(e2.x,1,e2.z,o.c,2,3,.1,.3);return F.t<dur},end:()=>X.dispose(g)})},
 // onda em anel que sai do personagem
 nova(d,o){const R=o.R||7,m=new T.Mesh(geo('nv',()=>new T.TorusGeometry(1,.09,5,48)),add(o.c,.9));m.rotation.x=-Math.PI/2;S.add(m);const m2=new T.Mesh(geo('nv2',()=>new T.RingGeometry(.85,1,48)),add(o.c2,.5));m2.rotation.x=-Math.PI/2;S.add(m2);const hit=new Set(),x=P.x,z=P.z;try{X.snd(o.snd||'boom',.5)}catch(_){}
  kfx({u:(F,dt)=>{const u=Math.min(1,F.t/(o.t||.5)),r=R*u;m.position.set(x,.5+(o.h||0),z);m2.position.set(x,.1,z);m.scale.setScalar(r);m2.scale.setScalar(r);m.material.opacity=.9*(1-u);m2.material.opacity=.5*(1-u);
   for(const e of enemies){if(e.hp<=0||hit.has(e))continue;const dd=Math.hypot(e.x-x,e.z-z);if(dd<r+.5){hit.add(e);hitE(e,d*(o.k||.7),o.ef||{});X.push(e,e.x-x,e.z-z,o.kb||10,.3)}}return F.t<(o.t||.5)},end:()=>{X.dispose(m);X.dispose(m2)}})},
 // campo no chão (dano por tempo, lentidão, atordoamento)
 field(d,o){const t=tgt(16),p=t?{x:t.x,z:t.z}:front(7),R=o.R||4,dur=o.dur||3;const g=new T.Group();g.position.set(p.x,.06,p.z);const disc=new T.Mesh(X.geo('disc'),add(o.c,0)),rim=new T.Mesh(geo('frim',()=>new T.RingGeometry(.9,1,48)),add(o.c2,0));disc.rotation.x=rim.rotation.x=-Math.PI/2;rim.position.y=.01;g.add(disc,rim);g.scale.setScalar(R);S.add(g);
  const bolts=[];if(o.net){for(let k=0;k<6;k++){const b=X.bolt(o.c,.04,.9,7);S.add(b);bolts.push(b)}}let acc=0;try{X.snd(o.snd||'charge',.4)}catch(_){}
  kfx({u:(F,dt)=>{const op=Math.min(1,F.t*4)*Math.min(1,(dur-F.t)*3);disc.material.opacity=.22*op;rim.material.opacity=.85*op;rim.rotation.z+=dt*2;
   bolts.forEach((b,k)=>{b.visible=Math.random()<.7*op;const a=k/6*6.28+F.t,a2=a+2.2;b.userData.set(new T.Vector3(p.x+Math.cos(a)*R,.3,p.z+Math.sin(a)*R),new T.Vector3(p.x+Math.cos(a2)*R,.3,p.z+Math.sin(a2)*R),.4)});
   if((acc+=dt)>(o.tick||.5)){acc=0;X.hitArea(p.x,p.z,R,d*(o.k||.2),o.ef||{}).forEach(e=>{if(o.stun)X.stun(e,o.stun);if(o.pull){const dx=p.x-e.x,dz=p.z-e.z,l=Math.hypot(dx,dz)||1;e.x+=dx/l*.8;e.z+=dz/l*.8}})}
   fx(p.x+(Math.random()-.5)*R*1.6,.3,p.z+(Math.random()-.5)*R*1.6,o.c,1,.3,.08,.6,1.5);return F.t<dur},end:()=>{X.dispose(g);bolts.forEach(X.dispose)}})},
 // chuva de golpes do céu
 rain(d,o){const t=tgt(18),p=t?{x:t.x,z:t.z}:front(8),R=o.R||5,n=o.n||8;for(let k=0;k<n;k++)tmr.push({t:.15+k*(o.gap||.12),f:()=>{const a=Math.random()*6.28,r=Math.sqrt(Math.random())*R,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;
   if(o.bolt){const b=X.bolt(o.c,.12,.95,10,o.dark);S.add(b);kfx({u:F=>{b.visible=Math.random()<.9;b.userData.set(new T.Vector3(x,20,z),new T.Vector3(x,0,z),1);b.material.opacity=Math.max(0,.95-F.t*3);return F.t<.3},end:()=>X.dispose(b)})}
   else{const m=new T.Mesh(SH[o.sh||'spike'](),add(o.c,.95));m.position.set(x,12,z);m.lookAt(x,0,z);S.add(m);kfx({u:F=>{m.position.y=12-F.t*60;return m.position.y>0},end:()=>X.dispose(m)})}
   tmr.push({t:o.bolt?0:.2,f:()=>{ring(x,z,2,o.c,.3);fx(x,.4,z,o.c2,8,4,.09,.35,2);X.hitArea(x,z,1.8,d*(o.k||.18),o.ef||{});try{X.snd(o.snd||'zap',.35)}catch(_){}}})}})},
 // avanço atravessando inimigos
 dash(d,o){const dx=Math.sin(P.f),dz=Math.cos(P.f),dist=o.dist||9,ox=P.x,oz=P.z;const[ex,ez]=clampXZ(P.x+dx*dist,P.z+dz*dist);P.iv=Math.max(P.iv||0,.5);P.dt2=.2;P.dv=[(ex-P.x)/.2,(ez-P.z)/.2];
  const rb=X.ribbon?X.ribbon(16,o.w||.4,o.c,o.c2):null;if(rb)S.add(rb.m);const hit=new Set();try{X.snd(o.snd||'zap',.6)}catch(_){}
  kfx({u:(F,dt)=>{if(rb){if(F.t<.25)rb.add(new T.Vector3(P.x,(P.y||0)+1,P.z));rb.upd(1-Math.max(0,F.t-.25)*3)}if(F.t<.3){for(const e of enemies){if(e.hp<=0||hit.has(e))continue;if(Math.hypot(e.x-P.x,e.z-P.z)<1.8){hit.add(e);hitE(e,d*(o.k||.8),o.ef||{});X.stun(e,o.stun||.4);fx(e.x,1.2,e.z,o.c,8,4,.09,.3)}}}
   if(F.t>.3&&!F.e){F.e=1;if(o.end=='nova')A.nova(d*.5,Object.assign({},o,{R:4,k:.6}));else ring(P.x,P.z,3,o.c,.4)}return F.t<.7},end:()=>{if(rb)X.dispose(rb.m)}})},
 // teleporte atrás de inimigos
 blink(d,o){const list=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-P.x,e.z-P.z)<15).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,o.n||3);
  if(!list.length){const[x,z]=clampXZ(P.x+Math.sin(P.f)*(o.dist||7),P.z+Math.cos(P.f)*(o.dist||7));const A0=new T.Vector3(P.x,1.1,P.z);P.x=x;P.z=z;line(A0,new T.Vector3(x,1.1,z),o);ring(x,z,2,o.c,.4);try{X.snd(o.snd||'zap',.6)}catch(_){}return}
  P.iv=Math.max(P.iv||0,.4+list.length*.2);list.forEach((e,k)=>tmr.push({t:k*.18,f:()=>{if(e.hp<=0)return;const A0=new T.Vector3(P.x,1.1,P.z),a=Math.atan2(e.x-P.x,e.z-P.z);const[x,z]=clampXZ(e.x+Math.sin(a)*1.4,e.z+Math.cos(a)*1.4);P.x=x;P.z=z;P.f=Math.atan2(e.x-x,e.z-z);line(A0,new T.Vector3(x,1.1,z),o);try{startPose(k%2?'push':'throw')}catch(_){}hitE(e,d*(o.k||.4),o.ef||{});X.stun(e,.4);fx(e.x,1.2,e.z,o.c,10,5,.09,.3);try{X.snd(o.snd||'zap',.5)}catch(_){}}}))},
 // redemoinho que puxa e depois solta
 pull(d,o){const t=tgt(16),p=t?{x:t.x,z:t.z}:front(7),R=o.R||5,dur=o.dur||1.6;const g=new T.Group();g.position.set(p.x,.07,p.z);S.add(g);const L=[];for(let k=0;k<3;k++){const m=new T.Mesh(geo('sw'+k,()=>new T.RingGeometry(.3+k*.25,.45+k*.25,40,1,0,4.5)),add(k==1?o.c2:o.c,.0));m.rotation.x=-Math.PI/2;m.position.y=k*.02;g.add(m);L.push(m)}g.scale.setScalar(R/1.2);try{X.snd(o.snd||'rewind',.5)}catch(_){}
  kfx({u:(F,dt)=>{const op=Math.min(1,F.t*4);L.forEach((m,k)=>{m.rotation.z+=dt*(5+k*2);m.material.opacity=.8*op});for(const e of enemies){if(e.hp<=0)continue;const dx=p.x-e.x,dz=p.z-e.z,l=Math.hypot(dx,dz);if(l<R*1.6&&l>.4){e.x+=dx/l*dt*6;e.z+=dz/l*dt*6}}fx(p.x+(Math.random()-.5)*R*2,.4,p.z+(Math.random()-.5)*R*2,o.c,1,.6,.08,.4,1);
   if(F.t>dur&&!F.h){F.h=1;X.hitArea(p.x,p.z,R,d*(o.k||.9),o.ef||{}).forEach(e=>X.stun(e,o.stun||.6));ring(p.x,p.z,R,o.c2,.5);if(X.flow)X.flow(p.x,1,p.z,1.2,o.c,.7)}return F.t<dur+.3},end:()=>X.dispose(g)})},
 // prisão (anéis ou barras) prendendo o alvo
 prison(d,o){const t=tgt(16);if(!t){A.nova(d*.6,o);return}const g=new T.Group();g.position.set(t.x,0,t.z);S.add(g);const bars=[];for(let k=0;k<(o.bars?8:3);k++){let m;if(o.bars){m=new T.Mesh(geo('bar',()=>new T.CylinderGeometry(.05,.05,2.6,6)),add(o.c,.9));m.position.set(Math.cos(k/8*6.28)*1.1,1.3,Math.sin(k/8*6.28)*1.1)}else{m=new T.Mesh(geo('prr',()=>new T.TorusGeometry(1,.06,5,32)),add(k==1?o.c2:o.c,.9));m.position.y=.5+k*.6;m.rotation.x=Math.PI/2}g.add(m);bars.push(m)}
  const dur=o.dur||2.4;X.stun(t,dur);hitE(t,d*(o.k||.5),o.ef||{});try{X.snd(o.snd||'tick',.6)}catch(_){}
  kfx({u:(F,dt)=>{g.position.set(t.x,0,t.z);bars.forEach((m,k)=>{if(!o.bars){m.rotation.z+=dt*(k%2?3:-3);m.scale.setScalar(Math.min(1,F.t*4))}else m.scale.y=Math.min(1,F.t*5)});if(F.t>dur-.3&&!F.h){F.h=1;if(t.hp>0)hitE(t,d*(o.k2||.4),{});fx(t.x,1.2,t.z,o.c,12,4,.09,.4)}return F.t<dur},end:()=>X.dispose(g)})},
 // invocação que ataca sozinha
 summon(d,o){const p=front(2),g=new T.Group();g.position.set(p.x,0,p.z);const body=new T.Mesh(SH[o.sh||'orb'](),add(o.c,.9));body.scale.setScalar(o.big?3:1.8);body.position.y=o.big?2.4:1.8;g.add(body);const gl=X.glow(o.c,o.big?4:2.4,.6);gl.position.y=body.position.y;g.add(gl);const rg=new T.Mesh(geo('smr',()=>new T.TorusGeometry(.6,.04,5,30)),add(o.c2,.8));rg.position.y=body.position.y;g.add(rg);S.add(g);
  const dur=o.dur||8;let cd=.3;try{X.snd(o.snd||'charge',.4)}catch(_){}
  kfx({u:(F,dt)=>{const a=F.t*1.5;const tx=P.x+Math.cos(a)*2.2,tz=P.z+Math.sin(a)*2.2;g.position.x+=(tx-g.position.x)*Math.min(1,dt*3);g.position.z+=(tz-g.position.z)*Math.min(1,dt*3);body.position.y=(o.big?2.4:1.8)+Math.sin(F.t*3)*.15;rg.rotation.x+=dt*3;rg.rotation.y+=dt*2;
   if((cd-=dt)<=0){cd=o.rate||.9;const e=X.nearest(g.position.x,g.position.z,12);if(e){const A0=g.position.clone();A0.y=body.position.y;const b=X.bolt(o.c,.05,.95,7,o.dark);S.add(b);kfx({u:F2=>{b.userData.set(A0,new T.Vector3(e.x,1.1,e.z),.4);b.material.opacity=Math.max(0,.95-F2.t*4);return F2.t<.22},end:()=>X.dispose(b)});hitE(e,d*(o.k||.15),o.ef||{});fx(e.x,1.2,e.z,o.c,5,3,.08,.3);try{X.snd(o.snd2||'zap',.25)}catch(_){}}}
   const op=Math.min(1,F.t*3)*Math.min(1,(dur-F.t)*2);body.material.opacity=.9*op;gl.material.opacity=.6*op;return F.t<dur},end:()=>X.dispose(g)})},
 // bênção no próprio personagem (velocidade / dano / recarga)
 buff(d,o){const g=P.g&&GR[P.g.id];if(!g)return;const pp=g.p=g.p||{};const s0=pp.spd||0,d0=pp.dmg||0,c0=X.cdBoost||0;pp.spd=s0+(o.spd||0);pp.dmg=d0+(o.dmg||0);X.cdBoost=c0+(o.cdr||0);if(o.heal)P.hp=Math.min(P.mhp,P.hp+P.mhp*o.heal);if(o.mana)P.mp=Math.min(P.mmp,P.mp+P.mmp*o.mana);
  const dur=o.dur||8,L=[];for(let k=0;k<2;k++){const m=new T.Mesh(geo('bf'+k,()=>new T.TorusGeometry(.7+k*.2,.03,4,36)),add(k?o.c2:o.c,.8));m.rotation.x=Math.PI/2;S.add(m);L.push(m)}try{X.snd(o.snd||'transform',.4)}catch(_){}if(X.flow)X.flow(P.x,1,P.z,1,o.c,.8);const id=P.g.id;
  kfx({u:(F,dt)=>{L.forEach((m,k)=>{m.position.set(P.x,(P.y||0)+.2+((F.t*.8+k*.5)%1)*2.2,P.z);m.material.opacity=.7*Math.min(1,(dur-F.t)*2)});fx(P.x+(Math.random()-.5),(P.y||0)+Math.random()*2,P.z+(Math.random()-.5),o.c,1,.3,.06,.4,1);return F.t<dur&&P.g&&P.g.id==id},end:()=>{L.forEach(X.dispose);try{pp.spd=s0;pp.dmg=d0;X.cdBoost=c0}catch(e){}}})},
 // corrente que pula de inimigo em inimigo
 chain(d,o){let cur=X.nearest(P.x,P.z,14);const hit=new Set();let from=X.hand(1);for(let k=0;k<(o.n||5)&&cur;k++){const e=cur;hit.add(e);const A0=from.clone(),B=new T.Vector3(e.x,1.1,e.z);tmr.push({t:k*.09,f:()=>{const b=X.bolt(o.c,.06,.95,8,o.dark);S.add(b);kfx({u:F=>{b.userData.set(A0,B,.5);b.material.opacity=Math.max(0,.95-F.t*3);return F.t<.3},end:()=>X.dispose(b)});if(e.hp>0){hitE(e,d*(o.k||.3),o.ef||{});X.stun(e,o.stun||.3)}fx(e.x,1.2,e.z,o.c,6,3,.08,.3);try{X.snd(o.snd||'zap',.35)}catch(_){}}});from=B;cur=X.nearest(e.x,e.z,7,hit)}if(!hit.size)A.lance(d,o)},
 // giro com cortes em volta
 spin(d,o){const dur=o.dur||1,L=[];for(let k=0;k<3;k++){const m=new T.Mesh(SH.blade(),add(k==1?o.c2:o.c,.9));m.scale.setScalar(2.4+k*.4);S.add(m);L.push(m)}let acc=0;P.lock=Math.max(P.lock||0,dur*.5);try{X.snd(o.snd||'wing',.5)}catch(_){}
  kfx({u:(F,dt)=>{L.forEach((m,k)=>{m.position.set(P.x,(P.y||0)+.8+k*.3,P.z);m.rotation.y=F.t*14+k*2.1;m.material.opacity=.9*Math.min(1,(dur-F.t)*4)});if((acc+=dt)>.18){acc=0;X.hitArea(P.x,P.z,o.R||3.4,d*(o.k||.16),o.ef||{}).forEach(e=>X.push(e,e.x-P.x,e.z-P.z,4,.15))}return F.t<dur},end:()=>L.forEach(X.dispose)})},
 // linha de espinhos saindo do chão
 spikes(d,o){const dx=Math.sin(P.f),dz=Math.cos(P.f),n=o.n||9,hit=new Set();for(let k=0;k<n;k++)tmr.push({t:k*.05,f:()=>{const x=P.x+dx*(1.5+k*1.3)+(Math.random()-.5)*.6,z=P.z+dz*(1.5+k*1.3)+(Math.random()-.5)*.6;const m=new T.Mesh(geo('gsp',()=>{const c=new T.ConeGeometry(.35,2.2,5);c.translate(0,1.1,0);return c}),add(k%2?o.c:o.c2,.95));m.position.set(x,0,z);m.rotation.set((Math.random()-.5)*.4,0,(Math.random()-.5)*.4);m.scale.y=.01;S.add(m);
   kfx({u:F=>{m.scale.y=Math.min(1,F.t*8)*(F.t>.5?Math.max(0,1-(F.t-.5)*3):1);return F.t<.85},end:()=>X.dispose(m)});for(const e of enemies){if(e.hp<=0||hit.has(e))continue;if(Math.hypot(e.x-x,e.z-z)<1.3){hit.add(e);hitE(e,d*(o.k||.6),o.ef||{});X.stun(e,.5)}}fx(x,.3,z,o.c,4,3,.08,.3,3)}});try{X.snd(o.snd||'boom',.4)}catch(_){}},
 // barreira que reduz o dano recebido
 wall(d,o){const dur=o.dur||5;const g=new T.Mesh(X.geo('sphw'),new T.MeshBasicMaterial({color:o.c,wireframe:true,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false}));g.scale.setScalar(2.6);S.add(g);const x0=P.xdef||1;P.xdef=x0*(o.def||.5);try{X.snd(o.snd||'transform',.4)}catch(_){}
  kfx({u:(F,dt)=>{g.position.set(P.x,(P.y||0)+1,P.z);g.rotation.y+=dt;g.material.opacity=.5*Math.min(1,(dur-F.t)*2);return F.t<dur},end:()=>{X.dispose(g);P.xdef=x0}})},
 // sequência de golpes no alvo
 combo(d,o){const t=X.nearest(P.x,P.z,10);if(t){const a=Math.atan2(t.x-P.x,t.z-P.z);const[x,z]=clampXZ(t.x-Math.sin(a)*1.4,t.z-Math.cos(a)*1.4);P.x=x;P.z=z;P.f=a}P.lock=Math.max(P.lock||0,.9);const n=o.n||6;
  for(let k=0;k<n;k++)tmr.push({t:.05+k*.11,f:()=>{try{startPose(k%3==2?'slam':k%2?'push':'throw')}catch(_){}const h=X.front(1.5,1.1);const m=new T.Mesh(SH[o.sh||'blade'](),add(k%2?o.c:o.c2,.95));m.position.copy(h);m.rotation.set(Math.random()*3,Math.random()*3,0);m.scale.setScalar(1.6);S.add(m);kfx({u:F=>{m.scale.setScalar(1.6+F.t*4);m.material.opacity=Math.max(0,.95-F.t*5);return F.t<.2},end:()=>X.dispose(m)});
   X.hitArea(h.x,h.z,1.9,d*(o.k||.14),o.ef||{}).forEach(e=>X.stun(e,.25));try{X.snd(o.snd||'zap',.3)}catch(_){}}});tmr.push({t:.1+n*.11,f:()=>{const h=X.front(1.8,.5);ring(h.x,h.z,3.5,o.c,.4);X.hitArea(h.x,h.z,3,d*(o.kf||.3),o.ef||{}).forEach(e=>X.push(e,e.x-P.x,e.z-P.z,12,.35))}})}};
function line(A0,B,o){const b=X.bolt(o.c,.08,.95,6,o.dark);S.add(b);kfx({u:F=>{b.userData.set(A0,B,.3);b.material.opacity=Math.max(0,.95-F.t*3);return F.t<.3},end:()=>X.dispose(b)})}
X.A138=A;
// ---------------- ícones por estilo ----------------
const IC={volley:'<circle cx="7" cy="12" r="2.4" fill="C"/><circle cx="13" cy="8" r="2" fill="L"/><circle cx="13" cy="16" r="2" fill="L"/><path d="M15 12h6" stroke="C" stroke-width="1.6"/>',lance:'<path d="M3 21L19 5M15 5h4v4" stroke="C" stroke-width="2" fill="none"/><path d="M6 15l3 3" stroke="L" stroke-width="1.4"/>',
 beam:'<rect x="3" y="10" width="18" height="4" rx="2" fill="C"/><rect x="3" y="11.2" width="18" height="1.6" fill="L"/>',nova:'<circle cx="12" cy="12" r="3" fill="L"/><circle cx="12" cy="12" r="7" fill="none" stroke="C" stroke-width="1.6"/><circle cx="12" cy="12" r="10" fill="none" stroke="C" stroke-width=".8"/>',
 field:'<ellipse cx="12" cy="16" rx="9" ry="4" fill="none" stroke="C" stroke-width="1.6"/><path d="M8 15l2-5 2 5 2-6 2 6" stroke="L" stroke-width="1.3" fill="none"/>',rain:'<path d="M6 3l-2 6M12 3l-2 6M18 3l-2 6M8 12l-2 6M15 12l-2 6" stroke="C" stroke-width="1.8"/><path d="M3 21h18" stroke="L" stroke-width="1.4"/>',
 dash:'<path d="M3 12h12M5 8h8M5 16h8" stroke="L" stroke-width="1.4"/><path d="M14 6l7 6-7 6" fill="C"/>',blink:'<circle cx="6" cy="12" r="2.5" fill="none" stroke="L" stroke-width="1.3" stroke-dasharray="2 2"/><circle cx="18" cy="12" r="3" fill="C"/><path d="M8 12h7" stroke="C" stroke-width="1.5"/>',
 pull:'<path d="M12 12m-8 0a8 8 0 1 0 8-8M12 12m-4 0a4 4 0 1 0 4-4" stroke="C" stroke-width="1.6" fill="none"/><circle cx="12" cy="12" r="1.6" fill="L"/>',prison:'<rect x="5" y="4" width="14" height="16" rx="2" fill="none" stroke="C" stroke-width="1.6"/><path d="M9 4v16M12 4v16M15 4v16" stroke="L" stroke-width="1.2"/>',
 summon:'<circle cx="12" cy="9" r="4.5" fill="C"/><path d="M5 21c1-5 13-5 14 0" stroke="L" stroke-width="1.6" fill="none"/>',buff:'<path d="M12 3v18M3 12h18" stroke="L" stroke-width="1.2"/><circle cx="12" cy="12" r="5" fill="none" stroke="C" stroke-width="2"/>',
 chain:'<path d="M3 15l5-6 4 6 4-6 5 6" stroke="C" stroke-width="2" fill="none"/><circle cx="8" cy="9" r="1.4" fill="L"/><circle cx="16" cy="9" r="1.4" fill="L"/>',spin:'<path d="M12 4a8 8 0 1 1-8 8" stroke="C" stroke-width="2" fill="none"/><path d="M4 12l-1-4 4 1" fill="L"/>',
 spikes:'<path d="M3 20l3-8 3 8 3-11 3 11 3-8 3 8z" fill="C"/>',wall:'<path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6z" fill="none" stroke="C" stroke-width="1.8"/><path d="M8 12l3 3 5-6" stroke="L" stroke-width="1.6" fill="none"/>',
 combo:'<path d="M4 18l5-5M9 18l5-5M14 18l5-5" stroke="C" stroke-width="2"/><path d="M6 8l12-4" stroke="L" stroke-width="1.4"/>'};
const POSE={volley:'throw',lance:'tarrow',beam:'push',nova:'slam',field:'raise',rain:'raise',dash:'dash',blink:'dash',pull:'kdom',prison:'raise',summon:'kdom',buff:'kdom',chain:'push',spin:'spin',spikes:'slam',wall:'kdom',combo:'push'};
const RG={volley:['l',20,''],lance:['l',16,''],beam:['l',14,''],nova:['c',7,''],field:['m',16,''],rain:['m',18,'em área'],dash:['c',9,''],blink:['m',15,''],pull:['m',16,''],prison:['m',16,''],summon:['c',0,'invocação'],buff:['c',0,'bênção'],chain:['m',14,''],spin:['c',3,''],spikes:['l',12,''],wall:['c',0,'barreira'],combo:['c',3,'']};
// ---------------- definições: nome, estilo, mana, dano, recarga, cores, parâmetros ----------------
const NEW={};const def=(gid,t,n,a,mp,dmg,cd,c,c2,o)=>{NEW[t]=Object.assign({},o||{},{gid,t,nm:n,a,mp,dmg,cd,c,c2});return t};
// --- LUCK: 3 novas na forma normal ---
const LB=0x6ff4ff,LW=0xe8ffff,RD=0xff1e3c,BK=0x220008;
def('raio','lkstep','Relâmpago: Passo Relâmpago','blink',12,34,4,LB,LW,{n:1,dist:8});
def('raio','lklance','Relâmpago: Lança do Trovão','lance',20,74,8,LB,LW,{len:18,k:1});
def('raio','lknet','Relâmpago: Rede Elétrica','field',26,40,14,LB,LW,{net:1,R:4.5,dur:3.2,stun:.6,k:.22});
// --- LUCK: Demônio do Trovão (a fera luta junto) ---
const BE='Demônio do Trovão: ';
const BEAST=[def('raio','lbcharge',BE+'Investida da Fera','dash',14,60,4,LB,LW,{dist:11,w:.7,end:'nova'}),def('raio','lbroar',BE+'Rugido do Trovão','nova',18,52,7,LB,LW,{R:10,kb:14}),
 def('raio','lbclaw',BE+'Garras Elétricas','combo',16,70,6,LB,LW,{sh:'fang',n:5}),def('raio','lbbite',BE+'Mordida Trovejante','prison',22,80,9,LB,LW,{dur:1.8}),
 def('raio','lbleap',BE+'Salto da Fera','rain',26,90,11,LB,LW,{bolt:1,n:6,R:3.5}),def('raio','lbguard',BE+'Fera Protetora','wall',20,0,16,LB,LW,{def:.45,dur:6}),
 def('raio','lbstorm',BE+'Chuva de Garras','volley',28,96,12,LB,LW,{n:8,sh:'fang',from:'beast',spread:1,k:.25}),def('raio','lbfury',BE+'Fúria da Fera','summon',40,120,24,LB,LW,{big:1,dur:9,rate:.55,k:.18})];
// --- LUCK: Demônio de Batalha (corpo a corpo rápido) — 4 de antes + 4 novas ---
const BA='Relâmpago Despertado: ';
const BATTLE=['lkphant','lkbarr',def('raio','lbkick',BA+'Chute Relâmpago','dash',14,58,4,LB,LW,{dist:7,end:'nova'}),def('raio','lbhook',BA+'Gancho Trovejante','spikes',18,70,6,LB,LW,{n:7}),
 def('raio','lbdance',BA+'Dança de Golpes','spin',24,80,9,LB,LW,{dur:1.3,R:3.6}),'lkgod','lkjudge',def('raio','lbgodspd',BA+'Velocidade Divina','buff',20,0,20,LB,LW,{spd:.6,cdr:.4,dur:8})];
// --- LUCK: Demônio de Batalha Negro (golpes próprios, raio negro) ---
const BN='Relâmpago Negro: ';
const BLACK=[def('raio','lnclaw',BN+'Garra Negra','combo',18,80,5,RD,BK,{sh:'fang',n:6,kf:.45}),def('raio','lnpierce',BN+'Raio Negro Perfurante','lance',24,110,7,RD,0xffffff,{len:22,k:1.1}),
 def('raio','lnprison',BN+'Prisão de Raio Negro','prison',24,90,10,RD,BK,{bars:1,dur:2.6}),def('raio','lnburst',BN+'Explosão de Mana Negra','nova',30,120,10,RD,BK,{R:10.5,kb:16}),
 def('raio','lnabyss',BN+'Corte do Abismo','beam',32,40,12,RD,0x400010,{dur:1.6,w:1.2,k:.16}),def('raio','lnrain',BN+'Chuva Negra','rain',34,130,14,RD,0x400010,{bolt:1,dark:1,n:10,R:5.5}),
 def('raio','lnadv',BN+'Avanço do Demônio Negro','blink',26,100,8,RD,BK,{n:4,dark:1}),def('raio','lnannih',BN+'Aniquilação Negra','pull',46,180,26,RD,BK,{R:6,dur:1.8,stun:1.2,k:1.1})];
// --- 7ª e 8ª magia dos grimórios que tinham 6 (e 8ª do Espacial do Belzebu) ---
def('fogo','fphoenix','Flame Magic: Phoenix Ascension','summon',34,90,22,0xff6a1a,0xffd060,{sh:'feather',dur:8,rate:.8});def('fogo','fpillars','Flame Magic: Pillars of Purgatory','spikes',28,85,10,0xff5522,0xffc040,{n:10,ef:{b:1}});
def('agua','abubble','Water: Bubble Barrage','volley',16,48,5,0x35a7ff,0xc8f0ff,{n:7,fan:.12,spread:1});def('agua','awhirl','Water: Maelstrom Pull','pull',30,96,14,0x35a7ff,0xe0f8ff,{R:5.5});
def('vento','wfeather','Wind: Feather Storm','volley',18,54,6,0x7de0b5,0xffffff,{n:9,sh:'feather',fan:.1});def('vento','wblades','Wind: Spiral Blade Dance','spin',26,80,10,0x7de0b5,0xe8fff4,{dur:1.4,R:4});
def('luz','lchain','Light: Chain of Radiance','chain',18,60,6,0xfff2a0,0xffffff,{n:6});def('luz','lspears','Light: Hundred Holy Spears','rain',34,110,16,0xfff2a0,0xffffff,{n:12,sh:'spike'});
def('anti','adash','Anti-Magia: Investida Negra','dash',14,70,5,0xff2040,0x111111,{dist:10,end:'nova',dark:1});def('anti','acrush','Anti-Magia: Esmagamento do Demônio','spikes',30,120,12,0x1a0006,0xff2040,{n:9});
def('kotodama','kbind','Kotodama: "Pare!"','prison',20,60,10,0xc060ff,0xffffff,{dur:2.4});def('kotodama','kecho','Kotodama: Eco das Palavras','nova',24,80,9,0xc060ff,0xf0d0ff,{R:10.5});
def('sangue','bthorns','Blood: Crimson Thorn Field','spikes',22,74,8,0xff2a46,0x5a0010,{n:9});def('sangue','bdrain','Blood: Life Drain','chain',26,70,12,0xff2a46,0xffb0b8,{n:5,heal:1});
def('sonhos','sobutter','Dream: Butterfly Swarm','volley',18,56,6,0xc888ff,0xffd0ff,{n:8,sh:'petal',spin:1,spread:1});def('sonhos','solull','Dream: Lullaby Field','field',26,40,14,0xc888ff,0xffe0ff,{R:5,dur:4,stun:.5,k:.15});
def('espacial','escube','Space: Dimensional Cubes','volley',18,58,6,0x6ad8ff,0xffffff,{n:6,sh:'cube',spin:1});def('espacial','esfold','Space: Space Fold Strike','blink',22,80,8,0x6ad8ff,0xffffff,{n:3});
def('nenhum','nkiai','Grito de Guerra','buff',0,0,18,0xe8e8e8,0xffd23f,{dmg:.25,spd:.2,dur:8});def('nenhum','nrush','Rajada de Socos','combo',0,40,7,0xe8e8e8,0xffffff,{n:8});
def('leao','lsun','Flame: Lion Sun Burst','nova',30,110,12,0xff6a1e,0xffd060,{R:9,ef:{b:1}});def('leao','lmane','Flame: Mane of the Lion King','buff',26,0,22,0xff6a1e,0xffd060,{dmg:.3,spd:.2,dur:10});
def('algodao','cclouds','Cotton: Cloud Bombs','rain',20,60,9,0xffd6e8,0xffffff,{n:8,sh:'orb'});def('algodao','cwall','Cotton: Fluffy Fortress','wall',22,0,16,0xffd6e8,0xffffff,{def:.4,dur:6});
def('bzesp','bzcut','Spatial: Dimensional Cut','lance',26,90,9,0x6a4aff,0xffffff,{len:20});
def('zbunion','zbspikes','Union: Bone Spatial Thorns','spikes',30,100,10,0xe8e0d0,0x6a4aff,{n:10});def('zbunion','zbstorm','Union: Spatial Bone Storm','volley',36,110,14,0xe8e0d0,0x6a4aff,{n:10,sh:'spike',spread:1});
// ---------------- registro: lançar, pose, ícone, alcance ----------------
for(const t in NEW){const o=NEW[t];X.reg(t,(d,dx,dz)=>{try{A[o.a](d,o)}catch(e){try{ERR122(e)}catch(_){}}if(o.heal){P.hp=Math.min(P.mhp,P.hp+d*.4)}});try{ANI[o.nm]=POSE[o.a]}catch(e){}try{SKI[o.nm]=IC[o.a]}catch(e){}try{RNG[t]=RG[o.a]}catch(e){}try{TAG82[o.nm]='A'}catch(e){}}
const E=t=>{const o=NEW[t];return[o.nm,o.mp,o.dmg,t,null,o.cd]};
// ---------------- LUCK: lista normal com 8 ----------------
function lkBase(){const s=GR.raio.s,by={};s.concat(lkBase.keep||[]).forEach(x=>{if(x&&x[3])by[x[3]]=x});lkBase.keep=Object.values(by);const ord=['lkarrow','lksph','lkstep','lkcan','lklance','lkera','lknet','lkcanb'];return ord.map(k=>by[k]||(NEW[k]?E(k):null)).filter(Boolean)}
try{const b=lkBase();GR.raio.s.length=0;b.forEach(x=>GR.raio.s.push(x));SKLG.raio=[1,5,10,16,22,30,34,42]}catch(e){}
const BASE8=GR.raio.s.map(x=>x.slice());X.LKBASE=BASE8;
// entradas das formas (as 4 antigas do Despertado já estão registradas no V129)
const OLD129={lkphant:['Fantasma Relâmpago',30,40,6],lkbarr:['Rajada de Trovões',32,70,8],lkgod:['Aniquilação Divina',44,170,16],lkjudge:['Julgamento do Deus Trovão',48,150,18]};
function entry(t,black){if(NEW[t])return E(t);const m=OLD129[t];return[(black?'Relâmpago Negro: ':'Relâmpago Despertado: ')+m[0],m[1],Math.round(m[2]*(black?1.25:1)),t,null,m[3]]}
const SETS={beast:BEAST,battle:BATTLE,black:BLACK};
const FS={form:null};X.FS138=FS;
function setList(arr){const s=GR.raio.s;s.length=0;arr.forEach(x=>s.push(x));try{buildBtns()}catch(e){}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(P.g&&GR.raio){const f=(P.g.id=='raio'&&X.L)?X.L.form:null;if(f!==FS.form){FS.form=f;if(f&&SETS[f]){setList(SETS[f].map(t=>entry(t,f=='black')));try{toast(f=='beast'?'⚡ Demônio do Trovão: suas 8 magias mudaram!':f=='black'?'⚡ Relâmpago Negro: suas 8 magias mudaram!':'⚡ Demônio de Batalha: suas 8 magias mudaram!')}catch(_){}}else setList(BASE8.map(x=>x.slice()))}
  else if(f&&SETS[f]&&GR.raio.s[0]&&GR.raio.s[0][3]!==SETS[f][0]){setList(SETS[f].map(t=>entry(t,f=='black')))}}}catch(e){}return r}}
// ---------------- outros grimórios: completa até 8 (mesmo se a lista for recriada depois) ----------------
const ADD8={fogo:['fphoenix','fpillars'],agua:['abubble','awhirl'],vento:['wfeather','wblades'],luz:['lchain','lspears'],anti:['adash','acrush'],kotodama:['kbind','kecho'],sangue:['bthorns','bdrain'],sonhos:['sobutter','solull'],espacial:['escube','esfold'],nenhum:['nkiai','nrush'],leao:['lsun','lmane'],algodao:['cclouds','cwall'],bzesp:['bzcut'],zbunion:['zbspikes','zbstorm']};
function ensure8(){for(const g in ADD8){const G=GR[g];if(!G||!Array.isArray(G.s))continue;for(const t of ADD8[g]){if(G.s.length>=8)break;if(!G.s.some(s=>s&&s[3]===t))G.s.push(E(t))}
  try{const L=SKLG[g];if(Array.isArray(L)&&L.length>=6&&L.length<G.s.length){const last=L[L.length-1]||30;while(L.length<G.s.length)L.push(Math.min(50,last+4*(L.length-5)))}}catch(e){}}}
ensure8();X.ensure8=ensure8;
{const _c=cast;cast=function(){try{ensure8()}catch(e){}return _c.apply(this,arguments)}}
{const _r=renderSkills;renderSkills=function(){try{ensure8()}catch(e){}return _r.apply(this,arguments)}}
{const _u=tUpdate;let k=0;tUpdate=function(dt){const r=_u.apply(this,arguments);if(++k%90==0)try{ensure8()}catch(e){}return r}}
try{buildBtns()}catch(e){}
})();

