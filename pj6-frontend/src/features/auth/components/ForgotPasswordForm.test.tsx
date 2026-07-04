import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import ForgotPasswordForm from './ForgotPasswordForm'
import apiClient from '@/services/apiClient'

vi.mock('@/services/apiClient', () => ({ default: { post: vi.fn() } }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

const mockedPost = vi.mocked(apiClient.post)

const NEUTRAL_MESSAGE =
  'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.'

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin/forgot-password']}>
        <ForgotPasswordForm />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('ForgotPasswordForm', () => {
  it('renderiza el campo de correo, el botón y el enlace de regreso', () => {
    renderForm()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar enlace' })).toBeDisabled()
    expect(screen.getByRole('link', { name: 'Volver a iniciar sesión' })).toBeInTheDocument()
  })

  it('valida el correo en tiempo real', async () => {
    renderForm()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Correo electrónico'), 'sin-arroba')
    expect(await screen.findByText('Ingresa un correo válido (usuario@dominio.com)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar enlace' })).toBeDisabled()
  })

  it('muestra estado de carga durante el envío', async () => {
    let resolvePost!: (value: unknown) => void
    mockedPost.mockReturnValue(new Promise(resolve => { resolvePost = resolve }) as never)

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@vivero.com')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    const button = await screen.findByRole('button', { name: 'Enviando…' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    resolvePost({ data: { message: 'ok' } })
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument())
  })

  it('tras el envío exitoso muestra solo el mensaje neutro (sin revelar si el correo existe)', async () => {
    mockedPost.mockResolvedValue({ data: { message: 'ok' } } as never)

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'cualquiera@dominio.com')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(NEUTRAL_MESSAGE)
    expect(screen.queryByLabelText('Correo electrónico')).not.toBeInTheDocument()
  })

  it('notifica con toast los errores de red', async () => {
    const { toast } = await import('sonner')
    mockedPost.mockRejectedValue(new Error('Network Error'))

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@vivero.com')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    // el formulario sigue visible: el usuario puede reintentar
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
  })

  it('con VITE_AUTH_MOCK=true resuelve el flujo sin tocar la API', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')

    renderForm()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Correo electrónico'), 'ana@vivero.com')
    await user.click(screen.getByRole('button', { name: 'Enviar enlace' }))

    const status = await screen.findByRole('status', undefined, { timeout: 3000 })
    expect(status).toHaveTextContent(NEUTRAL_MESSAGE)
    expect(mockedPost).not.toHaveBeenCalled()
  })
})