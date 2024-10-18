<script lang="ts">
	import { marked } from 'marked';
	import { streamAskAiKnowledgeBase } from '$lib/api/apiAi';
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { writable } from 'svelte/store';
	import DOMPurify from 'dompurify';

	let input = '';

	const streamedResponse = writable(''); // Store to accumulate streamed data

	let fetchStream: Promise<ReadableStream<string>>;

	async function ask() {
		streamedResponse.set(''); // Clear any previous content

		fetchStream = streamAskAiKnowledgeBase(input);
		fetchStream.then(async (stream) => {
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				// Decode and append each chunk to the store
				streamedResponse.update((current: string) => current + value);
			}
		});
	}
</script>

<div class="flex flex-col content-between p-4 h-full">
	<div class="flex flex-col gap-4 flex-grow bg-thw-100 rounded-lg p-2">
		<h1 class="text-2xl font-bold">Ask Knowledge Base</h1>
		<div class="text-gray-500">
			Aktuell ist die Knowledge Base mit den Ausbildungsunterlagen der <i class="font-bold"
				>Grundausbildung</i
			>
			und den Bereichsausbildungen <i class="font-bold">AGT</i> und <i class="font-bold">CBRN</i> gefüllt.
			Es wird empfohlen, die Fragen so präzise wie möglich zu formulieren und es wird auf keinerlei Richtigkeit
			der Antworten garantiert.
		</div>

		<Input bind:inputValue={input} placeholder="Ask AI" />

		<Button click={ask}>Ask</Button>

		{#await fetchStream}
			<LoadingSpinner />
		{:then}
			{#if $streamedResponse}
				<div class="flex flex-col gap-2">
					<div class="text-lg font-bold">Ergebniss aus der Knowledge Base:</div>
					<div class="markdown">
						{#await marked($streamedResponse) then markedResponse}
							{@html DOMPurify.sanitize(markedResponse)}
						{/await}
					</div>
				</div>
			{/if}
		{:catch error}
			<p>Error: {error.message}</p>
		{/await}
	</div>
</div>
