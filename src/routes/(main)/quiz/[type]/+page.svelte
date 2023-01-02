<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import type { Question } from './Question';
	import { onMount } from 'svelte';
	import { shuffle } from '$lib/utils';

	type AnswerdCountData = {
		right: number;
		wrong: number;
	};

	export let data: PageData;

	function shuffleQuestion(q: Question) {
		return {
			...q,
			answers: [...shuffle(q.answers)]
		};
	}

	let question: Question;
	let questionType: string;
	let answerdCountData: AnswerdCountData | undefined;

	function setQuestion(q: Question) {
		if (question !== undefined && question.number == q.number) {
			assignNewQuestion();
			return;
		}
		question = q;
	}

	$: setQuestion(shuffleQuestion(data.question));
	$: questionType = data.questionType;
	$: questionCount = data.questionCount;

	let revealAnswers = false;

	let fetching = true;

	let completelyRight = false;

	$: completelyRight = question.answers.every((answer) => answer.checked == answer.correct);

	$: if (fetching && question) {
		revealAnswers = false;
		fetching = false;

		focusQuestionText();
	}

	function assignNewQuestion() {
		fetching = true;
		invalidate('app:quiz');
	}

	let questionTextEl: any;

	function focusQuestionText() {
		if (questionTextEl) {
			questionTextEl.focus();
		}
	}

	onMount(() => {
		setTimeout(() => {
			focusQuestionText();
		});

		try {
			fetch('/api/quiz/agt/count').then((res) =>
				res.json().then((data) => (answerdCountData = data))
			);
		} catch (error) {}
	});
</script>

<svelte:head>
	<title>Atemschutz-Quiz</title>
	<meta
		name="description"
		content="Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten."
	/>
</svelte:head>

<div class="m-4 mt-2">
	{#if fetching}
		<div class="text-xl w-full text-center m-8">Nächste Frage wird geladen...</div>
	{:else}
		<div class="flex flex-col gap-4">
			<h3 class="flex flex-row justify-center text-gray-400 font-bold">
				{question.number}/{questionCount}
			</h3>
			<h1
				bind:this={questionTextEl}
				class="text-2xl text-center focus:text-thw outline-none font-bold"
				tabindex="-1"
			>
				{question.text}
			</h1>
			<div class="flex flex-col gap-3">
				{#each question.answers as answer (question.number + answer.letter)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="text-xl flex flex-row py-2 px-4 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors"
						class:checked={answer.checked}
						class:revealAnswerCorrect={revealAnswers && answer.correct}
						class:revealAnswerWrong={revealAnswers && answer.checked != answer.correct}
						on:click={() => (answer.checked = !answer.checked)}
					>
						<input type="checkbox" aria-label={answer.letter} bind:checked={answer.checked} />
						<div>{answer.text}</div>
					</div>
				{/each}
			</div>
			<button
				on:click={() => {
					if (revealAnswers) {
						assignNewQuestion();
					} else {
						revealAnswers = true;

						if (answerdCountData) {
							if (completelyRight) {
								answerdCountData.right++;
							} else {
								answerdCountData.wrong++;
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
				class="m-auto bg-thw text-white py-2 w-3/5 rounded-lg text-xl font-bold border disabled:bg-white disabled:border-thw disabled:text-gray-500 transition-colors duration-75"
				disabled={!revealAnswers && question.answers.every((answer) => answer.checked === false)}
				>{revealAnswers ? 'Nächste Frage' : 'Überprüfen'}</button
			>

			<div class="flex flex-col text-gray-400">
				<div>
					Fragen beantwortet:
					{#if answerdCountData}
						{answerdCountData.right + answerdCountData.wrong}
					{/if}
				</div>
				<div>
					Richtig beantwortet:
					{#if answerdCountData}
						{answerdCountData.right}
					{/if}
				</div>
				<div>
					Falsch beantwortet:
					{#if answerdCountData}
						{answerdCountData.wrong}
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.checked {
		@apply bg-thw-300;
	}
	.revealAnswerCorrect {
		@apply bg-[#EEE648];
	}
	.revealAnswerWrong {
		@apply text-red-600 border border-red-600 border-dashed;
	}
</style>
