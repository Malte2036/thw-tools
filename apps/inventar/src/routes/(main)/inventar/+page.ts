import { getInventarItems } from '$lib/api/inventarApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	const inventarItems = await getInventarItems();
	return {
		inventarItems
	};
}) satisfies PageLoad;
