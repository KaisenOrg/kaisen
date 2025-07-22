'use client';

import { useEffect, useState } from 'react';
import { Actor, ActorSubclass, Agent, HttpAgent } from '@dfinity/agent';
import { useAgent } from '@nfid/identitykit/react';
import { useDevAuth } from '@/providers/dev-auth';

import { idlFactory as kaiIdlFactory } from '@/declarations/kai_backend';
import type { _SERVICE as KaiService } from '@/declarations/kai_backend/kai_backend.did';
import { idlFactory as tracksIdlFactory } from '@/declarations/tracks_backend';
import type { _SERVICE as TracksService } from '@/declarations/tracks_backend/tracks_backend.did';
import { idlFactory as chatIdlFactory } from '@/declarations/chats_backend';
import type { _SERVICE as ChatService } from '@/declarations/chats_backend/chats_backend.did';
import { idlFactory as icrc1IdlFactory } from '@/declarations/icrc1_ledger';
import type { _SERVICE as Icrc1LedgerService } from '@/declarations/icrc1_ledger/icrc1_ledger.did';

const canisterMap = {
  kai_backend: { idl: kaiIdlFactory, service: {} as KaiService },
  tracks_backend: { idl: tracksIdlFactory, service: {} as TracksService },
  chats_backend: { idl: chatIdlFactory, service: {} as ChatService },
  icrc1_ledger: { idl: icrc1IdlFactory, service: {} as Icrc1LedgerService },
};

const canisterIds = {
  kai_backend: process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND,
  tracks_backend: process.env.NEXT_PUBLIC_CANISTER_ID_TRACKS_BACKEND,
  chats_backend: process.env.NEXT_PUBLIC_CANISTER_ID_CHATS_BACKEND,
  icrc1_ledger: process.env.NEXT_PUBLIC_CANISTER_ID_ICRC1_LEDGER,
};

type CanisterName = keyof typeof canisterMap;

export const useActor = <T extends CanisterName>(canisterName: T) => {
  const { identity: devIdentity } = useDevAuth();
  const authAgent = useAgent();
  const [actor, setActor] = useState<ActorSubclass<typeof canisterMap[T]['service']> | null>(null);

  useEffect(() => {
    const createActor = async () => {
      const canisterId = canisterIds[canisterName];
      if (!canisterId) {
        console.error(`Canister ID for ${canisterName} not found.`);
        setActor(null);
        return;
      }

      let agent: HttpAgent | Agent;

      const isMainnet = process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic';

      if (isMainnet) {
        // Mainnet: usa agent do NFID (já autenticado)
        if (!authAgent) {
          setActor(null);
          return;
        }
        agent = authAgent;
      } else {
        // Dev: cria um agent com devIdentity
        if (!devIdentity) {
          setActor(null);
          return;
        }

        agent = await HttpAgent.create({
          identity: devIdentity,
          host: 'http://127.0.0.1:4943',
        });

        await agent.fetchRootKey(); // necessário no local
      }

      const newActor = Actor.createActor<typeof canisterMap[T]['service']>(
        canisterMap[canisterName].idl,
        {
          agent,
          canisterId,
        }
      );

      setActor(newActor);
    };

    createActor().catch(console.error);

  }, [canisterName, devIdentity, authAgent]);

  return actor;
};
