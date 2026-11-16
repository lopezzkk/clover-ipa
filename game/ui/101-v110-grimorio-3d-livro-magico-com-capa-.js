// ================= V110 · GRIMÓRIO 3D: livro mágico com capa, abertura/fechamento, páginas que viram, habilidades, recargas, requisitos, magia atual, demônio, contrato e União =================
(function(){
const css=`
#gb110{position:fixed;inset:0;z-index:60;display:none;align-items:center;justify-content:center;background:radial-gradient(ellipse at center,rgba(20,12,30,.55),rgba(5,3,10,.88));font-family:Georgia,'Times New Roman',serif;perspective:1800px;touch-action:none}
#gb110.on{display:flex}
#gb110 .gbw{position:relative;width:min(88vw,920px);height:min(calc(100vh - 110px),560px);margin-top:-10px;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.8,.2,1);transform:rotateX(14deg) scale(.86)}
#gb110.open .gbw{transform:rotateX(6deg) scale(1)}
#gb110:not(.open) .gbw{transform:translateX(-25%) rotateX(14deg) scale(.86)}
#gb110:not(.open) .gbpg.L,#gb110:not(.open) .gbtabs,#gb110:not(.open) .gbnav{opacity:0}
#gb110 .gbbk{transition:left .9s}#gb110 .gbpg.L,#gb110 .gbtabs,#gb110 .gbnav{transition:opacity .5s .3s}
#gb110:not(.open) .gbbk{left:calc(50% - 14px)}
#gb110.one:not(.open) .gbw{transform:rotateX(14deg) scale(.86)}#gb110.one:not(.open) .gbbk{left:-14px}
#gb110 .gbsp{position:absolute;inset:0;display:flex;transform-style:preserve-3d}
#gb110 .gbpg{position:relative;flex:1;background:linear-gradient(90deg,#e9dcbc,#f5ecd4 12%,#f3e8cc 88%,#d9c79f);color:#2b1d10;padding:22px 26px 46px;overflow:hidden;box-shadow:inset 0 0 40px rgba(110,80,30,.25)}
#gb110 .gbpg.L{border-radius:10px 2px 2px 10px;background:linear-gradient(90deg,#d9c79f,#f3e8cc 12%,#f5ecd4 88%,#e2d2ad);box-shadow:inset -18px 0 30px -12px rgba(80,50,15,.45),inset 0 0 40px rgba(110,80,30,.2)}
#gb110 .gbpg.R{border-radius:2px 10px 10px 2px;box-shadow:inset 18px 0 30px -12px rgba(80,50,15,.45),inset 0 0 40px rgba(110,80,30,.2)}
#gb110 .gbbk{position:absolute;inset:-12px -14px -12px -14px;border-radius:14px;background:var(--gbc);box-shadow:0 30px 60px rgba(0,0,0,.6),inset 0 0 0 3px rgba(212,175,90,.75);transform:translateZ(-6px)}
#gb110 .gbcv{position:absolute;top:-12px;bottom:-12px;left:50%;width:calc(50% + 14px);border-radius:4px 14px 14px 4px;background:var(--gbc);transform-origin:0 50%;transform-style:preserve-3d;transition:transform .9s cubic-bezier(.5,.05,.25,1);z-index:30;box-shadow:inset 0 0 0 3px rgba(212,175,90,.85),inset 0 0 60px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;backface-visibility:hidden}
#gb110 .gbcv svg{width:58%;max-height:70%;filter:drop-shadow(0 0 10px var(--gbg))}
#gb110 .gbcv:after{content:'';position:absolute;inset:14px;border:2px solid rgba(212,175,90,.55);border-radius:8px;pointer-events:none}
#gb110.open .gbcv{transform:rotateY(-178deg)}
#gb110 .gbfl{position:absolute;top:0;bottom:0;left:50%;width:50%;transform-origin:0 50%;transform-style:preserve-3d;z-index:20;pointer-events:none}
#gb110 .gbfl>div{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden}
#gb110 .gbfl .bk{transform:rotateY(180deg)}
#gb110 h3{margin:0 0 6px;font-size:clamp(15px,2.3vw,22px);color:#4a2a0c;letter-spacing:.5px;border-bottom:1px solid rgba(90,60,20,.35);padding-bottom:4px}
#gb110 h4{margin:8px 0 3px;font-size:clamp(12px,1.7vw,15px);color:#5a3510}
#gb110 p{margin:3px 0;font-size:clamp(11px,1.45vw,13.5px);line-height:1.35}
#gb110 .gbsk{display:flex;gap:10px;padding:6px 6px;margin:4px 0;border-radius:8px;background:rgba(255,255,255,.28);border:1px solid rgba(120,80,30,.22)}
#gb110 .gbsk.lk{opacity:.55;filter:grayscale(.7)}
#gb110 .gbsk .ic{flex:0 0 auto;width:clamp(30px,5vw,44px);height:clamp(30px,5vw,44px);border-radius:50%;background:radial-gradient(circle,#2a1d34,#0f0a16);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 2px rgba(212,175,90,.8)}
#gb110 .gbsk .ic svg{width:72%;height:72%}
#gb110 .gbsk b{font-size:clamp(11.5px,1.55vw,14px);color:#2b1606}
#gb110 .gbsk .ds{font-size:clamp(10px,1.3vw,12px);opacity:.85;margin:1px 0 2px}
#gb110 .gbtg{display:flex;flex-wrap:wrap;gap:4px}
#gb110 .gbtg em{font-style:normal;font-size:clamp(9.5px,1.2vw,11px);padding:1px 6px;border-radius:9px;background:rgba(80,50,15,.12);white-space:nowrap}
#gb110 .gbtg em.ok{background:rgba(40,140,70,.18);color:#145a2a}
#gb110 .gbtg em.no{background:rgba(160,40,40,.16);color:#7a1414}
#gb110 .gbtg em.cd{background:rgba(60,60,160,.16);color:#1e2370}
#gb110 .gbst{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px}
#gb110 .gbst div{padding:6px 8px;border-radius:8px;background:rgba(255,255,255,.3);border:1px solid rgba(120,80,30,.22);font-size:clamp(10.5px,1.35vw,12.5px)}
#gb110 .gbst small{display:block;opacity:.7;font-size:.85em}
#gb110 .gbsym{display:flex;align-items:center;justify-content:center;margin:4px auto 8px;width:clamp(70px,13vw,120px);height:clamp(70px,13vw,120px);border-radius:50%;background:radial-gradient(circle,var(--gbc2),#120a18);box-shadow:0 0 0 3px rgba(212,175,90,.8),0 0 22px var(--gbg)}
#gb110 .gbsym svg{width:78%;height:78%}
#gb110 .gbn{position:absolute;bottom:12px;font-size:12px;opacity:.6}
#gb110 .gbpg.L .gbn{left:24px}#gb110 .gbpg.R .gbn{right:24px}
#gb110 .gbnav{position:absolute;bottom:-46px;left:0;right:0;display:flex;justify-content:center;gap:10px;align-items:center}
#gb110 .gbnav button,#gb110 .gbx{background:linear-gradient(#3a2614,#22160b);color:#f3dfa8;border:1px solid #c9a25a;border-radius:20px;padding:7px 16px;font:600 13px Georgia,serif;cursor:pointer}
#gb110 .gbnav span{color:#f3dfa8;font-size:12px;min-width:70px;text-align:center}
#gb110 .gbx{position:absolute;top:-44px;right:0}
#gb110 .gbtabs{position:absolute;right:-30px;top:16px;display:flex;flex-direction:column;gap:6px;z-index:25}
#gb110 .gbtabs button{writing-mode:vertical-rl;padding:10px 5px;border:0;border-radius:0 8px 8px 0;font:600 11px Georgia,serif;color:#fff;cursor:pointer;box-shadow:2px 2px 6px rgba(0,0,0,.4);opacity:.85}
#gb110 .gbtabs button.on{opacity:1;transform:translateX(4px)}
#gb110 .gbbtn{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
#gb110 .gbbtn button{flex:1 1 45%;background:linear-gradient(#4a3018,#2a1a0c);color:#f3dfa8;border:1px solid #b08a46;border-radius:8px;padding:7px 6px;font:600 12px Georgia,serif;cursor:pointer}
#gb110 .gbnew{animation:gb110n 1.6s ease-out 2}
@keyframes gb110n{0%{box-shadow:0 0 0 0 rgba(255,210,90,.9)}100%{box-shadow:0 0 0 14px rgba(255,210,90,0)}}
#gb110.one .gbpg.L{display:none}#gb110.one .gbcv{left:0;width:calc(100% + 28px);left:-14px}#gb110.one .gbfl{left:0;width:100%}
#gb110.one .gbtabs{right:-6px}
@media (max-height:460px){#gb110 .gbpg{padding:10px 14px 24px}#gb110 .gbw{height:calc(100vh - 96px)}#gb110 .gbnav{bottom:-42px}#gb110 .gbnav button,#gb110 .gbx{padding:5px 12px;font-size:12px}#gb110 .gbx{top:-36px}#gb110 .gbsym{width:64px;height:64px}#gb110 .gbsk{padding:4px;margin:3px 0}}
`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
const el=document.createElement('div');el.id='gb110';el.innerHTML='<div class="gbw"><div class="gbbk"></div><div class="gbsp"><div class="gbpg L"></div><div class="gbpg R"></div></div><div class="gbcv"></div><div class="gbtabs"></div><div class="gbnav"><button data-a="p">◀ Voltar</button><span></span><button data-a="n">Avançar ▶</button></div><button class="gbx" data-a="x">✕ Fechar</button></div>';document.body.appendChild(el);
const Q=s=>el.querySelector(s);
// ---------- descrições das habilidades remodeladas (as demais são geradas pelos dados reais da habilidade)
const D={obullet:'Dispara projéteis de osso afiados em sequência.',ospear:'Forma uma grande lança óssea e a arremessa em linha reta.',owall:'Ergue uma muralha de ossos que bloqueia ataques.',ospike:'Espinhos de osso brotam do chão sob os inimigos.',oprison:'Prende o alvo dentro de uma jaula de costelas.',ogate:'Abre um portão ósseo que dispara ossos em leque.',odom:'Um crânio gigante surge à frente e esmaga a área.',oarmor:'Veste uma armadura de ossos que reduz o dano recebido por 18s.',odragon:'Invoca um dragão de ossos articulado que voa e ataca.',
 bzrift:'Rasga o espaço e lança uma fenda cortante.',bztele:'Teletransporta você alguns metros à frente.',bzbar:'Barreira espacial que desvia ataques.',bzcomp:'Comprime o espaço em um ponto e esmaga os inimigos.',bzportal:'Abre um portal que engole e devolve ataques.',bzdom:'Domina o espaço ao redor e prende os inimigos.',bzdim:'Cria uma dimensão própria: seu dano aumenta enquanto dura.',
 zbman:'Portais espaciais disparam ossos de todas as direções.',zbprison:'Uma prisão de ossos se fecha dentro de uma bolha espacial.',zbrift:'Uma fenda demoníaca rasga o espaço e devora a área.',zbdom:'Domínio de ossos: chifres gigantes brotam ao seu redor.',zbdomain:'Domínio Espacial Demoníaco: o chão vira vazio e os ataques são rebatidos.',zbsword:'A espada Dainsleif sai de uma fenda e corta 3 vezes.'};
const ST={none:'Sem contrato',conhecido:'Conhecido',exigencia:'Exigência pendente',pacto:'Pacto firmado',dominado:'Dominado',go:'Em negociação',out:'Recusou',in:'Em conversa'};
const G={on:false,k:0,one:false,sig:'',busy:false,tab:0,newKeys:{}};window.GB110=G;
const hx2=c=>'#'+new T.Color(c).getHexString();
const dark=(c,f)=>'#'+new T.Color(c).multiplyScalar(f).getHexString();
function clover(n,col,demon){n=n||3;let h='<svg viewBox="-50 -50 100 100" xmlns="http://www.w3.org/2000/svg">';for(let i=0;i<n;i++){const a=i*360/n-90,dm=demon&&i==n-1;h+='<g transform="rotate('+(a+90)+')"><path d="M0 -4 C -22 -16 -26 -44 -6 -44 C 0 -44 0 -38 0 -36 C 0 -38 0 -44 6 -44 C 26 -44 22 -16 0 -4Z" fill="'+(dm?'#1a0a14':col)+'" stroke="#d4af5a" stroke-width="2"/>'+(dm?'<path d="M-6 -30 l6 8 l6 -8" stroke="#ff2a4a" stroke-width="2.5" fill="none"/>':'')+'</g>'}h+='<circle r="6" fill="#d4af5a"/><path d="M0 6 Q4 28 14 40" stroke="#d4af5a" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';return h}
function baseId(){const id=P.g&&P.g.id;if(id=='zbunion')return (window.ZB109&&ZB109.prevG)||'ossos';return id}
function demonOf(){const id=baseId();try{const r=window.BZ108&&window.DEM108;if(id=='bzesp')return 'belzebu'}catch(e){}if(id=='bzesp')return 'belzebu';for(const k in DPS){if(DPS[k].g==id)return k}return null}
function desc(s){const k=s[3];if(D[k])return D[k];const d=+s[2]||0,r=rngOf?rngOf(s):null,rr=r?({c:'curto',m:'médio',l:'longo'}[r[0]]||''):'';if(d<=0)return 'Habilidade de suporte do grimório.';return 'Ataque de alcance '+(rr||'variável')+' que causa '+Math.round(d)+' de dano base.'}
function cdLeft(i){try{return P.cd&&P.cd[i]>0?P.cd[i]:0}catch(e){return 0}}
function skCard(s,i,live,lvReq){if(!s)return'';const lk=P.lv<lvReq,cd=(s[5]||.5)*(1-(typeof cb=='function'?cb('cdr'):0)),col=P.g?P.g.c:0xffffff,cl=live?cdLeft(i):0,nw=G.newKeys[s[3]];
 return '<div class="gbsk'+(lk?' lk':'')+(nw?' gbnew':'')+'"><div class="ic">'+skIcon(s[0],col)+'</div><div><b>'+(lk?'🔒 ':'')+s[0]+'</b><p class="ds">'+desc(s)+'</p><div class="gbtg"><em>💧 '+mcost(s)+'</em><em>⏱ '+String(+cd.toFixed(1)).replace('.',',')+'s</em><em>📏 '+rngTxt(s)+'</em>'+(cl>0?'<em class="cd">recarregando '+Math.ceil(cl)+'s</em>':'')+'<em class="'+(lk?'no':'ok')+'">'+(lk?'Requer Nível '+lvReq:'Disponível')+'</em></div></div></div>'}
// ---------- páginas
function pages(){const g=P.g,pg=[],tabs=[];const gr=(typeof GRL!='undefined'?GRL.find(x=>x.id==baseId()):null);const rar=gr&&RAR[gr.r]?RAR[gr.r]:null;const dk=demonOf(),D0=dk?DPS[dk]:null,r=dk?relOf(dk):null,ok=dk?relOk(dk):false;
 const cur=g.id=='zbunion'?'União de Magias (Ossos + Espacial)':g.n;const sec=dk=='belzebu'&&ok?(baseId()=='bzesp'?'Magia de Ossos':'Magia Espacial'):null;
 // 1 · identidade
 tabs.push(['Magia',pg.length,hx2(g.c)]);
 pg.push('<h3>Grimório de '+(g.id=='zbunion'?'Zenon · União':g.n)+'</h3><div class="gbsym">'+clover(g.l||3,hx2(g.c),g.id=='anti'||g.id=='zbunion')+'</div><p style="text-align:center"><b>'+(P.nick||'Aspirante')+'</b> · Nível '+P.lv+'</p>'+(rar?'<p style="text-align:center;color:'+rar[1]+';font-weight:700">'+rar[0]+'</p>':'')+(gr&&gr.t?'<p style="font-style:italic;text-align:center">'+gr.t+'</p>':'')+(g.p&&g.p.t?'<h4>Passiva</h4><p>'+g.p.t+'</p>':''));
 // 2 · estado da magia
 const un=g.id=='zbunion'?'Forma Demoníaca ativa':(window.ZB109&&ZB109.st==1)?'Manifestação ativa':(P.union||P.zg||P.bz)?'Ativa':'Inativa';
 pg.push('<h3>Funcionamento</h3><div class="gbst"><div><small>Magia atual</small>'+cur+'</div><div><small>Magia demoníaca</small>'+(D0?(dk=='belzebu'?'Espacial ('+D0.n+')':D0.n):'Nenhuma')+'</div><div><small>Contrato</small>'+(r?ST[r.st]||r.st:'—')+'</div><div><small>União Demoníaca</small>'+(D0?(ok?un:'Bloqueada'):'—')+'</div></div><h4>Como usar</h4><p>📖 <b>Grimório</b> (G): equipa e libera as magias.</p>'+(sec?'<p>🔄 <b>Alterar</b> (V): troca para a '+sec+' sem perder progresso.</p>':'')+(D0?'<p>😈 <b>União</b>: '+(dk=='belzebu'?'1º toque manifesta o poder demoníaco, 2º toque inicia a Forma Demoníaca (precisa de 50% de mana), 3º encerra.':'funde você com o demônio do grimório.')+'</p>':'')+'<p>⏱ As recargas aparecem ao vivo nas páginas de habilidades.</p>'+sq());
 // 3 · habilidades da magia atual (3 por página)
 tabs.push(['Habilidades',pg.length,'#8a5a22']);const sk=g.s||[];for(let i=0;i<sk.length;i+=3){let h='<h3>Habilidades'+(sk.length>3?' · '+(i/3+1)+'/'+Math.ceil(sk.length/3):'')+'</h3>';for(let j=i;j<Math.min(sk.length,i+3);j++)h+=skCard(sk[j],j,true,skl(j));pg.push(h)}
 // 4 · demônio e contrato
 if(D0){tabs.push(['Demônio',pg.length,hx2(D0.col||0x7a4aff)]);let h='<h3>😈 '+D0.n+'</h3><div class="gbsym" style="--gbc2:'+dark(D0.col||0x7a4aff,.6)+'">'+clover(1,hx2(D0.col||0x7a4aff),true)+'</div><p style="font-style:italic">'+(D0.tag||'')+'</p><div class="gbst"><div><small>Contrato</small>'+(ST[r.st]||r.st)+'</div><div><small>Vitórias / derrotas</small>'+(r.wins||0)+' / '+(r.losses||0)+'</div><div><small>Nível mínimo</small>'+(D0.minLv||'—')+'</div><div><small>Confiança</small>'+Math.round((r.trust||0)*100)/100+'</div></div>';if(!ok)h+='<p style="margin-top:6px">Converse com o demônio pelo menu de Contratos para firmar um pacto.</p>';pg.push(h);
  if(dk=='belzebu'&&GR.bzesp){const es=baseId()=='bzesp'?GR.ossos:GR.bzesp;const nm=baseId()=='bzesp'?'Magia de Ossos (original)':'Magia Espacial (demoníaca)';for(let i=0;i<es.s.length;i+=3){let h2='<h3>'+nm+'</h3>';if(!ok)h2+='<p>🔒 Requer o contrato com Belzebu.</p>';for(let j=i;j<Math.min(es.s.length,i+3);j++){const s=es.s[j];h2+=skCard(s,j,false,(typeof sklOf=='function'?sklOf(es.id)[j]:1)||1).replace('class="gbsk','class="gbsk'+(ok?'':' lk'))}pg.push(h2)}}}
 // 5 · União
 const us=(dk=='belzebu'&&GR.zbunion)?GR.zbunion.s:(g.ss||[]).filter(Boolean);if(us.length){tabs.push(['União',pg.length,'#3a1050']);for(let i=0;i<us.length;i+=3){let h='<h3>União Demoníaca'+(us.length>3?' · '+(i/3+1)+'/'+Math.ceil(us.length/3):'')+'</h3>';if(!ok&&D0)h+='<p>🔒 Desbloqueia com o contrato.</p>';for(let j=i;j<Math.min(us.length,i+3);j++)h+=skCard(us[j],j,g.id=='zbunion',1).replace('class="gbsk','class="gbsk'+(ok||!D0?'':' lk'));pg.push(h)}}
 // 6 · atalhos
 pg.push('<h3>Biblioteca</h3><p>Outras páginas do seu grimório:</p><div class="gbbtn"><button data-a="roleta">📕 Roleta ('+(P.ggiros||0)+' giros)</button><button data-a="codex">📜 Códex das Magias</button><button data-a="contr">😈 Contratos</button><button data-a="lista">📋 Lista simples</button></div><p style="margin-top:10px;opacity:.75">Quando você alterar sua magia ou desbloquear uma habilidade, este grimório se atualiza sozinho.</p>');
 if(pg.length%2)pg.push('<div style="height:100%;display:flex;align-items:center;justify-content:center;opacity:.25">'+clover(g.l||3,'#8a6a3a')+'</div>');
 return {pg,tabs}}
function sq(){try{const v=v82S(),o=v.ord105;if(!o||!o.id)return '';const I=V105.SQ9.find(q=>q[0]==o.id),r=(v.reg111||{})[o.id];return '<h4>Esquadrão</h4><p>🛡️ <b>'+(I?I[1]:o.id)+'</b>'+(r?' · '+r.id:'')+'<br>'+(window.rank111?rank111():'')+'</p>'}catch(e){return ''}}
let PG={pg:[],tabs:[]};
function per(){return G.one?1:2}
function fill(k){const L=Q('.gbpg.L'),R=Q('.gbpg.R'),n=per();if(G.one){R.innerHTML=(PG.pg[k]||'')+'<span class="gbn">'+(k+1)+'</span>';}else{L.innerHTML=(PG.pg[k]||'')+'<span class="gbn">'+(k+1)+'</span>';R.innerHTML=(PG.pg[k+1]||'')+'<span class="gbn">'+(k+2)+'</span>'}
 Q('.gbnav span').textContent='Página '+(k+1)+(n>1&&PG.pg[k+1]?'–'+(k+2):'')+' de '+PG.pg.length;
 Q('.gbtabs').innerHTML=PG.tabs.map(t=>'<button data-tab="'+t[1]+'" style="background:'+t[2]+'" class="'+(k<=t[1]&&t[1]<k+n||(t===PG.tabs.filter(x=>x[1]<=k).pop())?'on':'')+'">'+t[0]+'</button>').join('')}
function setColors(){const c=P.g?P.g.c:0x335533;el.style.setProperty('--gbc','linear-gradient(135deg,'+dark(c,.55)+','+dark(c,.28)+' 60%,'+dark(c,.18)+')');el.style.setProperty('--gbc2',dark(c,.6));el.style.setProperty('--gbg',hx2(c));Q('.gbcv').innerHTML=clover(P.g.l||3,hx2(new T.Color(c).lerp(new T.Color(0xffffff),.25).getHex()),P.g.id=='anti'||P.g.id=='zbunion')}
function sig(){return [P.g&&P.g.id,P.lv,window.ZB109?ZB109.st:0,P.union,P.bz,P.zg,(()=>{try{const d=demonOf();return d?relOf(d).st:''}catch(e){return''}})()].join('|')}
function flip(to,dir){if(G.busy)return;if(to<0||to>=PG.pg.length)return;const n=per();to=to-(to%n);if(to==G.k)return;G.busy=true;try{snd('page')}catch(e){}
 const from=G.k,fl=document.createElement('div');fl.className='gbfl';const fwd=to>from;
 if(G.one){fl.innerHTML='<div class="gbpg R fr">'+Q('.gbpg.R').innerHTML+'</div>';fill(to);Q('.gbw').appendChild(fl);fl.style.transition='transform .55s ease-in, opacity .55s';fl.style.transformOrigin=fwd?'0 50%':'100% 50%';requestAnimationFrame(()=>{fl.style.transform='rotateY('+(fwd?-100:100)+'deg)';fl.style.opacity='0'});setTimeout(()=>{fl.remove();G.k=to;G.busy=false},580);return}
 // folha virando: frente = página que sai, verso = página que chega
 const oldL=Q('.gbpg.L').innerHTML,oldR=Q('.gbpg.R').innerHTML;
 if(fwd){fl.innerHTML='<div class="gbpg R fr">'+oldR+'</div><div class="gbpg L bk">'+(PG.pg[to]||'')+'<span class="gbn">'+(to+1)+'</span></div>';fill(to);Q('.gbpg.L').innerHTML=oldL;fl.style.transform='rotateY(0deg)'}
 else{fl.style.left='0';fl.style.transformOrigin='100% 50%';fl.innerHTML='<div class="gbpg L fr">'+oldL+'</div><div class="gbpg R bk">'+(PG.pg[to+1]||'')+'<span class="gbn">'+(to+2)+'</span></div>';fill(to);Q('.gbpg.R').innerHTML=oldR;fl.style.transform='rotateY(0deg)'}
 Q('.gbw').appendChild(fl);fl.style.transition='transform .62s cubic-bezier(.45,.05,.3,1)';requestAnimationFrame(()=>requestAnimationFrame(()=>{fl.style.transform='rotateY('+(fwd?-180:180)+'deg)'}));
 setTimeout(()=>{fill(to);fl.remove();G.k=to;G.busy=false},660)}
function render(keep){PG=pages();if(!keep)G.k=0;G.k=Math.min(G.k,PG.pg.length-1);G.k-=G.k%per();setColors();fill(G.k);G.sig=sig()}
function open(){if(!P.g||typeof run=='undefined')return;if(typeof CS!='undefined'&&CS.on)return;G.one=innerWidth<640&&innerWidth<innerHeight*1.1;el.classList.toggle('one',G.one);G.on=true;G.wasRun=run;run=false;try{$('ov').style.display='none'}catch(e){}render();el.classList.add('on');el.classList.remove('open');try{snd('book')}catch(e){}setTimeout(()=>el.classList.add('open'),60)}
function close(){if(!G.on)return;el.classList.remove('open');setTimeout(()=>{el.classList.remove('on');G.on=false;run=true;try{saveGame()}catch(e){}},700)}
G.open=open;G.close=close;G.render=render;G.flip=flip;
el.addEventListener('click',e=>{const b=e.target.closest('[data-a],[data-tab]');if(!b){if(e.target===el)close();return}if(b.dataset.tab!=null){flip(+b.dataset.tab);return}const a=b.dataset.a;
 if(a=='n')flip(G.k+per());else if(a=='p')flip(G.k-per());else if(a=='x')close();
 else if(a=='roleta'){close();setTimeout(()=>grimOpen('game'),720)}else if(a=='codex'){try{cdxOpen()}catch(e){}}else if(a=='contr'){close();setTimeout(()=>{try{dcxOpen()}catch(e){}},720)}else if(a=='lista'){close();setTimeout(()=>{G.plain=1;openMenu('gr');G.plain=0},720)}});
// gesto de deslizar no celular
let sx=null;el.addEventListener('pointerdown',e=>{sx=e.clientX});el.addEventListener('pointerup',e=>{if(sx==null)return;const d=e.clientX-sx;sx=null;if(Math.abs(d)>50)flip(G.k+(d<0?per():-per()))});
addEventListener('keydown',e=>{if(!G.on)return;if(e.key=='Escape'){close();e.stopPropagation()}else if(e.key=='ArrowRight')flip(G.k+per());else if(e.key=='ArrowLeft')flip(G.k-per())},true);
// o menu Grimório abre o livro (a lista simples continua acessível)
{const _o=openMenu;openMenu=function(t){if(t=='gr'&&!G.plain&&P.g){try{$('ov').style.display='none'}catch(e){}open();return}return _o.apply(this,arguments)}}
// atualização automática: ao alterar magia, mudar a União, o contrato ou subir de nível; recargas ao vivo
let acc=0,seenT=0;
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{acc+=dt||0;
 if(G.on&&!G.busy){const s=sig();if(s!=G.sig){render(false);const p0=Q('.gbsp');p0.animate([{opacity:.2,filter:'blur(3px)'},{opacity:1,filter:'none'}],{duration:500})}else if(acc>.5){acc=0;const L=Q('.gbpg.L'),R=Q('.gbpg.R');if(/recarregando/.test(L.innerHTML+R.innerHTML)||(P.cd||[]).some(v=>v>0)){PG=pages();fill(G.k)}}}
 // nova habilidade desbloqueada: aviso + destaque na página
 seenT+=dt||0;if(seenT>1&&P.g&&P.g.s){seenT=0;const v=v82S();v.gb110=v.gb110||{};const key=P.g.id;const n=P.g.s.filter((s,i)=>P.lv>=skl(i)).length;if(v.gb110[key]==null)v.gb110[key]=n;else if(n>v.gb110[key]){const s=P.g.s[n-1];v.gb110[key]=n;if(s){G.newKeys[s[3]]=1;toast('📖 Nova página no grimório: '+s[0]);setTimeout(()=>delete G.newKeys[s[3]],20000)}}}
}catch(e){}return r}}
// sons simples de livro (gerados, sem arquivos)
try{const _s=window.xSnd;if(_s&&!_s.__gb){window.xSnd=function(n){if(n=='page'||n=='book'){try{const A=window.AC||(window.AC=new (window.AudioContext||window.webkitAudioContext)());const len=n=='page'?.25:.45,b=A.createBuffer(1,A.sampleRate*len,A.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++){const t=i/d.length;d[i]=(Math.random()*2-1)*Math.pow(1-t,n=='page'?3:2)*(n=='page'?.25:.4)*(t<.05?t*20:1)}const src=A.createBufferSource(),f=A.createBiquadFilter();f.type=n=='page'?'highpass':'lowpass';f.frequency.value=n=='page'?1800:600;src.buffer=b;src.connect(f);f.connect(A.destination);src.start()}catch(e){}return}return _s.apply(this,arguments)};window.xSnd.__gb=1}}catch(e){}
function snd(n){try{(window.xSnd||function(){})(n)}catch(e){}}
})();

