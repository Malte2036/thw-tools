import { apiGet, apiPost } from './apiGeneric';
import { InventoryItemZodSchema, type InventoryItem } from './inventoryModels';

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

export async function uploadInventoryTHWInExportFile(file: File): Promise<void> {
	const formData = new FormData();
	formData.append('file', file, file.name);
	console.log('uploadInventoryTHWInExportFile', file);

	return apiPost<void>('/inventory/import/csv', formData);
}
