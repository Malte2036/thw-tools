<script lang="ts">
	import logo from '$lib/icons/thw-mzgw.webp';
	import { LinkButton } from '@thw-tools/svelte-components';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { onMount } from 'svelte';
	import { navigationItems } from '$lib/shared/navigation';
	import { QuestionType } from '$lib/model/question';

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

	const toolCategories = navigationItems;
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
						<div class="flex flex-col gap-3">
							{#each category.items as tool}
								<LinkButton url={tool.href} blank={tool.external} dataUmamiEvent={tool.event}>
									<div class="w-6 group-hover:text-thw-600 transition-colors">
										<tool.icon />
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

<!-- svelte-ignore a11y_missing_content -->
<a href="/quiz/stats/" class="hidden"></a>
<!-- svelte-ignore a11y_missing_content -->
<a href="/faq" class="hidden"></a>

{#each Object.values(QuestionType) as questionType}
	<!-- svelte-ignore a11y_missing_content -->
	<a href={`/quiz/${questionType}/`} class="hidden"></a>
	<!-- svelte-ignore a11y_missing_content -->
	<a href={`/quiz/${questionType}/listing/`} class="hidden"></a>
{/each}
