import type { ProductCategory } from '@/types/api'
import { cn } from '@/utils/cn'
import { CATEGORY_LABELS } from '../constants'

export type CategoryFilter = ProductCategory | 'todos'

const CATEGORIES: { value: CategoryFilter; label: string }[] = [
  { value: 'todos', label: 'Todos' },
  ...(Object.entries(CATEGORY_LABELS) as [ProductCategory, string][]).map(
    ([value, label]) => ({ value, label })
  ),
]

interface CategoryChipsProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}

export default function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <div
      role="group"
      aria-label="Filtrar por categoría"
      className="flex snap-x gap-2 overflow-x-auto pb-2"
    >
      {CATEGORIES.map(category => {
        const isActive = category.value === value
        return (
          <button
            key={category.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(category.value)}
            className={cn(
              'shrink-0 snap-start rounded-[var(--radius-full)] border px-4 py-1.5 text-sm font-medium',
              'transition-colors duration-150 ease-out active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
              isActive
                ? 'border-primary bg-primary text-on-primary'
                : 'border-line bg-surface text-muted hover:border-primary/40 hover:text-ink'
            )}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}