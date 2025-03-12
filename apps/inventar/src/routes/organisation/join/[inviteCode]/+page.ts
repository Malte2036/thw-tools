import { isAuthenticated, login } from '$lib/api/authApi';
import { joinOrganisation } from '$lib/api/organisationApi';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ url, params: { inviteCode } }) => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		throw error(401, 'Not authenticated');
	}

	if (!inviteCode) {
		throw error(400, 'No invite code');
	}

	return {
		organisation: joinOrganisation(inviteCode)
	};
}) satisfies PageLoad;
