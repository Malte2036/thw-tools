<script lang="ts">
	import { onMount } from 'svelte';
	import {
		isSearchStringInInventarItem,
		isSearchStringInInventarItemEventBulk,
		type InventarItem,
		type InventarItemEventBulk
	} from './inventarItem';
	import { getInventarItemEventBulks } from '$lib/api/inventarApi';
	import InventarItemEventBulkItem from './InventarItemEventBulkItem.svelte';
	import Input from '$lib/Input.svelte';

	export let bulks: InventarItemEventBulk[];
	export let inventarItems: InventarItem[];

	let searchTerm: string = '';
	let filteredBulks = bulks;

	$: {
		filteredBulks = bulks
			.filter((item) => isSearchStringInInventarItemEventBulk(searchTerm, item, []))
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
					<InventarItemEventBulkItem {bulk} {inventarItems} />
				{/each}
			{/if}
		{:else}
			<div>Historie lädt...</div>
		{/if}
	</div>
</div>
