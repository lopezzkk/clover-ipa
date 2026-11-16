// ================= V82 · Fase 1a: Magia da Terra removida =================
// Contas antigas com Terra viram Fogo (mesma raridade Comum) ao carregar.
(function(){const fix=sv=>{if(!sv)return sv;let ch=0;if(sv.g=='terra'){sv.g='fogo';ch=1}if(sv.born=='terra'){sv.born='fogo';ch=1}if(ch)sv._v82terra=1;return sv};
 const _lg=loadGame;loadGame=function(sv){fix(sv);const r=_lg.apply(this,arguments);if(sv&&sv._v82terra){delete sv._v82terra;setTimeout(()=>{try{toast('A Magia da Terra foi removida do jogo: seu grimório virou Fogo (mesma raridade).');saveGame()}catch(e){}},1500)}return r};
 window.v82FixSave=fix})();
try{for(const T0 of[ANI,SKI,MK])for(const k in T0)if(/^Earth:/.test(k))delete T0[k]}catch(e){}

