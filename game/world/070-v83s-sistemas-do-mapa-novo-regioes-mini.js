// ===================== V83 · sistemas do mapa novo: regiões, minimapa, missões nos lugares novos, água, animações,
// teleporte do Finral, destruição do cenário e os acontecimentos das espadas do Asta =====================
// ---------- missões e chefes nos lugares novos (o sistema de progressão é o mesmo)
{const A=(k,at,txt)=>{if(QS[k]){if(at)QS[k].at=at;if(txt)QS[k].txt=txt}};
 A('patrulha',{x:0,z:0,r:50});A('renegados',{x:34,z:-160,r:28},'Magos renegados com grimório atacam viajantes ao norte do acampamento, na estrada para os quartéis. Derrote 4 deles.');
 A('saqueadores',{x:242,z:-42,r:26});A('rei_saq',null,'O Rei dos Saqueadores acampa a leste dos campos de Sossy. Derrote-o e Sossy terá paz!');
 A('floresta',{x:-300,z:-150,r:28},'Magos perdidos na entrada da Floresta das Bruxas, a oeste da vila, atacam quem passa. Derrote 6 deles.');A('feiticeira',null,'A Feiticeira do Pântano está no pântano da Floresta das Bruxas, a sudoeste da vila. Ela controla a água. Derrote-a!');
 A('fronteira',{x:-282,z:202,r:30},'Soldados de Diamond atravessam a fronteira a sudoeste da cidade, no caminho para o Reino Diamond. Derrote 8 invasores!');
 const B=(k,x,z)=>{if(BOSSES[k]){BOSSES[k].x=x;BOSSES[k].z=z}};B('trevas',40,-176);B('saqueador',252,-92);B('feiticeira',-336,-206);B('general',-312,232)}
// ---------- nome da região no HUD (vila, quartel, capital, reinos vizinhos)
zone=function(){for(const v of VILS)if(Math.hypot(P.x-v.x,P.z-v.z)<v.r+8)return v.n+' ('+v.s+')';for(const h of HQ83)if(Math.hypot(P.x-h.x,P.z-h.z)<22){const n={dourado:'Alvorecer Dourado',aguia:'Águia Prateada',leao:'Leão Carmesim',rosa:'Rosa Azul',louva:'Louva-a-Deus Verde',pavao:'Pavão de Coral',orca:'Orca Púrpura',cervo:'Cervo Azul'}[h.id];return 'Quartel do '+n+' (Reino dos Nobres)'}
 const r=reg83(P.x,P.z);if(r)return r.n+' ('+r.s+')';if(P.z<-505)return 'Passagem do Norte (Reino Spade)';if(P.z<-180)return 'Reino dos Nobres (Reino de Clover)';if(P.z>90)return 'Reino Esquecido (Fronteira Sul)';return 'Reino Comum (Reino de Clover)'};
function v83InCap(){return Math.hypot(P.x,P.z-CZ)<66}
// ---------- minimapa novo (60 m de raio ao redor do jogador)
drawMap=function(){const c=$('mm'),x=c.getContext&&c.getContext('2d');if(!x)return;const W=c.width,R=W/2,k=R/60,X=wx=>R+(wx-P.x)*k,Y=wz=>R+(wz-P.z)*k;x.clearRect(0,0,W,W);x.save();x.beginPath();x.arc(R,R,R,0,6.2832);x.clip();x.fillStyle='#1a3a24';x.fillRect(0,0,W,W);try{const m=window.MUNDO_RELEVO;if(m){x.drawImage(m.c,X(m.x0),Y(m.z0),m.w*k,m.h*k)}}catch(e){}
 const circ=(cx,cz,r,f,st)=>{x.beginPath();x.arc(X(cx),Y(cz),Math.max(1,r*k),0,6.2832);x.fillStyle=f;x.fill();if(st){x.strokeStyle=st;x.lineWidth=1.5;x.stroke()}};
 for(const r of REG83)if(Math.hypot(r.x-P.x,r.z-P.z)<r.r+90)circ(r.x,r.z,r.r,'#'+((r.c&0xfefefe)>>1).toString(16).padStart(6,'0')+'cc');
 x.fillStyle='#1f5f8f';for(const w of WATER83){if(w.t=='r')x.fillRect(X(w.x0),Y(w.z0),(w.x1-w.x0)*k,(w.z1-w.z0)*k);else circ(w.x,w.z,w.r,'#1f5f8f')}for(const l of LAND83){if(l.t=='r'){x.fillStyle='#8a6a4a';x.fillRect(X(l.x0),Y(l.z0),(l.x1-l.x0)*k,(l.z1-l.z0)*k)}else circ(l.x,l.z,l.r,l.r>40?'#5a8a4a':'#9ad8ff88')}
 x.strokeStyle='#c9a86a';x.lineWidth=Math.max(2,6*k);for(const s of ROAD83){x.beginPath();x.moveTo(X(s[0]),Y(s[1]));x.lineTo(X(s[2]),Y(s[3]));x.stroke()}
 circ(0,CZ,64,'#3a3e4ccc','#c8c4d0');for(const v of VILS)circ(v.x,v.z,v.r,'#4a4a2acc','#e8c86a');for(const h of HQ83)circ(h.x,h.z,6,'#e8c86a');
 x.fillStyle='#ffe08a';for(const n of NPCS){const p=n.g.position;if(Math.abs(p.x-P.x)<62&&Math.abs(p.z-P.z)<62){x.fillRect(X(p.x)-1.5,Y(p.z)-1.5,3,3)}}
 x.fillStyle='#ff5a4a';for(const e of enemies)if(!e.dummy&&Math.abs(e.x-P.x)<62&&Math.abs(e.z-P.z)<62){x.beginPath();x.arc(X(e.x),Y(e.z),e.boss?4:2.4,0,6.2832);x.fill()}
 x.fillStyle='#8af';for(const kk in MP.others){const o=MP.others[kk];x.beginPath();x.arc(X(o.x),Y(o.z),3,0,6.2832);x.fill()}
 x.save();x.translate(R,R);x.rotate(-P.f+Math.PI);x.fillStyle='#fff';x.beginPath();x.moveTo(0,-7);x.lineTo(5,6);x.lineTo(0,3);x.lineTo(-5,6);x.closePath();x.fill();x.restore();x.restore()};
// ---------- água: ninguém entra no mar (só na ponte, no píer, na ilha e dentro da bolha do templo)
const W83={lx:0,lz:0};
{const _x=xUpdate;xUpdate=function(dt){_x(dt);try{if(inWater83(P.x,P.z)){P.x=W83.lx;P.z=W83.lz}else{W83.lx=P.x;W83.lz=P.z}}catch(e){}}}
{const _sp=spawn;spawn=function(q){const n=enemies.length;const r=_sp.apply(this,arguments);try{if(enemies.length>n){const e=enemies[enemies.length-1];if(inWater83(e.x,e.z)){S.remove(e.m);freeObj(e.m);if(e.lb)e.lb.remove();enemies.pop()}}}catch(e){}return r}}
// ---------- partes que se mexem (fora do agrupamento estático): pás dos moinhos, anel de grimórios, pedras flutuantes, lava
const AN83=[];
{const add=(o,f)=>{AN83.push({o,f})};
 const mill=(x,z,y,zoff,len)=>{const h=G83();h.position.set(x,y,z+zoff);for(let k=0;k<4;k++){const pv=G83();pv.rotation.z=k*1.5708;bp(pv,BX(.5,len,.12),0xf0e6d2,0,len/2,0,1);h.add(pv)}S.add(h);add(h,(o,t,dt)=>{o.rotation.z+=dt*.8})};
 // as pás estáticas antigas ficam escondidas; estas giram
 for(const k in chunks)for(const c of chunks[k].children)if(c.userData&&c.userData.mill)c.userData.mill.visible=false;
 mill(-44,-14,8.5,3.1,7);mill(VILS[1].x-30,VILS[1].z-18,9.5,3.2,8);
 const ring=G83();ring.position.set(-64,48.6,-52);for(let k=0;k<10;k++){const a=k/10*6.283,b=G83();b.position.set(Math.cos(a)*9,Math.sin(k*1.7)*.8,Math.sin(a)*9);bp(b,BX(1.4,.25,1),[0xd04a3a,0x3b6ad0,0x3aa05a,0xe0b020,0x8a3ad0][k%5],0,0,0,1);bp(b,BX(1.3,.18,.9),0xf6efdc,0,.15,0);b.rotation.set(-.6,-a,0);ring.add(b)}S.add(ring);add(ring,(o,t,dt)=>{o.rotation.y+=dt*.25;o.position.y=48.6+Math.sin(t*.8)*.6});
 const fl=G83();fl.position.set(150,36,-590);for(let k=0;k<8;k++){const a=k/8*6.283,b=bp(fl,new T.OctahedronGeometry(1.4+(k%3)*.5,0),0x2a2236,Math.cos(a)*18,(k%4)*2-2,Math.sin(a)*18,1);b.rotation.set(k,k*.7,0)}S.add(fl);add(fl,(o,t,dt)=>{o.rotation.y-=dt*.15;o.children.forEach((b,i)=>b.position.y=(i%4)*2-2+Math.sin(t+i)*1.2)});
 const lv=new T.Mesh(new T.CylinderGeometry(13,13,.4,12),new T.MeshBasicMaterial({color:0xff5a10}));lv.position.set(300,53.1,-410);S.add(lv);add(lv,(o,t)=>{o.material.color.setHSL(.04+Math.sin(t*2)*.015,1,.5+Math.sin(t*3)*.06)})}
for(const k in chunks)for(const c of chunks[k].children){if(c.userData&&c.userData.bookRing)c.userData.bookRing.visible=false;if(c.userData&&c.userData.float)c.userData.float.visible=false}
{const _x=xUpdate;xUpdate=function(dt){_x(dt);try{const t=performance.now()/1000;for(const a of AN83){if(Math.abs(a.o.position.x-P.x)>CULL||Math.abs(a.o.position.z-P.z)>CULL){a.o.visible=false;continue}a.o.visible=true;a.f(a.o,t,dt)}}catch(e){}}}
// ---------- lugares seguros (teleporte e renascer): procura o ponto livre mais perto
function v83Safe(x,z){const bad=(a,b)=>inWater83(a,b)||SOL.some(o=>o.r?Math.hypot(a-o.x,b-o.z)<o.r+1:Math.abs(a-o.x)<o.hx+1&&Math.abs(b-o.z)<o.hz+1);if(!bad(x,z))return[x,z];for(let r=1.5;r<40;r+=1.5)for(let k=0;k<16;k++){const a=k/16*6.283,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;if(!bad(px,pz))return[px,pz]}return[x,z]}
// ---------- TELETRANSPORTE DO FINRAL: Gate of Infinity abre a janela de destinos (ou o portal de combate de sempre)
const TP83=[
 ['Reino Esquecido',[['Vila Hage',0,4],['Torre dos Grimórios',-64,-36],['Campo de Treino',-52,20],['Colina do Crânio',40,-8]]],
 ['Reino Comum',[['Acampamento dos Cavaleiros',34,-106],['Esconderijo dos Touros Negros',128,-128],['Vila Sossy',172,-48],['Vila Nairn',-212,-150],['Cidade de Kiten',-196,96],['Masmorra Antiga',-128,226]]],
 ['Quartéis (Reino dos Nobres)',[['Alvorecer Dourado',-130,-230],['Águia Prateada',-60,-272],['Leão Carmesim',60,-268],['Rosa Azul',130,-228],['Louva-a-Deus Verde',-200,-192],['Pavão de Coral',200,-192],['Orca Púrpura',-232,-276],['Cervo Azul',232,-274]]],
 ['Capital Real',[['Portão da Capital',0,-326],['Praça Central',0,-392],['Mercado',24,-386],['Castelo Real',0,-424]]],
 ['Terras Selvagens',[['Floresta das Bruxas',-380,-150],['Castelo da Rainha das Bruxas',-438,-176],['Vulcão Yultim',300,-338]]],
 ['Mar do Leste',[['Templo Submarino',426,-200],['Hino',454,9]]],
 ['Outros Reinos',[['Reino Diamond',-396,250],['Reino Heart',320,262],['Reino Spade',0,-548],['Palácio das Sombras',150,-560]]]];
function tpUI(){let o=$('tp83');if(o&&o.classList)return o;o=document.createElement('div');o.id='tp83';document.body.appendChild(o);const st=document.createElement('style');st.textContent='#tp83{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;width:min(440px,92vw);max-height:min(78vh,560px);display:none;flex-direction:column;background:#0e1430f2;border:2px solid #7a9aff;border-radius:16px;color:#eef;font:14px system-ui;box-shadow:0 0 30px #4a6aff88}#tp83.on{display:flex}#tp83 header{display:flex;align-items:center;gap:8px;padding:10px 12px;border-bottom:1px solid #fff2}#tp83 header b{flex:1;color:#bcd0ff;font-size:16px}#tp83 .tl{overflow:auto;padding:6px 10px 12px;-webkit-overflow-scrolling:touch}#tp83 h4{margin:10px 0 4px;color:#9ab0ff;font-size:12px;text-transform:uppercase;letter-spacing:.06em}#tp83 .g{display:grid;grid-template-columns:1fr 1fr;gap:6px}#tp83 button{min-height:40px;border-radius:10px;border:1px solid #5a7aff88;background:#1a2450;color:#fff;font:600 13px system-ui;padding:6px}#tp83 button.cb{background:#3a2a6a}#tp83 .x{min-height:34px;padding:4px 12px;background:#333}';document.head.appendChild(st);return o}
function tpOpen(i){const o=tpUI();let h='<header><b>🌀 Teletransporte de Finral</b><button class="x" onclick="tpClose()">✕</button></header><div class="tl"><button class="cb" style="width:100%" onclick="tpCombat()">⚔️ Portal de combate (26 m, como antes)</button>';TP83.forEach((g,gi)=>{h+='<h4>'+g[0]+'</h4><div class="g">'+g[1].map((d,di)=>'<button onclick="tpGo('+gi+','+di+')">'+d[0]+'</button>').join('')+'</div>'});o.innerHTML=h+'</div>';o.classList.add('on');TPS.open=true;TPS.i=i}
const TPS={open:false};
function tpClose(){const o=$('tp83');if(o&&o.classList)o.classList.remove('on');TPS.open=false}
function tpCombat(){tpClose();try{_esGate83()}catch(e){}}
function tpGo(gi,di){const d=TP83[gi][1][di];tpClose();if(!run||P.dead>0)return;if(SC.on){toast('Não dá para se teletransportar preso na Soul Chain.');return}const [tx,tz]=v83Safe(d[1],d[2]);const ax=P.x,az=P.z;
 const ring=(x,z)=>{const g=G83();const a=new T.Mesh(new T.TorusGeometry(1.4,.12,6,32),GLM(0x9ab0ff,.9));a.position.y=1.4;g.add(a);const b=new T.Mesh(new T.CircleGeometry(1.3,28),GLM(0x2a3aaa,.6));b.position.y=1.4;g.add(b);const c=new T.Mesh(new T.RingGeometry(1.4,1.8,32),GLM(0xbcd0ff,.6));c.rotation.x=-1.5708;c.position.y=.06;g.add(c);g.position.set(x,0,z);g.rotation.y=P.f;S.add(g);return g};
 const A=ring(ax,az);try{xSnd('eswarp')}catch(e){}try{xWord('TELETRANSPORTE!','space')}catch(e){}P.lock=.6;P.iv=Math.max(P.iv||0,1);
 kfx({u:f=>{const k=Math.min(1,f.t/.35);A.scale.setScalar(.2+k*1.1);A.children[0].rotation.z+=.2;if(f.t>.4&&!f.d){f.d=1;P.x=tx;P.z=tz;W83.lx=tx;W83.lz=tz;cullT=0;const B=ring(tx,tz);kfx({u:g=>{const u=Math.min(1,g.t/.3);B.scale.setScalar(1.3-u*.3);if(g.t>.7)B.scale.setScalar(Math.max(.01,1-(g.t-.7)*3));return g.t<1},end:()=>kDispose(B)});fxp({x:tx,y:1.2,z:tz,c:0xbcd0ff,n:Math.round(24*KQ()),sp:4,sz:.2,life:.5})}if(f.t>.4)A.scale.setScalar(Math.max(.01,1.3-(f.t-.4)*3));return f.t<.85},end:()=>kDispose(A)});
 toast('🌀 '+d[0])}
const _esGate83=esGate;esGate=function(){if(TPS.remote)return _esGate83.apply(this,arguments);tpOpen();P.lock=Math.max(P.lock||0,.3)};
{const _x=xUpdate;xUpdate=function(dt){_x(dt);if(TPS.open){P.lock=Math.max(P.lock||0,.15);if(!run||P.dead>0)tpClose()}}}
// ---------- loja só dentro da Capital
interact=function(){if(!run)return;if(v83Interact())return;let best=null,bd=4.5;for(const n of NPCS){const dd=Math.hypot(n.g.position.x-P.x,n.g.position.z-P.z);if(dd<bd){bd=dd;best=n}}if(best)talk(best);else if(v83InCap())openShop();else toast('Ninguém por perto. Chegue perto de um morador e aperte Falar.')};
openShop=function(){if(!run)return;if(!v83InCap()){toast('A loja fica na Capital Real (no norte do reino).');return}shopUI()};

