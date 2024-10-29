<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		header: string[];
		values: string[][];
		onValueClick?: ((row: string[], index: number) => void) | undefined;
		selectedIndex?: number | undefined;
	}

	let {
		header,
		values,
		onValueClick = undefined,
		selectedIndex = $bindable(undefined)
	}: Props = $props();

	function handleRowClick(row: string[], index: number) {
		if (!onValueClick) return;
		selectedIndex = index;
		onValueClick(row, index);
	}
</script>

<thw-table {header} {values} {onValueClick} {selectedIndex} maxHeight={600}></thw-table>
