// ===================== V86 · mapa mais rico: beira das estradas, campos com tons variados, arbustos, juncos e cachoeiras =====================
{let sd=86086;const rr=()=>(sd=(sd*16807)%2147483647)/2147483647,R=(a,b)=>a+rr()*(b-a);
 const busy=(x,z,m)=>inWater83(x,z)||SOL.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+m:Math.abs(x-o.x)<o.hx+m&&Math.abs(z-o.z)<o.hz+m);
 const city=(x,z)=>{const r=reg83(x,z);return r&&['capital','heart','diamond','spade','sombras','hage'].includes(r.id)&&Math.hypot(x-r.x,z-r.z)<r.r*.7};
 // 1) beira das estradas: pedrinhas, tufos de flores e arbustos alternados (sem cair em cima da estrada)
 for(const r of ROADS){const dx=r[2]-r[0],dz=r[3]-r[1],L=Math.hypot(dx,dz);if(L<8)continue;const ux=dx/L,uz=dz/L,px=-uz,pz=ux;
  for(let t=4;t<L;t+=R(7,12)){const s=rr()<.5?-1:1,off=R(5.2,7),x=r[0]+ux*t+px*off*s,z=r[1]+uz*t+pz*off*s;if(nearRoad(x,z,4.6)||busy(x,z,1.2)||city(x,z))continue;
   const D=G83();D.userData.lod='d';const k=rr();if(k<.35){bp(D,DO(R(.25,.45)),0x8a8a90,0,.15,0,1);bp(D,DO(R(.15,.25)),0x9a9aa0,.4,.1,.2)}else if(k<.7)flowers(D,0,0,6,[[0xffe066,0xffffff,0xff7aa8],[0xb07aff,0xffffff],[0xff9a3a,0xffe066]][Math.floor(rr()*3)]);
   else{bp(D,IC(R(.6,.9),0),[0x4f9a3e,0x3e8a3a,0x5aa848][Math.floor(rr()*3)],0,.45,0,1);bp(D,IC(R(.4,.6),0),0x5aa848,.6,.35,.2,1)}put(D,x,z)}}
 // 2) campos com manchas de grama em tons diferentes (quebra o verde liso)
 for(let i=0;i<220;i++){const x=R(-560,560),z=R(-620,420);if(busy(x,z,2)||nearRoad(x,z,5)||city(x,z))continue;const g=G83();const p=mk(new T.CircleGeometry(R(4,11),9),[0x6aa84a,0x86b85a,0x5a9a40,0x9ab866,0x78a850][i%5]);p.rotation.x=-Math.PI/2;p.position.y=.012+(i%4)*.001;p.scale.set(1,R(.6,1.4),1);p.receiveShadow=true;g.add(p);g.rotation.y=rr()*6.28;put(g,x,z)}
 // 3) arbustos e moitas soltas nos campos
 for(let i=0;i<160;i++){const x=R(-560,560),z=R(-620,420);if(busy(x,z,1.5)||nearRoad(x,z,5)||city(x,z))continue;const g=G83();for(let k=0;k<3;k++)bp(g,IC(R(.5,1),0),[0x3e8a3a,0x4f9a3e,0x2f7a32][k],R(-.6,.6),R(.4,.7),R(-.6,.6),1);if(rr()<.3)for(let k=0;k<4;k++)bp(g,SP(.09,5,4),0xd03a3a,R(-.6,.6),R(.8,1.1),R(-.6,.6));put(g,x,z);sol(x,z,.9)}
 // 4) juncos e pedras na beira dos lagos
 for(const w of WATER83){if(w.t!='c')continue;for(let k=0;k<Math.round(w.r*1.4);k++){const a=k/Math.round(w.r*1.4)*6.283+R(-.1,.1),d=w.r+R(.4,1.6),x=w.x+Math.cos(a)*d,z=w.z+Math.sin(a)*d;if(inWater83(x,z)||nearRoad(x,z,4))continue;const g=G83();g.userData.lod='d';
   if(k%3)for(let j=0;j<5;j++){const c=bp(g,CY(.03,.04,R(1,1.6),4),0x6a8a3a,R(-.4,.4),.6,R(-.4,.4));c.rotation.z=R(-.2,.2)}else bp(g,DO(R(.5,.9)),0x8a8a90,0,.25,0,1);put(g,x,z)}}
 // 5) penhascos com cachoeira caindo nos lagos (a água que cai é animada no módulo V86)
 window.FALLS86=[];for(const [x,z,ry] of[[-262,-341,0],[258,-337,0],[-452,-130,0]]){const g=G83();for(let k=0;k<7;k++)bp(g,DO(R(3,5)),[0x7a7480,0x6a6470,0x8a8478][k%3],(k-3)*2.6,R(2,6)+(Math.abs(k-3)<2?3:0),R(-1.5,1.5),1);bp(g,BX(6,11,4),0x6a6470,0,5.5,-1,1);bp(g,DO(2.2),0x7a7480,-3.4,10,-.5,1);bp(g,DO(2.2),0x7a7480,3.4,10.6,-.4,1);
  g.rotation.y=ry;put(g,x,z);solB(x,z,9,3);FALLS86.push({x,z:z+1.4,ry})}}

