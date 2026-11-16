// ================= V116 · UNIÕES DEMONÍACAS: a CABEÇA do personagem fica original, duração/recarga na tela e proteção contra ativação dupla =================
(function(){
const U={last:0,cdZ:0,cdB:0,ze:100,zOn:false,bPrev:0};window.U116=U;
// ---------- 1) a pele demoníaca (dSkin) trocava o material de TODAS as malhas, inclusive rosto e cabelo. Agora tudo que está dentro da cabeça volta ao original (só os olhos mantêm o brilho do demônio).
{const _d=dSkin;dSkin=function(fk,L,F){const keep=[];try{const hs=L&&L.hs;if(hs)hs.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)&&o.material!==L.mE)keep.push([o,o.material])})}catch(e){}
 const sk=_d.apply(this,arguments);try{keep.forEach(([o,m])=>{if(o.material!==m)o.material=m});if(sk&&sk.reg){delete sk.reg['cabeça'];delete sk.reg['rosto'];delete sk.reg['cabelos']}}catch(e){}return sk}}
// ---------- 2) formas que tingem a pele inteira (Zagred, Forma Demoníaca do Belzebu): a cabeça usa uma cópia da pele com a cor original
function headIso(L,col){if(!L||!L.hs||!L.mS||L._hi)return;const m=L.mS.clone();m.color.setHex(col);m._keep=1;const sw=[];L.hs.traverse(o=>{if(o.isMesh&&o.material===L.mS){o.material=m;sw.push(o)}});L._hi={m,sw}}
function headUndo(L){if(!L||!L._hi)return;L._hi.sw.forEach(o=>{if(o.material===L._hi.m)o.material=L.mS});try{L._hi.m.dispose()}catch(e){}L._hi=null}
U.headIso=headIso;U.headUndo=headUndo;
function skinOf(){try{return P.look&&P.look.sk!=null?P.look.sk:PP.mS.color.getHex()}catch(e){return 0xf1c9a0}}
// ---------- 3) Zagred: energia própria (50 s) e recarga de 30 s · Belzebu: recarga de 20 s depois da Forma Demoníaca
{const _t=togUnion;togUnion=function(end){const now=performance.now();if(!end){if(now-U.last<700)return;U.last=now;try{const id=P.g&&P.g.id;
  if(id=='kotodama'&&!P.zg&&U.cdZ>0){toast('Zagred está se recompondo: espere '+Math.ceil(U.cdZ)+'s');return}
  if((id=='ossos'||id=='bzesp')&&window.ZB109&&ZB109.st==0&&U.cdB>0){toast('Belzebu está se recompondo: espere '+Math.ceil(U.cdB)+'s');return}
  if((typeof CS!='undefined'&&CS.on)||(window.ZB109&&ZB109.busy)||P.dcin)return}catch(e){}}
 return _t.apply(this,arguments)}}
// ---------- 4) painel da União: nome, tempo restante, recurso e recarga
const css=`#un116{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 62px);transform:translateX(-50%);z-index:29;display:none;min-width:190px;max-width:min(70vw,300px);padding:5px 10px 7px;border-radius:12px;background:linear-gradient(rgba(24,10,30,.9),rgba(10,6,16,.9));border:1px solid var(--uc,#c060ff);box-shadow:0 0 14px -2px var(--uc,#c060ff);color:#f4e6c4;font:700 11.5px Georgia,serif;pointer-events:none;text-align:center}
#un116 .n{display:flex;justify-content:space-between;gap:10px;white-space:nowrap}#un116 .n b{color:var(--uc,#c060ff);letter-spacing:.04em}
#un116 .b{height:6px;margin-top:4px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}#un116 .b i{display:block;height:100%;background:linear-gradient(90deg,var(--uc,#c060ff),#fff);transition:width .25s}
#un116.cd{border-color:#777;box-shadow:none}#un116.cd .b i{background:#888}#un116.cd .n b{color:#bbb}
body.cineon #un116,body.ovon #un116{display:none!important}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);const W=document.createElement('div');W.id='un116';W.innerHTML='<div class="n"><b></b><span></span></div><div class="b"><i></i></div>';document.body.appendChild(W);
function state(){const id=P.g&&P.g.id;if(!id)return null;
 if(id=='anti'){if(P.union)return{n:'UNIÃO · LIEBE',c:'#ff3a4a',s:(P.de||0)/3,f:(P.de||0)/100};if((P.ducd||0)>0)return{cd:1,n:'Liebe exausto',s:P.ducd,f:1-P.ducd/25};return null}
 if(id=='sombra'){if(P.nacht){const d=(NF[P.nf]&&NF[P.nf].drain)||2.45;return{n:(NF[P.nf]?NF[P.nf].n.replace('Unite Mode: ','UNITE · ').replace(' × ','×').slice(0,26).toUpperCase():'NACHT'),c:'#b070ff',s:(P.ne||0)/d,f:(P.ne||0)/100}}return null}
 if(id=='kotodama'){if(P.zg)return{n:'UNIÃO · ZAGRED',c:'#c060ff',s:U.ze/2,f:U.ze/100};if(U.cdZ>0)return{cd:1,n:'Zagred se recompõe',s:U.cdZ,f:1-U.cdZ/30};return null}
 if(id=='ossos'||id=='bzesp'||id=='zbunion'){const z=window.ZB109;if(z&&z.st==2)return{n:'FORMA DEMONÍACA · BELZEBU',c:'#8a5aff',s:P.mp/1.6,f:P.mp/Math.max(1,P.mmp)};if(z&&z.st==1)return{n:'MANIFESTAÇÃO · BELZEBU',c:'#8a5aff',s:-1,f:1};if(U.cdB>0)return{cd:1,n:'Belzebu se recompõe',s:U.cdB,f:1-U.cdB/20};return null}
 return null}
let acc=0;{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{dt=dt||0;
 if(U.cdZ>0)U.cdZ-=dt;if(U.cdB>0)U.cdB-=dt;
 // Zagred: liga/desliga, gasto e fim automático
 if(P.zg&&!U.zOn){U.zOn=true;U.ze=100;try{PP.mS.color.setHex(0x5a4a6e)}catch(e){}headIso(PP,skinOf())}
 if(P.zg){U.ze-=dt*2;if(U.ze<=0){U.ze=0;try{togZagred(true)}catch(e){}try{toast('A energia de Zagred acabou: a união terminou.')}catch(e){}}}
 if(!P.zg&&U.zOn){U.zOn=false;U.cdZ=30;headUndo(PP)}
 // Belzebu: cabeça original na Forma Demoníaca e recarga ao sair
 const z=window.ZB109;if(z){const on=z.st==2||(z.busy&&z.st>=1);if(on&&!U.bOn){U.bOn=true;headIso(PP,skinOf())}if(!on&&U.bOn&&!z.busy){U.bOn=false;headUndo(PP);U.cdB=20}}
 acc+=dt;if(acc>.2){acc=0;const s=run?state():null;if(!s){W.style.display='none'}else{W.style.display='block';W.classList.toggle('cd',!!s.cd);W.style.setProperty('--uc',s.c||'#888');W.firstChild.firstChild.textContent=s.n;W.firstChild.lastChild.textContent=s.s<0?'sem limite':(s.cd?'recarga ':'')+Math.max(0,Math.ceil(s.s))+'s';W.lastChild.firstChild.style.width=Math.round(Math.max(0,Math.min(1,s.f))*100)+'%'}}
 // outros jogadores: mesma regra da cabeça (cor de pele deles é guardada antes da forma)
 try{for(const k in MP.others){const o=MP.others[k],L=o&&o.L;if(!L||!L.mS)continue;const tint=o.nfk=='zagred'||o.zb2;if(!tint&&!L._hi)L._sk0=L.mS.color.getHex();if(tint&&!L._hi&&L._sk0!=null)headIso(L,L._sk0);if(!tint&&L._hi)headUndo(L)}}catch(e){}
}catch(e){}return r}}
})();

