<script lang="ts">
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';

	export let answeredCountData: AnsweredCountData | undefined;
	export let currentQuestionAnsweredCountData: AnsweredCountData | undefined;
</script>

<div class="flex flex-col gap-2 text-base font-normal text-gray-400">
	<h3>
		(zu {currentQuestionAnsweredCountData !== undefined &&
		currentQuestionAnsweredCountData.right + currentQuestionAnsweredCountData.wrong != 0
			? (
					(currentQuestionAnsweredCountData.right /
						(currentQuestionAnsweredCountData.right + currentQuestionAnsweredCountData.wrong)) *
					100
			  )
					.toFixed(1)
					.replace(/\.0+$/, '')
			: ''}% wurde diese Frage richtig beantwortet)
	</h3>

	<div>
		Fragen beantwortet:
		{#if answeredCountData}
			{answeredCountData.right + answeredCountData.wrong}
		{/if}
		<br />
		Richtig beantwortet:
		{#if answeredCountData}
			{answeredCountData.right}
		{/if}
		<br />
		Falsch beantwortet:
		{#if answeredCountData}
			{answeredCountData.wrong}
		{/if}
	</div>
</div>
