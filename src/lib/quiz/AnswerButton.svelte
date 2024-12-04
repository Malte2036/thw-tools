<script lang="ts">
	import { addQuestionStatsCount } from '$lib/api/api';
	import Button from '$lib/Button.svelte';
	import type { ExtendedQuestion, QuestionType } from '$lib/model/question';
	import type { AnsweredCountData } from '../../routes/(main)/quiz/[type]/[questionId]/+page.server';

	export let question: ExtendedQuestion;
	export let revealAnswers: boolean;
	export let completelyRight: boolean;
	export let gotoNextQuestion: () => void;
	export let answeredCountData: AnsweredCountData | undefined;
	export let currentQuestionAnsweredCountData: AnsweredCountData | undefined;
</script>

<Button
	click={() => {
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
	dataUmamiEvent={`${question.type} quiz question ${revealAnswers ? 'next question' : 'answered'}`}
	disabled={!revealAnswers && question.checkedAnswers.length == 0}
	>{revealAnswers
		? `${completelyRight ? 'Richtig' : 'Falsch'} - Nächste Frage`
		: 'Überprüfen'}</Button
>
