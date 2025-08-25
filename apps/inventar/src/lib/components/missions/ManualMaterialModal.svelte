<script lang="ts">
	import { Dialog, Input, Button } from '@thw-tools/svelte-components';

	interface Props {
		onClose: () => void;
		onSubmit: (data: { name: string; quantity: number; unit: string }) => Promise<void>;
	}

	let { onClose, onSubmit }: Props = $props();

	let name = '';
	let quantity = '1';
	let unit = 'Stk';
	let isLoading = false;
	let error: string | null = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		try {
			await onSubmit({ name, quantity: parseInt(quantity), unit });
			onClose();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Ein unbekannter Fehler ist aufgetreten.';
		} finally {
			isLoading = false;
		}
	}
</script>

<Dialog title="Gegenstand manuell hinzufügen">
	{#snippet content()}
		<form on:submit|preventDefault={handleSubmit} class="space-y-4">
			<Input label="Name des Gegenstands" bind:inputValue={name} placeholder="z.B. Sandsäcke" />
			<div class="grid grid-cols-2 gap-4">
				<Input label="Menge" type="number" bind:inputValue={quantity} />
				<Input label="Einheit" bind:inputValue={unit} placeholder="z.B. Stk" />
			</div>

			{#if error}
				<div class="alert alert-error">{error}</div>
			{/if}
		</form>
	{/snippet}
	{#snippet footer()}
		<div class="flex justify-end gap-4">
			<Button type="secondary" click={onClose}>Abbrechen</Button>
			<Button type="primary" click={handleSubmit} disabled={isLoading}>Hinzufügen</Button>
		</div>
	{/snippet}
</Dialog>
