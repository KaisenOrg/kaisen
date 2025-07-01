'use client'; // Necessário para usar hooks e interatividade do lado do cliente

import { useState } from "react";
import { createBackendActor } from "../lib/agent";
import { ConnectWallet } from "@nfid/identitykit/react";

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
    <main style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "768px", margin: "auto" }}>
      <h1>Pergunte ao Gemini via IC</h1>
      <p>
        Digite uma pergunta abaixo para enviá-la a um canister Motoko,
        que por sua vez se comunica com a API do Gemini.
      </p>

      {/* Seção de Input e Botão */}
      <div style={{ display: "flex", marginTop: "1.5rem" }}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="O que é a computação quântica?"
          disabled={loading}
          style={{ flexGrow: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px 0 0 4px" }}
          // Permite enviar com a tecla Enter
          onKeyDown={(e) => { if (e.key === 'Enter') handleAskGemini(); }}
        />
        <button onClick={handleAskGemini} disabled={loading} style={{ padding: "10px 15px", border: "1px solid #007bff", background: "#007bff", color: "white", borderRadius: "0 4px 4px 0", cursor: "pointer" }}>
          {loading ? "Pensando..." : "Enviar"}
        </button>
      </div>

      <ConnectWallet />

      {/* Seção de Resposta */}
      {/* Mostra um indicador de carregamento enquanto espera */}
      {loading && <p style={{ marginTop: "1rem" }}>Aguardando a resposta do canister...</p>}

      {/* Mostra a resposta quando ela existir */}
      {response && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #eee", borderRadius: "4px", padding: "15px" }}>
          <p><strong>Resposta do Gemini:</strong></p>
          {/* Usamos whiteSpace: 'pre-wrap' para preservar quebras de linha na resposta */}
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{response}</p>
        </div>
      )}
    </main>
  );
}