// ================= V82 · Fase 1b: aura só durante a habilidade + formação visual rápida =================
// Em repouso não há aura. Ao usar uma magia: o poder se forma na mão (partículas convergem, núcleo cresce),
// a aura do elemento sobe pelo corpo durante a formação, fica forte no disparo e some logo depois.
const EL82={fogo:{c:0xff4a10,c2:0xffc040,k:'fire'},agua:{c:0x1e7bff,c2:0x9ae6ff,k:'water'},vento:{c:0x2fe08a,c2:0xd8ffe8,k:'wind'},luz:{c:0xffc83a,c2:0xfff6c8,k:'light'},
 anti:{c:0x0a0008,c2:0xff1a2a,k:'anti',dark:1},tempo:{c:0x7ad8ff,c2:0xeaf8ff,k:'time'},kotodama:{c:0x9a30ff,c2:0xe0b0ff,k:'word'},sangue:{c:0xd0101e,c2:0xff6a6a,k:'blood'},
 sonhos:{c:0xff6ad8,c2:0xffe0f6,k:'dream'},espacial:{c:0x4a6aff,c2:0xc8d8ff,k:'space'},sombra:{c:0x14081f,c2:0x9a40ff,k:'shadow',dark:1}};
const V82G={};const v82G=(k,f)=>{if(!V82G[k]){V82G[k]=f();V82G[k]._keep=true}return V82G[k]};
const v82Mat=(c,o,dark)=>dark?new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false}):GLM(c,o);
function v82El(){if(!P.g)return null;if(P.union)return 'anti';if(P.nacht)return 'sombra';if(P.sy)return 'vento';if(P.zg)return 'kotodama';if(P.vk)return 'agua';return EL82[P.g.id]?P.g.id:null}
// ---------- aura corporal temporária (segue o corpo porque fica dentro do grupo do personagem)
function v82AuraMake(par){const g=new T.Group();g.visible=false;g.userData.v82au=1;
 const sh=new T.Mesh(v82G('ash',()=>new T.SphereGeometry(1,16,12)),v82Mat(0xffffff,0));sh.scale.set(.62,1.08,.5);sh.position.y=.98;g.add(sh);
 const sh2=new T.Mesh(V82G.ash,v82Mat(0xffffff,0));sh2.scale.set(.74,1.22,.6);sh2.position.y=1.02;g.add(sh2);
 const fl=[];for(let k=0;k<10;k++){const m=new T.Mesh(v82G('afl',()=>new T.ConeGeometry(.075,.46,5)),v82Mat(0xffffff,0));const a=k/10*6.283;m.userData.a=a;m.userData.p=Math.random();g.add(m);fl.push(m)}
 par.add(g);return {g,sh,sh2,fl,el:null,t:9,F:.2,dark:-1}}
function v82AuraSet(A,el){if(A.el===el)return;A.el=el;const E=EL82[el]||EL82.fogo,dk=E.dark?1:0;if(A.dark!==dk){A.dark=dk;for(const m of[A.sh,A.sh2,...A.fl]){const o=m.material;m.material=v82Mat(0xffffff,0,dk);o.dispose()}}
 A.sh.material.color.setHex(E.c);A.sh2.material.color.setHex(E.dark?E.c2:E.c);A.fl.forEach((m,i)=>m.material.color.setHex(i%3==0?E.c2:E.c))}
function v82AuraPulse(A,el,F){if(!A||!el)return;v82AuraSet(A,el);A.t=0;A.F=Math.max(.08,F||.18);A.g.visible=true}
// intensidade: cresce na formação, máxima no disparo, cai e some
function v82AuraK(A){const t=A.t,F=A.F;if(t<F)return .25+.75*(t/F);if(t<F+.35)return 1;const u=(t-F-.35)/.6;return u>=1?0:(1-u)*(1-u)}
function v82AuraTick(A,dt,x,y,z){if(!A||!A.g.visible)return;A.t+=dt;const k=v82AuraK(A);if(k<=0){A.g.visible=false;return}const E=EL82[A.el]||EL82.fogo,tm=performance.now()/1000;
 A.sh.material.opacity=(E.dark?.3:.13)*k;A.sh2.material.opacity=(E.dark?.1:.05)*k;A.sh.scale.set(.62+.05*Math.sin(tm*9),1.08+.04*Math.sin(tm*7),.5);
 A.fl.forEach(m=>{const u=(m.userData.p+tm*1.6)%1,a=m.userData.a+tm*.8,r=.42+.06*Math.sin(tm*5+a);m.position.set(Math.cos(a)*r,.15+u*1.75,Math.sin(a)*r*.8);const s=(1-u)*1.2+.25;m.scale.set(s,s*(1+k*.6),s);m.material.opacity=(E.dark?.75:.6)*k*Math.sin(u*Math.PI)});
 if(x!=null&&CFG.parts&&Math.random()<dt*20*k*KQ())fxp({x:x+(Math.random()-.5)*.9,y:y+.2+Math.random()*1.4,z:z+(Math.random()-.5)*.9,c:E.dark?E.c2:(Math.random()<.6?E.c2:E.c),n:1,sp:.25,sz:E.dark?.07:.11,life:.45,up:1.4})}
const AU82={me:null};
// ---------- formação do poder (antes de disparar)
function v82Hand(){try{const E=PP.arms[1][1],v=new T.Vector3(0,PP.attY||-.38,0);E.localToWorld(v);return v}catch(e){return new T.Vector3(P.x+Math.sin(P.f)*.6,1.35,P.z+Math.cos(P.f)*.6)}}
function v82Form(el,F,src){const E=EL82[el];if(!E||!CFG.fx&&CFG.fx!==undefined)return;const q=KQ(),N=Math.max(4,Math.round(8*q)),g=new T.Group();
 const core=new T.Mesh(V82G.ash||v82G('ash',()=>new T.SphereGeometry(1,16,12)),E.dark?v82Mat(0x000000,.95,1):GLM(0xffffff,.95));const halo=new T.Mesh(V82G.ash,GLM(E.dark?E.c2:E.c,.4));const halo2=new T.Mesh(V82G.ash,v82Mat(E.dark?E.c:E.c2,.18,E.dark));g.add(core,halo,halo2);
 const mt=[];for(let k=0;k<N;k++){const m=new T.Mesh(v82G('mote_'+E.k,()=>E.k=='water'?new T.SphereGeometry(.05,6,5):E.k=='light'||E.k=='word'?new T.PlaneGeometry(.03,.2):E.k=='blood'?new T.TetrahedronGeometry(.06):new T.OctahedronGeometry(.05)),v82Mat(k%2?E.c2:E.c,.95,E.dark&&k%2==0));m.userData.a=k/N*6.283;m.userData.h=(Math.random()-.5)*.8;g.add(m);mt.push(m)}
 let ring=null;if(E.k=='wind'||E.k=='time'||E.k=='space'||E.k=='anti'||E.k=='word'){ring=new T.Mesh(v82G('fring',()=>new T.TorusGeometry(1,.05,5,28)),GLM(E.k=='anti'?0xff1a2a:E.c2,.8));g.add(ring)}
 S.add(g);const pos=()=>src?src():v82Hand();
 kfx({u:(f,dt)=>{const t=f.t,u=Math.min(1,t/F),p=pos();g.position.copy(p);const s=.03+.2*u*u;core.scale.setScalar(s*(1+.15*Math.sin(t*40)));halo.scale.setScalar(s*2.1);halo2.scale.setScalar(s*3.2);
  mt.forEach(m=>{const a=m.userData.a+t*(E.k=='wind'?14:8),r=.85*(1-u)+.08;m.position.set(Math.cos(a)*r,m.userData.h*(1-u)+Math.sin(a*2)*.05,Math.sin(a)*r);m.lookAt&&m.lookAt(cam.position);m.scale.setScalar(.6+u)});
  if(ring){ring.scale.setScalar(.35*(1-u)+.12+(E.k=='space'?.2*u:0));ring.rotation.x=E.k=='time'?Math.PI/2:t*6;ring.rotation.y=t*9}
  if(CFG.parts&&Math.random()<dt*30*q)fxp({x:p.x+(Math.random()-.5)*1.2,y:p.y+(Math.random()-.5)*1.2,z:p.z+(Math.random()-.5)*1.2,c:Math.random()<.5?E.c:E.c2,n:1,sp:.15,sz:.07,life:.25});
  if(t>=F){fxp({x:p.x,y:p.y,z:p.z,c:E.dark?E.c2:E.c2,n:Math.round(14*q),sp:4,sz:.16,life:.35});return false}return true},end:()=>kDispose(g)})}
// ---------- liga no cast: só quando a magia realmente saiu (MP.castN avança)
const V82F={min:.16};
const _cast82=cast;cast=function(i,ph){const n0=MP.castN,tl=tmr.length;const r=_cast82.apply(this,arguments);
 try{if(MP.castN!==n0&&!ph&&P.g&&P.g.id!='nenhum'){const el=v82El();if(el){let F=.12;const nt=tmr[tl];if(nt&&tmr.length>tl){const mn=CFG.gfx=='baixo'?.13:V82F.min;if(nt.t<mn)nt.t=mn;F=nt.t}
   if(!AU82.me)AU82.me=v82AuraMake(pm);v82AuraPulse(AU82.me,el,F);v82Form(el,F,window.V82FS||null);if(MP.cast)MP.cast.ae=el}}}catch(e){}return r};
// outro jogador conjurou: a aura dele também acende (visível para todos)
const _ghost82=ghostCast;ghostCast=function(o,c){try{const el=c&&(c.ae||c.el);if(o&&o.g&&EL82[el]&&Math.hypot(o.x-P.x,o.z-P.z)<60){if(!o.au82)o.au82=v82AuraMake(o.g);v82AuraPulse(o.au82,el,.16)}}catch(e){}return _ghost82.apply(this,arguments)};
// auras permanentes antigas das transformações ficam apagadas em repouso (só a aura temporária aparece ao usar magia)
function v82HideOld(){const off=m=>{if(m)m.visible=false};try{off(aura)}catch(e){}try{if(DU.fx){off(DU.fx.au);off(DU.fx.dist)}}catch(e){}try{if(SY.fx){off(SY.fx.au);off(SY.fx.au2)}}catch(e){}try{if(NA.fx){off(NA.fx.au);off(NA.fx.au2)}}catch(e){}try{if(P.zgF){off(P.zgF.au);off(P.zgF.au2)}}catch(e){}
 try{for(const k in MP.others){const o=MP.others[k];if(o.sya&&o.sya.children[0])o.sya.children[0].visible=false}}catch(e){}}
const _xU82=xUpdate;xUpdate=function(dt){_xU82(dt);try{v82HideOld();if(AU82.me)v82AuraTick(AU82.me,dt,P.x,P.y,P.z);for(const k in MP.others){const o=MP.others[k];if(o.au82)v82AuraTick(o.au82,dt,o.x,0,o.z)}}catch(e){}};

