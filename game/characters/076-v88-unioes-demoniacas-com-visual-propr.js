// ===================== V88 · UNIÕES DEMONÍACAS com visual próprio (combina com os demônios novos; não copia o anime) =====================
// Liebe (Asta) e as uniões do Nacht (Canis, Equus, Felis, Gallus e Quatro) trocam as peças antigas por peças novas originais.
Object.assign(DSK.liebe,{sk:0x9a7e76,cl:0x17121a,hr:0x0e0c10,ey:0xff3a2a,sc:0x2a0a0e,ac:0xd8302a});
Object.assign(DSK.canis,{ey:0xffd23a,ac:0xffd23a});Object.assign(DSK.equus,{ey:0x8ab0ff,ac:0x8ab0ff});Object.assign(DSK.felis,{ey:0xd890ff,ac:0xd890ff});Object.assign(DSK.gallus,{ey:0xffb040,ac:0xff5030});
// asa orgânica de membrana: braço de osso (ombro→cotovelo→pulso), 4 dedos em leque e borda recortada em arcos suaves (sem pontas)
function v89Wing(span,memC,boneC,glowC){try{return v89Wing0(span,memC,boneC,glowC)}catch(e){return new T.Group()}}
function v89Wing0(span,memC,boneC,glowC){const g=new T.Group(),bm=new T.MeshToonMaterial({color:boneC,gradientMap:gmap}),mm=new T.MeshToonMaterial({color:memC,gradientMap:gmap,side:T.DoubleSide}),gm=glowC?new T.MeshBasicMaterial({color:glowC}):null;
 const P0=new T.Vector3(0,0,0),E=new T.Vector3(span*.34,span*.2,-span*.05),W=new T.Vector3(span*.62,span*.3,-span*.08);const fingers=[[.98,.18],[.92,-.08],[.78,-.34],[.58,-.56]].map(([a,b])=>new T.Vector3(span*a,span*b,-span*.1));
 const seg=(a,b,r1,r2)=>{const d=b.clone().sub(a),L=d.length(),m=new T.Mesh(new T.CylinderGeometry(r2,r1,L,6),bm);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(m);return m};
 seg(P0,E,.05*span,.04*span);seg(E,W,.04*span,.03*span);g.add(Object.assign(new T.Mesh(new T.SphereGeometry(.045*span,8,6),bm),{}).translateX(E.x).translateY(E.y).translateZ(E.z));
 fingers.forEach(f=>seg(W,f,.026*span,.008*span));const cl=new T.Mesh(new T.ConeGeometry(.03*span,.12*span,5),bm);cl.position.copy(W).add(new T.Vector3(0,.06*span,0));g.add(cl);
 // membrana: entre ombro, dedos e borda inferior (cada vão tem uma curva para dentro)
 const pts=[P0.clone().add(new T.Vector3(0,-span*.35,0)),...fingers.slice().reverse(),E];const pos=[];const ring=[];
 const chain=[new T.Vector3(span*.05,-span*.42,-span*.04),fingers[3],fingers[2],fingers[1],fingers[0]];for(let i=0;i<chain.length-1;i++){const a=chain[i],b=chain[i+1];for(let k=0;k<5;k++){const t=k/5,p=a.clone().lerp(b,t);const sag=Math.sin(t*Math.PI)*span*.09;const toW=W.clone().sub(p).normalize().multiplyScalar(sag);ring.push(p.add(toW))}}ring.push(fingers[0].clone());
 const C=W.clone().multiplyScalar(.55).add(new T.Vector3(0,-span*.08,0));for(let i=0;i<ring.length-1;i++)pos.push(C.x,C.y,C.z,ring[i].x,ring[i].y,ring[i].z,ring[i+1].x,ring[i+1].y,ring[i+1].z);
 pos.push(C.x,C.y,C.z,fingers[0].x,fingers[0].y,fingers[0].z,W.x,W.y,W.z,C.x,C.y,C.z,W.x,W.y,W.z,E.x,E.y,E.z,C.x,C.y,C.z,E.x,E.y,E.z,P0.x,P0.y,P0.z,C.x,C.y,C.z,P0.x,P0.y,P0.z,ring[0].x,ring[0].y,ring[0].z);
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.computeVertexNormals();g.add(new T.Mesh(geo,mm));
 if(gm)fingers.forEach(f=>{const d=f.clone().sub(W),m=new T.Mesh(new T.BoxGeometry(.008*span,d.length()*.8,.004),gm);m.position.copy(W).add(f).multiplyScalar(.5);m.position.z+=.012;m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(m)});return g}
// chifre curvo e afinado (vários anéis seguindo uma curva para trás)
function v89Horn(len,c,tip,curl){try{return v89Horn0(len,c,tip,curl)}catch(e){return new T.Group()}}
function v89Horn0(len,c,tip,curl){const g=new T.Group(),m=new T.MeshToonMaterial({color:c,gradientMap:gmap}),mt=new T.MeshBasicMaterial({color:tip});const N=7;let prev=new T.Vector3();
 for(let i=1;i<=N;i++){const t=i/N,p=new T.Vector3(0,Math.sin(t*1.2)*len*.7,-Math.pow(t,1.6)*len*(curl||.9));const d=p.clone().sub(prev),L=d.length(),r1=.055*(1-(i-1)/N)+.006,r2=.055*(1-i/N)+.004;
  const s=new T.Mesh(new T.CylinderGeometry(r2,r1,L*1.05,7),i==N?mt:m);s.position.copy(prev).add(p).multiplyScalar(.5);s.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());g.add(s);prev=p}return g}
{const _nf=naForm;naForm=function(fk,L){const F=_nf.apply(this,arguments);try{v88Dress(F,fk,L||PP)}catch(e){}return F}}
function v88Dress(F,fk,L){if(!['liebe','canis','equus','felis','gallus','quatro','zagred'].includes(fk))return;
 const keep=new Set((F.skin&&F.skin.parts)||[]);for(const p of(F.parts||[]).slice()){if(keep.has(p))continue;let q=p,sk=false,n=0;while(q&&n++<40){if(keep.has(q)){sk=true;break}q=q.parent}if(!sk&&p.parent)p.parent.remove(p)}
 const hd=L.hs||L.hj||null,tor=L.tspace||L.root,arms=(L.arms||[]).filter(a=>a&&a[0]),mine=[],wings=[],tails=[],spin=[];if(!hd)return;
 const A=(geo,m,par,x,y,z,st)=>{const o=new T.Mesh(geo,m);o.position.set(x,y,z);o.userData.stage=st||'torso';o.userData.bs=[1,1,1];par.add(o);mine.push(o);return o};
 const G=(par,x,y,z,st)=>{const g=new T.Group();g.position.set(x,y,z);g.userData.stage=st||'back';g.userData.bs=[1,1,1];par.add(g);mine.push(g);return g};
 const M=c=>naM(c),Bm=c=>BM(c),Gl=(c,o)=>naGlow(c,o),SP=(r,a,b)=>new T.SphereGeometry(r,a||8,b||6),CN=(r,h,s)=>new T.ConeGeometry(r,h,s||5),BX=(a,b,c)=>new T.BoxGeometry(a,b,c),CY=(a,b,h,s)=>new T.CylinderGeometry(a,b,h,s||6);
 const has=k=>fk==k||(fk=='quatro'&&['canis','felis','gallus','equus'].includes(k));
 const tail=(c,tipM,n,sc)=>{let p=G(tor,0,.95,-.18,'back');const root=p,segs=[];for(let k=0;k<n;k++){const m=new T.Mesh(CY(.03*sc-k*.003,.036*sc-k*.003,.14*sc,5),M(c));m.position.y=-.07*sc;p.add(m);const nx=new T.Group();nx.position.y=-.14*sc;p.add(nx);segs.push(p);p=nx}if(tipM){const t=new T.Mesh(new T.TorusGeometry(.08*sc,.02*sc,4,10,Math.PI*1.3),tipM);t.rotation.z=Math.PI*.85;p.add(t)}root.rotation.x=2.2;tails.push(segs);return root};
 if(fk=='liebe'){// União do Asta (visual próprio): corpo humano mantido, chifres curvos, asas orgânicas, braço demoníaco, marcas no rosto, meia capa rasgada
  const em=Bm(0xff3a2a),dk=M(0x17121a),bone=M(0x2a2228),red=M(0x8a1a1e);
  for(const s of[-1,1]){const h=v89Horn(.58,0x1c1418,0xff3a2a,.7);h.position.set(s*.16,.3,.06);h.rotation.set(-.05,0,-s*.62);h.userData.stage='head';h.userData.bs=[1,1,1];hd.add(h);mine.push(h)}
  if(L.fg)for(const s of[-1,1]){const mk=A(new T.PlaneGeometry(.018,.09),em,L.fg,s*.075,-.04,.012,'head');mk.rotation.z=s*.25}
  else for(const s of[-1,1])A(new T.BoxGeometry(.016,.08,.005),em,hd,s*.075,-.03,.21,'head').rotation.z=s*.25;
  {const w=G(tor,0,1.5,-.2,'back');for(const s of[-1,1]){const wg=new T.Group();const big=s>0,f=v89Wing(big?1.12:.82,0x2a1a22,0x1e161c,0xc0281e);f.scale.x=s;f.rotation.z=s*(big?.28:.05);f.position.y=big?.06:-.04;wg.add(f);wg.position.x=s*.08;w.add(wg);wings.push({w:wg,s,big})}}
  // braço demoníaco (direito): manopla de placas lisas, linhas vermelhas e garras
  const ra=arms[1]||arms[0];if(ra&&ra[1]){for(let k=0;k<3;k++){const pl=A(new T.SphereGeometry(.075,10,8),dk,ra[1],0,-.08-k*.1,.01,'arms');pl.scale.set(1.05,.75,1.1)}A(new T.BoxGeometry(.012,.26,.01),em,ra[1],0,-.18,.085,'arms');
   for(let k=0;k<4;k++){const c=A(new T.ConeGeometry(.014,.09,5),M(0x1a1216),ra[1],(k-1.5)*.028,-.42,.03,'arms');c.rotation.x=Math.PI+.35}
   const sh=A(new T.SphereGeometry(.13,10,8,0,6.283,0,1.5),dk,ra[0],0,.03,0,'arms');sh.scale.set(1.1,.8,1.1);A(new T.TorusGeometry(.12,.012,5,16),em,ra[0],0,-.02,0,'arms').rotation.x=Math.PI/2}
  if(ra&&ra[1]){for(let k=0;k<3;k++){const v=A(new T.TorusGeometry(.078,.006,4,10,Math.PI*.9),em,ra[1],0,-.06-k*.1,0,'arms');v.rotation.set(Math.PI/2,0,k*.9)}A(new T.SphereGeometry(.05,8,6),dk,ra[0],0,-.28,-.02,'arms').scale.set(1.2,.8,1.4);for(let k=0;k<4;k++)A(new T.SphereGeometry(.018,6,5),M(0x2a2228),ra[1],(k-1.5)*.028,-.36,.06,'arms');
   for(let k=0;k<2;k++)A(new T.BoxGeometry(.01,.2,.01),em,ra[0],(k?-1:1)*.05,-.15,.065,'arms')}
  {const hg=L.hg;if(hg){const old=[];hg.children.forEach(c=>{old.push([c,c.scale.clone()]);c.scale.y*=.72;c.scale.x*=.92});mine.push({userData:{},scale:{set(){}},parent:null,_restore:()=>old.forEach(([c,sc])=>c.scale.copy(sc))})}}
  try{if(sword){const s0=sword.scale.clone();sword.scale.multiplyScalar(.82);mine.push({userData:{},scale:{set(){}},parent:null,_restore:()=>sword.scale.copy(s0)})}}catch(e){}
  // meia capa rasgada nas costas da cintura
  {const cp=G(tor,0,1.02,-.17,'back');for(let k=0;k<3;k++){const st=new T.Mesh(new T.PlaneGeometry(.2,.55),new T.MeshToonMaterial({color:k%2?0x2a0e12:0x1a0a0e,gradientMap:gmap,side:T.DoubleSide}));st.position.set((k-1)*.17,-.27,-.02*k);st.rotation.x=.12;cp.add(st)}tails.push([cp])}
  // cauda fina com ponta em forma de lança
  {const t=tail(0x17121a,null,6,.9);const tp=new T.Mesh(new T.ConeGeometry(.04,.12,4),em);let q=t;for(let n=0;n<20&&q.children&&q.children.length>1;n++)q=q.children[q.children.length-1];q.add(tp);tp.position.y=-.06;tp.rotation.x=Math.PI}
  for(const s of[-1,1]){A(new T.BoxGeometry(.012,.36,.01),em,tor,s*.17,1.3,.17,'torso').rotation.z=s*.12;A(new T.BoxGeometry(.03,.01,.3),em,tor,s*.2,1.02,0,'torso')}
  // peito: placa escura com runa vermelha
  {const pl=A(new T.SphereGeometry(.2,12,8,0,6.283,0,1.2),dk,tor,0,1.38,.05,'torso');pl.scale.set(1.05,.65,.55);pl.rotation.x=Math.PI/2.4;A(new T.RingGeometry(.035,.05,12),em,tor,0,1.36,.205,'torso')}}
 const legs=(L.legs||[]).filter(l=>l&&l[0]);
 const strip=(par,x,y,z,h,c,st,rz)=>{const m=A(new T.BoxGeometry(.012,h,.008),c,par,x,y,z,st);if(rz)m.rotation.z=rz;return m};
 const plate=(par,r,sx,sy,sz,c,x,y,z,st)=>{const m=A(new T.SphereGeometry(r,12,8,0,6.283,0,1.6),c,par,x,y,z,st);m.scale.set(sx,sy,sz);return m};
 const ruffle=(c,n,r,y)=>{for(let k=0;k<n;k++){const a=k/n*6.283,f=A(new T.ConeGeometry(.035,.14,4),c,tor,Math.cos(a)*r,y,Math.sin(a)*r,'torso');f.rotation.set(Math.sin(a)*1.2,0,-Math.cos(a)*1.2)}};
 if(fk=='zagred'){// União de Zagred (visual próprio): máscara-rosto pálida com fendas de luz, manto em camadas com bordas de runas, garras longas, anel de runas da Kotodama nas costas
  const vio=Bm(0xc070ff),pale=M(0xd8d0dc),dk=M(0x1a1224),mid=M(0x3a2a52),gl=Gl(0xb050ff,.5);
  A(new T.SphereGeometry(.2,12,10,0,6.283,0,1.7),pale,hd,0,.0,.02,'head').scale.set(1,1.1,1.05);for(const s of[-1,1]){strip(hd,s*.06,.0,.205,.1,vio,'head',s*.2);A(new T.SphereGeometry(.026,8,6),Bm(0xe0a0ff),hd,s*.065,.04,.19,'head')}
  for(const s of[-1,1]){const h=v89Horn(.32,0x1a1224,0xc070ff,.6);h.position.set(s*.11,.17,-.02);h.rotation.set(-.4,0,-s*.25);h.userData.stage='head';h.userData.bs=[1,1,1];hd.add(h);mine.push(h)}
  for(const s of[-1,1]){plate(tor,.15,1.15,.7,1.05,mid,s*.24,1.58,0,'torso');strip(tor,s*.2,1.3,.17,.4,vio,'torso',s*.1)}A(new T.TorusGeometry(.17,.012,5,18),vio,tor,0,1.05,0,'torso').rotation.x=Math.PI/2;
  {const cp=G(tor,0,1.55,-.16,'back');for(let k=0;k<4;k++){const c=new T.Mesh(new T.PlaneGeometry(.22,1.05),new T.MeshToonMaterial({color:k%2?0x2a1d3a:0x1a1224,gradientMap:gmap,side:T.DoubleSide}));c.position.set((k-1.5)*.17,-.55,-.02-Math.abs(k-1.5)*.02);c.rotation.x=.08;cp.add(c);const e=new T.Mesh(new T.PlaneGeometry(.22,.025),new T.MeshBasicMaterial({color:0xc070ff,side:T.DoubleSide}));e.position.set((k-1.5)*.17,-1.07,-.015-Math.abs(k-1.5)*.02);cp.add(e)}tails.push([cp])}
  arms.forEach(a=>{if(a[1]){for(let k=0;k<4;k++){const c=A(new T.ConeGeometry(.008,.12,4),pale,a[1],(k-1.5)*.02,-.42,.02,'arms');c.rotation.x=Math.PI+.15}strip(a[1],0,-.2,.06,.22,vio,'arms')}});legs.forEach(l=>{if(l[1])strip(l[1],0,-.2,.08,.3,vio,'legs')});
  const ring=G(tor,0,1.6,-.42,'back');for(let k=0;k<8;k++){const a=k/8*6.283,b=new T.Mesh(new T.BoxGeometry(.06,.06,.01),vio);b.position.set(Math.cos(a)*.38,Math.sin(a)*.38,0);b.rotation.z=a+.78;ring.add(b)}const rr=new T.Mesh(new T.TorusGeometry(.38,.006,4,32),gl);ring.add(rr);spin.push(ring);ring.userData.spinZ=1}
 if(fk=='canis'||fk=='quatro'){// Canis: meia-máscara de osso no focinho, orelhas, gola de pelos, garras nas mãos, listras douradas, cauda espessa
  const bone=M(0xe2d6bc),fur=M(0x3a2e46),st=Gl(0xffd23a,.85);A(new T.SphereGeometry(.12,10,8,0,6.283,0,1.4),bone,hd,0,-.05,.13,'head').scale.set(1,.55,1.3);A(new T.BoxGeometry(.26,.035,.06),bone,hd,0,.06,.19,'head');for(const s of[-1,1])strip(hd,s*.1,.0,.2,.07,st,'head',s*.6);
  if(fk=='canis'){for(const s of[-1,1]){const e=A(new T.ConeGeometry(.065,.24,5),fur,hd,s*.15,.26,-.03,'head');e.rotation.set(-.3,0,-s*.3);e.scale.z=.5}ruffle(fur,12,.17,1.62);
   const tl=G(tor,0,.98,-.2,'back');let p=tl;for(let k=0;k<4;k++){const m=new T.Mesh(new T.SphereGeometry(.06+k*.006,8,6),fur);m.scale.set(1,1,1.5);m.position.z=-.06;p.add(m);const n=new T.Group();n.position.z=-.1;n.rotation.x=-.2;p.add(n);p=n}tl.rotation.x=-.5;tails.push([tl])}
  arms.forEach(a=>{if(a[1]){for(let k=0;k<3;k++){const c=A(new T.ConeGeometry(.015,.1,4),bone,a[1],(k-1)*.03,-.42,.04,'arms');c.rotation.x=Math.PI+.3}}strip(a[0],0,-.15,.07,.18,st,'arms');strip(a[0],.03,-.2,.065,.12,st,'arms',.3)})}
 if(fk=='equus'||fk=='quatro'){// Equus: carapaça integrada ao tronco e ombros, placas com divisões, manoplas, grevas pesadas, viseira de três olhos
  const pl=M(0x54506c),pl2=M(0x6a6688),seam=M(0x1a1824),rim=Gl(0x8ab0ff,.8);
  for(const s of[-1,1]){for(let k=0;k<3;k++)plate(tor,.15-k*.025,1.25,.6,1.15,k%2?pl2:pl,s*(.24+k*.03),1.62-k*.09,0,'torso')}
  plate(tor,.24,1.05,.75,.6,pl,0,1.38,.06,'torso');strip(tor,0,1.36,.205,.26,seam,'torso');for(const y of[1.28,1.42])A(new T.BoxGeometry(.3,.01,.01),seam,tor,0,y,.2,'torso');
  {const sh=A(new T.SphereGeometry(.34,14,10,0,6.283,0,1.4),pl,tor,0,1.32,-.16,'back');sh.rotation.x=-1.45;sh.scale.set(1,1.15,.55);for(let k=0;k<3;k++){const r=A(new T.TorusGeometry(.32-k*.08,.012,4,20),k?seam:rim,tor,0,1.33,-.2-k*.02,'back');r.scale.set(1,1.15,1)}}
  if(fk=='equus'){A(new T.BoxGeometry(.34,.07,.06),M(0x2a2836),hd,0,.06,.2,'head');for(const x of[-.08,0,.08])A(new T.SphereGeometry(.025,6,5),Bm(0x8ab0ff),hd,x,.06+(x?0:.04),.235,'head')}
  arms.forEach(a=>{if(a[1]){plate(a[1],.08,1,1.6,1,pl2,0,-.18,0,'arms');A(new T.TorusGeometry(.075,.01,4,12),rim,a[1],0,-.08,0,'arms').rotation.x=Math.PI/2}});legs.forEach(l=>{if(l[1]){plate(l[1],.09,1,2,1.1,pl,0,-.2,.02,'legs');A(new T.BoxGeometry(.13,.05,.2),pl2,l[1],0,-.42,.05,'legs')}})}
 if(fk=='felis'||fk=='quatro'){// Felis: orelhas com tufos, marcas em meia-lua, olhos felinos, cauda longa, lâminas nos pulsos, marcas nas pernas
  const mk=Gl(0xd890ff,.85),fur=M(0x30283e);for(const s of[-1,1]){const e=A(new T.ConeGeometry(.05,.26,4),fur,hd,s*.12,.3,-.03,'head');e.rotation.z=-s*.18;A(new T.ConeGeometry(.015,.14,3),mk,hd,s*.14,.47,-.03,'head').rotation.z=-s*.18;
   const c=A(new T.TorusGeometry(.04,.008,4,10,Math.PI),mk,hd,s*.13,-.02,.17,'head');c.rotation.y=s*.4;for(let k=0;k<3;k++)A(new T.BoxGeometry(.07,.004,.004),M(0xe8e0d0),hd,s*.1,-.06+k*.012,.19,'head').rotation.z=s*(.15-k*.15)}
  if(fk=='felis'){const t=G(tor,0,.95,-.2,'back');const segs=[];let p=t;for(let k=0;k<9;k++){const b=new T.Mesh(new T.SphereGeometry(.045-k*.003,7,5),M(k%2?0x4c3e62:0x30283e));b.position.y=-.09;p.add(b);const n=new T.Group();n.position.y=-.09;p.add(n);segs.push(p);p=n}t.rotation.x=2.4;tails.push(segs)}
  arms.forEach(a=>{if(a[1]){const b=A(new T.ConeGeometry(.02,.28,3),mk,a[1],0,-.2,-.06,'arms');b.rotation.x=-.4}});legs.forEach(l=>{if(l[0])for(let k=0;k<2;k++)strip(l[0],.04,-.12-k*.1,.07,.08,mk,'legs',.5)})}
 if(fk=='gallus'||fk=='quatro'){// Gallus: máscara-bico vermelha, crista de chamas, asas de corvo integradas, ombreiras de penas e leque de cauda
  const rd=M(0xc0202e),fl=Gl(0xff5030,.85),fe=0x2a2236,fe2=0x181220;if(fk=='gallus'){const bk=A(new T.ConeGeometry(.07,.22,4),rd,hd,0,-.03,.26,'head');bk.rotation.x=Math.PI/2;A(new T.BoxGeometry(.3,.08,.05),rd,hd,0,.06,.2,'head')}
  for(let k=0;k<3;k++){const c=A(new T.ConeGeometry(.04,.18-k*.03,4),fl,hd,0,.26,.04-k*.08,'head');c.rotation.x=-.3-k*.3}
  for(const s of[-1,1])for(let k=0;k<4;k++){const f=A(new T.SphereGeometry(1,8,5),M(k%2?fe:fe2),tor,s*(.2+k*.04),1.62-k*.05,-.02,'torso');f.scale.set(.09,.035,.07);f.rotation.z=-s*(.4+k*.2)}
  const w=G(tor,0,1.48,-.22,'back');for(const s of[-1,1]){const wg=new T.Group();const f=V85.featherWing(9,.95,fe,fe2,0xff5030);f.scale.x=s;wg.add(f);const cv=V85.featherWing(6,.5,0x3a2c4a,fe,0);cv.scale.x=s;cv.position.set(0,.04,.01);wg.add(cv);wg.position.x=s*.12;w.add(wg);wings.push({w:wg,s})}
  if(fk=='gallus'){const tf=V85.featherWing(6,.5,fe,fe2,0);const tg=G(tor,0,.95,-.2,'back');tf.rotation.set(0,Math.PI/2,-1.4);tg.add(tf)}}
 if(fk=='quatro'){// cabeça única: viseira de carapaça + meia-máscara canina + orelhas felinas + crista; cor unificada em roxo e dourado
  const vi=A(new T.BoxGeometry(.32,.06,.05),M(0x54506c),hd,0,.08,.19,'head');for(const x of[-.07,.07])A(new T.SphereGeometry(.022,6,5),Bm(0xffd23a),hd,x,.08,.22,'head');
  A(new T.TorusGeometry(.2,.012,4,18),Gl(0xb070ff,.7),tor,0,1.45,0,'torso').rotation.x=Math.PI/2}
 if(!F.parts)F.parts=[];mine.forEach(m=>{if(!m._restore)F.parts.push(m)});
 const sc=(m,k)=>{if(m._restore)return;k=Math.max(.01,k);m.scale.set(k,k,k)};const st0=F.stage,gr0=F.grow,an0=F.anim,dt0=F.detach;
 F.stage=(st,k)=>{try{st0&&st0(st,k)}catch(e){}mine.forEach(m=>{if(m.userData.stage==st)sc(m,k)})};F.grow=k=>{try{gr0&&gr0(k)}catch(e){}mine.forEach(m=>sc(m,k))};
 F.anim=t=>{try{an0&&an0(t)}catch(e){}wings.forEach(o=>{const op=.5+.5*Math.sin(t*.9);o.w.rotation.y=o.s*((o.big?.35:.2)+Math.sin(t*3)*.12+op*(o.big?.25:.15))});tails.forEach(segs=>segs.forEach((p,i)=>{if(i)p.rotation.x=.25+Math.sin(t*3-i*.7)*.2;p.rotation.z=Math.sin(t*2-i*.5)*.15}));spin.forEach(c=>{if(c.userData.spinZ)c.rotation.z=t*.5;else c.rotation.y=t*.9})};
 F.detach=()=>{mine.forEach(m=>{if(m._restore)m._restore();if(m.parent)m.parent.remove(m)});try{dt0&&dt0()}catch(e){}};F.v88=mine.length}

