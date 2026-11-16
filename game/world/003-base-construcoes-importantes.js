// ---------- construções importantes ----------
function hSmithy(o){const [g,D,r]=hStone(o),w=o.w||5.2,d=o.d||4.6;const sx=w/2+1.9;for(const [x,z] of[[sx-1.5,d/2],[sx+1.5,d/2],[sx-1.5,-d/2+.5],[sx+1.5,-d/2+.5]])bp(g,BX(.22,2.6,.22),0x5a3a22,x,1.3,z);const rf=bp(g,BX(3.6,.15,d+.2),o.roof||0x6e4a2a,sx,2.75,0,1);rf.rotation.z=-.18;
 bp(D,BX(1.4,1,1.2),0x6a6460,sx+.8,.5,-d/4);bp(D,BX(1,.1,.8),0xff7a20,sx+.8,1.02,-d/4,0,1);bp(D,BX(.9,.3,.4),0x2a2a2e,sx-.6,.75,.6);bp(D,BX(.4,.5,.3),0x3a3a3e,sx-.6,.35,.6);bp(D,CY(.05,.05,.7,6),0x9a9aa0,sx-.3,.95,.9);bp(D,CY(.4,.4,.5,8),0x4a6a8a,sx+1.3,.25,1.2);
 for(let k=0;k<3;k++){const m=bp(D,BX(.08,1.3,.04),0xb8bcc8,sx-1.6+k*.3,1,d/2-.1);m.rotation.z=.08}return[g,D,r+1.2]}
function hShop(o){const [g,D,r]=hMerchant(Object.assign({},o,{aw:[0x2a4a8a,0xe8dcc0],sign:0x3a5a9a,nostall:1}));const w=o.w||6,d=o.d||4.8;
 bp(D,BX(1.6,.1,.4),0x5a3a22,-w*.32,1.7,d/2+.3);for(let k=0;k<3;k++){const x=-w*.32-.5+k*.5;bp(D,BX(.08,1.1,.03),0xc8ccd8,x,1.15,d/2+.42);bp(D,BX(.3,.06,.06),0x6a4a2a,x,.62,d/2+.42)}bp(D,CY(.42,.42,.08,10),0x8a1f1f,w*.42,2.25,d/2+1.03).rotation.x=Math.PI/2;return[g,D,r]}
function hTavern(o){const [g,D,r]=hTwo(Object.assign({},o,{w:o.w||7,d:o.d||5.4}));const w=o.w||7,d=o.d||5.4;bp(D,BX(.1,.1,1.1),0x2a2a2e,-w*.42,2.4,d/2+.55);bp(D,CY(.3,.25,.5,8),0xd8a040,-w*.42,1.95,d/2+1.05);bp(D,BX(.5,.12,.06),0xffffff,-w*.42,2.25,d/2+1.05);
 for(let k=0;k<2;k++){const x=-1.8+k*3.4,z=d/2+3;bp(D,CY(.55,.55,.08,10),0x9a6a3e,x,.85,z);bp(D,CY(.08,.1,.85,6),0x5a3a22,x,.42,z);for(const s of[-1,1])bp(D,CY(.22,.22,.45,8),0x7a5a36,x+s*.9,.22,z);bp(D,CY(.09,.08,.22,6),0xd8a040,x+.2,1,z)}barrel(D,w/2+.6,1.5);barrel(D,w/2+.6,.6);barrel(D,w/2+1.3,1.05,.9);lantern(D,w*.2,d/2+.2,1);return[g,D,r]}
function hLibrary(o){const w=o.w||7,d=o.d||5.6,H=4.6,g=new T.Group(),D=new T.Group();bp(g,BX(w,H,d),0xd8d0c0,0,H/2,0,1);gable(g,w,d,2.2,0x3e5f8a,H,0xd8d0c0,.5);bp(g,CY(1.3,1.3,2.2,10),0xc8c0b0,0,H+2.2,-d*.1,1);bp(g,CN(1.5,1.6,10),0x3e5f8a,0,H+4.1,-d*.1,1);
 for(let k=0;k<4;k++)bp(g,CY(.22,.26,H-.4,8),0xf0ebe0,-w*.375+k*w*.25,H/2,d/2+.25,1);door(D,0,d/2,0,1.3,2.6,0x5a3a20,0xd8b040);for(const s of[-1,1])win(D,s*w*.36,2.4,d/2+.02,0,.9,2,1,0xf0ebe0);bp(D,BX(1.6,.5,.1),0x3e5f8a,0,3.5,d/2+.08);bp(D,BX(.9,.3,.12),0xf0e6d2,0,3.5,d/2+.1);
 for(const s of[-1,1])bp(D,BX(.9,.06,.6),0x8a1f1f,s*.25,3.5,d/2+.16);bench(D,-2.3,d/2+2.4,Math.PI);bench(D,2.3,d/2+2.4,Math.PI);return[g,D,Math.max(w,d)*.72]}
function hTemple(o){const w=o.w||6,d=o.d||6,H=4,g=new T.Group(),D=new T.Group();for(let k=0;k<3;k++)bp(g,BX(w+1.6-k*.5,.25,d+1.6-k*.5),0xd8d0c0,0,.12+k*.25,0,1);bp(g,BX(w,H,d),0xf0ebe0,0,.75+H/2,0,1);
 for(const sx of[-1,1])for(const sz of[-1,1])bp(g,CY(.3,.34,H,10),0xffffff,sx*(w/2+.15),.75+H/2,sz*(d/2+.15),1);gable(g,w+.4,d+.4,1.6,0xc8a040,.75+H,0xf0ebe0,.4);
 door(D,0,d/2,0,1.4,2.8,0x8a6a2a,0xd8b040);bp(D,CY(.5,.5,.1,12),0xd8b040,0,.75+H+.6,d/2+.45).rotation.x=Math.PI/2;for(let k=0;k<3;k++){const a=k/3*6.28;bp(D,SP(.22,6,4),0x3e8f5a,Math.cos(a)*.3,.75+H+.6+Math.sin(a)*.3,d/2+.52)}
 for(const s of[-1,1]){bp(D,CY(.35,.45,.8,8),0xb8b2a6,s*2.4,.4,d/2+2.2);bp(D,SP(.25,6,4),0xffb040,s*2.4,1,d/2+2.2,0,1);flowers(D,s*3.4,d/2+1.4,6,[0xffffff,0xffe066])}return[g,D,Math.max(w,d)*.75]}
const HOUSE={cottage:hCottage,stone:hStone,merchant:hMerchant,two:hTwo,rich:hRich,ruin:hRuin,smithy:hSmithy,shop:hShop,tavern:hTavern,library:hLibrary,temple:hTemple};HOUSE._old={two:hTwo,merchant:hMerchant,rich:hRich};for(const k of['two','merchant','rich'])HOUSE[k]=o=>{const h=Math.abs(Math.round((o.w||5)*997+(o.wall||0)%9973));return hTudor(Object.assign({},o,{w:Math.max(4.8,Math.min(6.4,o.w||5.4)),d:Math.max(4.6,Math.min(5.6,o.d||5)),fl3:k=='two'?h%2:k=='rich'?1:0,rh:3.1+(h%9)*.12,sign:k=='merchant'?[0x3b4aa0,0x8a1f1f,0x2f6a3a][h%3]:0}))};
// coloca uma construção: grupo principal + grupo de detalhes (LOD), devolve o raio de colisão
function placeHouse(type,x,z,ry,o,sc){const [g,D,r]=HOUSE[type](o);D.userData.lod='d';for(const q of[g,D]){q.rotation.y=ry;if(sc&&sc!=1)q.scale.setScalar(sc);put(q,x,z)}return r*(sc||1)}
// escolhe tipos variados sem repetir o anterior
function housePicker(pool){let last=null;return()=>{let t,k=0;do{t=pool[Math.floor(rnd()*pool.length)];k++}while(t===last&&k<20);last=t;return t}}
function hStyle(P2){const p=a=>a[Math.floor(rnd()*a.length)];return{wall:p(P2.wall),stone:p(P2.stone),roof:p(P2.roof),roofD:p(P2.roofD||P2.roof),trim:P2.trim||0x5a3a22,door:p(P2.door||[0x6b4426,0x5a3a20,0x7a4a2a,0x3e5f8a,0x8a1f1f]),sh:rnd()<.5?p(P2.sh||[0x3e6f3a,0x3e5f8a,0x8a1f1f]):0,lit:rnd()<.55?1:0,lit2:rnd()<.3?1:0}}
const PAL={
 hage:{wall:[0xb08458,0xa47a4e,0xc09468,0xd8c49a],stone:[0x9a948a,0xa8a296,0x8f897e],roof:[0x8a5a3a,0x7a4a2e,0x9a6a3a,0xa0522d],roofD:[0x5a4a3e,0x4a4048],trim:0x5a3a22},
 cap:{wall:[0xe8dcc0,0xd9cbb0,0xf0e6d2,0xe2d4bc,0xf0d8c0],stone:[0xb8b2a6,0xa8a296,0xc8c2b4],roof:[0xc8582f,0xb04a3a,0x2f7a6a,0x3e5f8a,0xa8452c],roofD:[0x3a3e48,0x2f4a5a,0x4a3a3e],trim:0x6a4a2a},
 sossy:{wall:[0xe8dcc0,0xd9c69a,0xf0e2c0],stone:[0xb8a888,0xa89878],roof:[0xc8582f,0xd9773a,0xb04a3a],trim:0x7a5a36},
 nairn:{wall:[0x8a6a4a,0x7a5a3a,0x9a7a52],stone:[0x7a7a6e,0x6a6a60],roof:[0x3e6f3a,0x2f5a2f,0x4f7f3a],roofD:[0x2f4a2f,0x3a4a3a],trim:0x3a2a1a},
 kiten:{wall:[0xd9cbb0,0xc8b89a,0xe2d4bc],stone:[0xb8b2a6,0x9a9aa6,0xa8a8b4],roof:[0x2f4a7a,0x3b4aa0,0x2f7a6a],roofD:[0x2a3a5a,0x3a3e48],trim:0x4a3a2a}};
// ---------- vegetação variada ----------
function tPine(par,x,z,s){s=s||1;bp(par,CY(.22*s,.32*s,1.6*s,6),0x5a3d22,x,.8*s,z,1);for(let k=0;k<3;k++)bp(par,CN((1.7-k*.42)*s,(2.2-k*.3)*s,7),k%2?0x2a7f45:0x1f6a3a,x,(2+k*1.15)*s,z,k==0)}
function tOak(par,x,z,s,c){s=s||1;c=c||0x3aa05a;bp(par,CY(.25*s,.38*s,2.2*s,6),0x5a3d22,x,1.1*s,z,1);bp(par,IC(1.55*s,0),c,x,3.2*s,z,1,0,1,.92,1.05);bp(par,IC(1.05*s,0),0x4cbc6a,x+.9*s,3.7*s,z+.3*s);bp(par,IC(.95*s,0),0x34905a,x-.8*s,3*s,z-.4*s)}
function tBirch(par,x,z,s){s=s||1;bp(par,CY(.16*s,.2*s,3.4*s,6),0xece8dc,x,1.7*s,z,1);for(const y of[.9,1.8,2.6])bp(par,CYO(.17*s,.08,6),0x2a2a2a,x,y*s,z);bp(par,IC(1.1*s,0),0x8ad06a,x,3.9*s,z,1,0,.85,1.4,.85)}
function tBush(par,x,z,s,c){s=s||1;bp(par,IC(.75*s,0),c||0x3f8f3e,x,.45*s,z,0,0,1.2,.75,1);bp(par,IC(.5*s,0),0x4fa04a,x+.45*s,.4*s,z+.2*s)}
function tRocks(par,x,z,s){s=s||1;bp(par,DO(.6*s),0x8a8a96,x,.35*s,z,1);bp(par,DO(.35*s),0x9a9aa4,x+.7*s,.2*s,z+.3*s)}
function tLog(par,x,z,ry){const m=bp(par,CY(.28,.28,2.2,7),0x6a4a2a,x,.28,z,1);m.rotation.set(Math.PI/2,ry,0);for(const s of[-1,1]){const e=bp(par,CY(.24,.24,.04,7),0xc8a070,x+Math.sin(ry)*s*1.11,.28,z+Math.cos(ry)*s*1.11);e.rotation.set(Math.PI/2,ry,0)}}
function tShroom(par,x,z){for(let k=0;k<3;k++){const xx=x+(k-1)*.3,zz=z+(k%2)*.25,h=.18+k*.06;bp(par,CY(.04,.05,h,5),0xf0e6d2,xx,h/2,zz);bp(par,SP(.12+k*.02,6,3),k%2?0xc8382f:0xd8a050,xx,h,zz,0,0,1,.6,1)}}
function tStump(par,x,z){bp(par,CY(.4,.5,.5,7),0x6a4a2a,x,.25,z,1);bp(par,CY(.36,.36,.03,7),0xc8a070,x,.51,z)}
// planta natureza num ponto: tipo escolhido conforme o bioma
function natureAt(x,z,bio){const g=new T.Group(),k=rnd(),s=.8+rnd()*.5;
 if(bio=='forest'){if(k<.45)tPine(g,0,0,s*1.15);else if(k<.6)tOak(g,0,0,s,0x2f8a4a);else if(k<.72)tBush(g,0,0,s);else if(k<.8)tShroom(g,0,0);else if(k<.88)tLog(g,0,0,rnd()*3);else if(k<.94)tStump(g,0,0);else tRocks(g,0,0,s)}
 else if(bio=='field'){if(k<.25)tOak(g,0,0,s);else if(k<.4)tBirch(g,0,0,s);else if(k<.6)tBush(g,0,0,s);else if(k<.78)flowers(g,0,0,6,[0xff7aa8,0xffe066,0xffffff,0xc060ff]);else if(k<.9)tRocks(g,0,0,s);else tStump(g,0,0)}
 else{if(k<.3)tOak(g,0,0,s);else if(k<.48)tPine(g,0,0,s);else if(k<.58)tBirch(g,0,0,s);else if(k<.7)tBush(g,0,0,s);else if(k<.8)tRocks(g,0,0,s);else if(k<.9)flowers(g,0,0,5,[0xff7aa8,0xffe066,0xffffff]);else if(k<.95)tLog(g,0,0,rnd()*3);else tShroom(g,0,0)}
 g.rotation.y=rnd()*6.28;if(g.children.length&&Math.max(...g.children.map(c=>c.scale.y*(c.geometry.parameters&&c.geometry.parameters.height||1)))<1.5)g.userData.lod='d';put(g,x,z);return g}
// áreas que a vegetação e a grama devem evitar (lago, ruínas, casas novas fora das vilas)
const CLEAR=[{x:72,z:-62,r:11},{x:58,z:48,r:10},{x:96,z:-88,r:6},{x:-62,z:62,r:6}];{const cr=[[75,-53],[76,-40],[73,-24],[75,-12],[79,4],[82,20]];for(let i=0;i<cr.length-1;i++)CLEAR.push({x:(cr[i][0]+cr[i+1][0])/2,z:(cr[i][1]+cr[i+1][1])/2,r:Math.hypot(cr[i+1][0]-cr[i][0],cr[i+1][1]-cr[i][1])/2+2.5})}const clearAt=(x,z,m)=>CLEAR.some(c=>Math.hypot(x-c.x,z-c.z)<c.r+(m||0));
// caminho natural de terra/pedra (faixas curtas levemente curvas, com pedrinhas nas bordas)
function path(pts,w,c,edge){for(let i=0;i<pts.length-1;i++){const [x1,z1]=pts[i],[x2,z2]=pts[i+1],L=Math.hypot(x2-x1,z2-z1);const g=new T.Group(),p=new T.Mesh(BX(w,.02,L+w*.6),WM(c));p.receiveShadow=true;g.add(p);g.rotation.y=Math.atan2(x2-x1,z2-z1);g.position.y=.035+i%2*.002;put(g,(x1+x2)/2,(z1+z2)/2);
  if(edge){const E=new T.Group();E.userData.lod='d';for(let k=0;k<Math.floor(L/2.2);k++)for(const s of[-1,1]){const t=(k+.5)/Math.floor(L/2.2);bp(E,BX(.3,.14,.26),edge,(x1+(x2-x1)*t)-(z2-z1)/L*s*(w/2+.2)-((x1+x2)/2),.08,(z1+(z2-z1)*t)+(x2-x1)/L*s*(w/2+.2)-((z1+z2)/2))}put(E,(x1+x2)/2,(z1+z2)/2)}}}
function curvy(x1,z1,x2,z2,n,amp,seed){const P2=[];for(let i=0;i<=n;i++){const t=i/n,o=Math.sin(t*Math.PI)*Math.sin(seed+t*5)*amp,L=Math.hypot(x2-x1,z2-z1)||1;P2.push([x1+(x2-x1)*t-(z2-z1)/L*o,z1+(z2-z1)*t+(x2-x1)/L*o])}return P2}
// decoração de praça e identidade de cada vila (sem colisão: só enfeite, some de longe pelo LOD)
function villageDeco(v,st){const D=new T.Group();D.userData.lod='d';const P2=(a,R)=>[Math.cos(a)*R,Math.sin(a)*R];
 for(let k=0;k<4;k++){const [x,z]=P2(k*1.5708+.785,9.5);lantern(D,x,z)}for(let k=0;k<3;k++){const a=k*2.094+.4,[x,z]=P2(a,7.2);bench(D,x,z,-a-Math.PI/2)}for(let k=0;k<4;k++){const [x,z]=P2(k*1.5708+.2,5.2);flowers(D,x,z,6,st.fl||[0xff7aa8,0xffe066,0xffffff])}
 if(st.kind=='farm'){for(let k=0;k<5;k++){const [x,z]=P2(k*1.26+.3,v.r-4.5);const m=bp(D,CY(.55,.55,1.1,10),0xd8b85a,x,.55,z,1);m.rotation.set(0,k,Math.PI/2)}const cart=new T.Group();bp(cart,BX(1.8,.4,1.1),0x8a5a32,0,.75,0);for(const s of[-1,1]){const w=bp(cart,CY(.45,.45,.1,10),0x5a3a22,0,.45,s*.62);w.rotation.x=Math.PI/2}for(let k=0;k<4;k++)bp(cart,SP(.2,6,4),0xe84a3a,-.5+k*.33,1.05,0);cart.position.set(-v.r+6,0,3);D.add(cart);for(let k=0;k<3;k++)sack(D,-v.r+7.5+k*.5,4.6)}
 if(st.kind=='forest'){for(let k=0;k<6;k++){const [x,z]=P2(k*1.05+.5,v.r-3.5);if(k%2)tShroom(D,x,z);else tStump(D,x,z)}for(let k=0;k<3;k++){const [x,z]=P2(k*2.1+1.2,v.r-5);tLog(D,x,z,k)}for(let k=0;k<4;k++){const [x,z]=P2(k*1.57+1,11.5);bp(D,CY(.05,.05,1.6,5),0x3a2a1a,x,.8,z);bp(D,SP(.18,6,4),0x9dff6a,x,1.7,z,0,1)}}
 if(st.kind=='fort'){for(let k=0;k<6;k++){const a=k*1.047+.5,[x,z]=P2(a,v.r-3);bp(D,CY(.08,.08,5,6),0x5a3d22,x,2.5,z);const f=bp(D,BX(1.2,1.8,.06),k%2?0x3b4aa0:0xe8dcc0,x+Math.cos(a+1.57)*.62,4.1,z+Math.sin(a+1.57)*.62);f.rotation.y=-a}for(let k=0;k<4;k++){const [x,z]=P2(k*1.5708+.785,7);bp(D,BX(1.4,.6,1.4),0xb8b2a6,x,.3,z);bp(D,IC(.55,0),0x3f8f3e,x,.85,z)}for(let k=0;k<2;k++){const [x,z]=P2(k*3.14+2.4,v.r-6);const r2=new T.Group();for(let j=0;j<3;j++){const sw=bp(r2,BX(.08,1.2,.04),0xc8ccd8,-.4+j*.4,.8,0);sw.rotation.z=.1}bp(r2,BX(1.4,.1,.3),0x5a3a22,0,1.3,0);bp(r2,BX(1.4,.1,.3),0x5a3a22,0,.3,0);r2.position.set(x,0,z);r2.rotation.y=k*2;D.add(r2)}}
 put(D,v.x,v.z)}

// ---------- Vilas do Reino (fácil de ampliar: adicione uma entrada e uma chamada a buildVillage) ----------
const VILS=[
 {id:'hage',n:'Vila Hage',s:'Reino Esquecido',x:0,z:0,r:34,lv:[1,5]},
 {id:'sossy',n:'Vila Sossy',s:'Reino Comum',x:190,z:-60,r:26,lv:[18,30]},
 {id:'nairn',n:'Vila Nairn',s:'Orla da Floresta das Bruxas',x:-230,z:-150,r:24,lv:[33,42]},
 {id:'kiten',n:'Cidade de Kiten',s:'Fronteira de Diamond',x:-210,z:120,r:30,lv:[43,50]}];
const nearVil=(x,z,m)=>VILS.some(v=>Math.hypot(x-v.x,z-v.z)<v.r+(m||0));
const ROADS=[];
const SOLG={n:-1,c:{}},SOLE=[];
function solNear(x,z){if(SOLG.n!==SOL.length){SOLG.n=SOL.length;SOLG.c={};for(const o of SOL){const rx=(o.r||o.hx||1)+1,rz=(o.r||o.hz||1)+1;for(let i=Math.floor((o.x-rx)/20);i<=Math.floor((o.x+rx)/20);i++)for(let j=Math.floor((o.z-rz)/20);j<=Math.floor((o.z+rz)/20);j++)(SOLG.c[i+','+j]=SOLG.c[i+','+j]||[]).push(o)}}return SOLG.c[Math.floor(x/20)+','+Math.floor(z/20)]||SOLE}
function nearRoad(x,z,m){for(const r of ROADS){const dx=r[2]-r[0],dz=r[3]-r[1],L2=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-r[0])*dx+(z-r[1])*dz)/L2));if(Math.hypot(x-(r[0]+dx*t),z-(r[1]+dz*t))<(m||6))return true}return false}
// Capital de Clover
const CZ=-402,TC={x:-52,z:38};
function person(o){
 const sk=o.skin||0xf1c9a0,w=o.w||1,mT=mat(o.top||0x888888),mP=mat(o.pants||0x333344),mS=mat(sk),mH=mat(o.hair||0x222222),mC=mat(o.cape||0x7a1f1f),mSh=mat(o.shoe||0x3a2418),mE=mat(o.eye||0x2a6fd0),mW=mat(0xffffff),mD=mat(0x222222);
 const g=new T.Group(),root=new T.Group();root.scale.setScalar(o.h||1);g.add(root);
 const sm=(geo,m,out,x,y,z,par)=>{const e=new T.Mesh(geo,m);e.position.set(x||0,y||0,z||0);if(out){e.castShadow=true;const b=new T.Mesh(geo,olm);b.scale.setScalar(1.07);e.add(b)}(par||root).add(e);return e},
 G=(x,y,z,par)=>{const q=new T.Group();q.position.set(x,y,z);(par||root).add(q);return q};
 sm(new T.CylinderGeometry(.3*w,.31*w,.26,14),mP,1,0,.95,0);
 const ch=sm(new T.CylinderGeometry(.34*w,.27*w,.6,14),mT,1,0,1.36,0);ch.scale.z=.78;
 sm(new T.CylinderGeometry(.08,.09,.14,8),mS,0,0,1.74,0);
 const hd=sm(new T.SphereGeometry(.24,18,14),mS,1,0,1.95,0);hd.scale.y=1.1;
 const eyes=[];
 for(const s of[-1,1]){const e=sm(new T.SphereGeometry(.062,10,8),mW,0,s*.085,1.96,.195);e.scale.set(1,1.3,.45);const i=sm(new T.SphereGeometry(.04,10,8),mE,0,s*.085,1.955,.212);i.scale.set(1,1.3,.4);eyes.push(i);sm(new T.SphereGeometry(.013,6,6),mW,0,s*.085+.012,1.978,.222);const b=sm(new T.BoxGeometry(.09,.018,.012),mH,0,s*.085,2.05,.205);b.rotation.z=-s*.15}
 sm(new T.BoxGeometry(.05,.01,.01),mat(0x7a3a2a),0,0,1.855,.225);
 const hs=o.hs==null?1:o.hs,cap=sm(new T.SphereGeometry(.26,16,12,0,6.3,0,1.8),mH,0,0,1.97,-.02);cap.rotation.x=-.25;
 if(hs==0){for(let i=0;i<9;i++){const a=i/9*6.28,c=sm(new T.ConeGeometry(.075,.3,5),mH,0,Math.sin(a)*.17,2.2,Math.cos(a)*.17-.03);c.rotation.set(Math.cos(a)*.7,0,-Math.sin(a)*.7)}sm(new T.ConeGeometry(.09,.4,5),mH,0,0,2.3,0)}
 else if(hs==1){const f=sm(new T.BoxGeometry(.3,.07,.1),mH,0,0,2.13,.17);f.rotation.z=.15}
 else if(hs==2){const b=sm(new T.CylinderGeometry(.2,.13,.6,10),mH,0,0,1.75,-.13);b.scale.z=.6}
 else if(hs==3){sm(new T.SphereGeometry(.1,8,8),mH,0,0,2.2,-.2);sm(new T.CylinderGeometry(.06,.03,.4,6),mH,0,0,1.85,-.24)}
 else if(hs==4){const mh=mat(o.hat||0x6a4a2a);sm(new T.CylinderGeometry(.36,.36,.03,18),mh,1,0,2.13,0);sm(new T.CylinderGeometry(.19,.22,.2,12),mh,1,0,2.24,0)}
 if(o.belt)sm(new T.CylinderGeometry(.325*w,.325*w,.08,14),mD,1,0,1.02,0);
 if(o.scarf){const t=sm(new T.TorusGeometry(.15,.055,6,12),mat(o.scarf),0,0,1.71,0);t.rotation.x=Math.PI/2}
 if(o.coat)sm(new T.CylinderGeometry(.3*w,.5*w,.62,16),mT,1,0,.68,0);
 let cp=null;if(o.cape)cp=sm(new T.BoxGeometry(.62*w,1.0,.06),mC,1,0,1.3,-.25);
 const legs=[],arms=[];
 for(const s of[-1,1]){
  const hip=G(s*.14*w,.92,0);sm(new T.CylinderGeometry(.12,.09,.46,10),mP,1,0,-.23,0,hip);
  const kn=G(0,-.46,0,hip);sm(new T.CylinderGeometry(.09,.07,.44,10),mP,1,0,-.22,0,kn);
  sm(new T.BoxGeometry(.14,.09,.3),mSh,1,0,-.43,.07,kn);if(o.boots)sm(new T.CylinderGeometry(.095,.09,.24,10),mSh,0,0,-.3,0,kn);
  legs.push([hip,kn]);
  const sh=G(s*(.34*w+.05),1.6,0);sh.rotation.z=-s*.08;sm(new T.SphereGeometry(o.armor?0.15:0.115,10,8),o.armor?mat(0xb8c0d0):mT,0,0,0,0,sh);sm(new T.CylinderGeometry(.08,.065,.3,10),mT,1,0,-.16,0,sh);
  const el=G(0,-.31,0,sh);sm(new T.CylinderGeometry(.065,.05,.28,10),o.long?mT:mS,1,0,-.14,0,el);sm(new T.SphereGeometry(.062,10,8),mS,0,0,-.31,0,el);
  arms.push([sh,el])}
 return{g,root,mT,mC,mH,mP,mS,mSh,mE,mW,eyes,legs,arms,cp,name:o.name,line:o.line}}
function makeOpenBook(){const g=new T.Group(),cm=new T.MeshToonMaterial({color:0xffffff,gradientMap:gmap}),pg=new T.MeshToonMaterial({color:0xf6efdc,gradientMap:gmap}),ol=new T.MeshBasicMaterial({color:0x111111,side:T.BackSide});
 for(const s of[-1,1]){const cv=new T.Group();cv.rotation.z=s*.28;const c=new T.Mesh(new T.BoxGeometry(.34,.035,.46),cm);c.position.x=s*.17;const o=new T.Mesh(c.geometry,ol);o.scale.setScalar(1.08);c.add(o);cv.add(c);
  for(let k=0;k<3;k++){const p=new T.Mesh(new T.BoxGeometry(.3,.02,.42),pg);p.position.set(s*(.15),.03+k*.018,0);p.rotation.z=-s*(.05+k*.06);cv.add(p)}g.add(cv)}
 const sp=new T.Mesh(new T.CylinderGeometry(.025,.025,.46,8),cm);sp.rotation.x=Math.PI/2;g.add(sp);
 const gl=new T.Mesh(new T.PlaneGeometry(.55,.5),new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.18,side:T.DoubleSide}));gl.rotation.x=-Math.PI/2;gl.position.y=.07;g.add(gl);g.userData.gl=gl;
 g.rotation.x=-.55;g.material=cm;const cs=cm.color.setHex.bind(cm.color);cm.color.setHex=h=>{cs(h);gl.material.color.setHex(h);return cm.color};return g}
function makeCapelet(){const g=new T.Group(),blk=new T.MeshToonMaterial({color:0x141414,gradientMap:gmap,side:T.DoubleSide}),gold=new T.MeshToonMaterial({color:0xd4af37,gradientMap:gmap}),GAP=.55,L=6.2832-GAP*2;
 const c=new T.Mesh(new T.CylinderGeometry(.34,.64,.62,22,1,true,GAP,L),blk);c.position.y=1.42;c.castShadow=true;g.add(c);
 const tw=new T.Group();tw.rotation.y=-(1.5708+GAP);tw.position.y=1.11;const t=new T.Mesh(new T.TorusGeometry(.64,.028,6,30,L),gold);t.rotation.x=1.5708;tw.add(t);g.add(tw);
 for(const sx of[-1,1]){const e=new T.Mesh(new T.BoxGeometry(.03,.6,.03),gold);e.position.set(Math.sin(sx*GAP)*.49,1.42,Math.cos(GAP)*.49);e.rotation.z=sx*.55;g.add(e)}
 const col=new T.Mesh(new T.CylinderGeometry(.19,.22,.16,18,1,true),blk);col.position.y=1.76;g.add(col);const cr=new T.Mesh(new T.TorusGeometry(.19,.018,6,20),gold);cr.rotation.x=1.5708;cr.position.y=1.84;g.add(cr);
 const bt=new T.Mesh(new T.SphereGeometry(.05,10,8),gold);bt.position.set(-.2,1.56,.3);g.add(bt);return g}
function unionFX(){const g=new T.Group(),W=[];for(const s of[-1,1]){const h=mk(new T.TorusGeometry(.11,.035,6,10,4.2),0xe8dcc0,1);h.position.set(s*.2,2.12,0);h.rotation.set(0,s*1.57,s*.6);g.add(h);const wp=new T.Group();wp.position.set(s*.2,1.6,-.3);for(let k=0;k<3;k++){const pl=new T.Mesh(new T.PlaneGeometry(.45,1.5),new T.MeshBasicMaterial({color:[0x1a0006,0x9a0a1e,0xff3040][k],transparent:true,opacity:.5-k*.1,side:T.DoubleSide}));pl.position.set(s*(.45+k*.25),.3+k*.1,0);pl.rotation.z=-s*(.5+k*.35);wp.add(pl)}g.add(wp);W.push(wp)}
 const sh=new T.Group();for(let k=0;k<6;k++){const a=k/6*6.28,o=new T.Mesh(new T.OctahedronGeometry(.13),new T.MeshBasicMaterial({color:0xff2a3a}));o.position.set(Math.sin(a)*1.3,1.3+(k%2)*.4,Math.cos(a)*1.3);sh.add(o)}g.add(sh);const au=new T.Mesh(new T.SphereGeometry(1.15,14,10),new T.MeshBasicMaterial({color:0x5a0010,transparent:true,opacity:.22}));au.position.y=1.2;g.add(au);g.userData={w:W,sh};g.visible=false;return g}
function animUnion(g,t){const u=g.userData;if(!u||!u.w||!u.sh)return;u.w[0].rotation.y=.35+Math.sin(t*3)*.25;u.w[1].rotation.y=-.35-Math.sin(t*3)*.25;u.sh.rotation.y=t*1.6;u.sh.children.forEach((o,k)=>{o.rotation.y=t*4})}
function mkSword(){const sw=makeDemonSword();sw.position.y=-.34;sw.rotation.x=1.35;return sw}
/* anim(): substituída na V74 — ver ANIMAÇÕES (V74) */
function npc(o){const p=person(o);NPCS.push(p);return p.g}
const VAR={
 alda:{name:'Aldeã',line:'Os bandidos estão à solta. Fale comigo para aceitar a patrulha!',top:0xe8b94a,pants:0x6b4a2a,hs:3,hair:0x5a3a20,coat:1},
 lojista:{name:'Lojista',line:'Skins, cores e acessórios para todo cavaleiro!',top:0x3f8cff,pants:0x2a3f7a,hs:4,hat:0x2a3f7a,hair:0xaaaaaa,coat:1,w:1.1},
 fazendeiro:{name:'Fazendeiro',line:'A colheita este ano foi boa, graças aos cavaleiros.',top:0x8a6b3a,pants:0x4a4a3a,hs:4,hat:0xd9b86a,hair:0x3a2a1a,skin:0xd8a67a,w:1.05},
 crianca:{name:'Criança',line:'Quando eu crescer vou ser um Cavaleiro Mágico!',top:0xd04a3a,pants:0x3a4a6a,hs:0,hair:0xd0a030,h:.72},
 sabio:{name:'Sábio',line:'Todo grimório guarda um destino, jovem.',top:0x6a7a5a,pants:0x4a4a3a,hs:2,hair:0xdddddd,skin:0xd8b08a,coat:1,h:.96,w:.95},
 ferreiro:{name:'Ferreiro',line:'Preciso de ferro para as espadas do reino.',top:0x553322,pants:0x2a2a2a,hs:4,hat:0x333333,skin:0xb07a50,w:1.3,belt:1,boots:1},
 guarda:{name:'Guarda Real',line:'Os portões de Clover estão protegidos. Circule em paz.',top:0x9aa4b8,pants:0x445566,hs:1,hair:0x222222,belt:1,w:1.15,h:1.05,armor:1,boots:1,cape:0x3b4aa0},
 mago:{name:'Mago Nobre',line:'A magia é para quem tem coragem, não só talento.',top:0x6b3fa0,pants:0x3a2060,hs:2,hair:0xf0f0f0,coat:1,cape:0x3a1f60,long:1,skin:0xf1c9a0},
 fazendeira:{name:'Fazendeira de Sossy',line:'Saqueadores roubam nossas colheitas toda noite!',top:0x9a7a3a,pants:0x5a4a2a,hs:3,hair:0x8a4a1a,hat:0xd9b86a,skin:0xe0b890,coat:1},
 chefeS:{name:'Chefe de Sossy',line:'O Rei dos Saqueadores acampa a leste da vila. Ninguém consegue detê-lo.',top:0x6a4a2a,pants:0x3a2a1a,hs:4,hat:0x5a3a1a,hair:0x777777,skin:0xd8a67a,w:1.15,belt:1},
 carteiro:{name:'Carteiro de Sossy',line:'Cartas, pacotes e notícias para todo o reino!',top:0x2a5a9a,pants:0x2a2a3a,hs:4,hat:0x2a3f7a,hair:0x3a2a1a,belt:1},
 anciaN:{name:'Anciã de Nairn',line:'A floresta está cheia de magos perdidos. Cuidado ao sair da vila.',top:0x3a5a3a,pants:0x2a3a2a,hs:2,hair:0xe8e8e8,coat:1,h:.95,skin:0xd8b08a},
 cacador:{name:'Caçador de Nairn',line:'No pântano a oeste vive uma feiticeira terrível.',top:0x4a5a2a,pants:0x3a3a2a,hs:1,hair:0x4a2a1a,skin:0xc89a6a,belt:1,boots:1,cape:0x2f4a2f},
 capitaoK:{name:'Capitão de Kiten',line:'O exército de Diamond tenta invadir pela fronteira sul todos os dias.',top:0x6a7a98,pants:0x2a3a4a,hs:1,hair:0x222222,armor:1,belt:1,boots:1,cape:0x3b4aa0,w:1.1},
 comandK:{name:'Comandante da Guarda',line:'Um General de Diamond lidera os invasores. Precisamos de um herói.',top:0x8a9ab8,pants:0x2a3a4a,hs:1,hair:0x8a8a8a,armor:1,belt:1,boots:1,cape:0x7a1f1f,w:1.2,h:1.05},
 guardaK:{name:'Guarda de Kiten',line:'Bem-vindo à Cidade de Kiten, a última muralha do reino.',top:0x9aa4b8,pants:0x445566,hs:1,hair:0x222222,belt:1,w:1.15,armor:1,boots:1,cape:0x3b4aa0},
 cavaleira:{name:'Cavaleira',line:'Alvorecer Dourado sempre protege o reino!',top:0xe0b020,pants:0x5a3a20,hs:3,hair:0xd0402a,belt:1,cape:0xb88a10,boots:1,skin:0xe8b890,armor:1}
};
const BAND=[{top:0x8a1f2a,pants:0x2a2a2a,hs:1,hair:0x111111,skin:0xd8a67a,scarf:0x111111,belt:1},{top:0x4a3a2a,pants:0x2a2a3a,hs:4,hat:0x222222,hair:0x333333,skin:0xb07a50,boots:1},{top:0x2a4a2a,pants:0x3a3a3a,hs:0,hair:0x6a2a1a,scarf:0x8a1f2a,skin:0xf1c9a0,belt:1}];
