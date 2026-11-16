// ================= PROGRESSÃO: desbloqueio das habilidades por grimório (nível máximo continua 50) =================
const SKLG={_:[1,5,10,15,25,40],nenhum:[1,4,8,12,20,30],fogo:[1,5,10,16,25,38],agua:[1,5,10,16,25,40],luz:[1,5,10,16,25,40],vento:[1,5,11,18,26,40],
 anti:[1,5,10,18,26,40],tempo:[1,6,12,20,28,42],kotodama:[1,6,12,22,30,42],sangue:[1,6,12,22,30,44],sonhos:[1,7,14,24,32,45],espacial:[1,7,14,24,32,45],sombra:[1,6,12,20,28,42]};
function sklOf(id){return SKLG[id]||SKLG._}
function skl(i){return sklOf(P.g?P.g.id:'_')[i]}
// ================= MANA: consumo próprio de cada grimório (redução moderada; Anti-Magia, magias normais e Uniões diferentes) =================
const MCF={fogo:.85,agua:.85,luz:.85,vento:.85,tempo:.86,kotodama:.88,anti:.9,sangue:.86,sonhos:.86,espacial:.86,sombra:.87,nenhum:1};
function mcost(s){if(!s||!s[1])return 0;const f=(P.g&&MCF[P.g.id])||.88;return Math.max(1,Math.round(s[1]*f*(ALT()?.92:1)))}

// ================= CONTRATOS E DOMÍNIO DOS DEMÔNIOS =================
// A União precisa ser conquistada: pacto (conversa) ou domínio (batalha). O relacionamento fica salvo na conta (P.rel).
// Personalidades, falas e números são adaptações do Clover RPG inspiradas nos personagens de Black Clover.
const DPS={
 liebe:{n:'Liebe',g:'anti',col:AR,tag:'Orgulhoso, provocador e leal a quem o trata como igual',pref:{alianca:.95,pacto:.35,confianca:.7,desafio:.6},fight:.55,minLv:10,req:15,hp:1.05,
  L:{first:'Hã? Um humano aqui dentro? ...Você é o dono desse grimório, é?',again:'Voltou. Achei que tinha desistido.',lost:'Heh. Da última vez eu fiquei com seu corpo um minuto inteiro. Quer apanhar de novo?',req:'Ainda não fez o que eu pedi.',reqd:'...Você fez mesmo. Tá bom, tá bom.',
   alianca:['Lutar lado a lado? ...Como irmãos? Ninguém nunca me disse isso.','Aliança? Hmph. Fala bonito, mas eu não sigo ninguém.'],pacto:['Um pacto... você quer me usar como ferramenta?','Pacto não. Eu não sou objeto de ninguém!'],confianca:['Você confia num demônio? Que idiota... eu gosto disso.','Confiança se prova, não se fala.'],desafio:['Desafiando o Liebe? Finalmente alguém divertido!','Você? Nem vale a pena.'],
   accept:'Tá certo. A gente luta junto. Mas se você me trair, eu te arrasto pro abismo.',refuse:'Não. Volta quando tiver algo melhor pra dizer.',prove:'Prova primeiro. Derrota 15 inimigos com a anti-magia e volta aqui.',battle:'Chega de papo. Se quer minha força, toma ela na marra!',win:'Tch... você é forte. Tá bom. Meu poder é seu. Mas isso não quer dizer que eu obedeço!',lose:'Hahaha! Agora o corpo é MEU por um minuto!',pact:'Esse é o nosso contrato. Não me faz me arrepender.'}},
 gimodelo:{n:'Gimodelo',g:'sombra',col:0xffd23a,tag:'Fiel à matilha, desconfiado de estranhos',pref:{alianca:.6,pacto:.5,confianca:.95,desafio:.4},fight:.3,minLv:8,req:12,hp:.95,
  L:{first:'Grrr... cheiro de humano. Você caminha na sombra do Nacht?',again:'A matilha lembra do seu cheiro.',lost:'Você caiu como presa. A matilha não esquece.',req:'Ainda não caçou o suficiente.',reqd:'Bom faro. Você caçou de verdade.',
   alianca:['Aliança... a matilha caça junta.','Alianças quebram. Matilhas não.'],pacto:['Um pacto de caça. Pode ser.','Palavras de papel não prendem um cão.'],confianca:['Você baixa a guarda na frente de um lobo... isso é confiança.','Confiar rápido demais é coisa de presa.'],desafio:['Quer medir as presas? Vem!','Não perco tempo com filhotes.'],
   accept:'Então corre com a gente. Você agora tem uma matilha.',refuse:'Grrr... ainda não.',prove:'Cace 12 inimigos com a sombra e volte.',battle:'A caça começa AGORA!',win:'Você venceu o líder... então você é o líder.',lose:'A presa ficou com a gente. Um minuto de caçada!',pact:'Uiva com a gente. O contrato está selado.'}},
 slotos:{n:'Slotos',g:'sombra',col:0x8ab0ff,tag:'Lento, paciente e inabalável; respeita quem aguenta',pref:{alianca:.5,pacto:.65,confianca:.55,desafio:.75},fight:.25,minLv:10,req:10,hp:1.3,
  L:{first:'...Quem... bate... à porta da fortaleza?',again:'...De novo... você.',lost:'...Você... não aguentou... o peso.',req:'...O peso... ainda não... foi carregado.',reqd:'...Você... aguentou. Bom.',
   alianca:['...Aliança... exige... paciência.','...Aliados vêm... e vão.'],pacto:['...Um pacto... firme... como pedra.','...Palavras... não pesam.'],confianca:['...Confiar... é carregar junto.','...Confiança... leva tempo.'],desafio:['...Quer... testar a muralha?','...Ainda não... é a hora.'],
   accept:'...Meu escudo... é seu.',refuse:'...Não. Volte... mais pesado.',prove:'...Derrote 10 inimigos... e volte.',battle:'...Então... SEGURE ISTO!',win:'...A muralha... cedeu. Você... carrega o escudo agora.',lose:'...Seu corpo... será a muralha... por um minuto.',pact:'...Selado. Não... cederemos.'}},
 plumede:{n:'Plumede',g:'sombra',col:0xc070ff,tag:'Impaciente, veloz e brincalhão',pref:{alianca:.55,pacto:.85,confianca:.5,desafio:.55},fight:.45,minLv:8,req:12,hp:.85,
  L:{first:'Hm? Um humano lento na minha sombra. Fala rápido.',again:'Você de novo? Rápido, rápido.',lost:'Muito lento! Seu corpo foi meu por um minuto, hehe.',req:'Ainda devagar.',reqd:'Ah, agora sim, mais rápido!',
   alianca:['Aliança? Tá, tanto faz, se for rápido.','Aliança é muito longo de explicar. Próximo!'],pacto:['Pacto rápido? Gostei!','Pacto... de novo? Que tédio.'],confianca:['Confiança... tá, mas não pisca.','Confia em mim? Eu sumo antes.'],desafio:['Corrida? Vem me pegar!','Desafio? Bocejo.'],
   accept:'Fechado! Não pisca, segue a sombra.',refuse:'Nah. Volta quando ficar mais rápido.',prove:'Derrota 12 inimigos rapidinho e volta.',battle:'Pega se puder!',win:'Ei! Você me pegou... justo. Tá, pode usar minha agilidade.',lose:'Hehe, um minuto correndo no seu corpo!',pact:'Pronto, pronto! Contrato feito.'}},
 walgner:{n:'Walgner',g:'sombra',col:0xff2a3a,tag:'Barulhento, orgulhoso e amante de desafios',pref:{alianca:.5,pacto:.45,confianca:.45,desafio:.9},fight:.8,minLv:10,req:15,hp:1,
  L:{first:'Có-có-ri-cóóó! Quem ousa entrar no meu amanhecer?!',again:'De novo, desafiante?!',lost:'Kokekoo! Eu cantei e você caiu!',req:'Ainda não ouvi sua vitória!',reqd:'Agora sim! Ouvi daqui!',
   alianca:['Aliança com um galo de briga? Hm!','Aliança? Prefiro uma briga!'],pacto:['Um pacto... se for barulhento!','Pacto silencioso? Nunca!'],confianca:['Confia em mim? Que coragem!','Confiança? Mostra na briga!'],desafio:['UM DESAFIO! Finalmente!','Você ainda não merece minha briga.'],
   accept:'Então canta comigo! Contrato aceito!',refuse:'NÃO! Volta mais forte!',prove:'Derrota 15 inimigos e eu vou ouvir!',battle:'COCORICÓ! Lute!',win:'Ugh... você venceu meu canto. Meu Crow é seu!',lose:'Kokekoo! Um minuto de canto no seu corpo!',pact:'Selado com o canto do amanhecer!'}},
 zagred:{n:'Zagred',g:'kotodama',col:0xc060ff,tag:'Arrogante, manipulador; só respeita poder',pref:{alianca:.2,pacto:.55,confianca:.15,desafio:.75},fight:.7,minLv:15,req:20,hp:1.2,
  L:{first:'Uma criatura pequena falando minha língua... Divertido.',again:'Voltou para ser corrigido?',lost:'Eu disse "ajoelhe-se". E você se ajoelhou.',req:'Ainda não ouvi as palavras certas.',reqd:'Hm. Suas palavras ganharam peso.',
   alianca:['Aliança? Com você? Que piada.','Eu não me alio a insetos.'],pacto:['Um pacto... posso ditar as regras.','Pactos com fracos são desperdício.'],confianca:['Confiar em mim? Que tolo.','Confiança é para os fracos.'],desafio:['Você me desafia? Então eu vou corrigir sua língua.','Ainda não vale minha voz.'],
   accept:'Que seja. Minhas palavras serão suas... por enquanto.',refuse:'Não. Rasteje e tente de novo.',prove:'Derrote 20 inimigos e então fale comigo.',battle:'AJOELHE-SE!',win:'...Impossível. Muito bem. Fale, e o mundo obedecerá.',lose:'Agora o seu corpo diz as MINHAS palavras.',pact:'Está escrito. Palavra por palavra.'}}};
const DOPT=[['alianca','🤝 Propor uma aliança'],['pacto','📜 Oferecer um pacto'],['confianca','💜 Demonstrar confiança'],['desafio','⚔️ Desafiar o demônio'],['batalha','🔥 Recusar e escolher a batalha']];
const DPLY={alianca:'Quero lutar ao seu lado. Como aliados.',pacto:'Vamos fazer um pacto. Seu poder, minha vontade.',confianca:'Eu confio em você. Não precisamos de correntes.',desafio:'Se quer meu respeito, me enfrente!',batalha:'Chega de conversa. Vou te dominar na batalha.'};
function relOf(k){P.rel=P.rel||{};return P.rel[k]||(P.rel[k]={met:0,props:0,acc:0,wins:0,losses:0,trust:0,resp:0,st:'none',req:null,fu:0})}
function relOk(k){const r=relOf(k);return r.st=='pacto'||r.st=='dominado'}
function relLbl(k){const r=relOf(k);return{none:'Sem contato',conhecido:'Conhecido',exigencia:'Exigência: '+(r.req?r.req.have+'/'+r.req.n:''),pacto:'Pacto de aliança',dominado:'Dominado na batalha'}[r.st]||r.st}
function relKill(){if(!P.g||!P.rel)return;for(const k in DPS){const r=P.rel[k];if(!r||r.st!='exigencia'||!r.req||DPS[k].g!=P.g.id)continue;if(r.req.have<r.req.n){r.req.have++;if(r.req.have>=r.req.n)toast('💬 '+DPS[k].n+' notou: a exigência foi cumprida. Volte à dimensão para o contrato.')}}}
// falas em ocasiões especiais (respeito no pacto, provocação no domínio)
const DCHAT={p:['Bom trabalho... parceiro.','Hmph. Nada mal.','Estou de olho em você, de um jeito bom.'],d:['Não fique convencido só porque me venceu.','Ainda vou tomar esse corpo de volta, heh.','Fraco... não. Mas também não é tudo isso.']};
function demonChat(){if(!P.g||!P.rel)return;const k=Object.keys(DPS).find(k=>DPS[k].g==P.g.id&&relOk(k));if(!k)return;const r=relOf(k),L=DCHAT[r.st=='dominado'?'d':'p'];toast('💬 '+DPS[k].n+': '+L[Math.floor(Math.random()*L.length)])}
// ---------- dimensão isolada (o mapa não é alterado; só escondido e restaurado) ----------
const ENC={on:false};
function encHide(){const keep=new Set([pm,book,KL,sun,sun.target,ENC.dim.g,ENC.dm].concat(ENC.keep||[]));for(const o of S.children){if(!o.visible||keep.has(o)||o.isLight||o.geometry===PG)continue;o.visible=false;ENC.hid.push(o)}if(SKY.visible){SKY.visible=false;ENC.hid.push(SKY)}if(S.fog){ENC.fog0=S.fog.color.clone();ENC.fn=S.fog.near;ENC.ff=S.fog.far;S.fog.color.setHex(ENC.dim.g.userData.fog||0x0a0410);S.fog.near=20;S.fog.far=110}for(const e of enemies)if(!e.dboss&&!e.gwx){e.gwx=1;e.encx=1;e.dcy=null}}
function encOpen(k){const D=DPS[k];if(!D||ENC.on||CS.on||POS.on||!run)return false;if(!P.g||P.g.id!=D.g){toast(D.n+' vive no Grimório de '+GR[D.g].n+'.');return false}if(!dLvOk(k)){dLvMsg();return false}if(GW.on)gwExit('silent');try{xEndAll('swap')}catch(e){}
 const r=relOf(k);Object.assign(ENC,{on:true,k,D,r,t:0,mode:'intro',home:[P.x,P.z],f:P.f,px:P.x,pz:P.z,hid:[],keep:[],refusals:0,cp:cam.position.clone(),cl:new T.Vector3(P.x,1.6,P.z),tp:cam.position.clone(),tl:new T.Vector3(P.x,1.6,P.z),wait:0,q:[],said:0});
 ENC.dim=csDim(k=='zagred'?'zagred':k);ENC.dim.g.position.set(P.x,0,P.z);ENC.dim.g.rotation.y=P.f;S.add(ENC.dim.g);ENC.dm=csDemon(k);S.add(ENC.dm);ENC.da=0;encHide();
 P.dcin=1;P.iv=9999;P.lock=9999;jx=jz=0;document.body.classList.add('cineon');const ui=$('cine');if(ui&&ui.classList){ui.classList.add('on');$('csub').innerHTML='';$('ctitle').className='';$('cscene').textContent=r.met?'DIMENSÃO DE '+D.n.toUpperCase():'PRIMEIRO ENCONTRO — '+D.n.toUpperCase()}
 ENC.music=csMusic(k);CS.int=.3;xFlash('#000000',.7);xSnd('esrift');r.met=(r.met||0)+1;if(r.st=='none')r.st='conhecido';
 const g0=r.met>1?(r.losses>0&&r.wins==0?D.L.lost:r.st=='exigencia'?(r.req&&r.req.have>=r.req.n?D.L.reqd:D.L.req):D.L.again):D.L.first;encQ(k,g0,3.2);if(r.met==1)encQ(k,'...Você tem coragem de entrar aqui. Diga logo o que quer.',3);
 if(r.st=='exigencia'&&r.req&&r.req.have>=r.req.n){encQ(k,D.L.accept,3);ENC.after='pact'}saveGame();return true}
function encQ(who,txt,dur){ENC.q.push([who,txt,dur])}
function encSay(){if(ENC.wait>0||!ENC.q.length)return false;const [w,t,d]=ENC.q.shift();csSay(w,t);ENC.wait=d;ENC.talk=w;return true}
// demônio com vida: anda, observa, reage
function encDemonAI(dt,tm){const D=ENC.dm,u=UD(D);const [fx,fz]=[Math.sin(ENC.f),Math.cos(ENC.f)];let tx,tz;
 if(ENC.mode=='intro'&&ENC.t<6){const a=ENC.f+Math.PI*.5-ENC.t*.4,r=7-ENC.t*.4;tx=ENC.px+Math.sin(a)*r;tz=ENC.pz+Math.cos(a)*r}else{const d=ENC.mode=='pact'?Math.max(1.9,3.4-ENC.pt*.5):3.4;tx=ENC.px+fx*d+Math.cos(ENC.f)*Math.sin(tm*.5)*(ENC.mode=='choice'?.6:0);tz=ENC.pz+fz*d-Math.sin(ENC.f)*Math.sin(tm*.5)*(ENC.mode=='choice'?.6:0)}
 const dx=tx-D.position.x,dz=tz-D.position.z,dd=Math.hypot(dx,dz);let mv=0;if(dd>.08){D.position.x+=dx*Math.min(1,dt*2);D.position.z+=dz*Math.min(1,dt*2);mv=1}D.rotation.y=Math.atan2(P.x-D.position.x,P.z-D.position.z);
 const mode=ENC.mode=='pact'&&ENC.pt>2?'reach2':ENC.talk==ENC.k&&ENC.wait>0?'talk':mv&&dd>.3?'walk':ENC.mood=='angry'?'rage':'idle';if(u.anim)u.anim(tm,mode);
 // olha para o jogador; ri / se irrita conforme o resultado
 if(ENC.mood=='angry'&&Math.random()<dt*3)fxp({x:D.position.x,y:1.5,z:D.position.z,c:ENC.D.col,n:2,sp:2,sz:.14,life:.5,up:2})}
function encFrame(dt){if(!ENC.on)return;const tm=performance.now()/1000;ENC.t+=dt;if(ENC.wait>0)ENC.wait-=dt;try{ENC.dim.anim.forEach(([o,f])=>f(o,tm))}catch(e){}
 if(ENC.mode=='battle'){dbTick(dt);return}
 P.iv=9999;P.lock=9999;for(const e of enemies)e.st=Math.max(e.st||0,.3);encDemonAI(dt,tm);encSay();const fh=csFaceH(),D=ENC.dm,fp=D.position,fH=UD(D).face||1.6,[fx,fz]=[Math.sin(ENC.f),Math.cos(ENC.f)];
 if(ENC.mode=='intro'){if(ENC.t<6){const a=ENC.f+1.6+ENC.t*.25;ENC.tp.set(P.x+Math.sin(a)*6,2.4,P.z+Math.cos(a)*6);ENC.tl.set((P.x+fp.x)/2,1.3,(P.z+fp.z)/2)}else{if(ENC.talk==ENC.k&&ENC.wait>0){ENC.tp.set(fp.x-fx*1.5+Math.cos(ENC.f)*.4,fH+.1,fp.z-fz*1.5-Math.sin(ENC.f)*.4);ENC.tl.set(fp.x,fH,fp.z)}else{ENC.tp.set(P.x-fx*2.2+Math.cos(ENC.f)*1,fh+.3,P.z-fz*2.2-Math.sin(ENC.f)*1);ENC.tl.set(fp.x,fH*.9,fp.z)}}
  if(ENC.t>6&&!ENC.q.length&&ENC.wait<=0){if(ENC.after=='pact')encPact();else encChoices()}}
 else if(ENC.mode=='choice'){ENC.tp.set(P.x+Math.cos(ENC.f)*3.5+fx*1.7,1.9,P.z-Math.sin(ENC.f)*3.5+fz*1.7);ENC.tl.set((P.x+fp.x)/2,1.3,(P.z+fp.z)/2)}
 else if(ENC.mode=='talk'){if(ENC.talk=='p'){ENC.tp.set(P.x+fx*1.25+Math.cos(ENC.f)*.4,fh+.05,P.z+fz*1.25-Math.sin(ENC.f)*.4);ENC.tl.set(P.x,fh,P.z)}else{ENC.tp.set(fp.x-fx*1.5+Math.cos(ENC.f)*.4,fH+.1,fp.z-fz*1.5-Math.sin(ENC.f)*.4);ENC.tl.set(fp.x,fH,fp.z)}if(!ENC.q.length&&ENC.wait<=0)encResolve()}
 else if(ENC.mode=='pact')encPactTick(dt,tm,fh);
 else if(ENC.mode=='out'){ENC.ot-=dt;if(ENC.ot<=0)encClose()}
 const k=1-Math.exp(-dt*2.4);ENC.cp.lerp(ENC.tp,k);ENC.cl.lerp(ENC.tl,k);cam.position.copy(ENC.cp);cam.lookAt(ENC.cl)}
function encChoices(){ENC.mode='choice';const el=$('cchoice');if(!el||!el.classList)return;const r=ENC.r;el.innerHTML='<b>'+accEsc(ENC.D.n)+'</b><small>Confiança '+Math.round(r.trust)+' · Respeito '+Math.round(r.resp)+(r.req?' · Exigência '+r.req.have+'/'+r.req.n:'')+'</small>'+DOPT.map(o=>'<button onclick="encPick(\''+o[0]+'\')">'+o[1]+'</button>').join('')+'<button class="sec" onclick="encLeave()">🚪 Sair da dimensão</button>';el.classList.add('on')}
function encPick(opt){const el=$('cchoice');if(el&&el.classList)el.classList.remove('on');const r=ENC.r,D=ENC.D;r.props++;ENC.mode='talk';encQ('p',DPLY[opt],2.6);
 if(opt=='batalha'){encQ(ENC.k,D.L.battle,2.6);ENC.res='battle';ENC.mood='angry';return}
 const d={alianca:[6,0],pacto:[3,1],confianca:[8,-1],desafio:[-2,8]}[opt];r.trust=Math.max(0,Math.min(100,r.trust+d[0]));r.resp=Math.max(0,Math.min(100,r.resp+d[1]));
 if(opt=='desafio'&&Math.random()<D.fight){encQ(ENC.k,D.L.desafio[0],2.6);encQ(ENC.k,D.L.battle,2.4);ENC.res='battle';ENC.mood='angry';return}
 const lvk=Math.max(-.35,Math.min(.25,(P.lv-D.minLv)/40)),reqd=r.req&&r.req.have>=r.req.n?.45:0,sc=D.pref[opt]+r.trust/220+r.resp/220+lvk+reqd+(Math.random()-.5)*.3;
 const good=sc>=.95,mid=sc>=.62;encQ(ENC.k,D.L[opt][good||mid?0:1],2.8);
 if(good){encQ(ENC.k,D.L.accept,3.2);ENC.res='accept';ENC.mood='calm'}else if(mid&&!r.req){encQ(ENC.k,D.L.prove,3);ENC.res='prove';ENC.mood='calm'}else{ENC.refusals++;if(ENC.refusals>=2&&Math.random()<.5+D.fight*.4){encQ(ENC.k,'Chega de conversa. Mostre na luta!',2.6);ENC.res='offer';ENC.mood='angry'}else{encQ(ENC.k,D.L.refuse,2.6);ENC.res='refuse';ENC.mood='angry'}}}
function encResolve(){const r=ENC.r,res=ENC.res;ENC.res=null;
 if(res=='accept')encPact();else if(res=='prove'){r.st='exigencia';r.req={n:DPS[ENC.k].req,have:0};saveGame();toast('Exigência de '+ENC.D.n+': derrote '+r.req.n+' inimigos usando o Grimório de '+GR[ENC.D.g].n+'.');encOut(1.2)}
 else if(res=='battle')dbStart();else if(res=='won')encOut(1.2);else if(res=='offer'){const el=$('cchoice');ENC.mode='choice';if(el&&el.classList){el.innerHTML='<b>'+accEsc(ENC.D.n)+' propôs uma batalha</b><button onclick="encPick(\'batalha\')">🔥 Aceitar a batalha</button><button class="sec" onclick="encLeave()">🚪 Recusar e sair</button>';el.classList.add('on')}}
 else encChoices()}
function encLeave(){const el=$('cchoice');if(el&&el.classList)el.classList.remove('on');encQ(ENC.k,'Hmph. Volte quando decidir.',2);ENC.mode='talk';ENC.res='leave';setTimeout(()=>{if(ENC.on&&ENC.res=='leave')encOut(.3)},2300)}
function encOut(t){ENC.mode='out';ENC.ot=t||.5}
