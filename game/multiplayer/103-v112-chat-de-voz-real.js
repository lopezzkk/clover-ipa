// ================= V112 · CHAT DE VOZ REAL (WebRTC pelo PeerJS que o multiplayer já usa) =================
// Botão de microfone, ligar/desligar voz, mudo, indicador de quem fala, volume geral e por jogador, silenciar jogador, privacidade (todos / só quem está perto / só ouvir), apertar-para-falar.
// Limites: precisa de sala online direta (P2P). Áudio vai direto entre os navegadores (sem servidor do jogo); redes muito fechadas podem bloquear (usa STUN/TURN públicos). Navegador pede permissão do microfone.
(function(){
const VC={on:false,st:null,mic:false,muted:false,ptt:false,pttHold:false,vol:.9,mode:'todos',calls:{},el:{},pv:{},lvl:0,speak:false,err:'',ac:null,an:null,silent:null};window.VC112=VC;
try{const s=JSON.parse(localStorage.getItem('cloverVoz')||'{}');Object.assign(VC,{vol:s.vol!=null?s.vol:.9,mode:s.mode||'todos',ptt:!!s.ptt,pv:s.pv||{}})}catch(e){}
const save=()=>{try{localStorage.setItem('cloverVoz',JSON.stringify({vol:VC.vol,mode:VC.mode,ptt:VC.ptt,pv:VC.pv}))}catch(e){}};
const css=`#vc112{position:relative}#vc112.on{color:#4cd964}#vc112.mu{color:#ff6a6a}#vc112.on.sp{animation:vc112p .8s infinite;border-radius:50%}
@keyframes vc112p{0%{box-shadow:0 0 0 0 rgba(76,217,100,.75)}100%{box-shadow:0 0 0 12px rgba(76,217,100,0)}}
#vc112t{position:fixed;left:50%;transform:translateX(-50%);top:calc(env(safe-area-inset-top,0px) + 74px);z-index:31;display:none;padding:10px 14px;border-radius:22px;border:2px solid #4cd964;background:rgba(20,16,30,.86);color:#d8ffe0;font:700 13px Georgia,serif;touch-action:none;user-select:none;-webkit-user-select:none}
#vc112t.h{background:rgba(40,120,60,.9)}
#vc112p{position:fixed;inset:0;z-index:58;display:none;align-items:center;justify-content:center;background:rgba(5,4,10,.6)}
#vc112p .c{width:min(94vw,460px);max-height:86vh;overflow:auto;padding:14px 16px;border-radius:16px;border:2px solid #c9a24a;background:linear-gradient(#22192e,#120e18);color:#f4e6c4;font:14px Georgia,serif}
#vc112p h3{margin:0 0 6px;color:#f0cf72;font:900 18px Cinzel,Georgia,serif}
#vc112p .r{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0}
#vc112p .vtg{min-width:52px;height:28px;border-radius:14px;border:1px solid #c9a24a;background:#2a2234;color:#f4e6c4;font-weight:700}
#vc112p .vtg.on{background:#2f8a4a;border-color:#4cd964}
#vc112p select,#vc112p input[type=range]{flex:1;max-width:58%}
#vc112p select{background:#2a2234;color:#f4e6c4;border:1px solid #c9a24a;border-radius:8px;padding:4px}
#vc112p .meter{height:8px;border-radius:5px;background:rgba(255,255,255,.1);overflow:hidden}#vc112p .meter i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4cd964,#f0cf72,#ff4a5a)}
#vc112p .pl{padding:6px 8px;margin:4px 0;border-radius:10px;background:rgba(255,255,255,.05);display:flex;align-items:center;gap:8px}#vc112p .pl b{flex:1}#vc112p .pl .sp{color:#4cd964}
#vc112p .nt{font-size:12px;opacity:.78;line-height:1.35}#vc112p .er{color:#ff8a8a;font-size:13px}
#vc112p .x{float:right;background:none;border:1px solid #c9a24a;color:#f4e6c4;border-radius:12px;padding:3px 10px}
body.cineon #vc112,body.cineon #vc112t{display:none!important}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const B=document.createElement('button');B.id='vc112';B.className='bb';B.title='Chat de voz (toque: mudo · segure: ajustes · T: falar)';B.setAttribute('aria-label','Chat de voz');B.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Zm5-3a5 5 0 0 1-10 0H5a7 7 0 0 0 6 6.9V21h2v-3.1A7 7 0 0 0 19 11h-2Z"/></svg>';{const hb=document.getElementById('b-snd');if(hb&&hb.parentElement)hb.parentElement.insertBefore(B,hb.nextSibling);else{B.style.cssText='position:fixed;right:12px;bottom:12px;z-index:31';document.body.appendChild(B)}}
const TB=document.createElement('button');TB.id='vc112t';TB.textContent='🎙️ Segure para falar';document.body.appendChild(TB);
const PN=document.createElement('div');PN.id='vc112p';PN.innerHTML='<div class="c"></div>';document.body.appendChild(PN);
// toque curto: liga/desliga o microfone (mudo) · toque no ⚙ ou toque longo: painel
let lp=0,lpT=null;B.addEventListener('pointerdown',e=>{e.preventDefault();lp=0;lpT=setTimeout(()=>{lp=1;panel(true)},520)});B.addEventListener('pointerup',e=>{clearTimeout(lpT);if(lp)return;if(!VC.on){panel(true);return}setMute(!VC.muted)});
TB.addEventListener('pointerdown',e=>{e.preventDefault();VC.pttHold=true;TB.classList.add('h')});['pointerup','pointercancel','pointerleave'].forEach(n=>TB.addEventListener(n,()=>{VC.pttHold=false;TB.classList.remove('h')}));
addEventListener('keydown',e=>{if(e.code=='KeyT'&&VC.on&&VC.ptt&&!e.repeat&&!/INPUT|TEXTAREA/.test((e.target||{}).tagName||'')){VC.pttHold=true;TB.classList.add('h')}});addEventListener('keyup',e=>{if(e.code=='KeyT'){VC.pttHold=false;TB.classList.remove('h')}});
function room(){return (typeof MP!='undefined'&&MP.r&&MP.main&&MP.net=='p2p')?MP.r:null}
function peers(){const r=room();if(!r)return[];try{return r.peers().filter(p=>!p.sameTab)}catch(e){return[]}}
function ac(){if(!VC.ac)VC.ac=new (window.AudioContext||window.webkitAudioContext)();if(VC.ac.state=='suspended')VC.ac.resume();return VC.ac}
function silentStream(){if(VC.silent)return VC.silent;const a=ac(),d=a.createMediaStreamDestination(),o=a.createOscillator(),g=a.createGain();g.gain.value=0;o.connect(g);g.connect(d);o.start();VC.silent=d.stream;return VC.silent}
async function start(){if(VC.on)return true;VC.err='';
 if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia){VC.err='Este navegador não libera o microfone aqui (precisa de HTTPS ou do app). Você ainda pode ouvir os outros.'}
 else{try{VC.st=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});VC.mic=true}catch(e){VC.err=(e&&e.name=='NotAllowedError')?'Permissão do microfone negada. Libere nas configurações do navegador/celular. Você ainda pode ouvir.':'Não achei um microfone ('+((e&&e.name)||'erro')+'). Você ainda pode ouvir.';VC.mic=false}}
 try{if(VC.st){const a=ac(),src=a.createMediaStreamSource(VC.st);VC.an=a.createAnalyser();VC.an.fftSize=512;src.connect(VC.an)}}catch(e){}
 VC.on=true;VC.muted=false;applyTrack();hook();toast(VC.mic?'🎙️ Voz ligada'+(room()?'':' — entre numa sala online para falar com outros jogadores'):'🔈 Voz ligada só para ouvir');ui();return true}
function stop(){VC.on=false;for(const k in VC.calls)hang(k);try{VC.st&&VC.st.getTracks().forEach(t=>t.stop())}catch(e){}VC.st=null;VC.mic=false;VC.an=null;VC.speak=false;ui();toast('Voz desligada')}
function setMute(m){VC.muted=m;applyTrack();ui();toast(m?'🔇 Microfone mudo':'🎙️ Microfone ligado')}
function txOn(){return VC.on&&VC.mic&&!VC.muted&&VC.mode!='ouvir'&&(!VC.ptt||VC.pttHold)}
function applyTrack(){try{if(VC.st)VC.st.getAudioTracks().forEach(t=>t.enabled=txOn())}catch(e){}}
function outStream(){return VC.st||silentStream()}
// ---------- chamadas: o jogador de id menor liga para o outro (evita chamada dupla)
let hooked=false;function hook(){if(hooked||typeof MP=='undefined'||!MP.main)return;hooked=true;MP.main.on('call',c=>{if(!VC.on){try{c.close()}catch(e){}return}if(!peers().some(p=>p.peer===c.peer)){try{c.close()}catch(e){}return}if(VC.calls[c.peer]){try{VC.calls[c.peer].close()}catch(e){}}c.answer(outStream());wire(c)})}
function wire(c){VC.calls[c.peer]=c;c.on('stream',s=>{let a=VC.el[c.peer];if(!a){a=document.createElement('audio');a.autoplay=true;a.playsInline=true;a.style.display='none';document.body.appendChild(a);VC.el[c.peer]=a}a.srcObject=s;a.play().catch(()=>{});vol(c.peer)});c.on('close',()=>drop(c.peer));c.on('error',()=>drop(c.peer))}
function drop(k){delete VC.calls[k];const a=VC.el[k];if(a){try{a.srcObject=null;a.remove()}catch(e){}delete VC.el[k]}}
function hang(k){const c=VC.calls[k];try{c&&c.close()}catch(e){}drop(k)}
function remoteOther(k){try{return MP.others[k]}catch(e){return null}}
function vol(k){const a=VC.el[k];if(!a)return;const pv=VC.pv[nameOf(k)]||{};let v=pv.m?0:VC.vol*(pv.v!=null?pv.v:1);const o=remoteOther(k);const lk=o&&o._vlk;const near=VC.mode=='perto'||(lk&&lk.vr);if(near&&o){const d=Math.hypot(o.x-P.x,o.z-P.z);v*=Math.max(0,Math.min(1,1-(d-8)/32))}a.volume=Math.max(0,Math.min(1,v))}
function nameOf(k){const p=peers().find(q=>q.peer===k);return (p&&p.presence&&p.presence.nm)||k.slice(-5)}
let acc=0;function tick(dt){if(!VC.on)return;acc+=dt;
 // nível do microfone (indicador "falando")
 if(VC.an){const b=new Uint8Array(VC.an.fftSize);VC.an.getByteTimeDomainData(b);let m=0;for(let i=0;i<b.length;i+=4)m=Math.max(m,Math.abs(b[i]-128));VC.lvl=m/128;VC.speak=txOn()&&VC.lvl>.08}else VC.speak=false;applyTrack();
 B.classList.toggle('sp',VC.speak);if(acc<.5)return;acc=0;
 const r=room();if(r&&MP.main){hook();const ps=peers(),me=MP.main.id;const want=new Set();for(const p of ps){const lk=p.presence&&p.presence.lk;if(!lk||!lk.vc)continue;want.add(p.peer);if(!VC.calls[p.peer]&&me<p.peer){try{const c=MP.main.call(p.peer,outStream());if(c)wire(c)}catch(e){}}}for(const k in VC.calls)if(!want.has(k))hang(k)}else{for(const k in VC.calls)hang(k)}
 for(const k in VC.el)vol(k);if(PN.style.display=='flex')panel(false,true)}
// ---------- indicador de quem fala em cima da cabeça dos outros jogadores
function bubTex(){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(20,60,30,.9)';x.beginPath();x.arc(32,32,28,0,6.283);x.fill();x.strokeStyle='#4cd964';x.lineWidth=4;x.stroke();x.fillStyle='#d8ffe0';x.fillRect(18,26,8,12);x.beginPath();x.moveTo(26,26);x.lineTo(36,17);x.lineTo(36,47);x.lineTo(26,38);x.fill();x.strokeStyle='#d8ffe0';x.lineWidth=3;x.beginPath();x.arc(36,32,8,-.9,.9);x.stroke();x.beginPath();x.arc(36,32,14,-.9,.9);x.stroke();return new T.CanvasTexture(c)}
let BT=null;{const _a=xApplyOther;xApplyOther=function(o,lk){const r=_a.apply(this,arguments);try{o._vlk=lk&&lk.vx||null;const on=!!(lk&&lk.vx&&lk.vx.s);if(on&&!o._vs){BT=BT||bubTex();o._vs=new T.Sprite(new T.SpriteMaterial({map:BT,depthTest:false}));o._vs.scale.set(.45,.45,1);o._vs.position.y=2.75;o.g.add(o._vs)}if(o._vs)o._vs.visible=on}catch(e){}return r}}
// presença: avisa que a voz está ligada (vc), quem fala (s) e se pede proximidade (vr)
{const _l=xLk;xLk=function(){const o=_l.apply(this,arguments);try{if(VC.on)o.vx={s:VC.speak?1:0,vr:VC.mode=='perto'?1:0};o.vc=VC.on?1:0}catch(e){}return o}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{tick(dt||0)}catch(e){}return r}}
// ---------- interface
function ui(){B.classList.toggle('on',VC.on&&!VC.muted&&VC.mic&&VC.mode!='ouvir');B.classList.toggle('mu',VC.on&&(VC.muted||!VC.mic||VC.mode=='ouvir'));TB.style.display=VC.on&&VC.ptt&&VC.mic?'block':'none'}
function panel(open,soft){if(open){PN.style.display='flex'}const c=PN.querySelector('.c');const r=room(),ps=peers();const net=typeof MP=='undefined'?'':MP.net;
 if(soft&&PN.contains(document.activeElement)&&document.activeElement.tagName!='BUTTON'){const m=c.querySelector('.meter i');if(m)m.style.width=Math.round(Math.min(1,VC.lvl*2.5)*100)+'%';return}
 let h='<button class="x" data-a="close">✕</button><h3>🎙️ Chat de voz</h3>';
 h+='<div class="r"><span>Voz</span><button class="vtg'+(VC.on?' on':'')+'" data-a="on">'+(VC.on?'Ligada':'Desligada')+'</button></div>';
 if(VC.err)h+='<p class="er">'+VC.err+'</p>';
 h+='<div class="r"><span>Microfone</span><button class="vtg'+(VC.on&&!VC.muted&&VC.mic?' on':'')+'" data-a="mute"'+(VC.on&&VC.mic?'':' disabled')+'>'+(VC.muted?'Mudo':'Aberto')+'</button></div>';
 h+='<div class="r"><span>Seu nível '+(VC.speak?'<b style="color:#4cd964">· falando</b>':'')+'</span><div class="meter" style="flex:1;max-width:58%"><i style="width:'+Math.round(Math.min(1,VC.lvl*2.5)*100)+'%"></i></div></div>';
 h+='<div class="r"><span>Apertar para falar (T)</span><button class="vtg'+(VC.ptt?' on':'')+'" data-a="ptt">'+(VC.ptt?'Sim':'Não')+'</button></div>';
 h+='<div class="r"><span>Volume geral</span><input type="range" min="0" max="1" step="0.05" value="'+VC.vol+'" data-a="vol"></div>';
 h+='<div class="r"><span>Privacidade</span><select data-a="mode"><option value="todos"'+(VC.mode=='todos'?' selected':'')+'>Todos da sala me ouvem</option><option value="perto"'+(VC.mode=='perto'?' selected':'')+'>Só quem está perto (até 40 m)</option><option value="ouvir"'+(VC.mode=='ouvir'?' selected':'')+'>Ninguém — só quero ouvir</option></select></div>';
 h+='<h3 style="font-size:15px;margin-top:10px">Jogadores na sala</h3>';
 if(!r)h+='<p class="nt">'+(net=='claude'?'Você está na rede “salas do Claude”, que não transmite áudio. A voz funciona na rede online direta (P2P).':'Entre ou crie uma sala no Multiplayer para conversar por voz com quem estiver nela.')+'</p>';
 else if(!ps.length)h+='<p class="nt">Ninguém mais na sala ainda.</p>';
 else ps.forEach(p=>{const nm=(p.presence&&p.presence.nm)||'Jogador',lk=p.presence&&p.presence.lk||{},pv=VC.pv[nm]||{},con=!!VC.calls[p.peer],spk=lk.vx&&lk.vx.s;h+='<div class="pl"><b>'+String(nm).replace(/[<>&]/g,'')+(spk?' <span class="sp">🔊</span>':'')+'<br><small style="opacity:.7;font-weight:400">'+(lk.vc?(con?'conectado por voz':'conectando…'):'voz desligada')+'</small></b><input type="range" min="0" max="1.5" step="0.1" value="'+(pv.v!=null?pv.v:1)+'" data-pv="'+encodeURIComponent(nm)+'" style="width:80px"><button class="vtg'+(pv.m?'':' on')+'" data-pm="'+encodeURIComponent(nm)+'">'+(pv.m?'🔇':'🔊')+'</button></div>'});
 h+='<p class="nt">Como funciona: o áudio vai direto entre os aparelhos pela mesma conexão do multiplayer (WebRTC), sem servidor do jogo gravando nada. O navegador sempre pede permissão do microfone. Em redes muito fechadas (alguns Wi-Fi de escola/empresa) a voz pode não conectar. Funciona no celular e no computador; no iPhone, use o Safari ou o app instalado.</p>';
 c.innerHTML=h}
PN.addEventListener('click',async e=>{const a=e.target.closest('[data-a]'),pm=e.target.closest('[data-pm]');if(e.target===PN){PN.style.display='none';return}
 if(pm){const n=decodeURIComponent(pm.dataset.pm);VC.pv[n]=VC.pv[n]||{};VC.pv[n].m=!VC.pv[n].m;save();panel(false);return}if(!a)return;const k=a.dataset.a;
 if(k=='close'){PN.style.display='none';return}if(k=='on'){if(VC.on)stop();else await start();panel(false)}else if(k=='mute'){setMute(!VC.muted);panel(false)}else if(k=='ptt'){VC.ptt=!VC.ptt;save();ui();panel(false)}});
PN.addEventListener('input',e=>{const t=e.target;if(t.dataset.a=='vol'){VC.vol=+t.value;save()}else if(t.dataset.pv){const n=decodeURIComponent(t.dataset.pv);VC.pv[n]=VC.pv[n]||{};VC.pv[n].v=+t.value;save()}});
PN.addEventListener('change',e=>{const t=e.target;if(t.dataset.a=='mode'){VC.mode=t.value;save();ui();applyTrack()}});
// só aparece dentro do jogo
setInterval(()=>{try{const show=typeof run!='undefined'&&P&&P.g&&!(typeof MENU!='undefined'&&MENU.on);if(!show)TB.style.display='none';else ui()}catch(e){}},700);
VC.start=start;VC.stop=stop;VC.panel=panel;
})();

