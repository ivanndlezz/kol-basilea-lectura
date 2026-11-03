const CACHE = "kol-basilea-lectura-data-v23";
const CORE = ["./assets/images/history/creacion.webp", "./assets/images/history/caida.webp", "./assets/images/history/cain-y-abel.webp", "./assets/images/history/primeras-ciudades.webp", "./assets/images/history/diluvio.webp", "./assets/images/history/babel.webp", "./assets/images/history/relato-pc-021.webp", "./assets/images/history/relato-lucas-2-1.webp", "./assets/images/atlas/world/elam.webp", "./assets/images/atlas/world/asshur.webp", "./assets/images/atlas/world/lud.webp", "./assets/images/atlas/world/sumerians.webp", "./assets/images/atlas/world/akkadians.webp", "./assets/images/atlas/world/babylonians.webp", "./assets/images/atlas/world/assyrians.webp", "./assets/images/atlas/world/aramaeans.webp", "./assets/images/atlas/world/chaldeans.webp", "./assets/images/atlas/world/cananeos.webp", "./assets/images/atlas/world/jebuseos.webp", "./assets/images/atlas/world/edomitas.webp", "./assets/images/atlas/world/moabitas.webp", "./assets/images/atlas/world/amonitas.webp", "./assets/images/atlas/world/filisteos.webp", "./assets/images/atlas/world/samaritanos.webp", "./assets/images/atlas/world/qumran.webp", "./history/", "./history.js", "./history.css", "./history-sheet-ui.js", "./data/history/timeline.json", "./data/history/history-snapshot.json", "./history/world/", "./data/history/world-glossary.json?v=20261103-scopes-v2", "./", "./styles.css", "./app.js", "./url-routing.js", "./data/bible-catalog.js", "./data/catalog/books.json", "./data/catalog/people.json", "./data/catalog/sources.json", "./data/catalog/relationships.json", "./data/media/videos.json", "./data/bible-rvr1909.js", "./data/bible-translations.js", "./data/bible-loader.js", "./data/pericopes.js", "./data/pericopes/2-juan.json", "./data/pericopes/1-juan.json", "./data/pericopes/3-juan.json", "./data/editorial-content.js", "./data/reading-progress.js", "./data/biblical-authors.js"];
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
  if (url.pathname.match(/\/data\/(rvr1909|pdt|onbv|bes)\/[^/]+\.json$/)) {
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
