<script lang="ts">
	import {
		eventTypeToFriendlyString,
		userToFriendlyString,
		type InventarItemDeviceId,
		type InventarItemEvent
	} from './inventarItem';
	import { getInventarItemEvents } from '$lib/api/inventarApi';
	import Table from '$lib/Table.svelte';

	export let deviceId: InventarItemDeviceId;

	let events: InventarItemEvent[] = [];

	async function loadEvents(deviceId: InventarItemDeviceId) {
		events = [];

		const data = await getInventarItemEvents(deviceId);

		data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		events = data;
	}

	$: loadEvents(deviceId);
</script>

<div class="flex flex-col gap-2 p-4">
	<h1 class="font-bold">Ereignisse für {deviceId}:</h1>

	<div class="flex flex-col gap-2">
		{#if events.length === 0}
			<p>Keine Ereignisse vorhanden.</p>
		{:else}
			<Table
				header={['deviceId', 'status', 'aktion von', 'aktion am']}
				values={events.map((event) => [
					deviceId,
					eventTypeToFriendlyString(event.type),
					userToFriendlyString(event.user),
					new Date(event.date).toLocaleString('de-DE')
				])}
			/>
		{/if}
	</div>
</div>
