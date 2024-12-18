import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export type SettingsData = {
	selectedCamera: string | null;
};

const defaultSettings: SettingsData = {
	selectedCamera: null
};

const localStorageKey = 'settings';
function getSavedSettings(): SettingsData {
	if (!browser) return defaultSettings;

	const stored = localStorage.getItem(localStorageKey);
	if (stored) {
		try {
			return JSON.parse(stored);
		} catch (e) {
			console.error('Error parsing settings from local storage', e);
			return defaultSettings;
		}
	}
	return defaultSettings;
}

export const settings: Writable<SettingsData> = writable<SettingsData>(getSavedSettings(), () => {
	if (!browser) return;

	const unsubscribe = settings.subscribe((value: SettingsData) =>
		localStorage.setItem(localStorageKey, JSON.stringify(value))
	);

	return unsubscribe;
});
