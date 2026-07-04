import type { ProviderMessage } from './systemPrompt'

const DEFAULT_MODEL = 'claude-opus-4-8'
const REQUEST_TIMEOUT_MS = 60_000

// Espejo JSON Schema de assistantReplySchema (zod v3 no es compatible con el
// helper zodOutputFormat del SDK, que requiere zod v4). La validación final
// la hace parseAssistantReply con zod igual que con los demás proveedores.
const ASSISTANT_REPLY_JSON_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['reply', 'intent', 'productIds', 'quote'],
  properties: {
    reply: { type: 'string' },
    intent: {
      type: 'string',
      enum: ['saludo', 'conversacion', 'buscar-productos', 'sin-resultados', 'cotizacion'],
    },
    productIds: { type: 'array', items: { type: 'string' } },
    quote: {
      anyOf: [
        {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'email', 'phone', 'detail'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            phone: { type: 'string' },
            detail: { type: 'string' },
          },
        },
        { type: 'null' },
      ],
    },
  },
} as const

/**
 * Claude vía SDK oficial con structured outputs (output_config.format
 * garantiza JSON válido conforme al esquema).
 *
 * ADVERTENCIA: dangerouslyAllowBrowser expone la API key a cualquier visitante
 * del sitio. Solo para desarrollo/demo — en producción el chat debe pasar por
 * el backend (ST-AI-01). Ver docs/chat-ia.md.
 */
export async function callClaude(
  apiKey: string,
  model: string | undefined,
  system: string,
  messages: ProviderMessage[]
): Promise<unknown> {
  // import dinámico: el SDK solo se descarga si el proveedor está activo
  const { default: Anthropic } = await import('@anthropic-ai/sdk')

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
    timeout: REQUEST_TIMEOUT_MS,
  })

  const response = await client.messages.create({
    model: model || DEFAULT_MODEL,
    max_tokens: 2048,
    system,
    messages,
    output_config: {
      format: {
        type: 'json_schema',
        schema: ASSISTANT_REPLY_JSON_SCHEMA,
      },
    },
  })

  const textBlock = response.content.find(block => block.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Claude no devolvió una respuesta de texto')
  }
  return textBlock.text
}