import { Vehicle } from '@/api/vehicle/vehicleModels';
import { Button, Table } from '@/components/base';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

type Props = {
  filteredVehicles: Vehicle[];
};

export default function VehicleDetailListTable({ filteredVehicles }: Props) {
  // const router = useRouter();

  let sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredVehicles]);

  return (
    <Table
      header={[
        'Name',
        'Kennzeichen',
        'Funkrufname',
        'Fahrzeugtyp',
        'Einheit',
        'Reservierbar',
        'Aktionen',
      ]}
      values={sortedVehicles.map((vehicle) => [
        vehicle.name,
        vehicle.licensePlate,
        vehicle.radioCallName || '-',
        vehicle.vehicleType,
        vehicle.unit || '-',
        vehicle.canBeReserved ? 'Ja' : 'Nein',
        // <Button
        //   key={vehicle.id}
        //   onClick={() => {
        //     router.push(`/fahrzeuge/details/${vehicle.id}`);
        //   }}
        // >
        //   Reservierungen
        // </Button>,
      ])}
    />
  );
}
