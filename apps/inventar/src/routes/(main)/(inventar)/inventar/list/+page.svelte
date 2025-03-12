<script lang="ts">
	import Input from '$lib/Input.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import Select from '$lib/Select.svelte';
	import Table from '$lib/Table.svelte';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import { searchStringIsInArray } from '$lib/utils';
	import { apiMeta } from '$lib/shared/stores/apiMetaStore';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import {
		inventoryColumns,
		visibleInventoryColumns
	} from '$lib/shared/stores/inventoryColumnStore';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { SvelteComponent } from 'svelte';
	import InventoryFilterDialog from '$lib/inventar/InventoryFilterDialog.svelte';

	type TableCell =
		| string
		| HTMLElement
		| SvelteComponent
		| {
				component: typeof SvelteComponent;
				props: Record<string, any>;
		  };

	let searchTerm = $state('');
	let selectedEinheit = $state($page.url.searchParams.get('einheit') || 'all');
	let lastScanAfter = $state($page.url.searchParams.get('lastScanAfter') || '');
	let lastScanBefore = $state($page.url.searchParams.get('lastScanBefore') || '');
	let lastScanNever = $state($page.url.searchParams.get('lastScanNever') || 'false');
	let filteredItems = $state<InventoryItem[]>([]);
	let showSettings = $state(false);

	let lastFetchedStr = $derived(
		$apiMeta.lastFetched['inventory']?.toLocaleString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	);

	let tableHeader = $derived(
		inventoryColumns
			.filter((col) => $visibleInventoryColumns.includes(col.id))
			.map((col) => col.label)
	);

	const getTableValues = (items: InventoryItem[]): TableCell[][] => {
		return items.map((item) => {
			const allValues: TableCell[] = [
				String(item.inventarNummer || '-'),
				String(item.einheit),
				String(item.ausstattung),
				String(item.art || '-'),
				item.menge ? `${String(item.menge)} / ${String(item.mengeIst ?? 0)}` : '-',
				String(item.verfuegbar || '-'),
				String(item.hersteller || '-'),
				String(item.typ || '-'),
				String(item.sachNummer || '-'),
				String(item.gerateNummer || '-'),
				String(item.status || '-'),
				item.customData?.lastScanned
					? new Date(item.customData.lastScanned).toLocaleString('de-DE', {
							hour: '2-digit',
							minute: '2-digit',
							second: '2-digit',
							day: '2-digit',
							month: '2-digit',
							year: 'numeric'
						})
					: '-'
			];

			return allValues.filter((_, index) =>
				$visibleInventoryColumns.includes(inventoryColumns[index].id)
			);
		});
	};

	const getEinheiten = () => {
		const einheiten = Array.from(
			new Set($inventory.inventoryItems?.map((item) => item.einheit) || [])
		).sort();
		return [{ value: 'all', label: 'Alle Einheiten' }].concat(
			einheiten.map((e) => ({ value: e, label: e }))
		);
	};

	const filterItems = (items: InventoryItem[] | null) => {
		if (!items) return [];

		return items.filter((item) => {
			const searchableValues = [
				item.inventarNummer,
				item.einheit,
				item.ausstattung,
				item.art,
				item.menge,
				item.mengeIst,
				item.verfuegbar,
				item.hersteller,
				item.typ,
				item.sachNummer,
				item.gerateNummer,
				item.status
			];

			const matchesSearch =
				searchTerm === '' || searchStringIsInArray(searchTerm, searchableValues);
			const matchesEinheit = selectedEinheit === 'all' || item.einheit === selectedEinheit;

			// Filter by lastScanned date
			let matchesLastScanAfter = true;
			let matchesLastScanBefore = true;
			let matchesLastScanNever = true;

			// Check for "never scanned" filter
			if (lastScanNever === 'true') {
				return matchesSearch && matchesEinheit && !item.customData?.lastScanned;
			}

			// Get the item date, treating empty lastScanned as timestamp 0
			const itemDate = item.customData?.lastScanned
				? new Date(item.customData.lastScanned)
				: new Date(0);

			if (lastScanAfter) {
				const afterDate = new Date(lastScanAfter);
				matchesLastScanAfter = itemDate >= afterDate;
			}

			if (lastScanBefore) {
				const beforeDate = new Date(lastScanBefore);
				matchesLastScanBefore = itemDate <= beforeDate;
			}

			return matchesSearch && matchesEinheit && matchesLastScanAfter && matchesLastScanBefore;
		});
	};

	const handleSearch = (event: Event) => {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
	};

	const handleEinheitChange = (value: string) => {
		selectedEinheit = value;
		const url = new URL(window.location.href);
		if (value === 'all') {
			url.searchParams.delete('einheit');
		} else {
			url.searchParams.set('einheit', value);
		}
		goto(url.toString(), { replaceState: true });
	};

	const handleLastScanFilterChange = (type: 'after' | 'before' | 'never', value: string) => {
		if (type === 'after') {
			lastScanAfter = value;
		} else if (type === 'before') {
			lastScanBefore = value;
		} else if (type === 'never') {
			lastScanNever = value;
			// Clear other date filters if "never scanned" is enabled
			if (value === 'true') {
				lastScanAfter = '';
				lastScanBefore = '';
			}
		}

		// Update URL params
		const url = new URL(window.location.href);
		if (value) {
			url.searchParams.set(
				`lastScan${type === 'after' ? 'After' : type === 'before' ? 'Before' : 'Never'}`,
				value
			);
		} else {
			url.searchParams.delete(
				`lastScan${type === 'after' ? 'After' : type === 'before' ? 'Before' : 'Never'}`
			);
		}
		goto(url.toString(), { replaceState: true });
	};

	const toggleColumn = (columnId: string) => {
		visibleInventoryColumns.update((columns) => {
			if (columns.includes(columnId)) {
				if (columns.length > 1) {
					// Prevent hiding all columns
					return columns.filter((id) => id !== columnId);
				}
			} else {
				return [...columns, columnId];
			}
			return columns;
		});
	};

	$effect(() => {
		filteredItems = filterItems($inventory.inventoryItems);
	});
</script>

<div class="px-4 py-6">
	<div class="mb-6">
		<LinkButton url="../" secondary>
			<span class="flex items-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4 mr-2"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fill-rule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clip-rule="evenodd"
					/>
				</svg>
				Zurück zur Inventar-Übersicht
			</span>
		</LinkButton>
	</div>

	<div class="bg-white rounded-lg shadow-md p-6 mb-6">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
			<div>
				<h1 class="text-3xl font-bold text-thw-700">Inventar Liste</h1>
				<p class="text-gray-600 mt-1">Übersicht aller Inventar-Items im System.</p>
			</div>
			<div class="flex items-center gap-3">
				<div class="text-sm text-gray-500">
					<span class="font-medium">Letztes Update:</span>
					{lastFetchedStr}
				</div>
				<button
					class="flex items-center gap-1 bg-thw-100 text-thw-700 px-3 py-2 rounded-md hover:bg-thw-200 transition-colors font-medium"
					onclick={() => (showSettings = true)}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fill-rule="evenodd"
							d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
							clip-rule="evenodd"
						/>
					</svg>
					Filter
				</button>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
			<div class="md:col-span-1">
				<Select
					options={getEinheiten()}
					selected={selectedEinheit}
					onSelect={handleEinheitChange}
					label="Einheit Filter"
				/>
			</div>
			<div class="md:col-span-4">
				<Input
					inputValue={searchTerm}
					onInput={handleSearch}
					placeholder="Suche nach Inventarnummer, Ausstattung, etc."
					label="Suche"
				/>
			</div>
		</div>

		{#if lastScanAfter || lastScanBefore || lastScanNever === 'true'}
			<div class="bg-thw-50 border border-thw-100 rounded-md p-3 mb-6">
				<div class="flex flex-wrap gap-2 items-center">
					<div class="font-bold text-thw-800">Aktive Filter:</div>
					{#if lastScanNever === 'true'}
						<div class="bg-thw-100 text-thw-700 px-3 py-1.5 rounded-full flex items-center gap-2">
							<span>Nur Items ohne Scan</span>
							<button
								class="text-thw-700 hover:text-thw-900 h-5 w-5 flex items-center justify-center rounded-full hover:bg-thw-200 transition-colors"
								onclick={() => handleLastScanFilterChange('never', 'false')}
							>
								✕
							</button>
						</div>
					{:else}
						{#if lastScanAfter}
							<div class="bg-thw-100 text-thw-700 px-3 py-1.5 rounded-full flex items-center gap-2">
								<span>Letzter Scan nach: {new Date(lastScanAfter).toLocaleDateString('de-DE')}</span
								>
								<button
									class="text-thw-700 hover:text-thw-900 h-5 w-5 flex items-center justify-center rounded-full hover:bg-thw-200 transition-colors"
									onclick={() => handleLastScanFilterChange('after', '')}
								>
									✕
								</button>
							</div>
						{/if}
						{#if lastScanBefore}
							<div class="bg-thw-100 text-thw-700 px-3 py-1.5 rounded-full flex items-center gap-2">
								<span>Letzter Scan vor: {new Date(lastScanBefore).toLocaleDateString('de-DE')}</span
								>
								<button
									class="text-thw-700 hover:text-thw-900 h-5 w-5 flex items-center justify-center rounded-full hover:bg-thw-200 transition-colors"
									onclick={() => handleLastScanFilterChange('before', '')}
								>
									✕
								</button>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		{/if}

		{#if $inventory.fetching}
			<div class="flex justify-center py-12">
				<LoadingSpinner />
			</div>
		{:else if $inventory.inventoryItems === null}
			<div class="flex justify-center py-12">
				<LoadingSpinner />
			</div>
		{:else if filteredItems.length === 0}
			<div class="bg-gray-50 rounded-lg p-12 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 mx-auto text-gray-400 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-xl text-gray-600 font-medium">Keine Inventar-Items gefunden.</p>
				<p class="text-gray-500 mt-2">Bitte passe Deine Filterkriterien an.</p>
			</div>
		{:else}
			<div class="overflow-x-auto bg-white rounded-lg border border-gray-200">
				<Table header={tableHeader} values={getTableValues(filteredItems)} />
			</div>
			<div class="text-gray-500 text-sm mt-3 flex justify-between items-center">
				<span
					>Zeige <span class="font-medium">{filteredItems.length}</span> von
					<span class="font-medium">{$inventory.inventoryItems.length}</span> Items</span
				>
			</div>
		{/if}
	</div>
</div>

{#if showSettings}
	<InventoryFilterDialog
		columns={inventoryColumns}
		visibleColumns={$visibleInventoryColumns}
		onToggleColumn={toggleColumn}
		onClose={() => (showSettings = false)}
		{lastScanAfter}
		{lastScanBefore}
		{lastScanNever}
		onLastScanFilterChange={handleLastScanFilterChange}
	/>
{/if}
