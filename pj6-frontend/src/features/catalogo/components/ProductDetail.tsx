import { Link, useParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, CircleCheck, Droplets, RefreshCw, SearchX } from 'lucide-react'
import Button from '@/components/ui/Button'
import SeoHead from '@/features/seo/components/SeoHead'
import { SITE_NAME } from '@/features/seo/constants'
import { buildProductJsonLd } from '@/features/seo/jsonLd'
import { buildProductSeo } from '@/features/seo/openGraph'
import { useProduct } from '../hooks/useProduct'
import { useProducts } from '../hooks/useProducts'
import { CATEGORY_LABELS, LIGHT_LABELS, WATER_LABELS } from '../constants'
import { LIGHT_ICONS } from './CareBadges'
import ProductCard, { formatPrice } from './ProductCard'

const RELATED_COUNT = 4

function BackLink() {
  return (
    <Link
      to="/catalogo"
      className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium text-primary transition-colors duration-150 ease-out hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowLeft size={16} aria-hidden="true" />
      Volver al catálogo
    </Link>
  )
}

function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Cargando producto"
      className="grid animate-pulse gap-8 md:grid-cols-2 lg:gap-12"
    >
      <div className="aspect-[4/5] rounded-[var(--radius-lg)] border border-line bg-primary/5" />
      <div className="flex flex-col gap-4 pt-2">
        <div className="h-4 w-24 rounded-[var(--radius-sm)] bg-primary/5" />
        <div className="h-8 w-3/4 rounded-[var(--radius-sm)] bg-primary/10" />
        <div className="h-4 w-1/2 rounded-[var(--radius-sm)] bg-primary/5" />
        <div className="h-6 w-32 rounded-[var(--radius-sm)] bg-primary/10" />
        <div className="h-20 w-full rounded-[var(--radius-sm)] bg-primary/5" />
      </div>
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isPending, isError, refetch } = useProduct(id)
  const { data: allProducts } = useProducts()
  const reduceMotion = useReducedMotion()

  const related = (allProducts ?? [])
    .filter(p => product && p.category === product.category && p.id !== product.id)
    .slice(0, RELATED_COUNT)

  const LightIcon = product?.light ? LIGHT_ICONS[product.light] : null

  const canonicalUrl = `${window.location.origin}/catalogo/${id}`
  const seo = product ? buildProductSeo(product, canonicalUrl) : null

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      {product && seo && (
        <SeoHead
          title={seo.title}
          description={seo.description}
          image={seo.image}
          url={seo.url}
          type="product"
          price={seo.price}
          jsonLd={buildProductJsonLd(product, canonicalUrl)}
        />
      )}
      {!isPending && !isError && !product && (
        <SeoHead title={`Producto no encontrado — ${SITE_NAME}`} noindex />
      )}
      <div className="mb-6">
        <BackLink />
      </div>

      {isPending && <DetailSkeleton />}

      {isError && (
        <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
          <p className="text-ink">No pudimos cargar el producto.</p>
          <Button variant="secondary" onClick={() => refetch()}>
            <RefreshCw size={20} aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      )}

      {!isPending && !isError && !product && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <SearchX size={24} aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-bold text-ink">Producto no encontrado</h1>
          <p className="max-w-[45ch] text-muted">
            El producto que buscas no existe o ya no está disponible.
          </p>
          <BackLink />
        </div>
      )}

      {!isPending && !isError && product && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
              <img
                src={product.imageUrl}
                alt={product.altText}
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-4 md:pt-2">
              <p className="text-sm font-medium text-muted">
                {CATEGORY_LABELS[product.category]}
              </p>
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-ink">{product.name}</h1>
                {product.botanicalName && (
                  <p className="italic text-muted">{product.botanicalName}</p>
                )}
              </div>

              <div className="flex items-baseline gap-3">
                <p className="text-2xl font-bold text-ink">{formatPrice(product.price)}</p>
                {product.inStock ? (
                  <span className="flex items-center gap-1 text-sm font-medium text-success">
                    <CircleCheck size={16} aria-hidden="true" />
                    Disponible
                  </span>
                ) : (
                  <span className="text-sm font-medium text-muted">Agotado</span>
                )}
              </div>

              {product.description && (
                <p className="max-w-[65ch] leading-relaxed text-ink">{product.description}</p>
              )}

              {(product.light || product.water) && (
                <div className="mt-2 flex flex-col gap-3 border-t border-line pt-4">
                  <h2 className="text-sm font-semibold text-ink">Cuidados</h2>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {product.light && LightIcon && (
                      <li className="flex items-center gap-2 text-sm text-muted">
                        <LightIcon size={16} aria-hidden="true" />
                        {LIGHT_LABELS[product.light]}
                      </li>
                    )}
                    {product.water && (
                      <li className="flex items-center gap-2 text-sm text-muted">
                        <Droplets size={16} aria-hidden="true" />
                        {WATER_LABELS[product.water]}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="mb-6 text-2xl font-semibold text-ink">
                Más en {CATEGORY_LABELS[product.category].toLowerCase()}
              </h2>
              <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                {related.map(p => (
                  <li key={p.id}>
                    <ProductCard product={p} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </section>
  )
}