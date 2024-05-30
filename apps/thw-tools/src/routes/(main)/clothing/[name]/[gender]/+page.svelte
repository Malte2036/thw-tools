<script lang="ts">
	import type { PageData } from './$types';
	import Table from '$lib/Table.svelte';
	import {
		humanMeasurementToFriendlyName,
		clothingNameToFriendlyName,
		humanGenderToFriendlyString
	} from '$lib/clothing/clothingConstantUtils';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import ClothingSizesInput from '$lib/clothing/ClothingSizesInput.svelte';
	import {
		calculateMatchingClothingSizesForInput,
		getTableLink
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

	export let data: PageData;

	let calculationResult: {
		sizes: MatchingClothingSizeTable[];
		missingMeasurements: Map<ClothingName, HumanMeasurement[]>;
	} = {
		sizes: [],
		missingMeasurements: new Map()
	};

	let selectedSize: string | undefined;

	function calculate(input: ClothingInputValue) {
		calculationResult = calculateMatchingClothingSizesForInput(input, data.tables);

		selectedSize = calculateSelectedSize();
	}

	function calculateSelectedSize() {
		let matchingSizeTable: MatchingClothingSizeTable | undefined = calculationResult?.sizes.find(
			(size) => size.name === data.table.name
		);
		if (!matchingSizeTable) return undefined;

		return matchingSizeTable.matchingClothingSizes[0].clothingSize.size;
	}

	$: $clothingInput.gender &&
		$clothingInput.gender != data.table.gender &&
		pushToOtherGender($clothingInput.gender);

	function pushToOtherGender(gender: HumanGender) {
		const link = getTableLink(data.table.name, gender, true);
		if (link) {
			goto(link);
		}
	}

	$: calculate($clothingInput);

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
</script>

<ClothingHead table={data.table} />

{#if !data.table}
	<p>Table not found</p>
{:else}
	<div class="p-4 flex flex-col gap-2">
		<div>
			<span class="text-3xl font-bold">{clothingNameToFriendlyName(data.table.name)}</span>
			<span>({data.table.type}, {humanGenderToFriendlyString(data.table.gender)})</span>
		</div>

		<div class="flex flex-col gap-1">
			<ClothingSizesInput />
			{#if selectedSize}
				<div>
					<span class="font-bold">Berechnete Konfektionsgröße:</span>
					<span>{selectedSize}</span>
				</div>
			{/if}
		</div>

		<LinkButton url="/clothing" secondary>Zum Bekleidungsrechner</LinkButton>
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
	</div>
{/if}
