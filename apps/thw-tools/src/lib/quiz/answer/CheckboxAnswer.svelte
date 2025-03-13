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
	let isUncheckedVariant = $derived(
		!checked && (!revealAnswers || (!answer.isCorrect && revealAnswers))
	);
	let isCorrectVariant = $derived(revealAnswers && checked && answer.isCorrect);
	let isWrongVariant = $derived(
		revealAnswers && ((checked && !answer.isCorrect) || (!checked && answer.isCorrect))
	);

	let shouldShowCheckMark = $derived((revealAnswers && answer.isCorrect) || isCheckedVariant);
	let shouldShowXMark = $derived(revealAnswers && !answer.isCorrect);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	data-testid="answer-container"
	class="transition-colors hover:cursor-pointer flex justify-between p-2 items-center rounded-lg border-2 border-gray text-xl"
	class:checkedVariant={isCheckedVariant}
	class:uncheckedVariant={isUncheckedVariant}
	class:correctVariant={isCorrectVariant}
	class:wrongVariant={isWrongVariant}
	class:isAnswerCorrect={revealAnswers && answer.isCorrect}
	class:isAnswerWrong={revealAnswers && !answer.isCorrect}
	onclick={() => {
		changeCheckedCallback(!checked);
	}}
>
	<div>{answer.text}</div>
	<div class="relative w-6 h-6 aspect-square">
		<label
			class="absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 whitespace-nowrap border-0"
			for="answer-checkbox"
		>
			Select answer: {answer.text}
		</label>
		<input
			id="answer-checkbox"
			type="checkbox"
			bind:checked
			aria-label="Select answer: {answer.text}"
			class="absolute top-0 left-0 w-full h-full rounded-full border-gray border-2 appearance-none flex-shrink-0 cursor-pointer"
		/>
		{#if shouldShowXMark}
			<div
				class="absolute inset-0 flex items-center justify-center text-white p-1.5"
				data-testid="x-mark"
				aria-hidden="true"
			>
				<!-- Safari requires explicit wrapper with dimensions for SVG in flex containers -->
				<div class="w-[12px] h-[16px]">
					<XMarkIcon />
				</div>
			</div>
		{/if}
		{#if shouldShowCheckMark}
			<div
				class="absolute inset-0 flex items-center justify-center text-white p-1.5"
				data-testid="check-mark"
				aria-hidden="true"
			>
				<!-- Safari requires explicit wrapper with dimensions for SVG in flex containers -->
				<div class="w-full h-full">
					<CheckIcon />
				</div>
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
</style>
