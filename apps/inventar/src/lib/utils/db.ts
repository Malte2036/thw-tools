import Dexie from 'dexie';
import type { InventoryItem } from '$lib/api/inventoryModels';
import { liveQuery } from 'dexie';

// Extend Dexie with our database structure
export class AppDatabase extends Dexie {
	// Declare implicit table properties
	inventoryItems!: Dexie.Table<
		InventoryItem & {
			timestamp: number;
		},
		string
	>;

	constructor() {
		super('AppDatabase');

		// Define tables and indexes
		this.version(1).stores({
			// Primary key id , indexed by timestamp
			inventoryItems: 'id, timestamp, inventarNummer, einheit'
		});
	}

	/**
	 * Store new inventory items
	 */
	async storeInventoryItems(items: InventoryItem[]): Promise<void> {
		const timestamp = Date.now();
		const itemsWithTimestamp = items.map((item) => ({
			...item,
			timestamp
		}));

		// Start a transaction to ensure atomicity
		await this.transaction('rw', this.inventoryItems, async () => {
			await this.inventoryItems.clear();
			await this.inventoryItems.bulkAdd(itemsWithTimestamp);
		});
	}

	async getInventoryItems(): Promise<InventoryItem[]> {
		return await this.inventoryItems.toArray();
	}

	async watchInventoryItems(callback: (items: InventoryItem[]) => void): Promise<() => void> {
		// Use liveQuery to observe changes
		const subscription = liveQuery(() => this.inventoryItems.toArray()).subscribe({
			next: callback
		});

		// Return unsubscribe function
		return () => subscription.unsubscribe();
	}

	async getInventoryItemByInventarNummer(
		inventarNummer: string
	): Promise<InventoryItem | undefined> {
		return await this.inventoryItems.get({ inventarNummer });
	}

	async getInventoryItemsByEinheit(einheit: string): Promise<InventoryItem[]> {
		return await this.inventoryItems.where('einheit').equals(einheit).toArray();
	}

	async isDbEmpty(): Promise<boolean> {
		return (await this.inventoryItems.count()) === 0;
	}

	/**
	 * Update an inventory item with new data
	 * Used after API updates to keep local DB in sync
	 */
	async updateInventoryItem(updatedItem: InventoryItem): Promise<void> {
		// Preserve the original timestamp to avoid triggering unnecessary UI updates
		const existingItem = await this.inventoryItems.get(updatedItem.id);
		const timestamp = existingItem?.timestamp || Date.now();

		// Use a transaction to ensure atomicity and allow rollback on error
		await this.transaction('rw', this.inventoryItems, async () => {
			// First delete the existing item to prevent duplicates
			if (existingItem) {
				await this.inventoryItems.delete(updatedItem.id);
			}

			// Then add the updated item
			await this.inventoryItems.add({
				...updatedItem,
				timestamp
			});
		});
	}
}

export const db = new AppDatabase();
