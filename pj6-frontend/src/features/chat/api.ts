import { logger } from '@/utils/logger'
import type { ChatResponseDto, ProductDto, QuoteRequestDto } from '@/types/api'
import type { ChatMessage } from './types'
import { resolveProvider, sendViaProvider } from './providers'

// Latencia simulada para que el indicador "escribiendo…" sea visible
const MOCK_LATENCY_MS = 800

/** Límite del prompt: se valida en el input y se recorta aquí por seguridad. */
export const PROMPT_MAX_LENGTH = 500

const MAX_RECOMMENDATIONS = 4

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

/** minúsculas + sin acentos, para comparar palabras del usuario con el catálogo */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

const CATEGORY_KEYWORDS: [string, ProductDto['category']][] = [
  ['planta', 'plantas'],
  ['arbol', 'arboles'],
  ['grama', 'gramas'],
  ['cesped', 'gramas'],
  ['pasto', 'gramas'],
  ['flor', 'flores'],
  ['matero', 'materos'],
  ['matera', 'materos'],
  ['maceta', 'materos'],
]

const GREETING_PATTERN = /\b(hola|buenas|buenos dias|buenas tardes|buenas noches)\b/

/**
 * Motor de búsqueda del mock: interpreta categoría, luz y riego a partir de
 * palabras clave, o busca por nombre de producto. Solo recomienda inventario
 * disponible. El backend real (Semantic Kernel) reemplaza TODO esto.
 */
export function buildMockChatResponse(
  rawMessage: string,
  catalog: ProductDto[]
): ChatResponseDto {
  const message = normalize(rawMessage.trim().slice(0, PROMPT_MAX_LENGTH))

  // coincidencia directa por nombre ("¿tienes monstera?")
  const words = message.split(/[^a-z0-9]+/).filter(w => w.length > 3)
  const byName = catalog.filter(p => {
    const name = normalize(p.name)
    return p.inStock && words.some(w => name.includes(w))
  })

  const category = CATEGORY_KEYWORDS.find(([keyword]) => message.includes(keyword))?.[1]
  const wantsShade = /(sombra|interior)/.test(message)
  const wantsSun = /\bsol\b|exterior|terraza/.test(message)
  const wantsLowCare = /(poco riego|facil|principiante|resistente)/.test(message)

  let results = byName
  if (results.length === 0 && (category || wantsShade || wantsSun || wantsLowCare)) {
    results = catalog.filter(p => p.inStock)
    if (category) results = results.filter(p => p.category === category)
    // los productos sin ficha de cuidados (materos) son neutrales a estos filtros
    if (wantsShade)
      results = results.filter(p => !p.light || p.light === 'sombra' || p.light === 'media-sombra')
    else if (wantsSun) results = results.filter(p => !p.light || p.light === 'sol')
    if (wantsLowCare) results = results.filter(p => !p.water || p.water === 'bajo')
  }

  if (results.length > 0) {
    const products = results.slice(0, MAX_RECOMMENDATIONS)
    return {
      intent: 'buscar-productos',
      reply:
        products.length === 1
          ? 'Encontré esta opción en nuestro catálogo:'
          : `Encontré ${products.length} opciones en nuestro catálogo:`,
      products,
    }
  }

  if (GREETING_PATTERN.test(message)) {
    return {
      intent: 'saludo',
      reply:
        'Hola, soy el asistente del vivero. Cuéntame qué buscas: por ejemplo, "plantas para sombra", "un árbol para el jardín" o "materos de barro".',
      products: [],
    }
  }

  return {
    intent: 'sin-resultados',
    reply:
      'No encontré productos que coincidan con tu búsqueda. Puedo ayudarte con plantas, árboles, gramas, flores y materos; prueba por ejemplo con "plantas fáciles de cuidar" o "flores para sol".',
    products: [],
  }
}

export interface ChatTurnInput {
  /** Historial previo (sin el mensaje nuevo), para conversaciones multi-turno. */
  history: ChatMessage[]
  message: string
  /**
   * Inventario vigente, provisto por la capa de datos del catálogo
   * (fetchProducts / caché de TanStack Query). Este módulo nunca conoce la
   * fuente: cuando el catálogo consuma el API real, el chat lo hereda.
   */
  catalog: ProductDto[]
}

/**
 * Punto de entrada del chat: despacha al proveedor de IA configurado
 * (VITE_AI_PROVIDER) o al mock por defecto.
 *
 * Cuando el backend (ST-AI-01) exponga /api/v1/ai/chat, este despachador
 * pasa a ser:
 *   const res = await apiClient.post<ChatResponseDto>('/v1/ai/chat', { message: input.message })
 *   return res.data
 */
export async function sendChatTurn(input: ChatTurnInput): Promise<ChatResponseDto> {
  const provider = resolveProvider()
  if (provider === 'mock') {
    await delay(MOCK_LATENCY_MS)
    return buildMockChatResponse(input.message, input.catalog)
  }
  return sendViaProvider(provider, input.history, input.message, input.catalog)
}

/** Correo al que llegan las solicitudes de cotización. */
export const QUOTE_EMAIL = import.meta.env.VITE_QUOTE_EMAIL ?? 'ventas@pj6vivero.com'

// Cuando el backend exponga /v1/quotes (que envía el correo) este cuerpo pasa a ser:
//   const res = await apiClient.post<{ message: string }>('/v1/quotes', quote)
//   return res.data
export async function sendQuoteRequest(quote: QuoteRequestDto): Promise<{ message: string }> {
  await delay(MOCK_LATENCY_MS)
  // El navegador no puede enviar correos por sí solo: se simula el envío y se
  // registra; el envío real es responsabilidad del backend (ver docs/chat-ia.md)
  logger.info(`Cotización simulada enviada a ${QUOTE_EMAIL}`, quote)
  return { message: 'ok' }
}