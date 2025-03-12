<script lang="ts" generics="T">
	import { onMount } from 'svelte';

	interface Props {
		items: { key: T; label: string }[];
		onSelect: (selected: T) => void;
		initialSelected?: T | undefined;
	}

	let { items, onSelect, initialSelected = undefined }: Props = $props();

	let tabs: HTMLElement = $state() as HTMLElement;

	const onSelectFunction = (selectedLabel: string) => {
		const selected = getKeyFromLabel(selectedLabel);
		if (!selected) {
			throw new Error('Selected tab not found');
		}

		return onSelect(selected);
	};

	onMount(() => {
		// Define the onSelect function
		if (tabs) {
			(tabs as any).onSelect = onSelectFunction;
		}
	});

	const getKeyFromLabel = (label: string) => {
		return items.find((item) => item.label === label)?.key;
	};

	const getLabelFromKey = (key: T | undefined) => {
		return items.find((item) => item.key === key)?.label;
	};

	let tabsItems = items.map((item) => item.label);
</script>

<thw-tabs bind:this={tabs} items={tabsItems} initialSelected={getLabelFromKey(initialSelected)}
></thw-tabs>
