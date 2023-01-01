<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import type { Question } from './Question';

	export let data: PageData;

	let question: Question;
	let questionType: string;
	let answerdCount: number | undefined;

	$: question = data.question;
	$: questionType = data.questionType;
	$: answerdCount = data.answerdCount;

	let revealAnswers = false;

	let fetching = true;

	$: if (fetching && question) {
		revealAnswers = false;
		fetching = false;
	}

	function assignNewQuestion() {
		fetching = true;
		invalidate('app:quiz');
	}
</script>

<svelte:head>
	<title>Atemschutz-Quiz</title>
	<meta
		name="description"
		content="Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten."
	/>
</svelte:head>

<div class="m-4">
	{#if fetching}
		<div class="text-xl w-full text-center m-8">Nächste Frage wird geladen...</div>
	{:else}
		<div class="flex flex-col gap-4">
			<h1 class="text-2xl">{question.number}. {question.text}</h1>
			<div class="flex flex-col gap-1 ml-4">
				{#each question.answers as answer (answer.letter)}
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="text-xl flex flex-row py-1 px-2 gap-2 rounded-md"
						class:rightAnswer={revealAnswers && answer.correct}
						class:wrongCheckedAnswer={revealAnswers && answer.correct != answer.checked}
						on:click={() => (answer.checked = !answer.checked)}
					>
						<input type="checkbox" aria-label={answer.letter} bind:checked={answer.checked} />
						<div>
							{answer.letter}) {answer.text}
						</div>
					</div>
				{/each}
			</div>
			<button
				on:click={() => {
					if (revealAnswers) {
						assignNewQuestion();
					} else {
						revealAnswers = !revealAnswers;
						fetch(`/api/quiz/${questionType}/add`, {
							method: 'POST',
							body: JSON.stringify({
								questionId: question.number,
								correct: question.answers.every((answer) => answer.checked == answer.correct)
							}),
							headers: { 'content-type': 'application/json' }
						});
					}
				}}
				class="bg-thw text-white py-2 rounded-lg text-xl font-bold disabled:bg-white disabled:border disabled:border-thw disabled:text-gray-500"
				disabled={!revealAnswers && question.answers.every((answer) => answer.checked === false)}
				>{revealAnswers ? 'Nächste Frage' : 'Überprüfen'}</button
			>

			{#if answerdCount !== undefined}
				<div class="text-gray-500">Fragen beantwortet: {answerdCount}</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.rightAnswer {
		background-color: yellow;
	}
	.wrongCheckedAnswer {
		color: red;
	}
</style>
