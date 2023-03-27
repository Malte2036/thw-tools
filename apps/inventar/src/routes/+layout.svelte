<script lang="ts">
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	inject({ mode: dev ? 'development' : 'production' });

	// setup service worker for pwa support
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : '';

	let ReloadPrompt: any;
	onMount(async () => {
		pwaInfo && (ReloadPrompt = (await import('$lib/ReloadPrompt.svelte')).default);
	});

	import '../app.css';
	import { page } from '$app/stores';
	import Header from './Header.svelte';

	let title: string | undefined;
	$: title = getCurrentTitleByPath($page.url.pathname);

	function getCurrentTitleByPath(path: string): string | undefined {
		if (path.startsWith('/quiz/agt')) {
			return 'Atemschutz-Quiz';
		} else if (path.startsWith('/quiz/cbrn')) {
			return 'CBRN-Quiz';
		} else if (path === '/') {
			return undefined;
		} else {
			return 'THW-Tools';
		}
	}
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

{#if ReloadPrompt}
	<svelte:component this={ReloadPrompt} />
{/if}

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
