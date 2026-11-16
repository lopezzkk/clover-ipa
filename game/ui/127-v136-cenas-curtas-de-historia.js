// ================= V136 · CENAS CURTAS DE HISTÓRIA (grimório, esquadrão, Cavaleiro Mágico) =================
// Câmera girando em volta do personagem, faixas pretas, falas que aparecem aos poucos. Toque para avançar, botão Pular.
(function(){
const X=window.X124;if(!X)return;
const SC={on:false,t:0,i:0,lines:[],done:null,a0:0};X.SC136=SC;
const flag=k=>{try{return localStorage.getItem('clv_sc136_'+k)==='1'}catch(e){return false}},setFlag=k=>{try{localStorage.setItem('clv_sc136_'+k,'1')}catch(e){}};
function ui(){let o=document.getElementById('sc136');if(o)return o;o=document.createElement('div');o.id='sc136';o.innerHTML='<div class="sct"></div><div class="scb"></div><div class="tl"></div><div class="tx"><b></b><p></p><small>toque para continuar</small></div><button class="sk">PULAR ▶▶</button>';document.body.appendChild(o);
 o.addEventListener('pointerdown',e=>{if(e.target.classList.contains('sk')){end();return}next()});return o}
function show(){const o=ui(),L=SC.lines[SC.i];if(!L){end();return}o.querySelector('.tx b').textContent=L.who||'';SC.full=L.t;SC.shown=0;o.querySelector('.tx p').textContent='';SC.lt=performance.now();if(L.fx)try{L.fx()}catch(e){}}
function next(){if(!SC.on)return;if(SC.shown<SC.full.length){SC.shown=SC.full.length;document.querySelector('#sc136 .tx p').textContent=SC.full;return}SC.i++;if(SC.i>=SC.lines.length)end();else show()}
function play(key,title,lines,done){if(SC.on)return false;SC.on=true;SC.key=key;SC.i=0;SC.lines=lines;SC.done=done;SC.t0=performance.now();SC.a0=(typeof yaw=='number'?yaw:0);const o=ui();o.querySelector('.tl').textContent=title;o.classList.add('on');document.body.classList.add('sc136on');SC.wasRun=run;run=false;show();return true}
function end(){if(!SC.on)return;SC.on=false;const o=ui();o.classList.remove('on');document.body.classList.remove('sc136on');run=true;if(SC.key)setFlag(SC.key);const d=SC.done;SC.done=null;if(d)try{d()}catch(e){}}
X.scPlay136=play;X.scEnd136=end;
// texto aparecendo + câmera girando lentamente em volta do personagem
{const _r=R.render.bind(R);R.render=function(s,c){if(SC.on&&c===cam){const t=(performance.now()-SC.t0)/1000,a=SC.a0+t*.35,d=4.2-Math.min(1.2,t*.25),y=(P.y||0);cam.position.set(P.x+Math.sin(a)*d,y+1.7+Math.sin(t*.5)*.2,P.z+Math.cos(a)*d);cam.lookAt(P.x,y+1.35,P.z);
  if(SC.shown<SC.full.length){const n=Math.min(SC.full.length,Math.floor((performance.now()-SC.lt)/28));if(n!==SC.shown){SC.shown=n;const p=document.querySelector('#sc136 .tx p');if(p)p.textContent=SC.full.slice(0,n)}}}return _r(s,c)}}
// ---------- efeitos das cenas ----------
function grimFx(){try{const col=XIC(P.g.id);for(let k=0;k<3;k++)setTimeout(()=>{kShock(P.x,P.z,2+k*1.2,col,.6,.2+k*.5)},k*250);for(let k=0;k<30;k++)fxp({x:P.x+(Math.random()-.5)*3,y:Math.random()*.3,z:P.z+(Math.random()-.5)*3,c:col,n:1,sp:.4,sz:.09,life:1.4,up:3});X.flow&&X.flow(P.x,1.2,P.z,1.2,col,1.4);MP.castN=(MP.castN||0)+1}catch(e){}}
function goldFx(){try{X.flow&&X.flow(P.x,1.2,P.z,1.5,0xffd23f,1.6);kShock(P.x,P.z,4,0xffd23f,.7,.2)}catch(e){}}
// 1) ao receber um grimório (uma vez por grimório)
{const _g=giveGrim;giveGrim=function(id){const r=_g.apply(this,arguments);try{const k='g_'+id;if(!flag(k)&&GR[id]&&id!=='nenhum'&&run&&!(window.TU121&&TU121.on)){const n=GR[id].n,l=GR[id].l||3;setTimeout(()=>play(k,'O GRIMÓRIO DESPERTA',[
  {who:'',t:'Uma luz forte sai das páginas em branco...',fx:grimFx},
  {who:'Grimório',t:'"Eu escolhi você. A magia de '+n+' agora corre na sua mana."'},
  {who:'',t:'Um trevo de '+l+' folhas aparece brilhando na capa.',fx:grimFx},
  {who:'Você',t:'Então este é o meu poder... Vou ficar mais forte e chegar ao topo do Reino!'}]),400)}}catch(e){}return r};window.giveGrim=giveGrim}
// 2) ao virar Cavaleiro Mágico (patente nova)
try{const _h=honra;honra=function(n){const a=(()=>{try{return rank()}catch(e){return''}})();const r=_h.apply(this,arguments);try{const b=rank();if(a!==b&&/Cavaleiro Mágico|Capitão/.test(b)){const k='r_'+b;if(!flag(k))setTimeout(()=>play(k,b.toUpperCase(),[
  {who:'Capitão',t:'Pelos seus feitos, o Reino de Clover reconhece o seu valor.',fx:goldFx},
  {who:'Capitão',t:'A partir de hoje você é '+b+'. Use esse manto com orgulho.'},
  {who:'Você',t:'Pode deixar! Esse é só o começo do meu caminho até Rei Mago!',fx:goldFx}]),600)}}catch(e){}return r};window.honra=honra}catch(e){}
// 3) ao entrar num esquadrão pelo exame
try{if(typeof RS!='undefined'&&RS&&RS.log){const _l=RS.log;RS.log=function(sid,t){const r=_l.apply(this,arguments);try{if(t==='entrada'){const k='sq_'+sid;if(!flag(k))setTimeout(()=>play(k,'NOVO ESQUADRÃO',[
  {who:'Líder',t:'Bem-vindo ao esquadrão! Aqui ninguém luta sozinho.',fx:goldFx},
  {who:'Líder',t:'Treine, ajude seus companheiros e traga honra para a nossa bandeira.'},
  {who:'Você',t:'Contem comigo! Vamos ser o esquadrão mais forte do Reino!'}]),800)}}catch(e){}return r}}}catch(e){}
const css=document.createElement('style');css.textContent='#sc136{position:fixed;inset:0;z-index:9999;display:none;font-family:Rajdhani,system-ui,sans-serif}#sc136.on{display:block}#sc136 .sct,#sc136 .scb{position:absolute;left:0;right:0;height:13vh;background:#000}#sc136 .sct{top:0}#sc136 .scb{bottom:0}'
 +'#sc136 .tl{position:absolute;top:13vh;left:0;right:0;text-align:center;color:#ffe9a8;font:700 clamp(16px,4vh,28px)/1.1 Cinzel,serif;letter-spacing:.12em;text-shadow:0 0 12px #000}'
 +'#sc136 .tx{position:absolute;left:50%;transform:translateX(-50%);bottom:14vh;width:min(92vw,640px);background:#0b0a10e6;border:1px solid #ffd23f66;border-radius:12px;padding:10px 14px;color:#fff}#sc136 .tx b{color:#ffd23f;font-size:15px}#sc136 .tx p{margin:4px 0;font-size:16px;min-height:2.4em}#sc136 .tx small{opacity:.55;font-size:11px}'
 +'#sc136 .sk{position:absolute;right:14px;top:calc(12vh + 8px);background:#000a;color:#fff;border:1px solid #fff6;border-radius:8px;padding:6px 10px;font:700 12px system-ui}body.sc136on>*:not(#sc136):not(canvas):not(script):not(style){visibility:hidden!important}body.sc136on #h-skills,body.sc136on .ab,body.sc136on #joy,body.sc136on #a-lkf,body.sc136on #a-tfly{visibility:hidden!important}';document.head.appendChild(css);
})();

