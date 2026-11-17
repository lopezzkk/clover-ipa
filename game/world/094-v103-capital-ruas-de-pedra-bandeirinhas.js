// ================= V103 · Capital: ruas de pedra, bandeirinhas, montanhas nevadas, relógio de sol com grimório · interiores maiores com interação =================
// A essência da Capital continua: muralha, portão, Castelo Real, fonte, mercado, lojas, taverna, biblioteca e templo no mesmo lugar.
const V103={};
// ---------- textura de paralelepípedo (desenhada em código)
function cob103(base,mort,sz){try{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=mort;x.fillRect(0,0,256,256);let r=7;const rnd2=()=>(r=(r*16807)%2147483647)/2147483647;
 const rows=8;for(let j=0;j<rows;j++){const h=256/rows,off=(j%2)*16;for(let i=-1;i<9;i++){const w=32,px=i*w+off+2,py=j*h+2;const t=rnd2()*.22-.11;const b=base.map(v=>Math.max(0,Math.min(255,v*(1+t))));x.fillStyle='rgb('+b.join(',')+')';
  x.beginPath();const rr=6;x.moveTo(px+rr,py);x.lineTo(px+w-4-rr,py);x.quadraticCurveTo(px+w-4,py,px+w-4,py+rr);x.lineTo(px+w-4,py+h-4-rr);x.quadraticCurveTo(px+w-4,py+h-4,px+w-4-rr,py+h-4);x.lineTo(px+rr,py+h-4);x.quadraticCurveTo(px,py+h-4,px,py+h-4-rr);x.lineTo(px,py+rr);x.quadraticCurveTo(px,py,px+rr,py);x.fill();
  x.fillStyle='rgba(255,255,255,.08)';x.fillRect(px+3,py+3,w-12,4)}}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t}catch(e){return null}}
{const CX=0,CZC=CZ,WR=64;
 const tA=cob103([150,152,168],'#5a5a66'),tB=cob103([196,186,166],'#8a8070');
 if(tB){tB.repeat.set(30,30);const m=new T.MeshLambertMaterial({map:tB});const fl=new T.Mesh(new T.CircleGeometry(WR-1.2,48),m);fl.rotation.x=-Math.PI/2;fl.position.set(CX,.026,CZC);fl.receiveShadow=true;S.add(fl)}
 if(tA){const t2=tA.clone();t2.needsUpdate=true;t2.repeat.set(2.5,31);const m=new T.MeshLambertMaterial({map:t2});const av=new T.Mesh(new T.PlaneGeometry(9.4,WR*2-6),m);av.rotation.x=-Math.PI/2;av.position.set(CX,.036,CZC);av.receiveShadow=true;S.add(av);
  const t3=tA.clone();t3.needsUpdate=true;t3.repeat.set(30,2);const m3=new T.MeshLambertMaterial({map:t3});const mk3=new T.Mesh(new T.PlaneGeometry(WR*2-9,7.4),m3);mk3.rotation.x=-Math.PI/2;mk3.position.set(CX,.037,CZC+16);S.add(mk3);
  // calçada (meio-fio) dos dois lados da avenida
  for(const s of[-1,1]){const cb=mk(new T.BoxGeometry(.35,.14,WR*2-8),0x8a8478);cb.position.set(CX+s*4.9,.07,CZC);S.add(cb)}}}
// ---------- bandeirinhas atravessando a avenida e a rua do mercado (um único desenho com várias cores)
{const pos=[],col=[];const C=[[.82,.62,.12],[.62,.12,.16],[.2,.3,.62],[.9,.85,.7]];const flagLine=(x1,z1,x2,z2,y,sag)=>{const n=Math.round(Math.hypot(x2-x1,z2-z1)/.9);for(let i=0;i<n;i++){const t0=i/n,t1=(i+.8)/n,tm=(i+.4)/n;const P0=[x1+(x2-x1)*t0,y-sag*4*t0*(1-t0),z1+(z2-z1)*t0],P1=[x1+(x2-x1)*t1,y-sag*4*t1*(1-t1),z1+(z2-z1)*t1],P2=[x1+(x2-x1)*tm,y-sag*4*tm*(1-tm)-.75,z1+(z2-z1)*tm];pos.push(...P0,...P1,...P2);const c=C[i%C.length];for(let k=0;k<3;k++)col.push(...c)}};
 const L=[];for(let z=CZ+56;z>CZ-22;z-=9){flagLine(-7.5,z,7.5,z+.5,7.4,.9);L.push([-7.5,z,7.5,z+.5,7.4])}for(let x=-50;x<=50;x+=13){if(Math.abs(x)<8)continue;flagLine(x,CZ+16-6.8,x+1,CZ+16+6.8,6.4,.7);L.push([x,CZ+16-6.8,x+1,CZ+16+6.8,6.4])}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeVertexNormals();const m=new T.Mesh(g,new T.MeshLambertMaterial({vertexColors:true,side:T.DoubleSide}));S.add(m);V103.flags=m;
 // cordas
 const lp=[];for(const [x1,z1,x2,z2,y] of L){for(let i=0;i<16;i++){const a=i/16,b=(i+1)/16;lp.push(x1+(x2-x1)*a,y-.9*4*a*(1-a)+.02,z1+(z2-z1)*a,x1+(x2-x1)*b,y-.9*4*b*(1-b)+.02,z1+(z2-z1)*b)}}const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(lp,3));S.add(new T.LineSegments(lg,new T.LineBasicMaterial({color:0x2a2018})));
 // postes onde as cordas se prendem (só na avenida)
 {const gg=G83();for(const [x1,z1,x2,z2,y] of L.slice(0,9)){for(const [x,z] of[[x1,z1],[x2,z2]]){bp(gg,CY(.1,.12,y+.2,6),0x4a3424,x,(y+.2)/2,z,1)}}S.add(gg)}}
// ---------- estandartes azuis com trevo dourado no portão e na avenida
{const g=G83();for(let z=CZ+40;z>CZ-14;z-=18)for(const s of[-1,1]){bp(g,CY(.07,.07,4.6,6),0x3a2a1a,s*6.4,2.3,z);bp(g,BX(1.1,.06,.06),0x3a2a1a,s*6.4-s*.5,4.5,z);const b=bp(g,BX(.9,1.9,.04),0x2f3e8a,s*6.4-s*.5,3.5,z);bp(g,SP(.22,8,6),0xe0b020,s*6.4-s*.5,3.6,z+.04);bp(g,CN(.45,.4,3),0x2f3e8a,s*6.4-s*.5,2.35,z).rotation.z=Math.PI}S.add(g)}
// ---------- relógio de sol com grimório na praça (desenho próprio)
{const g=G83(),x=11,z=CZ+6;bp(g,CY(1.6,1.9,.5,8),0xc8c2b4,0,.25,0,1);bp(g,CY(1.1,1.3,1.6,6),0xe2dccc,0,1.3,0,1);bp(g,CY(1.35,1.35,.2,6),0xc8c2b4,0,2.15,0,1);
 for(let k=0;k<6;k++){const a=k/6*6.283;const r=bp(g,BX(.5,.5,.03),0x7a5a2a,Math.cos(a)*1.16,1.3,Math.sin(a)*1.16);r.rotation.y=-a+Math.PI/2}
 const bk=G83();bp(bk,BX(1.5,.18,1.1),0x4a3a2e,0,0,0,1);bp(bk,BX(1.4,.12,1),0xf0e6cc,0,.12,0);bp(bk,SP(.22,8,6),0xe0b020,0,.2,0);bk.position.set(0,2.6,0);bk.rotation.x=-.45;g.add(bk);
 const ar=new T.Mesh(new T.TorusGeometry(1.1,.05,6,32,Math.PI*1.4),WM(0xc8902a));ar.position.set(0,2.9,0);ar.rotation.set(.4,0,.3);g.add(ar);const ar2=new T.Mesh(new T.TorusGeometry(.9,.04,6,32,Math.PI*1.2),WM(0x8a6a2a));ar2.position.set(0,2.9,0);ar2.rotation.set(1.3,.5,0);g.add(ar2);
 const gn=bp(g,CN(.08,2,5),0xc8a040,0,3.6,0,1);gn.rotation.z=.4;g.position.set(x,0,z);S.add(g);sol(x,z,1.9);V103.sun={g,ar,ar2}}
// ---------- montanhas nevadas no horizonte (ao norte e nos lados da Capital, longe das estradas)
{const g=G83();const peak=(x,z,r,h,c)=>{bp(g,CN(r,h,9),c||0x6a7488,x,h/2,z,0);bp(g,CN(r*.42,h*.42,9),0xf4f6fa,x,h*.79+.05,z,0)};
 const L=[[-170,-470,34,62],[-120,-500,28,48],[-205,-430,26,44],[160,-480,36,66],[118,-510,26,46],[205,-445,24,40],[-60,-530,22,34],[70,-540,24,38]];
 for(const [x,z,r,h] of L){peak(x,z,r,h);sol(x,z,r*.8)}S.add(g)}

// =====================================================================
// INTERIORES: casa de enxaimel grande com mezanino (2º andar), escada e móveis com interação
// =====================================================================
const IA103={btn:null,cur:null};
function ia103Add(R,o){(R.ia=R.ia||[]).push(o)}
const LORE103=['"O grimório escolhe o mago, não o contrário." — anotação de um bibliotecário da Capital.','"Os Cavaleiros Mágicos protegem o Reino de Clover há gerações."','"Dizem que um trevo de cinco folhas abriga um demônio." — lenda antiga.','"O Rei Mago é escolhido pelos seus feitos, não pelo nome da família."','"Magia nasce da mana; a mana nasce da vontade."','Receita de pão de mel da avó. Alguém marcou: "o melhor da Capital!".','Mapa antigo do Reino Esquecido, com a Vila Hage circulada.','Diário de um aprendiz: "Hoje treinei 500 golpes. Amanhã, 600."'];
function chest103(R,key){return()=>{const v=v82S();v.ch103=v.ch103||{};const day=new Date().toISOString().slice(0,10);if(v.ch103[key]===day){toast('O baú está vazio. Volte amanhã.');return}v.ch103[key]=day;const c=15+Math.floor(Math.random()*26);P.coins+=c;toast('🎁 Você achou '+c+' moedas no baú!');try{saveGame()}catch(e){}}}
function rest103(){int86Fade(()=>{P.hp=P.mhp;P.mp=P.mmp;toast('💤 Você descansou. Vida e mana cheias!')})}
let eat103=0;function eat103f(){const t=performance.now()/1000;if(t<eat103){toast('Você está satisfeito. Espere um pouco.');return}eat103=t+60;P.hp=Math.min(P.mhp,P.hp+P.mhp*.35);toast('🍞 Delicioso! +35% de vida.')}
function wardrobe103(){try{const ks=Object.keys(SK).filter(k=>P.own[k]);if(ks.length<2){toast('Você só tem um uniforme. Compre mais na Loja da Capital.');return}let i=ks.indexOf(P.eq);i=(i+1)%ks.length;skin(ks[i]);toast('👕 Uniforme: '+SK[ks[i]][0]);try{saveGame()}catch(e){}}catch(e){}}
function fire103(g,x,z,ry){const F=G83();bp(F,BX(2.6,3,.9),0x8a847a,0,1.5,0,1);bp(F,BX(1.5,1.2,.4),0x1a1210,0,.7,.3);bp(F,BX(3,.24,1.1),0x6a645a,0,3,0);bp(F,BX(.9,2.6,.7),0x8a847a,0,4.3,-.1,1);
 const fl=G83();for(let k=0;k<4;k++)bp(fl,CN(.2,.6,5),[0xff6a1a,0xffb020,0xff8a2a,0xffd040][k],(k-1.5)*.24,.62,.32,0,1);F.add(fl);const L=new T.PointLight(0xff9a3a,1.2,9);L.position.set(0,1,.8);F.add(L);F.position.set(x,0,z);F.rotation.y=ry||0;g.add(F);return{fl,L}}
// (interior das casas de enxaimel removido: casas comuns não têm interior)
// (interações dentro das casas comuns removidas junto com os interiores)
// botão de interação
function ia103Tick(){let b=IA103.btn;if(!b){b=document.createElement('button');b.id='ia103';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 150px);z-index:41;padding:10px 18px;border-radius:12px;border:2px solid #f0cf72;background:linear-gradient(180deg,#2a1e0e,#1a1208);color:#ffe9a0;font:700 15px system-ui;display:none;box-shadow:0 4px 14px rgba(0,0,0,.5)';
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const c=IA103.cur;if(c)try{c.f()}catch(er){}});document.body.appendChild(b);IA103.btn=b}
 let best=null;if(INT86.on&&INT86.cur&&INT86.cur.ia){let bd=1e9;for(const it of INT86.cur.ia){if(Math.abs((P.y||0)-it.y)>1.2)continue;const d=Math.hypot(P.x-it.p[0],P.z-it.p[1]);if(d<it.r&&d<bd){bd=d;best=it}}}
 IA103.cur=best;if(best){if(b.textContent!==best.t)b.textContent=best.t;b.style.display='block'}else b.style.display='none'}
// tecla E também interage
addEventListener('keydown',e=>{if((e.key=='e'||e.key=='E')&&IA103.cur&&!e.repeat){try{IA103.cur.f()}catch(er){}}});
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{ia103Tick()}catch(e){}try{if(V103.sun){V103.sun.ar.rotation.y+=dt*.3;V103.sun.ar2.rotation.z+=dt*.2}}catch(e){}return r}}

