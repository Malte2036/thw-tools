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
</script>

{#if !isHomePage}
	<thw-navigation-bar logoUrl={logo} title="THW Tools" {navItems} {currentPath} />
{/if}
