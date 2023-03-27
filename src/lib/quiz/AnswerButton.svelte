<script lang="ts">
	import Button from '$lib/Button.svelte';
	import type { AnswerdCountData } from '../../routes/(main)/quiz/[type]/[questionId]/+page.server';
	import type { Question, QuestionType } from './question/Question';

	export let questionType: QuestionType;
	export let question: Question;
	export let revealAnswers: boolean;
	export let completelyRight: boolean;
	export let assignNewQuestion: () => void;
	export let answerdCountData: AnswerdCountData | undefined;
	export let currentQuestionAnswerdCountData: AnswerdCountData | undefined;
</script>

<Button
	click={() => {
		if (revealAnswers) {
			assignNewQuestion();
		} else {
			revealAnswers = true;

			if (answerdCountData) {
				if (completelyRight) {
					answerdCountData.right++;
					if (currentQuestionAnswerdCountData) {
						currentQuestionAnswerdCountData.right++;
					}
				} else {
					answerdCountData.wrong++;
					if (currentQuestionAnswerdCountData) {
						currentQuestionAnswerdCountData.wrong++;
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
	disabled={!revealAnswers && question.answers.every((answer) => answer.checked === false)}
	>{revealAnswers
		? `${completelyRight ? 'Richtig' : 'Falsch'} - Nächste Frage`
		: 'Überprüfen'}</Button
>
