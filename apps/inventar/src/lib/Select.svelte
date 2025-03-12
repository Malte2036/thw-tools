<script lang="ts">
	interface Props {
		options: { value: string; label: string }[];
		selected: string;
		label?: string | undefined;
		onSelect?: (value: string) => void;
	}

	let {
		options,
		selected = $bindable(),
		label = undefined,
		onSelect = undefined
	}: Props = $props();

	function handleSelect(event: Event) {
		const target = event.target as HTMLSelectElement;
		if (onSelect) {
			onSelect(target.value);
		}
	}
</script>

<div class="flex flex-col gap-1">
	{#if label !== undefined}
		<label class="font-bold" for="selectField">{label}</label>
	{/if}
	<select
		bind:value={selected}
		class="border border-black rounded-lg py-1 px-2"
		id="selectField"
		onchange={handleSelect}
	>
		{#each options as option (option)}
			<option value={option.value}>{option.label}</option>
		{/each}
	</select>
</div>
