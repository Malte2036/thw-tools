<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import ErrorState from '$lib/ErrorDisplay.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import Tabs from '$lib/Tabs.svelte';
	import AddDevice from '$lib/funk/AddDevice.svelte';
	import FunkBulkHistoryTab from '$lib/funk/FunkBulkHistoryTab.svelte';
	import FunkListTab from '$lib/funk/FunkListTab.svelte';
	import NoOrganisation from '$lib/funk/NoOrganisation.svelte';
	import FunkAdvancedTab from '$lib/funk/FunkAdvancedTab.svelte';
	import { funk } from '$lib/shared/stores/funkStore';
	import { user } from '$lib/shared/stores/userStore';
	import { onDestroy, onMount } from 'svelte';

	const tabs = {
		funkList: 'Funkgeräte',
		bulkHistory: 'Ausleihhistorie',
		advanced: 'Erweitert'
	} as const;

	type FunkTab = keyof typeof tabs;
	type FunkTabValue = (typeof tabs)[FunkTab];

	let selectedTab: FunkTab = $state('funkList');
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
			selectedTab = tab as FunkTab;
		}

		document.addEventListener('visibilitychange', handleVisibilityChange);
	});

	onDestroy(() => {
		if (!isBrowser) return;

		document.removeEventListener('visibilitychange', handleVisibilityChange);
	});

	const onTabSelect = (selected: FunkTab) => {
		selectedTab = selected;

		if (selectedTab === 'funkList') {
			$page.url.searchParams.delete('tab');
		} else {
			$page.url.searchParams.set('tab', selected);
		}
		goto(`?${$page.url.searchParams.toString()}`);
	};
</script>

{#await $user.fetching}
	<LoadingSpinner />
{:then}
	<div class="flex flex-col gap-4 p-4">
		<AddDevice reset={invalidateAll} />

		<div class="flex w-full justify-center">
			<Tabs
				items={Object.entries(tabs).map(([key, value]) => ({
					key: key as FunkTab,
					label: value as FunkTabValue
				}))}
				onSelect={onTabSelect}
				initialSelected={($page.url.searchParams.get('tab') as FunkTab) ?? undefined}
			/>
		</div>

		{#await $funk.fetching}
			<LoadingSpinner />
		{:then}
			{#if selectedTab === 'bulkHistory'}
				<FunkBulkHistoryTab />
			{:else if selectedTab === 'advanced'}
				<FunkAdvancedTab />
			{:else}
				<FunkListTab />
			{/if}
		{:catch error}
			<ErrorState
				label="Beim Abrufen der Funkgeräte aus der Datenbank ist leider ein Fehler aufgetreten."
				{error}
			/>
		{/await}
	</div>
{:catch error}
	{#if error.status === 404}
		<NoOrganisation />
	{:else}
		<div class="p-2">
			<ErrorState
				label="Beim Abrufen der Organisation aus der Datenbank ist leider ein Fehler aufgetreten."
				{error}
			/>
		</div>
	{/if}
{/await}
