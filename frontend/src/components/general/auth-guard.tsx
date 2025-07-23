import { useAuth, useIdentity } from '@nfid/identitykit/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isConnecting } = useAuth();
  const identity = useIdentity();
  const navigate = useNavigate();

  const isAuthenticated = identity ? !identity.getPrincipal().isAnonymous() : false;

  useEffect(() => {
    if (!isConnecting && !isAuthenticated) {
      navigate('/');
    }
  }, [isConnecting, isAuthenticated, navigate]);

  if (isConnecting) {
    return <div>Carregando sua sessão...</div>;
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return null;
};