/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

/// Service worker used for frontend caching
'use strict';

/** @type {ServiceWorkerGlobalScope} */
const sw = self;

// Constants
const VERSION = '1';
const CACHE_NAME = `cache-${VERSION}`;

// Install service worker
sw.addEventListener('install', () => {
  console.log('[SW Cache] Installed');
});

// Message handle
sw.addEventListener('message', (ev) => {
  if (ev.data?.type === 'SKIP_WAITING') {
    sw.skipWaiting();
  }
});

// On activate
sw.addEventListener('activate', (ev) => {
  // Remove outdated caches
  ev.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  console.log('[SW Cache] Activated');
});

// On fetch
sw.addEventListener('fetch', (ev) => {
  const url = new URL(ev.request.url);

  const isAstro = url.pathname.startsWith('/_astro/');
  const isFont = ['.otf', '.ttf', '.woff', '.woff2'].some((ext) =>
    url.pathname.endsWith(ext)
  );

  if (isAstro || isFont) {
    ev.respondWith(cachedFetch(ev.request));
  } else {
    ev.respondWith(networkFetch(ev.request));
  }
});

const cachedFetch = async (request) => {
  try {
    const cachedData = await caches.match(request);
    if (cachedData !== undefined) {
      console.log(`[SW Cache] Hit: ${request.url}`);
      return cachedData;
    }
    console.log(`[SW Cache] Miss: ${request.url}`);

    const fetchedData = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, fetchedData.clone());
    return fetchedData;
  } catch (err) {
    throw err;
  }
};
const networkFetch = (request) => fetch(request);
