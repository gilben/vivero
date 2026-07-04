import { z } from 'zod'
import { logger } from '@/utils/logger'
import type { ChatResponseDto, ProductDto } from '@/types/api'

/** Contrato JSON que TODOS los proveedores (Claude/OpenAI/Gemini) deben devolver. */
export const assistantReplySchema = z.object({
  reply: z.string().min(1),
  intent: z.enum(['saludo', 'conversacion', 'buscar-productos', 'sin-resultados', 'cotizacion']),
  productIds: z.array(z.string()),
  quote: z
    .object({
      name: z.string().min(1),
      email: z.string().min(1),
      phone: z.string().min(1),
      detail: z.string().min(1),
    })
    .nullable(),
})

export type AssistantReply = z.infer<typeof assistantReplySchema>

/** Quita fences ```json ... ``` si el modelo los agrega a pesar de las instrucciones. */
function stripCodeFences(text: string): string {
  return text.replace(/^\s*```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '')
}

/**
 * Valida la respuesta cruda del proveedor y la traduce al contrato del chat.
 * Los productIds se resuelven contra el catálogo real: ids inventados se descartan
 * (validación de existencia de productos retornados, ST-AI-01).
 */
export function parseAssistantReply(raw: unknown, catalog: ProductDto[]): ChatResponseDto {
  const data = typeof raw === 'string' ? JSON.parse(stripCodeFences(raw)) : raw
  const parsed = assistantReplySchema.parse(data)

  const products = parsed.productIds
    .map(id => catalog.find(p => p.id === id))
    .filter((p): p is ProductDto => p !== undefined)

  if (products.length !== parsed.productIds.length) {
    logger.warn('Chat IA: el modelo devolvió ids de producto inexistentes', parsed.productIds)
  }

  return {
    reply: parsed.reply,
    intent: parsed.intent,
    products,
    quote: parsed.quote,
  }
}