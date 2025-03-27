import { writable } from 'svelte/store';
import type { Vehicle } from '$lib/api/vehicleModels';

type VehicleState = {
	items: Vehicle[] | null;
	fetching?: Promise<any>;
};

export const vehicles = writable<VehicleState>({
	items: null,
	fetching: undefined
});
