// ===================== V84 · HUD: a barra de magias nunca fica embaixo dos botões Grimório/Espada/Fundir =====================
{let last='';const fit=()=>{try{const sk=document.getElementById('h-skills');if(!sk)return;
  sk.style.transform='';sk.style.transformOrigin='';const a=sk.getBoundingClientRect();
  // Etapa 2: o que bloqueia a barra é o botão mais à esquerda da coluna da direita na mesma altura (Grimório/Espada, cadeado, ações)
  let b=null;const cand=[document.getElementById('h-sec'),...document.querySelectorAll('#h-act .ab,#hud > .ab,[id^=a-]')];
  for(const el of cand){if(!el||!el.offsetParent)continue;const cs=getComputedStyle(el);if(cs.display=='none'||cs.visibility=='hidden')continue;const r=el.getBoundingClientRect();
   if(r.width<10||r.left<innerWidth*.5)continue;if(r.bottom<=a.top+2||r.top>=a.bottom-2)continue;if(!b||r.left<b.left)b=r}
  if(!a.width||!b){last='';return}
  const vo=a.bottom>b.top+2&&a.top<b.bottom-2;if(!vo||a.right<=b.left-8){last='';return}
  let lim=8;for(const id of['joy']){const j=document.getElementById(id);if(j){const r=j.getBoundingClientRect();if(r.width&&getComputedStyle(j).display!='none'&&r.bottom>a.top&&r.top<a.bottom)lim=Math.max(lim,r.right+6)}}
  const need=a.right-(b.left-8),room=a.left-lim;const base=getComputedStyle(sk).transform;
  let tf,dx=Math.min(need,Math.max(0,room));tf='translateX(-'+dx+'px)';
  if(need>room){const w=b.left-8-lim,sc=Math.max(.6,Math.min(1,w/a.width));tf='translateX(-'+dx+'px) scale('+sc.toFixed(3)+')';sk.style.transformOrigin='left bottom';
   tf='translateX(-'+Math.max(0,room)+'px) scale('+sc.toFixed(3)+')'}
  sk.style.transform=(base&&base!='none'?base+' ':'')+tf;
  {const a2=sk.getBoundingClientRect();if(a2.left<lim-1)sk.style.transform='translateX('+(lim-a2.left).toFixed(1)+'px) '+sk.style.transform}}catch(e){}};
 window.v84Fit=fit;{const _i=setInterval(fit,400);try{_i&&_i.unref&&_i.unref()}catch(e){}}addEventListener('resize',()=>setTimeout(fit,50))}

