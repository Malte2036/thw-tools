<script lang="ts">
	export let header: string[];
	export let values: string[][];
	export let onValueClick: ((row: string[], index: number) => void) | undefined = undefined;

	export let selectedIndex: number | undefined = undefined;
</script>

<table>
	<thead>
		<tr>
			{#each header as column}
				<th class="border border-slate-600">{column}</th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each values as row, index}
			<tr class="hover:bg-thw-700 hover:text-white cursor-pointer">
				{#each row as column}
					<!-- svelte-ignore a11y-click-events-have-key-events -->

					<td
						class="border border-slate-700"
						class:cursor-pointer={onValueClick}
						class:hover:bg-thw-600={onValueClick}
						class:hover:text-white={onValueClick}
						class:bg-thw-900={selectedIndex === index}
						class:text-white={selectedIndex === index}
						on:click={() => {
							if (!onValueClick) return;

							selectedIndex = index;

							if (onValueClick) {
								onValueClick(row, index);
							}
						}}>{column}</td
					>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
