import { useEffect } from 'react'
import { IdentityKitAuthType } from '@nfid/identitykit'
import { IdentityKitProvider } from '@nfid/identitykit/react'

import { GlobalModal } from '@/components/ui/global-modal'
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
          <GlobalModal />
        </UserProvider>
      </DevAuthProvider>
    </IdentityKitProvider>
  )
}