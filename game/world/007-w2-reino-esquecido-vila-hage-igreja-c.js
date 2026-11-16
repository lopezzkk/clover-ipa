// ===================== V83 · Reino Esquecido: Vila Hage, igreja, crânio gigante, Torre dos Grimórios, treino =====================
// ---------- estradas principais (antes das construções, para as casas desviarem delas)
road83(0,-14,0,-334,8);road83(10,-6,168,-52,6);road83(-12,10,-184,104,6);road83(0,-150,-205,-150,6);road83(0,-150,128,-150,6);road83(168,-52,190,-60,5);
road83(-184,104,-128,180,4);road83(0,-240,-130,-250,5);road83(0,-240,130,-250,5);road83(0,-286,-60,-290,5);road83(0,-286,60,-290,5);road83(-130,-250,-230,-286,5);road83(130,-250,230,-286,5);road83(-130,-250,-200,-210,4);road83(130,-250,200,-210,4);
road83(190,-60,360,9,5);road83(0,-334,0,-505,6);road83(0,-505,0,-560,6);road83(-205,-150,-330,-150,5);road83(-210,140,-330,236,5);road83(150,-150,300,-330,5);road83(168,-52,236,180,5);road83(236,180,300,262,5);
// ---------- Vila Hage (0,0): praça de terra, poço, ruas curvas, casas simples e variadas
{const HX=0,HZ=0,pal={wall:[0xe8dcc0,0xd8c8a4,0xcdb894,0xe2d2b0],stone:[0x9a948a,0x8a8478],roof:[0x8a5a32,0x7a4a2a,0x9a6a3a,0x6e4a2a,0xa0522d],roofD:[0x6e4a2a],door:[0x6b4426,0x5a3a20,0x7a4a2a]};
 const pl=mk(new T.CircleGeometry(11,28),0xb08a5a);pl.rotation.x=-Math.PI/2;pl.position.set(HX,.025,HZ);pl.receiveShadow=true;S.add(pl);
 // poço no lado norte da praça (o centro fica livre: é onde o jogador acorda)
 {const g=G83();bp(g,CY(1.3,1.45,1,12),0x9a948a,0,.5,0,1);bp(g,CY(1.05,1.05,.15,12),0x3a7ac8,0,.95,0);for(const s of[-1,1])bp(g,BX(.2,2.4,.2),0x5a3a22,s*1.05,1.7,0);bp(g,CN(1.8,1.1,4),0x8a5a32,0,3.3,0,1).rotation.y=.78;bp(g,CY(.1,.1,2.2,6),0x5a3a22,0,2.4,0).rotation.z=1.57;put(g,HX,HZ-8);sol(HX,HZ-8,1.6)}
 // casas em dois anéis (portas para a praça), deixando livres as saídas das estradas
 const HT=['cottage','two','stone','cottage','merchant','smithy','cottage','two','tavern','stone','cottage','two','cottage','merchant'];let hi=0;
 for(const [R2,n,off] of[[19,8,.2],[29,10,.5]]){for(let i=0;i<n;i++){const a=off+i/n*6.283,x=HX+Math.cos(a)*R2,z=HZ+Math.sin(a)*R2;if(nearRoad(x,z,5.5))continue;if(Math.abs(Math.atan2(z,x)+1.5708)<.42&&R2<25)continue;const tp=HT[hi++%HT.length],st=hStyle(pal);const rr=placeHouse(tp,x,z,Math.atan2(HX-x,HZ-z),Object.assign(st,{w:4.2+rnd()*1.6}),.95+rnd()*.15);sol(x,z,rr)}}
 // decoração: hortas cercadas, carroça, lenha, flores e lanternas
 const D=G83();D.userData.lod='d';for(const [a,R2] of[[.75,37],[2.4,38],[3.8,37],[5.2,38]]){const x=Math.cos(a)*R2,z=Math.sin(a)*R2;if(nearRoad(x,z,6))continue;const g=G83();g.userData.lod='d';bp(g,BX(6,.06,4),0x6a4a2a,0,.03,0);for(let r=0;r<4;r++)for(let c2=0;c2<7;c2++)bp(g,SP(.18,5,4),[0x4f9a3e,0x6ab84a,0xe0b020][(r+c2)%3],-2.6+c2*.86,.18,-1.4+r*.95);fenceRow(g,-3.2,-2.3,3.2,-2.3);fenceRow(g,-3.2,2.3,3.2,2.3);fenceRow(g,-3.2,-2.3,-3.2,2.3);fenceRow(g,3.2,-2.3,3.2,2.3);g.rotation.y=-a;put(g,x,z)}
 for(let k=0;k<8;k++){const a=k/8*6.283+.4;lantern(D,Math.cos(a)*12.5,Math.sin(a)*12.5)}for(let k=0;k<6;k++){const a=k/6*6.283+.15;flowers(D,Math.cos(a)*10.2,Math.sin(a)*10.2,6,[0xff7aa8,0xffd34a,0xffffff,0xb07aff])}
 barrel(D,7,6);barrel(D,7.8,6.5);crate(D,-7,6,1,.3);sack(D,-7.8,5.4);woodpile(D,9,-4,.5);bench(D,-5,-6,.6);bench(D,5,-6,-.6);put(D,HX,HZ);
 // moinho a oeste da vila
 {const g=G83();bp(g,CY(2,3,10,8),0xd8c8a4,0,5,0,1);bp(g,CN(3,3.4,8),0x8a5a32,0,11.7,0,1);bp(g,CY(.4,.4,.8,8),0x6e4a2a,0,8.5,2.9,1).rotation.x=1.5708;put(g,-44,-14);sol(-44,-14,3.2)}
 signBoard('↑ Capital Real',-5,-40,0);signBoard('Vila Sossy →',34,-14,-1.25);signBoard('← Cidade de Kiten',-30,22,2.2);signBoard('Torre dos Grimórios ↖',-24,-26,.8)}
// ---------- Igreja de Hage (com torre do sino e casinha ao lado)
{const g=G83(),D=G83();D.userData.lod='d';const W=0xe0d6c2,ST=0x9a948a,RF=0x7a3a2a;
 for(let k=0;k<2;k++)bp(g,BX(10.5-k*.6,.3,17.5-k*.6),ST,0,.15+k*.3,0,1);bp(g,BX(9,6,15),W,0,3.6,0,1);gable(g,9,15,4,RF,6.6,W,.6);
 // torre do sino na frente (porta virada para a praça, +Z)
 bp(g,BX(4.4,12,4.4),W,0,6.6,6.8,1);bp(g,BX(4.8,.5,4.8),ST,0,12.8,6.8,1);for(const [x,z] of[[-1.6,5.2],[1.6,5.2],[-1.6,8.4],[1.6,8.4]])bp(g,BX(.5,3,.5),W,x,14.3,z,1);bp(g,CY(.7,.9,1.2,8),0xc8a040,0,14,6.8,1);bp(g,HIPG,RF,0,15.8,6.8,1,0,5.4,5,5.4);bp(g,BX(.2,2.2,.2),0xe8d8a0,0,21.6,6.8,1);bp(g,BX(1.2,.2,.2),0xe8d8a0,0,22,6.8,1);
 door(g,0,9,0,1.8,3,0x5a3a20,0x8a7a6a);for(const z of[-5,-1,3])for(const s of[-1,1])win(g,s*4.52,3.6,z,s*1.5708,1,2,1,0x8a7a6a);bp(g,CY(1.1,1.1,.12,16),0x6a8ad0,0,8.5,9.02,0,1).rotation.x=1.5708;
 // anexo (orfanato) e pequeno cemitério
 {const an=G83();an.position.set(-8.6,0,-2);g.add(an);bp(an,BX(6,4,7),0xd8c8a4,0,2,0,1);gable(an,6,7,2.6,0x8a5a32,4,0xd8c8a4,.4);door(an,0,3.5,0,1.2,2.2,0x6b4426,0x8a7a6a)}
 for(let k=0;k<6;k++){const x=6.5+(k%3)*1.6,z=-4+Math.floor(k/3)*2.4;bp(D,BX(.7,.9,.2),0xa8a296,x,.45,z,1);bp(D,BX(.9,.06,1.4),0x6a8a4a,x,.03,z+.9)}fenceRow(D,5.2,-6,11,-6,0x3a3a3e);fenceRow(D,11,-6,11,2,0x3a3a3e);
 put(g,0,-30);put(D,0,-30);solB(0,-30,5,8);sol(0,-23.2,2.4);solB(-8.6,-32,3.2,3.8)}
// ---------- Colina do Crânio: um crânio gigante de demônio antigo, meio enterrado (design próprio)
{const x0=62,z0=-8,g=G83();bp(g,CN(22,5,10),0x8a9a5a,0,2.5,0,0);for(let k=0;k<10;k++){const a=k/10*6.283;rocks83(x0+Math.cos(a)*19,z0+Math.sin(a)*19,R83(.9,1.6),0x8a8478)}
 const sk=G83(),BN=0xe8e0cc,DK=0x18120e;sk.position.set(0,4.2,0);sk.rotation.y=-.9;
 const cr=bp(sk,SP(1,12,9),BN,0,7,0,1);cr.scale.set(8.5,7.5,9.5);for(const s of[-1,1]){const e=bp(sk,SP(1,10,8),DK,s*3.4,7.4,7.2);e.scale.set(2,2.4,1.2);const br=bp(sk,BX(3.2,1,2),BN,s*3.4,9.6,7.4,1);br.rotation.z=s*.2}
 bp(sk,CN(1.5,3,3),DK,0,4.6,8.8).rotation.x=Math.PI;const jaw=bp(sk,BX(10,2.4,7),BN,0,1.6,5,1);jaw.rotation.x=.18;for(let k=0;k<8;k++)bp(sk,CN(.5,2,5),0xf8f4e8,-3.5+k,2.4,8.4,0).rotation.x=Math.PI;for(let k=0;k<8;k++)bp(sk,CN(.45,1.6,5),0xf8f4e8,-3.5+k,3.2,8.6,0);
 // chifres curvos (segmentos que giram para trás)
 for(const s of[-1,1]){let px=s*6,py=11,pz=1,r=1.6;for(let k=0;k<9;k++){const m=bp(sk,SP(r,8,6),BN,px,py,pz,k==0);px+=s*.9;py+=1.3-k*.15;pz-=1.2+k*.1;r*=.86}}
 for(let k=0;k<5;k++){const c=bp(sk,BX(.2,.2,R83(2,4)),DK,R83(-4,4),R83(10,13),R83(-3,4));c.rotation.set(R83(-.5,.5),R83(0,3),R83(-.5,.5))}
 g.add(sk);put(g,x0,z0);sol(x0,z0,12);sol(x0+6,z0+2,9);signBoard('Colina do Crânio',x0-24,z0+6,-1.57)}
// ---------- Torre dos Grimórios: torre alta de pedra, faixa espiral e anel de grimórios flutuando no topo
{const x0=-64,z0=-52,g=G83(),ST=0x9a92a8,ST2=0x7a7288,TR=0xd8c890;bp(g,CY(14,15,.6,20),0xb8b2a6,0,.3,0,1);for(let k=0;k<3;k++)bp(g,BX(6-k,.5,2),0xb8b2a6,0,.55+k*.5,10.5-k*.6,1);
 let y=.6;const lv=[[7.2,12],[6.4,11],[5.6,10],[4.8,9],[4,7]];lv.forEach(([r,h],i)=>{bp(g,CY(r*.94,r,h,14),i%2?ST2:ST,0,y+h/2,0,1);bp(g,CY(r+.5,r+.5,.6,14),TR,0,y+h,0,1);for(let k=0;k<6;k++){const a=k/6*6.283+i*.4;win(g,Math.cos(a)*(r*.97),y+h*.55,Math.sin(a)*(r*.97),Math.atan2(Math.cos(a),Math.sin(a)),.9,1.8,1,TR)}y+=h});
 for(let k=0;k<26;k++){const t=k/26,a=t*6.283*3,r=7.4-t*3.1,yy=2+t*44;const m=bp(g,BX(2.2,.4,.9),TR,Math.cos(a)*r,yy,Math.sin(a)*r,0);m.rotation.y=-a}
 bp(g,CN(4.6,7,14),0x3e2a6a,0,y+3.5,0,1);bp(g,SP(1.1,10,8),0xffe9a0,0,y+7.6,0,0,1);door(g,0,7.1,0,2.4,4,0x4a2a1a,TR);
 
 put(g,x0,z0);sol(x0,z0,8);signBoard('Torre dos Grimórios',x0+6,z0+16,0)}
// ---------- Campo de Treino (bonecos de treino aparecem aqui)
{const x0=-52,z0=38,g=G83();const fl=mk(new T.CircleGeometry(15,30),0xd8c49a);fl.rotation.x=-Math.PI/2;fl.position.set(x0,.03,z0);fl.receiveShadow=true;S.add(fl);
 for(let k=0;k<22;k++){const a=k/22*6.283;if(Math.abs(Math.atan2(Math.sin(a-.6),Math.cos(a-.6)))<.3)continue;bp(g,CY(.15,.18,1.4,6),0x6e4a2a,Math.cos(a)*15.5,.7,Math.sin(a)*15.5)}
 for(const [x,z,r] of[[-8,-9,.5],[9,-8,-.4],[11,6,-1.2]]){const t=G83();bp(t,CY(.08,.08,2.4,6),0x5a3a22,0,1.2,0);const b=bp(t,CY(.9,.9,.15,16),0xf0e6d2,0,2.2,0,1);b.rotation.x=1.5708;bp(t,CY(.6,.6,.17,16),0xd04a3a,0,2.2,.01).rotation.x=1.5708;bp(t,CY(.3,.3,.19,16),0xf0e6d2,0,2.2,.02).rotation.x=1.5708;t.position.set(x,0,z);t.rotation.y=r;g.add(t)}
 {const rk=G83();bp(rk,BX(3,.15,.4),0x6e4a2a,0,1.6,0);bp(rk,BX(3,.15,.4),0x6e4a2a,0,.6,0);for(let k=0;k<4;k++)bp(rk,BX(.08,1.8,.08),0xc8ccd8,-1.1+k*.75,1.1,0);rk.position.set(-12,0,5);rk.rotation.y=1.2;g.add(rk)}
 put(g,x0,z0);signBoard('Campo de Treino',x0+14,z0-12,-.8)}
// ---------- Acampamento dos Cavaleiros (Reino Comum)
{const x0=34,z0=-118;for(let k=0;k<4;k++){const t=G83(),c=mk(new T.ConeGeometry(2.4,3,4),[0xe0b020,0x7a1f1f,0x3b4aa0,0x2f7a4a][k],1);c.position.y=1.5;c.rotation.y=.78;t.add(c);const a=k/4*6.283+.4,x=x0+Math.cos(a)*9,z=z0+Math.sin(a)*9;put(t,x,z);sol(x,z,2)}
 const g=G83();bp(g,CY(.7,.8,.3,8),0x5a3d22,0,.15,0);const fl=new T.Mesh(CN(.6,1.4,6),new T.MeshBasicMaterial({color:0xffa030}));fl.position.y=.9;g.add(fl);for(let k=0;k<3;k++)tLog(g,Math.cos(k*2.1+.5)*2.6,Math.sin(k*2.1+.5)*2.6,k*2.1+2);banner83(g,-5,0,-3,0x3b4aa0,0xe0b020,.4);crate(g,4,-5,1);barrel(g,5,-4);put(g,x0,z0);sol(x0,z0,1)}

