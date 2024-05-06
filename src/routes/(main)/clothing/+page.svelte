<script lang="ts">
	import Button from '$lib/Button.svelte';
	import Input from '$lib/Input.svelte';
	import LinkButton from '$lib/LinkButton.svelte';
	import Select from '$lib/Select.svelte';
	import ClothingExportDialog from '$lib/clothing/ClothingExportDialog.svelte';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import type {
		ClothingMeasurementImportance,
		ClothingName,
		ClothingSizes,
		HumanMeasurement,
		MatchingClothingSizeTable
	} from '$lib/clothing/clothing';
	import { convertClothingResultsToCSV, exportCSVFile } from '$lib/clothing/clothingExport';
	import type { ClothingInputValue } from '$lib/clothing/clothingInputStore';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import {
		calculateMatchingClothingSizeForTables,
		clothingNameToFriendlyName,
		getMissingMeasurements,
		humanGenderToFriendlyString,
		humanMeasurementToFriendlyName,
		isDeviationAcceptable
	} from '$lib/clothing/clothingUtils';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import type { PageData } from './$types';

	export let data: PageData;

	let calculatedSizes: MatchingClothingSizeTable[];
	let missingMeasurements: Map<ClothingName, HumanMeasurement[]> = new Map<
		ClothingName,
		HumanMeasurement[]
	>();

	function calculate(input: ClothingInputValue) {
		const inputData: Record<HumanMeasurement, number | undefined> = {
			height: input.height.length > 0 ? Number(input.height) : undefined,
			chestCircumference: input.chest.length > 0 ? Number(input.chest) : undefined,
			waistCircumference: input.waist.length > 0 ? Number(input.waist) : undefined,
			hipCircumference: input.hip.length > 0 ? Number(input.hip) : undefined,
			insideLegLength: input.insideLegLength.length > 0 ? Number(input.insideLegLength) : undefined
		};

		missingMeasurements = getMissingMeasurements(data.tables, inputData);

		const sizes = calculateMatchingClothingSizeForTables(data.tables, input.gender, inputData);
		sizes.sort((a, b) => a.name.localeCompare(b.name));

		calculatedSizes = sizes;
	}

	$: calculate($clothingInput);

	function sizeToString(
		humanMeasurement: HumanMeasurement,
		matchingClothingSize: ClothingSizes | undefined,
		measurementImportance: ClothingMeasurementImportance[]
	) {
		const friendlyName = humanMeasurementToFriendlyName(humanMeasurement);
		if (!matchingClothingSize) return `${friendlyName}: -`;

		const sizeValue = matchingClothingSize[humanMeasurement];
		if (!sizeValue) return `${friendlyName}: -`;

		const isToleranceAllowed = isToleranceAllowedInMeasurement(
			humanMeasurement,
			measurementImportance
		);

		if (isToleranceAllowed === false) {
			return `${friendlyName}: ${sizeValue.min} - ${sizeValue.max} cm (genau)`;
		}

		return `${friendlyName}: ${sizeValue.min} - ${sizeValue.max} cm`;
	}

	function isNessaryMeasurement(
		humanMeasurement: HumanMeasurement,
		measurementImportance: ClothingMeasurementImportance[]
	): boolean | undefined {
		const importance = measurementImportance.find(
			(importance) => importance.measurement === humanMeasurement
		);

		return importance !== undefined;
	}

	function isToleranceAllowedInMeasurement(
		humanMeasurement: HumanMeasurement,
		measurementImportance: ClothingMeasurementImportance[]
	): boolean | undefined {
		const importance = measurementImportance.find(
			(importance) => importance.measurement === humanMeasurement
		);
		if (!importance) return undefined;

		return importance.allowTolerance;
	}

	function getTableLink(size: MatchingClothingSizeTable): string {
		let link = `${size.name}/${size.gender}`;
		const matchingClothingSize = size.matchingClothingSizes[0];
		if (matchingClothingSize && isDeviationAcceptable(matchingClothingSize.deviation)) {
			link += `?size=${matchingClothingSize.clothingSize.size}`;
		}

		return link;
	}

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

		const csv = convertClothingResultsToCSV(calculatedSizes, {
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
	<span class="text-xl"
		>Hier kannst du die passende Größe für den neuen Einsatzanzug (MEA) finden. Gebe deine
		Körpermaße und dein Geschlecht ein.</span
	>

	<div class="flex flex-row flex-wrap gap-2">
		<Select
			options={[
				{ value: 'M', label: humanGenderToFriendlyString('M') },
				{ value: 'W', label: humanGenderToFriendlyString('W') }
			]}
			bind:selected={$clothingInput.gender}
			label="Geschlecht"
		/>
		<Input
			bind:inputValue={$clothingInput.height}
			type="number"
			label={humanMeasurementToFriendlyName('height')}
			placeholder={`${humanMeasurementToFriendlyName('height')} in cm`}
		/>
		<Input
			bind:inputValue={$clothingInput.chest}
			type="number"
			label={humanMeasurementToFriendlyName('chestCircumference')}
			placeholder={`${humanMeasurementToFriendlyName('chestCircumference')} in cm`}
		/>
		<Input
			bind:inputValue={$clothingInput.waist}
			type="number"
			label={humanMeasurementToFriendlyName('waistCircumference')}
			placeholder={`${humanMeasurementToFriendlyName('waistCircumference')} in cm`}
		/>
		<Input
			bind:inputValue={$clothingInput.hip}
			type="number"
			label={humanMeasurementToFriendlyName('hipCircumference')}
			placeholder={`${humanMeasurementToFriendlyName('hipCircumference')} in cm`}
		/>
		<Input
			bind:inputValue={$clothingInput.insideLegLength}
			type="number"
			label={humanMeasurementToFriendlyName('insideLegLength')}
			placeholder={`${humanMeasurementToFriendlyName('insideLegLength')} in cm`}
		/>
	</div>

	<div class="flex flex-col gap-2">
		{#if calculatedSizes}
			<div class="font-bold">Es wurden folgende Größen gefunden:</div>
			<div class="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 gap-2">
				{#each calculatedSizes as size (size.name)}
					<div class="flex flex-col justify-between gap-1 border-2 p-2 border-thw rounded-md">
						<div>
							<h2 class="text-xl font-bold">{clothingNameToFriendlyName(size.name)}:</h2>
							{#if size.matchingClothingSizes && isDeviationAcceptable(size.matchingClothingSizes[0].deviation)}
								<div class="flex flex-col gap-2">
									<div>
										<p>Konfektionsgröße: {size.matchingClothingSizes[0].clothingSize.size}</p>
										<p
											class={isNessaryMeasurement('height', size.measurementImportance)
												? 'font-bold'
												: ''}
										>
											{sizeToString(
												'height',
												size.matchingClothingSizes[0].clothingSize,
												size.measurementImportance
											)}
										</p>
										<p
											class={isNessaryMeasurement('chestCircumference', size.measurementImportance)
												? 'font-bold'
												: ''}
										>
											{sizeToString(
												'chestCircumference',
												size.matchingClothingSizes[0].clothingSize,
												size.measurementImportance
											)}
										</p>
										<p
											class={isNessaryMeasurement('waistCircumference', size.measurementImportance)
												? 'font-bold'
												: ''}
										>
											{sizeToString(
												'waistCircumference',
												size.matchingClothingSizes[0].clothingSize,
												size.measurementImportance
											)}
										</p>
										<p
											class={isNessaryMeasurement('hipCircumference', size.measurementImportance)
												? 'font-bold'
												: ''}
										>
											{sizeToString(
												'hipCircumference',
												size.matchingClothingSizes[0].clothingSize,
												size.measurementImportance
											)}
										</p>
										<p
											class={isNessaryMeasurement('insideLegLength', size.measurementImportance)
												? 'font-bold'
												: ''}
										>
											{sizeToString(
												'insideLegLength',
												size.matchingClothingSizes[0].clothingSize,
												size.measurementImportance
											)}
										</p>
									</div>
									<div class="italic text-sm">
										[Abweichung: {size.matchingClothingSizes[0].deviation.toFixed(2)}]
									</div>
								</div>
							{:else if missingMeasurements.has(size.name)}
								<p class="font-bold text-red-500">Fehlende Maße:</p>
								<ul>
									{#each missingMeasurements.get(size.name) ?? [] as missingMeasurement}
										<li>
											{humanMeasurementToFriendlyName(missingMeasurement)}
											{#if isToleranceAllowedInMeasurement(missingMeasurement, size.measurementImportance) === false}
												(genau)
											{/if}
										</li>
									{/each}
								</ul>
							{:else}
								<p>No matching sizes found.</p>
							{/if}
						</div>
						<div>
							<LinkButton url={getTableLink(size)} secondary>Maßtabelle ansehen</LinkButton>
						</div>
					</div>
				{/each}
			</div>
			test
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
						Die Berechnung basiert auf der <a
							href="https://en.wikipedia.org/wiki/Joint_European_standard_for_size_labelling_of_clothes#EN_13402-2:_Primary_and_secondary_dimensions"
							target="_blank"
							rel="noreferrer"
							class="text-thw underline">EN 13402</a
						>
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
