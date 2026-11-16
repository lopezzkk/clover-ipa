// ================= V124 · EXPANSÃO DE MAGIAS (base) + MAGIA DE RELÂMPAGO (grimório novo) =================
// Base compartilhada pelas magias novas: raio em uma malha só, brilhos, sons sintetizados, dano em área/linha,
// posição das mãos, raios correndo pelos braços na conjuração, formas (transformações) e registro no sistema de magias.
(function(){
const X={dbg:{}};window.X124=X;
const V=()=>new T.Vector3(),_v=new T.Vector3(),_w=new T.Vector3();
const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
// ---------------- texturas e materiais compartilhados ----------------
function glowTex(){if(X._gt)return X._gt;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.7)');g.addColorStop(.6,'rgba(255,255,255,.18)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);t._keep=1;return X._gt=t}
function smokeTex(){if(X._st)return X._st;const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');for(let k=0;k<14;k++){const a=Math.random()*6.28,r=Math.random()*14,px=32+Math.cos(a)*r,py=32+Math.sin(a)*r,g=x.createRadialGradient(px,py,0,px,py,14+Math.random()*8);g.addColorStop(0,'rgba(255,255,255,.35)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}const t=new T.CanvasTexture(c);t._keep=1;return X._st=t}
const add=(c,o)=>{const m=new T.SpriteMaterial({map:glowTex(),color:c,transparent:true,opacity:o==null?1:o,blending:T.AdditiveBlending,depthWrite:false});return m};
X.glow=function(c,s,o){const sp=new T.Sprite(add(c,o));sp.scale.setScalar(s||1);return sp};
X.smoke=function(c,s,o){const sp=new T.Sprite(new T.SpriteMaterial({map:smokeTex(),color:c,transparent:true,opacity:o==null?.8:o,depthWrite:false}));sp.scale.setScalar(s||1);return sp};
X.addM=(c,o)=>GLM(c,o==null?.9:o);
X.darkM=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?.9:o,depthWrite:false,side:T.DoubleSide});
X.dispose=function(o){try{kDispose(o)}catch(e){try{if(o.parent)o.parent.remove(o)}catch(_){}}};
// ---------------- RAIO: um caminho em zigue-zague desenhado como duas fitas cruzadas (1 desenho por raio) ----------------
X.bolt=function(col,width,opac,segs,dark){segs=segs||10;const n=segs,pos=new Float32Array(n*8*3),idx=[];for(let i=0;i<n;i++){const b=i*8;idx.push(b,b+1,b+2,b+2,b+1,b+3,b+4,b+5,b+6,b+6,b+5,b+7)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setIndex(idx);
 const m=new T.Mesh(g,dark?X.darkM(col,opac):X.addM(col,opac));m.frustumCulled=false;m.userData.b={n,w:width||.12,pts:[]};
 m.userData.set=function(A,B,jit,w){const st=m.userData.b,N=st.n;w=w||st.w;const pts=[];for(let i=0;i<=N;i++){const u=i/N;const p=new T.Vector3().lerpVectors(A,B,u);if(i>0&&i<N){const k=Math.sin(u*Math.PI)*(jit==null?.6:jit);p.x+=(Math.random()-.5)*2*k;p.y+=(Math.random()-.5)*2*k;p.z+=(Math.random()-.5)*2*k}pts.push(p)}st.pts=pts;
  const P2=g.attributes.position.array,d=new T.Vector3(),a=new T.Vector3(),b=new T.Vector3(),up=new T.Vector3(0,1,0);
  for(let i=0;i<N;i++){const p0=pts[i],p1=pts[i+1];d.subVectors(p1,p0).normalize();a.crossVectors(d,Math.abs(d.y)>.9?new T.Vector3(1,0,0):up).normalize();b.crossVectors(d,a).normalize();const w0=w*(1-.35*i/N),w1=w*(1-.35*(i+1)/N);
   const put=(k,p,v,s)=>{P2[k*3]=p.x+v.x*s;P2[k*3+1]=p.y+v.y*s;P2[k*3+2]=p.z+v.z*s};const o=i*8;
   put(o,p0,a,-w0);put(o+1,p0,a,w0);put(o+2,p1,a,-w1);put(o+3,p1,a,w1);put(o+4,p0,b,-w0);put(o+5,p0,b,w0);put(o+6,p1,b,-w1);put(o+7,p1,b,w1)}
  g.attributes.position.needsUpdate=true;return pts};
 return m};
// galhos: raio principal + 2 ramos finos que saem do meio
X.boltTree=function(col,w,o,dark){const g=new T.Group(),main=X.bolt(col,w,o,12,dark),r1=X.bolt(col,w*.5,o*.8,6,dark),r2=X.bolt(col,w*.45,o*.7,5,dark),core=dark?null:X.bolt(0xffffff,w*.35,1,12);g.add(main,r1,r2);if(core)g.add(core);
 g.userData.set=function(A,B,jit){const pts=main.userData.set(A,B,jit);if(core)core.userData.set(A,B,(jit||.6)*.1);for(const [r,f] of[[r1,.35],[r2,.6]]){const p=pts[Math.floor(f*pts.length)]||A,L=A.distanceTo(B)*.35;r.userData.set(p,new T.Vector3(p.x+(Math.random()-.5)*L,p.y+(Math.random()-.5)*L*.6,p.z+(Math.random()-.5)*L),L*.12)}
  if(core){const pc=core.geometry.attributes.position.array,pm=main.geometry.attributes.position.array;}return pts};return g};
// ---------------- mãos, pose e conjuração ----------------
X.hand=function(i){try{const el=PP.arms[i][1];el.updateWorldMatrix(true,false);return el.localToWorld(new T.Vector3(0,-.32,0))}catch(e){return new T.Vector3(P.x+Math.sin(P.f)*.5,1.4+(P.y||0),P.z+Math.cos(P.f)*.5)}};
X.shoulder=function(i){try{const sh=PP.arms[i][0];sh.updateWorldMatrix(true,false);return sh.localToWorld(new T.Vector3(0,0,0))}catch(e){return new T.Vector3(P.x,1.6,P.z)}};
X.front=function(d,y){return new T.Vector3(P.x+Math.sin(P.f)*d,(y==null?1.3:y)+(P.y||0),P.z+Math.cos(P.f)*d)};
// raios correndo do ombro até as mãos durante a conjuração (os dois braços)
X.armArcs=function(dur,col,dark,which){const list=[];const arms=which==null?[0,1]:[which];for(const i of arms){const b=X.bolt(col,.035,.95,6,dark),gl=X.glow(dark?0xff2030:col,.5,.9);S.add(b,gl);list.push({i,b,gl})}
 kfx({u:(f)=>{const t=f.t;for(const o of list){const A=X.shoulder(o.i),B=X.hand(o.i);if(Math.random()<.7)o.b.userData.set(A,B,.12);o.gl.position.copy(B);o.gl.scale.setScalar(.35+Math.min(1,t/dur)*.6+Math.random()*.15);o.b.visible=Math.random()<.85}if(Math.random()<.5*Q()){const B=X.hand(list[0].i);fxp({x:B.x,y:B.y,z:B.z,c:dark?0xff3040:0xe8ffff,n:1,sp:2.5,sz:.07,life:.18})}return t<dur},end:()=>list.forEach(o=>{X.dispose(o.b);X.dispose(o.gl)})})};
// luz de tela (flash) e escurecer (sem criar luzes novas)
X.flash=function(col,op,dur){try{let el=document.getElementById('fl124');if(!el){el=document.createElement('div');el.id='fl124';el.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:25;opacity:0;transition:opacity .12s';document.body.appendChild(el)}el.style.background=col;el.style.opacity=op;clearTimeout(el._t);el._t=setTimeout(()=>{el.style.transition='opacity '+(dur||.4)+'s';el.style.opacity=0;setTimeout(()=>el.style.transition='opacity .12s',(dur||.4)*1000)},60)}catch(e){}};
// ---------------- dano ----------------
X.hitArea=function(x,z,r,d,ef,max){const out=[];for(const e of enemies){if(e.hp<=0)continue;if(Math.hypot(e.x-x,e.z-z)<r+.4){out.push(e);if(max&&out.length>max)break}}out.forEach(e=>hitE(e,d,ef));return out};
X.hitLine=function(x,z,dx,dz,len,w,d,ef,skip){const out=[];for(const e of enemies){if(e.hp<=0||(skip&&skip.has(e)))continue;const ex=e.x-x,ez=e.z-z,along=ex*dx+ez*dz;if(along<-.5||along>len)continue;const side=Math.abs(ex*dz-ez*dx);if(side<w+.45){out.push(e);if(skip)skip.add(e)}}out.forEach(e=>hitE(e,d,ef));return out};
X.nearest=function(x,z,r,skip){let b=null,bd=r;for(const e of enemies){if(e.hp<=0||(skip&&skip.has(e)))continue;const d=Math.hypot(e.x-x,e.z-z);if(d<bd){bd=d;b=e}}return b};
X.push=function(e,fx,fz,sp,t){const l=Math.hypot(fx,fz)||1;try{kb(e,fx/l,fz/l,sp,t)}catch(_){}};
X.stun=function(e,s){if(e.boss)s*=.4;e.st=Math.max(e.st||0,s);e.cast=0};
// ---------------- sons sintetizados (respeitam o botão de som) ----------------
function ac(){if(CFG.snd===0)return null;try{if(!window.KAC){const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;window.KAC=new A()}const a=window.KAC;if(a.state==='suspended')a.resume();return a}catch(e){return null}}
function noise(a,len){const b=a.createBuffer(1,Math.max(1,a.sampleRate*len|0),a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=a.createBufferSource();s.buffer=b;return s}
X.snd=function(k,vol){const a=ac();if(!a)return;try{const t=a.currentTime+.01,out=a.createGain();out.gain.value=(vol||1)*.5;out.connect(a.destination);
 const env=(node,v,at,dec)=>{const g=a.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(v,t+at);g.gain.exponentialRampToValueAtTime(.0001,t+at+dec);node.connect(g);g.connect(out);return g};
 const osc=(type,f0,f1,dur,v,at)=>{const o=a.createOscillator();o.type=type;o.frequency.setValueAtTime(f0,t);if(f1)o.frequency.exponentialRampToValueAtTime(f1,t+dur);env(o,v,at||.005,dur);o.start(t);o.stop(t+dur+.05);return o};
 const nz=(len,ftype,f0,f1,v,at,q)=>{const s=noise(a,len),fl=a.createBiquadFilter();fl.type=ftype;fl.frequency.setValueAtTime(f0,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+len);if(q)fl.Q.value=q;s.connect(fl);env(fl,v,at||.005,len);s.start(t);s.stop(t+len+.05)};
 if(k=='zap'){nz(.18,'highpass',3000,6000,.5,.002);osc('sawtooth',1800,300,.12,.15)}
 else if(k=='charge'){osc('sawtooth',120,900,.8,.12,.3);nz(.8,'bandpass',800,4000,.25,.4,3)}
 else if(k=='boom'){nz(1.2,'lowpass',900,80,.9,.004);osc('sine',90,35,.6,.6)}
 else if(k=='thunder'){nz(1.8,'lowpass',2400,90,1,.003);osc('square',70,30,.9,.25);nz(.12,'highpass',4000,null,.6,.001)}
 else if(k=='black'){osc('sawtooth',60,40,1.2,.35,.05);nz(1.3,'lowpass',500,60,.8,.01);osc('square',220,55,.5,.12)}
 else if(k=='crackle'){for(let i=0;i<5;i++){const s=noise(a,.04),fl=a.createBiquadFilter(),g=a.createGain();fl.type='highpass';fl.frequency.value=2500;g.gain.setValueAtTime(.35,t+i*.05);g.gain.exponentialRampToValueAtTime(.001,t+i*.05+.04);s.connect(fl);fl.connect(g);g.connect(out);s.start(t+i*.05);s.stop(t+i*.05+.05)}}
 else if(k=='transform'){osc('sawtooth',80,600,1.2,.18,.5);nz(1.4,'bandpass',300,3000,.35,.8,2);osc('sine',40,40,1.4,.4,.2)}
 else if(k=='rewind'){for(let i=0;i<8;i++){const o=a.createOscillator(),g=a.createGain();o.type='square';o.frequency.value=1400-i*120;g.gain.setValueAtTime(.12,t+i*.06);g.gain.exponentialRampToValueAtTime(.001,t+i*.06+.04);o.connect(g);g.connect(out);o.start(t+i*.06);o.stop(t+i*.06+.05)}osc('sine',900,150,.6,.18,.05)}
 else if(k=='echo'){osc('triangle',660,1320,.15,.2);osc('triangle',990,495,.25,.12)}
 else if(k=='shadow'){osc('sawtooth',70,45,.9,.25,.1);nz(.9,'lowpass',400,120,.45,.15)}
 else if(k=='imp'){osc('square',420,820,.08,.12);osc('square',300,180,.12,.08)}
 else if(k=='wing'){nz(.5,'bandpass',500,1600,.5,.05,1.5)}
 else if(k=='tick'){osc('square',1600,null,.03,.15)}
}catch(e){}};
// ---------------- texto do nome do poder ----------------
const css=document.createElement('style');css.textContent=`#kword.luck span{color:#e8ffff!important;text-shadow:0 0 10px #4ff3ff,0 0 22px #1aa8ff,2px 2px 0 rgba(0,0,40,.6)!important}
#kword.luckb span{color:#140608!important;text-shadow:0 0 6px #ff2030,0 0 16px #ff0010,0 0 2px #fff!important}
#kword.shd124 span{color:#e6c8ff!important;text-shadow:0 0 10px #9a40ff,0 0 20px #3a0a60,2px 2px 0 #000!important}`;document.head.appendChild(css);
X.word=function(w,cls){try{const el=document.getElementById('kword');if(!el)return;el.classList.remove('gold','wind','syl','anti','dun','luck','luckb','shd124');el.classList.add(cls);kWordShow(w);clearTimeout(X.word.t);X.word.t=setTimeout(()=>el.classList.remove(cls),2700)}catch(e){}};
// ---------------- registro no sistema de magias existente ----------------
const C=window.C124={},PRE=window.PRE124={};X.reg=function(t,f,pre){C[t]=f;if(pre)PRE[t]=pre;try{if(!XT.includes(t))XT.push(t)}catch(e){}};
{const _xc=xCast;xCast=function(t,d,dx,dz){const f=C[t];if(f){try{f(d,dx,dz)}catch(e){console.warn('v124',t,e);try{ERR122(e)}catch(_){}}return}return _xc.apply(this,arguments)}}
{const _xp=xPre;xPre=function(t){if(C[t])return PRE[t]?PRE[t]():true;return _xp.apply(this,arguments)}}
// as recargas da 7ª e 8ª habilidade (o jogo original só contava 6)
// a 7ª e 8ª habilidade precisam de espaço na experiência e na recarga de cada magia (o jogo original guardava 6)
function fixArr(){try{for(const k of['xp','cd','cd2','cdm']){if(!Array.isArray(P[k]))continue;for(let i=0;i<9;i++){if(typeof P[k][i]!='number'||isNaN(P[k][i]))P[k][i]=0}}}catch(e){}}X.fixArr=fixArr;
{const _c=cast;cast=function(){fixArr();return _c.apply(this,arguments)}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(P.cd&&(P.cd.length<9||P.xp&&P.xp.length<9))fixArr();if(run&&P.cd){const hk=1+.8*(P.hk||0)+(X.cdBoost||0);for(let i=6;i<9;i++){if(P.cd[i]>0)P.cd[i]-=dt*hk;if(P.cd2&&P.cd2[i]>0)P.cd2[i]-=dt*hk}if(X.cdBoost)for(let i=0;i<6;i++){if(P.cd[i]>0)P.cd[i]-=dt*X.cdBoost}}}catch(e){}return r}}
X.meta=function(id,list){// nome, pose, ícone, alcance e origem do nome
 for(const s of list){const [nm,pose,icon,rng,tag]=s;try{ANI[nm]=pose}catch(e){}try{if(icon)SKI[nm]=icon}catch(e){}try{if(rng)RNG[s[5]]=rng}catch(e){}try{if(tag)TAG82[nm]=tag}catch(e){}}};

// ===================================================================================
//                         MAGIA DE RELÂMPAGO (grimório novo)
// ===================================================================================
const L={form:null,ft:0,fd:0,arcs:[],k:0};X.L=L;
const CY=0x6ff4ff,CY2=0xe8ffff,BK=0x0a0204,RD=0xff1a2a;
const NM={lkarrow:'Relâmpago: Flecha do Relâmpago',lksph:'Relâmpago: Esfera de Derrubada do Trovão',lkcan:'Relâmpago: Canhão Explosivo Relâmpago de Fogo',lkera:'Relâmpago: Keraunos',lkdemon:'Relâmpago: Demônio do Trovão',lkform:'Relâmpago: Demônio de Batalha Relâmpago',lkcanb:'Relâmpago Negro: Canhão Explosivo Relâmpago Negro de Fogo',lkformb:'Relâmpago Negro: Demônio de Batalha Relâmpago Negro'};X.NM=NM;
GR.raio={n:'Relâmpago',l:3,c:0x6ff4ff,id:'raio',s:[[NM.lkarrow,10,30,'lkarrow',null,1.2],[NM.lksph,16,44,'lksph',null,6],[NM.lkcan,24,70,'lkcan',null,9],[NM.lkera,34,110,'lkera',null,16],[NM.lkcanb,44,140,'lkcanb',null,20]],
 p:{t:'Relâmpago: muito rápido e agressivo. Concentra raios nas mãos antes de atacar. Três formas: Demônio do Trovão, Demônio de Batalha Relâmpago e a evolução negra (Relâmpago Negro, depois do controle de Lufulu sobre o corpo e a mana).',spd:.08,dmg:0}};
try{SKLG.raio=[1,5,10,16,38];MCF.raio=.86;EL82.raio={c:0x3ad8ff,c2:0xe8ffff,k:'light'};SKLG.tempo=(SKLG.tempo||[1,6,12,20,28,42]).slice(0,6).concat([34,48]);SKLG.sombra=(SKLG.sombra||[1,6,12,20,28,42]).slice(0,6).concat([34,48])}catch(e){}
try{const s=GRL.find(o=>o.id=='sangue');if(s&&!GRL.find(o=>o.id=='raio')){s.c=1.25;GRL.push(Object.assign({},s,{id:'raio',r:'lendaria',c:1.25,n:'Grimório de Relâmpago',g:'Trevo de 3 folhas',t:'Raios nas mãos, flechas, canhões, Keraunos e três formas de demônio do trovão (inclusive a negra).'}))}}catch(e){}
try{const _x=XIC;XIC=function(id){return id=='raio'?(L.form=='black'?0xff2a3a:0x6ff4ff):_x(id)}}catch(e){}
// ícones (SVG 24x24: C = cor do grimório, L = cor clara)
const IC={
 lkarrow:'<path d="M3 21L18 6" stroke="L" stroke-width="2"/><path d="M14 4l6 0 0 6" fill="none" stroke="C" stroke-width="2"/><path d="M5 13l3 1-2 2 3 1" fill="none" stroke="C" stroke-width="1.4"/>',
 lksph:'<circle cx="12" cy="12" r="6" fill="C"/><path d="M12 3l-2 5 3 1-3 6M4 16l4-2 1 3 4-3M20 8l-4 2 1 3-3 1" fill="none" stroke="L" stroke-width="1.4"/>',
 lkcan:'<circle cx="6" cy="12" r="4" fill="C"/><path d="M9 12h13" stroke="L" stroke-width="3.2"/><path d="M10 9l4 2-2 1 5 2M10 15l3-1-1 2 4-1" fill="none" stroke="C" stroke-width="1.2"/>',
 lkera:'<path d="M4 3h16" stroke="C" stroke-width="2"/><path d="M13 3l-5 8h5l-4 10 9-12h-5l3-6" fill="L"/><path d="M3 21h18" stroke="C" stroke-width="1.5"/>',
 lkdemon:'<path d="M5 10l2-6 3 4h4l3-4 2 6-2 9H7z" fill="none" stroke="C" stroke-width="1.6"/><path d="M9 12l2 2-2 2M15 12l-2 2 2 2" stroke="L" stroke-width="1.4"/>',
 lkform:'<circle cx="12" cy="6" r="3" fill="L"/><path d="M12 9v7M7 11l5 2 5-2M9 22l3-6 3 6" stroke="C" stroke-width="2" fill="none"/><path d="M3 8l3 2-2 1 3 2M21 8l-3 2 2 1-3 2" fill="none" stroke="L" stroke-width="1.2"/>',
 lkcanb:'<circle cx="6" cy="12" r="4.5" fill="#120406" stroke="#ff2a3a" stroke-width="1"/><path d="M9 12h13" stroke="#120406" stroke-width="3.6"/><path d="M9 12h13" stroke="#ff2a3a" stroke-width="1"/>',
 lkformb:'<circle cx="12" cy="6" r="3" fill="#120406" stroke="#ff2a3a"/><path d="M12 9v7M7 11l5 2 5-2M9 22l3-6 3 6" stroke="#120406" stroke-width="2.4" fill="none"/><path d="M3 8l3 2-2 1 3 2M21 8l-3 2 2 1-3 2" fill="none" stroke="#ff2a3a" stroke-width="1.3"/>'};
X.meta('raio',[[NM.lkarrow,'tarrow',IC.lkarrow,['l',26,''],'O','lkarrow'],[NM.lksph,'throw',IC.lksph,['m',16,''],'O','lksph'],[NM.lkcan,'push',IC.lkcan,['l',24,''],'O','lkcan'],[NM.lkera,'raise',IC.lkera,['l',22,'em área'],'O','lkera'],[NM.lkdemon,'kdom',IC.lkdemon,['c',0,'forma'],'OA','lkdemon'],[NM.lkform,'kdom',IC.lkform,['c',0,'forma'],'O','lkform'],[NM.lkcanb,'push',IC.lkcanb,['l',28,''],'O','lkcanb'],[NM.lkformb,'kdom',IC.lkformb,['c',0,'forma'],'O','lkformb']]);
const black=()=>L.form=='black';
const dmul=()=>black()?1.25:L.form=='battle'?1.12:1;

// ---------- 1) FLECHA DO RELÂMPAGO: três flechas rápidas em sequência ----------
function lkArrow(d,dx,dz){const bl=black(),col=bl?RD:CY;X.word('FLECHA DO RELÂMPAGO!',bl?'luckb':'luck');X.armArcs(.3,col,bl,0);X.snd('charge',.4);try{startPose('tarrow')}catch(e){}
 const tg=chronoTarget(26);for(let k=0;k<3;k++)setTimeout(()=>{if(!run)return;const h=X.hand(0),f=P.f+(k-1)*.06;let ax=Math.sin(f),az=Math.cos(f);if(tg&&tg.hp>0){const l=Math.hypot(tg.x-h.x,tg.z-h.z)||1;ax=(tg.x-h.x)/l;az=(tg.z-h.z)/l}
  const g=new T.Group(),core=new T.Mesh(X.geo('arrow'),bl?X.darkM(BK,.95):X.addM(0xffffff,.95)),sk=X.glow(col,1.1,.9),tail=X.bolt(col,.06,.9,8,bl);g.add(core,sk);S.add(g,tail);g.position.copy(h);g.rotation.y=Math.atan2(ax,az);if(bl){const rim=X.glow(RD,.7,.8);g.add(rim)}
  X.snd('zap',.6);let dist=0;const hit=new Set(),start=h.clone();
  kfx({u:(F,dt)=>{const st=58*dt;g.position.x+=ax*st;g.position.z+=az*st;dist+=st;const back=g.position.clone().addScaledVector(new T.Vector3(ax,0,az),-Math.min(dist,5));tail.userData.set(back,g.position,.25);sk.material.opacity=.6+Math.random()*.4;
   const hs=X.hitLine(g.position.x-ax*st,g.position.z-az*st,ax,az,st+.6,.5,d*.42*dmul(),null,hit);if(hs.length){hs.forEach(e=>{X.stun(e,.25);fxp({x:e.x,y:1.3,z:e.z,c:bl?RD:CY2,n:Math.round(8*Q()),sp:4,sz:.1,life:.3})});X.snd('crackle',.4)}
   return dist<26},end:()=>{kShock(g.position.x,g.position.z,1.2,col,.25,g.position.y);X.dispose(g);X.dispose(tail)}})},120+k*120)}

// ---------- 2) ESFERA DE DERRUBADA DO TROVÃO: bola que estoura e encadeia raios ----------
function lkSphere(d,dx,dz){const bl=black(),col=bl?RD:CY;X.word('ESFERA DE DERRUBADA DO TROVÃO!',bl?'luckb':'luck');X.armArcs(.35,col,bl,0);X.snd('charge',.5);
 const g=new T.Group(),ball=new T.Mesh(X.geo('sph'),bl?X.darkM(BK,.95):X.addM(0xffffff,.9)),gl=X.glow(col,2.2,.9),arcs=[0,1,2].map(()=>X.bolt(col,.04,.95,6,bl));g.add(ball,gl);S.add(g);arcs.forEach(a=>S.add(a));
 const tg=chronoTarget(16);let tx=tg?tg.x:P.x+dx*14,tz=tg?tg.z:P.z+dz*14;const t0=X.hand(0);let pos=t0.clone();g.position.copy(pos);let exploded=false;
 kfx({u:(F,dt)=>{const t=F.t;if(t<.35){pos.copy(X.hand(0));pos.y+=.1;g.position.copy(pos);g.scale.setScalar(.3+t*2);return true}
  if(!exploded){const vx=tx-pos.x,vz=tz-pos.z,l=Math.hypot(vx,vz),st=22*dt;if(l<=st+.2||t>1.6){exploded=true;boom(pos.x,pos.z);return t<1.75}pos.x+=vx/l*st;pos.z+=vz/l*st;pos.y=1.3+Math.sin(t*8)*.15;g.position.copy(pos);
   for(const a of arcs){const r=1.1;a.userData.set(pos,new T.Vector3(pos.x+(Math.random()-.5)*2*r,pos.y+(Math.random()-.5)*2*r,pos.z+(Math.random()-.5)*2*r),.25)}gl.material.opacity=.7+Math.random()*.3;ball.rotation.y+=dt*9;return true}
  return t<1.75},end:()=>{X.dispose(g);arcs.forEach(X.dispose)}});
 function boom(x,z){X.snd('thunder',.8);P.shake=Math.max(P.shake||0,.25);kShock(x,z,4.5,col,.4,.3);kShock(x,z,2.5,0xffffff,.3,1);fxp({x,y:1,z,c:bl?RD:CY2,n:Math.round(26*Q()),sp:7,sz:.14,life:.5,up:3});
  const first=X.hitArea(x,z,3,d*dmul(),null);first.forEach(e=>{X.stun(e,1.4);X.push(e,e.x-x,e.z-z,6,.3)});
  // corrente: salta para até 4 inimigos próximos
  let from=new T.Vector3(x,1.2,z);const seen=new Set(first);for(let k=0;k<4;k++){const n=X.nearest(from.x,from.z,9,seen);if(!n)break;seen.add(n);const to=new T.Vector3(n.x,1.2,n.z),b=X.boltTree(col,.08,.95,bl),A=from.clone();S.add(b);setTimeout(()=>{if(n.hp>0){hitE(n,d*.55*dmul(),null);X.stun(n,1)}},k*90);kfx({u:F=>{b.userData.set(A,to,.7);b.visible=F.t<.08||F.t>.12;return F.t<.35},end:()=>X.dispose(b)});from=to}}}

// ---------- 3/7) CANHÃO EXPLOSIVO (normal e NEGRO): concentra nas duas mãos e dispara um feixe ----------
function lkCannon(d,dx,dz,isBlack){const bl=isBlack,col=bl?RD:CY,chg=bl?1.0:.7,LEN=bl?28:24;X.word(bl?'CANHÃO EXPLOSIVO RELÂMPAGO NEGRO DE FOGO!':'CANHÃO EXPLOSIVO RELÂMPAGO DE FOGO!',bl?'luckb':'luck');X.armArcs(chg+.2,bl?RD:CY,bl);X.snd(bl?'black':'charge',.8);try{startPose('push')}catch(e){}
 if(bl)X.flash('radial-gradient(ellipse at center,rgba(0,0,0,0) 30%,rgba(20,0,4,.75) 100%)',1,.8);
 P.lock=Math.max(P.lock||0,chg+.5);const f0=P.f,ax=Math.sin(f0),az=Math.cos(f0);
 const ball=new T.Group(),core=new T.Mesh(X.geo('sph'),bl?X.darkM(BK,1):X.addM(0xffffff,.95)),halo=X.glow(col,1,.9),halo2=X.glow(bl?0x000000:CY,1,.5);if(bl){halo2.material.blending=T.NormalBlending;halo2.material.map=smokeTex()}ball.add(core,halo,halo2);S.add(ball);
 const conv=[0,1,2,3].map(()=>X.bolt(col,.035,.9,6,bl));conv.forEach(b=>S.add(b));
 const beam=new T.Group(),bOuter=new T.Mesh(X.geo('beam'),bl?X.darkM(0x050002,.62):X.addM(CY,.55)),bIn=new T.Mesh(X.geo('beam'),X.addM(bl?RD:0xffffff,bl?.85:.95)),bWhite=new T.Mesh(X.geo('beam'),X.addM(0xffffff,bl?.9:.0)),bHalo=new T.Mesh(X.geo('beam'),X.addM(bl?0xff0010:CY,bl?.22:.18));bOuter.scale.set(1.25,1,1.25);bIn.scale.set(bl?.42:.55,1,bl?.42:.55);bWhite.scale.set(bl?.1:.18,1,bl?.1:.18);bHalo.scale.set(1.9,1,1.9);beam.add(bHalo,bOuter,bIn,bWhite);beam.visible=false;S.add(beam);
 const along=[0,1,2,3].map(()=>X.boltTree(col,.09,.9,bl));along.forEach(b=>{b.visible=false;S.add(b)});const rings=[];
 const cracks=[];if(bl){for(let k=0;k<Math.round(7*Q()+3);k++){const c=new T.Mesh(X.geo('crack'),X.darkM(0x000000,.85));const a=k/10*6.28+Math.random();c.rotation.x=-Math.PI/2;c.rotation.z=a;c.position.set(P.x,.04,P.z);c.scale.set(.1,.1,1);S.add(c);cracks.push(c)}}
 let fired=false,hitSet=new Set(),end=null;
 kfx({u:(F,dt)=>{const t=F.t;const mid=X.hand(0).add(X.hand(1)).multiplyScalar(.5);mid.addScaledVector(new T.Vector3(ax,0,az),.35);
  if(t<chg){const u=t/chg;ball.position.copy(mid);ball.scale.setScalar(.25+u*.9+Math.sin(t*40)*.05);halo2.scale.setScalar(1.6+u*1.6);
   conv.forEach((b,i)=>{const a=i*1.57+t*4,r=2.2*(1-u)+.4;b.userData.set(new T.Vector3(mid.x+Math.cos(a)*r,mid.y+Math.sin(a*1.3)*r*.6,mid.z+Math.sin(a)*r),mid,.3)});
   if(Math.random()<(bl?.9:.6)*Q()){const a=Math.random()*6.28,r=2.5;const p={x:mid.x+Math.cos(a)*r,y:mid.y+(Math.random()-.5)*2,z:mid.z+Math.sin(a)*r};fxp({x:p.x,y:p.y,z:p.z,c:bl?0x220006:CY2,n:1,sp:.3,sz:bl?.16:.08,life:.3})}
   if(bl){cracks.forEach((c,i)=>{const s=Math.min(1,u*1.3);c.scale.set(.5+s*.6,.5+s*1.1,1)});if(Math.random()<.3){X.snd('crackle',.25)}}return true}
  if(!fired){fired=true;X.dbg.beam=performance.now();conv.forEach(b=>b.visible=false);X.snd(bl?'black':'thunder',1);P.shake=Math.max(P.shake||0,bl?.45:.32);beam.visible=true;along.forEach(b=>b.visible=true);
   if(!bl)X.flash('rgba(200,255,255,.35)',1,.3);
   const hits=X.hitLine(mid.x,mid.z,ax,az,LEN,bl?1.6:1.3,d*dmul(),null,hitSet);hits.forEach(e=>{X.stun(e,bl?1.2:.6);X.push(e,ax,az,bl?10:7,.35)});
   let len=LEN;for(const e of hits){const l=(e.x-mid.x)*ax+(e.z-mid.z)*az;if(e.boss&&l<len)len=l}end=new T.Vector3(mid.x+ax*len,mid.y,mid.z+az*len);beam.userData.len=len;beam.userData.o=mid.clone()}
  const u=(t-chg)/.55,o=beam.userData.o,len=beam.userData.len;if(u<1){const thick=(u<.15?u/.15:1-Math.max(0,(u-.6)/.4))*(bl?1.35:1);beam.position.copy(o).addScaledVector(new T.Vector3(ax,0,az),len/2);beam.rotation.set(Math.PI/2,0,0);beam.rotation.y=0;beam.lookAt(end);beam.rotateX(Math.PI/2);const jj=1+Math.sin(t*70)*(bl?.12:.06);beam.scale.set(thick*jj,len,thick*jj);if(bl){bOuter.rotation.y+=dt*9;bIn.material.opacity=.6+Math.random()*.35}
    along.forEach(b=>b.userData.set(o,end,bl?.9:.7));ball.position.copy(o);ball.scale.setScalar(1.2*thick+.2);
    if(Math.random()<.5){const r=new T.Mesh(X.geo('ring'),bl?X.darkM(0x000000,.6):X.addM(CY,.6));r.position.copy(o).addScaledVector(new T.Vector3(ax,0,az),Math.random()*len);r.lookAt(end);S.add(r);rings.push({r,t:0})}
    if(F.k124==null&&u>.15){F.k124=1;X.hitLine(o.x,o.z,ax,az,len,bl?1.6:1.3,d*.25*dmul(),null,new Set())}}
  else if(!F.b124){F.b124=1;beam.visible=false;along.forEach(b=>b.visible=false);ball.visible=false;explode(end)}
  for(const R of rings){R.t+=dt;R.r.scale.setScalar(1+R.t*6);R.r.material.opacity=Math.max(0,.6-R.t*1.8)}
  if(bl&&cracks.length)cracks.forEach(c=>{c.material.opacity=Math.max(0,.85-(t-chg)*.6)});return t<chg+1.6},end:()=>{X.dispose(ball);X.dispose(beam);conv.forEach(X.dispose);along.forEach(X.dispose);rings.forEach(R=>X.dispose(R.r));cracks.forEach(X.dispose)}});
 function explode(p){X.snd('boom',1);kShock(p.x,p.z,bl?6:4.5,col,.45,.3);X.hitArea(p.x,p.z,bl?4:3,d*.4*dmul(),null);
  const s=new T.Mesh(X.geo('sph'),bl?X.darkM(0x000000,.95):X.addM(CY2,.8));s.position.copy(p);S.add(s);const s2=X.glow(col,4,.9);s2.position.copy(p);S.add(s2);
  kfx({u:F=>{const t=F.t;if(bl){const k=t<.3?t/.3:Math.max(0,1-(t-.3)*2.5);s.scale.setScalar(.2+k*3.4)}else s.scale.setScalar(.3+t*7);s.material.opacity=Math.max(0,(bl?.95:.8)-t*1.4);s2.material.opacity=Math.max(0,.9-t*1.8);return t<.7},end:()=>{X.dispose(s);X.dispose(s2)}});
  fxp({x:p.x,y:p.y,z:p.z,c:bl?RD:CY2,n:Math.round(30*Q()),sp:9,sz:.14,life:.55,up:4});if(bl)fxp({x:p.x,y:p.y,z:p.z,c:0x0a0204,n:Math.round(18*Q()),sp:5,sz:.4,life:.8,up:2})}}

// ---------- 4) KERAUNOS: nuvem no alvo e o raio gigante vindo do céu ----------
function lkKeraunos(d,dx,dz){const bl=black(),col=bl?RD:CY;X.word('KERAUNOS!',bl?'luckb':'luck');X.snd('charge',.8);try{startPose('raise')}catch(e){}P.lock=Math.max(P.lock||0,.9);
 const tg=chronoTarget(22),cx=tg?tg.x:P.x+dx*12,cz=tg?tg.z:P.z+dz*12,R=5;
 // braço erguido: raio subindo da mão até o céu
 const up=X.bolt(col,.06,.95,10,bl);S.add(up);
 const cloud=new T.Group();for(let k=0;k<Math.round(7*Q()+3);k++){const c=X.smoke(bl?0x050102:0x2a3242,6+Math.random()*4,.0);c.position.set(cx+(Math.random()-.5)*8,22+Math.random()*3,cz+(Math.random()-.5)*8);cloud.add(c)}S.add(cloud);
 const mark=new T.Mesh(X.geo('disc'),bl?X.darkM(0x000000,0):X.addM(col,0));mark.rotation.x=-Math.PI/2;mark.position.set(cx,.06,cz);mark.scale.setScalar(R);S.add(mark);const mring=new T.Mesh(X.geo('ring'),X.addM(col,0));mring.rotation.x=-Math.PI/2;mring.position.set(cx,.08,cz);S.add(mring);
 const pillar=new T.Group(),pc=new T.Mesh(X.geo('beam'),bl?X.darkM(BK,.95):X.addM(0xffffff,.95)),po=new T.Mesh(X.geo('beam'),X.addM(col,.5));po.scale.set(2.2,1,2.2);pillar.add(pc,po);pillar.visible=false;pillar.position.set(cx,20,cz);S.add(pillar);
 const bolts=[0,1,2,3,4].map(()=>X.boltTree(col,.16,.95,bl));bolts.forEach(b=>{b.visible=false;S.add(b)});let struck=false;
 kfx({u:(F,dt)=>{const t=F.t;
  if(t<.9){const h=X.hand(0);if(Math.random()<.8)up.userData.set(h,new T.Vector3(h.x+(Math.random()-.5)*2,26,h.z+(Math.random()-.5)*2),1.2);up.visible=Math.random()<.8;
   cloud.children.forEach((c,i)=>{c.material.opacity=Math.min(bl?.95:.75,t*1.2);c.position.x+=Math.sin(t*2+i)*dt*.6});mark.material.opacity=Math.min(.35,t*.5);mring.scale.setScalar(R*(1.6-t*.7));mring.material.opacity=Math.min(.9,t);
   if(Math.random()<.15){const b=bolts[0];b.visible=true;b.userData.set(new T.Vector3(cx+(Math.random()-.5)*8,22,cz+(Math.random()-.5)*8),new T.Vector3(cx+(Math.random()-.5)*10,21,cz+(Math.random()-.5)*10),1.2)}else bolts[0].visible=false;return true}
  if(!struck){struck=true;X.dbg.ker=performance.now();up.visible=false;X.snd('thunder',1.2);P.shake=Math.max(P.shake||0,.55);X.flash(bl?'rgba(30,0,6,.75)':'rgba(230,255,255,.8)',1,.5);pillar.visible=true;
   const hs=X.hitArea(cx,cz,R,d*dmul(),null);hs.forEach(e=>{X.stun(e,1.6);X.push(e,e.x-cx,e.z-cz,8,.3)});kShock(cx,cz,R*1.6,col,.5,.3);kShock(cx,cz,R,0xffffff,.35,.6);
   fxp({x:cx,y:.5,z:cz,c:bl?RD:CY2,n:Math.round(40*Q()),sp:10,sz:.15,life:.7,up:6});if(bl)fxp({x:cx,y:.5,z:cz,c:0x050102,n:Math.round(24*Q()),sp:6,sz:.5,life:1,up:3})}
  const u=t-.9;if(u<.7){const k=u<.1?u/.1:Math.max(0,1-(u-.1)/.6);pillar.scale.set(k*1.6+.05,40,k*1.6+.05);po.material.opacity=.5*k;pc.material.opacity=(bl?.95:.95)*k;
   bolts.forEach((b,i)=>{b.visible=Math.random()<.85&&k>.05;const a=i/5*6.28+u*3,r=R*.6;b.userData.set(new T.Vector3(cx+Math.cos(a)*r*1.5,24,cz+Math.sin(a)*r*1.5),new T.Vector3(cx+Math.cos(a)*r*.4,0,cz+Math.sin(a)*r*.4),1.6)})}else{pillar.visible=false;bolts.forEach(b=>b.visible=false)}
  mark.material.opacity=Math.max(0,.35-(u>0?u*.3:0));cloud.children.forEach(c=>c.material.opacity=Math.max(0,c.material.opacity-(u>.6?dt*.8:0)));return t<2.4},end:()=>{X.dispose(up);X.dispose(cloud);X.dispose(mark);X.dispose(mring);X.dispose(pillar);bolts.forEach(X.dispose)}})}

// ===================================================================================
//                       FORMAS (transformações) — sequência própria de cada uma
// ===================================================================================
// início → manifestação → efeitos → transformação → explosão final; enquanto ativa: visual contínuo e bônus; fim: dissipação.
function formEnd(silent){const f=L.form;if(!f)return;L.form=null;try{(L.parts||[]).forEach(X.dispose)}catch(e){}L.parts=[];L.tick=null;GR.raio.p.spd=.08;GR.raio.p.dmg=0;X.cdBoost=0;try{buildBtns()}catch(e){}
 if(!silent){X.snd('crackle',.5);fxp({x:P.x,y:1.2,z:P.z,c:f=='black'?0x220006:CY2,n:Math.round(20*Q()),sp:4,sz:.14,life:.6,up:2});toast('A forma de relâmpago se desfez.')}}
X.formEnd=formEnd;
function attach(obj,boneGetter){obj.userData.f124=boneGetter;return obj}
function formStart(kind,d){if(L.form)formEnd(true);const bl=kind=='black',col=bl?RD:CY;L.busy=true;P.lock=Math.max(P.lock||0,1.35);P.iv=Math.max(P.iv||0,1.4);try{startPose('kdom')}catch(e){}X.snd('transform',.9);
 const name={beast:'DEMÔNIO DO TROVÃO!',battle:'DEMÔNIO DE BATALHA RELÂMPAGO!',black:'DEMÔNIO DE BATALHA RELÂMPAGO NEGRO!'}[kind];X.word(name,bl?'luckb':'luck');
 // 1) início: energia sobe do chão em espiral
 const sp=[];for(let k=0;k<5;k++){const b=X.bolt(col,.05,.9,8,bl);S.add(b);sp.push(b)}
 const orb=new T.Mesh(X.geo('sph'),bl?X.darkM(0x000000,0):X.addM(col,0));S.add(orb);const shell=new T.Mesh(X.geo('sphw'),X.addM(bl?RD:CY2,0));S.add(shell);
 if(bl)X.flash('radial-gradient(ellipse at center,rgba(0,0,0,.2) 20%,rgba(10,0,2,.85) 100%)',1,1.2);
 kfx({u:(F,dt)=>{const t=F.t,c=new T.Vector3(P.x,1.1+(P.y||0),P.z);
  if(t<.6){sp.forEach((b,i)=>{const a=i/5*6.28+t*6,r=2.4*(1-t/.6)+.4;b.userData.set(new T.Vector3(P.x+Math.cos(a)*r,0,P.z+Math.sin(a)*r),new T.Vector3(P.x+Math.cos(a+1)*r*.5,1+t*2,P.z+Math.sin(a+1)*r*.5),.4)});if(Math.random()<.7*Q())fxp({x:P.x+(Math.random()-.5)*3,y:.1,z:P.z+(Math.random()-.5)*3,c:bl?0x150004:CY2,n:1,sp:.2,sz:bl?.2:.1,life:.4,up:4})}
  // 2) manifestação: esfera envolve o corpo
  else if(t<1.1){const u=(t-.6)/.5;sp.forEach(b=>b.userData.set(c,new T.Vector3(c.x+(Math.random()-.5)*3,c.y+(Math.random()-.5)*3,c.z+(Math.random()-.5)*3),.5));orb.position.copy(c);orb.scale.setScalar(.6+u*1.1);orb.material.opacity=(bl?.85:.45)*u;shell.position.copy(c);shell.scale.setScalar(.8+u*1.2);shell.material.opacity=.5*u;shell.rotation.y+=dt*4}
  // 3) transformação + 4) explosão final
  else if(!F.x124){F.x124=1;sp.forEach(b=>b.visible=false);X.snd(bl?'black':'thunder',1.1);P.shake=Math.max(P.shake||0,.4);kShock(P.x,P.z,6,col,.5,.3);kShock(P.x,P.z,3.5,bl?0x000000:0xffffff,.35,1);fxp({x:c.x,y:c.y,z:c.z,c:bl?RD:CY2,n:Math.round(36*Q()),sp:9,sz:.15,life:.6,up:3});if(bl)fxp({x:c.x,y:c.y,z:c.z,c:0x0a0204,n:Math.round(20*Q()),sp:5,sz:.5,life:.9,up:2});
   X.hitArea(P.x,P.z,4,d*dmul(),null).forEach(e=>{X.stun(e,.8);X.push(e,e.x-P.x,e.z-P.z,9,.35)});build(kind);L.busy=false}
  else{const u=(t-1.1)/.35;orb.scale.setScalar(1.7+u*2);orb.material.opacity=Math.max(0,(bl?.85:.45)*(1-u));shell.material.opacity=Math.max(0,.5*(1-u));shell.scale.setScalar(2+u*3)}
  return t<1.45},end:()=>{sp.forEach(X.dispose);X.dispose(orb);X.dispose(shell);L.busy=false}})}
// partes de cada forma (presas ao corpo) e o que acontece a cada quadro
function build(kind){const bl=kind=='black',col=bl?RD:CY;L.form=kind;X.dbg.form=performance.now();L.ft=0;L.fd=kind=='beast'?18:kind=='battle'?22:24;L.parts=[];L.cd=0;
 const limb=(i,leg)=>()=>{try{return leg?PP.legs[i][1]:PP.arms[i][1]}catch(e){return null}};
 if(kind=='beast'){// DEMÔNIO DO TROVÃO: uma fera gigante feita de relâmpagos acompanha o corpo
  const beast=new T.Group();const skel=[// pares de pontos (cabeça com chifres, ombros, garras, costas)
   [[0,4.2,-.6],[-.9,5.2,-.4]],[[0,4.2,-.6],[.9,5.2,-.4]],[[-.9,5.2,-.4],[-1.3,6,-.1]],[[.9,5.2,-.4],[1.3,6,-.1]],[[-.5,3.6,-.4],[.5,3.6,-.4]],[[0,4.2,-.6],[0,2.2,-.8]],
   [[-.5,3.6,-.4],[-2.2,3,0]],[[.5,3.6,-.4],[2.2,3,0]],[[-2.2,3,0],[-2.6,1.6,.9]],[[2.2,3,0],[2.6,1.6,.9]],[[-2.6,1.6,.9],[-2.9,1.2,1.5]],[[2.6,1.6,.9],[2.9,1.2,1.5]],[[0,2.2,-.8],[-1,.2,-.6]],[[0,2.2,-.8],[1,.2,-.6]]];
  const bs=skel.map(()=>X.bolt(col,.15,.9,6));bs.forEach(b=>beast.add(b));const eyes=[-1,1].map(s=>{const e=X.glow(0xffffff,1,1);e.position.set(s*.3,4.15,-.15);beast.add(e);return e});const halo=X.glow(CY,7,.18);halo.position.y=3.4;beast.add(halo);
  const vol=[[0,4.3,-.5,2.2],[0,3.3,-.6,3.2],[-2.2,2.9,0,1.8],[2.2,2.9,0,1.8],[-2.7,1.4,1,1.4],[2.7,1.4,1,1.4]].map(v=>{const g=X.glow(CY,v[3],.3);g.position.set(v[0],v[1],v[2]);beast.add(g);return g});beast.scale.setScalar(1.15);
  S.add(beast);L.parts.push(beast);GR.raio.p.spd=.3;
  L.tick=(dt,t)=>{beast.position.set(P.x,(P.y||0),P.z);beast.rotation.y=P.f;const sw=Math.sin(t*2)*.15;skel.forEach((s,i)=>{if(Math.random()<.6)bs[i].userData.set(new T.Vector3(s[0][0],s[0][1]+sw,s[0][2]),new T.Vector3(s[1][0],s[1][1]+sw*(i>5?1.5:1),s[1][2]),.18)});halo.material.opacity=.12+Math.random()*.1;vol.forEach((g,i)=>g.material.opacity=.22+Math.sin(t*9+i)*.08);
   L.cd-=dt;if(L.cd<=0){const e=X.nearest(P.x,P.z,11);if(e){L.cd=1.1;const from=new T.Vector3(P.x+Math.cos(P.f)*(Math.random()<.5?2.6:-2.6),2.8,P.z-Math.sin(P.f)*2.6),to=new T.Vector3(e.x,1,e.z),b=X.boltTree(col,.12,.95);S.add(b);X.snd('zap',.5);hitE(e,(GR.raio.s[4][2])*(1+P.st.mag*.02)*.45,null);X.stun(e,.4);kShock(e.x,e.z,1.6,col,.25,.3);kfx({u:F=>{b.userData.set(from,to,.9);return F.t<.25},end:()=>X.dispose(b)})}else L.cd=.3}}}
 else{// DEMÔNIO DE BATALHA (normal e NEGRO): luvas, botas e armadura de relâmpago no corpo
  const gm=new T.MeshBasicMaterial({color:bl?0x0c0306:0xc8fbff}),rimM=X.addM(bl?RD:CY,bl?.85:.8);
  const mk=(geo,parentGet,pos,scale)=>{const g=new T.Group();const m=new T.Mesh(X.geo(geo),gm),r=new T.Mesh(X.geo(geo),rimM);r.scale.setScalar(1.12);g.add(m,r);g.position.fromArray(pos);g.scale.setScalar(scale||1);const p=parentGet();if(p)p.add(g);L.parts.push(g);return g};
  for(const i of[0,1]){mk('gaunt',limb(i),[0,-.22,0],1);mk('boot',limb(i,1),[0,-.36,.02],1)}
  const chest=new T.Group();const cm=new T.Mesh(X.geo('chest'),gm),cr=new T.Mesh(X.geo('chest'),rimM);cr.scale.setScalar(1.06);chest.add(cm,cr);chest.position.set(0,1.38,.03);try{PP.root.add(chest)}catch(e){pm.add(chest)}L.parts.push(chest);
  const arcs=[0,1,2,3,4,5].map(()=>{const b=X.bolt(col,.03,.95,5,bl);S.add(b);L.parts.push(b);return b});const aura=[];
  if(bl){for(let k=0;k<Math.round(8*Q()+2);k++){const s=X.smoke(0x050102,1.2,.6);S.add(s);L.parts.push(s);aura.push({s,a:Math.random()*6.28,y:Math.random()*2,v:.6+Math.random()})}}
  const gl=X.glow(col,3.2,bl?.0:.25);S.add(gl);L.parts.push(gl);GR.raio.p.spd=bl?.7:.6;GR.raio.p.dmg=bl?.25:.12;X.cdBoost=bl?.6:.5;
  L.tick=(dt,t)=>{const pts=[X.hand(0),X.hand(1),X.shoulder(0),X.shoulder(1)];arcs.forEach((b,i)=>{if(Math.random()<.5){const A=pts[i%4],B=new T.Vector3(A.x+(Math.random()-.5)*1.2,A.y+(Math.random()-.5)*1.2,A.z+(Math.random()-.5)*1.2);b.userData.set(A,B,.25)}b.visible=Math.random()<.7});
   gl.position.set(P.x,1.2+(P.y||0),P.z);gl.material.opacity=bl?0:.18+Math.random()*.12;
   aura.forEach(o=>{o.y+=dt*o.v*1.6;if(o.y>2.6){o.y=0;o.a=Math.random()*6.28}o.s.position.set(P.x+Math.cos(o.a)*.45,o.y+(P.y||0),P.z+Math.sin(o.a)*.45);o.s.material.opacity=.7*(1-o.y/2.6);o.s.scale.setScalar(.6+o.y*.4)});
   // rastro ao andar e raios negros automáticos
   const mv=Math.hypot(P.x-(L.lx||P.x),P.z-(L.lz||P.z));L.lx=P.x;L.lz=P.z;if(mv>.05&&Math.random()<.6*Q())fxp({x:P.x,y:.15,z:P.z,c:bl?0x0a0204:CY2,n:1,sp:.5,sz:bl?.3:.12,life:.5});
   if(bl){L.cd-=dt;if(L.cd<=0){const e=X.nearest(P.x,P.z,9);if(e){L.cd=.9;const b=X.boltTree(0x000000,.11,.95,true),b2=X.bolt(RD,.03,.9,8),from=new T.Vector3(e.x+(Math.random()-.5)*3,14,e.z+(Math.random()-.5)*3),to=new T.Vector3(e.x,0,e.z);S.add(b,b2);X.snd('zap',.4);hitE(e,(GR.raio.s[7][2])*(1+P.st.mag*.02)*.4,null);X.stun(e,.35);kShock(e.x,e.z,1.4,RD,.25,.3);kfx({u:F=>{b.userData.set(from,to,1);b2.userData.set(from,to,1);return F.t<.25},end:()=>{X.dispose(b);X.dispose(b2)}})}else L.cd=.3}}}}
 try{buildBtns()}catch(e){}toast({beast:'Demônio do Trovão: a fera de relâmpago ataca quem chegar perto (18s).',battle:'Demônio de Batalha Relâmpago: +60% de velocidade, recargas mais rápidas e +12% de dano (22s).',black:'Relâmpago Negro: +70% de velocidade, +25% de dano e raios negros automáticos (24s).'}[kind])}
function lkFormCast(kind){return d=>{if(L.form===kind){formEnd();return}formStart(kind,d)}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(L.form){if(!P.g||P.g.id!='raio'||P.hp<=0){formEnd(true)}else{L.ft+=dt;if(L.tick)L.tick(dt,L.ft);if(L.ft>=L.fd)formEnd()}}}catch(e){try{ERR122(e)}catch(_){}}return r}}
// formas: tocar de novo encerra; não é possível transformar no meio de outra transformação
const fpre=()=>!L.busy;
X.reg('lkarrow',lkArrow);X.reg('lksph',lkSphere);X.reg('lkcan',(d,dx,dz)=>lkCannon(d,dx,dz,false));X.reg('lkcanb',(d,dx,dz)=>lkCannon(d,dx,dz,true));X.reg('lkera',lkKeraunos);
X.reg('lkdemon',lkFormCast('beast'),fpre);X.reg('lkform',lkFormCast('battle'),fpre);X.reg('lkformb',lkFormCast('black'),fpre);
// ---------------- formas geométricas compartilhadas ----------------
const GEO={};X.geo=function(k){if(GEO[k])return GEO[k];let g;
 if(k=='sph')g=new T.SphereGeometry(.5,14,10);else if(k=='sphw')g=new T.IcosahedronGeometry(.6,1);else if(k=='beam')g=new T.CylinderGeometry(.5,.5,1,14,1,true);else if(k=='ring')g=new T.TorusGeometry(.6,.04,6,28);
 else if(k=='disc')g=new T.CircleGeometry(1,32);else if(k=='arrow'){g=new T.ConeGeometry(.09,1.1,6);g.rotateX(Math.PI/2)}else if(k=='crack'){const sh=new T.Shape();sh.moveTo(-.03,0);sh.lineTo(.05,.7);sh.lineTo(-.02,1.3);sh.lineTo(.04,2);sh.lineTo(0,2.8);sh.lineTo(-.04,2);sh.lineTo(-.08,1.3);sh.lineTo(-.02,.7);sh.lineTo(-.06,0);g=new T.ShapeGeometry(sh)}
 else if(k=='gaunt')g=new T.CylinderGeometry(.095,.085,.24,8);else if(k=='boot')g=new T.CylinderGeometry(.11,.1,.22,8);else if(k=='chest'){g=new T.CylinderGeometry(.3,.26,.42,10,1,true,-1.2,2.4)}
 else g=new T.BoxGeometry(.2,.2,.2);g._keep=1;return GEO[k]=g};
})();
// recarga visível também nos botões 7 e 8 (o HUD original só pinta 6)
function cd78(){try{if(P.g){const ph=locked();for(let i=6;i<9;i++){const b=document.getElementById('sk'+i);if(b&&b.style.setProperty){const v=Math.round(Math.min(1,Math.max(0,(ph?(P.cd2||[])[i]:P.cd[i])||0)/(ph?.5:((P.cdm&&P.cdm[i])||.5)))*100)/100;if(b._cd!==v){b._cd=v;b.style.setProperty('--cd',v)}}}}}catch(e){}}
{const _u2=tUpdate;tUpdate=function(dt){const r=_u2.apply(this,arguments);cd78();return r}}

