// ---------- Magias ----------
function proj(dx,dz,dmg,r,big,ef,name){const f=MK[name],m=f?f():orb(P.g.c,.4),u=m.userData||{};m.position.set(P.x+dx*.8,1.3,P.z+dz*.8);m.rotation.y=P.f;S.add(m);const v=u.sp||(big?16:24);
 shots.push({el:P.g.id,m,vx:dx*v,vz:dz*v,dx,dz,life:u.life||1.6,dmg,r,big,ef,spin:u.spin,rx:u.rx,wave:u.wave,w:u.w,pull:u.pull,bob:u.bob,tr:u.tr,ts:u.ts,tg:u.tg,tu:u.tu,ty:u.ty,hit:new Set()})}
function ring(r,c,x,z){const m=new T.Mesh(new T.RingGeometry(.5,1,24),new T.MeshBasicMaterial({color:c,side:T.DoubleSide,transparent:true}));m.rotation.x=-Math.PI/2;m.position.set(x==null?P.x:x,.2,z==null?P.z:z);S.add(m);fx.push({m,r,t:0})}
function qTarget(e){if(!Q.id||!Q.on||e.dummy)return false;const q=QS[Q.id];return q.kind=='boss'?(!!e.boss&&e.bt2===q.boss):q.kind=='kill'?e.qid===Q.id:false}
function hitE(e,d,ef){if(e.L){e.fl=.13;for(const m of[e.L.mT,e.L.mP,e.L.mS,e.L.mH,e.L.mC])if(m&&m.emissive)m.emissive.setHex(0x8a5050)}if(!e.dummy)e.ag=1;P.tg=e;const cr=Math.random()<.05+P.st.agi*.01;if(cr)d*=1.8;if(e.scp)d*=e.scp;if(e.xmk>0)d*=1.25;e.hp-=d;if(e.rb&&MP.r){MP.bhN=(MP.bhN||0)+1;MP.bh=(MP.bh||[]).concat({n:MP.bhN,id:e.bid,d:Math.round(d)}).slice(-10);e.hit=1}dmgNum(e.x,2.3,e.z,d,cr);e.m.scale.setScalar(1.15);if(e.sp!=null)P.xp[e.sp]++;if(ef&&ef.tr){trAdd(ef.tr);chronoHit(e)}if(ef){const du=1+cb('dur');if(ef.b)e.bt=3*du;if(ef.sl)e.sl=2.5*du;if(ef.st)e.st=ef.st*du}}

// mira assistida: vira o personagem para o inimigo mais adequado à frente (mais forte no celular)
function aimAssist(range){let best=null,bs=1e9;const cone=touch?1.3:.45;for(const e of enemies){if(e.hp<=0)continue;const dx=e.x-P.x,dz=e.z-P.z,d=Math.hypot(dx,dz);if(d>range)continue;let a=Math.atan2(dx,dz)-P.f;a=Math.abs(Math.atan2(Math.sin(a),Math.cos(a)));if(a>cone&&d>3)continue;const sc=d+a*6-(qTarget(e)||e.boss?5:0)-(e===P.tg?3:0);if(sc<bs){bs=sc;best=e}}if(best){P.f=Math.atan2(best.x-P.x,best.z-P.z);P.tg=best}return best}
const SKL=[1,5,10,15,25,40]; // referência; cada grimório usa sklOf(id) // nível necessário para cada habilidade do grimório (1ª, 2ª, 3ª, 4ª)
let ALT=()=>!!(P.g&&(P.sy||(P.union&&P.g.id=='anti')||(P.nacht&&P.g.id=='sombra')));let ENG=()=>P.sy?(P.se||0):P.nacht?(P.ne||0):(P.de||0);
function cast(i,ph){if(P.dead>0)return;if(CS.on||ENC.on&&ENC.mode!='battle')return;if(POS.on){toast('😈 '+DPS[POS.k].n+' está controlando seu corpo!');return}if(!ph&&xIntercept(i))return;if(!run||!P.g||(!ph&&!P.on)||(ph?P.cd2[i]:P.cd[i])>0)return;const G=ph?GR.nenhum:P.g,s=(!ph&&ALT()&&G.ss?G.ss:G.s)[i],t=s[3],ef=s[4],nm=s[0];if(P.lv<(ph?sklOf('nenhum'):sklOf(G.id))[i]){toast('🔒 '+nm+' desbloqueia no Nível '+(ph?sklOf('nenhum'):sklOf(G.id))[i]+' (você está no '+P.lv+').');return}
 if(!ph&&locked()){toast('Você nasceu sem magia: não consegue usar os poderes de '+P.g.n);return}
 if(!ph&&P.g.id=='anti'&&!P.sword){toast('Saque a espada para usar a Anti-Magia');return}
 if(!ph&&t=='fsoul'&&!fSoulTarget())return;
 if(!ph&&XT.includes(t)&&!xPre(t))return;
 if(!ph&&ALT()&&s[6]&&ENG()<s[6]){toast((P.sy?'Energia espiritual':'Energia demoníaca')+' insuficiente ('+s[6]+')');return}
 const useTR=false;if(!useTR&&P.mp<mcost(s)){toast(P.g.id=='anti'?'Anti-Magia insuficiente':'Mana insuficiente');return}
 if(!['accel','rewind','klegion','kdom','taccel','treq','wrun','wtemp','sdive','stemp','aph','aerup','aann','uover','uking','fchain','fsoul','sgguard','soglam','soparade','esgate','esdom','nagimo','nacontr','naunion','nusig','mtag','sorep','wcyc','scyc','sgcath','nsdom','kcmd','nf6'].includes(t))aimAssist(22);if(useTR)trAdd(-s[1]);else{P.mp-=mcost(s);P.lcast=4};const cdv=(s[5]||.5)*(1-cb('cdr'));P.cdm=P.cdm||[.5,.5,.5,.5,.5,.5];if(ph)P.cd2[i]=.5*(1-cb('cdr'));else{P.cd[i]=cdv;P.cdm[i]=cdv;P.xp[i]++}e_last=i;const d=s[2]*(ph?1.5:(1+.25*(lvl(i)-1))*(1+(pas().dmg||0)))*(1+cb(ph||P.g.id=='nenhum'?'pdmg':'mdmg'))*(P.union?1.8:1)*(P.zg||P.bz?1.25:1)*(!ph&&P.sy?1.3:1)*(ph?1:xDmg())*(ph||P.g.id=='nenhum'||P.g.id=='anti'?1+P.st.for*.05:1+P.st.mag*.05)*(1+(P.lv-1)*.04),dx=Math.sin(P.f),dz=Math.cos(P.f),pose=ANI[nm]||'throw',col=ph?0xdddddd:P.g.c;startPose(pose);const pel=ph?'nenhum':P.g.id;burst(pel,P.x+dx*.5,1.6,P.z+dz*.5,14,3);MP.castN++;MP.cast={n:MP.castN,nm,el:pel,f:+P.f.toFixed(2)};
 const near=(r,f)=>{pvpHit(P.x,P.z,r,d);for(const e of enemies)if(Math.hypot(e.x-P.x,e.z-P.z)<r){e.sp=i;f(e)}},cut=r=>{for(let k=eshots.length-1;k>=0;k--){const q=eshots[k];if(Math.hypot(q.m.position.x-P.x,q.m.position.z-P.z)<r){fxp({x:q.m.position.x,y:1.3,z:q.m.position.z,c:0xffffff,n:8,sp:3,sz:.25,life:.4});S.remove(q.m);eshots.splice(k,1)}}},front=(e,w)=>{let a=Math.atan2(e.x-P.x,e.z-P.z)-P.f;a=Math.atan2(Math.sin(a),Math.cos(a));return Math.abs(a)<w},line=(e,len,wd)=>{const rx=e.x-P.x,rz=e.z-P.z,al=rx*dx+rz*dz,pp=Math.abs(rx*dz-rz*dx);return al>0&&al<len&&pp<wd};
 tmr.push({t:DEL[pose]||.12,f:()=>{const tx=P.x+dx*12,tz=P.z+dz*12;
 if(t=='proj')proj(dx,dz,d,1,0,ef,nm);
 else if(t=='fan')for(const a of[-.3,0,.3])proj(Math.sin(P.f+a),Math.cos(P.f+a),d,.8,0,ef,nm);
 else if(t=='big'){if(P.g.id=='anti')P.sw=.3;if(nm=='Tsunami'){P.shake=.4;fxp({x:P.x+dx*2,y:.3,z:P.z+dz*2,c:0xbfe8ff,n:30,dx,dz,sp:8,spread:.9,sz:.4,life:.7,g:10,up:4})}proj(dx,dz,d,2.2,1,ef,nm)}
 else if(t=='nova'){const o={'Explosão Solar':[0xffaa22,2.2,.3,9,3,4],'Maré':[0x6ac8ff,3,0,8,5,14],'Tremor':[0x8a6a40,1.4,.9,6,6,16],'Flash Cegante':[0xffffff,1.2,0,9,2,0],'Chute Giratório':[0xdddddd,3,0,4,2,8]}[nm]||[col,3,0,6,2,6];ring(7,col);blast(7,o[0],P.x,1,P.z,o[1]);P.shake=Math.max(P.shake,o[2]);if(nm=='Flash Cegante')flash();fxp({x:P.x,y:.5,z:P.z,c:o[0],n:44,sp:o[3],sz:.35,life:.8,g:o[5],up:o[4]});near(7,e=>hitE(e,d,ef))}
 else if(t=='cone'){fxp({x:P.x,y:1.3,z:P.z,c:0xff7a1a,n:34,dx,dz,sp:12,spread:.3,sz:.5,life:.55,up:1});fxp({x:P.x,y:1.3,z:P.z,c:0xffe060,n:22,dx,dz,sp:9,spread:.2,sz:.35,life:.45,up:1});near(6,e=>{if(front(e,.8))hitE(e,d,ef)})}
 else if(t=='meteor'){ring(6,0xff3300,tx,tz);const rk=new T.Mesh(new T.DodecahedronGeometry(1.5),mat(0x6a3a20));rk.position.set(tx+8,28,tz-8);S.add(rk);falls.push({m:rk,sx:tx+8,sz:tz-8,tx,tz,t:.9,T:.9,f:()=>{ring(6,col,tx,tz);blast(6,0xff6a1a,tx,1,tz,2.5);P.shake=1;fxp({x:tx,y:.5,z:tz,c:0xff8a2a,n:50,sp:10,sz:.5,life:.9,g:12,up:9});for(const e of enemies)if(Math.hypot(e.x-tx,e.z-tz)<6){e.sp=i;hitE(e,d,ef)}pvpHit(tx,tz,6,d);}})}
 else if(t=='heal'){P.hp=Math.min(P.mhp,P.hp+s[2]);ring(3,col);if(nm=='Cura Divina'){blast(1.4,0xfff2a0,P.x,5,P.z,1.2,new T.CylinderGeometry(.8,.8,10,14,1,true));fxp({x:P.x,y:.2,z:P.z,c:0xfff2a0,n:30,sp:1.5,sz:.2,life:1.2,up:5})}else fxp({x:P.x,y:.2,z:P.z,c:0x7ad0ff,n:36,sp:1.4,sz:.25,life:1,up:3.5})}
 else if(t=='shield'){P.sh=4;for(let k=0;k<8;k++){const a=k/8*6.28,m=mk(new T.BoxGeometry(1.2,3,1.2),0x7a5a38,1);m.position.set(P.x+Math.sin(a)*2.6,0,P.z+Math.cos(a)*2.6);m.scale.y=.05;S.add(m);props.push({m,t:4})}fxp({x:P.x,y:.3,z:P.z,c:0x8a6a40,n:30,sp:4,sz:.35,life:.7,g:8,up:4});toast('Muralha de Pedra: dano reduzido por 4s')}
 else if(t=='dash'){const dc={'Investida do Vento':0xbaffe0,'Investida Demoníaca':0xff2040}[nm]||0xffffff;for(const e of enemies)if(line(e,10,2.5)){e.sp=i;hitE(e,d,ef)}for(const k in MP.others){const o=MP.others[k];if(line(o,10,2.5))pvpHit(o.x,o.z,.5,d)}for(let k=0;k<=12;k++)fxp({x:P.x+dx*k*.75,y:1.2,z:P.z+dz*k*.75,c:dc,n:2,sp:.8,sz:.4,life:.5,up:1});if(nm=='Investida Demoníaca')blast(4,0x150010,P.x+dx*9,1,P.z+dz*9,2.5);P.x+=dx*9;P.z+=dz*9;P.sw=.3}
 else if(t=='beam'){for(const e of enemies)if(line(e,26,1.6)){e.sp=i;hitE(e,d,ef)}for(const k in MP.others){const o=MP.others[k];if(line(o,26,1.6))pvpHit(o.x,o.z,.5,d)}const g=new T.Group();for(const m of[new T.Mesh(new T.CylinderGeometry(1,1,26,14,1,true),GLM(0xffe680,.35)),new T.Mesh(new T.CylinderGeometry(.55,.55,26,12,1,true),GLM(0xfff2a0,.6)),new T.Mesh(new T.CylinderGeometry(.2,.2,26,8),BM(0xffffff))]){m.rotation.x=Math.PI/2;g.add(m)}g.position.set(P.x+dx*13,1.3,P.z+dz*13);g.rotation.y=P.f;S.add(g);fxp({x:P.x+dx*26,y:1.3,z:P.z+dz*26,c:0xfff2a0,n:24,sp:6,sz:.3,life:.6,up:3,g:6});tmr.push({t:.3,f:()=>S.remove(g)})}
 else if(t=='slash'){P.sw=.3;cut(5);ring(4,col);const a0=P.x+dx*2.2,b0=P.z+dz*2.2;if(nm=='Corte Anti-Magia'){const c2=cres(0x151515,1.6,.12,1);c2.position.set(a0,1.3,b0);c2.rotation.y=P.f;S.add(c2);fx.push({m:c2,r:1.6,t:0,sp:4})}fxp({x:a0,y:1.2,z:b0,c:nm=='Corte Anti-Magia'?0x333344:0xffffff,n:16,dx,dz,sp:6,spread:.8,sz:.25,life:.4});if(nm=='Pancada Pesada'){P.shake=.5;fxp({x:a0,y:.3,z:b0,c:0xbbbbbb,n:20,sp:5,sz:.35,life:.6,g:8,up:4})}near(5,e=>{if(front(e,1.3))hitE(e,d,ef)})}
 else if(LWS[t])lwCast(t,d);
 else if(XT.includes(t))xCast(t,d,dx,dz);
 else if(t=='fball')fBall(d,dx,dz,ef);
 else if(t=='fchain')fChainSkill(d);
 else if(t=='fsoul')fSoul(d,dx,dz);
 else if(t=='finferno')fInferno(d,dx,dz);
 else if(t=='aimp')aImpact(d,dx,dz);
 else if(t=='aerup')aEruption(d);
 else if(t=='aph')aPhantom(d);
 else if(t=='aann')aAnnihilation(d);
 else if(t=='udiv')uDivider(d,dx,dz);
 else if(t=='uabys')uAbyss(d,dx,dz);
 else if(t=='uover')uOverdrive(d);
 else if(t=='uking')uKing(d);
 else if(t=='wgale')wSlash(d,dx,dz);
 else if(t=='wtorn')wTornadoDom(d,dx,dz);
 else if(t=='wrun')wSkyRun();
 else if(t=='wtemp')wTempest(d);
 else if(t=='sgale')sDivineGale(d,dx,dz);
 else if(t=='svort')sVortex(d,dx,dz);
 else if(t=='sdive')sDive();
 else if(t=='stemp')sDivineTempest(d);
 else if(t=='tarrow')tArrow(d,dx,dz);
 else if(t=='tprison')tPrison(d,dx,dz);
 else if(t=='taccel')tAccel();
 else if(t=='treq')tRequiem(d);
 else if(t=='kspear')kSpear(d,dx,dz);
 else if(t=='kabyss')kAbyss(d,dx,dz);
 else if(t=='klegion')kLegion(d);
 else if(t=='kdom')kDominion(d);
 else if(t=='chrono'){proj(dx,dz,d,1,0,ef,nm);fxp({x:P.x+dx,y:1.4,z:P.z+dz,c:0xffd75a,n:10,dx,dz,sp:5,spread:.4,sz:.18,life:.35})}
 else if(t=='stasis'){const e=chronoTarget(20);if(!e){toast('Nenhum inimigo para prender no tempo.');return}const dur=(e.boss?1.8:3.5)*(1+cb('dur'));hitE(e,d,null);stasisOn(e,dur);trAdd(4);ring(3,0xffd75a,e.x,e.z);burst('tempo',e.x,1.4,e.z,18,3)}
 else if(t=='accel'){hasteOn(5*(1+cb('dur')));ring(3,0xffd75a);burst('tempo',P.x,1,P.z,24,4);toast('Chrono Acceleration: você está mais rápido por 5s!')}
 else if(t=='rewind'){const mx=Math.max(P.hp,...(P.hh||[P.hp])),lost=Math.max(0,mx-P.hp),heal=Math.round(Math.min(P.mhp-P.hp,lost*.75+P.mhp*.05));P.hp=Math.min(P.mhp,P.hp+heal);rewindFx();P.iv=Math.max(P.iv||0,.6);dmgNum(P.x,2.6,P.z,'+'+heal+' HP',0,'xp');toast('Chrono Anastasis: o tempo voltou e você recuperou '+heal+' de vida.')}
 else if(t=='cancel'){P.sw=.3;cut(10);ring(10,0x888888);blast(10,0x0a0a0f,P.x,1.2,P.z,2);near(6,e=>hitE(e,d,ef));toast('Magias inimigas anuladas!')}}})}
let e_last=0;
let dem=null,horns=null,aura=null,wL=null,wR=null;
function addDemon(){if(dem)return;dem=new T.Group();const body=mk(new T.SphereGeometry(.2,12,10),0x2a1238,1),head=mk(new T.SphereGeometry(.17,12,10),0x3a1a4a,1);head.position.y=.3;dem.add(body,head);
 for(const s of[-1,1]){const e=mk(new T.SphereGeometry(.035,6,6),0xffdd33);e.position.set(s*.06,.33,.15);const h=mk(new T.ConeGeometry(.04,.15,5),0x151515,1);h.position.set(s*.09,.48,0);h.rotation.z=-s*.3;dem.add(e,h)}
 const m=mk(new T.BoxGeometry(.1,.025,.02),0xffffff);m.position.set(0,.25,.16);dem.add(m);
 wL=mk(new T.ConeGeometry(.12,.4,3),0x4a1a5a);wL.position.set(-.24,.08,-.1);wR=mk(new T.ConeGeometry(.12,.4,3),0x4a1a5a);wR.position.set(.24,.08,-.1);dem.add(wL,wR);
 const tl=mk(new T.CylinderGeometry(.02,.012,.3,6),0x2a1238);tl.position.set(0,-.2,-.14);tl.rotation.x=.9;dem.add(tl);
 dem.position.set(-.85,1.75,.1);pm.add(dem);
 horns=new T.Group();const W=[];for(const s of[-1,1]){const h=mk(new T.TorusGeometry(.11,.035,6,10,4.2),0xe8dcc0,1);h.position.set(s*.2,2.12,0);h.rotation.set(0,s*1.57,s*.6);horns.add(h);const wp=new T.Group();wp.position.set(s*.2,1.6,-.3);for(let k=0;k<3;k++){const pl=new T.Mesh(new T.PlaneGeometry(.45,1.5),new T.MeshBasicMaterial({color:[0x1a0006,0x9a0a1e,0xff3040][k],transparent:true,opacity:.5-k*.1,side:T.DoubleSide}));pl.position.set(s*(.45+k*.25),.3+k*.1,0);pl.rotation.z=-s*(.5+k*.35);wp.add(pl)}horns.add(wp);W.push(wp)}const sh=new T.Group();for(let k=0;k<6;k++){const a=k/6*6.28,o=new T.Mesh(new T.OctahedronGeometry(.13),new T.MeshBasicMaterial({color:0xff2a3a}));o.position.set(Math.sin(a)*1.3,1.3+(k%2)*.4,Math.cos(a)*1.3);sh.add(o)}horns.add(sh);horns.userData={w:W,sh};horns.visible=false;horns.position.y=PP.hOff||0;pm.add(horns);
 aura=new T.Mesh(new T.SphereGeometry(1.15,14,10),new T.MeshBasicMaterial({color:0x5a0010,transparent:true,opacity:.22}));aura.position.y=1.2;aura.visible=false;pm.add(aura)}
function togUnion(end){if(P.g&&P.g.id=='kotodama'){if(run||end)togZagred(end);return}if(!run&&!end)return;if(!dem)return;
 if(P.union){duEnd(end?'silent':'manual');return}if(end||P.dcin)return;
 if(!P.sword){toast('Ative a espada para usar a União Demoníaca');return}
 if((P.ducd||0)>0){toast('Liebe está exausto: espere '+Math.ceil(P.ducd)+'s');return}
 if((P.de==null?100:P.de)<100){toast('Energia demoníaca: '+Math.floor(P.de)+'/100 — espere encher');return}
 if(P.mp<10){toast('Anti-Magia insuficiente para a União Demoníaca');return}
 if(!relGate('liebe'))return;if(!csPlay('liebe',()=>{duOn();lieSay(relOf('liebe').st=='dominado'?'Tch... tá, vamos. Mas eu ainda sou eu!':'Hehe... agora a gente destrói tudo, irmão!',3)},relActOpts('liebe')))duStart()}
const BM=c=>new T.MeshBasicMaterial({color:c}),TM=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,side:T.DoubleSide}),PG=(()=>{const g=new T.SphereGeometry(.2,5,4);g._keep=1;return g})(),parts=[],falls=[],props=[];
const U=(m,o)=>{m.userData=Object.assign(m.userData||{},o);return m};
const PPOOL=[];
function fxp(o){if(!CFG.parts||parts.length>PCAP)return;for(let i=0;i<(o.n||1);i++){const m=PPOOL.pop()||new T.Mesh(PG,new T.MeshBasicMaterial({transparent:true}));m.material.color.setHex(o.c);m.material.opacity=1;m.material.blending=lum(o.c)>.35?T.AdditiveBlending:T.NormalBlending;m.material.depthWrite=false;m.position.set(o.x,o.y||1,o.z);m.scale.setScalar((o.sz||.3)*(.6+Math.random()*.8));S.add(m);const a=Math.random()*6.28,v=(o.sp||2)*(.3+Math.random()*.9);let vx=Math.cos(a)*v,vz=Math.sin(a)*v;if(o.dx!=null){const b=Math.atan2(o.dx,o.dz)+(Math.random()-.5)*2*(o.spread||.3),w=(o.sp||2)*(.6+Math.random()*.6);vx=Math.sin(b)*w;vz=Math.cos(b)*w}parts.push({m,vx,vy:(o.up||0)*(.4+Math.random()),vz,t:o.life||.5,l:o.life||.5,g:o.g||0})}}
function blast(r,c,x,y,z,sp,geo){if(!CFG.fx)return;const m=new T.Mesh(geo||new T.SphereGeometry(1,14,10),new T.MeshBasicMaterial({color:c,transparent:true,opacity:.5,side:T.DoubleSide,blending:lum(c)>.18?T.AdditiveBlending:T.NormalBlending,depthWrite:false}));m.position.set(x,y,z);S.add(m);fx.push({m,r,t:0,sp,o:.5})}
function flash(){if(!CFG.fx)return;const f=$('flash');f.style.transition='none';f.style.opacity=.85;requestAnimationFrame(()=>{f.style.transition='opacity .5s';f.style.opacity=0})}
const GLM=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false});
const lum=c=>{const k=new T.Color(c);return k.r*.3+k.g*.59+k.b*.11};
function orb(c,r,z){const g=new T.Group();g.add(new T.Mesh(new T.SphereGeometry(r*.55,10,8),BM(0xffffff)),new T.Mesh(new T.SphereGeometry(r,12,10),GLM(c,.85)),new T.Mesh(new T.SphereGeometry(r*1.8,12,10),GLM(c,.35)),new T.Mesh(new T.SphereGeometry(r*2.8,10,8),GLM(c,.12)));if(z)g.scale.z=z;return g}
function cres(c,r,w,tr,gc){const m=new T.Mesh(new T.TorusGeometry(r,w,6,20,3),tr?TM(c,1):BM(c));m.rotation.x=Math.PI/2;const g=new T.Group();g.add(m);const gl=gc!=null?gc:c;if(lum(gl)>.1){const h=new T.Mesh(new T.TorusGeometry(r,w*3.2,6,20,3),GLM(gl,.4));h.rotation.x=Math.PI/2;g.add(h);const h2=new T.Mesh(new T.TorusGeometry(r*.96,w*.5,6,20,3),GLM(0xffffff,.6));h2.rotation.x=Math.PI/2;g.add(h2)}return g}
function tornado(sc,c){const g=new T.Group();for(let k=0;k<6;k++){const m=new T.Mesh(new T.ConeGeometry(.22+k*.2,.75,12,1,true),TM(c,.5));m.rotation.x=Math.PI;m.position.y=.38+k*.6;g.add(m);const m2=new T.Mesh(new T.ConeGeometry(.12+k*.13,.7,10,1,true),GLM(0xffffff,.28));m2.rotation.x=Math.PI;m2.position.y=.38+k*.6;g.add(m2)}g.scale.setScalar(sc);return U(g,{spin:10,tr:0xcfe8d8,ts:.35,ty:.8,tu:1})}
function golem(){const g=new T.Group(),b=(w,h,d,x,y)=>{const m=mk(new T.BoxGeometry(w,h,d),0x8a7a5a,1);m.position.set(x,y,0);g.add(m)};b(1.6,1.8,1,0,2);b(.9,.9,.9,0,3.4);b(.6,1.8,.6,-1.2,2);b(.6,1.8,.6,1.2,2);b(.7,1.2,.7,-.5,.6);b(.7,1.2,.7,.5,.6);return U(g,{bob:1,tr:0x8a6a40,ts:.5,tg:6,tu:2,ty:.3})}
function waveM(){const g=new T.Group();for(let k=-6;k<=6;k++){const h=1.4+Math.random()*.8,m=new T.Mesh(new T.SphereGeometry(1,10,8),TM(0x2f9bff,.85));m.position.set(k*1.1,h*.9,0);m.scale.set(1.3,h,1.1);m.userData.b=h;g.add(m);const f=new T.Mesh(new T.SphereGeometry(.5,6,5),BM(0xffffff));f.position.set(k*1.1,h*1.8,.2);g.add(f)}return U(g,{wave:1,w:7,sp:12,life:2.2,tr:0xbfe8ff,ts:.4,tg:5,tu:2,ty:2})}
function fireball(){const g=orb(0xff6a10,.42);for(let k=0;k<5;k++){const cn=new T.Mesh(new T.ConeGeometry(.3-k*.03,.9+k*.15,8),GLM(k%2?0xffb030:0xff4a10,.55));cn.rotation.x=-Math.PI/2;cn.position.set((Math.random()-.5)*.2,(Math.random()-.5)*.2,-.55-k*.12);g.add(cn)}return g}

