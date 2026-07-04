import type { ProviderMessage } from './systemPrompt'

// gemini-2.0-flash ya no tiene cuota free-tier (limit: 0); 3.5-flash sí
const DEFAULT_MODEL = 'gemini-3.5-flash'
const REQUEST_TIMEOUT_MS = 60_000

/**
 * Google Gemini (generateContent) en modo JSON. La validación del contrato la
 * hace parseAssistantReply (zod) sobre el texto devuelto.
 */
export async function callGemini(
  apiKey: string,
  model: string | undefined,
  system: string,
  messages: ProviderMessage[]
): Promise<unknown> {
  const resolvedModel = model || DEFAULT_MODEL
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${resolvedModel}:generateContent`,
    {
      method: 'POST',
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        })),
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini respondió ${res.status}`)
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[]
  }
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) throw new Error('Gemini no devolvió contenido')
  return text
}