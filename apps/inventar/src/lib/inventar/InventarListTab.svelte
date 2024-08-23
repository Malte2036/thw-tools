<script lang="ts">
	import { goto } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import { isSearchStringInInventarItem, type InventarItem } from './inventarItem';
	import InventarItemEventItem from './InventarItemEventItem.svelte';

	export let items: InventarItem[];

	let searchedDeviceId: string = '';
	let filterdInventarItems = items;

	$: {
		filterdInventarItems = items.filter((item) =>
			isSearchStringInInventarItem(searchedDeviceId, item)
		);
	}
</script>

<div class="flex flex-col gap-2">
	<div class="font-bold text-2xl">Inventarliste:</div>
	<Input placeholder="Geräte suchen..." bind:inputValue={searchedDeviceId} />
	<div class="flex flex-col gap-2">
		{#if filterdInventarItems.length === 0}
			<p>Keine Geräte vorhanden.</p>
		{/if}
		{#each filterdInventarItems as item}
			<InventarItemEventItem
				event={item.lastEvent}
				deviceId={item.deviceId}
				isSelected={false}
				click={() => goto(`/inventar/${item.deviceId}`)}
			/>
		{/each}
	</div>
</div>
