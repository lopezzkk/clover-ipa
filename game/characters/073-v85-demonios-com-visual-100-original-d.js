// ===================== V85 · demônios com visual 100% original do Clover RPG (não são cópias do anime) =====================
// Mantém o papel de cada um no jogo (Liebe com Asta, Zagred na Kotodama, os 4 contratos do Nacht), mas o desenho é próprio.
const V85={};
{const A=(par,geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x||0,y||0,z||0);par.add(o);return o};
 const SP=(r,a,b,...x)=>new T.SphereGeometry(r,a||10,b||8,...x),CN=(r,h,s)=>new T.ConeGeometry(r,h,s||6),CY=(a,b,h,s)=>new T.CylinderGeometry(a,b,h,s||7),BX=(x,y,z)=>new T.BoxGeometry(x,y,z);
 const strip=(w,h)=>{const g=new T.PlaneGeometry(w,h);g.translate(w/2,0,0);return g};
 const fanWing=(span,n,rag,c,eg)=>{const w=new T.Group(),pos=[],a0=1.25,a1=-.55;let prev=null;for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n,r=span*(i%2?1-rag:1)*(1-.25*i/n);const p=[Math.cos(a)*r,Math.sin(a)*r,0];if(prev)pos.push(0,0,0,...prev,...p);prev=p}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.computeVertexNormals();w.add(new T.Mesh(g,new T.MeshBasicMaterial({color:c,side:T.DoubleSide})));
  for(let i=0;i<=n;i+=2){const a=a0+(a1-a0)*i/n,L=span*(1-.25*i/n),b=new T.Mesh(new T.CylinderGeometry(.012,.02,L,4),eg);b.position.set(Math.cos(a)*L/2,Math.sin(a)*L/2,.005);b.rotation.z=a-Math.PI/2;w.add(b)}return w};
 const featherWing=(n,L,c1,c2,tipC)=>{const w=new T.Group();for(let k=0;k<n;k++){const a=.55-k*.28,l=L*(1-k*.09),f=new T.Mesh(new T.SphereGeometry(1,8,5),new T.MeshToonMaterial({color:k%2?c1:c2,gradientMap:gmap}));f.scale.set(l/2,.13,.03);f.position.set(Math.cos(a)*l/2,Math.sin(a)*l/2,-k*.006);f.rotation.z=a;w.add(f);if(k<2&&tipC){const t=new T.Mesh(new T.SphereGeometry(1,6,4),BM(tipC));t.scale.set(.05,.06,.032);t.position.set(Math.cos(a)*l*.95,Math.sin(a)*l*.95,-k*.006);w.add(t)}}return w};
 V85.A=A;V85.SP=SP;V85.fanWing=fanWing;V85.featherWing=featherWing;V85.CN=CN;V85.CY=CY;V85.BX=BX;

 // ---------- LIEBE (papel): "Diabrete do Vazio" — cabeça larga, crista de espinhos de osso, orelhas longas,
 // rachaduras de brasa no peito, asas de tiras rasgadas como capa e cauda com ponta em meia-lua
 lieBody=function(detail){const g=new T.Group(),sg=detail?12:7;
  const skin=new T.MeshToonMaterial({color:0x33283a,gradientMap:gmap,emissive:0x0a0206}),skin2=new T.MeshToonMaterial({color:0x4a3a52,gradientMap:gmap}),
   bone=new T.MeshToonMaterial({color:0xd8ccb4,gradientMap:gmap}),ember=BM(0xff5a1e),emG=GLM(0xff4010,.55);
  const head=new T.Group();head.position.y=.95;g.add(head);const hd=A(head,SP(.25,sg,sg),skin);hd.scale.set(1.18,.92,1);
  const brow=A(head,BX(.42,.07,.12),skin2,0,.07,.17);brow.rotation.x=-.25;
  const eyes=[];for(const s of[-1,1]){const e=A(head,SP(.045,8,6),BM(0xffc43a),s*.1,.01,.215);e.scale.set(1.7,.55,.5);eyes.push(e);if(detail){const gl=A(head,SP(.08,8,6),GLM(0xff8a1a,.45),s*.1,.01,.2)}
   const ear=A(head,CN(.06,.42,4),skin2,s*.34,.06,-.02);ear.rotation.z=-s*1.25;ear.scale.z=.35;
   if(detail){const ei=A(head,CN(.03,.3,4),ember,s*.33,.06,.005);ei.rotation.z=-s*1.25;ei.scale.z=.2}}
  for(let k=0;k<(detail?5:3);k++){const c=A(head,CN(.035-k*.004,.2-k*.02,4),bone,0,.2-k*.035,.05-k*.08);c.rotation.x=-.5-k*.25}
  const jaw=new T.Group();jaw.position.set(0,-.1,.19);head.add(jaw);A(jaw,BX(.24,.04,.06),BM(0x0a0408));
  for(let k=0;k<(detail?6:3);k++){const t=A(jaw,CN(.012,.05,3),bone,-.1+k*(detail?.04:.1),.03,.02);}
  const torso=A(g,CY(.19,.12,.52,sg),skin,0,.56,0);const chest=A(g,SP(.2,sg,7),skin2,0,.7,.03);chest.scale.set(1.15,.7,.8);
  if(detail){for(const [x,y,r] of[[-.07,.72,.5],[.05,.66,-.6],[.0,.56,.2],[.09,.76,.9]]){const c=A(g,BX(.012,.12,.01),ember,x,y,.19);c.rotation.z=r;A(g,BX(.03,.14,.01),emG,x,y,.185).rotation.z=r}}
  const hip=A(g,SP(.13,sg,6),skin,0,.28,0);
  const arms=[];for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.25,.8,0);A(a,SP(.07,7,6),skin2);A(a,CY(.05,.04,.34,6),skin,0,-.17,0);const fa=new T.Group();fa.position.y=-.34;a.add(fa);A(fa,CY(.045,.035,.32,6),skin,0,-.16,0);
   A(fa,BX(.08,.03,.08),ember,0,-.06,.04).rotation.y=.8;const hand=A(fa,SP(.05,7,5),skin2,0,-.33,0);if(detail)for(let k=0;k<3;k++){const cl=A(fa,CN(.014,.11,4),bone,(k-1)*.028,-.41,.02);cl.rotation.x=Math.PI+.25}
   a.rotation.z=s*.35;g.add(a);arms.push({a,fa,s})}
  const legs=[];for(const s of[-1,1]){const l=new T.Group();l.position.set(s*.09,.22,0);A(l,CY(.06,.04,.2,6),skin,0,-.1,.03).rotation.x=.5;A(l,CY(.04,.03,.2,6),skin,0,-.25,-.02).rotation.x=-.4;A(l,CN(.04,.1,4),bone,0,-.37,.05).rotation.x=1.6;g.add(l);legs.push(l)}
  if(detail){let p=new T.Group();p.position.set(0,.26,-.12);g.add(p);const tail=[];for(let k=0;k<6;k++){A(p,CY(.028-k*.003,.034-k*.003,.12,5),skin,0,-.06,0);const n=new T.Group();n.position.y=-.12;p.add(n);tail.push(p);p=n}
   const moon=A(p,new T.TorusGeometry(.07,.018,4,10,Math.PI*1.3),ember,0,-.06,0);moon.rotation.z=Math.PI*.85;A(p,SP(.05,6,5),emG,0,-.06,0);UD(g).tail=tail}
  // asas: tiras rasgadas (parecem uma capa aberta), borda em brasa
  const wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.12,.82,-.14);const f=fanWing(detail?.95:.8,detail?8:4,.22,0x3a1422,new T.MeshBasicMaterial({color:0xff6a2a}));f.scale.x=s;w.add(f);g.add(w);wings.push({w,s})}
  const aura=A(g,SP(.75,10,8),GLM(0xff3a10,.12),0,.6,0);aura.scale.y=1.3;const aura2=A(g,SP(.68,10,8),new T.MeshBasicMaterial({color:0,transparent:true,opacity:.07,depthWrite:false}),0,.6,0);aura2.scale.y=1.3;
  Object.assign(UD(g),{head,jaw,eyes,arms,legs,wings,aura});return g};

 // ---------- ZAGRED (papel): "Arauto das Palavras" — alto e magro, máscara branca lisa com uma fenda de luz,
 // coroa de lascas flutuando, manto de fitas, mãos de dedos longos e placas de runas girando atrás das costas
 V85.zagred=function(){const g=new T.Group(),r=new T.Group();g.add(r);r.scale.setScalar(1.15);
  const robe=naM(0x2c2238),robe2=naM(0x4a3a60),pale=naM(0xe8e2ea),vio=BM(0xc070ff),gl=GLM(0xb050ff,.4),dk=naM(0x0a0610);
  A(r,CN(.55,1.5,10),robe,0,.75,0);A(r,CN(.48,1.3,10),robe2,0,.8,.06).scale.z=.6;
  const tor=A(r,CY(.2,.3,.7,9),robe,0,1.75,0);A(r,SP(.22,9,7),robe2,0,2.02,0).scale.set(1.5,.6,1);
  for(const s of[-1,1]){const sp=A(r,CN(.07,.42,5),dk,s*.32,2.2,-.02);sp.rotation.z=-s*.7}
  const head=new T.Group();head.position.y=2.35;r.add(head);const fc=A(head,SP(.17,12,10),pale);fc.scale.set(.9,1.25,.85);A(head,BX(.018,.2,.01),vio,0,.01,.145);A(head,BX(.05,.24,.01),gl,0,.01,.14);
  const hood=A(head,SP(.22,10,8,0,6.28,0,1.9),robe2,0,.04,-.09);hood.scale.set(1,1.15,1.05);
  const crown=new T.Group();crown.position.y=2.72;r.add(crown);for(let k=0;k<7;k++){const a=k/7*6.283,c=A(crown,CN(.035,.22,4),vio,Math.cos(a)*.24,0,Math.sin(a)*.24);c.rotation.z=Math.cos(a)*.3;c.rotation.x=-Math.sin(a)*.3}
  const ring=A(crown,new T.TorusGeometry(.24,.008,4,28),gl);ring.rotation.x=Math.PI/2;
  const arms=[];for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.32,2.05,0);A(a,CY(.07,.055,.55,6),robe,0,-.27,0);const sl=A(a,CN(.13,.35,6),robe2,0,-.5,0);sl.rotation.x=Math.PI;const fa=new T.Group();fa.position.y=-.55;a.add(fa);A(fa,CY(.04,.035,.42,6),pale,0,-.2,0);
   for(let k=0;k<4;k++){const f=A(fa,CY(.009,.006,.2,4),pale,(k-1.5)*.025,-.5,0);f.rotation.x=.2}a.rotation.z=s*.12;r.add(a);arms.push([a,fa])}
  const W=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.2,1.95,-.32);for(let k=0;k<3;k++){const p=A(w,BX(.42-k*.08,.6-k*.1,.02),robe2,s*(.32+k*.3),.25-k*.2,-k*.05);p.rotation.z=-s*(.5+k*.2);A(p,BX(.12,.12,.01),vio,0,0,.015).rotation.z=.78}r.add(w);W.push({w,s})}
  const rib=[];for(let k=0;k<5;k++){const f=A(r,strip(.9,.08),new T.MeshBasicMaterial({color:k%2?0x2a1d3a:0x1a1224,side:T.DoubleSide}),(k-2)*.12,1.2,-.3);f.rotation.z=-Math.PI/2;rib.push(f)}
  const au=A(r,SP(.9,10,8),GLM(0x8a2aff,.1),0,1.5,0);au.scale.y=1.6;
  UD(g).face=2.35*1.15;UD(g).arm=.85;UD(g).anim=(t,m)=>{crown.rotation.y=t*.8;crown.position.y=2.72+Math.sin(t*2)*.03;W.forEach(o=>o.w.rotation.y=o.s*(.25+Math.sin(t*1.6)*.15));rib.forEach((f,i)=>f.rotation.x=Math.sin(t*2+i)*.25);head.rotation.z=Math.sin(t*.7)*.05;au.material.opacity=.08+Math.sin(t*3)*.03;
   arms.forEach(([a,fa],i)=>{const s=i?-1:1;if(m=='reach'||m=='reach2'){a.rotation.x=-1.45;a.rotation.z=s*.1;fa.rotation.x=0}else if(m=='talk'&&i==1){a.rotation.x=-.8+Math.sin(t*3)*.2}else{a.rotation.x=Math.sin(t*1.3+i)*.08;a.rotation.z=s*.12;fa.rotation.x=-.25}})};
  return g};
 const _csd=csDemon;csDemon=function(id){if(id=='zagred'){try{return V85.zagred()}catch(e){}}return _csd.apply(this,arguments)};

 // ---------- CONTRATOS DO NACHT (papéis), todos com desenho próprio
 naDevil=function(key){const g=new T.Group(),b=new T.Group();g.add(b);const P_={},col=(NAD[key]&&NAD[key].col)||0xffd23a;
  const eye=(par,x,y,z,s)=>{const e=A(par,SP(.06*(s||1),8,6),BM(col),x,y,z);e.scale.set(1.5,.6,.6);A(e,SP(.075,8,6),naGlow(col,.3));return e};
  if(key=='gimodelo'){// "Cão de Cinzas": corpo baixo e comprido, máscara de osso no focinho, crista de espinhos e listras brilhantes
   const dk=naM(0x2e2638),dk2=naM(0x463a52),bn=naM(0xe2d6bc),st=naGlow(col,.75);
   const bd=A(b,SP(.42,12,9),dk,0,.78,0);bd.scale.set(.85,.78,1.55);const ch=A(b,SP(.36,10,8),dk2,0,.86,.35);ch.scale.set(1,.95,.9);
   for(let k=0;k<6;k++){const sp=A(b,CN(.05,.26-k*.02,4),bn,0,1.15-k*.02,.35-k*.17);sp.rotation.x=-.7}
   for(let k=0;k<3;k++)for(const s of[-1,1]){const l=A(b,BX(.02,.22,.06),st,s*.34,.8,.1-k*.22);l.rotation.x=.4}
   const hd=new T.Group();hd.position.set(0,1.05,.72);b.add(hd);A(hd,SP(.26,10,8),dk);const mk=A(hd,BX(.24,.13,.3),bn,0,-.07,.26);A(hd,BX(.3,.05,.1),bn,0,.1,.18);const jw=A(hd,BX(.2,.07,.26),dk2,0,-.17,.22);
   for(const s of[-1,1]){eye(hd,s*.1,.05,.22);const ear=A(hd,CN(.07,.3,4),dk2,s*.16,.28,-.05);ear.rotation.set(-.4,0,-s*.35);const f=A(hd,CN(.02,.08,3),BM(0xffffff),s*.07,-.12,.33);f.rotation.x=Math.PI}
   const legs=[];for(const [x,z] of[[-.22,.42],[.22,.42],[-.22,-.42],[.22,-.42]]){const l=A(b,CY(.075,.05,.62,6),dk,x,.31,z);A(l,CN(.05,.08,4),bn,0,-.33,.06).rotation.x=1.5;legs.push(l)}
   const tl=new T.Group();tl.position.set(0,.95,-.75);b.add(tl);const t1=A(tl,CN(.09,.42,5),dk2,0,.05,-.16);t1.rotation.x=-1.0;A(tl,CN(.06,.16,4),st,0,.15,-.36).rotation.x=-1.0;P_.legs=legs;P_.tail=tl}
  else if(key=='slotos'){// "Guardião de Carapaça": costas com casco de placas, cabeça pequena com três olhos, braços enormes com punhos-escudo
   const dk=naM(0x2a2836),pl=naM(0x54506c),rim=naGlow(0x8ab0ff,.7);
   A(b,SP(.75,12,9),dk,0,1.6,0).scale.set(1,1,.8);const sh=A(b,SP(.85,12,8,0,6.28,0,1.5),pl,0,1.75,-.2);sh.rotation.x=-1.1;
   for(let k=0;k<5;k++){const a=-.9+k*.45,p=A(b,BX(.32,.08,.5),pl,Math.sin(a)*.72,2.1-Math.abs(a)*.25,-.55);p.rotation.set(-.6,a*.6,a*.5)}
   const ridge=A(b,BX(.06,.5,.06),rim,0,2.25,-.72);ridge.rotation.x=-.5;
   const hd=new T.Group();hd.position.set(0,2.2,.72);b.add(hd);A(hd,SP(.26,10,8),pl).scale.set(1.1,.85,1);A(hd,BX(.5,.1,.2),dk,0,.12,.12);eye(hd,-.1,0,.22,1.1);eye(hd,.1,0,.22,1.1);eye(hd,0,.11,.24,.8);
   const arms=[];for(const s of[-1,1]){const a=new T.Group();a.position.set(s*.85,2.05,.1);A(a,SP(.3,9,7),pl);A(a,CY(.24,.2,1.0,7),dk,0,-.55,0);const fist=A(a,new T.CylinderGeometry(.5,.5,.22,8),pl,s*.05,-1.1,.1);fist.rotation.z=Math.PI/2;
    const rg=A(a,new T.TorusGeometry(.48,.035,4,8),rim,s*.17,-1.1,.1);rg.rotation.y=Math.PI/2;b.add(a);arms.push(a)}
   const legs=[];for(const s of[-1,1]){const l=A(b,CY(.27,.24,1.0,7),dk,s*.38,.5,0);A(l,BX(.36,.14,.5),pl,0,-.47,.08);legs.push(l)}P_.arms=arms;P_.legs=legs}
  else if(key=='plumede'){// "Lince de Véu": corpo fino, pescoço alto, orelhas com tufos longos, marcas de meia-lua e cauda em fita
   const dk=naM(0x30283e),dk2=naM(0x4c3e62),mk=naGlow(col,.8);
   A(b,SP(.3,10,8),dk,0,.58,0).scale.set(.72,.66,1.7);A(b,CY(.1,.15,.35,7),dk2,0,.82,.38).rotation.x=.6;
   const hd=new T.Group();hd.position.set(0,1.0,.55);b.add(hd);A(hd,SP(.2,10,8),dk2).scale.set(1,.88,1.05);A(hd,CN(.09,.16,5),dk,0,-.05,.2).rotation.x=Math.PI/2;
   for(const s of[-1,1]){const e=A(hd,CN(.07,.3,4),dk,s*.12,.24,-.02);e.rotation.z=-s*.2;A(hd,CN(.02,.16,3),mk,s*.15,.42,-.02).rotation.z=-s*.2;eye(hd,s*.08,.03,.17,.8);
    const m=A(b,new T.TorusGeometry(.08,.012,4,10,Math.PI),mk,s*.22,.62,.05);m.rotation.y=s*Math.PI/2}
   const tail=[];for(let k=0;k<7;k++){const t=A(b,SP(.065-k*.006,6,5),k%2?dk2:dk,0,.62+k*.1,-.5-k*.12);tail.push(t)}A(tail[6],SP(.05,6,5),mk,0,.06,0);
   const legs=[];for(const [x,z] of[[-.13,.3],[.13,.3],[-.13,-.32],[.13,-.32]]){const l=A(b,CY(.04,.028,.46,5),dk,x,.23,z);legs.push(l)}P_.tail=tail;P_.legs=legs}
  else{// walgner — "Corvo-Lanterna": pássaro noturno flutuante, máscara-bico vermelha, crista de chamas, asas de penas em camadas
   const dk=naM(0x2a2032),dk2=naM(0x443552),rd=naM(0xc0202e),fl=naGlow(0xff5030,.8);
   A(b,SP(.36,10,8),dk,0,2,0).scale.set(.95,1.1,.9);A(b,SP(.26,10,8),dk2,0,1.92,.16).scale.set(1,1.1,.7);
   const hd=new T.Group();hd.position.set(0,2.42,.08);b.add(hd);A(hd,SP(.22,10,8),dk);const bk=A(hd,CN(.1,.32,4),rd,0,-.03,.28);bk.rotation.x=Math.PI/2;A(hd,BX(.32,.1,.05),rd,0,.05,.18);
   for(const s of[-1,1])eye(hd,s*.09,.06,.2,.8);for(let k=0;k<3;k++){const c=A(hd,CN(.05,.22-k*.04,4),fl,0,.22,.02-k*.1);c.rotation.x=-.3-k*.3}
   const wings=[];for(const s of[-1,1]){const w=new T.Group();w.position.set(s*.25,2.1,-.1);const f=featherWing(6,.85,0x3a2c4a,0x251a30,0xff5030);f.scale.x=s;w.add(f);b.add(w);wings.push(w)}
   {const tf=featherWing(5,.55,0x3a2c4a,0x251a30,0);tf.position.set(0,1.78,-.25);tf.rotation.set(0,Math.PI/2,-1.2);b.add(tf)}
   for(const s of[-1,1]){A(b,CY(.02,.02,.25,4),naM(0xc8a040),s*.1,1.62,.05);A(b,CN(.03,.08,3),naM(0xc8a040),s*.1,1.48,.08).rotation.x=Math.PI}P_.wings=wings}
  const au=A(g,SP(key=='slotos'?1.5:key=='walgner'?.55:.8,10,8),naGlow(NPu,.12),0,key=='slotos'?1.7:key=='walgner'?2:.7,0);au.scale.y=1.3;const sh=A(g,new T.CircleGeometry(key=='slotos'?1.1:.6,16),DMt(0,.35),0,.04,0);sh.rotation.x=-Math.PI/2;
  Object.assign(UD(g),{b,P:P_,key,au});return g}}

