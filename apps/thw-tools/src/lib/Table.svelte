<script lang="ts">
	export let header: string[];
	export let values: string[][];
	export let onValueClick: ((row: string[], index: number) => void) | undefined = undefined;
	export let selectedIndex: number | undefined = undefined;
</script>

<thw-table {header} {values} {onValueClick} {selectedIndex} maxHeight={600}></thw-table>
