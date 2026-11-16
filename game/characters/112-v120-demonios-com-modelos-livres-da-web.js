// ================= V120 · DEMÔNIOS COM MODELOS LIVRES DA WEB (diabos/diabinhos que NÃO são do anime) + CORES PESQUISADAS =================
// Modelos baixados do OpenGameArt.org, recoloridos de preto (cor pesquisada) e com os braços abaixados:
//   Slotos  — "Chained Demon", de Tor Halle-McIntyre (CC-BY 3.0)
//   Plumede — "Imp", de Tor Halle-McIntyre (CC-BY 3.0)
//   Walgner — "Fat Demon" (CC0, domínio público)
//   Belzebu — "Demon", de Grefuntor / Atmostatic (CC-BY 3.0)
// Zagred continua sendo um modelo próprio do jogo (só as cores mudaram). Liebe e Gimodelo NÃO são tocados.
(function(){
const D={};window.D120=D;const D5=window.D115||{};
const SP={slotos:{k:'dm_slotos',h:2.9,sx:.19,sy:.72,hip:.40},plumede:{k:'dm_plumede',h:1.2,sx:.11,sy:.71,hip:.43},walgner:{k:'dm_walgner',h:1.7,sx:.2,sy:.63,hip:.27},belzebu:{k:'dm_belzebu',h:2.55,sx:.15,sy:.8,hip:.48}};
const mk=(c,o)=>{const m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,side:T.DoubleSide});m._keep=1;return m};
const MT={};const mat=(k,f)=>MT[k]||(MT[k]=f());
const black=()=>mat('bk',()=>{const m=new T.MeshLambertMaterial({color:0x0c0c10,side:T.DoubleSide});m._keep=1;return m});
// corpo: o modelo baixado vira uma malha com 4 ossos (2 braços e 2 pernas) para andar e gesticular como os outros personagens.
// Os pesos de braço/perna vêm gravados na cor dos vértices do arquivo (vermelho = braço, verde = perna).
const SKC={};
function skinGeo(key,geo){if(SKC[key])return SKC[key];const g=geo.clone(),P=g.attributes.position,C=g.attributes.color,n=P.count,si=new Uint16Array(n*4),sw=new Float32Array(n*4);for(let i=0;i<n;i++){const x=P.getX(i),a=C?C.getX(i):0,l=C?C.getY(i):0,w=Math.max(a,l),b=a>=l?(x>0?1:2):(x>0?3:4);si[i*4]=0;si[i*4+1]=w>0?b:0;sw[i*4]=1-w;sw[i*4+1]=w}
 g.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));g.deleteAttribute('color');g._keep=1;return SKC[key]={g}}
function body(key,par,u){const s=SP[key],h=new T.Group();par.add(h);try{glb100(s.k,sc=>{let src=null;sc.traverse(o=>{if(o.isMesh&&!src)src=o});if(!src)return;const K=skinGeo(key,src.geometry);if(!K.m){K.m=new T.MeshLambertMaterial({map:src.material.map||null,skinning:true});K.m._keep=1}
  const me=new T.SkinnedMesh(K.g,K.m);me.castShadow=true;me.frustumCulled=false;const root=new T.Bone(),mk=(x,y)=>{const b=new T.Bone();b.position.set(x,y,0);root.add(b);return b};const aL=mk(s.sx,s.sy),aR=mk(-s.sx,s.sy),lL=mk(.07,s.hip),lR=mk(-.07,s.hip);root.updateMatrixWorld(true);const sk=new T.Skeleton([root,aL,aR,lL,lR]);me.add(root);me.bind(sk,new T.Matrix4());
  const w=new T.Group();w.scale.setScalar(s.h);w.add(me);h.add(w);if(u)u.J={aL,aR,lL,lR}})}catch(e){console.warn('v120 body',key,e)}return h}
// movimento dos membros: anda (mv), gesto (g: 0 parado, 1 falar, 2 estender os braços)
function limbs(u,t,mv,sp,g){const J=u&&u.J;if(!J)return;const w=Math.sin(t*sp)*mv;J.lL.rotation.x=w*.55;J.lR.rotation.x=-w*.55;J.aL.rotation.x=-w*.45+Math.sin(t*1.3)*.05;J.aR.rotation.x=w*.45+Math.sin(t*1.3+2)*.05;J.aL.rotation.z=Math.sin(t*1.1)*.03;J.aR.rotation.z=-Math.sin(t*1.1)*.03;
 if(g==1){J.aR.rotation.x=-1.0+Math.sin(t*3)*.25}else if(g==2){J.aL.rotation.x=-1.35;J.aR.rotation.x=-1.35}else if(g==3){J.aL.rotation.x=-2.3;J.aR.rotation.x=-2.3;J.aL.rotation.z=.25;J.aR.rotation.z=-.25}}
// asa de morcego (própria do jogo): 1 malha
function batWing(s,sz){const tips=[[.25,.95],[.8,.85],[1.2,.5],[1.35,.0]].map(([x,y])=>[s*x*sz,y*sz]);const v=[];for(let k=0;k<tips.length-1;k++){const a=tips[k],c=tips[k+1];v.push(0,0,0,a[0],a[1],0,c[0],c[1],0)}v.push(0,0,0,tips[3][0],tips[3][1],0,s*.35*sz,-.35*sz,0);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(v,3));g.computeVertexNormals();g._keep=1;const m=new T.Mesh(g,black());const w=new T.Group();w.add(m);return w}
// asa de inseto (Belzebu, "senhor das moscas" da tradição): plano translúcido
function flyWing(s,len,wd){const sh=new T.Shape();sh.moveTo(0,0);sh.bezierCurveTo(len*.3,wd,len*.9,wd*.9,len,0);sh.bezierCurveTo(len*.9,-wd*.5,len*.3,-wd*.4,0,0);const g=new T.ShapeGeometry(sh,8);g._keep=1;const m=new T.Mesh(g,mat('fw',()=>mk(0xb8b0c8,.32)));m.scale.x=s;const w=new T.Group();w.add(m);return w}
const aura=(r,c)=>{const a=new T.Mesh(new T.SphereGeometry(r,10,8),mat('au'+c,()=>{const m=new T.MeshBasicMaterial({color:c,transparent:true,opacity:.05,blending:T.AdditiveBlending,depthWrite:false});m._keep=1;return m}));return a};
const wp=new T.Vector3();const part=o=>{try{if(CFG.parts)fxp(o)}catch(e){}};
// ---------- SLOTOS: diabo brutamontes acorrentado, pesado e lento
function slotos(){const g=new T.Group(),b=new T.Group();g.add(b);const u=UD(g);const bd=body('slotos',b,u);const au=aura(1.7,0x6a6a80);au.position.y=1.5;g.add(au);let stp=0;Object.assign(u,{b,P:{legs:[new T.Group(),new T.Group()],arms:[new T.Group(),new T.Group()]},key:'slotos',au});
 u.anim115=(t,mv)=>{const br=Math.sin(t*1.1),w=mv>.5?1:0;bd.scale.set(1+br*.012,1+br*.02,1+br*.02);bd.rotation.z=w?Math.sin(t*5)*.07:Math.sin(t*.6)*.015;bd.rotation.x=w?.1:Math.sin(t*.45)*.02;bd.rotation.y=Math.sin(t*.35)*.08;bd.position.y=w?Math.abs(Math.sin(t*5))*.07:0;limbs(u,t,w,5,u.gest||0);
  if(w){const k=Math.floor(t*5/Math.PI);if(k!=stp){stp=k;g.getWorldPosition(wp);try{kShock(wp.x,wp.z,1.2*g.scale.x,0x6a6a80,.3,.08)}catch(e){}}}};
 return g}
// ---------- PLUMEDE: diabinho pequeno e rápido, com rabo e asinhas
function plumede(){const g=new T.Group(),b=new T.Group();g.add(b);const u=UD(g);const bd=body('plumede',b,u);
 const tail=[];let par=new T.Group();par.position.set(0,.42,-.1);par.rotation.x=-2.0;bd.add(par);for(let k=0;k<6;k++){const sg=new T.Group();sg.position.y=k?.11:0;par.add(sg);const m=new T.Mesh(mat('tl',()=>{const c=new T.CylinderGeometry(.014,.02,.11,5);c.translate(0,.055,0);c._keep=1;return c}),black());sg.add(m);tail.push(sg);par=sg}const tip=new T.Mesh(mat('tp',()=>{const c=new T.ConeGeometry(.045,.1,4);c._keep=1;return c}),black());tip.position.y=.15;par.add(tip);
 const wings=[-1,1].map(s=>{const w=batWing(s,.33);w.position.set(s*.06,.8,-.1);bd.add(w);return w});
 const au=aura(.7,0x6a5a8a);au.position.y=.6;g.add(au);let lt=0;Object.assign(u,{b,P:{legs:[0,1,2,3].map(()=>new T.Group()),tail:tail,wings},key:'plumede',au});
 u.anim115=(t,mv)=>{const w=mv>.5?1:0,br=Math.sin(t*2.6);bd.scale.set(1+br*.015,1+br*.03,1+br*.015);bd.position.y=w?Math.abs(Math.sin(t*14))*.08:0;bd.rotation.x=w?.22:0;limbs(u,t,w,14,u.gest||0);bd.rotation.y=Math.sin(t*1.3)*.25;bd.rotation.z=Math.sin(t*.9)*.06;
  tail.forEach((o,k)=>{if(k){o.rotation.x=.3+Math.sin(t*3+k*.7)*.16;o.rotation.z=Math.sin(t*2.2+k*.9)*.22}});wings.forEach((o,i)=>{o.rotation.y=(i?1:-1)*(.5+Math.sin(t*(w?22:7))*.45)});
  lt+=.016;if(w&&lt>.09){lt=0;g.getWorldPosition(wp);part({x:wp.x,y:wp.y+.4*g.scale.y,z:wp.z,c:0x3a3350,n:1,sp:.8,sz:.06,life:.35})}};
 return g}
// ---------- WALGNER: diabo gordo de máscara vermelha, voa com asas de morcego
function walgner(){const g=new T.Group(),b=new T.Group();g.add(b);const u=UD(g);const bd=body('walgner',b,u);const wings=[-1,1].map(s=>{const w=batWing(s,.92);w.position.set(s*.12,1.15,-.22);bd.add(w);return w});
 const au=aura(1.2,0xff2a3a);au.position.y=1.2;g.add(au);Object.assign(u,{b,P:{legs:[new T.Group(),new T.Group()],wings},key:'walgner',au});
 u.anim115=(t,mv)=>{const w=mv>.5?1:0,br=Math.sin(t*1.8);bd.scale.set(1+br*.02,1+br*.025,1+br*.03);bd.position.y=.45+Math.sin(t*2.4)*.1;bd.rotation.x=w?.3:Math.sin(t*.8)*.04;bd.rotation.z=Math.sin(t*1.2)*.05;bd.rotation.y=Math.sin(t*.6)*.15;wings.forEach((o,i)=>{o.rotation.y=(i?1:-1)*(.35+Math.sin(t*(w?13:8))*.5)});au.material.opacity=.04+Math.abs(br)*.025;limbs(u,t,.25,2.2,u.gest||0)};
 return g}
D.build={slotos,plumede,walgner};
// troca os construtores do V115 (a aparição, o som e o resto continuam os mesmos)
if(D5.build){D5.build.slotos=slotos;D5.build.plumede=plumede;D5.build.walgner=walgner}
// encontros e cutscenes
{const _c=csDemon;csDemon=function(id){if(SP[id]&&id!='belzebu'){try{const g=new T.Group(),d=naDevil(id),sc={slotos:1.15,plumede:1.6,walgner:1.3}[id];d.scale.setScalar(sc);g.add(d);const u=UD(d);UD(g).face={slotos:2.5,plumede:1.05,walgner:1.85}[id]*sc;UD(g).arm={slotos:1.0,plumede:.5,walgner:.6}[id]*sc;
  UD(g).anim=(t,m)=>{u.gest=m=='talk'?1:(m=='reach'||m=='reach2')?2:(m=='cast'||m=='contract'||m=='rage')?3:0;u.anim115(t,m=='walk'?1:0);u.b.rotation.x=(m=='reach'||m=='reach2')?.16:m=='talk'?Math.sin(t*5)*.03:0;u.b.rotation.z=m=='talk'?Math.sin(t*6)*.02:0};return g}catch(e){console.warn('v120 cs',id,e)}}
 return _c.apply(this,arguments)}}
// ---------- BELZEBU: o corpo antigo some e entra o diabo de caveira, com 4 asas de mosca (referência da tradição, não do anime)
D.bz=function(B){const R=B.R,G=B.G;if(R.hip)R.hip.visible=false;const h=new T.Group();G.add(h);const bu={};const bd=body('belzebu',h,bu);
 const wings=[[1,.95,.5],[-1,.95,.5],[1,.7,-.25],[-1,.7,-.25]].map(([s,len,tilt],i)=>{const w=flyWing(s,1.5*len,.42*len);w.position.set(s*.1,1.95-(i>1?.2:0),-.2);w.rotation.z=s*tilt;bd.add(w);return{w,s,tilt}});
 const eyes=[-1,1].map(s=>{const e=new T.Mesh(mat('be',()=>{const c=new T.SphereGeometry(.028,6,5);c._keep=1;return c}),mat('bem',()=>{const m=new T.MeshBasicMaterial({color:0xff2a30});m._keep=1;return m}));e.position.set(s*.052,2.4,.16);bd.add(e);return e});
 const _a=B.anim;B.anim=(t,m)=>{try{_a(t,m)}catch(e){}const br=Math.sin(t*1.6),mv=m=='move';bd.position.y=.12+Math.sin(t*1.3)*.07;bd.scale.set(1+br*.012,1+br*.018,1+br*.02);bd.rotation.x=mv?.16:(m=='cast'||m=='reach'||m=='reach2'||m=='contract')?.12:Math.sin(t*.7)*.025;bd.rotation.y=Math.sin(t*.5)*.1;bd.rotation.z=m=='talk'?Math.sin(t*5)*.025:0;
  wings.forEach((o,i)=>{o.w.rotation.y=-o.s*(.5+Math.sin(t*34+i)*.28);o.w.rotation.z=o.s*(o.tilt+Math.sin(t*2+i)*.05)});eyes.forEach(e=>e.scale.setScalar(.8+Math.sin(t*4)*.2));limbs(bu,t,mv?.6:.12,mv?4:1.6,m=='talk'?1:(m=='reach'||m=='reach2')?2:(m=='cast'||m=='contract')?3:0)};
 B.bd120=bd};
// ---------- CORES DAS UNIÕES (pesquisa: nas uniões do Nacht a pele continua a do personagem, chifres e marcas são pretos; Zagred: preto com olhos vermelhos)
try{['canis','equus','felis','gallus','quatro'].forEach(k=>{const d=DSK[k];if(!d)return;d.cl=0x0b0b0e;d.hr=0x0b0b0e;d.sc=0x050507;d.ac=k=='gallus'?0xc01828:0x4a4660});
 DSK.zagred.cl=0x0b0b0e;DSK.zagred.sc=0x050507;DSK.zagred.hr=0x0b0b0e;DSK.zagred.ey=0xff2030;DSK.zagred.sk=0xe6dfd8;DSK.zagred.ac=0x4a4660;
 const _d=dSkin;dSkin=function(fk,L,F){try{if(L&&L.mS&&DSK[fk]&&fk!='liebe'&&fk!='zagred')DSK[fk].sk=L.mS.color.getHex()}catch(e){}return _d.apply(this,arguments)};
 const _n=naForm;naForm=function(fk,L){const F=_n.apply(this,arguments);try{if(fk!='liebe'&&F&&F.g){const hd=(L||PP).hs;const bm=mat('mkb',()=>{const m=new T.MeshBasicMaterial({color:0x08080a});m._keep=1;return m});(hd||F.g).traverse(o=>{if(o.isMesh&&o.userData.stage=='head'&&o.geometry&&o.geometry.type=='PlaneGeometry'&&o.geometry.parameters&&Math.abs(o.geometry.parameters.width-.022)<.001)o.material=bm})}}catch(e){}return F}}catch(e){console.warn('v120 cores',e)}
// textura das Uniões: roupa preta com veios cinza-escuros (sem brilho colorido); a pele do personagem não recebe textura nas uniões do Nacht
try{const MY={};const _dt=dtTex;dtTex=function(kind){if(kind=='nacht_sk'||kind=='gallus_sk')return null;const pal={nacht_cl:['#0b0b0e','#2c2c36'],gallus_cl:['#0b0b0e','#b01626'],zag_cl:['#0b0b0e','#2a2a32'],zag_sk:['#e6dfd8','#141418']}[kind];if(!pal)return _dt.apply(this,arguments);if(MY[kind])return MY[kind];
  const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');let sd=kind.length*977;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};x.fillStyle=pal[0];x.fillRect(0,0,256,256);x.strokeStyle=pal[1];x.lineCap='round';
  if(kind.startsWith('zag')){x.lineWidth=1.6;for(let k=0;k<12;k++){let px=rnd()*256,py=rnd()*256,a=rnd()*6.28;x.beginPath();x.moveTo(px,py);for(let q=0;q<9;q++){a+=(rnd()-.5)*1.1;px+=Math.cos(a)*11;py+=Math.sin(a)*11;x.lineTo(px,py)}x.stroke()}}
  else{x.lineWidth=2;for(let k=0;k<7;k++){const y=18+k*36;x.beginPath();for(let q=0;q<=16;q++){const X=q*16,Y=y+Math.sin(q*1.3+k)*6;q?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}}
  const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t._keep=true;MY[kind]=t;return t};
 ['canis','equus','felis','quatro'].forEach(k=>{if(DTSET[k])DTSET[k].glow=0x000000});if(DTSET.gallus){DTSET.gallus.p='gallus';DTSET.gallus.glow=0xc01828}if(DTSET.zagred)DTSET.zagred.glow=0x000000}catch(e){console.warn('v120 tex',e)}
// carrega os modelos com calma depois que o jogo abre (para já estarem prontos na primeira invocação)
// (V123) os modelos carregam só quando o demônio aparece: nada de carga no meio da partida

})();

