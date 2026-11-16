// ===================== V84 · HUD: a barra de magias nunca fica embaixo dos botões Grimório/Espada/Fundir =====================
{let last='';const fit=()=>{try{const sk=document.getElementById('h-skills'),sec=document.getElementById('h-sec');if(!sk||!sec)return;
  sk.style.transform='';sk.style.transformOrigin='';const a=sk.getBoundingClientRect(),b=sec.getBoundingClientRect();
  if(!a.width||!b.width||getComputedStyle(sec).display=='none'){last='';return}
  const vo=a.bottom>b.top+2&&a.top<b.bottom-2;if(!vo||a.right<=b.left-8){last='';return}
  let lim=8;for(const id of['joy']){const j=document.getElementById(id);if(j){const r=j.getBoundingClientRect();if(r.width&&getComputedStyle(j).display!='none'&&r.bottom>a.top&&r.top<a.bottom)lim=Math.max(lim,r.right+6)}}
  const need=a.right-(b.left-8),room=a.left-lim;const base=getComputedStyle(sk).transform;
  let tf,dx=Math.min(need,Math.max(0,room));tf='translateX(-'+dx+'px)';
  if(need>room){const w=b.left-8-lim,sc=Math.max(.6,Math.min(1,w/a.width));tf='translateX(-'+dx+'px) scale('+sc.toFixed(3)+')';sk.style.transformOrigin='left bottom';
   tf='translateX(-'+Math.max(0,room)+'px) scale('+sc.toFixed(3)+')'}
  sk.style.transform=(base&&base!='none'?base+' ':'')+tf}catch(e){}};
 window.v84Fit=fit;{const _i=setInterval(fit,400);try{_i&&_i.unref&&_i.unref()}catch(e){}}addEventListener('resize',()=>setTimeout(fit,50))}

