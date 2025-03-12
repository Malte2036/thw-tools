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
	funkItemEventBulks?.flatMap((bulk) => bulk.events).find((event) => event.eventId === internalId)
		?.event;

export const getLastFunkItemEventByFunkItemInternalId = (
	{ funkItemEventBulks }: FunkData,
	funkItemId: FunkItemId
): FunkItemEvent | undefined => {
	if (!funkItemEventBulks) return undefined;

	const events = funkItemEventBulks.flatMap((bulk) => bulk.events);

	const filteredEvents = events.filter((event) => event.event.funkItemId === funkItemId);

	if (filteredEvents.length === 0) return undefined;

	filteredEvents.sort(
		(a, b) => new Date(b.event.date).getTime() - new Date(a.event.date).getTime()
	);

	return filteredEvents[0].event;
};

export const getAllFunkItemEventsByFunkItemDeviceId = (
	funkData: FunkData,
	deviceId: string
): FunkItemEvent[] => {
	if (!funkData.funkItemEventBulks) return [];

	const events = funkData.funkItemEventBulks.flatMap((bulk) => bulk.events);

	return events
		.map((event) => ({
			event,
			deviceId:
				event.event.funkItemId &&
				getFunkItemByInternalId(funkData, event.event.funkItemId)?.deviceId
		}))
		.filter((event) => event.deviceId === deviceId)
		.map((event) => event.event.event);
};
