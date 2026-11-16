// ---------------- dispatcher + tabelas ----------------
const LWS={lray:lRay,lblade:lBlades,lflash:lFlash,lprison:lPrison,ljudg:lJudg,lsun:lSun,alance:aLance,adrag:aDragon,aprison:aPrison,avort:aVortex,aocean:aOcean,atsu:aTsunami,nup:nUpper,nwave:nWave,uwing:uWing,umet:uMeteor,fswing:fSwing};
GR.luz.s=[['Light: Divine Ray',8,30,'lray',null,1],["Light: Solar Blades",16,16,'lblade',null,7],['Light: Flash Step',12,26,'lflash',null,5],['Light: Radiant Prison',22,22,'lprison',null,14],["Light: Heaven's Judgment",32,32,'ljudg',null,22],['Light: Absolute Sun',48,150,'lsun',null,45]];
GR.agua.s=[['Water: Water Dragon',18,50,'adrag',null,8],['Water: Aqua Lance',8,28,'alance',null,1],['Water: Tidal Prison',22,12,'aprison',null,14],['Water: Hydro Vortex',24,10,'avort',null,16],['Water: Ocean Dominion',34,70,'aocean',null,24],['Water: Abyssal Tsunami',52,160,'atsu',null,50]];
GR.luz.p={t:'Luz Sagrada: recupera vida aos poucos. Especialidade: feixes de longo alcance, velocidade e prisões de luz',hpr:1.5};
GR.agua.p={t:'Fluxo: mana regenera mais rápido. Especialidade: controle de área, prisões e ondas',reg:4};
GR.fogo.s[4]=['Magna: Flame Swing Breaker',22,34,'fswing',null,10];
GR.nenhum.s.push(['Uppercut Ascendente',0,30,'nup',null,3],['Punho Sísmico',0,38,'nwave',null,6]);
// a União de Liebe troca as duas últimas magias (antes: as mesmas da Anti-Magia com mais dano) por formas de combate próprias
GR.anti.ss[4]=['Devil Union: Demon Wing Tempest',20,40,'uwing',null,10,12];GR.anti.ss[5]=["Devil Union: Liebe's Black Meteor",40,140,'umet',null,26,20];
const LWN={};for(const id of['luz','agua','nenhum','anti','fogo'])for(const s of(GR[id].s.concat(GR[id].ss||[])))if(LWS[s[3]])LWN[s[0]]=s[3];
function lwCast(t,d){const s=t=='uwing'||t=='umet';if(s){try{uCost(t=='uwing'?12:20)}catch(e){}}LWS[t](lwA(),d)}
// outro jogador lançou: reproduz a mesma cena (visual, sem dano) a partir da posição e direção dele
function lwRemote(o,c){const t=LWN[c&&c.nm];if(!t)return false;const f=+c.f||0;try{LWS[t]({x:o.x,z:o.z,f,dx:Math.sin(f),dz:Math.cos(f),rem:1,p:c.p,o},0)}catch(e){}return true}

// ================= ANIMAÇÕES (V74): parado, caminhada, corrida, pulo, queda, aterrissagem, dano, defesa e derrota =================
// a fase do passo avança com a velocidade real (os pés não deslizam), há transição suave entre parado/andar/correr,
// impacto ao aterrissar, recuo ao levar dano, guarda com escudo ativo e queda ao ser derrotado.
function anim(p,t,mv,air){const L=p.legs,A=p.arms,r=p.root;if(!L||!A||!r)return;const s=p._an||(p._an={ph:0,lt:t,mv:0,air:0,land:0,wa:0});let dt=t-s.lt;s.lt=t;if(!(dt>0)||dt>.2)dt=.016;
 const me=p===PP;s.mv+=(mv-s.mv)*Math.min(1,dt*12);if(mv<.03&&s.mv<.04)s.mv=0;const m=s.mv;
 if(me&&P.dead>0){const q=Math.min(1,(t-(P.deadT0||t))/.9),e=q*q*(3-2*q),k2=Math.min(1,q*2);
  L[0][0].rotation.x=-.3*k2;L[1][0].rotation.x=-.15*k2;L[0][1].rotation.x=.9*k2*(1-e*.6);L[1][1].rotation.x=.6*k2*(1-e*.6);
  A[0][0].rotation.x=-.4*e;A[1][0].rotation.x=-.9*e;A[0][1].rotation.x=-.2;A[1][1].rotation.x=-.3;A[0][0].rotation.z=.08+.9*e;A[1][0].rotation.z=-.08-.6*e;
  r.rotation.set(-1.45*e,0,.12*e);r.position.y=-.25*k2*(1-e)+.12*e;return}
 if(air){s.air+=dt;s.wa=1;const vy=me?P.vy:0,fall=vy<-1?Math.min(1,(-vy-1)/8):0,rise=1-fall,fl=Math.sin(t*14)*.08*fall;
  L[0][0].rotation.x=-1*rise-.35*fall;L[0][1].rotation.x=1.3*rise+.35*fall;L[1][0].rotation.x=.3*rise+.25*fall;L[1][1].rotation.x=.7*rise+.2*fall;
  A[0][0].rotation.x=-1.3*rise-.4*fall;A[1][0].rotation.x=-.5*rise-.4*fall;A[0][1].rotation.x=-.7*rise-.3*fall;A[1][1].rotation.x=-.9*rise-.3*fall;
  A[0][0].rotation.z=.08+.75*fall+fl;A[1][0].rotation.z=-.08-.75*fall-fl;r.position.y=0;r.rotation.set(.08*rise-.1*fall,0,0);return}
 if(s.wa){s.wa=0;if(s.air>.16)s.land=Math.min(.32,.12+s.air*.25);s.air=0}
 const run=m>1.05,k=Math.min(1,m),rate=m<.03?0:(run?8.5+Math.min(1,(m-1)/.3)*4:8.5*Math.max(.45,k));s.ph+=dt*rate;
 const ph=s.ph,sn=Math.sin(ph),c=Math.cos(ph),amp=(run?.95:.62)*k,iw=Math.max(0,1-m/.14),ww=1-iw,b=Math.sin(t*2.1),b2=Math.sin(t*.7);
 // pernas: coxa balança, joelho dobra na fase de balanço; parado: peso alterna levemente entre as pernas
 L[0][0].rotation.x=-sn*amp*ww;L[1][0].rotation.x=sn*amp*ww;
 L[0][1].rotation.x=((Math.max(0,c)*(run?1.5:.85)+.08)*k)*ww+iw*.06*Math.max(0,b2);L[1][1].rotation.x=((Math.max(0,-c)*(run?1.5:.85)+.08)*k)*ww+iw*.06*Math.max(0,-b2);
 // braços: opostos às pernas; parado: respiração e balanço suave
 A[0][0].rotation.x=sn*(run?.95:.5)*k*ww+iw*(.04*b-.02);A[1][0].rotation.x=-sn*(run?.95:.5)*k*ww+iw*(.04*b+.03);
 A[0][1].rotation.x=(-(run?1.35:.35)-Math.max(0,-sn)*.3*k)*ww+iw*(-.18-.05*b);A[1][1].rotation.x=(-(run?1.35:.35)-Math.max(0,sn)*.3*k)*ww+iw*(-.18-.05*b);
 A[0][0].rotation.z=.08+(run?.12:.04)*ww+iw*.02*b;A[1][0].rotation.z=-.08-(run?.12:.04)*ww-iw*.02*b;
 // tronco: sobe e desce duas vezes por passo, gira o quadril com a passada, inclina ao correr; parado: respira e troca o peso
 r.position.y=(1-Math.abs(sn))*(run?.085:.035)*k*ww+iw*.012*b;r.rotation.set((run?.2:.05)*k*ww,sn*.07*k*ww,sn*.035*k*ww+iw*.025*b2);
 // aterrissagem: joelhos absorvem o impacto
 if(s.land>0){s.land-=dt;const q=Math.min(1,s.land/.2);for(let i=0;i<2;i++){L[i][0].rotation.x-=.55*q;L[i][1].rotation.x+=1.05*q}r.position.y-=.15*q;r.rotation.x+=.22*q;A[0][0].rotation.z+=.35*q;A[1][0].rotation.z-=.35*q}
 if(!me)return;
 // guarda (escudo/fortaleza ativos): braços cruzados na frente do peito
 if(P.sh>0&&!P.ps){const g=Math.min(1,P.sh*3);A[0][0].rotation.x=-1.25*g+A[0][0].rotation.x*(1-g);A[1][0].rotation.x=-1.25*g+A[1][0].rotation.x*(1-g);A[0][1].rotation.x=-1.5*g;A[1][1].rotation.x=-1.5*g;A[0][0].rotation.z=-.45*g+.08*(1-g);A[1][0].rotation.z=.45*g-.08*(1-g)}
 // recuo ao levar dano
 if(P.hitf>0){P.hitf-=dt;const q=Math.max(0,P.hitf/.28);r.rotation.x-=.3*q;r.position.y-=.04*q;A[0][0].rotation.x-=.5*q;A[1][0].rotation.x-=.5*q}
 // conjuração: partículas do próprio elemento saindo das mãos
 if(P.ps&&P.g&&CFG.parts)castFx(dt)}
const CFX={fogo:[0xff6a1a,0xffd040,0,3],agua:[0x7af0ff,0xffffff,6,0],luz:[0xfff2a0,0xffffff,0,1.5],vento:[0x7de0b5,0xffffff,0,.5],anti:[0x1a1a1a,0xff2040,0,.8],tempo:[0xffd75a,0xfff6c8,0,.6],kotodama:[0x8a2be2,0xffffff,0,.6],sangue:[0xc0102a,0x5a0010,6,0],sonhos:[0xb06aff,0xffc0ff,0,1],espacial:[0x3a8aff,0xffffff,0,0],sombra:[0x5a2a8a,0x1a0a2a,0,.6],nenhum:[0xdddddd,0xffffff,0,.3]};
const _cfv=new T.Vector3();
function castFx(dt){const c=CFX[P.g.id]||CFX.nenhum;if(Math.random()>.5*KQ())return;try{const i=Math.random()<.5?0:1,E=PP.arms[i][1];_cfv.set(0,PP.attY||-.38,0);E.localToWorld(_cfv);fxp({x:_cfv.x,y:_cfv.y,z:_cfv.z,c:Math.random()<.6?c[0]:c[1],n:1,sp:.8,sz:.1,life:.4,g:c[2],up:c[3]})}catch(e){}}
// poses de conjuração próprias de Luz, Terra e Água (e dos golpes novos)
const NPOSE={
 lcast:(u,A,L,r,sg)=>{const w=sg(0,.3),b=sg(.7,1),k=1-b;A[1][0].rotation.x=-1.55*w*k;A[1][1].rotation.x=-.1*k;A[0][0].rotation.x=-1.1*w*k;A[0][0].rotation.z=.08+.5*w*k;A[1][0].rotation.z=-.08-.15*w*k;r.rotation.y+=-.25*w*k;L[0][0].rotation.x+=-.25*w*k;L[1][0].rotation.x+=.2*w*k},
 lsky:(u,A,L,r,sg)=>{const w=sg(0,.35),b=sg(.75,1),k=1-b;for(const a of A){a[0].rotation.x=-2.75*w*k;a[1].rotation.x=-.1*k}A[0][0].rotation.z=.08-.55*w*k;A[1][0].rotation.z=-.08+.55*w*k;r.rotation.x+=-.18*w*k},
 tstomp:(u,A,L,r,sg)=>{const up=sg(0,.3),dn=sg(.3,.42),b=sg(.75,1),k=1-b;L[1][0].rotation.x=-1.4*up*(1-dn)*k;L[1][1].rotation.x=1.5*up*(1-dn)*k;for(const a of A){a[0].rotation.x=(-.9*up-.2*dn)*k;a[1].rotation.x=-1.6*k}r.position.y+=(.06*up*(1-dn)-.16*dn)*k;r.rotation.x+=.2*dn*k},
 tpunch:(u,A,L,r,sg)=>{const w=sg(0,.3),f=sg(.3,.45),b=sg(.72,1),k=1-b;r.rotation.y+=(.45*w-.7*f)*k;A[1][0].rotation.x=(.6*w-2.2*f)*k;A[1][1].rotation.x=(-1.8*w*(1-f)-.05*f)*k;A[0][0].rotation.x=(-.9*w+.5*f)*k;A[0][1].rotation.x=-1.5*k;L[0][0].rotation.x+=-.5*f*k;L[1][0].rotation.x+=.35*f*k;r.position.y+=-.06*f*k},
 aflow:(u,A,L,r,sg)=>{const k=1-sg(.8,1),a=u*Math.PI*2;A[1][0].rotation.x=(-1.1-.6*Math.sin(a))*k;A[1][0].rotation.z=-.08-.6*Math.cos(a)*k;A[0][0].rotation.x=(-1.1-.6*Math.sin(a+Math.PI))*k;A[0][0].rotation.z=.08+.6*Math.cos(a+Math.PI)*k;for(const q of A)q[1].rotation.x=-.5*k;r.rotation.y+=.3*Math.sin(a)*k},
 awave:(u,A,L,r,sg)=>{const cr=sg(0,.3),up=sg(.3,.55),b=sg(.78,1),k=1-b;for(let i=0;i<2;i++){L[i][0].rotation.x+=-.6*cr*(1-up)*k;L[i][1].rotation.x+=1.1*cr*(1-up)*k;A[i][0].rotation.x=(.4*cr-2.4*up)*k;A[i][1].rotation.x=-.2*k}r.position.y+=-.16*cr*(1-up)*k;r.rotation.x+=(.3*cr-.35*up)*k},
 upper:(u,A,L,r,sg)=>{const cr=sg(0,.25),up=sg(.25,.45),b=sg(.75,1),k=1-b;for(let i=0;i<2;i++){L[i][0].rotation.x+=-.5*cr*(1-up)*k;L[i][1].rotation.x+=.9*cr*(1-up)*k}A[1][0].rotation.x=(.5*cr-2.9*up)*k;A[1][1].rotation.x=-1.2*cr*(1-up)*k;A[0][0].rotation.x=-.8*k;A[0][1].rotation.x=-1.6*k;r.position.y+=-.12*cr*(1-up)*k;r.rotation.x+=(.25*cr-.2*up)*k}};
const _applyPose0=applyPose;applyPose=function(n,u,e){const f=NPOSE[n];if(f){const sm=x=>x<=0?0:x>=1?1:x*x*(3-2*x);return f(u,PP.arms,PP.legs,PP.root,(a,b)=>sm((u-a)/(b-a)))}return _applyPose0(n,u,e)};
Object.assign(POSD,{lcast:.55,lsky:1,tstomp:.7,tpunch:.6,aflow:.8,awave:.9,upper:.5});Object.assign(DEL,{lcast:.12,lsky:.2,tstomp:.26,tpunch:.2,aflow:.2,awave:.25,upper:.12});
Object.assign(ANI,{'Light: Divine Ray':'lcast','Light: Solar Blades':'lsky','Light: Flash Step':'dash','Light: Radiant Prison':'lcast',"Light: Heaven's Judgment":'lsky','Light: Absolute Sun':'lsky',
 'Earth: Earth Spear':'tstomp','Earth: Stone Fortress':'tstomp','Earth: Titan Fist':'tpunch','Earth: Crystal Prison':'push','Earth: Earthquake Dominion':'slam','Earth: Mountain Breaker':'raise',
 'Water: Water Dragon':'aflow','Water: Aqua Lance':'throw','Water: Tidal Prison':'aflow','Water: Hydro Vortex':'aflow','Water: Ocean Dominion':'awave','Water: Abyssal Tsunami':'awave',
 'Uppercut Ascendente':'upper','Magna: Flame Swing Breaker':'spin','Punho Sísmico':'slam','Devil Union: Demon Wing Tempest':'spin',"Devil Union: Liebe's Black Meteor":'raise'});

// ================= TRANSFORMAÇÃO DE CORPO INTEIRO (V74) =================
// 1) identifica o esqueleto (cabeça, tronco, braços, antebraços, coxas, canelas) de QUALQUER corpo do jogo;
// 2) mede cada segmento (raio e comprimento reais da malha); 3) adapta as peças demoníacas a essas medidas;
// 4) presas às articulações → acompanham a animação; 5) troca o material de TODAS as malhas do corpo
// (pele, roupa, cabelo, olhos), então nenhuma região fica sem transformação; 6) desfaz tudo ao sair.
const DSK={liebe:{sk:0x231a1e,cl:0x0a0408,hr:0xf0eef2,ey:0xff2030,sc:0x050003,ac:0xff2040},
 canis:{sk:0x2a2236,cl:0x14081f,hr:0x1a1024,ey:0x7af0ff,sc:0x05030a,ac:0x9a6aff},equus:{sk:0x262a3a,cl:0x0c0e1c,hr:0x1a1e30,ey:0x8ab0ff,sc:0x03040a,ac:0x8ab0ff},
 felis:{sk:0x2c2238,cl:0x0c0614,hr:0x24123a,ey:0xd8c0ff,sc:0x05030a,ac:0xd8c0ff},gallus:{sk:0x2a1a20,cl:0x0c0614,hr:0x3a0a12,ey:0xff4050,sc:0x0a0204,ac:0xff2a3a},
 quatro:{sk:0x261c30,cl:0x0a0612,hr:0x1a0e26,ey:0xb070ff,sc:0x05030a,ac:0xb070ff},zagred:{sk:0xd6cfe0,cl:0x2a1040,hr:0xf2f0ff,ey:0xffd0ff,sc:0x1a0a2a,ac:0xb06aff}};
const _dsM=new T.Matrix4(),_dsB=new T.Box3();
function dsSkel(L){return{head:L.hs||L.hj||null,hj:L.hj||null,torso:L.tspace||L.root,root:L.root,arms:(L.arms||[]).filter(a=>a&&a[0]),legs:(L.legs||[]).filter(l=>l&&l[0])}}
// mede a malha própria de um segmento (sem descer para a próxima articulação nem pegar peças de forma/espada)
function dsMeasure(J,stop,def){const out={r:def[0],len:def[1],minY:-def[1],maxY:0,maxZ:def[0],ok:0};try{if(!J||!J.matrixWorld||!_dsM.copy)return out;J.updateMatrixWorld(true);_dsM.copy(J.matrixWorld).invert();let any=false;const box=new T.Box3();
  const walk=o=>{for(const c of o.children){if(stop.has(c)||(c.userData&&(c.userData.stage||c.userData.ds||c.userData.att)))continue;if(c.isMesh&&c.geometry&&c.material!==olm&&c.visible!==false){if(!c.geometry.boundingBox)c.geometry.computeBoundingBox();const bb=c.geometry.boundingBox;if(bb&&isFinite(bb.min.x)){_dsB.copy(bb).applyMatrix4(new T.Matrix4().multiplyMatrices(_dsM,c.matrixWorld));box.union(_dsB);any=true}}walk(c)}};walk(J);
  if(any&&isFinite(box.min.y)&&isFinite(box.max.y)){const rx=(box.max.x-box.min.x)/2,rz=(box.max.z-box.min.z)/2,r=Math.max(.03,Math.min(.4,(rx+rz)/2)),len=Math.max(.08,Math.min(1.4,box.max.y-box.min.y));if(isFinite(r)&&isFinite(len)){out.r=r;out.len=len;out.minY=box.min.y;out.maxY=box.max.y;out.maxZ=box.max.z;out.ok=1}}}catch(e){}return out}
function dsAnalyze(L){const K=dsSkel(L),stop=new Set();K.arms.forEach(a=>{if(a[1])stop.add(a[1])});K.legs.forEach(l=>{if(l[1])stop.add(l[1])});if(K.hj)stop.add(K.hj);
 const M={K,ua:K.arms.map(a=>dsMeasure(a[0],stop,[.085,.32])),fa:K.arms.map(a=>a[1]?dsMeasure(a[1],stop,[.075,.36]):null),th:K.legs.map(l=>dsMeasure(l[0],stop,[.1,.4])),sh:K.legs.map(l=>l[1]?dsMeasure(l[1],stop,[.085,.45]):null)};
 M.tw=(L.tdim&&L.tdim.w)||.6;M.td=(L.tdim&&L.tdim.D)||.4;M.neckY=K.hj?K.hj.position.y-.27:1.68;M.hipY=K.legs[0]?K.legs[0][0].position.y:.95;M.hipX=K.legs[0]?Math.abs(K.legs[0][0].position.x):.12;return M}
function dsMat(orig,col,em,cache){if(!orig)return orig;let m=cache.get(orig);if(m)return m;try{m=orig.clone();if(m.color)m.color.setHex(col);if(em!=null&&m.emissive)m.emissive.setHex(em);if(m.map)m.map=null;m.needsUpdate=true}catch(e){m=new T.MeshBasicMaterial({color:col})}cache.set(orig,m);return m}
function dSkin(fk,L,F){const C=DSK[fk]||DSK.liebe,M=dsAnalyze(L),K=M.K,cache=new Map(),swapped=[],parts=[],reg={};const tag=(m,st)=>{m.userData.ds=1;m.userData.stage=st;m.userData.bs=[m.scale.x,m.scale.y,m.scale.z];parts.push(m);return m};
 const mark=k=>reg[k]=1,GM=(c,o)=>{const m=GLM(c,o);return m},bone=new T.MeshBasicMaterial({color:0xe8dcc8});
 // --- (a) troca de material em todas as malhas do corpo
 const roleOf=(mesh,mt)=>{if(mt===L.mS)return'sk';if(mt===L.mH||mt===L.mB||mt===L.mBs)return'hr';if(mt===L.mE)return'ey';if(mt===L.mW2)return'sc';if(mt===L.mBlush)return'sk';return'cl'};
 const inside=(o,J)=>{for(let p=o;p;p=p.parent)if(p===J)return true;return false};
 L.root.traverse(o=>{if(!o.isMesh||!o.material||o.material===olm)return;for(let p=o;p&&p!==L.root;p=p.parent)if(p.userData&&(p.userData.att||p.userData.stage||p.userData.ds))return;const mt=o.material;if(Array.isArray(mt))return;const ro=roleOf(o,mt);
  const nm=ro=='sk'?dsMat(mt,C.sk,new T.Color(C.ac).multiplyScalar(.1).getHex(),cache):ro=='hr'?dsMat(mt,C.hr,null,cache):ro=='ey'?dsMat(mt,C.ey,C.ey,cache):ro=='sc'?dsMat(mt,C.sc,null,cache):dsMat(mt,C.cl,null,cache);
  swapped.push([o,mt]);o.material=nm;
  if(K.head&&inside(o,K.head))mark('cabeça');if(L.fg&&inside(o,L.fg))mark('rosto');if(ro=='ey')mark('olhos');if(ro=='hr')mark('cabelos');
  K.arms.forEach((a,i)=>{if(a[1]&&inside(o,a[1])){mark('antebraços');if(o.position.y<-(M.fa[i]?M.fa[i].len*.8:.3))mark('mãos')}else if(inside(o,a[0]))mark('braços')});
  K.legs.forEach(l=>{if(l[1]&&inside(o,l[1]))mark('pernas');else if(inside(o,l[0]))mark('quadril')})});
 if(L.eyes&&L.eyes.length)mark('olhos');if(!L.hg||!L.hg.children.length)mark('cabelos');
 // --- (b) peças adaptadas às medidas: ombreiras, marcas nos braços/pernas, garras, joelheiras, garras dos pés, colar, selo no peito, espinhos nas costas, cinturão
 const plate=(r)=>new T.Mesh(lwG('dsCap',()=>new T.SphereGeometry(1,12,8,0,6.2832,0,1.4)),dsMat(L.mT||L.mS,C.cl,null,cache));
 K.arms.forEach((a,i)=>{const s=i?1:-1,u=M.ua[i],f=M.fa[i];const pa=tag(plate(),'arms');pa.scale.set(u.r*1.65,u.r*1.3,u.r*1.65);pa.position.set(0,u.r*.25,0);a[0].add(pa);
  const rim=tag(new T.Mesh(lwTor(),GM(C.ac,.85)),'arms');rim.rotation.x=Math.PI/2;rim.scale.set(u.r*1.6,u.r*1.6,1);rim.position.y=-u.r*.05;a[0].add(rim);
  for(const z of[1,-1]){const ln=tag(new T.Mesh(lwG('dsLine',()=>new T.PlaneGeometry(1,1)),GM(C.ac,.75)),'arms');ln.scale.set(.018,u.len*.75,1);ln.position.set(s*u.r*.25,-(u.len*.5),z*(u.r*1.04));if(z<0)ln.rotation.y=Math.PI;a[0].add(ln)}mark('ombros');mark('braços');
  if(a[1]&&f){for(const z of[1,-1]){const ln=tag(new T.Mesh(lwG('dsLine'),GM(C.ac,.75)),'arms');ln.scale.set(.016,f.len*.6,1);ln.position.set(0,f.minY*.45,z*(f.r*1.06));if(z<0)ln.rotation.y=Math.PI;a[1].add(ln)}mark('antebraços');
   const bd=tag(new T.Mesh(lwTor(),dsMat(L.mT||L.mS,C.cl,null,cache)),'arms');bd.rotation.x=Math.PI/2;bd.scale.set(f.r*1.25,f.r*1.25,1.6);bd.position.y=f.minY*.55;a[1].add(bd);
   for(let k=0;k<4;k++){const cl=tag(new T.Mesh(lwG('dsClaw',()=>new T.ConeGeometry(.016,.11,4)),bone),'arms');cl.rotation.x=Math.PI;cl.position.set((k-1.5)*f.r*.42,f.minY-.035,f.r*.35);a[1].add(cl)}mark('dedos');mark('mãos')}});
 K.legs.forEach((l,i)=>{const t=M.th[i],sh=M.sh[i];for(const z of[1,-1]){const ln=tag(new T.Mesh(lwG('dsLine'),GM(C.ac,.7)),'back');ln.scale.set(.02,t.len*.6,1);ln.position.set(0,-t.len*.5,z*t.r*1.05);if(z<0)ln.rotation.y=Math.PI;l[0].add(ln)}mark('pernas');
  if(l[1]&&sh){const kn=tag(plate(),'back');kn.scale.set(sh.r*1.25,sh.r*1.1,sh.r*.9);kn.rotation.x=Math.PI/2;kn.position.set(0,0,sh.r*.55);l[1].add(kn);mark('joelhos');
   const gr=tag(new T.Mesh(lwTor(),GM(C.ac,.75)),'back');gr.rotation.x=Math.PI/2;gr.scale.set(sh.r*1.15,sh.r*1.15,1);gr.position.y=sh.minY*.55;l[1].add(gr);
   for(let k=0;k<3;k++){const tl=tag(new T.Mesh(lwG('dsClaw'),bone),'back');tl.rotation.x=Math.PI/2;tl.position.set((k-1)*sh.r*.45,sh.minY+.03,sh.maxZ+.02);l[1].add(tl)}mark('pés')}});
 const tor=K.root,neck=tag(new T.Mesh(lwTor(),dsMat(L.mT||L.mS,C.cl,null,cache)),'torso');neck.rotation.x=Math.PI/2;neck.scale.set(M.tw*.24,M.tw*.24,2.2);neck.position.y=M.neckY;tor.add(neck);mark('pescoço');
 const sig=tag(new T.Mesh(lwG('dsSig',()=>new T.RingGeometry(.7,1,24)),GM(C.ac,.85)),'torso');sig.scale.setScalar(M.tw*.16);sig.position.set(0,M.neckY-.28,M.td*.52+.01);tor.add(sig);
 const sl=tag(new T.Mesh(lwG('dsLine'),GM(C.ac,.85)),'torso');sl.scale.set(.02,.34,1);sl.position.set(0,M.neckY-.42,M.td*.52+.012);tor.add(sl);mark('peito');mark('abdômen');
 for(let k=0;k<4;k++){const sp=tag(new T.Mesh(lwG('dsSpine',()=>new T.ConeGeometry(.035,.12,4)),dsMat(L.mT||L.mS,C.cl,null,cache)),'back');sp.rotation.x=-Math.PI/2;sp.position.set(0,M.neckY-.1-k*.13,-M.td*.52-.03);tor.add(sp)}mark('costas');
 const belt=tag(new T.Mesh(lwTor(),GM(C.ac,.7)),'torso');belt.rotation.x=Math.PI/2;belt.scale.set(M.hipX+.12,M.td*.62,1.4);belt.position.y=M.hipY+.06;tor.add(belt);mark('quadril');
 // --- (c) adapta as peças da forma (naForm) às medidas: braços/pernas mais grossos ou finos recebem peças proporcionais
 if(F&&F.parts)F.parts.forEach(p=>{const par=p.parent;let k=null;K.arms.forEach((a,i)=>{if(par===a[0])k=M.ua[i].r/.085;else if(par===a[1]&&M.fa[i])k=M.fa[i].r/.075});K.legs.forEach((l,i)=>{if(par===l[0])k=M.th[i].r/.1;else if(par===l[1]&&M.sh[i])k=M.sh[i].r/.085});if(k&&isFinite(k)){k=Math.max(.7,Math.min(1.9,k));const b=p.userData.bs||[1,1,1];p.userData.bs=[b[0]*k,b[1],b[2]*k];p.scale.set(p.userData.bs[0],b[1],p.userData.bs[2])}});
 ['cabeça','rosto'].forEach(k=>{if(K.head)mark(k)});
 const R={parts,reg,M,undo:()=>{swapped.forEach(([o,mt])=>{o.material=mt});swapped.length=0;cache.forEach(m=>{try{m.dispose()}catch(e){}});cache.clear();parts.forEach(p=>{if(p.parent)p.parent.remove(p)})}};
 if(F&&F.parts)parts.forEach(p=>F.parts.push(p));return R}
const DSREG=['cabeça','rosto','olhos','cabelos','pescoço','ombros','peito','costas','braços','antebraços','mãos','dedos','abdômen','quadril','pernas','joelhos','pés'];
function dsCover(sk){return DSREG.filter(k=>!(sk&&sk.reg[k]))}
const _naForm0=naForm;naForm=function(fk,L){const F=_naForm0(fk,L);try{const sk=dSkin(fk,L||PP,F);F.skin=sk;const d0=F.detach;F.detach=()=>{try{sk.undo()}catch(e){}d0()}}catch(e){}return F};

