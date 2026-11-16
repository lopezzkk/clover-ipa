// ================= V107 · MAGIA DE OSSOS REMODELADA =================
// Biblioteca de ossos com geometria própria (osso longo com epífises, costela afinando, vértebra, chifre curvo com anéis, lança com farpas, crânio de dragão),
// textura de osso com relevo, formação progressiva (energia → partículas → ossos crescendo → forma completa → esfarelar) e poses de conjuração próprias.
// As teclas e o dano das magias antigas continuam iguais (ospear, owall, ospike, oprison, ogate, odom); novas: obullet, oarmor, odragon.
{
const H=window.H93,rnd=(a,b)=>a+Math.random()*(b-a),Q=()=>KQ(),ww=(w,c)=>{try{xWord(w,c)}catch(e){}};
const OV=0x8a6aff,OV2=0x5a3ad0,ODK=0x1a1420;
// ---------- textura de osso (marfim, estrias, poros, rachaduras) + mapa de relevo
const OT={};
function oTex(kind){if(OT[kind])return OT[kind];const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),bump=kind=='bump';
 const base=kind=='old'?[214,198,168]:kind=='dark'?[150,138,124]:[236,226,204];x.fillStyle=bump?'#808080':'rgb('+base+')';x.fillRect(0,0,256,256);
 // estrias ao longo do osso
 for(let i=0;i<140;i++){const X=Math.random()*256,w=1+Math.random()*2.5,a=bump?(Math.random()<.5?'rgba(255,255,255,.10)':'rgba(0,0,0,.12)'):(Math.random()<.5?'rgba(255,250,235,.10)':'rgba(120,100,70,.10)');x.fillStyle=a;x.fillRect(X,0,w,256)}
 // manchas e poros
 for(let i=0;i<500;i++){const X=Math.random()*256,Y=Math.random()*256,r=Math.random()*1.6+.3;x.fillStyle=bump?'rgba(0,0,0,.35)':'rgba(90,70,50,.30)';x.beginPath();x.arc(X,Y,r,0,6.283);x.fill()}
 for(let i=0;i<14;i++){const X=Math.random()*256,Y=Math.random()*256,r=8+Math.random()*24,g=x.createRadialGradient(X,Y,0,X,Y,r);g.addColorStop(0,bump?'rgba(255,255,255,.12)':kind=='dark'?'rgba(40,30,50,.25)':'rgba(160,130,90,.18)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(X-r,Y-r,r*2,r*2)}
 // rachaduras finas
 x.strokeStyle=bump?'rgba(0,0,0,.6)':'rgba(70,55,40,.45)';x.lineWidth=1;for(let i=0;i<7;i++){let X=Math.random()*256,Y=Math.random()*256;x.beginPath();x.moveTo(X,Y);for(let k=0;k<6;k++){X+=rnd(-10,10);Y+=rnd(4,14);x.lineTo(X,Y)}x.stroke()}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;OT[kind]=t;return t}
const OM={};
function oMat(v){if(OM[v])return OM[v];const kind=v=='old'?'old':v=='dark'?'dark':'ivory';const m=new T.MeshToonMaterial({color:0xffffff,map:oTex(kind),bumpMap:oTex('bump'),bumpScale:.035,gradientMap:gmap,emissive:0x000000});m._keep=1;m.userData.k=v;OM[v]=m;return m}
// material com brilho para a formação (cada efeito ganha uma cópia, para o brilho apagar sozinho)
function oMatF(v){const m=oMat(v).clone();m.emissive=new T.Color(OV);m.emissiveIntensity=.55;return m}
// ---------- juntar geometrias (mantém UV para a textura)
function oMerge(parts){const pos=[],nor=[],uv=[],nm=new T.Matrix3(),v=new T.Vector3();for(const [geo,mtx] of parts){const g=geo.index?geo.toNonIndexed():geo;nm.getNormalMatrix(mtx);const A=g.attributes.position,N=g.attributes.normal,U=g.attributes.uv;
  for(let i=0;i<A.count;i++){v.fromBufferAttribute(A,i).applyMatrix4(mtx);pos.push(v.x,v.y,v.z);v.fromBufferAttribute(N,i).applyMatrix3(nm).normalize();nor.push(v.x,v.y,v.z);if(U)uv.push(U.getX(i),U.getY(i));else uv.push(0,0)}if(g!==geo)g.dispose();geo.dispose()}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(nor,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeBoundingSphere();g._keep=1;return g}
const M4=(x,y,z,rx,ry,rz,s,sy,sz)=>{const m=new T.Matrix4();m.compose(new T.Vector3(x||0,y||0,z||0),new T.Quaternion().setFromEuler(new T.Euler(rx||0,ry||0,rz||0)),new T.Vector3(s||1,sy==null?(s||1):sy,sz==null?(s||1):sz));return m};
// ---------- biblioteca de ossos (geometrias guardadas, com variações)
const OG={};const og=(k,f)=>OG[k]||(OG[k]=f());
// osso longo (eixo Y, comprimento 1): diáfise fina e curva, epífises largas com côndilos
function gLong(v){return og('long'+v,()=>{const P=[],N=22,bend=[.04,.07,.02][v%3];for(let i=0;i<=N;i++){const t=i/N,y=t-.5,e=Math.pow(Math.abs(y)*2,7);P.push(new T.Vector2(.05+.075*e+.006*Math.sin(t*40),y))}
 const sh=new T.LatheGeometry(P,10);const A=sh.attributes.position;for(let i=0;i<A.count;i++){const y=A.getY(i);A.setX(i,A.getX(i)+Math.cos(y*Math.PI)*bend)}sh.computeVertexNormals();
 const L=[[sh,M4()]];for(const s of[-1,1])for(const e of[-1,1])L.push([new T.SphereGeometry(.075,10,8),M4(s*.055,e*.5,0,0,0,0,1,.85,1)]);return oMerge(L)})}
// costela (curva, afina na ponta, levemente achatada)
function gRib(v){return og('rib'+v,()=>{const R=1,a0=.15,a1=[2.2,2.5,1.9][v%3];const pts=[];for(let i=0;i<=12;i++){const a=a0+(a1-a0)*i/12;pts.push(new T.Vector3(Math.cos(a)*R,Math.sin(a)*R*(1+.15*v),Math.sin(i/12*Math.PI)*.08))}
 const cu=new T.CatmullRomCurve3(pts),seg=24,rs=7,g=new T.TubeGeometry(cu,seg,.06,rs,false),A=g.attributes.position;for(let i=0;i<=seg;i++){const t=i/seg,c=cu.getPointAt(t),f=1.15-.75*t+.25*Math.exp(-t*30);for(let j=0;j<=rs;j++){const k=i*(rs+1)+j;const x=A.getX(k)-c.x,y=A.getY(k)-c.y,z=A.getZ(k)-c.z;A.setXYZ(k,c.x+x*f,c.y+y*f,c.z+z*f*.6)}}g.computeVertexNormals();
 return oMerge([[g,M4()],[new T.SphereGeometry(.085,8,6),M4(Math.cos(a0),Math.sin(a0)*(1+.15*v),0)]])})}
// vértebra: corpo, arco, processo espinhoso e transversos
function gVert(){return og('vert',()=>oMerge([[new T.CylinderGeometry(.22,.24,.26,12),M4()],[new T.TorusGeometry(.13,.05,6,12),M4(0,.02,-.25,Math.PI/2)],[new T.ConeGeometry(.07,.5,6),M4(0,.18,-.5,-.9)],[new T.ConeGeometry(.05,.34,5),M4(.3,0,-.15,0,0,-1.4)],[new T.ConeGeometry(.05,.34,5),M4(-.3,0,-.15,0,0,1.4)],[new T.CylinderGeometry(.24,.24,.04,12),M4(0,.15,0)],[new T.CylinderGeometry(.24,.24,.04,12),M4(0,-.15,0)]]))}
// chifre/espinho curvo com anéis de crescimento (eixo Y, altura 1)
function gHorn(v){return og('horn'+v,()=>{const g=new T.ConeGeometry(.16,1,10,14),A=g.attributes.position,cv=[.35,.18,.55][v%3];for(let i=0;i<A.count;i++){const y=A.getY(i),t=y+.5,f=1+.08*Math.sin(t*34)*(1-t);A.setX(i,A.getX(i)*f+cv*t*t);A.setZ(i,A.getZ(i)*f)}g.computeVertexNormals();
 return oMerge([[g,M4(0,.5,0)],[new T.TorusGeometry(.15,.04,5,12),M4(0,.06,0,Math.PI/2)]])})}
// lança de osso (eixo Z): ponteira longa, farpas, anéis de vértebra no cabo e pomo
function gSpear(){return og('spear',()=>{const P=[],N=40;for(let i=0;i<=N;i++){const t=i/N;let r;if(t<.06)r=.11*Math.sin(t/.06*Math.PI/2)+.02;else if(t<.62)r=.065+.02*Math.max(0,Math.sin(t*60))*(t<.6?1:0);else r=.075*(1-(t-.62)/.38)+.004;P.push(new T.Vector2(r,t*3.2-1.6))}
 const sh=new T.LatheGeometry(P,10);const L=[[sh,M4(0,0,0,Math.PI/2)]];for(let k=0;k<3;k++){const a=k/3*Math.PI*2;L.push([new T.ConeGeometry(.045,.42,6),M4(Math.cos(a)*.08,Math.sin(a)*.08,.62,-Math.PI/2+.0,0,0)]);L[L.length-1][1]=M4(Math.cos(a)*.09,Math.sin(a)*.09,.55,Math.PI/2+Math.sin(a)*.5,0,-Math.cos(a)*.5)}
 for(let k=0;k<4;k++)L.push([new T.TorusGeometry(.08,.025,5,10),M4(0,0,-.9+k*.35)]);L.push([new T.SphereGeometry(.12,10,8),M4(0,0,-1.62)]);return oMerge(L)})}
// costela da armadura: arco horizontal que envolve a frente do peito
function gCage(v){return og('cage'+v,()=>{const g=new T.TorusGeometry(.3-v*.012,.036,6,22,Math.PI*1.25);return oMerge([[g,M4(0,0,0,Math.PI/2)]])})}
// projétil pequeno (Bone Bullets): ponta afiada com anel
function gBullet(){return og('bullet',()=>{const P=[];for(let i=0;i<=14;i++){const t=i/14;P.push(new T.Vector2(t<.25?.07*Math.sin(t/.25*Math.PI/2)+.01:.075*(1-(t-.25)/.75)+.003,t*.8-.4))}return oMerge([[new T.LatheGeometry(P,8),M4(0,0,0,Math.PI/2)],[new T.TorusGeometry(.07,.02,4,10),M4(0,0,-.2)]])})}
// garra (dedo do dragão / mão)
function gClaw(){return og('claw',()=>{const g=new T.ConeGeometry(.06,.5,7,8),A=g.attributes.position;for(let i=0;i<A.count;i++){const t=A.getY(i)+.25;A.setZ(i,A.getZ(i)+t*t*.6)}g.computeVertexNormals();return oMerge([[g,M4(0,.25,0)]])})}
// placa curva (ombreira / caneleira)
function gPlate(){return og('plate',()=>{const g=new T.CylinderGeometry(.2,.17,.3,12,3,true,-1.2,2.4),A=g.attributes.position;for(let i=0;i<A.count;i++){const y=A.getY(i);A.setX(i,A.getX(i)*(1+.15*Math.cos(y*9)));A.setZ(i,A.getZ(i)*(1+.15*Math.cos(y*9)))}g.computeVertexNormals();return oMerge([[g,M4()],[new T.TorusGeometry(.19,.025,4,12,2.4),M4(0,.15,0,Math.PI/2,0,-1.2+Math.PI/2)]])})}
// crânio de dragão (sem a mandíbula)
function gSkull(){return og('skull',()=>{const cr=new T.SphereGeometry(.55,16,12),A=cr.attributes.position;for(let i=0;i<A.count;i++){let x=A.getX(i),y=A.getY(i),z=A.getZ(i);if(z>0){z*=1+z*1.6;y*=1-z*.35;x*=1-z*.25}if(y>.3)y+=.05*Math.sin(x*12);A.setXYZ(i,x,y*.85,z)}cr.computeVertexNormals();
 const L=[[cr,M4()]];for(const s of[-1,1]){L.push([new T.TorusGeometry(.17,.06,6,12),M4(s*.3,.18,.32,0,s*.6,0)]);L.push([new T.ConeGeometry(.09,.7,8,6),M4(s*.32,.42,-.35,-1.1,0,s*.35)]);L.push([new T.ConeGeometry(.06,.45,6),M4(s*.42,.2,-.45,-1.3,0,s*.9)]);for(let k=0;k<6;k++)L.push([new T.ConeGeometry(.035,.17,5),M4(s*(.2-.01*k),-.28,.35+k*.13,Math.PI,0,0)])}
 L.push([new T.ConeGeometry(.05,.22,5),M4(0,.4,.45,.5)]);return oMerge(L)})}
function gJaw(){return og('jaw',()=>{const L=[];for(const s of[-1,1]){L.push([new T.CylinderGeometry(.06,.045,1,8),M4(s*.2,0,.5,Math.PI/2,0,s*.18)]);for(let k=0;k<6;k++)L.push([new T.ConeGeometry(.032,.15,5),M4(s*(.19-.025*k),.07,.25+k*.13)])}L.push([new T.SphereGeometry(.08,8,6),M4(0,0,1)]);return oMerge(L)})}
// ---------- peça de osso pronta para animar a formação
function oPiece(geo,mat,o){const m=new T.Mesh(geo,mat);m.castShadow=CFG.gfx!='baixo';m.userData.f={d:o&&o.d||0,dur:o&&o.dur||.35,ax:o&&o.ax||'y',s0:m.scale.clone()};if(o&&o.s)m.scale.setScalar(o.s);m.userData.f.s0=m.scale.clone();return m}
// formação progressiva: cada peça cresce no seu tempo (u 0→1), com brilho que apaga
function oForm(root,t,mat){root.traverse(o=>{const f=o.userData&&o.userData.f;if(!f)return;const u=Math.max(0,Math.min(1,(t-f.d)/f.dur)),e=u<1?1-Math.pow(1-u,3):1;o.visible=u>0;const s=f.s0;
  if(f.ax=='all')o.scale.set(s.x*e,s.y*e,s.z*e);else if(f.ax=='z')o.scale.set(s.x*(.4+.6*e),s.y*(.4+.6*e),s.z*Math.max(.001,e));else o.scale.set(s.x*(.4+.6*e),s.y*Math.max(.001,e),s.z*(.4+.6*e))});
 if(mat)mat.emissiveIntensity=Math.max(0,.55-t*.9)}
// esfarelar: as peças caem, giram e somem
function oCrumble(root,t){root.traverse(o=>{const f=o.userData&&o.userData.f;if(!f)return;if(!f.cv){f.cv=[rnd(-1,1),rnd(1,3),rnd(-1,1)];f.cr=[rnd(-3,3),rnd(-3,3)]}const k=Math.max(0,1-t/.7);o.position.y-=f.cv[1]*.016*(1+t*4);o.rotation.x+=f.cr[0]*.016;o.rotation.z+=f.cr[1]*.016;o.scale.multiplyScalar(.985);if(k<=0)o.visible=false})}
// energia: motas violeta convergindo para um ponto (preparação da magia)
function oGather(x,y,z,n,r){for(let k=0;k<Math.round((n||12)*Q());k++){const a=Math.random()*6.283,rr=(r||1.4)*(.6+Math.random()*.6);fxp({x:x+Math.cos(a)*rr,y:y+rnd(-.5,.6),z:z+Math.sin(a)*rr,c:Math.random()<.7?OV:0xf0e6d0,n:1,sp:.2,sz:.09,life:.45,g:0,up:0})}try{fxp({x,y,z,c:OV,n:Math.round(4*Q()),sp:.4,sz:.18,life:.35})}catch(e){}}
function oDust(x,z,r,n){fxp({x,y:.2,z,c:0x9a8a74,n:Math.round((n||10)*Q()),sp:(r||1.5)*2,sz:.28,life:.7,up:1.2,g:-1});fxp({x,y:.4,z,c:0xe8dcc4,n:Math.round((n||10)*.5*Q()),sp:(r||1.5)*1.6,sz:.12,life:.5,up:2})}
// ---------- poses de conjuração próprias (somadas ao sistema de poses do jogo)
Object.assign(POSD,{ob_spear:1.25,ob_bullet:1.1,ob_wall:1.2,ob_prison:1.2,ob_armor:1.3,ob_dragon:1.8,ob_spike:.9,ob_gate:.9,ob_dom:1.6});
{const _ap=applyPose;applyPose=function(n,u,e){if(!/^ob_/.test(n))return _ap.apply(this,arguments);const A=PP.arms,L=PP.legs,r=PP.root,sm=x=>x<=0?0:x>=1?1:x*x*(3-2*x),sg=(a,b)=>sm((u-a)/(b-a)),R=A[1],Lf=A[0];
 if(n=='ob_spear'){const c=sg(0,.45),t=sg(.55,.7),b=sg(.82,1);R[0].rotation.x=(-2.7*c+2.0*t)*(1-b);R[0].rotation.z=-.25*c*(1-t);R[1].rotation.x=-.9*c*(1-t);Lf[0].rotation.x=-1.0*c*(1-b)+.4*t*(1-b);r.rotation.y=(.55*c-.8*t)*(1-b);L[1][0].rotation.x=-.4*t*(1-b);L[0][0].rotation.x=.25*t*(1-b)}
 else if(n=='ob_bullet'){const c=sg(0,.25),b=sg(.85,1),f=Math.sin(u*Math.PI*10)*.15;R[0].rotation.x=(-1.55+f)*c*(1-b);R[1].rotation.x=-.1*c;Lf[0].rotation.x=-.6*c*(1-b);Lf[1].rotation.x=-1.4*c*(1-b);r.rotation.y=-.2*c*(1-b)}
 else if(n=='ob_wall'){const c=sg(0,.35),p=sg(.35,.6),b=sg(.85,1);A.forEach((a,i)=>{a[0].rotation.x=(-.3*c-2.4*p)*(1-b);a[0].rotation.z=(i?-1:1)*(.3*c+.2*p)*(1-b);a[1].rotation.x=-.5*c*(1-p)});r.rotation.x=.35*c*(1-p)*(1-b);L.forEach(l=>{l[0].rotation.x=-.35*c*(1-p)*(1-b);l[1].rotation.x=.6*c*(1-p)*(1-b)})}
 else if(n=='ob_prison'){const c=sg(0,.4),k=sg(.45,.6),b=sg(.85,1);R[0].rotation.x=(-1.6*c-.5*k)*(1-b);R[1].rotation.x=(-.2-1.3*k)*c*(1-b);Lf[0].rotation.x=-.4*c*(1-b);r.rotation.y=-.25*c*(1-b)}
 else if(n=='ob_armor'){const c=sg(0,.4),o=sg(.5,.7),b=sg(.88,1);A.forEach((a,i)=>{a[0].rotation.x=(-.9*c*(1-o)-.3*o)*(1-b);a[0].rotation.z=(i?1:-1)*(.6*c*(1-o))+(i?-1:1)*1.1*o*(1-b);a[1].rotation.x=(-1.9*c*(1-o)-1.6*o)*(1-b)});r.rotation.x=(.15*c*(1-o)-.12*o)*(1-b)}
 else if(n=='ob_dragon'){const c=sg(0,.3),p=sg(.35,.55),b=sg(.85,1);A.forEach((a,i)=>{a[0].rotation.x=(-1.0*c-1.9*p)*(1-b);a[0].rotation.z=(i?-1:1)*(.25+.35*p)*(1-b);a[1].rotation.x=-.4*c*(1-p)});r.rotation.x=(.25*c-.3*p)*(1-b);r.position.y=-.08*c*(1-p)*(1-b)}
 else if(n=='ob_spike'){const c=sg(0,.35),s=sg(.35,.5),b=sg(.8,1);R[0].rotation.x=(-2.5*c+2.2*s)*(1-b);Lf[0].rotation.x=(-2.3*c+2.0*s)*(1-b);r.rotation.x=.45*s*(1-b);L.forEach(l=>{l[0].rotation.x=-.5*s*(1-b);l[1].rotation.x=.9*s*(1-b)})}
 else if(n=='ob_gate'){const c=sg(0,.4),b=sg(.8,1);R[0].rotation.x=-1.5*c*(1-b);R[0].rotation.z=-.4*c*(1-b);R[1].rotation.x=-.3*c;r.rotation.y=-.3*c*(1-b)}
 else if(n=='ob_dom'){const c=sg(0,.3),p=sg(.3,.5),b=sg(.85,1);A.forEach((a,i)=>{a[0].rotation.x=(-1.2*c-1.7*p)*(1-b);a[0].rotation.z=(i?-1:1)*(.9*c-.3*p)*(1-b)});r.rotation.x=-.2*p*(1-b)}}}
// ===================================================================== AS MAGIAS =====================================================================
const hx=()=>({x:P.x+Math.sin(P.f+.5)*.55,y:1.55+(P.y||0),z:P.z+Math.cos(P.f+.5)*.55});
// 1 · BONE BULLETS: os projéteis se formam um a um ao lado da mão e saem em sequência, teleguiados de leve
function oBullets(d,dx,dz){ww('BONE BULLETS!','shadow');startPose('ob_bullet');const N=7,B=[],mat=oMatF('ivory');let tg=null;try{tg=chronoTarget(26)}catch(e){}
 for(let k=0;k<N;k++){const m=oPiece(gBullet(),mat,{d:k*.07,dur:.22,ax:'z',s:1.25});B.push({m,a:(k-(N-1)/2)*.22,fired:0});S.add(m)}
 kfx({u:(q,dt)=>{const t=q.t,h=hx();q.lt=(q.lt||0)+dt;oForm({traverse:f=>B.forEach(b=>f(b.m))},t,mat);
  B.forEach((b,i)=>{if(b.fired)return;const a=P.f+b.a,ox=Math.sin(P.f+Math.PI/2)*b.a*1.2,oz=Math.cos(P.f+Math.PI/2)*b.a*1.2;b.m.position.set(h.x+ox+Math.sin(P.f)*.3,h.y+.15*Math.sin(t*9+i)+Math.abs(b.a)*.4,h.z+oz+Math.cos(P.f)*.3);b.m.rotation.set(0,P.f,0);if(Math.random()<.2*Q())oGather(b.m.position.x,b.m.position.y,b.m.position.z,2,.4);
   if(t>.55+i*.09){b.fired=1;let ax=Math.sin(P.f),az=Math.cos(P.f);const e=tg&&tg.hp>0?tg:H.near(P.x,P.z,26);if(e){const L=Math.hypot(e.x-b.m.position.x,e.z-b.m.position.z)||1;ax=(e.x-b.m.position.x)/L;az=(e.z-b.m.position.z)/L}S.remove(b.m);
    H.wave(b.m,b.m.position.x,b.m.position.y,b.m.position.z,ax,az,46,30,.9,d*1.1,{sl:1},{tick:m=>{if(Math.random()<.6*Q())fxp({x:m.position.x,y:m.position.y,z:m.position.z,c:OV,n:1,sp:.3,sz:.08,life:.25})}});try{fxp({x:b.m.position.x,y:b.m.position.y,z:b.m.position.z,c:0xf0e6d0,n:3,sp:2,sz:.1,life:.2})}catch(e){}}});
  return B.some(b=>!b.fired)},end:()=>{}})}
// 2 · BONE SPEAR: a lança se forma acima do ombro (cabo → anéis → ponta → farpas), gira, é arremessada e explode em estilhaços
function oSpearV(d,dx,dz){ww('BONE SPEAR!','shadow');startPose('ob_spear');const g=new T.Group(),mat=oMatF('ivory');const sp=oPiece(gSpear(),mat,{d:.05,dur:.55,ax:'z',s:1});sp.scale.set(1.9,1.9,1.6);sp.userData.f.s0=sp.scale.clone();g.add(sp);
 const aura=new T.Mesh(new T.CylinderGeometry(.22,.22,4.2,12,1,true),GLM(OV,.25));aura.rotation.x=Math.PI/2;g.add(aura);S.add(g);let thrown=false;
 kfx({u:(q,dt)=>{const t=q.t;if(!thrown){oForm(g,t,mat);const ox=Math.sin(P.f-Math.PI/2)*.35,oz=Math.cos(P.f-Math.PI/2)*.35;g.position.set(P.x+ox-Math.sin(P.f)*.3,2.45+(P.y||0)+Math.sin(t*6)*.05,P.z+oz-Math.cos(P.f)*.3);g.rotation.set(-.15,P.f,0);sp.rotation.z=t*6;aura.material.opacity=.25*Math.min(1,t*2);
   if(Math.random()<.5*Q())oGather(g.position.x,g.position.y,g.position.z,3,1.2);
   if(t>.72){thrown=true;S.remove(g);let ax=dx,az=dz;const e=(()=>{try{return chronoTarget(32)}catch(er){return null}})();if(e){const L=Math.hypot(e.x-P.x,e.z-P.z)||1;ax=(e.x-P.x)/L;az=(e.z-P.z)/L}
    H.wave(g,g.position.x,1.5+(P.y||0),g.position.z,ax,az,52,34,1.3,d*3.2,{sl:1},{tick:m=>{sp.rotation.z+=.5;if(Math.random()<Q())fxp({x:m.position.x,y:m.position.y,z:m.position.z,c:Math.random()<.5?OV:0xe8dcc4,n:1,sp:.6,sz:.14,life:.35})}});
    tmr.push({t:.62,f:()=>{const x=g.position.x,z=g.position.z;kShock(x,z,2.2,OV,.35,1.2);oDust(x,z,2,14);for(let k=0;k<6;k++){const s=oPiece(gHorn(k%3),oMat('old'),{d:0,dur:.12});s.position.set(x+rnd(-1,1),.1,z+rnd(-1,1));s.rotation.set(rnd(-.5,.5),rnd(0,6),rnd(-.5,.5));s.scale.setScalar(.7);s.userData.f.s0=s.scale.clone();S.add(s);const t0=performance.now();kfx({u:(qq)=>{if(qq.t<.15)oForm(s,qq.t);else if(qq.t>.9)oCrumble(s,qq.t-.9);return qq.t<1.5},end:()=>kDispose(s)})}H.hitR(x,z,2.4,d*.8,{st:.3})}})}}
  return !thrown},end:()=>{}})}
// 3 · BONE WALL: muralha de vértebras, costelas encaixadas e espinhos, subindo do chão com poeira e energia
function oWallV(){ww('BONE WALL!','shadow');startPose('ob_wall');const g=new T.Group(),mat=oMatF('ivory'),m2=oMat('old');const W=11;
 for(let k=0;k<W;k++){const x=(k-(W-1)/2)*.62,h=1.6+Math.cos((k-(W-1)/2)/W*3)*1.2,dl=Math.abs(k-(W-1)/2)*.05;
  const lb=oPiece(gLong(k),k%2?mat:m2,{d:dl,dur:.4});lb.scale.set(2.2,h*1.25,2.2);lb.userData.f.s0=lb.scale.clone();lb.position.set(x,h*.62,0);lb.rotation.z=(k%2?.06:-.06);g.add(lb);
  const v=oPiece(gVert(),mat,{d:dl+.15,dur:.3,ax:'all'});v.scale.setScalar(.9);v.userData.f.s0=v.scale.clone();v.position.set(x,h*1.25+.1,0);v.rotation.x=-Math.PI/2;g.add(v);
  const hn=oPiece(gHorn(k),m2,{d:dl+.3,dur:.25});hn.scale.setScalar(.9+Math.random()*.4);hn.userData.f.s0=hn.scale.clone();hn.position.set(x,h*1.25+.25,0);hn.rotation.set(-.2,0,(k-(W-1)/2)*.08);g.add(hn)}
 for(let r=0;r<3;r++){const rb=oPiece(gRib(r),mat,{d:.25+r*.08,dur:.35,ax:'all'});rb.scale.set(3.3-r*.35,1.1,1.6);rb.userData.f.s0=rb.scale.clone();rb.position.set(-1.5+r*.15,.6+r*.7,.35);rb.rotation.set(0,0,-.1);g.add(rb);const rb2=oPiece(gRib(r),mat,{d:.3+r*.08,dur:.35,ax:'all'});rb2.scale.set(-(3.3-r*.35),1.1,1.6);rb2.userData.f.s0=rb2.scale.clone();rb2.position.set(1.5-r*.15,.6+r*.7,.35);g.add(rb2)}
 S.add(g);P.sh=Math.max(P.sh||0,2);let dusted=0;
 kfx({u:(q,dt)=>{const t=q.t,fx=Math.sin(P.f),fz=Math.cos(P.f);g.position.set(P.x+fx*2.4,0,P.z+fz*2.4);g.rotation.y=P.f;if(t<1.2)oForm(g,t,mat);if(!dusted&&t>.05){dusted=1;oDust(g.position.x,g.position.z,3.2,22);kShock(g.position.x,g.position.z,3.4,OV,.4,.1);P.shake=Math.max(P.shake,.2)}
  if(t<.7&&Math.random()<.6*Q())oDust(g.position.x+rnd(-3,3)*Math.cos(P.f),g.position.z-rnd(-3,3)*Math.sin(P.f),.8,3);
  window.H93.eat(g.position.x,g.position.z,3.2,p=>{kShock(p.x,p.z,.8,OV,.2,p.y);fxp({x:p.x,y:p.y,z:p.z,c:0xe8dcc4,n:5,sp:2,sz:.12,life:.4})});if(t>4.4)oCrumble(g,t-4.4);return t<5.2},end:()=>kDispose(g)})}
// 4 · PIERCING SPIKES: chifres curvos rompem o chão em linha
function oSpikesV(d,dx,dz){ww('PIERCING SPIKES!','shadow');startPose('ob_spike');const hit=new Set(),G=[],mat=oMatF('ivory');
 for(let k=1;k<=10;k++)tmr.push({t:.32+k*.05,f:()=>{const x=P.x+dx*k*1.4+rnd(-.3,.3),z=P.z+dz*k*1.4+rnd(-.3,.3),g=new T.Group();g.position.set(x,0,z);for(let j=0;j<3;j++){const s=oPiece(gHorn(j+k),j?oMat('old'):mat,{d:j*.04,dur:.14});s.scale.setScalar(rnd(1.6,2.6));s.userData.f.s0=s.scale.clone();s.position.set(rnd(-.5,.5),0,rnd(-.5,.5));s.rotation.set(rnd(-.35,.35),rnd(0,6.28),rnd(-.35,.35));g.add(s)}S.add(g);G.push({g,t0:performance.now()});
  H.hitR(x,z,1.6,d,{st:.4},hit);kShock(x,z,1.2,OV,.2,.2);oDust(x,z,1,6)}});
 kfx({u:(q,dt)=>{G.forEach(o=>{const a=(performance.now()-o.t0)/1000;if(a<.4)oForm(o.g,a,mat);else if(a>1.2)oCrumble(o.g,a-1.2)});return q.t<2.6},end:()=>G.forEach(o=>kDispose(o.g))})}
// 5 · BONE PRISON: costelas saem do chão em volta do alvo, curvam para dentro e se travam com um anel de vértebras
function oPrisonV(d,dx,dz){ww('BONE PRISON!','shadow');startPose('ob_prison');let tg=null;try{tg=chronoTarget(20)}catch(e){}const cx=tg?tg.x:P.x+dx*9,cz=tg?tg.z:P.z+dz*9,g=new T.Group(),mat=oMatF('ivory'),R=[];const N=12;
 for(let k=0;k<N;k++){const a=k/N*6.283,p=new T.Group();p.rotation.y=-a;p.position.set(Math.cos(a)*2.1,0,Math.sin(a)*2.1);const rb=oPiece(gRib(k%3),k%2?mat:oMat('old'),{d:.1+k*.03,dur:.35,ax:'all'});rb.scale.set(2.3,2.6,1.4);rb.userData.f.s0=rb.scale.clone();rb.rotation.set(0,Math.PI/2,Math.PI/2+.15);rb.position.set(0,0,0);p.add(rb);g.add(p);R.push(p)}
 const ring=new T.Group();for(let k=0;k<10;k++){const a=k/10*6.283,v=oPiece(gVert(),mat,{d:.7+k*.02,dur:.2,ax:'all'});v.scale.setScalar(.6);v.userData.f.s0=v.scale.clone();v.position.set(Math.cos(a)*.75,0,Math.sin(a)*.75);v.rotation.y=-a;ring.add(v)}ring.position.y=3.4;g.add(ring);
 const floor=new T.Mesh(new T.RingGeometry(1.6,2.4,40),GLM(OV,.5));floor.rotation.x=-Math.PI/2;floor.position.y=.06;g.add(floor);g.position.set(cx,0,cz);S.add(g);let trap=[];
 kfx({u:(q,dt)=>{const t=q.t;oForm(g,t,mat);const cl=Math.min(1,Math.max(0,(t-.25)/.5));R.forEach(p=>{p.rotation.z=0;p.children[0].rotation.x=-.9*(1-cl)});ring.rotation.y=t*.8;floor.material.opacity=.5*(t<.3?t/.3:Math.max(0,1-(t-.5)));
  if(t>.2&&t<.5&&Math.random()<.5*Q())oDust(cx+rnd(-2,2),cz+rnd(-2,2),.6,3);
  if(t>.6&&!q.c){q.c=1;trap=H.hitR(cx,cz,2.4,d*.5,{st:3});kShock(cx,cz,2.4,OV,.35,.3);P.shake=Math.max(P.shake,.15)}trap.forEach(e=>e.st=Math.max(e.st||0,.2));
  if(t>2.6&&!q.s){q.s=1;H.hitR(cx,cz,2.4,d,{st:.5});kShock(cx,cz,2.6,OV,.3,2)}if(t>2.7)oCrumble(g,t-2.7);return t<3.4},end:()=>kDispose(g)})}
// 6 · BONE GATE: dois portais de vértebras, atravessa o espaço
function boneRingV(){const g=new T.Group(),mat=oMatF('ivory');for(let k=0;k<14;k++){const a=k/14*6.283,v=oPiece(gVert(),k%2?mat:oMat('old'),{d:k*.015,dur:.15,ax:'all'});v.scale.setScalar(.6);v.userData.f.s0=v.scale.clone();v.position.set(Math.cos(a)*1.35,Math.sin(a)*1.35,0);v.rotation.z=a+Math.PI/2;v.rotation.x=Math.PI/2;g.add(v)}
 const vo=new T.Mesh(new T.CircleGeometry(1.15,32),DMt(0x140820,.85));g.add(vo);const gl=new T.Mesh(new T.RingGeometry(.85,1.2,32),GLM(OV,.6));g.add(gl);g.userData.mat=mat;return g}
function oGateV(d,dx,dz){ww('BONE GATE!','space');startPose('ob_gate');const a=boneRingV(),b=boneRingV(),fx=dx,fz=dz;a.position.set(P.x+fx*1.2,1.4,P.z+fz*1.2);a.rotation.y=P.f;const tx=P.x+fx*14,tz=P.z+fz*14;b.position.set(tx,1.4,tz);b.rotation.y=P.f;S.add(a,b);
 kfx({u:(q,dt)=>{const t=q.t;oForm(a,t*1.4,a.userData.mat);oForm(b,t*1.4,b.userData.mat);a.rotation.z+=dt*2;b.rotation.z-=dt*2;if(t>.35&&!q.g){q.g=1;P.x=tx;P.z=tz;pm.position.set(P.x,P.y,P.z);kShock(tx,tz,2.6,OV,.3,.5);H.hitR(tx,tz,3,d,{st:.6});oDust(tx,tz,2.4,12)}if(t>1)oCrumble(a,t-1),oCrumble(b,t-1);return t<1.6},end:()=>{kDispose(a);kDispose(b)}})}
// 7 · OSSUARY DOMINION: crânio gigante emerge, área de ossos e chuva de lanças
function oDominionV(d){ww('OSSUARY DOMINION!','shadow');startPose('ob_dom');P.shake=Math.max(P.shake,.25);const cx=P.x,cz=P.z,R=12,ci=fCircle(R,'g');ci.position.set(cx,.08,cz);S.add(ci);const mat=oMatF('ivory');
 const sk=new T.Group(),cr=oPiece(gSkull(),mat,{d:0,dur:.6,ax:'all'}),jw=oPiece(gJaw(),mat,{d:.3,dur:.4,ax:'all'});cr.scale.setScalar(3);cr.userData.f.s0=cr.scale.clone();jw.scale.setScalar(3);jw.userData.f.s0=jw.scale.clone();jw.position.set(0,-1.1,-.2);sk.add(cr,jw);
 for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.35,10,8),GLM(OV,.95));e.position.set(s*1.1,.6,1.2);sk.add(e)}sk.position.set(cx+Math.sin(P.f)*9,-5,cz+Math.cos(P.f)*9);sk.rotation.y=P.f+Math.PI;S.add(sk);const SP=[];
 // costelas gigantes em volta da área
 const ribs=new T.Group();for(let k=0;k<8;k++){const a=k/8*6.283,p=new T.Group();p.rotation.y=-a;p.position.set(cx+Math.cos(a)*R*.95,0,cz+Math.sin(a)*R*.95);const rb=oPiece(gRib(k%3),oMat('old'),{d:.2+k*.05,dur:.5,ax:'all'});rb.scale.set(4,5,2);rb.userData.f.s0=rb.scale.clone();rb.rotation.set(0,Math.PI/2,Math.PI/2+.4);p.add(rb);ribs.add(p)}S.add(ribs);
 kfx({u:(q,dt)=>{const t=q.t;kCircleTick(ci,dt,Math.min(1,t/.4)*(t>3?Math.max(0,1-(t-3)*3):1),Math.max(0,Math.sin(t*8))*.3);oForm(sk,t,mat);oForm(ribs,t);sk.position.y=Math.min(4.5,-5+t*12);if(t>3)sk.position.y=4.5-(t-3)*14;jw.rotation.x=Math.abs(Math.sin(t*5))*.35;
  if(t>.6&&t<3&&Math.random()<dt*14){const a=Math.random()*6.283,r=Math.sqrt(Math.random())*R,x=cx+Math.cos(a)*r,z=cz+Math.sin(a)*r,s=new T.Mesh(gSpear(),oMat('ivory'));s.position.set(x,16,z);s.rotation.x=Math.PI/2;S.add(s);SP.push({s,x,z})}
  for(let i=SP.length-1;i>=0;i--){const o=SP[i];o.s.position.y-=dt*36;if(o.s.position.y<1){kShock(o.x,o.z,1.2,OV,.2,.2);oDust(o.x,o.z,.8,3);H.hitR(o.x,o.z,1.4,d,null);S.remove(o.s);SP.splice(i,1)}}if(t>3)oCrumble(ribs,t-3);return t<3.6||SP.length},end:()=>{kDispose(ci);kDispose(sk);kDispose(ribs);SP.forEach(o=>S.remove(o.s))}})}
// 8 · BONE ARMOR: a armadura cresce no corpo (peito → costelas → ombros → braços → mãos → pernas → costas) e acompanha as animações
const ARM107={on:false};
function oArmor(){if(ARM107.on){toast('A armadura óssea já está ativa.');return}ww('BONE ARMOR!','shadow');startPose('ob_armor');const L=PP,tor=L.tspace||L.root,mat=oMatF('ivory'),m2=oMat('old'),parts=[];
 const add=(geo,m,par,x,y,z,rx,ry,rz,s,d,ax)=>{const p=oPiece(geo,m,{d,dur:.3,ax:ax||'all'});p.position.set(x,y,z);p.rotation.set(rx||0,ry||0,rz||0);if(s)(Array.isArray(s)?p.scale.set(...s):p.scale.setScalar(s));p.userData.f.s0=p.scale.clone();par.add(p);parts.push(p);return p};
 // peitoral (esterno) e costelas em volta do peito
 add(gLong(1),mat,tor,0,1.33,.28,0,0,0,[1.5,.46,1.2],.05,'y');for(let k=0;k<5;k++)add(gCage(k%3),k%2?mat:m2,tor,0,1.56-k*.1,.02,0,.3927,0,[1.12-k*.04,1,.95],.12+k*.05);
 // costas: placas e dois espinhos grandes
 for(let k=0;k<5;k++)add(gVert(),m2,tor,0,1.66-k*.15,-.36,-Math.PI/2+.2,0,0,.36,.3+k*.04);for(const s of[-1,1])for(let k=0;k<2;k++)add(gHorn(s>0?k:1-k),k?m2:mat,tor,s*(.14+k*.06),1.6-k*.22,-.38,-1.05,0,s*(.5+k*.25),[.55-k*.12,.75-k*.15,.55-k*.12],.55+k*.05);
 // ombros, braços, mãos
 PP.arms.forEach((a,i)=>{const s=i?1:-1;add(gPlate(),mat,a[0],0,-.02,0,0,s>0?Math.PI:0,0,[1.05,.75,1.05],.4);add(gHorn(i),m2,a[0],s*.02,.06,-.02,-.4,0,s*-.9,[.5,.6,.5],.48);add(gPlate(),m2,a[0],0,-.2,0,0,s>0?Math.PI:0,0,[.75,.6,.75],.5);
  if(a[1]){add(gPlate(),mat,a[1],0,-.15,0,0,s>0?Math.PI:0,0,[.7,.85,.7],.6);add(gHorn(i+1),m2,a[1],0,-.06,-.07,2.5,0,0,[.35,.5,.35],.66);for(let k=0;k<3;k++)add(gClaw(),mat,a[1],(k-1)*.03,-.33,.04,.4,0,0,.35,.75+k*.03)}});
 // pernas: coxa e canela com joelheira pontuda
 PP.legs.forEach((l,i)=>{add(gPlate(),m2,l[0],0,-.2,0,0,Math.PI,0,[.9,1.1,.9],.8);if(l[1]){add(gPlate(),mat,l[1],0,-.2,0,0,Math.PI,0,[.75,1.1,.75],.88);add(gHorn(i),m2,l[1],0,.02,.08,1.2,0,0,[.35,.45,.35],.95)}});
 ARM107.on=true;ARM107.parts=parts;ARM107.mat=mat;ARM107.t=18;const old=P.xdef||1;ARM107.old=old;P.xdef=old*.55;kShock(P.x,P.z,1.8,OV,.4,1);
 kfx({u:(q,dt)=>{const t=q.t;if(t<1.4){parts.forEach(p=>{const f=p.userData.f,u=Math.max(0,Math.min(1,(t-f.d)/f.dur)),e=u<1?1-Math.pow(1-u,3):1;p.visible=u>0;p.scale.set(f.s0.x*e,f.s0.y*e,f.s0.z*e)});mat.emissiveIntensity=Math.max(.08,1-t)}else mat.emissiveIntensity=.02+Math.sin(t*3)*.015;
  if(t<1.2&&Math.random()<.7*Q())oGather(P.x,1.2,P.z,3,.8);ARM107.t-=dt;
  if(ARM107.t<=0||P.dead>0||!P.g||P.g.id!='ossos'){if(!q.e){q.e=t}const k=t-q.e;parts.forEach(p=>{p.scale.multiplyScalar(.9);p.position.y-=.004});if(k>.5)return false}return true},
  end:()=>{parts.forEach(p=>{if(p.parent)p.parent.remove(p)});ARM107.on=false;P.xdef=ARM107.old||1;toast('A armadura óssea se desfez.')}});
 toast('Armadura óssea: -45% de dano recebido por 18s')}
// 9 · BONE DRAGON: dragão de ossos com esqueleto articulado (crânio, mandíbula, pescoço, coluna, costelas, patas, asas e cauda) e animação própria
function oDragonBuild(mat,m2){const D=new T.Group(),J={neck:[],spine:[],tail:[],legs:[],wings:[]};let dl=0;const nd=()=>(dl+=.011);
 const mk=(geo,m,s,ax)=>{const p=oPiece(geo,m,{d:nd(),dur:.3,ax:ax||'all'});if(s)(Array.isArray(s)?p.scale.set(...s):p.scale.setScalar(s));p.userData.f.s0=p.scale.clone();return p};
 // coluna (do peito para trás) — cada vértebra é uma articulação filha da anterior
 let par=D;for(let i=0;i<7;i++){const j=new T.Group();j.position.z=i?-.55:0;par.add(j);const v=mk(gVert(),i%2?mat:m2,.8);v.rotation.x=-Math.PI/2;j.add(v);J.spine.push(j);
  if(i>0&&i<6)for(const s of[-1,1]){const r=mk(gRib(i%3),m2,[.9-i*.05,1.0-i*.06,.9]);r.rotation.set(0,s>0?-Math.PI/2:Math.PI/2,Math.PI);r.position.set(s*.05,-.1,0);j.add(r)}par=j}
 // cauda
 for(let i=0;i<10;i++){const j=new T.Group();j.position.z=-.4+i*.015;par.add(j);const v=mk(gVert(),i%2?mat:m2,.7-i*.045);v.rotation.x=-Math.PI/2;j.add(v);J.tail.push(j);par=j}{const tp=mk(gHorn(2),mat,[.8,1.4,.8]);tp.rotation.x=-Math.PI/2;tp.position.z=-.3;par.add(tp)}
 // pescoço (para frente e para cima) e cabeça
 par=J.spine[0];for(let i=0;i<6;i++){const j=new T.Group();j.position.set(0,i?.12:.2,i?.42:.5);par.add(j);const v=mk(gVert(),i%2?mat:m2,.65-i*.03);v.rotation.x=-Math.PI/2;j.add(v);J.neck.push(j);par=j}
 const head=new T.Group();head.position.z=.45;par.add(head);const sk=mk(gSkull(),mat,.8);head.add(sk);const jaw=new T.Group();jaw.position.set(0,-.2,-.1);head.add(jaw);const jw=mk(gJaw(),m2,.8);jaw.add(jw);
 for(const s of[-1,1]){const e=new T.Mesh(new T.SphereGeometry(.08,8,6),GLM(OV,.95));e.position.set(s*.24,.15,.3);head.add(e)}J.head=head;J.jaw=jaw;
 // patas (ombro/quadril → osso longo → osso longo → garras)
 const legAt=(j,s,fr)=>{const sh=new T.Group();sh.position.set(s*.45,-.15,0);j.add(sh);const up=mk(gLong(s>0?0:1),mat,[2.6,1.1,2.6]);up.position.y=-.5;sh.add(up);const kn=new T.Group();kn.position.y=-1.0;sh.add(kn);const lo=mk(gLong(2),m2,[2.2,1,2.2]);lo.position.y=-.45;kn.add(lo);for(let k=0;k<3;k++){const c=mk(gClaw(),mat,.9);c.position.set((k-1)*.12,-.95,.05);c.rotation.x=1.2;kn.add(c)}J.legs.push({sh,kn,s,fr})};
 legAt(J.spine[1],1,1);legAt(J.spine[1],-1,1);legAt(J.spine[5],1,0);legAt(J.spine[5],-1,0);
 // asas: braço → antebraço → 4 dedos longos, com membrana violeta translúcida
 for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.35,.25,-.1);J.spine[1].add(w);const a1=mk(gLong(0),mat,[2.4,1.6,2.4]);a1.rotation.z=-s*Math.PI/2;a1.position.x=s*.8;w.add(a1);const el=new T.Group();el.position.x=s*1.6;w.add(el);const a2=mk(gLong(1),m2,[2,1.4,2]);a2.rotation.z=-s*Math.PI/2;a2.position.x=s*.7;el.add(a2);
  const tip=new T.Group();tip.position.x=s*1.4;el.add(tip);const fingers=[];for(let k=0;k<4;k++){const f=mk(gLong(k),mat,[1.4,2.2-k*.3,1.4]);const a=-s*(Math.PI/2+.3+k*.35);f.rotation.z=a;f.position.set(-Math.sin(a)*1.1*(1-k*.12),Math.cos(a)*1.1*(1-k*.12)*-1*0-.0,0);const g=new T.Group();g.rotation.z=-s*(.25+k*.38);g.add(f);f.rotation.z=-s*Math.PI/2;f.position.set(s*(1.1-k*.13),0,0);tip.add(g);fingers.push(g)}
  // membrana entre os dedos
  const mg0=new T.BufferGeometry();mg0.setAttribute('position',new T.Float32BufferAttribute([0,0,0,0,0,0,0,0,0],3));const mem=new T.Mesh(mg0,new T.MeshBasicMaterial({color:OV2,transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false}));w.add(mem);J.wings.push({w,el,tip,fingers,s,mem})}
 return{D,J}}
function oDragonMem(W){const v=new T.Vector3(),pts=[];const P0=new T.Vector3();W.w.updateMatrixWorld(true);const inv=new T.Matrix4().copy(W.w.matrixWorld).invert();const tp=W.tip.getWorldPosition(new T.Vector3()).applyMatrix4(inv);const el=W.el.getWorldPosition(new T.Vector3()).applyMatrix4(inv);
 const tips=W.fingers.map(g=>{const f=g.children[0];const p=new T.Vector3(W.s*2.1*(1-W.fingers.indexOf(g)*.13),0,0);return g.localToWorld(p).applyMatrix4(inv)});const root=new T.Vector3(0,0,-.6);
 const tri=[];const push=(a,b,c)=>tri.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);push(P0,el,tips[0]);for(let i=0;i<tips.length-1;i++)push(tp,tips[i],tips[i+1]);push(P0,tips[3],root);push(P0,tp,tips[3]);
 W.mem.geometry.setAttribute('position',new T.Float32BufferAttribute(tri,3));W.mem.geometry.attributes.position.needsUpdate=true;W.mem.geometry.computeBoundingSphere()}
function oDragon(d){ww('BONE DRAGON!','shadow');startPose('ob_dragon');const mat=oMatF('ivory'),m2=oMat('old'),{D,J}=oDragonBuild(mat,m2);const g=new T.Group();g.add(D);D.scale.setScalar(1.25);S.add(g);
 let x=P.x+Math.sin(P.f)*4.5,z=P.z+Math.cos(P.f)*4.5,y=2.3,f=P.f,tg=null,bite=0,bt=0,phase='form';g.position.set(x,y,z);g.rotation.y=f;const cir=fCircle(4,'g');cir.position.set(x,.08,z);S.add(cir);
 kfx({u:(q,dt)=>{const t=q.t;kCircleTick(cir,dt,t<1.8?Math.min(1,t/.3):Math.max(0,1-(t-1.8)*2),0);
  if(t<2.2)oForm(D,t*1.2,mat);if(t<1.6&&Math.random()<.9*Q())oGather(x+rnd(-2,2),rnd(.5,2.5),z+rnd(-2,2),2,.6);
  // esqueleto animado
  J.spine.forEach((j,i)=>{j.rotation.y=Math.sin(t*2.2-i*.55)*.07;j.rotation.x=Math.sin(t*1.6-i*.4)*.03});J.tail.forEach((j,i)=>{j.rotation.y=Math.sin(t*2.6-i*.5)*.18;j.rotation.x=Math.sin(t*1.8-i*.4)*.08-.02});
  J.neck.forEach((j,i)=>{j.rotation.x=-.12+Math.sin(t*1.8-i*.4)*.05-(phase=='bite'?.08:0);j.rotation.y=Math.sin(t*1.2-i*.3)*.06});const open=phase=='roar'?Math.min(.9,(t-1.6)*3):bt>0?Math.sin((1-bt/.5)*Math.PI)*.8:.08+Math.sin(t*3)*.04;J.jaw.rotation.x=open;
  const fly=phase!='form'&&phase!='roar';J.wings.forEach(W=>{const fl=fly?Math.sin(t*6)*.75:Math.sin(t*1.5)*.15-.6;W.w.rotation.z=W.s*fl;W.el.rotation.z=W.s*(fly?Math.sin(t*6-.6)*.4:-.9);W.w.rotation.y=W.s*.3;W.fingers.forEach((gg,i)=>gg.rotation.y=W.s*(fly?.0:.5));if(Math.random()<.5)oDragonMem(W)});
  J.legs.forEach(L=>{const tuck=fly?1:0;L.sh.rotation.x=tuck*(L.fr?-.9:.9)+(1-tuck)*Math.sin(t*3+(L.fr?0:3))*.15;L.kn.rotation.x=tuck*(L.fr?1.4:-1.2)});
  // comportamento: forma → ruge → voa até o inimigo → mordidas → desaba
  if(phase=='form'&&t>1.6){phase='roar';kShock(x,z,4,OV,.5,1.5);P.shake=Math.max(P.shake,.3);ww('ROOOAR!','shadow')}
  if(phase=='roar'&&t>2.3)phase='fly';
  if(phase=='fly'||phase=='bite'){if(!tg||tg.hp<=0||!enemies.includes(tg))tg=window.H93.near(x,z,30);const tx=tg?tg.x:P.x+Math.sin(t)*6,tz=tg?tg.z:P.z+Math.cos(t)*6,dx2=tx-x,dz2=tz-z,L=Math.hypot(dx2,dz2)||1;const wf=Math.atan2(dx2,dz2);let df=wf-f;while(df>Math.PI)df-=6.283;while(df<-Math.PI)df+=6.283;f+=df*Math.min(1,dt*3);
   const sp=L>4?11:3;x+=Math.sin(f)*sp*dt;z+=Math.cos(f)*sp*dt;y+=(((tg&&L<5)?2.4:4)-y)*Math.min(1,dt*2);bite-=dt;if(tg&&L<4.5&&bite<=0){bite=1.1;bt=.5;phase='bite';tmr.push({t:.25,f:()=>{const hp=J.head.getWorldPosition(new T.Vector3());H.hitR(hp.x,hp.z,3,d*1.4,{st:.4});kShock(hp.x,hp.z,1.6,OV,.25,hp.y);fxp({x:hp.x,y:hp.y,z:hp.z,c:0xe8dcc4,n:Math.round(10*Q()),sp:3,sz:.14,life:.4})}})}if(bt>0){bt-=dt;if(bt<=0)phase='fly'}
   if(Math.random()<.3*Q())fxp({x:x+rnd(-1,1),y:y+rnd(0,1),z:z+rnd(-1,1),c:OV,n:1,sp:.3,sz:.12,life:.5})}
  g.position.set(x,y+Math.sin(t*2)*.12,z);g.rotation.y=f;g.rotation.z=Math.sin(t*1.3)*.05;
  if(t>10){if(!q.c){q.c=1;kShock(x,z,3,OV,.4,1)}oCrumble(D,t-10)}return t<11},end:()=>{kDispose(g);kDispose(cir)}})}
// ===================================================================== REGISTRO =====================================================================
const N4=window.N94;Object.assign(N4,{obullet:'Bone: Bone Bullets',oarmor:'Bone: Bone Armor',odragon:'Bone Creation: Bone Dragon'});
Object.assign(N4,{ospear:N4.ospear});
Object.assign(window.C94,{obullet:oBullets,ospear:oSpearV,owall:()=>oWallV(),ospike:oSpikesV,oprison:oPrisonV,ogate:oGateV,odom:(d)=>oDominionV(d),oarmor:()=>oArmor(),odragon:(d)=>oDragon(d)});try{XT.push('obullet','oarmor','odragon')}catch(e){}
// nomes como no pedido: Bone Spear agora é uma lança grande; Bone Bullets são os projéteis
{const old=GR.ossos.s;GR.ossos.s=old.concat([[N4.obullet,8,16,'obullet',{sl:1},1],[N4.oarmor,30,0,'oarmor',null,30],[N4.odragon,55,60,'odragon',null,45]])}
Object.assign(ANI,{[N4.obullet]:'ob_bullet',[N4.oarmor]:'ob_armor',[N4.odragon]:'ob_dragon',[N4.ospear]:'ob_spear',[N4.owall]:'ob_wall',[N4.ospike]:'ob_spike',[N4.oprison]:'ob_prison',[N4.ogate]:'ob_gate',[N4.odom]:'ob_dom'});
Object.assign(RNG,{obullet:['l',26],oarmor:['c',0,'defesa'],odragon:['c',30,'invocação']});
Object.assign(SKI,{[N4.obullet]:'<path d="M3 14l7-2M5 9l7-1M3 19l8-3" stroke="L" stroke-width="1.4"/><path d="M12 12l9-3-2 4z M13 7l8-2-2 4z M13 17l8-2-2 4z" fill="C"/>',
 [N4.oarmor]:'<path d="M12 3l7 3v6c0 5-3 8-7 9-4-1-7-4-7-9V6z" fill="none" stroke="C" stroke-width="2"/><path d="M8 9h8M8 12h8M9 15h6" stroke="L" stroke-width="1.6"/>',
 [N4.odragon]:'<path d="M3 15c3-1 4-5 8-6l4-4 1 4 4 1-3 2c1 3-1 6-5 6-2 0-4-2-6-1z" fill="C"/><circle cx="15" cy="8" r="1.2" fill="L"/><path d="M6 15l-2 4M10 16l-1 4" stroke="L" stroke-width="1.4"/>'});
try{if(typeof EXT82!='undefined')0}catch(e){}
// os outros jogadores veem a forma das magias de ossos (sem dano)
{const _xr=xRemote;xRemote=function(o,c){try{const id=Object.keys(N4).find(k=>N4[k]===c.nm);if(id=='odragon'){const f=+c.f||0,mat=oMatF('ivory'),{D,J}=oDragonBuild(mat,oMat('old'));const g=new T.Group();g.add(D);D.scale.setScalar(1.25);S.add(g);let x=o.x+Math.sin(f)*4.5,z=o.z+Math.cos(f)*4.5;
  kfx({u:(q,dt)=>{const t=q.t;if(t<2.2)oForm(D,t*1.2,mat);J.tail.forEach((j,i)=>j.rotation.y=Math.sin(t*2.6-i*.5)*.18);J.wings.forEach(W=>{W.w.rotation.z=W.s*(t>2?Math.sin(t*6)*.75:-.6)});J.jaw.rotation.x=.1+Math.abs(Math.sin(t*2))*.3;if(t>2.3){x+=Math.sin(f)*8*dt;z+=Math.cos(f)*8*dt}g.position.set(x,2.3+Math.min(1.5,Math.max(0,t-2.3)),z);g.rotation.y=f;if(t>8)oCrumble(D,t-8);return t<9},end:()=>kDispose(g)});return true}
 if(id=='owall'||id=='oprison'||id=='oarmor'){const f=+c.f||0,g=new T.Group(),mat=oMatF('ivory');for(let k=0;k<9;k++){const x=(k-4)*.62,h=1.6+Math.cos((k-4)/9*3)*1.2;const lb=oPiece(gLong(k),k%2?mat:oMat('old'),{d:Math.abs(k-4)*.05,dur:.4});lb.scale.set(2.2,h*1.25,2.2);lb.userData.f.s0=lb.scale.clone();lb.position.set(x,h*.62,0);g.add(lb);const hn=oPiece(gHorn(k),oMat('old'),{d:.3,dur:.25});hn.position.set(x,h*1.25+.2,0);g.add(hn)}
  if(id=='oarmor'){g.scale.setScalar(.35)}g.position.set(o.x+Math.sin(f)*(id=='owall'?2.4:id=='oarmor'?0:9),0,o.z+Math.cos(f)*(id=='owall'?2.4:id=='oarmor'?0:9));g.rotation.y=f;S.add(g);kfx({u:q=>{if(q.t<1)oForm(g,q.t,mat);else if(q.t>3.5)oCrumble(g,q.t-3.5);return q.t<4.2},end:()=>kDispose(g)});return true}
 if(id&&id[0]=='o'){const f=+c.f||0,dx=Math.sin(f),dz=Math.cos(f);const g=new T.Group(),mat=oMatF('ivory');for(let k=0;k<6;k++){const s=oPiece(gHorn(k),k%2?mat:oMat('old'),{d:k*.04,dur:.2});s.scale.setScalar(1.6);s.userData.f.s0=s.scale.clone();s.position.set(Math.cos(k)*.9,0,Math.sin(k)*.9);s.rotation.set(rnd(-.3,.3),rnd(0,6),rnd(-.3,.3));g.add(s)}g.position.set(o.x+dx*2,0,o.z+dz*2);S.add(g);kShock(o.x,o.z,2.4,OV,.4,1);kfx({u:q=>{if(q.t<.5)oForm(g,q.t,mat);else if(q.t>1)oCrumble(g,q.t-1);return q.t<1.6},end:()=>kDispose(g)});return true}}catch(e){}return _xr.apply(this,arguments)}}
window.O107={gLong,gRib,gVert,gHorn,gSpear,gBullet,gClaw,gPlate,gSkull,gJaw,oMat,oMatF,oPiece,oForm,oCrumble,oDragonBuild,ARM107};
}

