// ===================== V93 · Asta (golpes e 4 espadas), Zagred (Kotodama) e Rainha das Bruxas (Sangue + Foice) =====================
// As magias antigas continuam no código; só saíram da lista de 6 de cada grimório.
{
const rnd=(a,b)=>a+Math.random()*(b-a),Q=()=>KQ();
// ---------------- kit comum ----------------
const H=window.H93={};
H.near=(x,z,r,skip)=>{let b=null,bd=1e9;for(const e of enemies){if(e.hp<=0||e.gwx||(skip&&skip.has(e)))continue;const d=Math.hypot(e.x-x,e.z-z);if(d<r&&d<bd){bd=d;b=e}}return b};
H.hitR=(x,z,R,d,ef,set,pvp=true)=>{const L=[];for(const e of enemies){if(e.hp<=0||(set&&set.has(e)))continue;if(Math.hypot(e.x-x,e.z-z)<R){hitE(e,d,ef);L.push(e);if(set)set.add(e)}}if(pvp)pvpHit(x,z,R,d);return L};
H.shotsIn=(x,z,R)=>eshots.filter(q=>q.m&&Math.hypot(q.m.position.x-x,q.m.position.z-z)<R);
H.eat=(x,z,R,fx)=>{let n=0;for(let i=eshots.length-1;i>=0;i--){const q=eshots[i];if(!q.m)continue;if(Math.hypot(q.m.position.x-x,q.m.position.z-z)<R){if(fx)fx(q.m.position);S.remove(q.m);eshots.splice(i,1);n++}}return n};
// projétil teleguiado genérico (usado por reflexos, cópias, bichos)
H.bolt=(pos,col,d,o={})=>{const m=o.mesh||(()=>{const g=new T.Group();g.add(new T.Mesh(new T.SphereGeometry(o.r||.16,10,8),BM(o.core||0xffffff)));g.add(new T.Mesh(new T.SphereGeometry((o.r||.16)*2.2,10,8),GLM(col,.5)));return g})();m.position.copy(pos);S.add(m);let e=o.e||H.near(pos.x,pos.z,o.range||30,o.skip);const v=new T.Vector3(o.vx||0,0,o.vz||1).normalize();const sp=o.sp||30;let life=o.life||1.6;
 kfx({u:(q,dt)=>{life-=dt;if(e&&e.hp>0){const ax=e.x-m.position.x,az=e.z-m.position.z,L=Math.hypot(ax,az)||1;v.x+=(ax/L-v.x)*Math.min(1,dt*7);v.z+=(az/L-v.z)*Math.min(1,dt*7);v.normalize()}m.position.x+=v.x*sp*dt;m.position.z+=v.z*sp*dt;m.position.y+=((1.3-m.position.y)*5)*dt;m.rotation.y=Math.atan2(v.x,v.z);
  if(Math.random()<.8*Q())fxp({x:m.position.x,y:m.position.y,z:m.position.z,c:col,n:1,sp:.8,sz:.12,life:.3});const h=H.near(m.position.x,m.position.z,1.1);if(h||life<=0){if(h){hitE(h,d,o.ef);if(o.onHit)o.onHit(h)}pvpHit(m.position.x,m.position.z,1.1,d);kShock(m.position.x,m.position.z,1.3,col,.22,1.2);fxp({x:m.position.x,y:1.2,z:m.position.z,c:col,n:Math.round(8*Q()),sp:4,sz:.16,life:.4});return false}return true},end:()=>{if(o.keep)S.remove(m);else kDispose(m)}});return m};
// reflete projéteis inimigos (viram projéteis seus)
H.reflect=(x,z,R,col,d,max)=>{let n=0;for(let i=eshots.length-1;i>=0;i--){const q=eshots[i];if(!q.m)continue;if(Math.hypot(q.m.position.x-x,q.m.position.z-z)<R){eshots.splice(i,1);n++;H.bolt(q.m.position.clone(),col,d,{mesh:q.m,keep:1,vx:-q.vx,vz:-q.vz,sp:Math.max(30,Math.hypot(q.vx,q.vz)*2.5)});if(max&&n>=max)break}}return n};
// meia-lua de corte (mesh) — vertical (v=1) ou horizontal
H.crescent=(R,w,col,core,arc)=>{const g=new T.Group(),A=arc||Math.PI*.9;const a=new T.Mesh(new T.RingGeometry(R-w,R,40,1,-A/2+Math.PI/2,A),GLM(col,.85));const b=new T.Mesh(new T.RingGeometry(R-w*.45,R-w*.12,40,1,-A/2+Math.PI/2,A),BM(core||0xffffff));b.material.transparent=true;const c=new T.Mesh(new T.RingGeometry(R-w*1.8,R-w*.9,40,1,-A/2+Math.PI/2,A),GLM(col,.3));g.add(c,a,b);[a,b,c].forEach(m=>m.material.side=T.DoubleSide);return g};
// onda que voa em linha reta, atravessa e acerta uma vez cada alvo
H.wave=(mesh,x,y,z,dx,dz,sp,range,w,d,ef,o={})=>{S.add(mesh);const hit=new Set();let dist=0;mesh.position.set(x,y,z);mesh.rotation.y=Math.atan2(dx,dz);
 kfx({u:(q,dt)=>{const st=sp*dt;dist+=st;mesh.position.x+=dx*st;mesh.position.z+=dz*st;const u=dist/range;if(o.grow)mesh.scale.setScalar(1+u*o.grow);mesh.traverse(m=>{if(m.material&&m.material.opacity!=null){m.material._o=m.material._o??m.material.opacity;m.material.opacity=m.material._o*Math.min(1,(1-u)*3)}});
  for(const e of enemies){if(e.hp<=0||hit.has(e))continue;const ex=e.x-mesh.position.x,ez=e.z-mesh.position.z;if(Math.hypot(ex,ez)<w){hit.add(e);hitE(e,d,ef);if(o.onHit)o.onHit(e)}}if(!o.nopvp)pvpHit(mesh.position.x,mesh.position.z,w,d*.6);
  if(o.cut)H.eat(mesh.position.x,mesh.position.z,w,p=>kShock(p.x,p.z,.8,o.col||0xffffff,.18,p.y));if(o.tick)o.tick(mesh,u,dt);return dist<range},end:()=>kDispose(mesh)});return hit};
H.sfx=w=>{try{kVoice(w)}catch(e){}};
H.ghostPos=()=>{};

// ================================================================================
//                                 ASTA · ANTI-MAGIA
// ================================================================================
const SWD=()=>{try{return wpnSword()}catch(e){return 'slayer'}};
const swordOn=()=>{try{if(sword&&P.g&&P.g.id=='anti'){P.sword=true;sword.visible=true}}catch(e){}};
function antiTrail(x,y,z,n){for(let k=0;k<n;k++)fxp({x:x+rnd(-.3,.3),y:y+rnd(-.3,.3),z:z+rnd(-.3,.3),c:k%3==0?AWH:k%3==1?AR:0x140006,n:1,sp:.8,sz:rnd(.1,.24),life:rnd(.3,.6),up:.6})}
function hornCone(len,r,col){const g=new T.Group();const a=new T.Mesh(new T.ConeGeometry(r,len,18,1,true),aMat(aTexStreak(),0x0a0004,.75,false));a.rotation.x=Math.PI/2;a.position.z=len/2;const b=new T.Mesh(new T.ConeGeometry(r*1.25,len*1.08,18,1,true),new T.MeshBasicMaterial({color:col,wireframe:true,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false}));b.rotation.x=Math.PI/2;b.position.z=len/2;const c=new T.Mesh(new T.ConeGeometry(r*.35,len*.9,10),BM(AWH));c.rotation.x=Math.PI/2;c.position.z=len*.45;g.add(a,b,c);Object.assign(UD(g),{a,b,c});return g}
// 1 · Estocada do Touro: avança com as espadas apontadas; anula magias que tocam nas lâminas
function aBull(d,dx,dz,one){aWord(one?'ESTOCADA DO TOURO: UM CHIFRE!':'ESTOCADA DO TOURO!');aEyes(1);swordOn();startPose('dash');const pre=one?.32:.12,dur=one?.42:.32,sp=one?52:40;let go=false,hit=new Set();
 const horns=[];const nh=one?1:2;for(let k=0;k<nh;k++){const h=hornCone(one?3.2:2.1,one?.55:.42,AR);S.add(h);horns.push(h)}const aura=aCircle(1.2,'w');S.add(aura);
 kfx({u:(q,dt)=>{const t=q.t,fx=Math.sin(P.f),fz=Math.cos(P.f);kCircleTick(aura,dt,Math.min(1,t/.12)*(t>pre+dur?Math.max(0,1-(t-pre-dur)*5):1),Math.max(0,Math.sin(t*20))*.4);aura.position.set(P.x+fx*.3,1.3+P.y,P.z+fz*.3);aura.rotation.y=P.f;
  if(t<pre){antiTrail(P.x,1.2,P.z,Math.round(3*Q()));P.lock=Math.max(P.lock||0,.05)}
  else if(!go){go=true;aDash(sp,dur);kShock(P.x,P.z,2.2,AR,.25,1);P.shake=Math.max(P.shake,one?.2:.1)}
  horns.forEach((h,k)=>{const side=nh==1?0:(k?.32:-.32);h.position.set(P.x+fx*.5+fz*side,1.25+P.y,P.z+fz*.5-fx*side);h.rotation.y=P.f;const u=UD(h);u.b.rotation.z+=dt*12;h.scale.setScalar(t<pre?Math.min(1,t/pre):1);h.visible=t<pre+dur+.1});
  if(go&&t<pre+dur){if(CFG.fx&&Math.random()<.5)ghostOf(0x2a0008);antiTrail(P.x,1.2,P.z,Math.round(4*Q()));const hx=P.x+fx*(one?2.6:1.8),hz=P.z+fz*(one?2.6:1.8);H.hitR(hx,hz,one?1.9:1.6,d,{st:one?.6:.3},hit);const n=H.eat(hx,hz,2.4,p=>{kShock(p.x,p.z,1,AWH,.2,p.y);aDisint(p.x,p.y,p.z,6,.5)});if(n)aWord('ANULADO!')}
  return t<pre+dur+.25},end:()=>{horns.forEach(kDispose);kDispose(aura);aEyes(0)}})}
// 3 · Black Slash: corte negro à distância da Habitadora
function aBSlash(d,dx,dz){aWord('BLACK SLASH!');aEyes(1);swordOn();startPose('throw');const h=aHand();const dbl=SWD()=='dweller';
 const fire=(off,dl)=>tmr.push({t:dl,f:()=>{const m=H.crescent(2.6,.5,AR,AWH,Math.PI*.95);m.rotation.z=off;const g=new T.Group();g.add(m);m.rotation.y=0;H.wave(g,P.x+Math.sin(P.f)*1.2,1.3+P.y,P.z+Math.cos(P.f)*1.2,Math.sin(P.f),Math.cos(P.f),34,28,2.2,d,{st:.2},{cut:1,col:AR,tick:(mm,u)=>{if(Math.random()<.7*Q())antiTrail(mm.position.x,mm.position.y,mm.position.z,1)}});kShock(P.x,P.z,1.4,AR,.18,1.3)}});
 fire(-.2,.12);if(dbl){fire(.5,.26);fire(-.7,.4)}
 kfx({u:q=>q.t<.5,end:()=>aEyes(0)})}
// 4 · Black Divider: a Matadora cresce de forma monstruosa e corta tudo na frente (a parte achatada rebate feitiços)
function aDivider(d,dx,dz){aWord('BLACK DIVIDER!');aEyes(1);swordOn();startPose('slam');const blade=new T.Group();const core=new T.Mesh(new T.BoxGeometry(.5,1,.08),BM(ABK));const glow=new T.Mesh(new T.BoxGeometry(.9,1.04,.2),GLM(AR,.6));const edge=new T.Mesh(new T.BoxGeometry(.1,1.02,.1),BM(AWH));edge.position.x=.24;core.position.y=glow.position.y=edge.position.y=.5;blade.add(glow,core,edge);S.add(blade);let cut=false;
 kfx({u:(q,dt)=>{const t=q.t,fx=Math.sin(P.f),fz=Math.cos(P.f),L=Math.min(14,t/.4*14);if(t<.55){H.reflect(P.x+fx*1.5,P.z+fz*1.5,3,AR,d*.5)}
  const sw=t<.45?-.4:Math.min(1.75,-.4+(t-.45)*14);blade.position.set(P.x+fx*.4,1.5+P.y,P.z+fz*.4);blade.rotation.set(0,P.f,0);blade.rotateX(Math.PI/2-sw);blade.scale.set(1+L*.06,L,1);glow.material.opacity=.6+.3*Math.sin(t*30);
  if(Math.random()<.9*Q()){const k=Math.random()*L;fxp({x:P.x+fx*k,y:1.5+Math.random()*2,z:P.z+fz*k,c:Math.random()<.5?AR:0x140006,n:1,sp:1,sz:.2,life:.4})}
  if(!cut&&t>.52){cut=true;P.shake=Math.max(P.shake,.35);fSound&&0;const hit=new Set();for(let k=1;k<=14;k+=1.2){H.hitR(P.x+fx*k,P.z+fz*k,1.8,d,{st:.5},hit,false)}pvpHit(P.x+fx*6,P.z+fz*6,3,d);H.eat(P.x+fx*7,P.z+fz*7,8);
   for(let k=2;k<14;k+=2)kShock(P.x+fx*k,P.z+fz*k,1.6,AR,.35,.3);const sl=new T.Mesh(new T.PlaneGeometry(.5,14),aMat(null,AR,.9));sl.rotation.x=-Math.PI/2;sl.rotation.z=-P.f;sl.position.set(P.x+fx*7,.06,P.z+fz*7);S.add(sl);kfx({u:f=>{sl.material.opacity=.9*(1-f.t/1.2);sl.scale.x=1+f.t*2;return f.t<1.2},end:()=>kDispose(sl)})}
  return t<.85},end:()=>{kDispose(blade);aEyes(0)}})}
// 5 · Black Hurricane: gira com as espadas, vira um tornado que dissipa feitiços
function aHurricane(d){aWord('BLACK HURRICANE!');aEyes(1);swordOn();startPose('spin');const T0=new T.Group(),lay=[];for(let k=0;k<4;k++){const c=new T.Mesh(new T.CylinderGeometry(1.2+k*.9,.5+k*.5,3.6+k*.6,28,1,true),aMat(aTexStreak(),k%2?AR:0x0a0004,k%2?.45:.6,k%2==1));c.position.y=1.8+k*.2;T0.add(c);lay.push(c)}S.add(T0);const hit=new Map();
 kfx({u:(q,dt)=>{const t=q.t,g=t<.25?t/.25:t>2.2?Math.max(0,1-(t-2.2)/.3):1;T0.position.set(P.x,P.y,P.z);T0.scale.set(g,1,g);lay.forEach((c,k)=>{c.rotation.y+=dt*(9-k*1.5)*(k%2?-1:1)});pm.rotation.y+=dt*22;
  if(Math.random()<1.4*Q()){const a=Math.random()*6.28,r=rnd(1,4.4);antiTrail(P.x+Math.cos(a)*r,rnd(.3,4),P.z+Math.sin(a)*r,1)}
  for(const e of enemies){if(e.hp<=0)continue;if(Math.hypot(e.x-P.x,e.z-P.z)<4.6){const lt=hit.get(e)||0;if(t-lt>.28){hit.set(e,t);hitE(e,d,{sl:1});kb(e,(e.x-P.x)||.1,(e.z-P.z)||.1,1.6,.1)}}}
  if(((t*10)|0)%3==0)pvpHit(P.x,P.z,4.6,d*.4);H.eat(P.x,P.z,5.5,p=>{kShock(p.x,p.z,.9,AWH,.18,p.y);aDisint(p.x,p.y,p.z,5,.4)});return t<2.5},end:()=>{kDispose(T0);aEyes(0)}})}
// 6 · Black Meteorite: envolto em antimagia, com asas, avança em alta velocidade e MUDA DE DIREÇÃO no meio
function aMeteorite(d){aWord('BLACK METEORITE!');aEyes(1);swordOn();const sh=new T.Group();const c1=new T.Mesh(new T.SphereGeometry(1.1,18,14),aMat(aTexStreak(),0x0a0004,.6,false)),c2=new T.Mesh(new T.IcosahedronGeometry(1.35,1),new T.MeshBasicMaterial({color:AR,wireframe:true,transparent:true,opacity:.5,blending:T.AdditiveBlending,depthWrite:false})),tail=new T.Mesh(new T.ConeGeometry(1,4.5,18,1,true),aMat(aTexStreak(),AR,.55));tail.rotation.x=-Math.PI/2;tail.position.z=-2.6;sh.add(c1,c2,tail);
 const W=[];try{for(const s of[-1,1]){const w=v89Wing(1.6,0x140008,0x050004,AR);w.position.set(s*.25,.3,-.3);w.scale.x=s;sh.add(w);W.push(w)}}catch(e){}S.add(sh);const hit=new Set();let legs=0,lt=0;
 kfx({u:(q,dt)=>{const t=q.t;if(t-lt>.32&&legs<4){lt=t;legs++;aDash(46,.34,1);kShock(P.x,P.z,2.4,AR,.25,1.2);P.shake=Math.max(P.shake,.12);hit.clear();if(legs>1)aWord('↻')}
  sh.position.set(P.x,1.3+P.y,P.z);sh.rotation.y=P.f;c2.rotation.x+=dt*6;W.forEach((w,k)=>w.rotation.z=(k?1:-1)*(.3+Math.sin(t*20)*.25));if(CFG.fx&&Math.random()<.6)ghostOf(0x2a0008);antiTrail(P.x-Math.sin(P.f),1.3,P.z-Math.cos(P.f),Math.round(4*Q()));
  H.hitR(P.x,P.z,2.2,d*.6,{st:.4},hit);H.eat(P.x,P.z,3,p=>{kShock(p.x,p.z,1,AWH,.2,p.y)});pvpHit(P.x,P.z,2,d*.2);
  if(t>1.36&&!q.fin){q.fin=1;P.shake=Math.max(P.shake,.3);kShock(P.x,P.z,4.5,AR,.4,.4);kShock(P.x,P.z,3,AWH,.3,.6);H.hitR(P.x,P.z,4.5,d,{st:1})}
  return t<1.5},end:()=>{kDispose(sh);aEyes(0)}})}
// UNIÃO · Corte Finito Equinocial: golpe gigante com a katana que vai longe e só corta o que Asta quer (inimigos)
function uEquinox(d,dx,dz){aWord('CORTE FINITO: EQUINOCIAL!',1);aEyes(1);startPose('throw');const kat=SWD()=='katana'?1.35:1;const sel=new Set();
 for(const e of enemies){if(e.hp>0&&Math.hypot(e.x-P.x,e.z-P.z)<60){const a=Math.atan2(e.x-P.x,e.z-P.z)-P.f,aa=Math.atan2(Math.sin(a),Math.cos(a));if(Math.abs(aa)<.5)sel.add(e)}}
 const marks=[...sel].slice(0,12).map(e=>{const m=new T.Mesh(new T.TorusGeometry(.7,.05,6,32),GLM(0xffd0d0,.9));m.rotation.x=-Math.PI/2;m.position.set(e.x,.2,e.z);S.add(m);return{m,e}});
 kfx({u:(q,dt)=>{const t=q.t;marks.forEach(o=>{o.m.position.set(o.e.x,.2,o.e.z);o.m.scale.setScalar(1.6-Math.min(1,t/.4)*.6);o.m.rotation.z+=dt*4});
  if(t>.4&&!q.go){q.go=1;const m=H.crescent(7,1.1,AR,AWH,Math.PI*.7),g=new T.Group();m.rotation.z=Math.PI/2;g.add(m);const m2=H.crescent(6.2,.25,0xffffff,AWH,Math.PI*.7);m2.rotation.z=Math.PI/2;g.add(m2);P.shake=Math.max(P.shake,.3);
   H.wave(g,P.x+Math.sin(P.f)*2,1.4+P.y,P.z+Math.cos(P.f)*2,Math.sin(P.f),Math.cos(P.f),48,60,5,0,null,{nopvp:1,tick:(mm)=>{if(Math.random()<Q())antiTrail(mm.position.x,mm.position.y+rnd(-3,3),mm.position.z,2);for(const o of marks){if(!o.hit&&Math.hypot(o.e.x-mm.position.x,o.e.z-mm.position.z)<4){o.hit=1;hitE(o.e,d*kat,{st:1});kShock(o.e.x,o.e.z,2,AR,.3,1.3)}}}})}
  return t<1.6},end:()=>{marks.forEach(o=>kDispose(o.m));aEyes(0)}})}
// UNIÃO · Demon Slash Corte Finito: corta até o espaço distorcido (abre uma fenda no espaço)
function uDemonSlash(d,dx,dz){aWord('DEMON SLASH: CORTE FINITO!',1);aEyes(1);startPose('slam');const kat=SWD()=='katana'?1.35:1,fx=Math.sin(P.f),fz=Math.cos(P.f),cx=P.x+fx*9,cz=P.z+fz*9;
 const rift=new T.Group(),top=new T.Mesh(new T.PlaneGeometry(22,6),DMt(0x020003,.0)),bot=top.clone();bot.material=DMt(0x020003,0);const line=new T.Mesh(new T.PlaneGeometry(22,.12),BM(AWH));const glow=new T.Mesh(new T.PlaneGeometry(22,.9),GLM(AR,0));rift.add(top,bot,glow,line);rift.position.set(cx,2.4,cz);rift.rotation.y=P.f+Math.PI/2;rift.rotateZ(-.35);S.add(rift);const shards=[];
 kfx({u:(q,dt)=>{const t=q.t;const op=t<.35?t/.35:t>1.4?Math.max(0,1-(t-1.4)/.4):1;line.scale.x=Math.min(1,t/.2);glow.material.opacity=.7*op;const gap=Math.max(0,(t-.35))*1.6;top.position.y=3.05+gap;bot.position.y=-3.05-gap;top.material.opacity=bot.material.opacity=.55*op*(t>.35?1:0);
  if(t>.35&&!q.cut){q.cut=1;P.shake=Math.max(P.shake,.4);const hit=new Set();for(let k=-10;k<=10;k+=1.5){const x=cx+Math.cos(P.f)*k,z=cz-Math.sin(P.f)*k;H.hitR(x,z,2.2,d*kat,{st:1.2},hit,false)}pvpHit(cx,cz,5,d);H.eat(cx,cz,12);
   for(const e of hit){e.sh=0;e.rg=0}for(let k=0;k<Math.round(16*Q());k++){const s=new T.Mesh(new T.TetrahedronGeometry(rnd(.15,.4)),k%2?BM(ABK):GLM(AR,.9));s.position.set(cx+rnd(-8,8),rnd(.5,4),cz+rnd(-3,3));S.add(s);shards.push({s,v:[rnd(-3,3),rnd(1,5),rnd(-3,3)]})}}
  shards.forEach(o=>{o.s.position.x+=o.v[0]*dt;o.s.position.y+=o.v[1]*dt;o.s.position.z+=o.v[2]*dt;o.v[1]-=6*dt;o.s.rotation.x+=dt*5});
  return t<1.85},end:()=>{kDispose(rift);shards.forEach(o=>kDispose(o.s));aEyes(0)}})}

// ---------------- poderes das 4 espadas (somam com os efeitos que já existiam) ----------------
const SWP={slayer:'Matadora: o fio corta magia e a parte achatada REBATE feitiços que chegam na sua frente. Black Divider mais forte.',dweller:'Habitadora: ABSORVE projéteis que encostam em você e devolve como corte negro à distância; Black Slash sai em 3 ondas.',destroyer:'Destruidora: REMOVE EFEITOS — tira atordoamentos e controles de você e apaga escudos e regeneração dos inimigos que você acerta.',katana:'Katana do Yami: na União Demoníaca os cortes só atingem quem o Asta quer (não acertam outros jogadores) e os Cortes Finitos ficam 35% mais fortes.'};
try{for(const k in SWP){if(WPN82[k]){WPN82[k].sp=WPN82[k].sp+' · '+SWP[k]}}}catch(e){}
let swT=0;
function swordTick(dt){if(!P.g||P.g.id!='anti'||!P.sword||P.dead>0)return;swT-=dt;const k=SWD(),fx=Math.sin(P.f),fz=Math.cos(P.f);
 if(k=='slayer'){for(let i=eshots.length-1;i>=0;i--){const q=eshots[i];if(!q.m)continue;const ex=q.m.position.x-P.x,ez=q.m.position.z-P.z,L=Math.hypot(ex,ez);if(L<1.8&&(ex*fx+ez*fz)/(L||1)>.2){eshots.splice(i,1);kShock(q.m.position.x,q.m.position.z,.9,AWH,.18,q.m.position.y);H.bolt(q.m.position.clone(),AR,30,{mesh:q.m,keep:1,vx:-q.vx,vz:-q.vz,sp:36});if(swT<=0){swT=1.2;aWord('REBATIDO!')}}}}
 else if(k=='dweller'){for(let i=eshots.length-1;i>=0;i--){const q=eshots[i];if(!q.m)continue;if(Math.hypot(q.m.position.x-P.x,q.m.position.z-P.z)<1.5){eshots.splice(i,1);aDisint(q.m.position.x,q.m.position.y,q.m.position.z,6,.4);S.remove(q.m);tmr.push({t:.25,f:()=>{const e=H.near(P.x,P.z,26);const m=H.crescent(1.6,.35,AR,AWH,Math.PI*.9),g=new T.Group();g.add(m);const ax=e?e.x-P.x:fx,az=e?e.z-P.z:fz,L=Math.hypot(ax,az)||1;H.wave(g,P.x,1.3,P.z,ax/L,az/L,32,26,1.6,26,null,{cut:1})}});if(swT<=0){swT=1.2;aWord('ABSORVIDO!')}}}}
 else if(k=='destroyer'){if(P.lock>.3&&!(P.dt2>0)){P.lock=0;aDisint(P.x,1.2,P.z,10,.8);if(swT<=0){swT=2;aWord('EFEITO REMOVIDO!')}}}}
{const _he=hitE;hitE=function(e,d,ef){try{if(P.g&&P.g.id=='anti'&&P.sword&&SWD()=='destroyer'){if(e.sh)e.sh=0;if(e.rg)e.rg=0;if(e.regen)e.regen=0}}catch(_){}return _he.apply(this,arguments)}}
{const _ph=pvpHit;pvpHit=function(x,z,r,d){try{if(P.union&&P.g&&P.g.id=='anti'&&SWD()=='katana')return}catch(_){}return _ph.apply(this,arguments)}}

// ================================================================================
//                               ZAGRED · KOTODAMA
// ================================================================================
const KV=0xb040ff,KV2=0xe8b0ff,KD=0x1a0626;
const kw=w=>{try{kWord(w)}catch(e){try{xWord(w,'dream')}catch(_){}}};
function kRunes(x,y,z,n){for(let k=0;k<n;k++)fxp({x:x+rnd(-.5,.5),y:y+rnd(-.3,.5),z:z+rnd(-.5,.5),c:k%2?KV:KV2,n:1,sp:1.2,sz:.12,life:.6,up:1.4})}
// 1 · "Volta!": tudo que foi lançado contra ele volta para quem lançou
function kReturn(d){kw('VOLTA!');startPose('push');const n=H.reflect(P.x,P.z,13,KV,d*1.3);kShock(P.x,P.z,6,KV,.4,1.2);kShock(P.x,P.z,3.5,KV2,.3,1.6);
 const hit=H.hitR(P.x,P.z,5,d*.6,null,null,true);hit.forEach(e=>kb(e,(e.x-P.x)||.1,(e.z-P.z)||.1,6,.25));kRunes(P.x,1.5,P.z,Math.round(14*Q()));if(n)toast('Kotodama: '+n+' ataque(s) voltaram para quem lançou.')}
// 2 · Chuva de espadas: metade REAIS (aço), metade feitas de magia
function kSwordRain(d,dx,dz){kw('CHOVAM ESPADAS!');startPose('raise');let tg=null;try{tg=chronoTarget(22)}catch(e){}const cx=tg?tg.x:P.x+dx*10,cz=tg?tg.z:P.z+dz*10,N=Math.round(12*Q())+6,S2=[];const ci=fCircle(4.5,'g');ci.position.set(cx,.08,cz);S.add(ci);
 const steel=new T.MeshToonMaterial({color:0xc8ccd6,gradientMap:gmap}),hilt=new T.MeshToonMaterial({color:0x3a2a1a,gradientMap:gmap});
 for(let k=0;k<N;k++){const real=k%2==0,g=new T.Group();const bl=new T.Mesh(new T.BoxGeometry(.12,1.5,.03),real?steel:GLM(KV,.85));bl.position.y=-.75;const tip=new T.Mesh(new T.ConeGeometry(.08,.3,4),real?steel:GLM(KV2,.9));tip.rotation.x=Math.PI;tip.position.y=-1.62;const gd=new T.Mesh(new T.BoxGeometry(.42,.06,.08),real?hilt:GLM(KV2,.9)),hd=new T.Mesh(new T.CylinderGeometry(.04,.04,.34,6),real?hilt:GLM(KV,.8));hd.position.y=.18;g.add(bl,tip,gd,hd);if(!real){const gl=new T.Mesh(new T.BoxGeometry(.3,1.7,.1),GLM(KV,.3));gl.position.y=-.8;g.add(gl)}
  const a=Math.random()*6.28,r=Math.sqrt(Math.random())*4.2;g.position.set(cx+Math.cos(a)*r,14+rnd(0,6),cz+Math.sin(a)*r);g.rotation.y=Math.random()*3;S.add(g);S2.push({g,dl:k*.06+rnd(0,.15),done:0})}
 kfx({u:(q,dt)=>{const t=q.t;kCircleTick(ci,dt,Math.min(1,t/.2)*(t>2?Math.max(0,1-(t-2)*3):1),Math.max(0,Math.sin(t*10))*.3);
  S2.forEach(o=>{if(t<o.dl)return;if(!o.done){o.g.position.y-=dt*34;if(o.g.position.y<1.6){o.done=1;o.g.position.y=1.55;kShock(o.g.position.x,o.g.position.z,1.2,KV,.2,.15);fxp({x:o.g.position.x,y:.3,z:o.g.position.z,c:0xb0a898,n:Math.round(5*Q()),sp:3,sz:.18,life:.4,up:2});H.hitR(o.g.position.x,o.g.position.z,1.3,d,null,null,true)}}else{o.g.rotation.z=Math.sin(t*30)*.02}});return t<2.4},end:()=>{kDispose(ci);S2.forEach(o=>kDispose(o.g))}})}
// 3 · Palavras: Raio! → Fogo! → Terra! (escudo) → Esmague! (o ambiente esmaga)
let KW3=0;
function kWords(d,dx,dz){const w=['RAIO!','FOGO!','TERRA!','ESMAGUE!'][KW3%4];KW3++;kw(w);startPose('push');let tg=null;try{tg=chronoTarget(22)}catch(e){}const cx=tg?tg.x:P.x+dx*9,cz=tg?tg.z:P.z+dz*9;
 if(w=='RAIO!'){for(let k=0;k<3;k++)tmr.push({t:k*.12,f:()=>{const x=cx+rnd(-1.5,1.5),z=cz+rnd(-1.5,1.5);const pts=[];let px=x,pz=z;for(let y=16;y>=0;y-=2){pts.push(new T.Vector3(px,y,pz));px+=rnd(-.6,.6);pz+=rnd(-.6,.6)}pts[pts.length-1].set(x,0,z);const geo=new T.BufferGeometry().setFromPoints(pts),l1=new T.Line(geo,new T.LineBasicMaterial({color:0xffffff,transparent:true})),l2=new T.Line(geo,new T.LineBasicMaterial({color:KV,transparent:true,blending:T.AdditiveBlending}));l2.scale.set(1.02,1,1.02);S.add(l1,l2);kShock(x,z,2.4,KV2,.3,.2);H.hitR(x,z,2.4,d,{st:.5});fLight&&fLight(x,3,z,2,KV2);kfx({u:f=>{l1.material.opacity=l2.material.opacity=Math.max(0,1-f.t/.3)*(Math.random()<.7?1:.3);return f.t<.3},end:()=>{S.remove(l1);S.remove(l2);geo.dispose()}})}})}
 else if(w=='FOGO!'){const b=new T.Mesh(new T.SphereGeometry(1,16,12),fMat(fTexFlame(),FO,.9));b.position.set(cx,1,cz);S.add(b);kShock(cx,cz,3.4,FO,.35,.3);H.hitR(cx,cz,3.4,d*1.2,{b:1});fEmbers(cx,1,cz,Math.round(16*Q()),5,3);kfx({u:f=>{const u=f.t/.5;b.scale.setScalar(.5+3.2*Math.sqrt(Math.min(1,u)));b.material.opacity=.9*(1-u);return u<1},end:()=>kDispose(b)})}
 else if(w=='TERRA!'){const wall=new T.Group(),rock=new T.MeshToonMaterial({color:0x7a6a58,gradientMap:gmap});for(let k=-3;k<=3;k++){const r=new T.Mesh(new T.DodecahedronGeometry(rnd(.6,.9),0),rock);r.position.set(k*.75,rnd(.6,1.6),0);r.scale.y=rnd(1.4,2.2);wall.add(r)}wall.position.set(P.x+dx*1.8,-2.6,P.z+dz*1.8);wall.rotation.y=P.f;S.add(wall);P.sh=Math.max(P.sh||0,4);
  kfx({u:(q,dt)=>{const t=q.t;wall.position.y=Math.min(0,-2.6+t*12);if(t>4)wall.position.y=-(t-4)*6;const fx2=wall.position.x,fz2=wall.position.z;H.eat(fx2,fz2,2.6,p=>kShock(p.x,p.z,.8,0xb0a090,.2,p.y));return t<4.5},end:()=>kDispose(wall)});fxp({x:P.x+dx*1.8,y:.4,z:P.z+dz*1.8,c:0x8a7a66,n:Math.round(14*Q()),sp:4,sz:.25,life:.6,up:3})}
 else{const sl=[],rock=new T.MeshToonMaterial({color:0x6a5e52,gradientMap:gmap});for(const s of[-1,1]){const m=new T.Mesh(new T.BoxGeometry(.6,3.4,4.4),rock);m.position.set(cx+s*6,1.7,cz);S.add(m);sl.push({m,s})}
  kfx({u:(q,dt)=>{const t=q.t;sl.forEach(o=>{o.m.position.x=cx+o.s*Math.max(.35,6-t*14)});if(t>.42&&!q.h){q.h=1;P.shake=Math.max(P.shake,.25);H.hitR(cx,cz,3,d*1.6,{st:1});fxp({x:cx,y:1.5,z:cz,c:0x9a8a76,n:Math.round(20*Q()),sp:6,sz:.3,life:.7,up:3})}return t<1.1},end:()=>sl.forEach(o=>kDispose(o.m))})}
 kRunes(P.x,2,P.z,Math.round(6*Q()))}
// 4 · Cópia: Luz (lanças do Rei Mago) → Dados (quanto mais pontos, mais forte) → Troca (troca de lugar)
let KC=0;
function dieMesh(n){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='#f4ecff';x.fillRect(0,0,64,64);x.fillStyle='#4a1a6a';const P2={1:[[32,32]],2:[[18,18],[46,46]],3:[[16,16],[32,32],[48,48]],4:[[18,18],[46,18],[18,46],[46,46]],5:[[18,18],[46,18],[32,32],[18,46],[46,46]],6:[[18,16],[46,16],[18,32],[46,32],[18,48],[46,48]]};for(const p of P2[n])x.beginPath(),x.arc(p[0],p[1],6,0,6.28),x.fill();const t=new T.CanvasTexture(c);return new T.Mesh(new T.BoxGeometry(.8,.8,.8),new T.MeshBasicMaterial({map:t}))}
function kCopy(d,dx,dz){const k=KC%3;KC++;startPose('raise');let tg=null;try{tg=chronoTarget(24)}catch(e){}
 if(k==0){kw('CÓPIA: LUZ!');const cx=tg?tg.x:P.x+dx*10,cz=tg?tg.z:P.z+dz*10;for(let i=0;i<Math.round(10*Q())+5;i++)tmr.push({t:i*.07,f:()=>{const g=new T.Group(),c=new T.Mesh(new T.CylinderGeometry(.05,.05,2.4,6),BM(0xffffff)),gl=new T.Mesh(new T.ConeGeometry(.22,2.8,6),GLM(0xffe27a,.7));gl.rotation.x=Math.PI;g.add(c,gl);const x=cx+rnd(-3,3),z=cz+rnd(-3,3);g.position.set(x,15,z);S.add(g);kfx({u:(q,dt)=>{g.position.y-=dt*40;if(g.position.y<1.2){kShock(x,z,1.5,0xffe27a,.22,.2);H.hitR(x,z,1.5,d*.7,null);return false}return true},end:()=>kDispose(g)})}})}
 else if(k==1){kw('CÓPIA: DADOS!');const a=1+Math.floor(Math.random()*6),b=1+Math.floor(Math.random()*6),sum=a+b,dd=[dieMesh(a),dieMesh(b)];dd.forEach((m,i)=>{m.position.set(P.x+dx*1.5+(i?.6:-.6),2.4,P.z+dz*1.5);S.add(m)});const e=tg||H.near(P.x,P.z,24);
  kfx({u:(q,dt)=>{const t=q.t;dd.forEach((m,i)=>{if(t<.7){m.rotation.x+=dt*14;m.rotation.y+=dt*11}else{m.rotation.set(0,0,0)}m.position.y=2.4+Math.abs(Math.sin(t*9))*.3*(t<.7?1:0)});if(t>.75&&!q.f){q.f=1;dmgNum(P.x,3.4,P.z,'🎲 '+sum,0,'xp');const pw=d*(.35+sum/12*1.3);if(e&&e.hp>0){H.bolt(new T.Vector3(P.x,2.2,P.z),KV2,pw,{e,r:.1+sum*.03,sp:28})}}return t<1.5},end:()=>dd.forEach(kDispose)})}
 else{kw('CÓPIA: TROCA!');const e=tg||H.near(P.x,P.z,24);if(!e){toast('Nenhum alvo para trocar de lugar.');return}const px=P.x,pz=P.z;kShock(P.x,P.z,1.6,KV,.3,1);kShock(e.x,e.z,1.6,KV,.3,1);kRunes(P.x,1.5,P.z,8);kRunes(e.x,1.5,e.z,8);P.x=e.x;P.z=e.z;pm.position.set(P.x,P.y,P.z);e.x=px;e.z=pz;if(e.m)e.m.position.set(px,0,pz);hitE(e,d*.8,{st:1.2});
  const o2=H.near(P.x,P.z,8,new Set([e]));if(o2){const ox=o2.x,oz=o2.z;o2.x=e.x;o2.z=e.z;if(o2.m)o2.m.position.set(o2.x,0,o2.z);e.x=ox;e.z=oz;if(e.m)e.m.position.set(ox,0,oz);hitE(o2,d*.5,{st:1})}}}
// 5 · Bocas do submundo: bocas abrem pelo corpo e bichos que comem magia e força vital saem delas
function beast(){const g=new T.Group(),sk=new T.MeshToonMaterial({color:0x1a0f24,gradientMap:gmap,emissive:0x12001e});const b=new T.Mesh(new T.SphereGeometry(.45,12,10),sk);b.scale.set(1,.8,1.4);g.add(b);const hd=new T.Mesh(new T.SphereGeometry(.32,10,8),sk);hd.position.set(0,.18,.6);g.add(hd);const jaw=new T.Mesh(new T.ConeGeometry(.28,.5,8),sk);jaw.rotation.x=Math.PI/2;jaw.position.set(0,0,.85);g.add(jaw);
 for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.06,6,5),BM(0xff3af0));e.position.set(s*.14,.3,.85);g.add(e);for(let k=0;k<3;k++){const sp=new T.Mesh(new T.ConeGeometry(.06,.3,4),sk);sp.position.set(s*.2,.4,-.2-k*.25);sp.rotation.z=s*.5;g.add(sp)}}for(let k=0;k<4;k++){const lg=new T.Mesh(new T.CylinderGeometry(.06,.04,.45,5),sk);lg.position.set(k%2?.28:-.28,-.4,k<2?.3:-.3);g.add(lg)}const tth=new T.Mesh(new T.ConeGeometry(.2,.12,8,1,true),BM(0xf0e0ff));tth.rotation.x=Math.PI/2;tth.position.set(0,.05,1.02);g.add(tth);g.scale.setScalar(1.1);return g}
function kMouths(d){kw('ABRAM-SE, BOCAS DO SUBMUNDO!');startPose('cross');const mouths=[],B=[];for(let k=0;k<4;k++){const a=k/4*6.28+.4,m=new T.Mesh(new T.RingGeometry(.12,.3,20),GLM(0xff3af0,.9));const inner=new T.Mesh(new T.CircleGeometry(.12,16),BM(0x050006));m.add(inner);S.add(m);mouths.push({m,a,y:1+k%2*.6})}
 const tgs=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-P.x,e.z-P.z)<20).sort((a,b)=>Math.hypot(a.x-P.x,a.z-P.z)-Math.hypot(b.x-P.x,b.z-P.z)).slice(0,4);
 kfx({u:(q,dt)=>{const t=q.t;mouths.forEach(o=>{const a=o.a+P.f;o.m.position.set(P.x+Math.sin(a)*.55,o.y+P.y,P.z+Math.cos(a)*.55);o.m.lookAt(P.x+Math.sin(a)*3,o.y,P.z+Math.cos(a)*3);o.m.scale.setScalar(Math.min(1.4,t*4)*(t>3.6?Math.max(0,1-(t-3.6)*3):1))});
  if(t>.35&&!q.sp){q.sp=1;for(let k=0;k<Math.max(2,tgs.length);k++){const g=beast(),mo=mouths[k%4];g.position.copy(mo.m.position);S.add(g);B.push({g,e:tgs[k%Math.max(1,tgs.length)]||null,bt:0,ph:Math.random()*6})}}
  B.forEach(o=>{const e=o.e&&o.e.hp>0?o.e:(o.e=H.near(o.g.position.x,o.g.position.z,22));o.g.position.y=.55+Math.abs(Math.sin(t*12+o.ph))*.25;if(e){const ax=e.x-o.g.position.x,az=e.z-o.g.position.z,L=Math.hypot(ax,az)||1;if(L>1.2){o.g.position.x+=ax/L*dt*13;o.g.position.z+=az/L*dt*13}else{o.bt-=dt;if(o.bt<=0){o.bt=.45;hitE(e,d*.45,{sl:1});e.mc=Math.max(e.mc||0,1.2);P.hp=Math.min(P.mhp,P.hp+d*.12);fxp({x:e.x,y:1.4,z:e.z,c:0xff3af0,n:Math.round(5*Q()),sp:2,sz:.12,life:.4});kShock(e.x,e.z,.9,0xff3af0,.18,1)}}o.g.rotation.y=Math.atan2(ax,az)}H.eat(o.g.position.x,o.g.position.z,1.6,p=>kShock(p.x,p.z,.8,0xff3af0,.2,p.y))});
  return t<4},end:()=>{mouths.forEach(o=>kDispose(o.m));B.forEach(o=>{kRunes(o.g.position.x,.6,o.g.position.z,4);kDispose(o.g)})}})}
// 6 · Tridente do Submundo: um monstro gigante sobe atrás dele e crava um tridente enorme
function kTrident(d,dx,dz){kw('VENHA, COLOSSO DO SUBMUNDO!');startPose('raise');P.shake=Math.max(P.shake,.2);let tg=null;try{tg=chronoTarget(26)}catch(e){}const cx=tg?tg.x:P.x+dx*12,cz=tg?tg.z:P.z+dz*12;
 const mon=new T.Group(),sk=new T.MeshToonMaterial({color:0x140a1e,gradientMap:gmap,emissive:0x1a0028});const body=new T.Mesh(new T.SphereGeometry(2.6,16,12),sk);body.scale.set(1.2,1.5,1);body.position.y=4;const head=new T.Mesh(new T.SphereGeometry(1.4,14,10),sk);head.position.set(0,7.6,.6);mon.add(body,head);for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.28,8,6),BM(0xff3af0));e.position.set(s*.55,7.9,1.85);mon.add(e);const h=new T.Mesh(new T.ConeGeometry(.4,2.2,6),sk);h.position.set(s*1,9,.2);h.rotation.z=-s*.6;mon.add(h);const arm=new T.Mesh(new T.CylinderGeometry(.6,.45,4.5,8),sk);arm.position.set(s*3.2,4.6,.6);arm.rotation.z=s*.7;mon.add(arm)}
 const tri=new T.Group(),tm=GLM(KV,.9),tw=BM(0xf0e0ff);const sh2=new T.Mesh(new T.CylinderGeometry(.12,.12,9,8),tw);tri.add(sh2);for(const s of[-1,0,1]){const p=new T.Mesh(new T.ConeGeometry(.28,1.8,6),tm);p.position.set(s*.8,5.2,0);tri.add(p)}const bar=new T.Mesh(new T.BoxGeometry(1.9,.2,.2),tm);bar.position.y=4.3;tri.add(bar);
 mon.position.set(cx+dx*7,-10,cz+dz*7);mon.rotation.y=P.f+Math.PI;S.add(mon);S.add(tri);const ci=fCircle(5,'g');ci.position.set(cx,.08,cz);S.add(ci);
 kfx({u:(q,dt)=>{const t=q.t;kCircleTick(ci,dt,Math.min(1,t/.3)*(t>2.6?Math.max(0,1-(t-2.6)*3):1),Math.max(0,Math.sin(t*8))*.4);mon.position.y=Math.min(-1,-10+t*14);if(t>2.6)mon.position.y=-1-(t-2.6)*14;
  if(t<1.1){tri.position.set(mon.position.x+Math.cos(P.f)*3.2,mon.position.y+9,mon.position.z-Math.sin(P.f)*3.2);tri.rotation.set(0,0,0)}else if(t<1.45){const u=(t-1.1)/.35;tri.position.set(L2(mon.position.x,cx,u),L2(mon.position.y+9,4.5,u),L2(mon.position.z,cz,u));tri.lookAt(cx,0,cz);tri.rotateX(Math.PI/2)}
  else if(!q.h){q.h=1;tri.position.set(cx,3.6,cz);tri.rotation.set(Math.PI,0,0);P.shake=Math.max(P.shake,.45);kShock(cx,cz,6,KV,.45,.3);kShock(cx,cz,4,0xff3af0,.4,.5);H.hitR(cx,cz,6,d,{st:1.5});for(const e of enemies)if(Math.hypot(e.x-cx,e.z-cz)<6){e.sh=0}fxp({x:cx,y:.5,z:cz,c:0x6a5a70,n:Math.round(24*Q()),sp:7,sz:.3,life:.8,up:4});kRunes(cx,1,cz,14)}
  return t<3.3},end:()=>{kDispose(mon);kDispose(tri);kDispose(ci)}})}
const L2=(a,b,u)=>a+(b-a)*u;
// passiva "Volte!": quando a vida cai abaixo de 30%, o corpo se refaz (recarga 60 s)
let KREG=0;
function kotoPassive(dt){if(!P.g||P.g.id!='kotodama'||P.dead>0)return;KREG-=dt;if(KREG<=0&&P.hp>0&&P.hp<P.mhp*.3){KREG=60;const h=Math.round(P.mhp*.3);P.hp=Math.min(P.mhp,P.hp+h);kw('VOLTE!');kRunes(P.x,1.4,P.z,Math.round(16*Q()));kShock(P.x,P.z,2,KV,.3,1);dmgNum(P.x,2.7,P.z,'+'+h,0,'xp')}}

// ================================================================================
//                       RAINHA DAS BRUXAS · SANGUE + FOICE
// ================================================================================
const BR=0xb0101e,BR2=0xff3040,BDK=0x3a0008;
const bw=w=>{try{xWord(w,'blood')}catch(e){}};
function bloodDrops(x,y,z,n,R){for(let k=0;k<n;k++)fxp({x:x+rnd(-R,R),y:y+rnd(-.3,.3),z:z+rnd(-R,R),c:k%3?BR:BR2,n:1,sp:1.4,sz:rnd(.08,.18),life:rnd(.4,.7),up:1,g:5})}
function scytheMesh(sc){const g=new T.Group(),hm=new T.MeshToonMaterial({color:0x2a0a10,gradientMap:gmap}),bm=new T.MeshToonMaterial({color:0x8a0a18,gradientMap:gmap,emissive:0x3a0006});const sh=new T.Mesh(new T.CylinderGeometry(.035,.04,1.9,8),hm);sh.position.y=.95;g.add(sh);
 const s=new T.Shape();s.moveTo(0,0);s.quadraticCurveTo(.55,.25,.95,-.25);s.quadraticCurveTo(.5,.02,0,-.14);s.lineTo(0,0);const bl=new T.Mesh(new T.ShapeGeometry(s,12),bm);bl.material.side=T.DoubleSide;bl.position.set(0,1.85,0);g.add(bl);const ed=new T.Mesh(new T.ShapeGeometry(s,12),GLM(BR2,.45));ed.scale.set(1.08,1.15,1);ed.position.set(-.02,1.86,.01);g.add(ed);
 const rg=new T.Mesh(new T.TorusGeometry(.07,.02,6,12),bm);rg.position.y=1.82;rg.rotation.x=Math.PI/2;g.add(rg);for(let k=0;k<3;k++){const dp=new T.Mesh(new T.SphereGeometry(.03,6,5),BM(BR2));dp.position.set(.3+k*.2,1.72-k*.06,0);g.add(dp)}g.scale.setScalar(sc||1);return g}
// 1 · Foices carmesins: duas foices giram, vão e voltam como bumerangue
function bScythe(d,dx,dz){bw('CRIMSON SCYTHE!');startPose('throw');const N=scyOn()?3:2,F=[];for(let k=0;k<N;k++){const g=new T.Group(),m=scytheMesh(1.2);m.position.y=-1.3;m.rotation.z=Math.PI/2;g.add(m);S.add(g);F.push({g,a:(k-(N-1)/2)*.4,hit:new Set()})}
 kfx({u:(q,dt)=>{const t=q.t,u=t/1.4,out=Math.sin(Math.min(1,u)*Math.PI)*16;F.forEach(o=>{const f=P.f+o.a*Math.sin(Math.min(1,u)*Math.PI);o.g.position.set(P.x+Math.sin(f)*out,1.3+P.y,P.z+Math.cos(f)*out);o.g.rotation.set(Math.PI/2,0,t*24);if(Math.random()<.9*Q())bloodDrops(o.g.position.x,1.3,o.g.position.z,1,.3);if(u>.5&&o.hit.size&&!o.back){o.back=1;o.hit.clear()}H.hitR(o.g.position.x,o.g.position.z,1.6,d,{sl:1},o.hit)});return t<1.4},end:()=>F.forEach(o=>kDispose(o.g))})}
// 2 · Inundação de sangue: o campo vira um mar de sangue que prende e afoga
function bFlood(d){bw('MAR DE SANGUE!');startPose('raise');const R=9.5,cx=P.x,cz=P.z,pool=new T.Mesh(new T.CircleGeometry(1,48),DMt(0x6a0010,.0)),pool2=new T.Mesh(new T.RingGeometry(.92,1,64),GLM(BR2,0));pool.rotation.x=pool2.rotation.x=-Math.PI/2;pool.position.set(cx,.06,cz);pool2.position.set(cx,.08,cz);S.add(pool,pool2);const W=[],hit=new Map();
 for(let k=0;k<Math.round(6*Q())+3;k++){const w=new T.Mesh(new T.TorusGeometry(1,.12,6,24,Math.PI),DMt(BR,.7));w.position.set(cx+rnd(-R*.7,R*.7),.1,cz+rnd(-R*.7,R*.7));w.rotation.set(-Math.PI/2*0,Math.random()*3,0);S.add(w);W.push({w,ph:Math.random()*6})}
 kfx({u:(q,dt)=>{const t=q.t,g=t<.5?t/.5:t>5?Math.max(0,1-(t-5)/.5):1;pool.scale.setScalar(R*g);pool2.scale.setScalar(R*g);pool.material.opacity=.75*g;pool2.material.opacity=.8*g;
  W.forEach(o=>{o.w.scale.setScalar(.6+.4*Math.sin(t*3+o.ph));o.w.position.y=.1+Math.abs(Math.sin(t*2+o.ph))*.4*g;o.w.material.opacity=.6*g});if(Math.random()<g*Q()){const a=Math.random()*6.28,r=Math.random()*R;fxp({x:cx+Math.cos(a)*r,y:.2,z:cz+Math.sin(a)*r,c:BR2,n:1,sp:.3,sz:.14,life:.6,up:1.6})}
  for(const e of enemies){if(e.hp<=0)continue;if(Math.hypot(e.x-cx,e.z-cz)<R*g){e.sl=Math.max(e.sl||0,.6);e.st=Math.max(e.st||0,.25);const lt=hit.get(e)||0;if(t-lt>.6){hit.set(e,t);hitE(e,d*.35,{sl:1});bloodDrops(e.x,1.2,e.z,3,.4)}}}if(((t*5)|0)%4==0)pvpHit(cx,cz,R*g,d*.1);return t<5.5},end:()=>{kDispose(pool);kDispose(pool2);W.forEach(o=>kDispose(o.w))}})}
// 5 · Marionete de sangue: uma gota de sangue basta — o alvo vira um soldado e luta para você
function bPuppet(d,dx,dz){bw('UMA GOTA BASTA!');startPose('throw');let tg=null;try{tg=chronoTarget(22)}catch(e){}const e0=tg||H.near(P.x,P.z,22);const drop=new T.Mesh(new T.SphereGeometry(.16,10,8),BM(BR2));drop.scale.set(1,1.4,1);drop.position.copy(aHand());S.add(drop);
 kfx({u:(q,dt)=>{if(!e0||e0.hp<=0){return false}const ax=e0.x-drop.position.x,az=e0.z-drop.position.z,L=Math.hypot(ax,az);drop.position.x+=ax/(L||1)*dt*30;drop.position.z+=az/(L||1)*dt*30;drop.position.y+=(1.6-drop.position.y)*dt*6;bloodDrops(drop.position.x,drop.position.y,drop.position.z,1,.1);if(L<1){puppet(e0,d);return false}return q.t<1.5},end:()=>kDispose(drop)})}
function puppet(e,d){bw('MARIONETE!');const ex=e.x,ez=e.z;const str=[];for(let k=0;k<4;k++){const geo=new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]);const l=new T.Line(geo,new T.LineBasicMaterial({color:BR2,transparent:true,opacity:.85}));S.add(l);str.push({l,geo,o:[(k%2?.4:-.4),(k<2?.3:-.3)]})}const halo=new T.Mesh(new T.TorusGeometry(.6,.05,6,24),GLM(BR2,.9));halo.rotation.x=-Math.PI/2;S.add(halo);
 if(e.L)for(const m of[e.L.mT,e.L.mP])if(m&&m.emissive)m.emissive.setHex(0x5a0008);let at=0;const dur=8;
 kfx({u:(q,dt)=>{const t=q.t;if(e.hp<=0)return false;e.st=Math.max(e.st||0,.2);e.cast=0;const tg=H.near(e.x,e.z,18,new Set([e]));if(tg){const ax=tg.x-e.x,az=tg.z-e.z,L=Math.hypot(ax,az)||1;if(L>1.4){e.x+=ax/L*dt*5;e.z+=az/L*dt*5}else{at-=dt;if(at<=0){at=.7;hitE(tg,d,{sl:1});bloodDrops(tg.x,1.3,tg.z,5,.4);kShock(tg.x,tg.z,1,BR2,.2,1)}}if(e.m){e.m.position.set(e.x,0,e.z);e.m.rotation.y=Math.atan2(ax,az)}}
  str.forEach(s=>{const a=s.geo.attributes.position;a.setXYZ(0,e.x+s.o[0],1.6,e.z+s.o[1]);a.setXYZ(1,e.x+s.o[0]*.3,9,e.z+s.o[1]*.3);a.needsUpdate=true});halo.position.set(e.x,2.6,e.z);halo.rotation.z+=dt*2;return t<dur},end:()=>{str.forEach(s=>{S.remove(s.l);s.geo.dispose()});kDispose(halo);try{if(e.L)for(const m of[e.L.mT,e.L.mP])if(m&&m.emissive)m.emissive.setHex(0)}catch(_){}}})}
// 6 · Cura da Rainha: cura rápida e absurda (mais do que qualquer mago de cura)
function bHeal(){bw('CURA DA RAINHA!');startPose('cross');const h=Math.round(P.mhp*.38);const R2=[];for(let k=0;k<Math.round(10*Q())+5;k++){const p=new T.Mesh(new T.SphereGeometry(.12,8,6),GLM(k%2?BR2:0xff8090,.9));S.add(p);R2.push({p,a:k/10*6.28,r:rnd(.6,1.2),y:rnd(.3,2.2)})}const ci=fCircle(1.6,'g');S.add(ci);const h0=P.hp;
 kfx({u:(q,dt)=>{const t=q.t;kCircleTick(ci,dt,Math.min(1,t/.2)*(t>1.2?Math.max(0,1-(t-1.2)*3):1),Math.max(0,Math.sin(t*10))*.3);ci.position.set(P.x,.08,P.z);R2.forEach(o=>{const a=o.a+t*4;o.p.position.set(P.x+Math.cos(a)*o.r*(1-t/1.6),o.y+t*.6,P.z+Math.sin(a)*o.r*(1-t/1.6))});P.hp=Math.min(P.mhp,Math.max(P.hp,h0+h*Math.min(1,t/.8)));return t<1.5},end:()=>{R2.forEach(o=>kDispose(o.p));kDispose(ci)}});dmgNum(P.x,2.7,P.z,'+'+h,0,'xp')}
{const _wH=wpnHTML;wpnHTML=function(){let h=_wH.apply(this,arguments);try{if(scyOn())h=h.replace("onclick=\"wpnEquip('scythe')\" >Equipar","onclick=\"wpnEquip('scythe')\" >Guardar").replace(/🗡️ (Foice de Sangue)/,'🩸 $1')}catch(e){}return h}}
// ---------- Foice de Sangue como ARMA (igual espada/taco: não ocupa espaço do grimório)
WPN82.scythe={n:'Foice de Sangue da Rainha',t:'foice',g:'sangue',sp:'Ataque principal vira um giro de foice que corta em arco (1,6× de dano) e as Crimson Scythes saem em 3.',how:'Vem com o grimório de Sangue.'};
const scyOn=()=>{try{const v=v82S();return !!(v.scy&&P.g&&P.g.id=='sangue')}catch(e){return false}};
{const _wh=wpnHas;wpnHas=function(k){if(k=='scythe')return !!(P.g&&P.g.id=='sangue');return _wh.apply(this,arguments)}}
{const _we=wpnEquip;wpnEquip=function(k){if(k=='scythe'){if(!wpnHas(k)){toast('🔒 '+WPN82.scythe.n+': '+WPN82.scythe.how);return}const v=v82S();v.scy=v.scy?0:1;toast(v.scy?'Foice de Sangue equipada.':'Foice guardada.');try{saveGame()}catch(e){}try{openMenu('inv')}catch(e){}return}return _we.apply(this,arguments)}}
let scyM=null;
function scyTick(){const on=scyOn();if(on&&!scyM){try{scyM=scytheMesh(.9);scyM.position.y=PP.attY||-.34;scyM.rotation.x=1.35;PP.arms[1][1].add(scyM)}catch(e){}}if(scyM)scyM.visible=on&&!P.union}
{const _pu=punch;punch=function(){if(!scyOn())return _pu.apply(this,arguments);if(!run||P.pc>0||POS.on)return;P.pc=.42;aimAssist(5);startPose('spin');const d=12*1.6*(1+(P.lv-1)*.04)*(1+cb('pdmg'));const arc=H.crescent(2.8,.6,BR,BR2,Math.PI*1.4);arc.rotation.x=-Math.PI/2;arc.position.set(P.x,1.1+P.y,P.z);S.add(arc);
 kfx({u:(q,dt)=>{arc.position.set(P.x,1.1+P.y,P.z);arc.rotation.z=-P.f+q.t*9;arc.traverse(m=>{if(m.material)m.material.opacity=Math.max(0,.9-q.t*3)});return q.t<.3},end:()=>kDispose(arc)});bloodDrops(P.x,1.2,P.z,Math.round(8*Q()),1.6);
 for(const e of enemies){const dx=e.x-P.x,dz=e.z-P.z;let a=Math.atan2(dx,dz)-P.f;a=Math.atan2(Math.sin(a),Math.cos(a));if(Math.hypot(dx,dz)<3.4&&Math.abs(a)<1.9)hitE(e,d,{sl:1})}pvpHit(P.x+Math.sin(P.f)*1.6,P.z+Math.cos(P.f)*1.6,2.4,d)}}

// ================================================================================
//                                    REGISTRO
// ================================================================================
const C93={abull:(d,dx,dz)=>aBull(d,dx,dz,0),abull1:(d,dx,dz)=>aBull(d,dx,dz,1),abslash:aBSlash,adivid:aDivider,ahurr:aHurricane,ameteor:aMeteorite,uequi:uEquinox,udslash:uDemonSlash,
 kret:kReturn,ksrain:kSwordRain,kwords:kWords,kcopy:kCopy,kmouth:kMouths,ktri:kTrident,bscy:bScythe,bflood:bFlood,bpup:bPuppet,bheal:bHeal};
window.C93=C93;XT.push(...Object.keys(C93));
{const _xc=xCast;xCast=function(t,d,dx,dz){const f=C93[t];if(f){try{f(d,dx,dz)}catch(e){console.warn('v93',t,e)}return}return _xc.apply(this,arguments)}}
{const _xp=xPre;xPre=function(t){if(C93[t])return true;return _xp.apply(this,arguments)}}
const N3={abull:'Anti-Magic: Bull Thrust',abull1:'Anti-Magic: One-Horn Bull Thrust',abslash:'Anti-Magic: Black Slash',adivid:'Anti-Magic: Black Divider',ahurr:'Anti-Magic: Black Hurricane',ameteor:'Anti-Magic: Black Meteorite',uequi:'Devil Union: Equinox Infinite Slash',udslash:'Devil Union: Demon Slash Infinite Slash',
 kret:'Kotodama: "Volta!"',ksrain:'Kotodama: Rain of Swords',kwords:'Kotodama: Thunder, Fire, Earth, Crush',kcopy:'Kotodama: Copy',kmouth:'Kotodama: Mouths of the Underworld',ktri:'Kotodama: Underworld Trident',bscy:'Blood: Crimson Scythe',bflood:'Blood: Sea of Blood',bpup:'Blood: Blood Puppet',bheal:"Witch Queen's Healing"};
window.N93=N3;
try{GR.anti.s=[[N3.abull,8,38,'abull',null,1.2],[N3.abslash,10,44,'abslash',null,3],[N3.abull1,14,70,'abull1',null,6],[N3.adivid,24,95,'adivid',null,12],[N3.ahurr,26,18,'ahurr',null,14],[N3.ameteor,40,130,'ameteor',null,26]];
 const U=A82.union;const iA=U.findIndex(s=>s[3]=='uabys'),iO=U.findIndex(s=>s[3]=='uover');if(iA>=0)U[iA]=[N3.uequi,26,120,'uequi',null,12,14];if(iO>=0)U[iO]=[N3.udslash,30,140,'udslash',null,16,16];}catch(e){console.warn('v93 anti',e)}
try{GR.kotodama.s=[[N3.kret,10,40,'kret',null,4],[N3.kwords,16,46,'kwords',null,5],[N3.ksrain,26,34,'ksrain',null,10],[N3.kcopy,22,60,'kcopy',null,9],[N3.kmouth,30,30,'kmouth',null,18],[N3.ktri,48,170,'ktri',null,40]];GR.kotodama.p.t=(GR.kotodama.p.t||'')+' · Volte!: abaixo de 30% de vida o corpo se refaz e recupera 30% (a cada 60 s)'}catch(e){}
try{const Sg=GR.sangue.s,fd=id=>Sg.find(s=>s&&s[3]==id);GR.sangue.s=[[N3.bscy,9,30,'bscy',{sl:1},1.4],[N3.bflood,22,40,'bflood',null,14],fd('sgguard'),fd('sgempress'),[N3.bpup,24,34,'bpup',null,16],[N3.bheal,30,0,'bheal',null,24]].filter(Boolean)}catch(e){}
Object.assign(ANI,{[N3.abull]:'dash',[N3.abull1]:'dash',[N3.abslash]:'throw',[N3.adivid]:'slam',[N3.ahurr]:'spin',[N3.ameteor]:'dash',[N3.uequi]:'throw',[N3.udslash]:'slam',[N3.kret]:'push',[N3.ksrain]:'raise',[N3.kwords]:'push',[N3.kcopy]:'raise',[N3.kmouth]:'cross',[N3.ktri]:'raise',[N3.bscy]:'throw',[N3.bflood]:'raise',[N3.bpup]:'throw',[N3.bheal]:'cross'});
Object.assign(RNG,{abull:['c',8,'investida'],abull1:['m',12,'investida'],abslash:['l',28],adivid:['m',14],ahurr:['c',4.6,'ao redor'],ameteor:['m',18,'investida'],uequi:['l',60,'seletivo'],udslash:['m',20],kret:['c',13,'reflete'],ksrain:['m',22],kwords:['m',22],kcopy:['l',24],kmouth:['m',20],ktri:['l',26],bscy:['m',16],bflood:['c',9.5,'área'],bpup:['l',22,'controle'],bheal:['c',0,'cura']});
try{Object.assign(TAG82,{[N3.abslash]:'O',[N3.adivid]:'O',[N3.ahurr]:'O',[N3.ameteor]:'O',[N3.abull]:'O',[N3.abull1]:'O',[N3.uequi]:'OA',[N3.udslash]:'OA'})}catch(e){}
const IC=(p)=>p;
Object.assign(SKI,{
 [N3.abull]:'<path d="M3 12h9" stroke="L" stroke-width="2" stroke-dasharray="2 2"/><path d="M10 8l11 2-11 2zM10 12l11 2-11 2z" fill="C"/>',
 [N3.abull1]:'<path d="M3 12h8" stroke="L" stroke-width="2" stroke-dasharray="2 2"/><path d="M9 9l13 3-13 3z" fill="C"/><circle cx="7" cy="12" r="2" fill="L"/>',
 [N3.abslash]:'<path d="M5 20C12 17 18 10 19 3" stroke="C" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M9 21C15 18 20 12 22 6" stroke="L" stroke-width="1.6" fill="none"/>',
 [N3.adivid]:'<rect x="10.5" y="2" width="3" height="16" fill="C"/><rect x="7" y="17" width="10" height="2.4" fill="L"/><rect x="11" y="19" width="2" height="4" fill="C"/>',
 [N3.ahurr]:'<path d="M4 6h16M6 10h12M8 14h8M10 18h4" stroke="C" stroke-width="2.4" stroke-linecap="round"/><path d="M12 2v4" stroke="L" stroke-width="2"/>',
 [N3.ameteor]:'<circle cx="16" cy="8" r="4.5" fill="C"/><path d="M13 11L3 21M15 12L7 21M12 9L3 16" stroke="L" stroke-width="1.8" stroke-linecap="round"/>',
 [N3.uequi]:'<path d="M2 12C8 4 16 4 22 12C16 20 8 20 2 12z" fill="none" stroke="C" stroke-width="2"/><path d="M4 12h16" stroke="L" stroke-width="2.4"/>',
 [N3.udslash]:'<path d="M2 18L22 6" stroke="L" stroke-width="2.4"/><path d="M2 14L18 4M6 20L22 10" stroke="C" stroke-width="1.4"/>',
 [N3.kret]:'<path d="M20 8H8l4-4M8 8l4 4" stroke="C" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M4 16h12l-4 4M16 16l-4-4" stroke="L" stroke-width="2" fill="none" stroke-linecap="round"/>',
 [N3.ksrain]:'<path d="M6 2v12M12 2v14M18 2v10" stroke="C" stroke-width="2.2"/><path d="M4 14h4M10 16h4M16 12h4" stroke="L" stroke-width="2"/><path d="M2 21h20" stroke="L" stroke-width="1.4"/>',
 [N3.kwords]:'<path d="M13 2L6 13h5l-2 9 9-12h-6z" fill="C"/><circle cx="19" cy="18" r="3" fill="L"/>',
 [N3.kcopy]:'<rect x="3" y="3" width="11" height="11" rx="2" fill="none" stroke="C" stroke-width="2"/><rect x="10" y="10" width="11" height="11" rx="2" fill="L" opacity=".8"/><circle cx="15.5" cy="15.5" r="1.4" fill="C"/>',
 [N3.kmouth]:'<ellipse cx="12" cy="12" rx="9" ry="6" fill="none" stroke="C" stroke-width="2"/><path d="M5 11l2 2 2-2 2 2 2-2 2 2 2-2 2 2" stroke="L" stroke-width="1.6" fill="none"/>',
 [N3.ktri]:'<path d="M12 22V6M7 9V3M17 9V3M7 9h10" stroke="C" stroke-width="2.2" fill="none"/><path d="M12 6V1" stroke="L" stroke-width="2"/>',
 [N3.bscy]:'<path d="M5 21L14 4" stroke="L" stroke-width="2"/><path d="M14 4C20 4 22 9 20 13C18 9 15 8 12 8z" fill="C"/>',
 [N3.bflood]:'<path d="M2 16c3-3 5 3 8 0s5 3 8 0 3 1 4 1" stroke="C" stroke-width="2.4" fill="none"/><path d="M2 20c3-3 5 3 8 0s5 3 8 0" stroke="L" stroke-width="1.6" fill="none"/><path d="M12 3c2 3 3 4.5 3 6a3 3 0 0 1-6 0c0-1.5 1-3 3-6z" fill="C"/>',
 [N3.bpup]:'<path d="M6 2v8M12 2v6M18 2v8" stroke="L" stroke-width="1.4"/><circle cx="12" cy="12" r="3" fill="C"/><path d="M12 15v5M9 22l3-2 3 2M8 16l4-1 4 1" stroke="C" stroke-width="2" fill="none"/>',
 [N3.bheal]:'<path d="M12 21C5 16 3 12 3 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 9 2.5C21 12 19 16 12 21z" fill="C"/><path d="M12 9v7M8.5 12.5h7" stroke="L" stroke-width="2"/>'});
// multiplayer: os outros jogadores veem um efeito simples
{const _xr=xRemote;xRemote=function(o,c){try{const id=Object.keys(N3).find(k=>N3[k]===c.nm);if(id){const col=id[0]=='a'||id[0]=='u'?AR:id[0]=='k'?KV:BR;kShock(o.x,o.z,2.4,col,.4,1);fxp({x:o.x,y:1.4,z:o.z,c:col,n:12,sp:4,sz:.2,life:.5});return true}}catch(e){}return _xr.apply(this,arguments)}}
// tique por quadro
{const _tu=tUpdate;tUpdate=function(dt,mv){_tu(dt,mv);try{swordTick(dt)}catch(e){}try{kotoPassive(dt)}catch(e){}try{scyTick()}catch(e){}}}
}

