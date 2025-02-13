import type { Organisation, User, UserId } from '$lib/api/organisationModels';
import { writable } from 'svelte/store';

export type UserData = {
	user: User | null;
	organisation: Organisation | null;
	fetching?: Promise<any>;
};

export const user = writable<UserData>({
	user: null,
	organisation: null
});

export const getOrganisationUserByInternalId = (
	{ organisation }: UserData,
	internalId: UserId
): User | undefined => organisation?.members?.find((user) => user.id === internalId);
