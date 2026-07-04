import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import { Sprout } from 'lucide-react'
import { cn } from '@/utils/cn'
import { formatPrice } from '@/features/catalogo/components/ProductCard'
import type { ProductDto } from '@/types/api'
import type { ChatMessage } from '../types'
import QuoteCard from './QuoteCard'

interface ChatMessagesProps {
  messages: ChatMessage[]
  isTyping: boolean
  /** Cierra el panel al navegar a un producto recomendado. */
  onNavigate: () => void
}

function ProductSuggestion({ product, onNavigate }: { product: ProductDto; onNavigate: () => void }) {
  return (
    <Link
      to={`/catalogo/${product.id}`}
      onClick={onNavigate}
      className="flex items-center gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-2 transition-colors duration-150 ease-out hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <img
        src={product.imageUrl}
        alt={product.altText}
        loading="lazy"
        className="h-12 w-12 shrink-0 rounded-[var(--radius-sm)] object-cover"
      />
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium text-ink">{product.name}</span>
        <span className="text-sm text-muted">{formatPrice(product.price)}</span>
      </span>
    </Link>
  )
}

function TypingIndicator() {
  return (
    <div
      role="status"
      aria-label="El asistente está escribiendo"
      className="flex w-fit items-center gap-1 rounded-[var(--radius-md)] bg-primary/5 px-3 py-2"
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-muted"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export default function ChatMessages({ messages, isTyping, onNavigate }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const el = containerRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages.length, isTyping])

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
      {messages.length === 0 && (
        <div className="flex flex-col items-center gap-3 px-4 py-8 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sprout size={20} aria-hidden="true" />
          </span>
          <p className="text-sm text-muted">
            Cuéntame qué buscas y te recomiendo productos del catálogo. Por
            ejemplo: "plantas para sombra" o "materos de barro".
          </p>
        </div>
      )}

      {messages.map(message => (
        <motion.div
          key={message.id}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className={cn('flex flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}
        >
          <p
            className={cn(
              'max-w-[85%] rounded-[var(--radius-md)] px-3 py-2 text-sm leading-relaxed',
              message.role === 'user' ? 'bg-primary text-on-primary' : 'bg-primary/5 text-ink'
            )}
          >
            {message.text}
          </p>
          {message.products && message.products.length > 0 && (
            <ul className="flex w-full max-w-[85%] flex-col gap-2" aria-label="Productos recomendados">
              {message.products.map(product => (
                <li key={product.id}>
                  <ProductSuggestion product={product} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          )}
          {message.quote && <QuoteCard quote={message.quote} />}
        </motion.div>
      ))}

      {isTyping && <TypingIndicator />}
    </div>
  )
}