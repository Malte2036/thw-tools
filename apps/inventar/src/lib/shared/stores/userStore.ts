import type { User } from '$lib/api/funkModels';
import type { Organisation } from '$lib/api/organisation';
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
	internalId: string
): User | undefined => organisation?.members?.find((user) => user._id === internalId);
