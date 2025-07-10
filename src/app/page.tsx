'use client'; // Necessário para usar hooks e interatividade do lado do cliente

import { useState } from "react";
import { createBackendActor } from "../lib/agent";

export default function Home() {
  // Estado para armazenar a pergunta do usuário
  const [prompt, setPrompt] = useState<string>("");
  // Estado para armazenar a resposta do canister
  const [response, setResponse] = useState<string>("");
  // Estado para controlar o status de carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Função para lidar com o envio da pergunta
  const handleAskGemini = async () => {
    // Verifica se o campo de texto não está vazio
    if (!prompt.trim()) {
      setResponse("Por favor, digite uma pergunta.");
      return;
    }

    setLoading(true);
    setResponse(""); // Limpa a resposta anterior ao iniciar uma nova chamada

    try {
      // Cria o ator para se comunicar com o backend
      const backend = createBackendActor();
      // Chama a função 'askGemini' no canister com o prompt do usuário
      const result = await backend.askGemini(prompt);
      // Atualiza o estado com a resposta recebida
      setResponse(result);
    } catch (error) {
      console.error("Error calling askGemini function:", error);
      setResponse("Ocorreu um erro ao se comunicar com o canister.");
    } finally {
      // Garante que o estado de carregamento seja desativado ao final
      setLoading(false);
    }
  };

    return (
    <main className="max-w-7xl mx-auto px-8">
      <h1 className="text-2xl font-semibold mb-2">Pergunte ao Gemini via IC</h1>
      <p className="mb-6">
        Digite uma pergunta abaixo para enviá-la a um canister Motoko,
        que por sua vez se comunica com a API do Gemini.
      </p>

      {/* Seção de Input e Botão */}
      <div className="flex mt-6">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="O que é a computação quântica?"
          disabled={loading}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-100"
          onKeyDown={(e) => { if (e.key === 'Enter') handleAskGemini(); }}
        />
        <button
          onClick={handleAskGemini}
          disabled={loading}
          className={`px-4 py-2 border border-blue-600 bg-blue-600 text-white rounded-r-md cursor-pointer transition-colors duration-150 disabled:bg-blue-300 disabled:cursor-not-allowed`}
        >
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </div>

      {/* Seção de Resposta */}
      {loading && (
        <p className="mt-4 text-gray-600">Aguardando a resposta do canister...</p>
      )}

      {response && (
        <div className="mt-6 border border-gray-200 rounded-md p-4 bg-gray-50">
          <p className="font-semibold mb-2">Resposta do Gemini:</p>
          <p className="whitespace-pre-wrap leading-relaxed">{response}</p>
        </div>
      )}
    </main>
  );
}