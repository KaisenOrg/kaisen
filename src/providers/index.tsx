'use client';

import { ThemeProvider } from 'next-themes';
import { IdentityKitAuthType } from '@nfid/identitykit';
import { IdentityKitProvider } from '@nfid/identitykit/react';
import { DevAuthProvider } from './dev-auth';
import { GlobalPopover } from '@/components/ui/global-popover';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic' ? (
        <IdentityKitProvider
          authType={IdentityKitAuthType.DELEGATION}
          signerClientOptions={{
            targets: [
              process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND!,
              process.env.NEXT_PUBLIC_CANISTER_ID_TRACKS_BACKEND!,
              process.env.NEXT_PUBLIC_CANISTER_ID_CHATS_BACKEND!,
              process.env.NEXT_PUBLIC_CANISTER_ID_NFT_CERTIFICATES!,
              process.env.NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY!,
            ]
          }}>
          {children}
          <GlobalPopover />
        </IdentityKitProvider>
      ) : (
        <DevAuthProvider>
          {children}
          <GlobalPopover />
        </DevAuthProvider>
      )}
    </ThemeProvider>
  );
}