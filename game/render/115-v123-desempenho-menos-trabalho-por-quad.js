// ================= V123 · DESEMPENHO: menos trabalho por quadro (andar e usar poderes) =================
// 1) personagens: as dezenas de peças de cada boneco viram poucas malhas (uma por material em cada articulação)
// 2) cenário parado não recalcula posição todo quadro (só o que se mexe)
// 3) efeitos dos poderes: rastro de investida leve, onda de choque reaproveitada, sombreadores preparados no menu
// 4) texto do nome do poder mais leve no celular; modelos 3D carregam só quando aparecem
// Nada é apagado: as peças originais continuam no lugar (só deixam de ser desenhadas) e voltam sozinhas se algo mudar.
(function(){
const PF={};window.PF123=PF;
const HID=31,HM=1<<HID;                 // camada "guardada": a câmera e as sombras não desenham
// ================= 1) JUNTAR PEÇAS DOS PERSONAGENS =================
const CH=new Set();PF.CH=CH;
{const _p=person;person=function(o){const L=_p.apply(this,arguments);try{if(L&&L.g)CH.add(L)}catch(e){}return L}}
try{CH.add(PP)}catch(e){}
const _m4=new T.Matrix4(),_n3=new T.Matrix3();
function rigidOK(m){if(!m.isMesh||m.isSkinnedMesh||m.isInstancedMesh||m._m123)return false;if(Array.isArray(m.material)||!m.material)return false;const g=m.geometry;if(!g||!g.isBufferGeometry||!g.attributes.position||!g.attributes.normal)return false;if(g.groups&&g.groups.length>1)return false;if(g.morphAttributes&&Object.keys(g.morphAttributes).length)return false;if(m.layers.mask!==1||!m.visible)return false;if(m.onBeforeRender&&m.onBeforeRender!==T.Object3D.prototype.onBeforeRender)return false;if(m.userData&&m.userData.nomerge)return false;return true}
// peças rígidas presas à articulação N (descendo só por malhas, nunca por grupos que se mexem)
function collect(N,acc,M,st){for(const c of N.children){if(c._m123)continue;if(!c.isMesh){continue}c.updateMatrix();const W=new T.Matrix4().multiplyMatrices(M,c.matrix);if(!st.dyn.has(c)&&rigidOK(c))acc.push({m:c,W});collect2(c,acc,W,st)}}
function collect2(N,acc,M,st){for(const c of N.children){if(!c.isMesh||c._m123)continue;c.updateMatrix();const W=new T.Matrix4().multiplyMatrices(M,c.matrix);if(!st.dyn.has(c)&&rigidOK(c))acc.push({m:c,W});collect2(c,acc,W,st)}}
function mergeGeos(list){let nv=0,ni=0,uv=true,col=true;for(const it of list){const g=it.m.geometry;nv+=g.attributes.position.count;ni+=g.index?g.index.count:g.attributes.position.count;if(!g.attributes.uv)uv=false;if(!g.attributes.color)col=false}
 const P=new Float32Array(nv*3),N=new Float32Array(nv*3),U=uv?new Float32Array(nv*2):null,C=col?new Float32Array(nv*3):null,I=nv>65535?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;const v=new T.Vector3();
 for(const it of list){const g=it.m.geometry,p=g.attributes.position,n=g.attributes.normal,W=it.W;_n3.getNormalMatrix(W);
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(W);P[(vo+i)*3]=v.x;P[(vo+i)*3+1]=v.y;P[(vo+i)*3+2]=v.z;v.fromBufferAttribute(n,i).applyMatrix3(_n3).normalize();N[(vo+i)*3]=v.x;N[(vo+i)*3+1]=v.y;N[(vo+i)*3+2]=v.z}
  if(U){const a=g.attributes.uv;for(let i=0;i<a.count;i++){U[(vo+i)*2]=a.getX(i);U[(vo+i)*2+1]=a.getY(i)}}
  if(C){const a=g.attributes.color;for(let i=0;i<a.count;i++){C[(vo+i)*3]=a.getX(i);C[(vo+i)*3+1]=a.getY(i);C[(vo+i)*3+2]=a.getZ(i)}}
  // espelhamento (escala negativa) inverte a ordem dos triângulos
  const flip=W.determinant()<0;
  if(g.index){const ix=g.index;for(let i=0;i<ix.count;i+=3){const a=ix.getX(i)+vo,b=ix.getX(i+1)+vo,c=ix.getX(i+2)+vo;I[io++]=a;I[io++]=flip?c:b;I[io++]=flip?b:c}}else{for(let i=0;i<p.count;i+=3){I[io++]=vo+i;I[io++]=vo+i+(flip?2:1);I[io++]=vo+i+(flip?1:2)}}
  vo+=p.count}
 const G=new T.BufferGeometry();G.setAttribute('position',new T.BufferAttribute(P,3));G.setAttribute('normal',new T.BufferAttribute(N,3));if(U)G.setAttribute('uv',new T.BufferAttribute(U,2));if(C)G.setAttribute('color',new T.BufferAttribute(C,3));G.setIndex(new T.BufferAttribute(I,1));G.computeBoundingSphere();return G}
function unmerge(L){const st=L._m123;if(!st)return;for(const mm of st.merged){if(mm.parent)mm.parent.remove(mm);try{mm.geometry.dispose()}catch(e){}}for(const r of st.orig){if(r.m.layers.mask===HM)r.m.layers.mask=1}st.merged=[];st.orig=[]}
function sig(m){const p=m.position,q=m.quaternion,s=m.scale;return[p.x,p.y,p.z,q.x,q.y,q.z,q.w,s.x,s.y,s.z]}
function merge(L){let st=L._m123;if(!st)st=L._m123={merged:[],orig:[],dyn:new Set(),cnt:new Map(),t:0,nodes:0,n:0};unmerge(L);const root=L.g;if(!root)return;
 const nodes=[];root.traverse(o=>{if(!o.isMesh&&!o._m123)nodes.push(o)});let total=0;
 for(const N of nodes){const acc=[];collect(N,acc,new T.Matrix4(),st);if(acc.length<2)continue;
  const B=new Map();for(const it of acc){const m=it.m,k=m.material.uuid+'|'+(m.castShadow?1:0)+(m.receiveShadow?1:0)+'|'+m.renderOrder+'|'+(it.W.determinant()<0?1:0);let b=B.get(k);if(!b)B.set(k,b=[]);b.push(it)}
  for(const [k,list] of B){if(list.length<2)continue;let mm;try{mm=new T.Mesh(mergeGeos(list),list[0].m.material)}catch(e){continue}mm._m123=1;mm.castShadow=list[0].m.castShadow;mm.receiveShadow=list[0].m.receiveShadow;mm.renderOrder=list[0].m.renderOrder;mm.matrixAutoUpdate=false;N.add(mm);st.merged.push(mm);
   for(const it of list){it.m.layers.mask=HM;st.orig.push({m:it.m,mat:it.m.material,geo:it.m.geometry,par:it.m.parent,vis:it.m.visible,s:sig(it.m)});total++}}}
 st.nodes=countNodes(root);st.n=total;st.t=0;PF.merges=(PF.merges||0)+1}
function countNodes(r){let n=0;r.traverse(o=>{if(!o._m123)n++});return n}
// confere se algo mudou numa peça guardada; se mudou, essa peça passa a ser desenhada sozinha
function check(L){const st=L._m123;if(!st)return false;let dirty=false;
 for(const r of st.orig){const m=r.m;let ch=false;if(m.parent!==r.par||m.material!==r.mat||m.geometry!==r.geo||m.visible!==r.vis)ch=true;else if(m.layers.mask!==HM)ch=true;else{const p=m.position,q=m.quaternion,s=m.scale,a=r.s;if(p.x!==a[0]||p.y!==a[1]||p.z!==a[2]||q.x!==a[3]||q.y!==a[4]||q.z!==a[5]||q.w!==a[6]||s.x!==a[7]||s.y!==a[8]||s.z!==a[9])ch=true}
  if(ch){dirty=true;const c=(st.cnt.get(m)||0)+1;st.cnt.set(m,c);if(c>=2||m.layers.mask!==HM&&m.layers.mask!==1)st.dyn.add(m)}}
 if(!dirty&&countNodes(L.g)!==st.nodes)dirty=true;return dirty}
PF.mergeAll=function(){for(const L of CH)try{merge(L)}catch(e){}};
let mq=[],mi=0,mT=0;
function mergeTick(dt){if(CFG.m123===0)return;mT-=dt;
 // fila: personagens perto da câmera primeiro; no máximo 1 junção por quadro (sem travadas)
 if(mT<=0){mT=.5;mq=[...CH].filter(L=>L.g&&L.g.parent);for(const L of CH)if(!L.g||!onScene(L.g))CH.delete(L)}
 let did=0;for(let k=0;k<2&&mq.length;k++){mi=(mi+1)%mq.length;const L=mq[mi];if(!L||!L.g)continue;const st=L._m123;
  if(!st){if(did<1){try{merge(L)}catch(e){}did++}continue}
  st.t+=dt;if(st.t<.4)continue;st.t=0;let d=false;try{d=check(L)}catch(e){}const now=performance.now();if(now-(st.w0||0)>10000){st.w0=now;st.rm=0}if(d&&did<1&&(st.rm||0)<4){st.rm=(st.rm||0)+1;try{merge(L)}catch(e){}did++}else if(d&&(st.rm||0)>=4){try{unmerge(L)}catch(e){}}}}
function onScene(o){let p=o;for(let n=0;p&&n<60;n++){if(p===S)return true;p=p.parent}return false}
// ================= 2) CENÁRIO PARADO NÃO RECALCULA POSIÇÃO =================
const FZ={c:[],i:0,snap:null,t:0,on:false};PF.FZ=FZ;
function isChar(o){for(let p=o,n=0;p&&n<60;p=p.parent,n++){if(p.userData&&p.userData.fz123===0)return true;if(p===S)return false}return false}
function markChars(){for(const L of CH)if(L.g)L.g.userData.fz123=0;try{if(PP&&PP.g)PP.g.userData.fz123=0}catch(e){}try{for(const e of enemies){if(e.g)e.g.userData.fz123=0;if(e.m&&e.m.userData)e.m.userData.fz123=0}}catch(e){}try{for(const k in MP.others){const o=MP.others[k];if(o&&o.g)o.g.userData.fz123=0}}catch(e){}try{cam.userData.fz123=0}catch(e){}}
function snapAll(){const m=new Map();for(const c of S.children){if(c.isLight||c.isCamera)continue;if(c.userData&&c.userData.fz123===0)continue;c.traverse(o=>{if(o.matrixAutoUpdate&&!o._dyn123&&!o.isLight&&!o.isCamera&&!(o.userData&&o.userData.fz123===0)){const a=sig(o);a.push(o.visible);m.set(o,a)}})}return m}
function freezeTick(dt){if(CFG.fz123===0)return;FZ.t+=dt;
 if(FZ.t>3){FZ.t=0;markChars();const now=snapAll();if(FZ.snap){let n=0;for(const [o,s] of now){const a=FZ.snap.get(o);if(!a)continue;let same=true;const nv=o.parent===S?10:11;for(let i=0;i<nv;i++)if(a[i]!==s[i]){same=false;break}if(same&&!isChar(o)){o.updateMatrix();o.matrixAutoUpdate=false;o._fz123=s;FZ.c.push(o);n++}else if(!same)o._dyn123=1}PF.frozen=(PF.frozen||0)+n;FZ.prev=FZ.snap;skipTops()}FZ.snap=now}
 // confere aos poucos se algo congelado começou a se mexer → volta ao normal na hora
 const L=FZ.c;if(!L.length)return;const per=Math.min(L.length,160);for(let k=0;k<per;k++){FZ.i=(FZ.i+1)%L.length;const o=L[FZ.i];if(!o)continue;const a=o._fz123;
  if(!a||!o.parent){L.splice(FZ.i,1);continue}const p=o.position,q=o.quaternion,s=o.scale;
  if(p.x!==a[0]||p.y!==a[1]||p.z!==a[2]||q.x!==a[3]||q.y!==a[4]||q.z!==a[5]||q.w!==a[6]||s.x!==a[7]||s.y!==a[8]||s.z!==a[9]||(o.parent!==S&&o.visible!==a[10])){o.matrixAutoUpdate=true;o._fz123=null;o._dyn123=1;o.updateMatrix();o.matrixWorldNeedsUpdate=true;L.splice(FZ.i,1);wake(o)}}
 // grupos inteiros parados: nem são percorridos; se ganharem peça nova, voltam a ser percorridos
 if(TOPS.length&&(FZ.k=(FZ.k||0)+1)%30==0){TI=(TI+1)%TOPS.length;const t=TOPS[TI];if(t&&!t.parent)wake(t)}
 if(S.matrixAutoUpdate===false&&FZ.k%30==1){const p=S.position,q=S.quaternion,c=S.scale;if(p.x||p.y||p.z||q.x||q.y||q.z||c.x!==1||c.y!==1||c.z!==1){S.matrixAutoUpdate=true}}}
const TOPS=[];let TI=0;const UMW=T.Object3D.prototype.updateMatrixWorld;
function cnt(o){let n=0;o.traverse(()=>n++);return n}
function skipUMW(force){if(this.matrixWorldNeedsUpdate||this._sk123d){this._sk123d=false;UMW.call(this,true)}}
function skipTops(){if(CFG.fz123===0)return;if(S.position.lengthSq()===0&&S.scale.x===1&&S.quaternion.w===1){S.updateMatrix();S.updateMatrixWorld(true);S.matrixAutoUpdate=false}
 for(const c of S.children){if(c._sk123!=null||c.isLight||c.isCamera||(c.userData&&c.userData.fz123===0))continue;let all=true,nm=0;c.traverse(o=>{if(o.isMesh)nm++;if(o.matrixAutoUpdate||o.isLight||o.isCamera||o.isSkinnedMesh||o.isBone)all=false});if(!all){if(nm>=12&&!c._ch123&&FZ.prev&&FZ.prev.has(c)){c._ch123=1;CH.add({g:c,auto:1})}continue}c.traverse(o=>{o._top123=c});c._sk123=cnt(c);c.updateMatrixWorld=skipUMW;c._sk123d=true;TOPS.push(c)}PF.tops=TOPS.length}
{const _add=T.Object3D.prototype.add,_att=T.Object3D.prototype.attach;T.Object3D.prototype.add=function(){const r=_add.apply(this,arguments);if(this._top123||this._sk123!=null)try{wake(this)}catch(e){}return r};T.Object3D.prototype.attach=function(){const r=_att.apply(this,arguments);if(this._top123||this._sk123!=null)try{wake(this)}catch(e){}return r}}
// cenário parado: as peças de um grupo inteiro parado viram uma malha por material (menos desenhos por quadro)
const SB={q:[],n:0,bad:new Set()};PF.SB=SB;
function sbMerge(t){if(t._sb123||SB.bad.has(t)||!t.parent||t._sk123==null)return;const acc=[];let verts=0;t.updateMatrixWorld(true);const inv=new T.Matrix4().copy(t.matrixWorld).invert();
 t.traverse(o=>{if(o===t||!rigidOK(o))return;for(let p=o;p&&p!==t;p=p.parent)if(!p.visible)return;verts+=o.geometry.attributes.position.count;acc.push({m:o,W:new T.Matrix4().multiplyMatrices(inv,o.matrixWorld)})});
 if(acc.length<4||verts>60000)return;const B=new Map();for(const it of acc){const m=it.m,k=m.material.uuid+'|'+(m.castShadow?1:0)+(m.receiveShadow?1:0)+'|'+m.renderOrder+'|'+(it.W.determinant()<0?1:0);let b=B.get(k);if(!b)B.set(k,b=[]);b.push(it)}
 const made=[],hid=[];for(const [k,list] of B){if(list.length<2)continue;let mm;try{mm=new T.Mesh(mergeGeos(list),list[0].m.material)}catch(e){continue}mm._m123=1;mm.castShadow=list[0].m.castShadow;mm.receiveShadow=list[0].m.receiveShadow;mm.renderOrder=list[0].m.renderOrder;mm.matrixAutoUpdate=false;mm._top123=t;
  t.children.push(mm);mm.parent=t;mm.updateMatrixWorld(true);made.push(mm);for(const it of list){it.m.layers.mask=HM;hid.push(it.m)}}
 t._sb123={made,hid};t._sk123=cnt(t);SB.n++;PF.sbMerged=SB.n}
function sbUndo(t){const z=t._sb123;if(!z)return;t._sb123=null;for(const mm of z.made){const i=t.children.indexOf(mm);if(i>=0)t.children.splice(i,1);mm.parent=null;try{mm.geometry.dispose()}catch(e){}}for(const m of z.hid)if(m.layers.mask===HM)m.layers.mask=1;SB.bad.add(t)}
function sbTick(){if(CFG.sb123===0)return;if(!SB.q.length){if((SB.k=(SB.k||0)+1)%300)return;SB.q=TOPS.filter(t=>!t._sb123&&!t._sbt123&&!SB.bad.has(t))}const t=SB.q.pop();if(t&&t._sk123!=null){t._sbt123=1;try{sbMerge(t)}catch(e){}}}
function wake(o){let t=o._top123||o;if(t&&t._sb123)sbUndo(t);if(t&&t._sk123!=null){delete t.updateMatrixWorld;t._sk123=null;t.traverse(x=>{x._top123=null});UMW.call(t,true);const i=TOPS.indexOf(t);if(i>=0)TOPS.splice(i,1)}}
PF.fzScan=function(){FZ.t=99;freezeTick(0)};PF.sbAll=function(){let n=0;for(const t of TOPS.slice()){if(!t._sb123&&!SB.bad.has(t)){t._sbt123=1;try{sbMerge(t);n++}catch(e){}}}return n};PF.ntops=()=>TOPS.length;
// ================= 3) EFEITOS DOS PODERES =================
// rastro da investida: antes copiava o personagem inteiro (centenas de peças) várias vezes por segundo; agora copia só as malhas juntadas
{const _v=new T.Vector3(),_q=new T.Quaternion(),_s=new T.Vector3();
 ghostOf=function(cc){if(!CFG.fx)return;try{const m=new T.MeshBasicMaterial({color:cc||(P.union?0xff2040:0x9fe8ff),transparent:true,opacity:.42,blending:T.AdditiveBlending,depthWrite:false});const g=new T.Group();pm.updateMatrixWorld(true);const inv=new T.Matrix4().copy(pm.matrixWorld).invert();let n=0;
  pm.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||o.material===olm||o.layers.mask!==1||n>40)return;let vis=true;for(let p=o;p&&p!==pm;p=p.parent)if(!p.visible){vis=false;break}if(!vis)return;const c=new T.Mesh(o.geometry,m);c.matrixAutoUpdate=false;c.matrix.multiplyMatrices(inv,o.matrixWorld);g.add(c);n++});
  g.position.copy(pm.position);g.quaternion.copy(pm.quaternion);g.scale.copy(pm.scale);S.add(g);GHOSTS.push({g,m,t:.32})}catch(e){}}}
// onda de choque: as duas formas são criadas uma vez só e reaproveitadas (antes: 2 formas novas a cada uso, ~280 lugares no jogo)
{const TG=new T.TorusGeometry(1,.06,6,40),RG=new T.RingGeometry(.8,1,40);TG._keep=1;RG._keep=1;
 kShock=function(x,z,R,col,dur,y){const m=new T.Mesh(TG,GLM(col,.9));m.rotation.x=-Math.PI/2;m.position.set(x,y||.3,z);S.add(m);const d2=new T.Mesh(RG,GLM(col,.35));d2.rotation.x=-Math.PI/2;d2.position.set(x,(y||.3)-.2,z);S.add(d2);
  kfx({u:f=>{const u=f.t/dur,s=.5+R*Math.pow(u,.6);m.scale.setScalar(s);d2.scale.setScalar(s);m.material.opacity=.9*(1-u);d2.material.opacity=.35*(1-u);m.position.y=(y||.3)+u*.4;return u<1},end:()=>{kDispose(m);kDispose(d2)}})}}
// sombreadores: a 1ª vez que um tipo de efeito aparece o celular "compila" o desenho e trava. Agora isso é feito no menu, aos poucos.
const WARM={done:false,i:0,list:null};PF.WARM=WARM;
function warmList(){const out=[],tx=new T.DataTexture(new Uint8Array([255,255,255,255]),1,1,T.RGBAFormat);tx.needsUpdate=true;const tx2=tx.clone();tx2.encoding=T.sRGBEncoding;tx2.needsUpdate=true;
 for(const map of[null,tx,tx2])for(const side of[T.FrontSide,T.DoubleSide,T.BackSide])for(const vc of[false,true])out.push(()=>new T.MeshBasicMaterial({map,side,vertexColors:vc,transparent:true}));
 for(const map of[null,tx,tx2])for(const side of[T.FrontSide,T.DoubleSide])out.push(()=>new T.MeshLambertMaterial({map,side}));
 out.push(()=>new T.MeshLambertMaterial({emissive:0x222222,emissiveMap:tx}));out.push(()=>new T.MeshPhongMaterial({}));out.push(()=>new T.MeshPhongMaterial({side:T.DoubleSide}));
 out.push(()=>new T.MeshStandardMaterial({map:tx2}));out.push(()=>new T.MeshStandardMaterial({}));
 try{for(const map of[null,tx2])out.push(()=>new T.MeshToonMaterial({gradientMap:gmap,map}))}catch(e){}
 // com esqueleto (demônios e corpo animado)
 for(const k of['basic','lambert','toon'])out.push(()=>({sk:1,m:k=='basic'?new T.MeshBasicMaterial({skinning:true,transparent:true}):k=='lambert'?new T.MeshLambertMaterial({skinning:true,map:tx2}):new T.MeshToonMaterial({skinning:true,gradientMap:gmap})}));
 out.push(()=>({pt:1,m:new T.PointsMaterial({size:.2,transparent:true})}));out.push(()=>({pt:1,m:new T.PointsMaterial({size:.2,map:tx2,transparent:true})}));
 out.push(()=>({sp:1,m:new T.SpriteMaterial({map:tx2})}));out.push(()=>({ln:1,m:new T.LineBasicMaterial({})}));return out}
function warmTick(){if(WARM.done||typeof R=='undefined'||typeof S=='undefined'||typeof cam=='undefined')return;if(!WARM.list)WARM.list=warmList();const f=WARM.list[WARM.i++];if(!f){WARM.done=true;PF.warmMs=WARM.ms;return}
 const t=performance.now();try{let r=f(),o;const geo=new T.BoxGeometry(.01,.01,.01);if(r&&r.m){if(r.sk){const b=new T.Bone();o=new T.SkinnedMesh(geo,r.m);o.add(b);o.bind(new T.Skeleton([b]))}else if(r.pt)o=new T.Points(geo,r.m);else if(r.sp)o=new T.Sprite(r.m);else o=new T.Line(geo,r.m);r=r.m}else o=new T.Mesh(geo,r);
  o.position.set(0,-500,0);o.frustumCulled=false;S.add(o);R.compile(S,cam);S.remove(o);geo.dispose();try{r.dispose()}catch(e){}}catch(e){}WARM.ms=(WARM.ms||0)+(performance.now()-t)}
setTimeout(function w(){if(WARM.done)return;const busy=typeof run!='undefined'&&run;warmTick();setTimeout(w,busy?900:120)},2500);
// ================= 4) TEXTO DO PODER MAIS LEVE NO CELULAR =================
try{if(touch||matchMedia('(pointer:coarse)').matches){const st=document.createElement('style');st.textContent=`@keyframes kwIn{0%{opacity:0;transform:scale(2.2) translateY(-14px)}60%{opacity:1}100%{opacity:1;transform:none}}@keyframes kwOut{0%{opacity:1;transform:none}100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.4) rotate(20deg)}}
#kword span{will-change:transform,opacity}`;document.head.appendChild(st);
 // sombras do texto: 2 camadas em vez de 5
 const rule=document.createElement('style');rule.textContent='#kword span{text-shadow:0 0 10px currentColor,2px 2px 0 rgba(0,0,0,.6)!important}#kword.anti span,#kword.dun span,#kword.shadow span{text-shadow:0 0 12px #ff1a2a,2px 2px 0 #000!important}';document.head.appendChild(rule)}}catch(e){}
// modelos 3D dos demônios: só carregam quando aparecem pela primeira vez (antes carregavam 6 s depois de abrir o jogo, no meio da partida)
// (o V120 agenda a carga com setTimeout; aqui ela é desligada antes de disparar)
PF.lazy=1;
// ================= laço =================
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);if(run){try{mergeTick(dt||0)}catch(e){PF.e1=String(e.stack||e).slice(0,300)}try{freezeTick(dt||0)}catch(e){PF.e2=String(e.stack||e).slice(0,300)}try{if(TOPS.length)sbTick()}catch(e){PF.e3=String(e.stack||e).slice(0,300)}}return r}}
})();

