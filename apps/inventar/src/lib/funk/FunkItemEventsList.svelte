<script lang="ts">
	import { getFunkItemEvents } from '$lib/api/funkApi';
	import Input from '$lib/Input.svelte';
	import {
		isSearchStringInFunkItemEvent,
		type FunkItemDeviceId,
		type FunkItemEvent
	} from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';

	export let deviceId: FunkItemDeviceId;

	let events: FunkItemEvent[] = [];
	let filteredEvents: FunkItemEvent[] = [];

	let search = '';
	$: {
		filteredEvents = events.filter((event) => isSearchStringInFunkItemEvent(search, event));
	}

	async function loadEvents(deviceId: FunkItemDeviceId) {
		events = [];
		search = '';

		const data = await getFunkItemEvents(deviceId);

		data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		events = data;
	}

	$: loadEvents(deviceId);
</script>

<div class="flex flex-col gap-2">
	<h1 class="font-bold text-2xl">Ereignisse für {deviceId}:</h1>

	<Input placeholder="Filtere nach Ereignissen..." bind:inputValue={search} />

	<div class="flex flex-col gap-2">
		{#if events.length === 0}
			<p>Keine Ereignisse vorhanden.</p>
		{:else}
			{#each filteredEvents as event}
				<InventarItemEventItem
					{event}
					{deviceId}
					item={undefined}
					isSelected={false}
					click={() => {}}
					secondary
				/>
			{/each}
		{/if}
	</div>
</div>
