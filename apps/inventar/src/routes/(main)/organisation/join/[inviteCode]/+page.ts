import { isAuthenticated, login } from '$lib/api/authApi';
import { joinOrganisation } from '$lib/api/organisationApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async ({ params: { inviteCode } }) => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login();
		return {};
	}

	if (!inviteCode) {
		console.log('No invite code');
		return {};
	}

	try {
		const organisation = await joinOrganisation(inviteCode);
		return {
			organisation
		};
	} catch (error) {
		return {};
	}
}) satisfies PageLoad;
