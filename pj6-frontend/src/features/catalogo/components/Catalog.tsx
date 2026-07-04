import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { RefreshCw, Sprout } from 'lucide-react'
import Button from '@/components/ui/Button'
import SeoHead from '@/features/seo/components/SeoHead'
import { SITE_NAME } from '@/features/seo/constants'
import { CATEGORY_LABELS } from '../constants'
import { useProducts } from '../hooks/useProducts'
import CategoryChips, { type CategoryFilter } from './CategoryChips'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

const SKELETON_COUNT = 8
// tope del stagger: a partir de la fila 3 las tarjetas entran juntas
const MAX_STAGGER_INDEX = 11

function isCategoryFilter(value: string | null): value is CategoryFilter {
  return value === 'todos' || (!!value && value in CATEGORY_LABELS)
}

export default function Catalog() {
  const { data, isPending, isError, refetch } = useProducts()
  const [searchParams, setSearchParams] = useSearchParams()
  const reduceMotion = useReducedMotion()

  // la categoría vive en la URL (?categoria=flores): filtrable desde el home y compartible
  const paramValue = searchParams.get('categoria')
  const category: CategoryFilter = isCategoryFilter(paramValue) ? paramValue : 'todos'
  const setCategory = (value: CategoryFilter) =>
    setSearchParams(value === 'todos' ? {} : { categoria: value }, { replace: true })

  const products = useMemo(
    () => (data ?? []).filter(p => category === 'todos' || p.category === category),
    [data, category]
  )

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <SeoHead
        title={
          category === 'todos'
            ? `Catálogo — ${SITE_NAME}`
            : `${CATEGORY_LABELS[category]} — ${SITE_NAME}`
        }
        description="Explora plantas, árboles, gramas, flores y materos de nuestro vivero."
      />
      <header className="mb-8 flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-ink">Catálogo</h1>
        <p className="max-w-[65ch] text-muted">
          Plantas, árboles, gramas, flores y materos de nuestro vivero.
        </p>
      </header>

      <div className="mb-6">
        <CategoryChips value={category} onChange={setCategory} />
      </div>

      {isPending && (
        <div
          role="status"
          aria-label="Cargando catálogo"
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
        >
          {Array.from({ length: SKELETON_COUNT }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center gap-4 py-16 text-center" role="alert">
          <p className="text-ink">No pudimos cargar el catálogo.</p>
          <Button variant="secondary" onClick={() => refetch()}>
            <RefreshCw size={20} aria-hidden="true" />
            Reintentar
          </Button>
        </div>
      )}

      {!isPending && !isError && products.length === 0 && (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout size={24} aria-hidden="true" />
          </span>
          <p className="text-ink">No hay productos en esta categoría todavía.</p>
        </div>
      )}

      {!isPending && !isError && products.length > 0 && (
        <>
          <p aria-live="polite" className="sr-only">
            {products.length} productos en la categoría seleccionada
          </p>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product, i) => (
              <motion.li
                key={product.id}
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(i, MAX_STAGGER_INDEX) * 0.04,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <ProductCard product={product} />
              </motion.li>
            ))}
          </ul>
        </>
      )}
    </section>
  )
}