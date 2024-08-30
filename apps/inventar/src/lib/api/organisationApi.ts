import { apiGet } from './apiGeneric';
import type { User } from './inventarItem';
import type { Organisation } from './organisation';

export async function getOrganisations(): Promise<Organisation[]> {
	return await apiGet<Organisation[]>('/organisations');
}

export async function getOrganisationForUser(): Promise<Organisation> {
	return await apiGet<Organisation>('/organisations/me');
}
