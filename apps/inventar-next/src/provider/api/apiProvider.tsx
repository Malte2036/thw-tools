'use client';

import { getOrganisationForUser } from '@/api/organisation/organisationApi';
import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { useEffect, useCallback } from 'react';
import { useOrganisationStore } from '../store/organisationStore';
import { useUserStore } from '../store/userStore';

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: kindeUser, getAccessToken, getIdToken } = useKindeAuth();

  const setUser = useUserStore((state) => state.setUser);
  const setOrganisation = useOrganisationStore((state) => state.setOrganisation);

  const fetchState = useCallback(async () => {
    if (!kindeUser) {
      throw new Error('No kinde user');
    }

    const accessToken = await getAccessToken();
    const idToken = await getIdToken();

    if (!accessToken || !idToken) {
      throw new Error('No access token or id token');
    }

    const organisation = await getOrganisationForUser({
      idToken,
      token: accessToken,
    });

    const user = organisation.members.find((m) => m.user.kindeId === kindeUser.id)?.user ?? null;

    setUser(user);
    setOrganisation(organisation);
  }, [getAccessToken, getIdToken]);

  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return <div>{children}</div>;
};
