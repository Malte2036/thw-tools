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

export function eventTypeToFriendlyString(eventType: InventarItemEventType): string {
	switch (eventType) {
		case 'borrowed':
			return 'ausgeliehen ✅';
		case 'returned':
			return 'zurückgegeben ❌';
	}

	return eventType;
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
