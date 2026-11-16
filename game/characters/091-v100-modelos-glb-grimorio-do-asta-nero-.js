// ================= V100 · Modelos GLB: Grimório do Asta, Nero, Destruidora, Gimodelo, Espírito de Zéfiro, asa da União =================
// Modelos do Sketchfab (licença CC-BY-4.0): créditos em MD100 / Novidades. Nada antigo foi apagado.
const L100={glb:{},wait:{}};
function glb100(k,cb){if(L100.glb[k]){cb(L100.glb[k].clone(true));return}(L100.wait[k]=L100.wait[k]||[]).push(cb);if(L100.wait[k].length>1)return;
 try{const s=atob(MD100[k].glb),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);
  new THREE.GLTFLoader().parse(u.buffer,'',g=>{const sc=g.scene;sc.traverse(o=>{if(o.isMesh){o.castShadow=true;if(o.material){const om=o.material;if(om.map){om.map.encoding=T.LinearEncoding;om.map.anisotropy=2;om.map.needsUpdate=true}if(!om.isMeshBasicMaterial){const nm=new T.MeshLambertMaterial({map:om.map||null,color:om.color?om.color.clone():0xffffff,transparent:om.transparent,opacity:om.opacity,alphaTest:om.alphaTest||0,side:om.side});o.material=nm}o.material._keep=1}if(o.geometry)o.geometry._keep=1}});L100.glb[k]=sc;(L100.wait[k]||[]).forEach(f=>{try{f(sc.clone(true))}catch(e){}});L100.wait[k]=[]},e=>{console.warn('glb100',k,e)})}catch(e){console.warn('glb100',k,e)}}
MD96.gimo100=MD100.gimo;MD96.zeph100=MD100.zeph;MD96.wing100=MD100.wing;
// encaixa um modelo numa caixa: altura h, centrado em x/z, base em y=0 (ou centro, se mid)
function fit100(obj,h,mid){const bb=new T.Box3().setFromObject(obj),sz=bb.getSize(new T.Vector3()),c=bb.getCenter(new T.Vector3());const s=h/Math.max(sz.y,1e-6);obj.scale.multiplyScalar(s);obj.position.set(-c.x*s,mid?-c.y*s:-bb.min.y*s,-c.z*s);const g=new T.Group();g.add(obj);return g}

// ---------- 1) Grimório do Asta (trevo de cinco folhas) no lugar do livro aberto, só no grimório de Anti-Magia ----------
const GB100={m:null};
function gb100Tick(){if(typeof book=='undefined'||!book)return;const want=!!(P.g&&P.g.id=='anti');
 if(want&&!GB100.m&&!GB100.ld){GB100.ld=1;glb100('grim',sc=>{const fx=new T.Group();const inner=fit100(sc,.5,1);inner.rotation.set(0,0,0);fx.add(inner);fx.rotation.x=.25;fx.visible=false;book.add(fx);GB100.m=fx})}
 if(GB100.m){GB100.m.visible=want;book.children.forEach(c=>{if(c!==GB100.m)c.visible=!want||c===book.userData.gl&&false})}}

// ---------- 2) Nero (a ave do Asta) voando por perto quando o grimório é de Anti-Magia ----------
const NR100={g:null};
function nr100Tick(dt){const want=!!(P.g&&P.g.id=='anti'&&!P.union&&!ENC.on&&!CS.on);
 if(want&&!NR100.g&&!NR100.ld){NR100.ld=1;glb100('nero',sc=>{const g=fit100(sc,.42,1);g.visible=false;S.add(g);NR100.g=g;g.position.set(P.x,2.6,P.z)})}
 const g=NR100.g;if(!g)return;g.visible=want;if(!want)return;const t=performance.now()/1000,a=P.f+2.4+Math.sin(t*.5)*.4;const tx=P.x+Math.sin(a)*1.1,tz=P.z+Math.cos(a)*1.1,ty=(P.y||0)+2.45+Math.sin(t*2.2)*.1;const k=Math.min(1,dt*3);
 g.position.x+=(tx-g.position.x)*k;g.position.y+=(ty-g.position.y)*k;g.position.z+=(tz-g.position.z)*k;g.rotation.y=P.f+Math.sin(t*.8)*.3;g.rotation.z=Math.sin(t*3)*.05}

// ---------- 3) Espada Destruidora de Demônios com o modelo novo (texturas originais) ----------
{const _wm=wpnModel;wpnModel=function(k){const g=_wm.apply(this,arguments);if(k!=='destroyer')return g;try{glb100('dds',sc=>{const bb=new T.Box3().setFromObject(sc),sz=bb.getSize(new T.Vector3());const ax=sz.x>=sz.y&&sz.x>=sz.z?'x':sz.z>=sz.y?'z':'y';const inner=new T.Group();inner.add(sc);if(ax=='x')sc.rotation.z=Math.PI/2;if(ax=='z')sc.rotation.x=-Math.PI/2;
   const f=fit100(inner,2.15,0);f.position.y-=.3;f.rotation.y=Math.PI/2;g.children.forEach(c=>c.visible=false);g.add(f);g.userData.m100=f})}catch(e){}return g}}

// ---------- 4) Gimodelo com o modelo novo (corpo escuro, dentes brancos, olhos amarelos) nas conversas e cenas ----------
function gimo100(){const g=new T.Group(),geo=md96Geo('gimo100'),m=new T.Mesh(geo,mat96('gimo',1));m.castShadow=true;const inner=new T.Group();inner.add(m);
 for(const e of MD100.gimo.eyes){const s=new T.Mesh(new T.SphereGeometry(.42,10,8),BM(0xffd23a));s.position.set(e[0],e[1],e[2]);inner.add(s);const gl=new T.Mesh(new T.SphereGeometry(.9,10,8),GLM(0xffd23a,.35));gl.position.copy(s.position);inner.add(gl)}
 const f=fit100(inner,1.25,0);g.add(f);return g}
{const _cd=csDemon;csDemon=function(id){const g=_cd.apply(this,arguments);try{if(id=='gimodelo'){g.children.forEach(c=>{c.traverse(o=>{if(o.isMesh)o.visible=false})});const G=gimo100();G.scale.setScalar(1.25);g.add(G);UD(g).face=1.35}}catch(e){}return g}}

// ---------- 5) Espírito de Zéfiro flutuando ao lado no grimório de Vento ----------
const ZP100={g:null};
function zp100Tick(dt){const want=!!(P.g&&P.g.id=='vento'&&!ENC.on&&!CS.on);
 if(want&&!ZP100.g){const geo=md96Geo('zeph100'),mt=new T.MeshBasicMaterial({color:0x6fe05a,transparent:true,opacity:.92});mt._keep=1;const m=new T.Mesh(geo,mt);const inner=new T.Group();inner.add(m);const g=fit100(inner,2.3,1);
  const gl=new T.Mesh(new T.SphereGeometry(.55,12,10),GLM(0x9cff8a,.22));g.add(gl);g.visible=false;S.add(g);ZP100.g=g}
 const g=ZP100.g;if(!g)return;g.visible=want;if(!want)return;const t=performance.now()/1000,a=P.f-1.9;g.position.set(P.x+Math.sin(a)*1.15,(P.y||0)+1.9+Math.sin(t*1.6)*.12,P.z+Math.cos(a)*1.15);g.rotation.y=t*.8}

// ---------- 6) União Demoníaca: asa demoníaca do modelo do Asta + braço direito preto ----------
const UW100={s:3.3/4400,c:[400,0,-1270]};
function uw100Mesh(){const geo=md96Geo('wing100'),mt=new T.MeshToonMaterial({vertexColors:true,gradientMap:gmap,side:T.DoubleSide,emissive:0x12000a});mt._keep=1;const m=new T.Mesh(geo,mt);m.castShadow=true;
 const ol=new T.Mesh(geo,new T.MeshBasicMaterial({color:0x9a2a8a,side:T.BackSide,transparent:true,opacity:.55}));ol.scale.setScalar(1.012);m.add(ol);
 const s=UW100.s,c=UW100.c;m.scale.setScalar(s);m.position.set(-c[0]*s-.12,-.78,-c[2]*s-.05);const g=new T.Group();g.add(m);return g}
const UA100={keep:null};
{const _on=duOn;duOn=function(){const was=P.union;const r=_on.apply(this,arguments);try{if(!was&&P.union&&DU.fx){const F=DU.fx;(F.W||[]).forEach(o=>{o.w.visible=false;o.w.scale.setScalar(1e-4)});const W=uw100Mesh();(PP.root||pm).add(W);F.add.push(W);F.w100=W;F.h100=[];pm.traverse(o=>{if(o.userData&&o.userData.stage=='back'){let big=false;o.traverse(c=>{if(c.isMesh&&c.geometry&&c.geometry.attributes.position.count<200&&c.material&&c.material.color&&c.material.color.getHex()==0x2a1a22)big=true});if(big)F.h100.push(o)}});
   UA100.keep=[];const dark=new T.MeshToonMaterial({color:0x121016,gradientMap:gmap,emissive:0x1a0006});PP.arms[0].forEach(seg=>seg.traverse(o=>{if(o.isMesh&&o!==sword&&!(sword&&isChild100(o,sword))){UA100.keep.push([o,o.material]);o.material=dark}}))}}catch(e){console.warn(e)}return r}}
function isChild100(o,p){for(let x=o;x;x=x.parent)if(x===p)return true;return false}
{const _end=duEnd;duEnd=function(){const r=_end.apply(this,arguments);try{if(UA100.keep){UA100.keep.forEach(([o,m])=>o.material=m);UA100.keep=null}}catch(e){}return r}}
function uw100Tick(){try{const F=DU.fx;if(P.union&&F&&F.w100){(F.W||[]).forEach(o=>{o.w.visible=false});(F.h100||[]).forEach(o=>o.visible=false);const t=performance.now()/1000;F.w100.rotation.z=Math.sin(t*2)*.04;F.w100.rotation.y=Math.sin(t*1.3)*.05}}catch(e){}}

{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{gb100Tick()}catch(e){}try{nr100Tick(dt)}catch(e){}try{zp100Tick(dt)}catch(e){}try{uw100Tick()}catch(e){}return r}}

