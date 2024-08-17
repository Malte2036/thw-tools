type User = {
	firstName: string;
	lastName: string;
	email: string;
};

export type InventarItem = {
	deviceId: string;
	isUsed: boolean;
	lastUsedBy: User;
};
