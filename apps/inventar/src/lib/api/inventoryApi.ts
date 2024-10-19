import { apiGet, apiPostFile } from './apiGeneric';
import {
	ImportInventoryItemsResultZodSchema,
	InventoryItemZodSchema,
	type ImportInventoryItemsResult,
	type InventoryItem
} from './inventoryModels';

export async function getInventoryItems(): Promise<InventoryItem[]> {
	return await apiGet<InventoryItem[]>('/inventory', (data) => {
		const result = InventoryItemZodSchema.array().safeParse(data);
		if (!result.success) {
			console.error('Error parsing InventoryItem[]:', result.error);
		}
		return result.success;
	});
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
	return apiPostFile<ImportInventoryItemsResult>('/inventory/import/csv', file, (data) => {
		const result = ImportInventoryItemsResultZodSchema.safeParse(data);
		if (!result.success) {
			console.error('Error parsing ImportInventoryItemsResult:', result.error);
		}
		return result.success;
	});
}
