<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { getQuestionStatsCountForType } from '$lib/api/api';
	import type { ExtendedQuestion, IQuestion, QuestionType } from '$lib/model/question';
	import CheckboxAnswer from '$lib/quiz/answer/CheckboxAnswer.svelte';
	import AnswerButton from '$lib/quiz/AnswerButton.svelte';
	import QuestionStatisticsForQuestion from '$lib/quiz/question/QuestionStatisticsForQuestion.svelte';
	import QuestionNumber from '$lib/quiz/QuestionNumber.svelte';
	import QuizHead from '$lib/quiz/QuizHead.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';
	import { randomInt, shuffle } from '$lib/utils';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { AnsweredCountData } from './+page.server';

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

		shuffledAnswers = shuffle(Array.from(q.answers));

		currentQuestionAnsweredCountData = undefined;

		if (!import.meta.env.SSR) {
			getQuestionStatsCountForType(questionType, q.number).then(
				(data) => (currentQuestionAnsweredCountData = data)
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
			getQuestionStatsCountForType(questionType).then((data) => (answeredCountData = data));
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
							checked={question.checkedIndices.includes(index)}
							correct={question.correctIndices.includes(index)}
							bind:revealAnswers
							changeCheckedCallback={(value) => {
								question.checkedIndices = value
									? [...question.checkedIndices, index]
									: question.checkedIndices.filter((v) => v != index);
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
