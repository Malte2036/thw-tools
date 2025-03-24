<script lang="ts" generics="T">
	import { onMount } from 'svelte';

	type TabItem<T> = {
		key: T;
		label: string;
	};

	let { 
		items = [],
		onSelect,
		initialSelected = undefined 
	} = $props<{
		items: Array<TabItem<T>>;
		onSelect: (selected: T) => void;
		initialSelected?: T | undefined;
	}>();

	let tabs: HTMLElement = $state() as HTMLElement;

	const onSelectFunction = (selectedLabel: string): void => {
		const selected = getKeyFromLabel(selectedLabel);
		if (!selected) {
			throw new Error('Selected tab not found');
		}

		onSelect(selected);
	};

	onMount(() => {
		// Define the onSelect function
		if (tabs) {
			(tabs as any).onSelect = onSelectFunction;
		}
	});

	const getKeyFromLabel = (label: string): T | undefined => {
		return items.find((item: TabItem<T>) => item.label === label)?.key;
	};

	const getLabelFromKey = (key: T | undefined): string | undefined => {
		return items.find((item: TabItem<T>) => item.key === key)?.label;
	};

	let tabsItems = $derived(items.map((item: TabItem<T>) => item.label));
</script>

<thw-tabs bind:this={tabs} items={tabsItems} initialSelected={getLabelFromKey(initialSelected)}
></thw-tabs> 