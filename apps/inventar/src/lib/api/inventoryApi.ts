import { apiGet } from './apiGeneric';
import { InventoryItemZodSchema, type InventoryItem } from './inventoryModels';

export async function getInventoryItemByInventarNummer(
	inventarNummer: string
): Promise<InventoryItem> {
	return await apiGet<InventoryItem>(`/inventory/inventarNummer/${inventarNummer}`, (data) => {
		const result = InventoryItemZodSchema.safeParse(data);
		if (!result.success) {
			console.error('Error parsing InventoryItem:', result.error);
		}
		return result.success;
	});
}
