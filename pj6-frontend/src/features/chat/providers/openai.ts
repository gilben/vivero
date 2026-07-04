import type { ProviderMessage } from './systemPrompt'

const DEFAULT_MODEL = 'gpt-4o-mini'
const REQUEST_TIMEOUT_MS = 60_000

/**
 * OpenAI Chat Completions en modo JSON. La validación del contrato la hace
 * parseAssistantReply (zod) sobre el texto devuelto.
 */
export async function callOpenAi(
  apiKey: string,
  model: string | undefined,
  system: string,
  messages: ProviderMessage[]
): Promise<unknown> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || DEFAULT_MODEL,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  })

  if (!res.ok) {
    throw new Error(`OpenAI respondió ${res.status}`)
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[]
  }
  const text = data.choices?.[0]?.message?.content
  if (!text) throw new Error('OpenAI no devolvió contenido')
  return text
}