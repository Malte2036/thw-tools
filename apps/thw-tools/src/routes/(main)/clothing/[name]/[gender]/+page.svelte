<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { PageData } from './$types';
	import Table from '$lib/Table.svelte';
	import {
		humanMeasurementToFriendlyName,
		clothingNameToFriendlyName,
		humanGenderToFriendlyString
	} from '$lib/clothing/clothingConstantUtils';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import ClothingSizesInput from '$lib/clothing/ClothingSizesInput.svelte';
	import {
		calculateMatchingClothingSizesForInput,
		getTableLink,
		isDeviationAcceptable
	} from '$lib/clothing/clothingUtils';
	import type { ClothingInputValue } from '$lib/clothing/clothingInputStore';
	import type {
		ClothingName,
		HumanGender,
		HumanMeasurement,
		MatchingClothingSizeTable
	} from '$lib/clothing/clothing';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import { goto } from '$app/navigation';
	import { Button } from '@thw-tools/svelte-components';
	import ClothingResultCard from '$lib/clothing/ClothingResultCard.svelte';
	import ClothingInfo from '$lib/clothing/ClothingInfo.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { LinkButton } from '@thw-tools/svelte-components';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let visibleData: 'table' | 'deviationResults' =
		$state(browser && $page.url.searchParams.get('visibleData') === 'deviationResults'
			? 'deviationResults'
			: 'table');

	let calculationResult: {
		sizes: MatchingClothingSizeTable[];
		missingMeasurements: Map<ClothingName, HumanMeasurement[]>;
	} = $state({
		sizes: [],
		missingMeasurements: new Map()
	});

	let selectedSize: string | undefined = $state();
	let matchingSizeTable: MatchingClothingSizeTable | undefined = $state();

	function calculate(input: ClothingInputValue) {
		calculationResult = calculateMatchingClothingSizesForInput(input, data.tables);

		matchingSizeTable = getMatchingSizeTable();
		selectedSize = calculateSelectedSize();
	}

	function getMatchingSizeTable() {
		return calculationResult?.sizes.find((size) => size.name === data.table.name);
	}

	function calculateSelectedSize() {
		if (!matchingSizeTable) return undefined;

		const size = matchingSizeTable.matchingClothingSizes[0];
		if (!isDeviationAcceptable(size.deviation)) return undefined;

		return size.clothingSize.size;
	}


	function pushToOtherGender(gender: HumanGender) {
		if (!browser) return;

		const link = getTableLink(data.table.name, gender, visibleData == 'deviationResults');
		if (link) {
			goto(link);
		}
	}


	function getTableValues() {
		const table = data.table;
		if (!table) return [];

		table.data.sort((a, b) => a.id - b.id);

		return table.data.map((value) => [
			value.id.toString(),
			value.size.toString(),
			value.height ? `${value.height.min} - ${value.height.max}` : '',
			value.chestCircumference
				? `${value.chestCircumference.min} - ${value.chestCircumference.max}`
				: '',
			value.waistCircumference
				? `${value.waistCircumference.min} - ${value.waistCircumference.max}`
				: '',
			value.hipCircumference ? `${value.hipCircumference.min} - ${value.hipCircumference.max}` : '',
			value.insideLegLength ? `${value.insideLegLength.min} - ${value.insideLegLength.max}` : ''
		]);
	}
	run(() => {
		$clothingInput.gender &&
			$clothingInput.gender != data.table.gender &&
			pushToOtherGender($clothingInput.gender);
	});
	run(() => {
		calculate($clothingInput);
	});
</script>

<ClothingHead table={data.table} />

{#if !data.table}
	<p>Table not found</p>
{:else}
	<div class="p-4 flex flex-col gap-2">
		<LinkButton url="/clothing">Zu allen Kleidungsstücken</LinkButton>
		<div>
			<span class="text-3xl font-bold">{clothingNameToFriendlyName(data.table.name)}</span>
			<span>({data.table.type}, {humanGenderToFriendlyString(data.table.gender)})</span>
		</div>

		<div class="flex flex-col gap-1">
			<ClothingSizesInput />

			<div>
				<span class="font-bold">Berechnete Konfektionsgröße:</span>
				<span>
					{#if selectedSize}
						{selectedSize}
					{:else}
						Keine passende Größe gefunden
					{/if}
				</span>
			</div>
		</div>

		<Button
			secondary
			click={() => (visibleData = visibleData === 'table' ? 'deviationResults' : 'table')}
		>
			{visibleData === 'table'
				? `Weitere Ergebnisse für "${clothingNameToFriendlyName(data.table.name)}"`
				: `Maßtabelle für "${clothingNameToFriendlyName(data.table.name)}"`}
		</Button>
		{#if visibleData === 'table'}
			<Table
				header={[
					'ID',
					'Konfektionsgröße',
					humanMeasurementToFriendlyName('height'),
					humanMeasurementToFriendlyName('chestCircumference'),
					humanMeasurementToFriendlyName('waistCircumference'),
					humanMeasurementToFriendlyName('hipCircumference'),
					humanMeasurementToFriendlyName('insideLegLength')
				]}
				values={getTableValues()}
				selectedIndex={data.table.data.findIndex(
					(value) => value.size.toString() === selectedSize?.toString()
				)}
			/>
		{:else}
			<div class="font-bold">
				<span>
					Es wurden folgende Größen für "{clothingNameToFriendlyName(data.table.name)}" gefunden.
					Die Ergebnisse sind nach der Ergebnisqualität sortiert</span
				> (Die geringste Abweichung ist am besten, siehe Info unten).
			</div>
			<div class="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 gap-2">
				{#if matchingSizeTable}
					{#each matchingSizeTable.matchingClothingSizes as table}
						{#if isDeviationAcceptable(table.deviation)}
							<ClothingResultCard
								clothingSizesTable={matchingSizeTable}
								matchingClothingSize={table}
								missingMeasurements={calculationResult.missingMeasurements}
								showButton={false}
							/>
						{/if}
					{/each}
				{:else}
					<p>Keine passenden Ergebnisse gefunden</p>
				{/if}
			</div>
		{/if}
	</div>

	<ClothingInfo />
{/if}
