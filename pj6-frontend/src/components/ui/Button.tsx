import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-[var(--radius-lg)] font-medium select-none transition-[color,background-color,border-color,opacity,transform] duration-150 ease-out active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
  {
    variants: {
      variant: {
        primary:   'bg-primary text-on-primary hover:bg-accent',
        secondary: 'border border-line bg-surface text-ink hover:border-primary hover:text-primary',
        ghost:     'text-ink hover:bg-primary/10',
        danger:    'bg-error text-on-primary hover:bg-[var(--error-strong)]',
      },
      size: { sm: 'h-8 px-3 text-sm', md: 'h-10 px-4', lg: 'h-12 px-6 text-base' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, isLoading, children, disabled, className, ...props }, ref) => (
    <button ref={ref} disabled={disabled || isLoading} aria-busy={isLoading || undefined}
      className={cn(buttonVariants({ variant, size }), className)} {...props}>
      {isLoading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
)
Button.displayName = 'Button'
export default Button