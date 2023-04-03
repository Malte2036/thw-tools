<script lang="ts">
	import type { PageData } from './$types';
	import { afterNavigate, goto } from '$app/navigation';
	import type { ExtendedQuestion, QuestionType } from '$lib/quiz/question/Question';
	import { onMount } from 'svelte';
	import { randomInt, shuffle } from '$lib/utils';
	import QuestionStatistics from '$lib/quiz/question/QuestionStatistics.svelte';
	import CheckboxAnswer from '$lib/quiz/answer/CheckboxAnswer.svelte';
	import AnswerButton from '$lib/quiz/AnswerButton.svelte';
	import type { AnswerdCountData } from './+page.server';
	import QuestionNumber from '$lib/quiz/QuestionNumber.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';
	import type { AfterNavigate } from '@sveltejs/kit';

	export let data: PageData;

	let question: ExtendedQuestion;
	let shuffledAnswers: [number, string][];
	let questionType: QuestionType;
	let answeredCountData: AnswerdCountData | undefined;
	let currentQuestionAnswerdCountData: AnswerdCountData | undefined;

	function setQuestion(q: ExtendedQuestion) {
		revealAnswers = false;

		question = q;
		shuffledAnswers = shuffle([...question.answers]);

		currentQuestionAnswerdCountData = undefined;

		if (!import.meta.env.SSR) {
			fetch(`/api/quiz/${questionType}/${q.number}/count`).then((res) =>
				res.json().then((data) => (currentQuestionAnswerdCountData = data))
			);
		}
	}

	$: questionType = data.questionType;
	$: setQuestion(data.question);
	$: questionCount = data.questionCount;

	let revealAnswers = false;

	let completelyRight = false;

	$: completelyRight = question.correctIndizies == question.checkedIndizies;

	function gotoQuestionNumber(newQuestionNumber: number) {
		goto(`/quiz/${questionType}/${newQuestionNumber}`);
	}

	function gotoNextQuestion() {
		let nextQuestionId = data.nextQuestionId;

		if (shuffleQuiz) {
			while (nextQuestionId - 1 === data.question.number) {
				nextQuestionId = randomInt(data.questionCount) + 1;
			}
		}
		gotoQuestionNumber(nextQuestionId);
	}

	let questionTextEl: any;

	function focusQuestionText() {
		if (questionTextEl) {
			questionTextEl.focus();
		}
	}

	afterNavigate(async (navigation: AfterNavigate) => {
		setTimeout(() => {
			focusQuestionText();
		});
	});

	onMount(() => {
		try {
			fetch(`/api/quiz/${questionType}/count`).then((res) =>
				res.json().then((data) => (answeredCountData = data))
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
	<div class="flex flex-col gap-16 justify-between h-full">
		<div class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<QuestionNumber questionNumber={question.number} {questionCount} {gotoQuestionNumber} />
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
					<img
						class="flex justify-center h-64 aspect-square m-4"
						alt="Question Image"
						src={question.image}
					/>
				{/if}
				<div class="flex flex-col flex-grow gap-2 w-full">
					{#each shuffledAnswers as [index, value]}
						<CheckboxAnswer
							bind:answer={value}
							checked={question.checkedIndizies.includes(index)}
							correct={question.correctIndizies.includes(index)}
							bind:revealAnswers
							changeCheckedCallback={(value) => {
								question.checkedIndizies = value
									? [...question.checkedIndizies, index]
									: question.checkedIndizies.filter((v) => v != index);
							}}
						/>
					{/each}
				</div>
			</div>
			<div class="mx-auto w-3/5 max-md:w-4/6">
				<AnswerButton
					bind:question
					bind:questionType
					bind:answerdCountData={answeredCountData}
					bind:completelyRight
					bind:currentQuestionAnswerdCountData
					bind:revealAnswers
					{gotoNextQuestion}
				/>
			</div>
		</div>
		<QuestionStatistics answerdCountData={answeredCountData} {currentQuestionAnswerdCountData} />
	</div>
</div>
