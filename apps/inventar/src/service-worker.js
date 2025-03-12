/// <reference types="@sveltejs/kit" />
import { build, prerendered, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...prerendered, // prerendered pages
	...files // everything in `static`
].filter((url) => !url.endsWith('.gif'));

console.log('Caching the following assets:', ASSETS);

self.addEventListener('message', (event) => {
	if (event.data === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);

		console.log('Adding files to cache');

		// Notify clients about update start
		const clients = await self.clients.matchAll();
		for (const client of clients) {
			client.postMessage({ type: 'CACHE_UPDATE_START' });
		}

		try {
			await cache.addAll(ASSETS);
			// Notify clients about update success
			for (const client of clients) {
				client.postMessage({ type: 'CACHE_UPDATE_COMPLETE' });
			}
		} catch (error) {
			// Notify clients about update failure
			for (const client of clients) {
				client.postMessage({ type: 'CACHE_UPDATE_ERROR', error: error.message });
			}
			throw error;
		}
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});
self.addEventListener('fetch', (event) => {
	// ignore POST requests etc
	if (event.request.method !== 'GET') return;

	async function respond() {
		const url = new URL(event.request.url);
		const cache = await caches.open(CACHE);

		// `build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(url.pathname);

			if (response) {
				// Add custom header to cached response
				const newHeaders = new Headers(response.headers);
				newHeaders.set('x-served-from', 'cache');

				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: newHeaders
				});
			}
		}

		// for everything else, try the network first, but
		// fall back to the cache if we're offline
		try {
			const response = await fetch(event.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(event.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(event.request);

			if (response) {
				// Add custom header to cached response
				const newHeaders = new Headers(response.headers);
				newHeaders.set('x-served-from', 'cache');

				return new Response(response.body, {
					status: response.status,
					statusText: response.statusText,
					headers: newHeaders
				});
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	event.respondWith(respond());
});
