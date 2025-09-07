'use client';

import { getOrganisationForUser } from '@/api/organisation/organisationApi';
import { fetchAndSetVehicles, fetchRentals } from '@/api/vehicle/vehicleApi';
import { LoadingSpinner } from '@/components/base';
import { saveLastPath } from '@/utils/redirectAuth';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useCallback, useEffect } from 'react';
import { useFunkStore } from '../store/funkStore';
import { useOrganisationStore } from '../store/organisationStore';
import { useUserStore } from '../store/userStore';
import { useVehicleStore } from '../store/vehicleStore';

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
  const setRentals = useVehicleStore((state) => state.setRentals);
  const fetchFunk = useFunkStore((state) => state.fetch);

  const fetchState = useCallback(async () => {
    if (!isAuthenticated || !kindeUser || isLoading) {
      throw new Error('Not authenticated or no kinde user');
    }

    const accessToken = await getAccessToken();
    const idToken = await getIdToken();

    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    await Promise.all([
      getOrganisationForUser({
        idToken,
        token: accessToken,
      }).then((organisation) => {
        const user =
          organisation.members.find((m) => m.user.kindeId === kindeUser.id)?.user ?? null;
        setUser(user);
        setOrganisation(organisation);
      }),
      fetchAndSetVehicles({
        idToken,
        token: accessToken,
      }),
      fetchRentals({
        idToken,
        token: accessToken,
      }).then(setRentals),
      fetchFunk({
        idToken,
        token: accessToken,
      }),
    ]);
  }, [
    isAuthenticated,
    kindeUser,
    isLoading,
    getAccessToken,
    getIdToken,
    setUser,
    setOrganisation,
    setRentals,
    fetchFunk,
  ]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    saveLastPath(new URL(window.location.href));
    login();
    return <div>Not authenticated. Redirecting to login...</div>;
  }

  return <div>{children}</div>;
};
