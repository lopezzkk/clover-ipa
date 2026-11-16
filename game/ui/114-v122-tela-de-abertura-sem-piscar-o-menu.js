// ================= V122 · tela de abertura sem "piscar" o menu antigo + proteção dos poderes + relatório de erros =================
(function(){
// ---------- 1) relatório de erros: guarda os últimos erros do jogo (poderes, temporizadores e erros gerais) para o jogador mostrar num print
const E={list:[],n:0};window.ERR122=function(err,f){try{const msg=String((err&&err.message)||err||'erro').slice(0,160);let where='';try{const st=String(err&&err.stack||'');const m=st.split('\n').find(l=>/at |@/.test(l));if(m)where=m.replace(/https?:\/\/[^\s)]+\//g,'').replace(/^\s*at\s*/,'').slice(0,90)}catch(_){}
  const src=f&&f.u?String(f.u).slice(0,60).replace(/\s+/g,' '):'';const key=msg+'|'+where;const ex=E.list.find(x=>x.k==key);if(ex){ex.c++;ex.t=Date.now()}else{E.list.push({k:key,m:msg,w:where,s:src,c:1,t:Date.now()});if(E.list.length>25)E.list.shift()}E.n++}catch(_){}
 // efeito com erro: antes ele sumia na hora (o poder virava "só animação"). Agora ele continua rodando o que conseguir por até 3 s.
 if(f&&f.u){f.ec122=(f.ec122||0)+1;return f.t<3&&f.ec122<120}return false};
window.addEventListener('error',ev=>{try{ERR122(ev.error||ev.message)}catch(_){}});
window.addEventListener('unhandledrejection',ev=>{try{const r=ev.reason;if(r&&/permission|network|offline|fetch|firestore|auth/i.test(String(r.code||r.message||r)))return;ERR122(r)}catch(_){}});
E.open=function(){let o=document.getElementById('er122');if(!o){o=document.createElement('div');o.id='er122';document.body.appendChild(o);o.addEventListener('click',ev=>{if(ev.target===o)o.remove()})}
 const ua=navigator.userAgent,dev=/iPhone|iPad/.test(ua)?'iPhone/iPad':/Android/.test(ua)?'Android':'Computador';let gl='';try{gl=R.capabilities.isWebGL2?'WebGL2':'WebGL1'}catch(_){}
 const rows=E.list.slice().reverse().map(x=>'<li><b>'+x.c+'×</b> '+esc(x.m)+(x.w?'<small>'+esc(x.w)+'</small>':'')+(x.s?'<small>efeito: '+esc(x.s)+'</small>':'')+'</li>').join('')||'<li class="ok">Nenhum erro registrado nesta partida. 👍</li>';
 o.innerHTML='<div class="bx"><h3>Relatório de erros</h3><p>Se um poder não funcionar, use o poder de novo, abra esta tela e mande um print para o criador do jogo.</p><p class="inf">'+dev+' · '+gl+' · qualidade '+(CFG.perf?'Desempenho':CFG.gfx)+' · grimório '+(P.g?P.g.id:'-')+' · nível '+P.lv+(MP.r?' · em sala':'')+'</p><ul>'+rows+'</ul><div class="bt"><button onclick="ERR122.clear()">Limpar</button><button onclick="document.getElementById(\'er122\').remove()">Fechar</button></div></div>'};
const esc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
ERR122.open=E.open;ERR122.clear=function(){E.list=[];E.n=0;E.open()};ERR122.E=E;
const st=document.createElement('style');st.textContent=`#er122{position:fixed;inset:0;z-index:99990;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;padding:16px}
#er122 .bx{width:min(560px,100%);max-height:86vh;overflow:auto;background:linear-gradient(#1b1626,#0e0b16);border:1px solid #d4af37;border-radius:14px;padding:14px 16px;color:#f4e6c4;font:13px Georgia,serif}
#er122 h3{margin:0 0 6px;color:#d4af37;font-size:17px}#er122 p{margin:4px 0}#er122 .inf{color:#9fe870;font-size:12px}#er122 ul{margin:8px 0;padding-left:18px}#er122 li{margin:5px 0;word-break:break-word}#er122 li small{display:block;color:#a99;font-size:11px}#er122 li.ok{list-style:none;color:#9fe870}
#er122 .bt{display:flex;gap:8px;justify-content:flex-end}#er122 button{background:#2a2238;color:#f4e6c4;border:1px solid #d4af37;border-radius:8px;padding:6px 14px;font:700 13px Georgia,serif}`;document.head.appendChild(st);
// botão nas Configurações
{const _m=mCfg;mCfg=function(){const r=_m.apply(this,arguments);try{const b=document.getElementById('cf-b');if(b&&!b.querySelector('.er122b')){b.insertAdjacentHTML('beforeend','<div class="er122b" style="margin:12px 0 4px;text-align:center"><button onclick="ERR122.open()" style="background:#2a2238;color:#f4e6c4;border:1px solid #d4af37;border-radius:10px;padding:8px 16px;font:700 13px Georgia,serif">🛠️ Relatório de erros'+(E.n?' ('+E.list.length+')':'')+'</button></div>')}}catch(e){}return r}}
{const _o=openMenu;openMenu=function(t){const r=_o.apply(this,arguments);try{if(typeof mt!='undefined'&&mt=='cfg'){const o=document.getElementById('ov');const box=o&&(o.querySelector('.tabs')||{}).parentElement;if(box&&!box.querySelector('.er122b'))box.insertAdjacentHTML('beforeend','<div class="er122b" style="margin:14px 0 6px;text-align:center"><button onclick="ERR122.open()" style="background:#2a2238;color:#f4e6c4;border:1px solid #d4af37;border-radius:10px;padding:8px 16px;font:700 13px Georgia,serif">🛠️ Relatório de erros'+(E.list.length?' ('+E.list.length+')':'')+'</button></div>')}}catch(e){}return r}}
// ---------- 2) a tela só aparece depois que o jogo terminou de carregar o visual (o menu verde antigo não pisca mais)
try{document.documentElement.classList.add('rdy122')}catch(e){}
})();

