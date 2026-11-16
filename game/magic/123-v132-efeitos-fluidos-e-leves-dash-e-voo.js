// ================= V132 · efeitos fluidos e leves, dash e voo como nos vídeos, botão de formas do Luck e botões sem sobreposição =================
(function(){
const X=window.X124;if(!X)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const G0=0xffd75a,TE=0x5fffd0,WH=0xffffff,CY=0x9ff6ff;
const GC={};const geo=(k,f)=>{if(!GC[k]){GC[k]=f();GC[k]._keep=1}return GC[k]};
// ---------- utilidades de geometria ----------
function merge(parts){let np=0,ni=0;const gs=parts.map(([g,m])=>{g=g.index?g:g;g.applyMatrix4(m);np+=g.attributes.position.count;ni+=g.index?g.index.count:g.attributes.position.count;return g});
 const pos=new Float32Array(np*3),nor=new Float32Array(np*3),idx=[];let o=0;gs.forEach(g=>{pos.set(g.attributes.position.array,o*3);nor.set(g.attributes.normal.array,o*3);if(g.index){for(const i of g.index.array)idx.push(i+o)}else{for(let i=0;i<g.attributes.position.count;i++)idx.push(i+o)}o+=g.attributes.position.count;g.dispose()});
 const r=new T.BufferGeometry();r.setAttribute('position',new T.BufferAttribute(pos,3));r.setAttribute('normal',new T.BufferAttribute(nor,3));r.setIndex(idx);return r}
const M4=(x,y,z,rx,rz)=>{const m=new T.Matrix4();m.makeRotationFromEuler(new T.Euler(rx||0,0,rz||0));m.setPosition(x,y,z);return m};
// silhueta em blocos (um único objeto): pose de corrida, igual aos ecos amarelos do vídeo
const gSil=()=>geo('sil',()=>merge([[new T.BoxGeometry(.5,.55,.28),M4(0,1.22,0,.15)],[new T.BoxGeometry(.38,.38,.38),M4(0,1.72,.04)],
 [new T.BoxGeometry(.17,.55,.17),M4(-.34,1.2,-.12,.9,.2)],[new T.BoxGeometry(.17,.55,.17),M4(.34,1.2,-.12,.9,-.2)],
 [new T.BoxGeometry(.2,.62,.2),M4(-.13,.55,.18,-.55)],[new T.BoxGeometry(.2,.62,.2),M4(.13,.5,-.2,.6)]]));
// silhueta parada (para ecos de pé)
const gSil2=()=>geo('sil2',()=>merge([[new T.BoxGeometry(.5,.6,.28),M4(0,1.2,0)],[new T.BoxGeometry(.38,.38,.38),M4(0,1.72,0)],
 [new T.BoxGeometry(.16,.6,.16),M4(-.34,1.2,0,0,.15)],[new T.BoxGeometry(.16,.6,.16),M4(.34,1.2,0,0,-.15)],[new T.BoxGeometry(.2,.62,.2),M4(-.13,.42,0)],[new T.BoxGeometry(.2,.62,.2),M4(.13,.42,0)]]));
// cópia leve do personagem: 1 objeto em vez de dezenas (deixa o jogo bem mais leve)
X.ghostCopy=function(col,op,dark){const m=dark?X.darkM(col,op):new T.MeshBasicMaterial({color:col,transparent:true,opacity:op,depthWrite:false});const g=new T.Group();const me=new T.Mesh(gSil2(),m);g.add(me);
 g.position.set(P.x,(P.y||0),P.z);g.rotation.y=P.f;g.userData.m=m;g.userData.ghost=1;return g};
// ---------- fluxo dourado (no lugar das explosões): espirais finas que sobem girando ----------
const gHelix=()=>geo('helix',()=>{const N=64,pos=new Float32Array(N*2*3),col=new Float32Array(N*2*3),idx=[];for(let i=0;i<N;i++){const u=i/(N-1),a=u*Math.PI*3.2,r=1-u*.55,y=u*2.4,w=.07*(1-u)+.015;
  for(let s=0;s<2;s++){const k=(i*2+s)*3,rr=r+(s?w:-w);pos[k]=Math.cos(a)*rr;pos[k+1]=y;pos[k+2]=Math.sin(a)*rr;const b=Math.sin(u*Math.PI);col[k]=col[k+1]=col[k+2]=b}
  if(i<N-1){const b=i*2;idx.push(b,b+1,b+2,b+1,b+3,b+2)}}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('color',new T.BufferAttribute(col,3));g.setIndex(idx);return g});
function flow(x,y,z,R,col,dur){col=col||G0;dur=dur||.8;const g=new T.Group();g.position.set(x,Math.max(0,y-1.1),z);S.add(g);const L=[];const n=Q()<.6?2:3;
 for(let k=0;k<n;k++){const m=new T.Mesh(gHelix(),new T.MeshBasicMaterial({color:k==1?WH:col,vertexColors:true,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));m.rotation.y=k/n*6.28;g.add(m);L.push(m)}
 const gl=X.glow(col,R*1.1,0);gl.position.y=1.1;g.add(gl);
 kfx({u:(F,dt)=>{const t=F.t,u=Math.min(1,t/dur),o=Math.sin(u*Math.PI);L.forEach((m,k)=>{m.rotation.y+=dt*(4+k);m.material.opacity=.95*o;m.scale.set(R*(.5+u*.7),R*(.4+u*.9),R*(.5+u*.7))});gl.material.opacity=.35*o;
   if(Math.random()<.5*Q())fxp({x:x+(Math.random()-.5)*R,y:g.position.y+Math.random()*R*2,z:z+(Math.random()-.5)*R,c:Math.random()<.5?col:WH,n:1,sp:.3,sz:.06,life:.5,up:1.5});return t<dur},end:()=>X.dispose(g)})}
X.flow=flow;X.goldBurst=function(x,y,z,R,col){flow(x,y,z,Math.max(.6,(R||1)*.55),col||G0,.75)};
// clarões mais suaves (sem tela branca)
{const _fl=X.flash;X.flash=function(c,op,dur){return _fl.call(this,c,Math.min(op||0,.22),dur)}}
// ---------- anéis do tempo nos braços (leves, verde-água e dourado, como no vídeo) ----------
X.armClocks=function(dur){const L=[];for(const i of[0,1])for(let k=0;k<2;k++){const r=new T.Mesh(geo('ar'+k,()=>new T.TorusGeometry(k?.2:.28,.022,5,28)),X.addM(k?G0:TE,.0));S.add(r);L.push({r,i,k})}
 kfx({u:(F,dt)=>{const t=F.t,o=Math.min(1,t*6)*(t>dur-.25?Math.max(0,(dur-t)/.25):1);L.forEach(q=>{const h=X.hand(q.i);q.r.position.copy(h);q.r.position.y+=q.k*.08;q.r.rotation.x=Math.PI/2+Math.sin(t*3+q.i)*.3;q.r.rotation.z+=dt*(q.k?-6:5);q.r.material.opacity=.9*o});return t<dur},end:()=>L.forEach(q=>X.dispose(q.r))})};
// ---------- rastro de fita (para voo e dash) ----------
function ribbon(N,w,c1,c2){const pos=new Float32Array(N*2*3),col=new Float32Array(N*2*3),idx=[];for(let i=0;i<N-1;i++){const b=i*2;idx.push(b,b+1,b+2,b+1,b+3,b+2)}const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('color',new T.BufferAttribute(col,3));g.setIndex(idx);
 const m=new T.Mesh(g,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:1,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));m.frustumCulled=false;const A=new T.Color(c1),B=new T.Color(c2);
 const pts=[];const R={m,pts,N,w,add(p){pts.unshift(p.clone());if(pts.length>N)pts.pop()},upd(op){const n=pts.length,cp=cam.position,tmp=new T.Vector3(),side=new T.Vector3(),view=new T.Vector3();for(let i=0;i<N;i++){const p=pts[Math.min(i,n-1)]||new T.Vector3(),q=pts[Math.min(i+1,n-1)]||p;tmp.subVectors(p,q);if(tmp.lengthSq()<1e-6)tmp.set(0,0,1);view.subVectors(cp,p);side.crossVectors(tmp,view).normalize();const u=i/(N-1),ww=w*(1-u)*(i<n?1:0);
   for(let s=0;s<2;s++){const k=(i*2+s)*3,sg=s?1:-1;pos[k]=p.x+side.x*ww*sg;pos[k+1]=p.y+side.y*ww*sg;pos[k+2]=p.z+side.z*ww*sg;const c=A.clone().lerp(B,u),b=(1-u)*(op==null?1:op);col[k]=c.r*b;col[k+1]=c.g*b;col[k+2]=c.b*b}}
  g.attributes.position.needsUpdate=true;g.attributes.color.needsUpdate=true}};return R}
X.ribbon=ribbon;
// ---------- DASH DO TEMPO como no vídeo: fila de silhuetas amarelas + risco de luz + anel no fim ----------
X.timeDashFx=function(wx,wz){const sx=P.x,sz=P.z,y0=(P.y||0);const mats=[],gs=[];const n=5;
 for(let k=0;k<n;k++)tmr.push({t:.03+k*.05,f:()=>{const m=new T.MeshBasicMaterial({color:k%2?0xffc81e:0xffdd33,transparent:true,opacity:.95,depthWrite:false});const g=new T.Mesh(gSil(),m);g.position.set(P.x,(P.y||0),P.z);g.rotation.y=Math.atan2(wx,wz);S.add(g);gs.push({g,m,t:0})}});
 const rb=ribbon(16,.16,G0,WH);S.add(rb.m);let trail=0;
 const ck=tClock(1.15,'g');ck.rotation.x=-Math.PI/2;ck.position.set(sx,.06,sz);S.add(ck);
 kfx({u:(F,dt)=>{const t=F.t;gs.forEach(o=>{o.t+=dt;o.m.opacity=Math.max(0,.95-o.t*1.5)});
   if(t<.32){rb.add(new T.Vector3(P.x,(P.y||0)+1.1,P.z))}rb.upd(.7*Math.max(0,1-Math.max(0,t-.25)*3));tClockTick(ck,dt,Math.max(0,1-t/.7),[-7,-2,-.5]);
   if(t>.3&&!F.e){F.e=1;endSwirl(P.x,P.z)}return t<.75},end:()=>{gs.forEach(o=>X.dispose(o.g));X.dispose(rb.m);X.dispose(ck)}})};
function endSwirl(x,z){const L=[];for(let k=0;k<3;k++){const m=new T.Mesh(geo('arc'+k,()=>new T.TorusGeometry(.9+k*.35,.03,4,40,4.2)),X.addM(k==1?G0:WH,.9));m.rotation.x=-Math.PI/2+(k-1)*.25;m.position.set(x,.5+k*.35,z);S.add(m);L.push(m)}
 kfx({u:(F,dt)=>{L.forEach((m,k)=>{m.rotation.z+=dt*(9-k*2);m.scale.setScalar(1+F.t*1.2);m.material.opacity=Math.max(0,.9-F.t*2.2)});return F.t<.45},end:()=>L.forEach(X.dispose)})}
// ---------- VOO DO TEMPO como no vídeo: círculo de relógio atrás, grimório aberto sobre a cabeça e rastro de cometa ----------
const FV={on:false};
function openBook(){const g=new T.Group(),pm2=new T.MeshBasicMaterial({color:0xfafcff,side:T.DoubleSide});for(let k=0;k<9;k++){const p=new T.Mesh(geo('bpg',()=>new T.PlaneGeometry(.34,.46)),pm2);p.position.set(0,0,0);p.rotation.y=(k-4)*.32;p.translateX(.17);g.add(p)}
 const gl=X.glow(TE,1.4,.35);g.add(gl);return g}
X.flyFxOn=function(){FV.on=true;FV.t=0;FV.cl=tClock(1.9,'g');S.add(FV.cl);FV.book=openBook();S.add(FV.book);FV.rb=ribbon(30,.38,CY,0x2a6cff);S.add(FV.rb.m);FV.rb2=ribbon(30,.12,WH,CY);S.add(FV.rb2.m);FV.bolt=X.bolt(CY,.04,.9,8);S.add(FV.bolt);
 FV.rings=[];for(let k=0;k<4;k++){const r=new T.Mesh(geo('fr',()=>new T.TorusGeometry(.16,.02,4,20)),X.addM(TE,.85));S.add(r);FV.rings.push(r)}
 try{const pp=GR.tempo.p=GR.tempo.p||{};FV.x0=pp.spd||0;pp.spd=FV.x0+.9}catch(e){}flow(P.x,(P.y||0)+1,P.z,1.2,TE,.7)};
X.flyFxOff=function(){if(!FV.on)return;FV.on=false;[FV.cl,FV.book,FV.rb&&FV.rb.m,FV.rb2&&FV.rb2.m,FV.bolt].forEach(o=>{if(o)X.dispose(o)});(FV.rings||[]).forEach(X.dispose);FV.rings=[];try{GR.tempo.p.spd=FV.x0||0}catch(e){}};
X.flyFxTick=function(dt,mv){if(!FV.on)return;FV.t+=dt;const t=FV.t,y=P.y||0,sf=Math.sin(P.f),cf=Math.cos(P.f);
 // círculo de relógio atrás do personagem (aparece forte no começo e fica fraco)
 if(FV.cl){FV.cl.position.set(P.x-sf*.7,y+1.3,P.z-cf*.7);FV.cl.lookAt(P.x+sf*5,y+1.3,P.z+cf*5);tClockTick(FV.cl,dt,t<.8?1:Math.max(.0,1-(t-.8)*2),[-3,-1,-.2])}
 // grimório aberto flutuando sobre a cabeça, páginas abanando
 if(FV.book){FV.book.position.set(P.x,y+2.75+Math.sin(t*2.5)*.06,P.z);FV.book.rotation.y=P.f;FV.book.children.forEach((p,k)=>{if(p.isMesh&&p.geometry===GC.bpg){p.rotation.x=Math.sin(t*6+k)*.08}})}
 // anéis verde-água girando em volta dos ombros
 FV.rings.forEach((r,k)=>{const a=t*3+k*1.57;r.position.set(P.x+Math.cos(a)*.6,y+1.6+Math.sin(t*2+k)*.1,P.z+Math.sin(a)*.6);r.lookAt(cam.position)});
 // rastro de cometa quando anda
 const head=new T.Vector3(P.x,y+1.1,P.z);const moving=mv>1.5;if(moving){FV.rb.add(head);FV.rb2.add(head)}else{FV.rb.pts.pop();FV.rb2.pts.pop();if(FV.rb.pts.length){FV.rb.pts[0].copy(head);FV.rb2.pts[0].copy(head)}}FV.rb.upd(1);FV.rb2.upd(1);
 if(FV.bolt){const p=FV.rb.pts,ok=moving&&p.length>12&&Math.random()<.35;FV.bolt.visible=ok;if(ok){FV.bolt.userData.set(p[2],p[12],.5)}}
 if(moving&&Math.random()<.5*Q())fxp({x:P.x,y:y+1.1,z:P.z,c:Math.random()<.5?WH:CY,n:1,sp:.4,sz:.07,life:.4})};
// ---------- BOTÃO DE FORMAS DO LUCK (igual ao dos demônios) ----------
const FORMS=[{t:'lkdemon',n:'Demônio do Trovão',lv:22,mp:40,d:40,cd:40,ic:'<path d="M5 10l2-6 3 4h4l3-4 2 6-2 9H7z" fill="none" stroke="#7ff" stroke-width="1.6"/><path d="M9 12l2 2-2 2M15 12l-2 2 2 2" stroke="#fff" stroke-width="1.4"/>'},
 {t:'lkform',n:'Demônio de Batalha Relâmpago',lv:30,mp:36,d:30,cd:45,ic:'<path d="M12 3l-4 8h3l-2 9 7-11h-4l3-6z" fill="#9ff" stroke="#fff" stroke-width=".8"/>'},
 {t:'lkformb',n:'Demônio de Batalha Relâmpago Negro',lv:45,mp:50,d:45,cd:60,ic:'<path d="M12 3l-4 8h3l-2 9 7-11h-4l3-6z" fill="#111" stroke="#ff3050" stroke-width="1.2"/>'}];
const FB={cd:{}};X.FB132=FB;
function isL(){return !!(P.g&&P.g.id=='raio'&&P.on)}
function fBtn(){let b=document.getElementById('a-lkf');if(!b){b=document.createElement('button');b.id='a-lkf';b.setAttribute('aria-label','Formas do Relâmpago');b.title='Formas do Relâmpago (K)';b.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 9l2-5 3 3h2l3-3 2 5-2 10H8z" fill="#06141a" stroke="#6ff4ff" stroke-width="1.5"/><path d="M12.5 8l-2.5 5h2l-1 4 3.5-6h-2l1.5-3z" fill="#e8ffff"/></svg><i></i>';
  b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(!run)return;if(X.L.form){X.formEnd();return}menu()});document.body.appendChild(b)}return b}
function menu(){let m=document.getElementById('lkf132');if(m&&m.classList.contains('on')){m.classList.remove('on');return}if(!m){m=document.createElement('div');m.id='lkf132';document.body.appendChild(m)}
 m.innerHTML=FORMS.map((f,i)=>{const lk=P.lv<f.lv,cd=Math.max(0,(FB.cd[f.t]||0)-performance.now()/1000);return '<button data-i="'+i+'" class="'+(lk?'lk':'')+'">'+'<svg viewBox="0 0 24 24">'+f.ic+'</svg><b>'+f.n+'</b><small>'+(lk?'Nv '+f.lv:cd>0?Math.ceil(cd)+' s':f.mp+' mana')+'</small></button>'}).join('');
 m.querySelectorAll('button').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();m.classList.remove('on');pick(+b.dataset.i)}));
 const a=document.getElementById('a-lkf').getBoundingClientRect();m.style.left=Math.max(6,Math.min(innerWidth-236,a.left+a.width/2-115))+'px';m.style.bottom=(innerHeight-a.top+8)+'px';m.classList.add('on')}
function pick(i){const f=FORMS[i];if(!f||!isL())return;if(P.lv<f.lv){toast('Libera no nível '+f.lv+'.');return}const now=performance.now()/1000;if((FB.cd[f.t]||0)>now){toast('Forma em recarga: '+Math.ceil(FB.cd[f.t]-now)+' s');return}
 const cost=Math.round(f.mp*((typeof MCF=='object'&&MCF.raio)||1));if(P.mp<cost){toast('Mana insuficiente.');return}const pre=window.PRE124&&PRE124[f.t];if(pre&&pre()===false)return;
 P.mp-=cost;FB.cd[f.t]=now+f.cd;try{startPose('kdom')}catch(e){}try{MP.castN=(MP.castN||0)+1}catch(e){}const d=f.d*(1+.25*((P.lv/5)|0)*.2);try{window.C124[f.t](d,Math.sin(P.f),Math.cos(P.f))}catch(e){try{ERR122(e)}catch(_){}}}
X.pickForm=pick;
addEventListener('keydown',e=>{if(e.code==='KeyK'&&!e.repeat&&run&&isL()&&!(document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName))){if(X.L.form)X.formEnd();else menu()}});
// ---------- posição dos botões extras: em cima do grupo pequeno (grimório/união), nunca um em cima do outro ----------
function slotRect(){const ids=['a-grim','a-union','a-ctr','a-sylph'];let L=1e9,T2=1e9,R2=-1e9,B=-1e9,n=0;for(const id of ids){const e=document.getElementById(id);if(!e)continue;const r=e.getBoundingClientRect();if(r.width<2||getComputedStyle(e).display=='none'||getComputedStyle(e).visibility=='hidden')continue;n++;L=Math.min(L,r.left);T2=Math.min(T2,r.top);R2=Math.max(R2,r.right);B=Math.max(B,r.bottom)}return n?{l:L,t:T2,r:R2,b:B}:null}
function place(el,size,rc){const x=Math.round((rc.l+rc.r)/2-size/2),y=Math.round(rc.t-size-8),k=x+'_'+y+'_'+size;if(el._k132===k)return;el._k132=k;for(const [p,v] of[['position','fixed'],['left',x+'px'],['top',y+'px'],['right','auto'],['bottom','auto'],['width',size+'px'],['height',size+'px']])el.style.setProperty(p,v,'important')}
function layout(){const rc=slotRect();const jb=document.getElementById('a-jump');const size=jb?Math.round(jb.getBoundingClientRect().width*.9):48;
 const lk=fBtn();const showL=isL()&&run;lk.style.display=showL?'':'none';if(showL&&rc){place(lk,size,rc);const now=performance.now()/1000;let mx=0;for(const f of FORMS){const c=(FB.cd[f.t]||0)-now;if(c>mx)mx=c}lk.classList.toggle('act',!!X.L.form);const ii=lk.querySelector('i');const txt=X.L.form?'ON':mx>0?Math.ceil(mx)+'s':'';if(ii.textContent!==txt)ii.textContent=txt}
 if(!showL){const m=document.getElementById('lkf132');if(m)m.classList.remove('on')}
 if(!rc)return;for(const id of['a-nacht','a-tfly']){const e=document.getElementById(id);if(!e)continue;const r=e.getBoundingClientRect();if(r.width<2)continue;place(e,size,rc)}}
{const _u=tUpdate;let lk=0;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(++lk%8==0)layout()}catch(e){}return r}}
addEventListener('resize',()=>setTimeout(()=>{try{layout()}catch(e){}},200));
setInterval(()=>{try{const b=document.getElementById('a-lkf');if(b&&!run){b.style.display='none';const m=document.getElementById('lkf132');if(m)m.classList.remove('on')}}catch(e){}},250);
const css=document.createElement('style');css.textContent=
 '#a-lkf{position:fixed;z-index:8;border-radius:14px;border:2px solid #2a8aa0;background:radial-gradient(circle at 50% 35%,#0e2a33,#02080a);padding:6px;box-shadow:0 0 10px #2a8aa088}#a-lkf svg{width:100%;height:100%}#a-lkf i{position:absolute;left:0;right:0;bottom:2px;font:700 10px/1 system-ui;color:#bff;text-align:center;font-style:normal}#a-lkf.act{border-color:#9ff;box-shadow:0 0 16px #6ff4ff,inset 0 0 10px #6ff4ff88}'
 +'#lkf132{position:fixed;z-index:30;display:none;flex-direction:column;gap:6px;width:230px;padding:8px;border-radius:12px;background:#061418ee;border:1px solid #2a8aa0}#lkf132.on{display:flex}#lkf132 button{display:grid;grid-template-columns:34px 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center;text-align:left;padding:6px;border-radius:10px;border:1px solid #2a6a78;background:#0b2228;color:#dff;font:inherit}#lkf132 button svg{grid-row:1/3;width:34px;height:34px}#lkf132 b{font-size:13px}#lkf132 small{opacity:.75;font-size:11px}#lkf132 button.lk{opacity:.45}';
document.head.appendChild(css);
})();

