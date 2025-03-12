import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export const inventoryColumns: { id: string; label: string }[] = [
	{ id: 'inventarNummer', label: 'Inventar-Nr.' },
	{ id: 'einheit', label: 'Einheit' },
	{ id: 'ausstattung', label: 'Ausstattung' },
	{ id: 'art', label: 'Art' },
	{ id: 'menge', label: 'Menge (Soll/Ist)' },
	{ id: 'verfuegbar', label: 'Verfügbar' },
	{ id: 'hersteller', label: 'Hersteller' },
	{ id: 'typ', label: 'Typ' },
	{ id: 'sachNummer', label: 'Sach-Nr.' },
	{ id: 'gerateNummer', label: 'Geräte-Nr.' },
	{ id: 'status', label: 'Status' },
	{ id: 'lastScanned', label: 'Letzter Scan' }
];

const localStorageKey = 'visible-inventory-columns';

function getSavedColumns(): string[] {
	const defaultColumns = inventoryColumns.map((column) => column.id);

	if (!browser) return defaultColumns;

	const stored = localStorage.getItem(localStorageKey);
	if (stored) {
		try {
			const parsed = JSON.parse(stored);
			// Ensure at least one column is visible
			return parsed.length > 0 ? parsed : defaultColumns;
		} catch (e) {
			console.error('Error parsing visible columns from local storage', e);
			return defaultColumns;
		}
	}
	return defaultColumns;
}

export const visibleInventoryColumns: Writable<string[]> = writable<string[]>(
	getSavedColumns(),
	() => {
		if (!browser) return;

		const unsubscribe = visibleInventoryColumns.subscribe((value: string[]) =>
			localStorage.setItem(localStorageKey, JSON.stringify(value))
		);

		return unsubscribe;
	}
);
