import type { ProductDto } from '@/types/api'
import { logger } from '@/utils/logger'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SEO_DESCRIPTION_MAX,
  SITE_NAME,
} from './constants'

export interface ProductSeo {
  title: string
  description: string
  image: string
  url: string
  price: { amount: number; currency: string }
}

export function truncateDescription(text: string, max = SEO_DESCRIPTION_MAX): string {
  const normalized = text.trim()
  if (normalized.length <= max) return normalized
  return `${normalized.slice(0, max - 1).trimEnd()}…`
}

/** Valida que la URL de imagen sea http(s) absoluta; si no, usa la imagen por defecto. */
export function safeImageUrl(url: string | undefined): string {
  if (!url) return DEFAULT_OG_IMAGE
  try {
    const parsed = new URL(url)
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return url
  } catch {
    // cae al fallback
  }
  logger.error('SEO: URL de imagen inválida, usando imagen por defecto', url)
  return DEFAULT_OG_IMAGE
}

export function buildProductSeo(product: ProductDto, url: string): ProductSeo {
  return {
    title: `${product.name} — ${SITE_NAME}`,
    description: truncateDescription(product.description ?? DEFAULT_DESCRIPTION),
    image: safeImageUrl(product.imageUrl),
    url,
    price: { amount: product.price, currency: 'COP' },
  }
}