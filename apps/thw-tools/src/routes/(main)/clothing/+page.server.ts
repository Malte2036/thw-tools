import fs from 'fs/promises';
import path from 'path';
import type { PageServerLoad } from './$types';
import type { ClothingSizesTable } from '$lib/clothing/clothing';
import { loadClothingSizesTables } from '$lib/clothing/clothingUtils';

export const prerender = true;

export const load = (async () => {
	return {
		tables: loadClothingSizesTables()
	};
}) satisfies PageServerLoad;
