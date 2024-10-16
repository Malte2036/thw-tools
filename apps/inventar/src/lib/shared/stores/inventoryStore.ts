import type { InventoryItem } from '$lib/api/inventoryModels';
import { writable } from 'svelte/store';

export type InventoryData = {
	inventoryItems: InventoryItem[] | null;
	fetching?: Promise<any>;
};

export const inventory = writable<InventoryData>({
	inventoryItems: null
});

export const getInventoryItemByInventarNummer = (
	{ inventoryItems }: InventoryData,
	inventarNummer: string
): InventoryItem | undefined =>
	inventoryItems?.find((item) => item.inventarNummer === inventarNummer);
