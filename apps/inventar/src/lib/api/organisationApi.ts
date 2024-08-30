import { apiGet } from './apiGeneric';
import type { User } from './inventarItem';

export type Organisation = {
	_id: string;
	name: string;
	members: User[];
};

export async function getOrganisations(): Promise<Organisation[]> {
	return await apiGet<Organisation[]>('/organisations');
}

export async function getOrganisationForUser(): Promise<Organisation> {
	return await apiGet<Organisation>('/organisations/me');
}
