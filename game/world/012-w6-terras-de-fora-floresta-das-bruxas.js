// ===================== V83 · Terras de fora: Floresta das Bruxas, Diamond, Heart, Spade, Palácio das Sombras, Yultim, Templo Submarino, Hino =====================
// ---------- Floresta das Bruxas: árvores retorcidas roxas, cogumelos brilhantes, caldeirões e o Castelo da Rainha das Bruxas
{const cx=-430,cz=-150;for(let i=0;i<120;i++){const a=rnd()*6.283,d=18+rnd()*105,x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(x<WB83.x0+20||nearRoad(x,z,6)||Math.hypot(x+470,z+200)<34||Math.hypot(x+452,z+112)<18)continue;tree83(x,z,rnd()<.7?'witch':'dead',R83(1,1.6))}
 for(let i=0;i<26;i++){const x=cx+R83(-90,90),z=cz+R83(-90,90);if(nearRoad(x,z,4))continue;const g=G83();g.userData.lod='d';for(let k=0;k<3;k++){const h=R83(.4,1.4);bp(g,CY(.1,.14,h,6),0xe8e0f0,k*.5,h/2,k%2*.4);bp(g,SP(.4+h*.3,8,5),[0xb04aff,0x4affd0,0xff4ab0][k],k*.5,h,k%2*.4,0,1).scale.y=.5}put(g,x,z)}
 // castelo da Rainha das Bruxas sobre um penhasco (agulhas tortas, janelas roxas)
 {const x0=-470,z0=-200,g=G83(),DK=0x3a3044,DK2=0x2a2236,PU=0xa04aff;bp(g,CY(23,30,12,11),0x4a4048,0,6,0,1);for(let k=0;k<9;k++){const a=k/9*6.283+.3;bp(g,DO(3+(k*7%5)*.5),0x3e3640,Math.cos(a)*27,1.5+(k%3)*.6,Math.sin(a)*27,1)}bp(g,BX(22,12,16),DK,0,18,0,1);
  for(const [x,z,h,t] of[[-8,-5,30,.08],[8,-5,26,-.06],[0,6,38,.04],[-9,7,20,-.1],[10,6,22,.12]]){const tw=G83();tw.position.set(x,12,z);tw.rotation.z=t;bp(tw,CY(2,2.8,h,8),DK2,0,h/2,0,1);bp(tw,CN(2.8,8,8),0x5a2a7a,0,h+4,0,1);for(let k=0;k<3;k++)bp(tw,BX(.6,1.2,.2),PU,0,h*.4+k*3,2.4,0,1);g.add(tw)}
  bp(g,SP(2,10,8),PU,0,56,6,0,1);put(g,x0,z0);sol(x0,z0,26);signBoard('Castelo da Rainha das Bruxas',x0+30,z0+24,-.8)}
 {const g=G83();bp(g,CY(1.4,1.1,1.2,10),0x2a2a2e,0,.6,0,1);bp(g,CY(1.2,1.2,.1,10),0x6aff6a,0,1.2,0,0,1);for(let k=0;k<3;k++)tLog(g,Math.cos(k*2.1)*1.8,Math.sin(k*2.1)*1.8,k*2.1+1.6);put(g,-400,-130)}}
// ---------- V86 · Reino Diamond: reino medieval militar (muralha grossa, fortaleza, quartéis, forjas com engrenagens). Cristais só como enfeite.
{const cx=-440,cz=270,R=64,STN=0x7a7c84,STN2=0x5e6068,SL=0x3a4252,WD=0x5a4636,MET=0x8a8e98;
 road83(-330,236,cx+R+12,cz,7);road83(cx+R+12,cz,cx+8,cz,7);road83(cx+26,cz-R-14,cx+26,cz+R+14,6);road83(cx-R-12,cz+30,cx+26,cz+30,5);
 walledCity86(cx,cz,R,{h:9,c:STN,c2:STN2,rf:SL,th:2.2,tw:7,tr:3,flag:0x2a4a8a,flag2:0xc8d0dc});
 // fortaleza central: muralha interna quadrada, torre de menagem alta, 4 torres, cristal pequeno no topo
 {const fx=cx-22,fz=cz;for(const [a,b,c,d] of[[-16,-16,16,-16],[16,-16,16,16],[16,16,6,16],[-6,16,-16,16],[-16,16,-16,-16]])wall83(null,fx+a,fz+b,fx+c,fz+d,7,STN2,STN,1.6);
  for(const [x,z] of[[-16,-16],[16,-16],[16,16],[-16,16]])tower83(fx+x,fz+z,2.6,12,STN,SL);
  const g=G83();bp(g,BX(14,16,12),STN,0,8,0,1);bp(g,BX(15,1,13),STN2,0,16.4,0,1);for(let k=0;k<7;k++)for(const s of[-1,1])bp(g,BX(1,1.2,1),STN2,-6+k*2,17.5,s*6.3,1);hip(g,10,8,6,SL,17);
  bp(g,CY(2.4,2.6,26,8),STN2,5,13,-4,1);bp(g,CN(3.2,6,8),SL,5,29,-4,1);const cr=bp(g,new T.OctahedronGeometry(1.1,0),0x9ad8ff,5,33.2,-4,0,1);cr.scale.y=1.8;
  for(let k=-2;k<=2;k++){win(g,k*2.4,6,6.05,0,1,2,1,0x3a3e48);win(g,k*2.4,11,6.05,0,1,2,k%2,0x3a3e48)}door(g,0,6.1,0,3,4.4,0x3a2a1a,0x2a2a2e,1);
  for(const s of[-1,1])banner83(g,s*4.5,0,7,0x2a4a8a,0xc8d0dc,0);put(g,fx,fz-2);solB(fx,fz-2,7.4,6.4);sol(fx+5,fz-6,2.8);door86(fx,fz-2+7.6,'fortress','Fortaleza de Diamond',0)}
 // quartéis (prédios compridos), pátio de treino, forja com chaminés e engrenagens, oficina de balistas
 const barr=(x,z,ry)=>{const g=G83();bp(g,BX(18,5,7),STN,0,2.5,0,1);gable(g,18,7,2.6,SL,5,STN,.5);for(let k=-3;k<=3;k++)win(g,k*2.4,2.8,3.56,0,.9,1.4,k%3==0,0x3a3e48);door(g,0,3.6,0,2,3,WD,STN2,1);g.rotation.y=ry;put(g,x,z);solB(x,z,ry?3.8:9.4,ry?9.4:3.8);door86(x+Math.sin(ry)*4.8,z+Math.cos(ry)*4.8,'barracks','Quartel de Diamond',ry)};
 barr(cx+24,cz-42,0);barr(cx+24,cz-24,0);barr(cx+48,cz-14,Math.PI);
 {const D=G83();D.userData.lod='d';const yx=cx+50,yz=cz-38;const fl=mk(new T.PlaneGeometry(22,16),0x9a8e78);fl.rotation.x=-Math.PI/2;fl.position.set(yx,.03,yz);S.add(fl);
  for(let k=0;k<5;k++){const d=G83();bp(d,CY(.12,.12,2,6),0x5a3a22,0,1,0);bp(d,SP(.45,6,5),0xc8b080,0,2.1,0,1);bp(d,BX(1.2,.15,.15),0xc8b080,0,1.6,0);d.position.set(-8+k*4,0,-4);D.add(d)}
  for(let k=0;k<3;k++){const rk=G83();bp(rk,BX(2.4,.12,.3),WD,0,1.6,0);for(let j=0;j<4;j++)bp(rk,BX(.06,1.8,.06),MET,-.9+j*.6,1.1,0);rk.position.set(-6+k*6,0,5);D.add(rk)}put(D,yx,yz);signBoard('Pátio de Treino',yx-12,yz+9,0)}
 {const fx=cx+48,fz=cz+18,g=G83();bp(g,BX(12,6,9),STN2,0,3,0,1);gable(g,12,9,3,0x2a2e36,6,STN2,.5);for(const s of[-1,1]){bp(g,CY(.8,1,9,8),0x4a4a52,s*4,9,-2,1);bp(g,CY(1.1,1.1,.6,8),0x2a2a2e,s*4,13.6,-2,1)}
  bp(g,BX(4,3,.2),0xff7a2a,0,2,4.56,0,1);door(g,-3.5,4.56,0,2,3,WD,STN,1);for(let k=0;k<3;k++){const gr=bp(g,new T.TorusGeometry(1.1-k*.25,.22,4,8),MET,3.5,3+k*.6,4.6+k*.05,1);gr.rotation.z=k*.4}
  put(g,fx,fz);solB(fx,fz,6.2,4.8);door86(fx-3.5,fz+5.6,'forge','Forja de Diamond',0);
  const B=G83();for(let k=0;k<3;k++){const b=G83();bp(b,BX(1.6,.3,2.6),WD,0,.6,0,1);bp(b,BX(3,.15,.15),WD,0,1.2,.4);bp(b,CY(.06,.06,2.2,5),MET,0,1,-.4).rotation.x=1.2;for(const s of[-1,1])bp(b,CY(.45,.45,.15,8),0x3a2a1a,s*.9,.45,0).rotation.z=Math.PI/2;b.position.set(-4+k*4,0,0);b.rotation.y=.3;B.add(b)}put(B,fx,fz+12)}
 // praça com obelisco de cristal (enfeite) e estátua; lanternas de cristal na avenida
 {const px=cx+26,pz=cz,fl=mk(new T.CircleGeometry(11,24),0xaaa6a0);fl.rotation.x=-Math.PI/2;fl.position.set(px,.035,pz);S.add(fl);const g=G83();bp(g,BX(3,1,3),STN2,0,.5,0,1);const ob=bp(g,new T.OctahedronGeometry(1,0),0x8ad0ff,0,4,0,1);ob.scale.set(.9,3,.9);ob.material=new T.MeshToonMaterial({color:0x8ad0ff,gradientMap:gmap,emissive:0x2a5a7a});put(g,px+6,pz-6);sol(px+6,pz-6,1.8);
  const S2=G83();statue83(S2,0,0,'knight',0xb8bcc8);put(S2,px-6,pz+6);sol(px-6,pz+6,1.6);
  const L=G83();L.userData.lod='d';for(let x=cx+30;x<cx+R;x+=8)for(const s of[-1,1]){bp(L,CY(.08,.1,2.6,6),0x2a2a2e,x-px,1.3,s*4.6);bp(L,new T.OctahedronGeometry(.22,0),0x9ad8ff,x-px,2.8,s*4.6,0,1)}put(L,px,pz)}
 // moradias de pedra com telhado de ardósia
 {const pal={wall:[0xb8b4ac,0xa8a49c,0xc8c2b8],stone:[0x7a7c84,0x6a6c74],roof:[0x3a4252,0x2e3644,0x4a5060],door:[0x4a3a2a,0x3a2a1a,0x2a4a8a]},pk=housePicker(['stone','two','stone','merchant','rich']);
  streetHouses86(cx+30,cz+8,cx+R-6,cz+8,9,6.5,pal,pk);streetHouses86(cx+30,cz-8,cx+R-6,cz-8,9,6.5,pal,pk);streetHouses86(cx+34,cz+36,cx+34,cz+R-8,8,6,pal,pk);streetHouses86(cx-R+10,cz+38,cx+20,cz+38,8,6,pal,pk);streetHouses86(cx+6,cz-R+12,cx+6,cz-26,8,6,pal,pk)}
 // cristais naturais só nas bordas de fora (enfeite da região)
 for(const [x,z,h] of[[cx-R-18,cz-30,9],[cx-R-12,cz+44,7],[cx+12,cz+R+16,8],[cx-30,cz-R-16,10]]){const g=G83(),c=0x8ad0ff;const m=bp(g,new T.OctahedronGeometry(1,0),c,0,h/2,0,1);m.scale.set(1.6,h/2,1.6);m.material=new T.MeshToonMaterial({color:c,gradientMap:gmap,emissive:0x1a4a6a});bp(g,DO(1.6),0x6a6c74,1.4,.6,.8,1);put(g,x,z);sol(x,z,2.2)}
 signBoard('Reino Diamond',cx+R+18,cz-9,1.57)}
// ---------- V86 · Reino Heart: reino de pedra clara e telhados verdes, integrado à natureza (lago, rio, pontes, jardins, árvore-casa)
{const cx=320,cz=300,R=82,W=0xfff4f0,W2=0xe8dcd4,PK=0xe06a9a,GN=0x4a9a5a;
 // rio saindo do lago para o leste (com ponte) — entra no sistema de água (não dá para andar na água)
 WATER83.push({t:'r',x0:338,x1:cx+R+6,z0:295,z1:305});LAND83.push({t:'r',x0:356,x1:366,z0:292,z1:308});
 {const rv=new T.Mesh(new T.PlaneGeometry(cx+R+6-338,10),new T.MeshLambertMaterial({color:0x3a8ad0}));rv.rotation.x=-Math.PI/2;rv.position.set((338+cx+R+6)/2,.05,300);S.add(rv);
  const br=G83();bp(br,BX(10,.5,16),0x9a7a5a,0,.35,0,1);for(const s of[-1,1]){bp(br,BX(.3,1.1,16),0xd8ccc0,s*4.8,1,0,1)}put(br,361,300)}
 road83(300,262,300,272,6);road83(cx-R-12,cz-28,cx+R+12,cz-28,7);road83(361,cz-28,361,cz+R+12,6);road83(cx-26,cz-28,cx-26,cz+R+12,6);road83(cx,cz-28,cx,cz-46,7);
 walledCity86(cx,cz,R,{h:7,c:W2,c2:0xd8c8c0,rf:GN,th:1.6,tw:9,tr:2.6,flag:PK,flag2:0xffffff});
 // palácio (desenho próprio), agora ao norte do lago, de frente para a avenida
 {const g=G83();bp(g,BX(24,10,14),W,0,5,0,1);hip(g,24,14,5,GN,10);for(const s of[-1,1]){bp(g,CY(3,3.2,16,10),W,s*14,8,0,1);bp(g,SP(3.4,10,8),GN,s*14,17,0,1)}
  const heart=(par,x,y,z,s,c)=>{const h=G83();h.position.set(x,y,z);for(const sd of[-1,1]){const a=bp(h,new T.TorusGeometry(1.5*s,.35*s,5,14,Math.PI*1.25),c,sd*1.05*s,0,0,1);a.rotation.z=sd>0?-.15:Math.PI+.15}const t=bp(h,CN(1.95*s,2.6*s,4),c,0,-1.6*s,0,1);t.rotation.z=Math.PI;par.add(h)};heart(g,0,12.5,7.2,1.6,PK);
  for(let k=-3;k<=3;k++)if(k)win(g,k*3,5,7.06,0,1.2,2.6,1,0xd8c0a0);door(g,0,7.05,0,3,4.5,PK,W);put(g,cx,cz-56);solB(cx,cz-56,12.5,7.5);sol(cx-14,cz-56,3.4);sol(cx+14,cz-56,3.4);door86(cx,cz-56+8.4,'palace','Palácio de Heart',0)}
 // árvore-casa gigante (morada dentro do tronco) e estufa de vidro
 {const x=cx-52,z=cz+4,g=G83();bp(g,CY(4,5.5,16,10),0x6a4a2e,0,8,0,1);for(let k=0;k<5;k++){const a=k*1.25;bp(g,CY(1.2,.4,8,6),0x6a4a2e,Math.cos(a)*5,3,Math.sin(a)*5,1).rotation.set(Math.sin(a)*.9,0,-Math.cos(a)*.9)}
  for(const [a,b,c,r] of[[0,20,0,9],[6,17,3,6],[-6,18,-2,6.5],[2,22,-5,5.5],[-3,16,6,5]])bp(g,IC(r,1),0x4f9a46,a,b,c,1);door(g,0,4.6,0,2.2,3.2,0x4a2e1a,0xc8a060,1);for(let k=0;k<4;k++)win(g,Math.cos(k*1.6)*4.3,8+k*2,Math.sin(k*1.6)*4.3,Math.atan2(Math.cos(k*1.6),Math.sin(k*1.6)),.8,1.2,1,0xc8a060);
  put(g,x,z);sol(x,z,6);door86(x,z+6.2,'treehouse','Árvore-Casa',0)}
 {const x=cx+46,z=cz-52,g=G83();bp(g,BX(14,.6,10),W2,0,.3,0,1);const dm=new T.Mesh(new T.SphereGeometry(6,16,10,0,6.283,0,Math.PI/2),new T.MeshToonMaterial({color:0xbff0e8,gradientMap:gmap,transparent:true,opacity:.55}));dm.position.y=.6;dm.scale.set(1.15,1,.85);g.add(dm);
  for(let k=0;k<6;k++)bp(g,IC(1.1,0),0x5ab060,Math.cos(k)*3.5,1.4,Math.sin(k)*2.5,1);put(g,x,z);sol(x,z,6.4);door86(x,z+6.4,'greenhouse','Estufa Real',0)}
 // jardins com flores, bancos e cerejeiras em volta do lago; mercado de flores na avenida
 {const D=G83();D.userData.lod='d';for(let k=0;k<16;k++){const a=k/16*6.283,x=Math.cos(a)*27,z=Math.sin(a)*27;if(nearRoad(cx+x,300+z,4))continue;flowers(D,x,z,7,[0xff6a9a,0xffd34a,0xffffff,0xff9ad0]);if(k%4==0)bench(D,x*1.1,z*1.1,-a-Math.PI/2)}put(D,cx,300)}
 for(let k=0;k<12;k++){const a=k/12*6.283+.2,x=cx+Math.cos(a)*33,z=300+Math.sin(a)*33;if(free86(x,z,1.5,3))tree83(x,z,'cherry',1)}
 {const g=G83();g.userData.lod='d';for(let k=0;k<6;k++)stall83(g,-40+k*8,-5.5,0,[PK,GN,0xffd34a,0xff9ad0,0x6ad0c0,0xffffff][k]);put(g,cx-10,cz-28);fountain83(cx-60,cz-28-14,.9)}
 // casas claras com telhados verdes, rosados e azul-esverdeados
 {const pal={wall:[0xfff4f0,0xf6e6e0,0xfaf0dc,0xf0e4ec],stone:[0xd8ccc0,0xc8bcb0],roof:[0x4a9a5a,0x3e8a6a,0xd86a9a,0x5aa8a0,0x6aaa4a],door:[0xd86a9a,0x6b4426,0x3e8a6a]},pk=housePicker(['cottage','two','merchant','rich','cottage','stone']);
  streetHouses86(cx-R+12,cz-28,cx-30,cz-28,9,7,pal,pk);streetHouses86(cx+30,cz-28,cx+R-10,cz-28,9,7,pal,pk);streetHouses86(361,cz-20,361,290,8,6.5,pal,pk);streetHouses86(361,312,361,cz+R-8,8,6.5,pal,pk);
  streetHouses86(cx-26,cz-18,cx-26,cz+R-8,8,6.5,pal,pk);let n=0;for(let i=0;i<60&&n<14;i++){const a=rnd()*6.283,d=40+rnd()*(R-48),x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(!free86(x,z,4.2,3))continue;const st=Object.assign(hStyle(pal),{w:4.4+rnd()*1.6});const ry=Math.atan2(cx-x,cz-z);sol(x,z,placeHouse(pk(),x,z,ry,st,1));n++}}
 for(let i=0;i<24;i++){const x=cx+R83(-R-30,R+30),z=cz+R83(-R-30,R+30);const d=Math.hypot(x-cx,z-cz);if(d<R+6||d>R+34||!free86(x,z,1.5,3))continue;tree83(x,z,rnd()<.5?'cherry':'oak',R83(.9,1.3))}
 signBoard('Reino Heart',cx-R-18,cz-37,-1.57)}
seed=547456026;
// ---------- Reino Spade: cidade fortificada de ferro escuro, chaminés e céu fechado
{const cx=0,cz=-590,DK=0x4a4650,DK2=0x3a3640,RD=0x8a1a2a;for(let i=0;i<18;i++){const x=cx+R83(-110,110),z=cz+R83(-40,40);if(Math.abs(x)<12||Math.hypot(x-150,z+590)<36)continue;const g=G83(),h=R83(8,18),w=R83(6,10);bp(g,BX(w,h,w*.8),i%2?DK:DK2,0,h/2,0,1);bp(g,HIPG,0x2a2630,0,h,0,1,0,w+.6,R83(3,6),w*.8+.6);if(i%3==0){bp(g,CY(.6,.8,6,6),0x2a2630,w*.3,h+3,0,1)}for(let k=0;k<2;k++)bp(g,BX(.8,1.4,.12),0xff6a2a,-w*.25+k*w*.5,h*.6,w*.4+.06,0,1);put(g,x,z);sol(x,z,w*.62)}
 {const g=G83();for(const s of[-1,1]){bp(g,BX(8,22,8),DK2,s*10,11,0,1);bp(g,CN(5.6,8,4),RD,s*10,26,0,1).rotation.y=.78}bp(g,BX(28,6,8),DK,0,19,0,1);banner83(g,-4,6,4.4,RD,0x141414,0);banner83(g,4,6,4.4,RD,0x141414,0);put(g,cx,cz+38);sol(cx-10,cz+38,5.6);sol(cx+10,cz+38,5.6)}signBoard('Reino Spade',cx+16,cz+52,0)}
// ---------- Palácio das Sombras: palácio negro com pedaços flutuando e brilho violeta
{const x0=150,z0=-590,g=G83(),BK=0x1a1622,BK2=0x2a2236,VI=0x8a4aff;bp(g,CY(20,22,2,12),BK2,0,1,0,1);bp(g,BX(18,16,18),BK,0,10,0,1);for(let k=0;k<4;k++){const a=k/4*6.283+.78;bp(g,CY(2.6,3.4,28,6),BK2,Math.cos(a)*12,14,Math.sin(a)*12,1);bp(g,CN(3.4,8,6),BK,Math.cos(a)*12,32,Math.sin(a)*12,1)}
 bp(g,CN(9,22,6),BK,0,29,0,1);bp(g,SP(2.2,10,8),VI,0,42,0,0,1);for(let k=0;k<5;k++)bp(g,BX(1.2,3,.2),VI,-6+k*3,8,9.06,0,1);
 
 put(g,x0,z0);sol(x0,z0,16);signBoard('Palácio das Sombras',x0-24,z0+26,.4)}
// ---------- Vulcão Yultim: cone enorme com cratera de lava e rios de lava descendo
{const x0=300,z0=-410,g=G83();bp(g,CY(15,58,52,12),0x4a3a34,0,26,0,1);bp(g,CY(15.5,16.5,1.4,12),0x2a1a16,0,52.4,0,1);
 for(let k=0;k<14;k++){const a=rnd()*6.283,d=62+rnd()*20;rocks83(x0+Math.cos(a)*d,z0+Math.sin(a)*d,R83(1.4,2.6),0x3a2e2a)}put(g,x0,z0);sol(x0,z0,48);signBoard('Vulcão Yultim',x0-50,z0+50,-.9)}
// ---------- Templo Submarino: templo dentro de uma bolha gigante no mar, ligado à costa por um píer
{const x0=440,z0=-200,g=G83(),ST=0xd8e4e8,TQ=0x2ab8c8;const fl=mk(new T.CircleGeometry(20.5,32),0xc8d4c0);fl.rotation.x=-Math.PI/2;fl.position.set(x0,.2,z0);S.add(fl);
 for(let k=0;k<3;k++)bp(g,BX(16-k*4,1.2,16-k*4),ST,0,.8+k*1.2,0,1);for(let k=0;k<8;k++){const a=k/8*6.283;bp(g,CY(.5,.6,7,8),ST,Math.cos(a)*7,5.6,Math.sin(a)*7,1)}bp(g,CY(8,8,1,12),ST,0,9.6,0,1);bp(g,SP(5,12,8),TQ,0,10,0,1).scale.y=.7;
 const dome=new T.Mesh(new T.SphereGeometry(21,24,14,0,6.283,0,Math.PI/2),new T.MeshToonMaterial({color:0x6ad8ff,gradientMap:gmap,transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false}));g.add(dome);
 for(let k=0;k<10;k++){const a=k/10*6.283;bp(g,CN(.6,R83(2,4),5),[0xff7a8a,0xffa04a,0xb07aff][k%3],Math.cos(a)*17,1,Math.sin(a)*17,1)}put(g,x0,z0);
 {const p=G83();bp(p,BX(64,.5,8),0x8a6a4a,0,.35,0,1);for(let k=0;k<12;k++)for(const s of[-1,1])bp(p,CY(.25,.25,2.4,6),0x5a3a22,-30+k*5.4,.2,s*3.8);put(p,x0-52,z0)}signBoard('Templo Submarino',372,z0+7,-1.57)}
// ---------- Hino (Terra do Sol Nascente): ilha com portais vermelhos, pagode, casas de telhado curvo e cerejeiras
{const x0=492,z0=8,RD=0xc8302a,WD=0xf0e6d2,DK=0x2a2a30;{const p=G83();bp(p,BX(78,.6,10),0x8a5a32,0,.4,0,1);for(let k=0;k<14;k++)for(const s of[-1,1])bp(p,CY(.12,.12,1.2,6),0x5a3a22,-36+k*5.6,.9,s*4.6);put(p,397,z0+1)}
 const torii=(x,z,ry,s)=>{const g=G83();s=s||1;for(const sd of[-1,1])bp(g,CY(.35*s,.42*s,7*s,8),RD,sd*3*s,3.5*s,0,1);bp(g,BX(8.4*s,.5*s,.7*s),RD,0,6.9*s,0,1);bp(g,BX(9.6*s,.4*s,.9*s),DK,0,7.5*s,0,1);bp(g,BX(7*s,.35*s,.5*s),RD,0,5.8*s,0,1);g.rotation.y=ry;put(g,x,z);for(const sd of[-1,1])sol(x+Math.cos(ry)*sd*3*s,z-Math.sin(ry)*sd*3*s,.6)};
 torii(442,z0+9,1.5708,1.1);torii(462,z0+9,1.5708,1);
 {const g=G83();for(let k=0;k<5;k++){const w=10-k*1.6,h=3;bp(g,BX(w*.75,h,w*.75),WD,0,1.5+k*h,0,1);bp(g,HIPG,DK,0,h+k*h,0,1,0,w+.8,1.4,w+.8);bp(g,BX(w*.82,.3,w*.82),RD,0,h+k*h-.1,0,1)}bp(g,CY(.12,.2,4,6),0xd8b040,0,17.5,0,1);put(g,x0+14,z0-18);sol(x0+14,z0-18,5.4)}
 for(let i=0;i<9;i++){const a=i/9*6.283+.3,x=x0+Math.cos(a)*34,z=z0+Math.sin(a)*30;if(x<448)continue;const g=G83();bp(g,BX(6,3.2,5),WD,0,1.6,0,1);bp(g,BX(6.1,.2,5.1),DK,0,.12,0,1);bp(g,HIPG,DK,0,3.2,0,1,0,7.6,1.6,6.6);for(let k=0;k<3;k++)bp(g,BX(1.1,1.6,.1),0xf8f0e0,-1.8+k*1.8,1.6,2.56,0,1);g.rotation.y=Math.atan2(x0-x,z0-z);put(g,x,z);sol(x,z,3.6)}
 for(let i=0;i<16;i++){const a=rnd()*6.283,d=10+rnd()*44,x=x0+Math.cos(a)*d,z=z0+Math.sin(a)*d;if(x<450||Math.hypot(x-x0-14,z-z0+18)<9||Math.abs(z-z0-9)<5)continue;tree83(x,z,'cherry',R83(.9,1.2))}signBoard('Hino',446,z0-2,-1.57)}
// ---------- natureza leve nos campos (poucas árvores: o cenário é das construções)
{for(let i=0;i<150;i++){const x=R83(-340,340),z=R83(-490,180);if(inWater83(x,z)||nearRoad(x,z,7)||nearVil(x,z,10)||clearAt(x,z,2))continue;const r=reg83(x,z);if(r&&r.id!='bruxas'&&r.id!='nairn')continue;if(Math.hypot(x,z-CZ)<80||Math.hypot(x-300,z+410)<75)continue;if(rnd()<.55)tree83(x,z,['oak','pine','birch'][Math.floor(rnd()*3)],R83(.8,1.25));else{const g=G83();g.userData.lod='d';if(rnd()<.5)tBush(g,0,0,R83(.8,1.2));else tRocks(g,0,0,R83(.7,1.2));put(g,x,z)}}}

