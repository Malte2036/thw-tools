<script lang="ts">
	import { getInventarItemEvents } from '$lib/api/inventarApi';
	import Input from '$lib/Input.svelte';
	import {
		isSearchStringInInventarItemEvent,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from '../api/inventarItem';
	import InventarItemEventItem from './InventarItemEventItem.svelte';

	export let deviceId: InventarItemDeviceId;

	let events: InventarItemEvent[] = [];
	let filteredEvents: InventarItemEvent[] = [];

	let search = '';
	$: {
		filteredEvents = events.filter((event) => isSearchStringInInventarItemEvent(search, event));
	}

	async function loadEvents(deviceId: InventarItemDeviceId) {
		events = [];
		search = '';

		const data = await getInventarItemEvents(deviceId);

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
