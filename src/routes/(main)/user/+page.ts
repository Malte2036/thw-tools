import { isAuthenticated, login } from '$lib/api/authApi';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!isAuthenticated()) {
		await login();
		return {
			organisation: null
		};
	}

	const organisation = await getOrganisationForUser();

	return {
		organisation
	};
}) satisfies PageLoad;
