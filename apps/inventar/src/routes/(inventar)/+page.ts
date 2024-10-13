import { getToken, isAuthenticated, login } from '$lib/api/authApi';
import { getFunkItemEventBulks, getFunkItems } from '$lib/api/funkApi';
import { userToFriendlyString } from '$lib/api/funkModels';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import type { PageLoad } from './$types';

export const ssr = false;

const EMPTY = {
	funkItems: [],
	funkItemEventBulks: [],
	organisation: null
};

export const load = (async ({ url }) => {
	const isBrowser = typeof window !== 'undefined';
	if (!isBrowser) return EMPTY;

	if (!(await isAuthenticated())) {
		console.log('Not authenticated');

		await login(url);
		return EMPTY;
	}

	try {
		const [organisation, funkItems, funkItemEventBulks] = await Promise.all([
			getOrganisationForUser().then((org) => {
				org.members.sort((a, b) => userToFriendlyString(a).localeCompare(userToFriendlyString(b)));
				return org;
			}),
			getFunkItems().then((items) =>
				items.sort(
					(a, b) => new Date(b.lastEvent.date).getTime() - new Date(a.lastEvent.date).getTime()
				)
			),
			getFunkItemEventBulks().then((bulks) =>
				bulks.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			)
		]);

		return {
			funkItems,
			funkItemEventBulks,
			organisation
		};
	} catch (error) {
		console.error(error);
		return EMPTY;
	}
}) satisfies PageLoad;
