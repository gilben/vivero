import { useMutation } from '@tanstack/react-query'
import { CircleCheck, FileText, Mail, Phone, Send, User } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import { logger } from '@/utils/logger'
import type { QuoteRequestDto } from '@/types/api'
import { QUOTE_EMAIL, sendQuoteRequest } from '../api'

interface QuoteCardProps {
  quote: QuoteRequestDto
}

function buildMailtoHref(quote: QuoteRequestDto): string {
  const subject = encodeURIComponent('Solicitud de cotización — pj6 vivero')
  const body = encodeURIComponent(
    `Nombre: ${quote.name}\nCorreo: ${quote.email}\nTeléfono: ${quote.phone}\n\nProductos:\n${quote.detail}`
  )
  return `mailto:${QUOTE_EMAIL}?subject=${subject}&body=${body}`
}

/** Resumen de la cotización recopilada por el asistente, con confirmación de envío. */
export default function QuoteCard({ quote }: QuoteCardProps) {
  const sendQuote = useMutation({
    mutationFn: sendQuoteRequest,
    onSuccess: () =>
      toast.success('Tu solicitud de cotización fue enviada. Te contactaremos pronto.'),
    onError: error => {
      logger.error('Chat: error enviando la cotización', error)
      toast.error('No pudimos enviar la solicitud. Intenta de nuevo en unos minutos.')
    },
  })

  const rows = [
    { Icon: User, label: 'Nombre', value: quote.name },
    { Icon: Mail, label: 'Correo', value: quote.email },
    { Icon: Phone, label: 'Teléfono', value: quote.phone },
    { Icon: FileText, label: 'Productos', value: quote.detail },
  ]

  return (
    <section
      aria-label="Resumen de la cotización"
      className="flex w-full max-w-[85%] flex-col gap-3 rounded-[var(--radius-md)] border border-line bg-surface p-3"
    >
      <h3 className="text-sm font-semibold text-ink">Solicitud de cotización</h3>
      <ul className="flex flex-col gap-2">
        {rows.map(({ Icon, label, value }) => (
          <li key={label} className="flex items-start gap-2 text-sm">
            <Icon size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-muted" />
            <span className="text-muted">
              <span className="font-medium text-ink">{label}: </span>
              {value}
            </span>
          </li>
        ))}
      </ul>

      {sendQuote.isSuccess ? (
        <p role="status" className="flex items-center gap-2 text-sm font-medium text-success">
          <CircleCheck size={16} aria-hidden="true" />
          Solicitud enviada
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            className="w-full"
            isLoading={sendQuote.isPending}
            disabled={sendQuote.isPending}
            onClick={() => sendQuote.mutate(quote)}
          >
            <Send size={16} aria-hidden="true" />
            Enviar solicitud
          </Button>
          <a
            href={buildMailtoHref(quote)}
            className="rounded-[var(--radius-sm)] text-center text-xs text-muted underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            o envíala desde tu correo
          </a>
        </div>
      )}
    </section>
  )
}