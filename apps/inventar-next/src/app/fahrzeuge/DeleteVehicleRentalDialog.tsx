import { userToFriendlyString } from '@/api/user/userModels';
import {
  CreateVehicleRentalDto,
  Vehicle,
  VehicleRental,
  vehicleToFriendlyString,
} from '@/api/vehicle/vehicleModels';
import { Button, Dialog } from '@/components/base';
import { useUserStore } from '@/provider/store/userStore';
import { useVehicleStore } from '@/provider/store/vehicleStore';
import { dateToFriendlyString } from '@thw-tools/shared';

type Props = {
  selectedRental: VehicleRental;
  closeDialog: () => void;
  deleteRental: (vehicle: Vehicle, rental: VehicleRental) => void;
};

export default function DeleteVehicleRentalDialog({
  selectedRental,
  closeDialog,
  deleteRental,
}: Props) {
  const user = useUserStore((state) => state.user);
  const vehicle = useVehicleStore((state) =>
    state.vehicles?.find((v: Vehicle) => v.id === selectedRental.vehicleId)
  );

  if (!vehicle) return null;

  return (
    <Dialog title="Ausleihe stornieren">
      <div slot="content">
        <div className="flex flex-col gap-4">
          <div>
            <p>
              <span className="font-medium">Benutzer: </span>
              <span className="font-bold">{userToFriendlyString(user)}</span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Zweck: </span>
              <span className="font-bold">{selectedRental.purpose}</span>
            </p>
            <p>
              <span className="font-medium">Zeitraum: </span>
              <span className="font-bold">
                {new Date(selectedRental.plannedStart).toLocaleString('de-DE')} bis{' '}
                {new Date(selectedRental.plannedEnd).toLocaleString('de-DE')}
              </span>
            </p>
          </div>
          <div>
            <p>
              <span className="font-medium">Fahrzeug: </span>
              {vehicleToFriendlyString(vehicle)}
            </p>
            <p>
              <span className="font-medium">Kennzeichen: </span>
              {vehicle?.licensePlate}
            </p>
            <p>
              <span className="font-medium">Funkrufname: </span>
              {vehicle?.radioCallName}
            </p>

            <p>
              <span className="font-medium">Fahrzeugtyp: </span>
              {vehicle?.vehicleType}
            </p>
          </div>
        </div>
      </div>
      <div slot="footer" className="w-full flex justify-end gap-2">
        <Button type="secondary" onClick={closeDialog}>
          Abbrechen
        </Button>
        <Button type="warning" onClick={() => deleteRental(vehicle, selectedRental)}>
          Ausleihe stornieren
        </Button>
      </div>
    </Dialog>
  );
}
