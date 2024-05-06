<script lang="ts">
	import type { PageData } from './$types';
	import Table from '$lib/Table.svelte';
	import {
		humanMeasurementToFriendlyName,
		clothingNameToFriendlyName,
		humanGenderToFriendlyString
	} from '$lib/clothing/clothingUtils';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let data: PageData;
	let selectedSize: number | undefined =
		browser && $page.url.searchParams.has('size')
			? Number($page.url.searchParams.get('size'))
			: undefined;

	function getTableValues() {
		const table = data.table;
		if (!table) return [];

		table.data.sort((a, b) => a.size - b.size);

		return table.data.map((value) => [
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

{#if !data.table}
	<p>Table not found</p>
{:else}
	<div class="p-4 flex flex-col gap-2">
		<div>
			<span class="text-2xl font-bold">{clothingNameToFriendlyName(data.table.name)}</span>
			<span>({data.table.type}, {humanGenderToFriendlyString(data.table.gender)})</span>
		</div>
		<Table
			header={[
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
