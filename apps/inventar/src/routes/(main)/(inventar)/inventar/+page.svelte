<script lang="ts">
	import { goto } from '$app/navigation';
	import { updateInventoryItemCustomData } from '$lib/api/inventoryApi';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import ManuelDeviceIdInput from '$lib/funk/ManuelDeviceIdInput.svelte';
	import QrScanner from '$lib/funk/QRScanner.svelte';
	import BoxIcon from '$lib/icons/BoxIcon.svelte';
	import CameraIcon from '$lib/icons/CameraIcon.svelte';
	import ListIcon from '$lib/icons/ListIcon.svelte';
	import UploadIcon from '$lib/icons/UploadIcon.svelte';
	import InventoryDetailsDialog from '$lib/inventar/InventoryDetailsDialog.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import Table from '$lib/Table.svelte';
	import Tabs from '$lib/Tabs.svelte';
	import { db } from '$lib/utils/db';

	let inventoryItem: InventoryItem | undefined = $state();
	let activeTab = $state('scan'); // 'scan' or 'overview'

	const tabItems = [
		{ key: 'scan', label: 'Inventar scannen' },
		{ key: 'overview', label: 'Bestandsübersicht' }
	];

	const handleTabSelect = (selected: string) => {
		activeTab = selected;
	};

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

		updateInventoryItemCustomData(inventoryItem.id, {
			lastScanned: new Date()
		});
		return true;
	};

	const getEinheiten = () => {
		return Array.from(new Set($inventory.inventoryItems?.map((item) => item.einheit) || [])).sort();
	};
</script>

<div class="bg-gray-50 min-h-screen">
	<div class="container mx-auto px-4 py-6 max-w-5xl">
		<!-- Header -->
		<div class="bg-white rounded-lg shadow-md p-6 mb-6">
			<div class="flex flex-row justify-between items-center gap-4 mb-4">
				<div>
					<h1 class="text-3xl font-bold text-thw-700">Inventar</h1>
					<p class="text-gray-600 mt-1">THW Inventar-System</p>
				</div>
				<div>
					<LinkButton url="list" secondary>
						<span class="flex items-center gap-1.5">
							<div class="w-4 h-4">
								<ListIcon />
							</div>
							<span>Inventarliste</span>
						</span>
					</LinkButton>
				</div>
			</div>

			<!-- Mobile Tabs -->
			<div class="sm:hidden mb-4 flex justify-center">
				<Tabs items={tabItems} onSelect={handleTabSelect} initialSelected={activeTab} />
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<!-- Scanner Section -->
				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden {activeTab !==
						'scan' && 'hidden sm:block'}"
				>
					<div class="border-b border-gray-200 p-3">
						<div class="flex items-center gap-2">
							<div class="w-5 h-5 text-slate-600">
								<CameraIcon />
							</div>
							<h2 class="text-lg font-semibold text-gray-700">Inventar scannen</h2>
						</div>
					</div>
					<div class="p-3">
						<p class="text-sm text-gray-600 mb-3">
							Scanne den QR-Code oder gebe die Inventarnummer manuell ein, um detaillierte
							Informationen abzurufen.
						</p>

						{#if inventoryItem === undefined}
							<div class="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
								<div class="p-3">
									<QrScanner
										{onScan}
										scanButtonText="QR-Code scannen"
										closeButtonText="Scanner schließen"
									/>
									<div class="flex items-center my-3">
										<div class="flex-grow border-t border-gray-200"></div>
										<span class="mx-3 text-xs text-gray-500">oder</span>
										<div class="flex-grow border-t border-gray-200"></div>
									</div>
									<ManuelDeviceIdInput
										{onScan}
										showButtonText="Manuelle Inventarnummer"
										submitButtonText="Suchen"
									/>
								</div>
							</div>
						{:else}
							<InventoryDetailsDialog {inventoryItem} onClose={() => (inventoryItem = undefined)} />
						{/if}
					</div>
				</div>

				<!-- Inventory Overview Section -->
				<div
					class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden {activeTab !==
						'overview' && 'hidden sm:block'}"
				>
					<div class="border-b border-gray-200 p-3">
						<div class="flex items-center gap-2">
							<div class="w-5 h-5 text-slate-600">
								<BoxIcon />
							</div>
							<h2 class="text-lg font-semibold text-gray-700">Bestandsübersicht</h2>
						</div>
					</div>
					<div class="p-3">
						{#if $inventory.inventoryItems === null}
							<div class="flex justify-center py-6">
								<LoadingSpinner />
							</div>
						{:else if $inventory.inventoryItems.length === 0}
							<div class="bg-gray-50 rounded-md p-4 text-center border border-gray-200">
								<div class="w-8 h-8 mx-auto text-gray-400 mb-2">
									<BoxIcon />
								</div>
								<p class="text-sm text-gray-500">Aktuell sind keine Inventarstücke erfasst.</p>
							</div>
						{:else}
							<div class="flex flex-col gap-3">
								<div
									class="bg-slate-50 rounded-md p-2.5 border border-slate-200 flex items-center justify-between"
								>
									<div class="flex items-center">
										<div class="text-slate-700 text-sm font-medium mr-2">Gesamtbestand:</div>
										<div class="bg-slate-600 text-white px-2.5 py-0.5 rounded-full font-bold">
											{$inventory.inventoryItems.length}
										</div>
									</div>
									<div class="text-slate-600 text-xs">Inventarstücke</div>
								</div>

								<div class="overflow-hidden rounded-md border border-gray-200">
									<div class="p-2 bg-gray-50 border-b border-gray-200">
										<h3 class="font-medium text-sm text-gray-700">Verteilung nach Einheiten</h3>
									</div>
									<div class="overflow-x-auto max-h-[400px]">
										<Table
											header={['Einheit', 'Anzahl']}
											values={getEinheiten().map((einheit) => [
												einheit,
												$inventory.inventoryItems
													?.filter((item) => item.einheit === einheit)
													.length.toLocaleString('de-DE') ?? '-'
											])}
											onValueClick={(row, index) => goto(`/inventar/list?einheit=${row[0]}`)}
										/>
									</div>
									<div class="p-1.5 text-xs text-gray-500 bg-gray-50 border-t border-gray-200">
										Klicken Sie auf eine Einheit, um die zugehörigen Inventarstücke anzuzeigen.
									</div>
								</div>

								<!-- Admin option at the bottom of overview tab -->
								<div class="mt-2 text-right">
									<LinkButton url="upload" secondary>
										<span class="flex items-center gap-1 text-xs">
											<div class="w-3 h-3">
												<UploadIcon />
											</div>
											Daten importieren
										</span>
									</LinkButton>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
