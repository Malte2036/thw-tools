<script lang="ts">
	import Button from '$lib/Button.svelte';
	import ClothingExportDialog from '$lib/clothing/ClothingExportDialog.svelte';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import ClothingResultCard from '$lib/clothing/ClothingResultCard.svelte';
	import ClothingSizesInput from '$lib/clothing/ClothingSizesInput.svelte';
	import type {
		ClothingName,
		HumanMeasurement,
		MatchingClothingSizeTable
	} from '$lib/clothing/clothing';
	import { clothingNameToFriendlyName } from '$lib/clothing/clothingConstantUtils';
	import { convertClothingResultsToCSV, exportCSVFile } from '$lib/clothing/clothingExport';
	import type { ClothingInputValue } from '$lib/clothing/clothingInputStore';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import {
		calculateMatchingClothingSizeForTables,
		calculateMatchingClothingSizesForInput
	} from '$lib/clothing/clothingUtils';
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
					<ClothingResultCard {size} missingMeasurements={calculationResult.missingMeasurements} />
				{/each}
			</div>

			<Button click={showExportDialog}>Als CSV herunterladen</Button>

			<div class="px-8">
				<span class="font-bold">Info:</span>
				<ul class="list-disc">
					<li>
						Die fettgedruckten Maße im Ergebnis eines Kleidungsstücks sind zwingend notwendig für
						die Größenberechnung.
					</li>
					<li>
						Die anderen (nicht dickgedruckten) Maße fließen nicht in die Berechnung der Größe ein.
					</li>
					<li>
						Die Angabe "Abweichung" gibt an, wie stark die Maße von den eingegebenen Maßen
						abweichen. Eine Abweichung von 0 bedeutet, dass die Maße exakt übereinstimmen. Falls die
						Abweichung größer als 0 ist, kann es sein, dass die Kleidung nicht optimal passt, und
						man sich für eine "Nachbargröße" entscheiden sollte (siehe Maßtabelle).
					</li>
					<li>
						Die Berechnung basiert grundlegend auf der <a
							href="https://en.wikipedia.org/wiki/Joint_European_standard_for_size_labelling_of_clothes#EN_13402-2:_Primary_and_secondary_dimensions"
							target="_blank"
							rel="noreferrer"
							class="text-thw underline">EN 13402</a
						>. Es wurden jedoch einige Anpassungen vorgenommen, um die Ergebnisse zu optimieren.
						Beispielsweise sollte die
						{clothingNameToFriendlyName('EA_U')}, falls es keine passende Größe gibt, eher etwas
						länger als zu kurz sein.
					</li>
				</ul>
			</div>
		{:else}
			<p>No results yet.</p>
		{/if}
	</div>

	<img src="/clothing/measurement.png" alt="Größentabelle" class="w-full md:w-1/2 mx-auto" />
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
