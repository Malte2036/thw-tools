<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Tabs from '$lib/Tabs.svelte';
	import AddDevice from '$lib/inventar/AddDevice.svelte';
	import InventarBulkHistoryTab from '$lib/inventar/InventarBulkHistoryTab.svelte';
	import InventarListTab from '$lib/inventar/InventarListTab.svelte';
	import OrganizationTab from '$lib/inventar/OrganizationTab.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	enum Tab {
		INVENTORY_LIST = 'Inventarliste',
		BULK_HISTORY = 'Ausleihhistorie',
		ORGANIZATION = 'Organisation'
	}

	let selectedTab: Tab = Tab.INVENTORY_LIST;

	onMount(() => {
		const tab = $page.url.searchParams.get('tab');
		if (tab) {
			selectedTab = tab as Tab;
		}
	});

	const onTabSelect = (selected: string) => {
		selectedTab = selected as Tab;

		if (selectedTab === Tab.INVENTORY_LIST) {
			$page.url.searchParams.delete('tab');
		} else {
			$page.url.searchParams.set('tab', selected);
		}
		goto(`?${$page.url.searchParams.toString()}`);
	};
</script>

<div class="flex flex-col gap-4 p-4">
	<AddDevice inventarItems={data.inventarItems} reset={invalidateAll} />

	<div class="flex w-full justify-center">
		<Tabs
			items={Object.values(Tab)}
			onSelect={onTabSelect}
			initialSelected={$page.url.searchParams.get('tab') ?? undefined}
		/>
	</div>

	{#if selectedTab === Tab.BULK_HISTORY}
		<InventarBulkHistoryTab
			bulks={data.inventarItemEventBulks}
			inventarItems={data.inventarItems}
		/>
	{:else if selectedTab === Tab.ORGANIZATION}
		<OrganizationTab organisation={data.organisation} />
	{:else}
		<InventarListTab items={data.inventarItems} />
	{/if}
</div>
