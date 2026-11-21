// ===================== V89 · vida nas ruas: frente das casas com canteiros, lampião, banco, caixas de loja; carroças nas cidades =====================
{let sd=89089;const rr=()=>(sd=(sd*16807)%2147483647)/2147483647;
 const free=(x,z,r)=>!nearRoad(x,z,3.8+r)&&!inWater83(x,z)&&!SOL.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+r:Math.abs(x-o.x)<o.hx+r&&Math.abs(z-o.z)<o.hz+r);
 const FL=[[0xff6a9a,0xffd34a,0xffffff],[0xb07aff,0xffffff,0xff9ad0],[0xff4a3a,0xffe066],[0x6ab0ff,0xffffff]];
 for(const d of TODAS86){if(!['cottage','two','stone','merchant','rich','shop','tavern','library','temple','smithy'].includes(d.kind))continue;const fx=Math.sin(d.ry),fz=Math.cos(d.ry),sx=fz,sz=-fx;
  for(const s of[-1,1]){const x=d.x+sx*s*2.2-fx*.6,z=d.z+sz*s*2.2-fz*.6,k=rr();if(!free(x,z,.6))continue;const D=G83();D.userData.lod='d';
   if(k<.45){bp(D,BX(1.4,.25,.6),0x6a4a2e,0,.12,0,1);flowers(D,0,0,5,FL[Math.floor(rr()*4)]);D.rotation.y=d.ry}
   else if(k<.62){lantern(D,0,0)}else if(k<.75&&d.kind!='cottage'){bench(D,0,0,d.ry+Math.PI)}else if(d.kind=='shop'||d.kind=='merchant'||d.kind=='smithy'){crate(D,0,0,.8,rr());barrel(D,.8,.3)}else{bp(D,CY(.3,.25,.5,8),0xb4643a,0,.25,0,1);bp(D,IC(.4,0),0x4f9a3e,0,.65,0,1)}
   put(D,x,z);sol(x,z,.5)}}
 // carroças decorativas, poços e varais nas cidades e vilas
 const cart=(x,z,ry)=>{const g=G83();bp(g,BX(1.6,.5,2.6),0x7a5232,0,.9,0,1);for(const s of[-1,1])bp(g,BX(.08,.5,2.6),0x5a3a22,s*.8,1.3,0);bp(g,BX(.08,.08,1.8),0x5a3a22,0,.75,1.9);for(const [a,b] of[[-1,-.8],[1,-.8],[-1,.8],[1,.8]]){const w=bp(g,new T.TorusGeometry(.42,.07,5,12),0x3a2a1a,a*.88,.45,b,1);w.rotation.y=Math.PI/2;bp(g,CY(.06,.06,.1,6),0x2a2a2e,a*.88,.45,b).rotation.z=Math.PI/2}
  for(let k=0;k<3;k++)bp(g,SP(.22,6,5),[0xd8c49a,0xc8a060,0x8ab040][k],(k-1)*.4,1.3,(k-1)*.5);g.rotation.y=ry;put(g,x,z);sol(x,z,1.5)};
 const spots=[];for(const v of VILS)spots.push([v.x,v.z,v.r||28]);spots.push([0,CZ,50],[320,300,70],[-440,270,55]);
 for(const [cx,cz,R] of spots)for(let k=0,n=0;k<30&&n<3;k++){const a=rr()*6.283,dd=R*(.35+rr()*.55),x=cx+Math.cos(a)*dd,z=cz+Math.sin(a)*dd;if(!free(x,z,2)||!nearRoad(x,z,8))continue;cart(x,z,rr()*6.28);n++}}

