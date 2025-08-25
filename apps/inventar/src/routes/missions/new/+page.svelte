<script lang="ts">
	import { Input, Button } from '@thw-tools/svelte-components';
	import { goto } from '$app/navigation';

	// TODO: Replace with a real API call from missions.service.ts
	async function createMission(data: { name: string; location: string; description: string }) {
		console.log('Creating mission with data:', data);
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 500));
		const newMissionId = 'mock-id-' + Date.now(); // Mock new ID
		return { id: newMissionId };
	}

	let name = '';
	let location = '';
	let description = '';
	let isLoading = false;
	let error: string | null = null;

	async function handleSubmit() {
		isLoading = true;
		error = null;
		try {
			const newMission = await createMission({ name, location, description });
			if (newMission && newMission.id) {
				goto(`/missions/${newMission.id}`);
			} else {
				throw new Error('Die Mission konnte nicht erstellt werden.');
			}
		} catch (e) {
			error = e instanceof Error ? e.message : 'Ein unbekannter Fehler ist aufgetreten';
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="container mx-auto p-4 max-w-2xl">
	<h1 class="text-2xl font-bold mb-4">Neuen Einsatz starten</h1>

	<div class="bg-white shadow rounded-lg p-6">
		<form on:submit|preventDefault={handleSubmit} class="space-y-6">
			<Input
				label="Name des Einsatzes"
				bind:inputValue={name}
				placeholder="z.B. Hochwasser Elbe 2025"
			/>

			<Input label="Ort" bind:inputValue={location} placeholder="z.B. Magdeburg" />

			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1"
					>Beschreibung</label
				>
				<textarea
					id="description"
					bind:value={description}
					class="textarea textarea-bordered w-full"
					rows="4"
					placeholder="Eine kurze Beschreibung des Einsatzes"
				></textarea>
			</div>

			{#if error}
				<div class="alert alert-error">{error}</div>
			{/if}

			<div class="flex justify-end">
				<Button click={handleSubmit}>Einsatz erstellen</Button>
			</div>
		</form>
	</div>
</div>

<svelte:head>
	<title>Neuen Einsatz erstellen</title>
</svelte:head>
