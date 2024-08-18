type User = {
	firstName?: string;
	lastName?: string;
	email?: string;
};

export type InventarItem = {
	deviceId: string;
	lastEvent: InventarItemEvent;
};

export type InventarItemEventType = 'borrowed' | 'returned';

export type InventarItemEvent = {
	user: User;
	type: InventarItemEventType;
	date: Date;
};
