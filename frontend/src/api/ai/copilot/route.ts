import { useActor } from '@/lib/agent'

export function useCopilot() {
  const kai = useActor('kai_backend')

  async function askCopilot(prompt: string, context: [string]) {
    if (!prompt) {
      throw new Error('Prompt é obrigatório')
    }

    try {
      const result = await kai?.generateChatResponse(prompt, context)
      return result
    } catch (error) {
      console.error('Erro ao gerar resposta do Copilot:', error)
      throw error
    }
  }

  return { askCopilot }
}
