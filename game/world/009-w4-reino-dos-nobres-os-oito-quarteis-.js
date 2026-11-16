// ===================== V83 · Reino dos Nobres: os oito quartéis dos Cavaleiros Mágicos (arquitetura própria de cada um) =====================
// Cada quartel tem uma silhueta diferente: cúpulas douradas, agulhas prateadas, fortaleza vermelha, mansão com roseiral,
// salão de telhados pontudos, pavilhão de cúpulas com leque, farol roxo no lago e pavilhão com arcos em galhada.
const HQ83=[];
function hqSign(n,x,z,ry){signBoard(n,x,z,ry||0)}
// Alvorecer Dourado — palácio de mármore branco com três cúpulas douradas
{const x0=-130,z0=-250,g=G83(),W=0xf2eee4,GD=0xe0b030;bp(g,BX(30,1,20),0xd8d2c4,0,.5,0,1);bp(g,BX(24,10,14),W,0,6,0,1);bp(g,BX(25,.8,15),GD,0,11.2,0,1);
 for(let k=0;k<8;k++)bp(g,CY(.6,.7,9,10),W,-10.5+k*3,5.5,7.6,1);bp(g,BX(26,1.2,4),W,0,10.6,7.8,1);bp(g,PRISM,W,0,11.2,7.8,1,0,10,3,3.6);
 for(const [x,r,h] of[[0,6,10],[-9,3.6,7],[9,3.6,7]]){bp(g,CY(r*.9,r,3,14),W,x,13,0,1);bp(g,SP(r,14,8),GD,x,14.5,0,1).scale.y=1.1;bp(g,CY(.3,.4,3,6),GD,x,15+r*1.1,0,1);bp(g,SP(.7,8,6),GD,x,16.8+r*1.1,0,1)}
 door(g,0,7.05,0,3,5,0xd8b040,GD);banner83(g,-13,0,8,0xe0b030,0xffffff,0);banner83(g,13,0,8,0xe0b030,0xffffff,0);
 put(g,x0,z0);solB(x0,z0,13,8);hqSign('Quartel do Alvorecer Dourado',x0+16,z0+14,.3);HQ83.push({id:'dourado',x:x0,z:z0})}
// Águia Prateada — três agulhas prateadas finas com arcos em forma de asa
{const x0=-60,z0=-290,g=G83(),SV=0xc8ccd8,BL=0x5a7ab8;bp(g,CY(12,13,.8,16),0xa8acb8,0,.4,0,1);bp(g,CY(7,8,8,12),SV,0,4.8,0,1);
 for(const [x,z,h] of[[0,0,30],[-6,-2,22],[6,-2,22]]){bp(g,CY(1.6,2.4,h,8),SV,x,h/2+.8,z,1);bp(g,CN(1.6,5,8),BL,x,h+3.3,z,1);for(let k=0;k<3;k++)win(g,x,6+k*5,z+2.1,0,.7,1.8,1,0x8a8aa0)}
 for(const s of[-1,1]){const a=bp(g,new T.TorusGeometry(9,.5,5,18,Math.PI*.7),SV,s*3,12,1.5,1);a.rotation.set(0,0,s>0?.4:Math.PI-.4-Math.PI*.7+Math.PI*.7)}
 door(g,0,7.6,0,2.6,4.2,BL,SV);put(g,x0,z0);sol(x0,z0,8.2);hqSign('Quartel da Águia Prateada',x0+12,z0+12,0);HQ83.push({id:'aguia',x:x0,z:z0})}
// Leão Carmesim — fortaleza de arenito vermelho, torres quadradas com ameias e estátua de leão
{const x0=60,z0=-290,g=G83(),RD=0xa83a2a,RD2=0x8a2a20,TN=0xd8a070;bp(g,BX(28,.8,22),0x8a7a6a,0,.4,0,1);bp(g,BX(20,12,14),RD,0,6.8,0,1);for(let k=0;k<9;k++)bp(g,BX(1.4,1.4,1.4),RD2,-9+k*2.25,13.5,7,1);
 for(const [x,z] of[[-11,-8],[11,-8],[-11,8],[11,8]]){bp(g,BX(5,18,5),RD2,x,9.8,z,1);for(let k=0;k<4;k++)bp(g,BX(1.2,1.4,1.2),RD,x+(k%2?1.8:-1.8),19.4,z+(k<2?1.8:-1.8),1)}
 door(g,0,7.05,0,3.4,5,0x3a1a10,TN,1);statue83(g,-6,12,'lion',TN);statue83(g,6,12,'lion',TN);banner83(g,-3,0,7.6,0xc8382f,0xe0b020,0);banner83(g,3,0,7.6,0xc8382f,0xe0b020,0);
 put(g,x0,z0);solB(x0,z0,13.5,10.5);hqSign('Quartel do Leão Carmesim',x0-16,z0+16,0);HQ83.push({id:'leao',x:x0,z:z0})}
// Rosa Azul — mansão azul e branca com roseiral e arcos de treliça
{const x0=130,z0=-250,g=G83(),D=G83();D.userData.lod='d';const W=0xeef2fa,BL=0x4a6ad0,BL2=0x8aa8f0;bp(g,BX(18,8,11),W,0,4,0,1);hip(g,18,11,4,BL,8);for(const s of[-1,1]){bp(g,BX(6,6,8),W,s*11,3,1,1);hip(g,6,8,3,BL2,6).position.x=s*11}
 for(let k=-3;k<=3;k++)win(g,k*2.4,4.6,5.56,0,1,2,1,BL);door(g,0,5.56,0,2.2,3.4,BL,0xd8d8e8);
 for(let k=0;k<5;k++){const ar=bp(D,new T.TorusGeometry(1.6,.12,4,12,Math.PI),0xe8e8f0,0,0,10+k*3,1);ar.position.set(0,0,10+k*3);for(const s of[-1,1])for(let j=0;j<3;j++)bp(D,SP(.35,6,4),[0x3a5ad0,0xd03a6a,0xffffff][j],s*1.6,.4+j*.5,10+k*3)}
 for(let k=0;k<16;k++){const a=k/16*6.283;flowers(D,Math.cos(a)*16,Math.sin(a)*12+2,6,[0x3a5ad0,0x6a8af0,0xd03a6a,0xffffff])}
 put(g,x0,z0);put(D,x0,z0);solB(x0,z0,9.2,5.6);sol(x0-11,z0+1,4.5);sol(x0+11,z0+1,4.5);hqSign('Quartel da Rosa Azul',x0-14,z0+20,-.2);HQ83.push({id:'rosa',x:x0,z:z0})}
// Louva-a-Deus Verde — salão verde de telhados pontudos e escalonados
{const x0=-200,z0=-210,g=G83(),GR2=0x3a8a4a,GR3=0x2a6a3a,WD=0xd8d0b0;bp(g,BX(18,.6,14),0x8a8470,0,.3,0,1);bp(g,BX(14,6,10),WD,0,3.6,0,1);
 for(let k=0;k<3;k++){const w=16-k*4,h=3+k*.6;bp(g,HIPG,k%2?GR3:GR2,0,6.6+k*3.2,0,1,0,w,h+2,w*.75)}bp(g,CN(.6,5,4),GR2,0,18.5,0,1);
 for(const s of[-1,1]){bp(g,BX(4,9,4),WD,s*9,4.5,-2,1);bp(g,HIPG,GR2,s*9,9,-2,1,0,5,6,5)}door(g,0,5.06,0,2.4,3.6,GR3,0x6a5a3a);
 put(g,x0,z0);solB(x0,z0,8,6);sol(x0-9,z0-2,3);sol(x0+9,z0-2,3);hqSign('Quartel do Louva-a-Deus Verde',x0+12,z0+12,.6);HQ83.push({id:'louva',x:x0,z:z0})}
// Pavão de Coral — pavilhão de cúpulas cor de coral com um grande leque colorido no topo
{const x0=200,z0=-210,g=G83(),CR=0xf08a78,CR2=0xe06a5a,GD=0xe0b030;bp(g,CY(11,12,.8,18),0xe8d8c8,0,.4,0,1);bp(g,CY(8,8.5,7,16),0xfff0e8,0,4.2,0,1);bp(g,SP(8.2,16,8,0,6.283,0,Math.PI/2),CR,0,7.6,0,1);
 for(let k=0;k<6;k++){const a=k/6*6.283;bp(g,CY(1.3,1.5,6,10),0xfff0e8,Math.cos(a)*10,3,Math.sin(a)*10,1);bp(g,SP(1.6,10,6),CR2,Math.cos(a)*10,6.8,Math.sin(a)*10,1)}
 const fan=G83();fan.position.set(0,15,-1);for(let k=0;k<11;k++){const a=-1.1+k*.22,f=bp(fan,BX(.5,9,.12),[0x2a8a8a,0x3a6ad0,0x3aa05a,GD][k%4],Math.sin(a)*4.5,Math.cos(a)*4.5,0,1);f.rotation.z=-a;bp(fan,SP(.6,8,6),[0x1a4a8a,GD][k%2],Math.sin(a)*9,Math.cos(a)*9,.1)}g.add(fan);
 door(g,0,8.5,0,2.4,3.4,CR2,GD);put(g,x0,z0);sol(x0,z0,9);hqSign('Quartel do Pavão de Coral',x0-14,z0+13,-.6);HQ83.push({id:'pavao',x:x0,z:z0})}
// Orca Púrpura — farol roxo na beira do lago e salão com arco em forma de cauda
{const x0=-232,z0=-292,g=G83(),PU=0x6a3a9a,PU2=0x4a2a7a,W=0xe8e0f0;bp(g,BX(16,6,10),W,0,3,0,1);hip(g,16,10,3,PU,6);
 bp(g,CY(3,4,24,10),PU,10,12,-4,1);for(let k=0;k<4;k++)bp(g,CY(4.1-k*.15,4.1-k*.15,.8,10),W,10,4+k*5.5,-4,1);bp(g,CY(2.6,2.6,3,10),0xfff0a0,10,25.5,-4,0,1);bp(g,CN(3.4,3.5,10),PU2,10,28.7,-4,1);
 const tl=G83();tl.position.set(-10,0,2);for(const s of[-1,1]){const a=bp(tl,new T.TorusGeometry(3,.45,5,12,Math.PI*.8),PU2,s*2.4,6,0,1);a.rotation.z=s>0?.2:Math.PI-.2-Math.PI*.8}bp(tl,CY(.7,1,6,8),PU2,0,3,0,1);g.add(tl);
 door(g,0,5.06,0,2.4,3.4,PU2,W);put(g,x0,z0);solB(x0,z0,8.5,5.5);sol(x0+10,z0-4,4.3);sol(x0-10,z0+2,1.4);hqSign('Quartel da Orca Púrpura',x0+14,z0+10,.4);HQ83.push({id:'orca',x:x0,z:z0})}
// Cervo Azul — pavilhão azul-claro com arcos em galhada, ao lado do lago
{const x0=232,z0=-292,g=G83(),AQ=0x5ac8c8,AQ2=0x3a9aa8,W=0xf0f6f6;bp(g,BX(16,.6,12),0xc8d8d8,0,.3,0,1);for(const [x,z] of[[-6,-4],[6,-4],[-6,4],[6,4],[0,-4],[0,4]])bp(g,CY(.5,.6,7,8),W,x,3.8,z,1);bp(g,BX(15,1,11),AQ2,0,7.8,0,1);hip(g,15,11,4,AQ,8.3);
 const ant=(par,x,y,z,s)=>{const b=G83();b.position.set(x,y,z);const m=(a,l,px,py)=>{const c=bp(b,CY(.18,.25,l,6),0xe8dcc0,px+Math.sin(a)*l/2,py+Math.cos(a)*l/2,0,1);c.rotation.z=-a;return[px+Math.sin(a)*l,py+Math.cos(a)*l]};const [ax,ay]=m(s*.35,5,0,0);m(s*.9,2.5,ax*.55,ay*.55);m(s*.1,2.6,ax,ay);m(s*1.1,2,ax,ay);par.add(b)};ant(g,-4,12.3,0,-1);ant(g,4,12.3,0,1);
 put(g,x0,z0);solB(x0,z0,8,6);hqSign('Quartel do Cervo Azul',x0-14,z0+12,-.4);HQ83.push({id:'cervo',x:x0,z:z0})}
// lagos com margem
for(const w of WATER83)if(w.t=='c'){const g=G83();bp(g,CY(w.r,w.r,.05,28),0x3f8ac8,0,.06,0);bp(g,CY(w.r+1.2,w.r+1.4,.04,28),0xb8a878,0,.03,0);put(g,w.x,w.z)}
// jardins e caminhos do reino dos nobres (estátuas, cercas vivas, poucas árvores — o foco é a arquitetura)
{const D=G83();D.userData.lod='d';for(let k=0;k<14;k++){const x=R83(-170,170),z=R83(-320,-200);if(nearRoad(x,z,6)||HQ83.some(h=>Math.hypot(h.x-x,h.z-z)<26)||WATER83.some(w=>w.t=='c'&&Math.hypot(w.x-x,w.z-z)<w.r+4))continue;tree83(x,z,rnd()<.5?'birch':'oak',R83(.9,1.2))}
 for(const [x,z,k] of[[0,-240,'knight'],[-36,-268,'book'],[36,-268,'book']]){const sg=G83();statue83(sg,0,0,k);put(sg,x,z);sol(x,z,1.6)}}