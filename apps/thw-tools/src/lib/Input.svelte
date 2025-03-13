<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';



	interface Props {
		inputValue: string;
		label?: string | undefined;
		placeholder?: string | undefined;
		type?: HTMLInputAttributes['type'];
	}

	let {
		inputValue = $bindable(),
		label = undefined,
		placeholder = undefined,
		type = 'text'
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
		bind:value={inputValue}
		{placeholder}
	/>
</div>
