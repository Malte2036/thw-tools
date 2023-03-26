<script lang="ts">
	import type { Answer } from '../question/Question';

	export let answer: Answer;
	export let revealAnswers: boolean;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="text-xl flex flex-row p-2 gap-2 bg-thw-50 border shadow-sm rounded-2xl transition-colors hover:cursor-pointer"
	class:checked={answer.checked}
	class:revealAnswerCorrect={revealAnswers && answer.correct}
	class:revealAnswerWrong={revealAnswers && answer.checked != answer.correct}
	on:click={() => (answer.checked = !answer.checked)}
>
	<input type="checkbox" bind:checked={answer.checked} />
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
