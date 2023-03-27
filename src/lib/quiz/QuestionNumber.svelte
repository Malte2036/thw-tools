<script lang="ts">
	export let questionNumber: number;
	export let questionCount: number;
	export let gotoQuestionNumber: (newQuestionNumber: number) => void;

	function askForQuestionNumber() {
		const newQuestionNumber = Number.parseInt(
			prompt('Enter a question number:', String(questionNumber)) ?? ''
		);

		gotoQuestionNumber(newQuestionNumber);
	}
</script>

<h3 class="flex flex-row justify-center text-gray-400 font-bold" on:click={askForQuestionNumber}>
	{questionNumber}/{questionCount}
</h3>
