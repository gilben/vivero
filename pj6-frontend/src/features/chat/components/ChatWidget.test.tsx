import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ChatWidget from './ChatWidget'
import { sendChatTurn } from '../api'
import { useChatStore } from '../store/chatStore'
import type { ChatResponseDto } from '@/types/api'

vi.mock('../api', () => ({
  sendChatTurn: vi.fn(),
  sendQuoteRequest: vi.fn(),
  QUOTE_EMAIL: 'ventas@pj6vivero.com',
  PROMPT_MAX_LENGTH: 500,
}))
// el hook obtiene el inventario de la capa de datos del catálogo
vi.mock('@/features/catalogo/api', () => ({
  fetchProducts: vi.fn(async () => []),
}))

const mockedSend = vi.mocked(sendChatTurn)

const RESPONSE: ChatResponseDto = {
  reply: 'Encontré esta opción en nuestro catálogo:',
  intent: 'buscar-productos',
  products: [
    {
      id: 'p-1', name: 'Monstera', botanicalName: 'Monstera deliciosa',
      category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
      altText: 'Planta de Monstera', light: 'media-sombra', water: 'medio', inStock: true,
    },
  ],
}

function renderWidget() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <ChatWidget />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

async function openChat() {
  const user = userEvent.setup()
  await user.click(screen.getByRole('button', { name: 'Abrir asistente del vivero' }))
  await screen.findByRole('dialog')
  return user
}

beforeEach(() => {
  vi.clearAllMocks()
  useChatStore.setState({ messages: [] })
})

describe('ChatWidget', () => {
  it('abre el panel desde el botón flotante y muestra el estado inicial', async () => {
    renderWidget()
    await openChat()

    expect(screen.getByText('Asistente del vivero')).toBeInTheDocument()
    expect(screen.getByText(/Cuéntame qué buscas/)).toBeInTheDocument()
    expect(screen.getByLabelText('Escribe tu mensaje')).toBeInTheDocument()
  })

  it('no permite enviar mensajes vacíos y limita la longitud del prompt', async () => {
    renderWidget()
    await openChat()

    expect(screen.getByRole('button', { name: 'Enviar mensaje' })).toBeDisabled()
    expect(screen.getByLabelText('Escribe tu mensaje')).toHaveAttribute('maxlength', '500')
  })

  it('muestra el mensaje del usuario, el indicador de escritura y la respuesta híbrida', async () => {
    let resolveSend!: (value: ChatResponseDto) => void
    mockedSend.mockReturnValue(new Promise(resolve => { resolveSend = resolve }))

    renderWidget()
    const user = await openChat()

    await user.type(screen.getByLabelText('Escribe tu mensaje'), 'busco una monstera')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    // procesando: burbuja del usuario + indicador de escritura
    expect(screen.getByText('busco una monstera')).toBeInTheDocument()
    expect(
      await screen.findByRole('status', { name: 'El asistente está escribiendo' })
    ).toBeInTheDocument()
    // recibe historial + inventario provisto por la capa de datos del catálogo
    expect(mockedSend.mock.calls[0][0]).toEqual({
      history: [],
      message: 'busco una monstera',
      catalog: [],
    })

    resolveSend(RESPONSE)

    // respuesta híbrida: texto + producto recomendado enlazado al detalle
    expect(await screen.findByText('Encontré esta opción en nuestro catálogo:')).toBeInTheDocument()
    const productLink = screen.getByRole('link', { name: /Monstera/ })
    expect(productLink).toHaveAttribute('href', '/catalogo/p-1')
    expect(
      screen.queryByRole('status', { name: 'El asistente está escribiendo' })
    ).not.toBeInTheDocument()
  })

  it('ante un error del asistente muestra un mensaje explicativo en el hilo', async () => {
    mockedSend.mockRejectedValue(new Error('Network Error'))

    renderWidget()
    const user = await openChat()

    await user.type(screen.getByLabelText('Escribe tu mensaje'), 'busco flores')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))

    expect(
      await screen.findByText('No pudimos procesar tu solicitud. Intenta de nuevo en unos minutos.')
    ).toBeInTheDocument()
  })

  it('la conversación persiste al cerrar y reabrir el panel', async () => {
    mockedSend.mockResolvedValue(RESPONSE)

    renderWidget()
    const user = await openChat()

    await user.type(screen.getByLabelText('Escribe tu mensaje'), 'busco una monstera')
    await user.click(screen.getByRole('button', { name: 'Enviar mensaje' }))
    await screen.findByText('Encontré esta opción en nuestro catálogo:')

    await user.click(screen.getByRole('button', { name: 'Cerrar asistente' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: 'Abrir asistente del vivero' }))
    expect(await screen.findByText('busco una monstera')).toBeInTheDocument()
  })
})