import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from './LoginForm'
import apiClient from '@/services/apiClient'
import { useAuthStore } from '@/store/authStore'
import { MOCK_CREDENTIALS } from '../api'

vi.mock('@/services/apiClient', () => ({ default: { post: vi.fn() } }))
vi.mock('sonner', () => ({ toast: { error: vi.fn() } }))

const mockedPost = vi.mocked(apiClient.post)

function renderLoginForm() {
  // retry: false — los reintentos hacen colgar los tests de fallo
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/admin/login']}>
        <LoginForm />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

async function fillValidCredentials(email = MOCK_CREDENTIALS.email, password = MOCK_CREDENTIALS.password) {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Correo electrónico'), email)
  await user.type(screen.getByLabelText('Contraseña'), password)
  return user
}

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()
  useAuthStore.getState().clearAuth()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('LoginForm', () => {
  it('renderiza correo, contraseña, botón y enlace de recuperación', () => {
    renderLoginForm()
    expect(screen.getByLabelText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeDisabled()
    expect(screen.getByRole('link', { name: '¿Olvidaste tu contraseña?' })).toBeInTheDocument()
  })

  it('valida el formato del correo en tiempo real y habilita el botón solo con formulario válido', async () => {
    renderLoginForm()
    const user = userEvent.setup()
    const email = screen.getByLabelText('Correo electrónico')

    await user.type(email, 'no-valido')
    await user.type(screen.getByLabelText('Contraseña'), 'secreta1')
    expect(await screen.findByText('Ingresa un correo válido (usuario@dominio.com)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeDisabled()

    await user.clear(email)
    await user.type(email, 'ana@vivero.com')
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Iniciar sesión' })).toBeEnabled()
    )
  })

  it('permite alternar mostrar/ocultar la contraseña', async () => {
    renderLoginForm()
    const user = userEvent.setup()
    const password = screen.getByLabelText('Contraseña')

    expect(password).toHaveAttribute('type', 'password')
    await user.click(screen.getByRole('button', { name: 'Mostrar contraseña' }))
    expect(password).toHaveAttribute('type', 'text')
    await user.click(screen.getByRole('button', { name: 'Ocultar contraseña' }))
    expect(password).toHaveAttribute('type', 'password')
  })

  it('muestra estado de carga y evita envíos múltiples mientras la petición está en curso', async () => {
    let resolvePost!: (value: unknown) => void
    mockedPost.mockReturnValue(new Promise(resolve => { resolvePost = resolve }) as never)

    renderLoginForm()
    const user = await fillValidCredentials('ana@vivero.com', 'secreta1')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    const button = await screen.findByRole('button', { name: 'Iniciando sesión…' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(mockedPost).toHaveBeenCalledTimes(1)

    resolvePost({
      data: {
        accessToken: 'jwt',
        expiresAt: new Date().toISOString(),
        user: { id: '1', name: 'Ana', email: 'ana@vivero.com', role: 'admin' },
      },
    })
    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(true))
  })

  it('muestra el error inline exacto cuando las credenciales son inválidas (401)', async () => {
    mockedPost.mockRejectedValue({ response: { status: 401 } })

    renderLoginForm()
    const user = await fillValidCredentials('ana@vivero.com', 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Correo electrónico o contraseña incorrectos.')
    expect(useAuthStore.getState().isAuthenticated).toBe(false)
  })

  it('notifica con toast los errores de red o inesperados', async () => {
    const { toast } = await import('sonner')
    mockedPost.mockRejectedValue(new Error('Network Error'))

    renderLoginForm()
    const user = await fillValidCredentials('ana@vivero.com', 'secreta1')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    await waitFor(() => expect(toast.error).toHaveBeenCalled())
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('simula el flujo completo de login con VITE_AUTH_MOCK=true sin tocar la API', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')

    renderLoginForm()
    const user = await fillValidCredentials()
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    // latencia simulada ~700ms
    await waitFor(() => expect(useAuthStore.getState().isAuthenticated).toBe(true), {
      timeout: 3000,
    })
    expect(useAuthStore.getState().user?.email).toBe(MOCK_CREDENTIALS.email)
    expect(mockedPost).not.toHaveBeenCalled()
  })

  it('con mock activo, credenciales incorrectas muestran el error inline', async () => {
    vi.stubEnv('VITE_AUTH_MOCK', 'true')

    renderLoginForm()
    const user = await fillValidCredentials('otra@persona.com', 'ClaveMala1!')
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }))

    const alert = await screen.findByRole('alert', undefined, { timeout: 3000 })
    expect(alert).toHaveTextContent('Correo electrónico o contraseña incorrectos.')
    expect(mockedPost).not.toHaveBeenCalled()
  })
})