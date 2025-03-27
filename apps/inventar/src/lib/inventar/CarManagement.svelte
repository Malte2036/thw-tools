<script lang="ts">
  import { Calendar } from '@thw-tools/svelte-components';
  import type { Vehicle, VehicleRental } from '$lib/api/carModels';
  import { createEventDispatcher } from 'svelte';

  // Wir erhalten jetzt die Backend-Modelle direkt
  export let cars: Vehicle[] = [];
  // lendings und currentUser behalten das alte Format bei
  export let lendings: any[] = [];
  export let currentUser: any;
  
  const dispatch = createEventDispatcher<{
    createLending: { carId: string; lending: any };
    cancelLending: { lendingId: string; reason: string };
    completeLending: { lendingId: string; endKilometer: number };
  }>();

  let selectedCar: Vehicle | null = null;
  let showLendingDialog = false;
  let showCancelDialog = false;
  let showCompleteDialog = false;
  let selectedLending: any | null = null;

  // Form states
  let newLending = {
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Default end date is tomorrow
    zweck: '',
    startKilometer: 0
  };

  let cancelReason = '';
  let endKilometer = 0;

  // Format the dates properly for the datetime-local inputs
  $: formattedStart = formatDateForInput(newLending.startDate);
  $: formattedEnd = formatDateForInput(newLending.endDate);

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
      newLending.startDate = new Date(target.value);
      
      // If end date is before start date, update end date
      if (newLending.endDate < newLending.startDate) {
        newLending.endDate = new Date(newLending.startDate);
        newLending.endDate.setDate(newLending.endDate.getDate() + 1);
      }
    }
  }

  function handleEndDateChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.value) {
      newLending.endDate = new Date(target.value);
    }
  }

  function handleCreateLending() {
    if (!selectedCar) return;

    dispatch('createLending', {
      carId: selectedCar.id,
      lending: {
        carId: selectedCar.id,
        userId: currentUser.id,
        userName: currentUser.name,
        userEinheit: currentUser.einheit,
        type: 'geplant',
        zweck: newLending.zweck,
        geplantStart: newLending.startDate,
        geplantEnde: newLending.endDate,
        status: 'geplant'
      }
    });

    showLendingDialog = false;
  }

  function handleCancelLending() {
    if (!selectedLending) return;

    dispatch('cancelLending', {
      lendingId: selectedLending.id,
      reason: cancelReason
    });

    showCancelDialog = false;
  }

  function handleCompleteLending() {
    if (!selectedLending) return;

    dispatch('completeLending', {
      lendingId: selectedLending.id,
      endKilometer
    });

    showCompleteDialog = false;
  }

  function handleEventClick(event: { id: string }) {
    const lending = lendings.find(l => l.id === event.id);
    if (lending) {
      selectedLending = lending;
      if (lending.status === 'aktiv' || lending.status === 'geplant') {
        showCancelDialog = true;
      }
    }
  }

  // Konvertiere Backend-Fahrzeuge zu Options für das Dropdown
  $: carOptions = cars.map(car => ({
    value: car.id,
    label: `${car.radioCallName} (${car.licensePlate})`
  }));

  // Berechne den "status" für ein Fahrzeug basierend auf aktiven Ausleihen
  function getCarStatus(vehicleId: string): string {
    const hasActiveRental = lendings.some(
      l => l.carId === vehicleId && (l.status === 'aktiv' || l.status === 'active')
    );
    return hasActiveRental ? 'ausgeliehen' : 'verfügbar';
  }

  $: calendarEvents = lendings
    .filter(lending => !selectedCar || lending.carId === selectedCar.id)
    .map(lending => ({
      id: lending.id,
      title: `${lending.userName} - ${lending.zweck}`,
      start: lending.geplantStart,
      end: lending.geplantEnde,
      color: lending.status === 'aktiv' ? 'blue' : 
             lending.status === 'geplant' ? 'green' : 
             lending.status === 'storniert' ? 'red' : 'gray'
    }));

  let inputZweck = '';
  let inputStartDate = '';
  let inputEndDate = '';
  let inputCancelReason = '';
  let inputEndKilometer = 0;
</script>

<div class="space-y-6">
  <div class="flex flex-col md:flex-row gap-4 items-start">
    <div class="w-full md:w-64">
      <div class="mb-1 text-sm font-medium text-gray-700">Fahrzeug auswählen</div>
      <select 
        class="w-full border border-gray-300 rounded-md p-2"
        value={selectedCar?.id || ''}
        on:change={(e) => selectedCar = cars.find(c => c.id === e.currentTarget.value) || null}
      >
        <option value="">Bitte auswählen</option>
        {#each carOptions as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
      
      {#if selectedCar}
        <div class="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="p-4">
            <h3 class="font-bold text-lg text-thw-700">{selectedCar.radioCallName}</h3>
            <div class="mt-2 space-y-2 text-sm">
              <p><span class="font-medium">Kennzeichen:</span> {selectedCar.licensePlate}</p>
              <p><span class="font-medium">Typ:</span> {selectedCar.vehicleType}</p>
              <p><span class="font-medium">Einheit:</span> {selectedCar.unit}</p>
              <p><span class="font-medium">Status:</span> {getCarStatus(selectedCar.id)}</p>
            </div>
            
            <div class="mt-4">
              <button 
                class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => showLendingDialog = true}
                disabled={getCarStatus(selectedCar.id) !== 'verfügbar'}
              >
                Fahrzeug ausleihen
              </button>
            </div>
          </div>
        </div>
      {/if}
    </div>

    <div class="w-full min-w-0 overflow-auto">
      <div class="calendar-container min-w-[700px] md:min-w-0">
        {#if selectedCar}
          <div class="bg-thw-50 p-2 mb-2 border border-thw-100 rounded-md">
            <p class="text-sm text-thw-700">
              <span class="font-medium">Kalender für:</span> {selectedCar.radioCallName} ({selectedCar.licensePlate})
            </p>
          </div>
        {:else}
          <div class="bg-gray-50 p-2 mb-2 border border-gray-200 rounded-md">
            <p class="text-sm text-gray-500">
              Bitte wählen Sie ein Fahrzeug aus, um dessen Termine im Kalender anzuzeigen.
            </p>
          </div>
        {/if}
        <Calendar
          events={calendarEvents}
          on:eventClick={(e) => handleEventClick(e.detail)}
        />
      </div>
    </div>
  </div>
</div>

<!-- Ausleihe Dialog -->
{#if showLendingDialog && selectedCar}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
      <h2 class="text-xl font-bold text-thw-700 mb-4">Fahrzeug ausleihen</h2>
      <div class="mb-4">
        <p><span class="font-medium">Fahrzeug:</span> {selectedCar.radioCallName} ({selectedCar.licensePlate})</p>
        <p><span class="font-medium">Benutzer:</span> {currentUser.name} ({currentUser.einheit})</p>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Zweck der Ausleihe</label>
          <input
            type="text"
            class="w-full border border-gray-300 rounded-md p-2"
            bind:value={newLending.zweck}
          />
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
            <input
              type="datetime-local"
              class="w-full border border-gray-300 rounded-md p-2"
              value={formattedStart}
              on:change={handleStartDateChange}
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Enddatum</label>
            <input
              type="datetime-local"
              class="w-full border border-gray-300 rounded-md p-2"
              value={formattedEnd}
              on:change={handleEndDateChange}
            />
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-2">
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
          on:click={() => showLendingDialog = false}
        >
          Abbrechen
        </button>
        
        <button
          class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          on:click={handleCreateLending}
          disabled={!newLending.zweck}
        >
          Ausleihe erstellen
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Stornieren Dialog -->
{#if showCancelDialog && selectedLending}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
      <h2 class="text-xl font-bold text-red-600 mb-4">Ausleihe stornieren</h2>
      <div class="mb-4">
        <p><span class="font-medium">Fahrzeug:</span> {cars.find(c => c.id === selectedLending.carId)?.radioCallName}</p>
        <p><span class="font-medium">Benutzer:</span> {selectedLending.userName}</p>
        <p><span class="font-medium">Zweck:</span> {selectedLending.zweck}</p>
        <p><span class="font-medium">Zeitraum:</span> {selectedLending.geplantStart.toLocaleString('de-DE')} bis {selectedLending.geplantEnde.toLocaleString('de-DE')}</p>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Grund für Stornierung</label>
          <textarea
            class="w-full border border-gray-300 rounded-md p-2"
            rows="3"
            bind:value={cancelReason}
          ></textarea>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-2">
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
          on:click={() => showCancelDialog = false}
        >
          Abbrechen
        </button>
        
        <button
          class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
          on:click={handleCancelLending}
        >
          Ausleihe stornieren
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Abschließen Dialog -->
{#if showCompleteDialog && selectedLending}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
      <h2 class="text-xl font-bold text-thw-700 mb-4">Ausleihe abschließen</h2>
      <div class="mb-4">
        <p><span class="font-medium">Fahrzeug:</span> {cars.find(c => c.id === selectedLending.carId)?.radioCallName}</p>
        <p><span class="font-medium">Benutzer:</span> {selectedLending.userName}</p>
        <p><span class="font-medium">Zweck:</span> {selectedLending.zweck}</p>
        <p><span class="font-medium">Startkilometer:</span> {selectedLending.startKilometer} km</p>
      </div>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Endkilometerstand</label>
          <input
            type="number"
            class="w-full border border-gray-300 rounded-md p-2"
            bind:value={endKilometer}
            min={selectedLending.startKilometer}
          />
        </div>
      </div>
      
      <div class="mt-6 flex justify-end space-x-2">
        <button
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
          on:click={() => showCompleteDialog = false}
        >
          Abbrechen
        </button>
        
        <button
          class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors"
          on:click={handleCompleteLending}
          disabled={endKilometer < selectedLending.startKilometer}
        >
          Ausleihe abschließen
        </button>
      </div>
    </div>
  </div>
{/if} 