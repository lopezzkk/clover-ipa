// ===================== V84 · limpeza do mapa: estradas livres, placas sem árvores, degraus e bases onde dá para pisar =====================
{const RW=3.9;
 // 1) caixas, barris, sacos, lenha, bancos e cercas que caíram em cima de uma estrada saem do mapa
 const gone=[];
 for(const k in chunks){const g=chunks[k];g.updateMatrixWorld(true);const v=new T.Vector3();
  g.traverse(o=>{if(!o.userData||!o.userData.prop)return;o.getWorldPosition(v);if(nearRoad(v.x,v.z,RW))gone.push(o)})}
 for(const o of gone)if(o.parent)o.parent.remove(o);
 // 2) árvores coladas nas placas saem (a placa fica legível) e a colisão delas também
 const SG=window.SIGN83||[];let tg=0;
 for(const k in chunks){const g=chunks[k];for(let i=g.children.length-1;i>=0;i--){const o=g.children[i],t=o.userData&&o.userData.tree;if(!t)continue;
  for(const sg of SG){if(Math.hypot(t[0]-sg.x,t[1]-sg.z)<sg.w/2+2.6){g.remove(o);tg++;for(let j=SOL.length-1;j>=0;j--){const c=SOL[j];if(c.x===t[0]&&c.z===t[1]&&c.r!=null&&c.r<1.2){SOL.splice(j,1);break}}break}}}}
 window.V84CLEAN={props:gone.length,trees:tg};
 // 3) plataformas: bases de pedra, degraus, escadarias e pisos baixos viram chão onde o jogador pisa (antes ele afundava dentro)
 const PL=[],PG={};const m4=new T.Vector3(),q=new T.Quaternion(),sc=new T.Vector3(),up=new T.Vector3(),ax=new T.Vector3();
 const addG=(p,rx,rz)=>{for(let i=Math.floor((p.x-rx)/10);i<=Math.floor((p.x+rx)/10);i++)for(let j=Math.floor((p.z-rz)/10);j<=Math.floor((p.z+rz)/10);j++)(PG[i+','+j]=PG[i+','+j]||[]).push(p)};
 for(const k in chunks){const g=chunks[k];g.updateMatrixWorld(true);
  g.traverse(o=>{if(!o.isMesh||!o.geometry||!o.geometry.parameters)return;const ty=o.geometry.type;if(ty!=='BoxGeometry'&&ty!=='CylinderGeometry')return;
   if(o.material===olm||o.material&&(o.material.transparent||o.material.map))return;if(o.userData&&(o.userData.portal||o.userData.prop))return;
   o.matrixWorld.decompose(m4,q,sc);up.set(0,1,0).applyQuaternion(q);if(up.y<.995)return;
   const pr=o.geometry.parameters,h=pr.height*sc.y,top=m4.y+h/2,bot=m4.y-h/2;if(top<.15||top>2.7||bot>2.1)return;
   if(ty==='BoxGeometry'){const w=pr.width*sc.x,d=pr.depth*sc.z;if(Math.min(w,d)<1)return;ax.set(1,0,0).applyQuaternion(q);const c=ax.x,s=ax.z,p={x:m4.x,z:m4.z,c,s,hx:w/2,hz:d/2,top};const R2=Math.hypot(w,d)/2;PL.push(p);addG(p,R2,R2)}
   else{const r=Math.max(pr.radiusTop,pr.radiusBottom)*sc.x;if(r<.9)return;const p={x:m4.x,z:m4.z,r,top};PL.push(p);addG(p,r,r)}})}
 window.PLAT84=PL;window.platAdd84=(x,z,hx,hz,top,ry)=>{ry=ry||0;const p={x,z,c:Math.cos(ry),s:-Math.sin(ry),hx,hz,top};const R2=Math.hypot(hx,hz);PL.push(p);addG(p,R2,R2)};
 window.hG83=function(x,z){const L=PG[Math.floor(x/10)+','+Math.floor(z/10)];if(!L)return 0;let y=0;for(const p of L){if(p.top<=y)continue;const dx=x-p.x,dz=z-p.z;
  if(p.r!=null){if(dx*dx+dz*dz<=p.r*p.r)y=p.top}else{const lx=dx*p.c+dz*p.s,lz=-dx*p.s+dz*p.c;if(Math.abs(lx)<=p.hx&&Math.abs(lz)<=p.hz)y=p.top}}return y}}