import { writable } from 'svelte/store';
import type { Vehicle } from '$lib/api/carModels';

type VehicleState = {
	items: Vehicle[] | null;
	fetching?: Promise<any>;
};

export const vehicles = writable<VehicleState>({
	items: null,
	fetching: undefined
});
