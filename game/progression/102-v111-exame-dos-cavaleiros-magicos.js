// ================= V111 · EXAME DOS CAVALEIROS MÁGICOS (cerimônia completa) =================
// 6 provas: Voo com Vassoura · Explosão de Poder · Precisão contra Alvos Móveis · Criação com a própria Magia · Crescimento da Semente · Combate entre Participantes
// depois: apresentação aos 9 capitães (cada um avalia do seu jeito e levanta a mão) e entrada no esquadrão (identificação, uniforme, insígnia, patente, acesso à sede e registro de membro)
(function(){
const {x:CX,z:CZ}=PL105.col;
const EX=EX105;EX.sc=[0,0,0,0,0,0];
const E111={casts:0,used:new Set(),hold:false,up:false,dn:false,act:null};window.EX111=E111;
// ---------- as 6 provas (texto da cerimônia)
EXT105.length=0;EXT105.push(['PROVA I','Voo com Vassoura','Suba na vassoura, ative a magia e passe pelos anéis no ar',70],['PROVA II','Explosão de Poder','Carregue a magia e solte na zona dourada contra o alvo (3 tentativas)',45],['PROVA III','Precisão','Acerte os alvos que se movem pela arena com as suas magias',45],['PROVA IV','Criação Mágica','Crie uma estrutura com a sua magia mantendo o controle',45],['PROVA V','A Semente','Faça a semente crescer aplicando a mana na medida certa',40],['PROVA VI','Combate entre Participantes','Escolha um candidato e vença o duelo',80]);
EXLINE105.length=0;EXLINE105.push('"Um mago que não controla nem uma vassoura não controla magia nenhuma. Voem!"','"Mostrem a força da sua magia — mas força sem controle se volta contra você."','"Lá fora o inimigo não fica parado. Acertem os alvos em movimento."','"Magia também cria. Mostrem o que a de vocês sabe construir."','"Uma semente não cresce com força bruta. Mana na medida certa."','"Última prova. Escolham um adversário entre os candidatos. Que vença o melhor."');
// ---------- capitães (nomes e personalidades originais do CLOVER RP)
const CAP={touro:['Garrik Noir','Rude e debochado, mas leal. Gosta de quem não desiste no meio da luta.',{5:.5,1:.3,0:.2}],
 dourado:['Aurel Vance','Elegante e exigente. Só quer os mais completos.',{0:.16,1:.17,2:.17,3:.17,4:.16,5:.17}],
 aguia:['Selena Arvik','Calma e observadora. Adora mira perfeita.',{2:.6,0:.2,5:.2}],
 leao:['Brann Feroz','Explosivo e barulhento. Ama poder bruto.',{1:.6,5:.3,2:.1}],
 rosa:['Celeste Vyre','Orgulhosa e disciplinada. Valoriza controle absoluto.',{3:.4,4:.3,1:.3}],
 louva:['Thalo Verdan','Paciente e gentil. Gosta de quem respeita a natureza.',{4:.55,3:.25,0:.2}],
 pavao:['Coralie Duss','Artística e excêntrica. Valoriza criatividade.',{3:.55,4:.2,5:.25}],
 orca:['Morvan Abis','Estrategista frio. Observa cada decisão no combate.',{5:.55,2:.25,1:.2}],
 cervo:['Elric Brumal','Tranquilo e equilibrado. Admira quem domina o voo.',{0:.55,4:.2,2:.25}]};
window.CAP111=CAP;
const RANKS=['Cavaleiro Mágico Júnior · 5ª Classe','Cavaleiro Mágico Júnior · 4ª Classe','Cavaleiro Mágico Júnior · 3ª Classe','Cavaleiro Mágico Intermediário · 2ª Classe','Cavaleiro Mágico Intermediário · 1ª Classe','Cavaleiro Mágico Sênior','Cavaleiro Mágico Superior','Vice-capitão'];
function rank111(){const v=v82S(),o=v.ord105;if(!o||!o.id)return null;const lv=P.lv||1,b=o.sc>=480?1:0;return RANKS[Math.min(RANKS.length-1,Math.floor(Math.max(0,lv-10)/10)+b)]}window.rank111=rank111;
// ---------- interface: botão de ação (segurar), botões de altura, medidor
const css=`#ex111b{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 176px);transform:translateX(-50%);z-index:41;display:none;padding:12px 22px;border-radius:30px;border:2px solid #f0cf72;background:linear-gradient(#3a2a10,#1c1408);color:#ffe9a8;font:800 15px Cinzel,Georgia,serif;letter-spacing:.04em;box-shadow:0 0 18px rgba(240,207,114,.5);touch-action:none;user-select:none;-webkit-user-select:none}
#ex111b.h{background:linear-gradient(#7a5a18,#4a3408);box-shadow:0 0 28px rgba(255,220,120,.9)}
#ex111h{position:fixed;right:calc(env(safe-area-inset-right,0px) + 14px);top:42%;z-index:41;display:none;flex-direction:column;gap:10px}
#ex111h button{width:58px;height:58px;border-radius:50%;border:2px solid #f0cf72;background:rgba(28,20,8,.85);color:#ffe9a8;font-size:24px;touch-action:none}
#ex111g{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 232px);transform:translateX(-50%);z-index:41;display:none;width:min(70vw,360px);height:22px;border-radius:12px;background:rgba(10,8,4,.8);border:2px solid #c9a24a;overflow:hidden}
#ex111g .z{position:absolute;top:0;bottom:0;background:rgba(240,207,114,.55);border-left:2px solid #ffe9a8;border-right:2px solid #ffe9a8}
#ex111g .n{position:absolute;top:-2px;bottom:-2px;width:5px;margin-left:-2px;background:#fff;box-shadow:0 0 8px #fff}
#ex111g .f{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,rgba(80,160,255,.35),rgba(160,90,255,.45))}
#ex111c{position:fixed;inset:0;z-index:43;display:none;align-items:center;justify-content:center;font:900 min(22vw,150px) Cinzel,Georgia,serif;color:#ffe9a8;text-shadow:0 0 30px #f0cf72,0 4px 0 #3a2a10;pointer-events:none}
#ex111s{position:fixed;inset:0;z-index:55;display:none;align-items:center;justify-content:center;background:rgba(6,4,2,.6)}
#ex111s .c{width:min(94vw,640px);max-height:88vh;overflow:auto;padding:16px 18px;border-radius:16px;border:2px solid #c9a24a;background:linear-gradient(#2a1f10,#140e06);color:#f4e6c4;font-family:Georgia,serif}
#ex111s h2{margin:0 0 4px;font:900 20px Cinzel,Georgia,serif;color:#f0cf72;text-align:center}#ex111s .sub{text-align:center;opacity:.85;font-size:13px;margin-bottom:10px}
#ex111s .op{display:flex;align-items:center;gap:10px;padding:8px 10px;margin:6px 0;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(240,207,114,.25);cursor:pointer}
#ex111s .op:hover,#ex111s .op.sel{background:rgba(240,207,114,.18);border-color:#f0cf72}
#ex111s .op i{width:34px;height:34px;border-radius:50%;flex:0 0 auto;box-shadow:0 0 0 2px #f0cf72}
#ex111s .op b{display:block}#ex111s .op small{opacity:.8}
#ex111s .bt{display:inline-block;margin:8px 6px 0;padding:9px 16px;border-radius:20px;border:1px solid #f0cf72;background:linear-gradient(#5a4218,#2e200a);color:#ffe9a8;font:700 14px Georgia,serif;cursor:pointer}
#ex111s .row{display:flex;align-items:center;gap:8px;margin:4px 0;font-size:13px}#ex111s .row b{flex:0 0 46%}#ex111s .bar{flex:1;height:10px;border-radius:6px;background:rgba(255,255,255,.1);overflow:hidden}#ex111s .bar i{display:block;height:100%;background:linear-gradient(90deg,#c9a24a,#ffe9a8)}
#ex111s .cap{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
#ex111s .cp{padding:8px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);text-align:center;font-size:12px}
#ex111s .cp.y{border-color:#f0cf72;background:rgba(240,207,114,.15);box-shadow:0 0 14px rgba(240,207,114,.35)}
#ex111s .cp .em{width:30px;height:30px;margin:0 auto 4px;border-radius:50%;box-shadow:0 0 0 2px #f0cf72}
#ex111s .idc{position:relative;padding:14px;border-radius:14px;background:linear-gradient(135deg,var(--oc),#120c06 70%);border:2px solid #f0cf72;display:grid;grid-template-columns:90px 1fr;gap:12px}
#ex111s .idc .ins{width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle,var(--oc),#000);box-shadow:0 0 0 3px #f0cf72,0 0 20px var(--oc);font:900 34px Cinzel,serif;color:#ffe9a8}
#ex111p{position:fixed;left:0;right:0;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);z-index:44;display:none;text-align:center;pointer-events:none}
#ex111p div{display:inline-block;max-width:min(92vw,620px);padding:10px 18px;border-radius:14px;background:rgba(10,8,4,.82);border:2px solid #c9a24a;color:#f4e6c4;font:15px Georgia,serif}
#ex111p b{display:block;color:#f0cf72;font:900 18px Cinzel,Georgia,serif}
@media (max-width:700px){#ex111s .cap{grid-template-columns:repeat(2,1fr)}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const mkd=(id,h)=>{const d=document.createElement('div');d.id=id;d.innerHTML=h||'';document.body.appendChild(d);return d};
const AB=document.createElement('button');AB.id='ex111b';document.body.appendChild(AB);
const HB=mkd('ex111h','<button data-h="u">▲</button><button data-h="d">▼</button>');const GG=mkd('ex111g','<div class="f"></div><div class="z"></div><div class="n"></div>');const CD=mkd('ex111c');const SC=mkd('ex111s','<div class="c"></div>');const PR=mkd('ex111p','<div></div>');
const hold=(on)=>{E111.hold=on;AB.classList.toggle('h',on);if(on&&E111.act)E111.act()};
AB.addEventListener('pointerdown',e=>{e.preventDefault();hold(true)});['pointerup','pointercancel','pointerleave'].forEach(n=>AB.addEventListener(n,()=>hold(false)));
HB.querySelectorAll('button').forEach(b=>{const k=b.dataset.h=='u'?'up':'dn';b.addEventListener('pointerdown',e=>{e.preventDefault();E111[k]=true});['pointerup','pointercancel','pointerleave'].forEach(n=>b.addEventListener(n,()=>E111[k]=false))});
addEventListener('keydown',e=>{if(!EX.on)return;if(e.code=='KeyX'&&!e.repeat){hold(true)}if(BR.on&&e.code=='Space'){E111.up=true;e.preventDefault()}if(BR.on&&e.code=='KeyZ')E111.dn=true},true);
addEventListener('keyup',e=>{if(e.code=='KeyX')hold(false);if(e.code=='Space')E111.up=false;if(e.code=='KeyZ')E111.dn=false},true);
function act(lbl,fn){if(!lbl){AB.style.display='none';E111.act=null;return}AB.textContent=lbl+' (X)';AB.style.display='block';E111.act=fn||null}
function gauge(on,zone,needle,fill){GG.style.display=on?'block':'none';if(!on)return;const z=GG.querySelector('.z');z.style.left=(zone[0]*100)+'%';z.style.width=((zone[1]-zone[0])*100)+'%';GG.querySelector('.n').style.left=(Math.max(0,Math.min(1,needle))*100)+'%';GG.querySelector('.f').style.width=(Math.max(0,Math.min(1,fill||0))*100)+'%'}
function count(txt,ms){CD.textContent=txt;CD.style.display='flex';CD.animate([{transform:'scale(1.8)',opacity:0},{transform:'scale(1)',opacity:1},{transform:'scale(.9)',opacity:0}],{duration:ms||900});setTimeout(()=>CD.style.display='none',(ms||900)-20)}
const col=()=>P.g?P.g.c:0xffffff;const add=(m)=>{S.add(m);EX.objs.push(m);return m};
const lam=(c,o)=>new T.MeshLambertMaterial(Object.assign({color:c},o||{}));const bas=(c,o)=>new T.MeshBasicMaterial(Object.assign({color:c},o||{}));
function textSprite(t,c,w){const cv=document.createElement('canvas');cv.width=512;cv.height=128;const x=cv.getContext('2d');x.font='900 64px Georgia';x.textAlign='center';x.textBaseline='middle';x.lineWidth=10;x.strokeStyle='#1a1006';x.strokeText(t,256,64);x.fillStyle=c||'#ffe9a8';x.fillText(t,256,64);const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(cv),transparent:true,depthTest:false}));s.scale.set(w||4,(w||4)/4,1);s.renderOrder=999;return s}
// ================= PROVA I · VASSOURA (modelo: cabo, ponteira, amarração, cerdas/fibras) =================
function broomModel(){const g=new T.Group(),wood=lam(0x7a4a22),wood2=lam(0x5a3414),straw=lam(0xd8b45a),straw2=lam(0xb8902e),band=lam(0x8a6a3a),gold=lam(0xd4af5a,{emissive:0x3a2a00});
 const h=new T.Mesh(new T.CylinderGeometry(.045,.055,2.3,8),wood);h.rotation.z=Math.PI/2;g.add(h);
 for(let k=0;k<5;k++){const n=new T.Mesh(new T.TorusGeometry(.055,.012,5,10),wood2);n.rotation.y=Math.PI/2;n.position.x=-.9+k*.38;g.add(n)}
 const tip=new T.Mesh(new T.SphereGeometry(.075,10,8),gold);tip.position.x=1.17;g.add(tip);const tip2=new T.Mesh(new T.ConeGeometry(.05,.16,8),gold);tip2.rotation.z=-Math.PI/2;tip2.position.x=1.27;g.add(tip2);
 for(let k=0;k<3;k++){const b=new T.Mesh(new T.CylinderGeometry(.1+k*.012,.1+k*.012,.07,12),band);b.rotation.z=Math.PI/2;b.position.x=-1.1-k*.09;g.add(b)}
 const fib=new T.Group();fib.position.x=-1.2;g.add(fib);const fg=new T.CylinderGeometry(.012,.02,.95,4);for(let k=0;k<46;k++){const a=k*2.399,r=.03+(k%7)*.022;const f=new T.Mesh(fg,k%3?straw:straw2);f.rotation.z=Math.PI/2+(Math.random()-.5)*.12+0;f.position.set(-.45,Math.sin(a)*r,Math.cos(a)*r);f.rotation.y=(Math.random()-.5)*.2;const sp=new T.Group();sp.add(f);sp.rotation.set(Math.cos(a)*r*1.6,0,Math.sin(a)*r*1.6);fib.add(sp)}
 const glow=new T.Mesh(new T.TorusGeometry(.5,.03,6,30),bas(0xffe9a8,{transparent:true,opacity:0}));glow.rotation.x=Math.PI/2;g.add(glow);g.userData.glow=glow;g.userData.fib=fib;return g}
const BR={on:false,y:0,h:0,m:null,mounted:false};window.BR111=BR;
function setup0(S5){S5.ph='aprox';S5.k=0;S5.touch=0;S5.out=0;S5.air=0;S5.jit=0;S5.n=0;
 const b=broomModel();b.position.set(CX,1,CZ+6);add(b);S5.b=b;BR.m=b;
 const pts=[[0,-2,2.6],[9,-6,3.8],[13,3,5.2],[6,11,4.2],[-6,10,6],[-13,1,4.6],[-8,-9,3.2],[0,-12,5.6]];S5.rg=pts.map(([dx,dz,y],k)=>{const r=new T.Mesh(new T.TorusGeometry(1.5,.13,8,28),bas(k?0x6aa8ff:0xffe066,{transparent:true,opacity:.9}));r.position.set(CX+dx,y,CZ+dz);const nx=pts[k+1]||pts[k];r.lookAt(CX+nx[0],y,CZ+nx[1]);add(r);return{r,x:CX+dx,y,z:CZ+dz,ok:0}})}
function tick0(S5,dt){const b=S5.b,t=performance.now()/1000;
 if(S5.ph=='aprox'){b.position.y=1+Math.sin(t*2)*.12;b.rotation.y+=dt*.4;const d=Math.hypot(P.x-b.position.x,P.z-b.position.z);act(d<2.6?'🧹 Subir na vassoura':null,()=>{S5.ph='mont';S5.b.rotation.set(0,0,0);pm.add(S5.b);S5.b.position.set(0,.06,0);S5.b.rotation.y=Math.PI/2;BR.on=true;BR.y=P.y||0;BR.h=.25;try{toast('Você subiu na vassoura. Agora ative a magia!')}catch(e){}});if(d>=2.6)act(null);return}
 if(S5.ph=='mont'){act('✨ Ativar magia',()=>{S5.ph='voo';BR.h=2.4;HB.style.display='flex';act(null);try{kShock(P.x,P.z,2.5,col(),.5,.2)}catch(e){}try{toast('Voando! ▲/▼ (ou Espaço/Z) para subir e descer.')}catch(e){}});return}
 if(S5.ph!='voo')return;
 // controle de altura e estabilidade
 const dh=(E111.up?1:0)-(E111.dn?1:0);BR.h=Math.max(.3,Math.min(9,BR.h+dh*3.4*dt));const prev=BR.y;BR.y+=(BR.h-BR.y)*Math.min(1,dt*3.2);const w=Math.sin(t*1.7)*.06;S5.n++;S5.air+=dt;S5.jit+=Math.abs((BR.y-prev)/Math.max(dt,.001)-(S5.lv||0))*dt;S5.lv=(BR.y-prev)/Math.max(dt,.001);
 if(BR.y<.6){S5.touch+=dt}if(BR.y>8){S5.out+=dt;b.rotation.z=Math.sin(t*20)*.08;if(Math.random()<.05)try{toast('Alto demais: a vassoura está instável!')}catch(e){}}else b.rotation.z=w;
 b.userData.glow.material.opacity=.35+Math.sin(t*6)*.15;b.userData.fib.rotation.x=Math.sin(t*9)*.08;if(Math.random()<dt*14*(typeof KQ=='function'?KQ():1))try{fxp({x:P.x-Math.sin(P.f)*1.3,y:BR.y+.1,z:P.z-Math.cos(P.f)*1.3,c:col(),n:1,sp:.2,sz:.08,life:.5,up:.2})}catch(e){}
 const nx=S5.rg.find(o=>!o.ok);S5.rg.forEach(o=>{o.r.material.color.setHex(o.ok?0x44dd88:o===nx?0xffe066:0x6aa8ff);o.r.material.opacity=o.ok?.35:o===nx?.95:.5;o.r.rotation.z+=dt*(o===nx?1.5:.3)});
 if(nx&&Math.hypot(P.x-nx.x,P.z-nx.z)<1.9&&Math.abs(BR.y+1-nx.y)<1.7){nx.ok=1;S5.k++;try{snd('ring');kShock(nx.x,nx.z,2,0xffe066,.4,nx.y-.5)}catch(e){}try{toast('Anel '+S5.k+'/'+S5.rg.length)}catch(e){}}
 if(S5.k>=S5.rg.length||EX.t<=0)fin0(S5)}
function stab0(S5){const air=Math.max(1,S5.air);return Math.max(0,Math.min(1,1-(S5.touch/air)*1.5-(S5.out/air)*1.2-Math.min(.3,S5.jit/air*.02)))}
function fin0(S5){const f=S5.k/S5.rg.length,sb=stab0(S5),tl=Math.max(0,EX.t)/EXT105[0][3];const sc=Math.round(100*(f*.6+sb*.25+(f>=1?tl:0)*.15));S5.res='Anéis '+S5.k+'/'+S5.rg.length+' · estabilidade '+Math.round(sb*100)+'%';unmount();finish(sc,S5.res)}
function unmount(){if(!BR.on)return;BR.on=false;HB.style.display='none';E111.up=E111.dn=false;try{if(BR.m&&BR.m.parent)BR.m.parent.remove(BR.m)}catch(e){}BR.m=null;P.vy=0}
// ================= PROVA II · EXPLOSÃO DE PODER (estrutura de teste, alvo, área de conjuração, coluna de poder) =================
function setup1(S5){S5.tries=[];S5.ch=0;S5.charging=false;const g=new T.Group();g.position.set(CX,0,CZ-10);add(g);const st=lam(0x8a8478),st2=lam(0x6a645a);
 const base=new T.Mesh(new T.CylinderGeometry(2.4,2.8,.6,16),st2);base.position.y=.3;g.add(base);const pil=new T.Mesh(new T.BoxGeometry(1.6,6,1.2),st);pil.position.y=3.6;g.add(pil);
 const tg=new T.Group();tg.position.set(0,3.4,.62);g.add(tg);[[1.3,0xf4e6c4],[1,0xc0302a],[.7,0xf4e6c4],[.4,0xc0302a],[.15,0xffe066]].forEach(([r,c],k)=>{const d=new T.Mesh(new T.CircleGeometry(r,28),bas(c));d.position.z=k*.01;tg.add(d)});S5.tg=tg;
 const colm=new T.Mesh(new T.BoxGeometry(.5,1,.5),bas(0xffe066,{transparent:true,opacity:.85}));colm.position.set(1.4,.6,.7);colm.scale.y=.01;g.add(colm);S5.colm=colm;const fr=new T.Mesh(new T.BoxGeometry(.7,6.2,.08),lam(0x3a2a14));fr.position.set(1.4,3.7,.42);g.add(fr);
 const ring=new T.Mesh(new T.RingGeometry(1.8,2.1,40),bas(0xffe066,{transparent:true,opacity:.7,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(CX,.05,CZ+4);add(ring);S5.ring=ring;S5.g=g}
function tick1(S5,dt){const inA=Math.hypot(P.x-CX,P.z-(CZ+4))<2.2;S5.ring.material.opacity=inA?.95:.45;
 if(S5.tries.length>=3){if(!S5.endT){S5.endT=1.6}S5.endT-=dt;if(S5.endT<=0){const b=Math.max(...S5.tries),a=S5.tries.reduce((x,y)=>x+y,0)/3;finish(Math.round(100*(b*.7+a*.3)),'Melhor tentativa '+Math.round(b*100)+'%')}return}
 if(!inA){act(null);gauge(false);if(Math.random()<dt)try{toast('Entre no círculo dourado para conjurar.')}catch(e){}return}
 act(S5.charging?'🔥 Segure… e solte!':'🔥 Segurar para carregar ('+(S5.tries.length+1)+'/3)');P.f=Math.atan2(CX-P.x,(CZ-10)-P.z);
 const z=[.78,.92];if(E111.hold){if(!S5.charging){S5.charging=true;S5.ch=0;S5.sp=.35+Math.random()*.25}S5.ch+=dt*S5.sp*(1+S5.ch*1.2);S5.wob=Math.sin(performance.now()/90)*.012*(1+S5.ch*2);if(Math.random()<dt*20)try{fxp({x:P.x+Math.sin(P.f)*.6,y:1.4,z:P.z+Math.cos(P.f)*.6,c:col(),n:1,sp:1.2*S5.ch,sz:.08+S5.ch*.1,life:.4})}catch(e){}if(S5.ch>1.05){S5.charging=false;S5.tries.push(0);try{toast('Sobrecarga! A magia escapou do controle (0%).');kShock(P.x,P.z,2.5,0x555555,.4,.3)}catch(e){}}}
 else if(S5.charging){S5.charging=false;const c=Math.min(1,S5.ch+(S5.wob||0)),inZ=c>=z[0]&&c<=z[1],ctl=inZ?1:Math.max(0,1-Math.min(Math.abs(c-z[0]),Math.abs(c-z[1]))*3.5),val=Math.min(1,c/.92)*.55+ctl*.45;S5.tries.push(val);blast1(S5,val,inZ)}
 gauge(true,z,S5.charging?S5.ch+(S5.wob||0):0,S5.tries.length?Math.max(...S5.tries):0)}
function blast1(S5,val,inZ){const c=col(),x0=P.x,z0=P.z,tx=CX,tz=CZ-10+.7,len=Math.hypot(tx-x0,tz-z0);const beam=new T.Mesh(new T.CylinderGeometry(.25+val*.5,.15+val*.3,len,10,1,true),bas(c,{transparent:true,opacity:.85,blending:T.AdditiveBlending}));beam.position.set((x0+tx)/2,2.6,(z0+tz)/2);beam.rotation.x=Math.PI/2;beam.lookAt(tx,3.4,tz);beam.rotateX(Math.PI/2);add(beam);
 try{snd('esboom');P.shake=Math.max(P.shake||0,.15+val*.3);kShock(tx,tz,2+val*3,c,.5,3.4);fxp({x:tx,y:3.4,z:tz,c,n:Math.round(30*val+8),sp:4+val*5,sz:.2,life:.7})}catch(e){}
 const tgt=val;kfx({u:(q,dt)=>{beam.material.opacity=Math.max(0,.85-q.t*1.6);S5.colm.scale.y+=((tgt*6)-S5.colm.scale.y)*Math.min(1,dt*5);S5.colm.position.y=.6+S5.colm.scale.y/2;S5.colm.material.color.setHex(tgt>.85?0xffe066:tgt>.6?0x88ddff:0xff7a5a);S5.tg.scale.setScalar(1+Math.max(0,.3-q.t)*val);return q.t<.6},end:()=>{}});
 const sp=textSprite(Math.round(val*100)+'%'+(inZ?' ✦':''),inZ?'#ffe066':'#ffffff',3.4);sp.position.set(tx,7.4,tz);add(sp);setTimeout(()=>{try{S.remove(sp)}catch(e){}},1600)}
// ================= PROVA III · PRECISÃO (alvos com trajetórias diferentes) =================
function target3(k){const L=person({top:0xffffff,pants:0xffffff,hs:0}),g=L.g;g.traverse(o=>{if(o.isMesh)o.visible=false});const tg=new T.Group();[[.75,0xf4e6c4],[.55,0xc0302a],[.35,0xf4e6c4],[.15,0xffe066]].forEach(([r,c],i)=>{const d=new T.Mesh(new T.CircleGeometry(r,24),bas(c,{side:T.DoubleSide}));d.position.z=i*.01;tg.add(d)});tg.position.y=1.7;g.add(tg);const pole=new T.Mesh(new T.CylinderGeometry(.04,.04,1,6),lam(0x5a3a1a));pole.position.y=.8;g.add(pole);
 S.add(g);const e={m:g,L,x:CX,z:CZ,hp:1,mhp:1,lv:P.lv,dm:0,cd:0,sp:0,gr:null,mc:99,name:'Alvo',dai:()=>{tg.lookAt(P.x,1.7,P.z)},qid:'ext111',noXp:1,tr:k,ph:k*1.3};enemies.push(e);EX.ens.push(e);return e}
function setup2(S5){S5.t0=0;E111.casts=0;S5.tg=[0,1,2,3,4,5].map(target3);S5.hit=0}
function tick2(S5,dt){S5.t0+=dt;const t=S5.t0;S5.tg.forEach(e=>{if(!enemies.includes(e))return;const p=e.ph,k=e.tr;let x,z;
  if(k==0){x=CX+Math.cos(t*.7+p)*10;z=CZ+Math.sin(t*.7+p)*10}else if(k==1){x=CX+Math.sin(t*.8+p)*12;z=CZ+Math.sin(2*(t*.8+p))*6}else if(k==2){x=CX+((t*4+p*5)%28<14?-12+((t*4+p*5)%14)*1.7:12-((t*4+p*5)%14)*1.7);z=CZ-6}
  else if(k==3){x=CX+Math.cos(t*1.1+p)*6;z=CZ+Math.sin(t*1.1+p)*6}else if(k==4){x=CX-8+Math.sin(t*1.6)*3;z=CZ+8+((t*3)%10)-5}else{x=CX+8+Math.sin(t*2.2)*4;z=CZ+Math.cos(t*.9)*9}
  e.x=x;e.z=z;e.m.position.set(x,Math.abs(Math.sin(t*2+p))*.6,z)});
 S5.hit=S5.tg.filter(e=>!enemies.includes(e)||e.hp<=0).length;if(S5.hit>=6||EX.t<=0){const acc=Math.min(1,S5.hit/Math.max(1,E111.casts));finish(Math.round(100*((S5.hit/6)*.7+acc*.3)),'Acertos '+S5.hit+'/6 · precisão '+Math.round(acc*100)+'%')}}
// ================= PROVA IV · CRIAÇÃO (estrutura própria de cada magia) =================
function build3(id){const g=new T.Group(),pc=[],c=col(),em=(x)=>lam(x,{emissive:x,emissiveIntensity:.35});const P3=(m,x,y,z,rx,ry,rz,s)=>{m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);if(s)m.scale.setScalar(s);m.userData.s0=m.scale.clone();m.scale.setScalar(.001);g.add(m);pc.push(m);return m};
 const O=window.O107;
 if((id=='ossos'||id=='zbunion')&&O){const bm=O.oMat?O.oMat('ivory'):lam(0xeee2cf);for(let k=0;k<8;k++){const a=k/7*Math.PI;P3(new T.Mesh(O.gLong?O.gLong(k%3):new T.CylinderGeometry(.1,.1,1,6),bm),Math.cos(a)*2.2,.6+Math.sin(a)*2.6,0,0,0,a+Math.PI/2,1.2)}for(let k=0;k<5;k++)P3(new T.Mesh(O.gRib?O.gRib(k%3):new T.TorusGeometry(.6,.06,5,12,Math.PI),bm),0,.5+k*.55,0,0,0,0,1.1-k*.08);P3(new T.Mesh(O.gSkull?O.gSkull():new T.SphereGeometry(.5,10,8),bm),0,3.4,0,0,0,0,1.4);return{g,pc,nm:'Arco Ósseo'}}
 if(id=='espacial'||id=='bzesp'){for(let k=0;k<5;k++)P3(new T.Mesh(new T.TorusGeometry(1.6-k*.22,.07,6,40),em(k%2?0x4a2a9a:0x7a4aff)),0,2.2,0,0,k*.4,0);P3(new T.Mesh(new T.CircleGeometry(1.5,32),bas(0x0a0418,{side:T.DoubleSide})),0,2.2,0);for(let k=0;k<6;k++){const a=k/6*Math.PI*2;P3(new T.Mesh(new T.OctahedronGeometry(.25),em(0xb08aff)),Math.cos(a)*2.4,2.2+Math.sin(a)*2.4,0)}return{g,pc,nm:'Portal Dimensional'}}
 if(id=='fogo'){for(let k=0;k<7;k++)P3(new T.Mesh(new T.ConeGeometry(.9-k*.1,1.2,8),em(k%2?0xff7a1a:0xffc23a)),0,.6+k*.55,0,0,k*.5,0);for(const s of[-1,1])for(let k=0;k<4;k++)P3(new T.Mesh(new T.ConeGeometry(.25,1.4-k*.2,6),em(0xff5a1a)),s*(.8+k*.45),2.6+k*.3,0,0,0,-s*(1.1+k*.15));return{g,pc,nm:'Fênix de Chamas'}}
 if(id=='agua'){P3(new T.Mesh(new T.CylinderGeometry(1.4,1.6,.4,20),lam(0x7a8a9a)),0,.2,0);for(let k=0;k<5;k++)P3(new T.Mesh(new T.TorusGeometry(.9-k*.1,.08,6,24),new T.MeshLambertMaterial({color:0x4ab0ff,transparent:true,opacity:.75})),0,.7+k*.5,0,Math.PI/2);P3(new T.Mesh(new T.SphereGeometry(.7,16,12),new T.MeshLambertMaterial({color:0x6ac8ff,transparent:true,opacity:.7})),0,3.4,0);return{g,pc,nm:'Fonte de Água'}}
 if(id=='vento'){for(let k=0;k<8;k++)P3(new T.Mesh(new T.TorusGeometry(.3+k*.18,.05,5,24),new T.MeshBasicMaterial({color:0xbfffe8,transparent:true,opacity:.6})),0,.3+k*.45,0,Math.PI/2);return{g,pc,nm:'Tornado Esculpido'}}
 if(id=='luz'){for(let k=0;k<6;k++)P3(new T.Mesh(new T.OctahedronGeometry(.5-k*.04),em(0xffe680)),Math.cos(k*1.05)*.9,.6+k*.6,Math.sin(k*1.05)*.9,0,k,0);P3(new T.Mesh(new T.ConeGeometry(.35,3.6,6),em(0xfff2b0)),0,1.8,0);return{g,pc,nm:'Espiral de Luz'}}
 // demais magias: flor cristalina na cor do grimório
 P3(new T.Mesh(new T.CylinderGeometry(.1,.14,2.2,6),em(c)),0,1.1,0);for(let k=0;k<7;k++){const a=k/7*Math.PI*2;P3(new T.Mesh(new T.OctahedronGeometry(.45),em(c)),Math.cos(a)*.7,2.4,Math.sin(a)*.7,0,0,Math.cos(a)*.6,1)}P3(new T.Mesh(new T.IcosahedronGeometry(.4),em(0xffffff)),0,2.5,0);return{g,pc,nm:'Flor Cristalina'}}
function setup3(S5){const id=P.g?P.g.id:'';const B=build3(id);B.g.position.set(CX,0,CZ-4);add(B.g);S5.B=B;S5.pr=0;S5.n=.2;S5.in=0;S5.held=0;S5.exits=0;S5.wasIn=false;const pd=new T.Mesh(new T.CylinderGeometry(2,2.3,.3,20),lam(0x9a9488));pd.position.set(CX,.15,CZ-4);add(pd);
 try{toast('Criação: '+B.nm+'. Segure a ação para empurrar a mana e mantenha o ponteiro na faixa dourada.')}catch(e){}}
function tick3(S5,dt){const near=Math.hypot(P.x-CX,P.z-(CZ-4))<6;if(!near){act(null);gauge(false);return}const t=performance.now()/1000;act('🔮 Segurar para criar');
 const z0=.42+Math.sin(t*.6)*.12*S5.pr,zone=[z0,z0+.22];S5.n+=(E111.hold?1.1:-.9)*dt;S5.n=Math.max(0,Math.min(1,S5.n));const inZ=S5.n>=zone[0]&&S5.n<=zone[1];if(E111.hold||S5.held>0)S5.held+=dt;if(inZ){S5.in+=dt;S5.pr=Math.min(1,S5.pr+dt/14)}if(S5.wasIn&&!inZ)S5.exits++;S5.wasIn=inZ;
 const pcs=S5.B.pc,shown=S5.pr*pcs.length;pcs.forEach((m,k)=>{const f=Math.max(0,Math.min(1,shown-k));const s0=m.userData.s0;m.scale.set(s0.x*Math.max(.001,f),s0.y*Math.max(.001,f),s0.z*Math.max(.001,f))});S5.B.g.rotation.y+=dt*.35;
 if(inZ&&Math.random()<dt*14)try{fxp({x:CX+(Math.random()-.5)*2,y:.5+S5.pr*3,z:CZ-4+(Math.random()-.5)*2,c:col(),n:1,sp:.6,sz:.12,life:.6,up:1})}catch(e){}
 gauge(true,zone,S5.n,S5.pr);if(S5.pr>=1||EX.t<=0){const ctl=S5.held>0?S5.in/S5.held:0,stb=Math.max(0,1-S5.exits*.07),cx=Math.min(1,pcs.length/10)*(.8+.2*Math.min(1,(P.lv||1)/40));finish(Math.round(100*(S5.pr*.4+ctl*.3+stb*.2+cx*.1)),S5.B.nm+' · '+Math.round(S5.pr*100)+'% concluída')}}
// ================= PROVA V · SEMENTE (vaso, broto, caule, folhas, botão e flor) =================
function setup4(S5){const g=new T.Group();g.position.set(CX+5,0,CZ-3);add(g);const pot=new T.Mesh(new T.CylinderGeometry(.75,.55,.8,16),lam(0xa0522d));pot.position.y=.4;g.add(pot);const rim=new T.Mesh(new T.TorusGeometry(.75,.08,6,20),lam(0x8a4220));rim.rotation.x=Math.PI/2;rim.position.y=.8;g.add(rim);const soil=new T.Mesh(new T.CircleGeometry(.7,16),lam(0x3a2414));soil.rotation.x=-Math.PI/2;soil.position.y=.78;g.add(soil);
 const seed=new T.Mesh(new T.SphereGeometry(.09,8,6),lam(0x6a4a1a));seed.scale.y=1.4;seed.position.y=.85;g.add(seed);const stem=new T.Mesh(new T.CylinderGeometry(.04,.06,1,6),lam(0x3a8a2a));stem.position.y=.8;stem.scale.y=.001;g.add(stem);const lv=[];for(let k=0;k<6;k++){const l=new T.Mesh(new T.SphereGeometry(.22,8,6),lam(0x4aa83a));l.scale.set(1,.15,.45);l.visible=false;g.add(l);lv.push(l)}
 const bud=new T.Mesh(new T.SphereGeometry(.16,10,8),lam(0x2a7a2a));bud.scale.y=1.4;bud.visible=false;g.add(bud);const pet=[];const pc=new T.Color(col()).lerp(new T.Color(0xffffff),.3).getHex();for(let k=0;k<8;k++){const p=new T.Mesh(new T.SphereGeometry(.22,8,6),lam(pc,{emissive:pc,emissiveIntensity:.25}));p.scale.set(.5,.12,1);p.visible=false;g.add(p);pet.push(p)}
 Object.assign(S5,{pl:{g,seed,stem,lv,bud,pet},gr:0,n:.2,in:0,held:0,over:0,stage:0})}
function tick4(S5,dt){const p=S5.pl,near=Math.hypot(P.x-(CX+5),P.z-(CZ-3))<5;if(!near){act(null);gauge(false);return}act('🌱 Segurar para aplicar mana');const t=performance.now()/1000;
 const zc=.5+Math.sin(t*.9)*.18,zone=[zc-.1,zc+.1];S5.n+=(E111.hold?1:-.85)*dt;S5.n=Math.max(0,Math.min(1,S5.n));if(E111.hold||S5.held>0)S5.held+=dt;
 if(S5.n>=zone[0]&&S5.n<=zone[1]){S5.in+=dt;S5.gr=Math.min(1,S5.gr+dt/16);if(Math.random()<dt*10)try{fxp({x:CX+5,y:1+S5.gr*2.4,z:CZ-3,c:0x7aff7a,n:1,sp:.5,sz:.1,life:.6,up:1})}catch(e){}}else if(S5.n>zone[1]){S5.over+=dt;S5.gr=Math.max(0,S5.gr-dt/40);p.g.rotation.z=Math.sin(t*22)*.03}else p.g.rotation.z=0;
 const gr=S5.gr,h=.2+gr*2.6;p.seed.visible=gr<.12;p.stem.scale.y=Math.max(.001,gr<.08?0:h);p.stem.position.y=.8+p.stem.scale.y/2;
 p.lv.forEach((l,k)=>{const need=.2+k*.09;l.visible=gr>need;if(l.visible){const y=.8+h*(.25+k*.12),s=k%2?1:-1;l.position.set(s*.22,y,0);l.rotation.set(0,0,s*-.5);const f=Math.min(1,(gr-need)*6);l.scale.set(f,.15*f,.45*f)}});
 p.bud.visible=gr>.72&&gr<.95;p.bud.position.y=.8+h+.1;const bl=Math.max(0,(gr-.9)*10);p.pet.forEach((q,k)=>{q.visible=gr>=.9;const a=k/8*Math.PI*2;q.position.set(Math.cos(a)*.22*bl,.8+h+.12,Math.sin(a)*.22*bl);q.rotation.set(0,-a,-.6*bl);q.scale.set(.5*Math.max(.2,bl),.12,Math.max(.2,bl))});
 const stg=gr>=.9?5:gr>.72?4:gr>.5?3:gr>.2?2:gr>.08?1:0;if(stg>S5.stage){S5.stage=stg;try{toast(['','🌱 Brotou!','🌿 Caule e folhas!','🌿 Está ficando forte!','🌷 Um botão apareceu!','🌸 A flor desabrochou!'][stg])}catch(e){}}
 gauge(true,zone,S5.n,gr);if(gr>=1||EX.t<=0){const ctl=S5.held>0?S5.in/S5.held:0;finish(Math.round(100*(gr*.6+ctl*.4)),'Estágio '+S5.stage+'/5 · controle '+Math.round(ctl*100)+'%')}}
// ================= PROVA VI · COMBATE (seleção de adversário, confirmação, contagem, área de combate, resultado) =================
const RIV=[['Lia Brasil','vento',0x88e0b0],['Otto Ferraz','fogo',0xff6a2a],['Nina Duarte','agua',0x4aa8ff],['Caio Sombra','sombra',0x5a3a8a],['Rafa Luz','luz',0xffe066],['Bia Terra','terra',0xa8783a]];
function cands(){if(EX.cands)return;EX.cands=RIV.map((r,k)=>{const o={name:r[0],line:'Boa sorte no exame!',top:r[2],pants:0x2a2a34,hs:k%4,hair:[0x2a1a10,0xc89a5a,0x1a1a1a,0x8a3a1a][k%4],skin:[0xf1c9a0,0xc89a78,0xe8c8a8][k%3],boots:1};const g=npc(o);put(g,CX-10+k*4,CZ+15);g.rotation.y=Math.PI;return{g,r,lv:Math.max(10,(P.lv||10)+((k*7)%5)-2)}})}
function candsClear(){(EX.cands||[]).forEach(c=>{try{S.remove(c.g);const i=NPCS.findIndex(p=>p.g===c.g);if(i>=0)NPCS.splice(i,1)}catch(e){}});EX.cands=null}
function setup5(S5){S5.ph='sel';act(null);showPick5(S5)}
function showPick5(S5){const c=SC.querySelector('.c');let h='<h2>COMBATE ENTRE PARTICIPANTES</h2><div class="sub">Escolha o candidato que você quer enfrentar.</div>';EX.cands.forEach((q,k)=>{h+='<div class="op" data-k="'+k+'"><i style="background:#'+q.r[2].toString(16).padStart(6,'0')+'"></i><div><b>'+q.r[0]+'</b><small>Magia: '+(GR[q.r[1]]?GR[q.r[1]].n:q.r[1])+' · Nível '+q.lv+'</small></div></div>'});h+='<div style="text-align:center"><span class="bt" data-a="ok">Desafiar</span></div>';c.innerHTML=h;SC.style.display='flex';run=false;S5.sel=null;
 c.onclick=e=>{const o=e.target.closest('.op');if(o){S5.sel=+o.dataset.k;c.querySelectorAll('.op').forEach(x=>x.classList.toggle('sel',x===o));return}const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a=='ok'){if(S5.sel==null){try{toast('Escolha um adversário.')}catch(er){}return}const q=EX.cands[S5.sel];c.innerHTML='<h2>CONFIRMAÇÃO</h2><div class="sub">'+q.r[0]+' aceita o seu desafio?</div><div style="text-align:center;font-size:40px">⏳</div>';setTimeout(()=>{c.innerHTML='<h2>DESAFIO ACEITO</h2><div class="sub">✔ '+q.r[0]+' aceitou o duelo. Os dois seguem para a área de combate.</div><div style="text-align:center"><span class="bt" data-a="go">Entrar na arena</span></div>'},1100)}
  if(a.dataset.a=='go'){SC.style.display='none';run=true;duel5(S5)}}}
function duel5(S5){const q=EX.cands[S5.sel];S5.q=q;S5.ph='cont';tele105(CX,CZ+7);setTimeout(()=>{P.f=Math.PI},420);q.g.visible=false;
 const bar=new T.Mesh(new T.CylinderGeometry(13,13,7,48,1,true),bas(0x9ad0ff,{transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false}));bar.position.set(CX,3.5,CZ);add(bar);S5.bar=bar;
 let n=3;const tk=()=>{if(!EX.on)return;if(n>0){count(String(n));try{snd('ring')}catch(e){}n--;setTimeout(tk,1000)}else{count('LUTEM!',1100);go5(S5)}};setTimeout(tk,900);EX.t=EXT105[5][3]+4}
function go5(S5){const q=S5.q;S5.ph='luta';try{snd('esboom')}catch(e){}kfx({u:(qq)=>{S5.bar.material.opacity=Math.min(.22,qq.t*.4);return qq.t<.6},end:()=>{}});
 let e=null;for(let tr=0;tr<3&&!e;tr++){try{spawn({id:'ex105',lv:q.lv,at:{x:CX,z:CZ-7,r:.6},en:{n:q.r[0],gr:[GR[q.r[1]]?q.r[1]:'fogo']}})}catch(er){console.warn('ex111 spawn',er)}e=enemies.filter(x=>x.qid==='ex105'&&!EX.ens.includes(x)).pop()||null}if(e){e.mhp=Math.round(e.mhp*2.5);e.hp=e.mhp;e.ag=1;e.name=q.r[0];EX.ens.push(e);e.noXp=1}S5.e=e;
 Object.assign(S5,{hp0:P.hp,mhp:P.mhp,tk:0,mv:0,lx:P.x,lz:P.z,hits:0,lhp:e?e.hp:0,dmgT:0,lpHP:P.hp});E111.casts=0;E111.used=new Set()}
function tick5(S5,dt){if(S5.ph!='luta'){return}const e=S5.e;S5.mv+=Math.hypot(P.x-S5.lx,P.z-S5.lz);S5.lx=P.x;S5.lz=P.z;if(e&&e.hp<S5.lhp){S5.hits++;S5.lhp=e.hp}if(P.hp<S5.lpHP)S5.dmgT+=S5.lpHP-P.hp;S5.lpHP=P.hp;
 const d=Math.hypot(P.x-CX,P.z-CZ);if(d>12.5){const a=Math.atan2(P.x-CX,P.z-CZ);P.x=CX+Math.sin(a)*12.3;P.z=CZ+Math.cos(a)*12.3;S5.bar.material.opacity=.5}else S5.bar.material.opacity+=(.18-S5.bar.material.opacity)*.1;
 if(e&&enemies.includes(e)){const de=Math.hypot(e.x-CX,e.z-CZ);if(de>12.5){const a=Math.atan2(e.x-CX,e.z-CZ);e.x=CX+Math.sin(a)*12;e.z=CZ+Math.cos(a)*12}}
 const won=!e||!enemies.includes(e)||e.hp<=0;if(won||EX.t<=0)end5(S5,won)}
function end5(S5,won,down){const acc=Math.min(1,S5.hits/Math.max(1,E111.casts)),vari=Math.min(1,E111.used.size/4),mov=Math.min(1,S5.mv/120),def=Math.max(0,1-S5.dmgT/Math.max(1,S5.mhp)),e=S5.e,dealt=e?1-Math.max(0,e.hp)/e.mhp:1;
 const sc=Math.round((won?30:dealt*18)+acc*15+vari*20+mov*15+def*20);S5.res=(won?'Vitória':down?'Derrota':'Tempo esgotado')+' · '+E111.used.size+' magias diferentes · precisão '+Math.round(acc*100)+'%';
 try{if(S5.bar)S5.bar.material.opacity=0}catch(er){}if(S5.q)S5.q.g.visible=true;count(won?'VITÓRIA':'FIM',1200);finish(sc,S5.res)}
// ================= fluxo do exame =================
function finish(sc,res){if(EX.wait)return;const i=EX.i;EX.sc[i]=Math.max(0,Math.min(100,Math.round(sc)));EX.res=EX.res||[];EX.res[i]=res||'';EX.wait=1;act(null);gauge(false);unmount();try{toast('Prova '+(i+1)+' concluída: '+EX.sc[i]+' pontos'+(res?' ('+res+')':'')+'.')}catch(e){}
 setTimeout(()=>{ex105Clear();if(EX.on)ex105Next()},2600)}
window.ex105Finish=finish;
ex105Start=function(){if(EX.on)return;const {x:X,z:Z}=PL105.col;Object.assign(EX,{on:true,i:-1,t:0,sc:[0,0,0,0,0,0],res:[],wait:1});ex105Clear();ex105Hands(null);cands();
 tele105(X,Z+12);try{P.f=Math.PI}catch(e){}setTimeout(()=>{title105('EXAME DOS CAVALEIROS MÁGICOS','Cerimônia de seleção · 6 provas · 9 capitães observando',null,3200)},500);
 setTimeout(()=>{if(EX.on)title105('REGRAS','"Cada prova vale até 100 pontos. No fim, vocês serão apresentados aos capitães. Só entra quem um capitão quiser."','Examinador Real',3600)},3900);setTimeout(()=>{if(EX.on)ex105Next()},7700)};
ex105Next=function(){EX.i++;if(EX.i>5){ex105End(false);return}const i=EX.i,T6=EXT105[i];EX.wait=1;ex105Clear();EX.st={};title105(T6[1].toUpperCase(),EXLINE105[i],T6[0],3000);
 setTimeout(()=>{if(!EX.on)return;EX.wait=0;EX.t=T6[3];[setup0,setup1,setup2,setup3,setup4,setup5][i](EX.st);try{toast('Prova '+(i+1)+'/6: '+T6[2]+'.')}catch(e){}},3200)};
const _clear=ex105Clear;ex105Clear=function(){unmount();act(null);gauge(false);return _clear.apply(this,arguments)};
ex105Tick=function(dt){if(!EX.on)return;if(Math.hypot(P.x-CX,P.z-CZ)>34&&!EX.wait){ex105End(true);return}
 for(let k=enemies.length-1;k>=0;k--){const e=enemies[k];if(EX.ens.includes(e))continue;if(Math.hypot(e.x-CX,e.z-CZ)<30&&!e.boss){try{S.remove(e.m);freeObj(e.m);if(e.lb)e.lb.remove()}catch(er){}enemies.splice(k,1)}}
 if(EX.wait||EX.i<0)return;if(!(EX.i==5&&EX.st.ph!='luta'))EX.t-=dt;const S5=EX.st;[tick0,tick1,tick2,tick3,tick4,tick5][EX.i](S5,dt)};
ex105UI=function(){const d=$('ex105');if(!EX.on||EX.i<0||EX.i>5||EX.wait||(EX.i==5&&EX.st.ph!='luta')){d.style.display='none';return}const T6=EXT105[EX.i],S5=EX.st||{};let p=0,pt='';
 if(EX.i==0){p=S5.rg?S5.k/S5.rg.length:0;pt=S5.ph=='voo'?S5.k+'/'+S5.rg.length+' anéis · altura '+(BR.y||0).toFixed(1)+' m':S5.ph=='mont'?'ative a magia':'vá até a vassoura'}else if(EX.i==1){p=(S5.tries||[]).length/3;pt=(S5.tries||[]).length+'/3 tentativas'}else if(EX.i==2){p=(S5.hit||0)/6;pt=(S5.hit||0)+'/6 alvos · '+E111.casts+' magias'}else if(EX.i==3){p=S5.pr||0;pt=Math.round(p*100)+'% criada'}else if(EX.i==4){p=S5.gr||0;pt='estágio '+(S5.stage||0)+'/5'}else{const e=S5.e;p=e?1-Math.max(0,e.hp)/e.mhp:1;pt='vs '+(S5.q?S5.q.r[0]:'')}
 d.style.display='block';d.innerHTML='<div class="h">'+T6[0]+' · '+T6[1].toUpperCase()+'</div><div class="o">'+T6[2]+' — <b>'+pt+'</b></div><div class="r"><div class="bar"><i style="width:'+Math.round(Math.max(0,Math.min(1,p))*100)+'%"></i></div><span>⏱ '+Math.max(0,Math.ceil(EX.t))+'s</span></div>'};
ex105Down=function(){if(!EX.on)return false;P.hp=Math.max(1,Math.round(P.mhp*.35));P.iv=2;try{flashRed()}catch(e){}if(!EX.wait&&EX.i>=0){const i=EX.i,S5=EX.st||{};
  if(i==5&&S5.ph=='luta'){end5(S5,false,true)}else{let sc=0;if(i==0)sc=(S5.k||0)/(S5.rg?S5.rg.length:8)*50;else if(i==1)sc=(S5.tries||[]).length?Math.max(...S5.tries)*60:0;else if(i==2)sc=(S5.hit||0)/6*60;else if(i==3)sc=(S5.pr||0)*55;else if(i==4)sc=(S5.gr||0)*55;try{toast('Você caiu! A prova terminou com '+Math.round(sc)+' pontos.')}catch(e){}finish(sc,'interrompida')}}return true};
const _end=ex105End;ex105End=function(c){candsClear();act(null);gauge(false);unmount();SC.style.display='none';return _end.apply(this,arguments)};
// ---------- resultado → apresentação aos capitães
const NM=['Voo com Vassoura','Explosão de Poder','Precisão','Criação Mágica','A Semente','Combate'];
ex105Result=function(){const sc=EX.sc,tot=sc.reduce((a,b)=>a+b,0);EX.tot=tot;const box=$('exr105'),c=box.querySelector('.c');let h='<h2>EXAME DOS CAVALEIROS MÁGICOS</h2><div class="sub">Desempenho registrado nas 6 provas</div>';NM.forEach((n,k)=>h+='<div class="row"><b>'+(k+1)+'. '+n+'<br><small style="opacity:.7;font-weight:400">'+((EX.res||[])[k]||'')+'</small></b><div class="bar"><i style="width:'+sc[k]+'%"></i></div><span>'+sc[k]+'/100</span></div>');
 h+='<div class="tot">Total: <b>'+tot+'/600</b><br>Agora você será apresentado aos capitães. Só entra quem algum capitão quiser.</div><div style="text-align:center"><span class="btn" onclick="ex105Close();ex111Present()">⚔️ Apresentação aos capitães</span></div>';c.innerHTML=h;box.style.display='flex';try{P.honra=(P.honra||0)+Math.round(tot/12);saveGame()}catch(e){}};
function interest(id){const w=CAP[id][2],sc=EX.sc;let v=0,ws=0;for(const k in w){v+=w[k]*sc[k];ws+=w[k]}v/=ws||1;let s=0;for(const ch of id+(P.nick||''))s=(s*31+ch.charCodeAt(0))%997;v+=((s%11)-5);const tot=EX.tot||0;return {v,ok:v>=62&&tot>=180}}
function capArm(c,up){try{const p=NPCS.find(q=>q.g===c.g);if(!p)return;c.pp=p;if(up&&!c.ra){const g=new T.Group(),sl=new T.Mesh(new T.CylinderGeometry(.075,.085,.62,8),new T.MeshLambertMaterial({color:p.mT?p.mT.color.getHex():0x2a2a34}));sl.position.y=.31;g.add(sl);const hd=new T.Mesh(new T.SphereGeometry(.085,8,6),p.mS||new T.MeshLambertMaterial({color:0xf1c9a0}));hd.position.y=.68;hd.scale.set(1,1.25,.7);g.add(hd);g.position.set(.27,1.42,0);g.rotation.z=-.25;c.g.add(g);c.ra=g;if(p.arms&&p.arms[1])p.arms[1][0].visible=false}
 if(!up&&c.ra){c.g.remove(c.ra);c.ra=null;if(p.arms&&p.arms[1])p.arms[1][0].visible=true}}catch(e){}}
ex105Accept=function(){return V105.SQ9.map(q=>q[0]).filter(id=>interest(id).ok)};
let PRS=null;window.PRS111=()=>PRS;
window.ex111Present=function(){const {x:X,z:Z}=PL105.col,BZ=-20;EX.present=1;tele105(X,Z+BZ+7);setTimeout(()=>{P.f=Math.PI;try{P.lock=1e9}catch(e){}},420);
 const cam2=new T.PerspectiveCamera(50,innerWidth/innerHeight,.1,800);const caps=V105.caps.slice();PRS={t:-.6,lt:0,cam:cam2,caps,i:-1,acc:[],lbl:[],phase:'pan'};
 caps.forEach((c,k)=>{const q=V105.SQ9[k],C=CAP[c.id];const sp=textSprite(C[0],'#ffe9a8',1.9);sp.position.set(0,2.65,0);c.g.add(sp);PRS.lbl.push([c.g,sp]);
  const em=new T.Mesh(new T.CircleGeometry(.1,20),new T.MeshBasicMaterial({color:q[2],side:T.DoubleSide}));const er=new T.Mesh(new T.RingGeometry(.1,.135,20),new T.MeshBasicMaterial({color:0xf0cf72,side:T.DoubleSide}));em.add(er);em.position.set(-.13,1.45,.3);c.g.add(em);PRS.lbl.push([c.g,em])});
 setTimeout(()=>{CINE105.on=true;CINE105.S=S;CINE105.cam=cam2;PR.style.display='block';document.body.classList.add('cineon')},450)};
function presTick(){if(!PRS||PRS.phase=='done')return;const P5=PRS,cam2=P5.cam,{x:X,z:Z}=PL105.col,BZ=-20;const now=performance.now()/1000;const dt=Math.min(.6,now-(P5.lt||now));P5.lt=now;P5.t+=dt;if(P5.t<0)return;cam2.aspect=innerWidth/innerHeight;cam2.updateProjectionMatrix();
 const n=P5.caps.length,PAN=1.25;
 if(P5.phase=='pan'){const k=Math.min(n-1,Math.floor(P5.t/PAN)),c=P5.caps[k],gp=c.g.getWorldPosition(new T.Vector3());const f=(P5.t%PAN)/PAN;cam2.position.set(gp.x-1.4+f*.8,gp.y+2.1,gp.z+6.6);cam2.lookAt(gp.x,gp.y+1.5,gp.z);
  if(k!=P5.i){P5.i=k;const q=V105.SQ9[k],C=CAP[c.id];PR.firstChild.innerHTML='<b>Capitão '+C[0]+'</b>'+q[1]+' — '+C[1];try{snd('ring')}catch(e){}c.g.position.y=1.8}
  if(P5.t>=n*PAN){P5.phase='eval';P5.t2=0;PR.firstChild.innerHTML='<b>Os capitães analisam o seu desempenho…</b>'+(P.nick||'Candidato')+' · '+(EX.tot||0)+'/600 pontos'}}
 else if(P5.phase=='eval'){P5.t2+=dt;cam2.position.set(X,3.8,Z+BZ+14);cam2.lookAt(X,3.1,Z+BZ-1);if(P5.t2>2.6){P5.phase='hands';P5.t3=0;P5.k=0;P5.acc=ex105Accept();PR.firstChild.innerHTML='<b>Quem quiser recrutar, levante a mão!</b>Examinador Real'}}
 else if(P5.phase=='hands'){P5.t3+=dt;cam2.position.set(X+Math.sin(P5.t3*.2)*2,3.8,Z+BZ+14);cam2.lookAt(X,3.1,Z+BZ-1);const kk=Math.floor(P5.t3/.55);while(P5.k<=kk&&P5.k<n){const c=P5.caps[P5.k];if(P5.acc.includes(c.id)){ex111Raise(c);try{snd('nasigil')}catch(e){}}P5.k++}
  if(P5.k>=n&&P5.t3>n*.55+1.2){P5.phase='done';presEnd()}}
 P5.caps.forEach(c=>{if(c.raise){c.rt=(c.rt||0)+dt;if(c.ra)c.ra.rotation.z=-.25+Math.sin(c.rt*7)*.18;c.g.position.y=1.8+Math.max(0,Math.sin(Math.min(1,c.rt*3)*Math.PI))*.25}})}
function ex111Raise(c){c.raise=1;c.rt=0;capArm(c,1);try{const gp=c.g.getWorldPosition(new T.Vector3());fxp({x:gp.x,y:gp.y+2.6,z:gp.z,c:0xf0cf72,n:14,sp:2,sz:.14,life:.8,up:2});kShock(gp.x,gp.z,1.4,0xf0cf72,.5,gp.y+.1)}catch(e){}ex105Hands(PRS.acc.filter(id=>V105.caps.find(q=>q.id==id&&q.raise)))}
function presEnd(){setTimeout(()=>{CINE105.on=false;document.body.classList.remove('cineon');PR.style.display='none';try{P.lock=0}catch(e){}const acc=PRS.acc;const c=SC.querySelector('.c');let h;
 if(!acc.length){h='<h2>NENHUMA MÃO LEVANTADA</h2><div class="sub">Nenhum capitão quis recrutar você nesta seleção. Você <b>não foi aprovado</b>.</div><p style="text-align:center">Treine, suba de nível e tente o exame de novo.</p><div style="text-align:center"><span class="bt" data-a="x">Fechar</span> <span class="bt" data-a="re">Tentar de novo</span></div>'}
 else{h='<h2>'+(acc.length>1?'ESCOLHA SEU ESQUADRÃO':'VOCÊ FOI ESCOLHIDO')+'</h2><div class="sub">'+(acc.length>1?acc.length+' capitães levantaram a mão. A escolha é sua.':'Um capitão levantou a mão por você.')+'</div><div class="cap">';
  V105.SQ9.forEach(q=>{const y=acc.includes(q[0]),C=CAP[q[0]];h+='<div class="cp '+(y?'y':'')+'"><div class="em" style="background:#'+q[2].toString(16).padStart(6,'0')+'"></div><b>'+q[1]+'</b><br><small>Cap. '+C[0]+'</small><br>'+(y?'✋ <b>quer você</b><br><span class="bt" style="padding:5px 10px;font-size:12px" data-j="'+q[0]+'">Entrar</span>':'<small style="opacity:.6">não levantou</small>')+'</div>'});h+='</div><div style="text-align:center"><span class="bt" data-a="x">Decidir depois</span></div>'}
 c.innerHTML=h;SC.style.display='flex';run=false;EX.pend=acc;c.onclick=e=>{const j=e.target.closest('[data-j]');if(j){join111(j.dataset.j);return}const a=e.target.closest('[data-a]');if(!a)return;SC.style.display='none';run=true;ex105Hands(null);PRS.caps.forEach(c=>{c.raise=0;capArm(c,0);c.g.position.y=1.8});if(a.dataset.a=='re')ex105Start()};
 PRS.lbl.forEach(([g,s])=>{try{g.remove(s)}catch(e){}});EX.present=0},900)}
// ---------- entrada no esquadrão: identificação, uniforme, insígnia, patente, sede, atividades e registro de membro
function join111(id){const q=V105.SQ9.find(x=>x[0]==id),C=CAP[id];ord105Join(id,EX.tot||0);const v=v82S();let s=0;for(const ch of (P.nick||'')+Date.now())s=(s*33+ch.charCodeAt(0))%100000;const reg={id:'CM-'+id.toUpperCase().slice(0,3)+'-'+String(s).padStart(5,'0'),t:Date.now(),sc:EX.tot||0,cap:C[0]};v.reg111=v.reg111||{};v.reg111[id]=reg;try{saveGame()}catch(e){}
 const oc='#'+q[2].toString(16).padStart(6,'0');let home='o quartel da ordem';try{home=ord105Home().n}catch(e){}
 const c=SC.querySelector('.c');c.style.setProperty('--oc',oc);c.innerHTML='<h2>BEM-VINDO AOS '+q[1].toUpperCase()+'</h2><div class="sub">Registro oficial de membro</div><div class="idc" style="--oc:'+oc+'"><div class="ins">'+q[1].split(' ').map(w=>w[0]).join('').slice(0,2)+'</div><div><b style="font-size:17px">'+(P.nick||'Cavaleiro')+'</b><br><small>Identificação</small> '+reg.id+'<br><small>Patente inicial</small> '+(rank111()||RANKS[0])+'<br><small>Capitão</small> '+C[0]+'<br><small>Ingresso</small> '+new Date(reg.t).toLocaleDateString('pt-BR')+'</div></div>'+
 '<div class="row"><b>✔ Uniforme da ordem</b><span>equipado</span></div><div class="row"><b>✔ Insígnia</b><span>no registro</span></div><div class="row"><b>✔ Acesso à sede</b><span>'+home+'</span></div><div class="row"><b>✔ Renascer no quartel</b><span>ativado</span></div><div class="row"><b>Hierarquia</b><span style="font-size:12px">'+RANKS.join(' → ')+' → Capitão</span></div><p style="font-size:12px;opacity:.75">A patente sobe com o seu nível. O registro fica salvo no seu progresso e aparece no seu Grimório.</p><div style="text-align:center"><span class="bt" data-a="x">Ir para a sede</span></div>';
 c.onclick=e=>{if(e.target.closest('[data-a]')){SC.style.display='none';run=true;PRS&&PRS.caps.forEach(c=>{c.raise=0;capArm(c,0);c.g.position.y=1.8});ex105Hands(null)}}}
window.join111=join111;
// ---------- ganchos: contagem de magias, voo da vassoura, tick da apresentação
{const _x=xCast;xCast=function(t){if(EX.on&&!EX.wait){E111.casts++;E111.used.add(t)}return _x.apply(this,arguments)}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(BR.on){P.vy=0;P.y=BR.y;pm.position.y=P.y}presTick()}catch(e){}return r}}
{const _j=jump;jump=function(){if(BR.on)return;return _j.apply(this,arguments)}}
function snd(n){try{if(n=='ring'){const A=window.AC||(window.AC=new (window.AudioContext||window.webkitAudioContext)()),o=A.createOscillator(),g=A.createGain();o.frequency.setValueAtTime(880,A.currentTime);o.frequency.exponentialRampToValueAtTime(1320,A.currentTime+.15);g.gain.setValueAtTime(.08,A.currentTime);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+.35);o.connect(g);g.connect(A.destination);o.start();o.stop(A.currentTime+.4);return}xSnd(n)}catch(e){}}
// texto do examinador atualizado (6 provas)
try{const _t=talk;talk=function(n){if(n&&n.g===V105.exam&&!EX.on&&(P.lv||1)>=EX.lv){const o=ord105();const txt='O exame tem <b>6 provas</b>: Voo com Vassoura, Explosão de Poder, Precisão, Criação Mágica, A Semente e o Combate entre Participantes. Depois você será apresentado aos <b>9 capitães</b> — só entra quem algum capitão quiser.';dlg(n.name,(o&&o.id?'Você já é de uma ordem. Pode refazer para trocar.<br><br>':'')+txt,[['Começar o exame','dlgClose();ex105Start()'],['Agora não','dlgClose()']]);return}return _t.apply(this,arguments)}}catch(e){}
})();

