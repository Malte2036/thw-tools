'use client';

import { LoadingSpinner } from '@/components/base';
import LinkButton from '@/components/base/LinkButton';
import { useVehicleStore } from '@/provider/store/vehicleStore';
import { useMemo, useState } from 'react';
import VehicleDetailListTable from './VehicleDetailListTable';

export default function FahrzeugeDetailsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const { vehicles, fetching: isFetchingVehicles } = useVehicleStore();

  const filteredVehicles = useMemo(() => {
    return (
      vehicles?.filter((vehicle) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
          vehicle.name.toLowerCase().includes(term) ||
          vehicle.radioCallName?.toLowerCase().includes(term) ||
          vehicle.licensePlate.toLowerCase().includes(term) ||
          vehicle.vehicleType.toLowerCase().includes(term) ||
          vehicle.unit?.toLowerCase().includes(term)
        );
      }) ?? []
    );
  }, [vehicles, searchTerm]);

  return (
    <div className="px-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-thw-700">Fahrzeugübersicht</h1>
            <p className="text-gray-600 mt-1">Detaillierte Übersicht aller Fahrzeuge</p>
          </div>

          <div className="flex items-center gap-4">
            <LinkButton url="/fahrzeuge" type="secondary">
              Zurück zur Reservierung
            </LinkButton>
          </div>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Fahrzeug suchen..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {isFetchingVehicles ? (
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
          <div className="overflow-x-auto mt-2">
            <VehicleDetailListTable filteredVehicles={filteredVehicles} />
          </div>
        )}
      </div>
    </div>
  );
}
