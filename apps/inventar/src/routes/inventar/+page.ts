import { isAuthenticated, login } from '$lib/api/authApi';
import type { PageLoad } from './$types';

export const ssr = false;

const EMPTY = {};

export const load = (async ({ url }) => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) return EMPTY;

	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		return EMPTY;
	}

	return {};
}) satisfies PageLoad;
