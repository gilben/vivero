import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/utils/cn'
import CategoryTiles from '@/features/catalogo/components/CategoryTiles'
import FeaturedProducts from '@/features/catalogo/components/FeaturedProducts'
import SeoHead from '@/features/seo/components/SeoHead'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '@/features/seo/constants'

function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:grid-cols-2 md:px-6 md:py-24">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className="flex flex-col items-start gap-5"
      >
        <h1 className="text-4xl font-bold tracking-tight text-ink [text-wrap:balance] md:text-5xl">
          Tu jardín empieza aquí
        </h1>
        <p className="max-w-[50ch] text-lg leading-relaxed text-muted">
          Plantas, árboles, gramas, flores y materos de nuestro vivero, listos
          para tu casa o jardín.
        </p>
        <Link to="/catalogo" className={cn(buttonVariants({ size: 'lg' }))}>
          Ver catálogo
          <ArrowRight size={20} aria-hidden="true" />
        </Link>
      </motion.div>

      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
          <img
            src="https://picsum.photos/seed/vivero-invernadero/1200/900"
            alt="Interior del vivero con plantas en exhibición"
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <SeoHead title={DEFAULT_TITLE} description={DEFAULT_DESCRIPTION} />
      <Hero />
      <CategoryTiles />
      <FeaturedProducts />
    </>
  )
}