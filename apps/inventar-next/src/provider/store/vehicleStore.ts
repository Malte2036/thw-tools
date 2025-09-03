import { User, UserSchema } from '@/api/user/userModels';
import { Vehicle, VehicleSchema } from '@/api/vehicle/vehicleModels';
import { create } from 'zustand';

interface VehicleStore {
  vehicles: Vehicle[] | null;
  fetching: boolean;
  setVehicles: (vehicles: Vehicle[] | null) => void;
  setFetching: (fetching: boolean) => void;
}

export const useVehicleStore = create<VehicleStore>((set) => ({
  vehicles: null,
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
}));
