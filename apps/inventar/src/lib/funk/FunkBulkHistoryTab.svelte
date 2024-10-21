<script lang="ts">
	import { run } from 'svelte/legacy';

	import Input from '$lib/Input.svelte';
	import { funk } from '$lib/shared/stores/funkStore';
	import { getOrganisationUserByInternalId, user } from '$lib/shared/stores/userStore';
	import { isSearchStringInFunkItemEventBulk, type FunkItemEventBulk } from '../api/funkModels';
	import InventarItemEventBulkItem from './FunkItemEventBulkItem.svelte';

	let searchTerm: string = $state('');
	let filteredBulks = $state($funk.funkItemEventBulks);

	// What does this function do?
	const getInventarItems = (bulk: FunkItemEventBulk) => {
		return (
			$funk.funkItems?.filter((item) =>
				bulk.funkItemEvents.some((event) => event.funkItem === item._id)
			) ?? []
		);
	};

	run(() => {
		filteredBulks =
			$funk.funkItemEventBulks
				?.filter((item) =>
					isSearchStringInFunkItemEventBulk(
						searchTerm,
						item,
						getOrganisationUserByInternalId($user, item.user),
						getInventarItems(item).map((item) => item.deviceId)
					)
				)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? [];
	});
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-2xl">Historie:</div>

	<div class="flex flex-col gap-2">
		<Input placeholder="Historie durchsuchen..." bind:inputValue={searchTerm} />
		{#if filteredBulks}
			{#if filteredBulks.length === 0}
				<div>Keine Historie vorhanden.</div>
			{:else}
				{#each filteredBulks as bulk}
					<InventarItemEventBulkItem {bulk} />
				{/each}
			{/if}
		{:else}
			<div>Historie lädt...</div>
		{/if}
	</div>
</div>
