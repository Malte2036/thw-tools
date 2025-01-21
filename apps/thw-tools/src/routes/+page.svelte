<script lang="ts">
	import FlaskVialIcon from '$lib/icons/FlaskVialIcon.svelte';
	import logo from '$lib/icons/thw-mzgw.webp';
	import LinkButton from '../lib/LinkButton.svelte';
	import ChartSimpleIcon from '../lib/icons/ChartSimpleIcon.svelte';
	import HearthPulseIcon from '../lib/icons/HearthPulseIcon.svelte';

	import BoltIcon from '$lib/icons/BoltIcon.svelte';
	import HammerIcon from '$lib/icons/HammerIcon.svelte';
	import VestIcon from '$lib/icons/VestIcon.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { onMount } from 'svelte';
	import WalkieTalkieIcon from '$lib/icons/WalkieTalkieIcon.svelte';
	import CircleRadiationIcon from '$lib/icons/CircleRadiationIcon.svelte';

	const description = {
		headline: 'Inoffizielle Tools für THW-Helfer:',
		subheadline:
			'Grundausbildungs-Quiz, Atemschutz-Quiz, CBRN-Quiz, Sprechfunk-Quiz, Finnentest-Tracker & Spannungsfall-Berechnung.',
		keywords:
			'THW, Quiz, Finnentest, Spannungsfall, Elektro, CBRN, AGT, Atemschutz, Sprechfunk, Feuerwehr'
	};

	onMount(() => {
		const lastVisitBannerVersion = parseInt(
			window.localStorage.getItem('lastVisitBannerVersion') ?? '0'
		);

		let currentActiveMessage =
			'<div>Du hast Ideen für neue Tools, weitere Quizfragen oder Feedback?<br/> Schreib mir gerne über <a href="https://app.thw-messenger.de/thw/app#/contacts/profile/1990855" target="_blank">Hermine</a> (Malte Sehmer).</div>';
		const currentActiveMessageVersion = 2;

		if (currentActiveMessageVersion > lastVisitBannerVersion) {
			if (lastVisitBannerVersion != 0) {
				$bannerMessage = {
					message: currentActiveMessage,
					autoDismiss: {
						duration: 60 * 1000
					}
				};
				window.localStorage.setItem('lastVisitBannerVersion', String(currentActiveMessageVersion));
			} else {
				window.localStorage.setItem('lastVisitBannerVersion', '1');
			}
		}
	});

	const toolCategories = [
		{
			title: 'Ausbildungs-Quiz',
			description: 'Teste und verbessere dein Wissen in verschiedenen THW-Bereichen',
			tools: [
				{
					name: 'Grundausbildungs-Quiz',
					icon: HammerIcon,
					url: '/quiz/ga/listing/',
					event: 'Open GA Quiz'
				},
				{
					name: 'Sprechfunk-Quiz',
					icon: WalkieTalkieIcon,
					url: '/quiz/radio/listing/',
					event: 'Open Radio Quiz'
				},
				{
					name: 'Atemschutz-Quiz',
					icon: ChartSimpleIcon,
					url: '/quiz/agt/listing/',
					event: 'Open AGT Quiz'
				},
				{
					name: 'CBRN-Quiz',
					icon: CircleRadiationIcon,
					url: '/quiz/cbrn/listing/',
					event: 'Open CBRN Quiz'
				}
			]
		},
		{
			title: 'Praktische Tools',
			description: 'Hilfreiche Werkzeuge für den THW-Alltag',
			tools: [
				{
					name: 'THW Bekleidungs Rechner',
					icon: VestIcon,
					url: '/clothing',
					event: 'Open THW Clothing'
				},
				{
					name: 'Finnentest',
					icon: HearthPulseIcon,
					url: 'https://finnentest.thw-tools.de',
					event: 'Open Finnentest',
					external: true
				},
				{
					name: 'Elektro Spannungsfall',
					icon: BoltIcon,
					url: 'https://elektro.thw-tools.de',
					event: 'Open Elektro Spannungsfall',
					external: true
				},
				{
					name: 'CBRN-Schutzanzug',
					icon: VestIcon,
					url: '/cbrn/protective-suite',
					event: 'Open CBRN Protective Suite'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>THW Tools: Quiz, Finnentest & mehr!</title>
	<meta name="description" content={`${description.headline} ${description.subheadline}`} />
	<meta property="og:title" content="THW Tools: Quiz, Finnentest & mehr!" />
	<meta property="og:description" content={`${description.headline} ${description.subheadline}`} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp"
	/>
	<meta property="og:locale" content="de_DE" />
	<meta name="keywords" content={description.keywords} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-white to-thw-50 font-calibri">
	<div class="container mx-auto px-4 py-8">
		<!-- Hero Section -->
		<div class="flex flex-col items-center text-center mb-16">
			<img
				src={logo}
				class="w-96 max-md:w-64 aspect-auto mb-8"
				width="384"
				height="308.42"
				alt="THW MehrzweckGerätewagen"
			/>
			<h1 class="text-5xl max-md:text-4xl font-bold text-thw-900 mb-4">THW Tools</h1>
			<h2 class="text-2xl max-md:text-lg max-w-3xl">
				<span class="font-bold text-thw-800">{description.headline}</span>
				<span class="text-gray-700">{description.subheadline}</span>
			</h2>
		</div>

		<!-- Tools Grid -->
		<div class="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
			{#each toolCategories as category}
				<div
					class="bg-white border-2 border-thw-100 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-8"
				>
					<div class="flex flex-col h-full">
						<!-- Category Header -->
						<div class="border-b-2 border-thw-100 pb-4 mb-6">
							<h3 class="text-2xl font-bold text-thw-800 mb-2">{category.title}</h3>
							<p class="text-gray-600">{category.description}</p>
						</div>

						<!-- Tools List -->
						<div class="flex flex-col gap-3 flex-grow">
							{#each category.tools as tool}
								<LinkButton url={tool.url} blank={tool.external} dataUmamiEvent={tool.event}>
									<div class="w-6 group-hover:text-thw-600 transition-colors">
										<svelte:component this={tool.icon} />
									</div>
									<div class="font-bold flex-grow text-left">{tool.name}</div>
									{#if tool.external}
										<div class="text-sm text-thw-400">↗</div>
									{/if}
								</LinkButton>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Info Section -->
		<div class="mt-16 text-center max-w-2xl mx-auto">
			<p class="text-gray-600">
				Diese inoffiziellen Tools wurden von THW-Helfern für THW-Helfer entwickelt, um die
				Ausbildung und den Einsatz zu unterstützen.
			</p>
		</div>
	</div>
</div>

<!-- svelte-ignore a11y-missing-content -->
<a href="/quiz/stats" class="hidden" />
<!-- svelte-ignore a11y-missing-content -->
<a href="/faq" class="hidden" />
{#each ['ga', 'agt', 'cbrn'] as questionType}
	<!-- svelte-ignore a11y-missing-content -->
	<a href={`/quiz/${questionType}`} class="hidden" />
	<!-- svelte-ignore a11y-missing-content -->
	<a href={`/quiz/${questionType}/listing`} class="hidden" />
{/each}
