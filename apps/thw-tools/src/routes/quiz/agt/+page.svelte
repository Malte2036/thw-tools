<script lang="ts">
	import { onMount } from 'svelte';
	import { AGTQuestions } from './AGTQuestions';
	import type { Question } from './Question';

	let question: Question;
	let revealAnswers = false;

	onMount(() => {
		assignNewQuestion();
	});

	function assignNewQuestion() {
		let questionNumber = Math.floor(Math.random() * AGTQuestions.length);
		question = AGTQuestions[questionNumber];
		question = {
			...question,
			answers: question.answers.map((question) => ({ ...question, checked: false }))
		};

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

{#if question}
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
					fetch('/api/quiz/agt/add', {
						method: 'POST',
						body: JSON.stringify({
							questionId: question.number,
							correct: question.answers.every((answer) => answer.checked == answer.correct)
						}),
						headers: { 'content-type': 'application/json' }
					});
				}
			}}
			class="bg-thw text-white py-2 rounded-lg text-xl font-bold"
			>{revealAnswers ? 'Nächste Frage' : 'Überprüfen'}</button
		>
	</div>
{/if}

<style>
	.rightAnswer {
		background-color: yellow;
	}
	.wrongCheckedAnswer {
		color: red;
	}
</style>
