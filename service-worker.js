const OFFLINE_VERSION = 1;
const CACHE_NAME = "assets";

self.addEventListener('install', event => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        await cache.addAll([
            "/",
            "/index.html",
            "/style.css",
            "/script.js",
            "/manifest.json"
        ])
    })())
    self.skipWaiting()
})

self.addEventListener('activate', event => {
    event.waitUntil((async () => await self.registration.navigationPreload?.enable())())
self.clients.claim();
})

self.addEventListener("fetch", event => {
    event.respondWith(caches.match(event.request).then(res => fetch(event.request) || res))
})