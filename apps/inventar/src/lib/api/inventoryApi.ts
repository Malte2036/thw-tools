import { db } from '$lib/utils/db';
import { apiGet, apiPostFile, type ResponeData } from './apiGeneric';
import {
	ImportInventoryItemsResultZodSchema,
	InventoryItemZodSchema,
	type ImportInventoryItemsResult,
	type InventoryItem
} from './inventoryModels';
import { inventory } from '$lib/shared/stores/inventoryStore';
import { apiMeta, updateLastFetched } from '$lib/shared/stores/apiMetaStore';

export async function getInventoryItems(): Promise<{
	fromCache: boolean;
}> {
	// First try to get data from IndexedDB
	const isDbEmpty = await db.isDbEmpty();

	// Return stored data immediately if available
	if (!isDbEmpty) {
		// Start fetching fresh data in the background
		fetchItems();

		return {
			fromCache: true
		};
	}

	// If no stored data, wait for the API response
	const items = await fetchItems();
	await db.storeInventoryItems(items.data);

	return {
		fromCache: false
	};
}

async function fetchItems(): Promise<ResponeData<InventoryItem[]>> {
	const fetchPromise = apiGet<InventoryItem[]>('/inventory', (data) => {
		const result = InventoryItemZodSchema.array().safeParse(data);
		if (!result.success) {
			console.error('Error parsing InventoryItem[]:', result.error);
		}
		return result.success;
	});

	inventory.update((state) => ({ ...state, fetching: fetchPromise }));

	try {
		const result = await fetchPromise;

		inventory.update((state) => ({
			...state,
			fetching: undefined
		}));

		updateLastFetched('inventory');

		return result;
	} catch (error) {
		inventory.update((state) => ({ ...state, fetching: undefined }));
		throw error;
	}
}

// export async function getInventoryItemByInventarNummer(
// 	inventarNummer: string
// ): Promise<InventoryItem> {
// 	return await apiGet<InventoryItem>(`/inventory/inventarNummer/${inventarNummer}`, (data) => {
// 		const result = InventoryItemZodSchema.safeParse(data);
// 		if (!result.success) {
// 			console.error('Error parsing InventoryItem:', result.error);
// 		}
// 		return result.success;
// 	});
// }

export async function uploadInventoryTHWInExportFile(
	file: File
): Promise<ImportInventoryItemsResult> {
	const response = await apiPostFile<ImportInventoryItemsResult>(
		'/inventory/import/csv',
		file,
		(data) => {
			const result = ImportInventoryItemsResultZodSchema.safeParse(data);
			if (!result.success) {
				console.error('Error parsing ImportInventoryItemsResult:', result.error);
			}
			return result.success;
		}
	);
	return response.data;
}
