import { resolveProvider } from './index'
import { parseAssistantReply } from './schema'
import { buildProviderMessages, buildSystemPrompt } from './systemPrompt'
import type { ProductDto } from '@/types/api'

const CATALOG: ProductDto[] = [
  {
    id: 'p-1', name: 'Monstera', botanicalName: 'Monstera deliciosa',
    category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
    altText: 'Monstera', light: 'media-sombra', water: 'medio', inStock: true,
  },
  {
    id: 'm-1', name: 'Matero de barro', category: 'materos', price: 28000,
    imageUrl: 'https://example.com/matero.jpg', altText: 'Matero', inStock: true,
  },
]

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('resolveProvider', () => {
  it('usa mock por defecto', () => {
    expect(resolveProvider()).toBe('mock')
  })

  it('usa el proveedor configurado cuando hay API key', () => {
    vi.stubEnv('VITE_AI_PROVIDER', 'claude')
    vi.stubEnv('VITE_AI_API_KEY', 'sk-test')
    expect(resolveProvider()).toBe('claude')
  })

  it('cae a mock si el proveedor no tiene API key (el chat nunca queda roto)', () => {
    vi.stubEnv('VITE_AI_PROVIDER', 'gemini')
    vi.stubEnv('VITE_AI_API_KEY', '')
    expect(resolveProvider()).toBe('mock')
  })

  it('ignora proveedores desconocidos', () => {
    vi.stubEnv('VITE_AI_PROVIDER', 'skynet')
    vi.stubEnv('VITE_AI_API_KEY', 'sk-test')
    expect(resolveProvider()).toBe('mock')
  })
})

describe('buildSystemPrompt', () => {
  it('incluye el inventario con ids y el contrato JSON', () => {
    const prompt = buildSystemPrompt(CATALOG)
    expect(prompt).toContain('"id":"p-1"')
    expect(prompt).toContain('"precioCOP":65000')
    expect(prompt).toContain('"intent"')
    expect(prompt).toContain('cotizacion')
    expect(prompt).toContain('nombre completo, correo electrónico, teléfono')
  })
})

describe('buildProviderMessages', () => {
  it('acota el historial y agrega el mensaje nuevo al final', () => {
    const history = Array.from({ length: 20 }, (_, i) => ({
      role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
      text: `mensaje ${i}`,
    }))
    const messages = buildProviderMessages(history, 'hola')
    expect(messages.length).toBe(13) // 12 de historial + el nuevo
    expect(messages[messages.length - 1]).toEqual({ role: 'user', content: 'hola' })
  })
})

describe('parseAssistantReply', () => {
  it('acepta JSON en string (OpenAI/Gemini) y resuelve productos por id', () => {
    const raw = JSON.stringify({
      reply: 'Te recomiendo la Monstera.',
      intent: 'buscar-productos',
      productIds: ['p-1'],
      quote: null,
    })
    const result = parseAssistantReply(raw, CATALOG)
    expect(result.intent).toBe('buscar-productos')
    expect(result.products.map(p => p.id)).toEqual(['p-1'])
    expect(result.quote).toBeNull()
  })

  it('tolera fences de markdown alrededor del JSON', () => {
    const raw = '```json\n{"reply":"Hola","intent":"saludo","productIds":[],"quote":null}\n```'
    expect(parseAssistantReply(raw, CATALOG).intent).toBe('saludo')
  })

  it('descarta ids de producto que no existen en el catálogo', () => {
    const raw = JSON.stringify({
      reply: 'Mira estas opciones.',
      intent: 'buscar-productos',
      productIds: ['p-1', 'producto-inventado'],
      quote: null,
    })
    expect(parseAssistantReply(raw, CATALOG).products.map(p => p.id)).toEqual(['p-1'])
  })

  it('entrega la cotización completa cuando el modelo la recopiló', () => {
    const raw = {
      reply: 'Confirma el envío de tu solicitud.',
      intent: 'cotizacion',
      productIds: [],
      quote: {
        name: 'Ana Pérez', email: 'ana@correo.com',
        phone: '3001234567', detail: '10 materos de barro',
      },
    }
    const result = parseAssistantReply(raw, CATALOG)
    expect(result.intent).toBe('cotizacion')
    expect(result.quote?.name).toBe('Ana Pérez')
  })

  it('rechaza respuestas que no cumplen el contrato', () => {
    expect(() => parseAssistantReply('{"foo": "bar"}', CATALOG)).toThrow()
    expect(() => parseAssistantReply('no es json', CATALOG)).toThrow()
  })
})