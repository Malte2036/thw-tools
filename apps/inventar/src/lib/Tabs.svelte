<script lang="ts">
	import { onMount } from 'svelte';

	export let items: string[];
	export let onSelect: (selected: string) => void;
	export let initialSelected: string | undefined = undefined;

	let tabs: HTMLElement;

	onMount(() => {
		// Define the onSelect function
		if (tabs) {
			(tabs as any).onSelect = onSelect;
		}
	});
</script>

<thw-tabs bind:this={tabs} {items} {initialSelected} />
