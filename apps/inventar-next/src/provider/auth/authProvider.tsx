'use client';

import { redirectToLastPathBeforeAuth } from '@/utils/redirectAuth';
import { KindeProvider } from '@kinde-oss/kinde-auth-react';
import { useRouter } from 'next/navigation';

const getKindeSettings = () => {
  const KINDE_DOMAIN = process.env.NEXT_PUBLIC_KINDE_DOMAIN;
  const KINDE_CLIENT_ID = process.env.NEXT_PUBLIC_KINDE_API_CLIENT;

  if (!KINDE_DOMAIN || !KINDE_CLIENT_ID) {
    throw new Error(`NEXT_PUBLIC_KINDE_DOMAIN or NEXT_PUBLIC_KINDE_CLIENT_ID is not set`);
  }

  return {
    domain: KINDE_DOMAIN,
    clientId: KINDE_CLIENT_ID,
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const kindeSettings = getKindeSettings();
  const router = useRouter();

  const origin = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <KindeProvider
      clientId={kindeSettings.clientId}
      domain={kindeSettings.domain}
      logoutUri={origin}
      redirectUri={origin + '/auth/callback'}
      callbacks={{
        onSuccess: async (user) => {
          console.log(`Successfully authenticated user: ${user.email}`, user);
        },
        onError: (error) => {
          console.log('onError', error);
        },
        onEvent: (event) => {
          console.log('onEvent', event);

          if (event === 'login') {
            redirectToLastPathBeforeAuth(router.push);
          }
        },
      }}
    >
      {children}
    </KindeProvider>
  );
};
