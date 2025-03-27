<script lang="ts">
  import { LinkButton, LoadingSpinner } from '@thw-tools/svelte-components';
  import CarManagement from '$lib/inventar/CarManagement.svelte';
  import { fetchVehicles, fetchRentals, createRental, cancelRental } from '$lib/api/vehicleApi';
  import { user } from '$lib/shared/stores/userStore';
  import { vehicles } from '$lib/shared/stores/vehicleStore';
  import { apiMeta } from '$lib/shared/stores/apiMetaStore';
  import { onMount } from 'svelte';
  import type { CreateVehicleRentalDto, VehicleRental } from '$lib/api/carModels';

  // Datenstatus
  let rentals = $state<VehicleRental[]>([]);
  let isFetchingRentals = $state(false);

  // Konvertierte Ausleihen für das Frontend-Format
  let convertedRentals = $derived(rentals.map((rental) => {
    // Benutzernamen aus den Benutzerdaten extrahieren
    const userName = rental.user?.firstName && rental.user?.lastName 
      ? `${rental.user.firstName} ${rental.user.lastName}` 
      : 'Unbekannter Benutzer';

    return {
      id: rental.id,
      carId: rental.vehicleId,
      userId: rental.userId,
      userName,
      userEinheit: $user.organisation?.name || 'Unbekannte Einheit',
      type: rental.status === 'active' ? 'aktiv' : 'geplant',
      zweck: rental.purpose,
      geplantStart: new Date(rental.plannedStart),
      geplantEnde: new Date(rental.plannedEnd),
      status: rental.status === 'active' ? 'aktiv' : rental.status === 'planned' ? 'geplant' : 'storniert',
      startZeit: rental.status === 'active' ? new Date(rental.plannedStart) : undefined,
      startKilometer: 0,
      endKilometer: 0
    };
  }));

  // Benutzerinformationen für das Formular
  let currentUser = $derived($user.user
    ? {
        id: $user.user.id,
        name: `${$user.user.firstName || ''} ${$user.user.lastName || ''}`.trim() || 'Unbekannter Benutzer',
        email: '', // Nicht im Organisationsuser-Modell verfügbar
        einheit: $user.organisation?.name || 'Unbekannte Einheit'
      }
    : {
        id: 'anonymous',
        name: 'Unbekannter Benutzer',
        email: '',
        einheit: 'Unbekannte Einheit'
      });

  // Lade die Daten beim Komponenten-Laden
  onMount(async () => {
    try {
      // Lade Fahrzeuge und Ausleihen parallel
      await Promise.all([
        fetchVehicles(),
        loadRentals()
      ]);
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
  async function handleCreateLending(event: CustomEvent<{ carId: string; lending: any }>) {
    try {
      const { carId, lending } = event.detail;
      
      // Konvertiere in das Backend-Format
      const rentalDto: CreateVehicleRentalDto = {
        vehicleId: carId,
        userId: currentUser.id,
        purpose: lending.zweck,
        plannedStart: lending.geplantStart.toISOString(),
        plannedEnd: lending.geplantEnde.toISOString()
      };
      
      // Erstelle die Ausleihe über die API
      await createRental(rentalDto);
      
      // Lade Ausleihen neu, um die Liste zu aktualisieren
      await loadRentals();
    } catch (error) {
      console.error('Error creating rental:', error);
    }
  }

  async function handleCancelLending(event: CustomEvent<{ lendingId: string; reason: string }>) {
    try {
      const { lendingId } = event.detail;
      
      // Storniere die Ausleihe über die API
      await cancelRental(lendingId);
      
      // Lade Ausleihen neu, um die Liste zu aktualisieren
      await loadRentals();
    } catch (error) {
      console.error('Error canceling rental:', error);
    }
  }

  // In der aktuellen Implementierung ist diese Funktion nicht möglich,
  // da es kein direktes Abschließen einer Ausleihe über die API gibt
  function handleCompleteLending(event: CustomEvent<{ lendingId: string; endKilometer: number }>) {
    // Diese Funktionalität muss später ergänzt werden, wenn die API erweitert wird
    console.log('Complete lending not implemented yet:', event.detail);
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
</script>

<div class="px-4 py-6">
  <div class="mb-6">
    <LinkButton url="../" secondary>
      <span class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        Zurück zur Inventar-Übersicht
      </span>
    </LinkButton>
  </div>

  <div class="bg-white rounded-lg shadow-md p-6">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-thw-700">Fahrzeugverwaltung</h1>
        <p class="text-gray-600 mt-1">Verwalten Sie hier die Fahrzeuge und deren Ausleihen.</p>
      </div>
      <div class="text-sm text-gray-500">
        <span class="font-medium">Letztes Update:</span>
        {lastFetchedStr || 'Noch nicht geladen'}
      </div>
    </div>

    <div class="mb-4 bg-thw-50 border border-thw-100 p-4 rounded-md">
      <div class="flex flex-col sm:flex-row gap-2 justify-between">
        <div>
          <p class="text-thw-800 font-medium">Angemeldet als:</p>
          <p class="text-thw-700">{currentUser.name}</p>
        </div>
        <div>
          <p class="text-thw-800 font-medium">Einheit:</p>
          <p class="text-thw-700">{currentUser.einheit}</p>
        </div>
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
          Es wurden keine Fahrzeuge für Ihre Organisation gefunden oder Sie haben nicht die nötigen Rechte,
          um sie zu sehen.
        </p>
      </div>
    {:else}
      <CarManagement
        cars={$vehicles.items}
        lendings={convertedRentals}
        {currentUser}
        on:createLending={handleCreateLending}
        on:cancelLending={handleCancelLending}
        on:completeLending={handleCompleteLending}
      />
    {/if}
  </div>
</div> 