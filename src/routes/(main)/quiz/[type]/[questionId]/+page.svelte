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
	import ProgressBar from '$lib/quiz/ProgressBar.svelte';
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

<div class="h-full flex flex-col">
	<div class="flex-grow flex flex-col px-4">
		<div class="flex flex-col gap-8">
			<div class="flex flex-col gap-2">
				<div class="-mx-4 -mt-4 w-screen">
					<ProgressBar progress={(question.number - 1) / questionCount} />
				</div>
				<div class="text-sm mt-4">Frage {question.number} von {questionCount}</div>
				<h1
					bind:this={questionTextEl}
					class="text-3xl text-center text-thw outline-none font-bold break-words"
					tabindex="-1"
				>
					{question.text}
				</h1>
			</div>
			<div class="flex gap-y-2 flex-col md:flex-row w-full items-center">
				{#if question.image}
					<img
						class="flex justify-center h-64 aspect-square m-4"
						alt={`Fragebild ${question.number}`}
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
		</div>
		<div class="flex-grow sm:hidden"></div>
		<div class="w-full pt-8 pb-8">
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
</div>
