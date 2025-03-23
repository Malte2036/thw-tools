<script lang="ts">
	import { run } from 'svelte/legacy';

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
	import QuizSettingsDialog from '$lib/quiz/QuizSettingsDialog.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';
	import { randomInt, shuffle } from '@thw-tools/shared';
	import type { AfterNavigate } from '@sveltejs/kit';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import type { AnsweredCountData } from './+page.server';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let question: ExtendedQuestion | undefined = $state();
	let checkedAnswers: number[] = $state([]);
	let shuffledAnswers: QuestionAnswer[] | undefined = $state();
	let questionType: QuestionType = $derived(data.questionType);
	let answeredCountData: AnsweredCountData | undefined = $state();
	let currentQuestionAnsweredCountData: AnsweredCountData | undefined = $state();

	function setQuestion(q: Question) {
		revealAnswers = false;

		question = {
			...q,
			checkedAnswers: []
		};
		checkedAnswers = [];

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

	$effect(() => {
		setQuestion(data.question);
	});
	let questionCount = $derived(data.questionCount);

	let revealAnswers = $state(false);

	let completelyRight = $state(false);

	$effect(() => {
		if (!question) {
			return;
		}

		completelyRight =
			JSON.stringify(
				question.answers
					.filter((a) => a.isCorrect)
					.map((a) => a.id)
					.sort()
			) === JSON.stringify(checkedAnswers.sort());
	});

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

	let questionTextEl: any = $state();

	function focusQuestionText() {
		if (questionTextEl) {
			questionTextEl.focus();
		}
	}

	let showSettings = $state(false);

	function openQuizSettings() {
		showSettings = true;
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

{#if question && shuffledAnswers}
	<div class="h-full flex flex-col">
		<div class="flex-grow flex flex-col px-4">
			<div class="flex flex-col gap-8">
				<div class="flex flex-col gap-2">
					<div class="-mx-4 -mt-4 w-screen">
						<ProgressBar progress={(question.number - 1) / questionCount} />
					</div>
					<div class="text-sm mt-4 flex flex-row justify-between">
						<div>Frage {question.number} von {questionCount}</div>
						<button class="underline hover:text-thw" onclick={openQuizSettings}>
							Einstellungen
						</button>
					</div>
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
						{#each shuffledAnswers as answer, index}
							<CheckboxAnswer
								{answer}
								checked={checkedAnswers.includes(answer.id)}
								{revealAnswers}
								changeCheckedCallback={(value) => {
									if (!question) {
										console.warn('Question is undefined');
										return;
									}
									checkedAnswers = value
										? [...checkedAnswers, answer.id]
										: checkedAnswers.filter((v) => v != answer.id);
								}}
							/>
						{/each}
					</div>
				</div>
			</div>
			<div class="flex-grow sm:hidden"></div>
			<div class="w-full pt-8 pb-8">
				<AnswerButton
					{question}
					{checkedAnswers}
					{completelyRight}
					bind:revealAnswers
					bind:answeredCountData
					bind:currentQuestionAnsweredCountData
					{gotoNextQuestion}
				/>
			</div>
		</div>
	</div>
{/if}

{#if showSettings}
	<QuizSettingsDialog onClose={() => (showSettings = false)} />
{/if}
