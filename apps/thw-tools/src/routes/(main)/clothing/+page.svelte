<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ClothingExportDialog from '$lib/clothing/ClothingExportDialog.svelte';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import ClothingInfo from '$lib/clothing/ClothingInfo.svelte';
	import ClothingResultCard from '$lib/clothing/ClothingResultCard.svelte';
	import ClothingSizesInput from '$lib/clothing/ClothingSizesInput.svelte';
	import type {
		ClothingName,
		HumanMeasurement,
		MatchingClothingSizeTable
	} from '$lib/clothing/clothing';
	import { convertClothingResultsToCSV, exportCSVFile } from '$lib/clothing/clothingExport';
	import type { ClothingInputValue } from '$lib/clothing/clothingInputStore';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import { calculateMatchingClothingSizesForInput } from '$lib/clothing/clothingUtils';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';

	export let data: PageData;

	let calculationResult: {
		sizes: MatchingClothingSizeTable[];
		missingMeasurements: Map<ClothingName, HumanMeasurement[]>;
	} = {
		sizes: [],
		missingMeasurements: new Map()
	};

	function calculate(input: ClothingInputValue) {
		calculationResult = calculateMatchingClothingSizesForInput(input, data.tables);
	}

	$: calculate($clothingInput);

	let isExporting = false;

	function showExportDialog() {
		isExporting = true;
	}

	function startExport(
		firstName: string | undefined,
		lastName: string | undefined,
		customNote: string | undefined
	) {
		isExporting = false;

		console.log('Exporting CSV');

		firstName = firstName?.trim();
		lastName = lastName?.trim();
		customNote = customNote?.trim();

		const csv = convertClothingResultsToCSV(calculationResult.sizes, {
			firstName,
			lastName,
			customNote
		});

		let fileName = 'clothing_results';
		if (firstName) fileName += `_${firstName}`;
		if (lastName) fileName += `_${lastName}`;
		fileName += '.csv';

		exportCSVFile(csv, fileName);

		$bannerMessage = {
			message: 'Die Ergebnisse wurden als CSV-Datei heruntergeladen.',
			autoDismiss: {
				duration: 5000
			}
		};
	}
</script>

<ClothingHead />

<div class="p-4 flex flex-col gap-4">
	<ClothingSizesInput />

	<div class="flex flex-col gap-2">
		{#if calculationResult.sizes}
			<div class="font-bold">Es wurden folgende Größen gefunden:</div>
			<div class="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 gap-2">
				{#each calculationResult.sizes as size (size.name)}
					<ClothingResultCard
						clothingSizesTable={size}
						matchingClothingSize={size.matchingClothingSizes[0]}
						missingMeasurements={calculationResult.missingMeasurements}
					/>
				{/each}
			</div>

			<Button click={showExportDialog}>Als CSV herunterladen</Button>
		{:else}
			<p>No results yet.</p>
		{/if}
	</div>

	<ClothingInfo />
</div>

<div class="hidden">
	{#each data.tables as table}
		<a href={`${table.name}/${table.gender}/`}>
			{table.name}, {table.gender}
		</a>
	{/each}
</div>

{#if isExporting}
	<ClothingExportDialog onSubmit={startExport} />
{/if}
