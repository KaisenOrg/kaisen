import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

import { 
  idlFactory as kaiIdlFactory,
} from "../declarations/kai_backend";
import type { _SERVICE as KaiService } from "@/declarations/kai_backend/kai_backend.did";

import { 
  idlFactory as tracksIdlFactory,
} from "../declarations/tracks_backend";
import type { _SERVICE as TracksService } from "@/declarations/tracks_backend/tracks_backend.did";

let agent: HttpAgent | undefined;

const createAgent = () => {
  if (agent) {
    return agent;
  }

  const host = process.env.DFX_NETWORK === 'ic'
    ? 'https://icp-api.io'
    : 'http://127.0.0.1:4943';

  agent = new HttpAgent({ host });

  // Apenas em ambiente de desenvolvimento, busca a 'root key' para estabelecer confiança.
  // Em produção, a 'root key' da mainnet já é confiável e esta chamada é desnecessária.
  if (process.env.DFX_NETWORK !== 'ic') {
    agent.fetchRootKey().catch(err => {
      console.warn("Unable to fetch root key. Check to ensure the local replica is running.");
      console.error(err);
    });
  }

  return agent;
};

const createActor = <T>(canisterId: string, idlFactory: IDL.InterfaceFactory): ActorSubclass<T> => {
  const agent = createAgent();

  if (!canisterId) {
    // Lança um erro mais genérico, já que a função não sabe qual canister está sendo criado.
    throw new Error("A canister ID must be provided to create an actor.");
  }

  return Actor.createActor<T>(idlFactory, {
    agent,
    canisterId,
  });
};

const KAI_CANISTER_ID = process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND;
const TRACKS_CANISTER_ID = process.env.NEXT_PUBLIC_CANISTER_ID_TRACKS_BACKEND;

export const kaiActor = createActor<KaiService>(KAI_CANISTER_ID!, kaiIdlFactory);
export const tracksActor = createActor<TracksService>(TRACKS_CANISTER_ID!, tracksIdlFactory);
