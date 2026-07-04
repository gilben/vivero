import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, MailCheck } from 'lucide-react'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas'
import { useForgotPassword } from '../hooks/useForgotPassword'

// Mensaje neutro exigido por la historia: no revela si el correo existe
const NEUTRAL_SUCCESS_MESSAGE =
  'Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.'

export default function ForgotPasswordForm() {
  const forgotPassword = useForgotPassword()
  const reduceMotion = useReducedMotion()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
  })

  const onSubmit = handleSubmit(values => {
    if (forgotPassword.isPending) return
    forgotPassword.mutate(values, {
      onError: () =>
        toast.error('No pudimos conectar con el servidor. Intenta de nuevo en unos minutos.'),
    })
  })

  return (
    <motion.section
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
      aria-labelledby="forgot-title"
      className="rounded-[var(--radius-lg)] border border-line bg-surface p-8 shadow-[var(--shadow-md)]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {forgotPassword.isSuccess ? (
          <motion.div
            key="sent"
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <MailCheck size={24} aria-hidden="true" />
            </span>
            <h1 id="forgot-title" className="text-2xl font-bold text-ink">Revisa tu correo</h1>
            <p className="text-sm text-muted">{NEUTRAL_SUCCESS_MESSAGE}</p>
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium text-primary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Volver a iniciar sesión
            </Link>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="mb-6 flex flex-col items-center gap-2 text-center">
              <h1 id="forgot-title" className="text-2xl font-bold text-ink">
                Recuperar contraseña
              </h1>
              <p className="text-sm text-muted">
                Ingresa tu correo y te enviaremos un enlace de recuperación.
              </p>
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
              <Button
                type="submit"
                size="lg"
                className="w-full"
                isLoading={forgotPassword.isPending}
                disabled={!isValid || forgotPassword.isPending}
              >
                {forgotPassword.isPending ? 'Enviando…' : 'Enviar enlace'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-[var(--radius-sm)] text-sm font-medium text-primary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <ArrowLeft size={16} aria-hidden="true" />
                Volver a iniciar sesión
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}