<script lang="ts">
	import type { AnsweredCountData } from '../../../routes/(main)/quiz/[type]/[questionId]/+page.server';
	import QuestionsStatistics from './QuestionsStatistics.svelte';

	export let answeredCountData: AnsweredCountData | undefined;
	export let currentQuestionAnsweredCountData: AnsweredCountData | undefined;
</script>

<div class="flex flex-col gap-2">
	<h3 class="text-base font-normal text-gray-400">
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
	<QuestionsStatistics {answeredCountData} />
</div>
