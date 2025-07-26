const CACHE_NAME = 'smashup-cache-v1'
const urlsToCache = [
	'/',
	'/index.html',
	'/style.css',
	'/main.js',
	'/manifest.json',
	'/icon-192.png',
	'/icon-512.png',
	'/factions.json',
]

// Установка service worker и кэширование файлов
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache)
		})
	)
})

// Ответ из кэша, если офлайн
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request)
		})
	)
})

// Обновление service worker
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames =>
			Promise.all(
				cacheNames.map(name => {
					if (name !== CACHE_NAME) {
						return caches.delete(name)
					}
				})
			)
		)
	)
})
