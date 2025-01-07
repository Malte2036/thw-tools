<script lang="ts">
	import { marked } from 'marked';
	import { streamAskAiKnowledgeBase } from '$lib/api/apiAi';
	import Button from '$lib/Button.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { writable } from 'svelte/store';
	import DOMPurify from 'dompurify';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';

	let input = '';
	let isLoading = false;

	interface Message {
		role: 'user' | 'assistant';
		content: string;
	}

	let messages: Message[] = [];
	const streamedResponse = writable('');
	let fetchStream: Promise<ReadableStream<string>>;

	function adjustTextareaHeight(event: Event) {
		const textarea = event.target as HTMLTextAreaElement;
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	async function ask() {
		if (!input.trim() || isLoading) return;

		isLoading = true;
		const userMessage = input.trim();
		messages = [...messages, { role: 'user', content: userMessage }];
		input = '';
		streamedResponse.set('');

		try {
			fetchStream = streamAskAiKnowledgeBase(userMessage);
			messages = [...messages, { role: 'assistant', content: '' }];

			const stream = await fetchStream;
			const reader = stream.getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				streamedResponse.update((current: string) => {
					const newContent = current + value;
					messages[messages.length - 1].content = newContent;
					return newContent;
				});
			}
		} catch (error) {
			console.error('Error:', error);
		} finally {
			isLoading = false;
		}
	}

	function clearConversation() {
		messages = [];
		streamedResponse.set('');
		input = '';
	}
</script>

<div class="flex flex-col h-full max-w-4xl mx-auto p-4">
	<div class="flex flex-col gap-4 flex-grow bg-thw-100 rounded-lg p-4">
		<div class="flex justify-between items-center">
			<h1 class="text-2xl font-bold">THW Knowledge Base</h1>
			{#if messages.length > 0}
				<Button click={clearConversation} secondary size="small">Clear Conversation</Button>
			{/if}
		</div>

		<div class="text-gray-600 bg-white/50 p-4 rounded-lg">
			<div>
				Die Knowledge Base enthält aktuell:
				<ul class="list-disc ml-6 mt-2">
					<li>Ausbildungsunterlagen der <span class="font-bold">Grundausbildung</span></li>
					<li>Bereichsausbildung <span class="font-bold">AGT</span></li>
					<li>Bereichsausbildung <span class="font-bold">CBRN</span></li>
				</ul>
			</div>
			<div class="mt-2 space-y-2 text-sm">
				<p class="italic">
					Bitte formulieren Sie Ihre Fragen so präzise wie möglich. Es wird keine Garantie für die
					Richtigkeit der Antworten übernommen.
				</p>
				<p class="text-thw-600">
					<strong>Wichtig:</strong> Jede Frage wird einzeln beantwortet. Der Kontext vorheriger Fragen
					und Antworten wird nicht berücksichtigt.
				</p>
			</div>
		</div>

		<div class="flex-grow overflow-y-auto">
			{#if messages.length === 0}
				<div class="text-center text-gray-500 mt-8">Stellen Sie eine Frage, um zu beginnen</div>
			{:else}
				<div class="flex flex-col gap-4">
					{#each messages as message}
						<div class="flex flex-col {message.role === 'user' ? 'items-end' : 'items-start'}">
							<div
								class="max-w-[80%] p-4 rounded-lg {message.role === 'user'
									? 'bg-thw-600 text-white'
									: 'bg-white'}"
							>
								{#if message.role === 'assistant'}
									<div class="markdown prose">
										{#await marked(message.content) then markedResponse}
											{@html DOMPurify.sanitize(markedResponse)}
										{/await}
									</div>
								{:else}
									{message.content}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<div class="relative">
				<textarea
					bind:value={input}
					placeholder="Stellen Sie Ihre Frage..."
					class="w-full border border-black rounded-lg py-2 px-3 resize-none overflow-hidden min-h-[38px]"
					rows="1"
					on:input={adjustTextareaHeight}
				/>
			</div>
			<div class="flex gap-2">
				<Button click={ask} disabled={isLoading || !input.trim()} size="medium">
					<div class="h-6 flex items-center justify-center">
						{#if isLoading}
							<LoadingSpinner />
						{:else}
							Frage stellen
						{/if}
					</div>
				</Button>
			</div>
		</div>
	</div>
</div>

<style>
	.markdown {
		line-height: 1.6;
	}
	.markdown :global(p) {
		margin-bottom: 1em;
	}
	.markdown :global(ul) {
		list-style-type: disc;
		margin-left: 1.5em;
		margin-bottom: 1em;
	}
	.markdown :global(ol) {
		list-style-type: decimal;
		margin-left: 1.5em;
		margin-bottom: 1em;
	}
	.markdown :global(pre) {
		background-color: #f3f4f6;
		padding: 1em;
		border-radius: 0.5em;
		overflow-x: auto;
		margin-bottom: 1em;
	}
	.markdown :global(code) {
		font-family: monospace;
		background-color: #f3f4f6;
		padding: 0.2em 0.4em;
		border-radius: 0.25em;
	}
</style>
