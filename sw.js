const C = "fbtraening-v4";
const FILES = ["./", "index.html", "bg.jpg", "icon-180.png", "icon-192.png", "icon-512.png", "manifest.webmanifest"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(FILES.map(f => new Request(f, {cache:"reload"})))).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  // Always ask the server first (bypassing the browser's 10-min HTTP cache), fall back to the offline copy.
  e.respondWith(fetch(e.request, {cache:"no-cache"}).then(r => { const copy = r.clone(); caches.open(C).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, {ignoreSearch:true})));
});
