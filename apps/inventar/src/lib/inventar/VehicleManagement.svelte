<script lang="ts">
	import { Calendar, Button } from '@thw-tools/svelte-components';
	import type { Vehicle, VehicleRental, VehicleId, VehicleRentalId } from '$lib/api/vehicleModels';
	import { getUserById, user } from '$lib/shared/stores/userStore';
	import { userToFriendlyString } from '$lib/api/funkModels';
	import { getMediumColor } from '@thw-tools/shared';
	import { vehicleToFriendlyString } from '$lib/api/vehicleModels';
	import { createEventDispatcher } from 'svelte';
	// Define props using the new $props() syntax
	const {
		vehicles = [],
		rentals = [],
		initialSelectedVehicle = null,
		initialCalendarView = undefined,
		onCreateRental = () => {},
		onCancelRental = () => {},
		onVehicleSelect = () => {},
		onCalendarViewChange = () => {}
	} = $props<{
		vehicles: Vehicle[];
		rentals: VehicleRental[];
		initialSelectedVehicle?: Vehicle | null;
		initialCalendarView?: 'month' | 'week' | undefined;
		onCreateRental?: (data: { vehicleId: VehicleId; rental: VehicleRental }) => void;
		onCancelRental?: (data: { rentalId: VehicleRentalId; reason: string }) => void;
		onVehicleSelect?: (vehicle: Vehicle | null) => void;
		onCalendarViewChange?: (view: 'month' | 'week') => void;
	}>();

	let selectedVehicle = $state<Vehicle | null>(initialSelectedVehicle);
	let showRentalDialog = $state(false);
	let showCancelDialog = $state(false);
	let selectedRental = $state<VehicleRental | null>(null);
	let calendarView = $state<'month' | 'week' | undefined>(initialCalendarView);
	let selectedDate = $state<Date | null>(null);

	// Form states
	let newRental = $state({
		startDate: new Date(),
		endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default end date is tomorrow
		purpose: ''
	});

	// Format the dates properly for the datetime-local inputs
	const formattedStart = $derived(formatDateForInput(newRental.startDate));
	const formattedEnd = $derived(formatDateForInput(newRental.endDate));

	// Set up effect to handle prop changes
	$effect(() => {
		// Compare IDs instead of objects to avoid state_proxy_equality_mismatch
		if (initialSelectedVehicle?.id !== selectedVehicle?.id) {
			selectedVehicle = initialSelectedVehicle;
		}

		// Update calendar view if prop changes
		if (initialCalendarView !== calendarView) {
			calendarView = initialCalendarView;
		}
	});

	const dispatch = createEventDispatcher();

	function formatDateForInput(date: Date): string {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');

		return `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function handleStartDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			newRental.startDate = new Date(target.value);

			// If end date is before start date, update end date
			if (newRental.endDate < newRental.startDate) {
				newRental.endDate = new Date(newRental.startDate);
				newRental.endDate.setDate(newRental.endDate.getDate() + 1);
			}
		}
	}

	function handleEndDateChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.value) {
			newRental.endDate = new Date(target.value);
		}
	}

	function handleCreateRental() {
		if (!selectedVehicle || !$user.user) return;

		onCreateRental({
			vehicleId: selectedVehicle.id,
			rental: {
				vehicleId: selectedVehicle.id,
				userId: $user.user.id,
				purpose: newRental.purpose,
				plannedStart: newRental.startDate,
				plannedEnd: newRental.endDate,
				status: 'active'
			} as VehicleRental
		});

		showRentalDialog = false;
	}

	async function handleCancelRental() {
		if (!selectedRental?.id || !selectedRental?.vehicleId) return;

		const rental = selectedRental; // Create a non-null reference

		onCancelRental({
			rentalId: rental.id,
			reason: ''
		});

		// Get vehicle details for the canceled rental
		const vehicle = vehicles.find((v: Vehicle) => v.id === rental.vehicleId);

		// Dispatch event with rental and vehicle details
		dispatch('rentalCanceled', {
			rental,
			vehicle
		});

		showCancelDialog = false;
	}

	function handleEventClick(event: { id: string }) {
		const rental = rentals.find((r: VehicleRental) => r.id === event.id);
		if (rental) {
			selectedRental = rental;
			if (rental.status === 'active') {
				showCancelDialog = true;
			}
		}
	}

	function handleDayClick(event: CustomEvent<{ date: Date | null }>) {
		selectedDate = event.detail.date;

		// If we have a selected date, set the start date of the rental form to this date
		if (selectedDate && showRentalDialog) {
			const startDate = new Date(selectedDate);
			startDate.setHours(new Date().getHours());
			startDate.setMinutes(new Date().getMinutes());
			newRental.startDate = startDate;

			// Set end date to the next day at the same time
			const endDate = new Date(startDate);
			endDate.setDate(endDate.getDate() + 1);
			newRental.endDate = endDate;
		}
	}

	// Convert vehicles to options for the dropdown
	const vehicleOptions = $derived(
		vehicles
			.map((vehicle: Vehicle) => ({
				value: vehicle.id,
				label: vehicleToFriendlyString(vehicle)
			}))
			.sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label))
	);

	// Calculate the "status" for a vehicle based on active rentals
	function getVehicleStatus(vehicleId: string, date: Date = new Date()): string {
		// Convert date to midnight for comparison
		const compareDate = new Date(date);
		compareDate.setHours(0, 0, 0, 0);
		const nextDay = new Date(compareDate);
		nextDay.setDate(nextDay.getDate() + 1);

		const hasActiveRental = rentals.some((r: VehicleRental) => {
			if (r.vehicleId !== vehicleId || r.status === 'canceled') return false;

			const rentalStart = new Date(r.plannedStart);
			const rentalEnd = new Date(r.plannedEnd);

			// Check if the rental period overlaps with the selected date
			return rentalStart < nextDay && rentalEnd > compareDate;
		});
		return hasActiveRental ? 'in use' : 'available';
	}

	function getVehicleStatusDisplay(vehicleId: string, date: Date = new Date()): string {
		const status = getVehicleStatus(vehicleId, date);
		return status === 'available' ? 'Verfügbar' : 'In Benutzung';
	}

	const calendarEvents = $derived(
		rentals
			.filter(
				(rental: VehicleRental) =>
					(!selectedVehicle || rental.vehicleId === selectedVehicle.id) &&
					rental.status !== 'canceled'
			)
			.map((rental: VehicleRental) => {
				// Find the vehicle information
				const vehicle = vehicles.find((v: Vehicle) => v.id === rental.vehicleId);

				let title = `${vehicleToFriendlyString(vehicle)} - ${rental.purpose}`;

				let color = getMediumColor(rental.vehicleId);

				return {
					id: rental.id,
					title,
					start: rental.plannedStart,
					end: rental.plannedEnd,
					color
				};
			})
	);

	function handleCalendarEventClick(e: CustomEvent<{ id: string }>) {
		handleEventClick(e.detail);
	}

	function handleViewChange(e: CustomEvent<{ view: 'month' | 'week' }>) {
		calendarView = e.detail.view;
		onCalendarViewChange(e.detail.view);
	}

	function handleVehicleChange(e: Event) {
		const select = e.currentTarget as HTMLSelectElement;
		const newVehicle = vehicles.find((v: Vehicle) => v.id === select.value) || null;
		selectedVehicle = newVehicle;
		onVehicleSelect(newVehicle);
	}

	// For opening the rental dialog with a preselected date
	function showRentalDialogWithDate(date: Date) {
		if (!selectedVehicle) return;

		// Set the date for the rental form
		const startDate = new Date(date);
		startDate.setHours(new Date().getHours());
		startDate.setMinutes(new Date().getMinutes());
		newRental.startDate = startDate;

		// Set end date to the next day at the same time
		const endDate = new Date(startDate);
		endDate.setDate(endDate.getDate() + 1);
		newRental.endDate = endDate;

		// Show the dialog
		showRentalDialog = true;
	}

	// Format a date as a user-friendly string
	function formatDateToUserFriendly(date: Date): string {
		return date.toLocaleDateString('de-DE', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-6">
	<div class="flex flex-col md:flex-row gap-4">
		<div class="w-full md:w-1/3 lg:w-1/4">
			<div class="mb-1 text-sm font-medium text-gray-700">Fahrzeug auswählen</div>
			<select
				class="w-full border border-gray-300 rounded-md p-2"
				value={selectedVehicle?.id || ''}
				onchange={handleVehicleChange}
			>
				<option value="">Bitte auswählen</option>
				{#each vehicleOptions as option}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>

			{#if selectedVehicle}
				<div class="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
					<div class="p-4">
						<h3 class="font-bold text-lg text-thw-700">
							{vehicleToFriendlyString(selectedVehicle)}
						</h3>
						<div class="mt-2 space-y-2 text-sm">
							<p><span class="font-medium">Kennzeichen:</span> {selectedVehicle.licensePlate}</p>
							<p><span class="font-medium">Funkrufname:</span> {selectedVehicle.radioCallName}</p>
							<p><span class="font-medium">Typ:</span> {selectedVehicle.vehicleType}</p>
							<p><span class="font-medium">Einheit:</span> {selectedVehicle.unit}</p>

							{#if selectedDate}
								<p
									class={getVehicleStatus(selectedVehicle.id, selectedDate) === 'available'
										? 'text-green-600'
										: 'text-red-600'}
								>
									<span class="font-medium"
										>Status am {formatDateToUserFriendly(selectedDate)}:</span
									>
									{getVehicleStatusDisplay(selectedVehicle.id, selectedDate)}
								</p>
							{:else}
								<p
									class={getVehicleStatus(selectedVehicle.id) === 'available'
										? 'text-green-600'
										: 'text-red-600'}
								>
									<span class="font-medium">Status:</span>
									{getVehicleStatusDisplay(selectedVehicle.id)}
								</p>
							{/if}
						</div>

						<div class="mt-4 flex flex-wrap gap-2">
							<Button click={() => (showRentalDialog = true)}>Fahrzeug reservieren</Button>

							{#if selectedDate}
								<Button click={() => selectedDate && showRentalDialogWithDate(selectedDate)}>
									Ausleihe für {selectedDate.getDate()}.{selectedDate.getMonth() + 1}.
								</Button>
							{/if}
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div class="w-full min-w-0 overflow-x-auto sm:overflow-visible">
			<div class="calendar-container bg-white rounded-lg">
				{#if selectedVehicle}
					<div class="bg-thw-50 p-3 m-0 sm:mx-1 sm:mt-1 border-b border-thw-100 rounded-t-lg">
						<p class="text-sm text-thw-700">
							<span class="font-semibold">Kalender für:</span>
							{vehicleToFriendlyString(selectedVehicle)}
						</p>
					</div>
				{:else}
					<div class="bg-gray-50 p-3 m-0 sm:mx-1 sm:mt-1 border-b border-gray-200 rounded-t-lg">
						<p class="text-sm text-gray-500">
							Bitte wähle ein Fahrzeug aus, um dessen Reservierungen im Kalender anzuzeigen.
						</p>
					</div>
				{/if}
				<Calendar
					events={calendarEvents}
					initialView={calendarView}
					on:eventClick={handleCalendarEventClick}
					on:viewChange={handleViewChange}
					on:dayClick={handleDayClick}
				/>
			</div>
		</div>
	</div>
</div>

<!-- Ausleihe Dialog -->
{#if showRentalDialog && selectedVehicle && $user.user}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
			<h2 class="text-xl font-bold text-thw-700 mb-4">Fahrzeug reservieren</h2>
			<div class="mb-4">
				<p>
					<span class="font-medium">Fahrzeug:</span>
					{vehicleToFriendlyString(selectedVehicle)}
				</p>
				<p><span class="font-medium">Benutzer:</span> {userToFriendlyString($user.user)}</p>
				{#if selectedDate}
					<p>
						<span class="font-medium">Ausgewähltes Datum:</span>
						{formatDateToUserFriendly(selectedDate)}
					</p>
				{/if}
			</div>

			<div class="space-y-4">
				<div>
					<label class="block text-sm font-medium text-gray-700 mb-1">Zweck der Reservierung</label>
					<input
						type="text"
						class="w-full border border-gray-300 rounded-md p-2"
						bind:value={newRental.purpose}
					/>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
						<input
							type="datetime-local"
							class="w-full border border-gray-300 rounded-md p-2"
							value={formattedStart}
							onchange={handleStartDateChange}
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Enddatum</label>
						<input
							type="datetime-local"
							class="w-full border border-gray-300 rounded-md p-2"
							value={formattedEnd}
							onchange={handleEndDateChange}
						/>
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-end space-x-2">
				<Button secondary click={() => (showRentalDialog = false)}>Abbrechen</Button>

				<Button click={handleCreateRental} disabled={!newRental.purpose}>Ausleihe erstellen</Button>
			</div>
		</div>
	</div>
{/if}

<!-- Stornieren Dialog -->
{#if showCancelDialog && selectedRental && selectedRental.id}
	{@const selectedVehicle = vehicles.find((v: Vehicle) => v.id === selectedRental?.vehicleId)}
	<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
			<h2 class="text-xl font-bold text-red-600 mb-4">Ausleihe stornieren</h2>

			<div class="mb-4">
				<div class="flex flex-col gap-4">
					<div>
						<p>
							<span class="font-medium">Benutzer:</span>
							<span class="font-bold">
								{userToFriendlyString(getUserById($user, selectedRental.userId))}
							</span>
						</p>
					</div>
					<div>
						<p>
							<span class="font-medium">Zweck:</span>
							<span class="font-bold">{selectedRental.purpose}</span>
						</p>
						<p>
							<span class="font-medium">Zeitraum:</span>
							<span class="font-bold">
								{new Date(selectedRental.plannedStart).toLocaleString('de-DE')} bis {new Date(
									selectedRental.plannedEnd
								).toLocaleString('de-DE')}
							</span>
						</p>
					</div>
					<div>
						<p>
							<span class="font-medium">Fahrzeug:</span>
							{vehicleToFriendlyString(selectedVehicle)}
						</p>
						<p>
							<span class="font-medium">Kennzeichen:</span>
							{selectedVehicle?.licensePlate}
						</p>
						<p>
							<span class="font-medium">Funkrufname:</span>
							{selectedVehicle?.radioCallName}
						</p>

						<p>
							<span class="font-medium">Fahrzeugtyp:</span>
							{selectedVehicle?.vehicleType}
						</p>
					</div>
				</div>
			</div>

			<div class="mt-6 flex justify-end space-x-2">
				<Button secondary click={() => (showCancelDialog = false)}>Abbrechen</Button>

				<Button type="warning" click={handleCancelRental}>Ausleihe stornieren</Button>
			</div>
		</div>
	</div>
{/if}
