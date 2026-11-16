// ================= V101 · espada de volta na mão certa (a do lado do grimório) + Destruidora segurada pelo cabo + grimório aberto com a capa do Asta =================
// A V98 tinha mudado a espada de mão; aqui ela volta para a mão original (a dos golpes), apontando para a frente.
{const _as=addSword;addSword=function(){const had=!!sword;const r=_as.apply(this,arguments);try{if(!had&&sword){PP.arms[1][1].add(sword);sword.position.y=PP.attY||-.34;sword.rotation.set(SWR98.x,SWR98.y,SWR98.z)}}catch(e){}return r}}
// Destruidora: o cabo fica na mão (origem) e a lâmina para cima (+Y), igual às outras espadas
{const _wm=wpnModel;wpnModel=function(k){if(k!=='destroyer')return _wm.apply(this,arguments);const g=new T.Group();try{glb100('dds',sc=>{sc.updateMatrixWorld(true);
  const bb=new T.Box3().setFromObject(sc),sz=bb.getSize(new T.Vector3()),ax=sz.x>=sz.y&&sz.x>=sz.z?'x':sz.z>=sz.y?'z':'y';
  let hc=null;sc.traverse(o=>{if(!hc&&o.isMesh&&/handle/i.test((o.name||'')+(o.parent&&o.parent.name||''))){hc=new T.Box3().setFromObject(o).getCenter(new T.Vector3())}});
  const mid=bb.getCenter(new T.Vector3());const hv=hc?hc[ax]-mid[ax]:-1;
  const inner=new T.Group();inner.add(sc);
  // gira para o eixo comprido virar +Y com o cabo embaixo
  if(ax=='x')sc.rotation.z=hv>0?Math.PI/2:-Math.PI/2;else if(ax=='z')sc.rotation.x=hv>0?Math.PI/2:-Math.PI/2;else if(hv>0)sc.rotation.z=Math.PI;
  inner.updateMatrixWorld(true);const L=2.15,b2=new T.Box3().setFromObject(inner),s2=L/b2.getSize(new T.Vector3()).y;inner.scale.setScalar(s2);inner.updateMatrixWorld(true);
  let hy=0;sc.traverse(o=>{if(o.isMesh&&/handle/i.test((o.name||'')+(o.parent&&o.parent.name||''))){hy=new T.Box3().setFromObject(o).getCenter(new T.Vector3()).y}});
  const b3=new T.Box3().setFromObject(inner),c3=b3.getCenter(new T.Vector3());inner.position.set(-c3.x,-(hc?hy:b3.min.y+.15),-c3.z);
  const f=new T.Group();f.add(inner);f.rotation.y=Math.PI/2;g.add(f)})}catch(e){}return g}}
// grimório de Anti-Magia: continua ABERTO (como os outros), com a capa do modelo do Asta (trevo de cinco folhas)
const GB101={tex:null,on:false,ld:0};
function gb101Tick(){if(typeof book=='undefined'||!book)return;if(GB100.m)GB100.m.visible=false;const want=!!(P.g&&P.g.id=='anti');
 book.children.forEach(c=>{if(c!==GB100.m)c.visible=true});if(book.userData.gl)book.userData.gl.visible=true;
 if(want&&!GB101.tex&&!GB101.ld){GB101.ld=1;glb100('grim',sc=>{sc.traverse(o=>{if(!GB101.tex&&o.isMesh&&o.material&&o.material.map)GB101.tex=o.material.map})})}
 const cm=book.material;if(!cm)return;if(want&&GB101.tex){if(cm.map!==GB101.tex){GB101.c0=cm.color.getHex();cm.map=GB101.tex;cm.needsUpdate=true}cm.color.setRGB(1,1,1)}else if(cm.map&&cm.map===GB101.tex){cm.map=null;cm.needsUpdate=true;if(GB101.c0!=null)cm.color.setHex(GB101.c0)}}
gb100Tick=function(){};
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{gb101Tick()}catch(e){}return r}}
// grimório mais alto quando a espada está na mão (a espada passa por baixo do livro)
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{const want=(sword&&sword.visible&&P.sword)||(typeof scyM!='undefined'&&scyM&&scyM.visible)?.8:0;window.BK101=(window.BK101||0)+(want-(window.BK101||0))*Math.min(1,dt*6)}catch(e){}return r}}

