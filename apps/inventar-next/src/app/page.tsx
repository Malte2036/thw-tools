'use client';

import { useKindeAuth } from '@kinde-oss/kinde-auth-react';
import { LoginLink, LogoutLink } from '@kinde-oss/kinde-auth-react/components';
import { useOrganisationStore } from '@/provider/store/organisationStore';

export default function Home() {
  const { isAuthenticated, user } = useKindeAuth();

  const { organisation } = useOrganisationStore();
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      {isAuthenticated ? (
        <div className="flex flex-col gap-2">
          <div>Logged in as {user?.email}</div>
          <div />
          <div>User: {user?.email}</div>
          <div>Organisation: {organisation?.name}</div>
          <LogoutLink>Logout</LogoutLink>
        </div>
      ) : (
        <LoginLink>Login</LoginLink>
      )}
    </div>
  );
}
