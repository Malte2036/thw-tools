import { writable } from 'svelte/store';

export type SettingsData = {
	selectedCamera: string | null;
};

export const settings = writable<SettingsData>({
	selectedCamera: null
});
