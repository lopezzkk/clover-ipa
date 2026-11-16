// ================= CABELO EM MECHAS + CAPA DE TECIDO (V76) =================
// cada penteado é feito de mechas 3D afinando até a ponta (corte achatado, curvadas pela gravidade),
// presas a um couro cabeludo que acompanha o formato da cabeça. Tudo vira uma malha só (leve no celular).
const HC=new T.Vector3(0,1.97,0),_hY=new T.Vector3(0,1,0),_hq=new T.Quaternion(),_hq2=new T.Quaternion(),_hv=new T.Vector3(),_hv2=new T.Vector3();
function hrStrand(len,r,bend,flat){const k='hs'+[len,r,bend,flat].map(v=>(+v).toFixed(3)).join('_');return hbG(k,()=>{const N=6,S=5,pos=[],idx=[];
 for(let i=0;i<=N;i++){const t=i/N,cy=t*len,cz=bend*t*t*len,rr=r*Math.pow(1-t*.94,.85);for(let j=0;j<S;j++){const a=j/S*Math.PI*2;pos.push(Math.cos(a)*rr*flat,cy,cz+Math.sin(a)*rr)}}
 const tip=pos.length/3;pos.push(0,len*1.04,bend*len*1.06);const base=tip+1;pos.push(0,-.01,0);
 for(let i=0;i<N;i++)for(let j=0;j<S;j++){const a=i*S+j,b=i*S+(j+1)%S,c=a+S,d=b+S;idx.push(a,c,b,b,c,d)}for(let j=0;j<S;j++){idx.push(N*S+j,tip,N*S+(j+1)%S);idx.push(j,(j+1)%S,base)}
 const col=[];for(let i=0;i<pos.length;i+=3){const t=Math.max(0,Math.min(1,pos[i+1]/len)),k=t<.55?0:Math.pow((t-.55)/.45,1.4);col.push(.06+(.95-.06)*k,.03+(.12-.03)*k,.035+(.16-.035)*k)}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('color',new T.Float32BufferAttribute(col,3));g.setIndex(idx);g.computeVertexNormals();return g})}
// matriz que coloca a mecha na raiz `root`, apontando para `dir`, curvando para "baixo" (gravidade)
function hrPlace(root,dir,sc){const d=_hv.copy(dir).normalize();_hq.setFromUnitVectors(_hY,d);const z=new T.Vector3(0,0,1).applyQuaternion(_hq);const g=new T.Vector3(0,-1,0);g.sub(d.clone().multiplyScalar(g.dot(d)));
 if(g.lengthSq()>1e-4){g.normalize();let a=Math.acos(Math.max(-1,Math.min(1,z.dot(g))));if(new T.Vector3().crossVectors(z,g).dot(d)<0)a=-a;_hq2.setFromAxisAngle(d,a);_hq.premultiply(_hq2)}
 return new T.Matrix4().compose(root.clone().sub(HC),_hq.clone(),new T.Vector3(sc||1,sc||1,sc||1))}
function hrDir(th,ph){return new T.Vector3(Math.sin(th)*Math.sin(ph),Math.cos(th),Math.sin(th)*Math.cos(ph))}
function hrRoot(th,ph,R){return hrDir(th,ph).multiplyScalar(R||.25).add(HC)}
const D2R=Math.PI/180;
function hrCap(L,full){const g=hbG('hrCap'+(full?1:0),()=>{const q=new T.SphereGeometry(.262,24,16,0,Math.PI*2,0,Math.PI*(full?.66:.56));q.rotateX(-.42);q.translate(0,.005,-.012);return q});L.push([g,null])}
function hrMesh(p,g,L,flow){const geo=hbMerge(L.length?L:[[hbG('hrNone',()=>new T.BufferGeometry().setFromPoints([new T.Vector3()])),null]]);const m=new T.Mesh(geo,p.mH);m.position.copy(HC);m.castShadow=true;const o=new T.Mesh(geo,olm);o.scale.setScalar(1.025);m.add(o);m.userData.fu=1;m.userData.hair=1;g.add(m);if(flow)p.hFlow=m;return m}
function hrBangs(L,n,len,spread){for(let i=0;i<n;i++){const u=n==1?0:i/(n-1)-.5,ph=u*spread*D2R,th=(40+Math.abs(u)*22)*D2R,root=hrRoot(th,ph,.25),d=new T.Vector3(Math.sin(ph)*.5,-.75,.62+Math.cos(ph)*.1);L.push([hrStrand(len*.7*(1-Math.abs(u)*.3),.05,-.35,1.7),hrPlace(root,d)])}}
function hrSides(L,len){for(const s of[-1,1]){const root=hrRoot(78*D2R,s*82*D2R,.245);L.push([hrStrand(len,.045,.05,1.4),hrPlace(root,new T.Vector3(s*.12,-1,.08))])}}
const HAIRB=[
 // 0 Espetado: mechas grossas em leque saindo do topo e da nuca + franja pontuda
 (p,g)=>{const L=[];hrCap(L);const rings=[[8,3,.3],[30,6,.33],[55,8,.3],[78,8,.26]];rings.forEach(([th,n,len],ri)=>{for(let k=0;k<n;k++){const ph=(k/n)*Math.PI*2+ri*.4;if(th>45&&Math.cos(ph)>.55)continue;const n0=hrDir(th*D2R,ph),root=hrRoot(th*D2R,ph,.24),d=n0.clone().add(new T.Vector3(0,.55,0)).add(new T.Vector3(0,0,-.25));L.push([hrStrand(len*(.85+((k*37)%10)/40),.075,.22,1.6),hrPlace(root,d)])}});hrBangs(L,5,.2,70);hrSides(L,.16);hrMesh(p,g,L)},
 // 1 Curto: mechas curtas penteadas para trás + franja curta
 (p,g)=>{const L=[];hrCap(L);for(let ri=0;ri<3;ri++)for(let k=0;k<9;k++){const th=(20+ri*25)*D2R,ph=k/9*Math.PI*2+ri*.3;if(ri>0&&Math.cos(ph)>.6)continue;const n0=hrDir(th,ph),root=hrRoot(th,ph,.25),d=n0.clone().multiplyScalar(.35).add(new T.Vector3(0,-.1,-.7));L.push([hrStrand(.11,.05,.3,1.7),hrPlace(root,d)])}hrBangs(L,5,.12,60);hrSides(L,.1);hrMesh(p,g,L)},
 // 2 Longo: cortina de mechas até os ombros + mechas laterais + franja
 (p,g)=>{const L=[];hrCap(L,1);for(let k=0;k<13;k++){const ph=(100+k*13)*D2R,th=(62+(k%3)*8)*D2R,root=hrRoot(th,ph,.25);L.push([hrStrand(.6+(k%4)*.04,.075,.12,1.8),hrPlace(root,new T.Vector3(Math.sin(ph)*.25,-1,Math.cos(ph)*.25-.05))])}
  for(const s of[-1,1])for(let k=0;k<2;k++){const root=hrRoot(70*D2R,s*(70+k*14)*D2R,.25);L.push([hrStrand(.5,.06,.1,1.6),hrPlace(root,new T.Vector3(s*.18,-1,.12-k*.1))])}hrBangs(L,5,.2,70);hrMesh(p,g,L,1)},
 // 3 Rabo de cavalo: cabelo puxado para trás, laço na nuca e rabo de mechas
 (p,g)=>{const L=[];hrCap(L,1);const tie=new T.Vector3(0,2.04,-.27);L.push([hbG('hrTie',()=>new T.TorusGeometry(.05,.022,6,12)),new T.Matrix4().makeTranslation(tie.x,tie.y-HC.y,tie.z)]);for(let k=0;k<7;k++){const a=k/7*Math.PI*2,root=tie.clone().add(new T.Vector3(Math.cos(a)*.03,Math.sin(a)*.03,-.02));L.push([hrStrand(.48,.06,.35,1.5),hrPlace(root,new T.Vector3(Math.cos(a)*.15,-.55,-.8))])}hrBangs(L,3,.16,50);hrSides(L,.18);hrMesh(p,g,L,1)},
 // 4 Moicano: crista de mechas no centro, laterais raspadas
 (p,g)=>{const L=[];L.push([hbG('hrMoh',()=>{const q=new T.SphereGeometry(.258,14,10,0,Math.PI*2,0,1.25);q.scale(.38,1,1);q.rotateX(-.2);return q}),null]);for(let k=0;k<8;k++){const th=(-35+k*16)*D2R,ph=th<0?0:Math.PI,root=hrRoot(Math.abs(th),th<0?0:Math.PI,.25),d=new T.Vector3(0,1,-.35+k*.04);L.push([hrStrand(.26-Math.abs(k-3)*.018,.06,.25,.55),hrPlace(root,d)])}hrMesh(p,g,L)},
 // 5 Bagunçado: mechas médias em várias direções
 (p,g)=>{const L=[];hrCap(L);let sd=7;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};for(let k=0;k<26;k++){const th=(10+rnd()*70)*D2R,ph=rnd()*Math.PI*2;if(th>50*D2R&&Math.cos(ph)>.5)continue;const n0=hrDir(th,ph),root=hrRoot(th,ph,.245),d=n0.clone().add(new T.Vector3((rnd()-.5)*.8,.2,(rnd()-.5)*.8));L.push([hrStrand(.14+rnd()*.1,.06,(rnd()-.5)*.6,1.5),hrPlace(root,d)])}hrBangs(L,5,.17,75);hrSides(L,.14);hrMesh(p,g,L)},
 // 6 Topete: grande mecha frontal que sobe e volta para trás + laterais curtas
 (p,g)=>{const L=[];hrCap(L);for(let k=0;k<5;k++){const ph=(k-2)*16*D2R,root=hrRoot(42*D2R,ph,.25);L.push([hrStrand(.22-Math.abs(k-2)*.025,.09,-.35,1.7),hrPlace(root,new T.Vector3(Math.sin(ph)*.2,.95,.42))])}for(let k=0;k<10;k++){const ph=(60+k*24)*D2R,root=hrRoot(55*D2R,ph,.25);L.push([hrStrand(.1,.05,.3,1.6),hrPlace(root,new T.Vector3(Math.sin(ph)*.3,-.2,Math.cos(ph)*.3-.6))])}hrSides(L,.1);hrMesh(p,g,L)},
 // 7 Careca
 ()=>{}];
HAIRS.forEach((h,i)=>{const old=h.b;if(HAIRB[i])h.b=(p,g)=>{try{HAIRB[i](p,g)}catch(e){while(g.children.length)g.remove(g.children[0]);try{old(p,g)}catch(e2){}}}});
// capa: tecido curvo com dobras que abre na barra e balança ao andar/correr
function capeGeo(w){return hbG('cape'+w.toFixed(3),()=>{const W=.62*w,g=new T.PlaneGeometry(W,1.02,10,12),p=g.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),v=(.51-y)/1.02,u=x/(W/2);
  const nx=x*(1+.28*v),nz=-.015+.09*u*u*(1-v*.6)-.04*v+.025*Math.sin(u*Math.PI*2.5)*v,ny=y+.025*Math.sin(u*9)*v*v;p.setXYZ(i,nx,ny-.51,nz)}g.computeVertexNormals();return g})}
function capeUp(p){const c=p.cp;if(!c||c.userData.cloth)return;c.userData.cloth=1;const w=(c.geometry&&c.geometry.parameters&&c.geometry.parameters.width||.62)/.62;c.geometry=capeGeo(w);c.position.y+=.5;c.position.z-=.01;try{c.material.side=T.DoubleSide;c.children.forEach(o=>{if(o.material===olm)o.visible=false})}catch(e){}}
const _dressUp1=dressUp;dressUp=function(p,L0){_dressUp1(p,L0);try{capeUp(p)}catch(e){}};

// ================= EXPRESSÕES FACIAIS + PISCAR + CAPA QUE BALANÇA (V76) =================
// estados: normal, concentração mágica, ataque, transformação, dano e vitória — sobrancelhas, olhos e boca mudam juntos.
function fxRig(p){if(p._fx)return p._fx;const fg=p.fg;if(!fg||!p.hF)return null;const R={br:[],wh:[],ir:p.eyes||[],md:[]};
 fg.children.forEach(o=>{if(!o.isMesh)return;const gt=o.geometry&&o.geometry.type;if(o.material===p.mH&&gt=='BoxGeometry')R.br.push({o,y:o.position.y,rz:o.rotation.z,s:Math.sign(o.position.x)||1});else if(o.material===p.mW2&&gt=='SphereGeometry'&&o.geometry.parameters.radius>.05)R.wh.push({o,sy:o.scale.y})});
 R.ir=R.ir.map(o=>({o,sy:o.scale.y}));R.ey=[];fg.children.forEach(o=>{if(!o.isMesh||R.br.some(b=>b.o===o)||R.wh.some(w=>w.o===o)||R.ir.some(w=>w.o===o))return;if(Math.abs(Math.abs(o.position.x)-.085)<.03&&o.position.y>1.92&&o.position.y<2.0)R.ey.push({o,y:o.position.y,sy:o.scale.y})});const mk=(geo,c,x,y,z,sx,sy,sz)=>{const m=new T.Mesh(geo,c);m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.visible=false;p.hF.add(m);return m};
 const dark=fcMat('mouthD',0x3a0a0a),teeth=fcMat('teeth',0xf4f0e8),lip=p.mLip||fcMat('lip',0xb8645a);
 R.open=mk(hbG('fxO',()=>new T.SphereGeometry(.03,12,8)),dark,0,-.1,.198,1.25,1.1,.35);
 R.teeth=mk(hbG('fxT',()=>new T.BoxGeometry(.07,.016,.01)),teeth,0,-.092,.206,1,1,1);
 R.smile=mk(hbG('fxS',()=>new T.TorusGeometry(.032,.009,5,14,Math.PI)),lip,0,-.09,.206,1.1,1,1);R.smile.rotation.z=Math.PI;
 R.base=p.mouth;try{fg.children.forEach(o=>{if(o.material===p.mLip)o.scale.set(.9,.22,.35)})}catch(e){}R.bk={t:2+Math.random()*3,on:0};p._fx=R;return R}
function fxState(p){if(p!==PP)return'normal';if(window.FXF)return window.FXF;if(P.dead>0||P.hitf>.05)return'dano';if(P.vic>0)return'vitória';if((P.union||P.nacht||P.zg||POS.on)&&!P.ps)return'transformação';
 if(P.ps){return /^(throw|push|slam|dash|tpunch|spin|upper|tstomp)$/.test(P.ps)?'ataque':'concentração'}return'normal'}
function faceExpr(p,t,dt){const R=fxRig(p);if(!R)return;const st=fxState(p);if(R.st!==st){R.st=st}
 // piscar (só nos estados calmos)
 R.bk.t-=dt;if(R.bk.t<=0){R.bk.on=.13;R.bk.t=2.5+Math.random()*3.5}if(R.bk.on>0)R.bk.on-=dt;const blink=R.bk.on>0&&(st=='normal'||st=='concentração')?.12:1;
 const E={normal:[1,0,0,0,'base'],concentração:[.72,-.012,.22,0,'base'],ataque:[1.05,-.016,.42,0,'open'],transformação:[1.1,-.014,.38,0,'grin'],dano:[.45,-.008,-.3,0,'grim'],vitória:[.35,.014,-.15,0,'smile']}[st];
 R.wh.forEach(w=>w.o.scale.y=w.sy*E[0]*blink);R.ir.forEach(w=>w.o.scale.y=w.sy*Math.min(1,E[0]*1.05)*blink);
 const kk=E[0]*blink;R.ey.forEach(w=>{w.o.position.y=1.958+(w.y-1.958)*kk;w.o.scale.y=w.sy*Math.min(1,kk)});R.br.forEach(b=>{b.o.position.y=b.y+E[1];b.o.rotation.z=b.rz-b.s*E[2]});
 const m=E[4];if(R.base)R.base.visible=m=='base';R.open.visible=m=='open';R.teeth.visible=m=='grin'||m=='grim';R.smile.visible=m=='smile';if(m=='open')R.open.scale.y=1.1+.25*Math.abs(Math.sin(t*14));if(m=='grim'){R.teeth.scale.set(.85,1.4,1)}else R.teeth.scale.set(1,1,1)}
const _animF=anim;anim=function(p,t,mv,air){_animF(p,t,mv,air);const s=p._an;const dt=s&&s._lt2!=null?Math.min(.2,Math.max(0,t-s._lt2)):.016;if(s)s._lt2=t;try{faceExpr(p,t,dt)}catch(e){}
 try{if(p.cp&&p.cp.userData.cloth){const k=Math.min(1.3,s?s.mv:0);p.cp.rotation.x=.05+k*.38+Math.sin(t*2.3)*.025+(air?.35:0)}}catch(e){}
 if(p===PP&&P.vic>0)P.vic-=dt};
// vitória: ao subir de nível, completar missão ou derrotar chefe
const _gainXPv=gainXP;gainXP=function(n){const l0=P.lv;_gainXPv(n);if(P.lv>l0)P.vic=2.5};

// ================= UNIÃO DEMONÍACA INTEGRADA AO CORPO (V76) =================
// 1) a pele e a roupa recebem uma TEXTURA demoníaca própria de cada demônio (rachaduras, runas, glifos)
//    que brilha — as marcas fazem parte do corpo, não são peças coladas;
// 2) no Liebe, revestimento de placas que acompanha as medidas de cada segmento (peitoral, ombreiras,
//    manoplas com garras, grevas com esporões), chifres proporcionais à cabeça, faixa de energia nos olhos,
//    selo no peito e ASAS com estrutura de ossos e membrana rasgada; tudo preso às articulações.
const DTX={};function dtCanvas(n){const c=document.createElement('canvas');c.width=c.height=n;return c}
function dtTex(kind){if(DTX[kind])return DTX[kind];let c;try{c=dtCanvas(256)}catch(e){return null}const x=c.getContext&&c.getContext('2d');if(!x)return null;let sd=kind.length*977;const rnd=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 const bg={liebe_sk:'#170709',liebe_cl:'#0c0507',nacht_sk:'#1a1226',nacht_cl:'#0d0814',zag_sk:'#cfc6dc',zag_cl:'#22103a'}[kind]||'#111',ln={liebe_sk:'#ff2a3c',liebe_cl:'#ff1e30',nacht_sk:'#b070ff',nacht_cl:'#8a50e0',zag_sk:'#9a40ff',zag_cl:'#d080ff'}[kind]||'#f00';
 x.fillStyle=bg;x.fillRect(0,0,256,256);x.strokeStyle=ln;x.lineCap='round';x.shadowColor=ln;x.shadowBlur=6;
 if(kind.startsWith('liebe')){const N=kind.endsWith('sk')?9:5;for(let k=0;k<N;k++){let px=rnd()*256,py=rnd()*256,a=rnd()*6.28;x.lineWidth=kind.endsWith('sk')?2.2:1.6;x.beginPath();x.moveTo(px,py);for(let s=0;s<14;s++){a+=(rnd()-.5)*1.3;px+=Math.cos(a)*12;py+=Math.sin(a)*12;x.lineTo(px,py);if(rnd()<.25){x.moveTo(px,py);const b=a+(rnd()<.5?1:-1)*.9;x.lineTo(px+Math.cos(b)*14,py+Math.sin(b)*14);x.moveTo(px,py)}}x.stroke()}}
 else if(kind.startsWith('nacht')){x.lineWidth=2;for(let k=0;k<7;k++){const y=18+k*36;x.beginPath();for(let s=0;s<=16;s++){const X=s*16,Y=y+Math.sin(s*1.3+k)*6;s?x.lineTo(X,Y):x.moveTo(X,Y)}x.stroke()}for(let k=0;k<10;k++){const cx=rnd()*256,cy=rnd()*256;x.beginPath();x.arc(cx,cy,5,0,6.28);x.moveTo(cx-7,cy);x.lineTo(cx+7,cy);x.stroke()}}
 else{x.lineWidth=1.8;for(let k=0;k<14;k++){const cx=rnd()*256,cy=rnd()*256,r=6+rnd()*8;x.beginPath();x.moveTo(cx,cy-r);x.lineTo(cx+r*.8,cy);x.lineTo(cx,cy+r);x.lineTo(cx-r*.8,cy);x.closePath();x.moveTo(cx,cy-r*1.6);x.lineTo(cx,cy+r*1.6);x.stroke()}}
 const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t._keep=true;DTX[kind]=t;return t}
const DTEX={cur:null};
const DTSET={liebe:{p:'liebe',glow:0xff2a3c},canis:{p:'nacht',glow:0x9a6aff},equus:{p:'nacht',glow:0x8ab0ff},felis:{p:'nacht',glow:0xd8c0ff},gallus:{p:'nacht',glow:0xff4050},quatro:{p:'nacht',glow:0xb070ff},zagred:{p:'zag',glow:0xb06aff}};
const _dsMat0=dsMat;dsMat=function(o,col,em,cache){const m=_dsMat0(o,col,em,cache);const D=DTEX.cur;try{if(D&&m&&m.isMaterial&&!m.userData.tx&&(col===D.sk||col===D.cl)&&('map' in m)){const tx=dtTex(D.p+(col===D.sk?'_sk':'_cl'));if(tx){m.userData.tx=1;m.map=tx;if('emissiveMap' in m){m.emissiveMap=tx;m.emissive.setHex(D.glow);m.emissiveIntensity=.9}m.color.setHex(0xffffff);m.needsUpdate=true}}}catch(e){}return m};
DSK.liebe.hr=0x1a0a10;DSK.liebe.sk=0x200a0e;
