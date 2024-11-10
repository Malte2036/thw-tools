<script lang="ts">
	export let header: string[];
	export let values: string[][];
	export let onValueClick: ((row: string[], index: number) => void) | undefined = undefined;
	export let selectedIndex: number | undefined = undefined;

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
