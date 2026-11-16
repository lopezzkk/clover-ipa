// ================= ROSTO E CABELO MAIS DEFINIDOS (V74) =================
// pupilas, cílios, lábios, orelhas e franja/costeletas modeladas. Corpo original; nenhum modelo externo foi importado.
const FCM={};function fcMat(k,c){return FCM[k]||(FCM[k]=Object.assign(mat(c),{_keep:true}))}
function faceUp(p,L){if(!p||!p.fg||!p.hg)return;const E=EYES[L.eyes]||EYES[0];
 if(!p.fg.children.some(o=>o.userData.fu)){for(const s of[-1,1]){if(!E.arc){const pu=lkAdd(p.fg,lwG('fcPup',()=>new T.SphereGeometry(.018,8,6)),fcMat('pup',0x0a0608),s*.085,1.955,.226);pu.scale.set(1,1.3*(E.i?E.i[1]:1),.4);pu.userData.fu=1;
   const la=lkAdd(p.fg,lwG('fcLash',()=>new T.TorusGeometry(.062,.008,4,12,Math.PI)),fcMat('lash',0x140c0a),s*.085,1.96+.012*(E.w?E.w[1]:1),.206);la.scale.set(E.w?E.w[0]:1,(E.w?E.w[1]:1)*.9,.5);la.userData.fu=1}}
  const lp=lkAdd(p.fg,lwG('fcLip',()=>new T.SphereGeometry(.03,10,6)),p.mLip||(p.mLip=mat(0xb8645a)),0,1.842,.218);lp.scale.set(1.35,.32,.45);lp.userData.fu=1;try{if(p.mS&&p.mLip)p.mLip.color.copy(p.mS.color).lerp(new T.Color(0xc0504a),.45)}catch(e){}}
 if(p.hs&&!p._ears){p._ears=1;for(const s of[-1,1]){const ea=new T.Mesh(lwG('fcEar',()=>new T.SphereGeometry(.055,8,6)),p.mS);ea.scale.set(.45,1,.75);ea.position.set(s*.245,-.02,-.01);p.hs.add(ea)}}
 if(!p.hg.children.some(o=>o.userData.fu)&&L.hair!=4&&L.hair!=7){for(let i=0;i<5;i++){const x=(i-2)*.075,b=lkAdd(p.hg,lwG('fcBang',()=>new T.ConeGeometry(.052,.24,5)),p.mH,x,2.11-Math.abs(i-2)*.012,.2);b.rotation.set(2.75,0,(i-2)*-.18);b.userData.fu=1}
  for(const s of[-1,1]){const sb=lkAdd(p.hg,lwG('fcSide',()=>new T.ConeGeometry(.045,.26,5)),p.mH,s*.222,1.99,.06);sb.rotation.set(Math.PI,0,s*.12);sb.userData.fu=1}}}
const _dressUp0=dressUp;dressUp=function(p,L0){_dressUp0(p,L0);try{faceUp(p,lkNorm(L0))}catch(e){}};

// ================= REQUISITO DE NÍVEL 30 PARA CONTRATOS DEMONÍACOS (V74) =================
// vale para todos os demônios (Liebe, os quatro de Nacht e Zagred). Quem já tinha contrato antes desta versão mantém (não apagamos progresso).
const DLV=30;
function dLvOk(k){return P.lv>=DLV||relOk(k)}
function dLvMsg(){toast('🔒 Você precisa alcançar o nível 30 para estabelecer um contato com um demônio. (Seu nível: '+P.lv+' · Necessário: '+DLV+')');banner('NÍVEL 30 NECESSÁRIO','Seu nível: '+P.lv+' · Necessário: '+DLV,'#ff4d6a')}

// ================= ALCANCE DE CADA HABILIDADE (curto / médio / longo) =================
// medido nos parâmetros de cada habilidade (raio, distância do alvo ou comprimento do feixe)
const RNG={fball:['l',30],fchain:['m',14],fsoul:['m',16],finferno:['l',24],mchain:['m',18],mtag:['m',16],
 wgale:['l',26],wtorn:['m',16],wrun:['c',0,'mobilidade'],wtemp:['m',18],wprison:['m',18],wcyc:['c',9],sgale:['l',28],svort:['m',18],sdive:['c',0,'mobilidade'],stemp:['l',26],sprison:['m',18],scyc:['m',12],
 aimp:['l',22],aerup:['c',7.5],aph:['m',10],aann:['l',20],agrasp:['m',16],ajudg:['m',14],udiv:['l',24],uabys:['m',16],uover:['c',8],uking:['l',32],ugrasp:['m',16],ujudg:['m',14],uwing:['c',6.5],umet:['l',30],
 tarrow:['l',30],tprison:['m',18],taccel:['c',0,'próprio corpo'],treq:['l',22],tcoll:['m',18],tdom:['l',20],kspear:['l',28],kabyss:['m',18],klegion:['m',16],kdom:['l',24],krupt:['m',16],kcmd:['c',12,'área ao redor'],
 sgspear:['l',24],sgabyss:['m',18],sgguard:['c',0,'defesa'],sgempress:['l',24],sgcath:['c',6],sgcdom:['m',14],sofrac:['l',28],soparade:['m',16],soglam:['m',14],sonight:['l',24],sodom:['m',12],sorep:['c',4],
 esrift:['l',24],esgate:['m',18,'portais'],esdom:['m',16],escoll:['l',24],esscol:['m',16],esdbrk:['c',6],nassa:['m',18],nagimo:['m',16,'invocação'],nacontr:['c',0,'contratos'],naunion:['c',0,'transformação'],nsdom:['m',10],nsdev:['l',26],
 nurend:['c',6],nuprison:['m',14],nureq:['l',22],nf5:['m',14],nf6:['l',22],
 fswing:['c',5.5],lray:['l',30],lblade:['m',20],lflash:['c',12,'avanço'],lprison:['m',16],ljudg:['l',24],lsun:['c',14,'área ao redor'],
 tspear:['m',17],tfort:['c',3.5,'defesa'],tfist:['c',9],tcrys:['m',16],tquake:['c',12,'área ao redor'],tmount:['l',26],
 adrag:['l',24],alance:['l',32],aprison:['m',14],avort:['m',14],aocean:['l',26],atsu:['c',16,'área ao redor'],
 slash:['c',5],nova:['c',7],dash:['m',10],nup:['c',2.5],nwave:['l',20,'onda'],proj:['l',24],beam:['l',26],big:['l',24],heal:['c',0,'próprio corpo'],shield:['c',3,'defesa'],cone:['c',6],meteor:['l',12]};
const RNGN={c:'Curto',m:'Médio',l:'Longo'};
function rngOf(s){const r=RNG[s&&s[3]];return r||null}
function rngTxt(s){const r=rngOf(s);if(!r)return'—';return RNGN[r[0]]+(r[1]?' · '+String(r[1]).replace('.',',')+' m':'')+(r[2]?' ('+r[2]+')':'')}
// linha completa de uma habilidade: ícone, nome, recarga, mana, alcance, nível necessário e estado
function skRow(s,i,alt){const lv=skl(i),lk=P.lv<lv,cd=(s[5]||.5)*(1-cb('cdr')),col=P.g?P.g.c:0xffffff;
 return '<div class="skr'+(lk?' lk':'')+'"><i class="ski">'+skIcon(s[0],col)+'</i><div><b>'+(lk?'🔒 ':'')+s[0]+'</b><span class="skc"><em>⏱ '+String(+cd.toFixed(1)).replace('.',',')+'s</em><em>💧 '+mcost(s)+(alt&&s[6]?' + '+s[6]+' energia':'')+'</em><em>📏 '+rngTxt(s)+'</em><em class="'+(lk?'no':'ok')+'">'+(lk?'Nível '+lv+' (você: '+P.lv+')':'Disponível'+(alt?'':' · Nv '+lvl(i)+(lvl(i)<10?' · uso '+(P.xp[i]%5)+'/5':' · máx.')))+'</em></span></div></div>'}
// título nas teclas (PC): passar o mouse mostra os mesmos dados
function skTitle(s,i){if(!s)return'';const lk=P.lv<skl(i);return s[0]+' — recarga '+(s[5]||.5)+'s · mana '+mcost(s)+' · alcance '+rngTxt(s)+' · '+(lk?'bloqueada até o Nível '+skl(i):'disponível')}
function rngMix(list){const n={c:0,m:0,l:0};(list||[]).forEach(s=>{const r=rngOf(s);if(r)n[r[0]]++});return '<p class="sm">📏 Estilo de alcance: '+n.c+' curto · '+n.m+' médio · '+n.l+' longo</p>'}

Object.assign(SKI,{
 'Magna: Flame Swing Breaker':'<path d="M4 20L18 6" stroke="L" stroke-width="2.6" stroke-linecap="round"/><path d="M18 6c2-3 4-2 4 0s-2 3-4 0" fill="C"/><path d="M3 12a9 9 0 0 1 9-9M21 12a9 9 0 0 1-9 9" stroke="C" stroke-width="1.6" fill="none"/>',
 'Light: Divine Ray':'<circle cx="5" cy="12" r="3.5" fill="none" stroke="C" stroke-width="1.6"/><path d="M8 12h14" stroke="L" stroke-width="3.2" stroke-linecap="round"/><path d="M9 9.5l11 1M9 14.5l11-1" stroke="C" stroke-width="1"/>',
 'Light: Solar Blades':'<path d="M4 20l6-14 1 6zM10 20l4-15 1 7zM16 20l3-14 1 7z" fill="L" stroke="C" stroke-width=".8"/><circle cx="12" cy="4" r="1.6" fill="C"/>',
 'Light: Flash Step':'<path d="M3 15h9M2 11h8M4 19h7" stroke="C" stroke-width="1.6" stroke-linecap="round"/><path d="M14 4l-2 8h5l-3 8 8-11h-5l3-5z" fill="L"/>',
 'Light: Radiant Prison':'<path d="M5 4v16M9.5 4v16M14.5 4v16M19 4v16" stroke="L" stroke-width="1.8"/><ellipse cx="12" cy="4" rx="8" ry="1.8" fill="none" stroke="C" stroke-width="1.4"/><ellipse cx="12" cy="20" rx="8" ry="1.8" fill="none" stroke="C" stroke-width="1.4"/>',
 "Light: Heaven's Judgment":'<ellipse cx="12" cy="4" rx="8" ry="2.2" fill="none" stroke="C" stroke-width="1.4"/><path d="M6 6v13M12 6v15M18 6v13" stroke="L" stroke-width="2.2" stroke-linecap="round"/>',
 'Light: Absolute Sun':'<circle cx="12" cy="12" r="5" fill="L"/><g stroke="C" stroke-width="1.8" stroke-linecap="round"><path d="M12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2"/></g>',
 'Earth: Earth Spear':'<path d="M3 21l3-10 2 10zM9 21l3-15 3 15zM16 21l3-9 2 9z" fill="C"/><path d="M12 6l1.5 15" stroke="L" stroke-width=".8"/><path d="M2 21h20" stroke="L" stroke-width="1.4"/>',
 'Earth: Stone Fortress':'<path d="M3 20V9h3v2h2V9h3v2h2V9h3v2h2V9h3v11z" fill="C"/><path d="M10 20v-5a2 2 0 0 1 4 0v5" fill="L"/>',
 'Earth: Titan Fist':'<rect x="5" y="7" width="12" height="9" rx="2" fill="C"/><path d="M7 7V5M10 7V4.5M13 7V4.5M16 7V5" stroke="L" stroke-width="2.2" stroke-linecap="round"/><path d="M17 11h4M18 15h3M17 7h3" stroke="L" stroke-width="1.4" stroke-linecap="round"/><path d="M8 16v5h6v-5" fill="C"/>',
 'Earth: Crystal Prison':'<path d="M6 21l-2-9 3-7 2 16zM12 21l-2-12 2-7 2 7zM18 21l-2-16 3 7-2 9z" fill="L" stroke="C" stroke-width=".9"/>',
 'Earth: Earthquake Dominion':'<path d="M2 14h20" stroke="C" stroke-width="1.8"/><path d="M6 14l2 3-1 3M12 14l-1 4 2 3M17 14l2 3" stroke="L" stroke-width="1.4" fill="none"/><path d="M4 11l2-4 2 4M14 11l3-6 3 6" fill="C"/>',
 'Earth: Mountain Breaker':'<path d="M12 22L4 6h16z" fill="C"/><path d="M8 6l4 3 4-3" stroke="L" stroke-width="1.2" fill="none"/><path d="M2 22h20M5 19l-3 2M19 19l3 2" stroke="L" stroke-width="1.4"/>',
 'Water: Water Dragon':'<path d="M3 18c3 0 3-5 6-5s3 5 6 5 3-6 6-8" stroke="C" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="20" cy="9" r="2.4" fill="L"/><path d="M21 6l2-3M19 6l-1-3" stroke="L" stroke-width="1.2"/>',
 'Water: Aqua Lance':'<path d="M2 12h15" stroke="C" stroke-width="2.4" stroke-linecap="round"/><path d="M16 8l6 4-6 4z" fill="L"/><path d="M4 9c2 1 4 1 6 0M4 15c2-1 4-1 6 0" stroke="L" stroke-width="1" fill="none"/>',
 'Water: Tidal Prison':'<circle cx="12" cy="12" r="8" fill="none" stroke="C" stroke-width="2"/><circle cx="12" cy="12" r="5" fill="L" opacity=".55"/><path d="M8 9a5 5 0 0 1 5-2" stroke="#fff" stroke-width="1.2" fill="none"/>',
 'Water: Hydro Vortex':'<path d="M12 12m-1 0a1 1 0 1 1 2 0a3 3 0 1 1-6 0a5 5 0 1 1 10 0a7 7 0 1 1-14 0" stroke="C" stroke-width="1.8" fill="none"/><circle cx="12" cy="12" r="1.4" fill="L"/>',
 'Water: Ocean Dominion':'<path d="M2 20h20" stroke="C" stroke-width="1.6"/><path d="M3 19c0-9 7-15 15-12-4 0-6 3-5 6 1 2 4 2 5 0" fill="C"/><path d="M7 16c1-4 4-7 8-8" stroke="L" stroke-width="1.2" fill="none"/>',
 'Water: Abyssal Tsunami':'<path d="M2 21c2-8 6-14 10-17 4 3 8 9 10 17z" fill="C"/><path d="M6 19c2-4 4-7 6-9 2 2 4 5 6 9" stroke="L" stroke-width="1.4" fill="none"/><circle cx="12" cy="15" r="1.6" fill="L"/>',
 'Uppercut Ascendente':'<path d="M9 22v-6l-2-3 2-4h5l1 4-2 3v6" fill="C"/><path d="M13 9V3M10 5l3-3 3 3" stroke="L" stroke-width="1.8" fill="none" stroke-linecap="round"/>',
 'Punho Sísmico':'<rect x="8" y="3" width="8" height="8" rx="2" fill="C"/><path d="M12 11v4" stroke="C" stroke-width="2"/><path d="M2 18c3-2 5-2 10 0s7 2 10 0M4 22c3-1 5-1 8 0s5 1 8 0" stroke="L" stroke-width="1.4" fill="none"/>',
 'Devil Union: Demon Wing Tempest':'<path d="M12 12L2 6l3 6-2 5zM12 12l10-6-3 6 2 5z" fill="C"/><circle cx="12" cy="12" r="9" fill="none" stroke="L" stroke-width="1.2" stroke-dasharray="3 2"/>',
 "Devil Union: Liebe's Black Meteor":'<circle cx="15" cy="9" r="5" fill="C"/><circle cx="15" cy="9" r="6.5" fill="none" stroke="L" stroke-width="1.2"/><path d="M11 13L3 21M9 11l-6 4M13 15l-4 6" stroke="L" stroke-width="1.4" stroke-linecap="round"/>'});

// ================= CORPO HUMANOIDE NOVO (V76) =================
// Base original modelada com curvas (torno/lathe) e deformação de vértices: peitoral, costas, abdômen,
// deltoides, bíceps, antebraços, mãos com 5 dedos, coxas, joelhos, panturrilhas, pés com calçado,
// cabeça com crânio, mandíbula e queixo. Mesmo esqueleto (articulações) de antes → animações, roupas,
// transformações e multiplayer continuam funcionando. Cada tipo de corpo usa as próprias medidas.
const HB={};function hbG(k,f){let g=HB[k];if(!g){g=f();g._keep=true;HB[k]=g}return g}
// junta várias geometrias (com transformação) numa só malha → menos objetos para o celular desenhar
function hbMerge(list){let n=0;const parts=list.map(([g,m])=>{const q=(g.index?g.toNonIndexed():g.clone());if(m)q.applyMatrix4(m);n+=q.attributes.position.count;return q});
 const pos=new Float32Array(n*3),nor=new Float32Array(n*3);let o=0;for(const q of parts){if(!q.attributes.normal)q.computeVertexNormals();pos.set(q.attributes.position.array,o*3);nor.set(q.attributes.normal.array,o*3);o+=q.attributes.position.count}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(pos,3));g.setAttribute('normal',new T.BufferAttribute(nor,3));if(parts.some(q=>q.attributes.color)){const col=new Float32Array(n*3);let o2=0;for(const q of parts){const c=q.attributes.color,m=q.attributes.position.count;for(let i=0;i<m;i++){col[(o2+i)*3]=c?c.getX(i):.06;col[(o2+i)*3+1]=c?c.getY(i):.03;col[(o2+i)*3+2]=c?c.getZ(i):.035}o2+=m}g.setAttribute('color',new T.BufferAttribute(col,3))}parts.forEach(q=>q.dispose());g.computeBoundingSphere();return g}
const _hbM=new T.Matrix4(),_hbQ=new T.Quaternion(),_hbE=new T.Euler(),_hbV=new T.Vector3(),_hbS=new T.Vector3();
function hbMat(x,y,z,rx,ry,rz,sx,sy,sz){_hbE.set(rx||0,ry||0,rz||0);_hbQ.setFromEuler(_hbE);_hbV.set(x||0,y||0,z||0);_hbS.set(sx||1,sy==null?(sx||1):sy,sz==null?(sx||1):sz);return new T.Matrix4().compose(_hbV,_hbQ,_hbS)}
// segmento de membro: perfil com músculo (bulge) e pontas arredondadas; de y=0 (articulação) até y=-len
function hbLimb(len,rt,rb,bA,bP,front,seg){const N=11,pts=[];for(let i=N;i>=0;i--){const t=i/N,y=-t*len;let r=rt+(rb-rt)*t;r+=bA*Math.exp(-Math.pow((t-bP)/.28,2));const cap=Math.min(1,Math.sin(Math.min(1,t/.12)*Math.PI/2)*.35+.65)*Math.min(1,Math.sin(Math.min(1,(1-t)/.12)*Math.PI/2)*.35+.65);pts.push(new T.Vector2(Math.max(.004,r*cap),y))}
 const g=new T.LatheGeometry(pts,seg||12);if(front){const p=g.attributes.position;for(let i=0;i<p.count;i++){const z=p.getZ(i),t=-p.getY(i)/len;if(z>0)p.setZ(i,z*(1+front*Math.exp(-Math.pow((t-bP)/.25,2))))}g.computeVertexNormals()}return g}
// tronco: da cintura (y=0) até os ombros (y=h); peito largo, cintura fina, peitoral na frente e escápulas atrás
function hbTorso(w,h,d,tb,mus,fat){const N=16,pts=[];for(let i=0;i<=N;i++){const t=i/N;let r;if(t<.62)r=(w/2*tb)*(1-t/.62)+(w/2)*(t/.62)*(1-.06*Math.sin(t/.62*Math.PI));else{const u=(t-.62)/.38;r=w/2*(1-.42*Math.pow(u,2.2))}if(fat)r*=1+.18*Math.sin(t*Math.PI*.9);pts.push(new T.Vector2(Math.max(.02,r),t*h))}
 const g=new T.LatheGeometry(pts,24),p=g.attributes.position,dz=d/w;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),t=y/h;let z=p.getZ(i)*dz;
  if(z>0){const pec=(mus?1.6:1)*.045*Math.exp(-Math.pow((t-.72)/.11,2))*Math.max(0,1-Math.pow(Math.abs(Math.abs(x)-w*.2)/(w*.24),2));z+=pec;z+=(fat?.08:.012)*Math.exp(-Math.pow((t-.3)/.2,2))}
  else{z-=.025*Math.exp(-Math.pow((t-.74)/.12,2))*Math.max(0,1-Math.pow(Math.abs(Math.abs(x)-w*.18)/(w*.22),2))}
  p.setZ(i,z)}g.computeVertexNormals();return g}
// cabeça: crânio redondo, maçãs do rosto, mandíbula afinando até o queixo, rosto levemente achatado (unidade .48 × .528 × .48)
function hbHead(){return hbG('head',()=>{const g=new T.SphereGeometry(.25,28,22),p=g.attributes.position;for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const t=y/.25;
  if(t<0){const k=-t;x*=1-.38*Math.pow(k,1.6);z*=1-.12*k;if(z>0)z+=.02*k;y*=1+.12*k}else{y*=1.04;z*=1+.03*t}
  if(z>.12&&t>-.2&&t<.35)z-=.012;p.setXYZ(i,x,y+.004,z)}g.computeVertexNormals();return g})}
// mão: palma arredondada + 4 dedos com 3 falanges + polegar (uma malha só)
function hbHand(w,h,d,side){return hbG('hand'+[w,h,d,side].join('_'),()=>hbHand0(w,h,d,side))}
function hbHand0(w,h,d,side){const L=[],sph=hbG('hbSphL',()=>new T.SphereGeometry(1,6,5)),cyl=hbG('hbCylL',()=>new T.CylinderGeometry(1,1,1,6,1,true));
 L.push([hbG('hbSph',()=>new T.SphereGeometry(1,10,8)),hbMat(0,-h*.42,0,0,0,0,w*.52,h*.5,d*.48)]);
 for(let f=0;f<4;f++){const x=(f-1.5)*w*.235,fl=h*(f==1||f==2?.62:.52),r=w*.085;let y=-h*.82,z=d*.05,ang=.18+f*.03;
  for(let k=0;k<3;k++){const l=fl*[.42,.32,.26][k];ang+=k?.22:0;const cy=y-Math.cos(ang)*l/2,cz=z+Math.sin(ang)*l/2;L.push([cyl,hbMat(x,cy,cz,-ang,0,0,r*(1-k*.12),l,r*(1-k*.12))]);L.push([sph,hbMat(x,y,z,0,0,0,r*(1-k*.1))]);y-=Math.cos(ang)*l;z+=Math.sin(ang)*l}L.push([sph,hbMat(x,y,z,0,0,0,r*.85)])}
 let tx=-side*w*.48,ty=-h*.42,tz=d*.2;const ta=.7;for(let k=0;k<2;k++){const l=h*.3;const cx=tx-side*Math.sin(ta)*l*.5,cy=ty-Math.cos(ta)*l*.5;L.push([cyl,hbMat(cx,cy,tz+.01,0,0,side*ta,w*.1,l,w*.1)]);L.push([sph,hbMat(tx,ty,tz,0,0,0,w*.1)]);tx-=side*Math.sin(ta)*l;ty-=Math.cos(ta)*l}L.push([sph,hbMat(tx,ty,tz,0,0,0,w*.09)]);
 return hbMerge(L)}
// calçado: bota/sapato com bico arredondado, salto e sola
function hbShoe(w,h,l){const sph=hbG('hbSph'),box=hbG('hbBox',()=>new T.BoxGeometry(1,1,1));return hbMerge([[sph,hbMat(0,h*.45,l*.18,0,0,0,w*.5,h*.62,l*.5)],[sph,hbMat(0,h*.6,-l*.12,0,0,0,w*.48,h*.75,l*.3)],[box,hbMat(0,h*.06,l*.12,0,0,0,w*.98,h*.14,l*.92)]])}
function buildBody2(p,bi){const B=BODIES[bi]||BODIES[0],S=B.s;while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m);if(m.geometry&&!m.geometry._keep)m.geometry.dispose()}
 const part=(par,geo,mtl,x,y,z,fl,out)=>{const e=new T.Mesh(geo,mtl);e.position.set(x||0,y||0,z||0);e.castShadow=true;if(out!==0){const o=new T.Mesh(geo,olm);o.scale.setScalar(1.035);e.add(o)}if(fl)Object.assign(e.userData,fl);par.add(e);p.bm.push(e);return e};
 const R=p.bR,to=S.to,hp=S.hp,th=S.th,sh=S.sh,ft=S.ft,ua=S.ua,fa=S.fa,hn=S.hn,nk=S.nk,hd=S.hd,mus=!!S.mus,fat=!!S.fat;
 const kneeY=sh.l+ft.h/2,hipY=kneeY+th.l,pelY=hipY+.04,pelTop=pelY+hp.h/2,tBot=pelTop-.05,ty=tBot+to.h/2,tTop=tBot+to.h,tb=to.tb||1;
 // quadril (pelve arredondada) e tronco anatômico
 {const N=10,pts=[];for(let i=0;i<=N;i++){const t=i/N;pts.push(new T.Vector2(Math.max(.02,hp.w/2*(.78+.22*Math.sin(t*Math.PI*.9))),(t-.5)*hp.h*1.15))}const g=new T.LatheGeometry(pts,20);g.scale(1,1,hp.d/hp.w);part(R,g,p.mP,0,pelY,0,{up:1})}
 part(R,hbTorso(to.w,to.h,to.d,tb,mus,fat),p.mT,0,tBot,0);
 if(mus)for(let r=0;r<3;r++)for(const s of[-1,1]){const a=part(R,hbG('hbSph',()=>new T.SphereGeometry(1,10,8)),p.mT,s*.055,ty-to.h*.05-r*.085,to.d/2-.012,null,0);a.scale.set(.05,.036,.022)}
 // pescoço e cabeça
 const shY=tTop-ua.w*.45,shX=to.w/2+ua.w*(ua.sh?.12:.18),nkB=tTop-.06,nkT=nkB+nk.h+.04;
 {const g=hbLimb(nk.h+.12,nk.r*.95,nk.r*1.12,0,.5,0,12);part(R,g,p.mS,0,nkT+.02,0,null,0)}
 const hc=nkT+hd.h*.44;p.hj.position.set(0,hc,0);p.hs.scale.set(hd.w/.48,hd.h/.528,hd.d/.48);
 part(p.hs,hbHead(),p.mS,0,0,0);
 {const ns=part(p.hs,hbG('nose2',()=>{const g=new T.SphereGeometry(.022,10,8);g.scale(.8,1.1,1);return g}),p.mS,0,-.04,.238,null,0)}
 {const ch=part(p.hs,hbG('chin',()=>new T.SphereGeometry(.05,10,8)),p.mS,0,-.205,.135,null,0);ch.scale.set(1.3,.7,.9)}
 p.hH.scale.set(1,1,1);p.hF.position.z=.045;p.mouth.position.z=.2;p.hOff=hc-1.95;p.hTop=hc+hd.h/2;p.bshape='rb';p.hshape='rb';
 if(S.blush)for(const s of[-1,1]){const bl=part(p.hj,new T.SphereGeometry(.06,8,6),p.mBlush||(p.mBlush=mat(0xff9a9a)),s*hd.w*.3,-hd.h*.1,hd.d/2+.012,null,0);bl.scale.set(1.2,.65,.25)}
 const rt=to.w/2,rbt=rt*tb,avg=(rt+rbt)/2,dep=to.d/2,sx=Math.max(rt/.34,avg/.305),sy=to.h/.6,sz=dep/.238;
 p.tspace.scale.set(sx,sy,sz);p.tspace.position.set(0,ty-1.36*sy,0);p.tq.position.set(0,ty,0);p.pspace.scale.set(hp.w/.6*1.04,1,hp.d/.6*1.12);p.pspace.position.y=pelTop-.06-1.02;
 p.tdim={rt,h:to.h,d:dep,w:to.w,D:to.d,r:Math.max(to.r,.14),tb};
 // braços: deltoide → bíceps → cotovelo → antebraço → punho → mão de 5 dedos
 p.arms.forEach((a,i)=>{const s=i?1:-1,S0=a[0],E=a[1];S0.position.set(s*shX,shY,0);
  const dl=part(S0,hbG('hbSph',()=>new T.SphereGeometry(1,10,8)),p.mT,0,-ua.w*.08,0,{sl:1});dl.scale.set(ua.w*.62*(mus?1.25:1),ua.w*.6*(mus?1.15:1),ua.w*.6*(mus?1.15:1));
  part(S0,hbLimb(ua.l+ua.w*.1,ua.w*.5,ua.w*.4,ua.w*(mus?.12:.06),.45,mus?.25:.12),p.mT,0,0,0,{sl:1});
  E.position.set(0,-ua.l,0);part(E,hbG('hbSph',()=>new T.SphereGeometry(1,10,8)),p.mS,0,0,0,null,0).scale.setScalar(Math.min(fa.w,fa.d)*.46);
  part(E,hbLimb(fa.l,fa.w*.48,fa.w*.32,fa.w*(mus?.12:.07),.28,0),p.mS,0,0,0);
  part(E,hbHand(hn.w,hn.h,hn.d,s),p.mS,0,-fa.l+.005,0,null,0);
  for(const c of E.children)if(c.userData.att)c.position.y=-(fa.l+.03)});
 p.attY=-(fa.l+.03);
 // pernas: coxa (quadríceps) → joelho → panturrilha → tornozelo → calçado
 p.pb=[];p.legs.forEach((l,i)=>{const s=i?1:-1,H=l[0],Kn=l[1];H.position.set(s*S.lg,hipY,0);Kn.position.set(0,-th.l,0);
  part(H,hbLimb(th.l+th.w*.15,th.w*.55,th.w*.38,th.w*(mus?.1:.05),.35,.1),p.mP,0,th.w*.1,0,{up:1});
  part(Kn,hbG('knee'+sh.w,()=>{const g=new T.SphereGeometry(1,10,8);g.scale(sh.w*.46,sh.w*.46,sh.w*.5);return g}),p.mP,0,0,.012,{lo:1},0);
  const cf=part(Kn,hbLimb(sh.l-ft.h*.3,sh.w*.44,sh.w*.3,sh.w*(mus?.12:.08),.3,-.15),p.mP,0,0,0,{lo:1});
  part(Kn,hbShoe(ft.w,ft.h*1.25,ft.l),p.mSh,0,-sh.l-ft.h*.15,ft.l*.12);
  if(p.bootS)part(Kn,hbLimb(sh.l*.32,sh.w*.5,sh.w*.48,0,.5,0),p.mSh,0,-sh.l*.66,0,null,0);
  const b=part(Kn,hbLimb(sh.l*.62,sh.w*.56,sh.w*.5,0,.5,0),p.mSh,0,-sh.l*.36,0);b.visible=false;p.pb.push(b)});
 p.root.scale.setScalar(p.h0);p.bodyI=bi}
const _buildBody0=buildBody;buildBody=function(p,bi){const B=BODIES[bi]||BODIES[0];if(B.s.box)return _buildBody0(p,bi);try{return buildBody2(p,bi)}catch(e){if(!buildBody.w){buildBody.w=1;console.warn('corpo novo indisponível neste aparelho, usando o anterior: '+(e&&e.message))}while(p.bm.length){const m=p.bm.pop();if(m.parent)m.parent.remove(m)}return _buildBody0(p,bi)}};

