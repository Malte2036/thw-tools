import { getToken, isAuthenticated, login } from '$lib/api/authApi';
import { getInventarItems } from '$lib/api/inventarApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ params }) => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login();
		return {};
	}

	const deviceId = params.deviceId;
	if (!deviceId) {
		throw new Error('No deviceId provided');
	}

	return {
		deviceId
	};
}) satisfies PageLoad;
