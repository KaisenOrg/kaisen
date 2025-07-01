'use client';

import { ThemeProvider } from 'next-themes';
import { IdentityKitProvider } from '@nfid/identitykit/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    // Exemplo com um provider de tema e um provider de autenticação
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <IdentityKitProvider>
        {children}
      </IdentityKitProvider>
    </ThemeProvider>
  );
}