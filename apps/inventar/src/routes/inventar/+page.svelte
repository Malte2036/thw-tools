<script lang="ts">
	import { getInventoryItemByInventarNummer } from '$lib/api/inventoryApi';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import Button from '$lib/Button.svelte';
	import Dialog from '$lib/Dialog.svelte';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';

	let isFetching = false;
	let inventoryItem: InventoryItem | undefined;

	const onScan = (decodedText: string) => {
		console.log(decodedText);

		isFetching = true;
		getInventoryItemByInventarNummer(decodedText)
			.then((item) => {
				console.log(`Got item: ${item}`);

				inventoryItem = item;
				console.log(JSON.stringify(inventoryItem));
			})
			.catch((error) => {
				console.error(`Error while fetching item: ${error}`);
				$bannerMessage = {
					message: 'Inventar Item nicht gefunden',
					type: 'error',
					autoDismiss: {
						duration: 5000
					}
				};
			})
			.finally(() => {
				isFetching = false;
			});
	};
</script>

{#if isFetching}
	<div class="flex flex-col gap-2 p-2">
		<div class="text-xl">Lade Inventar-Item...</div>
	</div>
{:else if inventoryItem === undefined}
	<div class="flex flex-col gap-2 p-2">
		<QrScanner {onScan} />
		<ManuelDeviceIdInput {onScan} />
	</div>
{:else}
	<Dialog title="Inventar-Details">
		<div slot="content" class="flex flex-col gap-2">
			<div>
				<span class="font-bold">Inventar-Nummer:</span>
				<span>{inventoryItem.inventarNummer}</span>
			</div>
			<div>
				<span class="font-bold">Sach-Nummer:</span>
				<span>{inventoryItem.sachNummer}</span>
			</div>
			<div>
				<span class="font-bold">Ebene:</span>
				<span>{inventoryItem.ebene}</span>
			</div>
			<div>
				<span class="font-bold">Einheit:</span>
				<span>{inventoryItem.einheit}</span>
			</div>
			{#if inventoryItem.art}
				<div>
					<span class="font-bold">Art:</span>
					<span>{inventoryItem.art}</span>
				</div>
			{/if}
			<div>
				<span class="font-bold">Ausstattung:</span>
				<span>{inventoryItem.ausstattung}</span>
			</div>
			{#if inventoryItem.hersteller}
				<div>
					<span class="font-bold">Hersteller:</span>
					<span>{inventoryItem.hersteller}</span>
				</div>
			{/if}
			{#if inventoryItem.typ}
				<div>
					<span class="font-bold">Typ:</span>
					<span>{inventoryItem.typ}</span>
				</div>
			{/if}
			{#if inventoryItem.gerateNummer}
				<div>
					<span class="font-bold">Geräte-Nummer:</span>
					<span>{inventoryItem.gerateNummer}</span>
				</div>
			{/if}
		</div>
		<div slot="footer">
			<Button click={() => (inventoryItem = undefined)}>Schließen</Button>
		</div></Dialog
	>
{/if}
