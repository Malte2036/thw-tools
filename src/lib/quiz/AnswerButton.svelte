<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { addCount } from '$lib/database/questions_metadata';
	import type { AnsweredCountData } from '../../routes/(main)/quiz/[type]/[questionId]/+page';
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
	click={async () => {
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
			await addCount(questionType, {
				correct: completelyRight,
				questionId: question.number
			});
		}
	}}
	dataUmamiEvent={`${questionType} quiz question ${revealAnswers ? 'next question' : 'answered'}`}
	disabled={!revealAnswers && question.checkedIndizies.length == 0}
	>{revealAnswers
		? `${completelyRight ? 'Richtig' : 'Falsch'} - Nächste Frage`
		: 'Überprüfen'}</Button
>
