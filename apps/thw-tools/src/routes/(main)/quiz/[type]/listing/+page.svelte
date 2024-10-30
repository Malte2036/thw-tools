<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import { QuestionType } from '$lib/model/question';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import { onMount } from 'svelte';
	import type { AnsweredCountData } from '../[questionId]/+page.server';
	import type { PageData } from './$types';
	import QuestionsStatistics from '$lib/quiz/question/QuestionsStatistics.svelte';
	import { getQuestionStatsCountForType } from '$lib/api/api';

	export let data: PageData;

	let answeredCountData: AnsweredCountData | undefined;
	let questionType: QuestionType;

	$: questionType = data.questionType;

	onMount(() => {
		try {
			getQuestionStatsCountForType(questionType).then((data) => (answeredCountData = data));
		} catch (error) {
			console.warn('Could not add count');
		}
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

	function getHeaderForQuestionType(questionType: QuestionType) {
		switch (questionType) {
			case QuestionType.GA:
				return 'Grundausbildungs-Quiz';
			case QuestionType.AGT:
				return 'Atemschutz-Quiz';
			case QuestionType.CBRN:
				return 'CBRN-Quiz';
			case QuestionType.RADIO:
				return 'Sprechfunk-Quiz';
			default:
				return 'THW-Quiz';
		}
	}
</script>

<QuizHead questionType={data.questionType} question={undefined} />

<div class="flex flex-col gap-8 px-4 py-8">
	<header class="text-center">
		<h1 class="text-3xl font-bold mb-4">{getHeaderForQuestionType(data.questionType)}</h1>
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

		<div class="flex flex-col gap-3">
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
