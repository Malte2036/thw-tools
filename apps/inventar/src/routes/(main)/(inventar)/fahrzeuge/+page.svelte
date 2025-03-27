<script lang="ts">
  import { LinkButton } from '@thw-tools/svelte-components';
  import CarManagement from '$lib/inventar/CarManagement.svelte';
  import type { Car, CarLending } from '$lib/api/carModels';
  import { user } from '$lib/shared/stores/userStore';
  import type { User as OrganisationUser } from '$lib/api/organisationModels';
  
  // TODO: Replace with actual API calls
  let cars: Car[] = [
    {
      id: '1',
      kennzeichen: 'THW-12345',
      fahrzeugTyp: 'MTW',
      funkrufname: 'MTW OV',
      einheit: 'THW OV Musterstadt',
      status: 'verfügbar',
      kilometerstand: 45000
    },
    {
      id: '2',
      kennzeichen: 'THW-67890',
      fahrzeugTyp: 'GKW',
      funkrufname: 'GKW 1',
      einheit: 'THW OV Musterstadt',
      status: 'verfügbar',
      kilometerstand: 32150
    }
  ];

  let lendings: CarLending[] = [];

  console.log("user", $user);
  
  
  // Convert the organisation user to our car user model
  $: currentUser = $user.user ? {
    id: $user.user.id,
    name: `${$user.user.firstName || ''} ${$user.user.lastName || ''}`.trim() || 'Unbekannter Benutzer',
    email: '',  // Not available in the organisation user model
    einheit: $user.organisation?.name || 'Unbekannte Einheit'
  } : {
    id: 'anonymous',
    name: 'Unbekannter Benutzer',
    email: '',
    einheit: 'Unbekannte Einheit'
  };

  function handleCreateLending(event: CustomEvent<{ carId: string; lending: Omit<CarLending, 'id'> }>) {
    const newLending: CarLending = {
      ...event.detail.lending,
      id: crypto.randomUUID()
    };
    
    lendings = [...lendings, newLending];
    
    // Update car status
    cars = cars.map(car => {
      if (car.id === event.detail.carId) {
        return { ...car, status: 'ausgeliehen' };
      }
      return car;
    });
  }

  function handleCancelLending(event: CustomEvent<{ lendingId: string; reason: string }>) {
    const lending = lendings.find(l => l.id === event.detail.lendingId);
    if (!lending) return;

    lendings = lendings.map(l => {
      if (l.id === event.detail.lendingId) {
        return {
          ...l,
          status: 'storniert',
          customData: {
            ...l.customData,
            storniertVon: currentUser.name,
            storniertAm: new Date(),
            stornierungsGrund: event.detail.reason
          }
        };
      }
      return l;
    });

    // Update car status if it was an active lending
    if (lending.status === 'aktiv') {
      cars = cars.map(car => {
        if (car.id === lending.carId) {
          return { ...car, status: 'verfügbar' };
        }
        return car;
      });
    }
  }

  function handleCompleteLending(event: CustomEvent<{ lendingId: string; endKilometer: number }>) {
    const lending = lendings.find(l => l.id === event.detail.lendingId);
    if (!lending) return;

    lendings = lendings.map(l => {
      if (l.id === event.detail.lendingId) {
        return {
          ...l,
          status: 'abgeschlossen',
          endKilometer: event.detail.endKilometer,
          endZeit: new Date()
        };
      }
      return l;
    });

    // Update car status and kilometers
    cars = cars.map(car => {
      if (car.id === lending.carId) {
        return {
          ...car,
          status: 'verfügbar',
          kilometerstand: event.detail.endKilometer
        };
      }
      return car;
    });
  }
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
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-thw-700">Fahrzeugverwaltung</h1>
      <p class="text-gray-600 mt-1">Verwalten Sie hier die Fahrzeuge und deren Ausleihen.</p>
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

    <CarManagement
      {cars}
      {lendings}
      {currentUser}
      on:createLending={handleCreateLending}
      on:cancelLending={handleCancelLending}
      on:completeLending={handleCompleteLending}
    />
  </div>
</div> 