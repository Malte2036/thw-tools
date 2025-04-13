import { writable } from 'svelte/store';
import type { InventurState, CreateInventurSessionDto, InventurSession } from '../types';
import { createInventurSession } from '../inventurApi';
import { goto } from '$app/navigation';

function createInventurStore() {
	const initialState: InventurState = {
		activeSession: null,
		isLoading: false,
		error: null
	};

	const { subscribe, set, update } = writable<InventurState>(initialState);

	return {
		subscribe,
		startNewInventur: async (createDto: CreateInventurSessionDto) => {
			update((state) => ({
				...state,
				isLoading: true,
				error: null
			}));

			try {
				const newSession: InventurSession = await createInventurSession(createDto);
				update((state) => ({
					...state,
					activeSession: newSession,
					isLoading: false
				}));
				// Optional: Navigate to the main inventur page after starting
				goto(`/inventar/inventur/${newSession.id}`); // Assuming a dynamic route per session
			} catch (err: any) {
				console.error('Failed to start new inventur session:', err);
				update((state) => ({
					...state,
					isLoading: false,
					error: err.message || 'Inventursitzung konnte nicht gestartet werden.'
				}));
			}
		},
		setError: (errorMessage: string | null) => {
			update((state) => ({
				...state,
				error: errorMessage
			}));
		},
		// TODO: Add methods for scanning, updating items, completing session etc.
		reset: () => set(initialState)
	};
}

export const inventurStore = createInventurStore();
