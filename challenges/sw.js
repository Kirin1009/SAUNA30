/* サ道場 service worker — キャッシュ名は登録URLの ?v= から決まる */
const VERSION = new URL(self.location).searchParams.get("v") || "0";
const CACHE = "sadojo-" + VERSION;
const QIDS = ["st-kinjo","st-sento","st-private","st-luxe","st-night","st-single","st-shaku","st-yoyaku","st-p_gifu","st-p_aichi","st-p_mie","st-p_shizuoka","st-p_shiga","st-kiwame"];
/* お題の隠し絵14枚もプリキャッシュ（圏外でもめくれるように。計約0.9MB） */
const ASSETS = ["./", "./index.html", "./manifest.json"].concat(QIDS.map(id => "./art/" + id + ".webp"));
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k.startsWith("sadojo-") && k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put("./index.html", copy)); return res;
    }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (new URL(req.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
