<script lang="ts">
	import XMarkIcon from '$lib/icons/XMarkIcon.svelte';
	import CheckIcon from '$lib/icons/CheckIcon.svelte';
	import type { QuestionAnswer } from '$lib/model/question';

	export let answer: QuestionAnswer;
	export let checked: boolean;
	export let revealAnswers: boolean;
	export let changeCheckedCallback: (value: boolean) => void;

	$: isCheckedVariant = checked && !revealAnswers;
	$: isUncheckedVariant = !checked && (!revealAnswers || (!answer.isCorrect && revealAnswers));
	$: isCorrectVariant = revealAnswers && checked && answer.isCorrect;
	$: isWrongVariant =
		revealAnswers && ((checked && !answer.isCorrect) || (!checked && answer.isCorrect));

	$: shouldShowCheckMark = (revealAnswers && answer.isCorrect) || isCheckedVariant;
	$: shouldShowXMark = revealAnswers && !answer.isCorrect;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	data-testid="answer-container"
	class="transition-colors hover:cursor-pointer flex justify-between p-2 items-center rounded-lg border-2 border-gray text-xl"
	class:checkedVariant={isCheckedVariant}
	class:uncheckedVariant={isUncheckedVariant}
	class:correctVariant={isCorrectVariant}
	class:wrongVariant={isWrongVariant}
	class:isAnswerCorrect={revealAnswers && answer.isCorrect}
	class:isAnswerWrong={revealAnswers && !answer.isCorrect}
	on:click={() => {
		changeCheckedCallback(!checked);
		checked = !checked;
	}}
>
	<div>{answer.text}</div>
	<div class="relative w-6 h-6 aspect-square">
		<input
			type="checkbox"
			bind:checked
			class="absolute top-0 left-0 w-full h-full rounded-full border-gray border-2 appearance-none flex-shrink-0 cursor-pointer"
		/>
		{#if shouldShowXMark}
			<div
				class="absolute inset-0 flex items-center justify-center text-white p-1.5"
				data-testid="x-mark"
			>
				<XMarkIcon />
			</div>
		{/if}
		{#if shouldShowCheckMark}
			<div
				class="absolute inset-0 flex items-center justify-center text-white p-1.5"
				data-testid="check-mark"
			>
				<CheckIcon />
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.uncheckedVariant {
		@apply border-gray;

		input {
			@apply bg-white border-gray;
		}
	}

	.checkedVariant {
		@apply border-thw;

		input {
			@apply bg-thw border-thw;
		}
	}

	.correctVariant {
	}

	.wrongVariant {
		@apply border-wrong text-wrong;
	}

	.isAnswerCorrect {
		input {
			@apply bg-correct border-correct;
		}

		&.correctVariant {
			@apply border-correct bg-correct-200;
		}
	}

	.isAnswerWrong {
		@apply line-through;

		input {
			@apply bg-wrong border-wrong;
		}
	}

	input[type='checkbox'] {
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
</style>
