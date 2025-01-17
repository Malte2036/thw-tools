<script lang="ts">
	import { addQuestionStatsCount } from '$lib/api/api';
	import type { ExtendedQuestion } from '$lib/model/question';
	import type { AnsweredCountData } from '../../routes/(main)/quiz/[type]/[questionId]/+page.server';
	import ArrowRightIcon from '../icons/ArrowRightIcon.svelte';
	export let question: ExtendedQuestion;
	export let revealAnswers: boolean;
	export let completelyRight: boolean;
	export let gotoNextQuestion: () => void;
	export let answeredCountData: AnsweredCountData | undefined;
	export let currentQuestionAnsweredCountData: AnsweredCountData | undefined;
</script>

<button
	class="w-full min-h-12 bg-black text-white text-md p-2 rounded-lg font-bold flex items-center justify-center gap-2 cursor-pointer border-2 border-black disabled:bg-white disabled:border-gray-500 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-150"
	on:click={() => {
		if (revealAnswers) {
			gotoNextQuestion();
		} else {
			revealAnswers = true;

			if (answeredCountData) {
				if (completelyRight) {
					answeredCountData.right++;
					if (currentQuestionAnsweredCountData) {
						currentQuestionAnsweredCountData.right++;
					}
				} else {
					answeredCountData.wrong++;
					if (currentQuestionAnsweredCountData) {
						currentQuestionAnsweredCountData.wrong++;
					}
				}
			}
			addQuestionStatsCount(question.id, completelyRight);
		}
	}}
	data-umami-event={`${question.type} quiz question ${revealAnswers ? 'next question' : 'answered'}`}
	disabled={!revealAnswers && question.checkedAnswers.length == 0}
>
	{revealAnswers ? `${completelyRight ? 'Richtig' : 'Falsch'} - Nächste Frage` : 'Überprüfen'}
	<div class="h-4 w-4">
		<ArrowRightIcon />
	</div>
</button>
