<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/icons/thw-mzgw.webp';

	const navItems = [
		{
			title: 'Quiz',
			items: [
				{ name: 'Grundausbildungs-Quiz', href: '/quiz/ga/listing/' },
				{ name: 'Sprechfunk-Quiz', href: '/quiz/radio/listing/' },
				{ name: 'Atemschutz-Quiz', href: '/quiz/agt/listing/' },
				{ name: 'CBRN-Quiz', href: '/quiz/cbrn/listing/' }
			]
		},
		{
			title: 'Tools',
			items: [
				{ name: 'CBRN-Schutzanzug', href: '/cbrn/protective-suite' },
				{ name: 'Finnentest', href: 'https://finnentest.thw-tools.de', external: true },
				{ name: 'Elektro Spannungsfall', href: 'https://elektro.thw-tools.de', external: true },
				{ name: 'THW Bekleidungs Rechner', href: '/clothing' }
			]
		}
	];

	$: currentPath = $page.url.pathname;
	$: isHomePage = currentPath === '/';

	function getCurrentTitleByPath(path: string): string | undefined {
		if (path.startsWith('/quiz/ga')) {
			return 'Grundausbildungs-Quiz';
		} else if (path.startsWith('/quiz/agt')) {
			return 'Atemschutz-Quiz';
		} else if (path.startsWith('/quiz/cbrn')) {
			return 'CBRN-Quiz';
		} else if (path.startsWith('/quiz/radio')) {
			return 'Sprechfunk-Quiz';
		} else if (path.startsWith('/cbrn/protective-suite')) {
			return 'CBRN-Schutzanzug';
		} else if (path === '/') {
			return undefined;
		} else {
			return 'THW-Tools';
		}
	}
</script>

{#if !isHomePage}
	<thw-navigation-bar
		logoUrl={logo}
		title={getCurrentTitleByPath(currentPath)}
		{navItems}
		{currentPath}
	/>
{/if}
