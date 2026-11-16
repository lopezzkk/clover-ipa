// ===================== V83 · Reino Comum: Touros Negros, Sossy, Kiten, Nairn, Masmorra Antiga =====================
// ---------- Esconderijo dos Touros Negros: casarão velho de três andares, remendado, com torre torta e pátio de treino
{const x0=128,z0=-150,g=G83(),D=G83();D.userData.lod='d';const WD=0x5a4636,WD2=0x4a3a2e,ST=0x6e6a66,RF=0x2a2a30,RF2=0x3a3a44;
 bp(g,BX(26,.5,18),ST,0,.25,0,1);
 bp(g,BX(20,7,12),WD,0,4,0,1);bp(g,BX(16,6,10),WD2,1,10,0,1);bp(g,BX(11,5,8),WD,-1,15.5,0,1);
 gable(g,21,13,3.4,RF,7.5,WD,.5);hip(g,17,11,3,RF2,13);hip(g,12,9,3.6,RF,18);
 // torre torta à esquerda e anexo à direita
 {const t=G83();t.position.set(-11.5,0,-2);t.rotation.z=.05;bp(t,CY(3,3.4,20,8),ST,0,10,0,1);bp(t,CN(4,6,8),RF,0,23,0,1);for(let k=0;k<4;k++)win(t,0,5+k*4,3.05,0,1,1.6,k%2,0x2a2a2a);g.add(t)}
 {const t=G83();t.position.set(12.5,0,1);bp(t,BX(6,5,8),WD2,0,2.5,0,1);gable(t,6,8,2.4,RF2,5,WD2,.4);g.add(t)}
 for(const y of[4,10,15.5])for(let k=-3;k<=3;k++){if(y>12&&Math.abs(k)>2)continue;win(g,k*2.6,y,y<8?6.06:y<13?5.06:4.06,0,1.1,1.8,(k+y)%3==0,0x2a2016)}
 door(g,0,6.1,0,2.6,3.4,0x2a1a10,0x1a1a1a,1);bp(g,BX(1.2,4,1.2),0x8a5a3a,7,16,1,1);bp(g,BX(1.4,.4,1.4),0x3a3a3e,7,18.2,1);
 // tábuas remendando a fachada
 for(let k=0;k<8;k++){const p=bp(g,BX(R83(1.5,3),.5,.1),0x7a6046,R83(-9,9),R83(2,16),R83(4,6.1)+.02);p.rotation.z=R83(-.4,.4)}
 // pátio: bonecos de treino, sucata, bandeiras pretas
 for(let k=0;k<3;k++){const d=G83();bp(d,CY(.12,.12,2,6),0x5a3a22,0,1,0);bp(d,SP(.45,6,5),0xd9b86a,0,2.1,0,1);bp(d,BX(1.2,.15,.15),0xd9b86a,0,1.6,0);d.position.set(-6+k*5,0,14);D.add(d)}
 for(let k=0;k<5;k++)crate(D,9+k%3,12+Math.floor(k/3),1,k*.4);barrel(D,-9,12);barrel(D,-8.2,12.8);woodpile(D,11,-8,0);
 for(const sx of[-8,8])banner83(D,sx,0,9,0x141414,0x8a1f1f,0);
 fenceRow(D,-13,18,13,18,0x3a3026);
 put(g,x0,z0);put(D,x0,z0);solB(x0,z0,10.5,6.5);sol(x0-11.5,z0-2,3.6);solB(x0+12.5,z0+1,3.2,4.2);signBoard('Esconderijo dos Touros Negros',x0-16,z0+20,.4)}
// ---------- Vila Sossy: campos de trigo, moinho e celeiros (vila de fazendeiros)
{const v=VILS[1];const pal={wall:[0xe8dcc0,0xd9c69a,0xf0e2c0],stone:[0xa09a8a],roof:[0x9a4a32,0xa8603a,0x8a3e2e,0x7a4a32],door:[0x6b4426,0x7a4a2a]};
 buildVillage(v,{ground:0xc4a46a,roofs:[0xc8582f,0xd9773a],kind:'farm',houses:7,pal,pick:housePicker(['cottage','two','merchant','cottage','stone'])});
 for(let k=0;k<6;k++){const fx=v.x+34+(k%3)*16,fz=v.z-22+Math.floor(k/3)*22,fl=mk(new T.PlaneGeometry(13,17),0x8a6a3a);fl.rotation.x=-Math.PI/2;fl.position.set(fx,.03,fz);S.add(fl);const W=G83();W.userData.lod='d';for(let r=0;r<6;r++)for(let c=0;c<5;c++)bp(W,CN(.35,1.3,4),0xe0c050,-5+c*2.5+(r%2)*.6,.65,-7+r*2.8);put(W,fx,fz)}
 {const g=G83();bp(g,BX(9,6,7),0x9a3a2a,0,3,0,1);gable(g,9,7,3.6,0x5a3a2a,6,0x9a3a2a,.5);door(g,0,3.55,0,3,4,0x5a3a22,0xe8dcc0);put(g,v.x+12,v.z+28);solB(v.x+12,v.z+28,4.8,3.8)}
 {const g=G83();bp(g,CY(2.2,3,11,8),0xe8dcc0,0,5.5,0,1);bp(g,CN(3.2,3.6,8),0xb04a3a,0,12.8,0,1);bp(g,CY(.4,.4,.8,8),0x6e4a2a,0,9.5,3,1).rotation.x=1.5708;put(g,v.x-30,v.z-18);sol(v.x-30,v.z-18,3.4)}}
// ---------- Cidade de Kiten: fortaleza da fronteira com Diamond (muralha de pedra, torres, portão)
{const v=VILS[3];buildVillage(v,{ground:0xb9b4a6,roofs:[0x2f4a7a],kind:'fort',houses:9,hw:5.6,hh:4.2,stone:1,wall:1,noRing:1,pal:{wall:[0xd9cbb0,0xc8b89a,0xe2d4bc],stone:[0x9a948a,0x8a8478],roof:[0x4a5a6a,0x3e4a5a,0x5a5a60]},pick:housePicker(['stone','two','merchant','stone','rich']),sc:1.05});
 tower83(v.x-14,v.z-10,3.6,16,0x9a968e,0x4a5a6a);tower83(v.x+14,v.z-10,3.6,16,0x9a968e,0x4a5a6a);
 // V84: muralha contínua de pedra com portões de verdade onde as estradas chegam (antes a muralha fechava a estrada)
 {const R=v.r+1,N=60,SW=0xa29e96,SW2=0x8a8680,RF=0x3e4a62,gate=[];for(let i=0;i<N;i++){const a=i/N*6.2832;gate.push(nearRoad(v.x+Math.cos(a)*R,v.z+Math.sin(a)*R,5.2))}
  for(let i=0;i<N;i++){if(gate[i])continue;const a=i/N*6.2832,a2=(i+1)/N*6.2832;wall83(null,v.x+Math.cos(a)*R,v.z+Math.sin(a)*R,v.x+Math.cos(a2)*R,v.z+Math.sin(a2)*R,5.4,SW,SW2,1.4);if(i%10==5&&!gate[(i+N-1)%N]&&!gate[(i+1)%N])tower83(v.x+Math.cos(a)*R,v.z+Math.sin(a)*R,2.4,8.5,SW2,RF)}
  for(let i=0;i<N;i++){if(!gate[i]||gate[(i+N-1)%N])continue;let j=i;while(gate[(j+1)%N]&&j-i<N)j++;const a0=i/N*6.2832,a1=(j+1)/N*6.2832,am=(a0+a1)/2,w=R*(a1-a0);
   for(const aa of[a0,a1])tower83(v.x+Math.cos(aa)*R,v.z+Math.sin(aa)*R,2.6,10,SW2,RF);
   const g=G83();bp(g,BX(w+2,1.6,2),SW2,0,8.2,0,1);for(let k=0;k<5;k++)bp(g,BX(.9,.9,2.1),SW,-w/2+k*w/4,9.4,0,1);for(const sd of[-1,1])for(const fz of[-1.06,1.06]){bp(g,BX(1.3,2.4,.06),0x3b4aa0,sd*w*.3,6.2,fz,1);bp(g,BX(.5,.5,.07),0xe8dcc0,sd*w*.3,6.5,fz*1.01)}g.rotation.y=-am-Math.PI/2;put(g,v.x+Math.cos(am)*R,v.z+Math.sin(am)*R)}}
 {const g=G83();bp(g,BX(12,11,10),0xa8a296,0,5.5,0,1);bp(g,BX(13,1,11),0x8a8478,0,11.5,0,1);for(let k=0;k<6;k++)bp(g,BX(1,1.2,1),0x8a8478,-5+k*2,12.6,5,1);door(g,0,5.05,0,2.6,4,0x4a3a2a,0x6a6a6e);banner83(g,-4.5,0,5.6,0x3b4aa0,0xe8dcc0,0);put(g,v.x,v.z-6);solB(v.x,v.z-6,6.2,5.2)}}
// ---------- Vila Nairn: casas de madeira entre árvores, na orla da Floresta das Bruxas
{const v=VILS[2];buildVillage(v,{ground:0x6a5a3a,roofs:[0x3e6f3a],kind:'forest',houses:6,pal:{wall:[0x8a6a4a,0x7a5a3a,0x9a7a52],stone:[0x6a6458],roof:[0x4a5a3a,0x3e4a32,0x5a5a3e]},pick:housePicker(['cottage','two','cottage','ruin'])});
 for(let i=0;i<34;i++){const a=rnd()*6.283,d=v.r+5+rnd()*26,x=v.x+Math.cos(a)*d,z=v.z+Math.sin(a)*d;if(nearRoad(x,z,5))continue;tree83(x,z,rnd()<.6?'pine':'oak',R83(.9,1.3))}}
// ---------- Masmorra Antiga: zigurate de pedra afundado com portal (acontecimento da espada Demon-Dweller)
{const x0=-128,z0=190,g=G83(),ST=0x6e685e,ST2=0x5a544c;for(let k=0;k<4;k++)bp(g,BX(30-k*6,2.2,26-k*6),k%2?ST2:ST,0,1.1+k*2.2,-2,1);
 bp(g,BX(8,8,2),ST2,0,4,9.2,1);const pt=bp(g,BX(5,6,.3),0x5a2aa0,0,3,10.25,0,1);pt.userData.portal=1;bp(g,BX(6,1,2.4),ST,0,8.4,9.2,1);
 for(const s of[-1,1]){bp(g,CY(.9,1,7,8),ST,s*5,3.5,10.4,1);bp(g,SP(.6,8,6),0xa070ff,s*5,7.4,10.4,0,1)}
 // arena de pedra na frente (onde acontece o desafio)
 const fl=mk(new T.CircleGeometry(16,28),0x7a7466);fl.rotation.x=-Math.PI/2;fl.position.set(x0,.035,z0+26);fl.receiveShadow=true;S.add(fl);
 for(let k=0;k<12;k++){const a=k/12*6.283;if(Math.abs(Math.sin(a))>.9&&Math.cos(a)<0)continue;const c=G83();bp(c,BX(1.2,R83(2,5),1.2),ST,0,1.5,0,1);c.rotation.y=R83(0,1);put(c,x0+Math.cos(a)*16,z0+26+Math.sin(a)*16);sol(x0+Math.cos(a)*16,z0+26+Math.sin(a)*16,1)}
 put(g,x0,z0);solB(x0,z0-2,15,13);signBoard('Masmorra Antiga',x0+18,z0+30,-.6)}

