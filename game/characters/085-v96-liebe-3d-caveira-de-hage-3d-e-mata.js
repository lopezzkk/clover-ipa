// ================= V96 · Liebe 3D, Caveira de Hage 3D e Matadora com ferrugem =================
// Modelos enviados pelo jogador (Cults3D), reduzidos e pintados para o jogo. Nada antigo foi apagado:
// os modelos antigos continuam no código, só ficam escondidos quando o novo aparece.
const G96={};
function md96Geo(k){if(G96[k])return G96[k];const M=MD96[k];const s=atob(M.d),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);
 const n=M.n,b=M.b,q=new Uint16Array(u.buffer,0,n*3),c=new Uint8Array(u.buffer,n*6,n*3);let off=n*9;off+=off%2;if(M.w==4)off+=(4-off%4)%4;
 const idx=M.w==4?new Uint32Array(u.buffer,off,M.f*3):new Uint16Array(u.buffer,off,M.f*3);const p=new Float32Array(n*3);
 for(let i=0;i<n;i++)for(let a=0;a<3;a++)p[i*3+a]=b[a]+q[i*3+a]/65535*(b[a+3]-b[a]);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));g.setAttribute('color',new T.BufferAttribute(new Uint8Array(c),3,true));g.setIndex(new T.BufferAttribute(idx.slice(),1));g.computeVertexNormals();g.computeBoundingBox();g._keep=1;G96[k]=g;return g}
const M96={};
function mat96(k,toon){if(M96[k])return M96[k];const m=toon&&typeof gmap!='undefined'?new T.MeshToonMaterial({vertexColors:true,gradientMap:gmap}):new T.MeshLambertMaterial({vertexColors:true});m._keep=1;M96[k]=m;return m}

// ---------- Liebe: o modelo novo entra no lugar do boneco antigo (no companheiro, nas conversas e nas cenas) ----------
// altura 1,3 (igual ao corpo antigo); frente para +Z; pés no chão (y=0)
function lie96(hi){const g=new T.Group(),inner=new T.Group(),m=new T.Mesh(md96Geo(hi&&KQ()>=.75?'liebe':'liebeLo'),mat96('lie',1));m.castShadow=true;
 m.rotation.x=-Math.PI/2;inner.add(m);inner.rotation.y=-Math.PI/2;const s=1.3;inner.scale.setScalar(s);inner.position.y=.5*s;g.add(inner);g.userData.in96=inner;return g}
{const _lb=lieBody;lieBody=function(detail){const b=_lb.apply(this,arguments);try{const u=UD(b);b.traverse(o=>{if(o.isMesh)o.visible=false});const L=lie96(detail);b.add(L);u.m96=L}catch(e){}return b}}
{const _la=lieAnim;lieAnim=function(root,t,mode){_la.apply(this,arguments);try{for(const b of(UD(root).parts||[])){const L=UD(b).m96;if(!L)continue;const i=L.userData.in96;i.rotation.z=Math.sin(t*1.3)*.06;i.rotation.x=mode=='talk'?Math.sin(t*9)*.05:Math.sin(t*1.1)*.03;const sq=mode=='talk'?1+Math.abs(Math.sin(t*9))*.03:1;i.scale.set(1.3,1.3*sq,1.3)}}catch(e){}}}
// conversa/cenas: Liebe em tamanho normal (mais ou menos a altura do jogador); a câmera mira o rosto do modelo novo
{const _cd=csDemon;csDemon=function(id){const g=_cd.apply(this,arguments);try{if(id=='liebe'){const b=UD(g).parts&&UD(g).parts[0];if(b)b.scale.setScalar(1.55);UD(g).face=1.05;UD(g).arm=.6}}catch(e){}return g}}

// ---------- Caveira de Hage: modelo novo no lugar da caveira antiga da Colina do Crânio ----------
const SK96={g:null,old:[],t:0};
function sk96Init(){if(SK96.g)return;const H={x:61,z:-8};const old=[];S.traverse(o=>{if(!o.isMesh||o.userData.n96)return;const bb=new T.Box3().setFromObject(o);if(bb.isEmpty())return;const c=bb.getCenter(new T.Vector3()),sz=bb.getSize(new T.Vector3());if(Math.hypot(c.x-H.x,c.z-H.z)<22&&c.y>3&&sz.y>3&&sz.x<50&&sz.z<50)old.push(o)});
 if(!old.length)return;old.forEach(o=>{o.visible=false;o.layers.set(5);o.traverse(c=>c.layers.set(5))});SK96.old=old;
 const g=new T.Group(),inner=new T.Group(),m=new T.Mesh(md96Geo('skull'),mat96('sk',0));m.castShadow=true;m.receiveShadow=true;m.userData.n96=1;m.rotation.x=-Math.PI/2;const bb=md96Geo('skull').boundingBox,c=new T.Vector3();bb.getCenter(c);m.position.set(-c.x,0,c.y);inner.add(m);inner.scale.setScalar(30/190);g.add(inner);g.position.set(H.x,1.5,H.z);S.add(g);SK96.g=g}
function sk96Tick(dt){SK96.t-=dt;if(SK96.t>0)return;SK96.t=2;try{if(!SK96.g)sk96Init();else SK96.old.forEach(o=>{if(o.visible)o.visible=false});if(SK96.g&&!SK96.g.parent&&!ENC.on)S.add(SK96.g)}catch(e){}}

// ---------- Matadora de Demônios: lâmina nova (larga, lascada e enferrujada) + espada de lado ----------
{const _ms=makeDemonSword;makeDemonSword=function(){const g=_ms.apply(this,arguments);try{for(let i=0;i<5&&i<g.children.length;i++)g.children[i].visible=false;
  const geo=md96Geo('blade'),bl=new T.Mesh(geo,mat96('bl',0));bl.castShadow=true;bl.position.y=.06;const ol=new T.Mesh(geo,olm);ol.scale.set(1.04,1.012,1.6);bl.add(ol);g.add(bl);
  g.children.forEach((o,i)=>{if(i>=5&&o.isMesh&&o.material&&o.material.color&&o.material.color.getHex()==0x2e2e33){o.material=o.material.clone();o.material.color.setHex(0x3e3430)}})}catch(e){}return g}}
// espada de lado: inclinada para fora e para trás (antes ficava reta apontando para a frente)
const SWR96={x:.55,y:0,z:-.75};
{const _as=addSword;addSword=function(){const had=!!sword;const r=_as.apply(this,arguments);try{if(!had&&sword){sword.rotation.set(SWR96.x,SWR96.y,SWR96.z)}}catch(e){}return r}}
{const _mk=mkSword;mkSword=function(){const sw=_mk.apply(this,arguments);try{sw.rotation.set(SWR96.x,SWR96.y,SWR96.z)}catch(e){}return sw}}

{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{sk96Tick(dt)}catch(e){}return r}}

