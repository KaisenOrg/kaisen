import { useState } from 'react'
import { useActor } from '@/lib/agent'
import { useUser } from '@/providers/user-provider'
import { LoginButton } from '@/components/general/login-button'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  sender: 'User' | 'Model'
  text: string
}

export default function KaiTestPage() {
  const { isAuthenticated } = useUser()
  const [status, setStatus] = useState<string>('Pronto.')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const kaiActor = useActor('kai_backend')
  const chatActor = useActor('chats_backend')

  const [chatId, setChatId] = useState<string | null>(null)
  const [chatPrompt, setChatPrompt] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [generatedTrackJSON, _] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!kaiActor || !chatActor || !chatPrompt.trim()) {
      alert("Faça o login e digite uma mensagem para iniciar a conversa.")
      return
    }

    setIsLoading(true)
    setStatus('Iniciando conversa...')

    const currentPrompt = chatPrompt
    setMessages(prev => [...prev, { sender: 'User', text: currentPrompt }])
    setChatPrompt('')

    try {
      let currentChatId = chatId

      if (!currentChatId) {
        setStatus('Criando nova sessão de chat no backend...')
        const newChatId = await chatActor.createChatSession(currentPrompt)
        setChatId(newChatId)
        currentChatId = newChatId
      }

      const historyForAI = messages
        .map(m => `{"role": "${m.sender.toLowerCase()}", "parts": [{"text": "${m.text.replace(/"/g, '\\"')}"}]}`)
        .join(', ')

      setStatus('Kai está pensando...')
      const result = await kaiActor.generateChatResponse(
        currentPrompt,
        messages.length > 0 ? [historyForAI] : []
      )

      if ('err' in result) {
        throw new Error(result.err)
      }

      const aiResponseText = result.ok
      const aiResponseJSON = JSON.parse(aiResponseText)
      setStatus('Kai respondeu. Salvando interação...')

      await chatActor.addInteraction(currentChatId!, currentPrompt, aiResponseJSON.candidates[0].content.parts[0].text)

      const aiMessage: Message = { sender: 'Model', text: aiResponseJSON.candidates[0].content.parts[0].text }
      setMessages(prev => [...prev, aiMessage])
      setStatus('Pronto.')

    } catch (e: any) {
      console.error("Erro na conversa com o Kai:", e)
      setStatus(`Erro na conversa com o Kai: ${e.message}`)
      setMessages(messages)
    } finally {
      setIsLoading(false)
    }
  }

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
          <div className="mb-8 p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">2. Teste do Fluxo de Chat</h2>
            <p className="text-sm text-gray-500 mb-4">Inicie um chat ou gere uma trilha completa com o mesmo campo de texto.</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={chatPrompt}
                onChange={(e) => setChatPrompt(e.target.value)}
                placeholder="Digite sua primeira mensagem ou um tópico para a trilha..."
                className="flex-grow p-2 border rounded"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading} className="btn-secondary disabled:opacity-50">
                {!!chatId ? 'Enviar' : 'Iniciar Chat'}
              </Button>
            </div>
            <div className="mt-4 p-2 h-64 overflow-y-auto border-gray-50/80 border rounded">
              {messages.map((msg, i) => (
                <div key={i} className={`p-2 my-1 rounded ${msg.sender === 'User' ? 'bg-blue-100/80 text-right' : 'bg-gray-200/80'}`}>
                  <strong>{msg.sender}:</strong>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h2 className="text-xl font-semibold mb-2">3. Teste de Salvamento de Trilha</h2>
            <p className="text-sm text-gray-500 mb-4">Após usar o botão &quotGerar Trilha Direto&quot, o JSON aparecerá abaixo e você poderá salvá-lo.</p>
            {generatedTrackJSON && (
              <pre className="mt-4 p-4 bg-black text-white/50 rounded-md text-xs overflow-x-auto">
                <code>{JSON.stringify(JSON.parse(generatedTrackJSON), null, 2)}</code>
              </pre>
            )}
          </div>
        </>
      )}
    </div>
  )
}