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

	interface Props {
		header: string[];
		values: TableCell[][];
		onValueClick?: ((row: TableCell[], index: number) => void) | undefined;
		selectedIndex?: number | undefined;
	}

	let {
		header,
		values,
		onValueClick = undefined,
		selectedIndex = $bindable(undefined)
	}: Props = $props();

	function handleRowClick(event: CustomEvent<{ row: TableCell[]; index: number }>) {
		const { row, index } = event.detail;
		selectedIndex = index;
		if (onValueClick) {
			onValueClick(row, index);
		}
	}
</script>

<thw-table {header} {values} {selectedIndex} maxHeight={600} onrow-click={handleRowClick}
></thw-table>
