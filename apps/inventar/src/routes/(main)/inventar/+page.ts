import { getToken, isAuthenticated, login } from '$lib/api/authApi';
import { getInventarItemEventBulks, getInventarItems } from '$lib/api/inventarApi';
import { userToFriendlyString } from '$lib/api/inventarItem';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import type { PageLoad } from './$types';

export const ssr = false;

export const load = (async () => {
	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login();
		return {};
	}

	try {
		const [organisation, inventarItems, inventarItemEventBulks] = await Promise.all([
			getOrganisationForUser().then((org) => {
				org.members.sort((a, b) => userToFriendlyString(a).localeCompare(userToFriendlyString(b)));
				return org;
			}),
			getInventarItems().then((items) =>
				items.sort(
					(a, b) => new Date(b.lastEvent.date).getTime() - new Date(a.lastEvent.date).getTime()
				)
			),
			getInventarItemEventBulks().then((bulks) =>
				bulks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			)
		]);

		return {
			inventarItems,
			inventarItemEventBulks,
			organisation
		};
	} catch (error) {
		console.error(error);
		return {};
	}
}) satisfies PageLoad;
