// ================= V106 · Belzebu, o demônio do Grimório de Ossos (contrato, batalha e União Demoníaca com ossos que rebatem magias) · pacote de RP =================
// Visual e falas próprios do Clover RPG. Nada aqui apaga o que já existia.
const BZ106={col:0xb8ff6a,bone:0xf0e8d6,bone2:0xd8ccb4,dk:0x0e140a,gr:0x2a3a1a};
// ---------- quem é o Belzebu (contrato no menu de Contratos Demoníacos)
DPS.belzebu={n:'Belzebu',g:'ossos',col:BZ106.col,tag:'Paciente e calculista; respeita quem não tem medo da morte',pref:{alianca:.45,pacto:.8,confianca:.35,desafio:.7},fight:.65,minLv:15,req:20,hp:1.25,
 L:{first:'Zzzz... um vivo andando entre ossos. Quem te deixou entrar no meu cemitério?',again:'Você voltou. Os ossos lembram de cada passo seu.',lost:'Da última vez seu corpo ficou comigo um minuto. Foi... confortável.',req:'Os ossos ainda estão quietos. Você não fez o que eu pedi.',reqd:'Ouvi os ossos estalando lá fora. Você cumpriu.',
  alianca:['Aliança... lado a lado, como duas costelas do mesmo peito. Interessante.','Aliados morrem. Ossos ficam.'],pacto:['Um pacto. Termos claros, preço justo. Gosto disso.','Pacto com quem nem conhece o próprio grimório?'],confianca:['Confiar num demônio de ossos... ou você é tolo, ou é corajoso.','Confiança? Eu só confio no que sobra depois do fim.'],desafio:['Me desafiar? Hehe... finalmente um que não treme.','Desafio? Seus ossos iam virar poeira.'],
  accept:'Então está feito. Meus ossos serão sua armadura. E quando a magia vier, ela vai voltar para quem a lançou.',refuse:'Zzzz... não. Volte quando tiver algo mais firme que palavras.',prove:'Prove primeiro: derrote 20 inimigos com o Grimório de Ossos e volte aqui.',battle:'Chega de conversa. Vamos ver de que são feitos seus ossos!',win:'Hehe... você venceu o rei do cemitério. Meus ossos agora protegem você.',lose:'Seu corpo é meu por um minuto. Não se preocupe... eu devolvo inteiro.',pact:'Selado em osso. Nada quebra este contrato.'}};
try{CSV.belzebu={pitch:.35,rate:.78}}catch(e){}
try{CSA.belzebu={p:[[.3,'p','Belzebu! Me empresta seus ossos.'],[2,'belzebu','Hehe... já estão saindo.']],d:[[.3,'p','Belzebu, agora!'],[2,'belzebu','Você me venceu. Use meus ossos enquanto pode.']]}}catch(e){}
try{CSD.belzebu=Object.assign({},CSD.zagred,{n:'Belzebu',title:'UNIÃO DEMONÍACA',sub:'Belzebu · Ossos',col:0x46c060,col2:0x0a1406,who:'belzebu',cw:'belzebu',
 lines:[[.5,'belzebu','Ouviu isso? São os ossos do seu corpo chamando os meus.'],[3.6,'p','Então responde. Eu preciso da sua força.'],[6.4,'belzebu','Vou sair por dentro de você. Não grite.'],[9,'p','Pode vir.']],climax:'BELZEBU!'})}catch(e){}
try{if(typeof CSM!='undefined'&&CSM.zagred&&!CSM.belzebu)CSM.belzebu=CSM.zagred}catch(e){}
// ---------- modelo do Belzebu (alto, carapaça verde-escura, coroa de ossos, asas de inseto e moscas em volta)
function bz106Demon(){const L=person({top:0x14200e,pants:0x0a1006,skin:0xcfd6c0,hair:0x0a0e08,hs:0,eye:0xff3030,cape:0x1a2a10,coat:1,long:1,h:1.35,w:1.1}),g=L.g;const BN=naM(BZ106.bone),GL=GLM(BZ106.col,.6);
 // coroa de ossos
 const cr=new T.Group();cr.position.y=2.42*1.0;L.root.add(cr);for(let k=0;k<7;k++){const a=k/7*Math.PI*2,c=new T.Mesh(new T.ConeGeometry(.045,.32+(k%2)*.14,5),BN);c.position.set(Math.cos(a)*.2,.12,Math.sin(a)*.2);c.rotation.set(Math.sin(a)*.25,0,-Math.cos(a)*.25);cr.add(c)}
 // olhos compostos (grandes, vermelhos)
 for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.075,10,8),GLM(0xff2a2a,.95));e.position.set(s*.1,2.24,.17);e.scale.set(1,.8,.6);L.root.add(e)}
 // espinhos de osso nos ombros e na espinha
 for(const s of[-1,1])for(let k=0;k<3;k++){const c=new T.Mesh(new T.ConeGeometry(.06,.5-k*.1,5),BN);c.position.set(s*(.38+k*.06),1.95-k*.08,-.05);c.rotation.z=-s*(.6+k*.25);L.root.add(c)}
 for(let k=0;k<5;k++){const c=new T.Mesh(new T.ConeGeometry(.05,.34,5),BN);c.position.set(0,1.1+k*.18,-.26);c.rotation.x=-1.1;L.root.add(c)}
 // asas de inseto (4, transparentes)
 const W=[];const wm=new T.MeshBasicMaterial({color:0xc8ffb0,transparent:true,opacity:.28,side:T.DoubleSide,depthWrite:false});for(const s of[-1,1])for(let k=0;k<2;k++){const w=new T.Group();w.position.set(s*.12,1.75-k*.25,-.3);const p=new T.Mesh(new T.PlaneGeometry(1.5-k*.3,.42),wm);p.position.x=s*(.75-k*.15);w.add(p);const v=new T.Mesh(new T.BoxGeometry(1.5-k*.3,.015,.015),naM(0x2a3a1a));v.position.x=p.position.x;w.add(v);w.rotation.z=s*(.35-k*.5);L.root.add(w);W.push({w,s,k})}
 // moscas
 const fl=new T.Group();g.add(fl);const F=[];for(let k=0;k<14;k++){const m=new T.Mesh(new T.SphereGeometry(.035,5,4),naM(0x050505));fl.add(m);F.push([m,Math.random()*6.28,.6+Math.random()*.9,1+Math.random()*1.4,1+Math.random()*1.5])}
 UD(g).face=1.95*1.35;UD(g).arm=.9;UD(g).anim=(t,m)=>{try{anim(L,t,0)}catch(e){}W.forEach(o=>{o.w.rotation.y=o.s*(.2+Math.sin(t*28+o.k)*.35)});cr.rotation.y=t*.4;
  F.forEach(f=>{const a=f[1]+t*f[4]*2.2;f[0].position.set(Math.cos(a)*f[2],f[3]+Math.sin(t*3+f[1])*.25,Math.sin(a)*f[2])});
  if(m=='reach2'||m=='reach')L.arms.forEach((a,i)=>{a[0].rotation.x=-1.45;a[0].rotation.z=(i?-1:1)*.1});if(m=='talk')L.arms[1][0].rotation.x=-.8+Math.sin(t*3)*.2};return g}
{const _cd=csDemon;csDemon=function(id){if(id=='belzebu'){try{return bz106Demon()}catch(e){console.warn('bz106',e)}}return _cd.apply(this,arguments)}}
// ---------- dimensão do Belzebu: cemitério de ossos gigantes com névoa verde
{const _dim=csDim;csDim=function(id){if(id!='belzebu')return _dim.apply(this,arguments);const D=new T.Group(),anim=[],q=KQ();const A=(o,f)=>{D.add(o);if(f)anim.push([o,f]);return o};
 try{A(csSky(0x020402,0x16240e))}catch(e){}try{A(csGround(60,0x0a0c08,naTexSmoke(),BZ106.col))}catch(e){}
 const BN=naM(BZ106.bone),BN2=naM(BZ106.bone2);
 for(let k=0;k<Math.round(10*q)+5;k++){const a=k/(Math.round(10*q)+5)*Math.PI*2,r=14+(k%3)*5,R=4+(k%3)*1.5;const rib=new T.Mesh(new T.TorusGeometry(R,.3,6,14,Math.PI*.9),k%2?BN:BN2);rib.position.set(Math.cos(a)*r,0,Math.sin(a)*r);rib.rotation.y=-a;A(rib)}
 for(let k=0;k<Math.round(8*q)+4;k++){const a=Math.random()*6.28,r=9+Math.random()*16,h=3+Math.random()*7;const c=new T.Mesh(new T.ConeGeometry(.5,h,5),BN);c.position.set(Math.cos(a)*r,h/2,Math.sin(a)*r);c.rotation.z=(Math.random()-.5)*.4;A(c)}
 // crânio gigante ao fundo
 const sk=new T.Group();const cr=new T.Mesh(new T.SphereGeometry(5,12,10),BN);cr.scale.set(1.1,.9,1);sk.add(cr);for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(1.2,10,8),GLM(BZ106.col,.8));e.position.set(s*1.9,.3,4.2);sk.add(e)}const jw=new T.Mesh(new T.BoxGeometry(5,1.4,4),BN2);jw.position.set(0,-3.4,2.2);sk.add(jw);sk.position.set(0,6,-34);A(sk,(m,t)=>{m.position.y=6+Math.sin(t*.6)*.5})
 // névoa e moscas
 const N=Math.round(160*q)+40,pg=new T.BufferGeometry(),pp=new Float32Array(N*3);for(let i=0;i<N;i++){pp[i*3]=(Math.random()-.5)*50;pp[i*3+1]=Math.random()*10;pp[i*3+2]=(Math.random()-.5)*50}pg.setAttribute('position',new T.BufferAttribute(pp,3));
 const pts=new T.Points(pg,new T.PointsMaterial({color:BZ106.col,size:.18,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}));A(pts,(m,t)=>{m.rotation.y=t*.05});
 return{g:D,anim}}}

// ---------- forma da União: ossos saindo do corpo (costelas, espinha, ombros, antebraços e coroa)
function bz106Form(L){L=L||PP;const g=new T.Group(),parts=[],BN=naM(BZ106.bone),BN2=naM(BZ106.bone2),GL=GLM(BZ106.col,.55);const tor=L.tspace||L.root,arms=L.arms||[];let hd=L.hs||null,extra=[];if(!hd){hd=new T.Group();hd.position.set(0,1.95,0);L.root.add(hd);extra.push(hd)}
 const add=(m,par,x,y,z)=>{m.position.set(x,y,z);par.add(m);parts.push(m);return m};
 // costelas para fora do peito/costas (arcos de osso dos dois lados)
 for(const s of[-1,1])for(let k=0;k<4;k++){const r=new T.Mesh(new T.TorusGeometry(.4+k*.02,.045,5,12,Math.PI*.8),k%2?BN:BN2);add(r,tor,s*.2,1.56-k*.15,-.02);r.rotation.set(0,s>0?0:Math.PI,-.45);r.scale.set(1.3,1,1.15)}
 // espinha: espinhos saindo das costas
 for(let k=0;k<6;k++){const c=new T.Mesh(new T.ConeGeometry(.075,.62-k*.05,5),k%2?BN:BN2);add(c,tor,0,1.74-k*.15,-.24).rotation.x=-1.2}
 // asas de osso nas costas (três ossos longos de cada lado)
 for(const s of[-1,1])for(let k=0;k<3;k++){const b=new T.Mesh(new T.CylinderGeometry(.035,.06,1.1-k*.2,6),k%2?BN2:BN);const gp=new T.Group();gp.position.set(s*.16,1.6-k*.12,-.26);gp.rotation.set(-.5,0,-s*(1.0+k*.35));b.position.y=(1.1-k*.2)/2;gp.add(b);const tp=new T.Mesh(new T.ConeGeometry(.06,.3,5),BN);tp.position.y=1.1-k*.2+.12;gp.add(tp);tor.add(gp);parts.push(gp)}
 // ombros e antebraços
 arms.forEach((a,i)=>{const s=i?1:-1;for(let k=0;k<2;k++){const c=new T.Mesh(new T.ConeGeometry(.08,.5-k*.12,5),BN);add(c,a[0],0,.04-k*.1,-.06).rotation.set(-.4,0,(i?-1:1)*(.9+k*.3))}
  if(a[1]){const b=new T.Mesh(new T.ConeGeometry(.06,.75,5),BN2);add(b,a[1],0,-.14,-.12).rotation.x=2.6}});
 // coroa de ossos
 for(let k=0;k<6;k++){const a=k/6*Math.PI*2,c=new T.Mesh(new T.ConeGeometry(.045,.28+(k%2)*.12,5),BN);add(c,hd,Math.cos(a)*.2,.24,Math.sin(a)*.2).rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3)}
 // brilho verde fraco
 const au=new T.Mesh(new T.SphereGeometry(1.1,12,8),GLM(BZ106.col,.08));au.position.y=1.15;au.scale.y=1.35;g.add(au);
 return{g,parts,anim(t){au.material.opacity=.06+Math.sin(t*3)*.03;parts.forEach((p,i)=>{const s=1+Math.sin(t*4+i)*.03;p.scale.setScalar?0:0})},detach(){parts.forEach(p=>{if(p.parent)p.parent.remove(p)});extra.forEach(p=>{if(p.parent)p.parent.remove(p)});if(g.parent)g.parent.remove(g)}}}
{const _nf=naForm;naForm=function(fk,L){if(fk=='belzebu')return bz106Form(L);return _nf.apply(this,arguments)}}
// ---------- ativar / desativar a União com o Belzebu (botão Fundir / tecla U)
function togBelz(end){if(!P.g||P.g.id!='ossos')return;if(!P.bz&&end)return;if(P.bz){bzToggle(1);return}if(end)return;if((P.bzcd||0)>0){toast('Belzebu está descansando: espere '+Math.ceil(P.bzcd)+'s.');return}if(!relGate('belzebu'))return;
 if(!CS.on&&run&&csPlay('belzebu',()=>bzToggle(),relActOpts('belzebu')))return;bzToggle()}
function bzToggle(end){if(!P.g||P.g.id!='ossos')return;if(!P.bz&&end)return;P.bz=!P.bz&&!end;try{if(P.bz){if(P.bzF)P.bzF.detach();P.bzF=bz106Form(PP);pm.add(P.bzF.g);PP.mS.color.setHex(0xcfd6c0);try{PP.mE.color.setHex(0xff3030)}catch(e){}ring(4,BZ106.col);burst('ossos',P.x,1.2,P.z,40,6);kWord('BELZEBU');kShock(P.x,P.z,6,BZ106.col,.5)}
  else{if(P.bzF){P.bzF.detach();P.bzF=null}PP.mS.color.setHex(P.look.sk);try{PP.mE.color.setHex(P.look.ec)}catch(e){}P.bzcd=15}}catch(e){console.warn(e)}toast(P.bz?'União com Belzebu: ossos saem do corpo e rebatem 40% das magias inimigas · +25% de dano mágico · gasta mana':'União com Belzebu desativada')}
{const _tu=togUnion;togUnion=function(end){if(P.g&&P.g.id=='ossos'){if(run||end)togBelz(end);return}return _tu.apply(this,arguments)}}
{const _hn=hudNow;hudNow=function(){_hn.apply(this,arguments);try{if(P.g&&P.g.id=='ossos'){const u=$('a-union');if(u){u.classList.remove('hide');u.classList.toggle('on',!!P.bz)}}}catch(e){}}}
{const _pf=posForm;posForm=function(k){return k=='belzebu'?'belzebu':_pf.apply(this,arguments)}}
{const _gg=giveGrim;giveGrim=function(id){if(P.bz)try{bzToggle(1)}catch(e){}return _gg.apply(this,arguments)}}
// ---------- ossos defendendo: escudo de costelas que aparece na frente e rebate a magia
const BZFX106=[];
function bz106Shield(x,z,ax,az){const g=new T.Group(),BN=naM(BZ106.bone),BN2=naM(BZ106.bone2);const a=Math.atan2(ax,az);g.position.set(x,0,z);g.rotation.y=a;g.userData.s=1.45;
 for(let k=0;k<5;k++){const r=new T.Mesh(new T.TorusGeometry(.9-k*.05,.07,5,12,Math.PI),k%2?BN:BN2);r.position.set(0,.2+k*.36,.95);r.rotation.set(-Math.PI/2+.25,0,0);r.scale.set(1,1,.6);g.add(r)}
 for(const s of[-1,1]){const c=new T.Mesh(new T.ConeGeometry(.09,1.9,6),BN);c.position.set(s*.85,.95,.85);c.rotation.x=.15;g.add(c)}
 const fl=new T.Mesh(new T.CircleGeometry(1.1,20),GLM(BZ106.col,.35));fl.position.set(0,1.1,1.05);g.add(fl);g.scale.set(.01,.01,.01);S.add(g);BZFX106.push({g,t:0,fl})}
function bz106FxTick(dt){for(let i=BZFX106.length-1;i>=0;i--){const q=BZFX106[i];q.t+=dt;const t=q.t;const s=t<.12?t/.12:t<.42?1:Math.max(0,1-(t-.42)/.22);q.g.scale.set(1,Math.max(.01,s),1).multiplyScalar(Math.max(.01,Math.min(1,s*1.1))*(q.g.userData.s||1));q.g.children.forEach((c,k)=>{if(c.geometry&&c.geometry.type=='TorusGeometry')c.rotation.z=Math.sin(t*20+k)*.08});q.fl.material.opacity=.35*s;
 if(t>.66){S.remove(q.g);q.g.traverse(o=>{if(o.geometry)o.geometry.dispose()});BZFX106.splice(i,1)}}}
function bz106Reflect(){if(!P.bz||!eshots.length)return;for(let i=eshots.length-1;i>=0;i--){const q=eshots[i];if(!q||!q.m||q.bz106)continue;const ex=q.m.position.x-P.x,ez=q.m.position.z-P.z,L=Math.hypot(ex,ez);if(L>2.7)continue;q.bz106=1;if(Math.random()>=.4)continue;
  eshots.splice(i,1);bz106Shield(P.x,P.z,ex,ez);try{xSnd&&xSnd('naslam')}catch(e){}try{burst('ossos',q.m.position.x,1.2,q.m.position.z,14,4)}catch(e){}
  const dmg=Math.max(20,(q.d||10)*2.2*(1+(P.lv-1)*.04));try{if(window.H93&&H93.bolt)H93.bolt(q.m.position.clone(),BZ106.col,dmg,{mesh:q.m,keep:1,vx:-q.vx||0,vz:-q.vz||1,sp:34});else S.remove(q.m)}catch(e){S.remove(q.m)}
  if(!(P.bzw>0)){P.bzw=.9;try{kWord('REBATIDO!')}catch(e){}}P.bzR=(P.bzR||0)+1}}
// ---------- por quadro: mana, pausa, animação e defesa
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{if(P.bzcd>0)P.bzcd-=dt;if(P.bzw>0)P.bzw-=dt;bz106FxTick(dt);
 if(P.bz){if(!P.g||(P.g.id!='ossos'&&P.g.id!='bzesp'&&P.g.id!='zbunion')){bzToggle(1)}else{P.mp-=2.2*dt;if(P.mp<=0){P.mp=0;bzToggle(1);toast('A União com Belzebu se desfez: sem mana.')}if(P.bzF)P.bzF.anim(performance.now()/1000);bz106Reflect();if(Math.random()<dt*.8*KQ())fxp({x:P.x+(Math.random()-.5)*1.2,y:.4+Math.random()*1.4,z:P.z+(Math.random()-.5)*1.2,c:BZ106.col,n:1,sp:.2,sz:.05,life:.6,up:1})}}}catch(e){}return r}}

// ===================================================================== PACOTE DE RP =====================================================================
// Emotes (gestos), balão de fala, ficha do personagem (nome RP, título) e ordem no nome. Tudo aparece para os outros jogadores no multiplayer.
const RP106={em:null,emT:0,bub:null,bubT:0,st:0,last:[0,0],hide:false};
function rp106S(){const v=v82S();v.rp106=v.rp106||{n:'',t:'',show:1};return v.rp106}
const EMO106=[['acenar','👋','Acenar'],['reverencia','🙇','Reverência'],['sentar','🪑','Sentar'],['meditar','🧘','Meditar'],['ajoelhar','🛡️','Ajoelhar'],['apontar','👉','Apontar'],['palmas','👏','Palmas'],['cruzar','💪','Braços cruzados'],['rir','😂','Rir'],['dancar','💃','Dançar'],['pensar','🤔','Pensar'],['saudar','🫡','Saudação de cavaleiro']];
// poses (aplicadas depois da animação normal)
function rp106Pose(p,em,t){const A=p.arms,L=p.legs,r=p.root;if(!A||!L||!r)return;const sit=(dy)=>{L.forEach(l=>{l[0].rotation.x=-1.5;l[1].rotation.x=1.45});r.position.y=(r.position.y||0)-dy};
 switch(em){
  case'acenar':A[0][0].rotation.x=-2.75;A[0][0].rotation.z=.35+Math.sin(t*9)*.35;A[0][1].rotation.x=-.3;break;
  case'reverencia':r.rotation.x=.5;A[0][0].rotation.x=-1.1;A[0][0].rotation.z=-.7;A[0][1].rotation.x=-1.2;A[1][0].rotation.x=.25;break;
  case'sentar':sit(.5);A.forEach(a=>{a[0].rotation.x=-.5;a[1].rotation.x=-.5});break;
  case'meditar':sit(.55);L.forEach((l,i)=>{l[0].rotation.z=(i?-1:1)*.7});A.forEach((a,i)=>{a[0].rotation.x=-.6;a[0].rotation.z=(i?-1:1)*.25;a[1].rotation.x=-.9});r.position.y+=Math.sin(t*1.5)*.02;break;
  case'ajoelhar':L[0][0].rotation.x=-1.4;L[0][1].rotation.x=1.4;L[1][0].rotation.x=.1;L[1][1].rotation.x=1.6;r.position.y=(r.position.y||0)-.42;r.rotation.x=.12;A[0][0].rotation.x=-.4;A[1][0].rotation.x=-1.0;A[1][1].rotation.x=-.8;break;
  case'apontar':A[0][0].rotation.x=-1.55;A[0][0].rotation.z=.05;A[0][1].rotation.x=0;break;
  case'palmas':{const c=Math.abs(Math.sin(t*7));A.forEach((a,i)=>{a[0].rotation.x=-1.25;a[0].rotation.z=(i?-1:1)*(-.25+c*.45);a[1].rotation.x=-.5})}break;
  case'cruzar':A.forEach((a,i)=>{a[0].rotation.x=-.75;a[0].rotation.z=(i?1:-1)*.15;a[0].rotation.y=(i?-1:1)*.9;a[1].rotation.x=-1.6});break;
  case'rir':r.rotation.x=-.12+Math.sin(t*14)*.05;r.position.y=(r.position.y||0)+Math.abs(Math.sin(t*14))*.04;A.forEach((a,i)=>{a[0].rotation.x=-.4;a[0].rotation.z=(i?-1:1)*.4;a[1].rotation.x=-1.3});break;
  case'dancar':r.rotation.y=Math.sin(t*4)*.45;r.position.y=(r.position.y||0)+Math.abs(Math.sin(t*8))*.08;A.forEach((a,i)=>{a[0].rotation.x=-2.4+Math.sin(t*8+i*3.14)*.5;a[0].rotation.z=(i?-1:1)*.4});L.forEach((l,i)=>{l[0].rotation.x=Math.sin(t*8+i*3.14)*.35;l[1].rotation.x=Math.max(0,Math.sin(t*8+i*3.14))*.6});break;
  case'pensar':A[0][0].rotation.x=-1.2;A[0][0].rotation.z=-.35;A[0][1].rotation.x=-2.1;A[1][0].rotation.x=-.5;A[1][0].rotation.z=.5;A[1][1].rotation.x=-1.4;r.rotation.z=Math.sin(t*1.2)*.03;break;
  case'saudar':A[0][0].rotation.x=-1.0;A[0][0].rotation.z=-.85;A[0][1].rotation.x=-1.9;r.rotation.x=-.05;break}}
{const _an=anim;anim=function(p,t,mv,air){const r=_an.apply(this,arguments);try{const em=p===PP?RP106.em:p.em106;if(em&&!air&&!(p===PP&&P.dead>0)){rp106Pose(p,em,t);if(typeof amSync=='function'&&p.skm)amSync(p)}}catch(e){}return r}}
function rp106Emote(k){if(!run||(P.dead>0))return;if(RP106.em===k){RP106.em=null;return}RP106.em=k;RP106.last=[P.x,P.z];RP106.st=Date.now()%1e6;rp106Close();const E=EMO106.find(e=>e[0]==k);if(E)toast(E[1]+' '+E[2]+' — ande para parar')}
// ---------- balão de fala (o seu e o dos outros)
(function(){const st=document.createElement('style');st.textContent=
 '.rpb106{position:fixed;left:0;top:0;z-index:23;pointer-events:none;transform:translate(-50%,-100%);max-width:min(240px,62vw);padding:6px 10px;border-radius:12px;background:#fffaf0f2;border:2px solid #2a1a06;color:#1a1208;font:700 clamp(11px,2.6vh,14px) system-ui;text-align:center;box-shadow:0 3px 10px #0006;display:none;white-space:normal}.rpb106:after{content:"";position:absolute;left:50%;bottom:-9px;transform:translateX(-50%);border:8px solid transparent;border-top-color:#2a1a06;border-bottom:0}.rpb106.me{font-style:italic;background:#2a2238f2;color:#efe6ff;border-color:#b8a0ff}.rpb106.me:after{border-top-color:#b8a0ff}'+
 '.rpn106{display:block;font:800 10px system-ui;color:#ffe9a0;text-shadow:0 1px 2px #000;margin-top:1px}'+
 '#rp106{position:fixed;inset:0;z-index:57;display:none;align-items:flex-end;justify-content:center;background:rgba(4,6,16,.45)}#rp106.on{display:flex}#rp106 .c{width:min(96vw,560px);max-height:80vh;overflow:auto;margin-bottom:max(10px,env(safe-area-inset-bottom));border-radius:14px;border:2px solid #c9a24a;background:linear-gradient(180deg,#141a36,#0b0e20);color:#f3e6c4;padding:12px 14px;font:600 13px system-ui;box-shadow:0 10px 40px rgba(0,0,0,.6)}'+
 '#rp106 h3{margin:0 0 6px;font-family:Cinzel,Georgia,serif;font-weight:900;color:#f0cf72;letter-spacing:.05em;font-size:17px;display:flex;justify-content:space-between;align-items:center}#rp106 h3 span{cursor:pointer;font:800 18px system-ui;color:#fff;padding:0 6px}#rp106 .sec{margin:8px 0 4px;color:#f0cf72;font:800 12px system-ui;letter-spacing:.06em}'+
 '#rp106 .eg{display:grid;grid-template-columns:repeat(auto-fill,minmax(84px,1fr));gap:6px}#rp106 .eb{border:1.5px solid #3a4270;background:#151a3a;border-radius:10px;padding:6px 2px;text-align:center;cursor:pointer;color:#f3e6c4;font:700 11px system-ui}#rp106 .eb b{display:block;font-size:20px}#rp106 .eb.on{border-color:#f0cf72;background:#2a2210}'+
 'body.cineon #int86b,body.cineon .ia103b{display:none!important}'+'#rp106 .row{display:flex;gap:6px;margin:4px 0}#rp106 input{flex:1;min-width:0;padding:9px 10px;border-radius:9px;border:1.5px solid #3a4270;background:#0a0d22;color:#fff;font:600 14px system-ui}#rp106 .bt{padding:9px 12px;border-radius:9px;border:2px solid #f0cf72;background:linear-gradient(180deg,#3a2a10,#1e1408);color:#ffe9a0;font:800 13px system-ui;cursor:pointer;white-space:nowrap}#rp106 .sm{opacity:.75;font-size:11px;margin-top:3px}#rp106 label{display:flex;gap:6px;align-items:center;margin-top:6px;font-size:12px}';document.head.appendChild(st);
 const d=document.createElement('div');d.id='rp106';d.innerHTML='<div class="c"></div>';document.body.appendChild(d);d.addEventListener('pointerdown',e=>{if(e.target===d)rp106Close()});
 const b=document.createElement('div');b.className='rpb106';document.body.appendChild(b);RP106.myB=b;
 // (V107) botão RP e tecla R removidos a pedido: o RP não exige escrever nada para agir
})();
const BAD106=/\b(porra|caralho|merda|puta|fdp|vsf|pqp|buceta|viado|arrombad\w*|cuzao|cuzão|desgraçad\w*|filho da puta)\b/gi;
function rp106Clean(t){return String(t||'').replace(/[<>]/g,'').replace(BAD106,m=>'*'.repeat(m.length)).slice(0,90).trim()}
function rp106Say(t){t=rp106Clean(t);if(!t)return;RP106.bub=t;RP106.bubT=7;RP106.bst=Date.now()%1e6;const me=/^\*.*\*$/.test(t)||/^\/me\s/i.test(t);if(/^\/me\s/i.test(t))RP106.bub='*'+t.replace(/^\/me\s+/i,'')+'*';RP106.myB.className='rpb106'+(me?' me':'');RP106.myB.textContent=RP106.bub}
function rp106Open(){const s=rp106S(),c=$('rp106').querySelector('.c'),esc=x=>String(x||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
 let h='<h3>🎭 RP — Interpretação<span onclick="rp106Close()">✕</span></h3><div class="sec">GESTOS</div><div class="eg">'+EMO106.map(e=>'<div class="eb'+(RP106.em==e[0]?' on':'')+'" onclick="rp106Emote(\''+e[0]+'\')"><b>'+e[1]+'</b>'+e[2]+'</div>').join('')+'</div>';
 h+='<div class="sec">FALAR (balão em cima da cabeça)</div><div class="row"><input id="rp106t" maxlength="90" placeholder="Fale algo… ou use *ação* (ex.: *abre o grimório*)"><span class="bt" onclick="rp106Send()">Falar</span></div><div class="sm">Dica: entre asteriscos vira ação, como em *faz uma reverência*. Os jogadores perto de você veem o balão.</div>';
 h+='<div class="sec">FICHA DO PERSONAGEM</div><div class="row"><input id="rp106n" maxlength="20" placeholder="Nome do personagem (RP)" value="'+esc(s.n)+'"></div><div class="row"><input id="rp106ti" maxlength="28" placeholder="Título ou profissão (ex.: Ferreiro de Hage)" value="'+esc(s.t)+'"><span class="bt" onclick="rp106Save()">Salvar</span></div><div class="sm">Aparece embaixo do seu nome para os outros jogadores, junto com a sua ordem de cavaleiros.</div>';
 h+='<label><input type="checkbox" id="rp106h" '+(s.show?'checked':'')+' onchange="rp106S().show=this.checked?1:0;try{saveGame()}catch(e){}"> Mostrar balões de fala dos outros jogadores</label>';
 c.innerHTML=h;$('rp106').classList.add('on');try{document.body.classList.add('inmenu')}catch(e){}const i=$('rp106t');if(i)i.addEventListener('keydown',e=>{if(e.key=='Enter'){e.preventDefault();rp106Send()}e.stopPropagation()});['rp106n','rp106ti'].forEach(id=>{const x=$(id);if(x)x.addEventListener('keydown',e=>e.stopPropagation())})}
function rp106Close(){const d=$('rp106');if(d)d.classList.remove('on');try{document.body.classList.remove('inmenu')}catch(e){}}
function rp106Send(){const i=$('rp106t');if(!i)return;rp106Say(i.value);i.value='';rp106Close()}
function rp106Save(){const s=rp106S();s.n=rp106Clean(($('rp106n')||{}).value||'').slice(0,20);s.t=rp106Clean(($('rp106ti')||{}).value||'').slice(0,28);try{saveGame()}catch(e){}toast('📜 Ficha salva'+(s.n?': '+s.n:'')+(s.t?' · '+s.t:''));rp106Close()}
// ---------- multiplayer: manda gesto, fala, nome RP, título e ordem na presença
{const _xl=xLk;xLk=function(){const o=_xl.apply(this,arguments);try{const s=rp106S(),od=typeof ord105=='function'?ord105():null;o.rp={n:s.n||'',t:s.t||'',o:od&&od.id||'',em:RP106.em||'',b:RP106.bubT>0?[RP106.bub,RP106.bst]:0}}catch(e){}return o}}
{const _xa=xApplyOther;xApplyOther=function(o,lk){const r=_xa.apply(this,arguments);try{const rp=lk&&lk.rp||{};o.rp106=rp;if(o.L)o.L.em106=rp.em||null;
 if(rp.b&&Array.isArray(rp.b)&&rp.b[1]!==o.rpbs){o.rpbs=rp.b[1];if(!o.rpB){o.rpB=document.createElement('div');document.body.appendChild(o.rpB)}const t=rp106Clean(rp.b[0]);o.rpB.className='rpb106'+(/^\*.*\*$/.test(t)?' me':'');o.rpB.textContent=t;o.rpBT=7}
 // nome RP, título e ordem embaixo do nome
 if(o.lb){if(!o.rpN){o.rpN=document.createElement('span');o.rpN.className='rpn106';o.lb.appendChild(o.rpN)}const I=rp.o&&typeof ord105Info=='function'?ord105Info(rp.o):null;const txt=[rp.n?'“'+rp106Clean(rp.n)+'”':'',rp106Clean(rp.t||''),I?'🛡️ '+I.n:''].filter(Boolean).join(' · ');if(o.rpN.textContent!==txt)o.rpN.textContent=txt;o.rpN.style.display=txt?'':'none'}}catch(e){}return r}}
// ---------- por quadro: parar gesto ao andar, posicionar balões
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{
 try{if(IA103.btn&&!IA103.btn.classList.contains('ia103b'))IA103.btn.classList.add('ia103b')}catch(e){}
 if(RP106.em){const d=Math.hypot(P.x-RP106.last[0],P.z-RP106.last[1]);if(d>.08||P.dead>0||CS.on||ENC.on)RP106.em=null}
 const show=rp106S().show;
 if(RP106.bubT>0){RP106.bubT-=dt;const a=scr(P.x,2.75+(RP106.em=='sentar'||RP106.em=='meditar'?-.5:0),P.z);const b=RP106.myB;if(a&&a[2]&&RP106.bubT>0){b.style.display='block';b.style.transform='translate('+(a[0]|0)+'px,'+(a[1]|0)+'px) translate(-50%,-100%)'}else b.style.display='none'}else if(RP106.myB)RP106.myB.style.display='none';
 if(MP.r)for(const k in MP.others){const o=MP.others[k];if(!o||!o.rpB)continue;o.rpBT=(o.rpBT||0)-dt;const a=o.rpBT>0&&show&&Math.hypot(o.x-P.x,o.z-P.z)<40?scr(o.x,3.05,o.z):null;if(a&&a[2]){o.rpB.style.display='block';o.rpB.style.transform='translate('+(a[0]|0)+'px,'+(a[1]|0)+'px) translate(-50%,-100%)'}else o.rpB.style.display='none'}
}catch(e){}return r}}
// ---------- código secreto de admin: agora também dá o nível máximo (o código antigo continua funcionando; o texto do código não fica no jogo)
{const H106=c=>{let h=0x811c9dc5;for(let i=0;i<c.length;i++){h^=c.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0}return h};
 CSEC=function(c){const h=H106(c);return h===0x6146c238||h===0xd23dbfae?{id:'S_V106',r:{agiros:500,cagiros:500,sgiros:500,gsgiros:500,giros:500,ggiros:500,max:1}}:null}}

