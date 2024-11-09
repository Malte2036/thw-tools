import type { InventoryItem } from '$lib/api/inventoryModels';
import { writable } from 'svelte/store';
import { db } from '$lib/utils/db';

export type InventoryData = {
	fetching?: Promise<any>;
	fromCache?: boolean;
};

// Simplified store that only tracks loading state
export const inventory = writable<InventoryData>({});

// Query functions that work directly with Dexie
export async function getInventoryItemByInventarNummer(
	inventarNummer: string
): Promise<InventoryItem | undefined> {
	const items = await db.getLatestInventoryItems();
	return items?.find((item) => item.inventarNummer === inventarNummer);
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
	return (await db.getLatestInventoryItems()) ?? [];
}

export async function getInventoryItemsByEinheit(einheit: string): Promise<InventoryItem[]> {
	const items = await db.getLatestInventoryItems();
	return items?.filter((item) => item.einheit === einheit) ?? [];
}
