import { buildMockChatResponse } from './api'
import type { ProductDto } from '@/types/api'

const CATALOG: ProductDto[] = [
  {
    id: 'p-1', name: 'Monstera', botanicalName: 'Monstera deliciosa',
    category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
    altText: 'Monstera', light: 'media-sombra', water: 'medio', inStock: true,
  },
  {
    id: 'p-2', name: 'Lengua de suegra', botanicalName: 'Sansevieria trifasciata',
    category: 'plantas', price: 38000, imageUrl: 'https://example.com/sansevieria.jpg',
    altText: 'Sansevieria', light: 'media-sombra', water: 'bajo', inStock: true,
  },
  {
    id: 'a-1', name: 'Guayacán amarillo', botanicalName: 'Handroanthus chrysanthus',
    category: 'arboles', price: 120000, imageUrl: 'https://example.com/guayacan.jpg',
    altText: 'Guayacán', light: 'sol', water: 'medio', inStock: true,
  },
  {
    id: 'a-2', name: 'Limonero', botanicalName: 'Citrus × limon',
    category: 'arboles', price: 95000, imageUrl: 'https://example.com/limonero.jpg',
    altText: 'Limonero', light: 'sol', water: 'alto', inStock: false,
  },
  {
    id: 'm-1', name: 'Matero de barro', category: 'materos', price: 28000,
    imageUrl: 'https://example.com/matero.jpg', altText: 'Matero', inStock: true,
  },
]

describe('buildMockChatResponse', () => {
  it('detecta la intención de búsqueda por categoría', () => {
    const res = buildMockChatResponse('busco materos para mi terraza', CATALOG)
    expect(res.intent).toBe('buscar-productos')
    expect(res.products.map(p => p.id)).toEqual(['m-1'])
  })

  it('filtra por condiciones de luz (sombra/interior)', () => {
    const res = buildMockChatResponse('plantas para sombra', CATALOG)
    expect(res.intent).toBe('buscar-productos')
    expect(res.products.map(p => p.id)).toEqual(['p-1', 'p-2'])
  })

  it('filtra por bajo mantenimiento (fáciles de cuidar)', () => {
    const res = buildMockChatResponse('plantas fáciles de cuidar', CATALOG)
    expect(res.products.map(p => p.id)).toEqual(['p-2'])
  })

  it('encuentra productos por nombre, ignorando mayúsculas y acentos', () => {
    const res = buildMockChatResponse('¿Tienes MONSTERA?', CATALOG)
    expect(res.intent).toBe('buscar-productos')
    expect(res.products.map(p => p.id)).toEqual(['p-1'])
  })

  it('recomienda solo inventario disponible', () => {
    const res = buildMockChatResponse('busco un arbol para el jardin', CATALOG)
    expect(res.products.map(p => p.id)).toEqual(['a-1'])
    expect(res.products.some(p => !p.inStock)).toBe(false)
  })

  it('responde al saludo sin recomendar productos', () => {
    const res = buildMockChatResponse('hola', CATALOG)
    expect(res.intent).toBe('saludo')
    expect(res.products).toEqual([])
  })

  it('sin coincidencias devuelve una respuesta explicativa', () => {
    const res = buildMockChatResponse('qwertyuiop asdfgh', CATALOG)
    expect(res.intent).toBe('sin-resultados')
    expect(res.products).toEqual([])
    expect(res.reply).toContain('No encontré productos')
  })

  it('tolera prompts que exceden el límite (se recortan, no fallan)', () => {
    const res = buildMockChatResponse('a'.repeat(2000), CATALOG)
    expect(res.intent).toBe('sin-resultados')
  })
})