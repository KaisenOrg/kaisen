import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as backendIdlFactory } from "../declarations/kai_backend";
import type { _SERVICE as BackendService } from "../declarations/kai_backend/kai_backend.did";

const getAgent = () => {
  // Para o desenvolvimento local, o host é a porta da sua réplica local
  // Para produção, você pode remover o host para usar o gateway padrão da IC
  // const host = process.env.NODE_ENV === "production"
  //   ? "https://icp-api.io"
  //   : "http://127.0.0.1:4943"; // Porta padrão do dfx

  const host = "http://127.0.0.1:4943";

  const agent = new HttpAgent({ host });

  // Em produção, isso não é necessário
  // if (process.env.NODE_ENV !== "production") {
  //   agent.fetchRootKey().catch(err => {
  //     console.warn("Unable to fetch root key. Check to ensure the local replica is running");
  //     console.error(err);
  //   });
  // }

  // No ambiente local, o agent precisa buscar as 'root keys' da rede
  agent.fetchRootKey().catch(err => {
    console.warn("Unable to fetch root key. Check to ensure the local replica is running");
    console.error(err);
  });
  return agent;
};

export const createBackendActor = () => {
  const agent = getAgent();

  // O ID do canister é injetado como uma variável de ambiente pelo dfx
  const canisterId = process.env.NEXT_PUBLIC_CANISTER_ID_KAI_BACKEND;

  if (!canisterId) {
    throw new Error("CANISTER_ID_KAI_BACKEND environment variable not set");
  }

  // Cria o ator, que permite chamar os métodos do canister
  const backendActor = Actor.createActor<BackendService>(backendIdlFactory, {
    agent,
    canisterId,
  });

  return backendActor;
};