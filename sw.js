const version = "27fa95e750c473f1";
const files = ["./app.webmanifest","./apple-touch-icon.png","./basedecoder-Dx75wktK.js","./deflate-CYXN6sQQ.js","./heic-to-D5EPI-5F.js","./icon-192.png","./icon-512.png","./index-CFTgEUvI.js","./index-fZzUrQ2G.css","./index.html","./jpeg-DY6pp3Km.js","./lerc-Ce468RSx.js","./lzw-CWcLLbBI.js","./packbits-Cp0FZ9Sj.js","./pako.esm-B6VxO94S.js","./raw-CYI6PcUr.js","./tiff-CmOvCYWc.js","./webimage-Deq5AgEy.js","./zstd-C_thhmOF.js"];
const prefix = `framed:${self.registration.scope}:`;
const cacheName = prefix + version;
const shell = new URL('./index.html', self.registration.scope).href;
const assets = new Set(files.map((file) => new URL(file, self.registration.scope).href));

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.addAll([...assets].map((url) => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter((name) => name.startsWith(prefix) && name !== cacheName)
      .map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.registration.scope)) return;
  const key = event.request.mode === 'navigate' ? shell : event.request.url;
  if (!assets.has(key)) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    return (await cache.match(key)) ?? fetch(event.request);
  })());
});
