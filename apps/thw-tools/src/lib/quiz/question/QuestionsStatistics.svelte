<script lang="ts">
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';

	export let answeredCountData: AnsweredCountData | undefined;
</script>

<div class="text-base font-normal text-gray-400">
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
