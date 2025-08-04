import { useIdentity, useAuth as useNfidAuth } from '@nfid/identitykit/react'
import { useDevAuth } from '@/providers/dev-auth'

export function useAuth() {
  const isProd = import.meta.env.DFX_NETWORK === 'ic'

  if (isProd) {
    const { user, connect: login, disconnect: logout } = useNfidAuth()
    const isAuthenticated = !!user && !user.principal.isAnonymous()
    const principal = user?.principal
    const identity = useIdentity()

    return { isAuthenticated, identity, principal, login, logout }
  }

  return useDevAuth()
}
