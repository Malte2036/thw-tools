<script lang="ts">
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

	function handleRowClick(event: CustomEvent<{ row: string[]; index: number }>) {
		const { row, index } = event.detail;
		selectedIndex = index;
		if (onValueClick) {
			onValueClick(row, index);
		}
	}
</script>

<thw-table {header} {values} {selectedIndex} maxHeight={600} onrow-click={handleRowClick}
></thw-table>
