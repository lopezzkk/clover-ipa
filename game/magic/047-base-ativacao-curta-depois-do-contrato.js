// ================= ATIVAÇÃO CURTA (depois do contrato) =================
// falas próprias de cada demônio, diferentes para pacto (p) e domínio (d)
const CSA={liebe:{p:[[.3,'p','Liebe! Agora!'],[1.8,'liebe','Já tava esperando, irmão. Bora!'],[3.6,'p','Juntos.']],d:[[.3,'p','Liebe, empresta sua força!'],[1.8,'liebe','Empresta? Você me venceu... então manda. Mas não abusa!'],[4,'p','Vamos.']]},
 gimodelo:{p:[[.3,'p','Gimodelo, comigo!'],[1.8,'gimodelo','A matilha corre com você.']],d:[[.3,'p','Gimodelo!'],[1.8,'gimodelo','Grrr... você é o líder. Por enquanto.']]},
 slotos:{p:[[.3,'p','Slotos, seu escudo!'],[2,'slotos','...Sempre... ao seu lado.']],d:[[.3,'p','Slotos!'],[2,'slotos','...A muralha... obedece. Desta vez.']]},
 plumede:{p:[[.2,'p','Plumede, rápido!'],[1.4,'plumede','Já tô aqui! Não pisca!']],d:[[.2,'p','Plumede!'],[1.4,'plumede','Tá, tá, você me pegou. Vai!']]},
 walgner:{p:[[.3,'p','Walgner, canta!'],[1.8,'walgner','COCORICÓ! Que comece a briga!']],d:[[.3,'p','Walgner!'],[1.8,'walgner','Hmpf! Só porque você venceu meu canto!']]},
 quatro:{p:[[.3,'p','Os quatro, comigo!'],[1.6,'gimodelo','A matilha.'],[2.6,'slotos','...O escudo.'],[3.4,'plumede','A velocidade!'],[4.2,'walgner','E o canto!']],d:[[.3,'p','Os quatro!'],[1.6,'walgner','Mandão, hein!'],[2.8,'slotos','...Obedecemos.']]},
 zagred:{p:[[.3,'p','Zagred, empreste suas palavras.'],[2,'zagred','Fale, e o mundo se curvará.']],d:[[.3,'p','Zagred!'],[2,'zagred','Você me venceu... use minha voz enquanto pode.']]}};
Object.assign(CSD.liebe,{af:.5});Object.assign(CSD.gimodelo,{af:.5});Object.assign(CSD.slotos,{af:.48});Object.assign(CSD.plumede,{af:.58});Object.assign(CSD.walgner,{af:.52});Object.assign(CSD.quatro,{af:.48});Object.assign(CSD.zagred,{af:.5});
// ================= MULTIPLAYER: invocações, transformações e cutscenes =================
// invocações: cada criatura local entra numa lista enviada na presença (no máximo 8, só o estado essencial)
let SUMN=0;function sumId(o){return o.sid||(o.sid=++SUMN)}
function sumList(){const L=[];const add=(k,o,x,z,f)=>{if(L.length<8)L.push([k,sumId(o),+x.toFixed(1),+z.toFixed(1),+(f||0).toFixed(1),o.atk||0])};
 SOC.list.forEach(o=>add('c'+o.kind,o,o.x,o.z,o.root?o.root.rotation.y:0));if(NA.dev)add('d'+NA.dev.key[0],NA.dev,NA.dev.x,NA.dev.z,NA.dev.g?NA.dev.g.rotation.y:0);PACKS.forEach(o=>o.hp>0&&add('p',o,o.x,o.z,o.g?o.g.rotation.y:0));if(X6.rep)X6.rep.L.forEach((o,i)=>add('r',o,o.g.position.x,o.g.position.z,o.g.rotation.y));GW.rep.forEach(o=>add('w',o,o.x,o.z,0));KSUM.forEach(o=>add('k',o,o.x,o.z,0));return L}
const PACKS=[];
const SUMK={c0:()=>soCreature(0),c1:()=>soCreature(1),c2:()=>soCreature(2),dg:()=>naDevil('gimodelo'),ds:()=>naDevil('slotos'),dp:()=>naDevil('plumede'),dw:()=>naDevil('walgner'),p:()=>{const g=naDevil('gimodelo');g.scale.setScalar(.6);return g},k:()=>kMinion()};
function sumRemote(o,list,dt){o.sums=o.sums||{};const seen={};if(Array.isArray(list))for(const s of list.slice(0,8)){if(!Array.isArray(s))continue;const [k,id,x,z,f,a]=s;const key=k+':'+id;seen[key]=1;let m=o.sums[key];
  if(!m){let g;try{if(k=='r'||k=='w'){g=o.g.clone(true);const mt=new T.MeshBasicMaterial({color:k=='r'?0xc888ff:0xff8ad8,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false});g.traverse(q=>{if(q.isMesh)q.material=mt})}else g=(SUMK[k]||SUMK.p)()}catch(e){continue}g.position.set(+x||0,0,+z||0);S.add(g);m=o.sums[key]={g,k,x:+x||0,z:+z||0,f:+f||0,a:a||0};fxp({x:m.x,y:1,z:m.z,c:0xb070ff,n:10,sp:2,sz:.15,life:.5})}
  m.tx=+x||0;m.tz=+z||0;m.f=+f||0;if((a||0)!==m.a){m.a=a||0;fxp({x:m.x,y:1.2,z:m.z,c:0xffffff,n:6,sp:3,sz:.12,life:.35})}}
 for(const key in o.sums){const m=o.sums[key];if(!seen[key]){naSmoke(m.g.position.x,.6,m.g.position.z,6,1);kDispose(m.g);delete o.sums[key];continue}const kk=Math.min(1,dt*8);m.x+=(m.tx-m.x)*kk;m.z+=(m.tz-m.z)*kk;m.g.position.set(m.x,m.k=='c1'?0:0,m.z);m.g.rotation.y=m.f;const tm=performance.now()/1000;try{if(m.k[0]=='d'||m.k=='p')naDevilAnim(m.g,tm,1);if(m.k=='c0'){const u=UD(m.g);if(u.g)u.g.position.y=Math.abs(Math.sin(tm*5))*.9}}catch(e){}m.g.visible=o.g.visible}}
function sumClear(o){if(o.sums)for(const k in o.sums){kDispose(o.sums[k].g)}o.sums={}}
// cutscene compartilhada: quem está perto recebe [id, tempo decorrido, ativação]; cada um pula só na própria tela
function csRemote(o,cs){if(!Array.isArray(cs)||CS.on||ENC.on||POS.on||!run||CFG.cut==='off')return;const id=String(cs[0]);if(!CSD[id])return;const key=id+'@'+(cs[3]||0);if(o.csSeen===key)return;o.csSeen=key;if(Math.hypot(o.x-P.x,o.z-P.z)>35)return;if(!o.L||!o.g)return;csPlay(id,null,{spec:o,t:Math.max(0,(+cs[1]||0)+.15),act:!!cs[2]})}
// validação no par (sem servidor): só aceita forma que combina com o grimório do outro jogador
function xFormOk(lk){const nf=lk.nf;if(!nf)return 0;if(nf=='liebe')return lk.g=='anti'?nf:0;if(nf=='zagred')return lk.g=='kotodama'?nf:0;if(nf=='belzebu')return lk.g=='ossos'?nf:0;return lk.g=='sombra'&&NF[nf]?nf:0}

// Nacht: cada forma exige o contrato do seu demônio; a dos quatro exige os quatro
function nacOk(f){if(f=='quatro')return['gimodelo','slotos','plumede','walgner'].every(relOk);const F=NF[f];return !!(F&&F.dv&&relOk(F.dv))}
function nacGate(f){if(nacOk(f))return true;if(f=='quatro'){const m=['gimodelo','slotos','plumede','walgner'].filter(k=>!relOk(k)).map(k=>DPS[k].n);toast('A forma dos quatro exige os 4 contratos. Faltam: '+m.join(', ')+'.');dcxOpen();return false}return relGate(NF[f].dv)}

// ================= GRIMÓRIOS DA LUZ, TERRA E ÁGUA — seis habilidades cada (V74) =================
// Cada habilidade recebe um "ator" A = {x,z,f,dx,dz,rem}. Para o próprio jogador rem=0 (dá dano);
// para outro jogador (multiplayer) rem=1: a mesma cena é reproduzida só como visual, sem dano duplicado.
const LW={ouro:0xffc83a,luz:0xfff2a0,terra:0x8a6a44,cris:0x9ae0ff,agua:0x2a8cff,ciano:0x7af0ff};
const LWG={};function lwG(k,f){let g=LWG[k];if(!g){g=f();g._keep=true;LWG[k]=g}return g}
const lwSph=()=>lwG('sph',()=>new T.SphereGeometry(1,14,10)),lwBox=()=>lwG('box',()=>new T.BoxGeometry(1,1,1)),lwIco=()=>lwG('ico',()=>new T.IcosahedronGeometry(1,0)),
 lwCylY=()=>lwG('cylY',()=>{const q=new T.CylinderGeometry(1,1,1,12,1,true);return q}),
 lwCylZ=()=>lwG('cylZ',()=>{const q=new T.CylinderGeometry(1,1,1,14,1,true);q.rotateX(Math.PI/2);q.translate(0,0,.5);return q}),
 lwSpike=()=>lwG('spike',()=>{const q=new T.ConeGeometry(1,1,5);q.translate(0,.5,0);return q}),
 lwTor=()=>lwG('tor',()=>new T.TorusGeometry(1,.06,6,28)),
 lwFunnel=()=>lwG('funnel',()=>{const q=new T.ConeGeometry(4,3.2,28,3,true);q.rotateX(Math.PI);q.translate(0,1.6,0);return q});
function lwB(c,o){return new T.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?1:o,depthWrite:false})}
function lwRock(c){const m=new T.MeshToonMaterial({color:c,gradientMap:gmap});m.flatShading=true;return m}
function lwWater(op,c){return new T.MeshPhongMaterial({color:c||0x2a8cff,emissive:0x06305e,specular:0xeafcff,shininess:120,transparent:true,opacity:op==null?.66:op,side:T.DoubleSide,depthWrite:false})}
function lwFade(g,k){g.traverse(o=>{const m=o.material;if(!m||m===olm)return;if(m.userData.o0==null)m.userData.o0=m.opacity==null?1:m.opacity;m.transparent=true;m.opacity=m.userData.o0*Math.max(0,k)})}
function lwA(){return{x:P.x,z:P.z,f:P.f,dx:Math.sin(P.f),dz:Math.cos(P.f),rem:0}}
function lwHit(A,e,d,ef){if(A.rem||!e||e.fake||e.hp<=0)return;hitE(e,d,ef)}
function lwNear(A,x,z,r){return A.rem?[]:xNear(x,z,r)}
function lwPvp(A,x,z,r,d){if(!A.rem)xPvp(x,z,r,d)}
function lwStun(A,e,s){if(A.rem||!e||e.fake||e.dummy)return;e.st=Math.max(e.st||0,(e.boss?s*.45:s)*(1+cb('dur')));e.cast=0}
function lwLift(A,e,h,t){if(A.rem||!e||e.fake||e.dummy||e.boss)return;e.ly=Math.max(e.ly||0,h);tmr.push({t:t||.4,f:()=>{e.ly=0}})}
function lwMark(x,z){if(MP.cast)MP.cast.p=[+x.toFixed(1),+z.toFixed(1)]}
function lwPt(A,r){if(A.rem){if(A.p&&A.p.length>=2)return[+A.p[0],+A.p[1],null];return[A.x+A.dx*r*.6,A.z+A.dz*r*.6,null]}const e=chronoTarget(r);const x=e?e.x:A.x+A.dx*r*.6,z=e?e.z:A.z+A.dz*r*.6;lwMark(x,z);return[x,z,e]}
function lwLine(A,len,wd,ox,oz){const out=[];if(A.rem)return out;const x0=ox==null?A.x:ox,z0=oz==null?A.z:oz;for(const e of enemies){if(e.hp<=0||e.gwx)continue;const rx=e.x-x0,rz=e.z-z0,al=rx*A.dx+rz*A.dz,pp=Math.abs(rx*A.dz-rz*A.dx);if(al>-.6&&al<len&&pp<wd+(e.boss?.8:0))out.push(e)}return out}
function lwPvpLine(A,len,wd,d){if(A.rem||!(MP.r&&MP.ff))return;for(const k in MP.others){const o=MP.others[k];const rx=o.x-A.x,rz=o.z-A.z,al=rx*A.dx+rz*A.dz,pp=Math.abs(rx*A.dz-rz*A.dx);if(al>0&&al<len&&pp<wd)pvpHit(o.x,o.z,.6,d)}}
function lwShake(A,v){const k=A.rem?(Math.hypot(A.x-P.x,A.z-P.z)<25?.4:0):1;if(k)P.shake=Math.max(P.shake||0,v*k)}
function lwWord(A,w,cls){if(A.rem)return;const el=$('kword');if(!el||!el.classList)return;el.classList.remove('gold','wind','syl','luz','terra','agua');el.classList.add(cls);kWordShow(w);clearTimeout(lwWord.t);lwWord.t=setTimeout(()=>el.classList.remove(cls),2700)}
function lwSolid(x,z,r){const o={x,z,r,lw:1};SOL.push(o);SOLG.n=-1;return o}
function lwUnsolid(o){if(!o)return;const i=SOL.indexOf(o);if(i>=0){SOL.splice(i,1);SOLG.n=-1}}
function lwDust(x,z,n,c,up){fxp({x,y:.3,z,c:c||0xb89a70,n:Math.round(n*Math.max(.4,KQ())),sp:4,sz:.38,life:.7,g:6,up:up||3})}
// círculo mágico 3D (anéis + hexagrama + runas), reutilizado por Luz e Água
function lwCircle(r,c,c2){const g=new T.Group();g.add(new T.Mesh(new T.RingGeometry(r*.88,r,48),GLM(c,.85)),new T.Mesh(new T.RingGeometry(r*.56,r*.61,40),GLM(c2||0xffffff,.75)));
 for(let k=0;k<2;k++)g.add(new T.Mesh(new T.RingGeometry(r*.7,r*.74,3,1,k*Math.PI/3),GLM(c,.7)));
 for(let k=0;k<12;k++){const t=new T.Mesh(lwG('rune',()=>new T.PlaneGeometry(.1,.26)),GLM(c2||0xffffff,.8));const a=k/12*6.2832;t.position.set(Math.cos(a)*r*.75,Math.sin(a)*r*.75,0);t.scale.setScalar(Math.max(.6,r*.5));t.rotation.z=a;g.add(t)}return g}

// ---------------- LUZ ----------------
function lRay(A,d){lwWord(A,'DIVINE RAY!','luz');xSnd('sochime');const L=30,x0=A.x+A.dx,z0=A.z+A.dz;
 const cc=lwCircle(1.1,LW.ouro);cc.position.set(A.x+A.dx*1.1,1.4,A.z+A.dz*1.1);cc.rotation.y=A.f;S.add(cc);
 const g=new T.Group(),mk3=(r,mt)=>{const m=new T.Mesh(lwCylZ(),mt);m.scale.set(r,r,.01);g.add(m);return m};
 const core=mk3(.14,lwB(0xffffff,1)),glow=mk3(.42,GLM(0xffe680,.55)),out=mk3(.9,GLM(0xfff2a0,.2)),R0=[.14,.42,.9];
 const rings=[];for(let k=0;k<6;k++){const r=new T.Mesh(lwTor(),GLM(0xffffff,.8));r.scale.setScalar(.7);g.add(r);rings.push(r)}
 g.position.set(x0,1.4,z0);g.rotation.y=A.f;S.add(g);let hit=false;
 kfx({u:(q,dt)=>{const t=q.t,ext=Math.min(1,t/.08)*L,fade=t<.28?1:Math.max(0,1-(t-.28)/.3);
  [core,glow,out].forEach((m,i)=>{m.scale.z=Math.max(.01,ext);const r=R0[i]*(1+Math.sin(t*60+i)*.06)*fade;m.scale.x=m.scale.y=Math.max(.01,r)});
  rings.forEach((r,k)=>{const z=(t*40+k*5)%L;r.position.z=Math.min(z,ext);r.scale.setScalar((1-z/L)*.8+.3);r.material.opacity=.8*fade});
  cc.rotation.z+=dt*4;lwFade(cc,fade);
  if(!hit&&t>.06){hit=true;for(const e of lwLine(A,L,1.5,x0,z0)){lwHit(A,e,d);fxp({x:e.x,y:1.4,z:e.z,c:0xfff2a0,n:10,sp:5,sz:.18,life:.4,up:2})}lwPvpLine(A,L,1.5,d);fxp({x:x0+A.dx*L,y:1.4,z:z0+A.dz*L,c:0xffffff,n:16,sp:6,sz:.2,life:.5,up:3})}
  if(Math.random()<.6)fxp({x:x0+A.dx*Math.random()*ext,y:1.4,z:z0+A.dz*Math.random()*ext,c:0xfff6c0,n:1,sp:1,sz:.12,life:.4,up:1});return t<.6},end:()=>{kDispose(g);kDispose(cc)}})}
function lwBlade(){const g=new T.Group();g.add(new T.Mesh(lwG('blade',()=>{const q=new T.OctahedronGeometry(1,0);q.scale(.12,.05,.75);return q}),lwB(0xfffbe0,1)),new T.Mesh(lwG('bladeG',()=>{const q=new T.OctahedronGeometry(1,0);q.scale(.26,.1,1.05);return q}),GLM(0xffd24a,.55)));return g}
function lBlades(A,d){lwWord(A,'SOLAR BLADES!','luz');xSnd('soshard');const n=5,tg=lwNear(A,A.x,A.z,20).sort((a,b)=>Math.hypot(a.x-A.x,a.z-A.z)-Math.hypot(b.x-A.x,b.z-A.z)).slice(0,n);if(tg[0])lwMark(tg[0].x,tg[0].z);
 const B=[];for(let i=0;i<n;i++){const m=lwBlade(),a=A.f+(i-2)*.5;m.position.set(A.x,1.4,A.z);S.add(m);B.push({m,a,hx:A.x+Math.sin(a)*1.5,hy:2.3+Math.abs(i-2)*.18,hz:A.z+Math.cos(a)*1.5,e:tg.length?tg[i%tg.length]:null,vx:0,vz:0,done:0,px:A.x,py:1.4,pz:A.z})}
 kfx({u:(q,dt)=>{const t=q.t;let live=0;B.forEach((o,i)=>{if(o.done)return;live++;const m=o.m;
   if(t<.45){const k=Math.min(1,t/.3);o.px=A.x+(o.hx-A.x)*k;o.py=1.4+(o.hy-1.4)*k;o.pz=A.z+(o.hz-A.z)*k;m.position.set(o.px,o.py,o.pz);m.rotation.set(0,o.a,Math.sin(t*12+i)*.2);o.vx=Math.sin(o.a)*6;o.vz=Math.cos(o.a)*6;return}
   let tx,tz;if(o.e&&o.e.hp>0&&!o.e.gwx){tx=o.e.x;tz=o.e.z}else{tx=o.px+Math.sin(o.a)*10;tz=o.pz+Math.cos(o.a)*10}
   const dx=tx-o.px,dz=tz-o.pz,l=Math.hypot(dx,dz)||1,st=Math.min(1,dt*7);o.vx+=(dx/l*26-o.vx)*st;o.vz+=(dz/l*26-o.vz)*st;o.px+=o.vx*dt;o.pz+=o.vz*dt;o.py+=(1.3-o.py)*Math.min(1,dt*5);m.position.set(o.px,o.py,o.pz);m.rotation.set(0,Math.atan2(o.vx,o.vz),0);
   if(Math.random()<.7)fxp({x:o.px,y:o.py,z:o.pz,c:Math.random()<.5?0xffe680:0xffffff,n:1,sp:.3,sz:.12,life:.3});
   if(!A.rem){const h=xNear(o.px,o.pz,1.3)[0];if(h){lwHit(A,h,d);o.done=1}}if(t>1.25+i*.08&&(A.rem||!o.e||o.e.hp<=0))o.done=1;
   if(o.done){fxp({x:o.px,y:o.py,z:o.pz,c:0xfff2a0,n:12,sp:5,sz:.16,life:.35,up:2});kShock(o.px,o.pz,1.4,LW.ouro,.25,1.2);m.visible=false}});
  return t<2.6&&live>0},end:()=>B.forEach(o=>kDispose(o.m))})}
function lFlash(A,d){lwWord(A,'FLASH STEP!','luz');xSnd('eswarp');const L=12,x0=A.x,z0=A.z;
 if(!A.rem){P.dv=[A.dx*L/.16,A.dz*L/.16];P.dt2=.16;P.iv=Math.max(P.iv||0,.5);for(let k=0;k<4;k++)tmr.push({t:k*.04,f:()=>ghostOf(0xfff2a0)});CAMF.fov=66}
 const g=new T.Group(),beam=new T.Mesh(lwCylZ(),GLM(0xfff2a0,.7)),b2=new T.Mesh(lwCylZ(),lwB(0xffffff,.9));beam.scale.set(.32,.32,L);b2.scale.set(.08,.08,L);g.add(beam,b2);g.position.set(x0,1.15,z0);g.rotation.y=A.f;S.add(g);
 for(let k=0;k<=10;k++)fxp({x:x0+A.dx*k*1.2,y:.6+Math.random()*1.4,z:z0+A.dz*k*1.2,c:k%2?0xffffff:0xffe680,n:2,sp:1.5,sz:.16,life:.5,up:1.5});kShock(x0,z0,2,LW.ouro,.3,1);
 let hit=0;kfx({u:(q,dt)=>{const t=q.t;if(!hit&&t>.12){hit=1;for(const e of lwLine(A,L+1,1.8,x0,z0)){lwHit(A,e,d,{st:.6});fxp({x:e.x,y:1.3,z:e.z,c:0xffffff,n:10,sp:5,sz:.16,life:.35})}lwPvpLine(A,L,1.8,d);kShock(x0+A.dx*L,z0+A.dz*L,2.4,LW.ouro,.3,1)}
  const k=Math.max(0,1-t/.5);beam.scale.x=beam.scale.y=.32*k+.01;b2.scale.x=b2.scale.y=.08*k+.005;lwFade(g,k);return t<.5},end:()=>kDispose(g)})}
function lPrison(A,d){lwWord(A,'RADIANT PRISON!','luz');xSnd('sochime');const [cx,cz]=lwPt(A,16);let tg=lwNear(A,cx,cz,5).slice(0,3);if(!tg.length)tg=[{x:cx,z:cz,fake:1}];const dur=2.8;
 const C=tg.map(e=>{const g=new T.Group();for(let k=0;k<6;k++){const a=k/6*6.2832,p=new T.Mesh(lwCylY(),GLM(0xfff2a0,.75)),c=new T.Mesh(lwCylY(),lwB(0xffffff,.95));p.scale.set(.09,3.2,.09);c.scale.set(.035,3.2,.035);p.position.set(Math.cos(a)*1.25,1.6,Math.sin(a)*1.25);c.position.copy(p.position);g.add(p,c)}
  const top=lwCircle(1.4,LW.ouro),bot=lwCircle(1.4,LW.ouro);top.rotation.x=bot.rotation.x=-Math.PI/2;top.position.y=3.25;bot.position.y=.06;const cube=new T.Mesh(lwBox(),GLM(0xfff6c8,.12));cube.scale.set(2.2,3.1,2.2);cube.position.y=1.6;g.add(top,bot,cube);
  g.position.set(e.x,0,e.z);g.scale.set(1,.01,1);S.add(g);lwHit(A,e,d*.6);lwStun(A,e,dur);return{e,g,top,bot}});
 kfx({u:(q,dt)=>{const t=q.t,k=Math.min(1,t/.25);C.forEach(o=>{if(t<=dur)o.g.scale.set(1,Math.max(.01,k),1);if(!o.e.fake&&o.e.hp>0)o.g.position.set(o.e.x,0,o.e.z);o.top.rotation.z+=dt*2;o.bot.rotation.z-=dt*2;if(Math.random()<.25)fxp({x:o.g.position.x+(Math.random()-.5)*2,y:Math.random()*3,z:o.g.position.z+(Math.random()-.5)*2,c:0xfff6c0,n:1,sp:.3,sz:.1,life:.5,up:1})});
  if(t>dur&&!q.b){q.b=1;xSnd('soshard');C.forEach(o=>{if(!o.e.fake&&o.e.hp>0)lwHit(A,o.e,d*.8);kShock(o.g.position.x,o.g.position.z,2.6,LW.ouro,.35,1.2);fxp({x:o.g.position.x,y:1.6,z:o.g.position.z,c:0xffffff,n:20,sp:6,sz:.16,life:.45,up:2})})}
  if(t>dur){const f=Math.max(0,1-(t-dur)/.3);C.forEach(o=>o.g.scale.set(1+(1-f)*.5,f+.01,1+(1-f)*.5))}return t<dur+.3},end:()=>C.forEach(o=>kDispose(o.g))})}
function lJudg(A,d){lwWord(A,"HEAVEN'S JUDGMENT!",'luz');xSnd('sochime');const [cx,cz]=lwPt(A,24),N=6,H=13,C=[];
 for(let i=0;i<N;i++){const a=i/(N-1)*6.2832,r=i==N-1?0:3.8,c=lwCircle(i==N-1?2.4:1.5,LW.ouro);c.rotation.x=Math.PI/2;const px=cx+Math.cos(a)*r,pz=cz+Math.sin(a)*r;c.position.set(px,H+(i%2)*.7,pz);c.scale.setScalar(.01);S.add(c);C.push({c,big:i==N-1,at:.6+i*.28,x:px,z:pz})}
 const gw=lwCircle(5.5,LW.ouro);gw.rotation.x=-Math.PI/2;gw.position.set(cx,.08,cz);S.add(gw);const beams=[];
 kfx({u:(q,dt)=>{const t=q.t;C.forEach(o=>{o.c.scale.setScalar(Math.min(1,t/.45)+.01);o.c.rotation.z+=dt*(o.big?1.5:3);
   if(!o.f&&t>=o.at){o.f=1;let x=o.x,z=o.z;const R=o.big?4.5:3;if(!A.rem){const e=xNear(x,z,5)[0];if(e){x=e.x;z=e.z}}
    const bm=new T.Group(),b1=new T.Mesh(lwCylY(),GLM(0xffe680,.6)),b2=new T.Mesh(lwCylY(),lwB(0xffffff,.95));b1.scale.set(o.big?1.4:.75,H,o.big?1.4:.75);b2.scale.set(o.big?.5:.25,H,o.big?.5:.25);bm.add(b1,b2);bm.position.set(x,H/2,z);S.add(bm);beams.push({g:bm,t:0});
    for(const e of lwNear(A,x,z,R))lwHit(A,e,o.big?d*1.4:d);lwPvp(A,x,z,R,d);kShock(x,z,R,LW.ouro,.35,.3);fxp({x,y:.4,z,c:0xffffff,n:18,sp:6,sz:.2,life:.5,up:4});lwShake(A,o.big?.5:.22);xSnd(o.big?'esboom':'soshard')}});
  beams.forEach(b=>{b.t+=dt;const k=Math.max(0,1-b.t/.35);b.g.scale.set(k+.01,1,k+.01);lwFade(b.g,k)});lwFade(gw,t<2.2?1:Math.max(0,1-(t-2.2)/.4));gw.rotation.z+=dt*.8;
  if(t>2.2)C.forEach(o=>lwFade(o.c,Math.max(0,1-(t-2.2)/.4)));return t<2.65},end:()=>{C.forEach(o=>kDispose(o.c));beams.forEach(b=>kDispose(b.g));kDispose(gw)}})}
function lSun(A,d){lwWord(A,'ABSOLUTE SUN!','luz');xSnd('sgroyal');if(!A.rem){P.lock=1.5;P.iv=Math.max(P.iv||0,1.7)}const x=A.x,z=A.z,R=14;
 const sun=new T.Group(),core=new T.Mesh(lwSph(),lwB(0xffffff,1)),g1=new T.Mesh(lwSph(),GLM(0xffe27a,.6)),g2=new T.Mesh(lwSph(),GLM(0xffa020,.25));g1.scale.setScalar(1.35);g2.scale.setScalar(1.9);sun.add(core,g1,g2);
 const cor=[];for(let k=0;k<3;k++){const r=new T.Mesh(lwTor(),GLM(0xfff2a0,.7));r.scale.setScalar(1.6+k*.25);r.rotation.set(k*1.1,k*.7,0);sun.add(r);cor.push(r)}
 sun.position.set(x,6.5,z);sun.scale.setScalar(.05);S.add(sun);const gc=lwCircle(R*.6,LW.ouro);gc.rotation.x=-Math.PI/2;gc.position.set(x,.08,z);gc.scale.setScalar(.01);S.add(gc);
 kfx({u:(q,dt)=>{const t=q.t;cor.forEach((r,i)=>{r.rotation.x+=dt*(2+i);r.rotation.y+=dt*(3-i)});gc.rotation.z+=dt*1.2;
  if(t<1.3){const k=t/1.3;sun.scale.setScalar(.05+k*1.6);gc.scale.setScalar(.01+k);if(Math.random()<.7){const a=Math.random()*6.28,r=6+Math.random()*4;fxp({x:x+Math.cos(a)*r,y:.5+Math.random()*3,z:z+Math.sin(a)*r,c:Math.random()<.5?0xfff2a0:0xffffff,n:1,dx:-Math.cos(a),dz:-Math.sin(a),sp:6,spread:.1,sz:.15,life:.6,up:4})}return true}
  if(!q.b){q.b=1;lwShake(A,1);xSnd('esboom');for(const e of lwNear(A,x,z,R)){lwHit(A,e,d);const l=Math.hypot(e.x-x,e.z-z)||1;kb(e,(e.x-x)/l,(e.z-z)/l,10,.4)}lwPvp(A,x,z,R,d);kShock(x,z,R,LW.ouro,.6,.4);kShock(x,z,R*.6,0xffffff,.45,.6);kShock(x,z,R*.35,LW.ouro,.35,1.5);fxp({x,y:1.5,z,c:0xffffff,n:60,sp:14,sz:.35,life:.9,up:6});fxp({x,y:1,z,c:0xffc83a,n:40,sp:10,sz:.3,life:.8,up:3})}
  const u=(t-1.3)/.6;sun.position.y=6.5-u*4;sun.scale.setScalar(1.65+u*4);lwFade(sun,(1-u)*(1-u)*.8);lwFade(gc,1-u);return u<1},end:()=>{kDispose(sun);kDispose(gc)}})}


