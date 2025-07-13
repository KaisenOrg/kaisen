'use client';
import { useMemo } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { useAgent } from '@nfid/identitykit/react';

import { idlFactory as kaiIdlFactory } from '../declarations/kai_backend';
import type { _SERVICE as KaiService } from '../declarations/kai_backend/kai_backend.did';

import { idlFactory as tracksIdlFactory } from '../declarations/tracks_backend';
import type { _SERVICE as TracksService } from '../declarations/tracks_backend/tracks_backend.did';

const canisterMap = {
  kai_backend: { idl: kaiIdlFactory, service: {} as KaiService },
  tracks_backend: { idl: tracksIdlFactory, service: {} as TracksService },
};
const canisterIds = {
  kai_backend: process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND,
  tracks_backend: process.env.NEXT_PUBLIC_CANISTER_ID_TRACKS_BACKEND,
};
type CanisterName = keyof typeof canisterMap;

const unauthenticatedAgent = HttpAgent.createSync({
  host: process.env.NEXT_PUBLIC_DFX_NETWORK === 'ic'
    ? 'https://icp-api.io'
    : 'http://127.0.0.1:4943',
});

if (process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
  unauthenticatedAgent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key for anonymous agent.", err);
  });
}

export const anonymousKaiActor = Actor.createActor<KaiService>(kaiIdlFactory, {
  agent: unauthenticatedAgent,
  canisterId: canisterIds.kai_backend!,
});

export const anonymousTracksActor = Actor.createActor<TracksService>(tracksIdlFactory, {
  agent: unauthenticatedAgent,
  canisterId: canisterIds.tracks_backend!,
});

export const useAuthenticatedActor = <T extends CanisterName>(canisterName: T) => {
  const agent = useAgent();

  return useMemo(() => {
    if (!agent || !canisterIds[canisterName]) {
      return null;
    }

    if(process.env.NEXT_PUBLIC_DFX_NETWORK !== 'ic') {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key for authenticated agent.", err);
      });
    }

    return Actor.createActor<typeof canisterMap[T]['service']>(canisterMap[canisterName].idl, {
      agent,
      canisterId: canisterIds[canisterName]!,
    });

  }, [agent, canisterName]);
};