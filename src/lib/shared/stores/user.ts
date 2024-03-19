import { account } from '$lib/database/appwrite';
import type { Models } from 'appwrite';
import { writable } from 'svelte/store';

const isBrowser = typeof window !== 'undefined';

const createUser = () => {
	const store = writable<Models.User<Models.Preferences> | null>(null);

	async function init() {
		if (!isBrowser) return;
		try {
			store.set(await account.get());
		} catch (e) {
			store.set(null);
		}
	}

	init();

	async function isAuthenticated() {
		if (!isBrowser) return false;
		try {
			await account.get();
			return true;
		} catch (e) {
			return false;
		}
	}

	async function createAnonymousSession() {
		if (!isBrowser) return;
		await account.createAnonymousSession();
		await init();
	}

	return {
		// Exposes the store's value with $user
		subscribe: store.subscribe,
		isAuthenticated,
		createAnonymousSession,
		init
	};
};

export const user = createUser();
