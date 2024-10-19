import { isAuthenticated, login } from '$lib/api/authApi';
import { userToFriendlyString } from '$lib/api/funkModels';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import type { LayoutLoad } from './$types';

export const ssr = false;

const EMPTY = {
	organisation: Promise.resolve(null)
};

export const load = (async ({ url }) => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) return EMPTY;

	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		return EMPTY;
	}

	return {
		organisation: getOrganisationForUser().then((org) => {
			org.members.sort((a, b) => userToFriendlyString(a).localeCompare(userToFriendlyString(b)));
			return org;
		})
	};
}) satisfies LayoutLoad;
