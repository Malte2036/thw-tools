import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export type ApiMetaData = {
	lastFetched: {
		[key: string]: Date | undefined;
	};
};

// Initialize store with persisted data if available
const initialData: ApiMetaData = {
	lastFetched: {}
};

if (browser) {
	const stored = localStorage.getItem('apiMetaStore');
	if (stored) {
		const parsedData = JSON.parse(stored);
		// Convert stored ISO strings back to Date objects
		Object.keys(parsedData.lastFetched).forEach((key) => {
			if (parsedData.lastFetched[key]) {
				parsedData.lastFetched[key] = new Date(parsedData.lastFetched[key]);
			}
		});
		Object.assign(initialData.lastFetched, parsedData.lastFetched);
	}
}

export const apiMeta = writable<ApiMetaData>(initialData);

// Persist store changes to localStorage
if (browser) {
	apiMeta.subscribe((value) => {
		localStorage.setItem('apiMetaStore', JSON.stringify(value));
	});
}

// Helper functions
export function updateLastFetched(key: string) {
	apiMeta.update((state) => ({
		...state,
		lastFetched: {
			...state.lastFetched,
			[key]: new Date()
		}
	}));
}

export function getLastFetched(key: string): Date | undefined {
	let result: Date | undefined;
	apiMeta.subscribe((state) => {
		result = state.lastFetched[key];
	})();
	return result;
}
