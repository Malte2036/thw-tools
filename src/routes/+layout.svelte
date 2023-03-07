<script lang="ts">
	import { PUBLIC_UMAMI_URL, PUBLIC_UMAMI_ID } from '$env/static/public';

	// setup service worker for pwa support
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	onMount(async () => {
		if (pwaInfo) {
			const { registerSW } = await import('virtual:pwa-register');
			registerSW({
				immediate: true,
				onRegistered(r: any) {
					console.log(`SW Registered: ${r}`);
				},
				onRegisterError(error: any) {
					console.log('SW registration error', error);
				}
			});
		}
	});

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	import '../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';

	let title: string | undefined;
	$: title = getCurrentTitleByPath($page.url.pathname);

	function getCurrentTitleByPath(path: string): string | undefined {
		switch (path) {
			case '/quiz/agt':
				return 'Atemschutz-Quiz';
			case '/':
				return undefined;
			default:
				return 'THW-Tools';
		}
	}
</script>

<svelte:head>
	{@html webManifest}

	{#if PUBLIC_UMAMI_URL.length != 0}
		<script
			async
			defer
			data-website-id={PUBLIC_UMAMI_ID}
			src={`${PUBLIC_UMAMI_URL}/umami.js`}
		></script>
	{/if}
</svelte:head>

<div class="flex flex-col gap-4 justify-between min-h-screen">
	{#if title !== undefined}
		<Header {title} />
	{/if}
	<div class="grow">
		<slot />
	</div>
	<div class="flex flex-row justify-center gap-2 mb-3">
		<div>©2023 Malte Sehmer</div>
		<div class="text-gray-400">|</div>
		<a href={$page.route.id === '/impressum' ? '/' : '/impressum'} class="underline">Impressum</a>
	</div>
</div>
