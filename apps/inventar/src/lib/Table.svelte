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

	type TableRow = Record<string, string>;

	const data: TableRow[] = values.map((row) => {
		const obj: TableRow = {};
		header.forEach((key, index) => {
			obj[key] = row[index];
		});
		return obj;
	});

	function handleRowClick(row: TableRow, index: number) {
		if (!onValueClick) return;
		selectedIndex = index;
		const rowArray = header.map((key) => row[key]);
		onValueClick(rowArray, index);
	}
</script>

<div class="overflow-x-auto">
	<div class="max-h-[600px] overflow-auto">
		<table class="min-w-full table-auto border-collapse bg-white shadow-sm rounded-lg">
			<thead>
				<tr class="bg-thw-100">
					{#each header as title}
						<th class="px-4 py-2 text-left text-thw-900 font-semibold border-b border-thw-200">
							{title}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each data as row, index}
					<tr
						class="border-b border-thw-100 transition-colors"
						class:hover:bg-thw-50={!onValueClick}
						class:hover:bg-thw-600={onValueClick}
						class:hover:text-white={onValueClick}
						class:cursor-pointer={onValueClick}
						class:bg-thw-700={selectedIndex === index}
						class:text-white={selectedIndex === index}
						onclick={() => handleRowClick(row, index)}
					>
						{#each header as key}
							<td class="px-4 py-2">
								{row[key]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	table {
		border-spacing: 0;
	}

	/* Round corners of first and last header cells */
	th:first-child {
		border-top-left-radius: 0.5rem;
	}
	th:last-child {
		border-top-right-radius: 0.5rem;
	}
</style>