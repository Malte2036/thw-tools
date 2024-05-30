<script lang="ts">
	import Input from '$lib/Input.svelte';
	import Select from '$lib/Select.svelte';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import {
		humanGenderToFriendlyString,
		humanMeasurementToFriendlyName
	} from './clothingConstantUtils';
</script>

<span class="text-xl"
	>Hier kannst du die passende Größe für den neuen Einsatzanzug (MEA) finden. Gebe deine Körpermaße
	und dein Geschlecht ein.</span
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
