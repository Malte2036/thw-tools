<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import { QuestionType } from '$lib/model/question';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	function getDescriptionForQuestionType(questionType: QuestionType) {
		const count = data.allQuestions.length;
		switch (questionType) {
			case QuestionType.GA:
				return `Das Grundausbildungs-Quiz besteht aus ${count} Fragen für die Grundausbildungsprüfung im Technischen Hilfswerk.`;
			case QuestionType.AGT:
				return `Das Atemschutz-Quiz besteht aus ${count} Fragen für die Atemschutzausbildung im Technischen Hilfswerk.`;
			case QuestionType.CBRN:
				return `Das CBRN-Quiz besteht aus ${count} Fragen für die CBRN Ausbildung im Technischen Hilfswerk.`;
			default:
				return `Das Quiz besteht aus ${count} Fragen für die Ausbildung im Technischen Hilfswerk.`;
		}
	}
</script>

<QuizHead questionType={data.questionType} question={undefined} />

<div class="flex flex-col gap-1 m-4 text-xl">
	<div>
		<span>{getDescriptionForQuestionType(data.questionType)}</span>
		<span>Klicke auf die erste Frage, um das Quiz zu starten.</span>
	</div>
	<div class="flex flex-col gap-1">
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
