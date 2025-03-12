<script lang="ts">
	import Input from '$lib/Input.svelte';
	import { funk, getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
	import { getOrganisationMemberByInternalId, user } from '$lib/shared/stores/userStore';
	import {
		eventTypeToFriendlyString,
		isSearchStringInFunkItem,
		type FunkItem,
		type FunkItemEvent
	} from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';

	let searchedDeviceId = $state('');
	let isBorrowedExpanded = $state(true);
	let isAvailableExpanded = $state(true);

	type FilteredData = {
		item: FunkItem;
		lastEvent: FunkItemEvent;
	};

	let filteredItems = $derived(
		$funk?.funkItems
			?.map((item) => {
				const lastFunkItemEvent = getLastFunkItemEventByFunkItemInternalId($funk, item.id);
				if (!lastFunkItemEvent) return null;
				return {
					item,
					lastEvent: lastFunkItemEvent
				} satisfies FilteredData;
			})
			.filter((data): data is FilteredData => !!data)
			.filter((data) =>
				isSearchStringInFunkItem(
					searchedDeviceId,
					data.item,
					data.lastEvent,
					getOrganisationMemberByInternalId($user, data.lastEvent.userId)?.user
				)
			) ?? []
	);

	let borrowedItems = $derived(filteredItems.filter((data) => data?.lastEvent.type === 'borrowed'));
	let availableItems = $derived(
		filteredItems.filter((data) => data?.lastEvent.type === 'returned')
	);
</script>

<div class="flex flex-col gap-4">
	<Input placeholder="Geräte suchen..." bind:inputValue={searchedDeviceId} />

	<!-- Borrowed Section -->
	<div class="flex flex-col gap-2">
		<button
			class="flex items-center gap-2 w-fit"
			onclick={() => (isBorrowedExpanded = !isBorrowedExpanded)}
		>
			<h2 class="font-bold text-xl text-thw first-letter:uppercase">
				{eventTypeToFriendlyString('borrowed')} ({borrowedItems.length} / {filteredItems.length})
			</h2>
			<svg
				class="w-6 h-6 transform transition-transform {isBorrowedExpanded ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		{#if isBorrowedExpanded}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
				{#if borrowedItems.length === 0}
					<p class="text-gray-500">Keine ausgeliehenen Geräte vorhanden.</p>
				{/if}
				{#each borrowedItems as data (data?.item?.id)}
					<InventarItemEventItem
						event={data?.lastEvent}
						deviceId={data?.item?.deviceId}
						item={data?.item}
						isSelected={false}
					/>
				{/each}
			</div>
		{/if}
	</div>

	<!-- Available Section -->
	<div class="flex flex-col gap-2">
		<button
			class="flex items-center gap-2 w-fit"
			onclick={() => (isAvailableExpanded = !isAvailableExpanded)}
		>
			<h2 class="font-bold text-xl text-thw first-letter:uppercase">
				{eventTypeToFriendlyString('returned')} ({availableItems.length} / {filteredItems.length})
			</h2>
			<svg
				class="w-6 h-6 transform transition-transform {isAvailableExpanded ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</button>
		{#if isAvailableExpanded}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-2">
				{#if availableItems.length === 0}
					<p class="text-gray-500">Keine verfügbaren Geräte vorhanden.</p>
				{/if}
				{#each availableItems as data (data.item.id)}
					<InventarItemEventItem
						event={data.lastEvent}
						deviceId={data.item.deviceId}
						item={data.item}
						isSelected={false}
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
