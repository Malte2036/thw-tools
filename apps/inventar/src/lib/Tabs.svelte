<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		items: string[];
		onSelect: (selected: string) => void;
		initialSelected?: string | undefined;
	}

	let { items, onSelect, initialSelected = undefined }: Props = $props();

	let tabs: HTMLElement = $state();

	onMount(() => {
		// Define the onSelect function
		if (tabs) {
			(tabs as any).onSelect = onSelect;
		}
	});
</script>

<thw-tabs bind:this={tabs} {items} {initialSelected}></thw-tabs>
