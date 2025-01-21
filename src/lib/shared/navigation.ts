import HammerIcon from '$lib/icons/HammerIcon.svelte';
import WalkieTalkieIcon from '$lib/icons/WalkieTalkieIcon.svelte';
import ChartSimpleIcon from '$lib/icons/ChartSimpleIcon.svelte';
import CircleRadiationIcon from '$lib/icons/CircleRadiationIcon.svelte';
import VestIcon from '$lib/icons/VestIcon.svelte';
import HearthPulseIcon from '$lib/icons/HearthPulseIcon.svelte';
import BoltIcon from '$lib/icons/BoltIcon.svelte';

export type NavigationItem = {
	name: string;
	href: string;
	external?: boolean;
	icon?: any;
	event?: string;
};

export type NavigationCategory = {
	title: string;
	description?: string;
	items: NavigationItem[];
};

export function getCurrentTitleByPath(path: string): string | undefined {
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
	} else if (path.startsWith('/clothing')) {
		return 'Bekleidungsrechner';
	} else if (path === '/') {
		return undefined;
	} else {
		return 'THW-Tools';
	}
}

export const navigationItems: NavigationCategory[] = [
	{
		title: 'Ausbildungs-Quiz',
		description: 'Teste und verbessere dein Wissen in verschiedenen THW-Bereichen',
		items: [
			{
				name: 'Grundausbildungs-Quiz',
				href: '/quiz/ga/listing/',
				event: 'Open GA Quiz',
				icon: HammerIcon
			},
			{
				name: 'Sprechfunk-Quiz',
				href: '/quiz/radio/listing/',
				event: 'Open Radio Quiz',
				icon: WalkieTalkieIcon
			},
			{
				name: 'Atemschutz-Quiz',
				href: '/quiz/agt/listing/',
				event: 'Open AGT Quiz',
				icon: ChartSimpleIcon
			},
			{
				name: 'CBRN-Quiz',
				href: '/quiz/cbrn/listing/',
				event: 'Open CBRN Quiz',
				icon: CircleRadiationIcon
			}
		]
	},
	{
		title: 'Tools',
		description: 'Hilfreiche Werkzeuge für den THW-Alltag',
		items: [
			{
				name: 'Bekleidungsrechner',
				href: '/clothing',
				event: 'Open Clothing Calculator',
				icon: VestIcon
			},

			{
				name: 'Finnentest',
				href: 'https://finnentest.thw-tools.de',
				event: 'Open Finnentest',
				external: true,
				icon: HearthPulseIcon
			},
			{
				name: 'Elektro Spannungsfall',
				href: 'https://elektro.thw-tools.de',
				event: 'Open Elektro Spannungsfall',
				external: true,
				icon: BoltIcon
			}
			// {
			// 	name: 'CBRN-Schutzanzug',
			// 	href: '/cbrn/protective-suite',
			// 	event: 'Open CBRN Protective Suite',
			// 	icon: VestIcon
			// }
		]
	}
];
