import { useMemo } from 'react'
import { createBackendActors } from '@/lib/backend-client'

const canisterNames = [
  'kai_backend',
  'tracks_backend',
  'chats_backend',
  'users_backend',
  'icrc1_ledger',
  'nft_certificates',
] as const

type CanisterName = (typeof canisterNames)[number]

export const useActor = <T extends CanisterName>(canisterName: T) => {
  return useMemo(() => {
    const actors = createBackendActors()
    return actors[canisterName]
  }, [canisterName]) as any
}
