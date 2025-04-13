<script lang="ts">
	import {
		Button,
		Select,
		Input,
		LoadingSpinner,
		ErrorMessage
	} from '@thw-tools/svelte-components';

	type SelectOption = { value: string; label: string };

	interface Props {
		itemOptions: SelectOption[];
		onSubmit: (itemId: string, count: number) => Promise<void>; // Callback for submission
		isLoading: boolean;
		error: string | null;
	}

	let { itemOptions, onSubmit, isLoading, error }: Props = $props();

	let selectedItemId = $state<string>('');
	let countInput = $state<string>('1'); // Default count to 1
	let count = $state<number>(1);

	// Sync string input with number state
	$effect(() => {
		const num = parseInt(countInput, 10);
		count = isNaN(num) || num < 0 ? 0 : num; // Ensure non-negative
	});

	// Keep input string in sync
	$effect(() => {
		countInput = count.toString();
	});

	async function handleSubmit() {
		if (!selectedItemId) return; // Button should be disabled anyway
		await onSubmit(selectedItemId, count);
		// Optionally reset form here if onSubmit doesn't handle it
		// selectedItemId = '';
		// count = 1;
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
	<div class="md:col-span-2">
		<Select label="Item auswählen" options={itemOptions} bind:selected={selectedItemId} />
	</div>
	<div>
		<Input label="Anzahl" type="number" inputmode="numeric" bind:inputValue={countInput} />
	</div>
</div>
{#if error}
	<ErrorMessage message={error} />
{/if}
<div class="mt-4">
	<Button click={handleSubmit} disabled={isLoading || !selectedItemId}>
		{#if isLoading}
			<LoadingSpinner /> Speichern...
		{:else}
			Anzahl setzen
		{/if}
	</Button>
</div>
