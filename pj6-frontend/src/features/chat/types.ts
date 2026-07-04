import type { ProductDto, QuoteRequestDto } from '@/types/api'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  products?: ProductDto[]
  /** Cotización completa lista para confirmar y enviar. */
  quote?: QuoteRequestDto
}