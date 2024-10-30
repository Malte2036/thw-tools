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
</script>

<thw-table {header} {values} {onValueClick} {selectedIndex} maxHeight={600}></thw-table>
