/* ととのい帳 service worker — キャッシュ名は登録URLの ?v= から決まる */
const VERSION = new URL(self.location).searchParams.get("v") || "0";
const CACHE = "totonoi-" + VERSION;
const SKIN = ["paper-page","paper-divider","binding-left","page-peek","ribbon-gold","tab-book","tab-search","tab-shelf","tab-log",
  "map-paper","ft-snow","ft-moon","ft-oke","ft-key",
  "wood-back","wood-shelf","deco-bonsai","deco-vase","deco-yunomi",
  "page-edge-top","page-stack-bottom","page-fore-edge","page-curl-latest","visit-slip",
  "polaroid-frame","tape-washi-a","tape-washi-b"];
const ASSETS = ["./", "./index.html", "./catalog.js", "./manifest.json", "./icon-192.png", "./apple-touch-icon.png"].concat(SKIN.map(n => "./art/" + n + ".webp"));
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k.startsWith("totonoi-") && k !== CACHE).map(k => caches.delete(k))))
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
  /* 施設カタログはネット優先：アプリ（SW）を更新しなくてもカタログだけ新しい版に差し替わる。圏外はキャッシュ */
  if (new URL(req.url).pathname.endsWith("/catalog.js")) {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res;
    }).catch(() => caches.match(req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (new URL(req.url).origin === location.origin) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
