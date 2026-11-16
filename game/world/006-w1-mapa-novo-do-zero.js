// ===================== V83 · MAPA NOVO DO ZERO (Fase 3) =====================
// Mundo novo inspirado em Black Clover (arquitetura própria do Clover RPG). Tudo é colocado com put() nos blocos de 40 m,
// depois os blocos são agrupados (mergeChunks) e só aparecem perto do jogador — leve para celulares fracos.
// Eixos: x = leste(+)/oeste(-), z = sul(+)/norte(-). Vila Hage fica na origem (ponto de renascer).
// V84: caixas, barris, sacos, lenha, bancos e cercas ficam marcados; os que caírem numa estrada saem antes de juntar os blocos
{const tag=f=>function(par){const n=par.children.length;const r=f.apply(this,arguments);for(let i=n;i<par.children.length;i++)par.children[i].userData.prop=1;return r};
 crate=tag(crate);barrel=tag(barrel);sack=tag(sack);woodpile=tag(woodpile);bench=tag(bench);fenceRow=tag(fenceRow)}
seed=83083;
const WB83={x0:-590,x1:590,z0:-660,z1:440};
// ---------- água (mar do leste, lagos) e terra firme dentro dela (ilha de Hino, ponte, píer, bolha do templo)
const WATER83=[{t:'r',x0:372,x1:600,z0:-345,z1:160},{t:'c',x:-262,z:-318,r:20},{t:'c',x:258,z:-318,r:16},{t:'c',x:318,z:300,r:22},{t:'c',x:-452,z:-112,r:15}];
const LAND83=[{t:'c',x:492,z:8,r:62},{t:'r',x0:360,x1:436,z0:2,z1:16},{t:'r',x0:360,x1:426,z0:-205,z1:-195},{t:'c',x:440,z:-200,r:21}];
const inR=(o,x,z)=>o.t=='r'?(x>=o.x0&&x<=o.x1&&z>=o.z0&&z<=o.z1):Math.hypot(x-o.x,z-o.z)<=o.r;
function inWater83(x,z){if(!WATER83.some(o=>inR(o,x,z)))return false;return !LAND83.some(o=>inR(o,x,z))}
// ---------- regiões (nome mostrado no HUD, cor do chão e nível sugerido)
const REG83=[
 {id:'hage',n:'Vila Hage',s:'Reino Esquecido',x:0,z:0,r:40,c:0x7d9450},
 {id:'torre',n:'Torre dos Grimórios',s:'Reino Esquecido',x:-64,z:-52,r:22,c:0x748c4c},
 {id:'treino',n:'Campo de Treino',s:'Reino Esquecido',x:-52,z:38,r:18,c:0x9a8a62},
 {id:'cranio',n:'Colina do Crânio',s:'Reino Esquecido',x:62,z:-8,r:24,c:0x868a58},
 {id:'camp',n:'Acampamento dos Cavaleiros',s:'Reino Comum',x:34,z:-118,r:16,c:0x6f8c48},
 {id:'touros',n:'Esconderijo dos Touros Negros',s:'Reino Comum',x:128,z:-150,r:26,c:0x6a8446},
 {id:'sossy',n:'Vila Sossy',s:'Reino Comum',x:190,z:-60,r:30,c:0xa89a5a},
 {id:'kiten',n:'Cidade de Kiten',s:'Fronteira de Diamond',x:-210,z:120,r:34,c:0x8a8a72},
 {id:'masmorra',n:'Masmorra Antiga',s:'Fronteira de Diamond',x:-128,z:190,r:22,c:0x7a7464},
 {id:'nairn',n:'Vila Nairn',s:'Orla da Floresta',x:-230,z:-150,r:28,c:0x56763e},
 {id:'bruxas',n:'Floresta das Bruxas',s:'Terras das Bruxas',x:-430,z:-150,r:120,c:0x3e4840},
 {id:'nobres',n:'Reino dos Nobres',s:'Quartéis dos Cavaleiros Mágicos',x:0,z:-262,r:150,c:0x6f9450},
 {id:'capital',n:'Capital Real',s:'Reino Real de Clover',x:0,z:-402,r:66,c:0xa8a294},
 {id:'yultim',n:'Vulcão Yultim',s:'Montes de Fogo',x:300,z:-410,r:70,c:0x4a3e38},
 {id:'templo',n:'Templo Submarino',s:'Mar do Leste',x:440,z:-200,r:26,c:0x2a5a7a},
 {id:'hino',n:'Hino',s:'Terra do Sol Nascente',x:492,z:8,r:64,c:0x7a9a58},
 {id:'heart',n:'Reino Heart',s:'Além da fronteira sudeste',x:320,z:300,r:110,c:0x82a860},
 {id:'diamond',n:'Reino Diamond',s:'Além da fronteira sudoeste',x:-440,z:270,r:120,c:0x8a929a},
 {id:'spade',n:'Reino Spade',s:'Além das montanhas do norte',x:0,z:-585,r:140,c:0x4e4c52},
 {id:'sombras',n:'Palácio das Sombras',s:'Reino Spade',x:150,z:-590,r:40,c:0x36303e}];
function reg83(x,z){let best=null,bd=1e9;for(const r of REG83){const d=Math.hypot(x-r.x,z-r.z)/r.r;if(d<1&&d<bd){bd=d;best=r}}return best}
// ---------- chão: um plano grande pintado por região (vértices), sem texturas
{const W=WB83.x1-WB83.x0+40,H=WB83.z1-WB83.z0+40,cx=(WB83.x0+WB83.x1)/2,cz=(WB83.z0+WB83.z1)/2;
 try{ground.geometry.dispose()}catch(e){}ground.geometry=new T.PlaneGeometry(W,H,118,110);ground.position.set(cx,0,cz);
 const g=ground.geometry,p=g.attributes.position,c=[],A=new T.Color(),Bc=new T.Color(),nz=(x,z)=>Math.sin(x*.045+Math.sin(z*.03)*2)*.5+Math.sin(z*.05+x*.02)*.5+Math.sin((x+z)*.11)*.25;
 for(let i=0;i<p.count;i++){const x=p.getX(i)+cx,z=-p.getY(i)+cz,n=nz(x,z);A.setHex(0x6a8f4a);for(const r of REG83){const d=Math.hypot(x-r.x,z-r.z)/(r.r*1.25);if(d<1){Bc.setHex(r.c);A.lerp(Bc,Math.min(1,(1-d)*1.6)*.7)}}
  if(inWater83(x,z))A.setHex(0x1f5f8f);A.offsetHSL(.01*n,.035*n,.04*n);c.push(A.r,A.g,A.b)}
 g.setAttribute('color',new T.Float32BufferAttribute(c,3));ground.material.vertexColors=true;ground.material.needsUpdate=true}
// mar (superfície que brilha um pouco) — uma malha só
{const sea=new T.Mesh(new T.PlaneGeometry(230,505,1,1),new T.MeshToonMaterial({color:0x2f86c8,gradientMap:gmap,transparent:true,opacity:.86}));sea.rotation.x=-Math.PI/2;sea.position.set(486,.12,-92);S.add(sea);sea.userData.sea83=1;
 const isl=new T.Mesh(new T.CircleGeometry(62,40),WM(0x9ac070));isl.rotation.x=-Math.PI/2;isl.position.set(492,.16,8);isl.receiveShadow=true;S.add(isl)}
// ---------- utilitários de construção
const R83=(a,b)=>a+rnd()*(b-a);
function sol(x,z,r){SOL.push({x,z,r})}
function solB(x,z,hx,hz){SOL.push({x,z,hx,hz})}
function G83(){return new T.Group()}
// muralha reta de A até B (blocos + ameias), com colisão
function wall83(par,x1,z1,x2,z2,h,c,cap,th){th=th||1.6;const L=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(L/6));for(let i=0;i<n;i++){const t=(i+.5)/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t,g=G83();bp(g,BX(L/n+.05,h,th),c,0,h/2,0,1);for(let k=-1;k<=1;k+=2)bp(g,BX(L/n*.28,1,th+.1),cap||c,k*L/n*.25,h+.5,0,1);g.rotation.y=Math.atan2(x2-x1,z2-z1)+Math.PI/2;if(par)par.add(g),g.position.set(x,0,z);else put(g,x,z);sol(x,z,Math.max(th,L/n*.55))}}
function tower83(x,z,r,h,c,rc,o){o=o||{};const g=G83();bp(g,CY(r,r*1.08,h,10),c,0,h/2,0,1);bp(g,CY(r*1.18,r*1.18,.8,10),o.band||c,0,h-.4,0,1);for(let k=0;k<8;k++){const a=k/8*6.283;bp(g,BX(.9,1,.9),o.band||c,Math.cos(a)*r*1.1,h+.5,Math.sin(a)*r*1.1,1)}if(rc!==null)bp(g,CN(r*1.3,r*1.9,10),rc||0x3b4aa0,0,h+1+r*.95,0,1);for(let k=0;k<3;k++){const a=k*2.1;bp(g,BX(.5,1.1,.2),0x2a2a3a,Math.cos(a)*r*1.01,h*.55+k*1.6,Math.sin(a)*r*1.01).rotation.y=-a+Math.PI/2}put(g,x,z);sol(x,z,r+.4);return g}
function banner83(par,x,y,z,c,c2,ry){const g=G83();bp(g,CY(.08,.08,4.5,6),0x3a2a1a,0,y+2.2,0);const f=bp(g,BX(1.4,2.4,.06),c,.72,y+3.1,0,1);if(c2)bp(g,BX(.5,.5,.07),c2,.72,y+3.3,0);g.rotation.y=ry||0;g.position.set(x,0,z);par.add(g);return g}
function statue83(par,x,z,kind,c){const g=G83(),sc=c||0xc8c2b4;bp(g,BX(2.6,1.2,2.6),0xa8a296,0,.6,0,1);bp(g,BX(2,1.4,2),sc,0,1.9,0,1);
 if(kind=='knight'){bp(g,CY(.42,.5,2.2,8),sc,0,3.7,0,1);bp(g,SP(.36,8,6),sc,0,5.1,0,1);bp(g,BX(.18,2.8,.18),0xd8d8e0,.7,4.4,.2,1);bp(g,BX(1.2,1.6,.2),sc,-.6,3.8,.3,1)}
 else if(kind=='lion'){bp(g,BX(1.4,1,2.6),sc,0,3.1,0,1);bp(g,SP(.85,8,6),sc,0,4.1,1,1);for(let k=0;k<4;k++)bp(g,BX(.35,1,.35),sc,(k%2-.5)*1,2.4,(k<2?-.9:.9),1);bp(g,CN(.25,1.4,5),sc,0,3.5,-1.6,1).rotation.x=-1}
 else if(kind=='book'){const b=bp(g,BX(1.8,.3,1.3),sc,0,3,0,1);b.rotation.x=-.5;bp(g,BX(.12,1.8,.12),sc,0,3.8,0,1)}
 else{bp(g,CN(.9,3.2,4),sc,0,4.2,0,1)}
 g.position.set(x,0,z);par.add(g);return g}
function fountain83(x,z,s){s=s||1;const g=G83();bp(g,CY(4*s,4.4*s,1,16),0xb8b4a8,0,.5,0,1);bp(g,CY(3.5*s,3.5*s,.3,16),0x4aa8e8,0,1.05,0);bp(g,CY(.5*s,.8*s,3*s,8),0xcfc8e0,0,1.5*s,0,1);bp(g,CY(2*s,2.3*s,.45,14),0xc8c2b4,0,2.4*s,0,1);bp(g,CY(1.7*s,1.7*s,.1,14),0x4aa8e8,0,2.64*s,0);bp(g,SP(.5*s,8,6),0xe0e8f0,0,3.3*s,0,1);put(g,x,z);sol(x,z,4.3*s)}
function stall83(par,x,z,ry,c){const g=G83();bp(g,BX(2.6,.9,1.4),0x8a5a32,0,.45,0,1);for(const sx of[-1.2,1.2])for(const sz of[-.6,.6])bp(g,CY(.07,.07,2.4,5),0x5a3a22,sx,1.2,sz);const rf=bp(g,BX(3,.12,2),c,0,2.45,0,1);rf.rotation.x=.18;for(let k=0;k<4;k++)bp(g,SP(.16,5,4),[0xd04a3a,0xe0b020,0x6abf40,0xf08a2a][k],-.9+k*.6,1.02,.2);g.rotation.y=ry||0;g.position.set(x,0,z);par.add(g);return g}
function tree83(x,z,kind,s){const g=G83();s=s||1;if(kind=='pine')tPine(g,0,0,s);else if(kind=='birch')tBirch(g,0,0,s);else if(kind=='cherry'){bp(g,CY(.22*s,.32*s,2.4*s,6),0x5a3d22,0,1.2*s,0,1);bp(g,IC(1.6*s,0),0xf4a6c8,0,3.2*s,0,1,0,1.2,.8,1.2);bp(g,IC(1*s,0),0xffc8de,.9*s,3.6*s,.3*s)}else if(kind=='witch'){bp(g,CY(.25*s,.45*s,3.2*s,5),0x2a2026,0,1.6*s,0,1);for(let k=0;k<4;k++){const b=bp(g,CY(.06*s,.14*s,1.8*s,4),0x2a2026,0,2.8*s,0);b.rotation.set(.9,k*1.6,0);b.position.set(Math.sin(k*1.6)*.6*s,3*s,Math.cos(k*1.6)*.6*s)}bp(g,IC(1.3*s,0),rnd()<.5?0x5a2a6a:0x3a4a5a,0,3.9*s,0,1)}else if(kind=='dead'){bp(g,CY(.18*s,.3*s,3*s,5),0x4a3a2e,0,1.5*s,0,1);for(let k=0;k<3;k++){const b=bp(g,CY(.05*s,.1*s,1.4*s,4),0x4a3a2e,0,2.4*s,0);b.rotation.set(.8,k*2.1,0);b.position.set(Math.sin(k*2.1)*.45*s,2.6*s,Math.cos(k*2.1)*.45*s)}}else tOak(g,0,0,s);g.rotation.y=rnd()*6.28;g.userData.tree=[x,z];put(g,x,z);sol(x,z,.5*s)}
function rocks83(x,z,s,c){const g=G83();s=s||1;bp(g,DO(1.2*s),c||0x8a8a96,0,.6*s,0,1,0,1,.7,1.1);bp(g,DO(.7*s),c?c+0x080808:0x9a9aa4,1.1*s,.4*s,.6*s,1);put(g,x,z);sol(x,z,1.1*s)}
// V84: montanha natural (rocha irregular com várias cristas, nada de pirâmide), forma vem de ruído fixo pela posição
const MTN84=[];function mtnGeo84(k){if(MTN84[k])return MTN84[k];const h3=(x,y,z)=>{const n=Math.sin(x*127.1+y*311.7+z*74.7+k*19.3)*43758.5453;return n-Math.floor(n)};
 const vn=(x,y,z)=>{const xi=Math.floor(x),yi=Math.floor(y),zi=Math.floor(z),xf=x-xi,yf=y-yi,zf=z-zi,u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf),w=zf*zf*(3-2*zf);let r=0;for(let a=0;a<2;a++)for(let b=0;b<2;b++)for(let c=0;c<2;c++)r+=h3(xi+a,yi+b,zi+c)*(a?u:1-u)*(b?v:1-v)*(c?w:1-w);return r};
 const g=new T.IcosahedronGeometry(1,1),P=g.attributes.position;for(let i=0;i<P.count;i++){let x=P.getX(i),y=P.getY(i),z=P.getZ(i);
  const n=vn(x*1.7+4,y*1.7+4,z*1.7+4)*.55+vn(x*4.1+9,y*4.1+9,z*4.1+9)*.22-.38;let f=1+n;x*=f;z*=f;y=Math.max(0,y);y=y*(1+n*.9);
  const rr=Math.hypot(x,z);y=Math.max(0,y-Math.max(0,rr-.92)*.6);if(P.getY(i)<=0)y=0;P.setXYZ(i,x,y,z)}
 g.computeVertexNormals();return MTN84[k]=g}
function mount83(x,z,r,h,c,snow){const g=G83();const ry=rnd()*3,k=(Math.abs(Math.round(x*7+z*13))%4),c0=c||0x7a7480;
 const m=bp(g,mtnGeo84(k),c0,0,0,0,1,0,r,h,r);m.rotation.y=ry;
 const m2=bp(g,mtnGeo84((k+1)%4),c0-0x0c0c0c,r*.5,0,r*.22,1,0,r*.62,h*.62,r*.62);m2.rotation.y=ry+1.3;
 const m3=bp(g,mtnGeo84((k+2)%4),c0+0x060606,-r*.45,0,-r*.18,1,0,r*.5,h*.48,r*.5);m3.rotation.y=ry+2.6;
 if(snow!==false){const s=bp(g,mtnGeo84((k+3)%4),0xf4f6fa,0,h*.66,0,0,0,r*.34,h*.36,r*.34);s.rotation.y=ry}
 put(g,x,z);sol(x,z,r*.82)}
// estrada larga de pedra batida entre dois pontos
const ROAD83=[];function road83(x1,z1,x2,z2,w,c){roadSeg(x1,z1,x2,z2,w||7);ROAD83.push([x1,z1,x2,z2]);ROADS.push([x1,z1,x2,z2])}
// ---------- bordas do mundo: cordilheiras com passagens para os reinos vizinhos
{for(let x=WB83.x0;x<=WB83.x1;x+=34){mount83(x+R83(-6,6),WB83.z0-8+R83(-4,4),R83(26,36),R83(40,62));if(x<360)mount83(x+R83(-6,6),WB83.z1+10+R83(-4,4),R83(24,34),R83(34,50))}
 for(let z=WB83.z0;z<=WB83.z1;z+=34){mount83(WB83.x0-8+R83(-4,4),z+R83(-6,6),R83(24,34),R83(36,56))}
 // cordilheira norte entre Clover e Spade (passagem em x≈0)
 for(let x=-420;x<=420;x+=30){if(Math.abs(x)<30)continue;mount83(x+R83(-5,5),-505+R83(-8,8),R83(20,30),R83(30,48))}
 // morros entre Clover e Diamond (sudoeste) e Heart (sudeste), com passagens
 for(let k=0;k<9;k++){const a=k/8;if(k==4)continue;mount83(-320+a*40,170+a*120,R83(16,24),R83(22,34),0x8a8478,false)}
 for(let k=0;k<9;k++){const a=k/8;if(k==4)continue;mount83(220+a*30-(k>=6?55:0),180+a*110-(k>=6?30:0),R83(16,24),R83(22,34),0x7a8a70,false)}
 // costa leste: rochedos na beira do mar
 for(let z=-330;z<150;z+=18){if(Math.abs(z-9)<14||Math.abs(z+200)<12)continue;rocks83(368+R83(-3,3),z,R83(1.2,2),0x8a8478)}}

