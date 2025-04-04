<script lang="ts">
	import { Button } from '@thw-tools/svelte-components';
	import type { CreateVehicleDto } from '$lib/api/vehicleModels';
	import { inventory } from '$lib/shared/stores/inventoryStore';

	const props = $props<{
		isOpen?: boolean;
		isSubmitting?: boolean;
		errorMessage?: string;
		onClose?: () => void;
		onSubmit?: (data: CreateVehicleDto) => void;
		onError?: (message: string) => void;
	}>();

	// Form data
	let licensePlate = $state('');
	let vehicleType = $state('');
	let radioCallName = $state('');
	let unit = $state('');
	let name = $state('');

	// Common THW vehicle types
	const vehicleTypes = ['MTW', 'MzKw', 'GKW', 'MLW', 'Kipper', 'Anhänger', 'Sonstige'];

	// Default einheiten as fallback
	const defaultEinheiten = ['Sonstige'];

	// Close the dialog
	function close() {
		if (props.onClose) props.onClose();
	}

	// Reset the form
	function resetForm() {
		licensePlate = '';
		vehicleType = '';
		radioCallName = '';
		unit = '';
		name = '';
	}

	// Create a new vehicle
	function submitForm() {
		if (!licensePlate || !vehicleType || !radioCallName || !unit || !name) {
			if (props.onError) props.onError('Bitte fülle alle Pflichtfelder aus.');
			return;
		}

		const vehicleData: CreateVehicleDto = {
			name,
			licensePlate,
			vehicleType,
			radioCallName,
			unit
		};

		if (props.onSubmit) props.onSubmit(vehicleData);
	}

	// When dialog closes, reset the form
	$effect(() => {
		if (!props.isOpen) {
			resetForm();
		}
	});

	// Get unique einheiten from inventory items
	function getUniqueEinheiten() {
		if (!$inventory.inventoryItems) return defaultEinheiten;

		// Extract all unique einheiten from inventory items
		const uniqueEinheiten = [
			...defaultEinheiten,
			...new Set($inventory.inventoryItems.map((item) => item.einheit))
		];

		// Sort alphabetically
		return uniqueEinheiten.sort();
	}
</script>

{#if props.isOpen}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
			<h2 class="text-xl font-bold text-thw-700 mb-4">Neues Fahrzeug hinzufügen</h2>

			<form on:submit|preventDefault={submitForm} class="space-y-4">
				<div>
					<label for="name" class="block text-sm font-medium text-gray-700 mb-1"> Name* </label>
					<input
						id="name"
						type="text"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
						bind:value={name}
						placeholder="z.B. MTW OV Stab"
						required
					/>
				</div>

				<div>
					<label for="licensePlate" class="block text-sm font-medium text-gray-700 mb-1">
						Kennzeichen*
					</label>
					<input
						id="licensePlate"
						type="text"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
						bind:value={licensePlate}
						placeholder="z.B. THW-12345"
						required
					/>
				</div>

				<div>
					<label for="vehicleType" class="block text-sm font-medium text-gray-700 mb-1">
						Fahrzeugtyp*
					</label>
					<select
						id="vehicleType"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
						bind:value={vehicleType}
						required
					>
						<option value="" disabled selected>Bitte auswählen</option>
						{#each vehicleTypes as type}
							<option value={type}>{type}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="radioCallName" class="block text-sm font-medium text-gray-700 mb-1">
						Funkrufname*
					</label>
					<input
						id="radioCallName"
						type="text"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
						bind:value={radioCallName}
						placeholder="z.B. Heros 86/25"
						required
					/>
				</div>

				<div>
					<label for="unit" class="block text-sm font-medium text-gray-700 mb-1">
						Einheit/Bereich*
					</label>
					<select
						id="unit"
						class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-thw-500"
						bind:value={unit}
						required
					>
						<option value="" disabled selected>Bitte auswählen</option>
						{#each getUniqueEinheiten() as einheit}
							<option value={einheit}>{einheit}</option>
						{/each}
					</select>
				</div>

				{#if props.errorMessage}
					<div class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-md">
						{props.errorMessage}
					</div>
				{/if}

				<div class="flex justify-end gap-3 pt-2">
					<Button secondary={true} disabled={props.isSubmitting} click={close}>Abbrechen</Button>

					<Button secondary={false} disabled={props.isSubmitting} click={submitForm}>
						{#if props.isSubmitting}
							<span class="inline-block animate-spin mr-2">⟳</span>
						{/if}
						Fahrzeug erstellen
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}
