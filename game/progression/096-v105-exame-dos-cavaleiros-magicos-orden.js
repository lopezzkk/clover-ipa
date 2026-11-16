// ================= V105 · Exame dos Cavaleiros Mágicos · ordens com renascer no quartel · regiões novas no mapa · espada saindo do grimório =================
// Desenho próprio do Clover RPG (inspirado no estilo de Black Clover). Nada aqui apaga o que já existia.
const V105={};
// ---------- juntar várias peças num desenho só (mais leve para o celular)
function MG105(){const pos=[],nor=[],col=[],m4=new T.Matrix4(),q=new T.Quaternion(),e=new T.Euler(),v=new T.Vector3(),s=new T.Vector3(),c=new T.Color(),nm=new T.Matrix3();
 return{add(geo,color,x,y,z,rx,ry,rz,sx,sy,sz){const g=geo.index?geo.toNonIndexed():geo;m4.compose(v.set(x,y,z),q.setFromEuler(e.set(rx||0,ry||0,rz||0)),s.set(sx||1,sy==null?(sx||1):sy,sz==null?(sx||1):sz));nm.getNormalMatrix(m4);
   const A=g.attributes.position,N=g.attributes.normal;c.setHex(color);for(let i=0;i<A.count;i++){v.fromBufferAttribute(A,i).applyMatrix4(m4);pos.push(v.x,v.y,v.z);v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();nor.push(v.x,v.y,v.z);col.push(c.r,c.g,c.b)}if(g!==geo)g.dispose();geo.dispose&&geo._mg105&&geo.dispose()},
  mesh(basic){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.computeBoundingSphere();
   const m=new T.Mesh(g,basic?new T.MeshBasicMaterial({vertexColors:true}):new T.MeshToonMaterial({vertexColors:true,gradientMap:gmap}));m.castShadow=!basic;m.receiveShadow=!basic;return m},n:()=>pos.length/3}}
const B105=(w,h,d)=>{const g=new T.BoxGeometry(w,h,d);g._mg105=1;return g},C105=(a,b,h,s)=>{const g=new T.CylinderGeometry(a,b,h,s||8);g._mg105=1;return g},K105=(r,h,s)=>{const g=new T.ConeGeometry(r,h,s||8);g._mg105=1;return g},
 S105=(r,a,b)=>{const g=new T.SphereGeometry(r,a||8,b||6);g._mg105=1;return g},D105=(r,d)=>{const g=new T.DodecahedronGeometry(r,d||0);g._mg105=1;return g},I105=(r,d)=>{const g=new T.IcosahedronGeometry(r,d||0);g._mg105=1;return g},
 TO105=(r,t,a,b,arc)=>{const g=new T.TorusGeometry(r,t,a||6,b||12,arc||Math.PI*2);g._mg105=1;return g},O105=(r)=>{const g=new T.OctahedronGeometry(r,0);g._mg105=1;return g};
// ---------- letreiro grande de região / título (texto dourado com eco, como abertura de filme)
(function(){const st=document.createElement('style');st.textContent=
 '#rg105{position:fixed;left:0;right:0;top:22%;z-index:46;pointer-events:none;text-align:center;opacity:0;transition:opacity .7s}#rg105.on{opacity:1}'+
 '#rg105 .rgb{height:auto;width:auto;line-height:1.15;background:none;border-radius:0;margin:0;overflow:visible;position:relative;display:inline-block;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:clamp(28px,6.4vw,64px);letter-spacing:.08em;color:#fff6dc;text-shadow:0 3px 0 #2a1a06,0 0 22px rgba(0,0,0,.75)}'+
 '#rg105 .rgg{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%) scale(1.5);white-space:nowrap;opacity:.18;filter:blur(2px);transition:transform 3.2s ease-out}#rg105.on .rgg{transform:translate(-50%,-50%) scale(1.15)}'+
 '#rg105 .rgk{font-family:Cinzel,Georgia,serif;font-weight:700;font-size:clamp(11px,2vw,16px);letter-spacing:.42em;color:#f0cf72;text-shadow:0 2px 6px #000;margin-bottom:4px}'+
 '#rg105 .rgs{font-family:Georgia,serif;font-style:italic;font-size:clamp(12px,2.2vw,18px);color:#f3e6c4;text-shadow:0 2px 6px #000;margin-top:4px}'+
 '#rg105 .rgl{width:min(46vw,420px);height:2px;margin:6px auto;background:linear-gradient(90deg,transparent,#f0cf72,transparent)}';document.head.appendChild(st);
 const d=document.createElement('div');d.id='rg105';document.body.appendChild(d);V105.rg=d})();
function title105(big,sub,kicker,ms){const d=V105.rg;if(!d)return;const e=s=>String(s||'').replace(/[<>&]/g,'');d.innerHTML=(kicker?'<div class="rgk">'+e(kicker)+'</div>':'')+'<div class="rgb"><span class="rgg">'+e(big)+'</span>'+e(big)+'</div><div class="rgl"></div>'+(sub?'<div class="rgs">'+e(sub)+'</div>':'');
 d.classList.remove('on');void d.offsetWidth;d.classList.add('on');clearTimeout(V105.rgT);V105.rgT=setTimeout(()=>d.classList.remove('on'),ms||2800)}
// ---------- interações no mapa aberto (usa o mesmo botão das casas: aparece embaixo, ou tecla E)
const IA105=[];
{const _t=ia103Tick;ia103Tick=function(){_t.apply(this,arguments);try{if(IA103.cur||INT86.on||!IA103.btn)return;let best=null,bd=1e9;for(const it of IA105){if(it.on&&!it.on())continue;const d=Math.hypot(P.x-it.x,P.z-it.z);if(d<it.r&&d<bd){bd=d;best=it}}
 if(best){const t=typeof best.t=='function'?best.t():best.t;IA103.cur={f:best.f,t};if(IA103.btn.textContent!==t)IA103.btn.textContent=t;IA103.btn.style.display='block'}}catch(e){}}}

// ===================================================================== MAPA: lugares novos =====================================================================
const PL105={col:{x:110,z:150},fos:{x:-330,z:30},min:{x:-486,z:112}};
// ---------- COLISEU DO EXAME (arena de pedra branca com arcos, arquibancada e camarote dos capitães)
{const {x:CX,z:CZ}=PL105.col,g=G83(),M=MG105(),RI=22.6,ENT=Math.PI/2;
 const inGap=a=>{let d=Math.abs(((a-ENT)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);return d<.2};
 // chão de pedra azul-acinzentada
 try{const t=cob103([150,156,178],'#4a4e62');if(t){t.repeat.set(9,9);const fl=new T.Mesh(new T.CircleGeometry(RI,48),new T.MeshLambertMaterial({map:t}));fl.rotation.x=-Math.PI/2;fl.position.y=.03;fl.receiveShadow=true;g.add(fl)}}catch(e){}
 M.add(C105(RI+.2,RI+.2,.06,48),0x8a8ea0,0,.015,0);
 // círculo mágico no centro
 {const r=new T.Mesh(new T.RingGeometry(5.6,6,48),new T.MeshBasicMaterial({color:0xf0cf72,transparent:true,opacity:.55}));r.rotation.x=-Math.PI/2;r.position.y=.05;g.add(r);const r2=new T.Mesh(new T.RingGeometry(3.2,3.35,6),new T.MeshBasicMaterial({color:0xf0cf72,transparent:true,opacity:.45}));r2.rotation.x=-Math.PI/2;r2.position.y=.051;g.add(r2);V105.cring=r2}
 const N=36;for(let i=0;i<N;i++){const a=i/N*Math.PI*2+Math.PI/N;if(inGap(a))continue;const ca=Math.cos(a),sa=Math.sin(a),ry=-a+Math.PI/2;
  // mureta da arena
  M.add(B105(4.1,1.5,.8),0xd8dae4,ca*RI,.75,sa*RI,0,ry);M.add(B105(4.2,.18,1),0xb8bccc,ca*RI,1.55,sa*RI,0,ry);
  // arquibancada em degraus
  for(let k=0;k<3;k++){const r=24+k*1.7,h=2.3+k*1.25;M.add(B105(4.6+k*.45,h,1.7),k%2?0xc4c8d6:0xb2b6c6,ca*r,h/2,sa*r,0,ry)}
  // muro de fora com arcos (dois andares)
  const RO=29.6;M.add(B105(1.2,13,1.6),0xeceef4,ca*RO,6.5,sa*RO,0,ry);
  const a2=a+Math.PI/N,c2=Math.cos(a2),s2=Math.sin(a2);if(!inGap(a2)){M.add(B105(4.1,1.1,1.5),0xe2e4ec,c2*RO,7.6,s2*RO,0,-a2+Math.PI/2);M.add(TO105(1.55,.32,5,10,Math.PI),0xe2e4ec,c2*RO,4.2,s2*RO,0,-a2+Math.PI/2);
   M.add(B105(4.1,.9,1.5),0xe2e4ec,c2*RO,12.6,s2*RO,0,-a2+Math.PI/2);M.add(TO105(1.3,.26,5,10,Math.PI),0xe2e4ec,c2*RO,10.4,s2*RO,0,-a2+Math.PI/2);M.add(B105(4.1,2.4,.5),0xd2d4de,c2*(RO-.6),8.9,s2*(RO-.6),0,-a2+Math.PI/2)}
  // colisão da mureta
  sol(CX+ca*RI,CZ+sa*RI,1.25)}
 // portão de entrada (sul)
 for(const s of[-1,1]){M.add(B105(1.6,9,1.6),0xeceef4,s*3.4,4.5,RI+5);M.add(K105(1.3,2.4,4),0x2f3e8a,s*3.4,10.2,RI+5,0,Math.PI/4)}M.add(TO105(3.4,.5,6,14,Math.PI),0xe2e4ec,0,6.6,RI+5);M.add(B105(8.4,1,1.6),0xe2e4ec,0,9.6,RI+5);
 // camarote dos capitães (norte): plataforma, poltronas vermelhas e estandartes das ordens
 const BZ=-RI+2.6;M.add(B105(22,1.6,4.6),0xc8ccd8,0,.8,BZ-1);M.add(B105(22.4,.2,5),0xa8acbc,0,1.7,BZ-1);for(let k=0;k<3;k++)M.add(B105(3,.4,1),0xb8bccc,0,.2+k*.45,BZ+1.8-k*.6);
 M.add(B105(24,7,1),0xe2e4ec,0,4.6,BZ-3.6);M.add(B105(25,.6,6.4),0xd8dae4,0,8.1,BZ-1);
 V105.chairs=[];for(let k=0;k<9;k++){const x=-9.6+k*2.4;M.add(B105(1.3,.5,1.1),0x9a1f24,x,2.1,BZ-1.6);M.add(B105(1.3,1.6,.3),0xb3262c,x,2.9,BZ-2.1);M.add(B105(.22,.8,1),0xd8b040,x-.66,2.3,BZ-1.6);M.add(B105(.22,.8,1),0xd8b040,x+.66,2.3,BZ-1.6);V105.chairs.push(x)}
 solB(CX,CZ+BZ-1,11.5,2.6);
 // tochas na mureta
 for(let i=0;i<8;i++){const a=i/8*Math.PI*2+.2;if(inGap(a))continue;M.add(C105(.12,.16,1.6,6),0x4a3424,Math.cos(a)*(RI-.2),2.3,Math.sin(a)*(RI-.2));bp(g,SP(.28,6,5),0xffb43a,Math.cos(a)*(RI-.2),3.2,Math.sin(a)*(RI-.2),0,1)}
 const mm=M.mesh();g.add(mm);put(g,CX,CZ);V105.col=g;
 // estandartes das 9 ordens atrás do camarote
 V105.SQ9=[['touro','Touros Negros',0x1c1c1c,0xd8d8d8],['dourado','Alvorecer Dourado',0xe0b020,0xf6efdc],['aguia','Águia Prateada',0xc8ccd8,0x3a4a6a],['leao','Leão Carmesim',0xc0302a,0xf0d080],['rosa','Rosa Azul',0x3b6ad0,0xe8e8f4],['louva','Louva-a-Deus Verde',0x3a8a4a,0xe8e0c0],['pavao','Pavão de Coral',0xe07a6a,0x2a6a7a],['orca','Orca Púrpura',0x7a3aa0,0xe8d8ff],['cervo','Cervo Azul',0x3ab0c0,0xf0f0e8]];
 {const bg=G83();V105.SQ9.forEach((q,k)=>{const x=-9.6+k*2.4;bp(bg,BX(1.5,2.8,.06),q[2],x,6.2,BZ-3.05);bp(bg,SP(.4,8,6),q[3],x,6.5,BZ-3.0);bp(bg,CN(.75,.6,3),q[2],x,4.55,BZ-3.05).rotation.z=Math.PI});put(bg,CX,CZ)}
 try{signBoard('Coliseu do Exame',CX+7,CZ+RI+9,.15)}catch(e){}}
// ---------- VALE DOS FÓSSEIS (esqueleto gigante de uma fera antiga, costelas por cima do caminho)
{const {x:FX,z:FZ}=PL105.fos,g=G83(),M=MG105(),BN=0xeee2cf,BN2=0xd8cab2,BN3=0xf6efe2;
 // terra rachada
 {const d=new T.Mesh(new T.CircleGeometry(36,28),new T.MeshLambertMaterial({color:0xc8b48a}));d.rotation.x=-Math.PI/2;d.position.y=.02;d.receiveShadow=true;g.add(d);for(let k=0;k<10;k++){const a=k*2.4,r=8+(k*7)%24;M.add(C105(2+(k%3),2.4+(k%3),.05,7),0xb09c74,Math.cos(a)*r,.04,Math.sin(a)*r)}}
 // espinha em arco (de -26 a +26 no eixo x) com costelas
 const sp=t=>[t*26,3.6+Math.sin((t+1)*Math.PI/2)*4.2];for(let i=0;i<=26;i++){const t=-1+i/13,[x,y]=sp(t),sc=1-Math.abs(t)*.45;M.add(B105(1.5*sc,1.2*sc,1.6*sc),i%2?BN:BN2,x,y,0,0,0,(t)*.3);M.add(K105(.35*sc,1.6*sc,4),BN3,x,y+1.2*sc,0)}
 for(let i=2;i<=24;i+=2){const t=-1+i/13,[x,y]=sp(t),sc=1-Math.abs(t)*.4,R=y-.2;M.add(TO105(R,.34*sc+.12,5,16,Math.PI),i%4?BN:BN2,x,0,0,0,Math.PI/2,0);for(const s of[-1,1]){M.add(K105(.5*sc,1.2,5),BN3,x,.5,s*R);if(Math.abs(t)<.9)sol(FX+x,FZ+s*R,.9)}}
 // crânio com chifres (lado leste): caixa craniana redonda, focinho comprido, buracos dos olhos e dentes
 {const hx=29,hy=3.4;M.add(S105(3.4,10,8),BN,hx,hy+.6,0,0,0,0,1.15,.9,1);M.add(B105(5.6,2.2,3.6),BN2,hx+4.6,hy-.6,0,0,0,-.08);M.add(B105(4.6,1.1,3.2),BN,hx+5,hy-2.4,0,0,0,.12);
  M.add(B105(1.8,1.4,4.2),BN3,hx+1.2,hy+2.6,0);for(const s of[-1,1]){M.add(S105(.95,8,6),0x1e1812,hx+2.2,hy+1.1,s*2.05,0,0,0,1,.8,.6);M.add(S105(.4,6,5),0x1e1812,hx+7.1,hy-.2,s*.9);
   M.add(K105(.75,5.2,6),BN3,hx-1.4,hy+3.9,s*2.3,s*.85,0,.9);M.add(K105(.45,2.4,6),BN3,hx-3.6,hy+5.6,s*3.3,s*1.4,0,1.6);for(let k=0;k<5;k++)M.add(K105(.22,1,4),BN3,hx+3+k*1,hy-1.9,s*1.55,Math.PI);M.add(B105(5.8,.5,.5),BN2,hx+3.6,hy-1.6,s*1.7)}
  solB(FX+hx+2,FZ,5.2,3)}
 // cauda
 for(let i=1;i<9;i++){const sc=1-i*.1;M.add(B105(1.4*sc,1*sc,1.4*sc),i%2?BN:BN2,-26-i*1.8,1.4*sc+.2,Math.sin(i*.6)*2.2)}
 // ossos soltos e presas pelo chão
 for(let k=0;k<16;k++){const a=k*1.7,r=10+(k*5)%22,x=Math.cos(a)*r,z=Math.sin(a)*r;if(Math.abs(z)<7&&Math.abs(x)<30)continue;if(k%3==0){M.add(K105(.5,3.6,5),BN3,x,1.6,z,(k%2?.3:-.3),0,.2)}else{M.add(C105(.28,.28,3,6),BN,x,.3,z,Math.PI/2,a,0);for(const s of[-1,1])M.add(S105(.45,6,5),BN2,x+Math.cos(a)*s*1.5*0,.3,z+s*1.5,0,0,0)}}
 g.add(M.mesh());put(g,FX,FZ);try{signBoard('Vale dos Fósseis',FX+8,FZ+30,.4)}catch(e){}}
// ---------- MINAS DE MANA (paredões de pedra, túneis com vigas, trilhos, carrinhos, lava e cristais que brilham)
V105.ores=[];
{const {x:MX,z:MZ}=PL105.min,g=G83(),M=MG105(),Mb=MG105(),RK=[0x6a6058,0x5a524a,0x7a6e62,0x4e4842],R0=30;
 {const d=new T.Mesh(new T.CircleGeometry(R0+2,30),new T.MeshLambertMaterial({color:0x5a4e44}));d.rotation.x=-Math.PI/2;d.position.y=.02;d.receiveShadow=true;g.add(d)}
 // paredão em ferradura (abertura para o leste, de onde vem a estrada)
 for(let i=0;i<34;i++){const a=i/34*Math.PI*2;if(Math.cos(a)>.72)continue;const r=R0+(i%3)*1.4,h=8+((i*7)%5)*2.2,x=Math.cos(a)*r,z=Math.sin(a)*r;M.add(D105(5.2+(i%3),0),RK[i%4],x,h*.42,z,i,i*.7,0,1,h/9,1);M.add(D105(3.4,0),RK[(i+1)%4],x*.92,h*.85,z*.92,i*.3,i,0);sol(MX+x*.93,MZ+z*.93,4.2)}
 // picos nevados ao fundo
 for(let k=0;k<5;k++){const z=-24+k*12;M.add(K105(10+(k%2)*3,26+(k%3)*6,6),0x5e5852,-R0-10,12+(k%3)*3,z);M.add(K105(4,6,6),0xf2f4f8,-R0-10,24+(k%3)*6,z)}
 // entradas de túnel com moldura de madeira
 const tun=[[-.62*Math.PI+Math.PI,0],[Math.PI*.78,0],[Math.PI*1.2,0]];V105.tun=[];
 for(const [a] of tun){const x=Math.cos(a)*(R0-4.2),z=Math.sin(a)*(R0-4.2),ry=-a-Math.PI/2;M.add(B105(5,6,3),0x0c0a0a,x,3,z,0,ry);for(const s of[-1,1])M.add(B105(.5,6,.5),0x6a4426,x+Math.cos(ry)*s*2.6,3,z-Math.sin(ry)*s*2.6,0,ry);M.add(B105(6,.6,.6),0x6a4426,x,6.2,z,0,ry);M.add(B105(1.4,.4,.06),0x8a6a3a,x,7,z,0,ry);V105.tun.push([x,z,a])}
 // trilhos até o centro e carrinhos de minério
 for(const [x,z,a] of V105.tun){const L=Math.hypot(x,z)-4;for(const s of[-.55,.55]){const px=-Math.sin(a)*s,pz=Math.cos(a)*s;M.add(B105(.12,.1,L),0x6a6a74,x*.5+px,.08,z*.5+pz,0,Math.atan2(x,z))}for(let k=0;k<Math.floor(L/1.2);k++){const t=k*1.2/Math.hypot(x,z);M.add(B105(1.6,.08,.3),0x5a3a22,x*t,.04,z*t,0,Math.atan2(x,z))}
  const cx=x*.55,cz=z*.55;M.add(B105(1.5,.9,2),0x5a3a22,cx,.75,cz,0,Math.atan2(x,z));for(let k=0;k<5;k++)Mb.add(O105(.28),k%2?0x6ae8ff:0xb07aff,cx+(k%3-1)*.4,1.3,cz+(k-2)*.3);for(const s of[-1,1])for(const f of[-1,1])M.add(C105(.25,.25,.15,8),0x2a2a2e,cx+s*.7,.25,cz+f*.6,0,0,Math.PI/2);sol(MX+cx,MZ+cz,1.3)}
 // lagos de lava (brilham sozinhos) com pedras em volta
 V105.lava=[];for(const [x,z,r] of[[-8,6,4.2],[6,-10,3.2],[-14,-14,2.6]]){const m=new T.Mesh(new T.CircleGeometry(r,20),new T.MeshBasicMaterial({color:0xff6a1a}));m.rotation.x=-Math.PI/2;m.position.set(x,.07,z);g.add(m);V105.lava.push(m);
  const m2=new T.Mesh(new T.CircleGeometry(r*.6,16),new T.MeshBasicMaterial({color:0xffc23a}));m2.rotation.x=-Math.PI/2;m2.position.set(x+.3,.08,z-.2);g.add(m2);V105.lava.push(m2);for(let k=0;k<9;k++){const a=k/9*6.283;M.add(D105(.7+(k%2)*.3,0),0x3a322c,x+Math.cos(a)*(r+.4),.3,z+Math.sin(a)*(r+.4),k,k)}sol(MX+x,MZ+z,r+.6)}
 // cristais de mana nas paredes (dá para minerar)
 const ORE=[[0x6ae8ff,'azul'],[0xb07aff,'roxo'],[0x7affb0,'verde']];for(let k=0;k<7;k++){const a=Math.PI*.55+k*(Math.PI*.9/6),r=R0-11,x=Math.cos(a)*r,z=Math.sin(a)*r,c=ORE[k%3][0];for(let j=0;j<5;j++)Mb.add(O105(.5+((j*3)%4)*.18),c,x+(j%3-1)*.6,.8+(j%2)*.7+j*.1,z+(j-2)*.35,j*.4,j,(j%2?.3:-.3),1,1.8,1);V105.ores.push({x:MX+x,z:MZ+z,c,n:ORE[k%3][1],cd:0})}
 // lampiões e vigas
 for(let k=0;k<6;k++){const a=Math.PI*.6+k*.32,r=R0-13,x=Math.cos(a)*r,z=Math.sin(a)*r;M.add(C105(.1,.12,2.8,6),0x4a3424,x,1.4,z);Mb.add(B105(.36,.4,.36),0xffd27a,x,2.9,z)}
 g.add(M.mesh());g.add(Mb.mesh(1));put(g,MX,MZ);try{signBoard('Minas de Mana',MX+R0+4,MZ+8,-.5)}catch(e){}}
// mineração: cada veio de cristal dá moedas (volta a brilhar depois de um tempo)
for(const o of V105.ores)IA105.push({x:o.x,z:o.z,r:3.6,t:()=>o.cd>Date.now()?'⛏️ Cristal se recuperando…':'⛏️ Minerar cristal '+o.n,f:()=>{if(o.cd>Date.now()){toast('Este veio ainda está se recuperando. Volte daqui a pouco.');return}o.cd=Date.now()+60000;const c=8+Math.floor(Math.random()*10)+Math.floor((P.lv||1)/4);P.coins+=c;try{burst('luz',o.x,1.4,o.z,18,4);fxp({x:o.x,y:1.4,z:o.z,c:o.c,n:14,sp:4,sz:.25,life:.7,g:6,up:4})}catch(e){}toast('⛏️ Você minerou cristal '+o.n+': +'+c+' moedas');try{saveGame()}catch(e){}}});
// ---------- FLORESTA DAS BRUXAS: árvores mágicas gigantes (copas roxas e rosa, casinhas iluminadas)
{const M=MG105(),Mb=MG105(),g=G83(),C0={x:-372,z:-150},TR=[[-30,-46],[22,-58],[-56,6],[40,30],[-18,44],[64,-20],[-70,-40],[10,70],[80,40],[-40,80]];
 const CAN=[0x8a3ad0,0xb04ae0,0xd060c8,0x6a3ab0,0xe070b0];let n=0;
 for(const [dx,dz] of TR){const x=dx,z=dz,wx=C0.x+x,wz=C0.z+z;if(Math.hypot(wx+438,wz+176)<26||Math.hypot(wx+230,wz+150)<34)continue;const H=14+(n%3)*3;
  M.add(C105(1.2,2.2,H,8),0x5a3a2a,x,H/2,z);for(let k=0;k<4;k++){const a=k*1.6+n;M.add(C105(.3,.7,6,6),0x5a3a2a,x+Math.cos(a)*1.8,1.2,z+Math.sin(a)*1.8,Math.sin(a)*1.1,0,-Math.cos(a)*1.1)}
  for(let k=0;k<5;k++){const a=k*1.26+n,r=k?4.2:0,y=H+(k?-1.2:1.6);M.add(D105(k?4.2:5.6,1),CAN[(n+k)%5],x+Math.cos(a)*r,y,z+Math.sin(a)*r)}
  // casinha na árvore com janela acesa e escada
  if(n%2==0){const hy=H*.55;M.add(B105(3.6,2.6,3.2),0x6a4a8a,x+2.6,hy,z);M.add(K105(2.8,2.2,4),0x3a2a5a,x+2.6,hy+2.4,z,0,Math.PI/4);M.add(B105(4.6,.3,4),0x5a3a22,x+2.6,hy-1.4,z);Mb.add(B105(.9,.9,.06),0xffd27a,x+2.6,hy+.2,z+1.62);for(let k=0;k<Math.floor(hy/.7);k++)M.add(B105(.9,.08,.12),0x6a4426,x+4.9,.3+k*.7,z+.6)}
  // cogumelos brilhantes no pé
  for(let k=0;k<3;k++){const a=k*2.1+n;Mb.add(S105(.45,8,5),[0xff7ad8,0x7ad8ff,0xd0ff7a][k],x+Math.cos(a)*3.4,.5,z+Math.sin(a)*3.4)}
  sol(wx,wz,2.4);n++}
 g.add(M.mesh());g.add(Mb.mesh(1));put(g,C0.x,C0.z)}
// ---------- CAPITAL: castelo branco no alto de um planalto atrás da muralha (as casas e o castelo antigo continuam iguais)
{const M=MG105(),g=G83(),WH=0xeeeef2,WH2=0xd8dae2,RF=0xc8323a,RF2=0xa82830,CZ0=CZ-92;
 // planalto em degraus (paredão de pedra clara)
 for(let k=0;k<3;k++){const w=150-k*30,h=12+k*10,d=34-k*4,zc=-k*2.5;M.add(B105(w,h,d),k%2?0xd6d2c8:0xe2ded4,0,h/2,zc)}
 for(let i=0;i<14;i++){M.add(D105(4+(i%3),0),0x6a8a3a,-66+i*10.2,12.6,15.5);M.add(D105(3,0),0x5a7a32,-60+i*9.4,22.6,10.2+(i%2))}
 // muralha branca com torres de telhado vermelho pontudo
 const tw=(x,z,r,h,c)=>{M.add(C105(r,r*1.08,h,10),c||WH,x,32+h/2,z);M.add(C105(r*1.15,r*1.15,.6,10),WH2,x,32+h,z);M.add(K105(r*1.25,r*2.6,10),RF,x,32+h+r*1.3,z);M.add(C105(.06,.06,1.6,4),0xd8b040,x,32+h+r*2.6+.8,z)};
 M.add(B105(84,6,2),WH,0,35,6);for(let x=-40;x<=40;x+=4)M.add(B105(2,1.2,2.2),WH2,x,38.6,6);
 for(const [x,z,r,h] of[[-42,6,3,12],[42,6,3,12],[-24,4,2.4,9],[24,4,2.4,9],[-30,-8,3.2,16],[30,-8,3.2,16],[-12,-6,2.6,20],[12,-6,2.6,20],[0,-2,4.4,26],[-50,-6,2.2,10],[50,-6,2.2,10],[0,-14,3,34]])tw(x,z,r,h);
 // palácio central
 M.add(B105(30,14,14),WH,0,39,-6);M.add(B105(22,3,10),WH2,0,47.5,-6);for(let k=0;k<7;k++)M.add(B105(1.1,2.6,.1),0x3a4a8a,-9+k*3,41,1.06);M.add(B105(4,6,.2),0x8a6a3a,0,35,1.1);
 for(const s of[-1,1])M.add(K105(4.8,9,4),RF2,s*9,50,-6,0,Math.PI/4);
 // escadaria branca descendo o planalto
 for(let k=0;k<8;k++){const h=32-k*4;M.add(B105(12,h,1.8),k%2?WH2:WH,0,h/2,10.9+k*1.8)}
 g.add(M.mesh());put(g,0,CZ0)}

// ---------- regiões com letreiro ao entrar
const RG105=[];
{for(const v of VILS)RG105.push({x:v.x,z:v.z,r:v.r+4,big:'VILAS E CIDADES',sub:v.n});
 RG105.push({x:0,z:CZ,r:70,big:'CAPITAL REAL',sub:'Coração do Reino de Clover'});
 RG105.push({x:PL105.col.x,z:PL105.col.z,r:34,big:'COLISEU DO EXAME',sub:'Onde nascem os Cavaleiros Mágicos'});
 RG105.push({x:PL105.fos.x,z:PL105.fos.z,r:38,big:'VALE DOS FÓSSEIS',sub:'Ossos de uma fera de outra era'});
 RG105.push({x:PL105.min.x,z:PL105.min.z,r:36,big:'MINAS DE MANA',sub:'Cristais, trilhos e lava'});
 RG105.push({x:-372,z:-150,r:95,big:'FLORESTA DAS BRUXAS',sub:'Árvores mágicas e segredos antigos'});
 RG105.push({x:300,z:-338,r:60,big:'VULCÃO YULTIM',sub:'Terras Selvagens'});
 try{for(const h of HQ83)RG105.push({x:h.x,z:h.z,r:20,big:'QUARTEL',sub:(V105.SQ9.find(q=>q[0]==h.id)||[0,h.id])[1]})}catch(e){}
 RG105.push({x:128,z:-128,r:18,big:'QUARTEL',sub:'Esconderijo dos Touros Negros'});
 RG105.sort((a,b)=>a.r-b.r)}
V105.reg=null;V105.regT=0;
function rg105Tick(dt){V105.regT-=dt;if(V105.regT>0)return;V105.regT=.5;if(!P.g||INT86.on||(window.CINE105&&CINE105.on)||(window.EX105&&EX105.on))return;
 const r=RG105.find(o=>Math.hypot(P.x-o.x,P.z-o.z)<o.r)||null;const k=r?r.big+'|'+r.sub:null;if(k===V105.reg)return;V105.reg=k;if(r&&!(MENU&&MENU.on))title105(r.big,r.sub,null,2600)}
// o jogo já mostra o nome da região ao entrar: os lugares novos entram na mesma lista
try{REG83.push({id:'coliseu',n:'Coliseu do Exame',s:'Exame dos Cavaleiros Mágicos',x:PL105.col.x,z:PL105.col.z,r:36,c:0x8a8ea0},{id:'fosseis',n:'Vale dos Fósseis',s:'Ossos de uma fera antiga',x:PL105.fos.x,z:PL105.fos.z,r:40,c:0xc8b48a},{id:'minas',n:'Minas de Mana',s:'Cristais, trilhos e lava',x:PL105.min.x,z:PL105.min.z,r:38,c:0x5a4e44})}catch(e){}
// destinos novos no portal do Finral
try{const c=TP83.find(c=>c[0]=='Reino Comum');if(c){c[1].push(['Coliseu do Exame',PL105.col.x,PL105.col.z+34],['Vale dos Fósseis',PL105.fos.x,PL105.fos.z+30]);}const w=TP83.find(c=>c[0]=='Terras Selvagens');if(w)w[1].push(['Minas de Mana',PL105.min.x+34,PL105.min.z+6])}catch(e){}

// ===================================================================== ORDENS E RENASCER NO QUARTEL =====================================================================
function ord105(){try{return v82S().ord105||null}catch(e){return null}}
function ord105Info(id){const q=V105.SQ9.find(q=>q[0]==id);return q?{id,n:q[1],c:q[2],c2:q[3]}:null}
function ord105Home(){const o=ord105();if(o&&o.id){let x=0,z=0;if(o.id=='touro'){x=128;z=-120}else{const h=HQ83.find(h=>h.id==o.id);if(h){const HQD={dourado:7.05,aguia:7.6,leao:7.05,rosa:5.56,louva:5.06,pavao:8.5,orca:5.06,cervo:6.2};x=h.x;z=h.z+(HQD[h.id]||6)+5}}
  if(x||z){let s=[x,z];try{s=v83Safe(x,z)}catch(e){}const I=ord105Info(o.id);return{x:s[0],z:s[1],n:o.id=='touro'?'no Esconderijo dos Touros Negros':'no Quartel '+(['aguia','rosa','orca'].includes(o.id)?'da ':'do ')+(I?I.n:o.id)}}}
 return{x:0,z:0,n:'na Vila Hage'}}
// uniformes das ordens que ainda não existiam na loja
try{Object.assign(SK,{leao:['Leão Carmesim',150,0xc0302a,0x8a1a14],rosa:['Rosa Azul',150,0x3b6ad0,0x24448a],louva:['Louva-a-Deus Verde',150,0x3a8a4a,0x24602e],pavao:['Pavão de Coral',150,0xe07a6a,0x2a6a7a],orca:['Orca Púrpura',150,0x7a3aa0,0x4a2070],cervo:['Cervo Azul',150,0x3ab0c0,0x1e7a88]})}catch(e){}
const ORDSK105={touro:'touros',dourado:'alvorecer',aguia:'aguias',leao:'leao',rosa:'rosa',louva:'louva',pavao:'pavao',orca:'orca',cervo:'cervo'};
function ord105Join(id,score){const v=v82S(),I=ord105Info(id);if(!I)return;v.ord105={id,t:Date.now(),sc:score||0};const sk=ORDSK105[id];try{if(sk&&SK[sk]){P.own=P.own||{};P.own[sk]=1;skin(sk)}}catch(e){}try{saveGame()}catch(e){}
 ex105Hands(null);const h=ord105Home();banner('BEM-VINDO À ORDEM',I.n.toUpperCase(),'#f0cf72');toast('🛡️ Agora você é da ordem '+I.n+'! Você vai renascer '+h.n+'. O uniforme da ordem já está equipado.');try{nkLog('ordem',I.n)}catch(e){}
 setTimeout(()=>{try{tele105(h.x,h.z)}catch(e){}},1600)}
function tele105(x,z){try{if(INT86.on&&typeof int86Exit=='function')int86Exit()}catch(e){}try{const b=document.createElement('div');b.style.cssText='position:fixed;inset:0;background:#000;z-index:60;opacity:0;transition:opacity .35s;pointer-events:none';document.body.appendChild(b);requestAnimationFrame(()=>b.style.opacity=1);setTimeout(()=>{P.x=x;P.z=z;P.y=0;P.vy=0;setTimeout(()=>{b.style.opacity=0;setTimeout(()=>b.remove(),400)},150)},380)}catch(e){P.x=x;P.z=z}}
// ao entrar no jogo, quem já é de uma ordem começa no quartel dela
{const _lg=loadGame;loadGame=function(sv){const r=_lg.apply(this,arguments);setTimeout(()=>{try{const o=ord105();if(o&&o.id&&!V105.started){V105.started=1;const h=ord105Home();P.x=h.x;P.z=h.z;}}catch(e){}},900);return r}}

// ===================================================================== EXAME DOS CAVALEIROS MÁGICOS =====================================================================
const EX105={on:false,i:-1,t:0,sc:[0,0,0,0,0],objs:[],ens:[],st:null,lv:10};
const EXT105=[['PROVA I','Controle de Mana','Fique perto de cada pedra para erguê-la com a sua mana',40],['PROVA II','Agilidade','Passe pelos anéis de mana na ordem, o mais rápido que puder',35],['PROVA III','Mira Mágica','Quebre os cristais que aparecem pela arena',45],['PROVA IV','Duelo','Derrote outro candidato',75],['PROVA V','O Capitão','Sobreviva ao capitão examinador por 30 segundos',30]];
const EXLINE105=['"Poder sem controle não vale nada. Levante as pedras e segure firme."','"Um cavaleiro chega antes do perigo. Corra!"','"Magia que não acerta não protege ninguém. Mire nos cristais."','"Lá fora ninguém luta por você. Vença o seu oponente."','"Agora é comigo. Mostre que aguenta de pé!"'];
// capitães no camarote (cada um com as cores da sua ordem) e o examinador na entrada
V105.caps=[];
{const {x:CX,z:CZ}=PL105.col,BZ=-22.6+2.6;const HS=[1,2,3,1,4,2,3,1,2],HC=[0x161616,0xf0d060,0xe8e8f0,0xc84a2a,0x2a3a6a,0x3a5a2a,0xd8b8a0,0x3a2a4a,0x88d0e0];
 V105.SQ9.forEach((q,k)=>{const o={name:'Capitão — '+q[1],line:'Estamos de olho nos candidatos deste ano.',top:q[2]==0x1c1c1c?0x1c1c1c:0x2a2a34,pants:0x22222a,hs:HS[k],hair:HC[k],skin:[0xf1c9a0,0xd8b090,0xf4e4d8,0xc89a78,0xf1c9a0][k%5],cape:q[2],coat:1,belt:1,boots:1,h:1.05+(k%3)*.05,w:1+(k%2)*.12};
  const g=npc(o);put(g,CX+V105.chairs[k],CZ+BZ-.4);g.position.y=1.8;g.rotation.y=0;V105.caps.push({g,id:q[0]})})
 VAR.exam105={name:'Examinador Real',line:'O Exame dos Cavaleiros Mágicos acontece aqui.',top:0xe8e4d8,pants:0x3a3a4a,hs:2,hair:0x8a8a8a,skin:0xe8c8a8,cape:0x2f3e8a,coat:1,long:1,belt:1,boots:1,h:1.1};
 V105.exam=npc(VAR.exam105);put(V105.exam,CX-5,CZ+31);V105.exam.rotation.y=Math.PI}
// placa na Vila Hage apontando o caminho
try{signBoard('Coliseu do Exame →',16,30,-.9)}catch(e){}
// mãozinha dourada em cima dos capitães que querem o jogador
function hand105Tex(){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#f0cf72';x.strokeStyle='#2a1a06';x.lineWidth=8;x.beginPath();x.arc(64,64,52,0,6.283);x.fill();x.stroke();x.fillStyle='#2a1a06';
 // mão aberta simples
 x.fillRect(42,58,44,40);for(let k=0;k<4;k++)x.fillRect(42+k*11,28+(k==0||k==3?8:0),9,34);x.save();x.translate(86,70);x.rotate(-.6);x.fillRect(0,-6,26,10);x.restore();return new T.CanvasTexture(c)}
function ex105Hands(ids){try{for(const c of V105.caps){if(c.hs){c.g.remove(c.hs);c.hs=null}if(ids&&ids.includes(c.id)){if(!V105.htx)V105.htx=hand105Tex();const s=new T.Sprite(new T.SpriteMaterial({map:V105.htx,depthTest:false}));s.scale.set(.9,.9,.9);s.position.y=3.3;c.g.add(s);c.hs=s}}}catch(e){}}
// talk: examinador e capitães
{const _t=talk;talk=function(n){
 if(n.g===V105.exam){const o=ord105();if(EX105.on){dlg(n.name,'O exame já começou! Volte para a arena.',[['Ok','dlgClose()']]);return}
  if((P.lv||1)<EX105.lv){dlg(n.name,'Você ainda é muito novo para o exame. Volte no <b>Nível '+EX105.lv+'</b>.',[['Tchau','dlgClose()']]);return}
  const txt='O <b>Exame dos Cavaleiros Mágicos</b> tem <b>5 provas</b>: Controle de Mana, Agilidade, Mira Mágica, Duelo e O Capitão. Os capitães de <b>9 ordens</b> estão assistindo. No fim, os que gostarem de você levantam a mão e você escolhe a sua ordem.<br><br>Quem entra para uma ordem passa a <b>renascer no quartel</b> dela.';
  if(o&&o.id){const I=ord105Info(o.id);dlg(n.name,'Você já é da ordem <b>'+(I?I.n:o.id)+'</b>. Se quiser, pode refazer o exame para trocar de ordem.<br><br>'+txt,[['Refazer o exame','dlgClose();ex105Start()'],['Agora não','dlgClose()']]);return}
  dlg(n.name,txt,[['Começar o exame','dlgClose();ex105Start()'],['Agora não','dlgClose()']]);return}
 const c=V105.caps.find(c=>c.g===n.g);if(c){const o=ord105(),I=ord105Info(c.id);if(o&&o.id==c.id){dlg(n.name,'Bom te ver, membro da '+I.n+'. Continue treinando.',[['Tchau','dlgClose()']]);return}dlg(n.name,'Faça o exame com o Examinador Real, na entrada do coliseu. Quem sabe eu levanto a mão para você.',[['Tchau','dlgClose()']]);return}
 return _t.apply(this,arguments)}}
// ---------- painel das provas
(function(){const st=document.createElement('style');st.textContent=
 '#ex105{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 58px);transform:translateX(-50%);z-index:42;display:none;min-width:min(78vw,420px);padding:8px 14px 9px;border-radius:12px;border:2px solid #c9a24a;background:linear-gradient(180deg,rgba(18,22,46,.94),rgba(10,12,28,.94));color:#f3e6c4;font:600 13px system-ui;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.5)}'+
 '#ex105 .h{font-family:Cinzel,Georgia,serif;font-weight:900;color:#f0cf72;letter-spacing:.06em;font-size:15px}#ex105 .o{margin:3px 0 6px;opacity:.92}#ex105 .r{display:flex;gap:10px;align-items:center}#ex105 .bar{flex:1;height:9px;border-radius:6px;background:#2a2e4a;overflow:hidden}#ex105 .bar i{display:block;height:100%;background:linear-gradient(90deg,#f0cf72,#ffe9a0)}#ex105 .t{font:800 15px system-ui;color:#fff;min-width:42px}'+
 '#exr105{position:fixed;inset:0;z-index:58;display:none;align-items:center;justify-content:center;background:rgba(4,6,16,.55)}#exr105 .c{width:min(92vw,560px);max-height:88vh;overflow:auto;border-radius:14px;border:2px solid #c9a24a;background:linear-gradient(180deg,#141a36,#0b0e20);color:#f3e6c4;padding:16px 18px;font:600 14px system-ui;box-shadow:0 10px 40px rgba(0,0,0,.6)}'+
 '#exr105 h2{margin:0 0 2px;font-family:Cinzel,Georgia,serif;font-weight:900;color:#f0cf72;letter-spacing:.05em;font-size:22px}#exr105 .sub{opacity:.8;font-size:12px;margin-bottom:10px}#exr105 .row{display:flex;align-items:center;gap:10px;margin:7px 0}#exr105 .row b{width:150px;font-weight:700}#exr105 .row .bar{flex:1;height:10px;border-radius:6px;background:#2a2e4a;overflow:hidden}#exr105 .row .bar i{display:block;height:100%;background:linear-gradient(90deg,#4a7aff,#9ad0ff)}#exr105 .row span{width:58px;text-align:right}'+
 '#exr105 .tot{margin:12px 0 8px;padding:10px;border-radius:10px;background:rgba(240,207,114,.08);border:1px solid #6a5a2a;text-align:center;font-size:15px}#exr105 .ok{color:#7aff9a;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:20px}#exr105 .no{color:#ff7a7a;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:20px}'+
 '#exr105 .btn{display:inline-block;margin:6px 4px 0;padding:10px 16px;border-radius:10px;border:2px solid #f0cf72;background:linear-gradient(180deg,#3a2a10,#1e1408);color:#ffe9a0;font:800 14px system-ui;cursor:pointer}#exr105 .btn.g{border-color:#666;color:#bbb;background:#1a1a22}'+
 '#exr105 .sq{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;margin-top:8px}#exr105 .q{border-radius:10px;padding:8px;border:2px solid #333a5a;background:#121630;text-align:center}#exr105 .q.y{border-color:#f0cf72;background:#1e1a10}#exr105 .q .em{width:30px;height:30px;border-radius:50%;margin:0 auto 4px;border:2px solid #000}#exr105 .q .nm{font-weight:800;font-size:13px}#exr105 .q .st{font-size:11px;opacity:.8;margin:3px 0}#exr105 .q.n{opacity:.45}';document.head.appendChild(st);
 const a=document.createElement('div');a.id='ex105';document.body.appendChild(a);const b=document.createElement('div');b.id='exr105';b.innerHTML='<div class="c"></div>';document.body.appendChild(b)})();
function ex105UI(){const d=$('ex105');if(!EX105.on||EX105.i<0||EX105.i>4||EX105.wait){d.style.display='none';return}const T5=EXT105[EX105.i];let p=0,pt='';const S=EX105.st||{};
 if(EX105.i==0){p=S.done/4;pt=S.done+'/4 pedras'}else if(EX105.i==1){p=S.k/8;pt=S.k+'/8 anéis'}else if(EX105.i==2){p=S.br/6;pt=S.br+'/6 cristais'}else if(EX105.i==3){const e=S.e;p=e?1-Math.max(0,e.hp)/e.mhp:1;pt='Vida do rival: '+Math.max(0,Math.round(e?e.hp/e.mhp*100:0))+'%'}else{p=1-EX105.t/T5[3];pt='Aguente firme!'}
 d.style.display='block';d.innerHTML='<div class="h">'+T5[0]+' · '+T5[1].toUpperCase()+'</div><div class="o">'+T5[2]+' — <b>'+pt+'</b></div><div class="r"><div class="bar"><i style="width:'+Math.round(Math.max(0,Math.min(1,p))*100)+'%"></i></div><div class="t">'+Math.ceil(Math.max(0,EX105.t))+'s</div></div>'}
// ---------- começar / limpar / provas
function ex105Clear(){for(const o of EX105.objs){try{(o.par||S).remove(o.m||o)}catch(e){}}EX105.objs=[];for(const e of EX105.ens){const i=enemies.indexOf(e);if(i>=0){try{S.remove(e.m);freeObj(e.m);if(e.lb)e.lb.remove()}catch(er){}enemies.splice(i,1)}}EX105.ens=[]}
function ex105Start(){if(EX105.on)return;try{exitAll&&0}catch(e){}const {x:CX,z:CZ}=PL105.col;Object.assign(EX105,{on:true,i:-1,t:0,sc:[0,0,0,0,0],wait:1});ex105Clear();ex105Hands(null);
 tele105(CX,CZ+12);try{P.f=Math.PI}catch(e){}setTimeout(()=>{title105('EXAME DOS CAVALEIROS MÁGICOS','9 ordens estão assistindo',null,3000)},500);setTimeout(()=>ex105Next(),3700)}
function ex105Next(){EX105.i++;if(EX105.i>4){ex105End(false);return}const i=EX105.i,T5=EXT105[i];EX105.wait=1;ex105Clear();EX105.st={};title105(T5[1].toUpperCase(),EXLINE105[i],T5[0],3000);
 setTimeout(()=>{if(!EX105.on)return;EX105.wait=0;EX105.t=T5[3];ex105Setup(i);try{toast('Prova '+(i+1)+'/5: '+T5[2]+'.')}catch(e){}},3200)}
function ex105Setup(i){const {x:CX,z:CZ}=PL105.col,S5=EX105.st;
 if(i==0){S5.done=0;S5.rk=[];for(let k=0;k<4;k++){const a=k/4*Math.PI*2+.4,x=CX+Math.cos(a)*11,z=CZ+Math.sin(a)*11;const m=new T.Group();const r=mk(new T.DodecahedronGeometry(1.5,0),0x8a8478,1);r.position.y=1.2;m.add(r);const ring=new T.Mesh(new T.TorusGeometry(2.1,.09,6,28),new T.MeshBasicMaterial({color:0xf0cf72,transparent:true,opacity:.25}));ring.rotation.x=Math.PI/2;ring.position.y=.12;m.add(ring);m.position.set(x,0,z);S.add(m);EX105.objs.push(m);S5.rk.push({m,r,ring,x,z,p:0,ok:0})}}
 if(i==1){S5.k=0;S5.rg=[];const pts=[[0,8],[9,4],[12,-6],[4,-13],[-7,-10],[-13,-1],[-8,9],[0,0]];pts.forEach(([dx,dz],k)=>{const nx=pts[k+1]||pts[0];const m=new T.Mesh(new T.TorusGeometry(1.6,.16,8,28),new T.MeshBasicMaterial({color:0x6ad0ff,transparent:true,opacity:.35}));m.position.set(CX+dx,1.7,CZ+dz);m.rotation.y=Math.atan2(nx[0]-dx,nx[1]-dz);S.add(m);EX105.objs.push(m);S5.rg.push(m)});const mk2=new T.Mesh(new T.CylinderGeometry(1.3,1.3,9,16,1,true),new T.MeshBasicMaterial({color:0xf0cf72,transparent:true,opacity:.22,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));mk2.position.y=4.5;const dk=new T.Mesh(new T.RingGeometry(1.2,1.7,24),new T.MeshBasicMaterial({color:0xf0cf72,transparent:true,opacity:.8,side:T.DoubleSide}));dk.rotation.x=-Math.PI/2;dk.position.y=.06;const mg=new T.Group();mg.add(mk2,dk);S.add(mg);EX105.objs.push(mg);S5.mk=mg}
 if(i==2){S5.br=0;for(let k=0;k<6;k++){const a=k/6*Math.PI*2+.3,r=8+(k%3)*3.5;ex105Crystal(CX+Math.cos(a)*r,CZ+Math.sin(a)*r,k)}}
 if(i==3){const GL=['fogo','agua','vento','luz','sangue','sombra'];try{spawn({id:'ex105',lv:Math.max(10,P.lv),at:{x:CX,z:CZ-7,r:1.5},en:{n:'Candidato Rival',gr:[GL[Math.floor(Math.random()*GL.length)]]}})}catch(e){}const e=enemies.filter(e=>e.qid==='ex105').pop();if(e){e.mhp=Math.round(e.mhp*3);e.hp=e.mhp;e.ag=1;e.name='Candidato Rival';EX105.ens.push(e);S5.e=e}}
 if(i==4){try{BOSSES.cap105=BOSSES.cap105||{n:'Capitão Examinador',x:CX,z:CZ,lv:20,gr:'luz',rnd:1,lk:{top:0x2a2a34,pants:0x1a1a22,hs:2,hair:0xe8e8f0,coat:1,long:1,cape:0x2f3e8a,belt:1,boots:1,skin:0xe8c8a8,eye:0xf0cf72,h:1.35,w:1.2},book:0xd8b040};const b=spawnBoss('cap105',{x:CX,z:CZ-9,lv:Math.max(12,(P.lv||1)+2),bid:'ex105-'+Date.now()});if(b){b.own=true;b.ag=1;EX105.ens.push(b);S5.b=b;banner('CAPITÃO EXAMINADOR','Sobreviva por 30 segundos','#f0cf72')}}catch(e){}}}
function ex105Crystal(x,z,k){const L=person({top:0x6ad0ff,pants:0x6ad0ff,hs:0}),g=L.g;g.traverse(o=>{if(o.isMesh)o.visible=false});const c=new T.Mesh(new T.OctahedronGeometry(1,0),new T.MeshBasicMaterial({color:[0x6ad0ff,0xb07aff,0x7affb0][k%3]}));c.scale.set(.8,1.5,.8);c.position.y=1.6;g.add(c);
 const ol=new T.Mesh(c.geometry,olm);ol.scale.setScalar(1.08);c.add(ol);g.position.set(x,0,z);S.add(g);const hp=Math.round((30+14*Math.max(10,P.lv))*.9);const e={m:g,L,x,z,hp,mhp:hp,lv:P.lv,dm:0,cd:0,sp:0,gr:null,mc:99,name:'Cristal de Mana',dai:()=>{c.rotation.y+=.03},cr105:c,qid:'exc105',noXp:1};enemies.push(e);EX105.ens.push(e)}
function ex105Score(i,frac,tl){const T5=EXT105[i];return Math.round(100*Math.max(0,Math.min(1,frac))*(.6+.4*Math.max(0,tl)/T5[3]))}
function ex105Finish(sc){if(EX105.wait)return;const i=EX105.i;EX105.sc[i]=Math.max(0,Math.min(100,Math.round(sc)));EX105.wait=1;ex105Clear();try{toast('Prova '+(i+1)+' concluída: '+EX105.sc[i]+' pontos.')}catch(e){}setTimeout(()=>{if(EX105.on)ex105Next()},1400)}
function ex105Tick(dt){if(!EX105.on)return;const {x:CX,z:CZ}=PL105.col;
 if(Math.hypot(P.x-CX,P.z-CZ)>34&&!EX105.wait){ex105End(true);return}
 // nada de bandidos atrapalhando dentro do coliseu
 for(let k=enemies.length-1;k>=0;k--){const e=enemies[k];if(EX105.ens.includes(e))continue;if(Math.hypot(e.x-CX,e.z-CZ)<30&&!e.boss){try{S.remove(e.m);freeObj(e.m);if(e.lb)e.lb.remove()}catch(er){}enemies.splice(k,1)}}
 if(EX105.wait||EX105.i<0)return;EX105.t-=dt;const i=EX105.i,S5=EX105.st;
 if(i==0){for(const o of S5.rk){const d=Math.hypot(P.x-o.x,P.z-o.z);if(!o.ok&&d<3.4){o.p=Math.min(1,o.p+dt/2);if(Math.random()<.4)try{fxp({x:o.x,y:1+o.p*2.6,z:o.z,c:0xf0cf72,n:2,sp:2,sz:.2,life:.6,g:-2,up:3})}catch(e){}if(o.p>=1){o.ok=1;S5.done++;try{burst('luz',o.x,3.6,o.z,16,4)}catch(e){}}}else if(!o.ok)o.p=Math.max(0,o.p-dt*.25);
   o.r.position.y=1.2+o.p*2.8+(o.ok?Math.sin(performance.now()/300+o.x)*.15:0);o.r.rotation.y+=dt*(o.p>0?1.5:0);o.ring.material.opacity=.25+o.p*.6;o.ring.scale.setScalar(1+o.p*.15)}
  if(S5.done>=4)ex105Finish(ex105Score(0,1,EX105.t));else if(EX105.t<=0)ex105Finish(ex105Score(0,(S5.done+S5.rk.reduce((a,o)=>a+(o.ok?0:o.p*.5),0))/4,0))}
 if(i==1){const m=S5.rg[S5.k];if(m&&S5.mk){S5.mk.position.set(m.position.x,0,m.position.z)}if(m){m.material.color.setHex(0xf0cf72);m.material.opacity=.95;m.rotation.z+=dt*2;if(Math.hypot(P.x-m.position.x,P.z-m.position.z)<2.1){try{burst('vento',m.position.x,1.7,m.position.z,14,4)}catch(e){}m.visible=false;S5.k++;const n=S5.rg[S5.k];if(n){n.material.opacity=.95}}}
  if(S5.k>=8)ex105Finish(ex105Score(1,1,EX105.t));else if(EX105.t<=0)ex105Finish(ex105Score(1,S5.k/8,0))}
 if(i==2){S5.br=6-EX105.ens.filter(e=>enemies.includes(e)&&e.hp>0).length;if(S5.br>=6)ex105Finish(ex105Score(2,1,EX105.t));else if(EX105.t<=0)ex105Finish(ex105Score(2,S5.br/6,0))}
 if(i==3){const e=S5.e;if(!e||!enemies.includes(e)||e.hp<=0)ex105Finish(ex105Score(3,1,EX105.t));else if(EX105.t<=0)ex105Finish(100*(1-e.hp/e.mhp)*.55)}
 if(i==4){const b=S5.b;if(b&&(!enemies.includes(b)||b.hp<=0))ex105Finish(100);else if(EX105.t<=0)ex105Finish(45+55*Math.max(0,P.hp)/P.mhp)}}
// se o jogador cair durante o exame, não morre: a prova atual termina com o que conseguiu
function ex105Down(){if(!EX105.on)return false;P.hp=Math.max(1,Math.round(P.mhp*.35));P.iv=2;try{flashRed()}catch(e){}if(!EX105.wait&&EX105.i>=0){const i=EX105.i,S5=EX105.st||{};let sc=0;
  if(i==0)sc=ex105Score(0,(S5.done||0)/4,0);else if(i==1)sc=ex105Score(1,(S5.k||0)/8,0);else if(i==2)sc=ex105Score(2,(S5.br||0)/6,0);else if(i==3){const e=S5.e;sc=e?100*(1-e.hp/e.mhp)*.45:0}else sc=Math.round(45*(1-EX105.t/30));toast('Você caiu na prova! Ela terminou com '+Math.round(sc)+' pontos.');ex105Finish(sc)}return true}
function ex105End(cancel){const was=EX105.on;EX105.on=false;EX105.wait=0;ex105Clear();$('ex105').style.display='none';if(!was)return;if(cancel){toast('Você saiu do coliseu: o exame foi cancelado.');return}ex105Result()}
// ---------- resultado e escolha da ordem
function ex105Result(){const sc=EX105.sc,tot=sc.reduce((a,b)=>a+b,0),ok=tot>=200,N=['Controle de Mana','Agilidade','Mira Mágica','Duelo','O Capitão'];const rank=tot>=440?'Cavaleiro Mágico de Ouro':tot>=360?'Cavaleiro Mágico de Prata':tot>=280?'Cavaleiro Mágico de Bronze':'Cavaleiro Mágico Júnior';
 const box=$('exr105'),c=box.querySelector('.c');let h='<h2>EXAME DOS CAVALEIROS MÁGICOS</h2><div class="sub">Resultado das provas</div>';N.forEach((n,k)=>h+='<div class="row"><b>'+(k+1)+'. '+n+'</b><div class="bar"><i style="width:'+sc[k]+'%"></i></div><span>'+sc[k]+'/100</span></div>');
 h+='<div class="tot">Total: <b>'+tot+'/500</b><br>'+(ok?'<span class="ok">APROVADO</span><br>'+rank:'<span class="no">REPROVADO</span><br>Precisa de 200 pontos. Treine e tente de novo!')+'</div>';
 h+=ok?'<div style="text-align:center"><span class="btn" onclick="ex105Pick()">✋ Ver quem levantou a mão</span></div>':'<div style="text-align:center"><span class="btn" onclick="ex105Close()">Fechar</span> <span class="btn" onclick="ex105Close();ex105Start()">Tentar de novo</span></div>';
 c.innerHTML=h;box.style.display='flex';EX105.tot=tot;if(ok){try{P.honra=(P.honra||0)+Math.round(tot/10);saveGame()}catch(e){}}}
function ex105Close(){$('exr105').style.display='none';ex105Hands(null)}
function ex105Accept(tot){const others=V105.SQ9.slice(1).map(q=>q[0]);let n=tot>=420?8:tot>=340?6:tot>=260?4:2;let s=tot*7+((P.lv||1)*13);const pool=others.slice(),pick=[];while(pick.length<n&&pool.length){s=(s*9301+49297)%233280;pick.push(pool.splice(s%pool.length,1)[0])}return['touro'].concat(pick)}
function ex105Pick(){const tot=EX105.tot||0,acc=ex105Accept(tot);ex105Hands(acc);const c=$('exr105').querySelector('.c');let h='<h2>ESCOLHA SUA ORDEM</h2><div class="sub">Os capitães que gostaram de você levantaram a mão. Quem entra numa ordem passa a renascer no quartel dela.</div><div class="sq">';
 for(const q of V105.SQ9){const y=acc.includes(q[0]),col='#'+q[2].toString(16).padStart(6,'0');h+='<div class="q '+(y?'y':'n')+'"><div class="em" style="background:'+col+'"></div><div class="nm">'+q[1]+'</div><div class="st">'+(y?'✋ levantou a mão':'não levantou a mão')+'</div>'+(y?'<span class="btn" style="padding:6px 10px;font-size:12px" onclick="ex105Close();ord105Join(\''+q[0]+'\','+tot+')">Entrar</span>':'')+'</div>'}
 h+='</div><div style="text-align:center;margin-top:10px"><span class="btn g" onclick="ex105Close()">Decidir depois</span></div>';c.innerHTML=h;
}
let EX105UT=0;{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{ex105Tick(dt)}catch(e){}EX105UT-=dt;if(EX105UT<=0){EX105UT=.2;try{ex105UI()}catch(e){}}
 try{const t=performance.now()/1000;if(V105.cring)V105.cring.rotation.z=t*.3;if(V105.lava)V105.lava.forEach((m,k)=>{m.material.color.setHSL(.06+Math.sin(t*1.5+k)*.015,1,.52+Math.sin(t*2+k)*.06)})}catch(e){}
 // aviso único quando chega no nível do exame
 try{if(!V105.nt&&P.g&&(P.lv||1)>=EX105.lv&&!ord105()){V105.nt=1;const v=v82S();if(!v.ex105n){v.ex105n=1;setTimeout(()=>toast('📜 O Exame dos Cavaleiros Mágicos está aberto! Vá ao Coliseu do Exame (ao sudeste da Vila Hage).'),6000)}}}catch(e){}return r}}
// cristais do exame não dão recompensa de inimigo comum
try{const _kx=killXP;killXP=function(e){if(e&&e.noXp)return 0;return _kx.apply(this,arguments)}}catch(e){}

// ===================================================================== ESPADA SAINDO DO GRIMÓRIO =====================================================================
const CINE105={on:false,S:null,cam:null};window.CINE105=CINE105;window.EX105=EX105;
const SWC105={slayer:[0xff4040,'#2a0a0c','#5a0e14'],dweller:[0xa070ff,'#120a26','#3a1a6a'],destroyer:[0xff5a2a,'#260a06','#7a1a0c'],katana:[0x6ad0ff,'#06121e','#0e3a5a']};
function clover105(n,bg,fg){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,256,256);x.strokeStyle=fg;x.lineWidth=5;x.strokeRect(14,14,228,228);x.lineWidth=2;x.strokeRect(24,24,208,208);
 x.save();x.translate(128,128);x.fillStyle=fg;for(let k=0;k<n;k++){x.save();x.rotate(k/n*Math.PI*2);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-34,-20,-40,-62,-16,-70);x.bezierCurveTo(-4,-74,0,-62,0,-56);x.bezierCurveTo(0,-62,4,-74,16,-70);x.bezierCurveTo(40,-62,34,-20,0,0);x.fill();x.restore()}x.restore();
 for(const [a,b] of[[30,30],[226,30],[30,226],[226,226]]){x.beginPath();x.arc(a,b,6,0,6.283);x.fill()}const t=new T.CanvasTexture(c);return t}
function rad105(col,vert){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),cc=new T.Color(col),rgb=Math.round(cc.r*255)+','+Math.round(cc.g*255)+','+Math.round(cc.b*255);let g;if(vert){g=x.createLinearGradient(0,0,0,128);g.addColorStop(0,'rgba('+rgb+',0)');g.addColorStop(.7,'rgba('+rgb+',.55)');g.addColorStop(1,'rgba('+rgb+',1)');x.fillStyle=g;x.fillRect(0,0,128,128);const h=x.createLinearGradient(0,0,128,0);}else{g=x.createRadialGradient(64,64,0,64,64,64);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba('+rgb+',.8)');g.addColorStop(1,'rgba('+rgb+',0)');x.fillStyle=g;x.fillRect(0,0,128,128)}return new T.CanvasTexture(c)}
function cine105Build(k){const sc=new T.Scene(),col=SWC105[k]||SWC105.slayer;
 {const c=document.createElement('canvas');c.width=64;c.height=256;const x=c.getContext('2d'),gr=x.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#000');gr.addColorStop(.55,col[1]);gr.addColorStop(1,col[2]);x.fillStyle=gr;x.fillRect(0,0,64,256);sc.background=new T.CanvasTexture(c)}
 sc.add(new T.AmbientLight(0xffffff,.55));const dl=new T.DirectionalLight(0xffffff,.9);dl.position.set(3,6,5);sc.add(dl);const pl=new T.PointLight(col[0],0,9);pl.position.set(0,2.4,1.2);const rim=new T.DirectionalLight(col[0],.8);rim.position.set(-4,3,-4);sc.add(rim);sc.add(pl);
 const gid=P.g&&GR[P.g.id]?P.g.id:'anti',G=GR[gid]||{c:0x2b2b2b,l:5},cv=G.c||0x2b2b2b;const cc=new T.Color(cv),hsl={};cc.getHSL(hsl);const fg=hsl.l<.25?'#c8a24a':'#2a1a06';
 const tex=clover105(G.l||4,'#'+cc.getHexString(),fg);const book=new T.Group(),W=1.3,H=1.7,TH=.07;
 const cm=new T.MeshLambertMaterial({color:cv}),fm=new T.MeshLambertMaterial({map:tex}),pm=new T.MeshLambertMaterial({color:0xd8ccb0});
 const back=new T.Mesh(new T.BoxGeometry(W,TH,H),[cm,cm,fm,cm,cm,cm]);back.position.set(W/2,0,0);const pages=new T.Mesh(new T.BoxGeometry(W*.94,.22,H*.94),pm);pages.position.set(W/2,TH/2+.11,0);
 const lp=new T.Mesh(new T.BoxGeometry(W*.94,.2,H*.94),pm);lp.position.set(-W/2,.1,0);lp.visible=false;
 const hinge=new T.Group();hinge.position.set(0,TH/2+.22,0);const front=new T.Mesh(new T.BoxGeometry(W,TH,H),[cm,cm,fm,cm,cm,cm]);front.position.set(W/2,TH/2,0);hinge.add(front);const spine=new T.Mesh(new T.BoxGeometry(.1,.36,H),cm);spine.position.set(0,.15,0);
 const inner=new T.Group();inner.add(back,pages,hinge,spine,lp);inner.position.x=-W/2;book.add(inner);sc.add(book);
 // brilho das páginas
 const glow=new T.Mesh(new T.PlaneGeometry(4.2,4.2),new T.MeshBasicMaterial({map:rad105(col[0]),transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false}));glow.rotation.x=-Math.PI/2;glow.position.y=.42;book.add(glow);
 const beam=new T.Mesh(new T.CylinderGeometry(.12,.42,6,20,1,true),new T.MeshBasicMaterial({map:rad105(col[0],1),transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));beam.position.y=3.3;book.add(beam);
 // espada (o mesmo modelo da mão), saindo de dentro das páginas com a ponta para baixo
 let sw=null;try{sw=k=='slayer'&&typeof makeDemonSword=='function'?makeDemonSword():wpnModel(k);sw.visible=true;sw.rotation.set(0,0,0);sw.position.set(0,0,0)}catch(e){}if(!sw){sw=new T.Group();sw.add(new T.Mesh(new T.BoxGeometry(.12,2.6,.4),new T.MeshLambertMaterial({color:0x2a2a2e})))}
 const sh=new T.Group(),swg=new T.Group();sh.add(sw);swg.add(sh);book.add(swg);const clip=new T.Plane(new T.Vector3(0,1,0),-.32);const fit={ok:false,L:2.4,s0:sw.scale.clone()};
 const fitNow=()=>{sw.scale.copy(fit.s0);sw.rotation.set(0,0,0);sw.position.set(0,0,0);sh.updateMatrixWorld(true);const b=new T.Box3().setFromObject(sw);if(b.isEmpty())return false;const sz=new T.Vector3();b.getSize(sz);const L=Math.max(sz.x,sz.y,sz.z);if(!(L>0))return false;
  sw.scale.multiplyScalar(2.4/L);sw.rotation.z=Math.PI;sw.updateMatrixWorld(true);const sh0=sh.position.y;sh.position.y=0;sh.updateMatrixWorld(true);const b2=new T.Box3().setFromObject(sw),c=new T.Vector3();b2.getCenter(c);
  const inv=new T.Matrix4().copy(sh.matrixWorld).invert();const mx=new T.Vector3(c.x,b2.max.y,c.z).applyMatrix4(inv),mn=new T.Vector3(c.x,b2.min.y,c.z).applyMatrix4(inv);sw.position.x-=mx.x;sw.position.z-=mx.z;sw.position.y-=mx.y;fit.L=mx.y-mn.y;sh.position.y=sh0;fit.ok=true;return true};
 const clipAll=()=>sw.traverse(o=>{if(o.material&&!o.userData.c105){o.userData.c105=1;o.material=Array.isArray(o.material)?o.material.map(m=>{const c=m.clone();c.clippingPlanes=[clip];return c}):(()=>{const c=o.material.clone();c.clippingPlanes=[clip];return c})()}});
 // partículas
 const N=180,pg=new T.BufferGeometry(),pp=new Float32Array(N*3),pd=[];for(let i=0;i<N;i++){const a=Math.random()*6.283,r=1+Math.random()*3.4,y=Math.random()*5-1;pp[i*3]=Math.cos(a)*r;pp[i*3+1]=y;pp[i*3+2]=Math.sin(a)*r;pd.push([a,r,y,.3+Math.random()*.8])}pg.setAttribute('position',new T.BufferAttribute(pp,3));
 const pts=new T.Points(pg,new T.PointsMaterial({color:col[0],size:.07,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}));sc.add(pts);
 const cam2=new T.PerspectiveCamera(42,(innerWidth||1)/(innerHeight||1),.05,80);return{sc,cam2,book,inner,hinge,lp,glow,beam,sh,swg,pts,pd,pl,clip,sw,fit,fitNow,clipAll}}
function cine105(k,mode){if(CINE105.on||!WPN82[k]||WPN82[k].t!='espada')return;try{closeOv()}catch(e){}let B;try{B=cine105Build(k)}catch(e){console.warn('cine105',e);return}
 const wasRun=run;run=false;CINE105.on=true;CINE105.S=B.sc;CINE105.cam=B.cam2;const oldClip=R.localClippingEnabled;R.localClippingEnabled=true;document.body.classList.add('cineon');
 const ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:57;pointer-events:auto;cursor:pointer';ov.innerHTML='<div style="position:absolute;left:0;right:0;top:9%;text-align:center;opacity:0;transition:opacity .6s" id="cn105t"><div style="font:700 clamp(11px,2vw,15px) Cinzel,Georgia,serif;letter-spacing:.4em;color:#f0cf72;text-shadow:0 2px 6px #000">'+(mode=='nova'?'NOVA ESPADA':'ESPADA EQUIPADA')+'</div><div style="font:900 clamp(24px,5.6vw,52px) Cinzel,Georgia,serif;color:#fff6dc;letter-spacing:.06em;text-shadow:0 3px 0 #2a1a06,0 0 24px rgba(0,0,0,.8)">'+WPN82[k].n.toUpperCase()+'</div></div><div style="position:absolute;right:14px;bottom:12px;font:700 12px system-ui;color:#ffffffaa">Toque para pular ▸</div>';document.body.appendChild(ov);
 const t0=performance.now();let done=false;const end=()=>{if(done)return;done=true;CINE105.on=false;R.localClippingEnabled=oldClip;document.body.classList.remove('cineon');ov.remove();run=wasRun||true;try{B.sc.traverse(o=>{if(o.geometry)o.geometry.dispose()})}catch(e){}
  try{if(P.g&&P.g.id=='anti'){P.sword=true;if(typeof addSword=='function')addSword();if(window.sword)sword.visible=true;fxp({x:P.x,y:1.6,z:P.z,c:(SWC105[k]||SWC105.slayer)[0],n:24,sp:4,sz:.3,life:.7,g:4,up:4})}}catch(e){}};
 ov.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();end()});
 const ez=t=>t<0?0:t>1?1:t*t*(3-2*t);const DUR=5.2;
 const step=()=>{if(done)return;const t=(performance.now()-t0)/1000;if(t>DUR){end();return}
  // 0-1.2: livro fechado girando no ar · 1.2-1.9: deita e abre · 1.9-2.4: luz · 2.4-3.6: espada sobe · 3.6-5.2: nome e brilho
  const a1=ez(t/1.2),a2=ez((t-1.2)/.7),a3=ez((t-1.9)/.5),a4=ez((t-2.4)/1.2);
  B.book.position.y=.2+Math.sin(t*2)*.06+(1-a2)*1.3;B.book.rotation.y=(1-a2)*Math.sin(t*1.4)*.5;B.book.rotation.z=0;B.book.rotation.x=(1-a2)*1.25;B.book.scale.setScalar(.7+.3*a1);B.sw.visible=t>1.95;
  B.hinge.rotation.z=a2*Math.PI*.98;B.lp.visible=a2>.5;
  B.glow.material.opacity=a3*.75*(1+Math.sin(t*9)*.1);B.beam.material.opacity=a3*(1-a4*.6)*.55;B.beam.scale.set(1+a4*.6,1,1+a4*.6);B.pl.intensity=a3*1.1;
  if(!B.fit.ok)B.fitNow();B.clipAll();B.clip.constant=-(B.book.position.y+.26);B.sh.position.y=.3+a4*(B.fit.L+.05);B.swg.rotation.y=a4*Math.PI*2*(1-ez((t-3.6)/1))+Math.sin(t*1.3)*.04;
  const P3=B.pts.geometry.attributes.position;for(let i=0;i<B.pd.length;i++){const d=B.pd[i];d[0]+=.016*d[3]*(1+a3*2);d[2]+=.01*d[3]*(1+a4*3);if(d[2]>4.5)d[2]=-1;const r=d[1]*(1-a3*.25);P3.setXYZ(i,Math.cos(d[0])*r,d[2],Math.sin(d[0])*r)}P3.needsUpdate=true;
  const ca=t*.2+.5,cr=6.2-ez(t/3)*1.0-a4*.2,cy=1.5+a4*.7;B.cam2.aspect=(innerWidth||1)/(innerHeight||1);B.cam2.updateProjectionMatrix();B.cam2.position.set(Math.sin(ca)*cr,cy+.6,Math.cos(ca)*cr);B.cam2.lookAt(0,.55+a4*.95,0);
  if(t>3.4){const e=document.getElementById('cn105t');if(e)e.style.opacity=1}
  requestAnimationFrame(step)};requestAnimationFrame(step)}
// equipar uma espada (no inventário) ou ganhar uma espada nova toca a cena
{const _we=wpnEquip;wpnEquip=function(k){const v=v82S(),before=v.sw;const r=_we.apply(this,arguments);try{if(WPN82[k]&&WPN82[k].t=='espada'&&wpnHas(k)&&v.sw===k)setTimeout(()=>cine105(k,'eq'),60)}catch(e){}return r}}
{const _eg=evGive;evGive=function(k,msg){const r=_eg.apply(this,arguments);try{if(WPN82[k]&&WPN82[k].t=='espada')setTimeout(()=>cine105(k,'nova'),900)}catch(e){}return r}}

