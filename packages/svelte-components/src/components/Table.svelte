<script lang="ts">
	import type { SvelteComponent } from 'svelte';

	type TableCell =
		| string
		| HTMLElement
		| SvelteComponent
		| {
				component: typeof SvelteComponent;
				props: Record<string, any>;
		  };

	let {
		header = [],
		values = [],
		onValueClick = undefined,
		selectedIndex = $bindable(undefined),
		height = 600
	} = $props<{
		header: string[];
		values: TableCell[][];
		onValueClick?: ((row: TableCell[], index: number) => void) | undefined;
		selectedIndex?: number | undefined;
		height?: number;
	}>();

	function handleRowClick(event: CustomEvent<{ row: TableCell[]; index: number }>) {
		const { row, index } = event.detail;
		selectedIndex = index;
		if (onValueClick) {
			onValueClick(row, index);
		}
	}
</script>

<thw-table {header} {values} {selectedIndex} {height} onrow-click={handleRowClick}></thw-table> 