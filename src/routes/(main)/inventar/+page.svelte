<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import Table from '$lib/Table.svelte';
	import { createInventarItem, createInventarItemEvent } from '$lib/api/inventarApi';
	import QrScanner from '$lib/inventar/QRScanner.svelte';
	import ScanInventarItemResultDialog from '$lib/inventar/ScanInventarItemResultDialog.svelte';
	import type { InventarItemEventType } from '$lib/inventar/inventarItem';
	import type { PageData } from './$types';

	export let data: PageData;

	let scannedDeviceId:
		| {
				deviceId: string;
				alreadExists: boolean;
		  }
		| undefined;

	async function onScan(decodedText: string) {
		console.log(decodedText);
		scannedDeviceId = {
			deviceId: decodedText,
			alreadExists: data.inventarItems.some((item) => item.deviceId === decodedText)
		};
	}

	async function submit(isUsed: boolean) {
		if (!scannedDeviceId) {
			return;
		}

		if (scannedDeviceId.alreadExists) {
			console.log(`InventarItem ${scannedDeviceId.deviceId} already exists. Updating...`);

			await createInventarItemEvent(scannedDeviceId.deviceId, isUsed);
		} else {
			console.log(`InventarItem ${scannedDeviceId.deviceId} does not exist. Creating...`);

			await createInventarItem(scannedDeviceId.deviceId, isUsed);
		}

		scannedDeviceId = undefined;
		invalidateAll();
	}

	function eventTypeToFriendlyString(eventType: InventarItemEventType): string {
		switch (eventType) {
			case 'borrowed':
				return 'ausgeliehen';
			case 'returned':
				return 'zurückgegeben';
		}

		return eventType;
	}
</script>

<div class="flex flex-col gap-2 p-4">
	<QrScanner {onScan} />

	<div>
		<div class="font-bold">Inventarliste</div>
		<Table
			header={['deviceId', 'status', 'letzte aktion von', 'letze aktion am']}
			values={data.inventarItems.map((item) => [
				item.deviceId,
				eventTypeToFriendlyString(item.lastEvent.type),
				`${item.lastEvent.user.firstName ?? ''} ${item.lastEvent.user.lastName ?? ''}`,
				new Date(item.lastEvent.date).toLocaleString('de-DE')
			])}
			onValueClick={(row) => {
				console.log(row);
			}}
		></Table>
	</div>
</div>

{#if scannedDeviceId}
	<ScanInventarItemResultDialog
		deviceId={scannedDeviceId.deviceId}
		isUsed={data.inventarItems.some(
			(item) => item.lastEvent.type === 'borrowed' && item.deviceId === scannedDeviceId?.deviceId
		)}
		alreadyExists={scannedDeviceId.alreadExists}
		onSubmit={submit}
	/>
{/if}
