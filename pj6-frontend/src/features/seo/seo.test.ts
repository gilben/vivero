import { buildProductJsonLd, serializeJsonLd } from './jsonLd'
import { buildProductSeo, safeImageUrl, truncateDescription } from './openGraph'
import { DEFAULT_OG_IMAGE, SEO_DESCRIPTION_MAX } from './constants'
import type { ProductDto } from '@/types/api'

const PRODUCT: ProductDto = {
  id: 'p-01', name: 'Monstera', botanicalName: 'Monstera deliciosa',
  category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
  altText: 'Planta de Monstera',
  description: 'Planta de interior de hojas grandes y perforadas.',
  light: 'media-sombra', water: 'medio', inStock: true,
}

const URL_PRODUCTO = 'https://pj6vivero.com/catalogo/p-01'

describe('truncateDescription', () => {
  it('respeta textos cortos y recorta los largos con elipsis', () => {
    expect(truncateDescription('corta')).toBe('corta')
    const larga = 'a'.repeat(300)
    const result = truncateDescription(larga)
    expect(result.length).toBeLessThanOrEqual(SEO_DESCRIPTION_MAX)
    expect(result.endsWith('…')).toBe(true)
  })
})

describe('safeImageUrl', () => {
  it('acepta URLs http(s) absolutas', () => {
    expect(safeImageUrl('https://example.com/foto.jpg')).toBe('https://example.com/foto.jpg')
  })

  it('usa la imagen por defecto si falta la URL o es inválida', () => {
    expect(safeImageUrl(undefined)).toBe(DEFAULT_OG_IMAGE)
    expect(safeImageUrl('no-es-url')).toBe(DEFAULT_OG_IMAGE)
    expect(safeImageUrl('javascript:alert(1)')).toBe(DEFAULT_OG_IMAGE)
  })
})

describe('buildProductSeo', () => {
  it('arma título con marca, descripción, imagen, url y precio COP', () => {
    const seo = buildProductSeo(PRODUCT, URL_PRODUCTO)
    expect(seo.title).toBe('Monstera — pj6 vivero')
    expect(seo.description).toBe('Planta de interior de hojas grandes y perforadas.')
    expect(seo.image).toBe('https://example.com/monstera.jpg')
    expect(seo.url).toBe(URL_PRODUCTO)
    expect(seo.price).toEqual({ amount: 65000, currency: 'COP' })
  })
})

describe('buildProductJsonLd', () => {
  it('genera el esquema Product de schema.org con oferta y disponibilidad', () => {
    const jsonLd = buildProductJsonLd(PRODUCT, URL_PRODUCTO)
    expect(jsonLd['@context']).toBe('https://schema.org')
    expect(jsonLd['@type']).toBe('Product')
    expect(jsonLd.name).toBe('Monstera')
    expect(jsonLd.sku).toBe('p-01')
    expect(jsonLd.offers).toMatchObject({
      '@type': 'Offer',
      price: 65000,
      priceCurrency: 'COP',
      availability: 'https://schema.org/InStock',
      url: URL_PRODUCTO,
    })
  })

  it('marca OutOfStock cuando el producto está agotado', () => {
    const jsonLd = buildProductJsonLd({ ...PRODUCT, inStock: false }, URL_PRODUCTO)
    expect(jsonLd.offers).toMatchObject({ availability: 'https://schema.org/OutOfStock' })
  })
})

describe('serializeJsonLd (anti-XSS)', () => {
  it('escapa "<" para que un dato malicioso no pueda cerrar el script', () => {
    const malicious = { name: '</script><script>alert(1)</script>' }
    const out = serializeJsonLd(malicious)
    expect(out).not.toContain('</script>')
    expect(out).toContain('\\u003c/script>')
    // sigue siendo JSON válido con el contenido intacto
    expect(JSON.parse(out)).toEqual(malicious)
  })
})