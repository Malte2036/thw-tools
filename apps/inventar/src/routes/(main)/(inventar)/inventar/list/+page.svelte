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
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	let searchTerm = $state('');
	let selectedEinheit = $state($page.url.searchParams.get('einheit') || 'all');
	let filteredItems = $state<InventoryItem[]>([]);

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

	const tableHeader = [
		'Inventar-Nr.',
		'Einheit',
		'Ausstattung',
		'Art',
		'Hersteller',
		'Typ',
		'Sach-Nr.',
		'Gerät-Nr.',
		'Status'
	];

	const getTableValues = (items: InventoryItem[]) => {
		return items.map((item) => [
			item.inventarNummer || '-',
			item.einheit,
			item.ausstattung,
			item.art || '-',
			item.hersteller || '-',
			item.typ || '-',
			item.sachNummer || '-',
			item.gerateNummer || '-',
			item.status || '-'
		]);
	};

	const getEinheiten = () => {
		const einheiten = new Set<string>($inventory.inventoryItems?.map((item) => item.einheit) || []);
		return [{ value: 'all', label: 'Alle Einheiten' }].concat(
			Array.from(einheiten).map((e) => ({ value: e, label: e }))
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
				item.hersteller,
				item.typ,
				item.sachNummer,
				item.gerateNummer
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

	$effect(() => {
		filteredItems = filterItems($inventory.inventoryItems);
	});
</script>

<div class="p-2 flex flex-col gap-4">
	<LinkButton url="../" secondary>Zurück zur Inventar-Übersicht</LinkButton>

	<div class="flex flex-col gap-2">
		<div class="flex items-center gap-2">
			<h1 class="text-2xl font-bold">OV Inventar Liste</h1>
			<span class="bg-thw-300 text-xs px-2 py-1 rounded-full">Beta</span>
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
			<div class="flex flex-col md:flex-row items-center gap-4">
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
