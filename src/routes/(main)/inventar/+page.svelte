<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Table from '$lib/Table.svelte';
	import { createInventarItem, createInventarItemEvent } from '$lib/api/inventarApi';
	import InventarItemEventsList from '$lib/inventar/InventarItemEventsList.svelte';
	import ManuelDeviceIdInput from '$lib/inventar/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/inventar/QRScanner.svelte';
	import ScanInventarItemResultDialog from '$lib/inventar/ScanInventarItemResultDialog.svelte';
	import {
		eventTypeToEmoji,
		eventTypeToFriendlyString,
		isSearchStringInInventarItem,
		type InventarItemDeviceId,
		type InventarItemEventType
	} from '$lib/inventar/inventarItem';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';
	import { dateToFriendlyString, searchStringIsInArray } from '$lib/utils';
	import Input from '$lib/Input.svelte';
	import InventarItemEventItem from '$lib/inventar/InventarItemEventItem.svelte';

	export let data: PageData;

	let scannedDeviceId:
		| {
				deviceId: string;
				alreadExists: boolean;
		  }
		| undefined;

	let searchedDeviceId: string = '';
	let filterdInventarItems = data.inventarItems;

	$: {
		filterdInventarItems = data.inventarItems.filter((item) =>
			isSearchStringInInventarItem(searchedDeviceId, item)
		);
	}

	async function onScan(decodedText: string) {
		if (!decodedText) {
			return;
		}

		decodedText = decodedText.trim();

		scannedDeviceId = {
			deviceId: decodedText,
			alreadExists: data.inventarItems.some((item) => item.deviceId === decodedText)
		};
	}

	async function submit(eventType: InventarItemEventType) {
		if (!scannedDeviceId) {
			return;
		}

		if (scannedDeviceId.alreadExists) {
			console.log(`InventarItem ${scannedDeviceId.deviceId} already exists. Updating...`);

			await createInventarItemEvent(scannedDeviceId.deviceId, eventType);
			$bannerMessage = {
				message: `Das Gerät mit der ID ${scannedDeviceId.deviceId} wurde erfolgreich ${eventTypeToFriendlyString(
					eventType
				)}.`,
				autoDismiss: {
					duration: 5 * 1000
				}
			};
		} else {
			console.log(`InventarItem ${scannedDeviceId.deviceId} does not exist. Creating...`);

			await createInventarItem(scannedDeviceId.deviceId, eventType);
			$bannerMessage = {
				message: `Das Gerät mit der ID ${scannedDeviceId.deviceId} wurde erfolgreich angelegt und als ${eventTypeToFriendlyString(
					eventType
				)} markiert.`,
				autoDismiss: {
					duration: 5 * 1000
				}
			};
		}

		scannedDeviceId = undefined;
		selectedDeviceId = undefined;
		invalidateAll();
	}

	let selectedDeviceId: InventarItemDeviceId | undefined;
</script>

<div class="flex flex-col gap-4 p-4">
	<div class="flex flex-col gap-2">
		<QrScanner {onScan} />
		<ManuelDeviceIdInput {onScan} />
	</div>

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
					isSelected={item.deviceId === selectedDeviceId}
					click={() =>
						(selectedDeviceId = item.deviceId === selectedDeviceId ? undefined : item.deviceId)}
				/>
			{/each}
		</div>
	</div>
</div>

{#if selectedDeviceId}
	<InventarItemEventsList deviceId={selectedDeviceId} scrollIntoViewOnDataChange={true} />
{/if}

{#if scannedDeviceId}
	<ScanInventarItemResultDialog
		deviceId={scannedDeviceId.deviceId}
		lastEvent={data.inventarItems.find((item) => item.deviceId === scannedDeviceId?.deviceId)
			?.lastEvent}
		onSubmit={submit}
	/>
{/if}
