import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

const defaultColumns = [
	'inventarNummer',
	'einheit',
	'ausstattung',
	'art',
	'menge',
	'verfuegbar',
	'hersteller',
	'typ',
	'sachNummer',
	'gerateNummer',
	'status'
];

const localStorageKey = 'visible-inventory-columns';

function getSavedColumns(): string[] {
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
