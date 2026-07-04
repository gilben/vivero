import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Drawer } from 'vaul'
import { Leaf, Menu, Moon, Sun, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { useTheme } from '@/providers/ThemeProvider'
import ChatWidget from '@/features/chat/components/ChatWidget'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo', end: false },
]

function BrandMark() {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 rounded-[var(--radius-sm)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Leaf size={16} aria-hidden="true" />
      </span>
      <span className="font-bold text-ink">pj6 vivero</span>
    </Link>
  )
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Activar tema claro' : 'Activar tema oscuro'}
      className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted transition-colors duration-150 ease-out hover:bg-primary/10 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
    </button>
  )
}

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-[var(--radius-sm)] text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    isActive ? 'text-primary' : 'text-muted hover:text-ink'
  )
}

function MobileMenu() {
  const [open, setOpen] = useState(false)
  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button
          type="button"
          aria-label="Abrir menú"
          className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-ink transition-colors duration-150 ease-out hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden"
        >
          <Menu size={20} aria-hidden="true" />
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-30 bg-black/40" />
        <Drawer.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-40 flex w-72 flex-col gap-6 border-l border-line bg-surface p-6"
        >
          <div className="flex items-center justify-between">
            <Drawer.Title className="font-semibold text-ink">Menú</Drawer.Title>
            <Drawer.Close asChild>
              <button
                type="button"
                aria-label="Cerrar menú"
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-muted transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </Drawer.Close>
          </div>
          <nav aria-label="Menú móvil" className="flex flex-col gap-4">
            {NAV_ITEMS.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={navLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-[var(--radius-md)] focus:bg-surface focus:px-4 focus:py-2 focus:text-ink focus:ring-2 focus:ring-primary"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          <BrandMark />
          <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MobileMenu />
          </div>
        </div>
      </header>

      <main id="contenido" className="flex-1">
        <Outlet />
      </main>

      <ChatWidget />

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
          <div className="flex flex-col gap-3">
            <BrandMark />
            <p className="max-w-[40ch] text-sm text-muted">
              Catálogo de plantas, árboles, gramas, flores y materos. Todo lo
              relacionado con jardinería y vivero.
            </p>
          </div>
          <nav aria-label="Explora" className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Explora</h2>
            {NAV_ITEMS.map(item => (
              <Link
                key={item.to}
                to={item.to}
                className="w-fit rounded-[var(--radius-sm)] text-sm text-muted transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-ink">Cuenta</h2>
            <Link
              to="/admin/login"
              className="w-fit rounded-[var(--radius-sm)] text-sm text-muted transition-colors duration-150 ease-out hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Acceso administradores
            </Link>
          </div>
        </div>
        <div className="border-t border-line">
          <p className="mx-auto max-w-7xl px-4 py-4 text-sm text-muted md:px-6">
            © {new Date().getFullYear()} pj6 vivero. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}