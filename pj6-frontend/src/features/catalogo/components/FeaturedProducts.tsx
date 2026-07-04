import { motion, useReducedMotion } from 'motion/react'
import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

const FEATURED_COUNT = 4

export default function FeaturedProducts() {
  const { data, isPending, isError } = useProducts()
  const reduceMotion = useReducedMotion()

  // en el home no hay flujo de reintento: si falla, la sección simplemente no aparece
  if (isError) return null

  const featured = (data ?? []).filter(p => p.inStock).slice(0, FEATURED_COUNT)

  return (
    <section aria-labelledby="destacados-title" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h2 id="destacados-title" className="mb-6 text-2xl font-semibold text-ink">
        Destacados del vivero
      </h2>

      {isPending ? (
        <div
          role="status"
          aria-label="Cargando destacados"
          className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4"
        >
          {Array.from({ length: FEATURED_COUNT }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {featured.map((product, i) => (
            <motion.li
              key={product.id}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
            >
              <ProductCard product={product} />
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}