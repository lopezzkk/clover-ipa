// ================= V121 · COMBATE COM MAIS IMPACTO E CLAREZA + PRIMEIROS PASSOS (começo guiado) =================
// Nada antigo é removido: os golpes ganham reação (recuo, faísca, som, tremor), os inimigos corpo a corpo avisam antes de bater (dá para desviar),
// aparece um contador de acertos, um aviso de vida baixa e um guia curto para quem está começando. As missões não são alteradas.
(function(){
const CB={n:0,sum:0,t:0,ls:0,lp:0,lk:0};window.CB121=CB;
const css=`#cb121{position:fixed;right:calc(env(safe-area-inset-right,0px) + 14px);top:38%;z-index:28;display:none;text-align:right;pointer-events:none;color:#ffe9a8;font:800 13px Georgia,serif;text-shadow:0 2px 4px #000,0 0 10px rgba(255,180,60,.5)}
#cb121 b{display:block;font-size:30px;line-height:1;color:#ffd23f}#cb121 small{display:block;font-size:11px;color:#fff;opacity:.85}#cb121.pop b{animation:cb121 .18s ease-out}@keyframes cb121{0%{transform:scale(1.5)}100%{transform:scale(1)}}
#lh121{position:fixed;inset:0;z-index:20;pointer-events:none;opacity:0;transition:opacity .4s;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(200,10,20,.55) 100%)}#lh121.on{opacity:1;animation:lh121 1.1s ease-in-out infinite}@keyframes lh121{0%,100%{opacity:.55}50%{opacity:1}}
.dn.wn{color:#ff3a3a;font-size:26px}.dn.big{font-size:21px}
#tu121{position:fixed;left:calc(env(safe-area-inset-left,0px) + 10px);top:calc(env(safe-area-inset-top,0px) + 136px);z-index:30;display:none;width:min(46vw,250px);padding:8px 12px 9px;border-radius:12px;background:linear-gradient(rgba(20,26,48,.94),rgba(10,12,26,.94));border:1px solid #d4af37;box-shadow:0 4px 18px rgba(0,0,0,.5);color:#f4e6c4;font:600 13px Georgia,serif;pointer-events:none}
#tu121 .h{display:flex;justify-content:space-between;align-items:center;font-size:10.5px;letter-spacing:.08em;color:#d4af37;margin-bottom:3px}#tu121 .h button{pointer-events:auto;background:none;border:1px solid rgba(255,255,255,.3);color:#ddd;border-radius:8px;font:600 10.5px Georgia,serif;padding:2px 8px}
#tu121 .t{font-size:13.5px;line-height:1.3}#tu121 .d{margin-top:4px;font-size:11.5px;color:#9fe870;display:flex;align-items:center;gap:6px;min-height:14px}#tu121 .d i{display:inline-block;font-style:normal;font-size:16px;transition:transform .15s}
#tu121 .p{height:4px;margin-top:6px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden}#tu121 .p i{display:block;height:100%;background:#d4af37;transition:width .3s}
.tu121p{animation:tu121p 1s ease-in-out infinite!important;position:relative;z-index:31}@keyframes tu121p{0%,100%{box-shadow:0 0 0 0 rgba(255,210,63,.95)}50%{box-shadow:0 0 0 9px rgba(255,210,63,0)}}
body.cineon #tu121,body.ovon #tu121,body.inmenu #tu121,body.cineon #cb121,body.ovon #cb121{display:none!important}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const mkEl=(id,html)=>{const d=document.createElement('div');d.id=id;d.innerHTML=html||'';document.body.appendChild(d);return d};
const CE=mkEl('cb121','<b></b><span></span><small></small>'),LH=mkEl('lh121');
// ---------- som de impacto (gerado, sem arquivo)
let AC=null;function thud(kind){try{if(CFG.snd===0)return;AC=AC||(typeof KAC!='undefined'&&KAC)||window.KAC||new (window.AudioContext||window.webkitAudioContext)();if(AC.state=='suspended')return;const t=AC.currentTime,g=AC.createGain();g.connect(AC.destination);const o=AC.createOscillator();o.connect(g);
 if(kind=='kill'){o.type='triangle';o.frequency.setValueAtTime(520,t);o.frequency.exponentialRampToValueAtTime(1040,t+.09);g.gain.setValueAtTime(.09,t);g.gain.exponentialRampToValueAtTime(.001,t+.16);o.start(t);o.stop(t+.17)}
 else if(kind=='warn'){o.type='square';o.frequency.setValueAtTime(880,t);g.gain.setValueAtTime(.035,t);g.gain.exponentialRampToValueAtTime(.001,t+.09);o.start(t);o.stop(t+.1)}
 else{o.type='sine';o.frequency.setValueAtTime(kind=='crit'?210:150,t);o.frequency.exponentialRampToValueAtTime(48,t+.09);g.gain.setValueAtTime(kind=='crit'?.2:.13,t);g.gain.exponentialRampToValueAtTime(.001,t+.12);o.start(t);o.stop(t+.13)}}catch(e){}}
// ---------- reação ao golpe
function feel(e,dealt){if(!(dealt>0))return;const now=performance.now(),ratio=Math.min(1,dealt/Math.max(1,e.mhp)),dead=e.hp<=0;TU.hit=1;
 if(!e.boss&&!e.dummy&&!e.rb&&!e.dboss&&!e.dai&&!(e.kbt>0)){const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz)||1,s=2.2+Math.min(4.5,ratio*14);e.kbx=dx/d*s;e.kbz=dz/d*s;e.kbt=.16}
 if(!e.boss&&!e.dummy&&!e.dai){e.cd=Math.max(e.cd||0,.3);if(ratio>.15)e.wx121=1}
 if(now-CB.ls>70){CB.ls=now;thud(dead?'kill':ratio>.3?'crit':'hit');P.shake=Math.max(P.shake||0,Math.min(.2,.04+ratio*.5))}
 if(now-CB.lp>90&&CFG.parts){CB.lp=now;try{fxp({x:e.x,y:1.3,z:e.z,c:0xffffff,n:dead?8:4,sp:dead?5:3.2,sz:.12,life:.25})}catch(x){}}
 CB.n++;CB.sum+=dealt;CB.t=2.6;if(CB.n>=2){CE.style.display='block';CE.firstChild.textContent=CB.n;CE.children[1].textContent=' ACERTOS';CE.lastChild.textContent=Math.round(CB.sum)+' de dano';CE.classList.remove('pop');void CE.offsetWidth;CE.classList.add('pop')}}
{const _h=hitE;hitE=function(e,d,ef){const hp0=e.hp;const r=_h.apply(this,arguments);try{feel(e,hp0-e.hp)}catch(x){}return r}}
// números de dano: um pouco espalhados (não ficam um em cima do outro) e maiores nos golpes fortes
{const _d=dmgNum;dmgNum=function(x,y,z,v,cr,cls){if(typeof v=='number'&&!cls){x+=(Math.random()-.5)*.7;y+=(Math.random()-.5)*.35;if(v>=60&&!cr)cls='big'}return _d.call(this,x,y,z,v,cr,cls)}}
// ---------- aviso de ataque corpo a corpo: o inimigo levanta os braços, um anel vermelho fecha no chão e só então o golpe sai (dá para sair de perto)
let RG=null,RM=null;
CB.wind=function(e){if(e.wu121)return;e.wu121=1;e.wx121=0;e.st=Math.max(e.st||0,.42);try{if(e.L&&e.L.arms&&e.L.arms[0]&&e.L.arms[1]&&e.L.arms[0][0]&&e.L.arms[1][0])e.cast=.5}catch(x){}
 RG=RG||(()=>{const g=new T.RingGeometry(1.25,1.5,20);g.rotateX(-Math.PI/2);g._keep=1;return g})();RM=RM||(()=>{const m=new T.MeshBasicMaterial({color:0xff2a2a,transparent:true,opacity:.75,depthWrite:false,side:T.DoubleSide});m._keep=1;return m})();
 const ring=new T.Mesh(RG,RM);ring.position.set(e.x,.07,e.z);S.add(ring);try{dmgNum(e.x,3.1,e.z,'!',0,'wn')}catch(x){}thud('warn');const D=.45;let done=false;
 const fin=()=>{if(done)return;done=true;S.remove(ring);e.wu121=0;try{if(e.hp>0&&!(e.st>.12)&&!(e.slh>0)&&!e.wx121&&enemies.indexOf(e)>=0&&run){if(Math.hypot(P.x-e.x,P.z-e.z)<2.2)hurt(8*(e.dm||1)*(e.scf||1));else dmgNum(P.x,2.5,P.z,'Desviou!',0,'xp')}}catch(x){}};
 try{kfx({u:q=>{ring.position.set(e.x,.07,e.z);ring.scale.setScalar(1.25-Math.min(1,q.t/D)*.6);return q.t<D&&e.hp>0},end:fin})}catch(x){fin()}setTimeout(fin,1500)};
// ================= PRIMEIROS PASSOS =================
const TU={i:0,on:false,done:false,mv:0,lx:null,lz:null,acc:0};window.TU121=TU;
try{TU.done=localStorage.getItem('clv_tu121')=='1'}catch(e){}
const TE=mkEl('tu121','<div class="h"><span></span><button>Pular</button></div><div class="t"></div><div class="d"><i>⬆</i><span></span></div><div class="p"><i></i></div>');
TE.querySelector('button').addEventListener('pointerdown',ev=>{ev.preventDefault();finish(false)});
const isLk=()=>{try{return locked()}catch(e){return false}};
const STEPS=[
 {t:()=>'Use o controle da esquerda para andar pela vila.',hl:'joy',ok:()=>TU.mv>6},
 {t:()=>'Chegue perto de um Boneco de Treino e aperte ⚔️ Atacar.',hl:'a-atk',dummy:1,ok:()=>TU.hit},
 {t:()=>'Aperte 📖 Grimório para abrir o seu grimório.',hl:'a-grim',ok:()=>P.on||isLk()},
 {t:()=>isLk()?'Use um golpe: toque no botão 1.':'Agora use uma magia: toque no botão 1.',hl:'sk0',ok:()=>TU.cast},
 {t:()=>'Chegue perto de um morador e aperte 💬 Falar. Os moradores com ◆ dourado dão missões.',hl:'a-talk',ok:()=>TU.talk},
 {t:()=>'Abra o MENU: lá ficam Missões, Grimório, Esquadrão e Configurações.',hl:'qm-btn',ok:()=>TU.menu}];
let hlEl=null;function hl(id){const e=id?document.getElementById(id):null;if(e===hlEl)return;if(hlEl)hlEl.classList.remove('tu121p');hlEl=e;if(e)e.classList.add('tu121p')}
function finish(reward){TU.on=false;TU.done=true;hl(null);TE.style.display='none';try{localStorage.setItem('clv_tu121','1')}catch(e){}if(reward){try{P.coins+=150;banner('PRIMEIROS PASSOS CONCLUÍDOS','+150 moedas · boa sorte, mago!','#ffd23f');thud('kill');saveGame()}catch(e){}}}
TU.restart=function(){TU.done=false;TU.on=false;TU.i=0;TU.mv=0;TU.hit=TU.cast=TU.talk=TU.menu=0;try{localStorage.removeItem('clv_tu121')}catch(e){}};
function show(){const s=STEPS[TU.i];TE.style.display='block';try{const q=document.getElementById('h-quest'),r=q&&q.getBoundingClientRect();if(r&&r.height>0){TE.style.top=Math.round(r.bottom+6)+'px';TE.style.left=Math.round(r.left)+'px'}}catch(e){}TE.querySelector('.h span').textContent='PRIMEIROS PASSOS · '+(TU.i+1)+' de '+STEPS.length;TE.querySelector('.t').textContent=s.t();TE.querySelector('.p i').style.width=(TU.i/STEPS.length*100)+'%';hl(s.hl);TE.querySelector('.d').style.visibility=s.dummy?'visible':'hidden'}
const _v=new T.Vector3();
function guide(){let best=null,bd=1e9;for(const e of enemies){if(!e.dummy||e.hp<=0)continue;const d=Math.hypot(e.x-P.x,e.z-P.z);if(d<bd){bd=d;best=e}}const D=TE.querySelector('.d');if(!best){D.lastChild.textContent='Os bonecos ficam na Arena de Treino da Vila Hage.';D.firstChild.style.visibility='hidden';return}
 cam.getWorldDirection(_v);const fx=_v.x,fz=_v.z,vx=best.x-P.x,vz=best.z-P.z,ang=Math.atan2(fx*vz-fz*vx,fx*vx+fz*vz);D.firstChild.style.visibility='visible';D.firstChild.style.transform='rotate('+(ang*180/Math.PI).toFixed(0)+'deg)';D.lastChild.textContent='Boneco de Treino a '+Math.round(bd)+' m';}
// ganchos leves para saber o que o jogador já fez
{const _c=cast;cast=function(i,ph){let a=0;try{a=P.mp+((ph?P.cd2:P.cd)||[]).reduce((s,v)=>s-(v>0?1:0),0)}catch(e){}const r=_c.apply(this,arguments);try{const b=P.mp+((ph?P.cd2:P.cd)||[]).reduce((s,v)=>s-(v>0?1:0),0);if(b<a)TU.cast=1}catch(e){}return r}}
{const _t=talk;talk=function(n){TU.talk=1;return _t.apply(this,arguments)}}
{const _q=qmToggle;qmToggle=function(){TU.menu=1;return _q.apply(this,arguments)}}
{const _o=openMenu;openMenu=function(){if(TU.on)TU.menu=1;return _o.apply(this,arguments)}}
// ---------- laço: combo, vida baixa e guia
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{dt=dt||0;
 if(CB.t>0){CB.t-=dt;if(CB.t<=0){CB.n=0;CB.sum=0;CE.style.display='none'}}
 if(TU.on&&TU.lx!=null)TU.mv+=Math.hypot(P.x-TU.lx,P.z-TU.lz);TU.lx=P.x;TU.lz=P.z;
 TU.acc+=dt;if(TU.acc>.2){TU.acc=0;const low=run&&P.hp>0&&P.hp<P.mhp*.25&&!(P.dead>0);if(low!==CB.low){CB.low=low;LH.classList.toggle('on',low)}
  if(!TU.done){const can=run&&P.g&&!CS.on&&!ENC.on;if(!TU.on&&can&&P.lv<=3&&!(window.EX105&&EX105.on)){TU.on=true;TU.i=0;TU.mv=0;TU.hit=TU.cast=TU.talk=TU.menu=0;show()}
   if(TU.on){if(!can){TE.style.display='none'}else{if(TE.style.display=='none')show();const s=STEPS[TU.i];if(s.dummy)guide();let ok=false;try{ok=!!s.ok()}catch(e){}if(ok){TU.i++;try{thud('kill')}catch(e){}if(TU.i>=STEPS.length)finish(true);else show()}}}}}
}catch(e){}return r}}
})();

