import { apiGet, apiPost } from './apiGeneric';
import { OrganisationSchema, type Organisation } from './organisationModels';

export async function getOrganisationForUser(): Promise<Organisation> {
	const response = await apiGet<Organisation>('/organisations/me', (data) => {
		const result = OrganisationSchema.safeParse(data);
		if (!result.success) {
			console.error('Error parsing Organisation:', result.error);
		}
		return result.success;
	});

	return OrganisationSchema.parse(response.data);
}

export async function joinOrganisation(inviteCode: string): Promise<Organisation> {
	const response = await apiPost<Organisation>(`/organisations/join/`, { inviteCode });
	return OrganisationSchema.parse(response.data);
}

export async function createOrganisation(name: string): Promise<Organisation> {
	const response = await apiPost<Organisation>('/organisations/', { name });
	return OrganisationSchema.parse(response.data);
}

export async function leaveOrganisation(): Promise<void> {
	await apiPost<void>('/organisations/leave');
}
