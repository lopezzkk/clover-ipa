// ---------- peças do Liebe ----------
function dmMat(c,em){const m=new T.MeshToonMaterial({color:c,gradientMap:gmap});if(em!=null){m.emissive=new T.Color(em)}return m}
function dmShell(len,r0,r1,jag){const N=10,pts=[];for(let i=N;i>=0;i--){const t=i/N;pts.push(new T.Vector2(Math.max(.01,r0+(r1-r0)*t),-t*len))}const g=new T.LatheGeometry(pts,14);if(jag){const p=g.attributes.position;for(let i=0;i<p.count;i++){const y=p.getY(i);if(y<-len*.97){const a=Math.atan2(p.getX(i),p.getZ(i));p.setY(i,y-jag*(Math.abs(Math.sin(a*3))))}}g.computeVertexNormals()}return g}
function dmWing(span,side){const g=new T.Group(),bones=[],P2=(x,y,z)=>new T.Vector3(x*span*side,y*span,(z||0)*span);
 const B=P2(0,0),E=P2(.34,.2,-.05),W=P2(.6,.36,-.08),F=[P2(1.02,.28,-.1),P2(.95,-.1,-.08),P2(.74,-.42,-.06),P2(.44,-.6,-.04)],A=P2(.06,-.48);
 const pos=[],tri=(a,b,c)=>pos.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z);let sd=11;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 const edge=(a,b,inward)=>{const pts=[];for(let k=0;k<=8;k++){const u=k/8,p=a.clone().lerp(b,u),c=W.clone().sub(p);p.add(c.multiplyScalar(Math.sin(u*Math.PI)*inward));if(k%2&&k<8)p.add(c.normalize().multiplyScalar(span*.035*(.5+rnd())));pts.push(p)}return pts};
 const chain=[F[0],F[1],F[2],F[3],A];for(let i=0;i<chain.length-1;i++){const e=edge(chain[i],chain[i+1],i==3?.12:.22);for(let k=0;k<e.length-1;k++)tri(W,e[k],e[k+1])}tri(W,A,E);tri(E,A,B);
 const mg=new T.BufferGeometry();mg.setAttribute('position',new T.Float32BufferAttribute(pos,3));mg.computeVertexNormals();
 const mem=new T.Mesh(mg,new T.MeshPhongMaterial({color:0x14060a,emissive:0x2a0008,specular:0x401018,shininess:20,side:T.DoubleSide}));g.add(mem);
 const bm=dmMat(0x0a0406,0x1a0004),cyl=hbG('dmBone',()=>new T.CylinderGeometry(1,.7,1,6)),link=(a,b,r)=>{const m=new T.Mesh(cyl,bm),d=b.clone().sub(a);m.position.copy(a).add(b).multiplyScalar(.5);m.scale.set(r,d.length(),r);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(m)};
 link(B,E,span*.035);link(E,W,span*.03);F.forEach(f=>link(W,f,span*.017));
 const hk=new T.Mesh(hbG('dmHook',()=>new T.ConeGeometry(1,1,5)),dmMat(0xe0d6c8));hk.scale.set(span*.025,span*.1,span*.025);hk.position.copy(W).add(P2(.02,.06));hk.rotation.z=-side*.6;g.add(hk);
 const rim=new T.Mesh(hbG('dmRim',()=>new T.SphereGeometry(1,8,6)),GLM(0xff2040,.5));rim.scale.setScalar(span*.03);rim.position.copy(W);g.add(rim);return g}
function liebeForm(F,L){try{if(typeof sword!='undefined'&&sword)sword.userData.att=1}catch(e){}const M=dsAnalyze(L),K=M.K,add=(m,par,st)=>{m.userData.stage=st||'arms';m.userData.ds=1;m.userData.bs=[m.scale.x,m.scale.y,m.scale.z];par.add(m);F.parts.push(m);return m};
 // remove a versão antiga (planos de asa, mangas cilíndricas, colar) e as peças genéricas; mantém só a cauda
 const keep=new Set();(F.tails||[]).forEach(s=>s.forEach(o=>{let q=o,n=0;while(q&&!F.parts.includes(q)&&n++<30)q=q.parent;if(q&&F.parts.includes(q))keep.add(q)}));
 F.parts=F.parts.filter(p=>{if(keep.has(p))return true;if(p.parent)p.parent.remove(p);return false});F.wings=[];
 const arm=dmMat(0x0e0608,0x120002),armT=(()=>{const m=dmMat(0xffffff,0xff2030);const tx=dtTex('liebe_cl');if(tx){m.map=tx;m.emissiveMap=tx}return m})(),glow=GLM(0xff2a3c,.9),bone=dmMat(0x2a0c10,0x3a0006);
 const tq=L.tq,D=L.tdim||{w:.6,h:.6,D:.34,tb:.9},tBot=(tq?tq.position.y:1.36)-D.h/2,R=K.root;
 // peitoral: casca do tronco (parte de cima) com borda serrilhada + selo de estrela no peito
 {const g=hbTorso(D.w*1.07,D.h*.62,D.D*1.15,1.05,0,0);const p=g.attributes.position;for(let i=0;i<p.count;i++){if(p.getY(i)<.01){const a=Math.atan2(p.getX(i),p.getZ(i));p.setY(i,-Math.abs(Math.sin(a*4))*.07)}}g.computeVertexNormals();add(new T.Mesh(g,armT),R,'torso').position.y=tBot+D.h*.4;
  const st=new T.Shape();for(let k=0;k<10;k++){const a=k/10*Math.PI*2,r=k%2?.025:.07;st[k?'lineTo':'moveTo'](Math.sin(a)*r,Math.cos(a)*r)}const sg=new T.Mesh(new T.ShapeGeometry(st),glow);sg.position.set(0,tBot+D.h*.74,D.D*.6+.02);add(sg,R,'torso');
  for(const s of[-1,1]){const ln=new T.Mesh(hbG('dmLn',()=>new T.PlaneGeometry(1,1)),glow);ln.scale.set(.018,D.h*.38,1);ln.position.set(s*D.w*.13,tBot+D.h*.6,D.D*.6+.015);ln.rotation.z=s*.55;add(ln,R,'torso')}}
 // ombreiras em camadas com esporões, do tamanho de cada ombro
 K.arms.forEach((a,i)=>{const s=i?1:-1,u=M.ua[i],f=M.fa[i];for(let k=0;k<3;k++){const pl=new T.Mesh(hbG('dmPaul',()=>new T.SphereGeometry(1,12,8,0,Math.PI*2,0,1.25)),armT);pl.scale.set(u.r*(1.9-k*.25),u.r*(1.3-k*.15),u.r*(1.8-k*.25));pl.position.set(s*u.r*.1,u.r*(.35-k*.4),0);pl.rotation.z=-s*(.25+k*.2);add(pl,a[0])}
  for(let k=0;k<2;k++){const sp=new T.Mesh(hbG('dmSpk',()=>new T.ConeGeometry(1,1,5)),arm);sp.scale.set(u.r*.32,u.r*1.4,u.r*.32);sp.position.set(s*u.r*(.6+k*.35),u.r*(.7-k*.3),-u.r*.2);sp.rotation.z=-s*(.7+k*.25);add(sp,a[0])}
  // manopla do antebraço com esporão no cotovelo e garras longas nas pontas dos dedos
  if(a[1]&&f){const sh=new T.Mesh(dmShell(f.len*.82,f.r*1.18,f.r*1.02,.04),armT);sh.position.y=-f.len*.12;add(sh,a[1]);const el=new T.Mesh(hbG('dmSpk'),arm);el.scale.set(f.r*.4,f.r*2.2,f.r*.4);el.position.set(0,-f.len*.1,-f.r*1.1);el.rotation.x=-2.3;add(el,a[1]);
   const rg=new T.Mesh(lwTor(),glow);rg.rotation.x=Math.PI/2;rg.scale.set(f.r*1.22,f.r*1.22,.6);rg.position.y=-f.len*.55;add(rg,a[1]);
   for(let k=0;k<4;k++){const cl=new T.Mesh(hbG('dmClaw',()=>{const g=new T.ConeGeometry(1,1,4);g.translate(0,-.5,0);return g}),bone);cl.scale.set(f.r*.17,f.r*1.5,f.r*.17);cl.position.set((k-1.5)*f.r*.48,f.minY-f.r*.9,f.r*.55);cl.rotation.x=.45;add(cl,a[1])}}});
 // coxas e grevas (canelas) com esporão no joelho e garras nos pés
 K.legs.forEach((l,i)=>{const t=M.th[i],sh=M.sh[i];const tp=new T.Mesh(dmShell(t.len*.55,t.r*1.12,t.r*1.0,.05),armT);tp.position.y=-t.len*.05;add(tp,l[0],'back');
  if(l[1]&&sh){const gv=new T.Mesh(dmShell(sh.len*.7,sh.r*1.2,sh.r*1.05,.03),armT);gv.position.y=-sh.len*.1;add(gv,l[1],'back');const kn=new T.Mesh(hbG('dmSpk'),arm);kn.scale.set(sh.r*.45,sh.r*2,sh.r*.45);kn.position.set(0,sh.r*.2,sh.r*.9);kn.rotation.x=.9;add(kn,l[1],'back');
   const gl=new T.Mesh(hbG('dmLn'),glow);gl.scale.set(.016,sh.len*.45,1);gl.position.set(0,-sh.len*.4,sh.r*1.24);add(gl,l[1],'back');
   for(let k=0;k<3;k++){const tl=new T.Mesh(hbG('dmClaw'),arm);tl.scale.set(sh.r*.16,sh.r*.55,sh.r*.16);tl.rotation.x=-1.4;tl.position.set((k-1)*sh.r*.5,sh.minY+.04,sh.maxZ+.02);add(tl,l[1],'back')}}});
 // cabeça: chifres curvos proporcionais, faixa de energia sobre os olhos
 const hd=K.head;if(hd){for(const s of[-1,1]){const hn=new T.Mesh(hrStrand(.44,.068,.7,1),dmMat(0x1a080c,0x3a0008));const m=hrPlace(new T.Vector3(s*.17,1.97+.12,.02),new T.Vector3(s*1,.85,-.1));m.decompose(hn.position,hn.quaternion,hn.scale);add(hn,hd,'head');const tip=new T.Mesh(hrStrand(.12,.022,.6,1),glow);tip.position.copy(hn.position);tip.quaternion.copy(hn.quaternion);tip.translateY(.4);add(tip,hd,'head')}
  const bd=new T.Mesh(hbG('dmBand',()=>new T.CylinderGeometry(.258,.258,.03,24,1,true,-1.15,2.3)),GLM(0xff2030,.55));bd.position.y=.035;add(bd,hd,'head')}
 // asas: estrutura de ossos + membrana rasgada, presas às costas na altura das escápulas
 const span=Math.min(1.45,Math.max(.9,D.w*2.1));for(const s of[-1,1]){const w=dmWing(span,s);w.position.set(s*D.w*.12,tBot+D.h*.78,-D.D*.55);w.rotation.set(.12,-s*.35,0);add(w,R,'back');F.wings.push({w,s,liebe:1})}
 const a0=F.anim;F.anim=t=>{try{a0(t)}catch(e){}F.wings.forEach(o=>{if(o.liebe){o.w.rotation.y=-o.s*(.35+Math.sin(t*2.2)*.22);o.w.rotation.z=o.s*Math.sin(t*2.2+.6)*.08}})};
 try{if(F.au)F.au.visible=false;if(F.au2)F.au2.material.opacity=.035}catch(e){}
 if(L===PP&&typeof sword!='undefined'&&sword){const bl=sword.children[0];if(bl&&bl.isMesh&&!bl.userData.m0){bl.userData.m0=bl.material;const sm=dmMat(0xffffff,0xff2030);const tx=dtTex('liebe_cl');if(tx){sm.map=tx;sm.emissiveMap=tx}bl.material=sm;const d0=F.detach;F.detach=()=>{try{bl.material=bl.userData.m0;bl.userData.m0=null;sm.dispose()}catch(e){}d0()}}}
 if(F.skin&&F.skin.reg)['ombros','peito','costas','braços','antebraços','mãos','dedos','pernas','joelhos','pés','cabeça'].forEach(k=>F.skin.reg[k]=1);return F}
const _naF1=naForm;naForm=function(fk,L){L=L||PP;const S0=DTSET[fk];DTEX.cur=S0?{p:S0.p,glow:S0.glow,sk:(DSK[fk]||DSK.liebe).sk,cl:(DSK[fk]||DSK.liebe).cl}:null;let F;try{F=_naF1(fk,L)}finally{DTEX.cur=null}
 try{if(fk=='liebe'&&L.hs&&F.skin){const kept=F.skin.parts;kept.forEach(p=>{if(p.parent)p.parent.remove(p)});F.parts=F.parts.filter(p=>!kept.includes(p));liebeForm(F,L);if(L===PP&&typeof aura!='undefined'&&aura)aura.visible=false}}catch(e){console.warn('liebeForm',e)}try{if(F.au)F.au.visible=false;if(F.au2)F.au2.material.opacity=.035}catch(e){}return F};

const _addSword0=addSword;addSword=function(){_addSword0();try{if(sword)sword.userData.att=1}catch(e){}};
const _dsAn0=dsAnalyze;dsAnalyze=function(L){try{if(typeof sword!='undefined'&&sword)sword.userData.att=1}catch(e){}return _dsAn0(L)};

// ================= UNIÃO DE LIEBE — RECONSTRUÍDA (V76b) =================
// Abordagem: o corpo continua sendo o corpo do jogador (cada um dos 8 tipos), e a forma demoníaca é feita de:
//  • materiais por região: traje de couro demoníaco com relevo de escamas (bump), rosto cinza-cinza escuro,
//    placas metálicas facetadas, cabelo escuro com pontas vermelhas;
//  • linhas de energia MODELADAS (tubos 3D) que seguem a anatomia: contorno do peitoral, linha do esterno,
//    "V" do quadril, linhas laterais dos braços e frontais das pernas, anéis nos punhos e tornozelos;
//  • placas finas do tamanho de cada segmento (ombreira, manopla, joelheira, greva, protetor de quadril,
//    placas do abdômen, gola alta e crista na coluna) + garras nas mãos e nos pés + chifres + olhos em fenda;
//  • asas com esqueleto articulado (ombro, cotovelo, punho, 4 dedos) e membrana de 2 camadas com curvatura,
//    recalculada a cada quadro → abrem ao transformar, dobram ao correr, batem no ar;
//  • estilo adaptado ao tipo de corpo (Chibi menor, Blocado geométrico, Musculoso com linhas dos músculos...).
DTSET.liebe=null;
const LBK={};function lbTex(k){if(LBK[k])return LBK[k];let c;try{c=document.createElement('canvas');c.width=c.height=128}catch(e){return null}const x=c.getContext&&c.getContext('2d');if(!x)return null;
 if(k=='scale'){x.fillStyle='#808080';x.fillRect(0,0,128,128);for(let j=0;j<9;j++)for(let i=0;i<9;i++){const cx=i*16+(j%2)*8,cy=j*14;const g=x.createRadialGradient(cx,cy-3,1,cx,cy,9);g.addColorStop(0,'#c8c8c8');g.addColorStop(.7,'#8a8a8a');g.addColorStop(1,'#404040');x.fillStyle=g;x.beginPath();x.ellipse(cx,cy,8,7,0,0,Math.PI*2);x.fill()}}
 else if(k=='metal'){x.fillStyle='#909090';x.fillRect(0,0,128,128);for(let i=0;i<40;i++){x.strokeStyle='rgba(40,40,40,.35)';x.lineWidth=1;x.beginPath();const y=Math.random()*128;x.moveTo(0,y);x.lineTo(128,y+(Math.random()-.5)*6);x.stroke()}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(k=='scale'?4:1,k=='scale'?4:1);t._keep=true;LBK[k]=t;return t}
function lbMats(){const suit=new T.MeshToonMaterial({color:0x2e2329,gradientMap:gmap}),face=new T.MeshToonMaterial({color:0x9a8278,gradientMap:gmap}),plate=new T.MeshPhongMaterial({color:0x1c1014,specular:0x6a3038,shininess:55,flatShading:true}),
 bone=new T.MeshPhongMaterial({color:0x22080c,specular:0x803040,shininess:70}),hair=new T.MeshToonMaterial({color:0xffffff,gradientMap:gmap,vertexColors:true}),
 glow=new T.MeshBasicMaterial({color:0xff2438}),halo=new T.MeshBasicMaterial({color:0xff2a3c,transparent:true,opacity:.28,blending:T.AdditiveBlending,depthWrite:false}),
 mem=new T.MeshToonMaterial({color:0x2c0c12,gradientMap:gmap,side:T.DoubleSide}),memIn=new T.MeshToonMaterial({color:0x4a1018,gradientMap:gmap,side:T.DoubleSide});
 const sc=lbTex('scale'),mt=lbTex('metal');if(sc){suit.bumpMap=sc;suit.bumpScale=.022;mem.bumpMap=sc;mem.bumpScale=.02}if(mt){plate.bumpMap=mt;plate.bumpScale=.02}
 return{suit,face,plate,bone,hair,glow,halo,mem,memIn}}
// tubo de energia ao longo de pontos (núcleo + halo)
function lbLine(par,pts,r,M,list){if(pts.length<2)return;const cv=new T.CatmullRomCurve3(pts),n=Math.max(8,pts.length*6);const a=new T.Mesh(new T.TubeGeometry(cv,n,r,5,false),M.glow),b=new T.Mesh(new T.TubeGeometry(cv,n,r*2.6,5,false),M.halo);par.add(a,b);list.push(a,b);return[a,b]}
// pontos sobre a superfície de um membro (cilindro de raio r) num ângulo `ang` (0 = frente, ±π/2 = lados)
function lbLimbPts(len,r0,r1,ang,y0,y1,n){const P=[];for(let i=0;i<=n;i++){const u=i/n,y=-(y0+(y1-y0)*u)*len,r=(r0+(r1-r0)*u)*1.06;P.push(new T.Vector3(Math.sin(ang)*r,y,Math.cos(ang)*r))}return P}
// superfície do tronco (mesmo perfil do corpo novo): t = 0 cintura → 1 ombros, x = deslocamento lateral, retorna z na frente/atrás
function lbTorsoZ(D,t,x,back){const w=D.w,tb=D.tb||1;let r;if(t<.62)r=(w/2*tb)*(1-t/.62)+(w/2)*(t/.62)*(1-.06*Math.sin(t/.62*Math.PI));else{const u=(t-.62)/.38;r=w/2*(1-.42*Math.pow(u,2.2))}const dz=D.D/w,q=Math.max(0,1-Math.pow(x/(r*1.001),2));let z=Math.sqrt(q)*r*dz;if(!back)z+=.04*Math.exp(-Math.pow((t-.72)/.11,2))*Math.max(0,1-Math.pow(Math.abs(Math.abs(x)-w*.2)/(w*.24),2));return(back?-1:1)*(z+.012)}
// ---------- asa articulada ----------
function lbWing(span,side,M,style){const g=new T.Group(),bones=[],cyl=hbG('lbBone',()=>new T.CylinderGeometry(1,.62,1,7)),knob=hbG('lbKnob',()=>new T.SphereGeometry(1,8,6));
 const mkB=(r)=>{const m=new T.Mesh(cyl,M.bone);m.userData.r=r;g.add(m);bones.push(m);return m},mkK=r=>{const m=new T.Mesh(knob,M.bone);m.scale.setScalar(r);g.add(m);return m};
 const L1=span*.3,L2=span*.32,FL=[.44,.4,.34,.27].map(v=>v*span),bU=mkB(span*.028),bF=mkB(span*.022),bFi=FL.map(()=>mkB(span*.011)),kE=mkK(span*.032),kW=mkK(span*.028),kR=mkK(span*.035);
 const hook=new T.Mesh(hbG('lbHook',()=>{const q=new T.ConeGeometry(1,1,6);q.translate(0,.5,0);return q}),M.bone);hook.scale.set(span*.02,span*.09,span*.02);g.add(hook);
 const NE=7,nV=(4*NE+6)*3;const mk=(mat)=>{const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(new Float32Array(nV*3),3));const m=new T.Mesh(geo,mat);m.frustumCulled=false;g.add(m);return m};
 const memA=mk(M.mem),memB=mk(M.memIn);const V=(x,y,z)=>new T.Vector3(x*side,y,z||0);
 const place=(m,a,b)=>{const d=b.clone().sub(a),l=d.length();m.position.copy(a).add(b).multiplyScalar(.5);m.scale.set(m.userData.r,l,m.userData.r);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize())};
 let sd=31;const jag=[];for(let i=0;i<4*NE;i++){sd=(sd*9301+49297)%233280;jag.push(sd/233280)}
 const upd=(fold,flap)=>{// fold 0 = fechada junto às costas, 1 = aberta
  const sh=-1.0+1.45*fold+flap,el=.4+2.25*fold,R0=new T.Vector3(0,0,0),dirU=new T.Vector2(Math.cos(sh),Math.sin(sh));const E=V(dirU.x*L1,dirU.y*L1,-span*.04*(1-fold));
  const fa=sh-(Math.PI-el),dirF=new T.Vector2(Math.cos(fa),Math.sin(fa)),W=E.clone().add(V(dirF.x*L2,dirF.y*L2,-span*.03));
  const spread=[.25,-.3,-.82,-1.3].map((a,i)=>a*fold+(-.08*i)*(1-fold)),F=FL.map((l,i)=>{const a=fa+spread[i]+(i?0:.1);return W.clone().add(V(Math.cos(a)*l,Math.sin(a)*l,-span*(.06+.03*i)*fold))});
  const A=V(span*.05,-span*.46*(.4+.6*fold),-span*.02);
  place(bU,R0,E);place(bF,E,W);F.forEach((f,i)=>place(bFi[i],W,f));kE.position.copy(E);kW.position.copy(W);kR.position.copy(R0);hook.position.copy(W);hook.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),V(.2,1,0).normalize());
  const ch=[F[0],F[1],F[2],F[3],A],pa=memA.geometry.attributes.position,pb=memB.geometry.attributes.position;let k=0,ji=0;const th=span*.012;
  const put=(p,cup)=>{pa.setXYZ(k,p.x,p.y,p.z-cup);pb.setXYZ(k,p.x,p.y,p.z-cup-th);k++};
  for(let s2=0;s2<4;s2++){const a=ch[s2],b=ch[s2+1];let prev=a.clone();for(let e=1;e<=NE;e++){const u=e/NE,p=a.clone().lerp(b,u),c=W.clone().sub(p);p.add(c.multiplyScalar(Math.sin(u*Math.PI)*(s2==3?.1:.2)+(e<NE&&e%2?jag[ji]*.025:0)));ji++;const cup=span*.06*fold*Math.sin(u*Math.PI);put(W,0);put(prev,0);put(p,cup);prev=p}}
  put(W,0);put(A,0);put(E,0);put(E,0);put(A,0);put(R0,0);
  pa.needsUpdate=pb.needsUpdate=true;memA.geometry.computeVertexNormals();memB.geometry.computeVertexNormals()};
 upd(0,0);return{g,upd}}
