// ================= V97 · Matadora de Demônios com o modelo 3D enviado pelo jogador =================
// Sem ferrugem: a lâmina é toda escura, como no anime. A lâmina enferrujada da V96 fica no código, só escondida.
// Postura: espada para baixo, reta, seguindo a linha do braço e inclinada para o lado (igual à imagem de referência).
MD96.asta97=MD97.asta;
const SW97={s:.22,grip:2.2};   // escala do modelo e altura (no modelo) do meio do cabo, onde a mão segura
{const _ms=makeDemonSword;makeDemonSword=function(){const g=_ms.apply(this,arguments);try{g.children.slice().forEach(o=>g.remove(o));
  const geo=md96Geo('asta97'),mt=new T.MeshLambertMaterial({color:0x1d1d23,emissive:0x07060a});mt._keep=1;
  const m=new T.Mesh(geo,mt);m.castShadow=true;m.rotation.x=-Math.PI/2;m.scale.setScalar(SW97.s);m.position.y=-SW97.grip*SW97.s;
  const ol=new T.Mesh(geo,olm);ol.scale.set(1.035,1.035,1.035);m.add(ol);g.add(m);g.userData.m97=m}catch(e){}return g}}
const SWR97={x:Math.PI,y:0,z:-1.1};
{const _as=addSword;addSword=function(){const had=!!sword;const r=_as.apply(this,arguments);try{if(!had&&sword){sword.position.y=(PP.attY||-.34)+.02;sword.rotation.set(SWR97.x,SWR97.y,SWR97.z)}}catch(e){}return r}}
{const _mk=mkSword;mkSword=function(){const sw=_mk.apply(this,arguments);try{sw.rotation.set(SWR97.x,SWR97.y,SWR97.z)}catch(e){}return sw}}

