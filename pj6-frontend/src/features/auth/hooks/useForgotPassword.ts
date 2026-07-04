import { useMutation } from '@tanstack/react-query'
import type { ForgotPasswordRequestDto, ForgotPasswordResponseDto } from '@/types/api'
import { forgotPasswordRequest, isAuthMockEnabled, mockForgotPassword } from '../api'

export function useForgotPassword() {
  return useMutation<ForgotPasswordResponseDto, unknown, ForgotPasswordRequestDto>({
    // El mock vive SOLO aquí: conectar el backend real es un cambio de flag
    mutationFn: data => (isAuthMockEnabled() ? mockForgotPassword(data) : forgotPasswordRequest(data)),
  })
}