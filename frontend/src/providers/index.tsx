import { useEffect } from 'react'
import { IdentityKitAuthType } from '@nfid/identitykit'
import { IdentityKitProvider } from '@nfid/identitykit/react'

import { GlobalPopover } from '@/components/ui/global-popover'
import { Toaster } from '@/components/ui/sonner'

import { useThemeStore } from '@/stores/useThemeStore'
import { UserProvider } from './user-provider'
import { DevAuthProvider } from './dev-auth'

function ThemeEffect() {
  const applyTheme = useThemeStore((s) => s.applyTheme)
  useEffect(() => {
    applyTheme()
  }, [applyTheme])
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <IdentityKitProvider authType={IdentityKitAuthType.DELEGATION}>
      <DevAuthProvider>
        <UserProvider>
          <ThemeEffect />
          {children}
          <GlobalPopover />
          <Toaster position="top-right" />
        </UserProvider>
      </DevAuthProvider>
    </IdentityKitProvider>
  )
}