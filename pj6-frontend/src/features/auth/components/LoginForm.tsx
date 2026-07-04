import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { loginSchema, type LoginFormValues } from '../schemas'
import { useLogin } from '../hooks/useLogin'
import { MOCK_CREDENTIALS, isAuthMockEnabled, isUnauthorizedError } from '../api'

export default function LoginForm() {
  const navigate = useNavigate()
  const login = useLogin()
  const reduceMotion = useReducedMotion()
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: 'onChange' })

  const onSubmit = handleSubmit(values => {
    if (login.isPending) return
    setAuthError(null)
    login.mutate(values, {
      onSuccess: () => navigate('/admin', { replace: true }),
      onError: error => {
        if (isUnauthorizedError(error)) {
          setAuthError('Correo electrónico o contraseña incorrectos.')
        } else {
          toast.error('No pudimos conectar con el servidor. Intenta de nuevo en unos minutos.')
        }
      },
    })
  })

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      aria-labelledby="login-title"
      className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 shadow-[var(--shadow-md)]"
    >
      <div className="mb-6 flex flex-col items-center gap-2 text-center">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Leaf size={20} aria-hidden="true" />
        </span>
        <h1 id="login-title" className="text-2xl font-bold text-ink">Iniciar sesión</h1>
        <p className="text-sm text-muted">Accede al panel de administración del vivero.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Input
          label="Correo electrónico"
          type="email"
          autoComplete="email"
          placeholder="usuario@dominio.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
              className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] text-muted transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {showPassword ? <EyeOff size={16} aria-hidden="true" /> : <Eye size={16} aria-hidden="true" />}
            </button>
          }
          {...register('password')}
        />

        <AnimatePresence>
          {authError && (
            <motion.p
              role="alert"
              initial={reduceMotion ? false : { opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="rounded-[var(--radius-md)] border border-error/30 bg-error/10 px-3 py-2 text-sm text-error"
            >
              {authError}
            </motion.p>
          )}
        </AnimatePresence>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          isLoading={login.isPending}
          disabled={!isValid || login.isPending}
        >
          {login.isPending ? 'Iniciando sesión…' : 'Iniciar sesión'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to="/admin/forgot-password"
          className="rounded-[var(--radius-sm)] text-sm font-medium text-primary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {isAuthMockEnabled() && (
        <p className="mt-6 rounded-[var(--radius-md)] bg-info/10 px-3 py-2 text-center text-xs text-muted">
          Modo demo: {MOCK_CREDENTIALS.email} / {MOCK_CREDENTIALS.password}
        </p>
      )}
    </motion.section>
  )
}