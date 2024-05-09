import { loadClothingSizesTables } from '$lib/clothing/clothingUtils';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async () => {
	return {
		tables: await loadClothingSizesTables()
	};
}) satisfies PageServerLoad;
