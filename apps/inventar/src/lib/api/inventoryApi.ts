import { updateLastFetched } from '$lib/shared/stores/apiMetaStore';
import { inventory } from '$lib/shared/stores/inventoryStore';
import { db } from '$lib/utils/db';
import { apiGet, apiPostFile, apiPatch } from './apiGeneric';
import { type DatabaseId } from './databaseModels';
import {
	ImportInventoryItemsResultZodSchema,
	InventoryItemZodSchema,
	type ImportInventoryItemsResult,
	type InventoryItem,
	type InventoryItemCustomData
} from './inventoryModels';

export async function fetchInventoryItems(): Promise<void> {
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

		await db.storeInventoryItems(result.data);
		updateLastFetched('inventory');

		return;
	} catch (error) {
		inventory.update((state) => ({ ...state, fetching: undefined }));
		throw error;
	}
}

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

export async function updateInventoryItemCustomData(
	inventoryItemId: DatabaseId,
	customData: InventoryItemCustomData
): Promise<void> {
	await apiPatch<void>(`/inventory/${inventoryItemId}/custom-data`, customData);
}
