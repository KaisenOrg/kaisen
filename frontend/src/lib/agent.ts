import { useEffect, useState } from 'react'
import { Actor, type ActorSubclass, type Agent, HttpAgent } from '@dfinity/agent'
import { useAgent } from '@nfid/identitykit/react'
import { useAuth } from '@/hooks/useAuth'

import { idlFactory as kaiIdlFactory } from '@/declarations/kai_backend'
import type { _SERVICE as KaiService } from '@/declarations/kai_backend/kai_backend.did'
import { idlFactory as tracksIdlFactory } from '@/declarations/tracks_backend'
import type { _SERVICE as TracksService } from '@/declarations/tracks_backend/tracks_backend.did'
import { idlFactory as chatIdlFactory } from '@/declarations/chats_backend'
import type { _SERVICE as ChatService } from '@/declarations/chats_backend/chats_backend.did'
import { idlFactory as icrc1IdlFactory } from '@/declarations/icrc1_ledger'
import type { _SERVICE as Icrc1LedgerService } from '@/declarations/icrc1_ledger/icrc1_ledger.did'
import { idlFactory as usersIdlFactory } from '@/declarations/users_backend'
import type { _SERVICE as UsersService } from '@/declarations/users_backend/users_backend.did'

import { idlFactory as nftIdlFactory } from '@/declarations/nft_certificates'
import type { _SERVICE as NftCertificatesService } from '@/declarations/nft_certificates/nft_certificates.did'

const canisterMap = {
  kai_backend: { idl: kaiIdlFactory, service: {} as KaiService },
  tracks_backend: { idl: tracksIdlFactory, service: {} as TracksService },
  chats_backend: { idl: chatIdlFactory, service: {} as ChatService },
  users_backend: { idl: usersIdlFactory, service: {} as UsersService },
  icrc1_ledger: { idl: icrc1IdlFactory, service: {} as Icrc1LedgerService },
  nft_certificates: { idl: nftIdlFactory, service: {} as NftCertificatesService }
}

const canisterIds = {
  kai_backend: process.env.CANISTER_ID_KAI_BACKEND,
  tracks_backend: process.env.CANISTER_ID_TRACKS_BACKEND,
  chats_backend: process.env.CANISTER_ID_CHATS_BACKEND,
  users_backend: process.env.CANISTER_ID_USERS_BACKEND,
  icrc1_ledger: process.env.CANISTER_ID_ICRC1_LEDGER,
  nft_certificates: process.env.CANISTER_ID_NFT_CERTIFICATES,
}

type CanisterName = keyof typeof canisterMap

export const useActor = <T extends CanisterName>(canisterName: T) => {
  const { identity: devIdentity } = useAuth()
  const authAgent = useAgent()
  const [actor, setActor] = useState<ActorSubclass<typeof canisterMap[T]['service']> | null>(null)

  useEffect(() => {
    const createActor = async () => {
      const canisterId = canisterIds[canisterName]
      if (!canisterId) {
        console.error(`Canister ID for ${canisterName} not found.`)
        setActor(null)
        return
      }

      let agent: HttpAgent | Agent

      const isMainnet = process.env.DFX_NETWORK === 'ic'

      if (isMainnet) {
        if (!authAgent) {
          setActor(null)
          return
        }
        agent = authAgent
      } else {
        if (!devIdentity) {
          setActor(null)
          return
        }

        agent = await HttpAgent.create({
          identity: devIdentity,
          host: 'http://127.0.0.1:4943'
        })

        await agent.fetchRootKey()
      }

      const newActor = Actor.createActor<typeof canisterMap[T]['service']>(
        canisterMap[canisterName].idl,
        {
          agent,
          canisterId,
        }
      )

      setActor(newActor)
    }

    createActor().catch(console.error)

  }, [canisterName, devIdentity, authAgent])

  return actor
}
