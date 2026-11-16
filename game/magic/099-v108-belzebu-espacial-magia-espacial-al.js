// ================= V108 · BELZEBU ESPACIAL · MAGIA ESPACIAL · ALTERAR MAGIA =================
// Interpretação visual original do Clover RPG. Belzebu agora é o demônio do espaço: corpo escuro com veias violeta, cabeça com geometria própria,
// esqueleto articulado (quadril → coluna → peito → pescoço → cabeça; ombro → braço → antebraço → mão → dedos; quadril → coxa → canela → pé),
// presença com distorção espacial e a Magia Espacial como segunda magia de quem tem o contrato.
{
const H=window.H93,rnd=(a,b)=>a+Math.random()*(b-a),Q=()=>KQ(),ww=(w,c)=>{try{xWord(w,c)}catch(e){}};
const SB=0x1a1f6a,SV=0x7a4aff,SC=0x5ad8ff,SK=0x05030f,SV2=0xb08aff;
// ---------- texturas: céu estrelado/nebulosa, pele demoníaca com veias, espiral de portal
const TX={};
function txStars(){if(TX.st)return TX.st;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');const g=x.createRadialGradient(128,128,10,128,128,128);g.addColorStop(0,'#2a1a6a');g.addColorStop(.5,'#0c0a2a');g.addColorStop(1,'#020108');x.fillStyle=g;x.fillRect(0,0,256,256);
 for(let i=0;i<6;i++){const X=Math.random()*256,Y=Math.random()*256,r=30+Math.random()*60,n=x.createRadialGradient(X,Y,0,X,Y,r);n.addColorStop(0,i%2?'rgba(120,80,255,.35)':'rgba(60,180,255,.25)');n.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=n;x.fillRect(0,0,256,256)}
 for(let i=0;i<260;i++){x.fillStyle='rgba(255,255,255,'+(.3+Math.random()*.7)+')';const s=Math.random()<.08?2:1;x.fillRect(Math.random()*256,Math.random()*256,s,s)}const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;TX.st=t;return t}
function txSwirl(){if(TX.sw)return TX.sw;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,256,256);x.translate(128,128);
 for(let a=0;a<6.283*5;a+=.02){const r=a*4,px=Math.cos(a)*r,py=Math.sin(a)*r;x.fillStyle='rgba('+(110+Math.random()*80|0)+','+(80+Math.random()*60|0)+',255,'+(.15+Math.random()*.25)+')';x.beginPath();x.arc(px,py,1.5+a*.35,0,6.283);x.fill()}
 x.setTransform(1,0,0,1,0,0);const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(0,0,0,1)');g.addColorStop(.25,'rgba(0,0,0,.6)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,256,256);const t=new T.CanvasTexture(c);TX.sw=t;return t}
function txSkin(){if(TX.sk)return TX.sk;const mk=em=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle=em?'#000':'#141428';x.fillRect(0,0,256,256);
  if(!em)for(let i=0;i<600;i++){x.fillStyle='rgba('+(Math.random()<.5?'40,40,90':'5,5,15')+','+(.2+Math.random()*.3)+')';x.fillRect(Math.random()*256,Math.random()*256,2,2)}
  x.strokeStyle=em?'rgba(160,110,255,1)':'rgba(120,80,255,.8)';x.lineWidth=em?1.6:1.2;for(let i=0;i<16;i++){let X=Math.random()*256,Y=Math.random()*256;x.beginPath();x.moveTo(X,Y);for(let k=0;k<9;k++){X+=rnd(-14,14);Y+=rnd(-4,18);x.lineTo(X,Y)}x.stroke()}
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;return t};TX.sk=[mk(0),mk(1)];return TX.sk}
const mSkin=()=>{const [a,b]=txSkin();const m=new T.MeshToonMaterial({color:0xffffff,map:a,emissive:0xffffff,emissiveMap:b,emissiveIntensity:.9,gradientMap:gmap});return m};
const mDark=c=>new T.MeshToonMaterial({color:c||0x0c0c1e,gradientMap:gmap});
const mGlow=(c,o)=>{const m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?.8:o,blending:T.AdditiveBlending,depthWrite:false});return m};
// ---------- peças do ambiente espacial
function spRing(r,w,c,o){const m=new T.Mesh(new T.RingGeometry(r-w,r,48),new T.MeshBasicMaterial({color:c,transparent:true,opacity:o==null?.8:o,depthWrite:false,side:T.DoubleSide}));return m}
// portal: moldura com dentes de fenda, superfície em espiral e túnel de anéis que se afastam (profundidade)
function spPortal(R){const g=new T.Group(),fr=new T.Mesh(new T.TorusGeometry(R,R*.07,8,40),mDark(0x120a2a));g.add(fr);const rim=new T.Mesh(new T.TorusGeometry(R*1.02,R*.025,6,48),mGlow(SV,.9));g.add(rim);
 for(let k=0;k<14;k++){const a=k/14*6.283,c=new T.Mesh(new T.ConeGeometry(R*.06,R*.28,4),mDark(0x1a0f3a));c.position.set(Math.cos(a)*R*.95,Math.sin(a)*R*.95,0);c.rotation.z=a+Math.PI/2;g.add(c)}
 const sf=new T.Mesh(new T.CircleGeometry(R*.96,40),new T.MeshBasicMaterial({map:txSwirl(),transparent:true,opacity:.95,side:T.DoubleSide,depthWrite:false}));g.add(sf);
 const tun=[];for(let k=1;k<=6;k++){const r=spRing(R*(1-k*.12),R*.03,k%2?SV:SC,.55-k*.07);r.position.z=-k*R*.22;g.add(r);tun.push(r)}const back=new T.Mesh(new T.CircleGeometry(R*.3,24),new T.MeshBasicMaterial({map:txStars(),side:T.DoubleSide}));back.position.z=-R*1.4;g.add(back);
 g.userData.tick=(t)=>{sf.rotation.z=-t*1.6;tun.forEach((r,i)=>{r.rotation.z=t*(i%2?1:-1)*.8;r.scale.setScalar(1+Math.sin(t*3+i)*.04)});rim.material.opacity=.7+Math.sin(t*6)*.2};return g}
// fenda espacial: rasgo vertical irregular (vazio estrelado) com borda brilhante e profundidade
function spRift(Hh,W){const g=new T.Group(),sh=new T.Shape(),N=16,pts=[];for(let i=0;i<=N;i++){const t=i/N,y=(t-.5)*Hh,w=Math.sin(t*Math.PI)*W*(.75+Math.random()*.4);pts.push([w,y])}sh.moveTo(0,-Hh/2);pts.forEach(p=>sh.lineTo(p[0],p[1]));for(let i=N;i>=0;i--){const t=i/N,y=(t-.5)*Hh,w=Math.sin(t*Math.PI)*W*(.75+Math.random()*.4);sh.lineTo(-w,y)}
 const geo=new T.ShapeGeometry(sh);const vo=new T.Mesh(geo,new T.MeshBasicMaterial({map:txStars(),side:T.DoubleSide}));g.add(vo);const ed=new T.Mesh(geo,mGlow(SV,.8));ed.scale.set(1.18,1.04,1);ed.position.z=-.02;ed.material.side=T.DoubleSide;g.add(ed);const ed2=new T.Mesh(geo,mGlow(SC,.5));ed2.scale.set(1.32,1.08,1);ed2.position.z=-.04;ed2.material.side=T.DoubleSide;g.add(ed2);
 const deep=new T.Mesh(geo,new T.MeshBasicMaterial({color:0x000000,side:T.DoubleSide}));deep.scale.set(.5,.8,1);deep.position.z=-.6;g.add(deep);g.userData.parts={vo,ed,ed2};return g}
// distorção: esfera de "vidro" que ondula
function spWarp(R,c){const geo=new T.IcosahedronGeometry(R,2),base=geo.attributes.position.array.slice();const m=new T.Mesh(geo,new T.MeshBasicMaterial({color:c||SV,transparent:true,opacity:.18,blending:T.AdditiveBlending,depthWrite:false,wireframe:false,side:T.DoubleSide}));
 const w=new T.Mesh(geo,new T.MeshBasicMaterial({color:SC,transparent:true,opacity:.12,wireframe:true,depthWrite:false}));m.add(w);m.userData.tick=t=>{const A=geo.attributes.position;for(let i=0;i<A.count;i++){const x=base[i*3],y=base[i*3+1],z=base[i*3+2],k=1+.08*Math.sin(t*5+x*3+y*2)+.05*Math.sin(t*7+z*4);A.setXYZ(i,x*k,y*k,z*k)}A.needsUpdate=true};return m}
function spMotes(x,y,z,n,r,c){fxp({x,y,z,c:c||SV,n:Math.round((n||10)*Q()),sp:r||2,sz:.12,life:.6,g:0,up:.4});fxp({x,y,z,c:SC,n:Math.round((n||10)*.4*Q()),sp:(r||2)*.6,sz:.08,life:.5})}
function spPulse(x,z,r,y){kShock(x,z,r,SV,.4,y==null?.5:y);try{kShock(x,z,r*.7,SC,.3,y==null?.5:y)}catch(e){}}

// ===================================================================== BELZEBU: MODELO, ESQUELETO E ANIMAÇÕES =====================================================================
// Esqueleto articulado: cada parte do corpo é presa a uma articulação (peso 1 por parte). As animações giram as articulações.
function bz108Model(){const G=new T.Group(),R={},sk=mSkin(),dk=mDark(0x0a0a18),dk2=mDark(0x1a1238),eye=mGlow(0xc9a8ff,.95),eye2=mGlow(SC,.9);const J=(n,par,x,y,z)=>{const j=new T.Group();j.name=n;j.position.set(x,y,z);par.add(j);R[n]=j;return j};
 const part=(geo,mat,par,x,y,z,rx,ry,rz,sx,sy,sz)=>{const m=new T.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.rotation.set(rx||0,ry||0,rz||0);m.scale.set(sx||1,sy||sx||1,sz||sx||1);m.castShadow=true;par.add(m);return m};
 const lathe=(prof,seg)=>new T.LatheGeometry(prof.map(p=>new T.Vector2(p[0],p[1])),seg||14);
 // quadril e coluna
 const hip=J('hip',G,0,1.25,0);part(lathe([[0,-.12],[.26,-.1],[.3,.02],[.24,.14],[0,.16]]),sk,hip,0,0,0,0,0,0,1.15,1,.8);
 const sp1=J('spine',hip,0,.16,0);part(lathe([[0,0],[.22,0],[.2,.18],[.24,.32],[0,.34]]),sk,sp1,0,0,0,0,0,0,1.05,1,.75);// abdômen
 for(let k=0;k<3;k++)for(const s of[-1,1])part(new T.SphereGeometry(.07,8,6),sk,sp1,s*.08,.06+k*.1,.15,0,0,0,1,.7,.5);// músculos do abdômen
 const ch=J('chest',sp1,0,.34,0);part(lathe([[0,0],[.26,0],[.34,.16],[.36,.3],[.3,.42],[0,.44]]),sk,ch,0,0,0,0,0,0,1.15,1,.72);// peitoral
 for(const s of[-1,1])part(new T.SphereGeometry(.16,10,8),sk,ch,s*.15,.26,.13,0,0,0,1,.75,.55);// peitorais
 // costas: espinhos e anel de fendas atrás (halo espacial)
 for(let k=0;k<5;k++)part(new T.ConeGeometry(.04,.22,5),dk2,ch,0,.4-k*.1,-.24,-1.2);
 const halo=J('halo',ch,0,.55,-.45);const hr=new T.Mesh(new T.TorusGeometry(.62,.025,6,48),mGlow(SV,.85));halo.add(hr);for(let k=0;k<10;k++){const a=k/10*6.283,c=new T.Mesh(new T.ConeGeometry(.05,.24,4),mDark(0x1a0f3a));c.position.set(Math.cos(a)*.62,Math.sin(a)*.62,0);c.rotation.z=a-Math.PI/2;halo.add(c)}
 // pescoço e cabeça (geometria própria: crânio alongado para trás, testa com crista, maçãs do rosto, mandíbula separada com dentes)
 const nk=J('neck',ch,0,.44,0);part(new T.CylinderGeometry(.08,.1,.18,10),sk,nk,0,.09,0);
 const hd=J('head',nk,0,.2,0);{const g=new T.SphereGeometry(.2,18,14),A=g.attributes.position;for(let i=0;i<A.count;i++){let x=A.getX(i),y=A.getY(i),z=A.getZ(i);if(z<0){z*=1.45;y+=(-z)*.12}if(y<-.05){x*=1-(-y-.05)*1.6;z+=(-y-.05)*.25}if(y>.08&&z>0)z+=.02*Math.sin(x*30);A.setXYZ(i,x*.92,y*1.05,z)}g.computeVertexNormals();part(g,sk,hd,0,.08,0)}
 part(new T.TorusGeometry(.13,.028,6,16,Math.PI),dk2,hd,0,.15,.13,0,0,0,1,.6,1);// crista da testa
 part(new T.ConeGeometry(.025,.08,4),sk,hd,0,.05,.2,1.4);// nariz
 for(const s of[-1,1]){part(new T.SphereGeometry(.035,8,6),dk,hd,s*.075,.1,.16,0,0,0,1.4,.7,.6);const e=part(new T.SphereGeometry(.022,8,6),eye,hd,s*.075,.1,.18,0,0,0,1.6,.7,.5);R['eye'+(s>0?'R':'L')]=e;
  part(new T.ConeGeometry(.04,.16,4),sk,hd,s*.17,.1,-.02,0,0,-s*1.2);// orelhas pontudas
  part(new T.SphereGeometry(.04,8,6),sk,hd,s*.11,0,.12,0,0,0,1,.6,.8)}// maçãs do rosto
 const e3=part(new T.SphereGeometry(.016,8,6),eye2,hd,0,.2,.17);R.eye3=e3;// terceiro olho na testa
 // chifres (grandes curvados para trás e pequenos)
 try{const hg=window.O107&&O107.gHorn;for(const s of[-1,1]){const h=new T.Mesh(hg(s>0?0:1),dk2);h.position.set(s*.12,.24,-.02);h.rotation.set(-1.0,0,s*.55);h.scale.set(.45,.55,.45);hd.add(h);const h2=new T.Mesh(hg(2),dk2);h2.position.set(s*.16,.16,.02);h2.rotation.set(-.6,0,s*1.1);h2.scale.set(.22,.28,.22);hd.add(h2)}}catch(e){}
 const jaw=J('jaw',hd,0,-.02,.04);part(new T.BoxGeometry(.18,.05,.16),sk,jaw,0,-.05,.06);for(let k=0;k<6;k++)part(new T.ConeGeometry(.012,.05,4),mDark(0xe8e0ff),jaw,-.06+k*.024,-.015,.13,0,0,0);for(let k=0;k<6;k++)part(new T.ConeGeometry(.012,.05,4),mDark(0xe8e0ff),hd,-.06+k*.024,-.025,.17,Math.PI);
 // braços (ombro → braço → antebraço → mão → dedos com 2 falanges e garra)
 for(const s of[-1,1]){const n=s>0?'R':'L';const sh=J('sh'+n,ch,s*.42,.34,0);part(new T.SphereGeometry(.13,10,8),sk,sh,0,0,0);part(new T.ConeGeometry(.05,.26,5),dk2,sh,s*.06,.1,-.02,0,0,-s*.5);
  part(lathe([[0,0],[.1,-.02],[.11,-.2],[.08,-.38],[0,-.4]]),sk,sh,0,0,0);const el=J('el'+n,sh,0,-.4,0);part(new T.SphereGeometry(.075,8,6),sk,el,0,0,0);part(lathe([[0,0],[.08,-.02],[.085,-.18],[.06,-.34],[0,-.36]]),sk,el,0,0,0);part(new T.ConeGeometry(.03,.16,4),dk2,el,0,-.1,-.08,-2.4);
  const ha=J('ha'+n,el,0,-.37,0);part(new T.BoxGeometry(.1,.11,.05),sk,ha,0,-.05,0);const F=[];for(let k=0;k<4;k++){const f1=J('f'+n+k,ha,-.036+k*.024,-.1,0);part(new T.CylinderGeometry(.011,.012,.07,5),sk,f1,0,-.035,0);const f2=J('g'+n+k,f1,0,-.07,0);part(new T.CylinderGeometry(.009,.011,.06,5),sk,f2,0,-.03,0);part(new T.ConeGeometry(.01,.06,4),dk,f2,0,-.08,.005,Math.PI);F.push([f1,f2])}
  const th=J('t'+n,ha,s*.05,-.04,.02);part(new T.CylinderGeometry(.012,.013,.07,5),sk,th,0,-.035,0);th.rotation.z=s*.6;R['fing'+n]=F}
 // pernas (coxa → joelho → canela → pé com garras)
 for(const s of[-1,1]){const n=s>0?'R':'L';const th=J('th'+n,hip,s*.15,-.06,0);part(lathe([[0,0],[.12,-.02],[.13,-.24],[.09,-.48],[0,-.5]]),sk,th,0,0,0);const kn=J('kn'+n,th,0,-.5,0);part(new T.SphereGeometry(.085,8,6),sk,kn,0,0,.02);part(new T.ConeGeometry(.04,.14,4),dk2,kn,0,.02,.08,1.3);
  part(lathe([[0,0],[.09,-.02],[.08,-.22],[.055,-.48],[0,-.5]]),sk,kn,0,0,0);const ft=J('ft'+n,kn,0,-.5,0);part(new T.BoxGeometry(.11,.06,.22),sk,ft,0,-.03,.07);for(let k=0;k<3;k++)part(new T.ConeGeometry(.018,.08,4),dk,ft,-.03+k*.03,-.04,.2,Math.PI/2)}
 // manto rasgado (faixas que balançam)
 const cl=J('cloak',ch,0,.38,-.2);const strips=[];for(let k=0;k<7;k++){const st=new T.Mesh(new T.PlaneGeometry(.14,1.1+Math.random()*.4,1,4),new T.MeshToonMaterial({color:0x0e0a22,side:T.DoubleSide,gradientMap:gmap}));st.position.set(-.36+k*.12,-.6,-(Math.abs(k-3)*.02));cl.add(st);strips.push(st)}
 // presença: partículas suspensas e ondas no chão
 const N=60,pg=new T.BufferGeometry(),pp=new Float32Array(N*3),pd=[];for(let i=0;i<N;i++){pd.push([Math.random()*6.283,.6+Math.random()*1.6,Math.random()*3,.3+Math.random()])}pg.setAttribute('position',new T.BufferAttribute(pp,3));const pts=new T.Points(pg,new T.PointsMaterial({color:SV2,size:.06,transparent:true,opacity:.85,blending:T.AdditiveBlending,depthWrite:false}));G.add(pts);
 const rip=[];for(let k=0;k<3;k++){const r=spRing(1,.04,k%2?SC:SV,.5);r.rotation.x=-Math.PI/2;r.position.y=.03;G.add(r);rip.push(r)}
 G.scale.setScalar(1.3);
 // animações: idle, move, cast (magia espacial), contract, talk, reach
 const base={};for(const k in R)if(R[k]&&R[k].rotation)base[k]=R[k].rotation.clone();
 const anim=(t,m)=>{for(const k in base)R[k].rotation.copy(base[k]);const b=Math.sin(t*1.6);
  R.hip.position.y=1.25+b*.03+(m=='move'?Math.abs(Math.sin(t*4))*.04:0);R.chest.rotation.x=b*.02;R.head.rotation.y=Math.sin(t*.7)*.25;R.head.rotation.x=Math.sin(t*.9)*.06;R.jaw.rotation.x=m=='talk'?Math.abs(Math.sin(t*9))*.25:.03+Math.sin(t*2)*.02;R.halo.rotation.z=t*.5;
  R.shL.rotation.z=.25+b*.03;R.shR.rotation.z=-.25-b*.03;R.elL.rotation.x=-.25;R.elR.rotation.x=-.25;
  ['L','R'].forEach((n,i)=>R['fing'+n].forEach((f,k)=>{const c=.3+Math.sin(t*2+k+i)*.15;f[0].rotation.x=c;f[1].rotation.x=c*1.2}));
  if(m=='move'){const w=Math.sin(t*4);R.thL.rotation.x=w*.5;R.thR.rotation.x=-w*.5;R.knL.rotation.x=Math.max(0,-w)*.7;R.knR.rotation.x=Math.max(0,w)*.7;R.shL.rotation.x=-w*.4;R.shR.rotation.x=w*.4}
  if(m=='cast'||m=='reach'||m=='reach2'){R.shR.rotation.x=-1.5+Math.sin(t*3)*.1;R.shR.rotation.z=-.15;R.elR.rotation.x=-.2;R.fingR.forEach((f,k)=>{f[0].rotation.x=-.2+k*.05;f[1].rotation.x=-.1});if(m!='reach'){R.shL.rotation.x=-1.2;R.shL.rotation.z=.6;R.elL.rotation.x=-.9}}
  if(m=='contract'){R.shR.rotation.x=-1.35;R.elR.rotation.x=-.3;R.shL.rotation.x=-.3;R.shL.rotation.z=.3;R.head.rotation.x=.15;R.fingR.forEach((f,k)=>{f[0].rotation.x=.9;f[1].rotation.x=1.1})}
  strips.forEach((st,k)=>{st.rotation.x=.15+Math.sin(t*2+k*.7)*.12+(m=='move'?.3:0)});
  const A=pg.attributes.position;pd.forEach((d,i)=>{const a=d[0]+t*d[3]*.5;A.setXYZ(i,Math.cos(a)*d[1],(d[2]+t*.2*d[3])%3,Math.sin(a)*d[1])});A.needsUpdate=true;
  rip.forEach((r,k)=>{const u=((t*.5+k/3)%1);r.scale.setScalar(.6+u*2.4);r.material.opacity=.5*(1-u)});
  const gl=.6+Math.sin(t*4)*.3;R.eyeL.material.opacity=gl;R.eye3.material.opacity=.5+Math.sin(t*6)*.4;sk.emissiveIntensity=.7+Math.sin(t*2)*.25};
 const B={G,R,anim,sk};try{if(window.D120)D120.bz(B)}catch(e){console.warn('bz120',e)}return B}
// aparição / desaparecimento por distorção dimensional
function bz108Appear(B,par,dur){const g=B.G,warp=spWarp(1.2);g.add(warp);warp.position.y=1.6;const t0=performance.now();g.scale.setScalar(1.3*.01);
 kfx({u:(q,dt)=>{const t=q.t,u=Math.min(1,t/(dur||1.1)),e=1-Math.pow(1-u,3);g.scale.set(1.3*(.2+.8*e),1.3*e,1.3*(.2+.8*e));warp.userData.tick(t);warp.material.opacity=.3*(1-u);warp.scale.setScalar(1+u*1.5);if(Math.random()<.5*Q())spMotes(g.position.x,1.2,g.position.z,3,1.2);if(u>=1){g.remove(warp);return false}return true}})}
function bz108Vanish(B,dur,done){const g=B.G,s0=g.scale.x;kfx({u:(q,dt)=>{const t=q.t,u=Math.min(1,t/(dur||.8));g.scale.set(s0*(1-u*.8),s0*(1-u),s0*(1-u*.8));g.rotation.y+=dt*u*8;if(Math.random()<.6*Q())spMotes(g.position.x,1.2,g.position.z,3,1.5);return u<1},end:()=>{try{done&&done()}catch(e){}}})}
// troca o Belzebu nos encontros, cutscenes e batalhas
{const _cd=csDemon;csDemon=function(id){if(id=='belzebu'){try{const B=bz108Model(),g=new T.Group();g.add(B.G);UD(g).face=2.0*1.3;UD(g).arm=.95;UD(g).anim=(t,m)=>B.anim(t,m=='walk'?'move':m);UD(g).bz=B;return g}catch(e){console.warn('bz108',e)}}return _cd.apply(this,arguments)}}
// dimensão do Belzebu: vazio estrelado, plataformas quebradas flutuando, fendas e anéis
{const _dim=csDim;csDim=function(id){if(id!='belzebu')return _dim.apply(this,arguments);const D=new T.Group(),anim=[],q=KQ();const A=(o,f)=>{D.add(o);if(f)anim.push([o,f]);return o};
 const sky=new T.Mesh(new T.SphereGeometry(80,24,16),new T.MeshBasicMaterial({map:txStars(),side:T.BackSide,fog:false,depthWrite:false}));sky.material.map.repeat.set(3,2);A(sky,(m,t)=>{m.rotation.y=t*.01});
 const fl=new T.Mesh(new T.CylinderGeometry(9,7,1.2,10),mDark(0x0e0c22));fl.position.y=-.6;A(fl);const fr=spRing(8.6,.12,SV,.7);fr.rotation.x=-Math.PI/2;fr.position.y=.02;A(fr,(m,t)=>{m.material.opacity=.5+Math.sin(t*2)*.2});
 for(let k=0;k<Math.round(10*q)+4;k++){const a=Math.random()*6.283,r=14+Math.random()*20,p=new T.Mesh(new T.DodecahedronGeometry(1+Math.random()*2.5,0),mDark(0x161230));p.position.set(Math.cos(a)*r,-2+Math.random()*12,Math.sin(a)*r);A(p,(m,t)=>{m.position.y+=Math.sin(t+r)*.003;m.rotation.y+=.002})}
 for(let k=0;k<4;k++){const rf=spRift(6+k*2,1.4);const a=k/4*6.283+.4;rf.position.set(Math.cos(a)*22,5,Math.sin(a)*22);rf.lookAt(0,5,0);A(rf,(m,t)=>{m.scale.x=.8+Math.sin(t*1.5+k)*.2})}
 const pt=spPortal(4);pt.position.set(0,9,-26);A(pt,(m,t)=>m.userData.tick(t));
 return{g:D,anim}}}
// visual da Belzebu (paleta azul/violeta) também na União e no escudo de ossos
try{BZ106.col=SV;DPS.belzebu.col=SV;DPS.belzebu.tag='Senhor do espaço: calmo, calculista, respeita quem não teme o vazio';DPS.belzebu.mg='bzesp';
 Object.assign(DPS.belzebu.L,{first:'O espaço se dobrou para você chegar aqui. Isso não acontece por acaso.',again:'Você atravessou as dimensões de novo.',accept:'Então está feito. Meu espaço será seu caminho e seus ossos, sua armadura.',pact:'Selado entre as dimensões. Nada quebra este contrato.'});
 if(CSD.belzebu){CSD.belzebu.col=0x6a4aff;CSD.belzebu.lines=[[.5,'belzebu','O espaço inteiro está prendendo a respiração.'],[3.6,'p','Então solta. Eu preciso da sua força.'],[6.4,'belzebu','Ossos por dentro, espaço por fora. Agora.'],[9,'p','Vem, Belzebu!']]}}catch(e){}

// ===================================================================== MAGIA ESPACIAL =====================================================================
// 1 · SPATIAL DOMINATION: área de domínio — chão vira vazio estrelado, pilares de distorção, inimigos ficam lentos e tomam dano
function bzsDom(d){ww('SPATIAL DOMINATION!','space');startPose('ob_dom');const cx=P.x,cz=P.z,R=11,g=new T.Group();g.position.set(cx,0,cz);S.add(g);
 const fl=new T.Mesh(new T.CircleGeometry(R,48),new T.MeshBasicMaterial({map:txStars(),transparent:true,opacity:0,depthWrite:false}));fl.rotation.x=-Math.PI/2;fl.position.y=.05;g.add(fl);const rings=[];for(let k=0;k<4;k++){const r=spRing(R*(.4+k*.2),.08,k%2?SC:SV,.7);r.rotation.x=-Math.PI/2;r.position.y=.07+k*.01;g.add(r);rings.push(r)}
 const pil=[];for(let k=0;k<6;k++){const a=k/6*6.283,w=spWarp(.7);w.scale.set(1,5,1);w.position.set(Math.cos(a)*R*.8,2.5,Math.sin(a)*R*.8);g.add(w);pil.push(w)}envSet(.55,6,'shadow');let tk=0;
 kfx({u:(q,dt)=>{const t=q.t,on=t<6,u=Math.min(1,t/.6)*(t>5.6?Math.max(0,(6.2-t)/.6):1);fl.material.opacity=.75*u;rings.forEach((r,i)=>{r.rotation.z=t*(i%2?.6:-.4);r.material.opacity=.7*u});pil.forEach((w,i)=>{w.userData.tick(t+i);w.material.opacity=.18*u;w.position.y=2.5+Math.sin(t*2+i)*.3});
  tk-=dt;if(on&&t>.5&&tk<=0){tk=.5;for(const e of enemies){if(e.hp<=0)continue;if(Math.hypot(e.x-cx,e.z-cz)<R){e.slh=Math.max(e.slh||0,.6);hitE(e,d*.35,null)}}}if(Math.random()<.4*Q())spMotes(cx+rnd(-R,R)*.7,rnd(.5,3),cz+rnd(-R,R)*.7,2,1);return t<6.2},end:()=>kDispose(g)})}
// 2 · SPATIAL RIFT: abre uma fenda 3D que corta tudo em linha e fecha
function bzsRift(d,dx,dz){ww('SPATIAL RIFT!','space');startPose('ob_gate');const f=Math.atan2(dx,dz),x0=P.x+dx*3,z0=P.z+dz*3,rf=spRift(4.2,1.1);rf.position.set(x0,2.1,z0);rf.rotation.y=f;rf.scale.x=.01;S.add(rf);const hit=new Set();
 kfx({u:(q,dt)=>{const t=q.t,o=t<.35?t/.35:t<1.4?1:Math.max(0,1-(t-1.4)/.3);rf.scale.x=Math.max(.01,o);rf.userData.parts.ed.material.opacity=.6+Math.sin(t*20)*.2;
  if(t>.3&&t<1.4){const L=(t-.3)/1.1*16;const cx=x0+dx*L,cz=z0+dz*L;H.hitR(cx,cz,2,d,{st:.3},hit);if(Math.random()<Q())spMotes(cx,1.5,cz,3,1.4);rf.position.set(x0+dx*L*.5,2.1,z0+dz*L*.5);rf.scale.y=1+L*.02}
  if(t>.32&&!q.s){q.s=1;spPulse(x0,z0,2.2,1.5)}return t<1.75},end:()=>kDispose(rf)})}
// 3 · SPATIAL TELEPORTATION: saída (o corpo se comprime para dentro de uma fenda) e chegada (fenda se abre e o corpo se expande)
function bzsTele(d,dx,dz){ww('SPATIAL TELEPORT!','space');let tx=P.x+dx*13,tz=P.z+dz*13;try{const e=chronoTarget(18);if(e){tx=e.x-dx*2;tz=e.z-dz*2}}catch(e){}try{const s=v83Safe(tx,tz);tx=s[0];tz=s[1]}catch(e){}
 const a=spPortal(.9),b=spPortal(.9);a.position.set(P.x,1.2,P.z);a.rotation.y=P.f;b.position.set(tx,1.2,tz);b.rotation.y=P.f;a.scale.setScalar(.01);b.scale.setScalar(.01);S.add(a,b);P.lock=.6;P.iv=Math.max(P.iv||0,.7);
 kfx({u:(q,dt)=>{const t=q.t;a.userData.tick(t);b.userData.tick(t);const sa=t<.2?t/.2:t<.45?1:Math.max(.01,1-(t-.45)*4);a.scale.setScalar(Math.max(.01,sa*1.6));
  if(t<.4)pm.scale.set(1-t*1.6,1+t*.8,1-t*1.6);if(t>=.4&&!q.g){q.g=1;spMotes(P.x,1.2,P.z,14,2);P.x=tx;P.z=tz;pm.position.set(P.x,P.y,P.z);CAMF.x=null}
  if(q.g){const u=t-.4,sb=u<.15?u/.15:u<.35?1:Math.max(.01,1-(u-.35)*4);b.scale.setScalar(Math.max(.01,sb*1.6));const e=Math.min(1,u/.3);pm.scale.set(.36+.64*e,1.32-.32*e,.36+.64*e);if(u>.05&&!q.h){q.h=1;spPulse(tx,tz,2.6,.5);H.hitR(tx,tz,2.6,d,{st:.5})}}
  return t<1},end:()=>{pm.scale.set(1,1,1);kDispose(a);kDispose(b)}})}
// 4 · SPATIAL DIMENSION: o ambiente muda (céu escurece, poeira estelar, anéis em volta) e o dano mágico aumenta por 10s
const DIM108={on:false,t:0};
function bzsDim(){ww('SPATIAL DIMENSION!','space');startPose('ob_dragon');DIM108.on=true;DIM108.t=10;envSet(.75,10,'shadow');const g=new T.Group();S.add(g);const rs=[];for(let k=0;k<3;k++){const r=spRing(1.6+k*.5,.04,k%2?SC:SV,.7);g.add(r);rs.push(r)}const st=new T.Mesh(new T.SphereGeometry(30,20,14),new T.MeshBasicMaterial({map:txStars(),side:T.BackSide,transparent:true,opacity:0,depthWrite:false,fog:false}));g.add(st);
 kfx({u:(q,dt)=>{const t=q.t;g.position.set(P.x,0,P.z);rs.forEach((r,i)=>{r.position.y=.4+i*.6;r.rotation.set(Math.PI/2+Math.sin(t+i)*.3,t*(i%2?1:-1),0)});st.material.opacity=Math.min(.55,t*.6)*(DIM108.t<1?DIM108.t:1);st.rotation.y=t*.03;if(Math.random()<.7*Q())spMotes(P.x+rnd(-6,6),rnd(.5,5),P.z+rnd(-6,6),1,.3,SV2);DIM108.t-=dt;if(DIM108.t<=0){DIM108.on=false;return false}return true},end:()=>{kDispose(g);DIM108.on=false}});toast('Dimensão Espacial: +25% de dano mágico por 10s')}
{const _xd=xDmg;xDmg=function(){return _xd.apply(this,arguments)*(DIM108.on?1.25:1)}}
// 5 · SPATIAL BARRIER: cúpula de espaço distorcido que engole projéteis (com onda no ponto do impacto)
function bzsBar(){ww('SPATIAL BARRIER!','space');startPose('ob_wall');const w=spWarp(2.6,SB);w.material.opacity=0;S.add(w);P.sh=Math.max(P.sh||0,5);const imp=[];
 kfx({u:(q,dt)=>{const t=q.t,u=t<.3?t/.3:t>4.6?Math.max(0,(5-t)/.4):1;w.position.set(P.x,1.2,P.z);w.userData.tick(t);w.material.opacity=.22*u;w.scale.setScalar(.2+.8*u);
  H.eat(P.x,P.z,2.8,p=>{const r=spRing(.5,.06,SC,.9);r.position.copy(p);r.lookAt(P.x,1.2,P.z);S.add(r);imp.push({r,t:0});spMotes(p.x,p.y,p.z,5,1.5)});for(let i=imp.length-1;i>=0;i--){const o=imp[i];o.t+=dt;o.r.scale.setScalar(1+o.t*6);o.r.material.opacity=.9*(1-o.t/.4);if(o.t>.4){kDispose(o.r);imp.splice(i,1)}}return t<5},end:()=>{kDispose(w);imp.forEach(o=>kDispose(o.r))}})}
// 6 · SPATIAL COMPRESSION: uma região do espaço é comprimida — puxa todos para o centro e esmaga
function bzsComp(d,dx,dz){ww('SPATIAL COMPRESSION!','space');startPose('ob_prison');let tg=null;try{tg=chronoTarget(20)}catch(e){}const cx=tg?tg.x:P.x+dx*8,cz=tg?tg.z:P.z+dz*8,g=new T.Group();g.position.set(cx,0,cz);S.add(g);const w=spWarp(3.2);w.position.y=1.4;g.add(w);const rs=[];for(let k=0;k<5;k++){const r=spRing(3.4,.05,k%2?SC:SV,.7);r.rotation.x=-Math.PI/2+k*.6;r.rotation.y=k*.9;r.position.y=1.4;g.add(r);rs.push(r)}
 kfx({u:(q,dt)=>{const t=q.t,u=Math.min(1,t/1.2);w.userData.tick(t*3);w.scale.setScalar(1-u*.85);rs.forEach((r,i)=>{r.scale.setScalar(1-u*.85);r.rotation.z+=dt*(2+i)});
  if(t<1.2)for(const e of enemies){if(e.hp<=0)continue;const ex=cx-e.x,ez=cz-e.z,L=Math.hypot(ex,ez);if(L<6&&L>.3){e.x+=ex/L*Math.min(L,dt*7);e.z+=ez/L*Math.min(L,dt*7);e.st=Math.max(e.st||0,.2)}}
  if(t>1.2&&!q.b){q.b=1;H.hitR(cx,cz,3.4,d*2.2,{st:.8});spPulse(cx,cz,4,1.4);P.shake=Math.max(P.shake,.25);spMotes(cx,1.4,cz,24,4)}if(t>1.2){g.scale.setScalar(Math.max(.01,1-(t-1.2)*4))}return t<1.5},end:()=>kDispose(g)})}
// 7 · SPATIAL PORTAL: dois portais com profundidade — entre em um e saia no outro (8s)
function bzsPortal(d,dx,dz){ww('SPATIAL PORTAL!','space');startPose('ob_gate');const A=spPortal(1.5),B=spPortal(1.5);let ax=P.x+dx*2.5,az=P.z+dz*2.5,bx=P.x+dx*20,bz=P.z+dz*20;try{const s=v83Safe(bx,bz);bx=s[0];bz=s[1]}catch(e){}
 A.position.set(ax,1.6,az);B.position.set(bx,1.6,bz);A.rotation.y=P.f;B.rotation.y=P.f+Math.PI;A.scale.setScalar(.01);B.scale.setScalar(.01);S.add(A,B);let cd=0;
 kfx({u:(q,dt)=>{const t=q.t,u=t<.4?t/.4:t>7.6?Math.max(.01,(8-t)/.4):1;A.scale.setScalar(Math.max(.01,u));B.scale.setScalar(Math.max(.01,u));A.userData.tick(t);B.userData.tick(t);cd-=dt;
  if(t>.4&&t<7.6&&cd<=0){const da=Math.hypot(P.x-ax,P.z-az),db=Math.hypot(P.x-bx,P.z-bz);if(da<1.2){cd=1;P.x=bx+Math.sin(P.f)*1.6;P.z=bz+Math.cos(P.f)*1.6;spMotes(bx,1.5,bz,12,2);CAMF.x=null}else if(db<1.2){cd=1;P.x=ax-Math.sin(P.f)*1.6;P.z=az-Math.cos(P.f)*1.6;spMotes(ax,1.5,az,12,2);CAMF.x=null}}
  if(t>.4&&!q.s){q.s=1;spPulse(bx,bz,3,1.6);H.hitR(bx,bz,3,d,{st:.4})}return t<8},end:()=>{kDispose(A);kDispose(B)}})}
// ---------- registro do grimório de Magia Espacial (só para quem tem o contrato com Belzebu)
const N8={bzdom:'Spatial: Spatial Domination',bzrift:'Spatial: Spatial Rift',bztele:'Spatial: Spatial Teleportation',bzdim:'Spatial: Spatial Dimension',bzbar:'Spatial: Spatial Barrier',bzcomp:'Spatial: Spatial Compression',bzportal:'Spatial: Spatial Portal'};window.N108=N8;
Object.assign(window.C94,{bzdom:d=>bzsDom(d),bzrift:bzsRift,bztele:bzsTele,bzdim:()=>bzsDim(),bzbar:()=>bzsBar(),bzcomp:bzsComp,bzportal:bzsPortal});try{XT.push(...Object.keys(N8))}catch(e){}
GR.bzesp={n:'Magia Espacial',l:4,c:0x2a1a6a,id:'bzesp',dem:'belzebu',s:[[N8.bzrift,12,40,'bzrift',null,4],[N8.bztele,14,30,'bztele',null,6],[N8.bzbar,18,0,'bzbar',null,14],[N8.bzcomp,24,45,'bzcomp',null,10],[N8.bzportal,20,35,'bzportal',null,16],[N8.bzdom,40,30,'bzdom',null,30],[N8.bzdim,30,0,'bzdim',null,40]],p:{t:'Magia do demônio Belzebu: fendas, portais, teletransporte, barreira e domínio do espaço',dmg:.1}};
try{if(typeof MCF!='undefined')MCF.bzesp=.86}catch(e){}try{if(typeof CFX!='undefined')CFX.bzesp=[SV,SC,0,.6]}catch(e){}try{ELP.bzesp=[SV,SC,0,1]}catch(e){}
Object.assign(ANI,{[N8.bzrift]:'ob_gate',[N8.bztele]:'ob_gate',[N8.bzbar]:'ob_wall',[N8.bzcomp]:'ob_prison',[N8.bzportal]:'ob_gate',[N8.bzdom]:'ob_dom',[N8.bzdim]:'ob_dragon'});
Object.assign(RNG,{bzrift:['l',19],bztele:['m',13,'teleporte'],bzbar:['c',3,'defesa'],bzcomp:['m',20,'prisão'],bzportal:['l',20,'portal'],bzdom:['c',11,'área'],bzdim:['c',0,'reforço']});
Object.assign(SKI,{[N8.bzrift]:'<path d="M12 2c3 5-2 7 1 10s-2 6 0 10c-4-3-1-6-3-10s3-6 2-10z" fill="C"/><path d="M12 5v14" stroke="L" stroke-width="1"/>',
 [N8.bztele]:'<circle cx="6" cy="16" r="4" fill="none" stroke="C" stroke-width="2"/><circle cx="18" cy="8" r="4" fill="none" stroke="C" stroke-width="2"/><path d="M9 13l6-3" stroke="L" stroke-width="1.6" stroke-dasharray="2 2"/>',
 [N8.bzbar]:'<path d="M3 18a9 9 0 0 1 18 0z" fill="none" stroke="C" stroke-width="2"/><path d="M7 18a5 5 0 0 1 10 0" fill="none" stroke="L" stroke-width="1.4"/>',
 [N8.bzcomp]:'<circle cx="12" cy="12" r="9" fill="none" stroke="C" stroke-width="1.4" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="5" fill="none" stroke="C" stroke-width="1.6"/><circle cx="12" cy="12" r="2" fill="L"/>',
 [N8.bzportal]:'<ellipse cx="7" cy="12" rx="3.5" ry="7" fill="none" stroke="C" stroke-width="2"/><ellipse cx="17" cy="12" rx="3.5" ry="7" fill="none" stroke="L" stroke-width="2"/>',
 [N8.bzdom]:'<circle cx="12" cy="12" r="9" fill="none" stroke="C" stroke-width="2"/><path d="M12 3v18M3 12h18" stroke="L" stroke-width="1"/><circle cx="12" cy="12" r="3" fill="C"/>',
 [N8.bzdim]:'<circle cx="12" cy="12" r="9" fill="C"/><circle cx="8" cy="9" r="1" fill="L"/><circle cx="15" cy="7" r="1" fill="L"/><circle cx="14" cy="15" r="1.4" fill="L"/>'});
// a Magia Espacial não é exclusiva de admin: quem tem contrato com Belzebu pode usar
{const _xp=xPre;xPre=function(t){if(N8[t]){if(!(P.g&&P.g.id=='bzesp')){toast('Use ALTERAR MAGIA para usar a Magia Espacial.');return false}return true}return _xp.apply(this,arguments)}}
// os outros jogadores veem portais e fendas
{const _xr=xRemote;xRemote=function(o,c){try{const id=Object.keys(N8).find(k=>N8[k]===c.nm);if(id){const f=+c.f||0,p=spPortal(1.2);p.position.set(o.x+Math.sin(f)*2,1.6,o.z+Math.cos(f)*2);p.rotation.y=f;p.scale.setScalar(.01);S.add(p);spPulse(o.x,o.z,2.4,1);kfx({u:q=>{p.userData.tick(q.t);p.scale.setScalar(Math.max(.01,q.t<.3?q.t/.3:Math.max(0,(1.6-q.t)/.4)));return q.t<1.6},end:()=>kDispose(p)});return true}}catch(e){}return _xr.apply(this,arguments)}}

// ===================================================================== SISTEMA DE DUAS MAGIAS =====================================================================
// Cadastro: cada demônio com magia própria diz qual é, de quem é a magia original e a segunda magia.
const DEM108={belzebu:{demonio:'Belzebu',magia:'bzesp',hospedeiro:'Zenon',original:'ossos',segunda:'bzesp'}};window.DEM108=DEM108;
function alt108Info(){if(!P.g)return null;for(const k in DEM108){const D=DEM108[k];if(!DPS[k]||!GR[D.magia])continue;let ok=false;try{ok=relOk(k)}catch(e){}if(!ok)continue;if(P.g.id==D.original||P.g.id==D.magia)return{k,D}}return null}
function alt108Mem(){const v=v82S();v.xpm=v.xpm||{};return v.xpm}
const ALT108={busy:false};
function alt108Toggle(){const I=alt108Info();if(!I){toast('Você precisa de um contrato com um demônio que tenha magia própria.');return}if(ALT108.busy)return;ALT108.busy=true;const D=I.D,to=P.g.id==D.original?D.magia:D.original,from=P.g.id;
 // 1) grimório reage  2) energia atual some  3) Belzebu se manifesta atrás  4) aura muda  5) poderes trocam
 try{if(book){book.visible=true}}catch(e){}spPulse(P.x,P.z,1.8,1.2);try{fxp({x:P.x,y:1.3,z:P.z,c:GR[from].c,n:Math.round(16*Q()),sp:2.5,sz:.16,life:.5,g:-2})}catch(e){}
 let B=null;try{B=bz108Model();const g=B.G;g.position.set(P.x-Math.sin(P.f)*1.3,0,P.z-Math.cos(P.f)*1.3);g.rotation.y=P.f;S.add(g);bz108Appear(B,S,.5)}catch(e){B=null}
 const ring=spRing(1.4,.06,to=='bzesp'?SV:0xeae2cc,.9);ring.rotation.x=-Math.PI/2;ring.position.set(P.x,.06,P.z);S.add(ring);
 kfx({u:(q,dt)=>{const t=q.t;if(B){B.anim(t,'cast');B.G.position.set(P.x-Math.sin(P.f)*1.3,0,P.z-Math.cos(P.f)*1.3);B.G.rotation.y=P.f}ring.position.set(P.x,.06,P.z);ring.scale.setScalar(1+t*1.5);ring.material.opacity=.9*(1-t/1.2);
  try{if(book){book.rotation.y+=dt*14}}catch(e){}
  if(t>.45&&!q.s){q.s=1;const m=alt108Mem();m[from]=(P.xp||[]).slice();P.g=GR[to];P.xp=Array.isArray(m[to])?m[to].slice():[0,0,0,0,0,0,0,0,0];try{book.material.color.setHex(GR[to].c)}catch(e){}try{renderSkills()}catch(e){}try{hudNow()}catch(e){}
   ww(to=='bzesp'?'MAGIA ESPACIAL':'MAGIA DE OSSOS','space');spMotes(P.x,1.4,P.z,18,2.5,to=='bzesp'?SV:0xeae2cc);try{saveGame()}catch(e){}}
  if(t>.9&&B&&!q.v){q.v=1;bz108Vanish(B,.5,()=>kDispose(B.G))}return t<1.25},end:()=>{kDispose(ring);ALT108.busy=false;alt108Btn()}})}
window.alt108Toggle=alt108Toggle;
// botão ALTERAR MAGIA (aparece só para quem tem o contrato) e tecla V
function alt108Btn(){let b=document.getElementById('a-alt');const I=alt108Info();if(!b){const ref=$('a-union');if(!ref||!ref.parentNode)return;b=document.createElement('button');b.className='sc';b.id='a-alt';b.innerHTML='<span>🔄</span><small>Alterar</small>';b.addEventListener('pointerdown',e=>{e.preventDefault();alt108Toggle()});ref.parentNode.insertBefore(b,ref)}
 b.classList.toggle('hide',!I);if(I){const to=P.g.id==I.D.original?I.D.magia:I.D.original;b.title='ALTERAR MAGIA → '+GR[to].n+' (V)';b.classList.toggle('on',P.g.id==I.D.magia)}}
{const _hn=hudNow;hudNow=function(){const r=_hn.apply(this,arguments);try{alt108Btn()}catch(e){}return r}}
document.addEventListener('keydown',e=>{if(e.target&&(e.target.tagName=='INPUT'||e.target.tagName=='TEXTAREA'))return;if(e.code=='KeyV'&&run&&!(MENU&&MENU.on)){const I=alt108Info();if(I){e.preventDefault();alt108Toggle()}}});
// a União com Belzebu funciona nas duas magias; trocar de grimório pelo menu volta à magia original
{const _tu=togUnion;togUnion=function(end){if(P.g&&P.g.id=='bzesp'){if(run||end)togBelz(end);return}return _tu.apply(this,arguments)}}
{const _bt=bzToggle;bzToggle=function(end){if(P.g&&P.g.id=='bzesp'){const g=P.g;P.g=GR.ossos;try{return _bt.apply(this,arguments)}finally{P.g=g}}return _bt.apply(this,arguments)}}
{const _tb=togBelz;togBelz=function(end){if(P.g&&P.g.id=='bzesp'){const g=P.g;P.g=GR.ossos;try{return _tb.apply(this,arguments)}finally{P.g=g}}return _tb.apply(this,arguments)}}
{const _hn=hudNow;hudNow=function(){const r=_hn.apply(this,arguments);try{if(P.g&&P.g.id=='bzesp'){const u=$('a-union');if(u){u.classList.remove('hide');u.classList.toggle('on',!!P.bz)}}}catch(e){}return r}}
// se o contrato for perdido (ou o grimório trocado), volta à magia original sem apagar nada
let ALT108T=0;{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);ALT108T-=dt;if(ALT108T<=0){ALT108T=1.5;try{if(P.g&&P.g.id=='bzesp'&&!alt108Info()&&!ALT108.busy){const m=alt108Mem();m.bzesp=(P.xp||[]).slice();P.g=GR.ossos;P.xp=Array.isArray(m.ossos)?m.ossos.slice():[0,0,0,0,0,0,0,0,0];renderSkills();hudNow()}}catch(e){}}return r}}
window.BZ108={bz108Model,bz108Appear,bz108Vanish,spPortal,spRift,spWarp,spRing,txStars};
}

