<script lang="ts">
	import { run } from 'svelte/legacy';

	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { funk, getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import { getOrganisationUserByInternalId, user } from '$lib/shared/stores/userStore';
	import { isSearchStringInFunkItem, type FunkItem, type FunkItemEvent } from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';

	let searchedDeviceId: string = $state('');

	type FilteredData = {
		item: FunkItem;
		lastEvent: FunkItemEvent;
	};
	let filteredInventarItems: FilteredData[] = $state([]);

	const filterInventarItems = () => {
		filteredInventarItems = $funk.funkItems
			?.map((item) => {
				const lastFunkItemEvent = getLastFunkItemEventByFunkItemInternalId($funk, item._id);
				if (!lastFunkItemEvent) return null;

				return {
					item: item,
					lastEvent: lastFunkItemEvent
				} satisfies FilteredData;
			})
			.filter((data) => {
				if (!data || !data.lastEvent) return false;

				return isSearchStringInFunkItem(
					searchedDeviceId,
					data.item,
					data.lastEvent,
					getOrganisationUserByInternalId($user, data.lastEvent.user)
				);
			}) as FilteredData[];
	};
	run(() => {
		$funk && (searchedDeviceId || true) && filterInventarItems();
	});
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-2xl">Funkliste:</div>
	<Input placeholder="Geräte suchen..." bind:inputValue={searchedDeviceId} />
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
		{#if filteredInventarItems.length === 0}
			<p>Keine Geräte vorhanden.</p>
		{/if}
		{#each filteredInventarItems as data (data.item._id)}
			<InventarItemEventItem
				event={data.lastEvent}
				deviceId={data.item.deviceId}
				item={data.item}
				isSelected={false}
			/>
		{/each}
	</div>
</div>
