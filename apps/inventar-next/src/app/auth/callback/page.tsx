'use client';

import { useKindeAuth } from '@kinde-oss/kinde-auth-react';

export default function AuthCallback() {
  const { isLoading, isAuthenticated } = useKindeAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated. Redirecting to home...</div>;
  }

  return <div>Finished authentication. Redirecting back...</div>;
}
