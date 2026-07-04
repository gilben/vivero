import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { logger } from '@/utils/logger'
import type { LoginRequestDto, LoginResponseDto } from '@/types/api'
import { isAuthMockEnabled, loginRequest, mockLogin } from '../api'

export function useLogin() {
  const setAuth = useAuthStore(s => s.setAuth)

  return useMutation<LoginResponseDto, unknown, LoginRequestDto>({
    // El mock vive SOLO aquí: conectar el backend real es un cambio de flag
    mutationFn: data => (isAuthMockEnabled() ? mockLogin(data) : loginRequest(data)),
    onSuccess: data => {
      setAuth(data.accessToken, data.expiresAt, data.user)
      logger.info('Sesión iniciada')
    },
  })
}