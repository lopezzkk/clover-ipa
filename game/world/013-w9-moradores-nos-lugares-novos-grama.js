// ===================== V83 · moradores nos lugares novos + grama =====================
{const P83=(k,x,z)=>put(npc(VAR[k]),x,z);
 P83('alda',5,7);P83('fazendeiro',-14,9);P83('crianca',9,4);P83('sabio',-6,-14);P83('ferreiro',16,-6);
 P83('guarda',-6,-332);P83('guarda',6,-332);P83('crianca',-4,-378);P83('lojista',-16,-372);
 P83('cavaleira',CAMP.x,CAMP.z+4);P83('mago',CAMP.x+5,CAMP.z+2);
 for(const[k,vi,ox,oz]of[['fazendeira',1,4,3],['chefeS',1,-4,-3],['carteiro',1,3,-5],['anciaN',2,4,3],['cacador',2,-4,-2],['capitaoK',3,5,3],['comandK',3,-5,-3],['guardaK',3,0,-8]]){const v=VILS[vi];P83(k,v.x+ox,v.z+oz)}}
// inimigos comuns não aparecem dentro de cidades, quartéis, capital nem reinos vizinhos
function v83CanSpawn(){const r=reg83(P.x,P.z);return !r||['bruxas','masmorra','yultim','cranio'].includes(r.id)||(!['capital','nobres','hage','touros','hino','templo','heart','diamond','spade','sombras','torre','treino','camp'].includes(r.id))}
// tufos de grama (um único desenho instanciado para todo o mapa)
const GRASS=(()=>{const N=1800,geo=new T.ConeGeometry(.16,.7,3);geo.translate(0,.35,0);const m=new T.InstancedMesh(geo,new T.MeshToonMaterial({color:0x5fae4a,gradientMap:gmap}),N),o=new T.Object3D();let k=0;
 for(let i=0;i<N*4&&k<N;i++){const x=R83(-360,360),z=R83(-500,200);if(inWater83(x,z)||nearRoad(x,z,5)||nearVil(x,z,-4)||clearAt(x,z,1)||Math.hypot(x,z-CZ)<70||Math.hypot(x-TC.x,z-TC.z)<17||Math.hypot(x,z)<14)continue;const r=reg83(x,z);if(r&&['capital','yultim','spade','sombras','diamond','templo'].includes(r.id))continue;o.position.set(x,0,z);o.rotation.set((rnd()-.5)*.3,rnd()*6.28,(rnd()-.5)*.3);const sc=.6+rnd()*1.1;o.scale.set(sc,sc*(.7+rnd()*.8),sc);o.updateMatrix();m.setMatrixAt(k++,o.matrix)}
 m.count=k;m.userData.max=k;m.instanceMatrix.needsUpdate=true;m.receiveShadow=true;S.add(m);return m})();

