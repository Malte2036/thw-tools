<script lang="ts">
	import ShuffleIcon from '$lib/icons/ShuffleIcon.svelte';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';

	export let questionNumber: number;
	export let questionCount: number;
	export let gotoQuestionNumber: (newQuestionNumber: number) => void;

	function askForQuestionNumber() {
		const input = prompt('Enter a question number:', String(questionNumber));
		if (input === null) return;

		gotoQuestionNumber(Number.parseInt(input));
	}

	function toggleShuffle() {
		shuffleQuiz.set(!$shuffleQuiz);
	}
</script>

<h3 class="flex flex-row justify-center align-middle gap-1 text-gray-400 font-bold cursor-pointer">
	<div on:click={askForQuestionNumber} on:keydown={askForQuestionNumber}>
		{questionNumber}/{questionCount}
	</div>
	<div
		class="w-4 flex justify-center cursor-pointer"
		class:shuffle={$shuffleQuiz}
		on:click={toggleShuffle}
		on:keypress={toggleShuffle}
	>
		<ShuffleIcon />
	</div>
</h3>

<style lang="scss">
	.shuffle {
		@apply text-thw;
	}
</style>
