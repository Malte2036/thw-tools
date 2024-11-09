import Dexie from 'dexie';
import type { InventoryItem } from '$lib/api/inventoryModels';
import { liveQuery } from 'dexie';

// Extend Dexie with our database structure
export class AppDatabase extends Dexie {
	// Declare implicit table properties
	inventoryItems!: Dexie.Table<
		InventoryItem & {
			_id?: number;
			timestamp: number;
		},
		number
	>;

	constructor() {
		super('AppDatabase');

		// Define tables and indexes
		this.version(1).stores({
			// Primary key _id (++), indexed by timestamp
			inventoryItems: '++_id, timestamp, inventarNummer, einheit'
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

		await this.inventoryItems.clear();

		await this.inventoryItems.bulkAdd(itemsWithTimestamp);
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
}

export const db = new AppDatabase();
