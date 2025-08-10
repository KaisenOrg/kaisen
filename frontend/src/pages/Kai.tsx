import { useState } from 'react';
import { useActor } from '@/lib/agent';
import { useUser } from '@/providers/user-provider';
import { LoginButton } from '@/components/general/login-button';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Interface para mensagens do chat
interface Message {
  sender: 'User' | 'Model';
  text: string;
}

export default function KaiTestPage() {
  const { isAuthenticated } = useUser();
  const [status, setStatus] = useState<string>('Pronto.');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Atores do backend
  const kaiActor = useActor('kai_backend');
  const chatActor = useActor('chats_backend');

  // Estado para o Chat
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  // Estado para Geração de Conteúdo (Trilhas, Seções)
  const [trackTopic, setTrackTopic] = useState<string>('');
  const [generatedJson, setGeneratedJson] = useState<string | null>(null);

  // Estado para Geração de Imagem
  const [imagePrompt, setImagePrompt] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // --- HANDLERS DA API ---

  const handleSendMessage = async () => {
    if (!kaiActor || !chatActor || !chatPrompt.trim()) return;

    setIsLoading(true);
    setStatus('Iniciando conversa...');
    const currentPrompt = chatPrompt;
    setMessages(prev => [...prev, { sender: 'User', text: currentPrompt }]);
    setChatPrompt('');

    try {
      let currentChatId = chatId;
      if (!currentChatId) {
        setStatus('Criando nova sessão de chat...');
        const newChatResult = await chatActor.createChatSession(currentPrompt);
        if ('err' in newChatResult) throw new Error(JSON.stringify(newChatResult.err));
        currentChatId = newChatResult.ok;
        setChatId(currentChatId);
      }

      const historyForAI = messages.map(m => `{"role": "${m.sender.toLowerCase()}", "parts": [{"text": "${m.text.replace(/"/g, '\\"')}"}]}`).join(', ');

      setStatus('Kai está pensando...');
      const result = await kaiActor.generateChatResponse(currentPrompt, historyForAI ? [historyForAI] : []);

      if ('err' in result) throw new Error(JSON.stringify(result.err));

      const aiResponseText = result.ok;
      const aiResponseJSON = JSON.parse(aiResponseText);
      const modelText = aiResponseJSON.candidates[0].content.parts[0].text;

      setStatus('Kai respondeu. Salvando...');
      await chatActor.addInteraction(currentChatId!, currentPrompt, modelText);

      setMessages(prev => [...prev, { sender: 'Model', text: modelText }]);
      setStatus('Pronto.');
    } catch (e: any) {
      console.error("Erro no chat:", e);
      setStatus(`Erro no chat: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!kaiActor || !imagePrompt.trim()) return;
    setIsLoading(true);
    setStatus('Enviando requisição para o Kai...');
    setImageUrl(null);

    try {
      // --- CHAMADA 1: Requisitar a geração ---
      const requestResult = await kaiActor.requestImageGeneration(imagePrompt, []);
      if ('err' in requestResult) {
        throw new Error(requestResult.err);
      }

      // Requisição foi bem-sucedida, agora vamos processar
      setStatus('Kai está processando a imagem...');

      // --- CHAMADA 2: Obter e analisar o resultado ---
      const processResult = await kaiActor.processImageResponse();
      if ('err' in processResult) {
        throw new Error(processResult.err);
      }

      // O resultado.ok já é o Data URL completo!
      setImageUrl(processResult.ok);
      setStatus('Imagem gerada com sucesso!');

    } catch (e: any) {
      console.error("Erro ao gerar imagem:", e);
      setStatus(`Erro ao gerar imagem: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenericJsonGeneration = async (
    apiCall: (topic: string, context: []) => Promise<any>,
    topic: string,
    statusMsg: string
  ) => {
    if (!kaiActor || !topic.trim()) return;
    setIsLoading(true);
    setStatus(statusMsg);
    setGeneratedJson(null);

    try {
      const result = await apiCall(topic, []);
      if ('err' in result) throw new Error(JSON.stringify(result.err));

      // A resposta já vem como texto JSON, pronta para ser exibida
      setGeneratedJson(result.ok);
      setStatus('Conteúdo JSON gerado com sucesso!');
    } catch (e: any) {
      console.error("Erro ao gerar conteúdo:", e);
      setStatus(`Erro ao gerar conteúdo: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (kaiActor === null) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <h1 className="text-3xl font-bold mb-2">Painel de Teste do Backend Kaisen</h1>
      <div className="p-4 bg-gray-100/50 rounded-md mb-6">
        <strong>Status:</strong> <span className="italic">{status}</span>
      </div>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">1. Autenticação</h2>
        <LoginButton />
      </div>

      {isAuthenticated && (
        <>
          {/* SEÇÃO DE CHAT */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">2. Teste do Fluxo de Chat</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Digite sua mensagem para o Kai..."
                className="flex-grow p-2 border rounded"
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !chatPrompt}>
                {chatId ? 'Enviar' : 'Iniciar Chat'}
              </Button>
            </div>
            <div className="mt-4 p-2 h-64 overflow-y-auto border rounded bg-slate-50">
              {messages.map((msg, i) => (
                <div key={i} className={`p-2 my-1 rounded w-fit max-w-[85%] ${msg.sender === 'User' ? 'bg-blue-100 ml-auto' : 'bg-gray-200'}`}>
                  <strong>{msg.sender}:</strong>
                  <div className="prose prose-sm"><ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown></div>
                </div>
              ))}
            </div>
          </div>

          {/* SEÇÃO DE GERAÇÃO DE IMAGEM */}
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">3. Teste de Geração de Imagem</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Descreva a imagem que você quer criar..."
                className="flex-grow p-2 border rounded"
                disabled={isLoading}
              />
              <Button onClick={handleGenerateImage} disabled={isLoading || !imagePrompt}>
                Gerar Imagem
              </Button>
            </div>
            {imageUrl && (
              <div className="mt-4 p-2 border rounded-md bg-gray-50 flex justify-center">
                <img src={imageUrl} alt="Imagem gerada pelo Kai" className="max-w-full h-auto rounded-md shadow-lg" />
              </div>
            )}
          </div>

          {/* SEÇÃO DE GERAÇÃO DE CONTEÚDO */}
          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">4. Teste de Geração de Conteúdo (JSON)</h2>
            <input
              type="text"
              value={trackTopic}
              onChange={(e) => setTrackTopic(e.target.value)}
              placeholder="Digite um tópico para uma trilha, seção, etc."
              className="w-full p-2 border rounded mb-4"
              disabled={isLoading}
            />
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => handleGenericJsonGeneration(kaiActor.generateTrack, trackTopic, "Kai está escrevendo a trilha...")} disabled={isLoading || !trackTopic}>Gerar Trilha Completa</Button>
              <Button onClick={() => handleGenericJsonGeneration(kaiActor.generateSection, trackTopic, "Kai está escrevendo a seção...")} disabled={isLoading || !trackTopic}>Gerar Seção</Button>
              <Button onClick={() => handleGenericJsonGeneration(kaiActor.regenerateTrackDescription, trackTopic, "Kai está refinando a descrição...")} disabled={isLoading || !trackTopic}>Gerar só Descrição</Button>
            </div>
            {generatedJson && (
              <pre className="mt-4 p-4 bg-black text-green-400 rounded-md text-xs overflow-x-auto">
                <code>{JSON.stringify(JSON.parse(generatedJson), null, 2)}</code>
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  );
}