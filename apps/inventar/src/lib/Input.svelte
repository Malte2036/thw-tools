<script lang="ts">
	export let inputValue: string;

	export let label: string | undefined = undefined;
	export let placeholder: string | undefined = undefined;
</script>

<div class="flex flex-col gap-1">
	{#if label !== undefined}
		<label class="font-bold" for="inputField">{label}</label>
	{/if}

	<input
		class="border border-black rounded-lg py-1 px-2"
		id="inputField"
		bind:value={inputValue}
		{placeholder}
	/>
</div>
