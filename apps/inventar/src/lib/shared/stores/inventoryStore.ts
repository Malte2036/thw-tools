import type { InventoryItem } from '$lib/api/inventoryModels';
import { db } from '$lib/utils/db';
import { writable } from 'svelte/store';

export type InventoryData = {
	fetching?: Promise<any>;
	inventoryItems: InventoryItem[] | null;
};

// Simplified store that only tracks loading state
export const inventory = writable<InventoryData>({ inventoryItems: null });

db.watchInventoryItems((items) => {
	inventory.set({ inventoryItems: items });
});
