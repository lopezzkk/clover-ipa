// ---------- Novas vilas, estradas e acampamento ----------
function roadSeg(x1,z1,x2,z2,w){const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz),g=new T.Group(),p=mk(new T.PlaneGeometry(w||6,L),0xc9b58a);p.rotation.x=-Math.PI/2;g.add(p);g.rotation.y=Math.atan2(-dx,-dz);g.position.set((x1+x2)/2,.03,(z1+z2)/2);p.receiveShadow=true;S.add(g)}
function signBoard(txt,x,z,ry){const g=new T.Group();let W=3.4,fs=30,cw=256;
 try{const c=document.createElement('canvas'),x2=c.getContext&&c.getContext('2d');if(x2){x2.font='bold 30px Georgia,serif';const tw=x2.measureText(txt).width+28;if(tw>256){W=Math.min(6.4,3.4*tw/256);cw=Math.round(256*W/3.4);if(tw>cw)fs=Math.floor(30*cw/tw)}
  c.width=cw;c.height=64;x2.fillStyle='#8a6a3a';x2.fillRect(0,0,cw,64);x2.fillStyle='#fff3cf';x2.font='bold '+fs+'px Georgia,serif';x2.textAlign='center';x2.textBaseline='middle';x2.fillText(txt,cw/2,34);
  const tx=new T.CanvasTexture(c);for(const sd of[1,-1]){const pl=new T.Mesh(new T.PlaneGeometry(W-.1,.82),new T.MeshBasicMaterial({map:tx}));pl.position.set(0,2.4,sd*.085);if(sd<0)pl.rotation.y=Math.PI;g.add(pl)}}}catch(e){}
 const posts=W>4.2?[-W*.36,W*.36]:[0];for(const px of posts){const po=mk(new T.CylinderGeometry(.12,.12,2,6),0x5a3d22);po.position.set(px,1,0);g.add(po)}
 const bd=mk(new T.BoxGeometry(W,.9,.15),0x8a6a3a,1);bd.position.y=2.4;g.add(bd);
 (window.SIGN83=window.SIGN83||[]).push({x,z,w:W});g.rotation.y=ry||0;put(g,x,z)}
function buildVillage(v,st){const gnd=mk(new T.CircleGeometry(v.r-2,28),st.ground);gnd.rotation.x=-Math.PI/2;gnd.position.set(v.x,.02,v.z);S.add(gnd);
 const toH=Math.atan2(-v.z-4,-v.x),n=st.houses||6;
 for(let i=0;i<n;i++){const a=toH+.5+i/n*(6.2832-1),R2=v.r*.6,x=v.x+Math.cos(a)*R2,z=v.z+Math.sin(a)*R2,h=new T.Group(),ww=st.hw||5,hh=st.hh||3;
  const rr=placeHouse(st.pick(),x,z,Math.atan2(v.x-x,v.z-z),hStyle(st.pal),st.sc||1);SOL.push({x,z,r:Math.max(ww*.7,rr)})}
 const well=new T.Group(),wb=mk(new T.CylinderGeometry(1.3,1.4,1,12),0x9a9aa6,1),ww2=mk(new T.CylinderGeometry(1.05,1.05,.2,12),0x3a7ac8),rf=mk(new T.ConeGeometry(1.8,1,4),st.roofs[0],1);wb.position.y=.5;ww2.position.y=.95;rf.position.y=3;rf.rotation.y=.78;well.add(wb,ww2,rf);for(const sx of[-1,1]){const p=mk(new T.BoxGeometry(.15,2.2,.15),0x5a3d22);p.position.set(sx*1.1,1.6,0);well.add(p)}SOL.push({x:v.x,z:v.z,r:1.6});put(well,v.x,v.z);
 const gap=toH;for(let i=0;i<34;i++){const a=i/34*6.2832,ad=Math.atan2(Math.sin(a-gap),Math.cos(a-gap));if(Math.abs(ad)<.22)continue;const x=v.x+Math.cos(a)*v.r,z=v.z+Math.sin(a)*v.r,f=new T.Group();if(st.noRing||nearRoad(x,z,4.6))continue;
  if(st.wall){const wl=mk(new T.BoxGeometry(4.8,3.2,.8),0x9d9aa6,1);wl.position.y=1.6;f.add(wl);SOL.push({x,z,r:2.2});if(i%6==0){const t=mk(new T.CylinderGeometry(1.4,1.6,6,8),0xaaa6b2,1),c=mk(new T.ConeGeometry(1.9,2.4,8),st.roofs[0],1);t.position.y=3;c.position.y=7.2;f.add(t,c)}}
  else{const p=mk(new T.BoxGeometry(.25,1.2,.25),0x6e4a2a),r=mk(new T.BoxGeometry(4.6,.15,.12),0x8a5f33);p.position.y=.6;r.position.y=.9;f.add(p,r)}
  f.rotation.y=-a+1.5708;put(f,x,z)}
 villageDeco(v,st);
 signBoard(v.n,v.x+Math.cos(gap)*(v.r+3),v.z+Math.sin(gap)*(v.r+3),Math.atan2(Math.cos(gap),Math.sin(gap)))}
// Acampamento dos Cavaleiros na Zona Comum (perto da área das missões dos magos e do Mago das Trevas)
const CAMP={x:34,z:-118};
for(let i=0;i<14;i++){const c=new T.Group();for(let j=0;j<3;j++){const s=new T.Mesh(new T.SphereGeometry(5+j*2,8,6),new T.MeshBasicMaterial({color:0xffffff,fog:false}));s.position.x=j*7;s.scale.y=.5;c.add(s)}c.position.set((rnd()-.5)*500,60+rnd()*20,50-rnd()*400);S.add(c)}
