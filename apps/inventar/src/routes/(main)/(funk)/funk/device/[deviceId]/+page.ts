import { isAuthenticated, login } from '$lib/api/authApi';
import { FunkItemDeviceIdSchema } from '$lib/api/funkModels';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

const EMPTY = {
	deviceId: null
};

export const load = (async ({ url, params }) => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		return EMPTY;
	}

	const deviceId = FunkItemDeviceIdSchema.safeParse(params.deviceId);
	if (!deviceId.success) {
		throw error(404, 'Device not found');
	}

	return {
		deviceId: deviceId.data
	};
}) satisfies PageLoad;
