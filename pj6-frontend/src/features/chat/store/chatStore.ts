import { create } from 'zustand'
import type { ChatMessage } from '../types'

interface ChatState {
  messages: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, 'id'>) => void
}

let nextId = 0

// la conversación persiste al cerrar/abrir el panel dentro de la misma sesión
export const useChatStore = create<ChatState>(set => ({
  messages: [],
  addMessage: message =>
    set(state => ({ messages: [...state.messages, { ...message, id: `msg-${++nextId}` }] })),
}))