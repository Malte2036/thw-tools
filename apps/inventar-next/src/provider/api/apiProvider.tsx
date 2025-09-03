'use client';

import { getOrganisationForUser } from '@/api/organisation/organisationApi';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useEffect, useCallback } from 'react';
import { useOrganisationStore } from '../store/organisationStore';
import { useUserStore } from '../store/userStore';
import { saveLastPath } from '@/utils/redirectAuth';
import { fetchAndSetVehicles, fetchRentals } from '@/api/vehicle/vehicleApi';
import { useVehicleStore } from '../store/vehicleStore';
import { LoadingSpinner } from '@/components/base';

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
      }).then((rentals) => {
        setRentals(rentals);
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
