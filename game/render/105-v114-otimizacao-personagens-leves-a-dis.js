// ================= V114 · OTIMIZAÇÃO: personagens leves à distância e modo Desempenho =================
// Medição (Vila Hage): o cenário já é 1 desenho por bloco; o peso vem dos personagens (35 a 70 desenhos cada um).
// 1) NPC longe da câmera vira UM modelo só (mesma aparência, parado). Perto, volta ao modelo completo e animado.
// 2) Modo Desempenho: sem contornos nos personagens (corta quase metade dos desenhos), resolução e visão menores.
(function(){
const L={t:0,ot:0,mat:null,n:0};window.L114=L;
function lodDist(){return CFG.perf?7:CFG.ultra?1e9:CFG.gfx=='baixo'?13:CFG.gfx=='alto'?46:26}
function mat(){if(L.mat)return L.mat;let gm=null;try{gm=PP.mT.gradientMap||null}catch(e){}L.mat=gm?new T.MeshToonMaterial({vertexColors:true,gradientMap:gm}):new T.MeshLambertMaterial({vertexColors:true});return L.mat}
// junta todas as peças do corpo do NPC em uma geometria com cor por vértice
function build(n){try{const g=n.g,root=n.root;if(!root)return null;g.updateMatrixWorld(true);const inv=new T.Matrix4().copy(g.matrixWorld).invert(),pos=[],nor=[],col=[],m4=new T.Matrix4(),n3=new T.Matrix3(),v=new T.Vector3(),c=new T.Color();let bad=false;
 root.traverse(o=>{if(bad||!o.isMesh||o===n._lod)return;if(o.isSkinnedMesh){bad=true;return}let p=o,vis=true;while(p&&p!==g){if(!p.visible){vis=false;break}p=p.parent}if(!vis)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||m===olm||m.visible===false||(m.transparent&&m.opacity<.35))return;if(m.side===T.BackSide)return;
  const ge=o.geometry,pa=ge.attributes.position;if(!pa)return;const na=ge.attributes.normal,ix=ge.index;m4.multiplyMatrices(inv,o.matrixWorld);n3.getNormalMatrix(m4);c.copy(m.color||c.set(0xffffff));const cnt=ix?ix.count:pa.count;
  for(let i=0;i<cnt;i++){const k=ix?ix.getX(i):i;v.fromBufferAttribute(pa,k).applyMatrix4(m4);pos.push(v.x,v.y,v.z);if(na){v.fromBufferAttribute(na,k).applyMatrix3(n3).normalize();nor.push(v.x,v.y,v.z)}else nor.push(0,1,0);col.push(c.r,c.g,c.b)}});
 if(bad||pos.length<9)return null;const bg=new T.BufferGeometry();bg.setAttribute('position',new T.Float32BufferAttribute(pos,3));bg.setAttribute('normal',new T.Float32BufferAttribute(nor,3));bg.setAttribute('color',new T.Float32BufferAttribute(col,3));const me=new T.Mesh(bg,mat());me.castShadow=false;me.visible=false;me.matrixAutoUpdate=true;g.add(me);return me}catch(e){return null}}
function setLod(n,far){if(n._lodOn===far)return;if(far&&!n._lod){if(n._lodFail)return;if(L.n>=2)return;L.n++;n._lod=build(n);if(!n._lod){n._lodFail=1;return}}n._lodOn=far;if(n._lod)n._lod.visible=far;if(n.root)n.root.visible=!far}
function lod(){let d0=lodDist();try{if(window.EX105&&(EX105.on||EX105.present))d0=Math.max(d0,60)}catch(e){}const h=d0*.12;L.n=0;for(const n of NPCS){if(!n||!n.g||!n.root)continue;const p=n.g.position,d=Math.hypot(p.x-P.x,p.z-P.z);if(d>170)continue;const far=n._lodOn?d>d0-h:d>d0+h;setLod(n,far)}}
// contornos: desligados só no modo Desempenho
function outlines(){try{const off=!!CFG.perf;if(typeof olm!='undefined')olm.visible=!off;if(off||L.oOff){S.traverse(o=>{if(o.isMesh&&o.name&&/Outline/.test(o.name)){if(off){if(o.visible){o.visible=false;o.userData.o114=1}}else if(o.userData.o114){o.visible=true;o.userData.o114=0}}})}L.oOff=off}catch(e){}}
{const _a=applyCfg;applyCfg=function(){const r=_a.apply(this,arguments);try{outlines();L.t=0}catch(e){}return r}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{dt=dt||0;L.t-=dt;if(L.t<=0){L.t=.3;lod()}L.ot-=dt;if(L.ot<=0){L.ot=6;if(CFG.perf)outlines()}}catch(e){}return r}}
// aparência do NPC mudou (roupa/pose de missão)? refaz o modelo leve na próxima vez
window.lod114Reset=function(n){try{if(n&&n._lod){n.g.remove(n._lod);n._lod.geometry.dispose();n._lod=null;n._lodOn=false;n.root.visible=true}}catch(e){}};
try{outlines()}catch(e){}
})();

