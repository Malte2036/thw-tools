<script lang="ts">
	export let header: string[];
	export let values: string[][];
	export let onValueClick: ((value: string) => void) | undefined = undefined;

	let selectedIndex: number | undefined = undefined;
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
			<tr>
				{#each row as column}
					<!-- svelte-ignore a11y-click-events-have-key-events -->

					<td
						class="border border-slate-700"
						class:cursor-pointer={onValueClick}
						class:hover:bg-thw-900={onValueClick}
						class:hover:text-white={onValueClick}
						class:bg-thw-900={selectedIndex === index}
						class:text-white={selectedIndex === index}
						on:click={() => {
							selectedIndex = index;

							if (onValueClick) {
								onValueClick(column);
							}
						}}>{column}</td
					>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
