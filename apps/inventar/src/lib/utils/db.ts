import Dexie from 'dexie';
import type { InventoryItem } from '$lib/api/inventoryModels';

// Extend Dexie with our database structure
export class AppDatabase extends Dexie {
	// Declare implicit table properties
	inventoryItems!: Dexie.Table<
		{
			id?: number;
			items: InventoryItem[];
			timestamp: number;
		},
		number
	>;

	constructor() {
		super('AppDatabase');

		// Define tables and indexes
		this.version(1).stores({
			// Primary key id (++), indexed by timestamp
			inventoryItems: '++id, timestamp'
		});
	}

	/**
	 * Get the most recent inventory items
	 */
	async getLatestInventoryItems(): Promise<InventoryItem[] | null> {
		const lastEntry = await this.inventoryItems.orderBy('timestamp').reverse().first();

		return lastEntry?.items || null;
	}

	/**
	 * Store new inventory items
	 */
	async storeInventoryItems(items: InventoryItem[]): Promise<void> {
		// Clean up old entries - keep only the last 2 versions
		const oldEntries = await this.inventoryItems.orderBy('timestamp').reverse().offset(2).toArray();

		// Delete old entries
		if (oldEntries.length > 0) {
			await this.inventoryItems.bulkDelete(oldEntries.map((entry) => entry.id!));
		}

		// Add new entry
		await this.inventoryItems.add({
			items,
			timestamp: Date.now()
		});
	}
}

// Create a single instance of the database
export const db = new AppDatabase();

// Export functions that use the db instance
export async function getStoredInventoryItems(): Promise<InventoryItem[] | null> {
	return await db.getLatestInventoryItems();
}

export async function storeInventoryItems(items: InventoryItem[]): Promise<void> {
	await db.storeInventoryItems(items);
}

// Helper function to clear the database (useful for testing/debugging)
export async function clearDatabase(): Promise<void> {
	await db.inventoryItems.clear();
}
