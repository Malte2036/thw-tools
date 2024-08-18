import { isAuthenticated, login } from '$lib/api/authApi';
import { getInventarItems } from '$lib/api/inventarApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!isAuthenticated()) {
		await login();
		return {
			inventarItems: []
		};
	}

	const inventarItems = await getInventarItems();
	console.log('inventarItems', inventarItems);

	return {
		inventarItems
	};
}) satisfies PageLoad;
