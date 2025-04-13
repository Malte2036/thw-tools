<script lang="ts">
	import { Table } from '@thw-tools/svelte-components';

	interface Props {
		header: string[];
		values: string[][];
	}

	let { header, values }: Props = $props();
</script>

{#if values.length > 0}
	<!-- Pass header and values directly -->
	<Table {header} {values} />
{:else}
	<p class="text-gray-500">Noch keine Geräte erfasst.</p>
{/if}
