import { useActor } from '@/lib/agent'

export function useCommand() {
  const kai = useActor('kai_backend')

  async function runCommand(messages: { role: string; content: string }[], context: [string]) {
    if (!messages || !messages.length) {
      throw new Error('Mensagens são obrigatórias')
    }

    try {
      const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')

      const result = await kai?.generateChatResponse(prompt, context)
      return result
    } catch (error) {
      console.error('Erro ao executar comando:', error)
      throw error
    }
  }

  return { runCommand }
}
