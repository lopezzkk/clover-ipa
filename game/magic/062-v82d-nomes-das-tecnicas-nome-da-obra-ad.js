// ================= V82 · nomes das técnicas: nome da obra × adaptação do Clover RPG =================
// O = nome usado na obra para essa técnica · OA = nome da obra, mas o efeito no jogo é adaptado · resto = adaptação do Clover RPG.
const RN82={'Fire: Exploding Fireball':['Flame Magic: Exploding Fireball','O'],'Fire: Infernal Chain':['Flame Magic: Flame Rope Solid Binding Formation','OA'],'Fire: Soul Chain Deathmatch':['Secret Fire Magic: Soul Chain Deathmatch','O'],'Fire: Inferno Breaker':['Flame Magic: Maximum Exploding Fireball','OA'],'Magna: Soul Chain Tag Deathmatch':['Secret Fire Magic: Soul Chain Tag Deathmatch','O'],
 'Water: Water Dragon':["Water Creation Magic: Sea Dragon's Roar",'O'],'Water: Hydro Vortex':["Water Creation Magic: Sea Dragon God's Vortex",'OA'],'Water: Tidal Prison':["Water Creation Magic: Sea Dragon's Nest",'OA'],
 'Light: Solar Blades':['Light Magic: Light Sword of Judgment','O'],"Light: Heaven's Judgment":['Light Magic: Light Shaft of Divine Punishment','OA'],'Light: Flash Step':['Light Magic: Heaven-Splitting Flash','OA'],
 'Chrono: Eternal Prison':['Time Magic: Chrono Stasis','OA'],'Blood: Blood Mirror Guard':['Blood Magic: Curse-Breaking Blood Cocoon','OA'],'Dream: Glamour World':['Dream Magic: Glamour World','O']};
const REV82={},TAG82={};
for(const old in RN82){const [nw,tg]=RN82[old];REV82[nw]=old;TAG82[nw]=tg;for(const T0 of[ANI,SKI,MK,LWN])if(T0&&T0[old]!==undefined&&T0[nw]===undefined)T0[nw]=T0[old];
 for(const g in GR){for(const L of[GR[g].s]){if(L)L.forEach(s=>{if(s&&s[0]===old)s[0]=nw})}}}
for(const n of['Devil Union: Black Divider','Nacht Union: Dark Prison Hunting Ground','Black Asta: Black Slash','Black Asta: Black Hurricane','Black Asta: Asta Cannon','Black Asta: Black Meteorite','Black Asta: Infinite Slash Equinox'])TAG82[n]='O';
for(const n of['Shadow Magic: Shadow Corridor','Shadow Magic: Dark Garden Invitation',"Shadow Magic: Heaven's Shadow Second Sight"])TAG82[n]='OA';
function tag82(n){return TAG82[n]||'A'}
function tag82Txt(n){const t=tag82(n);return t=='O'?'nome da obra':t=='OA'?'nome da obra · efeito adaptado':'adaptação do Clover RPG'}
// outros jogadores: o nome novo volta para o nome interno antes de reproduzir a cena (mesma animação de antes)
{const _g=ghostCast;ghostCast=function(o,c){if(c&&REV82[c.nm])c=Object.assign({},c,{nm:REV82[c.nm]});return _g.call(this,o,c)}}
{const _t=skTitle;skTitle=function(s,i){const r=_t(s,i);return s?r+' · '+tag82Txt(s[0]):r}}
{const _sr=skRow;skRow=function(s,i,alt){const h=_sr(s,i,alt);if(!s)return h;const t=tag82(s[0]);return h.replace(/<\/span><\/div><\/div>$/,'<em class="tg82">'+(t=='A'?'✎ adaptação do Clover RPG':'📖 '+tag82Txt(s[0]))+'</em></span></div></div>')}}
// alcance das magias novas (mostrado no grimório e no título dos botões)
for(const t in K82){const k=K82[t];const m=k.k=='slash'||k.k=='volley'||k.k=='beam'?(k.len||16):k.k=='dash'||k.k=='blink'?(k.len||10):k.k=='leap'?(k.dist||7):k.k=='field'?((k.fd||0)+(k.r||5)):k.k=='buff'||k.k=='barrier'?0:(k.r||5);RNG[t]=[m==0?'c':m<=6?'c':m<=12?'m':'l',m||0,m==0?'em você':k.k=='spin'||k.k=='nova'||k.k=='song'?'em área':'']}

