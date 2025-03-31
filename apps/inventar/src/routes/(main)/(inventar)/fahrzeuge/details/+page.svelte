<script lang="ts">
	import { LinkButton, LoadingSpinner, Button } from '@thw-tools/svelte-components';
	import { fetchVehicles } from '$lib/api/vehicleApi';
	import { vehicles } from '$lib/shared/stores/vehicleStore';
	import { apiMeta } from '$lib/shared/stores/apiMetaStore';
	import { onMount } from 'svelte';
	import { vehicleToFriendlyString, type Vehicle } from '$lib/api/vehicleModels';
	import { goto } from '$app/navigation';

	// State variables
	let searchTerm = $state<string>('');
	let sortBy = $state<keyof Vehicle>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');
	let selectedVehicle = $state<Vehicle | null>(null);
	let showDetailsDialog = $state(false);

	onMount(async () => {
		try {
			// Load vehicles data
			await fetchVehicles();
		} catch (error) {
			console.error('Error loading data:', error);
		}
	});

	// Filtered and sorted vehicles list
	let filteredVehicles = $derived(
		$vehicles.items
			? $vehicles.items.filter((vehicle) => {
					if (!searchTerm) return true;
					const term = searchTerm.toLowerCase();
					return (
						vehicle.name.toLowerCase().includes(term) ||
						vehicle.radioCallName?.toLowerCase().includes(term) ||
						vehicle.licensePlate.toLowerCase().includes(term) ||
						vehicle.vehicleType.toLowerCase().includes(term) ||
						vehicle.unit?.toLowerCase().includes(term)
					);
				})
			: []
	);

	let sortedVehicles = $derived(
		[...filteredVehicles].sort((a, b) => {
			const aValue = a[sortBy];
			const bValue = b[sortBy];

			// Handle null/undefined values
			if (aValue === null || aValue === undefined) return sortDirection === 'asc' ? -1 : 1;
			if (bValue === null || bValue === undefined) return sortDirection === 'asc' ? 1 : -1;

			// String comparison
			if (typeof aValue === 'string' && typeof bValue === 'string') {
				return sortDirection === 'asc'
					? aValue.localeCompare(bValue)
					: bValue.localeCompare(aValue);
			}

			// Number comparison
			if (typeof aValue === 'number' && typeof bValue === 'number') {
				return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
			}

			// Default comparison
			return 0;
		})
	);

	function handleSort(column: keyof Vehicle) {
		if (sortBy === column) {
			// Toggle direction if same column
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			// New column, default to ascending
			sortBy = column;
			sortDirection = 'asc';
		}
	}

	function handleViewReservations(vehicleId: string) {
		goto(`/fahrzeuge?vehicleId=${vehicleId}`);
	}

	function openDetailsDialog(vehicle: Vehicle) {
		selectedVehicle = vehicle;
		showDetailsDialog = true;
	}

	function closeDetailsDialog() {
		showDetailsDialog = false;
	}

	// Format the date for the display
	let lastFetchedStr = $derived(
		$apiMeta.lastFetched['vehicles']?.toLocaleString('de-DE', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric'
		})
	);

	// Format a boolean value as "Ja" or "Nein"
	function formatBoolean(value: boolean | null | undefined): string {
		if (value === null || value === undefined) return 'Nein';
		return value ? 'Ja' : 'Nein';
	}
</script>

<div class="px-4">
	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
			<div>
				<h1 class="text-3xl font-bold text-thw-700">Fahrzeugübersicht</h1>
				<p class="text-gray-600 mt-1">Detaillierte Übersicht aller Fahrzeuge</p>
			</div>

			<div class="flex items-center gap-4">
				<div class="text-sm text-gray-500">
					<span class="font-medium">Letztes Update:</span>
					{lastFetchedStr || 'Noch nicht geladen'}
				</div>
				<LinkButton url="/fahrzeuge" secondary>Zurück zur Reservierung</LinkButton>
			</div>
		</div>

		<div class="mb-4">
			<div class="relative">
				<input
					type="text"
					placeholder="Fahrzeug suchen..."
					class="w-full p-2 pl-10 border border-gray-300 rounded-lg"
					bind:value={searchTerm}
				/>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
			</div>
		</div>

		{#if $vehicles.fetching}
			<div class="flex justify-center py-12">
				<LoadingSpinner />
			</div>
		{:else if !$vehicles.items || $vehicles.items.length === 0}
			<div class="bg-gray-50 rounded-lg p-12 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 mx-auto text-gray-400 mb-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<p class="text-xl text-gray-600 font-medium">Keine Fahrzeuge gefunden.</p>
				<p class="text-gray-500 mt-2">
					Es wurden keine Fahrzeuge für Ihre Organisation gefunden. Neue Fahrzeuge können im
					Administrationsbereich unter "Organisation" hinzugefügt werden.
				</p>
			</div>
		{:else}
			<div class="overflow-x-auto mt-2">
				<table class="min-w-full border-collapse">
					<thead>
						<tr class="text-left bg-gray-50 border-b border-gray-200">
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('name')}
							>
								<div class="flex items-center">
									Name
									{#if sortBy === 'name'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('licensePlate')}
							>
								<div class="flex items-center">
									Kennzeichen
									{#if sortBy === 'licensePlate'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('radioCallName')}
							>
								<div class="flex items-center">
									Funkrufname
									{#if sortBy === 'radioCallName'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('vehicleType')}
							>
								<div class="flex items-center">
									Typ
									{#if sortBy === 'vehicleType'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('unit')}
							>
								<div class="flex items-center">
									Einheit
									{#if sortBy === 'unit'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th
								class="px-4 py-3 text-xs font-medium text-gray-500 uppercase cursor-pointer"
								on:click={() => handleSort('canBeReserved')}
							>
								<div class="flex items-center">
									Reservierbar
									{#if sortBy === 'canBeReserved'}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4 ml-1"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											{#if sortDirection === 'asc'}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M5 15l7-7 7 7"
												/>
											{:else}
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M19 9l-7 7-7-7"
												/>
											{/if}
										</svg>
									{/if}
								</div>
							</th>
							<th class="px-4 py-3 text-xs font-medium text-gray-500 uppercase">Aktionen</th>
						</tr>
					</thead>
					<tbody>
						{#each sortedVehicles as vehicle}
							<tr class="border-b border-gray-200 hover:bg-gray-50">
								<td class="px-4 py-3">{vehicle.name}</td>
								<td class="px-4 py-3">{vehicle.licensePlate}</td>
								<td class="px-4 py-3">{vehicle.radioCallName || '-'}</td>
								<td class="px-4 py-3">{vehicle.vehicleType}</td>
								<td class="px-4 py-3">{vehicle.unit || '-'}</td>
								<td
									class="px-4 py-3"
									class:text-green-600={vehicle.canBeReserved}
									class:text-red-600={!vehicle.canBeReserved}
								>
									{formatBoolean(vehicle.canBeReserved)}
								</td>
								<td class="px-4 py-3">
									<div class="flex space-x-2">
										<Button
											secondary
											click={() => handleViewReservations(vehicle.id)}
											disabled={!vehicle.canBeReserved}
											size="small"
										>
											Reservierungen
										</Button>
										<Button size="small" click={() => openDetailsDialog(vehicle)}>Details</Button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</div>
</div>

<!-- Vehicle Details Dialog -->
{#if showDetailsDialog && selectedVehicle}
	<div
		class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto"
	>
		<div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
			<div
				class="sticky top-0 bg-thw-50 p-4 border-b border-thw-100 rounded-t-lg flex justify-between items-center"
			>
				<h2 class="text-xl font-bold text-thw-700">
					Fahrzeugdetails: {vehicleToFriendlyString(selectedVehicle)}
				</h2>
				<button class="text-gray-500 hover:text-gray-700" on:click={closeDetailsDialog}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<div class="p-6">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<!-- Left Column -->
					<div>
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<h4 class="text-sm font-medium text-gray-500 mb-1">Grunddaten</h4>
								<div class="space-y-2">
									<p>
										<span class="font-medium">Kennzeichen:</span>
										{selectedVehicle.licensePlate}
									</p>
									<p>
										<span class="font-medium">Funkrufname:</span>
										{selectedVehicle.radioCallName || '-'}
									</p>
									<p>
										<span class="font-medium">Fahrzeugtyp:</span>
										{selectedVehicle.vehicleType}
									</p>
									<p>
										<span class="font-medium">Einheit:</span>
										{selectedVehicle.unit || '-'}
									</p>
									<p class={selectedVehicle.canBeReserved ? 'text-green-600' : 'text-red-600'}>
										<span class="font-medium">Reservierbar:</span>
										{formatBoolean(selectedVehicle.canBeReserved)}
									</p>
								</div>
							</div>

							<div>
								<h4 class="text-sm font-medium text-gray-500 mb-1">Fahrzeugdaten</h4>
								<div class="space-y-2">
									<p>
										<span class="font-medium">Baujahr:</span>
										{selectedVehicle.yearBuilt || '-'}
									</p>
									<p>
										<span class="font-medium">Hersteller:</span>
										{selectedVehicle.bodyManufacturer || '-'}
									</p>
									<p>
										<span class="font-medium">Fahrgestell:</span>
										{selectedVehicle.chassis || '-'}
									</p>
									<p>
										<span class="font-medium">Aufbautyp:</span>
										{selectedVehicle.bodyType || '-'}
									</p>
								</div>
							</div>
						</div>
					</div>

					<!-- Right Column -->
					<div>
						<h4 class="text-sm font-medium text-gray-500 mb-1">Technische Daten</h4>
						<div class="space-y-2">
							<p>
								<span class="font-medium">Sitze:</span>
								{selectedVehicle.seats || '-'}
							</p>
							<p>
								<span class="font-medium">Gesamtgewicht:</span>
								{selectedVehicle.totalWeight || '-'}
							</p>
							<p>
								<span class="font-medium">Nutzlast:</span>
								{selectedVehicle.payload || '-'}
							</p>
							<p>
								<span class="font-medium">Ladung:</span>
								{selectedVehicle.load || '-'}
							</p>
						</div>

						{#if selectedVehicle.specialFeatures}
							<h4 class="text-sm font-medium text-gray-500 mt-4 mb-1">Besonderheiten</h4>
							<p class="whitespace-pre-line">{selectedVehicle.specialFeatures}</p>
						{/if}
					</div>
				</div>

				<div class="mt-6 flex justify-end space-x-2">
					<Button secondary click={closeDetailsDialog}>Schließen</Button>

					{#if selectedVehicle.canBeReserved}
						<Button click={() => handleViewReservations(selectedVehicle.id)}>
							Reservierungskalender öffnen
						</Button>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
