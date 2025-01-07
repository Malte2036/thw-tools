<script lang="ts">
	import type { QuestionAnswer } from '$lib/model/question';

	export let answer: QuestionAnswer;
	export let checked: boolean;
	export let revealAnswers: boolean;
	export let changeCheckedCallback: (value: boolean) => void;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="text-xl flex flex-row items-center p-2 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors hover:cursor-pointer"
	class:checked
	class:revealAnswerCorrect={revealAnswers && answer.isCorrect}
	class:revealAnswerWrong={revealAnswers && checked != answer.isCorrect}
	on:click={() => {
		changeCheckedCallback(!checked);
		checked = !checked;
	}}
>
	<input type="checkbox" bind:checked />
	<div>{answer.text}</div>
</div>

<style lang="scss">
	.checked {
		@apply bg-thw-300;
	}
	.revealAnswerCorrect {
		@apply bg-[#EEE648];
	}
	.revealAnswerWrong {
		@apply text-red-600 border border-red-600 border-dashed;
	}
</style>
