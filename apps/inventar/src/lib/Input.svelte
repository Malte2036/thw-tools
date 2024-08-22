<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	export let inputValue: string;

	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;

	export let type: HTMLInputAttributes['type'] = 'text';

	export let pattern: string | undefined = undefined;
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
		{pattern}
	/>
</div>
