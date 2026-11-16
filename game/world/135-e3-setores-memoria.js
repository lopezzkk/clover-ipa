// ================= ETAPA 3 · SETORES: LIBERA A MEMÓRIA DE VÍDEO DO QUE ESTÁ LONGE =================
// O mapa é dividido em setores de 40 m (chunks). Os setores longe já eram escondidos; agora, depois de um tempo longe,
// as formas 3D que só eles usam saem da memória de vídeo (a cópia no aparelho fica). Quando o jogador se aproxima,
// o motor 3D envia de novo sozinho, bem antes de o setor aparecer na tela.
// Também libera as peças originais que o v139 juntou (ficam escondidas e não são desenhadas).
// Nada muda na imagem: só memória. Formas usadas por algo perto nunca são liberadas.
(function(){
const ST={on:true,far:new Set(),freed:0,last:0,t:0,scans:0};window.SEC141=ST;
const HIDDEN=31;
function farDist(){return (typeof CULL=='number'?CULL:95)*1.6}
function nearDist(){return (typeof CULL=='number'?CULL:95)*1.3}
function updFar(){const F=farDist(),N=nearDist();for(const k in chunks){const g=chunks[k];const d=Math.hypot(g.cx-P.x,g.cz-P.z);if(ST.far.has(g)){if(d<N)ST.far.delete(g)}else if(d>F)ST.far.add(g)}}
function inFar(o){let p=o.parent;while(p&&p!==S){if(ST.far.has(p))return true;p=p.parent}return false}
const ok=m=>m.isMesh&&!m.isSkinnedMesh&&!m.isInstancedMesh&&m.geometry&&m.geometry.isBufferGeometry;
function scan(){
 ST.scans++;updFar();
 const need=new Set(),cand=new Set();
 S.traverse(o=>{if(!ok(o))return;const g=o.geometry;
  const hiddenOnly=o.layers.mask===(1<<HIDDEN);
  if(!hiddenOnly&&!inFar(o)){need.add(g);return}
  cand.add(g)});
 let n=0;for(const g of cand){if(need.has(g)||g._u141)continue;try{g.dispose();g._u141=1;n++}catch(e){}}
 // formas que voltaram a ser usadas: o motor já reenvia sozinho; só limpa a marca
 for(const g of need)if(g._u141)g._u141=0;
 ST.freed+=n;ST.last=n;return n;
}
{const _u=tUpdate;tUpdate=function(dt){const r=_u.apply(this,arguments);try{if(ST.on&&!CS.on){ST.t-=dt;if(ST.t<=0){ST.t=6;scan()}}}catch(e){}return r};window.tUpdate=tUpdate}
ST.scan=scan;
})();
