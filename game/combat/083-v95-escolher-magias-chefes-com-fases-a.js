// ================= V95 · Escolher magias · Chefes com fases · Arena de treino · Tutorial · Equilíbrio · Modo leve =================
// Tudo é adicionado por cima do que já existe (nenhuma magia, missão ou sistema antigo foi removido).
const V95={};
function v95St(){const v=v82S();v.lo=v.lo||{};v.tut=v.tut||{};return v}
const h95=c=>'#'+(c>>>0).toString(16).padStart(6,'0').slice(-6);
const e95=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const nm95=n=>String(n).replace(/^[^:]+:\s*/,'');

// ---------- estilos ----------
{const st=document.createElement('style');st.textContent=`
#lo95,#tu95{position:fixed;inset:0;z-index:80;display:none;align-items:center;justify-content:center;background:rgba(4,6,18,.78);font-family:Rajdhani,system-ui,sans-serif}
#lo95 .q5c,#tu95 .q5c{width:min(820px,94vw);max-height:92vh;overflow:auto;background:linear-gradient(180deg,#141a3c,#0b0f26);border:2px solid #c9a24a;border-radius:16px;box-shadow:0 0 0 1px #3a2a10 inset,0 18px 50px rgba(0,0,0,.6);color:#f3e7c8;padding:14px 16px}
#lo95 h3,#tu95 h3{font-family:Cinzel,Georgia,serif;font-weight:900;color:#f0cf72;margin:0 0 4px;font-size:20px;letter-spacing:.5px}
#lo95 .q5sub,#tu95 .q5sub{font-size:13px;opacity:.85;margin:0 0 10px}
#lo95 .q5ss{display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:10px}
#lo95 .q5s{position:relative;border:1.5px solid #5a4a2a;border-radius:12px;background:#0a0d22;padding:6px 4px;text-align:center;cursor:pointer;min-height:86px}
#lo95 .q5s.on{border-color:#f0cf72;box-shadow:0 0 12px #f0cf7288}
#lo95 .q5s.lk{opacity:.55}
#lo95 .q5s i{display:block;width:34px;height:34px;margin:0 auto 3px}
#lo95 .q5s i svg,#lo95 .q5l i svg,#tu95 i svg{width:100%;height:100%}
#lo95 .q5s b{display:block;font-size:11px;line-height:1.1;font-weight:700}
#lo95 .q5s small{display:block;font-size:10px;color:#c9a24a;margin-top:2px}
#lo95 .q5p{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:6px}
#lo95 .q5l{display:flex;gap:8px;align-items:center;border:1px solid #3a3250;border-radius:10px;background:#10142e;padding:6px 8px;cursor:pointer;text-align:left;color:#f3e7c8}
#lo95 .q5l.use{border-color:#7a6a3a;background:#1c1a2e}
#lo95 .q5l.lk{opacity:.45;cursor:not-allowed}
#lo95 .q5l i{flex:0 0 30px;height:30px}
#lo95 .q5l b{display:block;font-size:12.5px;line-height:1.15}
#lo95 .q5l small{display:block;font-size:10.5px;opacity:.8}
#lo95 .q5t{display:inline-block;font-size:9.5px;padding:0 5px;border-radius:6px;margin-left:4px;vertical-align:1px;background:#3a2a5a;color:#e0c8ff}
#lo95 .q5t.u{background:#5a4a1a;color:#ffe9a0}
#lo95 .q5r,#tu95 .q5r{position:sticky;bottom:-14px;background:linear-gradient(180deg,rgba(11,15,38,0),#0b0f26 35%);padding:10px 0 8px}
#lo95 .q5r,#tu95 .q5r{display:flex;gap:8px;justify-content:flex-end;margin-top:12px;flex-wrap:wrap}
#lo95 button.q5b,#tu95 button.q5b{font-family:Cinzel,Georgia,serif;font-weight:700;border:1.5px solid #c9a24a;background:#2a1e0e;color:#f0cf72;border-radius:10px;padding:8px 14px;font-size:14px;cursor:pointer}
#lo95 button.q5b.p,#tu95 button.q5b.p{background:linear-gradient(180deg,#9a1f2e,#6a0f1c);color:#fff3d6}
#tu95 .q5i{display:flex;gap:10px;align-items:flex-start;border-bottom:1px solid #2a2a48;padding:6px 0}
#tu95 .q5i i{flex:0 0 32px;height:32px}
#tu95 .q5i b{display:block;font-size:13.5px;color:#ffe9a0}
#tu95 .q5i span{font-size:12.5px;opacity:.9}
#tu95 .q5d{display:flex;gap:6px;justify-content:center;margin-top:10px}
#tu95 .q5d u{width:9px;height:9px;border-radius:50%;background:#3a3250;display:block}
#tu95 .q5d u.on{background:#f0cf72}
#tu95 ol{margin:4px 0 0 18px;padding:0;font-size:13.5px;line-height:1.5}
#b95{position:fixed;left:50%;transform:translateX(-50%);top:calc(104px + env(safe-area-inset-top));z-index:45;display:none;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:14px;border:2px solid #f0cf72;background:linear-gradient(180deg,#9a1f2e,#5a0a16);color:#fff3d6;border-radius:12px;padding:8px 14px;box-shadow:0 4px 18px rgba(0,0,0,.5);cursor:pointer;white-space:nowrap}
#b95 small{display:block;font-family:Rajdhani,sans-serif;font-weight:600;font-size:11px;color:#ffe9a0}
#trn95{position:fixed;left:50%;transform:translateX(-50%);top:calc(104px + env(safe-area-inset-top));z-index:44;display:none;background:rgba(10,13,34,.88);border:1.5px solid #c9a24a;border-radius:12px;color:#f3e7c8;font-family:Rajdhani,sans-serif;padding:4px 10px;gap:10px;align-items:center;pointer-events:auto}
#trn95 .q5k{text-align:center;min-width:52px}
#trn95 .q5k b{display:block;font-family:Cinzel,Georgia,serif;font-size:15px;color:#f0cf72;line-height:1.1}
#trn95 .q5k small{font-size:10.5px;opacity:.85}
#trn95 button{border:1px solid #c9a24a;background:#2a1e0e;color:#f0cf72;border-radius:8px;padding:4px 8px;font-weight:700;cursor:pointer}
#bh95{position:fixed;left:50%;transform:translateX(-50%);top:calc(104px + env(safe-area-inset-top));z-index:44;display:none;text-align:center;background:rgba(10,13,34,.85);border:1.5px solid #c9a24a;border-radius:10px;padding:3px 12px;white-space:nowrap;font-family:Cinzel,Georgia,serif;color:#fff3d6;pointer-events:none}
#bh95 b{font-size:15px;letter-spacing:.5px;text-shadow:0 2px 4px #000}
#bh95 .q5bar{height:12px;border:1.5px solid #c9a24a;border-radius:7px;background:#1a0a10;overflow:hidden;margin-top:3px;position:relative}
#bh95 .q5bar i{display:block;height:100%;background:linear-gradient(90deg,#ff3a4a,#9a1f2e)}
#bh95 .q5bar u{position:absolute;top:0;bottom:0;width:2px;background:#f0cf72}
#bh95 small{font-family:Rajdhani,sans-serif;font-size:12px;color:#ffe9a0}
body.ovon #b95,body.ovon #trn95,body.ovon #bh95{display:none!important}
.w95{position:fixed;z-index:46;pointer-events:none;font-family:Cinzel,Georgia,serif;font-weight:900;font-size:22px;color:#ffe9a0;text-shadow:0 0 8px #ff2a3a,0 2px 3px #000;transform:translate(-50%,-50%);white-space:nowrap}
@media (max-width:640px){#lo95 .q5ss{grid-template-columns:repeat(3,1fr)}#lo95 .q5p{grid-template-columns:1fr 1fr}#lo95 .q5l b{font-size:11.5px}}
`;document.head.appendChild(st)}
const d95=(id,html)=>{let o=document.getElementById(id);if(!o){o=document.createElement('div');o.id=id;document.body.appendChild(o)}if(html!=null)o.innerHTML=html;return o};

// =====================================================================
// 1) ESCOLHER MAGIAS — escolha 6 entre todas as magias que o grimório já teve
// =====================================================================
const LO95DEF={};for(const k in GR)if(GR[k]&&Array.isArray(GR[k].s))LO95DEF[k]=GR[k].s.slice();
// magias clássicas que ficaram muito acima das atuais no teste automático: dano ajustado só quando escolhidas aqui
const NERF95={'Blood: Crimson Dominion':.17,'Kotodama: World Dominion':.28,'Anti-Magic: Demonic Annihilation':.62},NC95={};
function nerf95(s){const f=NERF95[s[0]];if(!f)return s;if(!NC95[s[0]]){const c=s.slice();c[2]=Math.max(1,Math.round(s[2]*f));if(s[0]=='Kotodama: World Dominion')c[5]=Math.round((s[5]||45)*1.6);NC95[s[0]]=c}return NC95[s[0]]}
function lo95Pool(id){const out=[],seen=new Set(),L=sklOf(id),cur=new Set((LO95DEF[id]||[]).map(s=>s[0]));
 const add=(arr,old)=>arr.forEach((s,i)=>{if(!s||!s[0]||seen.has(s[0]))return;if(old&&/Devil Contract|Devil Union|Four Devil/.test(s[0]))return;seen.add(s[0]);if(old)s=nerf95(s);out.push({s,lv:L[Math.min(i,L.length-1)]||1,old:old&&!cur.has(s[0])})});
 add(LO95DEF[id]||[],0);(window.GRHIST&&GRHIST[id]||[]).slice().reverse().forEach(a=>add(a,1));return out}
function lo95Apply(id){const g=GR[id];if(!g||!LO95DEF[id])return;try{const st=v95St();if(st&&st.lo&&st.lo[id]){delete st.lo[id];g.s=LO95DEF[id].slice()}}catch(e){}return;const sel=null;if(!Array.isArray(sel)||sel.length!==LO95DEF[id].length){g.s=LO95DEF[id].slice();return}
 const m={};lo95Pool(id).forEach(p=>m[p.s[0]]=p.s);const arr=sel.map(n=>m[n]);if(arr.some(x=>!x)){g.s=LO95DEF[id].slice();return}g.s=arr}
function lo95ApplyCur(){try{if(P.g){lo95Apply(P.g.id);buildBtns()}}catch(e){}}
V95.sel=0;
function lo95Open(){return;const id=P.g.id;if(!LO95DEF[id]){toast('Este grimório não tem magias para escolher.');return}V95.id=id;V95.cur=(v95St().lo[id]||LO95DEF[id].map(s=>s[0])).slice();V95.sel=0;try{$('ov').style.display='none'}catch(e){}run=false;lo95Draw();d95('lo95').style.display='flex'}
function lo95Draw(){const id=V95.id,g=GR[id],L=sklOf(id),pool=lo95Pool(id),col=XIC(id),by={};pool.forEach(p=>by[p.s[0]]=p);
 let h='<div class="q5c"><h3>Escolher magias · '+e95(g.n||id)+'</h3><p class="q5sub">Toque num espaço e depois na magia que quer colocar nele. Os espaços liberam por nível; cada magia também tem o nível dela.</p><div class="q5ss">';
 V95.cur.forEach((n,i)=>{const p=by[n],lk=P.lv<L[i];h+='<div class="q5s'+(i==V95.sel?' on':'')+(lk?' lk':'')+'" onclick="lo95Slot('+i+')"><i>'+(p?skIcon(p.s[0],col):'')+'</i><b>'+(lk?'🔒 ':'')+e95(p?nm95(p.s[0]):'—')+'</b><small>Espaço '+(i+1)+' · Nv '+L[i]+'</small></div>'});
 h+='</div><div class="q5p">';
 pool.forEach((p,k)=>{const s=p.s,use=V95.cur.indexOf(s[0]),lk=P.lv<p.lv;h+='<button class="q5l'+(use>=0?' use':'')+(lk?' lk':'')+'" onclick="lo95Pick('+k+')"><i>'+skIcon(s[0],col)+'</i><span><b>'+(lk?'🔒 ':'')+e95(nm95(s[0]))+(use>=0?'<span class="q5t u">espaço '+(use+1)+'</span>':'')+(p.old?'<span class="q5t">clássica</span>':'')+'</b><small>'+(lk?'Libera no Nível '+p.lv+' · ':'')+'💧 '+mcost(s)+' · ⏱ '+String(+((s[5]||.5)*(1-cb('cdr'))).toFixed(1)).replace('.',',')+'s'+(s[2]?' · ⚔ '+s[2]:'')+'</small></span></button>'});
 h+='</div><div class="q5r"><button class="q5b" onclick="lo95Reset()">Padrão</button><button class="q5b" onclick="lo95Close(0)">Cancelar</button><button class="q5b p" onclick="lo95Close(1)">Salvar</button></div></div>';d95('lo95',h)}
window.lo95Slot=i=>{V95.sel=i;lo95Draw()};
window.lo95Pick=k=>{const p=lo95Pool(V95.id)[k];if(!p)return;if(P.lv<p.lv){toast('🔒 '+nm95(p.s[0])+' libera no Nível '+p.lv);return}const n=p.s[0],j=V95.cur.indexOf(n),i=V95.sel;if(j===i)return;if(j>=0){V95.cur[j]=V95.cur[i]}V95.cur[i]=n;V95.sel=Math.min(V95.cur.length-1,i+1);lo95Draw()};
window.lo95Reset=()=>{V95.cur=LO95DEF[V95.id].map(s=>s[0]);V95.sel=0;lo95Draw()};
window.lo95Close=ok=>{d95('lo95').style.display='none';if(ok&&V95.id){const def=LO95DEF[V95.id].map(s=>s[0]).join('|'),st=v95St();if(V95.cur.join('|')===def)delete st.lo[V95.id];else st.lo[V95.id]=V95.cur.slice();lo95ApplyCur();try{saveGame()}catch(e){}toast('Magias salvas!')}run=true;try{openMenu('gr')}catch(e){}};
window.lo95Open=lo95Open;
// aplica ao carregar o jogo e ao trocar de grimório
{const _lg=loadGame;loadGame=function(sv){const r=_lg.apply(this,arguments);try{lo95ApplyCur()}catch(e){}return r}}
{const _gg=giveGrim;giveGrim=function(id){try{lo95Apply(id)}catch(e){}const r=_gg.apply(this,arguments);try{lo95ApplyCur();setTimeout(()=>tu95Auto(),900)}catch(e){}return r}}
// botões na aba Grimório do menu
{const _om=openMenu;openMenu=function(t){const r=_om.apply(this,arguments);try{if(mt=='gr'&&P.g){const c=$('ov').querySelector('.card');if(c){const d=document.createElement('div');d.className='tabs';d.style.cssText='margin:8px 0';d.innerHTML=''+'<button class="k" onclick="tu95Open(\''+P.g.id+'\')">❔ Tutorial das magias</button>';const h2=c.querySelector('h2');if(h2&&h2.nextSibling)c.insertBefore(d,h2.nextSibling);else c.appendChild(d)}}}catch(e){}return r}}

// =====================================================================
// 4) TUTORIAL RÁPIDO DAS MAGIAS (3 passos, aparece 1 vez por grimório)
// =====================================================================
const DS95={
 'Flame Magic: Explosive Vanishing Scattershot':'Várias bolinhas de fogo que somem e explodem no alvo.',
 'Flame Magic: Timed Explosion Scattershot':'Planta bombas de fogo que explodem depois de alguns segundos.',
 'Secret Fire Magic: Soul Chain Deathmatch':'Prende você e o inimigo com correntes: um não foge do outro.',
 'Flame Magic: Maximum Exploding Fireball':'Bola de fogo gigante com explosão enorme.',
 'Flame Magic: Prison Kill Buckshot':'Chumbo de fogo em leque que prende quem é atingido.',
 'Secret Fire Magic: Soul Chain Tag Deathmatch':'Liga até 3 inimigos em correntes; o dano é dividido entre eles.',
 'Chrono: Time Steal':'Rouba tempo do inimigo: ele fica lento e você ganha tempo.',
 'Time Magic: Chrono Stasis':'Congela os inimigos da área no tempo.',
 'Chrono: Divine Acceleration':'Acelera você: corre e ataca mais rápido.',
 'Chrono: Time Halt':'Para o tempo de tudo em volta por alguns segundos.',
 'Chrono: Time Return':'Devolve os projéteis inimigos para quem atirou.',
 'Time Magic: Chrono Anastasis':'Volta o seu tempo: desfaz os ferimentos recentes.',
 'Anti-Magic: Bull Thrust':'Estocada rápida para a frente com a espada.',
 'Anti-Magic: Black Slash':'Corte de anti-magia que viaja em linha.',
 'Anti-Magic: One-Horn Bull Thrust':'Estocada mais forte que atravessa vários inimigos.',
 'Anti-Magic: Black Divider':'Golpe vertical que divide o chão e quebra magias.',
 'Anti-Magic: Black Hurricane':'Gira a espada criando um furacão negro que puxa inimigos.',
 'Anti-Magic: Black Meteorite':'Salta e cai como um meteoro de anti-magia.',
 'Kotodama: "Volta!"':'Manda o ataque de volta e empurra o inimigo.',
 'Kotodama: Thunder, Fire, Earth, Crush':'Cada uso diz uma palavra: RAIO, FOGO, TERRA e ESMAGUE.',
 'Kotodama: Rain of Swords':'Chove espadas na área.',
 'Kotodama: Copy':'Copia magias: alterna entre luz, dados e troca a cada uso.',
 'Kotodama: Mouths of the Underworld':'Abre bocas no chão que mordem os inimigos.',
 'Kotodama: Underworld Trident':'Invoca um monstro com tridente que golpeia a área.',
 'Blood: Crimson Scythe':'Arremessa foices de sangue.',
 'Blood: Sea of Blood':'Enche o chão de sangue: dano contínuo e lentidão.',
 'Blood Magic: Curse-Breaking Blood Cocoon':'Casulo de sangue que protege você.',
 'Blood Empress: Royal Dominion':'Domínio da Imperatriz: lanças de sangue na área toda.',
 'Blood: Blood Puppet':'Controla um inimigo como marionete por alguns segundos.',
 "Witch Queen's Healing":'Cura da Rainha das Bruxas: recupera sua vida.'};
const TIP95={
 anti:['As espadas ficam no Inventário: Matadora rebate projéteis, Habitadora absorve e devolve um corte, Destruidora quebra escudos e solta você de prisões.','Na União, a Katana não fere outros jogadores.'],
 tempo:['Time Halt para inimigos e projéteis. Use antes de um golpe forte.','Time Return devolve projéteis: espere o inimigo atirar.','Chrono Anastasis desfaz o dano dos últimos segundos.'],
 kotodama:['Palavras: cada uso muda a palavra (RAIO → FOGO → TERRA → ESMAGUE).','Cópia muda a cada uso (luz → dados → troca).','Passiva "Volte!": abaixo de 30% de vida você cura 30% (a cada 60 s).'],
 sangue:['A Foice de Sangue pode ser equipada como arma no Inventário.','Marionete faz o inimigo lutar do seu lado por alguns segundos.'],
 fogo:['Timed Explosion explode depois: plante e afaste-se.','Soul Chain precisa de um inimigo perto.'],
 vento:['Sylph aparece no botão próprio quando liberada.'],
 sombra:['Nacht e os demônios ficam no botão de União.'],
 leao:['Salamandra: você monta nela, fica mais rápido e cospe fogo.'],
 ossos:['Muralha de Ossos bloqueia projéteis.','Portal de Ossos teleporta você para a frente.'],
 algodao:['O Banquete recupera vida e mana.','Lobo na Pele de Ovelha é o golpe mais forte.']};
function ds95(s){if(DS95[s[0]])return DS95[s[0]];const ef=s[4]||{},t=[];const d=s[2]||0;
 t.push(d?(d<20?'Dano leve':d<40?'Dano médio':d<80?'Dano forte':'Dano muito forte'):'Sem dano direto (efeito/suporte)');
 if(ef.b)t.push('queima');if(ef.sl)t.push('deixa lento');if(ef.st)t.push('atordoa');if(ef.tr)t.push('mexe no tempo');
 const r=(typeof RNG!='undefined'&&RNG[s[3]]);if(r)t.push('alcance '+rngTxt(s));return t.join(' · ')+'.'}
V95.tp=0;
function tu95Open(id,pg){const g=GR[id];if(!g)return;V95.tid=id;V95.tp=pg||0;try{$('ov').style.display='none'}catch(e){}run=false;tu95Draw();d95('tu95').style.display='flex'}
function tu95Draw(){const id=V95.tid,g=GR[id],col=XIC(id),L=sklOf(id);let b='';
 if(V95.tp==0){b='<h3>1 · Suas magias</h3><p class="q5sub">Grimório '+e95(g.n||id)+'. Veja o que cada uma faz.</p>'+g.s.map((s,i)=>'<div class="q5i"><i>'+skIcon(s[0],col)+'</i><div><b>'+(i+1)+'. '+e95(nm95(s[0]))+(P.lv<L[i]?' <small style="color:#c9a24a">· Nível '+L[i]+'</small>':'')+'</b><span>'+e95(ds95(s))+'</span></div></div>').join('')}
 else if(V95.tp==1){b='<h3>2 · Como usar</h3><ol><li>Toque no botão da magia (no PC, teclas 1 a 6).</li><li>A magia sai para onde você está virado; com inimigo perto, ela mira sozinha.</li><li>Cada botão mostra a mana 💧 e a recarga ⏱. Com cadeado 🔒, ela libera num nível maior.</li><li>Usar a magia várias vezes sobe o nível dela (mais dano).</li></ol>'}
 else{const tp=(TIP95[id]||[]).concat(['Teste tudo na Arena do Campo de Treino (oeste da Vila Hage).']);b='<h3>3 · Dicas deste grimório</h3><ol>'+tp.map(x=>'<li>'+e95(x)+'</li>').join('')+'</ol>'}
 d95('tu95','<div class="q5c">'+b+'<div class="q5d">'+[0,1,2].map(k=>'<u class="'+(k==V95.tp?'on':'')+'"></u>').join('')+'</div><div class="q5r">'+(V95.tp>0?'<button class="q5b" onclick="tu95Go(-1)">Voltar</button>':'<button class="q5b" onclick="tu95Close()">Pular</button>')+(V95.tp<2?'<button class="q5b p" onclick="tu95Go(1)">Próximo</button>':'<button class="q5b p" onclick="tu95Close()">Entendi!</button>')+'</div></div>')}
window.tu95Go=k=>{V95.tp=Math.max(0,Math.min(2,V95.tp+k));tu95Draw()};
window.tu95Close=()=>{d95('tu95').style.display='none';try{v95St().tut[V95.tid]=1;saveGame()}catch(e){}run=true};
window.tu95Open=tu95Open;
function tu95Auto(){try{if(!P.g||!GR[P.g.id]||P.g.id=='nenhum'||v95St().tut[P.g.id])return;if(CS.on||ENC.on||$('ov').style.display=='flex'||$('ov').style.display=='block')return;tu95Open(P.g.id,0)}catch(e){}}

// =====================================================================
// 3) ARENA DE TREINO — os bonecos atacam e o dano por segundo aparece na tela
// =====================================================================
const TRN={on:false,hist:[],tot:0,max:0,taken:0,ok:0,dodge:0,hit:0,shots:[],t0:0,ui:0};
function trnNear(){return Math.hypot(P.x-TC.x,P.z-TC.z)<17}
function trnStart(){TRN.on=true;Object.assign(TRN,{hist:[],tot:0,max:0,taken:0,ok:0,dodge:0,hit:0,shots:[],t0:performance.now()/1000});
 for(const e of enemies)if(e.dummy){e.trn=1;e.mhp=e.hp=50000;e._ph=e.hp;e.tc=1.5+Math.random()*2;e.name='Boneco de Treino (ataca)';if(e.lt)e.lt.textContent=e.name}
 banner('ARENA DE TREINO','Os bonecos atacam · desvie, defenda e veja seu dano','#f0cf72');trnUI()}
function trnStop(){TRN.on=false;for(const e of enemies)if(e.dummy){e.trn=0;e.mhp=80;e.hp=80;e.name='Boneco de Treino';if(e.lt)e.lt.textContent=e.name+' Nv 1'}d95('trn95').style.display='none';
 const tm=Math.max(1,performance.now()/1000-TRN.t0);toast('Treino: '+Math.round(TRN.tot)+' de dano em '+Math.round(tm)+'s · '+TRN.ok+' defendidos · '+TRN.dodge+' desviados · '+TRN.hit+' acertos em você')}
window.trnStart=trnStart;window.trnStop=trnStop;
function trnUI(){const o=d95('trn95');const now=performance.now()/1000;TRN.hist=TRN.hist.filter(h=>now-h[0]<5);const win=Math.min(5,Math.max(1,now-TRN.t0)),dps=TRN.hist.reduce((a,h)=>a+h[1],0)/win;
 o.style.display='flex';o.innerHTML='<div class="q5k"><b>'+Math.round(dps)+'</b><small>dano/s</small></div><div class="q5k"><b>'+Math.round(TRN.tot)+'</b><small>total</small></div><div class="q5k"><b>'+Math.round(TRN.max)+'</b><small>maior golpe</small></div><div class="q5k"><b>'+TRN.ok+'/'+TRN.dodge+'/'+TRN.hit+'</b><small>defend./desv./acertos</small></div><button onclick="trnStop()">Parar</button>'}
function trnShoot(e){const b=Math.atan2(P.x-e.x,P.z-e.z),m=orb(0xffc04a,.28);m.position.set(e.x,1.3,e.z);S.add(m);const v=11,q={m,vx:Math.sin(b)*v,vz:Math.cos(b)*v,life:2.6,d:Math.max(4,P.mhp*.035),el:'fogo',tr:0xffa030,r:.9,trn:1};eshots.push(q);TRN.shots.push(q);e.cast=.5}
function trnSlam(e){const tx=P.x,tz=P.z;ring(3.2,0xff6a2a,tx,tz);tmr.push({t:1.05,f:()=>{blast(3,0xff8a3a,tx,.5,tz,2.5);burst('fogo',tx,.5,tz,18,5);if(Math.hypot(P.x-tx,P.z-tz)<3.2&&P.y-(P.gy||0)<1.5){if(P.iv>0||P.sh>0)TRN.ok++;else TRN.hit++;hurtM(Math.max(5,P.mhp*.05))}else TRN.dodge++}})}
function trnTick(dt){if(!TRN.on)return;if(!trnNear()&&Math.hypot(P.x-TC.x,P.z-TC.z)>40){trnStop();return}
 for(const e of enemies){if(!e.dummy)continue;if(!e.trn){e.trn=1;e.mhp=e.hp=50000;e._ph=e.hp;e.tc=2;e.name='Boneco de Treino (ataca)';if(e.lt)e.lt.textContent=e.name}
  if(e._ph!=null&&e.hp<e._ph-.01){const dd=e._ph-e.hp;TRN.tot+=dd;TRN.hist.push([performance.now()/1000,dd])}if(e.hp<e.mhp*.4)e.hp=e.mhp;e._ph=e.hp;
  e.tc-=dt;if(e.tc<=0&&!(e.st>0)&&Math.hypot(P.x-e.x,P.z-e.z)<22&&!(P.dead>0)){e.tc=2.6+Math.random()*1.8;e.m.rotation.y=Math.atan2(P.x-e.x,P.z-e.z);if(Math.random()<.28)trnSlam(e);else trnShoot(e)}}
 for(let i=TRN.shots.length-1;i>=0;i--){const q=TRN.shots[i];if(eshots.indexOf(q)>=0){q.lx=q.m.position.x;q.lz=q.m.position.z;continue}TRN.shots.splice(i,1);if(q.life<=0)TRN.dodge++;else if(q.lx!=null&&Math.hypot(q.lx-P.x,q.lz-P.z)<(q.r||.9)+.8&&!(P.sh>0))TRN.hit++;else TRN.ok++}
 TRN.ui-=dt;if(TRN.ui<=0){TRN.ui=.25;trnUI()}}

// =====================================================================
// 2) CHEFES COM FASES — Zenon (ossos) e Zagred (palavras) mudam de ataque quando a vida cai
// =====================================================================
BOSSES.zenon95={n:'Zenon (Ossos)',x:-120,z:-540,lv:45,gr:'luz',lk:{top:0x1a1a20,pants:0x121216,hs:1,hair:0x1a1a1e,coat:1,long:1,cape:0x2a2a30,skin:0xe8d8c8,eye:0xd0d0d0,h:1.35,w:1.15,boots:1},book:0x2a2a2a};
BOSSES.zagred95={n:'Zagred (Demônio)',x:-60,z:-605,lv:50,gr:'luz',lk:{top:0x1a0a10,pants:0x0e0608,hs:2,hair:0x0a0a0a,coat:1,long:1,cape:0x3a0a14,skin:0x2a2228,eye:0xff2a3a,h:1.55,w:1.2},book:0x3a0a3a};
const PB95={
 zenon95:{alt:{x:-120,z:-550},col:0xeae2cc,dark:0x3a3a40,nm:'Zenon',ph:['Lanças de Osso','Ossos do Diabo','Domínio Ósseo']},
 zagred95:{alt:{x:-60,z:-615},col:0xff2a3a,dark:0x2a0a14,nm:'Zagred',ph:['Palavras do Submundo','"Volte!"','Tridente do Submundo']}};
function pb95Word(e,w,col){const d=document.createElement('div');d.className='w95';d.textContent=w;if(col)d.style.textShadow='0 0 8px '+col+',0 2px 3px #000';document.body.appendChild(d);let t=0;const f=()=>{t+=16;const a=scr(e.x,(e.boss?4.4:3),e.z);if(a[2]){d.style.left=a[0]+'px';d.style.top=(a[1]-t*.03)+'px'}d.style.opacity=String(Math.max(0,1-t/1300));if(t<1300)requestAnimationFrame(f);else d.remove()};f()}
function boneMesh(len){const g=new T.Group(),m=new T.MeshLambertMaterial({color:0xf0e8d4,emissive:0x2a2418});const c=new T.Mesh(new T.ConeGeometry(.16,len,6),m);c.rotation.x=Math.PI/2;g.add(c);const k=new T.Mesh(new T.SphereGeometry(.17,8,6),m);k.position.z=-len/2;g.add(k);return g}
function pb95Shot(e,ang,o){const b=Math.atan2(P.x-e.x,P.z-e.z)+ang,m=o.mesh?o.mesh():orb(o.c,.32);m.position.set(e.x,1.4,e.z);m.rotation.y=b;S.add(m);const v=o.v||14;eshots.push({m,vx:Math.sin(b)*v,vz:Math.cos(b)*v,life:2.8,d:o.d*(e.dm||1),el:o.el||'luz',tr:o.tr,r:o.r||.95,sl:o.sl})}
function pb95Zone(x,z,R,col,delay,dmg,onHit,vis){ring(R,col,x,z);const m=new T.Mesh(new T.CircleGeometry(R,28),new T.MeshBasicMaterial({color:col,transparent:true,opacity:.3,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,.06,z);S.add(m);
 tmr.push({t:delay,f:()=>{S.remove(m);m.geometry.dispose();m.material.dispose();if(vis)try{vis(x,z,R)}catch(er){}blast(R,col,x,.5,z,2.6);if(Math.hypot(P.x-x,P.z-z)<R&&P.y-(P.gy||0)<2){hurtM(dmg);if(onHit)onHit()}}})}
function boneSpikes(x,z,R){const g=new T.Group(),m=new T.MeshLambertMaterial({color:0xf0e8d4,emissive:0x2a2418});for(let k=0;k<7;k++){const a=k/7*6.28+Math.random(),r=Math.random()*R*.8,c=new T.Mesh(new T.ConeGeometry(.22,1.8+Math.random()*1.4,6),m);c.position.set(Math.cos(a)*r,.9,Math.sin(a)*r);c.rotation.set((Math.random()-.5)*.5,0,(Math.random()-.5)*.5);g.add(c)}g.position.set(x,-2,z);S.add(g);
 kfx({u:(q,dt)=>{g.position.y=q.t<.15?-2+q.t/.15*2:q.t>1.1?-(q.t-1.1)*4:0;return q.t<1.6},end:()=>{S.remove(g);m.dispose();g.children.forEach(c=>c.geometry.dispose())}})}
function boneCage(x,z,R){const g=new T.Group(),m=new T.MeshLambertMaterial({color:0xf0e8d4,emissive:0x2a2418});for(let k=0;k<12;k++){const a=k/12*6.28,c=new T.Mesh(new T.CylinderGeometry(.09,.13,3.2,6),m);c.position.set(Math.cos(a)*R,1.6,Math.sin(a)*R);c.rotation.z=Math.cos(a)*.25;c.rotation.x=-Math.sin(a)*.25;g.add(c)}g.position.set(x,0,z);S.add(g);
 kfx({u:(q)=>{g.scale.y=Math.min(1,q.t*5)*(q.t>2.2?Math.max(.01,1-(q.t-2.2)*3):1);return q.t<2.55},end:()=>{S.remove(g);m.dispose();g.children.forEach(c=>c.geometry.dispose())}})}
function swordRain(x,z,R){const g=new T.Group(),m=new T.MeshLambertMaterial({color:0x2a2a34,emissive:0x5a0a14});const b=new T.Mesh(new T.BoxGeometry(.14,2.6,.04),m);b.position.y=1.3;g.add(b);const gd=new T.Mesh(new T.BoxGeometry(.7,.1,.12),m);gd.position.y=2.65;g.add(gd);g.position.set(x,9,z);S.add(g);
 kfx({u:(q)=>{g.position.y=Math.max(-.4,9-q.t*40);return q.t<1.4},end:()=>{S.remove(g);m.dispose();b.geometry.dispose();gd.geometry.dispose()}})}
function pb95Minion(e,kind){const zen=kind=='zenon95',a=Math.random()*6.28,x=e.x+Math.cos(a)*5,z=e.z+Math.sin(a)*5;
 const L=person(zen?{top:0xe8e0cc,pants:0xd8d0bc,hs:1,skin:0xf0e8d4,hair:0xd8d0bc,eye:0x111111,armor:1}:{top:0x1a0a10,pants:0x0e0608,hs:0,skin:0x3a2228,hair:0x0a0a0a,eye:0xff2a3a}),g=L.g;g.position.set(x,0,z);S.add(g);
 const lv=Math.max(30,e.lv-5),hp=Math.round(60+14*lv);enemies.push({m:g,L,x,z,hp,mhp:hp,lv,dm:1+.08*lv,cd:0,sp:0,gr:null,mc:99,name:zen?'Soldado de Osso':'Servo do Submundo',ag:1,sum95:1});burst(zen?'luz':'anti',x,1,z,20,4)}
function pb95Deco(e){const k=e.bt2,P0=PB95[k];if(!P0||e.m.userData.d95)return;e.m.userData.d95=1;const R0=e.L.root;
 if(k=='zenon95'){const m=new T.MeshLambertMaterial({color:0xf0e8d4,emissive:0x221c10});for(const s of[-1,1]){for(let j=0;j<3;j++){const c=new T.Mesh(new T.ConeGeometry(.06,.42-j*.08,6),m);c.position.set(s*(.36+j*.06),1.72+j*.05,-.05-j*.06);c.rotation.z=-s*(.5+j*.25);R0.add(c)}}
  for(let j=0;j<5;j++){const c=new T.Mesh(new T.ConeGeometry(.05,.3,5),m);c.position.set(0,1.45-j*.12,-.25);c.rotation.x=-1.2;R0.add(c)}
  const ey=new T.Mesh(new T.BoxGeometry(.12,.05,.02),new T.MeshBasicMaterial({color:0x111111}));ey.position.set(.085,1.97,.222);R0.add(ey)}
 else{const m=new T.MeshLambertMaterial({color:0x1a1014,emissive:0x2a0408});for(const s of[-1,1]){const c=new T.Mesh(new T.ConeGeometry(.07,.55,7),m);c.position.set(s*.16,2.25,-.02);c.rotation.z=-s*.55;R0.add(c);const c2=new T.Mesh(new T.ConeGeometry(.05,.32,6),m);c2.position.set(s*.27,2.47,-.04);c2.rotation.z=-s*1.1;R0.add(c2)}
  const mo=new T.Mesh(new T.BoxGeometry(.13,.025,.015),new T.MeshBasicMaterial({color:0xff2a3a}));mo.position.set(0,1.86,.228);R0.add(mo);
  const tri=new T.Group(),tm=new T.MeshLambertMaterial({color:0x2a2a34,emissive:0x3a0a14});const sh=new T.Mesh(new T.CylinderGeometry(.03,.03,2.6,6),tm);tri.add(sh);for(const x of[-.14,0,.14]){const t=new T.Mesh(new T.ConeGeometry(.04,.32,5),tm);t.position.set(x,1.42,0);tri.add(t)}const cr=new T.Mesh(new T.BoxGeometry(.34,.05,.05),tm);cr.position.y=1.26;tri.add(cr);tri.position.set(.48,1.25,.15);R0.add(tri)}}
{const _sb=spawnBoss;spawnBoss=function(type,o){const e=_sb.apply(this,arguments);try{if(e&&PB95[e.bt2]){if(!e.p95){e.p95={ph:0,t:0,inv:0,sum:0,heal:0,w:0,cy:0};if(!e.rb&&!(o&&o.bid)){e.mhp=Math.round(e.mhp*1.6);e.hp=e.mhp}}pb95Deco(e)}}catch(er){}return e}}
// ataques por fase (substituem o tiro comum só desses dois chefes)
{const _es=eshoot;eshoot=function(e){if(e&&e.p95){try{pb95Attack(e)}catch(er){}return}return _es.apply(this,arguments)}}
function pb95Attack(e){const k=e.bt2,ph=e.p95.ph,d=Math.hypot(P.x-e.x,P.z-e.z);e.cast=.5;e.p95.cy++;const c=e.p95.cy;
 if(k=='zenon95'){burst('luz',e.x,1.6,e.z,10,3);
  if(ph==0){if(c%3==0){for(let j=0;j<3;j++){const a=Math.random()*6.28,r=j?1.5+Math.random()*3:0;pb95Zone(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,2.1,0xeae2cc,1,14*(e.dm||1),null,boneSpikes)}pb95Word(e,'ESPINHOS DE OSSO!','#eae2cc')}else{for(const a of[-.22,0,.22])pb95Shot(e,a,{mesh:()=>boneMesh(1.3),d:10,v:15,tr:0xeae2cc})}}
  else if(ph==1){if(c%3==0){pb95Zone(P.x,P.z,4,0xd8d0bc,1.2,18*(e.dm||1),()=>{P.slow=2.5},boneCage);pb95Word(e,'PRISÃO DE COSTELAS!','#eae2cc')}else if(c%3==1){for(const a of[-.35,-.17,0,.17,.35])pb95Shot(e,a,{mesh:()=>boneMesh(1.3),d:10,v:16,tr:0xeae2cc})}else{for(let j=0;j<4;j++){const a=Math.random()*6.28,r=j?2+Math.random()*4:0;pb95Zone(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,2.2,0xeae2cc,.9,14*(e.dm||1),null,boneSpikes)}}}
  else{if(c%2==0){for(let j=0;j<7;j++){const a=Math.random()*6.28,r=j?2+Math.random()*6:0;pb95Zone(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,2,0xf0e8d4,.8+j*.08,15*(e.dm||1),null,boneSpikes)}pb95Word(e,'CHUVA DE LANÇAS!','#eae2cc')}else{for(let j=-3;j<=3;j++)pb95Shot(e,j*.14,{mesh:()=>boneMesh(1.4),d:11,v:17,tr:0xeae2cc});if(d<9)pb95Zone(e.x,e.z,6,0xeae2cc,1,16*(e.dm||1),null,boneSpikes)}}}
 else{burst('anti',e.x,1.6,e.z,10,3);const W=['QUEIME!','ESMAGUE!','RAIO!','SUBMUNDO!'];
  if(ph==0){const w=W[c%3];pb95Word(e,w,'#ff2a3a');if(w=='QUEIME!'){for(const a of[-.25,0,.25])pb95Shot(e,a,{c:0xff6a1a,d:11,v:14,el:'fogo',tr:0xff8a3a})}else if(w=='ESMAGUE!'){pb95Zone(P.x,P.z,3.6,0xff2a3a,1.1,20*(e.dm||1),()=>{P.shake=Math.max(P.shake||0,.5)})}else{for(let j=0;j<3;j++){const a=Math.random()*6.28,r=j?2+Math.random()*3:0;pb95Zone(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,1.8,0xbfe8ff,.8,13*(e.dm||1))}}}
  else if(ph==1){if(c%4==0&&!(e.p95.vlt>0)){e.p95.vlt=4;pb95Word(e,'VOLTE!','#ff2a3a');toast('Zagred está devolvendo ataques! Espere a barreira passar.')}else if(c%2){for(const a of[-.4,-.2,0,.2,.4])pb95Shot(e,a,{c:0xff2a3a,d:11,v:15,el:'fogo',tr:0xff3a4a})}else{pb95Zone(P.x,P.z,4,0xff2a3a,1,20*(e.dm||1));pb95Word(e,'ESMAGUE!','#ff2a3a')}}
  else{if(c%2==0){pb95Word(e,'CHUVA DE ESPADAS!','#ff2a3a');for(let j=0;j<9;j++){const a=Math.random()*6.28,r=j?2+Math.random()*6:0;pb95Zone(P.x+Math.cos(a)*r,P.z+Math.sin(a)*r,1.8,0xff2a3a,.85+j*.07,15*(e.dm||1),null,swordRain)}}else{pb95Word(e,'TRIDENTE!','#ff2a3a');const dx=P.x-e.x,dz=P.z-e.z,l=Math.hypot(dx,dz)||1;for(let j=1;j<=4;j++)pb95Zone(e.x+dx/l*j*3.2,e.z+dz/l*j*3.2,2.2,0xff4a5a,.7+j*.15,18*(e.dm||1))}}}}
function pb95Phase(e,n){const P0=PB95[e.bt2];e.p95.ph=n;e.p95.inv=1.6;e.p95.cy=0;e.st=Math.max(e.st||0,1.4);
 banner(P0.nm.toUpperCase()+' · FASE '+(n+1),P0.ph[n],e.bt2=='zenon95'?'#eae2cc':'#ff3a4a');P.shake=Math.max(P.shake||0,.6);
 for(let j=0;j<3;j++)tmr.push({t:j*.18,f:()=>kShock(e.x,e.z,4+j*3,P0.col,.6,.3)});burst(e.bt2=='zenon95'?'luz':'anti',e.x,1.5,e.z,40,7);
 if(!e.rb){const nM=n==1?2:3;for(let j=0;j<nM;j++)pb95Minion(e,e.bt2)}}
// dano no chefe: invulnerável na troca de fase; "Volte!" do Zagred devolve parte do dano
{const _he=hitE;hitE=function(e,d,ef){if(e&&e.p95){if(e.p95.inv>0){if(Math.random()<.3)dmgNum(e.x,3,e.z,0,0);return}if(e.p95.vlt>0){const back=d*.25;d*=.25;if(back>0&&!(P.iv>0)){P.p95vb=(P.p95vb||0)+back}}}return _he.call(this,e,d,ef)}}
function pb95Tick(dt){let shown=null;
 if(P.p95vb>0){const v=P.p95vb;P.p95vb=0;hurtM(Math.min(v,P.mhp*.06))}
 for(const e of enemies){if(!e.p95||e.hp<=0)continue;const q=e.p95;if(q.inv>0)q.inv-=dt;if(q.vlt>0){q.vlt-=dt;if(Math.random()<dt*20)fxp({x:e.x+(Math.random()-.5)*2,y:1+Math.random()*2,z:e.z+(Math.random()-.5)*2,c:0xff2a3a,n:1,sp:1,sz:.2,life:.5,up:2})}
  const r=e.hp/e.mhp;if(q.ph==0&&r<.66)pb95Phase(e,1);else if(q.ph==1&&r<.33)pb95Phase(e,2);
  if(e.bt2=='zagred95'&&q.ph==2&&!q.heal&&r<.15&&!e.rb){q.heal=1;e.hp=Math.min(e.mhp,e.hp+e.mhp*.2);pb95Word(e,'VOLTE, MEU CORPO!','#ff2a3a');toast('Zagred recuperou parte da vida!')}
  e.mc=Math.min(e.mc,q.ph==0?2.4:q.ph==1?1.9:1.5);
  if(Math.hypot(P.x-e.x,P.z-e.z)<60)shown=e}
 const o=d95('bh95');if(shown){const P0=PB95[shown.bt2],w=Math.max(0,shown.hp/shown.mhp*100);const key=shown.p95.ph+'|'+(shown.p95.vlt>0);if(o._k!==key){o._k=key;o.innerHTML='<b>FASE '+(shown.p95.ph+1)+'/3</b> <small>· '+e95(P0.ph[shown.p95.ph])+(shown.p95.ph<2?' · próxima fase com '+(shown.p95.ph?33:66)+'% de vida':'')+(shown.p95.vlt>0?' · <b style="color:#ff5a6a">VOLTE! (devolve dano)</b>':'')+'</small>'}o.style.display=TRN.on?'none':'block'}else o.style.display='none'}
// altares de desafio (Reino Spade): toque no botão perto do altar para chamar o chefe
{const mkAlt=(k)=>{const A=PB95[k].alt,g=new T.Group(),st=new T.MeshLambertMaterial({color:0x3a3640}),gl=new T.MeshBasicMaterial({color:PB95[k].col,transparent:true,opacity:.85});
  const b=new T.Mesh(new T.CylinderGeometry(2.2,2.6,.6,8),st);b.position.y=.3;g.add(b);const o=new T.Mesh(new T.BoxGeometry(.8,3.6,.8),st);o.position.y=2.3;g.add(o);const t=new T.Mesh(new T.OctahedronGeometry(.5),gl);t.position.y=4.6;g.add(t);g.userData.gem=t;
  const rr=new T.Mesh(new T.RingGeometry(2.6,2.9,32),new T.MeshBasicMaterial({color:PB95[k].col,transparent:true,opacity:.55,side:T.DoubleSide}));rr.rotation.x=-Math.PI/2;rr.position.y=.05;g.add(rr);g.position.set(A.x,0,A.z);S.add(g);PB95[k].g=g;
  try{signBoard('Desafio: '+PB95[k].nm,A.x+4,A.z+4,0)}catch(e){}};
 try{mkAlt('zenon95');mkAlt('zagred95')}catch(e){}}
V95.cd={};
window.pb95Call=k=>{const B=BOSSES[k];if(!B)return;if(enemies.some(e=>e.bt2===k&&e.hp>0)){toast(PB95[k].nm+' já está aqui!');return}if((V95.cd[k]||0)>performance.now()/1000){toast('O altar está recarregando…');return}
 const A=PB95[k].alt;let dx=P.x-A.x,dz=P.z-A.z,l=Math.hypot(dx,dz)||1;dx/=l;dz/=l;const e=spawnBoss(k,{x:P.x+dx*4-dz*9,z:P.z+dz*4+dx*9,lv:Math.max(B.lv,P.lv)});if(e){e.ag=1;V95.cd[k]=performance.now()/1000+30}};
function altTick(dt){const b=d95('b95');let show=null;
 for(const k in PB95){const P0=PB95[k];if(P0.g&&P0.g.userData.gem){P0.g.userData.gem.rotation.y+=dt*1.5;P0.g.userData.gem.position.y=4.6+Math.sin(performance.now()/500)*.15}
  if(P0.alt&&Math.hypot(P.x-P0.alt.x,P.z-P0.alt.z)<7&&!enemies.some(e=>e.bt2===k&&e.hp>0))show=k}
 if(!show&&!TRN.on&&trnNear())show='trn';
 const key=show||'';if(b._k!==key){b._k=key;if(show=='trn')b.innerHTML='🎯 Arena de Treino<small>os bonecos atacam e o dano por segundo aparece</small>';else if(show)b.innerHTML='⚔️ Desafiar '+PB95[show].nm+'<small>chefe com 3 fases · recomendado Nv '+BOSSES[show].lv+'+</small>';b.onclick=show=='trn'?()=>trnStart():show?()=>pb95Call(show):null}
 b.style.display=show&&!CS.on&&!ENC.on?'block':'none'}

// =====================================================================
// 5) EQUILÍBRIO — multiplicador de dano por grimório (medido por teste automático)
// =====================================================================
// medido em 3 rodadas (dano em 1 alvo de cada magia, por recarga e somado); fica entre ~0,85 e 1,2 da mediana
const BAL95={leao:.75,algodao:.8,anti:.9,kotodama:.9,fogo:.9,vento:1.1,sonhos:1.15,ossos:1.2,sombra:1.3,tempo:1.3};
{const _he=hitE;hitE=function(e,d,ef){try{const m=P.g&&BAL95[P.g.id];if(m&&e)d*=m}catch(er){}if(TRN.on&&e&&e.trn){const h0=e.hp,r=_he.call(this,e,d,ef),dd=h0-e.hp;if(dd>TRN.max)TRN.max=dd;return r}return _he.call(this,e,d,ef)}}
{const _pv=pvpHit;pvpHit=function(x,z,r,d){try{const m=P.g&&BAL95[P.g.id];if(m)d*=m}catch(er){}return _pv.apply(this,[x,z,r,d].concat([].slice.call(arguments,4)))}}

// =====================================================================
// 7) MODO LEVE DOS EFEITOS — menos partículas e luzes só nas magias (escolha manual)
// =====================================================================
try{CFG.fxl=localStorage.getItem('cloverFxl')==='1'}catch(e){CFG.fxl=false}
window.fxl95=on=>{CFG.fxl=!!on;try{localStorage.setItem('cloverFxl',on?'1':'0')}catch(e){}toast(on?'Efeitos das magias: modo leve':'Efeitos das magias: normal');try{if(typeof mCfg=='function'&&document.getElementById('m-cfg')&&document.getElementById('m-cfg').classList.contains('on'))mCfg()}catch(e){}try{if($('ov').style.display!='none'&&mt=='cfg')openMenu('cfg')}catch(e){}};
{const _fx=fxp;fxp=function(o){if(CFG.fxl&&o&&o.n>1){o=Object.assign({},o,{n:Math.max(1,Math.round(o.n*.4))})}else if(CFG.fxl&&o&&Math.random()<.35)return;return _fx.call(this,o)}}
const fxl95HTML=(cls)=>'<h5 style="color:#f0cf72;margin:8px 0 4px">EFEITOS DAS MAGIAS</h5><div class="'+cls+'"><button class="'+(cls=='tabs2'?'tb':'k')+(CFG.fxl?'':' on')+'" onclick="fxl95(0)">Normal</button><button class="'+(cls=='tabs2'?'tb':'k')+(CFG.fxl?' on':'')+'" onclick="fxl95(1)">Leve (celular fraco)</button></div><p class="'+(cls=='tabs2'?'hint':'sm')+'">Leve: menos partículas e luzes nas magias. Não muda a qualidade gráfica.</p>';
if(typeof mCfg=='function'){const _mc=mCfg;mCfg=function(){const r=_mc.apply(this,arguments);try{const b=document.getElementById('cf-b');if(b)b.insertAdjacentHTML('beforeend',fxl95HTML('tabs2'))}catch(e){}return r}}
{const _om=openMenu;openMenu=function(t){const r=_om.apply(this,arguments);try{if(mt=='cfg'){const c=$('ov').querySelector('.card');if(c){const d=document.createElement('div');d.innerHTML=fxl95HTML('tabs');c.insertBefore(d,c.lastElementChild)}}}catch(e){}return r}}

// ---------- laço por quadro ----------
{const _tu=tUpdate;tUpdate=function(dt,mv){const r=_tu.apply(this,arguments);try{trnTick(dt)}catch(e){}try{pb95Tick(dt)}catch(e){}try{altTick(dt)}catch(e){}try{if(!V95.t0&&run&&P.g&&!CS.on){V95.t0=1;setTimeout(()=>tu95Auto(),2500)}}catch(e){}return r}}
// aplica a escolha salva já no início (caso o jogo tenha carregado antes deste módulo)
try{lo95ApplyCur()}catch(e){}

