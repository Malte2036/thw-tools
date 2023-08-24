<script lang="ts">
	import Button from '$lib/Button.svelte';
	import type { AnsweredCountData } from '../../routes/(main)/quiz/[type]/[questionId]/+page.server';
	import type { ExtendedQuestion, QuestionType } from './question/Question';

	export let questionType: QuestionType;
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
			fetch(`/api/quiz/${questionType}/add`, {
				method: 'POST',
				body: JSON.stringify({
					questionId: question.number,
					correct: completelyRight
				}),
				headers: { 'content-type': 'application/json' }
			});
		}
	}}
	dataUmamiEvent={`${questionType} quiz question ${revealAnswers ? 'answered' : 'next'}`}
	disabled={!revealAnswers && question.checkedIndizies.length == 0}
	>{revealAnswers
		? `${completelyRight ? 'Richtig' : 'Falsch'} - Nächste Frage`
		: 'Überprüfen'}</Button
>
