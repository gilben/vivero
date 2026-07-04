import { Link } from 'react-router-dom'
import type { ProductDto } from '@/types/api'
import CareBadges from './CareBadges'

const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number): string {
  // Intl es-CO separa "$" y cifra con NBSP; se normaliza a espacio común
  // para que el texto renderizado y las aserciones de test coincidan
  return copFormatter.format(price).replace(/ /g, ' ')
}

interface ProductCardProps {
  product: ProductDto
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <article aria-label={product.name} className="group">
      <Link
        to={`/catalogo/${product.id}`}
        className="flex flex-col gap-3 rounded-[var(--radius-lg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <div className="aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] border border-line bg-surface">
          <img
            src={product.imageUrl}
            alt={product.altText}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-snug text-ink">{product.name}</h3>
            <CareBadges light={product.light} water={product.water} />
          </div>
          {product.botanicalName && (
            <p className="text-sm italic text-muted">{product.botanicalName}</p>
          )}
          <p className="flex items-baseline gap-2 font-medium text-ink">
            {formatPrice(product.price)}
            {!product.inStock && <span className="text-sm font-normal text-muted">Agotado</span>}
          </p>
        </div>
      </Link>
    </article>
  )
}