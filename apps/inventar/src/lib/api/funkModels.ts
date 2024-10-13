import { dateToFriendlyString, searchStringIsInArray } from '$lib/utils';

type InternalId = string;

export type User = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export type FunkItemDeviceId = string;

export type FunkItem = {
	_id: InternalId;
	deviceId: FunkItemDeviceId;
	lastEvent: FunkItemEvent;
	name?: string;
};

export type FunkItemEventType = 'borrowed' | 'returned';

export type FunkItemEvent = {
	_id: InternalId;
	funkItem: FunkItem;
	user: User;
	type: FunkItemEventType;
	date: string;
};

export type FunkItemEventBulk = {
	_id: InternalId;
	funkItemEvents: FunkItemEvent[];
	batteryCount: number;
	eventType: FunkItemEventType;
	user: User;
	date: string;
};

export const deviceIdRegex = /^\d{4}-\d{6}$/;

export function validateFunkItemDeviceId(deviceId: string): boolean {
	return deviceIdRegex.test(deviceId);
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
	deviceIds: FunkItemDeviceId[]
): boolean {
	return searchStringIsInArray(searchString.trim(), [
		userToFriendlyString(eventBulk.user),
		dateToFriendlyString(new Date(eventBulk.date)),
		eventTypeToFriendlyString(eventBulk.eventType),
		batteryCountToFriendlyString(eventBulk.batteryCount),
		...deviceIds
	]);
}

export function isSearchStringInFunkItem(searchString: string, item: FunkItem): boolean {
	return (
		searchStringIsInArray(searchString.trim(), [item.deviceId, item.name].filter(Boolean)) ||
		isSearchStringInFunkItemEvent(searchString, item.lastEvent)
	);
}

export function isSearchStringInFunkItemEvent(searchString: string, event: FunkItemEvent): boolean {
	return searchStringIsInArray(searchString.trim(), [
		userToFriendlyString(event.user),
		dateToFriendlyString(new Date(event.date)),
		eventTypeToFriendlyString(event.type)
	]);
}
