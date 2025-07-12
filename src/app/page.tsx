'use client';

import { useState } from "react";
import { useAuthenticatedActor, kaiActor } from "../lib/agent";
import { useAuth } from "@nfid/identitykit/react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const kaiAuthenticatedActor = useAuthenticatedActor("kai_backend");
  const { connect, user, isConnecting } = useAuth();

  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAskKai = async () => {
    if (!kaiActor) {
      return;
    }

    if (!prompt.trim()) {
      setResponse("Por favor, digite uma pergunta.");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const response = await kaiActor.generateTrack(prompt);

      const result = JSON.parse(response);

      setResponse(result.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("Error calling askKai function:", error);
      setResponse("Ocorreu um erro ao se comunicar com o canister.");
    } finally {
      setLoading(false);
    }
  };

  async function handleLogin() {
    await connect();
  }

  if (!user || user.principal.isAnonymous() || !kaiActor) {
    return (
      <main className="max-w-7xl mx-auto px-8">
        <Button onClick={handleLogin} disabled={isConnecting}>Faça login para falar com o Kai</Button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-8">
      <h1 className="text-2xl font-semibold mb-2">Pergunte ao Gemini via IC</h1>
      <p className="mb-6">
        Digite uma pergunta abaixo para enviá-la a um canister Motoko,
        que por sua vez se comunica com a API do Gemini.
      </p>

      <div className="flex mt-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="O que é a computação quântica?"
          disabled={loading}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          onKeyDown={(e) => { if (e.key === 'Enter') handleAskKai(); }}
        />
        <button
          onClick={handleAskKai}
          disabled={loading}
          className={`px-4 py-2 border border-blue-600 bg-blue-600 text-white rounded-r-md cursor-pointer transition-colors duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed`}
        >
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </div>

      {loading && (
        <p className="mt-4 text-gray-600">Aguardando a resposta do canister...</p>
      )}

      {response && (
        <div className="mt-6 border border-gray-200/50 rounded-md p-4 bg-gray-50/10">
          <p className="font-semibold mb-2">Resposta do Gemini:</p>
          <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
        </div>
      )}
    </main>
  );
}