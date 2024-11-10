<script lang="ts">
	import { goto } from '$app/navigation';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import InventoryDetailsDialog from '$lib/inventar/InventoryDetailsDialog.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import Table from '$lib/Table.svelte';
	import { db } from '$lib/utils/db';

	let inventoryItem: InventoryItem | undefined = $state();

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
		return new Set<string>($inventory.inventoryItems?.map((item) => item.einheit) || []);
	};
</script>

<div class="p-2 flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<h1 class="text-2xl font-bold">Inventarverwaltung</h1>
			<span class="bg-thw-300 text-xs px-2 py-1 rounded-full">Beta</span>
		</div>
		<div class="flex gap-2">
			<LinkButton url="list">Inventarliste</LinkButton>
			<LinkButton url="upload" secondary>Daten importieren</LinkButton>
		</div>
		<p class="text-lg">
			Scannen Sie den QR-Code des Inventarstücks oder geben Sie die Inventarnummer manuell ein, um
			detaillierte Informationen abzurufen.
		</p>
	</div>

	<div class="flex flex-col gap-2">
		{#if $inventory.inventoryItems === null}
			<LoadingSpinner />
		{:else if $inventory.inventoryItems.length === 0}
			<p class="text-lg text-gray-500">Aktuell sind keine Inventarstücke erfasst.</p>
		{:else}
			<div class="flex flex-col gap-2">
				<div class="text-lg text-gray-500">
					Gesamtbestand: <span class="font-bold">{$inventory.inventoryItems.length}</span>
					Inventarstücke, verteilt auf folgende Einheiten:
				</div>
				<Table
					header={['Einheit', 'Anzahl']}
					values={Array.from(getEinheiten()).map((einheit) => [
						einheit,
						$inventory.inventoryItems
							?.filter((item) => item.einheit === einheit)
							.length.toLocaleString('de-DE') ?? '-'
					])}
					onValueClick={(row, index) => goto(`/inventar/list?einheit=${row[0]}`)}
				/>
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
