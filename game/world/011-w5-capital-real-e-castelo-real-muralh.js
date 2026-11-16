// ===================== V83 · Capital Real e Castelo Real: muralha, portão, avenida, praças, mercado, lojas =====================
{const CX=0,CZC=CZ,WR=64,ST=0x9a968e,ST2=0xb2ada4,RF=0x3e4a62;
 // chão de pedra da cidade
 {const fl=mk(new T.CircleGeometry(WR-1,48),0xc4bdab);fl.rotation.x=-Math.PI/2;fl.position.set(CX,.022,CZC);fl.receiveShadow=true;S.add(fl);
  for(const R2 of[14,30,46]){const rg=new T.Mesh(new T.RingGeometry(R2-1,R2+1,64,1),WM(0xa8a296));rg.rotation.x=-Math.PI/2;rg.position.set(CX,.03,CZC);rg.receiveShadow=true;S.add(rg)}
  const av=mk(new T.PlaneGeometry(10,WR*2-6),0xb0a690);av.rotation.x=-Math.PI/2;av.position.set(CX,.032,CZC);S.add(av);const mk2=mk(new T.PlaneGeometry(WR*2-8,8),0xb0a690);mk2.rotation.x=-Math.PI/2;mk2.position.set(CX,.033,CZC+16);S.add(mk2)}
 // muralha circular com torres e o grande portão ao sul (z maior)
 const N=36;for(let i=0;i<N;i++){const a=i/N*6.283,a2=(i+1)/N*6.283,mid=(a+a2)/2;if(Math.abs(Math.atan2(Math.sin(mid-Math.PI/2),Math.cos(mid-Math.PI/2)))<.1)continue;wall83(null,CX+Math.cos(a)*WR,CZC+Math.sin(a)*WR,CX+Math.cos(a2)*WR,CZC+Math.sin(a2)*WR,10,ST,ST2,2.2);if(i%4==0)tower83(CX+Math.cos(a)*WR,CZC+Math.sin(a)*WR,3.4,16,ST2,RF)}
 {const g=G83();for(const s of[-1,1]){bp(g,BX(5,16,6),ST2,s*7,8,0,1);bp(g,CN(4,5,4),RF,s*7,18.5,0,1).rotation.y=.78}bp(g,BX(19,4,6),ST2,0,14,0,1);for(let k=0;k<7;k++)bp(g,BX(1.2,1.2,1.2),ST,-8+k*2.66,16.6,0,1);banner83(g,-4.5,4,3.2,0x3b4aa0,0xe0b020,0);banner83(g,4.5,4,3.2,0x3b4aa0,0xe0b020,0);put(g,CX,CZC+WR);sol(CX-7,CZC+WR,3.4);sol(CX+7,CZC+WR,3.4)}
 // Castelo Real (fundo da cidade): torre central alta, quatro torres, muralha interna e escadaria
 {const g=G83(),W=0xe2ddd2,W2=0xccc6ba,BL=0x3e4c7a,GD=0xc8a040;const z=0;
  for(let k=0;k<4;k++)bp(g,BX(40-k*2,.6,30-k*2),0xb8b4c0,0,.3+k*.6,z,1);bp(g,BX(28,16,20),W,0,10,z,1);bp(g,BX(29,1,21),GD,0,18.4,z,1);
  bp(g,BX(14,14,12),W2,0,25,z-2,1);hip(g,14,12,6,BL,32);bp(g,CY(3.4,3.8,22,10),W,0,43,z-2,1);bp(g,CN(4.6,10,10),BL,0,59,z-2,1);bp(g,SP(1,8,6),GD,0,64.6,z-2,0,1);
  for(const [x,zz] of[[-14,-10],[14,-10],[-14,10],[14,10]]){bp(g,CY(3,3.3,28,10),W,x,14,z+zz,1);bp(g,CN(4,8,10),BL,x,32,z+zz,1);bp(g,CY(3.4,3.4,.8,10),GD,x,27.6,z+zz,1)}
  for(let k=-4;k<=4;k++)win(g,k*3,10,z+10.06,0,1.2,3,1,GD);for(let k=-2;k<=2;k++)win(g,k*2.6,25,z+4.06,0,1,2.4,1,GD);
  door(g,0,z+10.1,0,5,7,0x5a3a20,GD,1);for(let k=0;k<6;k++)bp(g,BX(12-k*.6,.4,2),0xc8c4d0,0,.2+k*.4,z+14-k*1.2,1);
  for(const s of[-1,1]){banner83(g,s*8,0,z+12,0x3b4aa0,0xe0b020,0);statue83(g,s*10,z+16,'knight',0xe0dcd0)}
  put(g,CX,CZC-44);solB(CX,CZC-44,15,11);for(const [x,zz] of[[-14,-10],[14,-10],[-14,10],[14,10]])sol(CX+x,CZC-44+zz,3.4)}
 // praça central: fonte e estátua do Rei Mago (design próprio)
 fountain83(CX,CZC+6,1.1);
 // rua do mercado (leste-oeste): barracas coloridas dos dois lados
 {const g=G83();g.userData.lod='d';for(let k=0;k<12;k++){const x=-50+k*9;if(Math.abs(x)<8)continue;for(const s of[-1,1])stall83(g,x,s*6.4,s>0?Math.PI:0,[0xd04a3a,0x3b6ad0,0xe0b020,0x3aa05a,0x8a3ad0,0xf08a2a][(k+(s>0?3:0))%6])}for(let k=0;k<10;k++){barrel(g,-46+k*10,3);crate(g,-44+k*10,-3,.8,k)}put(g,CX,CZC+16)}
 // casas da cidade em anéis (tipos variados: nobres, lojas, taverna, biblioteca, templo), nunca na avenida, no mercado ou na praça
 {const pal={wall:[0xe8dcc0,0xd9cbb0,0xf0e6d2,0xc8b89a,0xe2d4bc],stone:[0x9a948a,0x8a8478],roof:[0x9a4a32,0x7a3a2a,0x5a5a62,0x4a4c56,0x6a4a3a,0x3e4a5c,0x8a5a3a],door:[0x6b4426,0x3e5f8a,0x8a1f1f]};const PK=housePicker(['stone','two','merchant','rich','two','stone','rich']);const SPC={};
  for(let ring=0;ring<4;ring++){const R2=22+ring*10,n=Math.floor(R2*.5);for(let j=0;j<n;j++){const a=j/n*6.283+ring*.37,x=CX+Math.cos(a)*R2,z=CZC+Math.sin(a)*R2;
   if(Math.abs(x-CX)<9)continue;if(Math.abs(z-(CZC+16))<9)continue;if(z<CZC-26&&Math.abs(x-CX)<24)continue;if(Math.hypot(x-CX,z-CZC-6)<14)continue;
   let tp=PK();if(!SPC.lib&&ring==1&&x<-12){tp='library';SPC.lib=1}else if(!SPC.tem&&ring==1&&x>12){tp='temple';SPC.tem=1}else if(!SPC.shop&&ring==0&&x<0&&z>CZC){tp='shop';SPC.shop=1}else if(!SPC.tav&&ring==0&&x>0&&z>CZC){tp='tavern';SPC.tav=1}
   const st=CAPST103(Object.assign(hStyle(pal),{w:4.6+rnd()*2,lit:rnd()<.5}));const rr=placeHouse(CAP103(tp),x,z,Math.atan2(CX-x,CZC-z),st,1.05);sol(x,z,rr)}}}
 // lanternas ao longo da avenida
 {const g=G83();g.userData.lod='d';for(let z=-56;z<60;z+=8)for(const s of[-1,1])lantern(g,s*5.8,z);put(g,CX,CZC)}
 signBoard('Capital Real · Reino de Clover',CX+9,CZC+WR+7,0)}

