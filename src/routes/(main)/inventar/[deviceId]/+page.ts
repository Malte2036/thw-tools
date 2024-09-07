import { isAuthenticated, login } from '$lib/api/authApi';
import type { PageLoad } from './$types';

export const ssr = false;

const EMPTY = {
	deviceId: null
};

export const load = (async ({ params }) => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login();
		return EMPTY;
	}

	const deviceId = params.deviceId;
	if (!deviceId) {
		throw new Error('No deviceId provided');
	}

	return {
		deviceId
	};
}) satisfies PageLoad;
