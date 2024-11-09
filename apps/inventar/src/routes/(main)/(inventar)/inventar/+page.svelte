<script lang="ts">
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import InventoryDetailsDialog from '$lib/inventar/InventoryDetailsDialog.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { db } from '$lib/utils/db';
	import { onMount } from 'svelte';

	let inventoryItem: InventoryItem | undefined = $state();
	let allItems: InventoryItem[] = $state([]);
	let loading = $state(true);

	onMount(async () => {
		allItems = await db.getInventoryItems();
		loading = false;
	});

	const onScan = async (decodedText: string) => {
		inventoryItem = await db.getInventoryItemByInventarNummer(decodedText);
		if (!inventoryItem) {
			$bannerMessage = {
				message: 'Inventar Item nicht gefunden',
				type: 'error',
				autoDismiss: {
					duration: 5000
				}
			};
			return false;
		}
		return true;
	};

	const getEinheiten = () => {
		return new Set<string>(allItems.map((item) => item.einheit));
	};
</script>

<div class="p-2 flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<h1 class="text-2xl font-bold">OV Inventar</h1>
			<span class="bg-thw-300 text-xs px-2 py-1 rounded-full">Beta</span>
		</div>
		<div class="flex gap-2">
			<LinkButton url="list">Alle Items anzeigen</LinkButton>
			<LinkButton url="upload" secondary>Import</LinkButton>
		</div>
		<p class="text-lg">
			Scanne den QR-Code oder gib die Inventar-Nummer manuell ein, um Informationen zu einem
			Inventar-Item im OV zu erhalten.
		</p>
	</div>

	<div class="flex flex-col gap-2">
		{#if loading}
			<LoadingSpinner />
		{:else if allItems.length === 0}
			<p class="text-lg text-gray-500">Es sind noch keine Inventar-Items im System erfasst.</p>
		{:else}
			<div class="text-lg text-gray-500">
				Es sind bereits {allItems.length} Inventar-Items im System der folgenden Einheiten erfasst:

				<ul class="list-disc list-inside pl-2">
					{#each Array.from(getEinheiten()) as einheit}
						<li>{einheit}</li>
					{/each}
				</ul>
			</div>
		{/if}
	</div>
</div>

{#if inventoryItem === undefined}
	<div class="flex flex-col gap-2 p-2">
		<QrScanner {onScan} scanButtonText="QR-Code scannen" closeButtonText="Scanner schließen" />
		<ManuelDeviceIdInput
			{onScan}
			showButtonText="Inventarnummer manuell eingeben"
			submitButtonText="Suchen"
		/>
	</div>
{:else}
	<InventoryDetailsDialog {inventoryItem} onClose={() => (inventoryItem = undefined)} />
{/if}
