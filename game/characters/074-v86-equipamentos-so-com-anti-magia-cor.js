// ===================== V86 · equipamentos só com Anti-Magia + correntes azuis da Soul Chain =====================
// Regra pedida: as 4 espadas do Asta e o Taco do Magna só podem ser equipados com o grimório de Anti-Magia.
WPN82.bat.g='fogo';WPN82.bat.how='Libera no Nível 5 e só pode ser usado com o grimório de Fogo do Magna.';
function v86Anti(){return !!(P.g&&P.g.id=='anti')}
{const _h=wpnHas;wpnHas=function(k){const W=WPN82[k];if(W&&W.t=='taco')return !!(P.g&&P.g.id=='fogo')&&_h(k);if(!v86Anti())return false;return _h(k)}}
wpnBat=function(){const v=v82S();return !!(v.bat&&P.g&&P.g.id=='fogo'&&P.lv>=5)};
wpnEquip=function(k){const v=v82S(),W=WPN82[k];if(!W)return;if(W.t=='taco'&&!(P.g&&P.g.id=='fogo')){toast('🔒 O Taco do Magna só pode ser usado com o grimório de Fogo.');return}if(W.t!='taco'&&!v86Anti()){toast('🔒 '+W.n+' só pode ser equipada com o grimório de Anti-Magia do Asta.');return}
 if(!wpnHas(k)){toast('🔒 '+W.n+': '+W.how);return}if(W.t=='taco'){v.bat=v.bat?0:1;toast(v.bat?'Taco equipado.':'Taco guardado: a espada volta para a mão.')}else{v.sw=k;v.bat=0;toast(W.n+' equipada.')}saveGame();openMenu('inv')};
{const _w=wpnHTML;wpnHTML=function(){let h=_w();h=h.replace('<h3>⚔️ Equipamentos</h3>','<h3>⚔️ Equipamentos</h3><p class="sm" style="color:#ffb08a">🔒 Espadas: só com Anti-Magia (Asta). Taco: só com Fogo (Magna).</p>');return h}}
// ao carregar ou trocar de grimório, nada fica equipado indevidamente
{const _t=wpnTick;wpnTick=function(){try{const v=v82S();if(v.bat&&!(P.g&&P.g.id=='fogo'))v.bat=0}catch(e){}_t()}}
// soco com taco: pose de tacada

// ---------- correntes da Soul Chain: azuis, finas e delicadas, com brilho azul
const SCB={g:null};
function scBlueChain(n){const g=fChain(n,.62),u=UD(g);u.blue=1;u.mA=new T.MeshBasicMaterial({color:0x8fd0ff});u.mB=new T.MeshBasicMaterial({color:0x3a8dff});u.links.forEach((m,i)=>{m.material=i%2?u.mB:u.mA;m.scale.set(.9,1.5,.9)});
 try{u.glow.material=GLM(0x4aa8ff,.28)}catch(e){}u.pulses.forEach((p,i)=>p.material=GLM(i?0x6ac0ff:0xd8f0ff,.85));u.runes.forEach(q=>{try{q.material.color.setHex(0x9ad8ff)}catch(e){}});return g}
{const _s=fChainSet;fChainSet=function(g,a,b,t,o){const r=_s.apply(this,arguments);const u=UD(g);if(u.blue){const c=Math.sin(t*10)*.5+.5;u.mA.color.setHex(c>.5?0xcfeeff:0x8fd0ff)}return r}}

// ---------- VULCÃO YULTIM: rios de lava de verdade escorrendo pelas encostas (textura que corre, brilho, fumaça, calor e estouros)
const LAVA86={on:false,fl:[],t:0};
{const X0=300,Z0=-410,rAt=y=>58-43*(y/52);
 const tex=(()=>{try{const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');if(!x)return null;x.fillStyle='#8a1004';x.fillRect(0,0,128,128);
  for(let i=0;i<70;i++){const px=Math.random()*128,py=Math.random()*128,r=4+Math.random()*16,g=x.createRadialGradient(px,py,0,px,py,r);const hot=Math.random();g.addColorStop(0,hot>.6?'#fff2a0':hot>.3?'#ffb020':'#ff6a10');g.addColorStop(1,'rgba(200,30,0,0)');x.fillStyle=g;for(const ox of[-128,0,128])for(const oy of[-128,0,128]){x.beginPath();x.arc(px+ox,py+oy,r,0,6.283);x.fill()}}
  for(let i=0;i<18;i++){x.strokeStyle='rgba(40,4,0,.55)';x.lineWidth=1+Math.random()*2;x.beginPath();let px=Math.random()*128,py=Math.random()*128;x.moveTo(px,py);for(let k=0;k<5;k++){px+=(Math.random()-.5)*30;py+=(Math.random()-.5)*30;x.lineTo(px,py)}x.stroke()}
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t}catch(e){return null}})();
 const mA=new T.MeshBasicMaterial({color:0xffffff,map:tex,side:T.DoubleSide}),mG=new T.MeshBasicMaterial({color:0xff7a20,map:tex,transparent:true,opacity:.55,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide});
 if(tex){mG.map=tex.clone();mG.map.needsUpdate=true;mG.map.wrapS=mG.map.wrapT=T.RepeatWrapping;mG.map.repeat.set(1.3,1.3)}
 const grp=new T.Group();grp.position.set(X0,0,Z0);S.add(grp);LAVA86.g=grp;
 const flow=(a0,seed,w0)=>{const N=36,pos=[],uv=[],idx=[];let len=0,prev=null;
  for(let i=0;i<=N;i++){const t=i/N,y=51.6-t*51.2,a=a0+Math.sin(t*4.2+seed)*.12+Math.sin(t*9+seed*2)*.04,r=rAt(Math.max(0,y))+.25+t*.6,w=(w0*(1-.35*t)+Math.sin(t*13+seed)*.25)/2;
   const cx=Math.cos(a)*r,cz=Math.sin(a)*r,tx=-Math.sin(a),tz=Math.cos(a);if(prev)len+=Math.hypot(cx-prev[0],y-prev[1],cz-prev[2]);prev=[cx,y,cz];
   pos.push(cx-tx*w,y+.05,cz-tz*w, cx+tx*w,y+.05,cz+tz*w);uv.push(0,len/9,1,len/9);if(i<N){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2)}}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const m=new T.Mesh(g,mA),m2=new T.Mesh(g,mG);m2.position.y=.06;grp.add(m,m2);
  const pool=new T.Mesh(new T.CircleGeometry(w0*.9,14),mA);pool.rotation.x=-Math.PI/2;const r1=rAt(0)+1.2;pool.position.set(Math.cos(a0)*r1,.06,Math.sin(a0)*r1);pool.scale.set(1.6,1,1);grp.add(pool);
  LAVA86.fl.push({a:a0,pool:[X0+pool.position.x,Z0+pool.position.z,w0*1.3]})};
 [[.3,1,4.2],[1.55,2.3,3.4],[2.7,3.1,4.6],[3.9,.7,3.2],[5.1,4.4,3.8]].forEach(([a,s,w])=>flow(a,s,w));
 // borda incandescente na cratera
 const rim=new T.Mesh(new T.TorusGeometry(14.6,.6,5,24),mG);rim.rotation.x=Math.PI/2;rim.position.y=53.2;grp.add(rim);
 // fumaça (poucas folhas que sobem e voltam)
 const smT=(()=>{try{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');const g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(80,72,70,.9)');g.addColorStop(1,'rgba(80,72,70,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)}catch(e){return null}})();
 LAVA86.sm=[];for(let i=0;i<12;i++){const s=new T.Sprite(new T.SpriteMaterial({map:smT,color:0x8a807c,transparent:true,opacity:.5,depthWrite:false}));s.userData.ph=i/12;grp.add(s);LAVA86.sm.push(s)}
 // luz laranja que pinta as pedras perto (fica sempre na cena; só a intensidade muda para não recompilar materiais)
 const L=new T.PointLight(0xff6a20,0,190,1.4);L.position.set(X0,30,Z0);S.add(L);LAVA86.L=L;
 const L2=new T.PointLight(0xff4a10,0,70,1.6);L2.position.set(X0,58,Z0);S.add(L2);LAVA86.L2=L2;
 LAVA86.mats=[mA,mG]}
{const _x=xUpdate;xUpdate=function(dt){_x(dt);try{const d=Math.hypot(P.x-300,P.z+410),on=d<260;LAVA86.g.visible=on;if(!on){LAVA86.L.intensity=0;LAVA86.L2.intensity=0;return}
 const t=(LAVA86.t+=dt),[mA,mG]=LAVA86.mats;if(mA.map)mA.map.offset.y=t*.16;if(mG.map){mG.map.offset.y=t*.27;mG.map.offset.x=Math.sin(t*.4)*.1}mG.opacity=.45+Math.sin(t*2.3)*.12;
 const k=Math.max(0,1-d/260);LAVA86.L.intensity=(1.6+Math.sin(t*3.1)*.25)*k;LAVA86.L2.intensity=(2.2+Math.sin(t*4)*.4)*k;
 for(const s of LAVA86.sm){const u=(s.userData.ph+t*.05)%1;s.position.set(Math.sin(s.userData.ph*20)*8*u,54+u*36,Math.cos(s.userData.ph*20)*8*u);s.scale.setScalar(6+u*22);s.material.opacity=.55*(1-u)}
 if(d<140&&Math.random()<dt*KQ()*(d<80?1.2:.5)){const f=LAVA86.fl[Math.floor(Math.random()*LAVA86.fl.length)],tt=Math.random(),y=51-tt*50,r=58-43*(y/52)+.5;const x=300+Math.cos(f.a)*r,z=-410+Math.sin(f.a)*r;
  fxp({x,y:y+.5,z,c:Math.random()<.5?0xffb020:0xff4a10,n:Math.round(10*KQ())+3,sp:5,sz:.35,life:.8,up:6});if(Math.random()<.3)fxp({x,y:y+1,z,c:0x5a524e,n:4,sp:1.2,sz:1.2,life:1.6,up:3})}
 if(d<90&&Math.random()<dt*3*KQ()){const a=Math.random()*6.283,r=Math.random()*55+5;fxp({x:300+Math.cos(a)*r,y:.5+Math.random()*3,z:-410+Math.sin(a)*r,c:0xffa040,n:1,sp:.3,sz:.12,life:1.4,up:2})}
 // poças de lava na base queimam quem pisa
 if(!(P.dead>0))for(const f of LAVA86.fl){const [px,pz,pr]=f.pool;if(Math.hypot(P.x-px,P.z-pz)<pr&&P.y<.5){P._lv=(P._lv||0)-dt;if(P._lv<=0){P._lv=.5;hurtM(4+P.mhp*.03);fxp({x:P.x,y:.3,z:P.z,c:0xff6a10,n:6,sp:2,sz:.25,life:.5,up:3});if(!P._lvT||performance.now()-P._lvT>4000){P._lvT=performance.now();toast('🔥 Lava! Saia daí.')}}}}}catch(e){}}}

// ---------- cachoeiras: água caindo (textura que corre), espuma embaixo e névoa
{const tx=(()=>{try{const c=document.createElement('canvas');c.width=64;c.height=128;const x=c.getContext('2d');x.fillStyle='#5ab0e8';x.fillRect(0,0,64,128);for(let i=0;i<60;i++){x.fillStyle='rgba(255,255,255,'+(.2+Math.random()*.5)+')';x.fillRect(Math.random()*64,Math.random()*128,1+Math.random()*3,8+Math.random()*24)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t}catch(e){return null}})();
 const m=new T.MeshBasicMaterial({color:0xffffff,map:tx,transparent:true,opacity:.9,side:T.DoubleSide}),F=[];
 for(const f of(window.FALLS86||[])){const g=new T.Group();g.position.set(f.x,0,f.z);g.rotation.y=f.ry;const p=new T.Mesh(new T.PlaneGeometry(3.6,11.4),m);p.position.set(0,5.6,1.2);p.rotation.x=-.08;g.add(p);
  const fo=new T.Mesh(new T.CircleGeometry(3,14),new T.MeshBasicMaterial({color:0xeaf6ff,transparent:true,opacity:.7}));fo.rotation.x=-Math.PI/2;fo.position.set(0,.08,2.6);g.add(fo);S.add(g);F.push({g,fo,x:f.x,z:f.z})}
 const _x=xUpdate;xUpdate=function(dt){_x(dt);try{const t=performance.now()/1000;if(tx)tx.offset.y=t*1.4;for(const f of F){const near=Math.hypot(P.x-f.x,P.z-f.z)<160;f.g.visible=near;if(!near)continue;f.fo.scale.setScalar(1+Math.sin(t*6)*.06);if(Math.random()<dt*4*KQ())fxp({x:f.x+(Math.random()-.5)*3,y:.6,z:f.z+2.6,c:0xffffff,n:2,sp:1.5,sz:.35,life:.7,up:2})}}catch(e){}}}

