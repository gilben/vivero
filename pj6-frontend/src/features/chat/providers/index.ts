import { logger } from '@/utils/logger'
import type { ChatResponseDto, ProductDto } from '@/types/api'
import type { ChatMessage } from '../types'
import { callClaude } from './claude'
import { callGemini } from './gemini'
import { callOpenAi } from './openai'
import { parseAssistantReply } from './schema'
import { buildProviderMessages, buildSystemPrompt } from './systemPrompt'

export type AiProvider = 'mock' | 'claude' | 'openai' | 'gemini'

const LLM_PROVIDERS = ['claude', 'openai', 'gemini'] as const

/**
 * Proveedor activo según .env. Sin VITE_AI_API_KEY siempre se usa el mock:
 * el chat nunca queda roto por configuración incompleta.
 */
export function resolveProvider(): AiProvider {
  const provider = import.meta.env.VITE_AI_PROVIDER
  if ((LLM_PROVIDERS as readonly string[]).includes(provider)) {
    if (import.meta.env.VITE_AI_API_KEY) return provider as AiProvider
    logger.warn(`Chat IA: VITE_AI_PROVIDER=${provider} sin VITE_AI_API_KEY — usando mock`)
  }
  return 'mock'
}

const CALLERS: Record<
  Exclude<AiProvider, 'mock'>,
  (apiKey: string, model: string | undefined, system: string, messages: ReturnType<typeof buildProviderMessages>) => Promise<unknown>
> = {
  claude: callClaude,
  openai: callOpenAi,
  gemini: callGemini,
}

export async function sendViaProvider(
  provider: Exclude<AiProvider, 'mock'>,
  history: ChatMessage[],
  message: string,
  catalog: ProductDto[]
): Promise<ChatResponseDto> {
  const apiKey = import.meta.env.VITE_AI_API_KEY as string
  const model = import.meta.env.VITE_AI_MODEL as string | undefined

  const system = buildSystemPrompt(catalog)
  const messages = buildProviderMessages(history, message)

  const raw = await CALLERS[provider](apiKey, model, system, messages)
  return parseAssistantReply(raw, catalog)
}