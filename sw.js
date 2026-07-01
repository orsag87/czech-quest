/* Service worker — network-first so Natasha always gets the latest lessons,
   with an offline cache fallback. Bump CACHE on each release. */
const CACHE = "czech-quest-v7";
const ASSETS = ["./", "./index.html", "./app.js", "./content.js", "./manifest.json"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});

/* ---- Daily reminder push ---- */
self.addEventListener("push", e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch (_) { data = { body: e.data && e.data.text() }; }
  const title = data.title || "Natasha's Czech Quest";
  const body = data.body || "Čas na češtinu! 🇨🇿";
  e.waitUntil(self.registration.showNotification(title, {
    body, icon: "icons/icon-192.png", badge: "icons/icon-192.png",
    data: { url: data.url || "./index.html" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./index.html";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
