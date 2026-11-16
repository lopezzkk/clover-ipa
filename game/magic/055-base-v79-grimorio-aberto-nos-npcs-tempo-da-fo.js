// ================= V79: grimório aberto nos NPCs, tempo da Forma de Zagred, diálogo do pacto mais curto, otimização =================
// --- grimório aberto leve (2 malhas, geometria e materiais compartilhados), na mesma posição do grimório do jogador: à frente, na altura do joelho
const BK79={pg:null,cov:{},g:null};
function bk79Geo(){if(BK79.g)return BK79.g;const C=[],Pg=[];for(const s of[-1,1]){const cv=new T.Matrix4().makeRotationZ(s*.28);
  C.push([new T.BoxGeometry(.34,.035,.46),new T.Matrix4().multiplyMatrices(cv,new T.Matrix4().makeTranslation(s*.17,0,0))]);
  for(let k=0;k<3;k++){const m=new T.Matrix4().multiplyMatrices(cv,new T.Matrix4().compose(new T.Vector3(s*.15,.03+k*.018,0),new T.Quaternion().setFromEuler(new T.Euler(0,0,-s*(.05+k*.06))),new T.Vector3(1,1,1)));Pg.push([new T.BoxGeometry(.3,.02,.42),m])}}
 C.push([new T.CylinderGeometry(.025,.025,.46,8),new T.Matrix4().makeRotationX(Math.PI/2)]);
 const c=hbMerge(C),p=hbMerge(Pg);c._keep=p._keep=true;return BK79.g={c,p}}
function amBook(col){const G=bk79Geo(),g=new T.Group();if(!BK79.pg){BK79.pg=new T.MeshToonMaterial({color:0xf6efdc,gradientMap:gmap});BK79.pg._keep=1}
 let cm=BK79.cov[col];if(!cm){cm=BK79.cov[col]=new T.MeshToonMaterial({color:col,gradientMap:gmap});cm._keep=1}
 const a=new T.Mesh(G.c,cm),b=new T.Mesh(G.p,BK79.pg);g.add(a,b);g.rotation.x=-.55;g.userData.bk79=1;return g}
const BK79C=['fogo','agua','vento','luz'];
function npcBook(p,col){try{if(!p||!p.g||p.npBook)return;let c=col;if(c==null){let h=0;const n=p.name||'';for(let i=0;i<n.length;i++)h=(h*31+n.charCodeAt(i))|0;const gk=BK79C[n?Math.abs(h)%BK79C.length:Math.floor(Math.random()*BK79C.length)];c=(GR[gk]&&GR[gk].c)||0x8a6a3a}
 const b=amBook(c),k=Math.min(1,(p.hTop||2.21)/2.21);b.position.set(.28,.72*k,.8);p.g.add(b);p.npBook=b;p._bph=Math.random()*6.28}catch(e){}}
try{NPCS.forEach(n=>npcBook(n))}catch(e){}
const _npc79=npc;npc=function(o){const g=_npc79(o);try{npcBook(NPCS[NPCS.length-1])}catch(e){}return g};
// o grimório flutua devagar (só quando o personagem está sendo animado = perto da câmera)
const _anim79=anim;anim=function(p,t){const r=_anim79.apply(this,arguments);try{const b=p&&p.npBook;if(b){const k=Math.min(1,(p.hTop||2.21)/2.21);b.position.y=.72*k+Math.sin(t*2.5+(p._bph||0))*.07;b.rotation.y=Math.sin(t*1.1+(p._bph||0))*.15}}catch(e){}return r};
// --- Forma de Zagred com tempo: energia de 100 (dura 40 s), recarrega quando desligada; descanso de 20 s ao acabar
const ZG79={dur:40,rest:20,fill:4};
function zg79Ready(){if(P.zg)return true;if((P.zgcd||0)>0){toast('Zagred descansa: '+Math.ceil(P.zgcd)+'s');return false}if((P.ze==null?100:P.ze)<100){toast('Energia de Zagred: '+Math.floor(P.ze||0)+'/100 — espere encher');return false}return true}
const _togZ79=togZagred;togZagred=function(end){if(!end&&!P.zg&&!zg79Ready())return;return _togZ79.apply(this,arguments)};
const _zagT79=zagToggle;zagToggle=function(end){const was=!!P.zg;if(!end&&!was&&!zg79Ready())return;const r=_zagT79.apply(this,arguments);if(!was&&P.zg)P.ze=100;if(was&&!P.zg){P.zgcd=ZG79.rest}return r};
const _zagU79=zagUpdate;zagUpdate=function(dt){_zagU79(dt);try{if(P.ze==null)P.ze=100;if(P.zg){P.ze-=dt*100/ZG79.dur;if(P.ze<=0){P.ze=0;togZagred(1);if(P.zg)zagToggle(1);toast('A Forma de Zagred acabou: o tempo terminou.')}}else{if(P.zgcd>0)P.zgcd-=dt;else P.ze=Math.min(100,P.ze+dt*ZG79.fill)}zg79Hud()}catch(e){}};
function zg79Hud(){const w=$('h-zgw');if(!w||!w.style)return;const on=!!(P.g&&P.g.id=='kotodama');if(w.style.display!==(on?'':'none'))w.style.display=on?'':'none';if(!on)return;
 const v=P.ze==null?100:P.ze,k=$('h-zgk'),t=P.zg?'ZAGRED · '+Math.ceil(v*ZG79.dur/100)+'s':(P.zgcd>0?'Zagred descansa '+Math.ceil(P.zgcd)+'s':Math.floor(v)+' / 100');
 const pw=Math.round(v)+'%';if(w._pw!==pw){w._pw=pw;$('h-zg').style.width=pw}if(w._t!==t){w._t=t;$('h-zgt').textContent=t}if(k&&k.classList){k.classList.toggle('full',!P.zg&&v>=100&&!(P.zgcd>0));k.classList.toggle('low',!!P.zg&&v<20);k.classList.toggle('duon',!!P.zg)}}
try{const d=document.getElementById('h-dew');if(d&&d.insertAdjacentHTML&&!document.getElementById('h-zgw'))d.insertAdjacentHTML('afterend','<div class="bar2" id="h-zgw" style="display:none"><span class="bl dec" style="background:#5a2a8a">ZAGRED</span><div class="trk decr" id="h-zgk"><i class="def" id="h-zg" style="background:linear-gradient(90deg,#7a20c0,#ff2a5a)"></i><em id="h-zgt"></em></div></div>')}catch(e){}
// --- otimização: no gráfico Baixo o contorno do corpo com esqueleto não é desenhado (metade das malhas de personagem)
const _amSync79=amSync;amSync=function(p){_amSync79(p);try{if(p&&p.skmO&&CFG.gfx=='baixo')p.skmO.visible=false}catch(e){}};

// o corpo usado pelo jogo é o gerado em código (amProcBody); medidas dos membros para as peças das formas
amGeo=function(){return AMB.geo};
try{Object.assign(AM_SEG.ua,{r:.095});Object.assign(AM_SEG.fa,{r:.068,minY:-.62});Object.assign(AM_SEG.th,{r:.13});Object.assign(AM_SEG.sh,{r:.098,maxZ:.23})}catch(e){}
// proporção do modelo de referência: cabeça um pouco menor
try{Object.assign(BODIES[0].s.hd,{w:.29,h:.32,d:.31});Object.assign(BODIES[0].s.nk,{r:.07})}catch(e){}

// cabeça low-poly (como a referência): crânio em bloco arredondado, rosto reto, maçãs do rosto, mandíbula quadrada
// afinando até o queixo e um nariz discreto — facetada, feita por código. Olhos, expressões e cabelo continuam por cima.
abHead=function(){return hbG('lpHead',()=>{const RG=[[.3,.08,.07,.08],[.27,.17,.14,.18],[.2,.222,.205,.232],[.1,.238,.226,.248],[.02,.236,.232,.244],[-.04,.232,.236,.236],[-.1,.215,.232,.218],[-.16,.188,.22,.182],[-.22,.148,.198,.13],[-.27,.092,.17,.07],[-.3,.042,.14,.02]],N=10,pos=[],idx=[];
 const se=(c,e)=>Math.sign(c)*Math.pow(Math.abs(c),2/e);
 RG.forEach(([y,hx,zf,zb],r)=>{for(let i=0;i<N;i++){const a=i/N*Math.PI*2,sx=Math.sin(a),cz=Math.cos(a);let x=hx*se(sx,3.2),z=(cz>=0?zf:-zb)*Math.pow(Math.abs(cz),2/3.2);if(i===0&&y<.05&&y>-.13)z+=.022;pos.push(x,y,z)}});
 for(let r=0;r<RG.length-1;r++)for(let i=0;i<N;i++){const j=(i+1)%N,a=r*N+i,b=r*N+j,c=(r+1)*N+i,d=(r+1)*N+j;idx.push(a,c,b,b,c,d)}
 const t=pos.length/3;pos.push(0,.31,0);const bt=t+1;pos.push(0,-.305,.06);for(let i=0;i<N;i++){const j=(i+1)%N;idx.push(t,i,j);const L=(RG.length-1)*N;idx.push(bt,L+j,L+i)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
 // orientação das faces para fora
 const P=g.attributes.position,I=g.index.array;for(let k=0;k<I.length;k+=3){const A=[P.getX(I[k]),P.getY(I[k]),P.getZ(I[k])],B=[P.getX(I[k+1]),P.getY(I[k+1]),P.getZ(I[k+1])],C=[P.getX(I[k+2]),P.getY(I[k+2]),P.getZ(I[k+2])],u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]],v=[C[0]-A[0],C[1]-A[1],C[2]-A[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],m=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3,(A[2]+B[2]+C[2])/3];if(n[0]*m[0]+n[1]*m[1]+n[2]*m[2]<0){const q=I[k+1];I[k+1]=I[k+2];I[k+2]=q}}
 const f=g.toNonIndexed();f.computeVertexNormals();return f})};

// visual da referência: personagem careca e sem olhos (cabeça lisa) e sem o cachecol no pescoço
function v80Blank(p){if(!p||!p.skm||!p.hs)return;if(p.hH)p.hH.visible=false;if(p.hF)p.hF.visible=false;
 for(const c of p.hs.children){if(c.isMesh&&c.geometry&&c.geometry.type==='SphereGeometry'&&c.geometry.parameters&&c.geometry.parameters.radius<.03&&!(c.userData&&(c.userData.ds||c.userData.stage||c.userData.f80)))c.visible=false}}
const _dressUpV80=dressUp;dressUp=function(p,L0){const r=_dressUpV80.apply(this,arguments);try{if(p&&p.skm){v80Blank(p);if(p.tspace)p.tspace.traverse(o=>{const g=o.geometry,q=g&&g.parameters;if(o.isMesh&&g.type==='TorusGeometry'&&q&&Math.abs(q.radius-.15)<.001&&Math.abs(q.tube-.055)<.001)amHide(o)})}}catch(e){}return r};
const _animV80=anim;anim=function(p){const r=_animV80.apply(this,arguments);try{v80Blank(p)}catch(e){}return r};
// 1ª missão (derrotar 5 bandidos): 150 de XP
const _qXP80=qXP;qXP=function(q){if(q&&typeof QS!=='undefined'&&q===QS.patrulha)return P.lv>q.lv+4?75:150;return _qXP80.apply(this,arguments)};

// trocar de roupa não pode puxar o corpo com esqueleto nem as peças da forma para dentro do "espaço do tronco"
const _bodyAdopt80=bodyAdopt;bodyAdopt=function(p){const R=p&&p.root,keep=R?R.children.filter(c=>c.userData&&(c.userData.amb||c.userData.f80||c.userData.ds)):[];keep.forEach(c=>R.remove(c));const r=_bodyAdopt80.apply(this,arguments);keep.forEach(c=>R.add(c));return r};
// correção: ao desfazer uma forma, nenhuma peça dela pode ficar presa no corpo (a União com Liebe deixava linhas, asas e placas)
const _naForm80b=naForm;naForm=function(fk,L){const LL=L||PP,snap=new Set();try{if(LL&&LL.g)LL.g.traverse(o=>snap.add(o))}catch(e){}const F=_naForm80b(fk,L);try{const d1=F.detach;F.detach=function(){const r=d1&&d1.apply(this,arguments);try{const rm=[];LL.g.traverse(o=>{if(!snap.has(o)&&o!==F.g&&o.userData&&(o.userData.ds||o.userData.stage||o.userData.f80))rm.push(o)});rm.forEach(o=>{if(o.parent)o.parent.remove(o)})}catch(e){}return r}}catch(e){}return F};

// personagem um pouco menor (corpo novo)
const _bbV80=buildBody;buildBody=function(p,bi){const r=_bbV80.apply(this,arguments);try{if(p&&p.skm&&p.root)p.root.scale.setScalar((p.h0||1)*.9)}catch(e){}return r};

// ================= V81: rosto e cabelo de volta, mais cabelos/olhos/cicatrizes/barbas, cicatriz rente ao rosto, capa dos Touros Negros refeita =================
// 1) cabelo, olhos, sobrancelhas, nariz e boca voltam (a cabeça low-poly continua; o cachecol continua fora)
v80Blank=function(p){};
function v81Face(p){if(!p||!p.skm||!p.hs)return;if(p.hH){p.hH.visible=true;p.hH.scale.setScalar(1.06)}if(p.hF)p.hF.visible=true;for(const c of p.hs.children)if(c.isMesh&&c.geometry&&c.geometry.type==='SphereGeometry'&&c.geometry.parameters&&c.geometry.parameters.radius<.03)c.visible=true}
// 2) superfície da frente da cabeça low-poly (espaço da cabeça) — para cicatrizes e barbas ficarem coladas no rosto
const V81HR=[[.255,.075,.065],[.235,.165,.135],[.18,.205,.195],[.1,.226,.222],[.02,.232,.23],[-.04,.232,.236],[-.1,.215,.232],[-.16,.188,.22],[-.22,.148,.198],[-.27,.092,.17],[-.3,.042,.14]];
function v81HeadZ(x,y){const R=V81HR;let i=0;if(y>=R[0][0])i=0;else{while(i<R.length-2&&R[i+1][0]>y)i++}const a=R[i],b=R[i+1]||a,t=a[0]===b[0]?0:Math.max(0,Math.min(1,(a[0]-y)/(a[0]-b[0]))),hx=a[1]+(b[1]-a[1])*t,zf=a[2]+(b[2]-a[2])*t;
 const u=Math.min(.999,Math.abs(x)/hx);let z=zf*Math.pow(1-Math.pow(u,3.2),1/3.2)*.975;if(Math.abs(x)<.03&&y<.05&&y>-.13)z+=.018*(1-Math.abs(x)/.03);return z}
// encosta uma peça do rosto (filha do grupo do rosto) na pele: z do rosto = z da cabeça - deslocamento do grupo do rosto
function v81Snap(p,o,inset){try{const fz=p.hF?p.hF.position.z:0,fy=p.fg?p.fg.position.y:-1.95,x=o.position.x,y=o.position.y+fy;o.position.z=v81HeadZ(x,y)-fz-(inset||0)}catch(e){}}
function v81Wrap(list,kind){list.forEach(it=>{if(it._v81)return;it._v81=1;const b0=it.b;it.b=function(p,g){const n0=g.children.length;const r=b0.apply(this,arguments);try{if(p&&p.skm)for(let k=n0;k<g.children.length;k++){const o=g.children[k];if(!o.isMesh)continue;const t=o.geometry&&o.geometry.type;
  if(kind==='scar')v81Snap(p,o,.003);else if(t==='BoxGeometry')v81Snap(p,o,.002)}}catch(e){}return r}})}
// 3) novos modelos
const V81E=[{n:'Sonolento',w:[1.12,.62],i:[1,.62],br:.05,by:2.02,hl:1},{n:'Felino',w:[1.2,1.25],i:[.42,1.25],br:.3,by:2.04,hl:1},{n:'Pequeno',w:[.82,.95],i:[.8,.95],br:.1,by:2.04,hl:1},{n:'Furioso',w:[1.2,.7],i:[.9,.7],br:.7,by:2.02,hl:0},{n:'Gentil',w:[1.05,1.15],i:[1.05,1.15],br:-.25,by:2.06,hl:2},{n:'Estrelado',w:[1.3,1.6],i:[1.25,1.6],br:-.05,by:2.07,hl:4},{n:'Vazio',w:[1.1,1.2],i:[.25,.25],br:.2,by:2.04,hl:0}];
V81E.forEach(e=>EYES.push(e));
const V81S=[
 {n:'Três garras',b:(p,g)=>{for(let k=0;k<3;k++){const c=lkAdd(g,new T.BoxGeometry(.011,.12,.01),p.mScar,-.15+k*.03,1.9,.2);c.rotation.set(0,-.5,.45)}}},
 {n:'Queixo',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.06,.011,.01),p.mScar,.02,1.73,.2);c.rotation.z=-.3}},
 {n:'Sobrancelha cortada',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.012,.07,.01),p.mScar,-.1,2.04,.2);c.rotation.z=-.2}},
 {n:'X na testa',b:(p,g)=>{for(const r of[.7,-.7]){const c=lkAdd(g,new T.BoxGeometry(.012,.08,.01),p.mScar,0,2.11,.2);c.rotation.z=r}}},
 {n:'Lábio',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.01,.05,.01),p.mScar,.03,1.85,.2);c.rotation.z=.15}},
 {n:'Rosto todo',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.012,.26,.01),p.mScar,.07,1.94,.2);c.rotation.z=.35}}];
V81S.forEach(s=>SCARS.push(s));
const V81B=[
 {n:'Costeletas',b:(p,g)=>{for(const s of[-1,1]){const m=lkAdd(g,new T.BoxGeometry(.035,.11,.03),p.mB,s*.205,1.9,.06);m.rotation.y=s*.6}}},
 {n:'Barbicha',b:(p,g)=>{lkAdd(g,new T.BoxGeometry(.035,.05,.02),p.mB,0,1.74,.2)}},
 {n:'Bigode grosso',b:(p,g)=>{for(const s of[-1,1]){const m=lkAdd(g,new T.BoxGeometry(.075,.03,.02),p.mB,s*.038,1.873,.228);m.rotation.z=-s*.28}}}];
V81B.forEach(b=>BEARDS.push(b));
v81Wrap(SCARS,'scar');v81Wrap(BEARDS,'beard');
// cabelos novos (mechas 3D, mesmo sistema dos outros penteados)
const V81H=[
 {n:'Franja de lado',b:(p,g)=>{const L=[];hrCap(L,1);for(let k=0;k<7;k++){const ph=(-30+k*12)*D2R,root=hrRoot(35*D2R,ph,.25);L.push([hrStrand(.26-k*.015,.06,-.3,1.8),hrPlace(root,new T.Vector3(.75,-.55,.55))])}for(let k=0;k<12;k++){const ph=(80+k*17)*D2R,root=hrRoot(60*D2R,ph,.25);L.push([hrStrand(.16,.06,.15,1.6),hrPlace(root,new T.Vector3(Math.sin(ph)*.3,-1,Math.cos(ph)*.3-.1))])}hrSides(L,.14);hrMesh(p,g,L,1)}},
 {n:'Coque',b:(p,g)=>{const L=[];hrCap(L,1);L.push([hbG('v81bun',()=>new T.SphereGeometry(.1,12,10)),new T.Matrix4().makeTranslation(0,.2,-.17)]);L.push([hbG('v81bun2',()=>new T.TorusGeometry(.07,.018,6,14)),new T.Matrix4().makeTranslation(0,.17,-.13)]);hrBangs(L,4,.14,55);hrSides(L,.15);hrMesh(p,g,L)}},
 {n:'Raspado nas laterais',b:(p,g)=>{const L=[];L.push([hbG('v81und',()=>{const q=new T.SphereGeometry(.258,16,10,0,Math.PI*2,0,1.15);q.scale(.72,1,1);q.rotateX(-.25);return q}),null]);for(let r=0;r<3;r++)for(let k=0;k<5;k++){const th=(12+r*20)*D2R,ph=(k-2)*24*D2R+(r%2)*.2,root=hrRoot(th,ph,.25);L.push([hrStrand(.2,.065,.35,1.7),hrPlace(root,new T.Vector3(Math.sin(ph)*.2,.45,-.85))])}hrMesh(p,g,L)}},
 {n:'Trança',b:(p,g)=>{const L=[];hrCap(L,1);for(let k=0;k<7;k++){const y=.05-k*.085,z=-.27-k*.012;L.push([hbG('v81br'+k,()=>{const q=new T.SphereGeometry(.055-k*.004,8,6);q.scale(1,1.25,.85);return q}),new T.Matrix4().makeTranslation((k%2?.012:-.012),y,z)])}hrBangs(L,5,.15,65);hrMesh(p,g,L,1)}},
 {n:'Cacheado',b:(p,g)=>{const L=[];hrCap(L);let sd=3;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};for(let k=0;k<34;k++){const th=(5+rnd()*80)*D2R,ph=rnd()*Math.PI*2;if(th>55*D2R&&Math.cos(ph)>.45)continue;const d=hrDir(th,ph).multiplyScalar(.27);L.push([hbG('v81cl',()=>new T.SphereGeometry(.06,7,6)),new T.Matrix4().makeTranslation(d.x,d.y,d.z)])}hrMesh(p,g,L)}},
 {n:'Penteado para trás',b:(p,g)=>{const L=[];hrCap(L,1);for(let r=0;r<4;r++)for(let k=0;k<9;k++){const th=(10+r*18)*D2R,ph=(k/9-.5)*2.6+r*.1;if(Math.cos(ph)<-.2)continue;const root=hrRoot(th,ph,.25);L.push([hrStrand(.22,.055,.25,1.8),hrPlace(root,new T.Vector3(Math.sin(ph)*.25,.12,-.95))])}hrSides(L,.12);hrMesh(p,g,L)}}];
V81H.forEach(h=>{const b0=h.b;HAIRS.push({n:h.n,b:(p,g)=>{try{b0(p,g)}catch(e){while(g.children.length)g.remove(g.children[0])}}})});
// 4) capa dos Touros Negros feita para o corpo novo: manto sobre os ombros e as costas, aberto na frente (os braços não atravessam)
function v81Capelet(g){if(g.userData.v81)return;g.userData.v81=1;while(g.children.length)g.remove(g.children[0]);g.userData.amb=1;
 const blk=new T.MeshToonMaterial({color:0x141414,gradientMap:gmap,side:T.DoubleSide}),gold=new T.MeshToonMaterial({color:0xd4af37,gradientMap:gmap});
 const RW=[[1.85,.14,.12,.5],[1.81,.27,.18,.62],[1.77,.415,.255,.95],[1.7,.46,.28,1.05],[1.6,.475,.29,1.1],[1.45,.485,.3,1.12],[1.31,.495,.31,1.14]],N=22,pos=[],idx=[],edge=[],bot=[];
 RW.forEach(([y,rx,rz,o],r)=>{for(let i=0;i<=N;i++){const a=o+(Math.PI*2-2*o)*i/N,x=Math.sin(a)*rx,z=Math.cos(a)*rz;pos.push(x,y,z);if(i===0||i===N)edge.push([i,new T.Vector3(x,y,z)]);if(r===RW.length-1)bot.push(new T.Vector3(x,y-.005,z))}});
 for(let r=0;r<RW.length-1;r++)for(let i=0;i<N;i++){const a=r*(N+1)+i,b=a+1,c=a+N+1,d=c+1;idx.push(a,c,b,b,c,d)}
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();const m=new T.Mesh(geo,blk);m.castShadow=true;g.add(m);
 const tube=(pts,r)=>{const t=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),Math.max(8,pts.length*4),r,5,false),gold);g.add(t)};
 tube(bot,.016);for(const side of[0,N])tube(edge.filter(e=>e[0]===side).map(e=>e[1]),.014);
 const cr=new T.Mesh(new T.TorusGeometry(.14,.014,6,20),gold);cr.rotation.x=Math.PI/2;cr.position.y=1.85;g.add(cr);
 const bt=new T.Mesh(new T.SphereGeometry(.035,10,8),gold);bt.position.set(-Math.sin(.95)*.415*.98,1.76,Math.cos(.95)*.255+.01);g.add(bt)}
const _mkCap81=makeCapelet;makeCapelet=function(){const g=_mkCap81.apply(this,arguments);g.userData.cpl=1;return g};try{PCL.userData.cpl=1}catch(e){}
function v81FixCapelet(p){if(!p||!p.skm||!p.root)return;const found=[];p.root.traverse(o=>{if(o.userData&&o.userData.cpl)found.push(o)});for(const c of found){if(c.parent!==p.root){const v=c.visible;if(c.parent)c.parent.remove(c);p.root.add(c);c.visible=v}c.position.set(0,0,0);c.scale.set(1,1,1);c.rotation.set(0,0,0);v81Capelet(c)}}
// mkOther adiciona a capa depois de criar a pessoa: arrumar também no primeiro quadro animado
const _dressUp81=dressUp;dressUp=function(p,L0){const r=_dressUp81.apply(this,arguments);try{v81Face(p);v81FixCapelet(p)}catch(e){}return r};
const _anim81=anim;anim=function(p){const r=_anim81.apply(this,arguments);try{if(p&&p.skm&&!p._v81c){p._v81c=1;v81FixCapelet(p)}}catch(e){}return r};

// a cabeça fica dentro da touca do cabelo (o topo não atravessa o cabelo)
abHead=function(){return hbG('lpHead2',()=>{const RG=[[.255,.075,.065,.075],[.235,.165,.135,.172],[.18,.205,.195,.215],[.1,.226,.222,.238],[.02,.232,.23,.24],[-.04,.232,.236,.236],[-.1,.215,.232,.218],[-.16,.188,.22,.182],[-.22,.148,.198,.13],[-.27,.092,.17,.07],[-.3,.042,.14,.02]],N=10,pos=[],idx=[];
 const se=(c,e)=>Math.sign(c)*Math.pow(Math.abs(c),2/e);
 RG.forEach(([y,hx,zf,zb],r)=>{for(let i=0;i<N;i++){const a=i/N*Math.PI*2,sx=Math.sin(a),cz=Math.cos(a);let x=hx*se(sx,3.2),z=(cz>=0?zf:-zb)*Math.pow(Math.abs(cz),2/3.2);if(i===0&&y<.05&&y>-.13)z+=.022;pos.push(x,y,z)}});
 for(let r=0;r<RG.length-1;r++)for(let i=0;i<N;i++){const j=(i+1)%N,a=r*N+i,b=r*N+j,c=(r+1)*N+i,d=(r+1)*N+j;idx.push(a,c,b,b,c,d)}
 const t=pos.length/3;pos.push(0,.262,0);const bt=t+1;pos.push(0,-.305,.06);for(let i=0;i<N;i++){const j=(i+1)%N;idx.push(t,i,j);const L=(RG.length-1)*N;idx.push(bt,L+j,L+i)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);
 // orientação das faces para fora
 const P=g.attributes.position,I=g.index.array;for(let k=0;k<I.length;k+=3){const A=[P.getX(I[k]),P.getY(I[k]),P.getZ(I[k])],B=[P.getX(I[k+1]),P.getY(I[k+1]),P.getZ(I[k+1])],C=[P.getX(I[k+2]),P.getY(I[k+2]),P.getZ(I[k+2])],u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]],v=[C[0]-A[0],C[1]-A[1],C[2]-A[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],m=[(A[0]+B[0]+C[0])/3,(A[1]+B[1]+C[1])/3,(A[2]+B[2]+C[2])/3];if(n[0]*m[0]+n[1]*m[1]+n[2]*m[2]<0){const q=I[k+1];I[k+1]=I[k+2];I[k+2]=q}}
 const f=g.toNonIndexed();f.computeVertexNormals();return f})};
// barbas que envolvem o rosto (feitas sobre a superfície da cabeça nova, sem placas flutuando)
function v81HeadPt(a,y,off){const R=V81HR;let i=0;while(i<R.length-2&&R[i+1][0]>y)i++;const A=R[i],B=R[i+1]||A,t=A[0]===B[0]?0:Math.max(0,Math.min(1,(A[0]-y)/(A[0]-B[0]))),hx=A[1]+(B[1]-A[1])*t,zf=A[2]+(B[2]-A[2])*t,se=(c,e)=>Math.sign(c)*Math.pow(Math.abs(c),2/e);
 const k=1+(off||0);return[hx*se(Math.sin(a),3.2)*.975*k,y,zf*se(Math.cos(a),3.2)*.975*k]}
function v81Wrapband(a0,a1,y0,y1,off,mask){const NA=16,NY=8,pos=[],idx=[];for(let j=0;j<=NY;j++)for(let i=0;i<=NA;i++){const a=a0+(a1-a0)*i/NA,y=y0+(y1-y0)*j/NY;const p=v81HeadPt(a,y,off);pos.push(p[0],p[1],p[2])}
 for(let j=0;j<NY;j++)for(let i=0;i<NA;i++){const a=a0+(a1-a0)*(i+.5)/NA,y=y0+(y1-y0)*(j+.5)/NY;if(mask&&!mask(a,y))continue;const p=j*(NA+1)+i,q=p+1,r=p+NA+1,s=r+1;idx.push(p,q,r,q,s,r)}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);const f=g.toNonIndexed();f.computeVertexNormals();return f}
function v81AddBand(p,g,geo,m){const fz=p.hF?p.hF.position.z:.045,fy=p.fg?p.fg.position.y:-1.95;const o=new T.Mesh(geo,m);o.position.set(0,-fy,-fz);o.material.side=T.DoubleSide;g.add(o);return o}
const v81Mouth=(a,y)=>!(Math.abs(a)<.42&&y>-.13&&y<-.06);
BEARDS[3].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81bfull',()=>v81Wrapband(-1.75,1.75,-.305,-.02,.045,(a,y)=>v81Mouth(a,y)&&(Math.abs(a)>1.15||y<-.08))),p.mB);v81AddBand(p,g,hbG('v81must',()=>v81Wrapband(-.55,.55,-.085,-.06,.1)),p.mB)};
BEARDS[4].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81bshort',()=>v81Wrapband(-1.7,1.7,-.3,-.04,.025,(a,y)=>v81Mouth(a,y)&&(Math.abs(a)>1.2||y<-.09))),p.mBs)};
BEARDS[1].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81must2',()=>v81Wrapband(-.6,.6,-.088,-.058,.1)),p.mB)};
BEARDS[2].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81must3',()=>v81Wrapband(-.5,.5,-.088,-.062,.1)),p.mB);v81AddBand(p,g,hbG('v81goat',()=>v81Wrapband(-.3,.3,-.3,-.16,.045)),p.mB)};
BEARDS[5].b=function(p,g){if(!p.skm)return;for(const s of[-1,1])v81AddBand(p,g,hbG('v81side'+s,()=>v81Wrapband(s*1.18,s*1.45,-.13,.06,.03)),p.mB)};
BEARDS[6].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81chin',()=>v81Wrapband(-.22,.22,-.31,-.2,.05)),p.mB)};
BEARDS[7].b=function(p,g){if(!p.skm)return;v81AddBand(p,g,hbG('v81must4',()=>v81Wrapband(-.75,.75,-.095,-.05,.11)),p.mB)};

