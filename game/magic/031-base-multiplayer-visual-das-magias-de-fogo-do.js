// ---------- multiplayer: visual das magias de fogo dos outros ----------
function fRemote(o,c){const f=+c.f||0,dx=Math.sin(f),dz=Math.cos(f),nm=c.nm||'';if(!/^Fire:/.test(nm))return false;
 if(/Fireball/.test(nm)){const orb=fOrb(.4);orb.position.set(o.x+dx,1.5,o.z+dz);S.add(orb);kfx({u:(q,dt)=>{fOrbTick(orb,q.t);if(q.t>.5){orb.position.x+=dx*28*dt;orb.position.z+=dz*28*dt}return q.t<1.4},end:()=>{fGroundWave(orb.position.x,orb.position.z,5,.5);kDispose(orb)}})}
 else if(/Infernal/.test(nm)){const c2=fCircle(1.8,'g',true);c2.position.set(o.x+dx*6,.08,o.z+dz*6);S.add(c2);const ch=fChain(10,.8);S.add(ch);const A=new T.Vector3(c2.position.x+1.5,-.2,c2.position.z),B=new T.Vector3(c2.position.x,1.2,c2.position.z);kfx({u:(q,dt)=>{kCircleTick(c2,dt,q.t<3.6?q.t/.3:1-(q.t-3.6)*3);fChainSet(ch,A,B,q.t,{ext:Math.min(1,q.t/.6),wig:.5,sag:1.2,helix:q.t>.7?{from:.6,turns:1.5,r:.7}:null});return q.t<4},end:()=>{kDispose(c2);fChainFade(ch,.5)}})}
 else if(/Inferno/.test(nm)){const cx=o.x+dx*14,cz=o.z+dz*14,w=fCircle(9,'g');w.position.set(cx,.07,cz);S.add(w);kfx({u:(q,dt)=>{kCircleTick(w,dt,q.t<2.6?q.t/.5:1-(q.t-2.6)*3);if(q.t>2.6&&!q.b){q.b=1;fGroundWave(cx,cz,18,.9);kShock(cx,cz,14,FY,.6,1.5);fEmbers(cx,1.5,cz,20,8,6)}return q.t<3},end:()=>kDispose(w)})}
 else{const m=fCircle(5,'g',true,fTexSplit());m.position.set(o.x+dx*3,.07,o.z+dz*3);S.add(m);kfx({u:(q,dt)=>{kCircleTick(m,dt,q.t<1?q.t/.3:1-(q.t-1)*3);return q.t<1.35},end:()=>kDispose(m)})}return true}
function fUpdate(dt){scTick(dt);if((P.sprot||0)>0)P.sprot-=dt;const h=KT.fheat;if(h){h.offset.y-=dt*.6}}

// ================= MEGA EXPANSÃO: utilidades comuns (Sangue, Sonhos, Espacial, Sombra) =================
// cutscenes: Ajustes > Cutscenes (completa / curta / desligada). CUT = força do movimento de câmera, CUTS = aceleração das fases de preparação
function CUTG(){return CFG.cut==='off'?0:CFG.cut==='curta'?.5:1}
function CUT(){return 1} // a força da câmera é aplicada de forma global (CUTG) para todas as magias, antigas e novas
function CUTS(){return CFG.cut==='off'?2.2:CFG.cut==='curta'?1.45:1}
function xWord(w,cls){const el=$('kword');if(!el)return;el.classList.remove('gold','wind','syl','anti','dun','fire','blood','dream','space','shadow');el.classList.add(cls);kWordShow(w);clearTimeout(xWord.t);xWord.t=setTimeout(()=>el.classList.remove(cls),2700)}
// material normal (não aditivo) para cores escuras — sombra e sangue escuro não somem no aditivo
function DMt(c,o,tex){return new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:T.DoubleSide,map:tex||null})}
// círculo mágico parametrizado (mesmo formato de UD que kCircleTick usa)
function xCircle(R,o,cf,big){const g=new T.Group(),inner=new T.Group();g.add(inner);const L=[],t=cf.t||[],c=cf.c,s=cf.s||[.4,-1,1.8],add=(m,sp,z)=>{m.position.z=z;inner.add(m);L.push({m,sp,op:m.material.opacity})};
 if(cf.base){const b=new T.Mesh(new T.CircleGeometry(R*1.03,40),DMt(cf.base,cf.bo||.55));add(b,0,-.02)}
 if(t[0]){add(kPlane(t[0],R*2,c[0],.95),s[0],0);if(t[1])add(kPlane(t[1],R*1.4,c[1],.75),s[1],.03);if(KQ()>=1&&t[2])add(kPlane(t[2],R*.8,c[2],.6),s[2],.06)}
 else for(const [r,cc,sp] of[[R,c[0],s[0]],[R*.66,c[1],s[1]],[R*.36,c[2],s[2]]])add(new T.Mesh(new T.RingGeometry(r*.9,r,40),GLM(cc,.85)),sp,0);
 if(big){const n=Math.round(8*KQ());for(let k=0;k<n;k++){const q=kPlane(kTexRune((k+(cf.rs||0))%6+1),R*.17,k%2?c[1]:c[2],.95),a=k/n*6.2832;inner.add(q);L.push({m:q,sp:0,op:.95,rune:1,a})}}
 const tor=new T.Mesh(new T.TorusGeometry(R*1.02,R*.012+.02,5,56),GLM(cf.r||c[0],.8));inner.add(tor);if(o=='g')inner.rotation.x=-Math.PI/2;Object.assign(UD(g),{L,inner,R});return g}
function xShrink(g,k){if(g)UD(g).inner.scale.setScalar(Math.max(.01,k))}
// onda no chão com textura própria de cada magia
function xWave(x,z,R,dur,col,tex,y){const m=new T.Mesh(new T.RingGeometry(.72,1,48),GLM(col,.85));m.rotation.x=-Math.PI/2;m.position.set(x,(y||.14),z);S.add(m);const f2=tex?new T.Mesh(new T.CircleGeometry(1,40),fMat(tex,col,.4)):null;if(f2){f2.rotation.x=-Math.PI/2;f2.position.set(x,(y||.14)-.02,z);S.add(f2)}
 kfx({u:f=>{const u=f.t/dur,s=.5+R*Math.pow(u,.6);m.scale.setScalar(s);m.material.opacity=.85*(1-u);if(f2){f2.scale.setScalar(s*.96);f2.rotation.z+=.02;f2.material.opacity=.4*(1-u)}return u<1},end:()=>{kDispose(m);if(f2)kDispose(f2)}})}
// partículas com trajetória espiral (convergem para um ponto)
function xConverge(x,y,z,col,n,r){for(let k=0;k<n;k++){const a=Math.random()*6.28,rr=r*(.6+Math.random()*.5),h=(Math.random()-.5)*r*.8;fxp({x:x+Math.cos(a)*rr,y:y+h,z:z+Math.sin(a)*rr,c:col[k%col.length],n:1,dx:-Math.cos(a),dz:-Math.sin(a),sp:rr*2.2,spread:.05,sz:.08+Math.random()*.1,life:.42,up:-h*2})}}
function xLight(x,y,z,i,c){if(!TLIGHT())return;KL.position.set(x,y,z);KL.color.setHex(c);KL.intensity=Math.max(KL.intensity,i)}
function xFlash(col,op){if(!CFG.fx)return;const fl=$('flash');if(fl&&fl.style){fl.style.background=col;fl.style.transition='none';fl.style.opacity=op;requestAnimationFrame(()=>{fl.style.transition='opacity .7s';fl.style.opacity=0;setTimeout(()=>fl.style.background='',760)})}}
function xValid(x,z,pad){if(Math.abs(x)>336||Math.abs(z)>336)return false;for(const o of solNear(x,z)){if(o.r){if(Math.hypot(x-o.x,z-o.z)<o.r+(pad||.6))return false}else if(Math.abs(x-o.x)<o.hx+(pad||.6)&&Math.abs(z-o.z)<o.hz+(pad||.6))return false}return true}
// procura uma posição válida perto de (x,z) — nunca dentro de casas/muros nem fora do mapa
function xSpot(x,z,pad){if(xValid(x,z,pad))return[x,z];for(let r=1;r<9;r+=.75)for(let k=0;k<12;k++){const a=k/12*6.2832,xx=x+Math.cos(a)*r,zz=z+Math.sin(a)*r;if(xValid(xx,zz,pad))return[xx,zz]}return null}
function xNear(x,z,r){return enemies.filter(e=>e.hp>0&&!e.gwx&&Math.hypot(e.x-x,e.z-z)<r)}
function xPvp(x,z,r,d){if(MP.r&&MP.ff)pvpHit(x,z,r,d)}
// som sintetizado (cada magia tem sons próprios; WebAudio leve, respeita o botão de som)
function xSnd(kind){if(CFG.snd===0)return;try{if(!KAC){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;KAC=new AC()}const ac=KAC;if(ac.state==='suspended')ac.resume();const t0=ac.currentTime+.01,out=ac.createGain();out.gain.value=.3;out.connect(ac.destination);
 const noise=d=>{const b=ac.createBuffer(1,Math.floor(ac.sampleRate*d),ac.sampleRate),x=b.getChannelData(0);for(let i=0;i<x.length;i++)x[i]=Math.random()*2-1;const s=ac.createBufferSource();s.buffer=b;return s};
 const nz=(d,f0,f1,v,type,dl)=>{const s=noise(d),fl=ac.createBiquadFilter(),g=ac.createGain(),t=t0+(dl||0);fl.type=type||'lowpass';fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+d)};
 const tn=(dl,f,f2,d,v,type)=>{const o=ac.createOscillator(),g=ac.createGain(),t=t0+dl;o.type=type||'sine';o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(out);o.start(t);o.stop(t+d+.02)};
 const S_={
  // sangue: líquido grave e cortes metálicos
  sgcharge:()=>{nz(.6,200,1400,.35,'bandpass');tn(0,90,180,.6,.25,'sawtooth');tn(.1,440,330,.4,.08,'triangle')},
  sgshot:()=>{nz(.35,3000,600,.4,'bandpass');tn(0,700,180,.3,.15,'square')},
  sgboom:()=>{nz(.8,900,70,.7);tn(0,110,40,.6,.5);for(let k=0;k<4;k++)tn(.05+k*.06,1800+k*300,900,.15,.08,'triangle')},
  sgslosh:()=>{nz(1.1,180,700,.4,'bandpass');tn(0,55,85,1.1,.3,'sine');tn(.2,60,40,.8,.2,'sawtooth')},
  sgguard:()=>{tn(0,520,780,.5,.18,'triangle');tn(.05,780,1040,.5,.12,'sine');nz(.3,2000,5000,.12,'highpass')},
  sgbreak:()=>{nz(.5,6000,800,.5,'highpass');for(let k=0;k<6;k++)tn(k*.03,2400-k*200,1200,.12,.1,'square')},
  sgroyal:()=>{tn(0,65,65,2,.35,'sawtooth');tn(0,98,98,2,.22,'sawtooth');tn(.3,130,262,1.6,.15,'triangle');nz(2,150,900,.4,'bandpass')},
  // sonhos: sinos, caixa de música e distorção
  sochime:()=>{[1047,1319,1568,2093].forEach((f,k)=>tn(k*.07,f,f*.98,.6,.12,'sine'))},
  soshard:()=>{tn(0,2600,900,.25,.1,'triangle');tn(.04,3300,1500,.2,.07,'sine')},
  soportal:()=>{tn(0,200,600,.8,.15,'sine');tn(0,203,606,.8,.15,'sine');nz(.8,500,3000,.12,'bandpass')},
  sowarp:()=>{tn(0,880,110,1.2,.2,'sine');tn(0,660,82,1.2,.15,'triangle');[523,659,784].forEach((f,k)=>tn(.6+k*.1,f,f,.7,.08,'sine'))},
  sogiggle:()=>{for(let k=0;k<6;k++)tn(k*.07,600+(k%2)*300,700,.06,.1,'square')},
  soeye:()=>{tn(0,40,30,2.2,.45,'sine');tn(0,61,45,2.2,.25,'sawtooth');nz(2,80,400,.3,'lowpass')},
  // espacial: zumbidos e rasgos
  esrift:()=>{nz(.5,8000,300,.3,'highpass');tn(0,1200,90,.5,.18,'sine')},
  eswarp:()=>{tn(0,90,1400,.35,.2,'sine');tn(.12,1400,90,.35,.15,'sine')},
  eshum:()=>{tn(0,110,112,1.4,.18,'sine');tn(0,165,163,1.4,.12,'triangle');nz(1.4,300,320,.06,'bandpass')},
  esboom:()=>{nz(.9,4000,60,.7);tn(0,180,30,.8,.5,'sine');tn(0,2400,200,.5,.1,'triangle')},
  escollapse:()=>{tn(0,40,400,1.6,.3,'sawtooth');tn(0,60,600,1.6,.2,'sine');nz(1.6,100,6000,.3,'bandpass')},
  // sombra: sussurros graves e rugidos demoníacos
  nawhoosh:()=>{nz(.45,400,2500,.35,'bandpass');tn(0,70,40,.4,.25,'sine')},
  nasigil:()=>{tn(0,55,55,1.2,.35,'sawtooth');tn(0,82,82,1.2,.2,'square');nz(1.2,120,600,.25,'lowpass')},
  nabark:()=>{nz(.18,900,300,.6,'bandpass');tn(0,260,140,.18,.3,'sawtooth');nz(.18,900,300,.5,'bandpass',.24);tn(.24,250,130,.18,.25,'sawtooth')},
  nacrow:()=>{tn(0,700,1400,.18,.35,'sawtooth');tn(.18,1400,900,.5,.35,'sawtooth');tn(.18,1100,700,.5,.2,'square');nz(.7,1000,4000,.25,'bandpass')},
  naslam:()=>{nz(.7,600,40,.8);tn(0,70,30,.6,.6,'sine')},
  naunion:()=>{tn(0,48,48,2.4,.45,'sawtooth');tn(0,72,71,2.4,.3,'square');nz(2.4,90,1800,.35,'bandpass');tn(1.9,200,40,.6,.4,'sine')}};
 (S_[kind]||S_.sochime)()}catch(e){}}
// pose da mão (reaproveita aHand)
function xHand(){return aHand()}
// iscas: criaturas e demônios que os inimigos perseguem (distração real na IA)
const DECOY=[];
function decoyTick(){for(const e of enemies){if(e.dcy&&(e.dcy.hp<=0||DECOY.indexOf(e.dcy)<0))e.dcy=null}for(const d of DECOY){if(d.hp<=0)continue;for(const e of enemies){if(e.hp<=0||e.dummy||e.dcy)continue;if(e.boss&&(e.dci==null?(e.dci=Math.random()<.5):e.dci))continue;if(Math.hypot(e.x-d.x,e.z-d.z)<(d.ar||9))e.dcy=d}}}
function dcyHurt(d,v){d.hp-=v;d.hf=.15}
function decoyAdd(o){o.hp=o.hp||80;DECOY.push(o);return o}
function decoyDel(o){const i=DECOY.indexOf(o);if(i>=0)DECOY.splice(i,1);o.hp=0;for(const e of enemies)if(e.dcy===o)e.dcy=null}
// modificadores gerais por quadro (velocidade e defesa) — calculados no xUpdate
P.xspd=1;P.xdef=1;

// ================= MAGIA DE SANGUE (Lendária) =================
// Inspirada na Magia de Sangue de Black Clover (Rainha das Bruxas). Visual mágico, sem efeitos grotescos.
const SR=0xff1e3c,SC2=0xb0001e,SD=0x3a0008,SGo=0xffd27a,SW=0xfff0f0;
const sgTexMtx=()=>kCanvas('sgmtx',(x,W)=>{const c=W/2;x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=7;x.beginPath();x.arc(c,c,c-8,0,6.28);x.stroke();x.lineWidth=2.5;x.beginPath();x.arc(c,c,c-22,0,6.28);x.stroke();
 for(let k=0;k<32;k++){const a=k/32*6.2832;x.beginPath();x.moveTo(c+Math.cos(a)*(c-22),c+Math.sin(a)*(c-22));x.lineTo(c+Math.cos(a+.06)*(c-44),c+Math.sin(a+.06)*(c-44));x.lineTo(c+Math.cos(a+.12)*(c-22),c+Math.sin(a+.12)*(c-22));x.stroke()}
 x.lineWidth=3;x.beginPath();x.arc(c,c,c-70,0,6.28);x.stroke();for(let k=0;k<10;k++){const a=k/10*6.2832;kRune(x,c+Math.cos(a)*(c-95),c+Math.sin(a)*(c-95),30,k*11+5)}
 x.lineWidth=4;x.beginPath();for(let k=0;k<=6;k++){const a=k*2/6*6.2832-1.5708,R=c-125;k?x.lineTo(c+Math.cos(a)*R,c+Math.sin(a)*R):x.moveTo(c+Math.cos(a)*R,c+Math.sin(a)*R)}x.stroke();x.beginPath();for(let k=0;k<=6;k++){const a=k*2/6*6.2832-1.5708+Math.PI/6*2,R=c-125;k?x.lineTo(c+Math.cos(a)*R,c+Math.sin(a)*R):x.moveTo(c+Math.cos(a)*R,c+Math.sin(a)*R)}x.stroke();
 // coroa central
 x.beginPath();x.moveTo(c-40,c+18);x.lineTo(c-40,c-12);x.lineTo(c-22,c+2);x.lineTo(c,c-30);x.lineTo(c+22,c+2);x.lineTo(c+40,c-12);x.lineTo(c+40,c+18);x.closePath();x.stroke();x.beginPath();x.arc(c,c+34,10,0,6.28);x.fill()});
const sgTexLiq=()=>kCanvas('sgliq',(x,W)=>{const c=W/2;for(let k=0;k<7;k++){const px=c+(Math.random()-.5)*W*.3,py=c+(Math.random()-.5)*W*.3,g=x.createRadialGradient(px,py,0,px,py,W*.3);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.6,'rgba(255,255,255,.4)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,W,W)}x.strokeStyle='rgba(255,255,255,.8)';x.lineWidth=3;for(let k=0;k<5;k++){x.beginPath();for(let s=0;s<40;s++){const a=k*1.25+s*.12,r=c*.2+s*4;const px=c+Math.cos(a)*r,py=c+Math.sin(a)*r;s?x.lineTo(px,py):x.moveTo(px,py)}x.stroke()}});
const sgTexVein=()=>kCanvas('sgvein',(x,W)=>{const c=W/2;x.strokeStyle='#fff';x.lineCap='round';const br=(px,py,a,len,w,d)=>{if(d>4||len<8)return;x.lineWidth=w;x.beginPath();x.moveTo(px,py);let nx=px,ny=py;for(let s=0;s<6;s++){a+=(Math.random()-.5)*.5;nx+=Math.cos(a)*len/6;ny+=Math.sin(a)*len/6;x.lineTo(nx,ny)}x.stroke();br(nx,ny,a-.5,len*.65,w*.7,d+1);br(nx,ny,a+.5,len*.6,w*.7,d+1)};for(let k=0;k<9;k++)br(c,c,k/9*6.2832,c*.55,6,0)});
const SGC={t:()=>[sgTexMtx(),fTexCirc(),sgTexMtx()],c:[SR,SGo,SW],r:SGo,base:0x2a0006,bo:.35};
function sgCircle(R,o,big){const cf=SGC;return xCircle(R,o,{t:cf.t(),c:cf.c,r:cf.r,base:o=='g'?cf.base:null,bo:cf.bo,s:[.5,-1.2,2.2],rs:2},big)}
const sgGeo={};function sgG(k,f){if(!sgGeo[k]){sgGeo[k]=f();sgGeo[k]._keep=1}return sgGeo[k]}
// lança carmesim em camadas (núcleo branco, lâmina vermelha, casca escura, espiral dourada)
function sgSpear(L){const g=new T.Group(),lay=[];const core=new T.Mesh(new T.CylinderGeometry(.035,.035,L,6),BM(SW));core.rotation.x=Math.PI/2;g.add(core);lay.push(core);
 const tip=new T.Mesh(new T.ConeGeometry(.16,L*.32,6),BM(SR));tip.rotation.x=Math.PI/2;tip.position.z=L*.62;g.add(tip);lay.push(tip);const tip2=new T.Mesh(new T.ConeGeometry(.27,L*.42,6),GLM(SC2,.55));tip2.rotation.x=Math.PI/2;tip2.position.z=L*.56;g.add(tip2);lay.push(tip2);
 const shaft=new T.Mesh(new T.CylinderGeometry(.09,.06,L*.9,7),BM(SC2));shaft.rotation.x=Math.PI/2;g.add(shaft);lay.push(shaft);const shell=new T.Mesh(new T.CylinderGeometry(.16,.1,L*.8,7,1,true),fMat(sgTexLiq(),SR,.4));shell.rotation.x=Math.PI/2;g.add(shell);lay.push(shell);
 const ribs=new T.Group();for(let k=0;k<Math.round(6*KQ())+3;k++){const r=new T.Mesh(sgG('rib',()=>new T.TorusGeometry(.15,.022,4,10)),BM(SGo));r.position.z=-L*.35+k*L*.09;r.rotation.z=k*.6;r.scale.set(1,.6,1);ribs.add(r)}g.add(ribs);lay.push(ribs);
 for(const s of[-1,1]){const fin=new T.Mesh(new T.ConeGeometry(.12,L*.25,4),BM(SR));fin.position.set(s*.2,0,-L*.38);fin.rotation.set(Math.PI/2,0,s*.6);fin.scale.set(1,1,.3);g.add(fin);lay.push(fin)}
 const glow=new T.Mesh(new T.SphereGeometry(.4,10,8),GLM(SR,.25));glow.scale.z=L*1.3;g.add(glow);lay.push(glow);Object.assign(UD(g),{lay,ribs,glow,L});return g}
// tentáculo líquido: esferas com geometria compartilhada seguindo uma curva com ondulação
function sgTent(n,s,col){const g=new T.Group(),seg=[];const geo=sgG('tseg',()=>new T.SphereGeometry(.3,8,6));const m1=new T.MeshBasicMaterial({color:col||SC2}),m2=GLM(SR,.45);for(let i=0;i<n;i++){const k=1-i/n*.75,m=new T.Mesh(geo,i%3==1?m2:m1);m.scale.setScalar(k*s);g.add(m);seg.push(m)}
 const rn=[];for(let i=0;i<Math.round(2*KQ())+1;i++){const q=kPlane(kTexRune(i+3),.42*s,SGo,.95);g.add(q);rn.push(q)}const tipB=new T.Mesh(sgG('ttip',()=>new T.ConeGeometry(.22,.7,5)),BM(SR));g.add(tipB);Object.assign(UD(g),{seg,rn,tipB,s,pts:seg.map(()=>new T.Vector3())});return g}
function sgTentSet(g,a,b,t,ext,wig,arc){const u=UD(g),n=u.seg.length,dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,L=Math.hypot(dx,dz)||1,px=-dz/L,pz=dx/L;for(let i=0;i<n;i++){const v=i/(n-1)*ext,s=Math.sin(Math.PI*Math.min(1,v)),w=Math.sin(t*6+v*9)*wig*s,p=u.pts[i];p.set(a.x+dx*v+px*w,a.y+dy*v+(arc||2)*s+Math.cos(t*4+v*7)*wig*.4*s,a.z+dz*v+pz*w);u.seg[i].position.copy(p)}
 const e=u.pts[n-1],q=u.pts[Math.max(0,n-2)];u.tipB.position.copy(e);u.tipB.lookAt(e.x*2-q.x,e.y*2-q.y,e.z*2-q.z);u.tipB.rotateX(Math.PI/2);u.rn.forEach((r,i)=>{const p=u.pts[Math.floor(((t*.5+i/u.rn.length)%1)*(n-1))];r.position.set(p.x,p.y+.3*u.s,p.z);r.lookAt(cam.position)});return e}
function sgTentFade(g,dur){const u=UD(g);kfx({u:f=>{const k=f.t/dur;u.seg.forEach((m,i)=>{if(m.visible&&Math.random()<.08){m.visible=false;fxp({x:m.position.x,y:m.position.y,z:m.position.z,c:Math.random()<.5?SR:SGo,n:2,sp:1.2,sz:.12,life:.5,up:.5})}});u.rn.forEach(r=>r.material.opacity=.95*(1-k));u.tipB.visible=k<.5;return k<1},end:()=>kDispose(g)})}
// lâminas mágicas (cristais carmesins em forma de lâmina)
function sgBlade(sz){const g=new T.Group(),b=new T.Mesh(sgG('blade',()=>new T.OctahedronGeometry(.5,0)),BM(SR));b.scale.set(.22*sz,1.4*sz,.06*sz);g.add(b);const e=new T.Mesh(sgG('blade',()=>new T.OctahedronGeometry(.5,0)),GLM(SGo,.6));e.scale.set(.28*sz,1.55*sz,.09*sz);g.add(e);return g}
function sgSpikeRing(x,z,R,n,h,dur,cb){const L=[];for(let k=0;k<n;k++){const a=k/n*6.2832+Math.random()*.3,r=R*(.6+Math.random()*.4),b=sgBlade(h*(.7+Math.random()*.5));b.position.set(x+Math.cos(a)*r,-h,z+Math.sin(a)*r);b.rotation.set((Math.random()-.5)*.5,a,(Math.random()-.5)*.5);S.add(b);L.push({b,dl:k/n*.25,h})}
 kfx({u:f=>{const t=f.t;L.forEach(o=>{const u=Math.max(0,Math.min(1,(t-o.dl)/.18));o.b.position.y=-o.h+o.h*1.1*Math.sin(u*1.5708)*(t>dur-.25?Math.max(0,(dur-t)/.25):1)});if(cb&&!f.c&&t>.15){f.c=1;cb()}return t<dur},end:()=>L.forEach(o=>{fxp({x:o.b.position.x,y:o.b.position.y+o.h*.5,z:o.b.position.z,c:Math.random()<.5?SR:SGo,n:3,sp:1.4,sz:.13,life:.5,up:1});kDispose(o.b)})})}
