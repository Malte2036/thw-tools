<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import type {
		ClothingMeasurementImportance,
		ClothingName,
		ClothingSizes,
		ClothingSizesTable,
		HumanMeasurement,
		MatchingClothingSize,
		MatchingClothingSizeTable
	} from './clothing';
	import {
		clothingNameToFriendlyName,
		humanMeasurementToFriendlyName
	} from './clothingConstantUtils';
	import { getTableLink, isDeviationAcceptable } from './clothingUtils';

	export let clothingSizesTable: ClothingSizesTable;
	export let matchingClothingSize: MatchingClothingSize;
	export let showButton = true;

	export let missingMeasurements: Map<ClothingName, HumanMeasurement[]> = new Map();

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
</script>

<div class="flex flex-col justify-between gap-1 border-2 p-2 border-thw rounded-md">
	<div>
		<h2 class="text-xl font-bold">{clothingNameToFriendlyName(clothingSizesTable.name)}:</h2>
		{#if isDeviationAcceptable(matchingClothingSize.deviation)}
			<div class="flex flex-col gap-2">
				<div>
					<p>Konfektionsgröße: {matchingClothingSize.clothingSize.size}</p>
					<p
						class={isNessaryMeasurement('height', clothingSizesTable.measurementImportance)
							? 'font-bold'
							: ''}
					>
						{sizeToString(
							'height',
							matchingClothingSize.clothingSize,
							clothingSizesTable.measurementImportance
						)}
					</p>
					<p
						class={isNessaryMeasurement(
							'chestCircumference',
							clothingSizesTable.measurementImportance
						)
							? 'font-bold'
							: ''}
					>
						{sizeToString(
							'chestCircumference',
							matchingClothingSize.clothingSize,
							clothingSizesTable.measurementImportance
						)}
					</p>
					<p
						class={isNessaryMeasurement(
							'waistCircumference',
							clothingSizesTable.measurementImportance
						)
							? 'font-bold'
							: ''}
					>
						{sizeToString(
							'waistCircumference',
							matchingClothingSize.clothingSize,
							clothingSizesTable.measurementImportance
						)}
					</p>
					<p
						class={isNessaryMeasurement(
							'hipCircumference',
							clothingSizesTable.measurementImportance
						)
							? 'font-bold'
							: ''}
					>
						{sizeToString(
							'hipCircumference',
							matchingClothingSize.clothingSize,
							clothingSizesTable.measurementImportance
						)}
					</p>
					<p
						class={isNessaryMeasurement('insideLegLength', clothingSizesTable.measurementImportance)
							? 'font-bold'
							: ''}
					>
						{sizeToString(
							'insideLegLength',
							matchingClothingSize.clothingSize,
							clothingSizesTable.measurementImportance
						)}
					</p>
				</div>
				<div class="italic text-sm">
					[Abweichung: {matchingClothingSize.deviation.toFixed(2)}]
				</div>
			</div>
		{:else if missingMeasurements.has(clothingSizesTable.name)}
			<p class="font-bold text-red-500">Fehlende Maße:</p>
			<ul>
				{#each missingMeasurements.get(clothingSizesTable.name) ?? [] as missingMeasurement}
					<li>
						{humanMeasurementToFriendlyName(missingMeasurement)}
						{#if isToleranceAllowedInMeasurement(missingMeasurement, clothingSizesTable.measurementImportance) === false}
							(genau)
						{/if}
					</li>
				{/each}
			</ul>
		{:else}
			<p>No matching sizes found.</p>
		{/if}
	</div>
	{#if showButton}
		<div class="flex flex-col gap-2">
			<LinkButton
				url={getTableLink(clothingSizesTable.name, clothingSizesTable.gender, true)}
				secondary>Weitere Ergebnisse ansehen</LinkButton
			>
			<LinkButton
				url={getTableLink(clothingSizesTable.name, clothingSizesTable.gender, false)}
				secondary>Maßtabelle ansehen</LinkButton
			>
		</div>
	{/if}
</div>
