import { Link } from 'react-router-dom'
import type { ProductCategory } from '@/types/api'
import { CATEGORY_LABELS } from '../constants'

const TILE_IMAGES: Record<ProductCategory, string> = {
  plantas: 'https://picsum.photos/seed/plantas-interior/400/300',
  arboles: 'https://picsum.photos/seed/arboles-vivero/400/300',
  gramas: 'https://picsum.photos/seed/grama-verde/400/300',
  flores: 'https://picsum.photos/seed/flores-colores/400/300',
  materos: 'https://picsum.photos/seed/materos-barro/400/300',
}

const TILES = Object.keys(CATEGORY_LABELS) as ProductCategory[]

export default function CategoryTiles() {
  return (
    <section aria-labelledby="categorias-title" className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <h2 id="categorias-title" className="mb-6 text-2xl font-semibold text-ink">
        Explora por categoría
      </h2>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5">
        {TILES.map(category => (
          <li key={category}>
            <Link
              to={`/catalogo?categoria=${category}`}
              className="group relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-lg)] border border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <img
                src={TILE_IMAGES[category]}
                alt=""
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
              />
              {/* scrim: garantiza contraste del rótulo sobre cualquier foto, en ambos temas */}
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-10 text-sm font-semibold text-white">
                {CATEGORY_LABELS[category]}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}