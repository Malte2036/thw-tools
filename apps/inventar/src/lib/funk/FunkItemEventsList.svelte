<script lang="ts">
	import { run } from 'svelte/legacy';

	import { getFunkItemEvents } from '$lib/api/funkApi';
	import ErrorState from '$lib/ErrorDisplay.svelte';
	import Input from '$lib/Input.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { getOrganisationMemberByInternalId } from '$lib/shared/stores/userStore';
	import {
		isSearchStringInFunkItemEvent,
		type FunkItemDeviceId,
		type FunkItemEvent
	} from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';
	import { user } from '$lib/shared/stores/userStore';
	import { funk, getAllFunkItemEventsByFunkItemDeviceId } from '$lib/shared/stores/funkStore';

	interface Props {
		deviceId: FunkItemDeviceId;
	}

	let { deviceId }: Props = $props();

	let events: FunkItemEvent[] = $state([]);
	let eventsPromise: Promise<void> | undefined = $state(undefined);

	let filteredEvents: FunkItemEvent[] = $state([]);

	let search = $state('');

	const filterEvents = () => {
		const eventsForDevice = getAllFunkItemEventsByFunkItemDeviceId($funk, deviceId);
		filteredEvents = eventsForDevice.filter((event) =>
			isSearchStringInFunkItemEvent(
				search,
				event,
				getOrganisationMemberByInternalId($user, event.userId)?.user
			)
		);
	};

	run(() => {
		(search || true) && $funk && filterEvents();
	});

	async function loadEvents(deviceId: FunkItemDeviceId) {
		events = [];
		search = '';

		const data = await getFunkItemEvents(deviceId);

		data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		events = data;
	}

	run(() => {
		eventsPromise = loadEvents(deviceId);
	});
</script>

<div class="flex flex-col gap-2">
	<h1 class="font-bold text-2xl">Ereignisse für {deviceId}:</h1>

	<Input placeholder="Filtere nach Ereignissen..." bind:inputValue={search} />

	<div class="flex flex-col gap-2">
		{#await eventsPromise}
			<LoadingSpinner />
		{:then}
			{#if events.length === 0}
				<p>Keine Ereignisse vorhanden.</p>
			{:else}
				{#each filteredEvents as event (event.id)}
					<InventarItemEventItem {event} {deviceId} item={undefined} isSelected={false} secondary />
				{/each}
			{/if}
		{:catch error}
			<ErrorState
				label={`Fehler beim Laden der Ereignisse für das Funkgerät mit der Inventarnummer ${deviceId}.`}
				{error}
			/>
		{/await}
	</div>
</div>
