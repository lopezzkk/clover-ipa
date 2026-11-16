// ================= ETAPA 6 · HUD EM MONITORES GRANDES =================
// A interface foi desenhada para celular; em monitores Full HD ou maiores ela ficava pequena.
// No PC (mouse), o HUD cresce junto com a tela (até 1,75×). Celulares e tablets não mudam.
(function(){
let cur='';
function apply(){
 const h=document.getElementById('hud');if(!h)return;
 const big=!touch&&!matchMedia('(pointer:coarse)').matches;
 const s=big?Math.max(1,Math.min(1.75,Math.min(innerWidth/1440,innerHeight/810))):1;
 const r=Math.round(s*100)/100;const key=r+':'+innerWidth+'x'+innerHeight;if(key===cur)return;cur=key;
 if(r===1){h.style.transform='';h.style.transformOrigin='';h.style.width='';h.style.height='';h.style.right='';h.style.bottom=''}
 else{h.style.transformOrigin='0 0';h.style.transform='scale('+r+')';h.style.width=(innerWidth/r)+'px';h.style.height=(innerHeight/r)+'px';h.style.right='auto';h.style.bottom='auto'}
 try{window.v84Fit&&v84Fit()}catch(e){}
}
addEventListener('resize',()=>setTimeout(apply,60));
setInterval(apply,1500);
apply();
window.hud141=apply;
})();
