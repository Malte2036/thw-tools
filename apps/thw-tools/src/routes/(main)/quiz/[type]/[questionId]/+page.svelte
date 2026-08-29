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
	import { getQuizTypeShortName } from '$lib/quiz/quizUtils';
	import SettingsIcon from '$lib/icons/SettingsIcon.svelte';
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
	<div class="flex min-h-full flex-col bg-gradient-to-b from-white to-thw-50">
		<div class="px-4 pt-4">
			<div class="flex items-center justify-between gap-2">
				<a
					href={`/quiz/${questionType}/listing/`}
					class="min-w-0 truncate text-sm font-semibold text-thw-700 transition-colors hover:text-thw"
					data-umami-event={`Open ${questionType.toUpperCase()} Quiz Listing`}
					>{getQuizTypeShortName(questionType)}</a
				>
				<span
					class="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-semibold tabular-nums text-thw-800 shadow-card ring-1 ring-thw-100"
				>
					Frage {question.number} / {questionCount}
				</span>
				<button
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-thw-700 transition-colors hover:bg-thw-100"
					onclick={openQuizSettings}
					aria-label="Quiz Einstellungen"
					data-umami-event="Open Quiz Settings"
				>
					<div class="h-5 w-5">
						<SettingsIcon />
					</div>
				</button>
			</div>
			<div class="mt-3">
				<ProgressBar progress={(question.number - 1) / questionCount} />
			</div>
		</div>

		<main class="flex-1 px-4 pb-6 pt-6">
			<div class="flex flex-col gap-8">
				<h1
					bind:this={questionTextEl}
					class="text-2xl font-bold break-words text-thw outline-none sm:text-3xl"
					tabindex="-1"
				>
					{question.text}
				</h1>
				<div class="flex w-full flex-col gap-y-2 md:flex-row md:items-center">
					{#if question.image}
						<img
							class="mx-auto mb-2 aspect-square h-48 rounded-2xl bg-white object-contain shadow-card md:mb-0 md:h-64"
							alt={`Fragebild ${question.number}`}
							src={question.image}
						/>
					{/if}
					<div class="flex w-full flex-grow flex-col gap-2.5">
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
		</main>

		<div
			class="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent px-4 pt-4 pb-safe"
		>
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
{/if}

{#if showSettings}
	<QuizSettingsDialog onClose={() => (showSettings = false)} />
{/if}
