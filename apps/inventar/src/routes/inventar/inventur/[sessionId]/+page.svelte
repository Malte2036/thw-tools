<script lang="ts">
	import Card from '$lib/Card.svelte';
	import { addItemToSession, setItemCount } from '$lib/inventur/inventurApi';
	import type { InventurItemEntry } from '$lib/inventur/types';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';

	// Import new components
	import InventurSummary from '$lib/inventur/components/InventurSummary.svelte';
	import InventurScanInput from '$lib/inventur/components/InventurScanInput.svelte';
	import InventurManualInput from '$lib/inventur/components/InventurManualInput.svelte';
	import InventurItemsTable from '$lib/inventur/components/InventurItemsTable.svelte';
	import MissingItemsTable from '$lib/inventur/components/MissingItemsTable.svelte';
	import { Button } from '@thw-tools/svelte-components';

	let { data }: { data: PageData } = $props();
	const sessionId = data.sessionId;

	// --- State Management ---
	let scannedItems = $state<Map<string, InventurItemEntry>>(
		new Map(data.sessionDetails?.items?.map((item) => [item.inventarItemId!, item]) || [])
	);
	// Scan input state - Will be removed later when component refactoring is done
	let isScanning = $state(false);
	let scanError = $state<string | null>(null);
	// Manual input state - Uncommented
	let isSubmittingManual = $state(false);
	let manualInputError = $state<string | null>(null);
	// Debounce state
	let lastScannedValue: string | null = null;
	let lastScanTime: number = 0;
	const DEBOUNCE_MS = 500;
	// State for Summary Stats
	let expectedTotalCount = $state(0);
	let scannedUniqueCount = $state(0);
	let scannedTotalCount = $state(0);
	let missingCount = $state(0);
	// State for Table/Manual Options
	let tableHeader = $state<string[]>([]);
	let tableValues = $state<string[][]>([]);
	let manualItemOptions = $state<{ value: string; label: string }[]>([]);
	// State for Missing Items display
	let missingItems = $state<InventoryItem[]>([]);
	let showMissingItems = $state(false);

	// --- Event Handlers ---
	async function handleScan(decodedText: string) {
		const now = Date.now();
		if (decodedText === lastScannedValue && now - lastScanTime < DEBOUNCE_MS) return;
		lastScannedValue = decodedText;
		lastScanTime = now;

		scanError = null;
		isScanning = true;
		try {
			// Use inventarNummer here as before
			const updatedEntry = await addItemToSession(sessionId, { inventarNummer: decodedText });
			if (updatedEntry.inventarItemId) {
				scannedItems.set(updatedEntry.inventarItemId, updatedEntry);
				scannedItems = scannedItems; // Trigger updates
				const fullItem = $inventory.inventoryItems?.find(
					(item) => item.id === updatedEntry.inventarItemId
				);
				bannerMessage.set({
					message: `Item '${fullItem?.inventarNummer || decodedText}' hinzugefügt/gezählt (${updatedEntry.scannedCount}x)`,
					type: 'info',
					autoDismiss: { duration: 3000 }
				});
			}
		} catch (err: any) {
			console.error('Error adding item via scan:', err);
			scanError = err.response?.data?.message || err.message || 'Fehler beim Hinzufügen des Items.';
		} finally {
			isScanning = false;
		}
	}

	// Updated: handleManualSubmit increases count by a given amount
	async function handleManualSubmit(itemId: string, increaseBy: number) {
		manualInputError = null;
		isSubmittingManual = true;
		try {
			// Get the current count from state, default to 0 if not found
			const currentCount = scannedItems.get(itemId)?.scannedCount ?? 0;
			const newCount = currentCount + increaseBy;

			// Call setItemCount with the new calculated count
			const updatedEntry = await setItemCount(sessionId, itemId, { count: newCount });

			if (updatedEntry.inventarItemId) {
				scannedItems.set(updatedEntry.inventarItemId, updatedEntry);
				scannedItems = scannedItems; // Trigger updates
				const fullItem = $inventory.inventoryItems?.find(
					(item) => item.id === updatedEntry.inventarItemId
				);
				bannerMessage.set({
					// Updated message to reflect increase
					message: `Anzahl für '${fullItem?.inventarNummer || updatedEntry.inventarItemId}' um ${increaseBy} erhöht (neu: ${updatedEntry.scannedCount})`,
					type: 'info',
					autoDismiss: { duration: 3000 }
				});
			}
		} catch (err: any) {
			console.error('Error increasing item count:', err);
			manualInputError =
				err.response?.data?.message || err.message || 'Fehler beim Erhöhen der Anzahl.';
		} finally {
			isSubmittingManual = false;
		}
	}

	// Effect to update summary, table data, manual options, and missing items
	$effect(() => {
		const items = $inventory.inventoryItems;
		const localExpectedFiltered =
			items?.filter((item: InventoryItem) => item.einheit === data.sessionDetails?.einheit) ?? [];

		// Update Summary Calculations
		expectedTotalCount = localExpectedFiltered.length;
		scannedUniqueCount = scannedItems.size;
		scannedTotalCount = Array.from(scannedItems.values()).reduce(
			(sum, item) => sum + (item.scannedCount ?? 0),
			0
		);
		const scannedIds = new Set(scannedItems.keys());
		missingCount = localExpectedFiltered.filter(
			(item: InventoryItem) => !scannedIds.has(item.id)
		).length;

		// Update Missing Items List
		missingItems = localExpectedFiltered.filter((item: InventoryItem) => !scannedIds.has(item.id));

		// Update Table Data
		tableHeader = ['Inventar Nr.', 'Ausstattung', 'Typ', 'Gezählt'];
		tableValues = Array.from(scannedItems.values()).map((entry) => {
			const fullItem = entry.inventarItemId
				? items?.find((item) => item.id === entry.inventarItemId)
				: undefined;
			return [
				fullItem?.inventarNummer ?? '',
				fullItem?.ausstattung ?? '',
				fullItem?.typ ?? '',
				(entry.scannedCount ?? 0).toString()
			];
		});

		// Update Manual Input Options
		manualItemOptions = localExpectedFiltered.map((item: InventoryItem) => ({
			value: item.id,
			label: `${item.inventarNummer ? item.inventarNummer + ' - ' : ''}${item.ausstattung}`
		}));
	});
</script>

<div class="container mx-auto p-4 flex flex-col gap-4">
	<h1 class="text-2xl font-bold mb-4">
		Inventur: {data.sessionDetails?.einheit} <span class="font-mono text-lg">({sessionId})</span>
	</h1>

	<Card title="Übersicht">
		{#snippet children()}
			<InventurSummary
				{expectedTotalCount}
				{scannedUniqueCount}
				{scannedTotalCount}
				{missingCount}
			/>
		{/snippet}
	</Card>

	<Card title="Gerät scannen">
		{#snippet children()}
			<InventurScanInput onScan={handleScan} isLoading={isScanning} error={scanError} />
		{/snippet}
	</Card>

	<Card title="Manuelle Eingabe">
		{#snippet children()}
			<InventurManualInput
				itemOptions={manualItemOptions}
				onSubmit={handleManualSubmit}
				isLoading={isSubmittingManual}
				error={manualInputError}
			/>
		{/snippet}
	</Card>

	<Card title="Erfasste Geräte">
		{#snippet children()}
			<InventurItemsTable header={tableHeader} values={tableValues} />
		{/snippet}
	</Card>

	<Card title="Fehlende Geräte ({missingCount})">
		{#snippet children()}
			<Button click={() => (showMissingItems = !showMissingItems)} secondary>
				{#if showMissingItems}
					Liste ausblenden
				{:else}
					Liste anzeigen
				{/if}
			</Button>

			{#if showMissingItems}
				{#if missingItems.length > 0}
					<MissingItemsTable {missingItems} />
				{:else}
					<p class="mt-4 text-gray-500">Alle Geräte dieser Einheit wurden erfasst.</p>
				{/if}
			{/if}
		{/snippet}
	</Card>

	<!-- TODO: Add manual input option -->
</div>
