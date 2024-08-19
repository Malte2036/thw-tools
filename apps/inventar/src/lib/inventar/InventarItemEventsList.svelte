<script lang="ts">
	import { getInventarItemEvents } from '$lib/api/inventarApi';
	import Input from '$lib/Input.svelte';
	import {
		isSearchStringInInventarItemEvent,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from './inventarItem';
	import InventarItemEventItem from './InventarItemEventItem.svelte';

	export let deviceId: InventarItemDeviceId;
	export let scrollIntoViewOnDataChange: boolean = false;

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

		setTimeout(() => data.length != 0 && scrollIntoViewOnDataChange && scrollIntoView(), 0);
	}

	$: loadEvents(deviceId);

	const inventarItemEventsListElementId = 'inventar-item-events-list';
	const scrollIntoView = () => {
		const element = document.getElementById(inventarItemEventsListElementId);
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	};
</script>

<div class="flex flex-col gap-2 p-4" id={inventarItemEventsListElementId}>
	<h1 class="font-bold text-2xl">Ereignisse für {deviceId}:</h1>

	<Input placeholder="Filtere nach Ereignissen..." bind:inputValue={search} />

	<div class="flex flex-col gap-2">
		{#if events.length === 0}
			<p>Keine Ereignisse vorhanden.</p>
		{:else}
			{#each filteredEvents as event}
				<InventarItemEventItem {event} {deviceId} isSelected={false} click={() => {}} />
			{/each}
		{/if}
	</div>
</div>
