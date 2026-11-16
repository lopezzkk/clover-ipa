// ================= V134 · COMBOS DE MAGIA ENTRE JOGADORES + LIVRO DE COMBOS =================
// Cada magia deixa uma marca de elemento no chão por 3 s. Se OUTRO jogador acerta uma magia que combina em cima da marca,
// o combo dispara: efeito próprio, nome na tela dos dois e bônus para os dois. Sem servidor: vai junto com a posição de cada jogador.
(function(){
const X=window.X124;if(!X||!X.elOf)return;const Q=()=>{try{return KQ()*(window.VB140?VB140.f:1)}catch(e){return 1}};
const COL={fogo:0xff7a1a,agua:0x3aa8ff,vento:0x7dffb0,luz:0xfff3b0,raio:0x6ff4ff,tempo:0xffd75a,sombra:0x9a40ff,anti:0xff2040,terra:0xc89a5a,arcano:0xd0a0ff};
const NOME={fogo:'Fogo',agua:'Água',vento:'Vento',luz:'Luz',raio:'Relâmpago',tempo:'Tempo',sombra:'Sombra',anti:'Anti-Magia',terra:'Terra',arcano:'Arcano'};
// combos: [marca, magia por cima] (os de par valem nas duas ordens)
const CB=[
 {id:'tornado',n:'Tornado de Fogo',a:'vento',b:'fogo',par:1,d:'Tornado de chamas que puxa e queima'},
 {id:'choque',n:'Choque Condutor',a:'agua',b:'raio',par:1,d:'A eletricidade corre pela água e atordoa todos'},
 {id:'vapor',n:'Névoa de Vapor',a:'agua',b:'fogo',par:1,d:'Nuvem quente que deixa os inimigos lentos e cegos'},
 {id:'tempestade',n:'Tempestade',a:'vento',b:'raio',par:1,d:'Raios caindo dentro do redemoinho'},
 {id:'nevasca',n:'Nevasca',a:'agua',b:'vento',par:1,d:'Congela os inimigos por um tempo'},
 {id:'eclipse',n:'Eclipse',a:'sombra',b:'luz',par:1,d:'Luz e sombra giram juntas e causam muito dano'},
 {id:'plasma',n:'Plasma',a:'fogo',b:'raio',par:1,d:'Corrente de fogo elétrico que atravessa a área'},
 {id:'lanca',n:'Lança Celestial',a:'luz',b:'raio',par:1,d:'Coluna de luz que cai do céu'},
 {id:'chamanegra',n:'Chama Negra',a:'sombra',b:'fogo',par:1,d:'Fogo escuro que queima por mais tempo'},
 {id:'lama',n:'Pântano',a:'terra',b:'agua',par:1,d:'Lama que prende os inimigos'},
 {id:'eco',n:'Eco Temporal',a:'tempo',b:'*',d:'A magia acontece de novo, sozinha, 1 s depois'},
 {id:'quebra',n:'Quebra Mágica',a:'*',b:'anti',d:'Apaga a marca e causa dano extra'}];
X.CB134=CB;
function find(a,b){if(a==b)return null;for(const c of CB){if(c.b=='anti'&&b=='anti')return c;if(c.a=='tempo'&&a=='tempo'&&b!='tempo')return c;if((c.a==a&&c.b==b)||(c.par&&c.a==b&&c.b==a))return c}return null}
// ---------- livro (descobertos) e limite diário de bônus ----------
const KEY='clv_cb134';const ST=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}})();ST.d=ST.d||{};const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(ST))}catch(e){}};
const today=()=>new Date().toISOString().slice(0,10);
function reward(c,partner){if(ST.day!==today()){ST.day=today();ST.n=0}ST.n=(ST.n||0)+1;const first=!ST.d[c.id];ST.d[c.id]=(ST.d[c.id]||0)+1;save();
 if(ST.n<=30){const co=15+Math.round((P.lv||1)/2)+(first?50:0);P.coins+=co;try{gainXP(Math.max(5,Math.round(needXP(P.lv)*.03)))}catch(e){}try{dmgNum(P.x,3.2,P.z,'+'+co+' moedas',0,'xp')}catch(e){}}
 try{banner('COMBO: '+c.n.toUpperCase()+'!',(partner?'com '+partner:'')+(first?' · combo novo no Livro!':''),'#ffd23f')}catch(e){}X.ev('combo',1,c)}
// ---------- efeitos dos combos (dano só nos inimigos deste celular) ----------
const base=()=>40+(P.lv||1)*7;
function area(x,z,R,mult,ef,each){return X.hitArea(x,z,R,base()*mult,ef||{}).map(e=>{if(each)each(e);return e})}
function ringFx(x,z,R,col,dur){const m=new T.Mesh(new T.RingGeometry(R*.92,R,48),X.addM(col,.0));m.rotation.x=-Math.PI/2;m.position.set(x,.08,z);S.add(m);kfx({u:F=>{m.material.opacity=.7*Math.sin(Math.min(1,F.t/dur)*Math.PI);m.rotation.z+=.03;return F.t<dur},end:()=>X.dispose(m)})}
function spiral(x,z,col,col2,h,R,dur,spd){const g=new T.Group();g.position.set(x,0,z);S.add(g);const L=[];for(let k=0;k<3;k++){const pts=[];for(let i=0;i<=40;i++){const u=i/40,a=u*Math.PI*4+k*2.09;pts.push(new T.Vector3(Math.cos(a)*R*(.35+u*.65),u*h,Math.sin(a)*R*(.35+u*.65)))}const tb=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts),48,.06,4,false),X.addM(k==1?col2:col,.0));g.add(tb);L.push(tb)}
 kfx({u:(F,dt)=>{const o=Math.sin(Math.min(1,F.t/dur)*Math.PI);g.rotation.y+=dt*(spd||5);L.forEach(m=>m.material.opacity=.85*o);if(Math.random()<.6*Q())fxp({x:x+(Math.random()-.5)*R*1.4,y:Math.random()*h,z:z+(Math.random()-.5)*R*1.4,c:Math.random()<.5?col:col2,n:1,sp:.6,sz:.09,life:.5,up:2});return F.t<dur},end:()=>{L.forEach(m=>m.geometry.dispose());X.dispose(g)}})}
function smoke(x,z,col,R,dur){const L=[];for(let k=0;k<Math.round(8*Math.min(1,Q()))+3;k++){const s=X.smoke(col,R*.9,0);s.position.set(x+(Math.random()-.5)*R*1.4,.6+Math.random()*1.4,z+(Math.random()-.5)*R*1.4);S.add(s);L.push(s)}kfx({u:F=>{const o=Math.sin(Math.min(1,F.t/dur)*Math.PI);L.forEach((s,k)=>{s.material.opacity=.55*o;s.position.y+=.004;s.material.rotation+=.003*(k%2?1:-1)});return F.t<dur},end:()=>L.forEach(X.dispose)})}
function sky(x,z,col,n,R,dly,mult){for(let k=0;k<n;k++)tmr.push({t:dly+k*.18,f:()=>{const a=Math.random()*6.28,r=Math.random()*R,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;const b=X.bolt(col,.14,.95,12);S.add(b);const gl=X.glow(0xffffff,2.4,.9);gl.position.set(px,.8,pz);S.add(gl);try{X.snd('zap',.5)}catch(e){}kfx({u:F=>{b.visible=Math.random()<.9;b.userData.set(new T.Vector3(px,20,pz),new T.Vector3(px,0,pz),1);b.material.opacity=Math.max(0,.95-F.t*3);gl.material.opacity=Math.max(0,.9-F.t*4);return F.t<.35},end:()=>{X.dispose(b);X.dispose(gl)}});area(px,pz,2.2,.35,{},e=>X.stun(e,.5))}})}
const FX={
 tornado:(x,z,dmg)=>{spiral(x,z,0xff7a1a,0xffd060,6,2.6,3,7);ringFx(x,z,3.2,0xff7a1a,3);if(dmg){let k=0;kfx({u:(F,dt)=>{for(const e of enemies){if(e.hp<=0)continue;const dx=x-e.x,dz=z-e.z,d=Math.hypot(dx,dz);if(d<6&&d>.6){e.x+=dx/d*dt*4;e.z+=dz/d*dt*4}}if((k+=dt)>.5){k=0;area(x,z,3.2,.22,{b:1})}return F.t<3}})}},
 choque:(x,z,dmg)=>{ringFx(x,z,4.5,0x6ff4ff,1.2);const es=enemies.filter(e=>e.hp>0&&Math.hypot(e.x-x,e.z-z)<6).slice(0,6);const bs=[];for(let i=0;i<Math.max(3,es.length);i++){const b=X.bolt(0x9ff6ff,.05,.95,8);S.add(b);bs.push(b)}kfx({u:F=>{bs.forEach((b,i)=>{const A=es[i]||{x:x+Math.cos(i*2)*3,z:z+Math.sin(i*2)*3},B=es[(i+1)%Math.max(1,es.length)]||{x,z};b.visible=Math.random()<.8;b.userData.set(new T.Vector3(A.x,1,A.z),new T.Vector3(B.x,1,B.z),.5)});return F.t<1.2},end:()=>bs.forEach(X.dispose)});if(dmg)area(x,z,6,.9,{},e=>X.stun(e,1.6))},
 vapor:(x,z,dmg)=>{smoke(x,z,0xf4f4f4,3.2,4);ringFx(x,z,4,0xffffff,4);if(dmg)area(x,z,4.5,.5,{sl:1},e=>{e.sl=Math.max(e.sl||0,4);e.cast=0})},
 tempestade:(x,z,dmg)=>{spiral(x,z,0x7dffb0,0xffffff,5,3,2.6,6);sky(x,z,0x9ff6ff,7,3.5,.2,dmg?1:0)},
 nevasca:(x,z,dmg)=>{ringFx(x,z,4.5,0xcff4ff,3);for(let k=0;k<Math.round(40*Q());k++)fxp({x:x+(Math.random()-.5)*8,y:3+Math.random()*2,z:z+(Math.random()-.5)*8,c:0xeaffff,n:1,sp:.4,sz:.1,life:1.6,up:-1.5});if(dmg)area(x,z,4.5,.6,{},e=>X.stun(e,2.2))},
 eclipse:(x,z,dmg)=>{const d=new T.Mesh(new T.CircleGeometry(2.2,40),new T.MeshBasicMaterial({color:0x050008,transparent:true,opacity:0,side:T.DoubleSide}));const rim=new T.Mesh(new T.RingGeometry(2.2,2.7,48),X.addM(0xfff3b0,0));const g=new T.Group();g.add(d,rim);g.position.set(x,4.5,z);S.add(g);kfx({u:F=>{g.lookAt(cam.position);const o=Math.sin(Math.min(1,F.t/2)*Math.PI);d.material.opacity=.9*o;rim.material.opacity=.95*o;rim.rotation.z+=.05;if(F.t>1&&!F.h){F.h=1;if(dmg)area(x,z,5,1.6,{});ringFx(x,z,5,0x9a40ff,.8);ringFx(x,z,4,0xfff3b0,.8)}return F.t<2},end:()=>X.dispose(g)})},
 plasma:(x,z,dmg)=>{spiral(x,z,0xff5a1a,0x9ff6ff,1.6,3.5,2,9);if(dmg){let k=0;kfx({u:(F,dt)=>{if((k+=dt)>.4){k=0;area(x,z,3.8,.3,{b:1})}return F.t<2}})}},
 lanca:(x,z,dmg)=>{const p=new T.Mesh(new T.CylinderGeometry(.9,.9,30,16,1,true),X.addM(0xfff6c8,0));p.position.set(x,15,z);S.add(p);const c=new T.Mesh(new T.CylinderGeometry(.25,.25,30,10,1,true),X.addM(0xffffff,0));c.position.copy(p.position);S.add(c);kfx({u:F=>{const o=Math.sin(Math.min(1,F.t/1.2)*Math.PI);p.material.opacity=.6*o;c.material.opacity=.95*o;p.scale.set(1+F.t,1,1+F.t);if(F.t>.3&&!F.h){F.h=1;if(dmg)area(x,z,3.5,1.3,{},e=>X.stun(e,.8));ringFx(x,z,3.5,0xfff3b0,.8)}return F.t<1.2},end:()=>{X.dispose(p);X.dispose(c)}})},
 chamanegra:(x,z,dmg)=>{spiral(x,z,0x3a0a5a,0xff5a1a,3,2.4,3.5,4);ringFx(x,z,3,0x9a40ff,3.5);if(dmg){let k=0;kfx({u:(F,dt)=>{if((k+=dt)>.5){k=0;area(x,z,3,.25,{b:1})}return F.t<3.5}})}},
 lama:(x,z,dmg)=>{const m=new T.Mesh(new T.CircleGeometry(4,32),new T.MeshBasicMaterial({color:0x4a3018,transparent:true,opacity:0,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.06,z);S.add(m);kfx({u:F=>{m.material.opacity=.75*Math.sin(Math.min(1,F.t/3.5)*Math.PI);if(dmg&&!F.h){F.h=1;area(x,z,4,.4,{},e=>X.stun(e,2.6))}return F.t<3.5},end:()=>X.dispose(m)})},
 eco:(x,z,dmg,info)=>{const c=tClock(1.4,'g');c.position.set(x,2.6,z);S.add(c);kfx({u:(F,dt)=>{c.lookAt(cam.position);tClockTick(c,dt,Math.sin(Math.min(1,F.t/1.4)*Math.PI),[-6,-2,-.4]);if(F.t>1&&!F.h){F.h=1;try{if(dmg&&info&&info.t){xCast(info.t,info.d*.6,info.dx,info.dz)}else if(dmg)area(x,z,4,.8,{})}catch(e){if(dmg)area(x,z,4,.8,{})}}return F.t<1.4},end:()=>X.dispose(c)})},
 quebra:(x,z,dmg)=>{const L=[];for(let k=0;k<10;k++){const m=new T.Mesh(X.geo('crack'),X.addM(0xff2040,.9));m.rotation.set(-Math.PI/2,0,k/10*6.28);m.position.set(x,.07,z);m.scale.setScalar(1.2+Math.random()*.6);S.add(m);L.push(m)}kfx({u:F=>{L.forEach(m=>m.material.opacity=Math.max(0,.9-F.t));return F.t<1},end:()=>L.forEach(X.dispose)});if(dmg)area(x,z,4,1.1,{})}};
// ---------- marcas no chão ----------
const MARKS=[];// {el,x,z,t(local s),own,peer,nm,n}
function markFx(m){const g=new T.Group();g.position.set(m.x,.06,m.z);const r=new T.Mesh(new T.RingGeometry(1.8,2.1,40),X.addM(COL[m.el]||0xffffff,0));r.rotation.x=-Math.PI/2;const d=new T.Mesh(new T.CircleGeometry(1.8,32),X.addM(COL[m.el]||0xffffff,0));d.rotation.x=-Math.PI/2;g.add(r,d);S.add(g);m.g=g;m.r=r;m.d=d}
function addMark(m){m.t=performance.now()/1000;markFx(m);MARKS.push(m);while(MARKS.length>12){const o=MARKS.shift();X.dispose(o.g)}}
X.addMark134=(el,x,z,peer,nm)=>addMark({el,x,z,peer:peer||'teste',nm:nm||'Amigo',own:false,n:Math.random()});
function markTick(){const now=performance.now()/1000;for(let i=MARKS.length-1;i>=0;i--){const m=MARKS[i],a=now-m.t;if(a>3.2||m.used){X.dispose(m.g);MARKS.splice(i,1);continue}const o=Math.min(1,a*5)*Math.min(1,(3.2-a)/.5);m.r.material.opacity=.75*o;m.d.material.opacity=.14*o;m.r.rotation.z+=.02}}
// ---------- quando eu lanço uma magia ----------
const ME={n:0,c:0,last:0};
function myPoint(){const tg=(()=>{try{return chronoTarget(14)}catch(e){return null}})();return tg?{x:tg.x,z:tg.z}:{x:P.x+Math.sin(P.f)*5,z:P.z+Math.cos(P.f)*5}}
let lastCast=null;
{const _xc=xCast;xCast=function(t,d,dx,dz){lastCast={t,d,dx,dz};return _xc.apply(this,arguments)}}
X.on('cast',(n,info)=>{try{if(!P.g||!P.on)return;const el=X.elOf(P.g.id),p=myPoint(),now=performance.now()/1000;
 // combo: minha magia em cima da marca de outro jogador
 if(now-ME.last>4){const m=MARKS.find(m=>!m.own&&!m.used&&now-m.t<3.2&&Math.hypot(m.x-p.x,m.z-p.z)<5.5&&find(m.el,el));if(m){const c=find(m.el,el);m.used=1;ME.last=now;FX[c.id](m.x,m.z,true,lastCast);reward(c,m.nm);publish({cc:{n:++ME.c,k:c.id,x:+m.x.toFixed(1),z:+m.z.toFixed(1),to:m.peer}});return}}
 // senão deixa a minha marca para os amigos
 publish({cm:{n:++ME.n,e:el,x:+p.x.toFixed(1),z:+p.z.toFixed(1)}});if(MP&&MP.r)addMark({el,x:p.x,z:p.z,own:true})}catch(e){try{ERR122(e)}catch(_){}}});
function publish(o){try{if(MP&&MP.r)MP.r.presence(o).catch(()=>{})}catch(e){}}
// ---------- marcas e combos dos outros jogadores ----------
const SEEN={};
function peersTick(){if(!MP||!MP.r)return;let ps;try{ps=MP.r.peers()}catch(e){return}for(const p of ps){const pr=p.presence;if(p.sameTab||!pr)continue;const s=SEEN[p.peer]=SEEN[p.peer]||{m:null,c:null};const nm=String(pr.nm||'Amigo').slice(0,16);
  if(pr.cm&&pr.cm.n!==s.m){const first=s.m==null;s.m=pr.cm.n;if(!first&&COL[pr.cm.e])addMark({el:pr.cm.e,x:+pr.cm.x||0,z:+pr.cm.z||0,peer:p.peer,nm,own:false})}
  if(pr.cc&&pr.cc.n!==s.c){const first=s.c==null;s.c=pr.cc.n;const c=CB.find(c=>c.id===pr.cc.k);if(!first&&c){FX[c.id](+pr.cc.x||0,+pr.cc.z||0,false);const mine=pr.cc.to===MP.myPeer;if(mine)reward(c,nm);else try{toast('Combo de '+nm+': '+c.n+'!')}catch(e){}const m=MARKS.find(m=>m.own&&Math.hypot(m.x-pr.cc.x,m.z-pr.cc.z)<1);if(m)m.used=1}}}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{markTick();peersTick()}catch(e){}return r}}
// ---------- LIVRO DE COMBOS (Menu › Grimório) ----------
window.cb134Open=function(){let o=document.getElementById('cb134');if(!o){o=document.createElement('div');o.id='cb134';document.body.appendChild(o)}
 const lab=k=>k=='*'?'Qualquer':NOME[k]||k;
 o.innerHTML='<div class="cbx"><div class="h"><b>📘 Livro de Combos</b><button onclick="document.getElementById(\'cb134\').classList.remove(\'on\')">Fechar</button></div><p class="s">Use uma magia em cima da marca de outro jogador para fazer um combo. Descobertos: '+CB.filter(c=>ST.d[c.id]).length+'/'+CB.length+'</p>'+
  CB.map(c=>{const k=ST.d[c.id];return '<div class="it'+(k?'':' lk')+'"><b>'+(k?c.n:'???')+'</b><small>'+lab(c.a)+' + '+lab(c.b)+(k?' · '+c.d+' · feito '+k+'x':'')+'</small></div>'}).join('')+'</div>';o.classList.add('on')};
// botão no menu rápido (☰) e na aba Missões
function qmBtn(){const q=document.getElementById('qm');if(!q||q.querySelector('.cb134q'))return;const b=document.createElement('button');b.className='cb134q';b.innerHTML='<span>📘</span>Livro de Combos';b.onclick=()=>{try{q.classList.remove('on');const qb=document.getElementById('qm-btn');if(qb)qb.classList.remove('on')}catch(e){}cb134Open()};q.appendChild(b)}
setInterval(()=>{try{qmBtn()}catch(e){}},1500);
{const _om=openMenu;openMenu=function(t){const r=_om.apply(this,arguments);try{if(mt=='q'&&P.g){const c=document.querySelector('#ov .card');if(c&&!c.querySelector('.cb134b')){const b=document.createElement('button');b.className='k cb134b';b.textContent='📘 Livro de Combos';b.onclick=()=>cb134Open();c.appendChild(b)}}}catch(e){}return r}}
const css=document.createElement('style');css.textContent='#cb134{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:#0008}#cb134.on{display:flex}#cb134 .cbx{width:min(92vw,460px);max-height:86vh;overflow:auto;background:#141018;border:1px solid #ffd23f66;border-radius:12px;padding:12px;color:#eee;font:14px system-ui}#cb134 .h{display:flex;justify-content:space-between;align-items:center}#cb134 .h button{background:#3a2a05;border:1px solid #ffd23f;color:#ffe9a8;border-radius:8px;padding:4px 10px}#cb134 .s{opacity:.8;font-size:12px}#cb134 .it{padding:7px;margin:5px 0;border-radius:8px;background:#221a2a;border:1px solid #ffffff18}#cb134 .it b{display:block;color:#ffd23f}#cb134 .it small{opacity:.8}#cb134 .it.lk b{color:#888}';document.head.appendChild(css);
})();

