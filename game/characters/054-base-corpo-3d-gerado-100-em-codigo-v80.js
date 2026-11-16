// ================= CORPO 3D GERADO 100% EM CÓDIGO (V80) =================
// Nenhum arquivo de modelo: o corpo é calculado aqui, por funções, quando o jogo abre.
// Tronco, pescoço, braços, mãos (palma, dedos e polegar), pernas e calçados são "superfícies de varredura":
// uma sequência de seções (elipses arredondadas) que muda de largura ao longo do corpo — ombros largos, peitoral,
// cintura fina, quadril, coxa, joelho, panturrilha. Cada vértice recebe o peso dos ossos que o movem
// (tronco, cabeça, braço, antebraço, dedos, coxa, perna), então a malha dobra suave nas articulações.
// A roupa é a própria superfície separada por regiões: camisa, mangas, calça, barra/cano da bota e calçado.
function amProcBody(){
 const SX=.315,HX=.14,J={};
 for(const [s,k] of[[-1,'R'],[1,'L']]){J['UpperArm'+k]=[s*SX,1.738,.02];J['LowerArm'+k]=[s*SX,1.42,.02];J['Palm'+k]=[s*SX,1.05,.02];J['MiddleHand'+k]=[s*SX,.955,.02];
  J['UpperLeg'+k]=[s*HX,.985,.01];J['LowerLeg'+k]=[s*HX,.61,.01];J['LowerLeg'+k+'_end']=[s*HX,.025,.01]}
 J.Neck=[0,1.85,-.012];J.Head=[0,1.936,-.002];J.Head_end=[0,2.168,-.02];
 const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)},bell=(x,c,w)=>Math.exp(-Math.pow((x-c)/w,2));
 // interpolação suave de uma tabela [[chave, v1, v2, ...], ...] (Catmull-Rom)
 const tab=(T0,x)=>{const n=T0.length;if(x<=T0[0][0])return T0[0].slice(1);if(x>=T0[n-1][0])return T0[n-1].slice(1);let i=0;while(T0[i+1][0]<x)i++;
  const p0=T0[Math.max(0,i-1)],p1=T0[i],p2=T0[i+1],p3=T0[Math.min(n-1,i+2)],t=(x-p1[0])/(p2[0]-p1[0]),t2=t*t,t3=t2*t,o=[];
  for(let k=1;k<p1.length;k++)o.push(.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3));return o};
 // ---- tronco: y, meia-largura, frente, costas
 const TOR=[[.9,.16,.1,.112],[.95,.205,.13,.142],[1.0,.218,.136,.146],[1.06,.214,.134,.138],[1.14,.205,.132,.128],[1.26,.215,.14,.128],[1.38,.236,.152,.134],[1.5,.258,.16,.14],[1.6,.278,.156,.144],[1.68,.288,.136,.142],[1.735,.245,.11,.118],[1.79,.14,.086,.09],[1.83,.082,.074,.074]];
 const NT=2.6,se=(c,e)=>Math.sign(c)*Math.pow(Math.abs(c),2/e);
 const torsoPt=(y,th)=>{const [W,Zf,Zb]=tab(TOR,y),x=W*se(Math.sin(th),NT),cz=Math.cos(th);let z=(cz>=0?Zf:-Zb)*Math.pow(Math.abs(cz),2/NT);
  if(cz>0){z+=0*bell(y,1.52,.065)*bell(Math.abs(x),.105,.07)*cz;z-=.005*bell(x,0,.014)*sm(1.13,1.2,y)*sm(1.46,1.4,y);}
  else{z-=.012*bell(y,1.56,.07)*bell(Math.abs(x),.1,.06)*(-cz);z-=.018*bell(y,.98,.05)*bell(Math.abs(x),.09,.07)*(-cz)}
  return[x,y,z]};
 // ---- montagem
 const S=[[],[],[],[],[],[],[]];const pos=[],SI=[],SW=[];
 const V=(p,w)=>{pos.push(p[0],p[1],p[2]);const e=Object.entries(w).filter(q=>q[1]>1e-3).sort((a,b)=>b[1]-a[1]).slice(0,4),t=e.reduce((a,q)=>a+q[1],0)||1;for(let k=0;k<4;k++){SI.push(e[k]?+e[k][0]:0);SW.push(e[k]?e[k][1]/t:0)}return pos.length/3-1};
 const P3=i=>[pos[i*3],pos[i*3+1],pos[i*3+2]];
 const tri=(sl,a,b,c,ref)=>{const A=P3(a),B=P3(b),C=P3(c),u=[B[0]-A[0],B[1]-A[1],B[2]-A[2]],v=[C[0]-A[0],C[1]-A[1],C[2]-A[2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],m=[(A[0]+B[0]+C[0])/3-ref[0],(A[1]+B[1]+C[1])/3-ref[1],(A[2]+B[2]+C[2])/3-ref[2]];
  if(n[0]*m[0]+n[1]*m[1]+n[2]*m[2]>=0)S[sl].push(a,b,c);else S[sl].push(a,c,b)};
 // rings: [{idx:[...], c:[x,y,z]}]; liga anéis consecutivos; fecha as pontas com um vértice central
 const loft=(sl,R,cap0,cap1,capW)=>{const N=R[0].idx.length;for(let r=0;r<R.length-1;r++){const A=R[r],B=R[r+1],ref=[(A.c[0]+B.c[0])/2,(A.c[1]+B.c[1])/2,(A.c[2]+B.c[2])/2];
   for(let i=0;i<N;i++){const j=(i+1)%N;tri(sl,A.idx[i],A.idx[j],B.idx[i],ref);tri(sl,A.idx[j],B.idx[j],B.idx[i],ref)}}
  const cap=(k,k2,w)=>{const A=R[k],c=V(A.c,w),ref=R[k2].c;for(let i=0;i<N;i++)tri(sl,c,A.idx[i],A.idx[(i+1)%N],ref)};
  if(cap0)cap(0,1,capW?capW(0):cap0);if(cap1)cap(R.length-1,R.length-2,capW?capW(1):cap1)};
 // tronco (camisa em cima, calça embaixo)
 const TN=14,ring=(y,w)=>{const idx=[];for(let i=0;i<TN;i++)idx.push(V(torsoPt(y,i/TN*Math.PI*2),w));return{idx,c:[0,y,0]}};
 const B0={0:1},Y1=[];for(let y=.9;y<1.105;y+=.05)Y1.push(Math.min(y,1.1));const Y2=[];for(let y=1.1;y<=1.835;y+=.055)Y2.push(Math.min(y,1.83));
 const lip=(r,k)=>{for(const i of r.idx){pos[i*3]*=k;pos[i*3+2]*=k}return r};
 loft(3,Y1.map((y,i)=>i==Y1.length-1?lip(ring(y,B0),1.025):ring(y,B0)),B0,null);
 loft(1,Y2.map(y=>ring(y,B0)).map((r,i,a)=>i==a.length-1?lip(r,1.0):r),null,null);
 // tubo genérico vertical: amostras [y, cx, cz, rx, rz]; pesos por altura
 const tube=(sl,sm0,n,wf,cap0,cap1)=>{const R=sm0.map(([y,cx,cz,rx,rz])=>{const w=wf(y),idx=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2;idx.push(V([cx+Math.sin(a)*rx,y,cz+Math.cos(a)*rz],w))}return{idx,c:[cx,y,cz]}});loft(sl,R,cap0?wf(sm0[0][0]):null,cap1?wf(sm0[sm0.length-1][0]):null)};
 // pescoço (pele) — base no tronco, topo segue a cabeça
 tube(0,[[1.74,0,-.012,.074,.07],[1.8,0,-.012,.072,.068],[1.86,0,-.01,.068,.064],[1.92,0,-.004,.062,.058],[1.96,0,0,.052,.05]],8,y=>{const h=sm(1.86,1.94,y)*.75;return{0:1-h,1:h}},false,true);
 // braços (manga até o punho) e mãos
 for(const [s,k] of[[-1,0],[1,1]]){const x=s*SX,UP=2+k,FA=4+k,FG=10+k;
  const aw=y=>{const t=sm(1.39,1.47,y),sh=.3*sm(1.70,1.79,y);return{0:sh,[UP]:(1-sh)*t,[FA]:(1-sh)*(1-t)}};
  const A=[[1.792,-0.012,0.02,0.0146,0.0146],[1.784,-0.01,0.02,0.0549,0.0586],[1.768,-0.006,0.02,0.0805,0.0854],[1.74,0,0.02,0.0952,0.0976],[1.7,0,0.022,0.0939,0.0952],[1.64,0,0.026,0.083,0.0903],[1.57,0,0.03,0.0769,0.0854],[1.5,0,0.026,0.072,0.0756],[1.44,0,0.02,0.0634,0.0671],[1.39,0,0.022,0.0659,0.0695],[1.32,0,0.024,0.0671,0.0708],[1.22,0,0.022,0.061,0.0634],[1.13,0,0.02,0.0537,0.0561],[1.095,0,0.02,0.0512,0.0537],[1.088,0,0.02,0.0622,0.0647],[1.072,0,0.02,0.0622,0.0647],[1.068,0,0.02,0.039,0.039]];
  tube(2,A.filter((q,i)=>i%2==0||i==A.length-1||i==A.length-2).map(q=>[q[0],x+s*q[1],q[2],q[3],q[4]]),8,aw,true,true);
  // palma (pele) e dedos juntos com pontas arredondadas; a palma fica de frente para o corpo
  const hw=y=>{const t=sm(.94,.975,y);return{[FA]:t,[FG]:1-t}},hx=x-s*.004;
  tube(0,[[1.08,hx,.024,.036,.048],[1.05,hx,.026,.038,.054],[1.0,hx,.028,.039,.06],[.96,hx,.028,.037,.06],[.93,hx-s*.002,.028,.033,.057],[.88,hx-s*.004,.028,.03,.054],[.84,hx-s*.006,.027,.025,.048],[.815,hx-s*.006,.026,.018,.037],[.803,hx-s*.006,.025,.007,.016]],6,hw,true,true);
  // polegar
  {const p0=[x-s*.022,1.015,.06],p1=[x-s*.03,.955,.088],N=10,R=[];for(let r=0;r<=5;r++){const t=r/5,c=[p0[0]+(p1[0]-p0[0])*t,p0[1]+(p1[1]-p0[1])*t,p0[2]+(p1[2]-p0[2])*t],rr=.017*(1-t*.35)*(r==5?.5:1),idx=[],w={[FA]:1-t*.6,[FG]:t*.6};
    for(let i=0;i<N;i++){const a=i/N*Math.PI*2;idx.push(V([c[0]+Math.cos(a)*rr,c[1]+Math.sin(a)*rr*.6,c[2]+Math.sin(a)*rr*.8],w))}R.push({idx,c})}loft(0,R,{[FA]:1},{[FA]:.4,[FG]:.6})}}
 // pernas: calça (coxa e canela), barra/cano da bota e calçado
 for(const [s,k] of[[-1,0],[1,1]]){const x=s*HX,TH=6+k,SH=8+k;
  const lw=y=>{const t=sm(.55,.66,y),top=.35*sm(.96,1.05,y);return{0:top,[TH]:(1-top)*t,[SH]:(1-top)*(1-t)}};
  const L1=[[1.05,-.03,.0,.11,.115],[1.0,-.026,.0,.132,.135],[.9,-.018,.004,.13,.132],[.78,-.01,.006,.118,.12],[.68,-.004,.008,.102,.106],[.61,0,.01,.096,.1]];
  const L2=[[.61,0,.01,.096,.1],[.54,0,-.004,.096,.104],[.46,0,-.004,.09,.098],[.37,0,.004,.08,.085]];
  const L3=[[.37,0,.004,.08,.085],[.355,0,.004,.088,.092],[.34,0,.004,.086,.09],[.28,0,.006,.08,.084],[.2,0,.008,.072,.076],[.13,0,.01,.066,.07],[.085,0,.01,.064,.068]];
  tube(3,L1.map(q=>[q[0],x+s*q[1],q[2],q[3],q[4]]),9,lw,true,false);
  tube(4,L2.map(q=>[q[0],x,q[2],q[3],q[4]]),9,lw,false,false);
  tube(6,L3.map(q=>[q[0],x,q[2],q[3],q[4]]),9,lw,false,true);
  // calçado: seções ao longo do pé (calcanhar → bico), base reta no chão
  const F=[[-.085,.035,.05],[-.065,.055,.095],[0,.062,.105],[.08,.064,.066],[.16,.054,.048],[.2,.018,.024]],N=7,R=[];
  for(const [z,hw,h] of F){const idx=[];for(let i=0;i<N;i++){const a=i/N*Math.PI*2,c=Math.cos(a),sn=Math.sin(a);idx.push(V([x+s*.004+se(sn,3)*hw,Math.max(0,h/2+se(c,3)*h/2),z+.02],{[SH]:1}))}R.push({idx,c:[x,F[0][2]/2,z+.02]})}
  for(const r of R)r.c=[r.c[0],.04,r.c[2]];loft(5,R,{[SH]:1},{[SH]:1})}
 // geometria final: índices agrupados por região
 const idx=[],groups=[];S.forEach((L,sl)=>{groups.push([idx.length,L.length,sl]);for(const i of L)idx.push(i)});
 let g=new T.BufferGeometry();const n=pos.length/3,uv=new Float32Array(n*2);for(let i=0;i<n;i++){uv[i*2]=Math.atan2(pos[i*3],pos[i*3+2])/(Math.PI*2)+.5;uv[i*2+1]=pos[i*3+1]/2.2}
 g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(SI,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(SW,4));
 g.setIndex(n>65535?new T.Uint32BufferAttribute(idx,1):new T.Uint16BufferAttribute(idx,1));groups.forEach(q=>{if(q[1]>0)g.addGroup(q[0],q[1],q[2])});const gi=g;g=gi.toNonIndexed();g.computeVertexNormals();g.computeBoundingSphere();g._keep=true;
 // mapa de profundidade do tronco (para as peças das formas demoníacas encostarem no peito/costas)
 const tf={y0:.94,dy:.02,ny:49,x0:-.3,dx:.02,nx:31,f:[],b:[]};
 for(let iy=0;iy<tf.ny;iy++){const y=tf.y0+iy*tf.dy,[W,Zf,Zb]=tab(TOR,y);for(let ix=0;ix<tf.nx;ix++){const x=tf.x0+ix*tf.dx,u=Math.min(.999,Math.abs(x)/W),th=Math.asin(Math.pow(u,NT/2));const f=torsoPt(y,th*(x<0?-1:1)),b=torsoPt(y,Math.PI-th*(x<0?-1:1));tf.f.push(+f[2].toFixed(4));tf.b.push(+b[2].toFixed(4))}}
 return{j:J,tf,geo:g,proc:1,nv:n}}

const AMB=amProcBody();

// ================= CORPO 3D COM ESQUELETO DE VERDADE (V78) =================
// Base: pacote "Animated Men Characters" da Quaternius (licença CC0 — domínio público, uso livre em jogos).
// A cabeça, o cabelo e os olhos originais foram retirados: cabeça, rosto, olhos, expressões e penteados são os do jogo.
// A malha é uma pele única que deforma com os ossos (ombro, cotovelo, dedos, quadril, joelho, cabeça) e a roupa faz
// parte dela por regiões — camisa, mangas, calça, barra, calçado e cano da bota — então a roupa nunca atravessa o corpo.
// As cores/skins do Clover, as formas demoníacas e a União com Liebe trocam o material de cada região automaticamente:
// cada região copia o material de uma "peça-guia" invisível do corpo antigo (que continua existindo só para medir e colorir).
(function(){try{const B=BODIES[0];if(!B||!B.s)return;Object.assign(B.s,{to:{w:.46,h:.72,d:.27,r:.1,tb:.88},hp:{w:.4,h:.2,d:.26},ua:{w:.18,d:.17,l:.308},fa:{w:.11,d:.1,l:.375},th:{w:.21,d:.2,l:.373},sh:{w:.15,d:.14,l:.57},ft:{w:.13,h:.085,l:.29},lg:.14});B.d='Único · esqueleto 3D'}catch(e){}})();
const AM_L=7;
function amB64(s){const b=atob(s),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);return u}
function amGeo(){if(amGeo.g)return amGeo.g;const D=AMB,n=D.nv,pb=amB64(D.p),pi=new Int16Array(pb.buffer,0,n*3),pos=new Float32Array(n*3);for(let i=0;i<n*3;i++)pos[i]=pi[i]/D.q;
 const si=amB64(D.si),swb=amB64(D.sw),sw=new Float32Array(n*4),six=new Uint16Array(n*4);for(let i=0;i<n*4;i++){sw[i]=swb[i]/255;six[i]=si[i]}
 const ib=amB64(D.i),idx=new Uint16Array(ib.buffer,0,ib.length>>1),uv=new Float32Array(n*2);
 for(let i=0;i<n;i++){uv[i*2]=Math.atan2(pos[i*3],pos[i*3+2])/(Math.PI*2)+.5;uv[i*2+1]=pos[i*3+1]/2.2}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('uv',new T.BufferAttribute(uv,2));
 g.setAttribute('skinIndex',new T.BufferAttribute(six,4));g.setAttribute('skinWeight',new T.BufferAttribute(sw,4));g.setIndex(new T.BufferAttribute(idx,1));
 D.g.forEach(q=>{if(q[1]>0)g.addGroup(q[0],q[1],q[2])});g.computeVertexNormals();g.computeBoundingSphere();g._keep=true;return amGeo.g=g}
// contorno de desenho (mesmo estilo do resto do jogo), inflado pela normal para acompanhar a pele deformada
function amOlm(){if(amOlm.m)return amOlm.m;const m=new T.MeshBasicMaterial({color:0x111111,side:T.BackSide});m.skinning=true;m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\n\ttransformed+=normal*0.0045;')};m._keep=1;return amOlm.m=m}
function amHide(o,on){try{o.traverse(c=>{if(c.layers)c.layers.set(on?0:AM_L)})}catch(e){}}
function amRestPos(b,root){const v=new T.Vector3();let n=0;for(let q=b;q&&q!==root&&n<30;q=q.parent,n++)v.add(q.position);return v}
function amUndo(p){try{if(p.skm){for(const m of[p.skm,p.skmO])if(m&&m.parent)m.parent.remove(m);p.skm=p.skmO=null}(p.bm||[]).forEach(m=>amHide(m,1));p.amPx=null}catch(e){}}
function buildBody4(p){buildBody3(p,0);const J=AMB.j,v=a=>new T.Vector3(a[0],a[1],a[2]);if(!p.arms[0]||!p.arms[1]||!p.legs[0]||!p.legs[1])throw new Error('rig incompleto');
 // articulações do jogo no lugar exato das articulações do modelo
 if(!p.amF)p.amF=[new T.Group(),new T.Group()];
 [['R',0],['L',1]].forEach(([s,i])=>{const a=p.arms[i],u=v(J['UpperArm'+s]),l=v(J['LowerArm'+s]),h=v(J['MiddleHand'+s]),pa=v(J['Palm'+s]);
  a[0].position.copy(u);a[1].position.copy(l).sub(u);const f=p.amF[i];if(f.parent!==a[1])a[1].add(f);f.position.copy(h).sub(l);f.rotation.set(0,0,0);
  const at=pa.clone().sub(l);p.attY=at.y-.065;for(const c of a[1].children)if(c.userData&&c.userData.att){c.position.x=at.x;c.position.y=p.attY;c.position.z=at.z}
  const g=p.legs[i],up=v(J['UpperLeg'+s]),kn=v(J['LowerLeg'+s]);g[0].position.copy(up);g[1].position.copy(kn).sub(up)});
 // o corpo antigo vira só "peças-guia" invisíveis (cabeça, rosto e cabelo continuam visíveis)
 const inHead=o=>{let n=0;for(let q=o;q&&n<30;q=q.parent,n++)if(q===p.hs||q===p.hj)return true;return false};
 const X={};for(const m of p.bm){if(inHead(m))continue;amHide(m);const pa=m.parent,ud=m.userData||{};
  if(!X.skin&&pa===p.arms[0][1]&&m.material===p.mS)X.skin=m;
  if(!X.torso&&pa===p.bR&&m.material===p.mT)X.torso=m;
  if(!X.sleeve&&pa===p.arms[0][0]&&ud.sl)X.sleeve=m;
  if(!X.pup&&pa===p.legs[0][0]&&ud.up)X.pup=m;
  if(!X.plo&&pa===p.legs[0][1]&&ud.lo)X.plo=m;
  if(!X.shoe&&pa===p.legs[0][1]&&m.material===p.mSh)X.shoe=m}
 (p.pb||[]).forEach(b=>amHide(b));p.amPx=X;if(p.tdim)p.tdim.y0=p.tq?p.tq.position.y-p.tdim.h/2:null;
 if(!p.skm){const g=amGeo(),bones=[p.bR,p.hj,p.arms[0][0],p.arms[1][0],p.arms[0][1],p.arms[1][1],p.legs[0][0],p.legs[1][0],p.legs[0][1],p.legs[1][1],p.amF[0],p.amF[1]];
  const inv=bones.map(b=>{const r=amRestPos(b,p.root);return new T.Matrix4().makeTranslation(-r.x,-r.y,-r.z)}),sk=new T.Skeleton(bones,inv);
  p.amMC=new Map();const mats=[p.mS,p.mT,p.mT,p.mP,p.mP,p.mSh,p.mP].map(m=>amSkMat(p,m));
  const k=new T.SkinnedMesh(g,mats);k.bind(sk,new T.Matrix4());k.castShadow=true;k.receiveShadow=false;k.frustumCulled=false;k.userData.amb=1;k.name='corpo3d';
  const o=new T.SkinnedMesh(g,amOlm());o.bind(sk,new T.Matrix4());o.frustumCulled=false;o.userData.amb=1;
  p.root.add(k);p.root.add(o);p.skm=k;p.skmO=o}
 else{const r=amRestPos(p.hj,p.root);p.skm.skeleton.boneInverses[1].makeTranslation(-r.x,-r.y,-r.z)}
 amSync(p)}
// cópia "com esqueleto" de cada material (um material não pode servir ao mesmo tempo a malhas com e sem esqueleto):
// a cópia acompanha cor, brilho, transparência e texturas do original a cada quadro
function amSkMat(p,src){const C=p.amMC||(p.amMC=new Map());let m=C.get(src);const sig=src.version+'|'+(src.map?src.map.uuid:'')+'|'+(src.bumpMap?src.bumpMap.uuid:'')+'|'+(src.emissiveMap?src.emissiveMap.uuid:'')+'|'+src.transparent+'|'+src.side+'|'+src.vertexColors+'|'+src.flatShading+'|'+src.blending;
 if(!m||m._sig!==sig){const n=!m;if(n){m=src.clone()}else m.copy(src);if(Object.prototype.hasOwnProperty.call(src,'onBeforeCompile'))m.onBeforeCompile=src.onBeforeCompile;m.skinning=true;m._sig=sig;m.needsUpdate=true;if(n){C.set(src,m);if(C.size>24){const keep=new Set((p.skm?p.skm.material:[]).concat([m]));for(const [k2,v2] of C)if(!keep.has(v2)){C.delete(k2);try{v2.dispose()}catch(e){}}}}}
 else{if(m.color&&src.color)m.color.copy(src.color);if(m.emissive&&src.emissive)m.emissive.copy(src.emissive);if(src.emissiveIntensity!=null)m.emissiveIntensity=src.emissiveIntensity;m.opacity=src.opacity;m.visible=src.visible;if(src.bumpScale!=null)m.bumpScale=src.bumpScale}
 return m}
// cada região da pele usa o material atual da sua peça-guia (cores das skins, Liebe, Nacht, Zagred, transparências...)
function amSync(p){const k=p.skm,X=p.amPx;if(!k||!X)return;const ms=k.material;
 const pick=(i,o)=>{const m=o&&o.material;if(!m||Array.isArray(m)||!m.isMaterial)return;ms[i]=amSkMat(p,m)};
 pick(0,X.skin);pick(1,X.vest||X.torso);pick(2,X.sleeve);pick(3,X.pup);pick(4,X.plo);pick(5,X.shoe);pick(6,p.pb&&p.pb[0]&&p.pb[0].visible?p.pb[0]:X.plo);
 if(p.skmO)p.skmO.visible=k.visible;
 // dedos: fecham quando a mão segura a espada/arma, relaxados no resto do tempo
 for(let i=0;i<2;i++){const E=p.arms[i]&&p.arms[i][1],f=p.amF&&p.amF[i];if(!E||!f)continue;let hold=false;for(const c of E.children)if(c!==f&&c.userData&&c.userData.att&&c.visible){hold=true;break}
  const tg=(i?-1:1)*(hold?1.25:.12);f.rotation.z+=(tg-f.rotation.z)*.35}}
// os braços do modelo pendem levemente abertos (como no original): a abertura é somada à pose de cada quadro,
// assim o eixo de cada articulação continua alinhado com o membro (peças da União e a espada ficam no lugar certo)
const AM_OPEN=.13;
const _animAM=anim;anim=function(p){const r=_animAM.apply(this,arguments);try{if(p&&p.skm&&p.arms&&p.arms[1]){p.arms[0][0].rotation.z-=AM_OPEN;p.arms[1][0].rotation.z+=AM_OPEN}amSync(p)}catch(e){}return r};
const _bb77=buildBody;buildBody=function(p,bi){try{if(typeof AMB==='undefined')throw new Error('sem dados');buildBody4(p);p.bodyI=0;return}catch(e){if(!buildBody.wAM){buildBody.wAM=1;console.warn('corpo 3D com esqueleto indisponível, usando o anterior: '+(e&&e.message))}amUndo(p);return _bb77(p,bi)}};
// roupas por cima do tronco: o colete passa a ser a própria região do tronco (não fica uma caixa por fora)
function amDress(p){const X=p.amPx;if(!p.skm||!X)return;X.vest=null;
 const sc=g=>{if(g)g.traverse(o=>{if(!o.isMesh||o.material===olm)return;const t=o.geometry&&o.geometry.type;
  if(o.material===p.mVest&&t!=='SphereGeometry'){if(!X.vest)X.vest=o;amHide(o)}else if(o.parent===p.tq&&o.material===p.mT&&t!=='SphereGeometry')amHide(o)})};sc(p.tq);sc(p.tg)
 // peças da frente da roupa (lapelas, botões, placa da armadura) encostam na superfície real do peito
 const ts0=p.tspace;if(ts0&&p.tg)for(const o of p.tg.children){if(!o.isMesh||o.position.z<.12)continue;const g=o.geometry;if(!g.boundingBox)g.computeBoundingBox();const bb=g.boundingBox,hd=bb?(bb.max.z-bb.min.z)/2*o.scale.z:0;
  const yr=ts0.position.y+ts0.scale.y*o.position.y,xr=ts0.position.x+ts0.scale.x*o.position.x,zr=amTorsoZ(yr,xr,0)+hd+.006;o.position.z=(zr-ts0.position.z)/(ts0.scale.z||1)}
 // placas largas (armadura leve) viram uma chapa curva que acompanha o peito, em vez de uma caixa reta
 if(ts0&&p.tg)for(const o of p.tg.children){if(!o.isMesh||o.userData.amCf||!o.geometry||o.geometry.type!=='BoxGeometry'||(o.material!==p.mArmor&&o.material!==p.mGold))continue;const g=o.geometry,pr=g.parameters||{};if(!(pr.width>.3))continue;
  const sx=ts0.scale.x,sy=ts0.scale.y,sz=ts0.scale.z||1,cx=ts0.position.x+sx*o.position.x,cy=ts0.position.y+sy*o.position.y,hw=pr.width*sx/2*.92,hh=pr.height*sy/2,N=10,M=8,pos=[],idx=[],th=.022;
  for(let k=0;k<2;k++)for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){const x=cx-hw+2*hw*i/N,y=cy-hh+2*hh*j/M,z=amTorsoZ(y,x,0)+.012+(k?0:th);pos.push((x-ts0.position.x)/sx,(y-ts0.position.y)/sy,(z-ts0.position.z)/sz)}
  const V=(k,j,i)=>k*(M+1)*(N+1)+j*(N+1)+i;for(let j=0;j<M;j++)for(let i=0;i<N;i++){idx.push(V(0,j,i),V(0,j,i+1),V(0,j+1,i),V(0,j,i+1),V(0,j+1,i+1),V(0,j+1,i))}
  for(let i=0;i<N;i++){idx.push(V(0,0,i),V(1,0,i),V(0,0,i+1),V(0,0,i+1),V(1,0,i),V(1,0,i+1),V(0,M,i),V(0,M,i+1),V(1,M,i),V(0,M,i+1),V(1,M,i+1),V(1,M,i))}
  for(let j=0;j<M;j++){idx.push(V(0,j,0),V(0,j+1,0),V(1,j,0),V(0,j+1,0),V(1,j+1,0),V(1,j,0),V(0,j,N),V(1,j,N),V(0,j+1,N),V(0,j+1,N),V(1,j,N),V(1,j+1,N))}
  const ng=new T.BufferGeometry();ng.setAttribute('position',new T.Float32BufferAttribute(pos,3));ng.setIndex(idx);ng.computeVertexNormals();o.geometry=ng;o.position.set(0,0,0);o.rotation.set(0,0,0);o.userData.amCf=1;
  for(const c of o.children)if(c.material===olm)c.visible=false}
 // capa presa na linha dos ombros, rente às costas do modelo
 const c=p.cp,ts=p.tspace;if(c&&ts&&c.parent===ts&&ts.scale.y){c.position.y=(1.755-ts.position.y)/ts.scale.y;c.position.z=(amTorsoZ(1.66,0,1)-.025-ts.position.z)/(ts.scale.z||1)}}
const _dressUpAM=dressUp;dressUp=function(p,L0){_dressUpAM(p,L0);try{amDress(p);amSync(p)}catch(e){}};
// linhas de energia da União seguem a superfície REAL do tronco do modelo (mapa de profundidade medido na malha)
function amTorsoZ(y,x,back){const F=AMB.tf,A=back?F.b:F.f,fy=Math.max(0,Math.min(F.ny-1.001,(y-F.y0)/F.dy)),fx=Math.max(0,Math.min(F.nx-1.001,(x-F.x0)/F.dx)),iy=Math.floor(fy),ix=Math.floor(fx),ty=fy-iy,tx=fx-ix,g=(a,b)=>A[a*F.nx+b];
 return (g(iy,ix)*(1-tx)+g(iy,ix+1)*tx)*(1-ty)+(g(iy+1,ix)*(1-tx)+g(iy+1,ix+1)*tx)*ty}
const _lbTZ_AM=lbTorsoZ;lbTorsoZ=function(D,t,x,back){try{if(D&&D.y0!=null&&typeof AMB!=='undefined'){const y=D.y0+t*D.h;return amTorsoZ(y,x,back)+(back?-.014:.014)}}catch(e){}return _lbTZ_AM(D,t,x,back)};
// medidas reais dos membros do modelo (raio, comprimento, ponta dos dedos, bico do pé) para as peças das formas demoníacas
const AM_SEG={ua:{r:.078,len:.31,minY:-.31,maxY:.05,maxZ:.08},fa:{r:.055,len:.375,minY:-.64,maxY:0,maxZ:.07},th:{r:.1,len:.375,minY:-.375,maxY:.06,maxZ:.11},sh:{r:.068,len:.6,minY:-.6,maxY:0,maxZ:.22}};
const _dsA_AM=dsAnalyze;dsAnalyze=function(L){const M=_dsA_AM(L);try{if(L&&L.skm)for(const k of['ua','fa','th','sh'])(M[k]||[]).forEach((o,i)=>{if(o)M[k][i]=Object.assign({},o,AM_SEG[k],{ok:1})})}catch(e){}return M};

