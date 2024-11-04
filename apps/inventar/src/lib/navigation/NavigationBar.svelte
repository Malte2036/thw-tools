<script lang="ts">
	import { page } from '$app/stores';
	import logo from '$lib/icons/thw-mzgw.webp';

	const navItems = [
		{
			title: 'THW OV Düsseldorf',
			items: [
				{ name: 'Funkliste', href: '/funk/' },
				{ name: 'OV Inventar (Beta)', href: '/inventar/' },
				{ name: 'Organisation', href: '/organisation/' }
			]
		},
		{
			title: 'Quiz',
			items: [
				{
					name: 'Grundausbildungs-Quiz',
					href: 'https://thw-tools.de/quiz/ga/listing/',
					external: true
				},
				{
					name: 'Sprechfunk-Quiz',
					href: 'https://thw-tools.de/quiz/radio/listing/',
					external: true
				},
				{ name: 'Atemschutz-Quiz', href: 'https://thw-tools.de/quiz/agt/listing/', external: true },
				{ name: 'CBRN-Quiz', href: 'https://thw-tools.de/quiz/cbrn/listing/', external: true }
			]
		},
		{
			title: 'Tools',
			items: [
				{
					name: 'CBRN-Schutzanzug',
					href: 'https://thw-tools.de/cbrn/protective-suite',
					external: true
				},
				{ name: 'Finnentest', href: 'https://finnentest.thw-tools.de', external: true },
				{ name: 'Elektro Spannungsfall', href: 'https://elektro.thw-tools.de', external: true },
				{ name: 'THW Bekleidungs Rechner', href: 'https://thw-tools.de/clothing', external: true }
			]
		}
	];

	$: currentPath = $page.url.pathname;

	function getCurrentTitleByPath(path: string): string | undefined {
		const normalizedPath = path.replace(/\/$/, '');
		let bestMatch = { name: 'THW OV Düsseldorf', slashCount: -1 };

		for (const section of navItems) {
			for (const item of section.items) {
				const normalizedHref = item.href.replace(/\/$/, '');
				if (normalizedPath.startsWith(normalizedHref)) {
					const slashCount = (normalizedHref.match(/\//g) || []).length;
					if (slashCount > bestMatch.slashCount) {
						bestMatch = { name: item.name, slashCount };
					}
				}
			}
		}

		return bestMatch.name;
	}
</script>

<thw-navigation-bar
	logoUrl={logo}
	title={getCurrentTitleByPath(currentPath)}
	{navItems}
	{currentPath}
></thw-navigation-bar>
