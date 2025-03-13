<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ShuffleIcon from '$lib/icons/ShuffleIcon.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import shuffleQuiz from '$lib/shared/stores/shuffleQuiz';
	import { trackEvent } from '$lib/utils';

	interface Props {
		questionNumber: number;
		questionCount: number;
		gotoQuestionNumber: (newQuestionNumber: number) => void;
	}

	let { questionNumber, questionCount, gotoQuestionNumber }: Props = $props();

	function askForQuestionNumber() {
		trackEvent('Open Select Question Number');

		const input = prompt('Enter a question number:', String(questionNumber));
		if (input === null) return;

		gotoQuestionNumber(Number.parseInt(input));
	}

	function toggleShuffle() {
		shuffleQuiz.set(!$shuffleQuiz);
		$bannerMessage = {
			message: $shuffleQuiz
				? 'Zufällige Reihenfolge des Fragebogens aktiviert.'
				: 'Zufällige Reihenfolge des Fragebogens deaktiviert.',
			autoDismiss: {
				duration: 5000
			}
		};
	}
</script>

<h3 class="flex flex-row justify-center items-center gap-2 text-gray-400 font-bold">
	<div onclick={askForQuestionNumber} onkeydown={askForQuestionNumber} class="cursor-pointer">
		{questionNumber}/{questionCount}
	</div>
	<Button
		secondary={!$shuffleQuiz}
		className="w-min"
		click={toggleShuffle}
		dataUmamiEvent="Shuffle Quiz Questions"
	>
		<div class="w-4 h-4 flex justify-center cursor-pointer" class:shuffle={!$shuffleQuiz}>
			<ShuffleIcon />
		</div>
	</Button>
</h3>

<style lang="scss">
	.shuffle {
		@apply text-thw;
	}
</style>
