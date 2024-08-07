<script lang="ts">
	import type { PageData } from './$types';
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { randomInt, shuffle } from '$lib/utils';
	import QuestionStatisticsForQuestion from '$lib/quiz/question/QuestionStatisticsForQuestion.svelte';
	import CheckboxAnswer from '$lib/quiz/answer/CheckboxAnswer.svelte';
	import AnswerButton from '$lib/quiz/AnswerButton.svelte';
	import type { AnsweredCountData } from './+page.server';
	import QuestionNumber from '$lib/quiz/QuestionNumber.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';
	import type { AfterNavigate } from '@sveltejs/kit';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import type { ExtendedQuestion, IQuestion, QuestionType } from '$lib/model/question';

	export let data: PageData;

	let question: ExtendedQuestion;
	let shuffledAnswers: [number, string][];
	let questionType: QuestionType;
	let answeredCountData: AnsweredCountData | undefined;
	let currentQuestionAnsweredCountData: AnsweredCountData | undefined;

	function setQuestion(q: IQuestion) {
		revealAnswers = false;

		question = {
			...q,
			checkedIndices: []
		};

		shuffledAnswers = shuffle([...question.answers]);

		currentQuestionAnsweredCountData = undefined;

		if (!import.meta.env.SSR) {
			fetch(`/api/quiz/${questionType}/${q.number}/count`).then((res) =>
				res.json().then((data) => (currentQuestionAnsweredCountData = data))
			);
		}
	}

	$: questionType = data.questionType;
	$: setQuestion(data.question);
	$: questionCount = data.questionCount;

	let revealAnswers = false;

	let completelyRight = false;

	$: completelyRight =
		JSON.stringify(question.correctIndices.sort()) ===
		JSON.stringify(question.checkedIndices.sort());

	function gotoQuestionNumber(newQuestionNumber: number) {
		goto(`/quiz/${questionType}/${newQuestionNumber}`);
	}

	function gotoNextQuestion() {
		let nextQuestionId = data.nextQuestionId;

		if ($shuffleQuiz) {
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

<QuizHead {questionType} {question} />

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
							checked={question.checkedIndices.includes(index.toString())}
							correct={question.correctIndices.includes(index.toString())}
							bind:revealAnswers
							changeCheckedCallback={(value) => {
								question.checkedIndices = value
									? [...question.checkedIndices, index.toString()]
									: question.checkedIndices.filter((v) => v != index.toString());
							}}
						/>
					{/each}
				</div>
			</div>
			<div class="mx-auto w-3/5 max-md:w-4/6">
				<AnswerButton
					bind:question
					bind:questionType
					bind:answeredCountData
					bind:completelyRight
					bind:currentQuestionAnsweredCountData
					bind:revealAnswers
					{gotoNextQuestion}
				/>
			</div>
		</div>
		<QuestionStatisticsForQuestion {answeredCountData} {currentQuestionAnsweredCountData} />
	</div>
</div>
