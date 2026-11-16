// ================= V82 · visual das formas do Asta (design original do Clover RPG) =================
// Peças presas aos ossos do corpo (braços, tronco, cabeça): acompanham todas as animações.
function v82DressOn(kind,L){L=L||PP;const parts=[],hd=L.hs||null,tor=L.tspace||L.root,arms=L.arms||[],fury=kind=='fury';
 const add=(m,par,x,y,z)=>{if(!par)return m;m.position.set(x,y,z);m.userData.f82=1;par.add(m);parts.push(m);return m};
 const blk=new T.MeshLambertMaterial({color:fury?0x16040a:0x0b0710,emissive:fury?0x2a0006:0x05020a}),red=new T.MeshBasicMaterial({color:fury?0xff2020:0xff1a2a}),rg=GLM(fury?0xff2a2a:0xff1a2a,.75);
 // braços: manoplas negras de Anti-Magia (os dois antebraços; o direito sobe até o ombro)
 for(const i of[0,1]){const a=arms[i];if(!a)continue;if(a[1]){add(new T.Mesh(k82G('gfa',()=>new T.CylinderGeometry(.08,.071,.42,9)),blk),a[1],0,-.22,0);for(let k=0;k<(fury?3:2);k++)add(new T.Mesh(k82G('gfr',()=>new T.TorusGeometry(.079,.008,4,14)),fury?rg:red),a[1],0,-.1-k*.13,0).rotation.x=Math.PI/2;
   for(let k=0;k<4;k++){const cl=add(new T.Mesh(k82G('gcl',()=>new T.ConeGeometry(.014,.09,4)),blk),a[1],(k-1.5)*.026,-.5,.035);cl.rotation.x=Math.PI}}
  if(a[0]&&(i==1||fury))add(new T.Mesh(k82G('gua',()=>new T.CylinderGeometry(.106,.096,.33,9)),blk),a[0],0,-.17,0)}
 // asa rasgada nas costas (uma no Asta Negro; duas, maiores, na fúria)
 const wings=[];const wingShape=k82G('wsh',()=>{const s=new T.Shape();s.moveTo(0,0);s.lineTo(.22,.38);s.lineTo(.5,.62);s.lineTo(.62,.4);s.lineTo(.78,.48);s.lineTo(.72,.2);s.lineTo(.9,.12);s.lineTo(.62,-.05);s.lineTo(.7,-.28);s.lineTo(.4,-.12);s.lineTo(.3,-.38);s.lineTo(.16,-.12);s.closePath();return new T.ShapeGeometry(s)});
 const wm=new T.MeshBasicMaterial({color:fury?0x1a0006:0x07040a,side:T.DoubleSide});for(const sd of fury?[-1,1]:[-1]){const w=new T.Group();const p=new T.Mesh(wingShape,wm);p.scale.set(sd*(fury?1.25:1.05),fury?1.2:1,1);w.add(p);const edge=new T.Mesh(wingShape,GLM(fury?0xff1010:0xff1a2a,.22));edge.scale.set(sd*(fury?1.3:1.1),fury?1.25:1.05,1);edge.position.z=-.01;w.add(edge);add(w,tor,sd*.1,1.5,-.2);w.rotation.y=sd*.5;wings.push({w,sd})}
 // rosto: marcas vermelhas sob os olhos; na fúria, dois chifres curtos
 if(hd){for(const sd of[-1,1]){const mk=add(new T.Mesh(k82G('fmk',()=>new T.PlaneGeometry(.018,.1)),red),hd,sd*.1,-.06,.262);mk.rotation.z=sd*.25}
  if(fury)for(const sd of[-1,1]){const h=add(new T.Mesh(k82G('fhn',()=>new T.ConeGeometry(.035,.2,6)),blk),hd,sd*.13,.22,.02);h.rotation.z=-sd*.55}}
 // tronco: linhas vermelhas de Anti-Magia (só na fúria)
 if(fury&&tor){for(const sd of[-1,1]){const ln=add(new T.Mesh(k82G('tln',()=>new T.PlaneGeometry(.016,.36)),rg),tor,sd*.09,1.28,.2);ln.rotation.z=sd*.3}}
 // olhos e cabelo
 // pernas: faixas negras nas canelas com anéis vermelhos
 for(const lg of(L.legs||[])){if(lg&&lg[1]){add(new T.Mesh(k82G('gsh',()=>new T.CylinderGeometry(.1,.085,.36,9)),blk),lg[1],0,-.2,0);add(new T.Mesh(k82G('gsr',()=>new T.TorusGeometry(.098,.009,4,14)),fury?rg:red),lg[1],0,-.06,0).rotation.x=Math.PI/2}}
 // roupa escurece (o corpo todo muda de tom) — volta ao normal ao sair
 const sv=[];for(const [m,k] of[[L.mT,fury?.72:.6],[L.mP,fury?.6:.45],[L.mC,.55]]){if(m&&m.color){sv.push([m,m.color.getHex()]);const c=m.color.clone();c.lerp(new T.Color(fury?0x2a0006:0x0a0610),k);m.color.copy(c)}}
 const oe=L.mE?L.mE.color.getHex():null,oh=L.mH?L.mH.color.getHex():null;if(L.mE)L.mE.color.setHex(fury?0xffffff:0xff1a2a);if(L.mH){const c=new T.Color(oh);c.lerp(new T.Color(0x0a0a0c),fury?.75:.55);L.mH.color.copy(c)}
 const F={parts,wings,undo(){parts.forEach(m=>{if(m.parent)m.parent.remove(m)});try{wm.dispose();blk.dispose();red.dispose();rg.dispose()}catch(e){}if(L.mE&&oe!=null)L.mE.color.setHex(oe);sv.forEach(([m,h])=>m.color.setHex(h));if(L.mH&&oh!=null)L.mH.color.setHex(oh)},anim(t){wings.forEach((o,i)=>{o.w.rotation.y=o.sd*(.45+Math.sin(t*(fury?7:3)+i)*.18)})}};return F}
const DR82={me:null};
function v82Dress(kind){v82Undress();DR82.me=v82DressOn(kind,PP)}
function v82Undress(){if(DR82.me){try{DR82.me.undo()}catch(e){}DR82.me=null}}
{const _x=xUpdate;xUpdate=function(dt){_x(dt);try{const t=performance.now()/1000;if(DR82.me)DR82.me.anim(t);for(const k in MP.others){const o=MP.others[k];if(o.dr82)o.dr82.anim(t)}}catch(e){}}}

