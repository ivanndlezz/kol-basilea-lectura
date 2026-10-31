const CACHE = "kol-basilea-lectura-ui-v6";
const CORE = ["./", "./index.html", "./styles.css", "./app.js", "./data/bible-catalog.js", "./data/bible-rvr1909.js", "./data/bible-loader.js", "./data/pericopes.js", "./data/pericopes/2-juan.json", "./data/editorial-content.js", "./data/reading-progress.js", "./data/biblical-authors.js", "./data/people.json", "./data/textual-relationships.json"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("kol-basilea-lectura-") && key !== CACHE).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.pathname.includes("/kol-basilea-lectura/")) return;
  if (url.pathname.includes("/data/rvr1909/") && url.pathname.endsWith(".json")) {
    event.respondWith(caches.open(CACHE).then(async cache => {
      const cached = await cache.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    }));
    return;
  }
  event.respondWith(fetch(request, { cache: "no-store" }).then(async response => {
    if (response.ok) {
      const cache = await caches.open(CACHE);
      await cache.put(request,response.clone());
    }
    return response;
  }).catch(() => caches.match(request,{ignoreSearch:true})));
});
