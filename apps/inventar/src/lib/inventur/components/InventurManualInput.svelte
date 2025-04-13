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
		onSubmit: (itemId: string, increaseBy: number) => Promise<void>;
		isLoading: boolean;
		error: string | null;
	}

	let { itemOptions, onSubmit, isLoading, error }: Props = $props();

	let selectedItemId = $state<string>('');
	let increaseByInput = $state<string>('1');
	let increaseBy = $state<number>(1);

	$effect(() => {
		const num = parseInt(increaseByInput, 10);
		increaseBy = isNaN(num) || num < 0 ? 0 : num;
	});

	$effect(() => {
		increaseByInput = increaseBy.toString();
	});

	async function handleSubmit() {
		if (!selectedItemId) return;
		await onSubmit(selectedItemId, increaseBy);
	}
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
	<div class="md:col-span-2">
		<Select label="Item auswählen" options={itemOptions} bind:selected={selectedItemId} />
	</div>
	<div>
		<Input label="Erhöhen um" type="number" inputmode="numeric" bind:inputValue={increaseByInput} />
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
			Anzahl erhöhen
		{/if}
	</Button>
</div>
