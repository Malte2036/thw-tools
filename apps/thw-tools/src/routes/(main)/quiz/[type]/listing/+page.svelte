<script lang="ts">
	import { QuestionType } from '$lib/model/question';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import { getQuestionStatsCountForType } from '$lib/api/api';
	import { getQuizTypeName } from '$lib/quiz/quizUtils';
	import { version } from '$app/environment';
	import type { AnsweredCountData } from '../[questionId]/+page.server';
	import type { PageData } from './$types';
	import QuestionsStatistics from '$lib/quiz/question/QuestionsStatistics.svelte';
	import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte';
	import ChevronRightIcon from '$lib/icons/ChevronRightIcon.svelte';
	import SearchIcon from '$lib/icons/SearchIcon.svelte';
	import HammerIcon from '$lib/icons/HammerIcon.svelte';
	import ChartSimpleIcon from '$lib/icons/ChartSimpleIcon.svelte';
	import CircleRadiationIcon from '$lib/icons/CircleRadiationIcon.svelte';
	import WalkieTalkieIcon from '$lib/icons/WalkieTalkieIcon.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let answeredCountData = $state<AnsweredCountData | undefined>(undefined);
	let searchQuery = $state('');

	let quizIcons: Record<QuestionType, any> = {
		[QuestionType.GA]: HammerIcon,
		[QuestionType.AGT]: ChartSimpleIcon,
		[QuestionType.CBRN]: CircleRadiationIcon,
		[QuestionType.RADIO]: WalkieTalkieIcon
	};

	let allQuestions = $derived([...data.allQuestions].sort((a, b) => a.number - b.number));

	let filteredQuestions = $derived.by(() => {
		const query = searchQuery.trim().toLowerCase();
		if (query === '') {
			return allQuestions;
		}
		return allQuestions.filter(
			(question) =>
				question.text.toLowerCase().includes(query) || String(question.number).includes(query)
		);
	});

	$effect(() => {
		getQuestionStatsCountForType(data.questionType)
			.then((data) => (answeredCountData = data))
			.catch((error) => console.warn('Could not fetch quiz stats', error));
	});

	function getDescriptionForQuestionType(questionType: QuestionType) {
		const count = data.allQuestions.length;
		switch (questionType) {
			case QuestionType.GA:
				return `Das Grundausbildungs-Quiz besteht aus ${count} Fragen für die Grundausbildungsprüfung im Technischen Hilfswerk.`;
			case QuestionType.AGT:
				return `Das Atemschutz-Quiz besteht aus ${count} Fragen für die Atemschutzausbildung im Technischen Hilfswerk.`;
			case QuestionType.CBRN:
				return `Das CBRN-Quiz besteht aus ${count} Fragen für die CBRN Ausbildung im Technischen Hilfswerk.`;
			case QuestionType.RADIO:
				return `Das Sprechfunk-Quiz besteht aus ${count} Fragen für die Sprechfunkausbildung im Technischen Hilfswerk.`;
			default:
				return `Das Quiz besteht aus ${count} Fragen für die Ausbildung im Technischen Hilfswerk.`;
		}
	}

	let jsonLd = $derived({
		'@context': 'https://schema.org',
		'@type': 'ItemList',
		name: getQuizTypeName(data.questionType),
		description: getDescriptionForQuestionType(data.questionType),
		inLanguage: 'de',
		dateModified: new Date(+version).toISOString(),
		numberOfItems: data.allQuestions.length,
		itemListElement: data.allQuestions
			.slice(0, 50) // Limit to first 50 items for better performance
			.map((question, index) => ({
				'@type': 'ListItem',
				position: index + 1,
				url: `https://thw-tools.de/quiz/${data.questionType}/${question.number}/`
			})),
		about: {
			'@type': 'Thing',
			name: getQuizTypeName(data.questionType),
			description: getDescriptionForQuestionType(data.questionType)
		},
		publisher: {
			'@type': 'Organization',
			name: 'THW-Tools',
			url: 'https://thw-tools.de',
			logo: {
				'@type': 'ImageObject',
				url: 'https://thw-tools.de/_app/immutable/assets/thw-mzgw.24176eee.webp',
				width: '512',
				height: '512'
			}
		}
	});

	let QuizIcon = $derived(quizIcons[data.questionType]);
</script>

<QuizHead questionType={data.questionType} question={undefined} />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="flex flex-col gap-6 bg-gradient-to-b from-white to-thw-50 px-4 py-6">
	<!-- Hero -->
	<header class="flex items-center gap-4">
		<div
			class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-thw-50 text-thw-700 ring-1 ring-thw-100"
		>
			<div class="h-6 w-6">
				<QuizIcon />
			</div>
		</div>
		<div class="min-w-0">
			<h1 class="text-2xl font-bold text-thw-900">{getQuizTypeName(data.questionType)}</h1>
			<p class="mt-1 text-sm leading-snug text-gray-600">
				{getDescriptionForQuestionType(data.questionType)}
			</p>
		</div>
	</header>

	<!-- Primary action -->
	<div class="flex flex-col gap-2">
		<a
			href={`/quiz/${data.questionType}/1/`}
			class="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-thw px-5 py-3 text-base font-semibold text-white transition-colors hover:bg-thw-800 active:scale-[0.99]"
			data-umami-event={`Start ${data.questionType.toUpperCase()} Quiz`}
		>
			Fragebogen starten
			<span class="h-4 w-4"><ArrowRightIcon /></span>
		</a>
		<p class="text-center text-xs font-medium tabular-nums text-gray-500">
			{data.allQuestions.length} Fragen im Fragebogen
		</p>
	</div>

	<!-- Progress -->
	<QuestionsStatistics {answeredCountData} questionType={data.questionType} />

	<!-- Search -->
	<div class="mt-2">
		<label class="relative block">
			<span class="sr-only">Frage suchen</span>
			<input
				type="search"
				bind:value={searchQuery}
				placeholder="Frage suchen (Nummer oder Stichwort)"
				class="h-12 w-full rounded-xl border-2 border-gray-200 bg-white pr-12 pl-4 text-base text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-thw"
			/>
			<span
				class="pointer-events-none absolute right-4 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center text-gray-400"
			>
				<SearchIcon />
			</span>
		</label>
	</div>

	<!-- Question list -->
	<div class="flex items-center justify-between px-1">
		<h2 class="text-xs font-bold uppercase tracking-wide text-gray-500">Alle Fragen</h2>
		<span class="text-xs font-medium tabular-nums text-gray-500"
			>{filteredQuestions.length} / {allQuestions.length}</span
		>
	</div>

	{#if filteredQuestions.length === 0}
		<div class="rounded-xl bg-white p-6 text-center text-sm text-gray-500 shadow-card">
			Keine passenden Fragen gefunden.
		</div>
	{:else}
		<div class="grid grid-cols-1 gap-2 md:grid-cols-2">
			{#each filteredQuestions as question}
				<a
					href={`/quiz/${data.questionType}/${question.number}/`}
					class="flex items-center gap-3 rounded-xl bg-white p-3 shadow-card ring-1 ring-thw-100/60 transition-shadow hover:ring-2 hover:ring-thw-200"
					data-umami-event={`Open ${data.questionType.toUpperCase()} Quiz Question ${question.number}`}
				>
					<span
						class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-thw-50 text-sm font-bold tabular-nums text-thw-800"
						>{question.number}</span
					>
					<span class="min-w-0 flex-1 truncate text-sm text-gray-800">{question.text}</span>
					<span
						class="flex h-5 w-5 shrink-0 items-center justify-center text-gray-400"
						aria-hidden="true"
					>
						<ChevronRightIcon />
					</span>
				</a>
			{/each}
		</div>
	{/if}
</div>
