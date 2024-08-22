<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import Input from '$lib/Input.svelte';
	import AddDevice from '$lib/inventar/AddDevice.svelte';
	import InventarItemEventItem from '$lib/inventar/InventarItemEventItem.svelte';
	import InventarItemEventsList from '$lib/inventar/InventarItemEventsList.svelte';
	import {
		isSearchStringInInventarItem,
		type InventarItemDeviceId
	} from '$lib/inventar/inventarItem';
	import type { PageData } from './$types';

	export let data: PageData;

	let searchedDeviceId: string = '';
	let filterdInventarItems = data.inventarItems;

	$: {
		filterdInventarItems = data.inventarItems.filter((item) =>
			isSearchStringInInventarItem(searchedDeviceId, item)
		);
	}
</script>

<div class="flex flex-col gap-4 p-4">
	<AddDevice inventarItems={data.inventarItems} reset={invalidateAll} />

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
</div>
