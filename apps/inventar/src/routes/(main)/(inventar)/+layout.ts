import { getInventoryItems } from '$lib/api/inventoryApi';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	return {
		inventoryItems: getInventoryItems()
	};
}) satisfies LayoutLoad;
