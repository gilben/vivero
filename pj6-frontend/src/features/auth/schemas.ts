import { z } from 'zod'

// trim + lowercase = sanitización del correo antes de enviarlo al backend
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'El correo electrónico es obligatorio')
  .email('Ingresa un correo válido (usuario@dominio.com)')

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'La contraseña es obligatoria'),
})
export type LoginFormValues = z.infer<typeof loginSchema>

export const forgotPasswordSchema = z.object({
  email: emailField,
})
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>