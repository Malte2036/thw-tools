<script lang="ts">
	import { onMount } from 'svelte';
	import ShuffleIcon from '$lib/icons/ShuffleIcon.svelte';

	export let questionNumber: number;
	export let questionCount: number;
	export let gotoQuestionNumber: (newQuestionNumber: number) => void;

	function askForQuestionNumber() {
		const input = prompt('Enter a question number:', String(questionNumber));
		if (input === null) return;

		gotoQuestionNumber(Number.parseInt(input));
	}

	let shuffle: boolean = false;

	function toggleShuffle() {
		localStorage.setItem('shuffleQuiz', (!shuffle).toString());
		shuffle = !shuffle;
	}

	onMount(() => {
		if (import.meta.env.SSR === false) {
			// nur auf dem client
			shuffle = localStorage.getItem('shuffleQuiz') === 'false' ? false : true;
		}
	});
</script>

<h3 class="flex flex-row justify-center align-middle gap-1 text-gray-400 font-bold">
	<div on:click={askForQuestionNumber} on:keydown={askForQuestionNumber}>
		{questionNumber}/{questionCount}
	</div>
	<div
		class="w-4 flex justify-center"
		class:shuffle
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
