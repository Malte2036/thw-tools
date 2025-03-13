<script lang="ts">
	import { createBubbler } from 'svelte/legacy';

	const bubble = createBubbler();
	interface Props {
		checked?: boolean;
		label?: string;
		icon?: any;
	}

	let { checked = $bindable(false), label = '', icon = undefined }: Props = $props();
</script>

<label class="flex items-center gap-4 cursor-pointer">
	{#if icon}
		{@const SvelteComponent = icon}
		<div class="w-6 h-6">
			<SvelteComponent />
		</div>
	{/if}
	<div class="flex items-center">
		<input type="checkbox" bind:checked class="sr-only peer" onchange={bubble('change')} />
		<div
			class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-thw-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-thw-500"
		></div>
		{#if label}
			<span class="ms-3">{label}</span>
		{/if}
	</div>
</label>
