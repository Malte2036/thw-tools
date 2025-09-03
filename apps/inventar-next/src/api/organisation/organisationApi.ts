import { apiGet, apiPost } from '../apiGeneric';
import { Organisation, OrganisationSchema } from './organisationModels';

export async function getOrganisationForUser({
  idToken,
  token,
}: {
  idToken: string;
  token: string;
}): Promise<Organisation> {
  const response = await apiGet<Organisation>('/organisations/me', { idToken, token }, (data) => {
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
  { idToken, token }: { idToken: string; token: string }
): Promise<Organisation> {
  const response = await apiPost<Organisation>(
    `/organisations/join/`,
    { idToken, token },
    { inviteCode }
  );
  return OrganisationSchema.parse(response.data);
}

export async function createOrganisation(
  name: string,
  { idToken, token }: { idToken: string; token: string }
): Promise<Organisation> {
  const response = await apiPost<Organisation>('/organisations/', { idToken, token }, { name });
  return OrganisationSchema.parse(response.data);
}

export async function leaveOrganisation({
  idToken,
  token,
}: {
  idToken: string;
  token: string;
}): Promise<void> {
  await apiPost<void>('/organisations/leave', { idToken, token });
}
