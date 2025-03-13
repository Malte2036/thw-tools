<script lang="ts">
	import { run } from 'svelte/legacy';

	import Input from '$lib/Input.svelte';
	import Table from '$lib/Table.svelte';
	import type { ProtectiveSuite, ProtectiveSuiteData } from '$lib/cbrn/ProtectiveSuite';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let protectiveSuiteSearchValue = $state('');
	let selectedProtectiveSuite: ProtectiveSuite | undefined = $state(undefined);

	run(() => {
		if (protectiveSuiteSearchValue !== '') {
			selectedProtectiveSuite = undefined;
		}
	});

	let filteredProtectiveSuites: ProtectiveSuite[] = $state([]);

	run(() => {
		filteredProtectiveSuites = data.allProtectiveSuites.filter((value) =>
			value.name.toLowerCase().includes(protectiveSuiteSearchValue.toLowerCase())
		);
	});

	let substanceSearchValue = $state('');

	let filteredSubstances: ProtectiveSuiteData[] = $state([]);

	run(() => {
		filteredSubstances =
			selectedProtectiveSuite?.data?.filter(
				(value) =>
					value['Chemisches Produkt']?.toLowerCase().includes(substanceSearchValue.toLowerCase()) ||
					value['CAS-Nr.']?.toLowerCase().includes(substanceSearchValue.toLowerCase())
			) ?? [];
	});
</script>

<div class="m-4 flex flex-col gap-8">
	<div class="text-red-500">
		<p class="font-bold">Disclamer:</p>
		<p class="italic">Keinerlei Gewähr auf Richtigkeit der angegebenen Daten.</p>
		<p class="italic">Diese Unterseite ist zurzeit noch unter aktiver Entwicklung!</p>
	</div>

	<div class="flex flex-col gap-2">
		<Input
			label="Anzugsuche"
			placeholder="Anzugnummer"
			bind:inputValue={protectiveSuiteSearchValue}
		/>

		{#if filteredProtectiveSuites.length > 0}
			<Table
				header={['Anzugnummer']}
				values={filteredProtectiveSuites.map((value) => [value.name])}
				onValueClick={(row) =>
					(selectedProtectiveSuite = data.allProtectiveSuites.find((v) => v.name === row[0]))}
			/>

			{#if !selectedProtectiveSuite}
				<p class="text-lg">Wähle einen Schutzanzug aus der Tabelle aus.</p>
			{/if}
		{:else}
			<p class="text-lg">Keine Anzüge mit der Nummer "{protectiveSuiteSearchValue}" gefunden.</p>
		{/if}

		{#if selectedProtectiveSuite}
			<div>
				<h2 class="font-bold text-xl">Schutzanzug {selectedProtectiveSuite.name}</h2>
			</div>
			<Input
				label="Stoffsuche"
				placeholder="Chemisches Produkt, CAS-Nr."
				bind:inputValue={substanceSearchValue}
			/>

			{#if filteredSubstances.length > 0}
				<Table
					header={[
						'Chemisches Produkt',
						'CAS-Nr.',
						'Permetation ASTM F 109',
						'Permeation EN ISO 6529 Minuten',
						'Permeation EN ISO 6529 Klasse'
					]}
					values={filteredSubstances.map((value) => [
						value['Chemisches Produkt'] ?? '',
						value['CAS-Nr.'] ?? '',
						value['Permetation ASTM F 109']?.toString() ?? '',
						value['Permeation EN ISO 6529 Minuten']?.toString() ?? '',
						value['Permeation EN ISO 6529 Klasse']?.toString() ?? ''
					])}
				/>
			{:else}
				<p class="text-lg">
					Keine Stoffe mit dem Namen oder der CAS-Nr. "{substanceSearchValue}" gefunden.
				</p>
			{/if}
		{/if}
	</div>
</div>
