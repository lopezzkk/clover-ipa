// ================= V140 · OTIMIZAÇÃO COMPLETA: 5 níveis gráficos, texturas, limite de FPS, animação por distância, orçamento de efeitos, estabilidade =================
(function(){
const X=window.X124||{};
// ---------- 1 · orçamento de efeitos: com muitas magias ao mesmo tempo, cada efeito novo usa menos partículas (sem cortar a magia) ----------
const VB={f:1,n:0};window.VB140=VB;
function budget(){const n=(typeof KFX!='undefined'?KFX.length:0),p=(typeof parts!='undefined'?parts.length:0),cap=(typeof PCAP=='number'?PCAP:300)||300;VB.n=n;
 const a=n>90?.35:n>60?.5:n>35?.7:1,b=p>cap*.8?.4:p>cap*.6?.65:1;VB.f=Math.min(a,b)*(VB.auto>0?VB.auto:1)}
{const _f=fxp;fxp=function(o){if(VB.f<1&&o&&o.n>1){o=Object.assign({},o);o.n=Math.max(1,Math.round(o.n*VB.f))}else if(VB.f<.5&&Math.random()>VB.f*1.6)return;return _f.call(this,o)};window.fxp=fxp}
// ---------- 2 · animação por distância: personagens longe animam menos vezes, muito longe não animam ----------
{const _a=anim;let fr=0;anim=function(p,t,mv,air){try{if(p&&p!==PP&&p.g&&p.g.parent){const g=p.g,d=Math.abs(g.position.x-P.x)+Math.abs(g.position.z-P.z);if(d>55){const k=p._ak140=(p._ak140||0)+1;if(d>120)return;if(k%(d>85?4:2))return}}}catch(e){}return _a.apply(this,arguments)};window.anim=anim}
// ---------- 3 · qualidade das texturas e limite de FPS (Ajustes › Ajuste fino) ----------
CFG.tx140=CFG.tx140||'media';if(CFG.fps140==null)CFG.fps140=CFG.fps==30?30:60;
const seen=new WeakSet();let maxA=1;try{maxA=R.capabilities.getMaxAnisotropy()||1}catch(e){}
function texFix(t){if(!t||!t.isTexture)return;const want=CFG.tx140=='baixa'?1:CFG.tx140=='alta'?Math.min(8,maxA):Math.min(2,maxA);if(t.anisotropy!==want){t.anisotropy=want;t.needsUpdate=true}}
function texScan(){let n=0;S.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):null;if(!ms)return;for(const m of ms){if(!m||seen.has(m))continue;seen.add(m);for(const k of['map','emissiveMap','alphaMap'])if(m[k]){texFix(m[k]);n++}}});return n}
window.tx140Set=function(v){CFG.tx140=v;try{localStorage.setItem('cloverCfg',JSON.stringify(CFG))}catch(e){}S.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];ms.forEach(m=>{if(m)['map','emissiveMap','alphaMap'].forEach(k=>{if(m[k])texFix(m[k])})})});try{cfgRefresh113()}catch(e){}};
window.fps140Set=function(v){CFG.fps140=v;CFG.fps=v==30?30:60;try{localStorage.setItem('cloverCfg',JSON.stringify(CFG))}catch(e){}try{cfgRefresh113()}catch(e){}};
// limite de FPS geral (30 / 45 / 60 / sem limite): pula quadros cedo, antes de qualquer cálculo
{const _raf=window.requestAnimationFrame.bind(window);let last=0;window.__fpsGate140=function(t){const f=+CFG.fps140||0;if(!f||f>=120)return true;const min=1000/f-1.5;if(t-last<min)return false;last=t;return true}}
// ---------- 4 · teclas: magias 7, 8 e 9 no teclado (R, H, J) ----------
addEventListener('keydown',e=>{try{if(!run||CS.on||(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)))return;const m={KeyR:6,KeyH:7,KeyJ:8}[e.code];if(m!=null&&P.g&&P.g.s&&P.g.s[m]){cast(m)}}catch(_){}});
// ---------- 5 · estabilidade: memória gráfica perdida, tela preta e erros graves ----------
function overlay(msg,btns){let o=document.getElementById('st140');if(!o){o=document.createElement('div');o.id='st140';document.body.appendChild(o)}o.innerHTML='<div><b>Clover RPG</b><p>'+msg+'</p>'+btns.map((b,i)=>'<button data-i="'+i+'">'+b[0]+'</button>').join('')+'</div>';o.querySelectorAll('button').forEach(b=>b.onclick=()=>btns[+b.dataset.i][1]());o.classList.add('on')}
function lightReload(){try{saveGame()}catch(e){}try{const c=JSON.parse(localStorage.getItem('cloverCfg')||'{}');c.perf=1;c.gfx='baixo';c.ultra=0;localStorage.setItem('cloverCfg',JSON.stringify(c))}catch(e){}location.reload()}
try{const cv=R.domElement;cv.addEventListener('webglcontextlost',e=>{e.preventDefault();try{saveGame()}catch(_){}overlay('O celular ficou sem memória gráfica e pausou o jogo. Seu progresso foi salvo.',[['Continuar',()=>location.reload()],['Continuar no modo leve',lightReload]])},false);
 cv.addEventListener('webglcontextrestored',()=>{const o=document.getElementById('st140');if(o)o.classList.remove('on')},false)}catch(e){}
// vigia de tela preta: se o jogo parar de desenhar por muito tempo com a aba visível, oferece recarregar
let lastDraw=performance.now();{const _r=R.render.bind(R);R.render=function(s,c){lastDraw=performance.now();return _r(s,c)}}
setInterval(()=>{if(document.hidden)return;if(performance.now()-lastDraw>12000&&!document.getElementById('st140')?.classList.contains('on'))overlay('O jogo parou de responder. Seu progresso foi salvo.',[['Recarregar',()=>location.reload()],['Recarregar no modo leve',lightReload]])},4000);
// ---------- laço ----------
{const _u=tUpdate;let k=0;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(++k%10==0)budget();if(k%240==0)texScan()}catch(e){}return r}}
setTimeout(()=>{try{texScan()}catch(e){}},3000);
// ---------- interface: nomes dos 5 níveis e opções novas no Ajuste fino ----------
function advHTML(){const b=(on,f,t)=>'<button class="tb'+(on?' on':'')+'" onclick="'+f+'">'+t+'</button>';return '<h5 style="color:#b8ff3a;margin:10px 0 4px">TEXTURAS</h5><div class="tabs2">'+[['baixa','Baixa'],['media','Média'],['alta','Alta']].map(x=>b(CFG.tx140==x[0],"tx140Set('"+x[0]+"')",x[1])).join('')+'</div>'+
 '<h5 style="color:#b8ff3a;margin:10px 0 4px">EFEITOS AUTOMÁTICOS</h5><div class="tabs2">'+b(!CFG.auto141,'Clover.autofx.set(false)','Desligado')+b(!!CFG.auto141,'Clover.autofx.set(true)','Ligado')+'</div><p class="hint">Ligado: em lutas pesadas o jogo diminui um pouco as partículas dos efeitos para não travar e devolve quando fica fluido. O nível gráfico nunca muda sozinho.</p>'+
 '<h5 style="color:#b8ff3a;margin:10px 0 4px">LIMITE DE FPS</h5><div class="tabs2">'+[[30,'30'],[45,'45'],[60,'60'],[0,'Sem limite']].map(x=>b((+CFG.fps140||0)===x[0],'fps140Set('+x[0]+')',x[1])).join('')+'</div><p class="hint">30 FPS economiza bateria e esquenta menos o celular. "Sem limite" usa o máximo da tela.</p>'}
setInterval(()=>{try{document.querySelectorAll('#cf-b,#ov').forEach(box=>{if(!box)return;const h=[...box.querySelectorAll('h5')].find(x=>/AJUSTE FINO/.test(x.textContent));if(!h)return;const old=box.querySelector('.adv140');const sig=String(CFG.tx140)+CFG.fps140+!!CFG.auto141;if(old&&old.dataset.sig===sig)return;if(old)old.remove();const d=document.createElement('div');d.className='adv140';d.dataset.sig=sig;d.innerHTML=advHTML();h.parentNode.insertBefore(d,h)})}catch(e){}},700);
const css=document.createElement('style');css.textContent='#st140{position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;background:#0d0b14f2;color:#eee;font:15px system-ui}#st140.on{display:flex}#st140>div{max-width:340px;padding:18px;border:1px solid #d4af37;border-radius:14px;background:#17121f;text-align:center}#st140 b{color:#d4af37;font:700 20px Georgia,serif}#st140 button{display:block;width:100%;margin:8px 0 0;padding:10px;border-radius:10px;border:1px solid #d4af37;background:#3a2a05;color:#ffe9a8;font:inherit}';document.head.appendChild(css);
})();