// ================= ETAPA 2 · TECLAS CONFIGURÁVEIS NO PC (todas as ações, não só as magias) =================
// Camada de tradução: o jogador escolhe a tecla de cada ação; esta camada recebe a tecla física e
// repassa para o jogo como se fosse a tecla padrão. Assim nenhum sistema antigo precisa mudar.
// As magias 1–6 e os golpes físicos continuam no remapeamento antigo (KB); as duas listas não deixam repetir tecla.
(function(){
const ACT=[
 ['up','KeyW','Andar para frente'],['left','KeyA','Andar para a esquerda'],['down','KeyS','Andar para trás'],['right','KeyD','Andar para a direita'],
 ['jump','Space','Pular'],['dodge','KeyC','Esquivar'],['punch','KeyF','Soco'],['run','ControlLeft','Correr'],['lock','ShiftLeft','Shiftlock (câmera presa)'],
 ['interact','KeyE','Interagir / conversar'],['menu','KeyI','Abrir o menu'],['grim','KeyG','Grimório'],['shop','KeyB','Loja'],
 ['sword','KeyQ','Espada'],['union','KeyU','União demoníaca'],['trans','KeyY','Transformação'],
 ['sk7','KeyR','Magia 7'],['sk8','KeyH','Magia 8'],['sk9','KeyJ','Magia 9'],
 ['fly','KeyL','Voo do Tempo'],['forms','KeyK','Formas do Luck'],['ptt','KeyT','Falar no chat de voz (segurar)']
];
const DEF=Object.fromEntries(ACT.map(a=>[a[0],a[1]]));
const W={wait:null};window.KEYS141=W;
const cfg=()=>(CFG.keys141&&typeof CFG.keys141=='object')?CFG.keys141:{};
const keyOf=id=>cfg()[id]||DEF[id];
function save(){try{localStorage.setItem('cloverCfg',JSON.stringify(CFG))}catch(e){}}
// tecla física → tecla padrão que o jogo entende ('' = tecla padrão que ficou sem ação e é ignorada)
function table(){const t={};for(const a of ACT){const k=keyOf(a[0]);if(k!==a[1])t[k]=a[1]}
 for(const a of ACT){const k=a[1];if(!(k in t)&&!ACT.some(b=>keyOf(b[0])===k))t[k]=''}return t}
let TBL=table();
const typing=e=>{const el=e.target;return el&&/INPUT|TEXTAREA|SELECT/.test(el.tagName)};
function relay(e,type){
 if(typing(e)||e.__k141)return;
 if(W.wait){if(type==='keydown'){e.preventDefault();e.stopImmediatePropagation();if(e.code==='Escape'){W.wait=null}else setKey(W.wait,e.code);rerender()}else{e.stopImmediatePropagation()}return}
 if(typeof KBC!='undefined'&&KBC.wait)return;
 if(!(e.code in TBL))return;
 const to=TBL[e.code];e.stopImmediatePropagation();if(to)e.preventDefault();
 if(!to)return;
 const ev=new KeyboardEvent(type,{code:to,key:to==='Space'?' ':to.replace(/^Key/,'').toLowerCase(),repeat:e.repeat,bubbles:true,cancelable:true,shiftKey:e.shiftKey,ctrlKey:e.ctrlKey,altKey:e.altKey});
 ev.__k141=1;(e.target&&e.target.dispatchEvent?e.target:window).dispatchEvent(ev);
}
addEventListener('keydown',e=>relay(e,'keydown'),true);
addEventListener('keyup',e=>relay(e,'keyup'),true);
// a tecla escolhida sai de qualquer outra ação (inclusive das magias 1–6 e golpes, que usam a lista antiga)
const RES=['Escape','Tab','Enter','Mouse0','Mouse2','MetaLeft','MetaRight'];
function setKey(id,code){
 if(RES.includes(code)){try{toast('Essa tecla é reservada.')}catch(e){}W.wait=null;return}
 const c=Object.assign({},cfg());
 for(const a of ACT)if(a[0]!==id&&keyOf(a[0])===code)c[a[0]]='_none';
 try{const k=KB(),kb={s:k.s.slice(),p:k.p.slice()};let ch=false;for(const l of[kb.s,kb.p]){const j=l.indexOf(code);if(j>=0){l[j]='';ch=true}}if(ch)CFG.kb=kb}catch(e){}
 c[id]=code;CFG.keys141=c;W.wait=null;TBL=table();save();
}
window.keys141Wait=id=>{W.wait=id;rerender()};
window.keys141Reset=()=>{delete CFG.keys141;W.wait=null;TBL=table();save();rerender()};
window.keys141Name=c=>!c||c==='_none'?'—':(typeof kbName=='function'?kbName(c):c);
// o remapeamento antigo das magias também não pode pegar uma tecla que já é de uma ação
{const _s=kbSet;kbSet=function(code){const w=KBC.wait;const r=_s.apply(this,arguments);try{if(w&&CFG.kb){const c=Object.assign({},cfg());let ch=false;for(const a of ACT)if(keyOf(a[0])===code){c[a[0]]='_none';ch=true}if(ch){CFG.keys141=c;TBL=table();save();rerender()}}}catch(e){}return r};window.kbSet=kbSet}
{const _r=kbReset;kbReset=function(){delete CFG.keys141;TBL=table();return _r.apply(this,arguments)};window.kbReset=kbReset}
function html(){
 return '<h4 class="k141h">Outras ações</h4>'+ACT.map(a=>{const w=W.wait===a[0];return '<button class="kbr'+(w?' w':'')+'" onclick="keys141Wait(\''+a[0]+'\')"><span>'+a[2]+'</span><b>'+(w?'aperte...':keys141Name(keyOf(a[0])))+'</b></button>'}).join('')
}
function rerender(){try{const el=$('kbui');if(el&&el.classList.contains('on'))kbRender()}catch(e){}}
{const _k=kbRender;kbRender=function(){const r=_k.apply(this,arguments);try{const el=$('kbui');const row=el&&el.querySelector('.kbb .row');if(row){const d=document.createElement('div');d.className='k141';d.innerHTML=html();row.parentNode.insertBefore(d,row)}
 const p=el&&el.querySelector('.kbb p.sm');if(p)p.textContent='Clique em uma linha e aperte a tecla (ou um botão do mouse: meio ou laterais). Esc cancela. Uma tecla só pode ter uma função.'}catch(e){}return r};window.kbRender=kbRender}
const css=document.createElement('style');css.textContent='.k141h{margin:12px 0 4px;color:#f0cf72;font:700 13px Georgia,serif}#kbui .kbb{max-height:86vh;overflow:auto}';document.head.appendChild(css);
window.KEYS141.ACT=ACT;window.KEYS141.keyOf=keyOf;window.KEYS141.tbl=()=>TBL;
})();
