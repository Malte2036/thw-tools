'use client';

import {
  CreateVehicleRentalDto,
  Vehicle,
  VehicleId,
  VehicleRental,
  vehicleToFriendlyString,
} from '@/api/vehicle/vehicleModels';
import { Button } from '@/components/base';
import { Calendar, CalendarEvent, CalendarView } from '@/components/Calendar';
import { useVehicleStore } from '@/provider/store/vehicleStore';
import { formatDate, getMediumColor } from '@thw-tools/shared';
import { useMemo, useState } from 'react';
import CreateVehicleRentalDialog from './CreateVehicleRentalDialog';
import DeleteVehicleRentalDialog from './DeleteVehicleRentalDialog';

type Props = {
  initialSelectedVehicle: Vehicle | null;
  initialCalendarView: CalendarView | undefined;
  onCalendarViewChange: (view: CalendarView) => void;
  onCreateRental: (data: CreateVehicleRentalDto) => void;
  onCancelRental: (vehicle: Vehicle, rental: VehicleRental) => void;
  onVehicleSelect: (vehicle: Vehicle | null) => void;
};

export default function VehicleManagement({
  initialSelectedVehicle,
  initialCalendarView,
  onCalendarViewChange,
  onCreateRental,
  onCancelRental,
  onVehicleSelect,
}: Props) {
  const { vehicles, rentals } = useVehicleStore();

  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(initialSelectedVehicle);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showRentalDialog, setShowRentalDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedRental, setSelectedRental] = useState<VehicleRental | null>(null);

  const [newRental, setNewRental] = useState<CreateVehicleRentalDto>({
    vehicleId: selectedVehicle?.id as VehicleId,
    plannedStart: new Date().toISOString(),
    plannedEnd: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    purpose: '',
  });

  const calendarEvents: CalendarEvent[] = useMemo(
    () =>
      rentals
        ?.filter(
          (rental: VehicleRental) =>
            (!selectedVehicle || rental.vehicleId === selectedVehicle.id) &&
            rental.status !== 'canceled'
        )
        .map((rental: VehicleRental) => {
          // Find the vehicle information
          const vehicle = vehicles?.find((v: Vehicle) => v.id === rental.vehicleId);

          const title = `${vehicleToFriendlyString(vehicle)} - ${rental.purpose}`;

          const color = getMediumColor(rental.vehicleId);

          return {
            id: rental.id,
            title,
            start: new Date(rental.plannedStart),
            end: new Date(rental.plannedEnd),
            color,
          };
        }) || [],
    [vehicles, rentals, selectedVehicle]
  );

  // For opening the rental dialog with a preselected date
  function showRentalDialogWithDate(date: Date) {
    if (!selectedVehicle) return;

    // Set the date for the rental form
    const startDate = new Date(date);
    startDate.setHours(new Date().getHours());
    startDate.setMinutes(new Date().getMinutes());

    // Set end date to the next day at the same time
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    setNewRental((state) => ({ ...state, startDate, endDate }));

    // Show the dialog
    setShowRentalDialog(true);
  }

  // Calculate the "status" for a vehicle based on active rentals
  function getVehicleStatus(vehicleId: string, date: Date = new Date()): string {
    // Convert date to midnight for comparison
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(compareDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const hasActiveRental = rentals?.some((r) => {
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

  function handleCalendarEventClick(event: { id: string }) {
    const rental = rentals?.find((r: VehicleRental) => r.id === event.id);
    if (rental) {
      setSelectedRental(rental);
      if (rental.status === 'active') {
        setShowCancelDialog(true);
      }
    }
  }

  function handleDayClick(date: Date | null) {
    // If we have a selected date, set the start date of the rental form to this date
    if (date && showRentalDialog) {
      const startDate = new Date(date);
      startDate.setHours(new Date().getHours());
      startDate.setMinutes(new Date().getMinutes());

      // Set end date to the next day at the same time
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      setNewRental((state) => ({ ...state, date, startDate, endDate }));
    } else {
      setSelectedDate(date);
    }
  }

  async function handleCancelRental(vehicle: Vehicle, rental: VehicleRental) {
    onCancelRental(vehicle, rental);
    setShowCancelDialog(false);
  }

  if (!vehicles || !rentals) return null;

  const vehicleOptions = vehicles
    .map((vehicle) => ({
      value: vehicle.id,
      label: vehicleToFriendlyString(vehicle),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="mb-1 text-sm font-medium text-gray-700">Fahrzeug auswählen</div>
            <select
              className="w-full border border-gray-300 rounded-md p-2"
              value={selectedVehicle?.id || ''}
              onChange={(e) => {
                const vehicle = vehicles.find((v) => v.id === e.target.value) || null;
                setSelectedVehicle(vehicle);
                setNewRental((state) => ({ ...state, vehicleId: vehicle?.id as VehicleId }));
                onVehicleSelect?.(vehicle);
              }}
            >
              <option value="">Bitte auswählen</option>
              {vehicleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {selectedVehicle && (
              <div className="mt-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="p-4">
                  <h3 className="font-bold text-lg text-thw-700">
                    {vehicleToFriendlyString(selectedVehicle)}
                  </h3>
                  <div className="mt-2 space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Kennzeichen:</span>{' '}
                      {selectedVehicle.licensePlate}
                    </p>
                    <p>
                      <span className="font-medium">Funkrufname:</span>{' '}
                      {selectedVehicle.radioCallName}
                    </p>
                    <p>
                      <span className="font-medium">Typ:</span> {selectedVehicle.vehicleType}
                    </p>
                    <p>
                      <span className="font-medium">Einheit:</span> {selectedVehicle.unit}
                    </p>

                    {selectedDate ? (
                      <p
                        className={
                          getVehicleStatus(selectedVehicle.id, selectedDate) === 'available'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        <span className="font-medium">Status am {formatDate(selectedDate)}:</span>
                        {getVehicleStatusDisplay(selectedVehicle.id, selectedDate)}
                      </p>
                    ) : (
                      <p
                        className={
                          getVehicleStatus(selectedVehicle.id) === 'available'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }
                      >
                        <span className="font-medium">Status:</span>
                        {getVehicleStatusDisplay(selectedVehicle.id)}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button onClick={() => setShowRentalDialog(true)}>Fahrzeug reservieren</Button>

                    {selectedDate && (
                      <Button
                        onClick={() => selectedDate && showRentalDialogWithDate(selectedDate)}
                      >
                        Ausleihe für {selectedDate.getDate()}.{selectedDate.getMonth() + 1}.
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="w-full min-w-0 overflow-x-auto sm:overflow-visible">
            <div className="calendar-container bg-white rounded-lg">
              {selectedVehicle ? (
                <div className="bg-thw-50 p-3 m-0 sm:mx-1 sm:mt-1 border-b border-thw-100 rounded-t-lg">
                  <p className="text-sm text-thw-700">
                    <span className="font-semibold">Kalender für:</span>
                    {vehicleToFriendlyString(selectedVehicle)}
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 p-3 m-0 sm:mx-1 sm:mt-1 border-b border-gray-200 rounded-t-lg">
                  <p className="text-sm text-gray-500">
                    Bitte wähle ein Fahrzeug aus, um dessen Reservierungen im Kalender anzuzeigen.
                  </p>
                </div>
              )}
              <Calendar
                events={calendarEvents}
                initialView={initialCalendarView}
                onEventClick={(e) => handleCalendarEventClick(e)}
                onViewChange={(e) => onCalendarViewChange(e)}
                onDayClick={handleDayClick}
              />
            </div>
          </div>
        </div>
      </div>
      {showRentalDialog && newRental && selectedVehicle && newRental.vehicleId && (
        <CreateVehicleRentalDialog
          selectedVehicle={selectedVehicle}
          selectedDate={selectedDate}
          newRental={newRental}
          setRental={setNewRental}
          closeDialog={() => setShowRentalDialog(false)}
          createRental={() => onCreateRental(newRental)}
        />
      )}
      {showCancelDialog && selectedRental && (
        <DeleteVehicleRentalDialog
          selectedRental={selectedRental}
          closeDialog={() => setShowCancelDialog(false)}
          deleteRental={handleCancelRental}
        />
      )}
    </>
  );
}
