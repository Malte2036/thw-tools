<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { getQuestionStatsCount, getQuestionStatsCountForType } from '$lib/api/api';
	import type {
		ExtendedQuestion,
		Question,
		QuestionAnswer,
		QuestionType
	} from '$lib/model/question';
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
	let shuffledAnswers: QuestionAnswer[];
	let questionType: QuestionType;
	let answeredCountData: AnsweredCountData | undefined;
	let currentQuestionAnsweredCountData: AnsweredCountData | undefined;

	function setQuestion(q: Question) {
		revealAnswers = false;

		question = {
			...q,
			checkedAnswers: []
		};

		shuffledAnswers = shuffle(Array.from(q.answers));

		if (!import.meta.env.SSR) {
			getQuestionStatsCount(q.id)
				.then((data) => (currentQuestionAnsweredCountData = data))
				.catch((error) => {
					console.warn('Could not get current question stats');
					currentQuestionAnsweredCountData = undefined;
				});
		}
	}

	$: questionType = data.questionType;
	$: setQuestion(data.question);
	$: questionCount = data.questionCount;

	let revealAnswers = false;

	let completelyRight = false;

	$: completelyRight =
		JSON.stringify(
			question.answers
				.filter((a) => a.isCorrect)
				.map((a) => a.id)
				.sort()
		) === JSON.stringify(question.checkedAnswers.sort());

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
		getQuestionStatsCountForType(questionType)
			.then((data) => (answeredCountData = data))
			.catch((error) => console.warn('Could not get stats'));
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
					{#each shuffledAnswers as answer}
						<CheckboxAnswer
							bind:answer
							checked={question.checkedAnswers.includes(answer.id)}
							bind:revealAnswers
							changeCheckedCallback={(value) => {
								question.checkedAnswers = value
									? [...question.checkedAnswers, answer.id]
									: question.checkedAnswers.filter((v) => v != answer.id);
							}}
						/>
					{/each}
				</div>
			</div>
			<div class="mx-auto w-3/5 max-md:w-4/6">
				<AnswerButton
					bind:question
					bind:answeredCountData
					bind:completelyRight
					bind:currentQuestionAnsweredCountData
					bind:revealAnswers
					{gotoNextQuestion}
				/>
			</div>
		</div>
		<QuestionStatisticsForQuestion {currentQuestionAnsweredCountData} />
	</div>
</div>
