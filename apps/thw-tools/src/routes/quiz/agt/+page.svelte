<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';

	export let data: PageData;

	let revealAnswers = false;

	function assignNewQuestion() {
		invalidate('app:quiz:agt');

		revealAnswers = false;
	}
</script>

<svelte:head>
	<title>Atemschutz-Quiz</title>
	<meta
		name="description"
		content="Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten."
	/>
</svelte:head>

<div class="flex flex-col gap-4">
	<h1 class="text-2xl">{data.question.number}. {data.question.text}</h1>
	<div class="flex flex-col gap-1 ml-4">
		{#each data.question.answers as answer (answer.letter)}
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
				fetch('/api/quiz/agt/add', {
					method: 'POST',
					body: JSON.stringify({
						questionId: data.question.number,
						correct: data.question.answers.every((answer) => answer.checked == answer.correct)
					}),
					headers: { 'content-type': 'application/json' }
				});
			}
		}}
		class="bg-thw text-white py-2 rounded-lg text-xl font-bold disabled:bg-white disabled:border disabled:border-thw disabled:text-gray-500"
		disabled={data.question.answers.every((answer) => answer.checked === false)}
		>{revealAnswers ? 'Nächste Frage' : 'Überprüfen'}</button
	>
</div>

<style>
	.rightAnswer {
		background-color: yellow;
	}
	.wrongCheckedAnswer {
		color: red;
	}
</style>
