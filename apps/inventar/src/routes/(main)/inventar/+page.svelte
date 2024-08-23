<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Tabs from '$lib/Tabs.svelte';
	import AddDevice from '$lib/inventar/AddDevice.svelte';
	import InventarListTab from '$lib/inventar/InventarListTab.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	enum Tab {
		INVENTORY_LIST = 'Inventarliste',
		BULK_HISTORY = 'Ausleihhistorie'
	}

	let selectedTab: Tab = Tab.INVENTORY_LIST;

	const onTabSelect = (selected: string) => {
		selectedTab = selected as Tab;
	};
</script>

<div class="flex flex-col gap-4 p-4">
	<AddDevice inventarItems={data.inventarItems} reset={invalidateAll} />

	<div class="flex w-full justify-center">
		<Tabs items={Object.values(Tab)} onSelect={onTabSelect} />
	</div>

	{#if selectedTab === Tab.BULK_HISTORY}
		<div class="font-bold text-2xl">Historie:</div>
	{/if}

	{#if selectedTab === Tab.INVENTORY_LIST}
		<InventarListTab items={data.inventarItems} />
	{/if}
</div>
