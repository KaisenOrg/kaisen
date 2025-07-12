'use client';

import { ThemeProvider } from 'next-themes';
import { IdentityKitProvider } from '@nfid/identitykit/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <IdentityKitProvider>
        {children}
      </IdentityKitProvider>
    </ThemeProvider>
  );
}