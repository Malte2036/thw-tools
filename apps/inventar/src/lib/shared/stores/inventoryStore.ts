import { writable } from 'svelte/store';

export type InventoryData = {
	fetching?: Promise<any>;
};

// Simplified store that only tracks loading state
export const inventory = writable<InventoryData>({});
