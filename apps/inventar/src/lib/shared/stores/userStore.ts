import type { Organisation, OrganisationMember, User, UserId } from '$lib/api/organisationModels';
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

export const getOrganisationMemberByInternalId = (
	{ organisation }: UserData,
	internalId: UserId
): OrganisationMember | undefined =>
	organisation?.members?.find((user) => user.userId === internalId);
