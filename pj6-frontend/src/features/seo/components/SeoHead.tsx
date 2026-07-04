import { useEffect } from 'react'
import { logger } from '@/utils/logger'
import { DEFAULT_TITLE, SITE_NAME } from '../constants'
import { serializeJsonLd } from '../jsonLd'

interface SeoHeadProps {
  title: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'product'
  /** Genera og:price:amount / og:price:currency. */
  price?: { amount: number; currency: string }
  jsonLd?: Record<string, unknown>
  /** Para estados 404/no indexables. */
  noindex?: boolean
}

// Todos los tags gestionados llevan data-seo: se re-generan al cambiar el
// producto y se limpian al desmontar. Se escriben con setAttribute/textContent
// (nunca innerHTML), así el DOM escapa cualquier dato inyectado.
const MANAGED_SELECTOR = '[data-seo]'

function appendMeta(attr: 'name' | 'property', key: string, content: string) {
  const el = document.createElement('meta')
  el.setAttribute(attr, key)
  el.setAttribute('content', content)
  el.setAttribute('data-seo', 'true')
  document.head.appendChild(el)
}

export default function SeoHead({
  title,
  description,
  image,
  url,
  type = 'website',
  price,
  jsonLd,
  noindex,
}: SeoHeadProps) {
  // serializado para que el efecto reaccione a cualquier cambio de metadatos
  const signature = JSON.stringify({ title, description, image, url, type, price, jsonLd, noindex })

  useEffect(() => {
    try {
      document.head.querySelectorAll(MANAGED_SELECTOR).forEach(el => el.remove())
      document.title = title

      appendMeta('property', 'og:site_name', SITE_NAME)
      appendMeta('property', 'og:type', type)
      appendMeta('property', 'og:title', title)
      if (description) {
        appendMeta('name', 'description', description)
        appendMeta('property', 'og:description', description)
      }
      if (image) {
        appendMeta('property', 'og:image', image)
        appendMeta('name', 'twitter:card', 'summary_large_image')
      }
      if (url) {
        appendMeta('property', 'og:url', url)
        const canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        canonical.setAttribute('href', url)
        canonical.setAttribute('data-seo', 'true')
        document.head.appendChild(canonical)
      }
      if (price) {
        appendMeta('property', 'og:price:amount', String(price.amount))
        appendMeta('property', 'og:price:currency', price.currency)
      }
      if (noindex) appendMeta('name', 'robots', 'noindex')
      if (jsonLd) {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-seo', 'true')
        script.textContent = serializeJsonLd(jsonLd)
        document.head.appendChild(script)
      }
    } catch (error) {
      logger.error('SEO: error generando metadatos', error)
    }

    return () => {
      document.head.querySelectorAll(MANAGED_SELECTOR).forEach(el => el.remove())
      document.title = DEFAULT_TITLE
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])

  return null
}