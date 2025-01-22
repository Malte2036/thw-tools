<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import { QuestionType } from '$lib/model/question';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import { onMount } from 'svelte';
	import type { AnsweredCountData } from '../[questionId]/+page.server';
	import type { PageData } from './$types';
	import QuestionsStatistics from '$lib/quiz/question/QuestionsStatistics.svelte';
	import { getQuestionStatsCountForType } from '$lib/api/api';
	import { getQuizTypeName } from '$lib/quiz/quizUtils';
	import { version } from '$app/environment';

	export let data: PageData;

	let answeredCountData: AnsweredCountData | undefined;
	let questionType: QuestionType;

	$: questionType = data.questionType;
	$: {
		// Refetch stats when question type changes
		if (questionType) {
			try {
				getQuestionStatsCountForType(questionType).then((data) => (answeredCountData = data));
			} catch (error) {
				console.warn('Could not add count');
			}
		}
	}

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

	$: jsonLd = {
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
				url: `https://thw-tools.de/quiz/${data.questionType}/${question.number}`
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
	};
</script>

<QuizHead questionType={data.questionType} question={undefined} />

<svelte:head>
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`}
</svelte:head>

<div class="flex flex-col gap-8 px-4 py-8">
	<header class="text-center">
		<h1 class="text-3xl font-bold mb-4">{getQuizTypeName(data.questionType)}</h1>
		<p class="text-xl text-gray-700 mb-2">{getDescriptionForQuestionType(data.questionType)}</p>
		<a
			href={`/quiz/${questionType}/1`}
			class="text-lg text-thw-600 font-medium"
			data-umami-event={`Start ${questionType.toUpperCase()} Quiz`}
			>Klicke auf eine Frage, um zu starten</a
		>
	</header>

	<div class="flex flex-col gap-6">
		<QuestionsStatistics {answeredCountData} {questionType} />

		<LinkButton
			url={`/quiz/${questionType}/1`}
			dataUmamiEvent={`Start ${questionType.toUpperCase()} Quiz`}
		>
			{`${getQuizTypeName(questionType)} starten`}
		</LinkButton>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
			{#each data.allQuestions.sort((a, b) => a.number - b.number) as question}
				<LinkButton
					url={`/quiz/${data.questionType}/${question.number}`}
					secondary
					dataUmamiEvent={`Open ${data.questionType.toUpperCase()} Quiz Question ${question.number}`}
				>
					<div class="overflow-hidden whitespace-no-wrap">
						<div>Frage {question.number}:</div>
						<div class="truncate text-black text-sm">
							{question.text}
						</div>
					</div>
				</LinkButton>
			{/each}
		</div>
	</div>
</div>
