const CACHE_NAME = 'smashup-cache-v1'
const ASSETS = [
	'./',
	'./index.html',
	'./style.css',
	'./main.js',
	'./factions.json',
	'./manifest.json',
]

self.addEventListener('install', event => {
	event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)))
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(res => res || fetch(event.request))
	)
})
