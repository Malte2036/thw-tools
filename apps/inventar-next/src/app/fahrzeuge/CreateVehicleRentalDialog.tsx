import { userToFriendlyString } from '@/api/user/userModels';
import {
  CreateVehicleRentalDto,
  Vehicle,
  vehicleToFriendlyString,
} from '@/api/vehicle/vehicleModels';
import { Button, Dialog } from '@/components/base';
import { useUserStore } from '@/provider/store/userStore';
import { dateToFriendlyString } from '@thw-tools/shared';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  selectedVehicle: Vehicle;
  selectedDate: Date | null;
  newRental: CreateVehicleRentalDto;
  setRental: Dispatch<SetStateAction<CreateVehicleRentalDto>>;
  closeDialog: () => void;
  createRental: () => void;
};

export default function CreateVehicleRentalDialog({
  selectedVehicle,
  selectedDate,
  newRental,
  setRental,
  closeDialog,
  createRental,
}: Props) {
  const user = useUserStore((state) => state.user);

  return (
    <Dialog title="Fahrzeug reservieren">
      <div slot="content">
        <div className="mb-4">
          <p>
            <span className="font-medium">Fahrzeug: </span>
            {vehicleToFriendlyString(selectedVehicle)}
          </p>
          <p>
            <span className="font-medium">Benutzer: </span>
            {userToFriendlyString(user)}
          </p>
          {selectedDate && (
            <p>
              <span className="font-medium">Ausgewähltes Datum: </span>
              {dateToFriendlyString(selectedDate)}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zweck der Reservierung
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md p-2"
              value={newRental.purpose}
              onChange={(e) => setRental((state) => ({ ...state, purpose: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Startdatum</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-md p-2"
                value={newRental.plannedStart}
                onChange={(e) => setRental((state) => ({ ...state, plannedStart: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Enddatum</label>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 rounded-md p-2"
                value={newRental.plannedEnd}
                onChange={(e) => setRental((state) => ({ ...state, plannedEnd: e.target.value }))}
              />
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" className="w-full flex justify-end gap-2">
        <Button type="secondary" onClick={closeDialog}>
          Abbrechen
        </Button>

        <Button type="primary" onClick={createRental} disabled={!newRental.purpose}>
          Ausleihe erstellen
        </Button>
      </div>
    </Dialog>
  );
}
