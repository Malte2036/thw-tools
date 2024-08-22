import { dateToFriendlyString, searchStringIsInArray } from '$lib/utils';

type User = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export type InventarItemDeviceId = string;

export type InventarItem = {
	deviceId: InventarItemDeviceId;
	lastEvent: InventarItemEvent;
};

export type InventarItemEventType = 'borrowed' | 'returned';

export type InventarItemEvent = {
	user: User;
	type: InventarItemEventType;
	date: string;
};

export const deviceIdRegex = /^\d{4}-\d{6}$/;

export function validateInventarItemDeviceId(deviceId: string): boolean {
	return deviceIdRegex.test(deviceId);
}

export function eventTypeToFriendlyString(eventType: InventarItemEventType): string {
	switch (eventType) {
		case 'borrowed':
			return 'ausgeliehen';
		case 'returned':
			return 'zurückgegeben';
	}

	return eventType;
}

export function eventTypeToEmoji(eventType: InventarItemEventType): string {
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

export function isSearchStringInInventarItem(
	searchString: string,
	inventarItem: InventarItem
): boolean {
	return (
		searchStringIsInArray(searchString.trim(), [inventarItem.deviceId]) ||
		isSearchStringInInventarItemEvent(searchString, inventarItem.lastEvent)
	);
}

export function isSearchStringInInventarItemEvent(
	searchString: string,
	event: InventarItemEvent
): boolean {
	return searchStringIsInArray(searchString.trim(), [
		userToFriendlyString(event.user),
		dateToFriendlyString(new Date(event.date)),
		eventTypeToFriendlyString(event.type)
	]);
}
