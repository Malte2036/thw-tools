<script lang="ts">
	export let questionNumber: number;
	export let questionCount: number;
	export let gotoQuestionNumber: (newQuestionNumber: number) => void;

	function askForQuestionNumber() {
		const input = prompt('Enter a question number:', String(questionNumber));
		if (input === null) return;

		gotoQuestionNumber(Number.parseInt(input));
	}
</script>

<h3
	class="flex flex-row justify-center text-gray-400 font-bold"
	on:click={askForQuestionNumber}
	on:keydown={askForQuestionNumber}
>
	{questionNumber}/{questionCount}
</h3>
