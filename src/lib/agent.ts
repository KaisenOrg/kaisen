import { Actor, HttpAgent, type ActorSubclass } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

import { 
  idlFactory as kaiIdlFactory,
  kai_backend as KaiService
} from "../declarations/kai_backend";

import { 
  idlFactory as tracksIdlFactory,
  tracks_backend as TracksService
} from "../declarations/tracks_backend";

let agent: HttpAgent | undefined;

const getAgent = (): HttpAgent => {
  if (!agent) {
    // Para produção, você pode descomentar esta lógica
    // const host = process.env.NODE_ENV === "production"
    //  ? "https://icp-api.io"
    //  : "http://127.0.0.1:4943";
    const host = "http://127.0.0.1:4943";

    agent = new HttpAgent({ host });

    // Apenas em ambiente de desenvolvimento, busca a 'root key'
    // Em produção, isso não é necessário se não estiver usando um custom domain.
    if (process.env.NODE_ENV !== "production") {
      agent.fetchRootKey().catch(err => {
        console.warn("Unable to fetch root key. Check to ensure the local replica is running");
        console.error(err);
      });
    }
  }
  return agent;
};


// --- FUNÇÃO GENÉRICA PARA CRIAR ATORES ---

/**
 * Cria uma instância de ator para um canister específico.
 * @param canisterId O ID do canister.
 * @param idlFactory A factory da interface Candid gerada pelo dfx.
 * @returns Uma instância de ator tipada.
 */
const createActor = <T>(canisterId: string, idlFactory: IDL.InterfaceFactory): ActorSubclass<T> => {
  const agent = getAgent();

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

export const kaiActor = createActor<typeof KaiService>(KAI_CANISTER_ID!, kaiIdlFactory);
export const tracksActor = createActor<typeof TracksService>(TRACKS_CANISTER_ID!, tracksIdlFactory);
