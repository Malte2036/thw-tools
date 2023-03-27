<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import { questionTypeToQuestionSet } from '$lib/quiz/question/Question';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<div class="flex flex-col gap-1 m-4 text-xl">
	{#each [...Array(questionTypeToQuestionSet(data.questionType).length).keys()] as i}
		<LinkButton url={`/quiz/${data.questionType}/${i + 1}`} secondary>Question {i + 1}</LinkButton>
	{/each}
</div>
