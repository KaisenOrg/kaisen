import { Button } from '@/components/ui/button';
import { useUser } from '@/providers/user-provider';

export const LoginButton = () => {
  const { login, logout, isAuthenticated, principal } = useUser();

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

  return (
    <div className="flex gap-2">
      <Button variant="ghost" onClick={() => login()}>Login {process.env.DFX_NETWORK !== 'ic'}</Button>
      <Button variant="outline" onClick={() => alert('Account creation coming soon!')}>Create account</Button>
    </div>
  );
};