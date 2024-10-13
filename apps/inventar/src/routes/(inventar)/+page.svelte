<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Tabs from '$lib/Tabs.svelte';
	import AddDevice from '$lib/funk/AddDevice.svelte';
	import FunkBulkHistoryTab from '$lib/funk/FunkBulkHistoryTab.svelte';
	import FunkListTab from '$lib/funk/FunkListTab.svelte';
	import OrganizationTab from '$lib/funk/OrganizationTab.svelte';
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import NoOrganisation from '$lib/funk/NoOrganisation.svelte';

	export let data: PageData;

	enum Tab {
		FUNK_LIST = 'Funkliste',
		BULK_HISTORY = 'Ausleihhistorie',
		ORGANIZATION = 'Organisation'
	}

	let selectedTab: Tab = Tab.FUNK_LIST;
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

	const isBrowser = typeof window !== 'undefined';

	onMount(() => {
		if (!isBrowser) return;

		const tab = $page.url.searchParams.get('tab');
		if (tab) {
			selectedTab = tab as Tab;
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	onDestroy(() => {
		if (!isBrowser) return;

		document.removeEventListener('visibilitychange', handleVisibilityChange);
	});

	const onTabSelect = (selected: string) => {
		selectedTab = selected as Tab;

		if (selectedTab === Tab.FUNK_LIST) {
			$page.url.searchParams.delete('tab');
		} else {
			$page.url.searchParams.set('tab', selected);
		}
		goto(`?${$page.url.searchParams.toString()}`);
	};
</script>

{#if data.organisation}
	<div class="flex flex-col gap-4 p-4">
		<AddDevice items={data.funkItems} reset={invalidateAll} />

		<div class="flex w-full justify-center">
			<Tabs
				items={Object.values(Tab)}
				onSelect={onTabSelect}
				initialSelected={$page.url.searchParams.get('tab') ?? undefined}
			/>
		</div>

		{#if selectedTab === Tab.BULK_HISTORY}
			<FunkBulkHistoryTab bulks={data.funkItemEventBulks} funkItems={data.funkItems} />
		{:else if selectedTab === Tab.ORGANIZATION}
			<OrganizationTab
				organisation={data.organisation}
				funkItems={data.funkItems}
				funkItemEventBulks={data.funkItemEventBulks}
			/>
		{:else}
			<FunkListTab items={data.funkItems} />
		{/if}
	</div>
{:else}
	<NoOrganisation />
{/if}
