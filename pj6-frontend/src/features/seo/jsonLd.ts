import type { ProductDto } from '@/types/api'
import { SITE_NAME } from './constants'
import { safeImageUrl, truncateDescription } from './openGraph'

/**
 * Serializa JSON-LD escapando "<" para que un dato malicioso nunca pueda
 * cerrar el <script> e inyectar HTML (XSS).
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

export function buildProductJsonLd(product: ProductDto, url: string): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    ...(product.description && { description: truncateDescription(product.description) }),
    image: [safeImageUrl(product.imageUrl)],
    sku: product.id,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url,
      price: product.price,
      priceCurrency: 'COP',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  }
}