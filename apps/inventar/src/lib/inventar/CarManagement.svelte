<script lang="ts">
  import { Calendar } from '@thw-tools/svelte-components';
  import type { Car, CarLending, User } from '$lib/api/carModels';
  import { createEventDispatcher } from 'svelte';

  export let cars: Car[] = [];
  export let lendings: CarLending[] = [];
  export let currentUser: User;
  
  const dispatch = createEventDispatcher<{
    createLending: { carId: string; lending: Omit<CarLending, 'id'> };
    cancelLending: { lendingId: string; reason: string };
    completeLending: { lendingId: string; endKilometer: number };
  }>();

  let selectedCar: Car | null = null;
  let showLendingDialog = false;
  let showCancelDialog = false;
  let showCompleteDialog = false;
  let selectedLending: CarLending | null = null;

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

  $: carOptions = cars.map(car => ({
    value: car.id,
    label: `${car.funkrufname} (${car.kennzeichen})`
  }));

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
            <h3 class="font-bold text-lg text-thw-700">{selectedCar.funkrufname}</h3>
            <div class="mt-2 space-y-2 text-sm">
              <p><span class="font-medium">Kennzeichen:</span> {selectedCar.kennzeichen}</p>
              <p><span class="font-medium">Typ:</span> {selectedCar.fahrzeugTyp}</p>
              <p><span class="font-medium">Einheit:</span> {selectedCar.einheit}</p>
              <p><span class="font-medium">Status:</span> {selectedCar.status}</p>
              <p><span class="font-medium">Kilometerstand:</span> {selectedCar.kilometerstand} km</p>
            </div>
            
            <div class="mt-4">
              <button 
                class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                on:click={() => showLendingDialog = true}
                disabled={selectedCar.status !== 'verfügbar'}
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
              <span class="font-medium">Kalender für:</span> {selectedCar.funkrufname} ({selectedCar.kennzeichen})
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

<!-- Create Lending Dialog -->
{#if showLendingDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Fahrzeug ausleihen</h2>
        <button 
          class="text-gray-400 hover:text-gray-600" 
          on:click={() => showLendingDialog = false}
        >
          ✕
        </button>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Zweck</label>
            <input 
              type="text"
              class="w-full border border-gray-300 rounded-md p-2"
              bind:value={newLending.zweck}
              placeholder="Grund der Ausleihe"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Von</label>
              <input 
                type="datetime-local"
                class="w-full border border-gray-300 rounded-md p-2"
                value={formattedStart}
                on:change={handleStartDateChange}
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Bis</label>
              <input 
                type="datetime-local"
                class="w-full border border-gray-300 rounded-md p-2"
                value={formattedEnd}
                on:change={handleEndDateChange}
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button 
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              on:click={() => showLendingDialog = false}
            >
              Abbrechen
            </button>
            <button 
              class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors"
              on:click={handleCreateLending}
            >
              Ausleihen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Cancel Lending Dialog -->
{#if showCancelDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Ausleihe stornieren</h2>
        <button 
          class="text-gray-400 hover:text-gray-600" 
          on:click={() => showCancelDialog = false}
        >
          ✕
        </button>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Grund der Stornierung</label>
            <input 
              type="text"
              class="w-full border border-gray-300 rounded-md p-2"
              bind:value={cancelReason}
              placeholder="Grund angeben"
            />
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button 
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              on:click={() => showCancelDialog = false}
            >
              Abbrechen
            </button>
            <button 
              class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors"
              on:click={handleCancelLending}
            >
              Stornieren
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if}

<!-- Complete Lending Dialog -->
{#if showCompleteDialog}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">Ausleihe abschließen</h2>
        <button 
          class="text-gray-400 hover:text-gray-600" 
          on:click={() => showCompleteDialog = false}
        >
          ✕
        </button>
      </div>
      <div class="p-4">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Kilometerstand bei Rückgabe</label>
            <input 
              type="number"
              class="w-full border border-gray-300 rounded-md p-2"
              bind:value={endKilometer}
              placeholder="Aktueller Kilometerstand"
            />
          </div>

          <div class="mt-4 flex justify-end gap-2">
            <button 
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md transition-colors"
              on:click={() => showCompleteDialog = false}
            >
              Abbrechen
            </button>
            <button 
              class="bg-thw-600 hover:bg-thw-700 text-white px-4 py-2 rounded-md transition-colors"
              on:click={handleCompleteLending}
            >
              Abschließen
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
{/if} 