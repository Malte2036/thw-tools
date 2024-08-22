import { apiGet } from './apiGeneric';

export type Organisation = {
	_id: string;
	name: string;
	members: string[];
};

export async function getOrganisations(): Promise<Organisation[]> {
	return await apiGet<Organisation[]>('/organisations');
}

export async function getOrganisationForUser(): Promise<Organisation> {
	return await apiGet<Organisation>('/organisations/me');
}
