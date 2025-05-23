<script lang="ts">
	import { LinkButton, LoadingSpinner, Button } from '@thw-tools/svelte-components';
	import VehicleManagement from '$lib/inventar/VehicleManagement.svelte';
	import { fetchVehicles, fetchRentals, createRental, cancelRental } from '$lib/api/vehicleApi';
	import { user } from '$lib/shared/stores/userStore';
	import { vehicles } from '$lib/shared/stores/vehicleStore';
	import { apiMeta } from '$lib/shared/stores/apiMetaStore';
	import { onMount } from 'svelte';
	import { userToFriendlyString } from '$lib/api/funkModels';
	import { bannerMessage } from '$lib/shared/stores/bannerMessage';
	import {
		type CreateVehicleRentalDto,
		type VehicleRental,
		type VehicleId,
		type VehicleRentalId,
		type Vehicle,
		vehicleToFriendlyString
	} from '$lib/api/vehicleModels';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	// Datenstatus
	let rentals = $state<VehicleRental[]>([]);
	let isFetchingRentals = $state(false);
	let errorMessage = $state('');
	let showErrorDialog = $state(false);

	// State variables
	let selectedVehicle = $state<Vehicle | null>(null);

	// Lade die Daten beim Komponenten-Laden
	onMount(async () => {
		try {
			// Lade Fahrzeuge und Ausleihen parallel
			await Promise.all([fetchVehicles(), loadRentals()]);
		} catch (error) {
			console.error('Error loading data:', error);
		}
	});

	// Separate Funktion zum Laden der Ausleihen
	async function loadRentals() {
		try {
			isFetchingRentals = true;
			rentals = await fetchRentals();
		} catch (error) {
			console.error('Error loading rentals:', error);
		} finally {
			isFetchingRentals = false;
		}
	}

	// Event-Handler
	async function handleCreateRental(data: { vehicleId: VehicleId; rental: VehicleRental }) {
		try {
			// Konvertiere in das Backend-Format
			const rentalDto: CreateVehicleRentalDto = {
				vehicleId: data.vehicleId,
				purpose: data.rental.purpose,
				plannedStart:
					data.rental.plannedStart instanceof Date
						? data.rental.plannedStart.toISOString()
						: data.rental.plannedStart,
				plannedEnd:
					data.rental.plannedEnd instanceof Date
						? data.rental.plannedEnd.toISOString()
						: data.rental.plannedEnd
			};

			// Erstelle die Ausleihe über die API
			await createRental(rentalDto);

			// Lade Ausleihen neu, um die Liste zu aktualisieren
			await loadRentals();

			const vehicle = $vehicles.items?.find((v) => v.id === rentalDto.vehicleId);

			// Show success banner
			$bannerMessage = {
				message: `${vehicleToFriendlyString(vehicle)} erfolgreich reserviert für ${new Date(rentalDto.plannedStart).toLocaleDateString('de-DE')} bis ${new Date(rentalDto.plannedEnd).toLocaleDateString('de-DE')}`,
				type: 'info',
				autoDismiss: {
					duration: 5000
				}
			};
		} catch (error) {
			console.error('Error creating rental:', error);
			// Extract error message
			if (error instanceof Error) {
				if (error.message.includes('There are overlapping rentals for this vehicle')) {
					errorMessage =
						'Das Fahrzeug ist in diesem Zeitraum bereits in Verwendung und kann nicht ausgeliehen werden.';
				} else {
					errorMessage = `Fehler beim Erstellen der Ausleihe: ${error.message}`;
				}
				showErrorDialog = true;
			}
		}
	}

	async function handleCancelRental(data: { rentalId: VehicleRentalId; reason: string }) {
		try {
			const { rentalId, reason } = data;

			// Storniere die Ausleihe über die API
			await cancelRental(rentalId, reason);

			// Lade Ausleihen neu, um die Liste zu aktualisieren
			await loadRentals();
		} catch (error) {
			console.error('Error canceling rental:', error);
			// Extract error message
			if (error instanceof Error) {
				errorMessage = `Fehler beim Stornieren der Ausleihe: ${error.message}`;
				showErrorDialog = true;
			}
		}
	}

	function handleRentalCanceled(event: CustomEvent<{ rental: VehicleRental; vehicle: Vehicle }>) {
		const { rental, vehicle } = event.detail;
		// Show success banner
		$bannerMessage = {
			message: `${vehicleToFriendlyString(vehicle)} Reservierung für ${new Date(rental.plannedStart).toLocaleDateString('de-DE')} bis ${new Date(rental.plannedEnd).toLocaleDateString('de-DE')} wurde storniert`,
			type: 'info',
			autoDismiss: {
				duration: 5000
			}
		};
	}

	// In der aktuellen Implementierung ist diese Funktion nicht möglich,
	// da es kein direktes Abschließen einer Ausleihe über die API gibt
	function handleCompleteRental(event: CustomEvent<{ rentalId: string; endKilometer: number }>) {
		// Diese Funktionalität muss später ergänzt werden, wenn die API erweitert wird
		console.log('Complete rental not implemented yet:', event.detail);
	}

	// Formatiere das Datum für die Anzeige
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

	// Check for vehicleId and calendarView in URL on page load
	let initialCalendarView = $state<'month' | 'week' | undefined>(undefined);

	$effect(() => {
		const urlVehicleId = $page.url.searchParams.get('vehicleId');
		const urlCalendarView = $page.url.searchParams.get('view');

		if (urlVehicleId && $vehicles.items) {
			const vehicleFromUrl = $vehicles.items.find((v) => v.id === urlVehicleId);
			if (vehicleFromUrl) {
				selectedVehicle = vehicleFromUrl;
			}
		}

		if (urlCalendarView === 'week' || urlCalendarView === 'month') {
			initialCalendarView = urlCalendarView as 'month' | 'week';
		}
	});

	function handleVehicleSelection(vehicle: Vehicle | null) {
		selectedVehicle = vehicle;
		const url = new URL(window.location.href);

		if (vehicle) {
			url.searchParams.set('vehicleId', vehicle.id);
		} else {
			url.searchParams.delete('vehicleId');
		}

		goto(url.toString(), { replaceState: true });
	}

	function handleCalendarViewChange(view: 'month' | 'week') {
		const url = new URL(window.location.href);
		url.searchParams.set('view', view);
		goto(url.toString(), { replaceState: true });
	}
</script>

<div class="px-4">
	<div class="bg-white rounded-lg shadow-md p-6">
		<div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
			<div>
				<h1 class="text-3xl font-bold text-thw-700">Fahrzeugverwaltung</h1>
				<p class="text-gray-600 mt-1">Verwalte hier die Fahrzeuge und deren Reservierungen.</p>
			</div>
			<div class="flex items-center gap-4">
				<div class="text-sm text-gray-500">
					<span class="font-medium">Letztes Update:</span>
					{lastFetchedStr || 'Noch nicht geladen'}
				</div>
				<LinkButton url="/fahrzeuge/details" secondary>Fahrzeugdetails</LinkButton>
			</div>
		</div>

		{#if $vehicles.fetching || isFetchingRentals}
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
			<VehicleManagement
				vehicles={$vehicles.items.filter((vehicle) => vehicle.canBeReserved !== false)}
				{rentals}
				initialSelectedVehicle={selectedVehicle}
				{initialCalendarView}
				onVehicleSelect={handleVehicleSelection}
				onCalendarViewChange={handleCalendarViewChange}
				onCreateRental={handleCreateRental}
				onCancelRental={handleCancelRental}
				on:rentalCanceled={handleRentalCanceled}
			/>
		{/if}
	</div>
</div>

<!-- Error Dialog -->
{#if showErrorDialog}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
			<h2 class="text-xl font-bold text-red-600 mb-4">Fehler</h2>
			<div class="mb-4">
				<p class="text-gray-800">{errorMessage}</p>
			</div>
			<div class="mt-6 flex justify-end">
				<Button secondary click={() => (showErrorDialog = false)}>Schließen</Button>
			</div>
		</div>
	</div>
{/if}
