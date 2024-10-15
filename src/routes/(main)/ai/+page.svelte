<script lang="ts">
	import { marked } from 'marked';
	import { askAiKnowledgeBase, type AiKnowledgeBaseAskApiResponse } from '$lib/api/apiAi';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';

	let input = '';

	let response: Promise<AiKnowledgeBaseAskApiResponse> | null = null;

	async function ask() {
		response = askAiKnowledgeBase(input);
	}
</script>

<div class="flex flex-col content-between p-4 h-full">
	<div class="flex flex-col gap-4 flex-grow bg-thw-100 rounded-lg p-2">
		<h1 class="text-2xl font-bold">Ask Knowledge Base</h1>

		<Input bind:inputValue={input} placeholder="Ask AI" />

		<Button click={ask}>Ask</Button>

		{#await response}
			<LoadingSpinner />
		{:then data}
			{#if data}
				<div class="text-lg font-bold">Ergebniss aus der Knowledge Base:</div>
				<div>
					{@html marked(data.answer)}
				</div>
			{:else}
				<p>Ask a question to AI</p>
			{/if}
		{:catch error}
			<p>Error: {error.message}</p>
		{/await}
	</div>
</div>
