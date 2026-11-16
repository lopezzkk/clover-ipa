// ---------- a forma ----------
function liebeForm(F,L){try{if(typeof sword!='undefined'&&sword)sword.userData.att=1}catch(e){}
 const M=dsAnalyze(L),K=M.K,bi=L.bodyI|0,ST={chibi:bi==5,box:bi==2,mus:bi==4,fat:bi==6,slim:bi==7||bi==1,tall:bi==3},MT=lbMats(),lines=[],own=[],sz=ST.chibi?.65:ST.mus||ST.fat?1.15:1;
 const add=(m,par,st)=>{m.userData.stage=st||'arms';m.userData.ds=1;m.userData.bs=[m.scale.x,m.scale.y,m.scale.z];par.add(m);F.parts.push(m);return m};
 const keep=new Set();(F.tails||[]).forEach(s=>s.forEach(o=>{let q=o,n=0;while(q&&!F.parts.includes(q)&&n++<30)q=q.parent;if(q&&F.parts.includes(q))keep.add(q)}));
 F.parts=F.parts.filter(p=>{if(keep.has(p))return true;if(p.parent)p.parent.remove(p);return false});F.wings=[];
 // materiais por região (o dSkin já trocou tudo; aqui refinamos: rosto, traje com relevo, placas, cabelo com pontas vermelhas)
 const C=DSK.liebe,head=K.head,swp=[],inside=(o,J)=>{for(let p=o;p;p=p.parent)if(p===J)return true;return false};
 L.root.traverse(o=>{if(!o.isMesh||!o.material||o.userData.ds||!o.material.color)return;for(let p=o;p&&p!==L.root;p=p.parent)if(p.userData&&(p.userData.att||p.userData.stage))return;const h=o.material.color.getHex();let nm=null;
  if(h===C.sk)nm=head&&inside(o,head)?MT.face:MT.suit;else if(h===C.cl)nm=MT.suit;else if(h===C.hr&&o.geometry&&o.geometry.attributes.color)nm=MT.hair;if(nm){swp.push([o,o.material]);o.material=nm}});
 const tq=L.tq,D=L.tdim||{w:.6,h:.6,D:.34,tb:.9},tBot=(tq?tq.position.y:1.36)-D.h/2,R=K.root,lr=.011*sz;
 const shell=(len,r0,r1,jagA)=>{if(ST.box){const g=new T.BoxGeometry(r0*2,len,r0*2);g.translate(0,-len/2,0);return g}return dmShell(len,r0,r1,jagA)};
 // ---- tronco: gola alta, placa do esterno, placas do abdômen, crista na coluna, linhas do peitoral/esterno/quadril
 const tP=(t,x,b)=>new T.Vector3(x,tBot+t*D.h,ST.box?(b?-1:1)*(D.D/2+.012):lbTorsoZ(D,t,x,b));
 lbLine(R,[tP(.86,-D.w*.36),tP(.7,-D.w*.26),tP(.6,-D.w*.08),tP(.6,0)],lr,MT,lines);lbLine(R,[tP(.86,D.w*.36),tP(.7,D.w*.26),tP(.6,D.w*.08),tP(.6,0)],lr,MT,lines);
 lbLine(R,[tP(.6,0),tP(.4,0),tP(.18,0)],lr,MT,lines);lbLine(R,[tP(.18,-D.w*.24),tP(.06,-D.w*.08),tP(0,0)],lr,MT,lines);lbLine(R,[tP(.18,D.w*.24),tP(.06,D.w*.08),tP(0,0)],lr,MT,lines);
 lbLine(R,[tP(.92,0,1),tP(.6,0,1),tP(.2,0,1)],lr,MT,lines);for(const s of[-1,1])lbLine(R,[tP(.88,s*D.w*.08,1),tP(.74,s*D.w*.26,1),tP(.55,s*D.w*.2,1)],lr,MT,lines);
 if(ST.mus)for(const s of[-1,1])lbLine(R,[tP(.42,s*D.w*.14),tP(.3,s*D.w*.16),tP(.18,s*D.w*.14)],lr*.8,MT,lines);
 {const st=new T.Mesh(hbG('lbStern',()=>{const g=new T.ConeGeometry(1,1,4);g.rotateX(Math.PI);return g}),MT.plate);st.scale.set(D.w*.07,D.h*.2,.02);st.position.copy(tP(.68,0)).add(new T.Vector3(0,0,.01));add(st,R,'torso');
  const sg=new T.Mesh(hbG('lbSig',()=>{const s=new T.Shape();for(let k=0;k<10;k++){const a=k/10*Math.PI*2,r=k%2?.4:1;s[k?'lineTo':'moveTo'](Math.sin(a)*r,Math.cos(a)*r)}return new T.ShapeGeometry(s)}),MT.glow);sg.scale.setScalar(D.w*.055*sz);sg.position.copy(tP(.72,0)).add(new T.Vector3(0,0,.022));add(sg,R,'torso')}
 for(let r=0;r<3;r++)for(const s of[-1,1]){const ab=new T.Mesh(hbG('lbAb',()=>new T.SphereGeometry(1,8,6)),MT.plate);ab.scale.set(D.w*.075,D.h*.045,.018);ab.position.copy(tP(.42-r*.11,s*D.w*.085));add(ab,R,'torso')}
 for(let k=0;k<5;k++){const sp=new T.Mesh(hbG('lbSpine',()=>{const g=new T.ConeGeometry(1,1,4);g.translate(0,.5,0);return g}),MT.plate);const t=.9-k*.15;sp.scale.set(.022*sz,.07*sz*(1-k*.12),.022*sz);sp.position.copy(tP(t,0,1));sp.rotation.x=-1.9;add(sp,R,'back')}
 for(const s of[-1,1]){const cl=new T.Mesh(hbG('lbCollar',()=>new T.SphereGeometry(1,10,6,0,Math.PI,0,Math.PI/2)),MT.plate);cl.scale.set(D.w*.17,D.h*.2*sz,D.D*.42);cl.position.set(s*D.w*.15,tBot+D.h*.93,-.01);cl.rotation.set(0,s*Math.PI/2,s*.15);add(cl,R,'torso')}
 // ---- braços: ombreira facetada, linha lateral, manopla com aleta no cotovelo, anel no punho e 4 garras
 K.arms.forEach((a,i)=>{const s=i?1:-1,u=M.ua[i],f=M.fa[i];
  const pl=new T.Mesh(hbG('lbPaul',()=>new T.SphereGeometry(1,9,6,0,Math.PI*2,0,1.3)),MT.plate);pl.scale.set(u.r*1.45,u.r*1.1,u.r*1.4);pl.position.set(s*u.r*.08,u.r*.25,0);pl.rotation.z=-s*.25;add(pl,a[0]);
  for(let k=0;k<2;k++){const sp=new T.Mesh(hbG('lbSpk',()=>{const g=new T.ConeGeometry(1,1,5);g.translate(0,.5,0);return g}),MT.plate);sp.scale.set(u.r*.18,u.r*(ST.chibi?.5:.9)*(1-k*.3),u.r*.18);sp.position.set(s*u.r*(.55+k*.3),u.r*(.85-k*.25),-u.r*.1);sp.rotation.z=-s*(.55+k*.35);add(sp,a[0])}
  lbLine(a[0],lbLimbPts(u.len,u.r,u.r*.92,s*Math.PI/2,.12,.95,6),lr,MT,lines);
  if(a[1]&&f){add(new T.Mesh(shell(f.len*.62,f.r*1.13,f.r*1.02,.02),MT.plate),a[1]).position.y=-f.len*.3;
   const fin=new T.Mesh(hbG('lbFin',()=>{const g=new T.ConeGeometry(1,1,4);g.scale(1,1,.35);g.translate(0,.5,0);return g}),MT.plate);fin.scale.set(f.r*.5,f.r*(ST.chibi?1:1.9),f.r*.5);fin.position.set(0,-f.len*.15,-f.r*.9);fin.rotation.x=-2.5;add(fin,a[1]);
   lbLine(a[1],lbLimbPts(f.len,f.r*1.13,f.r*1.03,Math.PI,.12,.9,6),lr,MT,lines);
   {const rg=new T.Mesh(new T.TorusGeometry(f.r*1.12,lr*1.2,5,18),MT.glow);rg.rotation.x=Math.PI/2;rg.position.y=-f.len*.93;add(rg,a[1])}
   for(let k=0;k<4;k++){const cw=new T.Mesh(hbG('lbClaw',()=>{const g=new T.ConeGeometry(1,1,5);g.translate(0,-.5,0);return g}),MT.bone);cw.scale.set(f.r*.13,f.r*(ST.chibi?.6:1),f.r*.13);cw.position.set((k-1.5)*f.r*.42,f.minY+f.r*.15,f.r*.32);cw.rotation.x=.5;add(cw,a[1])}}});
 // ---- pernas: protetor de quadril, linha frontal da coxa, joelheira com esporão, greva, linha da canela, anel no tornozelo, garras nos pés
 K.legs.forEach((l,i)=>{const s=i?1:-1,t=M.th[i],sh=M.sh[i];
  const hg=new T.Mesh(hbG('lbHip',()=>new T.SphereGeometry(1,8,6,0,Math.PI,0,Math.PI*.7)),MT.plate);hg.scale.set(t.r*1.25,t.r*1.6,t.r*1.25);hg.rotation.set(0,s*Math.PI/2,0);hg.position.set(s*t.r*.2,t.r*.1,0);add(hg,l[0],'back');
  lbLine(l[0],lbLimbPts(t.len,t.r,t.r*.85,0,.15,.9,6),lr,MT,lines);
  if(l[1]&&sh){const kn=new T.Mesh(hbG('lbKnee',()=>new T.SphereGeometry(1,8,6,0,Math.PI*2,0,1.2)),MT.plate);kn.scale.set(sh.r*1.15,sh.r*1.1,sh.r*.9);kn.rotation.x=Math.PI/2;kn.position.set(0,0,sh.r*.45);add(kn,l[1],'back');
   const ks=new T.Mesh(hbG('lbSpk'),MT.plate);ks.scale.set(sh.r*.2,sh.r*(ST.chibi?.6:1.1),sh.r*.2);ks.position.set(0,sh.r*.25,sh.r*1);ks.rotation.x=1;add(ks,l[1],'back');
   add(new T.Mesh(shell(sh.len*.55,sh.r*1.14,sh.r*1.04,.02),MT.plate),l[1],'back').position.y=-sh.len*.3;
   lbLine(l[1],lbLimbPts(sh.len,sh.r*1.15,sh.r*1.05,0,.32,.88,5),lr,MT,lines);
   {const rg=new T.Mesh(new T.TorusGeometry(sh.r*1.06,lr*1.2,5,18),MT.glow);rg.rotation.x=Math.PI/2;rg.position.y=-sh.len*.9;add(rg,l[1],'back')}
   for(let k=0;k<3;k++){const tl=new T.Mesh(hbG('lbClaw'),MT.bone);tl.scale.set(sh.r*.14,sh.r*.55,sh.r*.14);tl.rotation.x=-1.45;tl.position.set((k-1)*sh.r*.42,sh.minY+.035,sh.maxZ+.01);add(tl,l[1],'back')}}});
 // ---- cabeça: chifres curvos (proporcionais à cabeça), marcas no rosto, olhos em fenda
 if(head){for(const s of[-1,1]){const hn=new T.Mesh(hrStrand(.3,.05,.62,1.1),MT.plate);const m=hrPlace(new T.Vector3(s*.165,1.97+.13,.03),new T.Vector3(s*.9,.95,-.15));m.decompose(hn.position,hn.quaternion,hn.scale);add(hn,head,'head');
   lbLine(head,[new T.Vector3(s*.075,-.06,.222),new T.Vector3(s*.1,-.12,.205),new T.Vector3(s*.095,-.17,.18)],.0055,MT,lines);}
  lbLine(head,[new T.Vector3(0,.14,.226),new T.Vector3(0,.09,.24)],.006,MT,lines)}
 try{(L.fg?L.fg.children:[]).forEach(o=>{if(o.material===fcMat('pup',0x0a0608)){own.push([o,o.scale.x]);o.scale.x*=.38}})}catch(e){}
 lines.forEach(m=>{m.userData.ds=1;m.userData.stage=m.userData.stage||'torso';m.userData.bs=[1,1,1];F.parts.push(m)});
 // ---- asas articuladas nas escápulas
 const H=L.hTop||2.2,span=H*(ST.chibi?.4:ST.box?.6:.7)*(ST.fat?1.05:1),WG=[];
 for(const s of[-1,1])try{const w=lbWing(span,s,MT,ST);w.g.position.set(s*D.w*.13,tBot+D.h*.8,ST.box?-D.D/2-.04:lbTorsoZ(D,.8,s*D.w*.13,1)-.02);w.g.rotation.set(.1,s*.32,0);add(w.g,R,'back');WG.push(w)}catch(e){}
 const t0=performance.now()/1000;F.anim=t=>{const s=L._an,mv=s?s.mv:0,air=(L===PP?P.y>.3||P.fly>0||P.afly>0:0);const open=Math.min(1,(t-t0)/.8),fold=open*(air?1:Math.max(.35,1-Math.min(1,mv)*.65));const flap=air?Math.sin(t*7)*.45:Math.sin(t*1.6)*.06;WG.forEach(w=>w.upd(fold,flap));
  const g=.75+.25*Math.sin(t*3);MT.halo.opacity=.2+.12*Math.sin(t*3);MT.glow.color.setRGB(1,.14*g,.2*g)};
 // ---- espada da União: lâmina de metal escuro com fio claro e runas em linha (sem rabiscos)
 if(L===PP&&typeof sword!='undefined'&&sword){const bl=sword.children[0];if(bl&&bl.isMesh&&!bl.userData.m0){bl.userData.m0=bl.material;bl.material=new T.MeshPhongMaterial({color:0x17151a,specular:0x8a8090,shininess:80,flatShading:true});const rn=new T.Group();for(let k=0;k<5;k++){const q=new T.Mesh(hbG('lbRune',()=>new T.PlaneGeometry(.035,.12)),MT.glow);q.position.set(0,.35+k*.24,.052);rn.add(q);const q2=q.clone();q2.position.z=-.052;q2.rotation.y=Math.PI;rn.add(q2)}sword.add(rn);own.push(['rune',rn,bl])}}
 if(L.cp){own.push(['cape',L.cp,L.cp.visible]);L.cp.visible=false}
 const d0=F.detach;F.detach=()=>{try{swp.forEach(([o,m])=>o.material=m);own.forEach(x=>{if(x[0]==='cape'){x[1].visible=x[2];return}if(x[0]==='rune'){x[1].parent&&x[1].parent.remove(x[1]);const bl=x[2];if(bl.userData.m0){bl.material.dispose();bl.material=bl.userData.m0;bl.userData.m0=null}}else x[0].scale.x=x[1]});Object.values(MT).forEach(m=>{try{m.dispose()}catch(e){}})}catch(e){}d0()};
 try{if(F.au)F.au.visible=false;if(F.au2)F.au2.material.opacity=.03}catch(e){}
 if(F.skin&&F.skin.reg)DSREG.forEach(k=>F.skin.reg[k]=1);F.lbStyle=ST;return F}

// ================= CORPO ÚNICO "ANIME 3D" (V77) — baseado nas 3 referências =================
// Proporção de anime (~6,5 cabeças): ombros largos (≈2 cabeças), cintura fina, quadril estreito, pernas longas,
// clavícula, peitoral, esterno, costelas e abdômen, trapézio subindo até o pescoço, coxas, joelhos, panturrilhas
// e tornozelos finos; cabeça oval com queixo fino. Os outros tipos de corpo foram retirados (pedido do jogador):
// saves antigos com qualquer corpo passam a usar este automaticamente.
BODIES.length=0;BODIES.push({n:'Anime 3D',d:'Único',t:'Corpo de anime 3D: ombros largos, cintura fina, pernas longas e anatomia definida.',p:{Lf:1.15,W:.9,Hs:.85,det:1},
 s:{hd:{w:.33,h:.37,d:.34,r:.4},nk:{r:.058,h:.1},to:{w:.52,h:.6,d:.29,r:.1,tb:.6},hp:{w:.35,h:.2,d:.26},
  ua:{w:.135,d:.13,l:.33},fa:{w:.11,d:.105,l:.31},hn:{w:.092,h:.125,d:.085},th:{w:.19,d:.18,l:.5},sh:{w:.14,d:.14,l:.46},ft:{w:.12,h:.085,l:.27},lg:.098}});
// perfil do tronco: t = 0 (cintura) → 1 (linha dos ombros). Meia-largura, profundidade da frente e das costas.
function abW(w,tb,t){const wa=w/2*tb;if(t<.12)return wa*(1+.05*(.12-t)*8);if(t<.78){const u=(t-.12)/.66;return wa+(w/2-wa)*Math.pow(Math.sin(u*Math.PI/2),.9)}const u=(t-.78)/.22;return w/2*(1-.12*u*u)}
function abZf(d,t){return d/2*(.82+.1*Math.exp(-Math.pow((t-.2)/.15,2))+.22*Math.exp(-Math.pow((t-.7)/.13,2))-.18*Math.pow(Math.max(0,t-.86)/.14,1.5))}
function abZb(d,t){return d/2*(.92-.12*Math.exp(-Math.pow((t-.22)/.12,2))+.16*Math.exp(-Math.pow((t-.7)/.16,2))-.12*Math.pow(Math.max(0,t-.88)/.12,1.4))}
function abSurf(w,h,d,tb,t,a){// a: ângulo (0 = frente). retorna [x,y,z] com seção "super-elipse" (mais quadrada que um círculo)
 const W=abW(w,tb,t),c=Math.cos(a),s=Math.sin(a),n=2.6,ex=Math.sign(s)*Math.pow(Math.abs(s),2/n),ez=Math.sign(c)*Math.pow(Math.abs(c),2/n);let x=W*ex,z=(ez>=0?abZf(d,t):abZb(d,t))*ez,y=t*h;const ax=Math.abs(x)/w;
 if(ez>0){// peitoral, sulco do esterno, clavícula e abdômen
  z+=.03*Math.exp(-Math.pow((t-.71)/.085,2))*Math.max(0,1-Math.pow((ax-.19)/.15,2));z-=.008*Math.exp(-Math.pow(ax/.03,2))*Math.exp(-Math.pow((t-.68)/.16,2));
  z+=.006*Math.exp(-Math.pow((t-.93)/.025,2))*Math.max(0,1-Math.pow((ax-.17)/.14,2));for(const r of[.47,.38,.29])z+=.006*Math.exp(-Math.pow((t-r)/.025,2))*Math.max(0,1-Math.pow((ax-.05)/.06,2))}
 else{z-=.012*Math.exp(-Math.pow((t-.7)/.1,2))*Math.max(0,1-Math.pow((ax-.15)/.12,2));z+=.006*Math.exp(-Math.pow(ax/.025,2))*(t>.15&&t<.85?1:0)}
 if(t>.84)y+=.075*h*Math.pow((t-.84)/.16,1.2)*Math.max(0,1-Math.pow(ax/.3,2));// trapézio subindo até o pescoço
 return[x,y,z]}
function abTorso(w,h,d,tb){return hbG('abT'+[w,h,d,tb].join('_'),()=>{const R=20,S=28,pos=[],uv=[],idx=[];for(let i=0;i<=R;i++){const t=i/R;for(let j=0;j<=S;j++){const a=j/S*Math.PI*2;const p=abSurf(w,h,d,tb,t,a);pos.push(p[0],p[1],p[2]);uv.push(j/S,t)}}
 for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=i*(S+1)+j,b=a+1,c=a+S+1,e=c+1;idx.push(a,b,c,b,e,c)}const top=pos.length/3;pos.push(0,h*1.07,0);uv.push(.5,1);for(let j=0;j<S;j++)idx.push(R*(S+1)+j,R*(S+1)+j+1,top);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g})}
// pelve: da virilha (V) até a cintura, glúteos atrás
function abPelvis(hw,h,d,wa){return hbG('abP'+[hw,h,d,wa].join('_'),()=>{const R=10,S=28,pos=[],uv=[],idx=[];for(let i=0;i<=R;i++){const t=i/R;const W=hw*(.86+.14*Math.sin(t*Math.PI*.8))*(1-t)+wa*t*(1+.04*(1-t));for(let j=0;j<=S;j++){const a=j/S*Math.PI*2,c=Math.cos(a),s=Math.sin(a),ex=Math.sign(s)*Math.pow(Math.abs(s),.8),ez=Math.sign(c)*Math.pow(Math.abs(c),.8);
  let x=W*ex,z=d/2*ez*(ez>0?.9:1.05+.12*Math.sin(t*Math.PI)),y=(t-.5)*h;if(ez>0&&t<.5)y+=Math.abs(x)/hw*h*.35*(1-t*2);pos.push(x,y,z);uv.push(j/S,t)}}
 for(let i=0;i<R;i++)for(let j=0;j<S;j++){const a=i*(S+1)+j,b=a+1,c=a+S+1,e=c+1;idx.push(a,b,c,b,e,c)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g})}
// cabeça oval de anime: crânio arredondado atrás, maçãs do rosto, mandíbula em V até um queixo fino
function abHead(){return hbG('abHead',()=>{const g=new T.SphereGeometry(.25,32,24),p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=y/.25;
  if(t<0){const k=-t;x*=1-.5*Math.pow(k,1.35);if(z>0){z*=1-.05*k;z+=.03*Math.pow(k,1.5)}else z*=1-.3*k;y*=1+.2*k}else{y*=1.06;if(z<0)z*=1.08}
  if(z>.15&&t>-.15&&t<.3)z-=.01;if(t>-.25&&t<.05&&Math.abs(x)>.17)x*=1.02;p.setXYZ(i,x,y+.008,z)}g.computeVertexNormals();return g})}
// pé calçado: calcanhar, arco e bico afinando (sem bloco)
function abShoe(w,h,l){return hbG('abShoe'+[w,h,l].join('_'),()=>{const sph=hbG('hbSph',()=>new T.SphereGeometry(1,10,8));return hbMerge([[sph,hbMat(0,h*.5,-l*.25,0,0,0,w*.46,h*.62,l*.3)],[sph,hbMat(0,h*.42,l*.12,0,0,0,w*.5,h*.5,l*.42)],[sph,hbMat(0,h*.3,l*.4,0,0,0,w*.42,h*.36,l*.22)],[hbG('hbBox',()=>new T.BoxGeometry(1,1,1)),hbMat(0,h*.05,l*.08,0,0,0,w*.92,h*.1,l*1.02)]])})}
function buildBody3(p,bi){const B=BODIES[0],S=B.s;while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m)}
 const part=(par,geo,mtl,x,y,z,fl,out)=>{const e=new T.Mesh(geo,mtl);e.position.set(x||0,y||0,z||0);e.castShadow=true;if(out!==0){const o=new T.Mesh(geo,olm);o.scale.setScalar(1.03);e.add(o)}if(fl)Object.assign(e.userData,fl);par.add(e);p.bm.push(e);return e};
 const R=p.bR,to=S.to,hp=S.hp,th=S.th,sh=S.sh,ft=S.ft,ua=S.ua,fa=S.fa,hn=S.hn,nk=S.nk,hd=S.hd,sph=hbG('hbSph',()=>new T.SphereGeometry(1,10,8));
 const kneeY=sh.l+ft.h/2,hipY=kneeY+th.l,pelY=hipY+.04,pelTop=pelY+hp.h/2,tBot=pelTop-.05,ty=tBot+to.h/2,tTop=tBot+to.h,tb=to.tb;
 part(R,abPelvis(hp.w/2,hp.h*1.1,hp.d,to.w/2*tb*1.02),p.mP,0,pelY,0,{up:1});
 part(R,abTorso(to.w,to.h,to.d,tb),p.mT,0,tBot,0);
 // pescoço com esternocleidomastoideo (afina levemente para cima) e cabeça
 const nkB=tTop-.04,nkT=nkB+nk.h+.03;part(R,hbLimb(nk.h+.1,nk.r*.92,nk.r*1.15,0,.5,0,12),p.mS,0,nkT+.03,0,null,0);
 const hc=nkT+hd.h*.44;p.hj.position.set(0,hc,0);p.hs.scale.set(hd.w/.48,hd.h/.528,hd.d/.48);part(p.hs,abHead(),p.mS,0,0,0);
 part(p.hs,hbG('nose2',()=>{const g=new T.SphereGeometry(.022,10,8);g.scale(.8,1.1,1);return g}),p.mS,0,-.045,.24,null,0);
 p.hH.scale.set(1,1,1);p.hF.position.z=.045;p.mouth.position.z=.2;p.hOff=hc-1.95;p.hTop=hc+hd.h/2;p.bshape='rb';p.hshape='rb';
 const rt=to.w/2,rbt=rt*tb,avg=(rt+rbt)/2,dep=to.d/2,sx=Math.max(rt/.34,avg/.305),sy=to.h/.6,sz=dep/.238;
 p.tspace.scale.set(sx,sy,sz);p.tspace.position.set(0,ty-1.36*sy,0);p.tq.position.set(0,ty,0);p.pspace.scale.set(hp.w/.6*1.04,1,hp.d/.6*1.12);p.pspace.position.y=pelTop-.06-1.02;
 p.tdim={rt,h:to.h,d:dep,w:to.w,D:to.d,r:Math.max(to.r,.14),tb,ab:1};
 // braços: deltoide → bíceps/tríceps → cotovelo → antebraço afinando no punho → mão de 5 dedos
 const shY=tTop-ua.w*.32,shX=abW(to.w,tb,.95)+ua.w*.12;
 p.arms.forEach((a,i)=>{const s=i?1:-1,S0=a[0],E=a[1];S0.position.set(s*shX,shY,0);
  const dl=part(S0,hbG('abDelt',()=>{const g=new T.SphereGeometry(1,12,10);g.scale(ua.w*.72,ua.w*.66,ua.w*.64);return g}),p.mT,0,-ua.w*.12,0,{sl:1});
  part(S0,hbLimb(ua.l+ua.w*.1,ua.w*.5,ua.w*.36,ua.w*.1,.4,.25),p.mT,0,0,0,{sl:1});
  E.position.set(0,-ua.l,0);part(E,hbG('abElb',()=>{const g=new T.SphereGeometry(1,10,8);g.scale(fa.w*.45,fa.w*.45,fa.w*.45);return g}),p.mS,0,0,0,null,0);
  part(E,hbLimb(fa.l,fa.w*.5,fa.w*.3,fa.w*.08,.22,.05),p.mS,0,0,0);
  part(E,hbHand(hn.w,hn.h,hn.d,s),p.mS,0,-fa.l+.005,0,null,0);for(const c of E.children)if(c.userData.att)c.position.y=-(fa.l+.03)});
 p.attY=-(fa.l+.03);
 // pernas: coxa (quadríceps) → joelho (patela) → panturrilha (atrás) → tornozelo fino → calçado
 p.pb=[];p.legs.forEach((l,i)=>{const s=i?1:-1,H=l[0],Kn=l[1];H.position.set(s*S.lg,hipY,0);Kn.position.set(0,-th.l,0);
  part(H,hbLimb(th.l+th.w*.15,th.w*.6,th.w*.34,th.w*.08,.28,.18),p.mP,0,th.w*.1,0,{up:1});
  part(Kn,hbG('abKnee',()=>{const g=new T.SphereGeometry(1,10,8);g.scale(sh.w*.47,sh.w*.5,sh.w*.5);return g}),p.mP,0,0,.01,{lo:1},0);
  part(Kn,hbLimb(sh.l-ft.h*.2,sh.w*.46,sh.w*.22,sh.w*.14,.25,-.3),p.mP,0,0,0,{lo:1});
  part(Kn,abShoe(ft.w,ft.h*1.25,ft.l),p.mSh,0,-sh.l-ft.h*.2,ft.l*.1);
  if(p.bootS)part(Kn,hbLimb(sh.l*.35,sh.w*.42,sh.w*.4,0,.5,0),p.mSh,0,-sh.l*.64,0,null,0);
  const b=part(Kn,hbLimb(sh.l*.62,sh.w*.5,sh.w*.44,0,.5,0),p.mSh,0,-sh.l*.36,0);b.visible=false;p.pb.push(b)});
 p.root.scale.setScalar(p.h0);p.bodyI=0}
buildBody=function(p,bi){try{return buildBody3(p,0)}catch(e){if(!buildBody.w){buildBody.w=1;console.warn('corpo anime indisponível, usando o anterior: '+(e&&e.message))}while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m)}try{return buildBody2(p,0)}catch(e2){while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m)}return _buildBody0(p,0)}}};
// linhas de energia da União seguem a superfície real deste tronco
lbTorsoZ=function(D,t,x,back){const w=D.w,tb=D.tb||.72,h=D.h,d=D.D;let best=null,bd=1e9;for(let k=0;k<=40;k++){const a=back?Math.PI+(k/40-.5)*Math.PI:(k/40-.5)*Math.PI,p=abSurf(w,h,d,tb,t,a),e=Math.abs(p[0]-x);if(e<bd){bd=e;best=p}}return(best?best[2]:0)+(back?-.012:.012)};

// customização: corpo é sempre o único (saves antigos com outro corpo não quebram a tela)
const _czColor0=czColor;czColor=function(k,v){if(k==='body')v=0;return _czColor0(k,v)};
const _czRender0=czRender;czRender=function(){try{if(P.look)P.look.body=0}catch(e){}return _czRender0()};

