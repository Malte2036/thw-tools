import type {
	FunkItem,
	FunkItemDeviceId,
	FunkItemEvent,
	FunkItemEventBulk,
	FunkItemEventId,
	FunkItemId
} from '$lib/api/funkModels';
import { writable } from 'svelte/store';

export type FunkData = {
	funkItems: FunkItem[] | null;
	funkItemEventBulks: FunkItemEventBulk[] | null;
	fetching?: Promise<any>;
};

export const funk = writable<FunkData>({
	funkItems: null,
	funkItemEventBulks: null
});

export const getFunkItemByInternalId = ({ funkItems }: FunkData, internalId: FunkItemId) =>
	funkItems?.find((item) => item.id === internalId);

export const getFunkItemByDeviceId = ({ funkItems }: FunkData, deviceId: FunkItemDeviceId) =>
	funkItems?.find((item) => item.deviceId === deviceId);

export const getFunkItemEventByInternalId = (
	{ funkItemEventBulks }: FunkData,
	internalId: FunkItemEventId
): FunkItemEvent | undefined =>
	funkItemEventBulks
		?.flatMap((bulk) => bulk.funkItemEvents)
		.find((event) => event.id === internalId);

export const getLastFunkItemEventByFunkItemInternalId = (
	{ funkItemEventBulks }: FunkData,
	funkItemId: FunkItemId
): FunkItemEvent | undefined => {
	if (!funkItemEventBulks) return undefined;

	const events = funkItemEventBulks.flatMap((bulk) => bulk.funkItemEvents);

	const filteredEvents = events.filter((event) => event.funkItem.id === funkItemId);

	if (filteredEvents.length === 0) return undefined;

	filteredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return filteredEvents[0];
};

export const getAllFunkItemEventsByFunkItemDeviceId = (
	funkData: FunkData,
	deviceId: string
): FunkItemEvent[] => {
	if (!funkData.funkItemEventBulks) return [];

	const events = funkData.funkItemEventBulks.flatMap((bulk) => bulk.funkItemEvents);

	return events
		.map((event) => ({
			event,
			deviceId: event.funkItem && getFunkItemByInternalId(funkData, event.funkItem.id)?.deviceId
		}))
		.filter((event) => event.deviceId === deviceId)
		.map((event) => event.event);
};
