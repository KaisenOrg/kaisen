import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { DevAuthProvider } from './dev-auth';
import { GlobalPopover } from '@/components/ui/global-popover';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { useThemeStore } from '@/stores/useThemeStore';

function ThemeEffect() {
  const applyTheme = useThemeStore((s) => s.applyTheme);
  useEffect(() => {
    applyTheme();
  }, [applyTheme]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IdentityKitProvider
      authType={IdentityKitAuthType.DELEGATION}
    >
      <DevAuthProvider>
        <ThemeEffect />
        {children}
        <GlobalPopover />
        <Toaster position='top-right' />
      </DevAuthProvider>
    </IdentityKitProvider>
  );
}