<script lang="ts">
	import type { PageData } from './$types';
	import { invalidate } from '$app/navigation';
	import type { Question, QuestionType } from '$lib/quiz/question/Question';
	import { onMount } from 'svelte';
	import { shuffle } from '$lib/utils';
	import type { AnswerdCountData } from './+page';
	import QuestionStatistics from '$lib/quiz/question/QuestionStatistics.svelte';
	import CheckboxAnswer from '$lib/quiz/answer/CheckboxAnswer.svelte';
	import AnswerButton from '$lib/quiz/AnswerButton.svelte';

	export let data: PageData;

	function shuffleQuestion(q: Question) {
		return {
			...q,
			answers: [...shuffle(q.answers)]
		};
	}

	let question: Question;
	let questionType: QuestionType;
	let answerdCountData: AnswerdCountData | undefined;
	let currentQuestionAnswerdCountData: AnswerdCountData | undefined;

	function setQuestion(q: Question) {
		if (question !== undefined && question.number == q.number) {
			assignNewQuestion();
			return;
		}
		question = q;

		currentQuestionAnswerdCountData = undefined;
		fetch(`/api/quiz/${questionType}/${q.number}/count`).then((res) =>
			res.json().then((data) => (currentQuestionAnswerdCountData = data))
		);
	}

	$: questionType = data.questionType;
	$: setQuestion(shuffleQuestion(data.question));
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
			fetch(`/api/quiz/${questionType}/count`).then((res) =>
				res.json().then((data) => (answerdCountData = data))
			);
		} catch (error) {
			console.warn('Could not add count');
		}
	});
</script>

<svelte:head>
	{#if questionType == 'agt'}
		<title>Atemschutz-Quiz</title>
		<meta
			name="description"
			content="Das Online-Theorie-Quiz für Atemschutzgeräteträger des THW und der Feuerwehr bietet dir die Möglichkeit, dein Wissen über den sicheren Umgang mit Atemschutzgeräten zu testen und aufzufrischen. Verbesser deine Kenntnisse und Sicherheit im Einsatz von Atemschutzgeräten."
		/>
	{:else}
		<title>CBRN-Quiz</title>
		<meta
			name="description"
			content="Möchtest du dein Wissen über den sicheren Umgang mit CBRN-Gefahren verbessern? Dann ist unser Online-Theorie-Quiz für CBRN-Schutzkräfte des THW und der Feuerwehr genau das Richtige für dich. Teste dein Wissen und frische es auf, um im Einsatz von CBRN-Gefahren noch sicherer zu agieren."
		/>
	{/if}
</svelte:head>

<div class="m-4 mt-2">
	{#if fetching}
		<div class="text-xl w-full text-center m-8">Nächste Frage wird geladen...</div>
	{:else}
		<div class="flex flex-col gap-16 justify-between h-full">
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-2">
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
				</div>
				<div class="flex gap-y-2 flex-col md:flex-row w-full items-center">
					{#if question.image}
						<div class="flex justify-center h-64 aspect-square m-4">
							<img alt="The project logo" src={question.image} />
						</div>
					{/if}
					<div class="flex flex-col flex-grow gap-2 w-full">
						{#each question.answers as answer, i (question.number + i)}
							<CheckboxAnswer bind:answer bind:revealAnswers />
						{/each}
					</div>
				</div>
				<div class="mx-auto w-3/5 max-md:w-4/6">
					<AnswerButton
						bind:question
						bind:questionType
						bind:answerdCountData
						bind:completelyRight
						bind:currentQuestionAnswerdCountData
						bind:revealAnswers
						assignNewQuestion={() => assignNewQuestion()}
					/>
				</div>
			</div>
			<QuestionStatistics {answerdCountData} {currentQuestionAnswerdCountData} />
		</div>
	{/if}
</div>
