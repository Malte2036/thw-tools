import { apiGet, apiPost, ApiRequestOptions } from '../apiGeneric';
import { Organisation, OrganisationSchema } from './organisationModels';

export async function getOrganisationForUser(
  requestOptions: ApiRequestOptions
): Promise<Organisation> {
  const response = await apiGet<Organisation>('/organisations/me', requestOptions, (data) => {
    const result = OrganisationSchema.safeParse(data);
    if (!result.success) {
      console.error('Error parsing Organisation:', result.error);
    }
    return result.success;
  });

  return OrganisationSchema.parse(response.data);
}

export async function joinOrganisation(
  inviteCode: string,
  requestOptions: ApiRequestOptions
): Promise<Organisation> {
  const response = await apiPost<Organisation>(`/organisations/join/`, requestOptions, {
    inviteCode,
  });
  return OrganisationSchema.parse(response.data);
}

export async function createOrganisation(
  name: string,
  requestOptions: ApiRequestOptions
): Promise<Organisation> {
  const response = await apiPost<Organisation>('/organisations/', requestOptions, { name });
  return OrganisationSchema.parse(response.data);
}

export async function leaveOrganisation(requestOptions: ApiRequestOptions): Promise<void> {
  await apiPost<void>('/organisations/leave', requestOptions);
}
