<script lang="ts">
	import { onMount } from 'svelte';
	import LoadingSpinner from './LoadingSpinner.svelte';
	import { bannerMessage } from './shared/stores/bannerMessage';

	let updateStatus: 'idle' | 'updating' | 'ready' | 'error' = $state('idle');
	let registration: ServiceWorkerRegistration | undefined = $state(undefined);

	onMount(async () => {
		if ('serviceWorker' in navigator) {
			registration = await navigator.serviceWorker.getRegistration();

			navigator.serviceWorker.addEventListener('message', (event) => {
				switch (event.data.type) {
					case 'CACHE_UPDATE_START':
						updateStatus = 'updating';
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

			registration?.addEventListener('waiting', () => {
				updateStatus = 'ready';
				registration?.waiting?.postMessage('SKIP_WAITING');
			});
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
