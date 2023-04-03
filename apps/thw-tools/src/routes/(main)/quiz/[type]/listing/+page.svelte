<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import { questionTypeToQuestionSet } from '$lib/quiz/question/Question';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const allQuestions = questionTypeToQuestionSet(data.questionType);
</script>

<QuizHead questionType={data.questionType} />

<div class="flex flex-col gap-1 m-4 text-xl">
	{#each allQuestions as question}
		<LinkButton url={`/quiz/${data.questionType}/${question.number}`} secondary>
			<div class="overflow-hidden whitespace-no-wrap">
				<div>Question {question.number}:</div>
				<div class="truncate text-black text-sm">
					{question.text}
				</div>
			</div>
		</LinkButton>
	{/each}
</div>
