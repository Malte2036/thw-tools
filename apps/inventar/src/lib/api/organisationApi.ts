import { apiGet, apiPost } from './apiGeneric';
import type { User } from './funkModels';
import { OrganisationSchema, type Organisation } from './organisation';

export async function getOrganisationForUser(): Promise<Organisation> {
	return await apiGet<Organisation>(
		'/organisations/me',

		(data) => {
			const result = OrganisationSchema.safeParse(data);
			if (!result.success) {
				console.error('Error parsing Organisation:', result.error);
			}
			return result.success;
		}
	);
}

export async function joinOrganisation(inviteCode: string): Promise<Organisation> {
	return await apiPost<Organisation>(`/organisations/join/`, { inviteCode });
}

export async function createOrganisation(name: string): Promise<Organisation> {
	return await apiPost<Organisation>('/organisations/', { name });
}

export async function leaveOrganisation(): Promise<void> {
	await apiPost<void>('/organisations/leave');
}
