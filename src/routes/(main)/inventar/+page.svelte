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
		type InventarItemDeviceId,
		type InventarItemEventType
	} from '$lib/inventar/inventarItem';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';

	export let data: PageData;

	let scannedDeviceId:
		| {
				deviceId: string;
				alreadExists: boolean;
		  }
		| undefined;

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

<div class="flex flex-col gap-2 p-4">
	<QrScanner {onScan} />
	<ManuelDeviceIdInput {onScan} />

	<div>
		<div class="font-bold">Inventarliste:</div>
		<Table
			header={['', 'deviceId', 'status', 'letzte aktion von', 'letze aktion am']}
			values={data.inventarItems.map((item) => [
				eventTypeToEmoji(item.lastEvent.type),
				item.deviceId,
				eventTypeToFriendlyString(item.lastEvent.type),
				`${item.lastEvent.user.firstName ?? ''} ${item.lastEvent.user.lastName ?? ''}`,
				new Date(item.lastEvent.date).toLocaleString('de-DE')
			])}
			onValueClick={(row) => {
				console.log(row);
				const id = row[1];
				selectedDeviceId = id === selectedDeviceId ? undefined : id;
			}}
		></Table>
	</div>
</div>

{#if selectedDeviceId}
	<InventarItemEventsList deviceId={selectedDeviceId} />
{/if}

{#if scannedDeviceId}
	<ScanInventarItemResultDialog
		deviceId={scannedDeviceId.deviceId}
		lastEvent={data.inventarItems.find((item) => item.deviceId === scannedDeviceId?.deviceId)
			?.lastEvent}
		onSubmit={submit}
	/>
{/if}
