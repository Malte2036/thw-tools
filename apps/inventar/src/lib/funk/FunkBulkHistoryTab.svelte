<script lang="ts">
	import { run } from 'svelte/legacy';

	import Input from '$lib/Input.svelte';
	import { funk } from '$lib/shared/stores/funkStore';
	import { getOrganisationMemberByInternalId, user } from '$lib/shared/stores/userStore';
	import { isSearchStringInFunkItemEventBulk, type FunkItemEventBulk } from '../api/funkModels';
	import InventarItemEventBulkItem from './FunkItemEventBulkItem.svelte';

	let searchTerm: string = $state('');
	let filteredBulks = $state($funk.funkItemEventBulks);

	// What does this function do?
	const getInventarItems = (bulk: FunkItemEventBulk) => {
		return (
			$funk.funkItems?.filter((item) =>
				bulk.events.some((event) => event.event.funkItemId === item.id)
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
						getOrganisationMemberByInternalId($user, item.userId)?.user,
						getInventarItems(item).map((item) => item.deviceId)
					)
				)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) ?? [];
	});
</script>

<div class="flex flex-col gap-2">
	<div class="flex flex-col gap-2">
		<Input placeholder="Historie durchsuchen..." bind:inputValue={searchTerm} />
		{#if filteredBulks}
			{#if filteredBulks.length === 0}
				<div>Keine Historie vorhanden.</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
					{#each filteredBulks as bulk}
						<InventarItemEventBulkItem {bulk} />
					{/each}
				</div>
			{/if}
		{:else}
			<div>Historie lädt...</div>
		{/if}
	</div>
</div>
