// ================= V104 · efeitos religados · progresso do admin protegido · interiores grandes em todas as casas =================
// 1) efeitos e partículas: liga de novo uma vez (se tinham ficado desligados nas configurações) e tira o modo leve
try{if(!localStorage.getItem('cloverFx104')){localStorage.setItem('cloverFx104','1');const was=!CFG.fx||!CFG.parts||CFG.fxl;CFG.fx=1;CFG.parts=1;CFG.fxl=false;try{localStorage.setItem('cloverFxl','0')}catch(e){}try{applyCfg()}catch(e){}if(was)setTimeout(()=>{try{toast('✨ Efeitos e partículas das magias foram religados.')}catch(e){}},4000)}}catch(e){}
// 2) grimório de administrador: guarda TODO o progresso antes de trocar e devolve se algo zerar
const AP104={k:()=>'cloverAdm104:'+(accUid()||'guest')};
const AP104F=['lv','exp','pts','st','inv','coins','honra','own','giros','sgiros','ggiros','gsgiros','agiros','cagiros','qd','qcd','codes','rel','kills','time','clan'];
function ap104Snap(){const o={};for(const f of AP104F)o[f]=JSON.parse(JSON.stringify(P[f]==null?null:P[f]));o.born=P.born;o.ts=Date.now();try{localStorage.setItem(AP104.k(),JSON.stringify(o))}catch(e){}try{v82S().adm104=o}catch(e){}return o}
function ap104Get(){let a=null,b=null;try{a=JSON.parse(localStorage.getItem(AP104.k()))}catch(e){}try{b=v82S().adm104}catch(e){}if(a&&b)return (a.ts||0)>=(b.ts||0)?a:b;return a||b}
function ap104Fix(why){const s=ap104Get();if(!s||!P.g)return false;const lost=(P.lv||1)<(s.lv||1)||((P.giros||0)+(P.ggiros||0)+(P.agiros||0)<(s.giros||0)+(s.ggiros||0)+(s.agiros||0)&&(P.lv||1)<=1);if(!lost)return false;
 for(const f of AP104F)if(s[f]!=null)P[f]=JSON.parse(JSON.stringify(s[f]));if(s.born&&GR[s.born])P.born=s.born;try{stats();P.hp=P.mhp;P.mp=P.mmp;buildBtns()}catch(e){}try{saveGame()}catch(e){}toast('🛡️ Seu progresso foi restaurado (nível '+P.lv+').');return true}
// maestria (nível de cada magia) guardada por grimório, para não perder ao trocar
function xpm104(){const v=v82S();v.xpm=v.xpm||{};return v.xpm}
{const _gg=giveGrim;giveGrim=function(id){const old=P.g&&P.g.id,adm=(GR[id]&&GR[id].adm)||(old&&GR[old]&&GR[old].adm);if(adm){try{if(old)xpm104()[old]=(P.xp||[]).slice()}catch(e){}}const r=_gg.apply(this,arguments);if(adm){try{const m=xpm104()[id];if(Array.isArray(m))P.xp=m.slice()}catch(e){}}return r}}
{const _g=window.v94Give;window.v94Give=function(id){if(typeof NK82!='undefined'&&NK82.admin)ap104Snap();const r=_g.apply(this,arguments);setTimeout(()=>ap104Fix('give'),300);return r}}
{const _b=window.v94Back;window.v94Back=function(){const r=_b.apply(this,arguments);setTimeout(()=>ap104Fix('back'),300);return r}}
{const _lg=loadGame;loadGame=function(sv){const r=_lg.apply(this,arguments);setTimeout(()=>{try{ap104Fix('load')}catch(e){}},1200);return r}}
let AP104T=0;{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);AP104T-=dt;if(AP104T<=0){AP104T=3;try{if(P.g&&P.g.adm)ap104Fix('tick')}catch(e){}}return r}}
// 3) interiores grandes (2 andares com interação) em todas as casas do mapa
const IN104={cottage:'Casa do Vilarejo',two:'Sobrado',stone:'Casa de Pedra',merchant:'Casa do Comerciante',rich:'Casa Nobre'};
for(const kind of Object.keys(IN104)){INTB[kind]=k=>{const v=+k.split('#')[1]||0;const R=tudorRoom('tudor:'+kind+'#'+v);R.title=IN104[kind];return R}}

