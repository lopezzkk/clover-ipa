// ===================== V90 · acabamento dos demônios: rosto expressivo, mãos/pés, pelagem, placas, penas em camadas =====================
{const TM=V89.TM,add=(p,geo,m,x,y,z)=>{const o=new T.Mesh(geo,m);o.position.set(x||0,y||0,z||0);p.add(o);return o},ell=V89.ell,BMc=c=>new T.MeshBasicMaterial({color:c});
 const tufts=(p,n,r,y,z,c,len,spread)=>{for(let k=0;k<n;k++){const a=(k/(n-1)-.5)*(spread||2.4),t=add(p,new T.ConeGeometry(.03,len||.12,4),c,Math.sin(a)*r,y-Math.abs(Math.sin(a))*.03,z+Math.cos(a)*r*.4);t.rotation.set(.9,0,-a*.6)}};
 // ---------- Liebe: sobrancelhas, maçãs do rosto, narinas, lábio, dedos com garras, músculos do peito, veias nas asas, joelheiras
 {const _l=lieBody;lieBody=function(detail){const g=_l(detail);try{const u=UD(g),h=u.head,dk=TM(0x241a28),red=TM(0x6a1e2a),bone=TM(0xe0d4bc),em=BMc(0xff5a1e);
  for(const s of[-1,1]){const br=add(h,new T.BoxGeometry(.11,.025,.03),dk,s*.09,.075,.19);br.rotation.z=-s*.28;add(h,ell(.05,1.3,.7,.6,8),TM(0x3a2c40),s*.12,-.04,.15);add(h,new T.SphereGeometry(.008,5,4),BMc(0x0a0204),s*.02,-.06,.25)}
  add(u.jaw,new T.TorusGeometry(.07,.006,4,12,Math.PI),red,0,.03,.1).rotation.z=Math.PI;
  if(detail){add(g,ell(.07,1.2,.8,.5,10),TM(0x3a2c40),-.065,.7,.12);add(g,ell(.07,1.2,.8,.5,10),TM(0x3a2c40),.065,.7,.12);
   for(const L of u.legs){const kn=add(L,ell(.035,1,1,1.2,6),bone,0,-.15,.05)}
   for(const w of u.wings)w.w.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.type=='BufferGeometry'&&o.material&&o.material.side===T.DoubleSide){o.material=new T.MeshToonMaterial({color:0x4a1a2a,gradientMap:gmap,side:T.DoubleSide,emissive:0x1a0408})}})}}catch(e){}return g}}
 // ---------- Zagred: olhos de esclera escura, rachaduras roxas no rosto, garras longas, bordas do casaco com runas, postura inclinada
 {const _z=V85.zagred;V85.zagred=function(){const g=_z();try{const r=g.children[0],vio=BMc(0xc070ff);let head=null;r.children.forEach(c=>{if(c.isGroup&&Math.abs(c.position.y-1.98)<.01)head=c});
  if(head){head.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHex()==0xf4ecd8)o.material=BMc(0x1a0a22)});for(const [x,y,rz] of[[-.05,-.03,.3],[.06,-.04,-.4],[-.02,.08,.1]])add(head,new T.BoxGeometry(.006,.06,.004),vio,x,y,.125).rotation.z=rz;
   for(const s of[-1,1]){const h=v89Horn(.26,0x1a1224,0xc070ff,.55);h.position.set(s*.08,.12,-.02);h.rotation.set(-.6,0,-s*.25);head.add(h)}}
  for(const s of[-1,1]){const e=add(r,new T.BoxGeometry(.015,1.0,.01),vio,s*.18,.95,.2);e.rotation.z=s*.12}r.rotation.x=.04}catch(e){}return g}}
 // ---------- Nacht: detalhes por espécie
 {const _n=naDevil;naDevil=function(key){const g=_n(key);try{const u=UD(g),h=u.head,b=u.b;if(!h)return g;
  if(key=='gimodelo'){const fur=TM(0x463a52),dk=TM(0x1e1828),bone=TM(0xe2d6bc),st=naGlow(0xffd23a,.85);add(h,ell(.045,1.4,.8,.9,8),TM(0x0a0608),0,-.03,.4);for(const s of[-1,1]){add(h,new T.SphereGeometry(.012,5,4),BMc(0x000000),s*.025,-.03,.44);const br=add(h,new T.BoxGeometry(.09,.03,.05),dk,s*.1,.11,.16);br.rotation.z=-s*.35}
   tufts(b,9,.26,1.18,.55,fur,.2);tufts(h,7,.16,-.12,0,fur,.12);for(let k=0;k<4;k++)add(b,new T.BoxGeometry(.012,.14,.04),st,(k%2?-1:1)*.33,.82,-.1-k*.14).rotation.x=.4}
  else if(key=='slotos'){const seam=TM(0x14121c),pl2=TM(0x7a76a0),rim=naGlow(0x8ab0ff,.7);for(const s of[-1,1]){const pa=add(b,new T.SphereGeometry(.34,12,8,0,6.283,0,1.5),pl2,s*.82,2.18,.12);pa.scale.set(1.1,.7,1.05);add(b,new T.TorusGeometry(.32,.018,4,18),seam,s*.82,2.12,.12).rotation.x=Math.PI/2}
   add(h,new T.BoxGeometry(.46,.06,.24),pl2,0,.17,.04);for(let k=0;k<3;k++)add(b,new T.TorusGeometry(.42-k*.1,.015,4,18),rim,0,1.42,.42+k*.01).scale.set(1.1,1,1)}
  else if(key=='plumede'){const fur=TM(0x5a4a72),mk=naGlow(0xd890ff,.85);add(h,ell(.022,1.4,.8,1,6),TM(0xd890ff),0,-.01,.235);tufts(h,6,.12,-.06,.04,fur,.1);tufts(b,7,.12,.72,.48,fur,.14);for(let k=0;k<4;k++)add(b,new T.TorusGeometry(.12,.008,4,10,Math.PI),mk,0,.88,.2-k*.16).rotation.set(0,0,Math.PI)}
  else if(key=='walgner'){const fe=TM(0x2a2236),fe2=TM(0x3e3250);for(let r2=0;r2<3;r2++)for(let k=0;k<7;k++){const a=(k/6-.5)*1.6,f=add(b,ell(.07,1,.35,1.3,6),r2%2?fe:fe2,Math.sin(a)*.2,2.1-r2*.12,.2+Math.cos(a)*.08);f.rotation.set(.5,a,0)}
   add(h,new T.BoxGeometry(.012,.03,.25),TM(0x4a4048),0,.03,.32);for(let k=0;k<5;k++){const f=add(h,ell(.05,.5,.3,1.5,6),fe2,0,.12+k*.01,-.05-k*.05);f.rotation.x=-.6}}}catch(e){}return g}}}
// ---------- Forma de Zagred (Kotodama): tira as asas de pirâmides e chifres antigos e a aura fica discreta; o visual novo vem da união (v88)
{const _zb=zagBuild;zagBuild=function(){const g=_zb.apply(this,arguments);try{const u=UD(g),E=new T.BufferGeometry();(u.W||[]).forEach(w=>w.traverse(o=>{if(o.isMesh)o.geometry=E}));(u.H||[]).forEach(h=>h.geometry=E);if(u.a&&u.a.material){u.a.material.opacity=.06}}catch(e){}return g}}

