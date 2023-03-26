<script lang="ts">
	import type { AnswerdCountData } from '../../../routes/(main)/quiz/[type]/+page';

	export let answerdCountData: AnswerdCountData | undefined;
	export let currentQuestionAnswerdCountData: AnswerdCountData | undefined;
</script>

<div class="flex flex-col gap-2 text-base font-normal text-gray-400">
	<h3>
		(zu {currentQuestionAnswerdCountData !== undefined &&
		currentQuestionAnswerdCountData.right + currentQuestionAnswerdCountData.wrong != 0
			? (
					(currentQuestionAnswerdCountData.right /
						(currentQuestionAnswerdCountData.right + currentQuestionAnswerdCountData.wrong)) *
					100
			  )
					.toFixed(1)
					.replace(/\.0+$/, '')
			: ''}% wurde diese Frage richtig beantwortet)
	</h3>

	<div>
		Fragen beantwortet:
		{#if answerdCountData}
			{answerdCountData.right + answerdCountData.wrong}
		{/if}
		<br />
		Richtig beantwortet:
		{#if answerdCountData}
			{answerdCountData.right}
		{/if}
		<br />
		Falsch beantwortet:
		{#if answerdCountData}
			{answerdCountData.wrong}
		{/if}
	</div>
</div>
