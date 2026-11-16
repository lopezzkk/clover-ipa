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
function tudorRoom(k){const v=(+k.split('#')[1]||0)+(/cottage|stone/.test(k)?1:/rich/.test(k)?2:0);const W=22,Dd=18,H=7.6;const R=room86(k,W,Dd,H,0x8a6a48,[0xf2e6cc,0xeadcbc,0xf5ecd8,0xe6d6b4][v%4],{tiles:0x6a5038}),g=R.g,w2=W/2,d2=Dd/2;
 // vigas escuras no teto e nas paredes (enxaimel por dentro)
 for(let x=-w2+2;x<w2;x+=3)bp(g,BX(.3,.3,Dd),0x3a2416,x,H-.15,0);for(const s of[-1,1])for(let z=-d2+2;z<d2;z+=3)bp(g,BX(.18,H,.18),0x3a2416,s*(w2-.12),H/2,z);for(let x=-w2+2;x<w2;x+=3)bp(g,BX(.18,H,.18),0x3a2416,x,H/2,-d2+.12);
 // térreo: cozinha, mesa de jantar com comida, lareira grande
 IK.stove(g,w2-1.3,d2-3.4,-Math.PI/2);IK.counter(g,w2-.7,d2-6,3,-Math.PI/2,0x8a6a48);IK.table(g,1,3,3.4,1.6,0x7a4a2a);for(let i=0;i<3;i++){IK.chair(g,i*1.1,4.2,Math.PI);IK.chair(g,i*1.1,1.8,0)}
 for(let i=0;i<4;i++)bp(g,[SP(.18,7,5),CY(.2,.2,.12,10),CY(.1,.1,.3,7),SP(.15,7,5)][i],[0xd8a060,0xe8d8b0,0x8a2a2a,0xff6a3a][i],-.2+i*.7,1.02,3);
 const fp=fire103(g,-w2+.5,2.5,Math.PI/2);IK.rug(g,-w2+3.4,2.5,3,4,0x8a2a2a,0xa84a3a);IK.chair(g,-w2+3.2,1,Math.PI/2+.4,0x8a2a2a);IK.chair(g,-w2+3.2,4,Math.PI/2-.4,0x8a2a2a);
 IK.shelf(g,-2,d2-.35,Math.PI,3,1);IK.plant(g,3.6,d2-1);IK.barrel(g,w2-1,d2-1);IK.crate(g,w2-2.1,d2-.9);IK.window(g,-w2+.05,3,-1.5,Math.PI/2,1.3,1.4);IK.window(g,w2-.05,3,-1.5,-Math.PI/2,1.3,1.4);IK.lamp(g,4.5,d2-2.5,1.8);
 // mezanino (2º andar) no fundo, com escada e corrimão
 const MZ=6.6,MY=3.4,mzc=-d2+MZ/2;bp(g,BX(W-.4,.3,MZ),0x6a4a30,0,MY-.15,mzc,1);for(let x=-w2+1;x<w2-3;x+=2.4)bp(g,BX(.25,MY,.25),0x3a2416,x,MY/2,-d2+MZ);
 for(let x=-w2+.6;x<w2-3.4;x+=.5)bp(g,BX(.06,.9,.06),0x3a2416,x,MY+.45,-d2+MZ-.1);bp(g,BX(W-3.8,.1,.12),0x4a2e1c,-1.7,MY+.92,-d2+MZ-.1);
 platAdd84(R.ox,R.oz+mzc,w2-.2,MZ/2-.1,MY);
 const sx=w2-1.6,N=10;for(let i=0;i<N;i++){const zz=-d2+MZ+N*.55-(i+.5)*.55,yy=(i+1)*MY/N;bp(g,BX(2.4,.22,.56),0x7a5232,sx,yy-.11,zz,1);bp(g,BX(2.4,yy-.11,.56),0x5a3a22,sx,(yy-.11)/2,zz);platAdd84(R.ox+sx,R.oz+zz,1.2,.29,yy)}
 bp(g,BX(.1,1,N*.56),0x3a2416,sx-1.25,MY*.6,-d2+MZ+N*.28).rotation.x=Math.atan2(MY,N*.55);
 // quarto em cima: cama, baú, guarda-roupa, escrivaninha, estante
 IK.bed(g,-w2+2,-d2+1.7,0,[0x3e5f8a,0x8a2a2a,0x3a7a3a,0x6a3a8a][v%4],1);g.children[g.children.length-1].position.y=MY;
 const ch=G83();bp(ch,BX(1.2,.7,.7),0x6a4426,0,.35,0,1);bp(ch,BX(1.24,.14,.74),0xc8a040,0,.72,0);bp(ch,BX(.2,.24,.06),0xc8a040,0,.5,.36);ch.position.set(-w2+4,MY,-d2+.7);g.add(ch);
 const wr=G83();bp(wr,BX(1.6,2.6,.7),0x5a3a22,0,1.3,0,1);bp(wr,BX(.06,2.4,.02),0x2a1a10,0,1.3,.36);for(const s of[-1,1])bp(wr,SP(.05,5,4),0xc8a040,s*.15,1.3,.38);wr.position.set(0,MY,-d2+.5);g.add(wr);
 const dk=G83();bp(dk,BX(1.8,.1,.8),0x7a4a2a,0,.85,0,1);for(const [a,b] of[[-1,-1],[1,-1],[-1,1],[1,1]])bp(dk,BX(.08,.85,.08),0x4a2e1a,a*.8,.42,b*.32);bp(dk,BX(.5,.06,.36),0xf0e6cc,-.2,.92,0);bp(dk,CY(.05,.05,.25,6),0xfff0c0,.5,1.02,0,0,1);dk.position.set(3,MY,-d2+.6);g.add(dk);
 IK.shelf(g,6.4,-d2+.3,0,2.6,1);g.children[g.children.length-1].position.y=MY;IK.chand(g,0,H-.6,2,1.2);
 // interações (térreo y=0, mezanino y=MY)
 const o=(x,z)=>[R.ox+x,R.oz+z];
 ia103Add(R,{p:o(-w2+2,-d2+2.4),y:MY,r:1.9,t:'💤 Descansar na cama',f:rest103});
 ia103Add(R,{p:o(-w2+4,-d2+1.4),y:MY,r:1.5,t:'🎁 Abrir o baú',f:chest103(R,k)});
 ia103Add(R,{p:o(0,-d2+1.3),y:MY,r:1.5,t:'👕 Trocar de uniforme',f:wardrobe103});
 ia103Add(R,{p:o(6.4,-d2+1.1),y:MY,r:1.6,t:'📖 Ler um livro',f:()=>toast(LORE103[Math.floor(Math.random()*LORE103.length)])});
 ia103Add(R,{p:o(3,-d2+1.4),y:MY,r:1.4,t:'✍️ Escrever no diário',f:()=>{try{saveGame()}catch(e){}toast('✍️ Você escreveu no diário. (Jogo salvo)')}});
 ia103Add(R,{p:o(1,3),y:0,r:2.4,t:'🍞 Comer na mesa',f:eat103f});
 ia103Add(R,{p:o(-w2+2,2.5),y:0,r:2,t:'🔥 Acender/apagar a lareira',f:()=>{fp.fl.visible=!fp.fl.visible;fp.L.visible=fp.fl.visible;toast(fp.fl.visible?'🔥 Lareira acesa.':'Lareira apagada.')}});
 ia103Add(R,{p:o(-2,d2-1.2),y:0,r:1.6,t:'📖 Ler um livro',f:()=>toast(LORE103[Math.floor(Math.random()*LORE103.length)])});
 R.title=['Casa de Enxaimel','Casa do Comerciante','Casa da Família Real','Casa do Artesão'][v%4];return R}
INTB.tudor=tudorRoom;
// mais interação nas casas antigas (cama, mesa, lareira e estante)
for(const kind of['cottage','two','stone','merchant','rich']){const f=INTB[kind];if(!f)continue;INTB[kind]=k=>{const R=f(k);try{const W=R.w/2,D=R.d/2,o=(x,z)=>[R.ox+x,R.oz+z];ia103Add(R,{p:o(-W+1.2,-D+1.6),y:0,r:1.8,t:'💤 Descansar na cama',f:rest103});ia103Add(R,{p:o(0,.5),y:0,r:2,t:'🍞 Comer na mesa',f:eat103f});
 ia103Add(R,{p:o(-W+.9,1.5),y:0,r:1.6,t:'📖 Ler um livro',f:()=>toast(LORE103[Math.floor(Math.random()*LORE103.length)])});ia103Add(R,{p:o(W-1.4,D-2.2),y:0,r:1.4,t:'🎁 Procurar moedas',f:chest103(R,k)})}catch(e){}return R}}
// botão de interação
function ia103Tick(){let b=IA103.btn;if(!b){b=document.createElement('button');b.id='ia103';b.style.cssText='position:fixed;left:50%;transform:translateX(-50%);bottom:calc(env(safe-area-inset-bottom,0px) + 150px);z-index:41;padding:10px 18px;border-radius:12px;border:2px solid #f0cf72;background:linear-gradient(180deg,#2a1e0e,#1a1208);color:#ffe9a0;font:700 15px system-ui;display:none;box-shadow:0 4px 14px rgba(0,0,0,.5)';
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();const c=IA103.cur;if(c)try{c.f()}catch(er){}});document.body.appendChild(b);IA103.btn=b}
 let best=null;if(INT86.on&&INT86.cur&&INT86.cur.ia){let bd=1e9;for(const it of INT86.cur.ia){if(Math.abs((P.y||0)-it.y)>1.2)continue;const d=Math.hypot(P.x-it.p[0],P.z-it.p[1]);if(d<it.r&&d<bd){bd=d;best=it}}}
 IA103.cur=best;if(best){if(b.textContent!==best.t)b.textContent=best.t;b.style.display='block'}else b.style.display='none'}
// tecla E também interage
addEventListener('keydown',e=>{if((e.key=='e'||e.key=='E')&&IA103.cur&&!e.repeat){try{IA103.cur.f()}catch(er){}}});
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{ia103Tick()}catch(e){}try{if(V103.sun){V103.sun.ar.rotation.y+=dt*.3;V103.sun.ar2.rotation.z+=dt*.2}}catch(e){}return r}}

