<script lang="ts">
	import type { PageData } from './$types';
	import { fade } from 'svelte/transition';
	import Button from '$lib/Button.svelte';
	import FaqAnswer from '$lib/faq/FaqAnswer.svelte';
	import InstallPwaDialog from '$lib/InstallPWADialog.svelte';
	import FeedbackDialog from '$lib/FeedbackDialog.svelte';

	export let data: PageData;

	let expandedIndex: number | null = null;
	let showInstallPWAHelp = false;
	let showFeedback = false;

	function toggleFaq(index: number) {
		expandedIndex = expandedIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>THW-Tools FAQ: Prüfungsfragen, Finnentest, Spannungsfall & mehr | THW-Tools</title>
	<meta
		name="description"
		content="THW-Tools FAQ: Finde Antworten zu THW Prüfungsfragen, Grundausbildung, Atemschutz, CBRN, Sprechfunk sowie zum MEA Bekleidungsrechner, Finnentest-Tracker und weiteren Tools."
	/>
	<meta
		name="keywords"
		content="THW-Tools, THW Prüfungsfragen, THW Grundausbildung, THW Atemschutz, THW CBRN, THW Sprechfunk, THW MEA, THW Bekleidung, THW Finnentest, THW App, Technisches Hilfswerk"
	/>
	<meta
		property="og:title"
		content="THW-Tools FAQ: Prüfungsfragen, Finnentest, Spannungsfall & mehr | THW-Tools"
	/>
	<meta
		property="og:description"
		content="THW-Tools FAQ: Finde Antworten zu THW Prüfungsfragen, Grundausbildung, Atemschutz, CBRN, Sprechfunk sowie zum MEA Bekleidungsrechner, Finnentest-Tracker und weiteren Tools."
	/>
	<meta name="robots" content="index, follow" />
	<meta name="author" content="THW-Tools" />
	<meta name="language" content="de" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://thw-tools.de/faq" />
	<meta
		property="og:image"
		content="https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp"
	/>
	<link rel="canonical" href="https://thw-tools.de/faq" />

	<script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'name': 'THW-Tools FAQ',
      'description': 'Häufig gestellte Fragen zu THW-Tools: Prüfungsfragen, Finnentest, Spannungsfall und mehr',
      'url': 'https://thw-tools.de/faq',
      'inLanguage': 'de',
      'dateModified': new Date().toISOString(),
      'mainEntity': data.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.text.replace(/\{\{link\}\}/g, ''),
          'url': 'https://thw-tools.de/faq#faq-' + faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }
      })),
      'publisher': {
        '@type': 'Organization',
        'name': 'THW-Tools',
        'url': 'https://thw-tools.de',
        'logo': 'https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp'
      }
    })}
	</script>
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<h1 class="text-2xl font-bold mb-6 text-thw-blue-900">
		THW-Tools FAQ: Prüfungsfragen, Finnentest & mehr
	</h1>

	<p class="mb-6 text-gray-700">
		Auf dieser FAQ-Seite findest du Antworten rund um THW-Tools: von THW-Prüfungsfragen für die
		<a href="/quiz/ga/listing/" class="text-thw underline">Grundausbildung (GA)</a>,
		<a href="/quiz/agt/listing/" class="text-thw underline">Atemschutz (AGT)</a>,
		<a href="/quiz/cbrn/listing/" class="text-thw underline">CBRN</a> und
		<a href="/quiz/radio/listing/" class="text-thw underline">Sprechfunk</a> bis hin zu praktischen
		Alltags-Helfern wie den
		<a href="/clothing" class="text-thw underline">Bekleidungsrechner</a> für den neuen MEA, dem
		<a
			href="https://finnentest.thw-tools.de"
			class="text-thw underline"
			target="_blank"
			rel="noopener">Finnentest-Tracker</a
		>. So kannst du dich schnell informieren und optimal auf deine THW-Prüfung vorbereiten!
	</p>

	<section class="space-y-4" aria-label="FAQ-Liste">
		{#each data.faqs as faq, index}
			<article
				class="bg-white rounded-lg shadow-md overflow-hidden"
				id="faq-{faq.question.toLowerCase().replace(/[^a-z0-9]+/g, '-')}"
			>
				<button
					type="button"
					class="w-full text-left cursor-pointer"
					on:click={() => toggleFaq(index)}
					aria-expanded={expandedIndex === index}
					aria-controls="faq-content-{index}"
					aria-label={expandedIndex === index ? 'Frage zuklappen' : 'Frage aufklappen'}
				>
					<div class="p-4 flex justify-between items-center hover:bg-gray-50">
						<h2 class="text-lg font-semibold text-thw-blue-800" id="faq-question-{index}">
							<span class="sr-only">Frage: </span>{faq.question}
						</h2>
						<svg
							class="w-6 h-6 transform transition-transform duration-200 {expandedIndex === index
								? 'rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
							role="presentation"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</div>
				</button>

				{#if expandedIndex === index}
					<div
						class="p-4 bg-gray-50 border-t border-gray-100"
						transition:fade={{ duration: 200 }}
						aria-labelledby="faq-question-{index}"
						id="faq-content-{index}"
						role="region"
					>
						<span class="sr-only">Antwort: </span>
						<p class="text-gray-700">
							<FaqAnswer text={faq.text} links={faq.links} />
						</p>
					</div>
				{:else}
					<!-- SEO-friendly non-visible content -->
					<div class="sr-only" aria-labelledby="faq-question-{index}" id="faq-content-seo-{index}">
						<span class="sr-only">Antwort: </span>
						<FaqAnswer text={faq.text} links={faq.links} />
					</div>
				{/if}
			</article>
		{/each}
	</section>

	<footer class="mt-8 text-center space-y-4">
		<div>
			<Button
				click={() => (showInstallPWAHelp = true)}
				dataUmamiEvent="Open Offline Availability Dialog"
			>
				Als App installieren
			</Button>
		</div>
		<p class="text-gray-600">
			Hast du Feedback oder Vorschläge?
			<button class="text-thw-blue-800 hover:underline" on:click={() => (showFeedback = true)}>
				Kontaktiere mich
			</button>
		</p>
	</footer>
</main>

{#if showInstallPWAHelp}
	<InstallPwaDialog onClose={() => (showInstallPWAHelp = false)} />
{/if}

{#if showFeedback}
	<FeedbackDialog onClose={() => (showFeedback = false)} />
{/if}
