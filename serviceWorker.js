/* serviceWorker.js */
// (参考) https://developer.mozilla.org/ja/docs/Web/Progressive_web_apps/Offline_Service_workers
'use strict';

const cacheName = 'imagecapture-v20230415';
const ORIGIN = (location.hostname == 'localhost') ? '' : location.protocol + '//' + location.hostname;

const contentToCache = [
  ORIGIN + '/ImageCaptureApp/',
  ORIGIN + '/ImageCaptureApp/index.html',
  ORIGIN + '/ImageCaptureApp/help.html',
  ORIGIN + '/ImageCaptureApp/manifest.json',
  ORIGIN + '/ImageCaptureApp/icon/favicon.ico',
  ORIGIN + '/ImageCaptureApp/icon/apple-touch-icon.png',
  ORIGIN + '/ImageCaptureApp/icon/android-chrome-96x96.png',
  ORIGIN + '/ImageCaptureApp/icon/android-chrome-192x192.png',
  ORIGIN + '/ImageCaptureApp/icon/android-chrome-512x512.png',
  ORIGIN + '/ImageCaptureApp/css/imagecapture.css',
  ORIGIN + '/ImageCaptureApp/js/imagecapture_class.js',
  ORIGIN + '/ImageCaptureApp/js/viewer_class.js',
  ORIGIN + '/js/start-serviceWorker.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(contentToCache);
    })
  );
});
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((r) => {
      return r || fetch(e.request).then((response) => {
        return caches.open(cacheName).then((cache) => {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        const [kyappname, kyversion] = key.split('-');
        const [cnappname, cnversion] = cacheName.split('-');
        if (kyappname === cnappname && kyversion !== cnversion) {
          return caches.delete(key);
        }
      }));
    })
  );
});
