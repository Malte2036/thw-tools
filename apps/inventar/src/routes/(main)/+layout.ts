import { isAuthenticated, login } from '$lib/api/authApi';
import { getFunkItemEventBulks, getFunkItems } from '$lib/api/funkApi';
import { userToFriendlyString } from '$lib/api/funkModels';
import { getOrganisationForUser } from '$lib/api/organisationApi';
import { getLastFunkItemEventByFunkItemInternalId } from '$lib/shared/stores/funkStore';
import type { LayoutLoad } from './$types';
import { fetchInventoryItems } from '$lib/api/inventoryApi';

export const ssr = false;

const EMPTY = {
	organisation: Promise.resolve(null),
	inventoryItems: Promise.resolve(null),
	funkData: Promise.resolve(null)
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
		}),
		inventoryItems: fetchInventoryItems(),
		funkData: Promise.all([getFunkItems(), getFunkItemEventBulks()]).then(([items, bulks]) => {
			return {
				funkItems: items
					.map((item) => ({
						item: item,
						lastEvent: getLastFunkItemEventByFunkItemInternalId(
							{ funkItems: items, funkItemEventBulks: bulks },
							item.id
						)
					}))
					.sort((a, b) => {
						const dateA = a.lastEvent ? new Date(a.lastEvent.date).getTime() : 0;
						const dateB = b.lastEvent ? new Date(b.lastEvent.date).getTime() : 0;
						return dateB - dateA;
					})
					.map((item) => item.item),
				funkItemEventBulks: bulks.sort(
					(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
				)
			};
		})
	};
}) satisfies LayoutLoad;
