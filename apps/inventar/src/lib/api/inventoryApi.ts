import { apiGet } from './apiGeneric';
import type { InventoryItem } from './inventoryModels';

export async function getInventoryItemByInventarNummer(
	inventarNummer: string
): Promise<InventoryItem> {
	return await apiGet<InventoryItem>(`/inventory/inventarNummer/${inventarNummer}`);
}
