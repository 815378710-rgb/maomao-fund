const CACHE_NAME = 'maomao-v3';
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = event.request.url;
    // API请求：网络优先
    if (url.includes('fund.eastmoney.com') || url.includes('jrj.com.cn') || url.includes('push2.eastmoney.com') || url.includes('xiaomimimo.com') || url.includes('fundmobapi.eastmoney.com')) {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
    } else {
        // 静态资源：缓存优先
        event.respondWith(
            caches.match(event.request).then(r => r || fetch(event.request))
        );
    }
});
