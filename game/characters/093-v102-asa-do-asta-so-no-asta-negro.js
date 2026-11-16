// ================= V102 · asa do Asta só no Asta Negro (forma 1) e na Fúria (forma 2, mais preta) · tamanho das partes do corpo =================
// 1) União Demoníaca volta ao visual de antes (asas antigas). A asa do modelo vai para as formas de Anti-Magia.
{const _on=duOn;duOn=function(){const r=_on.apply(this,arguments);try{const F=DU.fx;if(F&&F.w100){if(F.w100.parent)F.w100.parent.remove(F.w100);F.w100=null;(F.W||[]).forEach(o=>{o.w.visible=true;o.w.scale.setScalar(1)});(F.h100||[]).forEach(o=>o.visible=true);F.h100=null}
  if(UA100.keep){UA100.keep.forEach(([o,m])=>o.material=m);UA100.keep=null}}catch(e){}return r}}
const AF102={w:null,k:null,dark:[]};
function af102Mesh(fury){const geo=md96Geo('wing100'),mt=new T.MeshToonMaterial({vertexColors:!fury,color:fury?0x050306:0xffffff,gradientMap:gmap,side:T.DoubleSide,emissive:fury?0x0a0002:0x12000a});mt._keep=1;const m=new T.Mesh(geo,mt);m.castShadow=true;
 const ol=new T.Mesh(geo,new T.MeshBasicMaterial({color:fury?0xff1020:0x9a2a8a,side:T.BackSide,transparent:true,opacity:fury?.7:.55}));ol.scale.setScalar(1.012);m.add(ol);
 const s=UW100.s*(fury?1.12:1),c=UW100.c;m.scale.setScalar(s);m.position.set(-c[0]*s-.12,-.78*(fury?1.12:1),-c[2]*s-.05);const g=new T.Group();g.add(m);return g}
function af102Off(){if(AF102.w){if(AF102.w.parent)AF102.w.parent.remove(AF102.w);AF102.w=null}AF102.dark.forEach(([o,m])=>o.material=m);AF102.dark=[];AF102.k=null;AF102.hid&&AF102.hid.forEach(o=>o.visible=true);AF102.hid=null}
function af102Tick(){const k=(P.g&&P.g.id=='anti'&&!P.union)?P.af:null;if(k===AF102.k)return;af102Off();if(!k||!DR82.me)return;AF102.k=k;const fury=k=='fury';
 // esconde as asas desenhadas antigas da forma
 AF102.hid=[];try{(PP.tspace||PP.root).traverse(o=>{if(o.userData&&o.userData.f82&&o.isGroup&&o.children.some(c=>c.geometry&&c.geometry.type=='ShapeGeometry')){if(o.visible){o.visible=false;AF102.hid.push(o)}}})}catch(e){}
 const W=af102Mesh(fury);(PP.root||pm).add(W);AF102.w=W;
 // Asta Negro: braço direito preto; Fúria: os dois braços, tronco e pernas bem pretos
 const dark=new T.MeshToonMaterial({color:fury?0x060407:0x121016,gradientMap:gmap,emissive:fury?0x030001:0x1a0006});dark._keep=1;
 const segs=fury?[...PP.arms[0],...PP.arms[1],...PP.legs[0],...PP.legs[1],PP.bR,PP.tspace,PP.pspace]:[...PP.arms[0]];
 if(fury){AF102.skm=[PP.mT,PP.mP,PP.mC,PP.mSh].filter(m=>m&&m.color).map(m=>[m,m.color.getHex()]);AF102.skm.forEach(([m])=>m.color.setHex(0x0b080c))}
 segs.forEach(seg=>seg&&seg.children.forEach(c=>c.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh&&o!==sword&&!(sword&&isChild100(o,sword))&&!(o.userData&&o.userData.f82)&&o.material&&!o.material.isMeshBasicMaterial){AF102.dark.push([o,o.material]);o.material=dark}})))}
{const _off=af102Off;af102Off=function(){try{if(AF102.skm){AF102.skm.forEach(([m,c])=>{if(m.color&&c!=null)m.color.setHex(c)});AF102.skm=null}}catch(e){}return _off()}}
function af102Anim(){if(AF102.w){const t=performance.now()/1000;AF102.w.rotation.z=Math.sin(t*(AF102.k=='fury'?5:2))*.05;AF102.w.rotation.y=Math.sin(t*1.3)*.06}}

// 2) Tamanho das partes do corpo (Customização): altura, cabeça, tronco, braços e pernas
const BS102=[{k:'bsH',n:'Altura',min:.85,max:1.2},{k:'bsHead',n:'Cabeça',min:.75,max:1.4},{k:'bsTor',n:'Tronco (largura)',min:.8,max:1.4},{k:'bsArm',n:'Braços',min:.8,max:1.35},{k:'bsLeg',n:'Pernas (grossura)',min:.8,max:1.4}];
BS102.forEach(b=>LOOK0[b.k]=1);
function bs102Get(k){const v=P.look&&P.look[k];return typeof v=='number'&&isFinite(v)?v:1}
const BB102=new WeakMap();
function bs102Base(o,key){let m=BB102.get(o);if(!m){m={};BB102.set(o,m)}if(!m[key])m[key]={s:o.scale.clone(),p:o.position.clone()};return m[key]}
function bs102Apply(L){L=L||PP;if(!L||!L.root||!P.look)return;try{
 const h=bs102Get('bsH'),hd=bs102Get('bsHead'),tr=bs102Get('bsTor'),ar=bs102Get('bsArm'),lg=bs102Get('bsLeg');
 const rb=bs102Base(L.root,'r');L.root.scale.set(rb.s.x*(1+(h-1)*.35),rb.s.y*h,rb.s.z*(1+(h-1)*.35));
 if(L.hj){const b=bs102Base(L.hj,'h');L.hj.scale.set(b.s.x*hd,b.s.y*hd,b.s.z*hd)}
 if(L.bR){const b=bs102Base(L.bR,'t');L.bR.scale.set(b.s.x*tr,b.s.y,b.s.z*(1+(tr-1)*.6))}
 if(L.tspace){const b=bs102Base(L.tspace,'ts');L.tspace.scale.set(b.s.x*tr,b.s.y,b.s.z*(1+(tr-1)*.6))}
 L.arms.forEach(a=>{const b=bs102Base(a[0],'a');a[0].scale.set(b.s.x*ar,b.s.y*(1+(ar-1)*.5),b.s.z*ar);a[0].position.x=b.p.x*(1+(tr-1)*.85)});
 L.legs.forEach(a=>{const b=bs102Base(a[0],'l');a[0].scale.set(b.s.x*lg,b.s.y,b.s.z*lg)})}catch(e){}}
window.bs102Set=(k,v)=>{if(!P.look)return;P.look[k]=Math.round(+v*100)/100;bs102Apply();const o=document.getElementById('bsv_'+k);if(o)o.textContent=Math.round(P.look[k]*100)+'%';try{saveGame()}catch(e){}};
window.bs102Reset=()=>{if(!P.look)return;BS102.forEach(b=>P.look[b.k]=1);bs102Apply();try{czRender()}catch(e){}try{saveGame()}catch(e){}};
{const st=document.createElement('style');st.textContent='.bs102 label{display:flex;justify-content:space-between;font-size:13px;margin:8px 0 2px}.bs102 input[type=range]{width:100%;accent-color:#d4af37}.bs102 b{color:#f0cf72}';document.head.appendChild(st)}
{const _cr=czRender;czRender=function(){const r=_cr.apply(this,arguments);try{const pn=$('cz-panel');if(pn&&!pn.querySelector('.bs102')){const op=MENU.czo=='bs102';let body='<div class="bs102">'+BS102.map(b=>{const v=bs102Get(b.k);return '<label>'+b.n+' <b id="bsv_'+b.k+'">'+Math.round(v*100)+'%</b></label><input type="range" min="'+b.min+'" max="'+b.max+'" step="0.01" value="'+v+'" oninput="bs102Set(\''+b.k+'\',this.value)">'}).join('')+'<button class="k sm" style="margin-top:10px" onclick="bs102Reset()">Voltar ao normal</button></div>';
  pn.insertAdjacentHTML('beforeend','<div class="czc'+(op?' open':'')+'"><button class="czh" onclick="czOpen(\'bs102\')"><span class="ic">📏</span>Tamanho do Corpo<span class="cv">'+(BS102.some(b=>bs102Get(b.k)!=1)?'Ajustado':'Normal')+'</span><span class="ch">›</span></button><div class="czb2">'+body+'</div></div>')}}catch(e){}bs102Apply();return r}}
{const _du=dressUp;dressUp=function(L,look){const r=_du.apply(this,arguments);try{if(L===PP)bs102Apply()}catch(e){}return r}}

{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{af102Tick();af102Anim()}catch(e){}return r}}
setTimeout(()=>{try{bs102Apply()}catch(e){}},500);

{const _u=v82Undress;v82Undress=function(){try{af102Off()}catch(e){}return _u.apply(this,arguments)}}

