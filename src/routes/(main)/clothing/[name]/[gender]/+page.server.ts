import { browser } from '$app/environment';
import type { HumanGender } from '$lib/clothing/clothing';
import { loadClothingSizesTables } from '$lib/clothing/clothingUtils';
import type { PageServerLoad } from '../$types';

export const prerender = true;

export const load = (async ({ params, url }) => {
	const name = params.name as string;
	const gender = params.gender as HumanGender;
	const size: number | undefined =
		browser && url.searchParams.has('size')
			? parseInt(url.searchParams.get('size') as string)
			: undefined;

	const tables = await loadClothingSizesTables();

	const table = tables.find((table) => table.name === name && table.gender === gender);
	if (!table) {
		throw new Error(`Clothing table not found for name ${name} and gender ${gender} not found`);
	}

	return {
		table,
		selectedSize: size
	};
}) satisfies PageServerLoad;
