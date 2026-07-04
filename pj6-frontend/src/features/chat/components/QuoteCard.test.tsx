import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import QuoteCard from './QuoteCard'
import { sendQuoteRequest } from '../api'
import type { QuoteRequestDto } from '@/types/api'

vi.mock('../api', () => ({
  sendQuoteRequest: vi.fn(),
  QUOTE_EMAIL: 'ventas@pj6vivero.com',
}))
vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }))

const mockedSend = vi.mocked(sendQuoteRequest)

const QUOTE: QuoteRequestDto = {
  name: 'Ana Pérez',
  email: 'ana@correo.com',
  phone: '3001234567',
  detail: '10 materos de barro',
}

function renderCard() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <QuoteCard quote={QUOTE} />
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('QuoteCard', () => {
  it('muestra el resumen con los datos recopilados', () => {
    renderCard()
    expect(screen.getByText('Solicitud de cotización')).toBeInTheDocument()
    expect(screen.getByText(/Ana Pérez/)).toBeInTheDocument()
    expect(screen.getByText(/ana@correo.com/)).toBeInTheDocument()
    expect(screen.getByText(/3001234567/)).toBeInTheDocument()
    expect(screen.getByText(/10 materos de barro/)).toBeInTheDocument()
  })

  it('ofrece el fallback mailto prellenado hacia el correo de ventas', () => {
    renderCard()
    const link = screen.getByRole('link', { name: 'o envíala desde tu correo' })
    expect(link.getAttribute('href')).toContain('mailto:ventas@pj6vivero.com')
    expect(link.getAttribute('href')).toContain(encodeURIComponent('Ana Pérez'))
  })

  it('envía la solicitud y muestra el estado de éxito', async () => {
    mockedSend.mockResolvedValue({ message: 'ok' })
    const { toast } = await import('sonner')

    renderCard()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    expect(await screen.findByRole('status')).toHaveTextContent('Solicitud enviada')
    expect(mockedSend.mock.calls[0][0]).toEqual(QUOTE)
    expect(toast.success).toHaveBeenCalled()
    // el botón desaparece: no se puede enviar dos veces
    expect(screen.queryByRole('button', { name: 'Enviar solicitud' })).not.toBeInTheDocument()
  })

  it('notifica el error sin perder la tarjeta (permite reintentar)', async () => {
    mockedSend.mockRejectedValue(new Error('Network Error'))
    const { toast } = await import('sonner')

    renderCard()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Enviar solicitud' }))

    await vi.waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(screen.getByRole('button', { name: 'Enviar solicitud' })).toBeInTheDocument()
  })
})