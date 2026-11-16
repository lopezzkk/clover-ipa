// ================= V98 · espada do Asta na mão direita e menos apontada para o chão =================
// A espada passa para a mão direita. As animações de ataque foram feitas para o outro braço, então,
// só na hora de desenhar a tela, as poses dos dois braços são trocadas (espelhadas). Toda a lógica do jogo continua igual.
const SWR98={x:1.85,y:0,z:0};
function sw98On(){return !!(sword&&PP&&PP.arms&&sword.parent===PP.arms[0][1])}
{const _as=addSword;addSword=function(){const had=!!sword;const r=_as.apply(this,arguments);try{if(!had&&sword){PP.arms[0][1].add(sword);sword.rotation.set(SWR98.x,SWR98.y,SWR98.z)}}catch(e){}return r}}
function sw98Swap(){const A=PP.arms[0],B=PP.arms[1];for(let k=0;k<2;k++){const a=A[k].rotation,b=B[k].rotation,ax=a.x,ay=a.y,az=a.z;a.set(b.x,-b.y,-b.z);b.set(ax,-ay,-az)}}
{const r0=R.render.bind(R);R.render=function(s,c){const sw=sw98On()&&s===S;if(sw)sw98Swap();try{return r0(s,c)}finally{if(sw)sw98Swap()}}}
// magias que saem da mão da espada passam a sair da mão direita
{const _vh=v82Hand;v82Hand=function(){if(!sw98On())return _vh.apply(this,arguments);try{sw98Swap();PP.arms[0][1].updateMatrixWorld(true);const v=new T.Vector3(0,PP.attY||-.38,0);PP.arms[0][1].localToWorld(v);sw98Swap();return v}catch(e){return _vh.apply(this,arguments)}}}

