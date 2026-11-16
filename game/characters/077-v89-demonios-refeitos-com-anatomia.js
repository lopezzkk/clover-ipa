// ===================== V89 · demônios refeitos com anatomia (corpo torneado, articulações, olhos com íris e brilho, bocas, garras) =====================
// Design próprio do Clover RPG. Corpos feitos com perfis torneados (Lathe) e membros com juntas, em vez de blocos soltos.
const V89={};
{const TM=(c,e)=>{const m=new T.MeshToonMaterial({color:c,gradientMap:gmap});if(e!=null)m.emissive=new T.Color(e);return m},BMc=c=>new T.MeshBasicMaterial({color:c});
 const add=(p,geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x||0,y||0,z||0);p.add(o);return o};
 const lathe=(pr,seg)=>{const g=new T.LatheGeometry(pr.map(([r,y])=>new T.Vector2(Math.max(.001,r),y)),seg||12);g.computeVertexNormals();return g};
 const ell=(r,sx,sy,sz,seg)=>{const g=new T.SphereGeometry(r,seg||12,Math.max(6,(seg||12)*.7|0));g.scale(sx,sy,sz);return g};
 // membro: pivô no topo, cilindro afinado com articulação redonda na ponta; devolve {g,end}
 const limb=(p,len,r1,r2,m,x,y,z,seg)=>{const g=new T.Group();g.position.set(x||0,y||0,z||0);p.add(g);add(g,new T.CylinderGeometry(r2,r1,len,seg||8),m,0,-len/2,0);add(g,new T.SphereGeometry(r1*1.02,seg||8,6),m,0,0,0);const end=new T.Group();end.position.y=-len;g.add(end);add(end,new T.SphereGeometry(r2*1.05,seg||8,6),m);return{g,end}};
 // olho vivo: esclera, íris, pupila (fenda opcional) e brilho; a pálpebra é o grupo (scale.y pisca)
 const eye=(p,x,y,z,r,iris,slit,ry)=>{const g=new T.Group();g.position.set(x,y,z);if(ry)g.rotation.y=ry;p.add(g);add(g,new T.SphereGeometry(r,10,8),BMc(0xf4ecd8)).scale.set(1,1,.6);
  add(g,new T.CircleGeometry(r*.62,14),BMc(iris),0,0,r*.6+.002);const pu=add(g,new T.CircleGeometry(r*.3,12),BMc(0x050305),0,0,r*.6+.004);if(slit)pu.scale.set(.35,1.5,1);add(g,new T.CircleGeometry(r*.13,8),BMc(0xffffff),r*.22,r*.22,r*.6+.006);
  const gl=add(g,new T.SphereGeometry(r*1.5,8,6),new T.MeshBasicMaterial({color:iris,transparent:true,opacity:.14,blending:T.AdditiveBlending,depthWrite:false}));return g};
 const teeth=(p,n,w,y,z,m,len)=>{for(let k=0;k<n;k++){const t=add(p,new T.ConeGeometry(.012,len||.05,4),m,-w/2+k*w/(n-1),y,z);t.rotation.x=Math.PI}};
 const claws=(p,n,w,m,len,y,z,tilt)=>{for(let k=0;k<n;k++){const c=add(p,new T.ConeGeometry(.018,len,5),m,n>1?-w/2+k*w/(n-1):0,y||0,z||0);c.rotation.x=Math.PI+(tilt||.3)}};
 V89.TM=TM;V89.eye=eye;V89.limb=limb;V89.lathe=lathe;V89.ell=ell;

 // ======================= LIEBE (papel) — Diabrete do Vazio =======================
 lieBody=function(detail){const g=new T.Group(),sk=TM(0x2c2230,0x080206),sk2=TM(0x433448),bel=TM(0x5a4652),bone=TM(0xe0d4bc),em=BMc(0xff5a1e),seg=detail?14:8;
  // tronco torneado (quadril → cintura → peito → ombros → pescoço) e barriga mais clara
  add(g,lathe([[.0,.24],[.12,.27],[.135,.34],[.11,.46],[.15,.62],[.17,.72],[.13,.82],[.06,.88],[.0,.9]],seg),sk,0,0,0);const bl=add(g,ell(.1,1,1.5,.6,seg),bel,0,.52,.07);
  if(detail)for(const [x,y,r] of[[-.06,.7,.5],[.05,.64,-.6],[.09,.74,.9],[-.08,.58,-.3]])add(g,new T.BoxGeometry(.01,.1,.008),em,x,y,.16).rotation.z=r;
  // cabeça: crânio largo, focinho curto, maxilar móvel, sobrancelha, orelhas pontudas, chifres curvos e olhos grandes
  const head=new T.Group();head.position.y=.98;g.add(head);add(head,ell(.22,1.15,1,1.02,seg),sk);add(head,ell(.12,1.3,.7,1,seg),sk2,0,-.07,.13);
  const brow=add(head,new T.BoxGeometry(.36,.05,.08),sk2,0,.06,.17);brow.rotation.x=-.3;
  const eyes=[eye(head,-.09,.0,.18,.05,0xffb020,1,-.25),eye(head,.09,.0,.18,.05,0xffb020,1,.25)];
  const jaw=new T.Group();jaw.position.set(0,-.1,.12);head.add(jaw);add(jaw,ell(.1,1.15,.4,.9,seg),sk2,0,-.02,.02);add(jaw,new T.BoxGeometry(.15,.012,.02),BMc(0x1a0408),0,.015,.1);teeth(jaw,detail?6:3,.12,.035,.1,bone,.035);
  for(const s of[-1,1]){const e=add(head,new T.ConeGeometry(.05,.3,6),sk,s*.25,.04,-.02);e.rotation.z=-s*1.25;e.scale.z=.4;if(detail){const i=add(head,new T.ConeGeometry(.025,.2,5),TM(0x7a2a3a),s*.25,.04,.0);i.rotation.z=-s*1.25;i.scale.z=.3}
   const h=v89Horn(.22,0xe0d4bc,0xff5a1e,.9);h.position.set(s*.1,.16,.02);h.rotation.set(-.2,0,-s*.35);head.add(h)}
  // braços com ombro, cotovelo, mão e 3 garras
  const arms=[];for(const s of[-1,1]){const u=limb(g,.26,.045,.035,sk,s*.17,.8,0,seg);u.g.rotation.z=s*.35;const f=limb(u.end,.24,.035,.03,sk,0,0,0,seg);add(f.end,ell(.045,1,.8,1.2,seg),sk2,0,-.02,.01);if(detail)claws(f.end,3,.06,bone,.07,-.05,.03);arms.push({a:u.g,fa:f.g,s})}
  // pernas digitígradas (coxa, canela para trás, pé com garras)
  const legs=[];for(const s of[-1,1]){const t=limb(g,.16,.06,.045,sk,s*.08,.27,0,seg);t.g.rotation.x=-.5;const c=limb(t.end,.15,.04,.03,sk,0,0,0,seg);c.g.rotation.x=1.0;const ft=add(c.end,ell(.05,1,.5,1.6,seg),sk2,0,-.01,.04);ft.rotation.x=-.5;if(detail)claws(c.end,3,.05,bone,.05,-.02,.1,1.3);legs.push(t.g)}
  // cauda segmentada com ponta em meia-lua
  let tail=[];if(detail){let p=new T.Group();p.position.set(0,.28,-.11);g.add(p);for(let k=0;k<7;k++){add(p,new T.CylinderGeometry(.022-k*.0025,.028-k*.0025,.11,7),sk,0,-.055,0);const n=new T.Group();n.position.y=-.11;p.add(n);tail.push(p);p=n}
   const moon=add(p,new T.TorusGeometry(.06,.016,6,12,Math.PI*1.3),em,0,-.05,0);moon.rotation.z=Math.PI*.85}
  // asas orgânicas pequenas
  const wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.08,.8,-.12);const f=v89Wing(detail?.75:.6,0x3a1422,0x2c2230,detail?0xff5a1e:0);f.scale.x=s;w.add(f);g.add(w);wings.push({w,s})}
  const aura=add(g,new T.SphereGeometry(.75,10,8),GLM(0xff3a10,.1),0,.6,0);aura.scale.y=1.3;
  Object.assign(UD(g),{head,jaw,eyes,arms,legs,wings,aura,tail});return g};

 // ======================= ZAGRED (papel) — Arauto das Palavras (humanoide alto) =======================
 V85.zagred=function(){const g=new T.Group(),r=new T.Group();g.add(r);r.scale.setScalar(1.08);
  const coat=TM(0x241a30),coat2=TM(0x3a2a52),pale=TM(0xd8d0dc,0x0a0610),dk=TM(0x120c18),hair=TM(0x1a1422),vio=BMc(0xc070ff),gold=TM(0xc8a060);
  // pernas e botas
  const legs=[];for(const s of[-1,1]){const t=limb(r,.62,.09,.07,dk,s*.13,1.0,0,10);const c=limb(t.end,.6,.07,.055,dk,0,0,0,10);add(c.end,ell(.08,1,.6,1.8,10),TM(0x0a080c),0,-.03,.06);legs.push([t.g,c.g])}
  // casaco longo aberto na frente (duas abas torneadas), cinto e colete
  for(const s of[-1,1]){const fl=add(r,lathe([[.0,.0],[.2,.02],[.26,.5],[.3,1.0],[.0,1.02]],10),coat,s*.07,.42,-.02);fl.scale.set(.9,1,.8);fl.rotation.y=s*.35}
  add(r,lathe([[.0,1.0],[.19,1.02],[.17,1.2],[.22,1.45],[.25,1.62],[.17,1.7],[.07,1.76],[.0,1.78]],12),coat2,0,0,0);add(r,new T.TorusGeometry(.18,.025,6,16),gold,0,1.08,0).rotation.x=Math.PI/2;
  for(let k=0;k<3;k++)add(r,new T.SphereGeometry(.018,6,5),gold,0,1.25+k*.12,.19);
  // gola alta e ombros
  const col=add(r,new T.CylinderGeometry(.16,.12,.24,12,1,true),coat,0,1.82,-.02);col.material.side=T.DoubleSide;for(const s of[-1,1])add(r,ell(.11,1.2,.8,1,10),coat,s*.24,1.66,0);
  // cabeça: rosto alongado, maçãs marcadas, orelhas pontudas, olhos violeta vivos, cabelo longo para trás e diadema de runas
  const head=new T.Group();head.position.y=1.98;r.add(head);add(head,ell(.13,.9,1.18,.95,12),pale);add(head,ell(.06,1.3,.6,1,8),pale,0,-.09,.07);
  for(const s of[-1,1]){const e=add(head,new T.ConeGeometry(.03,.14,5),pale,s*.12,.02,-.01);e.rotation.z=-s*1.2;e.scale.z=.4;add(head,new T.BoxGeometry(.04,.012,.01),TM(0x8a7a96),s*.05,-.06,.11).rotation.z=s*.4}
  const eyes=[eye(head,-.045,.02,.105,.028,0xb050ff,1,-.2),eye(head,.045,.02,.105,.028,0xb050ff,1,.2)];add(head,new T.BoxGeometry(.05,.006,.01),TM(0x4a2a5a),0,-.075,.12);
  add(head,ell(.15,1,1.05,1.05,12),hair,0,.04,-.035);for(let k=0;k<5;k++){const st=add(head,new T.ConeGeometry(.045,.5,5),hair,(k-2)*.05,-.25,-.12);st.rotation.x=.25}
  const dia=new T.Group();dia.position.y=.17;head.add(dia);for(let k=0;k<5;k++){const a=-.8+k*.4,c=add(dia,new T.OctahedronGeometry(.025,0),vio,Math.sin(a)*.13,Math.cos(a*.5)*.02,Math.cos(a)*.1);c.scale.y=1.8}
  // braços longos com mãos de dedos finos
  const arms=[];for(const s of[-1,1]){const u=limb(r,.5,.07,.055,coat2,s*.27,1.64,0,10);const f=limb(u.end,.46,.055,.045,coat2,0,0,0,10);add(f.end,new T.CylinderGeometry(.06,.05,.08,10),coat,0,.02,0);const hd=add(f.end,ell(.045,1,1.2,.6,8),pale,0,-.05,0);
   for(let k=0;k<4;k++){const fi=add(f.end,new T.CylinderGeometry(.007,.005,.12,5),pale,(k-1.5)*.018,-.13,.0);fi.rotation.x=.15}u.g.rotation.z=s*.1;arms.push([u.g,f.g])}
  // runas da Kotodama orbitando (símbolos próprios desenhados em linhas)
  const runeTex=(()=>{try{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d');x.strokeStyle='#e0b0ff';x.lineWidth=5;x.lineCap='round';x.shadowColor='#b050ff';x.shadowBlur=8;x.beginPath();x.moveTo(16,12);x.lineTo(32,52);x.lineTo(48,12);x.moveTo(20,32);x.lineTo(44,32);x.stroke();return new T.CanvasTexture(c)}catch(e){return null}})();
  const ring=new T.Group();ring.position.y=1.4;r.add(ring);for(let k=0;k<6;k++){const a=k/6*6.283,p=new T.Mesh(new T.PlaneGeometry(.22,.22),new T.MeshBasicMaterial({map:runeTex,color:0xffffff,transparent:true,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));p.position.set(Math.cos(a)*.6,Math.sin(k*2)*.15,Math.sin(a)*.6);p.rotation.y=-a+Math.PI/2;ring.add(p)}
  const au=add(r,new T.SphereGeometry(.9,10,8),GLM(0x8a2aff,.08),0,1.3,0);au.scale.y=1.6;
  UD(g).face=1.98*1.08;UD(g).arm=.85;UD(g).anim=(t,m)=>{ring.rotation.y=t*.7;ring.position.y=1.4+Math.sin(t*1.5)*.05;dia.rotation.y=Math.sin(t)*.1;head.rotation.y=Math.sin(t*.5)*.15;head.rotation.z=Math.sin(t*.7)*.04;
   eyes.forEach(e=>e.scale.y=(t%5)<.12?.15:1);r.position.y=Math.sin(t*1.6)*.015;au.material.opacity=.06+Math.sin(t*3)*.02;
   arms.forEach(([a,fa],i)=>{const s=i?1:-1;if(m=='reach'||m=='reach2'){a.rotation.x=-1.45;a.rotation.z=s*.08;fa.rotation.x=-.05}else if(m=='talk'&&i==1){a.rotation.x=-.9+Math.sin(t*3)*.2;fa.rotation.x=-.6}else{a.rotation.x=Math.sin(t*1.3+i)*.06;a.rotation.z=s*.1;fa.rotation.x=-.2}})};
  return g};

 // ======================= CONTRATOS DO NACHT (papéis) =======================
 naDevil=function(key){const g=new T.Group(),b=new T.Group();g.add(b);const P_={},col=(NAD[key]&&NAD[key].col)||0xffd23a,eyesL=[];let head=null;
  if(key=='gimodelo'){// Cão de Cinzas — cão grande de peito fundo, focinho com máscara de osso, crina de espinhos, cauda espessa
   const fur=TM(0x2e2638,0x05020a),fur2=TM(0x463a52),bone=TM(0xe2d6bc),st=naGlow(col,.8);
   const body=add(b,lathe([[0,-.75],[.22,-.68],[.3,-.4],[.34,-.05],[.4,.25],[.38,.5],[.24,.66],[0,.7]],14),fur,0,.88,0);body.rotation.x=Math.PI/2;body.scale.set(1,1,.92);
   add(b,ell(.3,1,.9,1.1,12),fur2,0,.78,.4);for(let k=0;k<6;k++){const sp=add(b,new T.ConeGeometry(.045,.22-k*.02,5),bone,0,1.2-k*.03,.42-k*.2);sp.rotation.x=-.8}
   for(let k=0;k<3;k++)for(const s of[-1,1])add(b,new T.BoxGeometry(.015,.2,.05),st,s*.36,.9,.2-k*.24).rotation.x=.35;
   const nk=add(b,new T.CylinderGeometry(.17,.24,.4,10),fur,0,1.1,.66);nk.rotation.x=-.9;
   head=new T.Group();head.position.set(0,1.28,.86);b.add(head);add(head,ell(.2,1,.92,1.1,12),fur);const sn=add(head,ell(.11,.9,.7,1.35,10),fur2,0,-.06,.2);
   add(head,ell(.1,1,.4,1.1,10),bone,0,.02,.2);add(head,ell(.04,1.3,.8,1,8),TM(0x0a0608),0,-.04,.38);const jw=new T.Group();jw.position.set(0,-.12,.1);head.add(jw);add(jw,ell(.09,.9,.35,1.6,10),fur2,0,0,.12);teeth(jw,5,.12,.03,.3,bone,.05);
   eyesL.push(eye(head,-.1,.06,.15,.04,col,0,-.4),eye(head,.1,.06,.15,.04,col,0,.4));for(const s of[-1,1]){const e=add(head,new T.ConeGeometry(.07,.26,5),fur2,s*.13,.22,-.04);e.rotation.set(-.3,0,-s*.25);e.scale.z=.5}
   const legs=[];for(const [x,z,f] of[[-.2,.42,1],[.2,.42,1],[-.2,-.45,0],[.2,-.45,0]]){const t=limb(b,.36,.09,.07,fur,x,.78,z,8);t.g.rotation.x=f?.1:-.25;const c=limb(t.end,.34,.06,.05,fur,0,0,0,8);c.g.rotation.x=f?-.15:.35;add(c.end,ell(.07,1,.5,1.4,8),fur2,0,-.02,.04);claws(c.end,3,.07,bone,.05,-.03,.1,1.3);legs.push(t.g)}
   const tl=new T.Group();tl.position.set(0,1.02,-.72);b.add(tl);let p=tl;tl.rotation.x=-.6;for(let k=0;k<4;k++){add(p,ell(.06+k*.008,1,1,1.5,8),k==3?fur2:fur,0,0,-.07);const n=new T.Group();n.position.z=-.11;n.rotation.x=-.2;p.add(n);p=n}add(p,new T.ConeGeometry(.06,.16,6),st,0,0,-.06).rotation.x=-Math.PI/2;
   P_.legs=legs;P_.tail=tl}
  else if(key=='slotos'){// Guardião de Carapaça — corpanzil curvado, casco orgânico em gomos, braços pesados com punhos de pedra, três olhos
   const sk=TM(0x2a2836,0x020208),sh=TM(0x54506c),sh2=TM(0x6a6688),rim=naGlow(0x8ab0ff,.75),bone=TM(0xd8d0c0);
   add(b,lathe([[0,.9],[.5,.95],[.7,1.3],[.75,1.7],[.6,2.1],[.35,2.3],[0,2.35]],14),sk,0,0,0);add(b,ell(.45,1.1,1,.6,12),TM(0x3e3a4c),0,1.45,.35);
   const shell=new T.Group();shell.position.set(0,1.7,-.25);shell.rotation.x=-.35;b.add(shell);add(shell,new T.SphereGeometry(.8,16,10,0,6.283,0,1.45),sh).scale.set(1,.95,.85);
   for(let r2=0;r2<3;r2++)for(let k=0;k<6+r2*2;k++){const a=k/(6+r2*2)*6.283,el=.35+r2*.35,pl=add(shell,ell(.2-r2*.03,1,.35,1,8),r2%2?sh2:sh,Math.cos(a)*Math.sin(el)*.78,Math.cos(el)*.74,Math.sin(a)*Math.sin(el)*.66-.02);pl.lookAt(shell.position.clone().multiplyScalar(0))}
   add(shell,new T.TorusGeometry(.78,.03,5,24),rim,0,.02,0).rotation.x=Math.PI/2;
   head=new T.Group();head.position.set(0,2.15,.6);b.add(head);add(head,ell(.24,1.1,.85,1,12),sk);add(head,ell(.16,1.1,.5,1,10),sh,0,.12,.05);const jw=new T.Group();jw.position.set(0,-.1,.1);head.add(jw);add(jw,ell(.16,1.1,.4,1.1,10),TM(0x3e3a4c),0,0,.04);teeth(jw,4,.16,.02,.18,bone,.04);
   eyesL.push(eye(head,-.1,.02,.2,.04,0x8ab0ff,0,-.3),eye(head,.1,.02,.2,.04,0x8ab0ff,0,.3),eye(head,0,.13,.2,.032,0x8ab0ff,0,0));
   const arms=[];for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.78,1.95,.15);b.add(a);add(a,ell(.3,1,.9,1,10),sh);const u=limb(a,.6,.22,.18,sk,0,0,0,10);const f=limb(u.end,.55,.2,.24,sk,0,0,0,10);const fist=add(f.end,ell(.3,1.1,.9,1,10),sh2,0,-.15,.05);
    for(let k=0;k<3;k++)add(f.end,ell(.07,1,1,1,6),bone,(k-1)*.13,-.3,.24);add(f.end,new T.TorusGeometry(.26,.025,5,16),rim,0,-.05,0).rotation.x=Math.PI/2;u.g.rotation.z=s*.12;arms.push(a)}
   const legs=[];for(const s of[-1,1]){const t=limb(b,.45,.26,.22,sk,s*.38,1.0,0,10);const c=limb(t.end,.42,.22,.2,sk,0,0,0,10);add(c.end,ell(.24,1,.4,1.3,10),sh,0,-.05,.08);claws(c.end,3,.2,bone,.08,-.06,.3,1.4);legs.push(t.g)}P_.arms=arms;P_.legs=legs}
  else if(key=='plumede'){// Lince de Véu — corpo esguio e alongado, pernas longas, cabeça com focinho fino, orelhas com tufos e cauda comprida
   const fur=TM(0x30283e,0x05020a),fur2=TM(0x4c3e62),mk=naGlow(col,.85),bone=TM(0xe8e0d0);
   const body=add(b,lathe([[0,-.55],[.14,-.5],[.2,-.25],[.19,.05],[.23,.3],[.2,.45],[0,.5]],12),fur,0,.66,0);body.rotation.x=Math.PI/2;
   const nk=add(b,new T.CylinderGeometry(.09,.14,.32,10),fur,0,.86,.48);nk.rotation.x=-.7;
   head=new T.Group();head.position.set(0,1.02,.64);b.add(head);add(head,ell(.15,1.05,.9,1,12),fur2);add(head,ell(.08,1,.7,1.3,10),fur,0,-.04,.13);add(head,ell(.025,1.3,.8,1,6),TM(0x1a1014),0,-.02,.23);
   eyesL.push(eye(head,-.065,.03,.12,.032,col,1,-.3),eye(head,.065,.03,.12,.032,col,1,.3));
   for(const s of[-1,1]){const e=add(head,new T.ConeGeometry(.055,.2,5),fur,s*.08,.17,-.02);e.rotation.z=-s*.18;e.scale.z=.5;add(head,new T.ConeGeometry(.012,.12,4),mk,s*.095,.31,-.02).rotation.z=-s*.18;
    const m=add(b,new T.TorusGeometry(.06,.01,4,12,Math.PI),mk,s*.2,.72,.1);m.rotation.y=s*Math.PI/2;for(let k=0;k<3;k++)add(head,new T.BoxGeometry(.08,.004,.004),bone,s*.1,-.05+k*.015,.16).rotation.z=s*(.1-k*.1)}
   const legs=[];for(const [x,z,f] of[[-.11,.34,1],[.11,.34,1],[-.11,-.36,0],[.11,-.36,0]]){const t=limb(b,.3,.05,.04,fur,x,.6,z,8);t.g.rotation.x=f?.05:-.3;const c=limb(t.end,.3,.035,.03,fur,0,0,0,8);c.g.rotation.x=f?-.05:.4;add(c.end,ell(.04,1,.5,1.4,8),fur2,0,-.01,.03);legs.push(t.g)}
   const tail=[];for(let k=0;k<9;k++){const t=add(b,ell(.045-k*.0025,1,1,1.4,8),k%2?fur2:fur,0,.74+k*.07,-.5-k*.06+k*k*.004);tail.push(t)}add(tail[8],ell(.04,1,1,1.6,6),mk,0,.02,-.03);
   P_.tail=tail;P_.legs=legs}
  else{// walgner — Corvo-Lanterna: ave grande de penas negras, bico longo, máscara vermelha, crista de chamas, asas de penas em camadas e garras
   const fe=TM(0x1e1828,0x020106),fe2=TM(0x342a44),rd=TM(0xb01828),fl=naGlow(0xff5030,.85),bk=TM(0x2a2428),tal=TM(0xc8a040);
   add(b,ell(.32,1,1.15,1.35,14),fe,0,2,0).rotation.x=.35;add(b,ell(.22,1,1.1,.8,12),fe2,0,1.92,.2);
   for(let k=0;k<10;k++){const a=k/10*6.283;const f=add(b,ell(.1,.6,.3,1.6,6),k%2?fe:fe2,Math.cos(a)*.2,1.82,Math.sin(a)*.24);f.rotation.y=-a}
   head=new T.Group();head.position.set(0,2.42,.22);b.add(head);add(head,ell(.17,1,1,1.1,12),fe);
   const up=add(head,new T.ConeGeometry(.07,.34,6),bk,0,.0,.3);up.rotation.x=Math.PI/2;up.scale.set(1,1,.6);const lo=add(head,new T.ConeGeometry(.05,.26,6),bk,0,-.05,.26);lo.rotation.x=Math.PI/2+.15;lo.scale.set(1,1,.5);
   add(head,new T.BoxGeometry(.3,.09,.06),rd,0,.04,.12);eyesL.push(eye(head,-.08,.05,.12,.03,0xffb040,0,-.5),eye(head,.08,.05,.12,.03,0xffb040,0,.5));
   for(let k=0;k<4;k++){const c=add(head,new T.ConeGeometry(.045,.22-k*.035,5),fl,0,.17,.04-k*.07);c.rotation.x=-.35-k*.25}
   const wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.28,2.12,-.05);const f=V85.featherWing(9,1.05,0x2a2236,0x181220,0xff5030);f.scale.x=s;w.add(f);const cv=V85.featherWing(6,.55,0x342a44,0x2a2236,0);cv.scale.x=s;cv.position.set(0,.04,.01);w.add(cv);b.add(w);wings.push(w)}
   {const tf=V85.featherWing(7,.62,0x2a2236,0x181220,0);tf.position.set(0,1.75,-.32);tf.rotation.set(0,Math.PI/2,-1.25);b.add(tf)}
   for(const s of[-1,1]){const t=limb(b,.3,.035,.025,tal,s*.12,1.68,.02,6);t.g.rotation.x=.15;for(let k=0;k<3;k++){const c=add(t.end,new T.ConeGeometry(.012,.1,4),bk,(k-1)*.03,-.02,.04);c.rotation.x=1.9}}
   P_.wings=wings}
  const au=add(g,new T.SphereGeometry(key=='slotos'?1.5:key=='walgner'?.55:.8,10,8),naGlow(NPu,.1),0,key=='slotos'?1.7:key=='walgner'?2:.7,0);au.scale.y=1.3;const sh=add(g,new T.CircleGeometry(key=='slotos'?1.1:.6,16),DMt(0,.35),0,.04,0);sh.rotation.x=-Math.PI/2;
  Object.assign(UD(g),{b,P:P_,key,au,head,eyesL});return g};
 // respiração, piscadas e cabeça olhando em volta (idle próprio de cada espécie)
 {const _a=naDevilAnim;naDevilAnim=function(g,t,mv){_a(g,t,mv);try{const u=UD(g);const k=u.key,br=1+Math.sin(t*(k=='slotos'?1.4:k=='walgner'?3:2.4))*(k=='slotos'?.012:.02);u.b.scale.set(1,br,1);
  (u.eyesL||[]).forEach(e=>e.scale.y=((t+(k.length*.7))%4.2)<.12?.12:1);if(u.head){u.head.rotation.y=Math.sin(t*.6)*(k=='plumede'?.4:.25);u.head.rotation.x=Math.sin(t*.9)*.06+(k=='gimodelo'&&mv>.2?.1:0)}}catch(e){}}}}

