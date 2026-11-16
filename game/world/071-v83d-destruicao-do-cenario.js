// ===================== V83 · DESTRUIÇÃO DO CENÁRIO (pelos pontos de Magia) + ACONTECIMENTOS DAS ESPADAS DO ASTA =====================
// Objetos que quebram: caixotes, barris, cercas, postes, carroças, pilares e muros de ruína (com dano progressivo).
// Casas, quartéis, castelo, torres e marcos do mapa são protegidos. Tudo volta ao normal sozinho depois de um tempo.
const DZ83={list:[],seq:0,out:[],lastT:0};
{let sd=919;const rr=()=>(sd=(sd*16807)%2147483647)/2147483647;const pick=(a)=>a[Math.floor(rr()*a.length)];
 const spots=[[0,0,14,34,10],[190,-60,10,24,8],[-230,-150,10,22,6],[-210,120,12,28,8],[34,-118,4,12,5],[128,-150,8,22,6],[-52,38,14,20,6],[-128,216,4,14,6],[0,-386,4,40,10],[0,-360,10,54,8]];
 const free=(x,z)=>!inWater83(x,z)&&!SOL.some(o=>o.r?Math.hypot(x-o.x,z-o.z)<o.r+1.4:Math.abs(x-o.x)<o.hx+1.4&&Math.abs(z-o.z)<o.hz+1.4)&&!NPCS.some(n=>Math.hypot(n.g.position.x-x,n.g.position.z-z)<2.5)&&Math.hypot(x,z)>6&&!nearRoad(x,z,4.4);
 let id=0;for(const [cx,cz,r0,r1,n] of spots){let k=0;for(let t=0;t<n*8&&k<n;t++){const a=rr()*6.283,d=r0+rr()*(r1-r0),x=cx+Math.cos(a)*d,z=cz+Math.sin(a)*d;if(!free(x,z))continue;const tp=pick(cx==-128||cx==-52?['wall','pillar','crate','wall']:cx==0&&cz<-300?['crate','barrel','lamp','cart']:['crate','barrel','fence','lamp','crate','cart']);dzMake(id++,tp,x,z,rr()*6.283);k++}}}
function dzMake(id,tp,x,z,ry){const g=G83(),hp={crate:60,barrel:50,fence:80,lamp:90,cart:140,pillar:420,wall:650}[tp];
 if(tp=='crate'){crate(g,0,0,1.3,0);crate(g,.6,.4,.9,.5)}else if(tp=='barrel'){barrel(g,0,0,1.2);barrel(g,.8,.3,1)}else if(tp=='fence'){fenceRow(g,-2,0,2,0)}else if(tp=='lamp'){lantern(g,0,0)}
 else if(tp=='cart'){bp(g,BX(2,.5,1.2),0x8a5a32,0,.8,0,1);for(const s of[-1,1]){const w=bp(g,CY(.45,.45,.12,10),0x5a3a22,0,.45,s*.68);w.rotation.x=1.5708}bp(g,BX(.12,.12,2.2),0x6e4a2a,1.6,.7,0)}
 else if(tp=='pillar'){bp(g,CY(.6,.7,4.5,8),0xc8c2b4,0,2.25,0,1);bp(g,BX(1.6,.4,1.6),0xb8b2a6,0,4.6,0,1)}
 else{bp(g,BX(4.6,3.2,1),0x8a8478,0,1.6,0,1);for(let k=0;k<3;k++)bp(g,BX(1,.6,1.05),0x7a746a,-1.6+k*1.6,3.5,0,1)}
 g.rotation.y=ry;g.position.set(x,0,z);g.visible=false;S.add(g);const o={id,tp,x,z,hp,mhp:hp,g,st:0,t:0,sol:null,cr:[]};if(tp=='wall'||tp=='pillar'||tp=='cart'){o.sol={x,z,r:tp=='wall'?2.4:1.1};SOL.push(o.sol)}DZ83.list.push(o);return o}
// rachaduras e estados: 0 inteiro · 1 rachado · 2 lascado · 3 quebrado (escombros)
function dzState(o,st,fx){if(o.st===st)return;o.st=st;const g=o.g;
 if(st===0){g.children.forEach(c=>c.visible=true);g.scale.set(1,1,1);g.rotation.x=g.rotation.z=0;o.cr.forEach(c=>g.remove(c));o.cr=[];if(o.rub){S.remove(o.rub);kDispose(o.rub);o.rub=null}if(o.sol){o.sol.r=o.tp=='wall'?2.4:1.1;SOLG.n=-1}return}
 if(st>=1&&o.cr.length<(st==1?4:8)){const big=o.tp=='wall'||o.tp=='pillar';for(let k=o.cr.length;k<(st==1?4:8);k++){const c=new T.Mesh(BX(big?.14:.07,big?R83(1,2):R83(.25,.55),big?1.12:.9),WB(0x1a1410));c.position.set(R83(-1.8,1.8)*(big?1:.35),R83(.5,2.7)*(big?1:.35),0);c.rotation.z=R83(-.9,.9);g.add(c);o.cr.push(c)}}
 if(st===2){g.rotation.z=R83(-.06,.06);if(o.tp=='wall'){g.children[g.children.length-o.cr.length-1].visible=false}}
 if(st===3){g.children.forEach(c=>c.visible=false);if(o.sol){o.sol.r=.01;SOLG.n=-1}const rub=G83();for(let k=0;k<(o.tp=='wall'?9:5);k++){const m=bp(rub,DO(R83(.25,.6)),o.tp=='wall'||o.tp=='pillar'?0x8a8478:0x8a5a32,R83(-1.4,1.4),.2,R83(-1,1),0);m.rotation.set(R83(0,3),R83(0,3),0)}rub.position.set(o.x,0,o.z);S.add(rub);o.rub=rub;
  if(fx&&CFG.parts){for(let k=0;k<(o.tp=='wall'?10:6);k++){const p=new T.Mesh(BX(R83(.2,.5),R83(.2,.5),R83(.2,.5)),WM(o.tp=='wall'?0x8a8478:0x9a6a3e));p.position.set(o.x,1.2,o.z);S.add(p);const vx=R83(-5,5),vz=R83(-5,5);let vy=R83(4,8);kfx({u:(f,dt)=>{vy-=18*dt;p.position.x+=vx*dt;p.position.z+=vz*dt;p.position.y=Math.max(.15,p.position.y+vy*dt);p.rotation.x+=dt*6;return f.t<1.1},end:()=>kDispose(p)})}fxp({x:o.x,y:1,z:o.z,c:0xb8a888,n:12,sp:3,sz:.4,life:.7})}}}
function dzDamage(o,d,fx){if(o.st===3)return;o.hp=Math.max(0,o.hp-d);o.t=0;const k=o.hp/o.mhp;dzState(o,k<=0?3:k<.34?2:k<.67?1:0,fx);if(o.st>0&&fx)fxp({x:o.x,y:1.2,z:o.z,c:0xd8c8a8,n:4,sp:2,sz:.2,life:.4})}
// marcas no chão de cada atributo (cratera maior com mais pontos em Magia)
const DZC={fogo:[0x1a0e08,0xff6a1a],agua:[0x2a5a8a,0x8ad8ff],vento:[0x4a7a4a,0xa8ffb8],luz:[0xd8b040,0xfff4b0],anti:[0x080608,0xff1a2a],tempo:[0x4a8aa8,0xd8f4ff],kotodama:[0x3a1a5a,0xc080ff],sangue:[0x5a0a10,0xff3a4a],sonhos:[0x8a3a7a,0xffb0e8],espacial:[0x1a2a6a,0x9ab0ff],sombra:[0x120a1a,0x8a4aff],nenhum:[0x3a3026,0xb8a888]};
const CRT83=[];
function dzCrater(x,z,r,el){if(inWater83(x,z))return;const C=DZC[el]||DZC.nenhum;const g=G83();const a=new T.Mesh(new T.CircleGeometry(r,14),new T.MeshBasicMaterial({color:C[0],transparent:true,opacity:.7,depthWrite:false}));a.rotation.x=-1.5708;a.position.y=.05;g.add(a);const b=new T.Mesh(new T.RingGeometry(r*.85,r*1.08,16),new T.MeshBasicMaterial({color:C[1],transparent:true,opacity:.45,depthWrite:false}));b.rotation.x=-1.5708;b.position.y=.055;g.add(b);
 for(let k=0;k<5;k++){const c=new T.Mesh(BX(.08,.02,r*R83(.5,1)),WB(C[0]));const an=R83(0,6.283);c.position.set(Math.cos(an)*r*.9,.06,Math.sin(an)*r*.9);c.rotation.y=-an+1.5708;g.add(c)}g.position.set(x,0,z);S.add(g);CRT83.push({g,t:0});while(CRT83.length>24){const o=CRT83.shift();S.remove(o.g);kDispose(o.g)}}
// impacto de magia: dano nos objetos por perto + cratera (só ataques fortes deixam cratera)
function dzImpact(x,z,R,el,mag,lv,fx){const mg=1+(mag||0)*.08;const d=(8+(lv||1)*1.2)*mg*Math.min(2.6,Math.max(.4,R/3));for(const o of DZ83.list){const dd=Math.hypot(o.x-x,o.z-z);if(dd<R+1.2)dzDamage(o,d*(1-dd/(R+1.6)),fx)}if(R>=2.6)dzCrater(x,z,Math.min(7,R*.45*(1+(mag||0)*.04)),el)}
{const _ks=kShock;kShock=function(x,z,R,col,dur,y){const r=_ks.apply(this,arguments);try{const now=performance.now();if(now-DZ83.castT<2800&&Math.hypot(x-P.x,z-P.z)<55&&now-DZ83.lastT>110&&R>=.9){DZ83.lastT=now;const el=v82El()||(P.g&&P.g.id)||'nenhum';dzImpact(x,z,R,el,P.st.mag,P.lv,true);DZ83.seq++;DZ83.out.push({i:DZ83.seq,x:+x.toFixed(1),z:+z.toFixed(1),R:+R.toFixed(1),e:el,m:P.st.mag,l:P.lv,t:now});DZ83.out=DZ83.out.filter(e=>now-e.t<3000).slice(-6)}}catch(e){}return r}}
{const _c=cast;cast=function(i,ph){const n=MP.castN;const r=_c.apply(this,arguments);if(MP.castN!==n)DZ83.castT=performance.now();return r}}
// multiplayer: os outros veem a mesma destruição (eventos curtos na presença)
{const _l=xLk;xLk=function(){const o=_l();if(DZ83.out.length)o.dz=DZ83.out.map(e=>[e.i,e.x,e.z,e.R,e.e,e.m,e.l]);return o}}
{const _ap=xApplyOther;xApplyOther=function(o,lk){_ap(o,lk);try{if(lk&&Array.isArray(lk.dz))for(const e of lk.dz){if(!Array.isArray(e)||e[0]<=(o.dzS||0))continue;o.dzS=e[0];if(Math.hypot(e[1]-P.x,e[2]-P.z)<120)dzImpact(+e[1],+e[2],Math.min(12,+e[3]||1),String(e[4]),Math.min(60,+e[5]||0),Math.min(50,+e[6]||1),true)}}catch(x){}}}
// restauração e visibilidade (só perto do jogador, para o celular aguentar)
{let acc=0;const _x=xUpdate;xUpdate=function(dt){_x(dt);acc+=dt;for(const c of CRT83){c.t+=dt;if(c.t>40){c.g.children.forEach(m=>{if(m.material&&m.material.transparent)m.material.opacity*=.97})}}if(acc<.4)return;const st=acc;acc=0;const lim=Math.min(CULL,110);
 for(const o of DZ83.list){const near=Math.abs(o.x-P.x)<lim&&Math.abs(o.z-P.z)<lim;o.g.visible=near;if(o.rub)o.rub.visible=near;if(o.st>0){o.t+=st;if(o.t>(o.tp=='wall'||o.tp=='pillar'?150:90)){o.hp=o.mhp;dzState(o,0)}}}
 for(let i=CRT83.length-1;i>=0;i--)if(CRT83[i].t>60){S.remove(CRT83[i].g);kDispose(CRT83[i].g);CRT83.splice(i,1)}}}

// ===================== ACONTECIMENTOS DAS ESPADAS (missões só destes acontecimentos) =====================
// Demon-Dweller: desafio na Masmorra Antiga · Demon-Destroyer: Santuário Élfico e o Eco de Licht · Demon-Slasher Katana: Capitão Yami e Dante (Spade)
function evS(){const v=v82S();v.ev=v.ev||{};return v.ev}
BOSSES.eco_licht={n:'Eco de Licht',x:-96,z:-96,lv:35,gr:'luz',lk:{top:0xf0f0f8,pants:0xd8d8e8,hs:2,hair:0xf4f4ff,coat:1,long:1,cape:0xe0e4ff,skin:0xf4e4d8,eye:0x8ad0ff,h:1.25,w:1.05},book:0xf0f0ff};
BOSSES.dante={n:'Dante (Spade)',x:150,z:-552,lv:45,gr:'sombra',lk:{top:0x2a1a2a,pants:0x1a141a,hs:1,hair:0x2a2228,cape:0x4a1020,skin:0xd8b8a0,eye:0xff2020,h:1.45,w:1.5,belt:1,boots:1},book:0x3a0a1a};
// santuário élfico (pilares brancos quebrados e altar da espada) e capitão dos Touros Negros
{const g=G83();for(let k=0;k<8;k++){const a=k/8*6.283,h=k%3==0?2:R83(3,5.5);bp(g,CY(.55,.65,h,8),0xf2f0ea,Math.cos(a)*9,h/2,Math.sin(a)*9,1)}bp(g,CY(9.5,10,.4,20),0xd8d4c8,0,.2,0,1);bp(g,BX(2.6,1.2,1.4),0xe8e4dc,0,.8,0,1);const sw=bp(g,BX(.18,2.6,.5),0x2a2a2e,0,2.6,0,1);sw.rotation.z=.08;put(g,-96,-96);sol(-96,-96,1.6);signBoard('Santuário Élfico',-84,-84,.8)}
VAR.yami83={name:'Capitão Yami',line:'Tá olhando o quê? Se quer ficar mais forte, ultrapasse seus limites aqui e agora.',top:0x1c1c1c,pants:0x2a2a2a,hs:1,hair:0x161616,skin:0xd8b090,belt:1,boots:1,cape:0x141414,w:1.32,h:1.1};
VAR.licht83={name:'Espírito de Licht',line:'Uma espada repousa aqui há séculos, esperando quem carregue a Anti-Magia.',top:0xf6f6ff,pants:0xe8e8f4,hs:2,hair:0xf4f4ff,coat:1,long:1,cape:0xe8ecff,skin:0xf4e4d8,h:1.15};
const YAMI83=npc(VAR.yami83);put(YAMI83,128,-134);const LICHT83=npc(VAR.licht83);put(LICHT83,-96,-88);try{LICHT83.traverse(o=>{if(o.material&&o.material.transparent!==undefined){o.material=o.material.clone();o.material.transparent=true;o.material.opacity=.6}})}catch(e){}
const EV83={dg:{on:false,sp:0},boss:null,bt:null};
function evAnti(){return P.g&&P.g.id=='anti'}
function evGive(k,msg){const v=v82S();v.wpn[k]=1;banner(WPN82[k].n.toUpperCase(),msg,'#ff4a4a');toast('⚔️ '+WPN82[k].n+' liberada! Equipe em Inventário > Equipamentos.');try{nkLog('arma',WPN82[k].n)}catch(e){}saveGame()}
// Masmorra Antiga: tocar no portal (Falar) inicia o desafio de 6 guardiões; no fim aparece o baú com a espada
function v83Interact(){const ev=evS();
 if(Math.hypot(P.x+128,P.z-202)<8){if(!evAnti()){toast('A energia deste portal reage só à Anti-Magia.');return true}if(P.lv<20){toast('O portal te repele. Volte no Nível 20.');return true}if(v82S().wpn.dweller){toast('A masmorra está em silêncio. A Demon-Dweller já é sua.');return true}if(EV83.dg.on){toast('Derrote os guardiões da masmorra!');return true}
  dlg('Masmorra Antiga','Runas antigas brilham quando você chega perto. <b>Guardiões da masmorra</b> despertam para testar quem carrega a Anti-Magia.',[['Enfrentar','dlgClose();evDungeon()'],['Agora não','dlgClose()']]);return true}
 if(EV83.chest&&Math.hypot(P.x-EV83.chest.position.x,P.z-EV83.chest.position.z)<3.5){S.remove(EV83.chest);kDispose(EV83.chest);EV83.chest=null;evGive('dweller','Encontrada no coração da Masmorra Antiga');return true}
 return false}
function evDungeon(){EV83.dg={on:true,sp:0,t:0};banner('DESAFIO DA MASMORRA','Derrote os 6 guardiões','#a070ff');for(let k=0;k<6;k++)setTimeout(()=>{try{spawn({id:'dg83',lv:Math.max(20,P.lv-2),at:{x:-128,z:218,r:10},en:{n:'Guardião da Masmorra',gr:['sombra','anti','tempo']}});EV83.dg.sp++}catch(e){}},k*350)}
// Licht e Yami: falam pelo botão Falar
{const _t=talk;talk=function(n){const ev=evS();
 if(n.g===LICHT83){if(!evAnti()){dlg(n.name,'Só quem carrega a Anti-Magia pode pegar esta espada.',[['Tchau','dlgClose()']]);return}const v=v82S();if(v.wpn.destroyer){dlg(n.name,'Use bem a espada que absorve magia, filho da Anti-Magia.',[['Tchau','dlgClose()']]);return}
  if(P.lv<30||!v.black){dlg(n.name,'Ainda não... Volte quando o Asta Negro tiver despertado em você (Nível 30+).',[['Tchau','dlgClose()']]);return}
  dlg(n.name,'Esta lâmina absorve magia e devolve o golpe. Prove que consegue segurá-la: derrote o meu eco.',[['Aceitar o teste','dlgClose();evLicht()'],['Agora não','dlgClose()']]);return}
 if(n.g===YAMI83){if(!evAnti()){dlg(n.name,n.line,[['Tchau','dlgClose()']]);return}const v=v82S();if(v.wpn.katana){dlg(n.name,'A katana ficou boa em você. Agora some daqui e vai treinar.',[['Tchau','dlgClose()']]);return}
  if(ev.ka==2){ev.ka=3;dlg(n.name,'Você derrubou o Dante? Hah... então fica com isso. Uma katana que corta até o que não dá pra cortar.',[['Pegar a katana','dlgClose();evGive(\'katana\',\'Presente do Capitão Yami\')']]);return}
  if(ev.ka==1){dlg(n.name,'O Dante tá lá no Reino Spade, perto do Palácio das Sombras. Vai logo.',[['Tchau','dlgClose()']]);return}
  if(P.lv<40){dlg(n.name,n.line+' (Volte no Nível 40.)',[['Tchau','dlgClose()']]);return}
  dlg(n.name,'Um tal de Dante, do Reino Spade, tá rondando o Palácio das Sombras. Derruba ele e eu te dou uma coisa.',[['Aceitar','dlgClose();evS().ka=1;saveGame();toast(\'Vá até o Palácio das Sombras, no Reino Spade.\')'],['Agora não','dlgClose()']]);return}
 return _t.apply(this,arguments)}}
function evLicht(){const b=spawnBoss('eco_licht',{x:-96,z:-104,lv:Math.max(35,P.lv)});EV83.boss=b;EV83.bt='licht';banner('ECO DE LICHT','O teste do santuário começou','#e8f0ff')}
// a cada meio segundo: verifica guardiões, chefes e se o jogador chegou perto do Dante
setInterval(()=>{try{if(!P.g)return;const ev=evS();
 if(EV83.dg.on){const alive=enemies.filter(e=>e.qid==='dg83').length;if(EV83.dg.sp>=6&&alive==0){EV83.dg.on=false;const c=G83();bp(c,BX(1.4,.9,1),0x8a5a32,0,.45,0,1);bp(c,BX(1.5,.2,1.1),0xd8b040,0,.95,0,1);c.position.set(-128,0,214);S.add(c);EV83.chest=c;banner('MASMORRA LIMPA','Um baú apareceu no centro da arena — aperte Falar perto dele','#a070ff')}
  if(Math.hypot(P.x+128,P.z-216)>60){for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(e.qid==='dg83'){S.remove(e.m);freeObj(e.m);if(e.lb)e.lb.remove();enemies.splice(i,1)}}EV83.dg.on=false;toast('Você saiu da masmorra: o desafio foi cancelado.')}}
 if(ev.ka==1&&!EV83.boss&&Math.hypot(P.x-150,P.z+552)<40){EV83.boss=spawnBoss('dante',{x:150,z:-546,lv:Math.max(45,P.lv)});EV83.bt='dante';banner('DANTE','Um dos invasores do Reino Spade apareceu','#ff3a3a')}
 if(EV83.boss){const b=EV83.boss;if(!enemies.includes(b)||b.hp<=0){const t=EV83.bt;EV83.boss=null;EV83.bt=null;if(P.hp>0&&Math.hypot(P.x-b.x,P.z-b.z)<70){if(t=='licht')evGive('destroyer','Herdada do Santuário Élfico');else if(t=='dante'){ev.ka=2;saveGame();banner('DANTE FOI DERROTADO','Volte ao Capitão Yami, no Esconderijo dos Touros Negros','#ff3a3a')}}}else if(Math.hypot(P.x-b.x,P.z-b.z)>110){S.remove(b.m);freeObj(b.m);if(b.lb)b.lb.remove();enemies.splice(enemies.indexOf(b),1);EV83.boss=null;EV83.bt=null;toast('O chefe do acontecimento sumiu (você se afastou demais). Tente de novo.')}}}catch(e){}},500);
// textos das espadas no inventário agora apontam os lugares reais
WPN82.dweller.how='Desafio da Masmorra Antiga (Nível 20+, com Anti-Magia).';WPN82.destroyer.how='Santuário Élfico, perto da Torre dos Grimórios: fale com o Espírito de Licht (Nível 30+ e Asta Negro desperto).';WPN82.katana.how='Fale com o Capitão Yami no Esconderijo dos Touros Negros (Nível 40+) e derrote Dante.';

