<script lang="ts">
	import { inventurStore } from '$lib/inventur/stores/inventur.store';
	import { inventory } from '$lib/shared/stores/inventoryStore';
	import { Button, Select, LoadingSpinner, ErrorMessage } from '@thw-tools/svelte-components';
	import Card from '$lib/Card.svelte';
	import { derived } from 'svelte/store';

	let einheit = '';
	let isSubmitting = false;

	const einheitOptions = derived(inventory, ($inventory) => {
		if (!$inventory.inventoryItems) return [];
		const uniqueEinheiten = [
			...new Set($inventory.inventoryItems.map((item) => item.einheit))
		];
		return uniqueEinheiten.map((e) => ({ value: e, label: e }));
	});

	async function handleSubmit() {
		if (!einheit) {
			inventurStore.setError('Bitte eine Einheit auswählen.');
			return;
		}
		inventurStore.setError(null);
		isSubmitting = true;
		await inventurStore.startNewInventur({ einheit });
		isSubmitting = false;
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="text-2xl font-bold mb-4">Inventur Modus</h1>

	{#if $inventurStore.activeSession}
		{@const session = $inventurStore.activeSession}
		<Card title="Aktive Inventur">
			{#snippet children()}
				<p>Session ID: {session.id}</p>
				<p>Einheit: {session.einheit}</p>
				<p>Gestartet: {new Date(session.startTime).toLocaleString()}</p>
				<a href={`/inventar/inventur/${session.id}`}>
					<Button>Zur Inventur</Button>
				</a>
			{/snippet}
		</Card>
	{:else}
		<Card title="Neue Inventur starten">
			{#snippet children()}
				<div class="flex flex-col gap-4">
					<Select
						label="Einheit auswählen"
						options={$einheitOptions}
						bind:selected={einheit}
					/>

					{#if $inventurStore.error}
						<ErrorMessage message={$inventurStore.error} />
					{/if}

					<Button 
						click={handleSubmit} 
						disabled={isSubmitting || $inventurStore.isLoading || !einheit}
					>
						{#if isSubmitting || $inventurStore.isLoading}
							<LoadingSpinner /> Startet...
						{:else}
							Inventur starten
						{/if}
					</Button>
				</div>
			{/snippet}
		</Card>
	{/if}
</div> 