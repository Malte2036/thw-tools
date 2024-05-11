import { browser } from '$app/environment';
import type { HumanGender } from '$lib/clothing/clothing';
import { loadClothingSizesTables } from '$lib/clothing/clothingConstantUtils';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	const name = params.name as string;
	const gender = params.gender as HumanGender;

	const tables = await loadClothingSizesTables();

	const table = tables.find((table) => table.name === name && table.gender === gender);
	if (!table) {
		throw new Error(`Clothing table not found for name ${name} and gender ${gender} not found`);
	}

	return {
		table
	};
}) satisfies PageServerLoad;
