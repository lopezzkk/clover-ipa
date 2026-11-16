// ================= V82 · Fase 1c: SOUL CHAIN DEATHMATCH (nova regra) =================
// 1) a bola de fogo precisa acertar → cena de ativação, correntes ligam os dois
// 2) fase das correntes: a mana dos dois é igualada e NÃO regenera; as correntes queimam mana aos poucos
// 3) quando a mana dos dois chega a zero → disputa de 30 s: cada um toca no botão do punho; vence quem tocar mais
// 4) cena final do soco (inspirada no confronto de Magna contra Dante — adaptação do Clover RPG)
// Multiplayer: sem servidor de jogo (P2P). O jogador que lançou a corrente é o árbitro; os toques têm limite
// de 15 por segundo (o excedente é descartado) e os dois lados recalculam o resultado com as mesmas contagens.
// Saídas de segurança: alvo não responde, desconexão, morte, distância, fase longa demais → ninguém fica preso.
const SCH2={TAP:30,RATE:15,LINE:'Se eu não posso me igualar a você, farei você se igualar a mim.',MAXMANA:70};
function sc2Partner(){return scPartner()}
function sc2Name(){return SC.lab||'Rival'}
function sc2UI(){let w=$('sc2w');if(w&&w.classList)return w;w=document.createElement('div');w.id='sc2w';
 w.innerHTML='<div id="sc2cap"></div><div id="sc2box"><div id="sc2hd"><b>⛓️ SOUL CHAIN</b><span id="sc2ph"></span></div><div id="sc2bars"><div class="r"><span>Você</span><i><u id="sc2a"></u></i><em id="sc2an"></em></div><div class="r o"><span id="sc2bn">Rival</span><i><u id="sc2b"></u></i><em id="sc2bnn"></em></div></div></div><button id="sc2fist" aria-label="Socar"><svg viewBox="0 0 64 64" aria-hidden="true"><g stroke="#3a1a08" stroke-width="2.4" stroke-linejoin="round" fill="#ffd9b0"><circle cx="21" cy="23" r="6"/><circle cx="31" cy="21" r="6.2"/><circle cx="41" cy="22" r="6"/><circle cx="49" cy="26" r="5.2"/><path d="M14 30c0-5 3-8 8-8h22c7 0 10 4 10 10v8c0 10-8 16-17 16h-6c-10 0-17-7-17-15z"/><path d="M15 38c6-5 15-6 24-3" fill="none" stroke-width="5" stroke="#3a1a08"/><path d="M15 38c6-5 15-6 24-3" fill="none" stroke-width="2.6" stroke="#ffd9b0"/></g><path d="M26 25v5M36 24v6M45 27v5" stroke="#3a1a08" stroke-width="2" stroke-linecap="round"/><path d="M5 22l6 3M3 33h7M6 44l6-3" stroke="#ff8a2a" stroke-width="3" stroke-linecap="round"/></svg><b id="sc2n">0</b></button>';
 document.body.appendChild(w);const st=document.createElement('style');st.textContent='#sc2w{position:fixed;inset:0;pointer-events:none;z-index:31;display:none}#sc2w.on{display:block}#sc2cap{position:absolute;left:50%;bottom:22%;transform:translateX(-50%);max-width:min(560px,88vw);text-align:center;font:700 clamp(14px,3.6vw,20px)/1.3 Georgia,serif;color:#fff3e0;text-shadow:0 0 6px #ff6a1a,0 2px 0 #000;opacity:0;transition:opacity .25s}#sc2cap.on{opacity:1}#sc2box{position:absolute;top:calc(env(safe-area-inset-top,0px) + 112px);left:50%;transform:translateX(-50%);width:min(300px,70vw);padding:6px 10px;border-radius:12px;background:#1a0800d8;border:1.5px solid #ff8a2a;color:#ffe8d0;font:600 12px system-ui}#sc2hd{display:flex;justify-content:space-between;gap:8px}#sc2ph{color:#ffd040}#sc2bars .r{display:grid;grid-template-columns:52px 1fr 40px;align-items:center;gap:6px;margin-top:3px}#sc2bars span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#sc2bars i{height:8px;border-radius:5px;background:#000a;overflow:hidden}#sc2bars u{display:block;height:100%;width:0;background:linear-gradient(90deg,#ff5a10,#ffd040)}#sc2bars .o u{background:linear-gradient(90deg,#ffd040,#ff9a5a)}#sc2bars em{font-style:normal;text-align:right}#sc2fist{position:absolute;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 20%);transform:translateX(-50%);width:clamp(96px,min(30vw,30vh),150px);height:clamp(96px,min(30vw,30vh),150px);border-radius:50%;border:4px solid #ffd040;background:radial-gradient(circle at 50% 40%,#ff9a3a,#a02a00 70%,#3a0e00);box-shadow:0 0 24px #ff6a1a,inset 0 -6px 12px #0006;display:none;pointer-events:auto;touch-action:manipulation;-webkit-tap-highlight-color:transparent;padding:0}#sc2fist.on{display:block}#sc2fist svg{width:62%;height:62%;margin-top:4%}#sc2fist b{position:absolute;left:0;right:0;bottom:8%;color:#fff;font:800 clamp(16px,4.5vw,22px) system-ui;text-shadow:0 2px 0 #000}#sc2fist.hit{transform:translateX(-50%) scale(.92)}body.sc2duel #h-skills{visibility:hidden}';document.head.appendChild(st);
 const fb=$('sc2fist');fb.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();sc2Tap();fb.classList.add('hit');clearTimeout(fb._t);fb._t=setTimeout(()=>fb.classList.remove('hit'),70)});return w}
function sc2Cap(t){sc2UI();const c=$('sc2cap');if(!c)return;c.textContent=t||'';c.classList.toggle('on',!!t)}
function sc2Tap(){if(!SC.on||SC.ph!='duel')return;const el=SC.dt,cap=Math.floor(el*SCH2.RATE)+3;if(SC.ta>=cap)return;SC.ta++;try{const p=v82Hand?v82Hand():null;if(p&&Math.random()<.5)fxp({x:p.x,y:p.y,z:p.z,c:0xffb040,n:3,sp:2,sz:.12,life:.25})}catch(e){}if(SC.ta%6==0)try{fSound('charge')}catch(e){}}
// ---------- câmera de cena (só durante ativação e final; nunca trava: some se a cena acabar)
const SCAM={on:false};
{const r0=R.render.bind(R);R.render=function(s,c){if(SCAM.on&&!SC.on)SCAM.on=false;if(SCAM.on&&SCAM.f){try{SCAM.f(c)}catch(e){SCAM.on=false}}return r0(s,c)}}
function sc2FaceCam(getX,getZ,getF){SCAM.on=true;SCAM.f=c=>{const x=getX(),z=getZ(),f=getF(),hy=(PP.hTop||2.21)*.84;c.position.set(x+Math.sin(f)*1.9+Math.cos(f)*.55,hy+.05,z+Math.cos(f)*1.9-Math.sin(f)*.55);c.lookAt(x,hy-.02,z)}}
function sc2SideCam(){SCAM.on=true;SCAM.f=c=>{const pt=sc2Partner()||{x:P.x+2,z:P.z};const mx=(P.x+pt.x)/2,mz=(P.z+pt.z)/2,dx=pt.x-P.x,dz=pt.z-P.z,L=Math.hypot(dx,dz)||1;c.position.set(mx-dz/L*6.5,2.4,mz+dx/L*6.5);c.lookAt(mx,1.2,mz)}}
function sc2CamOff(){SCAM.on=false;SCAM.f=null}
// ---------- início do vínculo (chamado por fSoul quando a bola acerta, ou pelo alvo ao receber o vínculo)
scLink=function(o){if(SC.on)return;SC.on=true;SC.v2=1;SC.e=o.e||null;SC.k=o.k||null;SC.from=o.from||null;SC.lab=o.lab||'Rival';SC.ph='cine';SC.t=0;SC.pt=0;SC.ta=0;SC.tb=0;SC.fa=0;SC.fb=0;SC.res=null;SC.ack=!!(SC.e||SC.from);SC.n=o.n||0;SC.miss=0;SC.rx=0;SC.mine=!SC.from;
 if(SC.e){SC.e.sclk=1}
 // igualar a mana: média das duas (limitada à mana máxima de cada um)
 if(SC.e){const em=Math.max(10,P.mmp*.8);const eq=Math.min(P.mmp,(P.mp+em)/2);SC.eq=eq;P.mp=eq;SC.e.scm=eq}
 else if(SC.from){const eq=Math.min(P.mmp,(P.mp+Math.max(0,+o.rmp||0))/2);SC.eq=eq;P.mp=eq}
 else{SC.eq=null}
 SC.mpL=P.mp;
 const ch=scBlueChain(Math.round(30*Math.max(.6,KQ())));S.add(ch);const cir=fCircle(6,'g',true,fTexSplit());S.add(cir);const halo=[];for(let s=0;s<2;s++){const h=fCircle(1.4,'g');S.add(h);halo.push(h)}
 SC.fx={ch,cir,halo};try{fSound('link')}catch(e){}sc2UI().classList.add('on');$('sc2bn').textContent=String(SC.lab).replace(/[<>&]/g,'').slice(0,14);
 // cena de ativação: câmera no rosto de quem lançou + a fala
 const caster=SC.from?MP.others[SC.from]:null;if(caster)sc2FaceCam(()=>caster.x,()=>caster.z,()=>+(caster.pr&&caster.pr.p&&caster.pr.p[3])||0);else sc2FaceCam(()=>P.x,()=>P.z,()=>P.f);
 sc2Cap('“'+SCH2.LINE+'”');banner('SOUL CHAIN DEATHMATCH','As correntes ligaram os dois','#ff8a2a');try{fLight(P.x,3,P.z,6,FGD)}catch(e){}
 if(SC.k)sc2Pub()};
function sc2Pub(){if(!SC.on||SC.e){return}const me={v:2,ph:SC.ph,mp:Math.round(P.mp),tp:SC.ta,fin:SC.fa?1:0};if(SC.k){Object.assign(me,{n:SC.n,to:SC.k,pw:0,tp0:0});if(SC.res)me.res=SC.res}else if(SC.from){Object.assign(me,{n:SC.n,to:SC.from,rn:SC.n,eq:Math.round(SC.eq||0)})}MP.sc=me}
// dano não é mais igualado (a nova regra iguala a mana)
scOut=function(k,d){return d};
// cast bloqueado na cena e na disputa (fase das correntes: pode lutar normalmente, sem regenerar mana)
{const _c=cast;cast=function(i,ph){if(SC.on&&SC.v2&&SC.ph!='mana'){return}return _c.apply(this,arguments)}}
scTick=function(dt){if(!SC.on)return;if(!SC.v2)return;SC.t+=dt;const pt=sc2Partner();
 if(!pt){SC.miss+=dt;if(SC.miss>3||SC.e){scEnd(SC.e?'dead':'gone');return}}else SC.miss=0;
 if(P.hp<=0){scEnd('dead');return}if(pt&&SC.ph=='mana'&&Math.hypot(pt.x-P.x,pt.z-P.z)>36){scEnd('far');return}
 if(!SC.ack&&SC.t>4){scEnd('noreply');return}if(!SC.e&&SC.ack&&SC.ph!='fin'&&SC.t-(SC.rx==null?SC.t:SC.rx)>4){scEnd('gone');return}
 const hold=SC.ph!='mana';if(hold){P.lock=Math.max(P.lock||0,.25);P.iv=Math.max(P.iv||0,.25);if(SC.e)SC.e.st=Math.max(SC.e.st||0,.3)}
 if(SC.ph=='cine'){P.mp=Math.min(P.mp,SC.mpL);SC.mpL=P.mp;if(SC.t>1.7){SC.ph='mana';SC.pt=0;sc2Cap('');sc2CamOff();toast('Correntes ativas: a mana dos dois foi igualada e não regenera.')}}
 else if(SC.ph=='mana'){SC.pt+=dt;const eq=SC.eq||P.mmp*.6,drain=Math.max(2,eq/22);// as correntes queimam mana aos poucos (garante o fim da fase)
  P.mp=Math.max(0,Math.min(P.mp,SC.mpL)-drain*dt);SC.mpL=P.mp;
  if(SC.e){SC.e.scm=Math.max(0,(SC.e.scm||0)-drain*dt)}
  const other=SC.e?SC.e.scm:SC.rmp;const zero=P.mp<=.5&&(other!=null&&other<=.5);
  if(SC.mine&&(zero||SC.pt>75)){P.mp=0;if(SC.e)SC.e.scm=0;sc2Duel()}}
 else if(SC.ph=='duel'){SC.dt+=dt;P.mp=0;SC.mpL=0;if(SC.e){const r=(5+Math.min(4,(SC.e.lv||1)/12)+(SC.e.boss?1.5:0))*(.75+Math.random()*.5);SC.tb=Math.min(Math.floor(SC.dt*SCH2.RATE),SC.tb+r*dt)}
  if(SC.dt>=SCH2.TAP&&!SC.fa){SC.fa=1;$('sc2fist').classList.remove('on');toast('Tempo! Contando os toques...')}
  if(SC.fa){SC.wt=(SC.wt||0)+dt;if(SC.mine){if(SC.e||SC.fb||SC.wt>3){sc2Decide()}}else if(SC.wt>6&&!SC.res){sc2Apply(sc2Calc(SC.tb,SC.ta))}}}
 else if(SC.ph=='fin'){P.mp=0;SC.mpL=0}
 sc2Pub();sc2Draw(dt,pt)};
function sc2Duel(){try{document.body.classList.add('sc2duel')}catch(e){}SC.ph='duel';SC.dt=0;SC.ta=0;SC.fa=0;SC.wt=0;sc2UI();$('sc2fist').classList.add('on');$('sc2n').textContent='0';banner('SEM MANA!','Toque no punho o mais rápido que puder · 30 s','#ff8a2a');try{fSound('charge')}catch(e){}}
// contagem: a = quem lançou, b = alvo; os toques acima de 15/s são descartados
function sc2Calc(a,b,mine){const cap=Math.floor(SCH2.TAP*SCH2.RATE)+3;a=Math.max(0,Math.min(cap,Math.floor(+a||0)));b=Math.max(0,Math.min(cap,Math.floor(+b||0)));return{w:a==b?'tie':(a>b?'a':'b'),a,b}}
function sc2Decide(){if(SC.res)return;const r=sc2Calc(SC.ta,SC.tb);SC.res=r;sc2Pub();sc2Apply(r)}
function sc2Apply(r){if(SC.ph=='fin')return;SC.ph='fin';SC.res=r;$('sc2fist').classList.remove('on');const meA=SC.mine,iWin=r.w=='tie'?null:((r.w=='a')==meA);SC.win=iWin;const my=meA?r.a:r.b,th=meA?r.b:r.a;
 banner(iWin==null?'EMPATE!':iWin?'VOCÊ VENCEU!':'VOCÊ PERDEU!',my+' × '+th+' toques','#ff8a2a');sc2Final(iWin)}
// cena final (≈2,4 s): o vencedor avança e acerta um soco carregado de determinação; o perdedor é arremessado
function sc2Final(iWin){const pt=sc2Partner()||{x:P.x+2,z:P.z};sc2SideCam();const sx=P.x,sz=P.z,ax=pt.x,az=pt.z,dx=ax-sx,dz=az-sz,L=Math.hypot(dx,dz)||1,ux=dx/L,uz=dz/L;let hitDone=false;
 const fist=new T.Group();const fm=GLM(0xff8a2a,.85),fm2=GLM(0xffe0a0,.9);for(let k=0;k<5;k++){const m=new T.Mesh(V82G.ash||new T.SphereGeometry(1,12,10),k?fm:fm2);m.scale.setScalar(k?.22:.3);m.position.set(k?((k%2)-.5)*.3:0,k>2?.15:-.05,k?-.1:0);fist.add(m)}fist.visible=false;S.add(fist);
 kfx({u:(f,dt)=>{const t=f.t;P.lock=Math.max(P.lock||0,.25);P.iv=Math.max(P.iv||0,.25);
  const wx=iWin===false?ax:sx,wz=iWin===false?az:sz,lx=iWin===false?sx:ax,lz=iWin===false?sz:az,s=iWin===false?-1:1;
  if(iWin===true&&t<.9){const k=Math.min(1,t/.8);P.x=sx+ux*(L-1.4)*k*k;P.z=sz+uz*(L-1.4)*k*k;P.f=Math.atan2(ux,uz);if(t>.5&&!f.p){f.p=1;startPose('push')}}
  if(iWin!=null&&t>.45&&t<1.1){fist.visible=true;const k=Math.min(1,(t-.45)/.5);fist.position.set(wx+(lx-wx)*k*.85,1.35,wz+(lz-wz)*k*.85);fist.scale.setScalar(.6+k*.9)}
  if(!hitDone&&t>=1){hitDone=true;fist.visible=false;if(iWin!=null){kShock(lx,lz,5,0xff8a2a,.5,1.2);kShock(lx,lz,3,0xffffff,.35,1.4);P.shake=Math.max(P.shake||0,.8);try{fSound('mega')}catch(e){}fxp({x:lx,y:1.3,z:lz,c:0xffb040,n:Math.round(40*KQ()),sp:9,sz:.35,life:.7,g:6,up:4})}else{kShock(sx,sz,3,0xffd040,.4,1);kShock(ax,az,3,0xffd040,.4,1)}}
  if(hitDone&&iWin===false&&t<1.6){const k=(t-1)/.6;P.x=sx-ux*3.5*Math.sin(k*1.57)*1;P.z=sz-uz*3.5*Math.sin(k*1.57)}
  return t<2.4},end:()=>{kDispose(fist);sc2Result(iWin)}})}
function sc2Result(iWin){try{if(iWin===false){const v=Math.round(P.mhp*.4);P.iv=0;P.hp=Math.max(1,P.hp-v);dmgNum(P.x,2.4,P.z,v,0,'pl');toast('A Soul Chain acabou: você perdeu a disputa.')}else if(iWin===true){if(SC.e&&SC.e.hp>0){const e=SC.e;hitE(e,Math.round(e.mhp*(e.boss?.25:.45)),null)}toast('A Soul Chain acabou: você venceu a disputa!')}else toast('A Soul Chain acabou empatada.')}catch(e){}scEnd('done')}
function sc2Draw(dt,pt){const F=SC.fx;if(!F||!pt)return;const t=performance.now()/1000;_fb.set(P.x,P.y+1.3,P.z);const pb=new T.Vector3(pt.x,(pt.y||0)+1.3,pt.z);fChainSet(F.ch,_fb,pb,t,{sag:-.6,wig:SC.ph=='duel'?.35:.15});const mx=(P.x+pt.x)/2,mz=(P.z+pt.z)/2;F.cir.position.set(mx,.07,mz);kCircleTick(F.cir,dt,Math.min(1,SC.t/.5),0);F.halo[0].position.set(P.x,.1+P.y,P.z);F.halo[1].position.set(pt.x,.1,pt.z);F.halo.forEach(h=>kCircleTick(h,dt,1,Math.max(0,Math.sin(t*6))*.2));
 // painel
 const eq=Math.max(1,SC.eq||P.mmp),ph=$('sc2ph');if(SC.ph=='duel'||SC.ph=='fin'){const cap=SCH2.TAP*SCH2.RATE*.6,b=Math.floor(SC.tb);$('sc2a').style.width=Math.min(100,SC.ta/cap*100)+'%';$('sc2b').style.width=Math.min(100,b/cap*100)+'%';$('sc2an').textContent=SC.ta;$('sc2bnn').textContent=b;$('sc2n').textContent=SC.ta;ph.textContent=SC.ph=='fin'?'Resultado':'Disputa · '+Math.max(0,Math.ceil(SCH2.TAP-SC.dt))+'s'}
 else{const om=SC.e?SC.e.scm:SC.rmp;$('sc2a').style.width=Math.min(100,P.mp/eq*100)+'%';$('sc2b').style.width=Math.min(100,(om||0)/eq*100)+'%';$('sc2an').textContent=Math.floor(P.mp);$('sc2bnn').textContent=om==null?'…':Math.floor(om);ph.textContent=SC.ph=='cine'?'Ativando':'Mana travada'}}
scEnd=function(why){if(!SC.on)return;SC.on=false;if(SC.e){delete SC.e.scp;delete SC.e.scf;delete SC.e.sclk;delete SC.e.scm}const F=SC.fx;SC.fx=null;MP.sc=null;sc2CamOff();sc2Cap('');
 try{document.body.classList.remove('sc2duel');const w=$('sc2w');if(w&&w.classList)w.classList.remove('on');$('sc2fist').classList.remove('on')}catch(e){}
 if(F){fChainFade(F.ch,.9);const cir=F.cir,halo=F.halo;kfx({u:(f,dt)=>{const k=Math.max(.01,1-f.t/.8);UD(cir).inner.scale.setScalar(k);halo.forEach(h=>UD(h).inner.scale.setScalar(k));return f.t<.8},end:()=>{kDispose(cir);halo.forEach(kDispose)}})}
 if(why!='done')toast(why=='dead'?'Soul Chain desfeita: alguém caiu.':why=='gone'?'Soul Chain desfeita: o rival saiu da sala.':why=='far'?'Soul Chain desfeita: distância grande demais.':why=='noreply'?'Soul Chain falhou: o outro jogador não respondeu.':why=='busy'?'Soul Chain falhou: o outro jogador já está numa corrente.':'Soul Chain interrompida.');
 SC.e=null;SC.k=null;SC.from=null;SC.ph=null;SC.res=null;P.lock=Math.min(P.lock||0,.05)};
// rede: pedidos, respostas e estado do parceiro
scRemote=function(o,peer,pr){const sc=pr.sc;
 if(!sc||typeof sc!=='object'){return}
 if(sc.v!==2)return;
 // resposta do alvo para o meu vínculo
 if(SC.on&&SC.k===peer&&sc.to===MP.myPeer&&sc.rn===SC.n){if(sc.no){scEnd('busy');return}SC.ack=true;SC.rx=SC.t;if(sc.eq!=null&&SC.eq==null){SC.eq=Math.max(0,Math.min(P.mmp,+sc.eq));P.mp=SC.eq;SC.mpL=P.mp}SC.rmp=Math.max(0,+sc.mp||0);if(SC.ph=='duel'||SC.ph=='fin'){SC.tb=Math.max(SC.tb,Math.min(Math.floor((SC.dt+1)*SCH2.RATE)+3,+sc.tp||0));if(sc.fin)SC.fb=1}return}
 // estado de quem me prendeu
 if(SC.on&&SC.from===peer&&sc.to===MP.myPeer&&!sc.rn){SC.rx=SC.t;SC.rmp=Math.max(0,+sc.mp||0);if(sc.ph=='duel'&&SC.ph=='mana'){P.mp=0;sc2Duel()}if(SC.ph=='duel'||SC.ph=='fin'){SC.tb=Math.max(SC.tb,Math.min(Math.floor(((SC.dt||0)+1)*SCH2.RATE)+3,+sc.tp||0))}if(sc.res&&SC.ph!='fin'){const r=sc2Calc(sc.res.a,sc.res.b);sc2Apply(r)}return}
 // novo vínculo contra mim
 if(sc.to===MP.myPeer&&!sc.rn){if(+sc.n<=(o.scn||0))return;o.scn=+sc.n;if(SC.on||P.hp<=0||nearVil(P.x,P.z)){MP.sc={v:2,n:sc.n,to:peer,rn:sc.n,no:1};setTimeout(()=>{if(!SC.on&&MP.sc&&MP.sc.no)MP.sc=null},2500);return}
  scLink({from:peer,n:+sc.n,rmp:+sc.mp||0,lab:pr.nm||'Jogador'});SC.rmp=+sc.mp||0;MP.sc={v:2,n:sc.n,to:peer,rn:sc.n,eq:Math.round(SC.eq),mp:Math.round(P.mp),ph:'cine',tp:0};toast('Você foi preso pela Soul Chain!');return}
 // dois outros jogadores ligados: só o visual da corrente
 if(sc.to&&!sc.rn&&+sc.n>(o.scn||0)){o.scn=+sc.n;const t2=MP.others[sc.to];if(!t2)return;const ch=scBlueChain(20);S.add(ch);const A=new T.Vector3(),B=new T.Vector3();kfx({u:(f,dt)=>{A.set(o.x,1.3,o.z);B.set(t2.x,1.3,t2.z);fChainSet(ch,A,B,f.t,{sag:-.5,wig:.1});const live=o.pr&&o.pr.sc&&o.pr.sc.n==sc.n;return f.t<120&&live&&MP.others[sc.to]&&MP.others[peer]},end:()=>fChainFade(ch,.6)})}};
// quem lança: fSoul monta MP.sc antigo; aqui troca pelo formato novo com o número do vínculo
{const _l=scLink;scLink=function(o){if(o&&o.k){const n=(MP.scN||1);o.n=n}_l(o);if(SC.on&&SC.k){SC.n=o.n;sc2Pub()}}}

// ================= V95 · guarda as listas de magias de cada versão (para a tela "Escolher magias") =================
try{window.GRHIST=window.GRHIST||{};for(const k in GR){if(GR[k]&&Array.isArray(GR[k].s))(GRHIST[k]=GRHIST[k]||[]).push(GR[k].s.slice())}}catch(e){}

