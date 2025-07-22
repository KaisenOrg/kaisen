'use client';

import { useDevAuth } from '@/providers/dev-auth';
import { Button } from '@/components/ui/button';

export const LoginButton = () => {
  const { login, logout, isAuthenticated, principal } = useDevAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono" title={principal?.toText()}>
          Dev User: {principal?.toText()}
        </span>
        <Button onClick={logout} variant="outline">Logout</Button>
      </div>
    );
  }

  return <Button onClick={login}>Login (Modo Dev)</Button>;
};