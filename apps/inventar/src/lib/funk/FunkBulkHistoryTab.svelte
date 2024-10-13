<script lang="ts">
	import Input from '$lib/Input.svelte';
	import {
		isSearchStringInFunkItemEventBulk,
		type FunkItem,
		type FunkItemEventBulk
	} from '../api/funkModels';
	import InventarItemEventBulkItem from './FunkItemEventBulkItem.svelte';

	export let bulks: FunkItemEventBulk[];
	export let funkItems: FunkItem[];

	let searchTerm: string = '';
	let filteredBulks = bulks;

	const getInventarItems = (bulk: FunkItemEventBulk) => {
		return funkItems.filter((item) =>
			bulk.funkItemEvents.some((event) => event.funkItem._id === item._id)
		);
	};

	$: {
		filteredBulks = bulks
			.filter((item) =>
				isSearchStringInFunkItemEventBulk(
					searchTerm,
					item,
					getInventarItems(item).map((item) => item.deviceId)
				)
			)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
	}
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
