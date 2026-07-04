import { useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts } from '@/features/catalogo/api'
import { logger } from '@/utils/logger'
import type { ChatResponseDto } from '@/types/api'
import { sendChatTurn } from '../api'
import type { ChatMessage } from '../types'
import { useChatStore } from '../store/chatStore'

interface ChatSendInput {
  history: ChatMessage[]
  message: string
}

export function useChat() {
  const queryClient = useQueryClient()
  const messages = useChatStore(s => s.messages)
  const addMessage = useChatStore(s => s.addMessage)

  const mutation = useMutation<ChatResponseDto, unknown, ChatSendInput>({
    mutationFn: async ({ history, message }) => {
      // mismo queryKey que useProducts: reutiliza la caché del catálogo (o la
      // puebla) — única fuente de inventario, sin datos quemados en el chat
      const catalog = await queryClient.fetchQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
      })
      return sendChatTurn({ history, message, catalog })
    },
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