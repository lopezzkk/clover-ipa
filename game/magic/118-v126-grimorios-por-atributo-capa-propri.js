// ================= V126 · GRIMÓRIOS POR ATRIBUTO: capa própria, símbolos, páginas com runas, levitar, abrir/fechar e reagir às magias =================
// O grimório de Anti-Magia continua com o modelo enviado pelo jogador (capa do trevo de cinco folhas); os outros ganham um modelo novo.
(function(){
const X=window.X124||{};const G={id:null,m:null,vis:false,open:0,want:.22,pulse:0,flip:[],n0:0,tex:{}};window.G126=G;
const SKIP={anti:1,nenhum:1};
const hex=c=>'#'+new T.Color(c).getHexString();
const shade=(c,k)=>{const o=new T.Color(c);o.multiplyScalar(k);return '#'+o.getHexString()};
// ---------- símbolos de cada atributo (desenhados no centro da capa) ----------
function sym(x,id,c,s){x.save();x.translate(c,c*1.1);x.strokeStyle='#e8c766';x.fillStyle='#e8c766';x.lineWidth=s*.05;x.lineJoin='round';x.lineCap='round';const r=s*.28;
 const P=(pts,fill)=>{x.beginPath();pts.forEach((p,i)=>i?x.lineTo(p[0]*r,p[1]*r):x.moveTo(p[0]*r,p[1]*r));fill?x.fill():x.stroke()};
 const circ=(rr,fill)=>{x.beginPath();x.arc(0,0,rr*r,0,6.283);fill?x.fill():x.stroke()};
 if(id=='fogo'){x.beginPath();x.moveTo(0,-r);x.bezierCurveTo(r*.7,-r*.3,r*.7,r*.6,0,r*.9);x.bezierCurveTo(-r*.7,r*.6,-r*.6,-r*.1,-r*.15,-r*.2);x.bezierCurveTo(-r*.1,r*.2,r*.2,r*.1,0,-r);x.fill()}
 else if(id=='agua'){x.beginPath();x.moveTo(0,-r);x.bezierCurveTo(r*.9,r*.1,r*.6,r*.95,0,r*.95);x.bezierCurveTo(-r*.6,r*.95,-r*.9,r*.1,0,-r);x.stroke();P([[-.4,.5],[-.1,.3],[.2,.5],[.45,.3]])}
 else if(id=='vento'){for(let k=0;k<3;k++){x.beginPath();x.arc(0,0,r*(.35+k*.25),k*1.2,k*1.2+4);x.stroke()}}
 else if(id=='luz'){circ(.35,1);for(let k=0;k<12;k++){const a=k/12*6.283,l=k%2?.75:.95;P([[Math.cos(a)*.48,Math.sin(a)*.48],[Math.cos(a)*l,Math.sin(a)*l]])}}
 else if(id=='tempo'){circ(.9);circ(.78);for(let k=0;k<12;k++){const a=k/12*6.283;P([[Math.cos(a)*.66,Math.sin(a)*.66],[Math.cos(a)*.78,Math.sin(a)*.78]])}P([[0,0],[0,-.6]]);P([[0,0],[.4,.15]]);circ(.08,1)}
 else if(id=='raio'){P([[.15,-1],[-.4,.05],[.05,.05],[-.25,1],[.5,-.2],[0,-.2],[.35,-1]],1)}
 else if(id=='sombra'){x.beginPath();x.arc(0,0,r*.85,.6,5.7);x.arc(r*.35,0,r*.7,5.2,1.1,true);x.fill();x.fillStyle=shade(0x9a40ff,1);x.beginPath();x.ellipse(-r*.2,0,r*.18,r*.1,0,0,6.283);x.fill()}
 else if(id=='sangue'){x.beginPath();x.moveTo(0,-r);x.bezierCurveTo(r*.8,0,r*.55,r*.9,0,r*.9);x.bezierCurveTo(-r*.55,r*.9,-r*.8,0,0,-r);x.fill();P([[-.9,.9],[-.5,.5]]);P([[.9,.9],[.5,.5]])}
 else if(id=='kotodama'){x.font='bold '+(r*1.3)+'px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('言',0,0)}
 else if(id=='sonhos'){x.beginPath();x.arc(0,0,r*.8,.8,5.5);x.arc(r*.35,-r*.1,r*.62,4.9,1.3,true);x.fill();for(const p of[[.6,-.6],[.75,.3],[.2,-.95]]){x.beginPath();x.arc(p[0]*r,p[1]*r,r*.08,0,6.283);x.fill()}}
 else if(id=='espacial'||id=='bzesp'){for(let k=0;k<4;k++){x.beginPath();x.ellipse(0,0,r*(.25+k*.2),r*(.12+k*.2),k*.6,0,6.283);x.stroke()}circ(.1,1)}
 else{circ(.6);P([[0,-.6],[0,.6]]);P([[-.6,0],[.6,0]])}
 x.restore()}
function clover(x,c,y,l,s){x.save();x.translate(c,y);x.fillStyle='#e8c766';const r=s*.045;for(let k=0;k<l;k++){const a=k/l*6.283-1.57;x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,r*.85,0,6.283);x.fill()}x.fillRect(-r*.15,r*.5,r*.3,r*1.6);x.restore()}
function coverTex(id){const k='c'+id;if(G.tex[k])return G.tex[k];const g=GR[id]||{c:0x666666,l:3};const W=256,H=340,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 const base=id=='raio'?0x8fe6ea:g.c,gr=x.createLinearGradient(0,0,W,H);gr.addColorStop(0,shade(base,1.05));gr.addColorStop(1,shade(base,.62));x.fillStyle=gr;x.fillRect(0,0,W,H);
 // textura de couro
 for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,'+(Math.random()*.06)+')';x.fillRect(Math.random()*W,Math.random()*H,2,2)}
 x.strokeStyle='#e8c766';x.lineWidth=5;x.strokeRect(12,12,W-24,H-24);x.lineWidth=2;x.strokeRect(22,22,W-44,H-44);
 // cantos ornamentados
 for(const [cx,cy,sx,sy] of[[22,22,1,1],[W-22,22,-1,1],[22,H-22,1,-1],[W-22,H-22,-1,-1]]){x.beginPath();x.moveTo(cx,cy+sy*34);x.quadraticCurveTo(cx,cy,cx+sx*34,cy);x.moveTo(cx+sx*8,cy+sy*20);x.quadraticCurveTo(cx+sx*10,cy+sy*10,cx+sx*20,cy+sy*8);x.stroke()}
 // Relâmpago: arabescos de vinha (estilo próprio) e raios dourados nas bordas
 if(id=='raio'){x.strokeStyle='rgba(30,90,110,.55)';x.lineWidth=2;for(let k=0;k<9;k++){const y0=40+k*32;x.beginPath();x.moveTo(36,y0);x.bezierCurveTo(70,y0-18,100,y0+18,128,y0);x.bezierCurveTo(156,y0-18,186,y0+18,220,y0);x.stroke();x.beginPath();x.arc(80+(k%2)*96,y0+6,6,0,6.283);x.stroke()}
  x.fillStyle='#f2d36b';for(const sx of[30,W-30]){for(let k=0;k<5;k++){const y=50+k*58;x.beginPath();x.moveTo(sx+4,y);x.lineTo(sx-5,y+16);x.lineTo(sx+1,y+16);x.lineTo(sx-4,y+30);x.lineTo(sx+6,y+12);x.lineTo(sx,y+12);x.lineTo(sx+6,y);x.fill()}}}
 // medalhão central com o trevo (estilo grimório, desenho próprio) e o símbolo do elemento no alto
 {const cx=W/2,cy=H*.54,R=W*.27;const rg=x.createRadialGradient(cx,cy,R*.2,cx,cy,R);rg.addColorStop(0,'rgba(255,240,190,.35)');rg.addColorStop(1,'rgba(0,0,0,.18)');x.fillStyle=rg;x.beginPath();x.arc(cx,cy,R,0,6.283);x.fill();
  x.strokeStyle='#e8c766';x.lineWidth=4;x.beginPath();x.arc(cx,cy,R,0,6.283);x.stroke();x.lineWidth=1.5;x.beginPath();x.arc(cx,cy,R-8,0,6.283);x.stroke();
  for(let i=0;i<16;i++){const a=i/16*6.283;x.beginPath();x.moveTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);x.lineTo(cx+Math.cos(a)*(R+9),cy+Math.sin(a)*(R+9));x.stroke()}
  for(const sd of[-1,1]){x.beginPath();x.moveTo(cx+sd*R*.3,cy-R-4);x.bezierCurveTo(cx+sd*R*.9,cy-R-30,cx+sd*R*1.4,cy-R*.4,cx+sd*R*1.25,cy);x.bezierCurveTo(cx+sd*R*1.4,cy+R*.4,cx+sd*R*.9,cy+R+30,cx+sd*R*.3,cy+R+4);x.stroke()}
  x.save();x.translate(cx,cy);x.fillStyle='#f0cf6a';x.strokeStyle='#7a5a14';x.lineWidth=2;const l=g.l||3,r=R*.33;for(let k=0;k<l;k++){const a=k/l*6.283-1.57;x.save();x.rotate(a+1.57);x.beginPath();x.moveTo(0,0);x.bezierCurveTo(-r*1.25,-r*.55,-r*.9,-r*2.05,0,-r*1.35);x.bezierCurveTo(r*.9,-r*2.05,r*1.25,-r*.55,0,0);x.fill();x.stroke();x.restore()}
  x.beginPath();x.moveTo(0,r*.2);x.quadraticCurveTo(r*.25,r*1.1,r*.05,r*1.7);x.lineWidth=5;x.strokeStyle='#f0cf6a';x.stroke();x.restore()}
 x.save();x.translate(0,-95);sym(x,id,W/2,W*.42);x.restore();
 const t=new T.CanvasTexture(cv);t._keep=1;return G.tex[k]=t}
function pageTex(id,col){const k='p'+id;if(G.tex[k])return G.tex[k];const W=256,H=320,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');x.fillStyle='#efe4c8';x.fillRect(0,0,W,H);
 const c=hex(col);x.strokeStyle=c;x.fillStyle=c;x.globalAlpha=.85;x.lineWidth=3;x.beginPath();x.arc(W/2,H*.38,62,0,6.283);x.stroke();x.lineWidth=1.5;x.beginPath();x.arc(W/2,H*.38,50,0,6.283);x.stroke();
 for(let i=0;i<8;i++){const a=i/8*6.283;x.beginPath();x.moveTo(W/2+Math.cos(a)*50,H*.38+Math.sin(a)*50);x.lineTo(W/2+Math.cos(a+2.36)*50,H*.38+Math.sin(a+2.36)*50);x.stroke()}
 x.globalAlpha=.6;x.font='16px serif';const G2='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ';for(let r=0;r<7;r++){let s='';for(let i=0;i<14;i++)s+=G2[Math.floor(Math.random()*G2.length)];x.fillText(s,24,H*.62+r*18)}
 const t=new T.CanvasTexture(cv);t._keep=1;return G.tex[k]=t}
function runeTex(){if(G.tex.r)return G.tex.r;const W=256,cv=document.createElement('canvas');cv.width=cv.height=W;const x=cv.getContext('2d');x.strokeStyle='#fff';x.fillStyle='#fff';x.lineWidth=4;x.beginPath();x.arc(128,128,118,0,6.283);x.stroke();x.lineWidth=2;x.beginPath();x.arc(128,128,96,0,6.283);x.stroke();
 x.font='20px serif';x.textAlign='center';x.textBaseline='middle';const G2='ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒ';for(let i=0;i<18;i++){const a=i/18*6.283;x.save();x.translate(128+Math.cos(a)*107,128+Math.sin(a)*107);x.rotate(a+1.57);x.fillText(G2[i],0,0);x.restore()}
 for(let i=0;i<6;i++){const a=i/6*6.283;x.beginPath();x.moveTo(128+Math.cos(a)*96,128+Math.sin(a)*96);x.lineTo(128+Math.cos(a+2.09)*96,128+Math.sin(a+2.09)*96);x.stroke()}const t=new T.CanvasTexture(cv);t._keep=1;return G.tex.r=t}
// ---------- modelo ----------
function build(id){const g=GR[id]||{c:0x888888};const col=(()=>{try{return XIC(id)}catch(e){return g.c}})();const root=new T.Group();
 const cvM=new T.MeshLambertMaterial({map:coverTex(id)}),edge=new T.MeshLambertMaterial({color:new T.Color(id=='raio'?0x8fe6ea:g.c).multiplyScalar(.55)}),inner=new T.MeshLambertMaterial({color:new T.Color(id=='raio'?0x8fe6ea:g.c).multiplyScalar(.35)}),gold=new T.MeshLambertMaterial({color:0xd8b24a}),pgM=new T.MeshLambertMaterial({color:0xe9dcbc}),runeM=new T.MeshBasicMaterial({map:pageTex(id,col)});
 const covers=[];for(const s of[-1,1]){const hinge=new T.Group();const cb=new T.Mesh(new T.BoxGeometry(.36,.03,.48),[edge,edge,inner,cvM,edge,edge]);cb.position.x=s*.18;hinge.add(cb);
  const block=new T.Mesh(new T.BoxGeometry(.32,.07,.44),pgM);block.position.set(s*.165,.05,0);hinge.add(block);const top=new T.Mesh(new T.PlaneGeometry(.31,.43),runeM);top.rotation.x=-Math.PI/2;top.position.set(s*.165,.086,0);if(s<0)top.rotation.z=Math.PI;hinge.add(top);
  for(const z of[-.21,.21]){const c=new T.Mesh(new T.BoxGeometry(.06,.035,.06),gold);c.position.set(s*.33,0,z);hinge.add(c)}covers.push({h:hinge,s});root.add(hinge)}
 const spine=new T.Mesh(new T.CylinderGeometry(.03,.03,.5,10),edge);spine.rotation.x=Math.PI/2;root.add(spine);for(const z of[-.16,0,.16]){const r=new T.Mesh(new T.TorusGeometry(.032,.006,4,12),gold);r.position.z=z;root.add(r)}
 // páginas que viram (pivô na lombada)
 const flips=[];for(let k=0;k<3;k++){const pv=new T.Group(),p=new T.Mesh(new T.PlaneGeometry(.3,.42),new T.MeshLambertMaterial({color:0xf4ead2,side:T.DoubleSide}));p.rotation.x=-Math.PI/2;p.position.x=.155;pv.add(p);pv.position.y=.075;pv.visible=false;root.add(pv);flips.push(pv)}
 const glow=X.glow?X.glow(col,.9,.0):new T.Object3D();glow.position.y=.25;root.add(glow);
 const ring=new T.Mesh(new T.PlaneGeometry(.9,.9),new T.MeshBasicMaterial({map:runeTex(),color:col,transparent:true,opacity:0,blending:T.AdditiveBlending,depthWrite:false,side:T.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.y=.35;root.add(ring);
 root.userData={covers,flips,glow,ring,runeM,col};return root}
function setOpen(m,a){for(const c of m.userData.covers)c.h.rotation.z=c.s*a}
function ensure(){if(typeof book=='undefined'||!book)return null;const id=P.g&&P.g.id;if(!id||SKIP[id]){if(G.m){G.m.visible=false;book.children.forEach(c=>{if(c!==G.m&&c!==(window.GB100&&GB100.m))c.visible=true})}G.id=id;return null}
 if(G.id!==id||!G.m){if(G.m){book.remove(G.m)}G.m=build(id);book.add(G.m);G.id=id;G.open=1.4;G.want=.22}
 G.m.visible=true;book.children.forEach(c=>{if(c!==G.m)c.visible=false});try{if(book.userData.gl)book.userData.gl.visible=false}catch(e){}return G.m}
let lastVis=false,lastCast=-1;
function tick(dt){const m=ensure();if(!m)return;const U=m.userData;const vis=book.visible;
 // ao aparecer: começa fechado e abre
 if(vis&&!lastVis){G.open=1.45;G.pulse=0;try{X.snd&&X.snd('wing',.25)}catch(e){}}lastVis=vis;if(!vis)return;
 // reage às magias: abre bem, vira páginas, brilha e gira o círculo de runas
 const cn=(MP&&MP.castN)||0;if(lastCast<0)lastCast=cn;if(cn!==lastCast){lastCast=cn;G.pulse=1;U.flips.forEach((f,i)=>{f.userData.t=-i*.09;f.visible=true})}
 const t=performance.now()/1000;G.want=G.pulse>0?.02:.24+Math.sin(t*1.3)*.04;G.open+=(G.want-G.open)*Math.min(1,dt*(G.pulse>0?14:4));setOpen(m,G.open);
 U.flips.forEach(f=>{if(!f.visible)return;f.userData.t+=dt;const u=Math.max(0,f.userData.t)/.32;if(u>=1){f.visible=false;return}f.rotation.z=-(1-u)*2.9+.1;f.children[0].position.y=Math.sin(u*Math.PI)*.03});
 const col=(()=>{try{return XIC(G.id)}catch(e){return U.col}})();if(U.col!==col){U.col=col;try{U.glow.material.color.setHex(col);U.ring.material.color.setHex(col)}catch(e){}}
 if(G.pulse>0){G.pulse-=dt*1.25;const p=Math.max(0,G.pulse);try{U.glow.material.opacity=.9*p;U.glow.scale.setScalar(.6+(1-p)*1.4)}catch(e){}U.ring.material.opacity=.85*p;U.ring.rotation.z+=dt*5;U.ring.scale.setScalar(1+(1-p)*.8);const e=Math.sin(Math.min(1,(1-p)*3)*1.57)*(p>.15?1:p/.15);m.position.y=.5*e;m.scale.setScalar(1+.35*e);
  if(Math.random()<.5&&CFG.parts){const wp=new T.Vector3();m.getWorldPosition(wp);fxp({x:wp.x+(Math.random()-.5)*.4,y:wp.y+.1,z:wp.z+(Math.random()-.5)*.4,c:col,n:1,sp:1.2,sz:.07,life:.4,up:2})}}
 else{try{U.glow.material.opacity=.12+Math.sin(t*2)*.05}catch(e){}U.ring.material.opacity=0;m.position.y=.05+Math.sin(t*2.2)*.02;m.scale.setScalar(1)}}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{tick(dt||0)}catch(e){try{ERR122(e)}catch(_){}}return r}}
})();

