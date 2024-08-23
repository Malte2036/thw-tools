import { getToken, isAuthenticated, login } from '$lib/api/authApi';
import { getInventarItemEventBulks, getInventarItems } from '$lib/api/inventarApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login();
		return {
			inventarItems: [],
			inventarItemEventBulks: []
		};
	}

	const inventarItems = await getInventarItems();
	inventarItems.sort(
		(a, b) => new Date(b.lastEvent.date).getTime() - new Date(a.lastEvent.date).getTime()
	);

	const inventarItemEventBulks = await getInventarItemEventBulks();
	inventarItemEventBulks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return {
		inventarItems,
		inventarItemEventBulks
	};
}) satisfies PageLoad;
