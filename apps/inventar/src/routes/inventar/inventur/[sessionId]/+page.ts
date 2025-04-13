import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { getInventurSessionDetails } from '$lib/inventur/inventurApi';

export const load: PageLoad = async ({ params, fetch }) => {
	const sessionId = params.sessionId;

	try {
		// Fetch only session details. Inventory items are loaded by layout.
		const sessionDetails = await getInventurSessionDetails(sessionId);

		return {
			sessionId,
			sessionDetails
		};
	} catch (err: any) {
		console.error('Load function error:', err);
		throw error(err.status || 500, err.message || 'Fehler beim Laden der Inventurdaten');
	}
};
