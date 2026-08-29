<script lang="ts">
	import XMarkIcon from '$lib/icons/XMarkIcon.svelte';
	import CheckIcon from '$lib/icons/CheckIcon.svelte';
	import type { QuestionAnswer } from '$lib/model/question';

	interface Props {
		answer: QuestionAnswer;
		checked: boolean;
		revealAnswers: boolean;
		changeCheckedCallback: (value: boolean) => void;
	}

	let { answer, checked, revealAnswers, changeCheckedCallback }: Props = $props();

	let isCheckedVariant = $derived(checked && !revealAnswers);
	let isChosenCorrectVariant = $derived(revealAnswers && checked && answer.isCorrect);
	let isMissedCorrectVariant = $derived(revealAnswers && !checked && answer.isCorrect);
	let isWrongVariant = $derived(revealAnswers && checked && !answer.isCorrect);
	let isDimmed = $derived(revealAnswers && !answer.isCorrect && !isWrongVariant);

	let containerClass = $derived(
		isChosenCorrectVariant
			? 'border-correct bg-correct-200'
			: isMissedCorrectVariant
				? 'border-dashed border-correct bg-white'
				: isWrongVariant
					? 'border-wrong bg-wrong-200'
					: isCheckedVariant
						? 'border-thw bg-thw-50'
						: 'border-gray-200 bg-white'
	);

	let circleClass = $derived(
		revealAnswers
			? answer.isCorrect
				? isChosenCorrectVariant
					? 'bg-correct-600 text-white'
					: 'border-2 border-correct-600 bg-white text-correct-600'
				: isWrongVariant
					? 'bg-wrong-600 text-white'
					: 'border-2 border-gray-300 bg-white'
			: isCheckedVariant
				? 'bg-thw text-white'
				: 'border-2 border-gray-300 bg-white'
	);

	let showCheck = $derived(revealAnswers ? answer.isCorrect : isCheckedVariant);
	let showX = $derived(isWrongVariant);
	let statusLabel = $derived(
		revealAnswers
			? answer.isCorrect
				? isChosenCorrectVariant
					? 'Richtig'
					: 'Nicht gewählt'
				: isWrongVariant
					? 'Deine Antwort'
					: null
			: null
	);
	let statusLabelClass = $derived(
		statusLabel === 'Richtig'
			? 'bg-correct-200 text-correct-700'
			: statusLabel === 'Nicht gewählt'
				? 'bg-gray-100 text-gray-600'
				: 'bg-wrong-200 text-wrong-700'
	);
</script>

<label
	data-testid="answer-container"
	class="flex min-h-14 cursor-pointer select-none items-center gap-3 rounded-2xl border-2 p-4 shadow-card transition-all duration-150 hover:border-thw-300 {containerClass}"
	class:checkedVariant={isCheckedVariant}
	class:uncheckedVariant={!isCheckedVariant && !isChosenCorrectVariant && !isWrongVariant}
	class:correctVariant={isChosenCorrectVariant}
	class:missedCorrectVariant={isMissedCorrectVariant}
	class:wrongVariant={isWrongVariant}
	class:opacity-60={isDimmed}
	class:wrong-shake={isWrongVariant}
	class:correct-pop={isChosenCorrectVariant}
>
	<span class="flex-1 break-words text-base font-medium leading-snug text-gray-900">
		{answer.text}
	</span>

	<span class="flex shrink-0 items-center gap-2 pl-1">
		{#if statusLabel}
			<span
				class="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap {statusLabelClass}"
				>{statusLabel}</span
			>
		{/if}
		<span
			class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-150 {circleClass}"
			aria-hidden="true"
		>
			<span class="flex h-4 w-4 items-center justify-center">
				{#if showX}
					<span data-testid="x-mark">
						<XMarkIcon />
					</span>
				{:else if showCheck}
					<span data-testid="check-mark">
						<CheckIcon />
					</span>
				{/if}
			</span>
		</span>
	</span>

	<input
		type="checkbox"
		class="sr-only"
		{checked}
		disabled={revealAnswers}
		onchange={() => {
			if (!revealAnswers) {
				changeCheckedCallback(!checked);
			}
		}}
		aria-label="Antwort auswählen: {answer.text}"
	/>
</label>

<style lang="scss">
	@keyframes wrong-shake {
		0%,
		100% {
			transform: translateX(0);
		}
		20% {
			transform: translateX(-4px);
		}
		40% {
			transform: translateX(4px);
		}
		60% {
			transform: translateX(-3px);
		}
		80% {
			transform: translateX(3px);
		}
	}

	@keyframes correct-pop {
		0% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.02);
		}
		100% {
			transform: scale(1);
		}
	}

	.wrong-shake {
		animation: wrong-shake 300ms ease-in-out;
	}

	.correct-pop {
		animation: correct-pop 200ms ease-out;
	}
</style>
