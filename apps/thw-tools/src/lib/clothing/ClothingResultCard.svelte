<script lang="ts">
	import LinkButton from '$lib/LinkButton.svelte';
	import type {
		ClothingMeasurementImportance,
		ClothingName,
		ClothingSizes,
		HumanMeasurement,
		MatchingClothingSizeTable
	} from './clothing';
	import {
		clothingNameToFriendlyName,
		humanMeasurementToFriendlyName
	} from './clothingConstantUtils';
	import { getTableLink, isDeviationAcceptable } from './clothingUtils';

	export let size: MatchingClothingSizeTable;

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
		<h2 class="text-xl font-bold">{clothingNameToFriendlyName(size.name)}:</h2>
		{#if size.matchingClothingSizes && isDeviationAcceptable(size.matchingClothingSizes[0].deviation)}
			<div class="flex flex-col gap-2">
				<div>
					<p>Konfektionsgröße: {size.matchingClothingSizes[0].clothingSize.size}</p>
					<p class={isNessaryMeasurement('height', size.measurementImportance) ? 'font-bold' : ''}>
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
		<LinkButton url={getTableLink(size.name, size.gender, true)} secondary
			>Maßtabelle ansehen</LinkButton
		>
	</div>
</div>
