<script lang="ts">
	import type { PageData } from './$types';
	import Table from '$lib/Table.svelte';
	import {
		humanMeasurementToFriendlyName,
		clothingNameToFriendlyName,
		humanGenderToFriendlyString
	} from '$lib/clothing/clothingConstantUtils';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import ClothingHead from '$lib/clothing/ClothingHead.svelte';
	import { clothingInput } from '$lib/clothing/clothingInputStore';
	import LinkButton from '$lib/LinkButton.svelte';

	export let data: PageData;
	let selectedSize: string | undefined =
		browser && $page.url.searchParams.has('size')
			? $page.url.searchParams.get('size')?.toString()
			: undefined;

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
			{#if $clothingInput.height || $clothingInput.chest || $clothingInput.waist || $clothingInput.hip || $clothingInput.insideLegLength}
				<div>
					<span class="font-bold">Deine eingegebenen Maße:</span>
					{#if $clothingInput.height}
						<span>{humanMeasurementToFriendlyName('height')}: {$clothingInput.height} cm,</span>
					{/if}
					{#if $clothingInput.chest}
						<span
							>{humanMeasurementToFriendlyName('chestCircumference')}: {$clothingInput.chest} cm,</span
						>
					{/if}
					{#if $clothingInput.waist}
						<span
							>{humanMeasurementToFriendlyName('waistCircumference')}: {$clothingInput.waist} cm,</span
						>
					{/if}
					{#if $clothingInput.hip}
						<span
							>{humanMeasurementToFriendlyName('hipCircumference')}: {$clothingInput.hip} cm,</span
						>
					{/if}
					{#if $clothingInput.insideLegLength}
						<span
							>{humanMeasurementToFriendlyName('insideLegLength')}: {$clothingInput.insideLegLength}
							cm,</span
						>
					{/if}
				</div>
			{/if}
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
			selectedIndex={data.table.data.findIndex((value) => value.size === selectedSize)}
		/>
	</div>
{/if}
