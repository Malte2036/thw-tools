<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { funk, getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import { getOrganisationUserByInternalId, user } from '$lib/shared/stores/userStore';
	import { isSearchStringInFunkItem, type FunkItem, type FunkItemEvent } from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';

	let searchedDeviceId: string = '';

	type FilteredData = {
		item: FunkItem;
		lastEvent: FunkItemEvent;
	};
	let filteredInventarItems: FilteredData[] = [];
	$: $funk && filterInventarItems();

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
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-2xl">Inventarliste:</div>
	<Input placeholder="Geräte suchen..." bind:inputValue={searchedDeviceId} />
	<div class="flex flex-col gap-2">
		{#if filteredInventarItems.length === 0}
			<p>Keine Geräte vorhanden.</p>
		{/if}
		{#each filteredInventarItems as data}
			<InventarItemEventItem
				event={data.lastEvent}
				deviceId={data.item.deviceId}
				item={data.item}
				isSelected={false}
			/>
		{/each}
	</div>
</div>
