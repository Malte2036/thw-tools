<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Select from '$lib/Select.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import LoadingSpinner from '$lib/LoadingSpinner.svelte';
	import ErrorDisplay from '$lib/ErrorDisplay.svelte';
	import Table from '$lib/Table.svelte';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import { searchStringIsInArray } from '$lib/utils';

	let searchTerm = $state('');
	let selectedEinheit = $state('all');
	let filteredItems = $state<InventoryItem[]>([]);

	const tableHeader = ['Inventar-Nr.', 'Einheit', 'Ausstattung', 'Art', 'Hersteller', 'Typ'];

	const getTableValues = (items: InventoryItem[]) => {
		return items.map((item) => [
			item.inventarNummer || '-',
			item.einheit,
			item.ausstattung,
			item.art || '-',
			item.hersteller || '-',
			item.typ || '-'
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

	$effect(() => {
		filteredItems = filterItems($inventory.inventoryItems);
	});
</script>

<div class="p-2 flex flex-col gap-4">
	<LinkButton url="../" secondary>Zurück zur Inventar-Übersicht</LinkButton>

	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-bold">Inventar Liste</h1>
		<p class="text-lg">Übersicht aller Inventar-Items im System.</p>
	</div>

	{#await $inventory.fetching}
		<LoadingSpinner />
	{:then}
		<div class="flex flex-col gap-4">
			<div class="flex flex-col md:flex-row items-center gap-4">
				<div class="w-full md:w-64">
					<Select options={getEinheiten()} bind:selected={selectedEinheit} label="Einheit Filter" />
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
					Zeige {filteredItems.length} von {$inventory.inventoryItems?.length || 0} Items
				</div>
			{/if}
		</div>
	{:catch error}
		<ErrorDisplay label="Inventar-Items konnten nicht geladen werden" {error} />
	{/await}
</div>
