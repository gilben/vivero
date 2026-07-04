import apiClient from '@/services/apiClient'
import type {
  ForgotPasswordRequestDto,
  ForgotPasswordResponseDto,
  LoginRequestDto,
  LoginResponseDto,
  UserDto,
} from '@/types/api'

/** Credenciales aceptadas mientras VITE_AUTH_MOCK=true (backend no disponible). */
export const MOCK_CREDENTIALS = { email: 'admin@pj6.com', password: 'Admin123!' }

export const MOCK_USER: UserDto = {
  id: 'mock-user-1',
  name: 'Admin Vivero',
  email: MOCK_CREDENTIALS.email,
  role: 'admin',
}

// Latencia simulada para que los estados de carga sean visibles en desarrollo
const MOCK_LATENCY_MS = 700

export class UnauthorizedError extends Error {
  readonly status = 401
  constructor() {
    super('Correo electrónico o contraseña incorrectos.')
    this.name = 'UnauthorizedError'
  }
}

export function isAuthMockEnabled(): boolean {
  return import.meta.env.VITE_AUTH_MOCK === 'true'
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof UnauthorizedError) return true
  if (typeof error === 'object' && error !== null && 'response' in error) {
    return (error as { response?: { status?: number } }).response?.status === 401
  }
  return false
}

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

export async function loginRequest(data: LoginRequestDto): Promise<LoginResponseDto> {
  const res = await apiClient.post<LoginResponseDto>('/auth/login', data)
  return res.data
}

export async function forgotPasswordRequest(
  data: ForgotPasswordRequestDto
): Promise<ForgotPasswordResponseDto> {
  const res = await apiClient.post<ForgotPasswordResponseDto>('/auth/forgot-password', data)
  return res.data
}

export async function mockLogin(data: LoginRequestDto): Promise<LoginResponseDto> {
  await delay(MOCK_LATENCY_MS)
  const isValid =
    data.email === MOCK_CREDENTIALS.email && data.password === MOCK_CREDENTIALS.password
  if (!isValid) throw new UnauthorizedError()
  return {
    accessToken: 'mock-jwt-token',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    user: MOCK_USER,
  }
}

export async function mockForgotPassword(
  _data: ForgotPasswordRequestDto
): Promise<ForgotPasswordResponseDto> {
  await delay(MOCK_LATENCY_MS)
  // Respuesta neutra siempre: nunca revela si el correo existe
  return { message: 'ok' }
}