// ---------- Cena ----------
const R=new T.WebGLRenderer({canvas:$('c'),antialias:false,stencil:false,powerPreference:'high-performance',precision:(()=>{try{return (JSON.parse(localStorage.getItem('cloverCfg'))||{}).gfx=='baixo'?'mediump':'highp'}catch(e){return 'highp'}})()});R.shadowMap.autoUpdate=false;R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.shadowMap.enabled=true;
// versão experimental: quando a ponte do Babylon.js está carregada, ela desenha a cena; a lógica do jogo continua a mesma
if(window.PONTE141){const _o=R.render.bind(R);R.render=function(s,c){return PONTE141.ativo?PONTE141.render(s,c,R):_o(s,c)}}
const S=new T.Scene();S.background=new T.Color(0xbfe4ff);S.fog=new T.Fog(0xbfe4ff,40,120);
const SKY=new T.Group();{const g=new T.SphereGeometry(440,24,14),c=[],top=new T.Color(0x2f7fe0),hor=new T.Color(0xbfe4ff),p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i)/440,k=Math.max(0,Math.min(1,y*1.6));const col=hor.clone().lerp(top,Math.pow(k,.8));c.push(col.r,col.g,col.b)}g.setAttribute('color',new T.Float32BufferAttribute(c,3));const sk=new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,side:T.BackSide,fog:false,depthWrite:false}));SKY.add(sk);sk.renderOrder=-2;const sd=new T.Vector3(30,60,20).normalize().multiplyScalar(400),sun1=new T.Mesh(new T.CircleGeometry(16,24),new T.MeshBasicMaterial({color:0xfff6c8,fog:false,depthWrite:false})),sun2=new T.Mesh(new T.CircleGeometry(30,24),new T.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:.28,fog:false,depthWrite:false}));sun1.position.copy(sd);sun2.position.copy(sd).multiplyScalar(1.01);sun1.lookAt(0,0,0);sun2.lookAt(0,0,0);SKY.add(sun2,sun1);SKY.renderOrder=-1;S.add(SKY)}
const cam=new T.PerspectiveCamera(55,1,.1,500);
S.add(new T.HemisphereLight(0xe8f0ff,0x5a5242,.52));const sun=new T.DirectionalLight(0xfff4e2,.68);sun.position.set(30,60,20);sun.castShadow=true;sun.shadow.mapSize.set(512,512);const shc=sun.shadow.camera;shc.left=shc.bottom=-30;shc.right=shc.top=30;shc.far=140;shc.updateProjectionMatrix();S.add(sun,sun.target);
const gmap=new T.DataTexture(new Uint8Array([120,120,120,255,190,190,190,255,255,255,255,255]),3,1,T.RGBAFormat);gmap.minFilter=gmap.magFilter=T.NearestFilter;gmap.needsUpdate=true;
const mat=c=>new T.MeshToonMaterial({color:c,gradientMap:gmap}),olm=new T.MeshBasicMaterial({color:0x111111,side:T.BackSide});olm._keep=1;
function mk(g,c,o){const m=new T.Mesh(g,mat(c));m.castShadow=m.receiveShadow=true;if(o){const b=new T.Mesh(g,olm);b.scale.setScalar(1.08);m.add(b)}return m}
const CH=40,chunks={},SOL=[],NPCS=[];
function put(o,x,z){o.position.x=x;o.position.z=z;const i=Math.floor(x/CH),j=Math.floor(z/CH),k=i+','+j;let g=chunks[k];if(!g){g=chunks[k]=new T.Group();g.cx=(i+.5)*CH;g.cz=(j+.5)*CH;S.add(g)}g.add(o)}
let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
const ground=mk(new T.PlaneGeometry(700,700,90,90),0xffffff);ground.rotation.x=-Math.PI/2;S.add(ground);


// ================= KIT DE ARQUITETURA E NATUREZA (mapa reformulado) =================
// Todas as peças usam materiais e geometrias compartilhados; depois o mergeChunks junta tudo de cada bloco em poucas malhas.
// Peças pequenas (janelas, portas, vasos, barris...) ficam num grupo marcado como "detalhe" (LOD): somem só de longe.
const WMC={},WBC={},GC={};
const WM=c=>WMC[c]||(WMC[c]=mat(c)),WB=c=>WBC[c]||(WBC[c]=new T.MeshBasicMaterial({color:c}));
const GEO=(k,f)=>GC[k]||(GC[k]=f());
const BX=(w,h,d)=>GEO('b'+w.toFixed(2)+'|'+h.toFixed(2)+'|'+d.toFixed(2),()=>new T.BoxGeometry(w,h,d));
const CY=(a,b,h,s)=>{s=s||(Math.max(a,b)<.3?6:8);return GEO('c'+a.toFixed(2)+'|'+b.toFixed(2)+'|'+h.toFixed(2)+'|'+s,()=>new T.CylinderGeometry(a,b,h,s))};
const CYO=(r,h,s)=>GEO('o'+r.toFixed(2)+'|'+h.toFixed(2)+'|'+(s||8),()=>new T.CylinderGeometry(r,r,h,s||8,1,true));
const SP=(r,a,b)=>{a=r<.15?4:(a||6);b=r<.15?3:(b||4);return GEO('s'+r.toFixed(2)+'|'+a+'|'+b,()=>new T.SphereGeometry(r,a,b))};
const IC=(r,dt)=>GEO('i'+r.toFixed(2)+'|'+(dt||0),()=>new T.IcosahedronGeometry(r,dt||0));
const DO=r=>GEO('d'+r.toFixed(2),()=>new T.IcosahedronGeometry(r,0));
const CN=(r,h,s)=>GEO('n'+r.toFixed(2)+'|'+h.toFixed(2)+'|'+(s||7),()=>new T.ConeGeometry(r,h,s||7));
// prisma triangular (oitão das casas): base d em Z, altura h, comprimento w em X
const PRISM=GEO('prism',()=>{const g=new T.BufferGeometry(),A=[-.5,0,-.5],B=[-.5,0,.5],C=[-.5,1,0],D=[.5,0,-.5],E=[.5,0,.5],F=[.5,1,0],t=[A,B,C,D,F,E,B,E,F,B,F,C,A,C,F,A,F,D,A,D,E,A,E,B],a=[];for(const p of t)a.push(...p);g.setAttribute('position',new T.Float32BufferAttribute(a,3));g.computeVertexNormals();return g});
// telhado de quatro águas e mansarda com base quadrada unitária (escalados em cada casa)
const HIPG=GEO('hip',()=>{const g=new T.ConeGeometry(Math.SQRT1_2,1,4);g.rotateY(Math.PI/4);g.translate(0,.5,0);return g});
const MANG=GEO('man',()=>{const g=new T.CylinderGeometry(Math.SQRT1_2*.62,Math.SQRT1_2,1,4,1);g.rotateY(Math.PI/4);g.translate(0,.5,0);return g});
function bp(par,geo,c,x,y,z,o,b,sx,sy,sz){const m=new T.Mesh(geo,b?WB(c):WM(c));m.position.set(x,y,z);if(sx)m.scale.set(sx,sy,sz);m.castShadow=!!o;m.receiveShadow=!b;if(o){const k=new T.Mesh(geo,olm);k.scale.setScalar(1.05);m.add(k)}par.add(m);return m}
// telhado de duas águas com oitão, beiral e cumeeira
function gable(par,w,d,h,rc,y0,wc,ov,thk){ov=ov==null?.45:ov;thk=thk||.2;const a=Math.atan2(h,d/2),L=(d/2+ov)/Math.cos(a);
 bp(par,PRISM,wc,0,y0,0,1,0,w,h,d);for(const s of[-1,1]){const m=bp(par,BX(w+ov*2,thk,L),rc,0,y0+h-(L/2)*Math.sin(a)+thk*.5,s*(L/2)*Math.cos(a),1);m.rotation.x=s*a}bp(par,BX(w+ov*2+.1,.16,.26),0x4a3020,0,y0+h+.08,0)}
function hip(par,w,d,h,rc,y0,ov){ov=ov==null?.4:ov;return bp(par,HIPG,rc,0,y0,0,1,0,w+ov*2,h,d+ov*2)}
// janela com moldura, vidro (algumas acesas por dentro), cruz, peitoril e venezianas opcionais
function win(par,x,y,z,ry,w,h,lit,fc,sh){const nx=Math.sin(ry),nz=Math.cos(ry),lx=Math.cos(ry),lz=-Math.sin(ry);const R=m=>{m.rotation.y=ry;return m};
 R(bp(par,BX(w+.22,h+.22,.1),fc,x,y,z));R(bp(par,BX(w,h,.12),lit?0xffd27a:0x2c3a4c,x+nx*.02,y,z+nz*.02,0,lit?1:0));R(bp(par,BX(.06,h,.14),fc,x+nx*.04,y,z+nz*.04));if(w>.85)R(bp(par,BX(w,.06,.14),fc,x+nx*.04,y,z+nz*.04));R(bp(par,BX(w+.36,.09,.24),fc,x+nx*.1,y-h/2-.08,z+nz*.1));
 if(sh)for(const s of[-1,1])R(bp(par,BX(w*.48,h+.08,.06),sh,x+lx*s*(w*.76)+nx*.05,y,z+lz*s*(w*.76)+nz*.05))}
function door(par,x,z,ry,w,h,c,fc,bands){const nx=Math.sin(ry),nz=Math.cos(ry);const R=m=>{m.rotation.y=ry;return m};R(bp(par,BX(w+.3,h+.16,.12),fc,x,h/2+.04,z));R(bp(par,BX(w,h,.16),c,x+nx*.03,h/2,z+nz*.03));
 if(bands)for(const yy of[.35,h-.35])R(bp(par,BX(w+.02,.1,.18),0x2a2a2e,x+nx*.04,yy,z+nz*.04));bp(par,SP(.06,5,4),0xd8b040,x+nx*.14+Math.cos(ry)*w*.3,h*.5,z+nz*.14-Math.sin(ry)*w*.3);R(bp(par,BX(w+.8,.16,.7),0x8a8478,x+nx*.38,.08,z+nz*.38))}
function lantern(par,x,z,wall){if(wall){bp(par,BX(.08,.08,.35),0x2a2a2e,x,2.2,z);bp(par,BX(.22,.3,.22),0xffd27a,x,2.05,z+.2,0,1);bp(par,CN(.2,.16,4),0x2a2a2e,x,2.28,z+.2);return}bp(par,CY(.06,.08,2.3,6),0x2a2a2e,x,1.15,z);bp(par,BX(.28,.36,.28),0xffd27a,x,2.45,z,0,1);bp(par,CN(.25,.2,4),0x2a2a2e,x,2.73,z)}
function barrel(par,x,z,s){s=s||1;bp(par,CY(.34*s,.34*s,.78*s,8),0x8a5a32,x,.39*s,z);for(const y of[.15,.63])bp(par,CYO(.355*s,.06,8),0x3a3a3e,x,y*s,z)}
function crate(par,x,z,s,ry){s=s||1;const m=bp(par,BX(.7*s,.7*s,.7*s),0xb08a58,x,.35*s,z);m.rotation.y=ry||0;const k=bp(par,BX(.74*s,.1*s,.74*s),0x7a5a36,x,.66*s,z);k.rotation.y=ry||0}
function sack(par,x,z){bp(par,SP(.3,6,5),0xd8c49a,x,.24,z,0,0,1,.8,1);bp(par,SP(.1,5,4),0xb8a47a,x,.5,z)}
function pot(par,x,z,fl){bp(par,CY(.24,.17,.34,7),0xb4643a,x,.17,z);bp(par,SP(.26,6,5),0x4f9a3e,x,.42,z);if(fl)for(let k=0;k<3;k++)bp(par,SP(.07,5,4),fl,x+Math.cos(k*2.1)*.16,.58,z+Math.sin(k*2.1)*.16)}
function woodpile(par,x,z,ry){for(let r=0;r<3;r++)for(let k=0;k<3-r;k++){const m=bp(par,CY(.13,.13,.95,6),k%2?0x8a5a32:0x9a6a3e,x+Math.cos(ry)*((k-(2-r)/2)*.27),.14+r*.24,z-Math.sin(ry)*((k-(2-r)/2)*.27));m.rotation.set(Math.PI/2,ry,0)}}
function bench(par,x,z,ry){const g=new T.Group();g.position.set(x,0,z);g.rotation.y=ry;bp(g,BX(1.6,.1,.45),0x9a6a3e,0,.45,0);bp(g,BX(1.6,.4,.08),0x9a6a3e,0,.75,-.2);for(const s of[-1,1])bp(g,BX(.1,.45,.4),0x5a3a22,s*.65,.22,0);par.add(g)}
function fenceRow(par,x1,z1,x2,z2,c){const L=Math.hypot(x2-x1,z2-z1),n=Math.max(1,Math.round(L/2)),ry=Math.atan2(x2-x1,z2-z1);for(let i=0;i<=n;i++){const t=i/n;bp(par,BX(.16,1,.16),c||0x6e4a2a,x1+(x2-x1)*t,.5,z1+(z2-z1)*t)}for(const y of[.4,.8]){const m=bp(par,BX(.08,.1,L),c?0xb8b4a8:0x8a5f33,(x1+x2)/2,y,(z1+z2)/2);m.rotation.y=ry}}
function flowers(par,x,z,n,cols){for(let k=0;k<n;k++){const a=k*2.4,r=.25+(k%3)*.18;bp(par,SP(.09,5,4),cols[k%cols.length],x+Math.cos(a)*r,.16,z+Math.sin(a)*r)}bp(par,SP(.32,6,4),0x4f9a3e,x,.1,z,0,0,1,.35,1)}
// ---------- casas (porta virada para +Z local) ----------
// 1. Casa simples de vila: base de pedra, paredes de madeira, varanda, chaminé, lenha, vasos e luminária
function hCottage(o){const w=o.w||4.6,d=o.d||4.2,B=.45,H=2.35,g=new T.Group(),D=new T.Group();
 bp(g,BX(w+.24,B,d+.24),o.stone,0,B/2,0,1);bp(g,BX(w,H,d),o.wall,0,B+H/2,0,1);for(const sx of[-1,1])for(const sz of[-1,1])bp(g,BX(.22,H,.22),o.trim,sx*w/2,B+H/2,sz*d/2);
 gable(g,w,d,1.6,o.roof,B+H,o.wall,.45);bp(g,BX(.7,2.3,.7),o.stone,w*.28,B+H+1.1,-d*.22,1);bp(g,BX(.85,.15,.85),0x5a5a60,w*.28,B+H+2.3,-d*.22);
 const pr=bp(g,BX(2.1,.12,1.25),o.roof,0,2.55,d/2+.55);pr.rotation.x=.28;for(const s of[-1,1])bp(g,BX(.12,2.45,.12),o.trim,s*.9,1.22,d/2+1.05);
 door(D,0,d/2,0,.95,1.85,o.door,o.trim);win(D,-w*.3,B+1.25,d/2,0,.7,.6,o.lit,o.trim,o.sh);win(D,w*.3,B+1.25,d/2,0,.7,.6,0,o.trim,o.sh);win(D,w/2,B+1.25,0,Math.PI/2,.7,.6,o.lit2,o.trim);
 pot(D,-1.3,d/2+.75,0xff7aa8);pot(D,1.35,d/2+.75,0xffe066);woodpile(D,-w/2-.55,-.4,Math.PI/2);lantern(D,.85,d/2+.04,1);return[g,D,Math.max(w,d)*.72]}
// 2. Casa de pedra: pedras de cantos, telhado escuro de quatro águas, janelas maiores, porta reforçada, musgo, escadas, barris e caixas
function hStone(o){const w=o.w||5.2,d=o.d||4.6,H=3.1,g=new T.Group(),D=new T.Group();
 bp(g,BX(w,H,d),o.stone,0,H/2,0,1);for(const sx of[-1,1])for(const sz of[-1,1])for(let k=0;k<4;k++)bp(g,BX(.5,.42,.5),k%2?0xc8c2b4:0x8f897e,sx*(w/2-.2),.3+k*.75,sz*(d/2-.2));
 hip(g,w,d,2.3,o.roofD||0x3a3e48,H,.45);bp(g,BX(.95,2.8,.95),o.stone,-w*.25,H+1.2,-d*.18,1);bp(g,BX(1.1,.18,1.1),0x5a5a60,-w*.25,H+2.65,-d*.18);
 bp(D,BX(1.2,.18,.5),0x5a7a3a,w*.32,H+.12,d/2+.12);bp(D,BX(.9,.5,.08),0x5a7a3a,-w*.38,.3,d/2+.03);bp(D,BX(.08,.45,.7),0x5a7a3a,w/2+.03,.25,d*.2);
 door(D,0,d/2,0,1.05,2.05,0x5a3a20,0x4a4a4e,1);for(const s of[-1,1])win(D,s*w*.31,1.75,d/2,0,.9,.9,s>0?o.lit:0,0x4a4a4e);win(D,-w/2,1.75,0,-Math.PI/2,.9,.9,o.lit2,0x4a4a4e);
 bp(D,BX(1.9,.2,.5),0x9a948a,0,.3,d/2+.95);barrel(D,w/2+.55,d*.25);barrel(D,w/2+.6,d*.25-.75,.9);crate(D,-w/2-.6,d*.3,1,.3);crate(D,-w/2-.65,d*.3-.85,.7,.9);return[g,D,Math.max(w,d)*.72]}
// 3. Casa de comerciante: fachada larga, porta dupla, vitrines, toldo listrado, placa pendurada, bancada de produtos, barris, caixas e sacos
function hMerchant(o){const w=o.w||6,d=o.d||4.8,H=2.9,g=new T.Group(),D=new T.Group();
 bp(g,BX(w,.6,d),o.stone,0,.3,0,1);bp(g,BX(w,H-.6,d),o.wall,0,.6+(H-.6)/2,0,1);bp(g,BX(w+.3,.25,d+.3),o.trim,0,H,0);
 bp(g,MANG,o.roof,0,H+.1,0,1,0,w+.5,1.3,d+.5);hip(g,(w+.5)*.62-.4,(d+.5)*.62-.4,1.2,o.roof,H+1.4,0);
 const aw=o.aw||[0xc8382f,0xf0e6d2];for(let k=0;k<6;k++){const m=bp(D,BX(w*.95/6,.08,1.5),aw[k%2],-w*.95/2+w*.95/12+k*w*.95/6,2.35,d/2+.65);m.rotation.x=.38}for(const s of[-1,1])bp(D,BX(.1,2.1,.1),o.trim,s*w*.45,1.05,d/2+1.3);
 door(D,-.55,d/2,0,.9,2,o.door,o.trim);door(D,.4,d/2,0,.9,2,o.door,o.trim);D.children.splice(D.children.length-1,1);for(const s of[-1,1])win(D,s*w*.33,1.35,d/2,0,1.3,1,o.lit,o.trim);
 bp(D,BX(.1,.1,1),0x2a2a2e,w*.42,2.75,d/2+.5);bp(D,BX(.9,.6,.08),o.sign||0x8a6a3a,w*.42,2.25,d/2+.95);bp(D,SP(.16,6,4),0xd8b040,w*.42,2.25,d/2+1.01,0,0,1,1,.3);
 if(!o.nostall){bp(D,BX(1.8,.12,.8),0x9a6a3e,-w*.2,.85,d/2+2);for(const s of[-1,1])bp(D,BX(.1,.8,.7),0x5a3a22,-w*.2+s*.8,.42,d/2+2);for(let k=0;k<6;k++)bp(D,SP(.13,5,4),[0xe84a3a,0xf0c040,0x6ab04a][k%3],-w*.2-.65+k*.26,1.02,d/2+2+(k%2?.15:-.15))}
 barrel(D,w/2+.5,d/2+.4);crate(D,w/2+.55,-.4,.9,.2);sack(D,w/2+.4,.6);sack(D,-w/2-.4,d/2+.3);lantern(D,-w*.45,d/2+.04,1);return[g,D,Math.max(w,d)*.72]}
// 4. Casa de dois andares: térreo de pedra, andar de madeira com enxaimel, varanda no alto, escada externa, chaminé, floreiras
function hTwo(o){const w=o.w||5,d=o.d||4.6,H1=2.6,H2=2.4,g=new T.Group(),D=new T.Group();
 bp(g,BX(w,H1,d),o.stone,0,H1/2,0,1);bp(g,BX(w+.3,H2,d+.3),o.wall,0,H1+H2/2,0,1);bp(g,BX(w+.45,.2,d+.45),o.trim,0,H1,0);gable(g,w+.3,d+.3,2.2,o.roof,H1+H2,o.wall,.5);bp(g,BX(.75,2.6,.75),o.stone,w*.3,H1+H2+1.3,-d*.15,1);
 const f=d/2+.16;for(const s of[-1,0,1])bp(D,BX(.16,H2,.08),o.trim,s*w*.42,H1+H2/2,f);for(const s of[-1,1]){const m=bp(D,BX(.14,H2*1.15,.08),o.trim,s*w*.21,H1+H2/2,f);m.rotation.z=s*.55}bp(D,BX(w+.3,.14,.08),o.trim,0,H1+H2-.1,f);
 bp(D,BX(w*.6,.14,1),o.trim,0,H1+.05,d/2+.65);for(let k=0;k<5;k++)bp(D,BX(.08,.7,.08),o.trim,-w*.28+k*w*.14,H1+.45,d/2+1.1);bp(D,BX(w*.6,.08,.08),o.trim,0,H1+.82,d/2+1.1);for(const s of[-1,1])bp(D,BX(.14,H1,.14),o.trim,s*w*.29,H1/2,d/2+1.08);
 for(let k=0;k<6;k++)bp(D,BX(.9,.14,.45),0x8a8478,w/2+.55,.14+k*.43,d/2-.4-k*.5);
 door(D,-w*.15,d/2,0,.95,1.95,o.door,o.trim);win(D,w*.25,1.4,d/2,0,.8,.8,o.lit,o.trim,o.sh);win(D,-w*.25,H1+1.2,f,0,.75,.85,0,o.trim,o.sh);win(D,w*.25,H1+1.2,f,0,.75,.85,o.lit2,o.trim,o.sh);win(D,-w/2,1.4,0,-Math.PI/2,.7,.7,0,o.trim);win(D,-w/2-.16,H1+1.2,0,-Math.PI/2,.7,.7,o.lit,o.trim);
 for(const s of[-1,1]){bp(D,BX(.9,.2,.25),0x7a5a36,s*w*.25,H1+.6,f+.15);for(let k=0;k<3;k++)bp(D,SP(.08,5,4),[0xff7aa8,0xffe066,0xff5a5a][k],s*w*.25-.25+k*.25,H1+.78,f+.15)}
 pot(D,w*.05,d/2+1.5,0xff7aa8);pot(D,-w*.38,d/2+1.4,0xffffff);return[g,D,Math.max(w,d)*.74]}
// 5. Casa de família rica: reboco claro, colunas, frontão, telhado com águas-furtadas, janelas amplas com venezianas, jardim com cerca e caminho
function hRich(o){const w=o.w||7,d=o.d||5.6,H=3.6,g=new T.Group(),D=new T.Group();
 bp(g,BX(w+.3,.5,d+.3),0xb8b2a6,0,.25,0,1);bp(g,BX(w,H,d),o.wall,0,.5+H/2,0,1);bp(g,BX(w+.35,.28,d+.35),0xd8d0c0,0,.5+H,0);hip(g,w,d,2.6,o.roof,.5+H+.14,.5);
 for(const s of[-1,1]){const dg=new T.Group();dg.position.set(s*w*.25,.5+H+.95,d/2-.25);bp(dg,BX(1,1,1),o.wall,0,0,0,1);gable(dg,1,1,.7,o.roof,.5,o.wall,.12);g.add(dg)}
 for(const s of[-1,1]){bp(g,CY(.22,.26,H,10),0xf0ebe0,s*1.15,.5+H/2,d/2+1.1,1);bp(g,BX(.6,.3,.6),0xd8d0c0,s*1.15,.65,d/2+1.1)}bp(g,BX(3,.3,1.6),0xd8d0c0,0,.5+H-.1,d/2+.75);bp(g,PRISM,0xf0ebe0,0,.5+H+.05,d/2+.75,1,0,1.6,.9,3).rotation.y=Math.PI/2;
 door(D,-.55,d/2,0,.95,2.4,o.door,0xd8b040);door(D,.42,d/2,0,.95,2.4,o.door,0xd8b040);for(const s of[-1,1])for(const fl of[0,1])win(D,s*w*.34,1.6+fl*1.7,d/2,0,1.1,1.1,(s+fl)%2?o.lit:0,0xf0ebe0,o.sh||0x3e5f8a);win(D,w/2,1.6,0,Math.PI/2,1,1,o.lit2,0xf0ebe0,o.sh||0x3e5f8a);
 bp(D,BX(w+1,.06,3.2),0x5fae4a,0,.03,d/2+2.6);bp(D,BX(1.3,.08,3.2),0xc8c0b0,0,.05,d/2+2.6);for(const s of[-1,1]){fenceRow(D,s*.9,d/2+4.2,s*(w/2+.5),d/2+4.2,1);fenceRow(D,s*(w/2+.5),d/2+4.2,s*(w/2+.5),d/2+.6,1);flowers(D,s*w*.3,d/2+2.3,7,[0xff7aa8,0xffffff,0xc060ff]);bp(D,IC(.5,0),0x3f8f3e,s*(w/2-.2),.4,d/2+3.6)}
 lantern(D,-1.1,d/2+4.25);lantern(D,1.1,d/2+4.25);return[g,D,Math.max(w,d)*.72]}
// 6. Casa abandonada: madeira gasta, telhado com buraco e caibros à mostra, janelas tapadas, porta torta, pedras e mato
function hRuin(o){const w=o.w||4.4,d=o.d||4,H=2.3,wc=0x7a6e60,g=new T.Group(),D=new T.Group();
 bp(g,BX(w+.2,.35,d+.2),0x7a7a74,0,.17,0,1);bp(g,BX(w,H,d),wc,0,.35+H/2,0,1);bp(g,PRISM,wc,0,.35+H,0,1,0,w,1.4,d);
 const a=Math.atan2(1.4,d/2),L=(d/2+.4)/Math.cos(a);{const m=bp(g,BX(w+.6,.16,L),0x5a524a,0,.35+H+1.4-(L/2)*Math.sin(a)+.08,(L/2)*Math.cos(a),1);m.rotation.x=a}
 for(const s of[-1,1]){const m=bp(g,BX((w+.6)*.42,.16,L),0x5a524a,s*(w+.6)*.29,.35+H+1.4-(L/2)*Math.sin(a)+.08,-(L/2)*Math.cos(a),1);m.rotation.x=-a}for(let k=0;k<3;k++){const m=bp(g,BX(.1,.1,L),0x4a3a2a,-.4+k*.4,.35+H+1.4-(L/2)*Math.sin(a)+.02,-(L/2)*Math.cos(a));m.rotation.x=-a}
 const dr=door(D,.3,d/2,0,.9,1.75,0x4a3a2a,0x3a3028);D.children.forEach(c=>{if(Math.abs(c.position.x-.3)<.6&&c.position.y>.3){c.rotation.z=.08}});
 for(const s of[-1,1]){const x=s>0?w/2:-w*.25,z=s>0?0:d/2,ry=s>0?Math.PI/2:0;bp(D,BX(.75,.7,.06),0x1a1a1e,x+Math.sin(ry)*.02,1.35,z+Math.cos(ry)*.02).rotation.y=ry;for(const t of[-1,1]){const m=bp(D,BX(.95,.13,.08),0x8a7a62,x+Math.sin(ry)*.06,1.35,z+Math.cos(ry)*.06);m.rotation.set(0,ry,t*.6)}}
 for(let k=0;k<5;k++)bp(D,DO(.2+k%3*.1),0x8a8a90,-w/2-.4+k*.9,.12,d/2+1.2+(k%2)*.6);for(const p of[[w/2+.5,-d/2],[-w/2-.6,0],[.9,d/2+.7]])bp(D,IC(.55,0),0x4f7a3a,p[0],.35,p[1],0,0,1,.7,1);const pl=bp(D,BX(1.6,.08,.25),0x7a6a52,-1,.05,d/2+1.5);pl.rotation.y=.5;return[g,D,Math.max(w,d)*.72]}
