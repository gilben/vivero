import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  /** Trailing element inside the field (e.g. password visibility toggle). */
  rightSlot?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, rightSlot, id, className, ...props }, ref) => {
    const autoId = useId()
    const inputId = id ?? autoId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            aria-invalid={error ? true : undefined}
            aria-describedby={cn(error && errorId, !error && hint && hintId) || undefined}
            className={cn(
              'h-10 w-full rounded-[var(--radius-md)] border bg-surface px-3 text-ink placeholder:text-muted',
              'transition-[border-color,box-shadow] duration-150 ease-out',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
              error ? 'border-error' : 'border-line',
              rightSlot && 'pr-11',
              className
            )}
            {...props}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-1.5">{rightSlot}</div>
          )}
        </div>
        {hint && !error && (
          <p id={hintId} className="text-sm text-muted">{hint}</p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'
export default Input