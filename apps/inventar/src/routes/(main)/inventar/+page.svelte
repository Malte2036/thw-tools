<script lang="ts">
	import Table from '$lib/Table.svelte';
	import { createInventarItem, updateInventarItem } from '$lib/api/inventarApi';
	import QrScanner from '$lib/inventar/QRScanner.svelte';
	import type { PageData } from './$types';
	import { invalidateAll } from '$app/navigation';
	import ScanInventarItemResultDialog from '$lib/inventar/ScanInventarItemResultDialog.svelte';

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

			await updateInventarItem(scannedDeviceId.deviceId, isUsed);
		} else {
			console.log(`InventarItem ${scannedDeviceId.deviceId} does not exist. Creating...`);

			await createInventarItem(scannedDeviceId.deviceId, isUsed);
		}

		scannedDeviceId = undefined;
		invalidateAll();
	}
</script>

<div class="flex flex-col gap-2 p-4">
	<QrScanner {onScan} />

	<div>
		<div class="font-bold">Inventarliste</div>
		<Table
			header={['deviceId', 'ausgeliehen']}
			values={data.inventarItems.map((item) => [item.deviceId, item.isUsed ? 'Ja' : 'Nein'])}
			onValueClick={(row) => {
				console.log(row);
			}}
		></Table>
	</div>
</div>

{#if scannedDeviceId}
	<ScanInventarItemResultDialog
		deviceId={scannedDeviceId.deviceId}
		isUsed={data.inventarItems.find((item) => item.deviceId === scannedDeviceId?.deviceId)?.isUsed}
		alreadyExists={scannedDeviceId.alreadExists}
		onSubmit={submit}
	/>
{/if}
