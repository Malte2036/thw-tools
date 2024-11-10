import { z } from 'zod';
import { dateToFriendlyString, searchStringIsInArray } from '$lib/utils';
import type { User } from './organisationModels';

export const inventarNummerRegex = /^\d{4}-S?\d{6}$/;
export const InventarNummer = z
	.string()
	.regex(inventarNummerRegex, 'Invalid inventar number format');

export type FunkItemDeviceId = string;

export const FunkItemSchema = z.object({
	_id: z.string(),
	deviceId: InventarNummer,
	lastEvent: z.string().optional()
});

export type FunkItem = z.infer<typeof FunkItemSchema>;

export type FunkItemEventType = 'borrowed' | 'returned';

export const FunkItemEventSchema = z.object({
	_id: z.string(),
	funkItem: z.string().optional(),
	user: z.string(),
	type: z.enum(['borrowed', 'returned']).default('borrowed'),
	date: z.string()
});

export type FunkItemEvent = z.infer<typeof FunkItemEventSchema>;

export const FunkItemEventBulkSchema = z.object({
	_id: z.string(),
	funkItemEvents: z.array(FunkItemEventSchema),
	batteryCount: z.number(),
	eventType: z.enum(['borrowed', 'returned']),
	user: z.string(),
	date: z.string()
});

export type FunkItemEventBulk = z.infer<typeof FunkItemEventBulkSchema>;

export function validateFunkItemDeviceId(deviceId: string): boolean {
	return InventarNummer.safeParse(deviceId).success;
}

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

	if (user.email) {
		return user.email;
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
		dateToFriendlyString(new Date(event.date)),
		eventTypeToFriendlyString(event.type)
	]);
}
