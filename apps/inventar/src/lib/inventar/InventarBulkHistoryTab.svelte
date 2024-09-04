<script lang="ts">
	import Input from '$lib/Input.svelte';
	import {
		isSearchStringInInventarItemEventBulk,
		type InventarItem,
		type InventarItemEventBulk
	} from '../api/inventarItem';
	import InventarItemEventBulkItem from './InventarItemEventBulkItem.svelte';

	export let bulks: InventarItemEventBulk[];
	export let inventarItems: InventarItem[];

	let searchTerm: string = '';
	let filteredBulks = bulks;

	const getInventarItems = (bulk: InventarItemEventBulk) => {
		return inventarItems.filter((item) =>
			bulk.inventarItemEvents.some((event) => event.inventarItem._id === item._id)
		);
	};

	$: {
		filteredBulks = bulks
			.filter((item) =>
				isSearchStringInInventarItemEventBulk(
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
