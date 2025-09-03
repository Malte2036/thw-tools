'use client';

import { getOrganisationForUser } from '@/api/organisation/organisationApi';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useEffect, useCallback } from 'react';
import { useOrganisationStore } from '../store/organisationStore';
import { useUserStore } from '../store/userStore';
import { saveLastPath } from '@/utils/redirectAuth';
import { fetchAndSetVehicles } from '@/api/vehicle/vehicleApi';

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    isAuthenticated,
    login,
    isLoading,
    user: kindeUser,
    getAccessToken,
    getIdToken,
  } = useKindeAuth();

  const setUser = useUserStore((state) => state.setUser);
  const setOrganisation = useOrganisationStore((state) => state.setOrganisation);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    saveLastPath(new URL(window.location.href));
    login();
    return <div>Not authenticated. Redirecting to login...</div>;
  }

  const fetchState = useCallback(async () => {
    if (!isAuthenticated || !kindeUser) {
      throw new Error('Not authenticated or no kinde user');
    }

    const accessToken = await getAccessToken();
    const idToken = await getIdToken();

    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    const [organisation, vehicles] = await Promise.all([
      getOrganisationForUser({
        idToken,
        token: accessToken,
      }),
      fetchAndSetVehicles({
        idToken,
        token: accessToken,
      }),
    ]);

    const user = organisation.members.find((m) => m.user.kindeId === kindeUser.id)?.user ?? null;

    setUser(user);
    setOrganisation(organisation);
  }, [getAccessToken, getIdToken, isAuthenticated, kindeUser]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return <div>{children}</div>;
};
