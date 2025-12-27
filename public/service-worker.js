'use client'

// export type { }

// declare var self: ServiceWorkerGlobalScope

const APP_ID = "222c6811-e8fa-47c1-a930-9d534f46ad1d"
const VERSION_ID = "749b9376-fd27-4712-82d6-6ef7d8669cd3"

const SEPARATOR = '/'
const CACHE_NAME = `${APP_ID}${SEPARATOR}${VERSION_ID}`

self.addEventListener('activate', (event) => {
  async function cleanCaches() {
    const prefix = `${APP_ID}${SEPARATOR}`
    const cacheNames = await caches.keys()
    const proms = cacheNames
        .filter(x => x.startsWith(prefix) && x !== CACHE_NAME)
        .map(caches.delete.bind(caches))
    await Promise.all(proms)
  }
  event.waitUntil(cleanCaches())
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') { return }

  async function getResponse() {
    const cache = await caches.open(CACHE_NAME)

    async function resolveFreshResponse() {
      async function getFreshResponse() {
        const preloadedResponse = await event.preloadResponse
        if (preloadedResponse != null) { return preloadedResponse }
        return await fetch(request)
      }
      const response = await getFreshResponse()
      if (response.ok) {
        event.waitUntil(cache.put(request, response.clone()))
      }
      return response
    }
    const freshResponseProm = resolveFreshResponse()

    const cachedResponse = await cache.match(request)
    if (cachedResponse != null) {
      event.waitUntil(freshResponseProm)
      return cachedResponse
    }
    return await freshResponseProm
  }
  event.respondWith(getResponse())
})
