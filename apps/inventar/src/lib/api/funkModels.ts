import { BRAND, z } from 'zod';
import { dateToFriendlyString, searchStringIsInArray } from '$lib/utils';
import { UserIdSchema, type User } from './organisationModels';

export const inventarNummerRegex = /^\d{4}-S?\d{6}$/;
export const InventarNummer = z
	.string()
	.regex(inventarNummerRegex, 'Invalid inventar number format');

export type FunkItemId = string & BRAND<'FunkItemId'>;
export const FunkItemIdSchema = z.string().brand<'FunkItemId'>();

export type FunkItemDeviceId = string & BRAND<'FunkItemDeviceId'>;
export const FunkItemDeviceIdSchema = z.string().brand<'FunkItemDeviceId'>();

export type FunkItemEventId = string & BRAND<'FunkItemEventId'>;
export const FunkItemEventIdSchema = z.string().brand<'FunkItemEventId'>();

export type FunkItemEventBulkId = string & BRAND<'FunkItemEventBulkId'>;
export const FunkItemEventBulkIdSchema = z.string().brand<'FunkItemEventBulkId'>();

export const FunkItemSchema = z.object({
	id: FunkItemIdSchema,
	deviceId: FunkItemDeviceIdSchema,
	lastEvent: FunkItemEventIdSchema.optional()
});

export type FunkItem = z.infer<typeof FunkItemSchema>;

export type FunkItemEventType = 'borrowed' | 'returned';

export const FunkItemEventSchema = z.object({
	eventId: FunkItemEventIdSchema,
	bulkId: FunkItemEventBulkIdSchema,
	event: z.object({
		id: FunkItemEventIdSchema,
		funkItemId: FunkItemIdSchema,
		userId: UserIdSchema,
		type: z.enum(['borrowed', 'returned']).default('borrowed'),
		date: z.string()
	})
});

export type FunkItemEvent = z.infer<typeof FunkItemEventSchema>;

export const FunkItemEventBulkSchema = z.object({
	id: FunkItemEventBulkIdSchema,
	events: z.array(FunkItemEventSchema),
	batteryCount: z.number(),
	eventType: z.enum(['borrowed', 'returned']),
	userId: UserIdSchema,
	date: z.string()
});

export type FunkItemEventBulk = z.infer<typeof FunkItemEventBulkSchema>;

export function eventTypeToFriendlyString(eventType: FunkItemEventType): string {
	switch (eventType) {
		case 'borrowed':
			return 'ausgeliehen';
		case 'returned':
			return 'zurückgegeben';
	}

	return eventType;
}

export function eventTypeToEmoji(eventType: FunkItemEventType): string {
	switch (eventType) {
		case 'borrowed':
			return '❌';
		case 'returned':
			return '✅';
	}

	return '?';
}

export function userToFriendlyString(user: User): string {
	if (user.firstName && user.lastName) {
		return `${user.firstName} ${user.lastName}`;
	}

	if (user.firstName) {
		return user.firstName;
	}

	if (user.lastName) {
		return user.lastName;
	}

	return 'Unbekannt';
}

export function batteryCountToFriendlyString(batteryCount: number): string {
	return `${batteryCount} Batterie${batteryCount === 1 ? '' : 'n'}`;
}

export function isSearchStringInFunkItemEventBulk(
	searchString: string,
	eventBulk: FunkItemEventBulk,
	bulkUser: User | undefined,
	deviceIds: FunkItemDeviceId[]
): boolean {
	return searchStringIsInArray(searchString.trim(), [
		bulkUser && userToFriendlyString(bulkUser),
		dateToFriendlyString(new Date(eventBulk.date)),
		eventTypeToFriendlyString(eventBulk.eventType),
		batteryCountToFriendlyString(eventBulk.batteryCount),
		...deviceIds
	]);
}

export function isSearchStringInFunkItem(
	searchString: string,
	item: FunkItem,
	lastEvent: FunkItemEvent,
	eventUser: User | undefined
): boolean {
	return (
		searchStringIsInArray(searchString.trim(), [item.deviceId].filter(Boolean)) ||
		isSearchStringInFunkItemEvent(searchString, lastEvent, eventUser)
	);
}

export function isSearchStringInFunkItemEvent(
	searchString: string,
	event: FunkItemEvent,
	eventUser: User | undefined
): boolean {
	return searchStringIsInArray(searchString.trim(), [
		eventUser && userToFriendlyString(eventUser),
		dateToFriendlyString(new Date(event.event.date)),
		eventTypeToFriendlyString(event.event.type)
	]);
}
