<script lang="ts">
	import type { InventoryItem } from '$lib/api/inventoryModels';
	import { Table } from '@thw-tools/svelte-components';

	interface Props {
		missingItems: InventoryItem[];
	}

	let { missingItems }: Props = $props();

	const header = ['Inventar Nr.', 'Ausstattung', 'Typ'];

	let values = $derived(
		missingItems.map((item) => [item.inventarNummer ?? '', item.ausstattung ?? '', item.typ ?? ''])
	);
</script>

<div class="mt-4">
	<Table {header} {values} />
</div>
