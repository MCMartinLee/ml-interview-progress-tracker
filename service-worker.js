const CACHE_NAME = "ml-tracker-v9";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./js/app.js",
  "./js/applications.js",
  "./js/auth.js",
  "./js/data.js",
  "./js/firebase.js",
  "./js/firestore.js",
  "./js/notifications.js",
  "./js/progress.js",
  "./js/resources.js",
  "./js/statistics.js",
  "./js/tracker.js",
  "./docs/sprint_detailed_guide.html",
  "./docs/day01_detailed_guide.md",
  "./firebase-config.js",
  "./manifest.json",
  "./assets/icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request).then(response => response || caches.match("./index.html")))
  );
});
