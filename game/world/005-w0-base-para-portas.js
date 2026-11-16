// ===================== V86 · base para portas (interiores) e cidades muradas =====================
// Toda casa colocada com placeHouse registra a porta (na frente da casa). Prédios especiais chamam door86 direto.
const DOORS86=[];function door86(x,z,kind,name,ry){DOORS86.push({x,z,kind,name:name||null,ry:ry||0,id:DOORS86.length});return DOORS86.length-1}
placeHouse=(f=>function(type,x,z,ry,o,sc){const rr=f.apply(this,arguments);try{if(type!='ruin'){const d=(rr||3)+1.2;door86(x+Math.sin(ry)*d,z+Math.cos(ry)*d,type,null,ry)}}catch(e){}return rr})(placeHouse);
// lugar livre para construir (fora de estrada, água e colisões)
function free86(x,z,r,road){if(nearRoad(x,z,(road==null?4:road)+r))return false;for(let k=0;k<8;k++){const a=k/8*6.283;if(inWater83(x+Math.cos(a)*r,z+Math.sin(a)*r))return false}if(inWater83(x,z))return false;
 return !SOL.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+r:Math.abs(x-o.x)<o.hx+r&&Math.abs(z-o.z)<o.hz+r)}
// muralha circular com portões automáticos onde as estradas cruzam (torres nas pontas de cada portão)
function walledCity86(cx,cz,R,o){o=o||{};const N=o.n||Math.round(R*6.283/5),H=o.h||7,C=o.c||0xa29e96,C2=o.c2||0x8a8680,RF=o.rf||0x3e4a62,gate=[];
 for(let i=0;i<N;i++){const a=i/N*6.2832;gate.push(nearRoad(cx+Math.cos(a)*R,cz+Math.sin(a)*R,5.4))}
 for(let i=0;i<N;i++){if(gate[i])continue;const a=i/N*6.2832,a2=(i+1)/N*6.2832;wall83(null,cx+Math.cos(a)*R,cz+Math.sin(a)*R,cx+Math.cos(a2)*R,cz+Math.sin(a2)*R,H,C,C2,o.th||1.6);
  if(i%(o.tw||9)==4&&!gate[(i+N-1)%N]&&!gate[(i+1)%N])tower83(cx+Math.cos(a)*R,cz+Math.sin(a)*R,o.tr||2.6,H+4,C2,RF)}
 const gates=[];for(let i=0;i<N;i++){if(!gate[i]||gate[(i+N-1)%N])continue;let j=i;while(gate[(j+1)%N]&&j-i<N)j++;const a0=i/N*6.2832,a1=(j+1)/N*6.2832,am=(a0+a1)/2,w=R*(a1-a0);
  for(const aa of[a0,a1])tower83(cx+Math.cos(aa)*R,cz+Math.sin(aa)*R,(o.tr||2.6)+.3,H+5,C2,RF);
  const g=G83();bp(g,BX(w+2,1.8,2.2),C2,0,H+1.2,0,1);for(let k=0;k<5;k++)bp(g,BX(.9,.9,2.3),C,-w/2+k*w/4,H+2.5,0,1);
  for(const sd of[-1,1])for(const fz of[-1.16,1.16]){bp(g,BX(1.3,2.6,.06),o.flag||0x3b4aa0,sd*w*.3,H-.4,fz,1);if(o.flag2)bp(g,BX(.5,.5,.07),o.flag2,sd*w*.3,H-.1,fz*1.01)}
  g.rotation.y=-am-Math.PI/2;put(g,cx+Math.cos(am)*R,cz+Math.sin(am)*R);gates.push(am)}return gates}
// casas ao longo de uma rua (dos dois lados, porta virada para a rua)
function streetHouses86(x1,z1,x2,z2,step,off,pal,pick,sc){const L=Math.hypot(x2-x1,z2-z1),ux=(x2-x1)/L,uz=(z2-z1)/L,px=-uz,pz=ux;let n=0;
 for(let t=step/2;t<L;t+=step)for(const s of[-1,1]){const x=x1+ux*t+px*off*s,z=z1+uz*t+pz*off*s;if(!free86(x,z,3.6,2.4))continue;const tp=pick();const st=Object.assign(hStyle(pal),{w:4.4+rnd()*1.6});
  const ry=Math.atan2(-px*s,-pz*s);const rr=placeHouse(tp,x,z,ry,st,sc||1);sol(x,z,rr);n++}return n}

