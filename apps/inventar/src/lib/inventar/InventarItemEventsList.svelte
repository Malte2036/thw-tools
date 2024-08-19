<script lang="ts">
	import {
		eventTypeToEmoji,
		eventTypeToFriendlyString,
		userToFriendlyString,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from './inventarItem';
	import { getInventarItemEvents } from '$lib/api/inventarApi';
	import Table from '$lib/Table.svelte';

	export let deviceId: InventarItemDeviceId;
	export let scrollIntoViewOnDataChange: boolean = false;

	let events: InventarItemEvent[] = [];

	async function loadEvents(deviceId: InventarItemDeviceId) {
		events = [];

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

	<div class="flex flex-col gap-2">
		{#if events.length === 0}
			<p>Keine Ereignisse vorhanden.</p>
		{:else}
			<Table
				header={['', 'status', 'aktion von', 'aktion am']}
				values={events.map((event) => [
					eventTypeToEmoji(event.type),
					eventTypeToFriendlyString(event.type),
					userToFriendlyString(event.user),
					new Date(event.date).toLocaleString('de-DE')
				])}
			/>
		{/if}
	</div>
</div>
