'use client';

import { useAuth, useIdentity } from '@nfid/identitykit/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isConnecting } = useAuth();
  const identity = useIdentity();
  const router = useRouter();

  const isAuthenticated = identity ? !identity.getPrincipal().isAnonymous() : false;

  useEffect(() => {
    if (!isConnecting && !isAuthenticated) {
      router.push('/');
    }
  }, [isConnecting, isAuthenticated, router]);

  if (isConnecting) {
    return <div>Carregando sua sessão...</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};