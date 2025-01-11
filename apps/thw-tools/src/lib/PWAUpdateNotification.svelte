<script lang="ts">
	import { onMount } from 'svelte';
	import { bannerMessage } from './shared/stores/bannerMessage';
	import LoadingSpinner from './LoadingSpinner.svelte';

	let updateStatus: 'idle' | 'updating' | 'ready' | 'error' = 'idle';
	let registration: ServiceWorkerRegistration | undefined = undefined;

	function triggerUpdate() {
		registration?.waiting?.postMessage('SKIP_WAITING');
	}

	function setupPeriodicUpdateCheck() {
		setInterval(
			async () => {
				if (registration) {
					try {
						await registration.update();
					} catch (error) {
						console.error('Error checking for updates:', error);
					}
				}
			},
			5 * 60 * 1000
		); // Check every 5 minutes
	}

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			try {
				registration = await navigator.serviceWorker.register('/service-worker.js', {
					type: 'module'
				});

				setupPeriodicUpdateCheck();

				if (registration?.waiting) {
					updateStatus = 'ready';
					$bannerMessage = {
						message: `<div class="flex flex-col gap-2">
								<div>Eine neue Version der App ist verfügbar.</div>
								<div class="text-sm">Die App wird in wenigen Sekunden automatisch aktualisiert.</div>
							</div>`,
						type: 'info',
						autoDismiss: false
					};

					setTimeout(triggerUpdate, 3000);
				}

				registration?.addEventListener('updatefound', () => {
					const newWorker = registration?.installing;
					if (!newWorker) return;

					newWorker.addEventListener('statechange', () => {
						if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
							updateStatus = 'ready';
							$bannerMessage = {
								message: `<div class="flex flex-col gap-2">
										<div>Eine neue Version der App ist verfügbar.</div>
										<div class="text-sm">Die App wird in wenigen Sekunden automatisch aktualisiert.</div>
									</div>`,
								type: 'info',
								autoDismiss: false
							};

							setTimeout(triggerUpdate, 3000);
						}
					});
				});

				navigator.serviceWorker.addEventListener('controllerchange', () => {
					window.location.reload();
				});

				navigator.serviceWorker.addEventListener('message', (event) => {
					switch (event.data.type) {
						case 'CACHE_UPDATE_START':
							updateStatus = 'updating';
							$bannerMessage = {
								message: 'App wird aktualisiert...',
								type: 'info',
								autoDismiss: false
							};
							break;
						case 'CACHE_UPDATE_COMPLETE':
							updateStatus = 'ready';
							$bannerMessage = {
								message: 'Update abgeschlossen! Die App wird neu geladen.',
								type: 'info',
								autoDismiss: {
									duration: 3000
								}
							};
							setTimeout(() => {
								window.location.reload();
							}, 1000);
							break;
						case 'CACHE_UPDATE_ERROR':
							updateStatus = 'error';
							$bannerMessage = {
								message: 'Fehler beim Update der App: ' + event.data.error,
								type: 'error',
								autoDismiss: {
									duration: 5000
								}
							};
							break;
					}
				});
			} catch (error) {
				console.error('Service worker registration failed:', error);
			}
		}
	});
</script>

{#if updateStatus === 'updating'}
	<div
		class="fixed bottom-4 right-4 bg-white text-thw p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
	>
		<LoadingSpinner />
		<span>App wird aktualisiert...</span>
	</div>
{/if}
