<script lang="ts">
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
