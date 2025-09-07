'use client';

import { cancelRental, createRental, fetchRentals } from '@/api/vehicle/vehicleApi';
import {
  CreateVehicleRentalDto,
  Vehicle,
  VehicleRental,
  vehicleToFriendlyString,
} from '@/api/vehicle/vehicleModels';
import { LoadingSpinner } from '@/components/base';
import LinkButton from '@/components/base/LinkButton';
import { CalendarView } from '@/components/Calendar';
import { useVehicleStore } from '@/provider/store/vehicleStore';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import VehicleManagement from './VehicleManagement';

export default function FahrzeugePage() {
  const { getAccessToken, getIdToken } = useKindeAuth();

  const { vehicles, fetching: isFetchingVehicles, setRentals } = useVehicleStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [initialCalendarView, setInitialCalendarView] = useState<CalendarView | undefined>(
    undefined
  );
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    const urlVehicleId = searchParams.get('vehicleId');
    const urlCalendarView = searchParams.get('view');

    if (urlVehicleId && vehicles) {
      const vehicleFromUrl = vehicles.find((v) => v.id === urlVehicleId);
      if (vehicleFromUrl) {
        setSelectedVehicle(vehicleFromUrl);
      }
    }

    if (urlCalendarView === 'week' || urlCalendarView === 'month') {
      setInitialCalendarView(urlCalendarView as 'month' | 'week');
    }
  }, [searchParams, vehicles]);

  function handleCalendarViewChange(view: 'month' | 'week') {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);

    router.replace(`?${params.toString()}`);
  }

  function handleVehicleSelection(vehicle: Vehicle | null) {
    setSelectedVehicle(vehicle);
    const params = new URLSearchParams(searchParams.toString());
    params.set('vehicleId', vehicle?.id || '');
    router.replace(`?${params.toString()}`);
  }

  async function handleCreateRental(data: CreateVehicleRentalDto) {
    try {
      const accessToken = await getAccessToken();
      const idToken = await getIdToken();
      if (!accessToken || !idToken) {
        throw new Error('No access token or id token');
      }

      await createRental(
        {
          token: accessToken,
          idToken: idToken,
        },
        data
      );

      // Lade Ausleihen neu, um die Liste zu aktualisieren
      await fetchRentals({
        token: accessToken,
        idToken: idToken,
      }).then(setRentals);

      const vehicle = vehicles?.find((v) => v.id === data.vehicleId);

      toast.success(
        `${vehicleToFriendlyString(vehicle)} erfolgreich reserviert für ${new Date(data.plannedStart).toLocaleDateString('de-DE')} bis ${new Date(data.plannedEnd).toLocaleDateString('de-DE')}`
      );
    } catch (error) {
      console.error('Error creating rental:', error);
      // Extract error message
      if (error instanceof Error) {
        if (error.message.includes('There are overlapping rentals for this vehicle')) {
          toast.error(
            'Das Fahrzeug ist in diesem Zeitraum bereits in Verwendung und kann nicht ausgeliehen werden.'
          );
        } else {
          toast.error(`Fehler beim Erstellen der Ausleihe: ${error.message}`);
        }
      }
    }
  }

  async function handleRentalCanceled(vehicle: Vehicle, rental: VehicleRental) {
    const accessToken = await getAccessToken();
    const idToken = await getIdToken();
    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    await cancelRental(
      {
        token: accessToken,
        idToken: idToken,
      },
      rental.id
    );

    await fetchRentals({
      token: accessToken,
      idToken: idToken,
    }).then(setRentals);

    toast.success(
      `${vehicleToFriendlyString(vehicle)} Reservierung für ${new Date(rental.plannedStart).toLocaleDateString('de-DE')} bis ${new Date(rental.plannedEnd).toLocaleDateString('de-DE')} wurde storniert`
    );
  }

  return (
    <div className="px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-thw-700">Fahrzeugverwaltung</h1>
            <p className="text-gray-600 mt-1">
              Verwalte hier die Fahrzeuge und deren Reservierungen.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <LinkButton url="/fahrzeuge/details" type="secondary">
              Fahrzeugdetails
            </LinkButton>
          </div>
        </div>

        {isFetchingVehicles ? (
          //||  isFetchingRentals
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : !vehicles || vehicles.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-600 font-medium">Keine Fahrzeuge gefunden.</p>
            <p className="text-gray-500 mt-2">
              Es wurden keine Fahrzeuge für Ihre Organisation gefunden. Neue Fahrzeuge können im
              Administrationsbereich unter &quot;Organisation&quot; hinzugefügt werden.
            </p>
          </div>
        ) : (
          <VehicleManagement
            initialCalendarView={initialCalendarView}
            onCalendarViewChange={handleCalendarViewChange}
            initialSelectedVehicle={selectedVehicle}
            onVehicleSelect={handleVehicleSelection}
            onCreateRental={handleCreateRental}
            onCancelRental={handleRentalCanceled}
          />
        )}
      </div>
    </div>
  );
}
