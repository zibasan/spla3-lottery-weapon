const CACHE_NAME = "spla3-lottery-v2";
const NAVIGATION_CACHE = ["/", "/index.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(NAVIGATION_CACHE)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;

  const isNavigation =
    event.request.mode === "navigate" ||
    requestUrl.pathname === "/" ||
    requestUrl.pathname === "/index.html";

  if (isNavigation) {
    // HTMLは常に最新版を優先し、オフライン時だけキャッシュへフォールバックする。
    event.respondWith(
      fetch(event.request, { cache: "no-store" })
        .then((response) => {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)),
          );
          return response;
        })
        .catch(() => caches.match(event.request).then((cached) => cached ?? Response.error())),
    );
    return;
  }

  // Viteのハッシュ付きアセットや音声はキャッシュを利用する。
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response.ok) {
          const copy = response.clone();
          event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)),
          );
        }
        return response;
      });
    }),
  );
});
