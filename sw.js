const C='kh-v3',A=['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
const CDN=/^https:\/\/(cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)\//;
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).catch(()=>{}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 const u=e.request.url;if(e.request.method!=='GET')return;
 // QR-kirjasto: välimuisti ensin, jotta pariutus onnistuu myös ilman verkkoa
 if(CDN.test(u)){e.respondWith(caches.match(e.request).then(h=>h||fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r})));return}
 if(!u.startsWith(self.location.origin))return;
 // Oma sovellus: verkko ensin, välimuisti ilman verkkoa
 e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request)));
});
