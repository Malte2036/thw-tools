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
	import { visibleInventoryColumns } from '$lib/shared/stores/inventoryColumnStore';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { SvelteComponent } from 'svelte';
	import InventorySettingsDialog from '$lib/inventar/InventorySettingsDialog.svelte';

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

	const allColumns = [
		{ id: 'inventarNummer', label: 'Inventar-Nr.' },
		{ id: 'einheit', label: 'Einheit' },
		{ id: 'ausstattung', label: 'Ausstattung' },
		{ id: 'art', label: 'Art' },
		{ id: 'menge', label: 'Menge (Soll/Ist)' },
		{ id: 'verfuegbar', label: 'Verfügbar' },
		{ id: 'hersteller', label: 'Hersteller' },
		{ id: 'typ', label: 'Typ' },
		{ id: 'sachNummer', label: 'Sach-Nr.' },
		{ id: 'gerateNummer', label: 'Gerät-Nr.' },
		{ id: 'status', label: 'Status' }
	];

	let tableHeader = $derived(
		allColumns.filter((col) => $visibleInventoryColumns.includes(col.id)).map((col) => col.label)
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
				String(item.status || '-')
			];

			return allValues.filter((_, index) =>
				$visibleInventoryColumns.includes(allColumns[index].id)
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

			return matchesSearch && matchesEinheit;
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

<div class="p-2 flex flex-col gap-4">
	<LinkButton url="../" secondary>Zurück zur Inventar-Übersicht</LinkButton>

	<div class="flex flex-col gap-2">
		<div class="flex justify-between gap-2">
			<div class="flex items-center gap-2">
				<h1 class="text-2xl font-bold">OV Inventar Liste</h1>
				<span class="bg-thw-300 text-xs px-2 py-1 rounded-full">Beta</span>
			</div>
			<div>
				<button class="underline hover:text-thw" onclick={() => (showSettings = true)}>
					Einstellungen
				</button>
			</div>
		</div>
		<p class="text-lg">Übersicht aller Inventar-Items im System.</p>
	</div>

	<div class="text-sm text-gray-500 mb-4">
		Last updated: {lastFetchedStr}
	</div>

	{#if $inventory.fetching}
		<LoadingSpinner />
	{/if}

	{#if $inventory.inventoryItems === null}
		<LoadingSpinner />
	{:else}
		<div class="flex flex-col gap-4">
			<div class="flex flex-col md:flex-row items-start gap-4">
				<div class="w-full md:w-64">
					<Select
						options={getEinheiten()}
						selected={selectedEinheit}
						onSelect={handleEinheitChange}
						label="Einheit Filter"
					/>
				</div>
				<div class="w-full">
					<Input
						inputValue={searchTerm}
						onInput={handleSearch}
						placeholder="Suche nach Inventarnummer, Ausstattung, etc."
						label="Suche"
					/>
				</div>
			</div>

			{#if filteredItems.length === 0}
				<p class="text-lg text-gray-500">Keine Inventar-Items gefunden.</p>
			{:else}
				<div class="overflow-x-auto">
					<Table header={tableHeader} values={getTableValues(filteredItems)} />
				</div>
				<div class="text-gray-500">
					Zeige {filteredItems.length} von {$inventory.inventoryItems.length} Items
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if showSettings}
	<InventorySettingsDialog
		columns={allColumns}
		visibleColumns={$visibleInventoryColumns}
		onToggleColumn={toggleColumn}
		onClose={() => (showSettings = false)}
	/>
{/if}
