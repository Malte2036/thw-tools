<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Table from '$lib/Table.svelte';
	import { allProtectiveSuites, type ProtectiveSuite } from '$lib/cbrn/ProtectiveSuite';
	import { allSubstances, type Substance } from '$lib/cbrn/Substance';

	let protectiveSuiteSearchValue = '';
	let selectedProtectiveSuite: ProtectiveSuite | undefined = undefined;

	$: {
		if (protectiveSuiteSearchValue !== '') {
			selectedProtectiveSuite = undefined;
		}
	}

	let substanceSearchValue = '';

	let filteredSubstances: Substance[] = [];

	$: filteredSubstances = allSubstances.filter(
		(value) =>
			value.name.includes(substanceSearchValue) || value.unNumber.includes(substanceSearchValue)
	);

	let filteredProtectiveSuites: ProtectiveSuite[] = [];

	$: filteredProtectiveSuites = allProtectiveSuites.filter((value) =>
		value.name.includes(protectiveSuiteSearchValue)
	);
</script>

<div class="m-4 flex flex-col gap-2">
	<Input
		label="Anzugsuche"
		placeholder="Anzugnummer"
		bind:inputValue={protectiveSuiteSearchValue}
	/>

	{#if filteredProtectiveSuites.length > 0}
		<Table
			header={['Anzugnummer']}
			values={filteredProtectiveSuites.map((value) => [value.name])}
			onValueClick={(value) =>
				(selectedProtectiveSuite = allProtectiveSuites.find((v) => v.name === value))}
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
			<p class="text-lg">
				Der Schutzanzug {selectedProtectiveSuite.name} ist ein Schutzanzug der Klasse ?.
			</p>
		</div>
		<Input
			label="Stoffsuche"
			placeholder="Name, UN-Nummer"
			bind:inputValue={substanceSearchValue}
		/>

		{#if filteredSubstances.length > 0}
			<Table
				header={['Name', 'UN-Nummer', 'Schutz']}
				values={filteredSubstances.map((value) => [
					value.name,
					value.unNumber,
					selectedProtectiveSuite?.substancesProtection.get(value) ?? 'N/A'
				])}
			/>
		{:else}
			<p class="text-lg">
				Keine Stoffe mit dem Namen oder der UN-Nummer "{substanceSearchValue}" gefunden.
			</p>
		{/if}
	{/if}
</div>
