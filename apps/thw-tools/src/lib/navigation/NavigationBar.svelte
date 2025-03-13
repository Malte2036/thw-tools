<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/icons/thw-mzgw.webp';
	import { navigationItems, getCurrentTitleByPath } from '$lib/shared/navigation';

	let currentPath = $derived($page.url.pathname);
	let isHomePage = $derived(currentPath === '/');
</script>

{#if !isHomePage}
	<div class="sticky top-0 z-50 bg-white">
		<thw-navigation-bar
			logoUrl={logo}
			title={getCurrentTitleByPath(currentPath)}
			navItems={navigationItems}
			{currentPath}
		></thw-navigation-bar>
	</div>
{/if}
