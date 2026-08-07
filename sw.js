/* SAUNA 30 service worker
   キャッシュ名は登録URLの ?v=（index.html の APP_VERSION）から決まる。
   このファイルを手で書き換える必要はない。 */
const VERSION = new URL(self.location).searchParams.get("v") || "0";
const CACHE = "sauna30-" + VERSION;
const PREFS = ["hokkaido","aomori","iwate","miyagi","akita","yamagata","fukushima","ibaraki","tochigi","gunma","saitama","chiba","tokyo","kanagawa","niigata","toyama","ishikawa","fukui","yamanashi","nagano","gifu","shizuoka","aichi","mie","shiga","kyoto","osaka","hyogo","nara","wakayama","tottori","shimane","okayama","hiroshima","yamaguchi","tokushima","kagawa","ehime","kochi","fukuoka","saga","nagasaki","kumamoto","oita","miyazaki","kagoshima","okinawa"];
/* 判子帳の隠し絵もプリキャッシュする（圏外の山サウナで押した瞬間にピースが開けるように。47枚で約1.4MB） */
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"]
  .concat(PREFS.map(s => "./art/" + s + ".webp"));

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
/* ナビゲーションはネット優先（更新が届く）、失敗したらキャッシュ（圏外の山サウナ対応） */
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (new URL(req.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
