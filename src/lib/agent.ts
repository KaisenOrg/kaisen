'use client';
import { useMemo } from 'react';
import { Actor, HttpAgent, type ActorSubclass } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';
import { useIdentity } from '@nfid/identitykit/react';

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

// --- LÓGICA PARA ATORES ANÔNIMOS (PÚBLICOS) ---
const anonymousAgent = (() => {
  let agent: HttpAgent | undefined;
  return () => {
    if (agent) {
      return agent;
    }
    const host = process.env.DFX_NETWORK === 'ic' ? 'https://icp-api.io' : 'http://127.0.0.1:4943';
    agent = HttpAgent.createSync({ host });

    if (process.env.DFX_NETWORK !== 'ic') {
      agent.fetchRootKey().catch(console.error);
    }
    return agent;
  };
})();

const createAnonymousActor = <T>(canisterId: string, idlFactory: IDL.InterfaceFactory): ActorSubclass<T> => {
  const agent = anonymousAgent();
  if (!canisterId) {
    throw new Error("Canister ID não fornecido para o ator anônimo.");
  }
  return Actor.createActor<T>(idlFactory, { agent, canisterId });
};

export const kaiActor = createAnonymousActor<KaiService>(canisterIds.kai_backend!, kaiIdlFactory);
export const tracksActor = createAnonymousActor<TracksService>(canisterIds.tracks_backend!, tracksIdlFactory);


// --- HOOK PARA ATORES AUTENTICADOS (PRIVADOS) ---
export const useAuthenticatedActor = <T extends CanisterName>(canisterName: T) => {
  const identity = useIdentity();

  const actor = useMemo(() => {
    if (!identity || !canisterIds[canisterName]) {
      return null;
    }

    const host = process.env.DFX_NETWORK === 'ic' ? 'https://icp-api.io' : 'http://127.0.0.1:4943';

    const agent = HttpAgent.createSync({ identity, host });

    if (process.env.DFX_NETWORK !== 'ic') {
      agent.fetchRootKey().catch(console.error);
    }

    return Actor.createActor<typeof canisterMap[T]['service']>(canisterMap[canisterName].idl, {
      agent,
      canisterId: canisterIds[canisterName]!,
    });

  }, [identity, canisterName]);

  return actor;
};