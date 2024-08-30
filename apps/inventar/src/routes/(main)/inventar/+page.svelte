<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Tabs from '$lib/Tabs.svelte';
	import AddDevice from '$lib/inventar/AddDevice.svelte';
	import InventarBulkHistoryTab from '$lib/inventar/InventarBulkHistoryTab.svelte';
	import InventarListTab from '$lib/inventar/InventarListTab.svelte';
	import OrganizationTab from '$lib/inventar/OrganizationTab.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';

	export let data: PageData;

	enum Tab {
		INVENTORY_LIST = 'Inventarliste',
		BULK_HISTORY = 'Ausleihhistorie',
		ORGANIZATION = 'Organisation'
	}

	let selectedTab: Tab = Tab.INVENTORY_LIST;
	let lastHiddenTime: number | null = null;

	const invalidationThreshold = 2 * 60 * 1000; // 2 minutes

	function handleVisibilityChange() {
		if (document.hidden && !lastHiddenTime) {
			lastHiddenTime = Date.now();
			return;
		}

		if (!document.hidden && lastHiddenTime) {
			const timeElapsed = Date.now() - lastHiddenTime;
			if (timeElapsed > invalidationThreshold) {
				console.log('Invalidating data due to tab being hidden for too long');

				// Invalidate data if the tab was hidden for too long
				invalidateAll();
				lastHiddenTime = null;
			}
			return;
		}
	}

	onMount(() => {
		const tab = $page.url.searchParams.get('tab');
		if (tab) {
			selectedTab = tab as Tab;
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	onDestroy(() => {
		document.removeEventListener('visibilitychange', handleVisibilityChange);
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

{#if data.organisation}
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
			<OrganizationTab
				organisation={data.organisation}
				inventarItems={data.inventarItems}
				inventarItemEventBulks={data.inventarItemEventBulks}
			/>
		{:else}
			<InventarListTab items={data.inventarItems} />
		{/if}
	</div>
{:else}
	<div class="flex flex-col gap-4 p-4">
		<div class="text-center text-2xl font-bold">Du bist in keiner Organisation.</div>
		<div class="text-center text-lg">
			Lass dich per Einladungslink in eine bestehende Organisation einladen.
		</div>
	</div>
{/if}
