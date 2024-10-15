<script lang="ts">
	import { getFunkItemEvents } from '$lib/api/funkApi';
	import ErrorState from '$lib/ErrorState.svelte';
	import Input from '$lib/Input.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { getOrganisationUserByInternalId } from '$lib/shared/stores/userStore';
	import {
		isSearchStringInFunkItemEvent,
		type FunkItemDeviceId,
		type FunkItemEvent
	} from '../api/funkModels';
	import InventarItemEventItem from './FunkItemEventItem.svelte';
	import { user } from '$lib/shared/stores/userStore';
	import { funk, getAllFunkItemEventsByFunkItemDeviceId } from '$lib/shared/stores/funkStore';

	export let deviceId: FunkItemDeviceId;

	let events: FunkItemEvent[] = [];
	let eventsPromise: Promise<void> | undefined = undefined;

	let filteredEvents: FunkItemEvent[] = [];

	let search = '';

	const filterEvents = () => {
		const eventsForDevice = getAllFunkItemEventsByFunkItemDeviceId($funk, deviceId);
		filteredEvents = eventsForDevice.filter((event) =>
			isSearchStringInFunkItemEvent(
				search,
				event,
				getOrganisationUserByInternalId($user, event.user)
			)
		);
	};

	$: (search || true) && $funk && filterEvents();

	async function loadEvents(deviceId: FunkItemDeviceId) {
		events = [];
		search = '';

		const data = await getFunkItemEvents(deviceId);

		data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
		events = data;
	}

	$: eventsPromise = loadEvents(deviceId);
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
				{#each filteredEvents as event (event._id)}
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
