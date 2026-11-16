

// ===================== V103 · Capital remodelada: casas altas de enxaimel (vigas escuras, reboco claro, andares em balanço, telhados vermelhos pontudos) =====================
// Inspirado no estilo de cidades medievais; desenho próprio do Clover RPG. As casas antigas continuam no código (HOUSE.two/stone/rich...).
function hTudor(o){const w=o.w||5.6,d=o.d||5,H1=2.9,H2=2.5,H3=2.3,J=.38,g=new T.Group(),D=new T.Group(),TR=0x3a2416,TR2=0x4a2e1c;
 const flo=[[0,H1,w,d],[H1,H2,w+J*2,d+J],[H1+H2,H3,w+J*4,d+J*2]];const f3=o.fl3!=null?o.fl3:1;const lv=f3?3:2;
 // base de pedra e pavimentos (cada andar sobressai um pouco na frente e nos lados)
 bp(g,BX(w+.12,.55,d+.12),o.stone,0,.275,0,1);
 for(let i=0;i<lv;i++){const [y0,h,ww,dd]=flo[i];bp(g,BX(ww,h,dd),o.wall,0,y0+h/2,(dd-d)/2,1);if(i>0){bp(g,BX(ww+.12,.22,dd+.12),TR,0,y0+.04,(dd-d)/2);for(let k=0;k<Math.round(ww/.9);k++)bp(D,BX(.14,.18,.4),TR2,-ww/2+.3+k*.9,y0-.06,dd-d/2-.1)}}
 const top=flo[lv-1],TW=top[2],TD=top[3],TY=top[0]+top[1],zc=(TD-d)/2;
 // telhado pontudo de duas águas (frente para a rua) com cumeeira
 const RH=o.rh||3.6;{const rg=new T.Group();gable(rg,TD,TW,RH,o.roof,TY,o.wall,.42,.24);rg.rotation.y=Math.PI/2;rg.position.z=zc;g.add(rg)}
 // chaminé e pequena água-furtada
 bp(g,BX(.7,2.4,.7),o.stone,TW*.28,TY+RH*.55,zc-TD*.15,1);bp(g,BX(.85,.18,.85),0x5a5048,TW*.28,TY+RH*.55+1.25,zc-TD*.15);
 // vigas do enxaimel: verticais, horizontais e em X na frente e nos lados
 for(let i=0;i<lv;i++){const [y0,h,ww,dd]=flo[i],zf=dd-d/2+.06;if(i==0&&!o.tim0)continue;const n=Math.max(3,Math.round(ww/1.25));
  for(let k=0;k<=n;k++)bp(D,BX(.13,h,.08),TR,-ww/2+ww*k/n,y0+h/2,zf);bp(D,BX(ww,.12,.08),TR,0,y0+h*.48,zf);bp(D,BX(ww,.12,.08),TR,0,y0+h-.06,zf);
  for(let k=0;k<n;k+=2){const cx=-ww/2+ww*(k+.5)/n,L=Math.hypot(ww/n,h*.46);for(const s of[-1,1]){const m=bp(D,BX(.1,L,.07),TR,cx,y0+h*.24,zf+.01);m.rotation.z=s*Math.atan2(ww/n,h*.46)}}
  for(const sx of[-1,1]){const xf=sx*(ww/2+.06),m2=Math.max(2,Math.round(dd/1.3));for(let k=0;k<=m2;k++){const m=bp(D,BX(.08,h,.13),TR,xf,y0+h/2,(dd-d)/2-dd/2+dd*k/m2)}bp(D,BX(.08,.12,dd),TR,xf,y0+h*.48,(dd-d)/2)}}
 // oitão do telhado com vigas
 for(let k=0;k<3;k++)bp(D,BX(.12,RH*(1-k*.3),.08),TR,(k-1)*TW*.18,TY+RH*(1-k*.3)/2,TD-d/2+.07);
 // porta, janelas com vasos de flor e uma placa pendurada
 door(D,-w*.18,d/2,0,1.05,2.1,o.door,TR,1);win(D,w*.24,1.55,d/2,0,.9,.95,o.lit,TR,o.sh);
 for(let i=1;i<lv;i++){const [y0,h,ww,dd]=flo[i],zf=dd-d/2;for(const s of[-1,1]){win(D,s*ww*.25,y0+h*.55,zf,0,.82,.9,(i+s)%2?o.lit2:o.lit,TR,o.sh);
  bp(D,BX(.95,.2,.26),0x6a4426,s*ww*.25,y0+h*.55-.6,zf+.16);for(let k=0;k<4;k++)bp(D,SP(.09,5,4),[0xff5a7a,0xffe066,0xff8a3a,0xe86aff][(k+i)%4],s*ww*.25-.33+k*.22,y0+h*.55-.45,zf+.18)}}
 for(const s of[-1,1])win(D,s*(w/2),1.55,0,s*Math.PI/2,.75,.8,0,TR);
 if(o.sign){bp(D,BX(.06,.06,.7),0x2a2a2e,w*.42,2.75,d/2+.35);const sg=bp(D,BX(.7,.5,.06),o.sign,w*.42,2.4,d/2+.66);bp(D,BX(.5,.3,.07),0xe8d8a8,w*.42,2.4,d/2+.67)}
 lantern(D,w*.02,d/2+.04,1);pot(D,-w*.42,d/2+.5,0xff5a7a);
 return[g,D,Math.max(w+J*4,d+J*2)*.66]}
HOUSE.tudor=hTudor;
// casas da Capital viram enxaimel (lojas, taverna, biblioteca e templo continuam os mesmos)
function CAP103(tp){return['stone','two','merchant','rich','cottage'].includes(tp)?'tudor':tp}
function CAPST103(st){const R=['0xb8402c','0xa8382a','0xc04a30','0x9a3424','0x8a3a2a'].map(Number);st.roof=R[Math.floor(rnd()*R.length)];st.wall=[0xf2e6cc,0xeadcbc,0xf5ecd8,0xe6d6b4][Math.floor(rnd()*4)];st.w=5+rnd()*1.6;st.d=4.8+rnd()*.8;st.fl3=rnd()<.7?1:0;st.rh=3.2+rnd()*1.2;st.sign=rnd()<.25?[0x3b4aa0,0x8a1f1f,0x2f6a3a][Math.floor(rnd()*3)]:0;st.lit=rnd()<.6;st.lit2=rnd()<.4;return st}

