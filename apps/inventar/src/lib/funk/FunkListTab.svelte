<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { funk, getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import { getOrganisationUserByInternalId, user } from '$lib/shared/stores/userStore';
	import { isSearchStringInFunkItem, type FunkItem, type FunkItemEvent } from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';
	import { eventTypeToFriendlyString } from '../api/funkModels';


	let searchedDeviceId = $state('');

	type FilteredData = {
		item: FunkItem;
		lastEvent: FunkItemEvent;
	};

	let borrowedItems = $state<FilteredData[]>([]);
	let availableItems = $state<FilteredData[]>([]);

	$effect(() => {
		if (!$funk) return;

		const filteredItems = $funk.funkItems
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

			
		// Split items into borrowed and available
		borrowedItems = filteredItems.filter((data) => data.lastEvent.type === 'borrowed');
		availableItems = filteredItems.filter((data) => data.lastEvent.type === 'returned');
	});
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Geräte suchen..." bind:inputValue={searchedDeviceId} />
	
	<!-- Borrowed Section -->
	<div class="flex flex-col gap-2">
		<h2 class="font-bold text-xl text-thw first-letter:uppercase">{eventTypeToFriendlyString('borrowed')} ({borrowedItems.length})</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
			{#if borrowedItems.length === 0}
				<p class="text-gray-500">Keine ausgeliehenen Geräte vorhanden.</p>
			{/if}
			{#each borrowedItems as data (data.item._id)}
				<InventarItemEventItem
					event={data.lastEvent}
					deviceId={data.item.deviceId}
					item={data.item}
					isSelected={false}
				/>
			{/each}
		</div>
	</div>

	<!-- Available Section -->
	<div class="flex flex-col gap-2">
		<h2 class="font-bold text-xl text-thw first-letter:uppercase">{eventTypeToFriendlyString('returned')} ({availableItems.length})</h2>
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
			{#if availableItems.length === 0}
				<p class="text-gray-500">Keine verfügbaren Geräte vorhanden.</p>
			{/if}
			{#each availableItems as data (data.item._id)}
				<InventarItemEventItem
					event={data.lastEvent}
					deviceId={data.item.deviceId}
					item={data.item}
					isSelected={false}
				/>
			{/each}
		</div>
	</div>
</div>
