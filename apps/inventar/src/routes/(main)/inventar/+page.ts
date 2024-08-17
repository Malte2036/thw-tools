import { isAuthenticated } from '$lib/api/authApi';
import { getInventarItems } from '$lib/api/inventarApi';
import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!isAuthenticated()) {
		redirect(302, '/auth/callback');
	}

	const inventarItems = await getInventarItems();
	console.log('inventarItems', inventarItems);

	return {
		inventarItems
	};
}) satisfies PageLoad;
