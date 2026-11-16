// ================= ETAPA 4 · REPUTAÇÃO NOS REINOS (ações com consequência no mundo) =================
// Cada reino lembra do que o jogador fez ali. Ganha reputação: missões concluídas no reino, inimigos derrotados
// no reino, conversar com moradores (1x por morador por dia). Perde: ser derrotado no reino e desistir de missões.
// Consequências: preço na Loja da Capital (Reino Real), recompensas ao subir de nível de reputação,
// aviso ao entrar no reino e o título mostrado no Status. Salvo junto com o progresso da conta (campo rep).
(function(){
const RE=[
 ['esquecido','Reino Esquecido',['hage','torre','treino','cranio']],
 ['comum','Reino Comum',['camp','touros','sossy','nairn','kiten','masmorra']],
 ['nobre','Reino dos Nobres',['nobres']],
 ['real','Reino Real (Capital)',['capital']],
 ['fora','Terras de fora',['bruxas','yultim','templo','hino','heart','diamond','spade','sombras']]
];
const NIV=[[-100,'Malvisto','#e06a5a'],[-20,'Desconhecido','#b9b2a4'],[15,'Conhecido','#9fd38a'],[40,'Respeitado','#6fc4ff'],[75,'Herói do reino','#f0cf72']];
const PREM={15:100,40:250,75:500}; // moedas ao chegar em cada nível (uma vez por reino)
const RP={day:'',talk:{},kill:{},last:null,shown:{}};window.REP141=RP;
const reinoDe=r=>{if(!r)return null;for(const k of RE)if(k[2].includes(r.id))return k;return null};
function aqui(){try{return reinoDe(reg83(P.x,P.z))}catch(e){return null}}
function st(){if(!P.rep||typeof P.rep!='object')P.rep={};return P.rep}
function val(id){return Math.max(-100,Math.min(100,+(st()[id]&&st()[id].v)||0))}
function nivel(v){let n=NIV[0];for(const x of NIV)if(v>=x[0])n=x;return n}
function hoje(){const d=new Date();const k=d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();if(RP.day!==k){RP.day=k;RP.talk={};RP.kill={}}}
function add(id,d,motivo){
 if(!id||!d)return;const s=st();const o=s[id]||(s[id]={v:0,p:{}});const v0=val(id);o.v=Math.max(-100,Math.min(100,Math.round((v0+d)*10)/10));
 const n0=nivel(v0),n1=nivel(o.v);const nome=(RE.find(k=>k[0]===id)||[0,id])[1];
 if(n1!==n0){
  try{toast((o.v>v0?'⭐ ':'⚠️ ')+nome+': agora você é '+n1[1])}catch(e){}
  for(const lim in PREM){if(v0<+lim&&o.v>=+lim&&!o.p[lim]){o.p[lim]=1;P.coins+=PREM[lim];try{toast('🎁 '+nome+' te recompensou com '+PREM[lim]+' moedas')}catch(e){}}}
 }
 try{Clover.bus.emit('rep:change',{reino:id,v:o.v,d,motivo})}catch(e){}
}
window.rep141Add=add;window.rep141Val=val;
// ---------- ganhos e perdas ----------
{const _c=completeQ;completeQ=function(){const k=aqui();const r=_c.apply(this,arguments);try{if(k)add(k[0],6,'missao')}catch(e){}return r};window.completeQ=completeQ}
{const _t=talk;talk=function(n){try{hoje();const k=aqui();const key=(n&&(n.id||n.name||n.line))||'';if(k&&key&&!RP.talk[key]){const c=Object.values(RP.talk).filter(x=>x===k[0]).length;RP.talk[key]=k[0];if(c<10)add(k[0],.5,'conversa')}}catch(e){}return _t.apply(this,arguments)};window.talk=talk}
let kills=null,dead=false;
setInterval(()=>{try{if(!P.g||!run&&!P.on)return;hoje();const k=aqui();
 const n=P.kills||0;if(kills==null)kills=n;const d=n-kills;kills=n;
 if(d>0&&k){const c=RP.kill[k[0]]||0;const g=Math.min(d,Math.max(0,40-c));RP.kill[k[0]]=c+g;if(g)add(k[0],g*.25,'inimigos')}
 if(P.hp<=0&&!dead){dead=true;if(k)add(k[0],-1,'derrota')}else if(P.hp>0)dead=false;
 // aviso ao entrar num reino (uma vez por sessão)
 if(k&&RP.last!==k[0]){RP.last=k[0];if(!RP.shown[k[0]]){RP.shown[k[0]]=1;const nv=nivel(val(k[0]));if(val(k[0])!==0||k[0]!=='esquecido')try{toast('🏰 '+k[1]+' · reputação: '+nv[1])}catch(e){}}}
}catch(e){}},1000);
// desistir de missão: procura a função que cancela, se existir
for(const f of['abandonQ','cancelQ','quitQ','dropQ'])if(typeof window[f]=='function'){const _f=window[f];window[f]=function(){const k=aqui();const r=_f.apply(this,arguments);try{if(k)add(k[0],-3,'desistiu')}catch(e){}return r}}
// ---------- consequência: preços da Loja da Capital ----------
function fator(){const v=val('real');return v>=75?.85:v>=40?.9:v>=15?.95:v<-20?1.15:1}
window.rep141Fator=fator;
let dentro=false;
function comPreco(fn){return function(){const f=fator();if(f===1||dentro)return fn.apply(this,arguments);const bk=[];dentro=true;
 try{for(const T0 of[typeof SK!='undefined'?SK:null,typeof IT!='undefined'?IT:null])if(T0)for(const k in T0){const a=T0[k];if(Array.isArray(a)&&typeof a[1]=='number'){bk.push([a,a[1]]);a[1]=Math.max(1,Math.round(a[1]*f))}}
  return fn.apply(this,arguments)}finally{for(const [a,v] of bk)a[1]=v;dentro=false}}}
shopUI=comPreco(shopUI);window.shopUI=shopUI;buy=comPreco(buy);window.buy=buy;buyIt=comPreco(buyIt);window.buyIt=buyIt;
{const _s=shopUI;shopUI=function(){const r=_s.apply(this,arguments);try{const f=fator();if(f!==1){const c=document.querySelector('#ov .card h1');if(c&&!c.nextElementSibling?.classList?.contains('rp141')){const p=document.createElement('p');p.className='rp141';p.style.color=f<1?'#9fd38a':'#e06a5a';p.textContent=f<1?'Desconto de reputação no Reino Real: '+Math.round((1-f)*100)+'%':'O Reino Real desconfia de você: preços '+Math.round((f-1)*100)+'% mais caros';c.after(p)}}}catch(e){}return r};window.shopUI=shopUI}
// ---------- Status: reputação em cada reino ----------
function html(){return '<div class="rp141b"><h3>🏰 Reputação nos reinos</h3>'+RE.map(k=>{const v=val(k[0]),n=nivel(v);const w=Math.round((v+100)/2);
 return '<div class="rp141r"><span>'+k[1]+'</span><b style="color:'+n[2]+'">'+n[1]+'</b><i><u style="width:'+w+'%;background:'+n[2]+'"></u></i></div>'}).join('')+
 '<p class="hint">Missões, inimigos derrotados e conversas aumentam a reputação do reino onde você está. Ser derrotado diminui. No Reino Real, reputação alta dá desconto na loja.</p></div>'}
{const _o=openMenu;openMenu=function(t){const r=_o.apply(this,arguments);try{if(mt==='st'){const c=document.querySelector('#ov .card.wide');if(c&&!c.querySelector('.rp141b')){const d=document.createElement('div');d.innerHTML=html();c.appendChild(d.firstChild)}}}catch(e){}return r};window.openMenu=openMenu}
const css=document.createElement('style');css.textContent='.rp141b{margin-top:12px;padding:10px;border:1px solid #d4af3755;border-radius:10px;background:#0006}.rp141b h3{margin:0 0 6px;font:700 15px Georgia,serif;color:#f0cf72}.rp141r{display:grid;grid-template-columns:1fr auto;gap:2px 8px;margin:6px 0;font-size:13px}.rp141r i{grid-column:1/3;height:6px;background:#ffffff1a;border-radius:4px;overflow:hidden}.rp141r u{display:block;height:100%}';document.head.appendChild(css);
RP.RE=RE;RP.nivel=nivel;RP.aqui=aqui;
})();
