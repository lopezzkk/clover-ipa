

// nenhum NPC pode ficar dentro de casas, muros ou árvores: procura o ponto livre mais próximo
{const blocked=(x,z)=>SOL.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+1.2:Math.abs(x-o.x)<o.hx+1.2&&Math.abs(z-o.z)<o.hz+1.2)||NPCS.some(n=>n._fx&&Math.hypot(n.g.position.x-x,n.g.position.z-z)<1.5);
 for(const n of NPCS){const p=n.g.position;if(blocked(p.x,p.z)){let ok=null;for(let r=1;r<14&&!ok;r+=.75)for(let k=0;k<16&&!ok;k++){const a=k/16*6.2832,x=p.x+Math.cos(a)*r,z=p.z+Math.sin(a)*r;if(!blocked(x,z))ok=[x,z]}if(ok){p.x=ok[0];p.z=ok[1]}}n._fx=1}}
{for(const k in chunks){const g=chunks[k];for(const c of g.children){if(NPCS.some(n=>n.g===c))continue;c.traverse(o=>{o.updateMatrix();o.matrixAutoUpdate=false})}}}
// Agrupa o cenário estático de cada bloco (casas, muros, árvores, cercas, pedras) por material: centenas de objetos viram poucas malhas.
// Objetos com textura, transparência, escondidos ou com NPC continuam separados. LOD: contornos e detalhes pequenos somem à distância.
function mergeChunks(){const M={b:0,a:0};const v=new T.Vector3(),nm=new T.Matrix3(),bx=new T.Box3(),sz=new T.Vector3();
 const sig=m=>m===olm?'olm':[m.type,m.emissive?m.emissive.getHex():0,m.side,m.gradientMap?1:0,m.flatShading?1:0].join('|');
 const vcm=m=>{const k=sig(m);if(k=='olm')return olm;if(!VCM[k]){const c=m.clone();c.color.setHex(0xffffff);c.vertexColors=true;c._keep=1;VCM[k]=c}return VCM[k]};
 const okMat=m=>m&&!Array.isArray(m)&&!m.transparent&&!m.map&&!m.wireframe&&!m.vertexColors&&(m.type=='MeshToonMaterial'||m.type=='MeshBasicMaterial'||m.type=='MeshLambertMaterial'||m.type=='MeshStandardMaterial');
 for(const k in chunks){const g=chunks[k];try{g.updateMatrixWorld(true);const B={},gone=[];
  for(const c of g.children.slice()){if(NPCS.some(n=>n.g===c))continue;let ok=true;const ms=[];c.traverse(o=>{if(!ok)return;if(!o.visible){ok=false;return}if(o.isInstancedMesh||o.isSkinnedMesh||o.isPoints||o.isLine||o.isSprite||o.isLOD){ok=false;return}if(o.isMesh){if(!okMat(o.material)||!o.geometry||!o.geometry.attributes||!o.geometry.attributes.position){ok=false;return}ms.push(o)}});
   if(!ok||!ms.length)continue;bx.setFromObject(c);bx.getSize(sz);const det=(c.userData&&c.userData.lod=='d')||Math.max(sz.x,sz.y,sz.z)<2.6;
   for(const o of ms){if(det)o.castShadow=false;const ol=o.material===olm,key=sig(o.material)+'|'+(o.castShadow?1:0)+(o.receiveShadow?1:0)+'|'+(ol?'o':det?'d':'b');(B[key]=B[key]||{m:o.material,cs:o.castShadow,rs:o.receiveShadow,cl:ol?'o':det?'d':'b',L:[]}).L.push(o)}gone.push(c);M.b+=ms.length}
  g._lo=[];g._ld=[];
  for(const key in B){const b=B[key];let nv=0,ni=0;for(const o of b.L){const ge=o.geometry,pc=ge.attributes.position.count;nv+=pc;ni+=ge.index?ge.index.count:pc}
   const pos=new Float32Array(nv*3),nor=new Float32Array(nv*3),col=new Float32Array(nv*3),idx=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;
   for(const o of b.L){const ge=o.geometry,P2=ge.attributes.position,N=ge.attributes.normal,mw=o.matrixWorld,flip=mw.determinant()<0,mc=o.material.color||{r:1,g:1,b:1};nm.getNormalMatrix(mw);for(let i=0;i<P2.count;i++){col[(vo+i)*3]=mc.r;col[(vo+i)*3+1]=mc.g;col[(vo+i)*3+2]=mc.b}
    for(let i=0;i<P2.count;i++){v.fromBufferAttribute(P2,i).applyMatrix4(mw);pos[(vo+i)*3]=v.x;pos[(vo+i)*3+1]=v.y;pos[(vo+i)*3+2]=v.z;if(N)v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();else v.set(0,1,0);nor[(vo+i)*3]=v.x;nor[(vo+i)*3+1]=v.y;nor[(vo+i)*3+2]=v.z}
    const cnt=ge.index?ge.index.count:P2.count,gi=i=>ge.index?ge.index.getX(i):i;for(let i=0;i+2<cnt;i+=3){const a=gi(i)+vo,b2=gi(i+1)+vo,c2=gi(i+2)+vo;idx[io++]=a;if(flip){idx[io++]=c2;idx[io++]=b2}else{idx[io++]=b2;idx[io++]=c2}}vo+=P2.count}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(pos,3));geo.setAttribute('normal',new T.BufferAttribute(nor,3));if(b.m!==olm)geo.setAttribute('color',new T.BufferAttribute(col,3));geo.setIndex(new T.BufferAttribute(io<idx.length?idx.subarray(0,io):idx,1));geo.computeBoundingSphere();geo._keep=1;
   const mm=new T.Mesh(geo,vcm(b.m));mm.castShadow=b.cs;mm.receiveShadow=b.rs;mm.matrixAutoUpdate=false;mm.updateMatrix();g.add(mm);M.a++;if(b.cl=='o')g._lo.push(mm);else if(b.cl=='d')g._ld.push(mm)}
  for(const c of gone)g.remove(c)}catch(e){g._lo=g._lo||[];g._ld=g._ld||[]}}
 MERGED.b=M.b;MERGED.a=M.a}
const MERGED={b:0,a:0},VCM={};try{mergeChunks()}catch(e){}
// ---------- Jogador ----------
// ================= APARÊNCIA (catálogos fáceis de ampliar) =================
// Para adicionar um modelo novo, basta incluir {n:'Nome',b:(p,g)=>{...}} na lista certa.
const LOOK0={body:0,hair:0,hc:0x2a2018,top:0,tc:null,pants:0,pc:0x3a2f2a,eyes:0,ec:0x2a6fd0,scar:0,beard:0,bc:null,sk:0xf1c9a0};
function lkAdd(g,geo,m,x,y,z,out){const e=new T.Mesh(geo,m);e.position.set(x,y,z);if(out){e.castShadow=true;const b=new T.Mesh(geo,olm);b.scale.setScalar(1.07);e.add(b)}g.add(e);return e}
function lkCap(p,g){if(p.hshape=='rb')return lkCapRB(p,g);const c=lkAdd(g,new T.SphereGeometry(.26,16,12,0,6.3,0,1.8),p.mH,0,1.97,-.02);c.rotation.x=-.25;return c}
const HAIRS=[
 {n:'Espetado',b:(p,g)=>{lkCap(p,g);for(let i=0;i<9;i++){const a=i/9*6.28,c=lkAdd(g,new T.ConeGeometry(.075,.3,5),p.mH,Math.sin(a)*.17,2.2,Math.cos(a)*.17-.03);c.rotation.set(Math.cos(a)*.7,0,-Math.sin(a)*.7)}lkAdd(g,new T.ConeGeometry(.09,.4,5),p.mH,0,2.3,0)}},
 {n:'Curto',b:(p,g)=>{lkCap(p,g);const f=lkAdd(g,new T.BoxGeometry(.3,.07,.1),p.mH,0,2.13,.17);f.rotation.z=.15}},
 {n:'Longo',b:(p,g)=>{lkCap(p,g);const b=lkAdd(g,new T.CylinderGeometry(.21,.15,.65,12),p.mH,0,1.75,-.12);b.scale.z=.6;for(const s of[-1,1]){const l=lkAdd(g,new T.CylinderGeometry(.06,.04,.42,6),p.mH,s*.22,1.82,.04);l.rotation.z=s*.08}const f=lkAdd(g,new T.BoxGeometry(.32,.06,.1),p.mH,0,2.12,.17);f.rotation.z=-.1}},
 {n:'Rabo de cavalo',b:(p,g)=>{lkCap(p,g);lkAdd(g,new T.SphereGeometry(.1,8,8),p.mH,0,2.18,-.21);const t=lkAdd(g,new T.CylinderGeometry(.065,.025,.45,7),p.mH,0,1.92,-.3);t.rotation.x=.35}},
 {n:'Moicano',b:(p,g)=>{const c=lkAdd(g,new T.SphereGeometry(.245,14,10,0,6.3,0,1.2),p.mH,0,1.98,0);c.scale.set(.35,1,1);for(let i=0;i<6;i++){const k=lkAdd(g,new T.ConeGeometry(.06,.24-i*.015,5),p.mH,0,2.2+Math.cos(i*.45)*.04,.17-i*.075);k.rotation.x=-.35-i*.12}}},
 {n:'Bagunçado',b:(p,g)=>{lkCap(p,g);for(let i=0;i<16;i++){const a=i*2.4,r=.08+(i%4)*.045,b=lkAdd(g,new T.SphereGeometry(.07+(i%3)*.015,7,6),p.mH,Math.sin(a)*r,2.17+(.2-r)*.4,Math.cos(a)*r-.02)}}},
 {n:'Topete',b:(p,g)=>{lkCap(p,g);const q=lkAdd(g,new T.SphereGeometry(.17,12,10),p.mH,0,2.2,.12);q.scale.set(1.15,.62,1.2);q.rotation.x=-.45}},
 {n:'Careca',b:()=>{}}];
const EYES=[
 {n:'Normal',w:[1,1.3],i:[1,1.3],br:.15,by:2.05,hl:1},
 {n:'Determinado',w:[1.15,.85],i:[1,1],br:.45,by:2.03,hl:1},
 {n:'Grande',w:[1.25,1.6],i:[1.2,1.6],br:.1,by:2.07,hl:2},
 {n:'Sério',w:[1.2,.45],i:[1,.45],br:.02,by:2.02,hl:0},
 {n:'Brilhante',w:[1.2,1.5],i:[1.15,1.5],br:-.12,by:2.07,hl:3},
 {n:'Feliz',arc:1,br:-.1,by:2.06}];
function buildEyes(p,g,list,E){for(const s of[-1,1]){if(E.arc){const a=lkAdd(g,new T.TorusGeometry(.035,.009,5,10,Math.PI),p.mE,s*.085,1.95,.213);list.push(a)}else{const w=lkAdd(g,new T.SphereGeometry(.062,10,8),p.mW2,s*.085,1.96,.195);w.scale.set(E.w[0],E.w[1],.45);const ir=lkAdd(g,new T.SphereGeometry(.04,10,8),p.mE,s*.085,1.955,.212);ir.scale.set(E.i[0],E.i[1],.4);list.push(ir);
  for(let h=0;h<E.hl;h++)lkAdd(g,new T.SphereGeometry(h?.008:.013,6,6),p.mW2,s*.085+(h?-.012:.012),1.978-(h?.03:0),.222)}
 const b=lkAdd(g,new T.BoxGeometry(.09,.018,.012),p.mH,s*.085,E.by,.205);b.rotation.z=-s*E.br}}
const SCARS=[
 {n:'Nenhuma',b:()=>{}},
 {n:'Corte no olho',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.014,.15,.012),p.mScar,.09,1.96,.232);c.rotation.z=.15}},
 {n:'Bochecha',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.013,.1,.012),p.mScar,-.13,1.89,.2);c.rotation.set(0,-.55,.6)}},
 {n:'Cruz',b:(p,g)=>{for(const r of[.7,-.7]){const c=lkAdd(g,new T.BoxGeometry(.012,.09,.012),p.mScar,.125,1.885,.2);c.rotation.set(0,.55,r)}}},
 {n:'Testa',b:(p,g)=>{const c=lkAdd(g,new T.BoxGeometry(.13,.013,.012),p.mScar,0,2.1,.207);c.rotation.z=.12}},
 {n:'Nariz',b:(p,g)=>{lkAdd(g,new T.BoxGeometry(.14,.013,.012),p.mScar,0,1.915,.238)}}];
const BEARDS=[
 {n:'Sem barba',b:()=>{}},
 {n:'Bigode',b:(p,g)=>{for(const s of[-1,1]){const m=lkAdd(g,new T.BoxGeometry(.06,.02,.02),p.mB,s*.03,1.875,.228);m.rotation.z=-s*.2}}},
 {n:'Cavanhaque',b:(p,g)=>{for(const s of[-1,1]){const m=lkAdd(g,new T.BoxGeometry(.05,.018,.02),p.mB,s*.028,1.876,.228);m.rotation.z=-s*.2}lkAdd(g,new T.BoxGeometry(.06,.07,.03),p.mB,0,1.8,.205)}},
 {n:'Barba cheia',b:(p,g)=>{const b=lkAdd(g,new T.SphereGeometry(.25,16,10,0,6.3,1.7,1.0),p.mB,0,1.98,.01);b.scale.set(1.02,1.1,1);lkAdd(g,new T.BoxGeometry(.11,.024,.02),p.mB,0,1.876,.229)}},
 {n:'Barba curta',b:(p,g)=>{const b=lkAdd(g,new T.SphereGeometry(.243,16,10,0,6.3,1.75,.9),p.mBs,0,1.98,.004);b.scale.set(1,1.1,1)}}];
const TOPS=[
 {n:'Túnica',b:()=>{},sl:'t'},
 {n:'Jaqueta',sl:'t',b:(p,g)=>{for(const s of[-1,1]){const l=lkAdd(g,new T.BoxGeometry(.09,.5,.03),p.mDark,s*.09,1.4,.255);l.rotation.z=s*.18}for(let i=0;i<3;i++)lkAdd(g,new T.SphereGeometry(.022,6,6),p.mGold,.02,1.52-i*.14,.268);const c=lkAdd(g,new T.TorusGeometry(.17,.035,6,16),p.mDark,0,1.66,0);c.rotation.x=Math.PI/2}},
 {n:'Camisa nobre',sl:'t',b:(p,g)=>{for(let i=0;i<3;i++){const r=lkAdd(g,new T.ConeGeometry(.06,.09,6),p.mW2,0,1.58-i*.07,.262);r.rotation.x=Math.PI}const c=lkAdd(g,new T.TorusGeometry(.16,.04,6,16),p.mW2,0,1.68,0);c.rotation.x=Math.PI/2}},
 {n:'Colete',sl:'w',b:(p,g)=>{if(p.bshape=='rb'){const D=p.tdim,q=p.tq;lkAdd(q,rbox(D.w*1.05,D.h*.92,D.D*1.1,D.r*1.05,D.tb,6),p.mVest,0,-D.h*.02,0,1);lkAdd(q,rbox(D.w*.26,D.h*.92,.03,.012,1,3),p.mT,0,-D.h*.02,D.D*.55+.008);for(let i=0;i<3;i++)lkAdd(q,new T.SphereGeometry(.02,6,6),p.mGold,.075,D.h*.25-i*.12,D.D*.55+.02);return}if(p.bshape=='box'){const D=p.tdim,q=p.tq,H=D.h*.94;for(const sx of[-1,1]){lkAdd(q,new T.BoxGeometry(D.rt*.62,H,.03),p.mVest,sx*D.rt*.62,0,D.d+.017,1);lkAdd(q,new T.BoxGeometry(.03,H,D.d*2+.06),p.mVest,sx*(D.rt+.017),0,0,1)}lkAdd(q,new T.BoxGeometry(D.rt*2+.06,H,.03),p.mVest,0,0,-D.d-.017,1);for(let i=0;i<3;i++)lkAdd(q,new T.BoxGeometry(.035,.035,.02),p.mGold,.06,D.h*.25-i*.12,D.d+.04);return}const v=lkAdd(g,new T.CylinderGeometry(.355,.285,.58,16,1,true,.5,5.28),p.mVest,0,1.37,0,1);v.scale.z=.8;v.material.side=T.DoubleSide;for(let i=0;i<3;i++)lkAdd(g,new T.SphereGeometry(.02,6,6),p.mGold,.08,1.5-i*.12,.26)}},
 {n:'Armadura leve',sl:'t',b:(p,g)=>{const pl=lkAdd(g,new T.BoxGeometry(.48,.42,.09),p.mArmor,0,1.42,.2,1);pl.rotation.x=.08;lkAdd(g,new T.BoxGeometry(.5,.05,.1),p.mGold,0,1.62,.22)}},
 {n:'Regata',sl:'s',b:()=>{}}];
const PANTS=[{n:'Calça reta'},{n:'Bermuda',lo:'s'},{n:'Calça larga',wide:1},{n:'Botas altas',boots:1}];
const HCOL=[0x111111,0xf0f0f0,0xf0d050,0xd0402a,0x3f8cff,0x2e8b57,0x6a3fd0,0x8a8a8a,0x6b4423,0x2a2018,0xff8ac0,0x3dff6a],TCOL=[0xa9825a,0x1c1c1c,0xf0ece0,0x7a1f1f,0x2a4a8a,0x2f6a3a,0x6b3fa0,0xe0b020,0x8a8a8a,0x4a2f20],PCOL=[0x3a2f2a,0x1c1c1c,0xf0ece0,0x2a3f6a,0x4a5a3a,0x6b4423,0x7a1f1f,0x8a8a8a],ECOL=[0x2a6fd0,0x3ca64a,0xd03030,0xb060e0,0xe8b94a,0x222222,0x8a8a8a,0x5ce0ff],SKC=[0xf6dcc0,0xf1c9a0,0xd8a67a,0xb07a50,0x8a5a3a,0x5a3a26];
// ===== SISTEMA DE MODELOS CORPORAIS 3D (estilo boneco arredondado) =====
// Cada parte (cabeça, pescoço, tronco, quadril, ombro, braço, antebraço, mão, coxa, perna, pé) é um bloco arredondado próprio,
// com largura (w), altura/comprimento (h/l), profundidade (d), arredondamento (r) e afunilamento (tb = largura embaixo / em cima).
// Hierarquia: quadril→tronco→pescoço→cabeça, ombro→cotovelo→punho→mão, quadril→joelho→pé (os grupos que as animações já movem).
// Para trocar por um modelo detalhado no futuro, substitua a geometria da parte em buildBody() por uma malha importada (GLTF),
// mantendo a mesma articulação como pai.
const RBC={};
function rbox(w,h,d,r,tb,seg){const key=[w,h,d,r,tb||1,seg||6].join('|');if(RBC[key])return RBC[key];return (RBC[key]=rbox0(w,h,d,r,tb,seg),RBC[key]._keep=1,RBC[key])}
function rbox0(w,h,d,r,tb,seg){const key=[w,h,d,r,tb||1,seg||6].join('|');const s=seg||6,g=new T.BoxGeometry(w,h,d,s,s,s),P=g.attributes.position,N=g.attributes.normal,hx=w/2,hy=h/2,hz=d/2;r=Math.min(r,hx*.98,hy*.98,hz*.98);tb=tb||1;
 for(let i=0;i<P.count;i++){let x=P.getX(i),y=P.getY(i),z=P.getZ(i);const ix=Math.max(-(hx-r),Math.min(hx-r,x)),iy=Math.max(-(hy-r),Math.min(hy-r,y)),iz=Math.max(-(hz-r),Math.min(hz-r,z));let dx=x-ix,dy=y-iy,dz=z-iz;const L=Math.hypot(dx,dy,dz);
  if(L>1e-6){dx/=L;dy/=L;dz/=L;x=ix+dx*r;y=iy+dy*r;z=iz+dz*r;N.setXYZ(i,dx,dy,dz)}const k=tb+(1-tb)*((y+hy)/h);P.setXYZ(i,x*k,y,z)}
 P.needsUpdate=true;g.userData={rb:[w,h,d,r,tb]};return RBC[key]=g}
const BODIES=[
 {n:'Humano',d:'Padrão',t:'Modelo de referência: cabeça quadrada arredondada, ombros cheios, tronco reto, braços e pernas retos e proporcionais.',p:{},
  s:{hd:{w:.5,h:.5,d:.46,r:.42},nk:{r:.08,h:.08},to:{w:.64,h:.6,d:.34,r:.1,tb:.94},hp:{w:.58,h:.2,d:.32},
   ua:{w:.17,d:.17,l:.32},fa:{w:.13,d:.13,l:.29},hn:{w:.13,h:.14,d:.11},th:{w:.21,d:.21,l:.45},sh:{w:.19,d:.19,l:.42},ft:{w:.2,h:.1,l:.3},lg:.145}},
 {n:'Corpo Anime',d:'Estilizado',t:'Corpo esguio de anime: tronco em V com cintura fina, braços finos e pernas bem longas, cabeça menor e harmoniosa.',p:{Lf:1.15,W:.85,Hs:.95,det:1},
  s:{hd:{w:.44,h:.47,d:.42,r:.4},nk:{r:.06,h:.1},to:{w:.52,h:.58,d:.27,r:.09,tb:.74},hp:{w:.4,h:.18,d:.26},
   ua:{w:.12,d:.12,l:.33},fa:{w:.1,d:.1,l:.31},hn:{w:.1,h:.12,d:.09},th:{w:.16,d:.16,l:.55},sh:{w:.14,d:.14,l:.52},ft:{w:.15,h:.09,l:.28},lg:.105}},
 {n:'Blocado',d:'Clássico',t:'Inspirado nos clássicos personagens de blocos: cabeça e tronco retangulares, braços largos em blocos colados ao tronco e pernas curtas.',p:{blk:1},
  s:{hd:{w:.46,h:.44,d:.44,r:.12},nk:{r:.1,h:.03},to:{w:.72,h:.66,d:.36,r:.035},hp:{w:.7,h:.14,d:.35},
   ua:{w:.27,d:.27,l:.33,blk:1},fa:{w:.27,d:.27,l:.31},hn:{w:.27,h:.06,d:.27},th:{w:.33,d:.32,l:.3,blk:1},sh:{w:.33,d:.32,l:.3},ft:{w:.33,h:.08,l:.34},lg:.18,box:1}},
 {n:'Corpo Alto',d:'Alongado',t:'Pescoço, tronco, braços e pernas alongados separadamente, mantendo a cabeça proporcional.',p:{Lf:1.3,Th:1.25,W:.9,Al:1.3},
  s:{hd:{w:.46,h:.5,d:.44,r:.4},nk:{r:.075,h:.15},to:{w:.6,h:.76,d:.31,r:.09,tb:.92},hp:{w:.54,h:.22,d:.3},
   ua:{w:.155,d:.155,l:.42},fa:{w:.12,d:.12,l:.38},hn:{w:.12,h:.15,d:.1},th:{w:.19,d:.19,l:.6},sh:{w:.17,d:.17,l:.56},ft:{w:.19,h:.1,l:.31},lg:.14}},
 {n:'Corpo Musculoso',d:'Forte',t:'Ombros enormes e redondos, peito largo em V, peitoral e abdômen marcados, braços e antebraços grossos, coxas fortes.',p:{W:1.35,At:1.6,Lt:1.35,mus:1},
  s:{hd:{w:.48,h:.5,d:.46,r:.4},nk:{r:.13,h:.07},to:{w:.84,h:.66,d:.42,r:.14,tb:.66},hp:{w:.56,h:.22,d:.36},
   ua:{w:.27,d:.25,l:.33,sh:.24},fa:{w:.21,d:.2,l:.3},hn:{w:.17,h:.16,d:.16},th:{w:.27,d:.26,l:.46},sh:{w:.23,d:.23,l:.42},ft:{w:.25,h:.12,l:.33},lg:.16,mus:1}},
 {n:'Corpo Chibi',d:'Pequeno',t:'Cabeça enorme e arredondada com olhos grandes e bochechas rosadas, corpinho pequeno, bracinhos e perninhas curtinhos.',p:{Lf:.55,Th:.75,Hs:1.7,Al:.7},
  s:{hd:{w:.8,h:.72,d:.7,r:.62},nk:{r:.07,h:.02},to:{w:.44,h:.36,d:.3,r:.12,tb:1.05},hp:{w:.42,h:.12,d:.29},
   ua:{w:.12,d:.12,l:.15},fa:{w:.11,d:.11,l:.12},hn:{w:.13,h:.13,d:.12},th:{w:.17,d:.17,l:.15},sh:{w:.16,d:.16,l:.13},ft:{w:.19,h:.12,l:.26},lg:.11,blush:1}},
 {n:'Corpo Robusto',d:'Grande',t:'Tronco largo e barrigudo, braços e pernas grossos e fofinhos, cabeça um pouco mais larga. Visual cartunesco.',p:{W:1.5,Lt:1.4,At:1.3,fat:1},
  s:{hd:{w:.54,h:.5,d:.48,r:.44},nk:{r:.12,h:.05},to:{w:.84,h:.68,d:.56,r:.24,tb:1.08},hp:{w:.74,h:.2,d:.5},
   ua:{w:.23,d:.22,l:.31,sh:.17},fa:{w:.19,d:.18,l:.28},hn:{w:.16,h:.16,d:.14},th:{w:.29,d:.28,l:.42},sh:{w:.25,d:.25,l:.4},ft:{w:.25,h:.11,l:.31},lg:.19,fat:1}},
 {n:'Corpo Esbelto',d:'Estreito',t:'Tronco e ombros estreitos, pescoço fino, braços e pernas finos, mãos e pés menores.',p:{W:.7,At:.65,Lt:.7,Lf:1.08},
  s:{hd:{w:.43,h:.48,d:.42,r:.4},nk:{r:.055,h:.12},to:{w:.5,h:.6,d:.26,r:.08,tb:.9},hp:{w:.44,h:.2,d:.25},
   ua:{w:.12,d:.12,l:.33},fa:{w:.095,d:.095,l:.31},hn:{w:.1,h:.12,d:.085},th:{w:.15,d:.15,l:.5},sh:{w:.13,d:.13,l:.47},ft:{w:.15,h:.085,l:.27},lg:.105}}];
// Cabelo base em formato de capacete, acompanhando a cabeça arredondada (coordenadas da cabeça padrão, centro y 1.95)
function lkCapRB(p,g){const m=p.mH;lkAdd(g,rbox(.52,.17,.52,.07,1,5),m,0,2.16,-.005,1);lkAdd(g,rbox(.52,.34,.2,.07,1,5),m,0,2.02,-.165,1);for(const s of[-1,1])lkAdd(g,rbox(.05,.2,.34,.025,1,4),m,s*.255,2.06,-.07,1)}
function bodySVG(B){const d=k=>B[k]==null?1:B[k],W=d('W'),Th=d('Th'),Hs=d('Hs'),At=d('At'),Lt=d('Lt'),Lf=d('Lf'),blk=B.blk;const tw=16*W,th=17*Th,lh=18*Lf,hr=7.5*Hs,base=58,hip=base-lh,neck=hip-th,hc=neck-hr*.95,cx=24,aw=4.2*At,lw=4.6*Lt;let g='';
 g+='<rect x="'+(cx-tw/2+.5)+'" y="'+hip+'" width="'+(lw)+'" height="'+lh+'" rx="'+(blk?0:2)+'"/><rect x="'+(cx+tw/2-lw-.5)+'" y="'+hip+'" width="'+lw+'" height="'+lh+'" rx="'+(blk?0:2)+'"/>';
 g+='<rect x="'+(cx-tw/2-aw-.5)+'" y="'+(neck+1)+'" width="'+aw+'" height="'+(th*.95*d('Al'))+'" rx="'+(blk?0:2)+'"/><rect x="'+(cx+tw/2+.5)+'" y="'+(neck+1)+'" width="'+aw+'" height="'+(th*.95*d('Al'))+'" rx="'+(blk?0:2)+'"/>';
 g+=B.fat?'<ellipse cx="'+cx+'" cy="'+(neck+th*.55)+'" rx="'+(tw/2+2)+'" ry="'+(th*.6)+'"/>':'<rect x="'+(cx-tw/2)+'" y="'+neck+'" width="'+tw+'" height="'+(th+1)+'" rx="'+(blk?0:3)+'"/>';
 g+=blk?'<rect x="'+(cx-hr)+'" y="'+(hc-hr)+'" width="'+(hr*2)+'" height="'+(hr*2)+'"/>':'<circle cx="'+cx+'" cy="'+hc+'" r="'+hr+'"/>';
 return '<svg viewBox="0 0 48 62"><ellipse cx="24" cy="59" rx="15" ry="2.5" fill="#3dff6a55"/><g fill="#e8e4dc" stroke="#9aa59c" stroke-width=".6">'+g+'</g>'+(B.mus?'<path d="M'+(cx-5)+' '+(neck+6)+'h10M'+cx+' '+(neck+4)+'v10" stroke="#9aa59c" stroke-width=".8"/>':'')+'</svg>'}
function bodySetup(p){const R=p.root,J=new Set();p.legs.forEach(l=>J.add(l[0]));p.arms.forEach(a=>J.add(a[0]));p.h0=R.scale.x||1;
 const bR=new T.Group(),tspace=new T.Group(),pspace=new T.Group(),tq=new T.Group(),hj=new T.Group(),hs=new T.Group(),hH=new T.Group(),hF=new T.Group();
 R.add(bR,tspace,pspace,tq,hj);hj.add(hs);hs.add(hH,hF);hH.add(p.hg);hF.add(p.fg);p.hg.position.y=-1.95;p.fg.position.y=-1.95;tspace.add(p.tg);
 p.mouth=new T.Mesh(new T.BoxGeometry(.05,.01,.01),mat(0x7a3a2a));p.mouth.position.set(0,-.095,.226);hF.add(p.mouth);
 Object.assign(p,{bR,tspace,pspace,tq,hj,hs,hH,hF,bm:[],J,bootS:false});
 for(const c of R.children.slice()){if(J.has(c)||c===bR||c===tspace||c===pspace||c===tq||c===hj)continue;
  if(c.isMesh){const gt=c.geometry&&c.geometry.type;if(c===p.cp||gt==='TorusGeometry'){R.remove(c);tspace.add(c)}else if(gt==='CylinderGeometry'&&Math.abs(c.position.y-1.02)<.03){R.remove(c);pspace.add(c)}else R.remove(c)}
  else{R.remove(c);tspace.add(c)}}
 const strip=g=>{for(const c of g.children.slice())if(c.isMesh){if(c.geometry&&c.geometry.type==='CylinderGeometry'&&Math.abs(c.position.y+.3)<.02&&c.material===p.mSh)p.bootS=true;g.remove(c)}else if(!c.isGroup||!p.arms.some(a=>a[1]===c)&&!p.legs.some(l=>l[1]===c))c.userData.att=1};
 for(const a of p.arms){strip(a[0]);strip(a[1])}for(const l of p.legs){strip(l[0]);strip(l[1])}}
function bodyAdopt(p){const R=p.root;for(const c of R.children.slice()){if(p.J.has(c)||c===p.bR||c===p.tspace||c===p.pspace||c===p.tq||c===p.hj)continue;R.remove(c);(c.isMesh&&c.geometry&&c.geometry.type==='CylinderGeometry'&&Math.abs(c.position.y-1.02)<.03?p.pspace:p.tspace).add(c)}}
function buildBody(p,bi){const B=BODIES[bi]||BODIES[0],S=B.s;while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m)}
 const part=(par,geo,mtl,x,y,z,fl,out)=>{const e=new T.Mesh(geo,mtl);e.position.set(x||0,y||0,z||0);e.castShadow=true;if(out!==0){const o=new T.Mesh(geo,olm);o.scale.setScalar(1.05);e.add(o)}if(fl)Object.assign(e.userData,fl);par.add(e);p.bm.push(e);return e},
 sph=(r,a,b)=>new T.SphereGeometry(r,a||12,b||10),cyl=(r1,r2,h,n)=>new T.CylinderGeometry(r1,r2,h,n||12),rb=(w,h,d,k,tb,s)=>rbox(w,h,d,Math.min(w,d)*(k==null?.42:k),tb,s);
 const R=p.bR,to=S.to,hp=S.hp,th=S.th,sh=S.sh,ft=S.ft,ua=S.ua,fa=S.fa,hn=S.hn,nk=S.nk,hd=S.hd,bx=!!S.box,K=bx?.12:.47;
 // ---- alturas das articulações (de baixo para cima, sem espaços)
 const kneeY=sh.l+ft.h/2,hipY=kneeY+th.l,pelY=hipY+(bx?.02:.04),pelTop=pelY+hp.h/2,tBot=pelTop-.05,ty=tBot+to.h/2,tTop=tBot+to.h,tb=to.tb||1;
 // ---- quadril e tronco
 const pel=part(R,rb(hp.w,hp.h,hp.d,bx?.08:.3,1,5),p.mP,0,pelY,0,{up:1});
 part(R,rbox(to.w,to.h,to.d,Math.max(to.r,.14),tb,8),p.mT,0,ty,0);
 if(S.mus){for(const s of[-1,1]){const pc=part(R,sph(.16),p.mT,s*to.w*.21,ty+to.h*.2,to.d*.38,null,0);pc.scale.set(1.25,.72,.55);const tp=part(R,sph(.14,10,8),p.mT,s*to.w*.25,tTop-.03,-.03,null,0);tp.scale.set(1.5,.65,1.2)}
  for(let r=0;r<3;r++)for(const s of[-1,1])part(R,rbox(.11,.075,.05,.02,1,3),p.mT,s*.06,ty-to.h*.08-r*.09,to.d/2-.01,null,0)}
 if(S.fat){const bl=part(R,sph(1,16,12),p.mT,0,ty-to.h*.14,to.d*.12);bl.scale.set(to.w*.46,to.h*.4,to.d*.48)}
 // ---- ombros, pescoço e cabeça
 const shY=bx?tTop-ua.w/2:tTop-ua.w*.45,shX=bx?to.w/2+ua.w/2+.005:to.w/2+ua.w*(ua.sh?.32:.42);
 const nkB=tTop-.04,nkT=nkB+nk.h;part(R,cyl(nk.r,nk.r*1.1,nk.h+.1,10),p.mS,0,nkB+nk.h/2,0,null,0);
 const hc=nkT+hd.h*.44;p.hj.position.set(0,hc,0);p.hs.scale.set(hd.w/.48,hd.h/.528,hd.d/.48);
 part(p.hs,rbox(.48,.528,.48,.24*Math.max(hd.r,.75),1,8),p.mS,0,0,0);{const ns=part(p.hs,sph(.034,8,6),p.mS,0,-.035,.243,null,0);ns.scale.set(.85,1,1.15)}
 p.hH.scale.set(1,1,1);p.hF.position.z=.045;p.mouth.position.z=.2;p.hOff=hc-1.95;p.hTop=hc+hd.h/2;p.bshape='rb';p.hshape='rb';
 if(S.blush)for(const s of[-1,1]){const bl=part(p.hj,sph(.06,8,6),p.mBlush||(p.mBlush=mat(0xff9a9a)),s*hd.w*.3,-hd.h*.1,hd.d/2+.012,null,0);bl.scale.set(1.2,.65,.25)}
 // ---- espaço das roupas (roupa, capa e cachecol seguem as medidas do tronco)
 const rt=to.w/2,rbt=rt*tb,avg=(rt+rbt)/2,dep=to.d/2,sx=Math.max(rt/.34,avg/.305),sy=to.h/.6,sz=dep/.238;
 p.tspace.scale.set(sx,sy,sz);p.tspace.position.set(0,ty-1.36*sy,0);p.tq.position.set(0,ty,0);
 p.pspace.scale.set(hp.w/.6*1.04,1,hp.d/.6*1.12);p.pspace.position.y=pelTop-.06-1.02;
 p.tdim={rt,h:to.h,d:dep,w:to.w,D:to.d,r:to.r,tb};
 // ---- braços: ombro → braço → cotovelo → antebraço → punho → mão
 p.arms.forEach((a,i)=>{const s=i?1:-1,S0=a[0],E=a[1];S0.position.set(s*shX,shY,0);
  if(bx){part(S0,rb(ua.w,ua.l+ua.w/2,ua.d,K,1,4),p.mT,0,(ua.w/2-ua.l)/2,0,{sl:1});E.position.set(0,-ua.l,0);part(E,rb(fa.w*.99,fa.l,fa.d*.99,K,1,4),p.mS,0,-fa.l/2,0);part(E,rb(hn.w*.98,hn.h,hn.d*.98,K,1,3),p.mS,0,-fa.l-hn.h/2+.01,0)}
  else{const shr=ua.sh||ua.w*.56;part(S0,sph(shr,12,10),p.mT,0,0,0,{sl:1});const top=ua.w*.2,bot=-ua.l-ua.w*.15;part(S0,rb(ua.w,top-bot,ua.d,K,1,5),p.mT,0,(top+bot)/2,0,{sl:1});
   E.position.set(0,-ua.l,0);part(E,sph(Math.min(fa.w,fa.d)*.5,10,8),p.mS,0,0,0,null,0);const ft2=fa.w*.15,fb=-fa.l;part(E,rb(fa.w,ft2-fb,fa.d,K,1,5),p.mS,0,(ft2+fb)/2,0);
   const hy=-fa.l-hn.h*.4;if(S.anime){}part(E,rb(hn.w,hn.h,hn.d,.45,1,4),p.mS,0,hy,0);part(E,sph(hn.w*.22,8,6),p.mS,-s*hn.w*.42,hy+hn.h*.08,hn.d*.25,null,0);for(let f=0;f<4;f++)part(E,cyl(hn.w*.085,hn.w*.07,hn.h*.5,6),p.mS,(f-1.5)*hn.w*.22,hy-hn.h*.66,hn.d*.08,null,0)}
  for(const c of E.children)if(c.userData.att)c.position.y=-(fa.l+.03)});
 p.attY=-(fa.l+.03);
 // ---- pernas: quadril → coxa → joelho → perna → pé
 p.pb=[];p.legs.forEach((l,i)=>{const s=i?1:-1,H=l[0],Kn=l[1];H.position.set(s*S.lg,hipY,0);Kn.position.set(0,-th.l,0);
  if(bx){part(H,rb(th.w,th.l+.06,th.d,K,1,4),p.mP,0,-th.l/2+.03,0,{up:1});part(Kn,rb(sh.w*.99,sh.l,sh.d*.99,K,1,4),p.mP,0,-sh.l/2,0,{lo:1})}
  else{const t1=th.w*.25,t2=-th.l-th.w*.1;part(H,rb(th.w,t1-t2,th.d,K,1,5),p.mP,0,(t1+t2)/2,0,{up:1});part(Kn,sph(Math.min(sh.w,sh.d)*.5,10,8),p.mP,0,0,0,{lo:1},0);
   const s1=sh.w*.1,s2=-sh.l+ft.h*.2;part(Kn,rb(sh.w,s1-s2,sh.d,K,1,5),p.mP,0,(s1+s2)/2,0,{lo:1})}
  part(Kn,rb(ft.w,ft.h,ft.l,bx?.1:.45,1,4),p.mSh,0,-sh.l,ft.l*(bx?.08:.2));
  if(p.bootS)part(Kn,rb(sh.w*1.1,sh.l*.28,sh.d*1.1,K,1,4),p.mSh,0,-sh.l*.82,0,null,0);
  const b=part(Kn,rb(sh.w*1.14,sh.l*.62,sh.d*1.14,K,1,4),p.mSh,0,-sh.l*.67,0);b.visible=false;p.pb.push(b)});
 p.root.scale.setScalar(p.h0);p.bodyI=bi}
function lkClear(g){while(g.children.length)g.remove(g.children[0])}
function lkNorm(L){const o=Object.assign({},LOOK0);if(L&&typeof L=='object')for(const k in LOOK0){const v=L[k];if(v===null&&(k=='tc'||k=='bc'))o[k]=null;else if(typeof v=='number'&&isFinite(v))o[k]=v}o.hair=((o.hair|0)%HAIRS.length+HAIRS.length)%HAIRS.length;o.eyes=((o.eyes|0)%EYES.length+EYES.length)%EYES.length;o.scar=((o.scar|0)%SCARS.length+SCARS.length)%SCARS.length;o.beard=((o.beard|0)%BEARDS.length+BEARDS.length)%BEARDS.length;o.top=((o.top|0)%TOPS.length+TOPS.length)%TOPS.length;o.pants=((o.pants|0)%PANTS.length+PANTS.length)%PANTS.length;o.body=((o.body|0)%BODIES.length+BODIES.length)%BODIES.length;return o}
function dressUp(p,L0){const L=lkNorm(L0);if(!p._dr){p._dr=1;
  p.hg=new T.Group();p.fg=new T.Group();p.tg=new T.Group();p.mScar=mat(0x9a3a3a);p.mB=mat(0x2a2018);p.mBs=new T.MeshBasicMaterial({color:0x2a2018,transparent:true,opacity:.35});p.mW2=mat(0xffffff);p.mArmor=mat(0xb8c0d0);p.mGold=mat(0xd4af37);p.mDark=mat(0x222222);p.mVest=mat(0x333333);p.mSleeveW=mat(0xf0ece0);
  bodySetup(p)}
 bodyAdopt(p);
 p.mH.color.setHex(L.hc);p.mE.color.setHex(L.ec);p.mS.color.setHex(L.sk);p.mP.color.setHex(L.pc);if(L.tc!=null)p.mT.color.setHex(L.tc);const bc=L.bc==null?L.hc:L.bc;p.mB.color.setHex(bc);p.mBs.color.setHex(bc);
 const tc=L.tc!=null?L.tc:p.mT.color.getHex(),dk=new T.Color(tc).multiplyScalar(.55);p.mDark.color.copy(dk);p.mVest.color.copy(dk);
 const k=[L.body,L.hair,L.eyes,L.scar,L.beard,L.top,L.pants].join(',');if(p._lk===k)return;p._lk=k;
 if(p.bodyI!==L.body)buildBody(p,L.body);
 lkClear(p.hg);HAIRS[L.hair].b(p,p.hg);lkClear(p.fg);const ey=[];buildEyes(p,p.fg,ey,EYES[L.eyes]);p.eyes.length=0;ey.forEach(e=>p.eyes.push(e));SCARS[L.scar].b(p,p.fg);BEARDS[L.beard].b(p,p.fg);
 lkClear(p.tg);lkClear(p.tq);const tp=TOPS[L.top];tp.b(p,p.tg);const sm2=tp.sl=='s'?p.mS:tp.sl=='w'?p.mSleeveW:p.mT;for(const a of p.arms)a[0].traverse(m=>{if(m.userData&&m.userData.sl)m.material=sm2});
 const pt=PANTS[L.pants],wd=pt.wide?1.3:1;p.root.traverse(m=>{if(!m.userData)return;if(m.userData.up)m.scale.set(wd,1,wd*(m.parent===p.bR&&p.bshape!='box'?.85:1));if(m.userData.lo){m.material=pt.lo=='s'?p.mS:p.mP;m.scale.set(pt.wide?1.35:1,m.scale.y,pt.wide?1.35:1)}});p.pb.forEach(b=>b.visible=!!pt.boots);
 if(p===PP){try{if(horns)horns.position.y=p.hOff}catch(x){}try{if(sword)sword.position.y=p.attY}catch(x){}}}
const P={look:Object.assign({},LOOK0),lv:1,exp:0,pts:0,st:{for:0,mag:0,vit:0,agi:0},inv:{pv:2,pm:1,el:0},mhp:100,mmp:100,qd:{},svt:0,x:0,z:0,y:0,vy:0,slow:0,sh:0,sw:0,pc:0,sword:false,union:false,nm:false,shake:0,ps:'',pt:0,born:'',hold:'',clan:'',giros:1,sgiros:0,ggiros:1,gsgiros:0,hp:100,mp:100,f:0,honra:0,coins:50,g:null,xp:[0,0,0,0,0,0],cd:[0,0,0,0,0,0],cd2:[0,0,0,0,0,0],own:{civil:1},eq:'civil',hair:0x2a2018,eye:0x2a6fd0,acc:1,on:true},
 PP=person({top:0xa9825a,pants:0x3a2f2a,hair:0x2a2018,eye:0x2a6fd0,hs:0,cape:0x7a1f1f,belt:1,scarf:0xe8e0c8,boots:1}),pm=PP.g,hair={material:PP.mH},eyeM=PP.eyes,book=makeOpenBook();
book.position.set(.28,.72,.8);pm.add(book);S.add(pm);const PCL=makeCapelet();PCL.visible=false;PP.root.add(PCL);
const SK={civil:['Civil Aldeão',0,0xa9825a,0x7a5a3a],nobre:['Civil Nobre',80,0x6b3fa0,0x3b2060],touros:['Touros Negros',100,0x1c1c1c,0x111111],alvorecer:['Alvorecer Dourado',150,0xe0b020,0xb88a10],aguias:['Águias Prateadas',150,0xaab4c8,0x7d88a0],demon:['Manto Demoníaco (raro)',300,0x550000,0x220000]};
function skin(k){const s=SK[k];PP.mT.color.setHex(P.look&&P.look.tc!=null?P.look.tc:s[2]);PP.mC.color.setHex(s[3]);P.eq=k;if(PP.cp)PP.cp.visible=k!='touros';PCL.visible=k=='touros'}
