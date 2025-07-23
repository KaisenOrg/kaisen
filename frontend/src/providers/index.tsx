import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { DevAuthProvider } from './dev-auth';
import { GlobalPopover } from '@/components/ui/global-popover';
import { Toaster } from '@/components/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IdentityKitProvider
      authType={IdentityKitAuthType.DELEGATION}
    >
      <DevAuthProvider>
        {children}
        <GlobalPopover />
        <Toaster position='top-right' />
      </DevAuthProvider>
    </IdentityKitProvider>
  );
}