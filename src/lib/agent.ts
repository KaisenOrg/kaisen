'use client';

import { useMemo, useEffect, useState } from 'react';
import { Actor, ActorSubclass, HttpAgent } from '@dfinity/agent';
import { useAgent, useIdentity } from '@nfid/identitykit/react';

import { idlFactory as kaiIdlFactory } from '../declarations/kai_backend';
import type { _SERVICE as KaiService } from '../declarations/kai_backend/kai_backend.did';
import { idlFactory as tracksIdlFactory } from '../declarations/tracks_backend';
import type { _SERVICE as TracksService } from '../declarations/tracks_backend/tracks_backend.did';
import { idlFactory as chatIdlFactory } from '../declarations/chats_backend';
import type { _SERVICE as ChatService } from '../declarations/chats_backend/chats_backend.did';
import { useDevAuth } from '@/providers/dev-auth';

const canisterMap = {
  kai_backend: { idl: kaiIdlFactory, service: {} as KaiService },
  tracks_backend: { idl: tracksIdlFactory, service: {} as TracksService },
  chats_backend: { idl: chatIdlFactory, service: {} as ChatService },
};

const canisterIds = {
  kai_backend: process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND,
  tracks_backend: process.env.NEXT_PUBLIC_CANISTER_ID_TRACKS_BACKEND,
  chats_backend: process.env.NEXT_PUBLIC_CANISTER_ID_CHATS_BACKEND,
};

type CanisterName = keyof typeof canisterMap;

export const useActor = <T extends CanisterName>(canisterName: T) => {
  const { identity } = useDevAuth();
  const [actor, setActor] = useState<ActorSubclass<typeof canisterMap[T]['service']> | null>(null);

  useEffect(() => {
    const create = async () => {
      const canisterId = canisterIds[canisterName];

      if (!identity || !canisterId) {
        setActor(null);
        return;
      }

      const agent = await HttpAgent.create({
        identity,
        host: process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
          ? 'https://icp-api.io'
          : 'http://127.0.0.1:4943',
      });

      if (process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
        await agent.fetchRootKey();
      }

      const newActor = Actor.createActor<typeof canisterMap[T]['service']>(canisterMap[canisterName].idl, {
        agent,
        canisterId,
      });

      setActor(newActor);
    };

    create().catch(console.error);

  }, [identity, canisterName]);

  return actor;
};