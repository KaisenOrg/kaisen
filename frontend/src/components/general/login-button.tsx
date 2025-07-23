import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const LoginButton = () => {
  const { login, logout, isAuthenticated, principal } = useAuth();

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

  return <Button onClick={() => login()}>Login (Modo Dev)</Button>;
};