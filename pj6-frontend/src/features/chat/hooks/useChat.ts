import { useMutation } from '@tanstack/react-query'
import { logger } from '@/utils/logger'
import type { ChatResponseDto } from '@/types/api'
import { sendChatTurn, type ChatTurnInput } from '../api'
import { useChatStore } from '../store/chatStore'

export function useChat() {
  const messages = useChatStore(s => s.messages)
  const addMessage = useChatStore(s => s.addMessage)

  const mutation = useMutation<ChatResponseDto, unknown, ChatTurnInput>({
    mutationFn: sendChatTurn,
  })

  const send = (text: string) => {
    const message = text.trim()
    if (!message || mutation.isPending) return

    // snapshot del historial ANTES de agregar el mensaje nuevo
    const history = useChatStore.getState().messages
    addMessage({ role: 'user', text: message })
    mutation.mutate(
      { history, message },
      {
        onSuccess: response =>
          addMessage({
            role: 'assistant',
            text: response.reply,
            products: response.products,
            quote: response.quote ?? undefined,
          }),
        onError: error => {
          logger.error('Chat: error del asistente', error)
          addMessage({
            role: 'assistant',
            text: 'No pudimos procesar tu solicitud. Intenta de nuevo en unos minutos.',
          })
        },
      }
    )
  }

  return { messages, send, isPending: mutation.isPending }
}