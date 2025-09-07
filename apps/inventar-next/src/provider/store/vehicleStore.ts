import {
  Vehicle,
  VehicleRental,
  VehicleRentalSchema,
  VehicleSchema,
} from '@/api/vehicle/vehicleModels';
import { create } from 'zustand';

interface VehicleStore {
  fetching: boolean;
  vehicles: Vehicle[] | null;
  rentals: VehicleRental[] | null;
  setFetching: (fetching: boolean) => void;
  setVehicles: (vehicles: Vehicle[] | null) => void;
  setRentals: (rentals: VehicleRental[] | null) => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: null,
  rentals: null,
  fetching: false,
  setVehicles: (vehicles: Vehicle[] | null) => {
    if (!vehicles) {
      set({ vehicles: null, fetching: false });
      return;
    }

    const parsedVehicles = VehicleSchema.array().parse(vehicles);
    set({ vehicles: parsedVehicles, fetching: false });
  },
  setFetching: (fetching: boolean) => {
    set({ fetching });
  },
  setRentals: (rentals: VehicleRental[] | null) => {
    if (!rentals) {
      set({ rentals: null, fetching: false });
      return;
    }

    const parsedRentals = VehicleRentalSchema.array().parse(rentals);
    set({ rentals: parsedRentals, fetching: false });
  },
}));
