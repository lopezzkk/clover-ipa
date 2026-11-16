// ================= V139 · CENÁRIO MAIS LEVE: junta as peças paradas dos grandes grupos do mapa (menos desenhos por quadro) =================
// Só junta o que está realmente parado e visível. Se qualquer peça juntada se mexer, sumir ou aparecer, o grupo volta ao normal na hora.
(function(){
const HID=31;const SBX={batches:[],bad:new Map(),t:0,n:0,on:true};window.SB139=SBX;
const chainStatic=(o,top)=>{for(let p=o;p&&p!==S;p=p.parent){if(!p.visible)return false;if(p===top)break}return true};
function sig(o){const g=o.geometry,a=g.attributes;return(a.normal?'n':'')+(a.uv?'u':'')+(a.color?'c':'')+(g.index?'i':'')}
function okMesh(o){if(!o.isMesh||o.isSkinnedMesh||o.isInstancedMesh||Array.isArray(o.material)||!o.material||o._m123||o._m139)return false;{const b=SBX.bad.get(o);if(b&&(b.n>=3||performance.now()-b.t<15000))return false}if(o.layers.mask!==1)return false;const g=o.geometry;if(!g||!g.attributes||!g.attributes.position||g.morphAttributes&&Object.keys(g.morphAttributes).length)return false;if(o.material.transparent&&o.material.opacity<1&&o.material.blending===T.AdditiveBlending)return false;if(o.onBeforeRender&&o.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return false;return g.attributes.position.count<20000}
function mw(o){const e=o.matrixWorld.elements;return e[0]+e[5]*3+e[10]*7+e[12]*11+e[13]*13+e[14]*17}
function merge(list,inv){let nv=0,ni=0;const s=sig(list[0].m);for(const it of list){const g=it.m.geometry;nv+=g.attributes.position.count;ni+=g.index?g.index.count:g.attributes.position.count}
 const pos=new Float32Array(nv*3),nor=s.includes('n')?new Float32Array(nv*3):null,uv=s.includes('u')?new Float32Array(nv*2):null,col=s.includes('c')?new Float32Array(nv*3):null,idx=nv>65535?new Uint32Array(ni):new Uint16Array(ni);
 let vo=0,io=0;const v=new T.Vector3(),nm=new T.Matrix3();for(const it of list){const g=it.m.geometry,A=g.attributes,W=new T.Matrix4().multiplyMatrices(inv,it.m.matrixWorld);nm.getNormalMatrix(W);const n=A.position.count;
  for(let i=0;i<n;i++){v.fromBufferAttribute(A.position,i).applyMatrix4(W);pos[(vo+i)*3]=v.x;pos[(vo+i)*3+1]=v.y;pos[(vo+i)*3+2]=v.z;if(nor){v.fromBufferAttribute(A.normal,i).applyMatrix3(nm).normalize();nor[(vo+i)*3]=v.x;nor[(vo+i)*3+1]=v.y;nor[(vo+i)*3+2]=v.z}if(uv){uv[(vo+i)*2]=A.uv.getX(i);uv[(vo+i)*2+1]=A.uv.getY(i)}if(col){col[(vo+i)*3]=A.color.getX(i);col[(vo+i)*3+1]=A.color.getY(i);col[(vo+i)*3+2]=A.color.getZ(i)}}
  if(g.index){const I=g.index.array;for(let k=0;k<I.length;k++)idx[io+k]=I[k]+vo;io+=I.length}else{for(let k=0;k<n;k++)idx[io+k]=vo+k;io+=n}vo+=n}
 const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(pos,3));if(nor)G.setAttribute('normal',new T.BufferAttribute(nor,3));if(uv)G.setAttribute('uv',new T.BufferAttribute(uv,2));if(col)G.setAttribute('color',new T.BufferAttribute(col,3));G.setIndex(new T.BufferAttribute(idx,1));G.computeBoundingSphere();G.computeBoundingBox();return G}
// candidatos: grupos grandes e parados ligados direto à cena
function scan(){const out=[];const chars=new Set();try{NPCS.forEach(n=>chars.add(n.g))}catch(e){}try{enemies.forEach(e=>chars.add(e.m))}catch(e){}try{for(const k in MP.others)chars.add(MP.others[k].g)}catch(e){}
 for(const c of S.children){if(c===pm||!c.visible||c._sk123!=null||c.isLight||c.isCamera||c._ch123||chars.has(c))continue;let sk=false;c.traverse(o=>{if(o.isSkinnedMesh||o.isBone)sk=true});if(sk)continue;let n=0;c.traverse(o=>{if(o.isMesh)n++});if(n<20)continue;
  const L=[];c.traverse(o=>{if(okMesh(o)&&chainStatic(o,c))L.push(o)});if(L.length>=10)out.push({c,L:L.map(m=>({m,h:mw(m)}))})}return out}
let pend=null;
function build(){const now=performance.now();if(!pend){pend={t:now,list:scan()};return}if(now-pend.t<2500)return;const cand=pend.list;pend=null;
 for(const {c,L} of cand){const ok=L.filter(it=>it.m.parent&&chainStatic(it.m,c)&&it.m.layers.mask===1&&Math.abs(mw(it.m)-it.h)<1e-6);if(ok.length<10)continue;c.updateMatrixWorld(true);const inv=new T.Matrix4().copy(c.matrixWorld).invert();
  // agrupa por material e por região (16 m) para o recorte de câmera continuar funcionando
  const B=new Map();for(const it of ok){const m=it.m,p=new T.Vector3().setFromMatrixPosition(m.matrixWorld),cell=Math.floor(p.x/16)+'_'+Math.floor(p.z/16);const k=m.material.uuid+'|'+(m.castShadow?1:0)+(m.receiveShadow?1:0)+'|'+m.renderOrder+'|'+(m.matrixWorld.determinant()<0?1:0)+'|'+sig(m)+'|'+cell;let b=B.get(k);if(!b)B.set(k,b=[]);b.push(it)}
  for(const [k,list] of B){if(list.length<2)continue;let G;try{G=merge(list,inv)}catch(e){continue}const mm=new T.Mesh(G,list[0].m.material);mm._m139=1;mm.castShadow=list[0].m.castShadow;mm.receiveShadow=list[0].m.receiveShadow;mm.renderOrder=list[0].m.renderOrder;mm.matrixAutoUpdate=false;
   c.children.push(mm);mm.parent=c;mm.updateMatrixWorld(true);for(const it of list)it.m.layers.set(HID);SBX.batches.push({c,mm,list});SBX.n++}}}
function undo(b){const i=b.c.children.indexOf(b.mm);if(i>=0)b.c.children.splice(i,1);b.mm.parent=null;try{b.mm.geometry.dispose()}catch(e){}for(const it of b.list){if(it.m.layers.mask===(1<<HID))it.m.layers.set(0);const o=SBX.bad.get(it.m)||{n:0,t:0};o.n++;o.t=performance.now();SBX.bad.set(it.m,o)}}
// vigia: se algo juntado mudou (andou, sumiu, apareceu), desfaz só aquele bloco
let vi=0;function watch(){const B=SBX.batches;if(!B.length)return;const per=Math.min(B.length,20);for(let k=0;k<per;k++){vi=(vi+1)%B.length;const b=B[vi];if(!b)continue;let bad=!b.c.parent||!b.c.visible;if(!bad)for(const it of b.list){const m=it.m;if(!m.parent||m.layers.mask!==(1<<HID)||!chainStatic(m,b.c)||Math.abs(mw(m)-it.h)>1e-6){bad=true;break}}if(bad){undo(b);B.splice(vi,1);vi=Math.max(0,vi-1)}}}
X124&&(X124.SB139=SBX);
{const _u=tUpdate;let k=0;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(SBX.on&&CFG.sb139!==0){if(++k%30==0)watch();SBX.t+=dt||0;if(SBX.t>6&&(k%90==0||pend))build()}}catch(e){}return r}}
SBX.scan=()=>scan().map(x=>[x.c.children.length,x.L.length]);SBX.dbg=()=>S.children.filter(c=>{let n=0;c.traverse(o=>{if(o.isMesh)n++});return n>=20}).map(c=>{let n=0,ok=0,ch=0,lm=0;c.traverse(o=>{if(o.isMesh){n++;if(okMesh(o))ok++;if(chainStatic(o,c))ch++;if(o.layers.mask!==1)lm++}});return [n,ok,ch,lm,c.visible,c.matrixAutoUpdate,c._sk123!=null]});SBX.build=function(){build();if(pend)pend.t-=3000;build()};SBX.undoAll=function(){SBX.batches.forEach(undo);SBX.batches=[];};
})();

