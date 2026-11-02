// Clover RPG — funciona sem internet depois da primeira vez (o multiplayer continua precisando de internet)
const V='clover-v72';const CORE=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{mode:u.startsWith('http')?'cors':'same-origin'})).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 // o jogo (index) busca a versão nova primeiro; sem internet usa a salva
 if(r.mode==='navigate'||u.pathname.endsWith('/index.html')||u.pathname.endsWith('/')){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(ca=>ca.put('./index.html',c));return x}).catch(()=>caches.match('./index.html')));return}
 // motor 3D, fontes e ícones: usa o que já está salvo
 if(u.origin===location.origin||/cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.host)){e.respondWith(caches.match(r).then(m=>m||fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(ca=>ca.put(r,c))}return x})))}});
