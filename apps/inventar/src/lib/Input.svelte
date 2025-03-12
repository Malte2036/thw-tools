<script lang="ts">
	import type { FormEventHandler, HTMLInputAttributes } from 'svelte/elements';




	interface Props {
		inputValue: string;
		onInput?: FormEventHandler<HTMLInputElement>;
		label?: string | undefined;
		placeholder?: string | undefined;
		type?: HTMLInputAttributes['type'];
		inputmode?: HTMLInputAttributes['inputmode'];
		pattern?: string | undefined;
	}

	let {
		inputValue = $bindable(),
		onInput = () => {},
		label = undefined,
		placeholder = undefined,
		type = 'text',
		inputmode = 'text',
		pattern = undefined
	}: Props = $props();
</script>

<div class="flex flex-col gap-1">
	{#if label !== undefined}
		<label class="font-bold" for="inputField">{label}</label>
	{/if}

	<input
		class="border border-black rounded-lg py-1 px-2"
		id="inputField"
		{...{ type }}
		{...{ inputmode }}
		bind:value={inputValue}
		oninput={onInput}
		{placeholder}
		{pattern}
	/>
</div>
