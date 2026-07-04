import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './PublicLayout'
import { ThemeProvider } from '@/providers/ThemeProvider'

function renderLayout() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route index element={<div>contenido de prueba</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
  delete document.documentElement.dataset.theme
})

describe('PublicLayout', () => {
  it('renderiza navbar con marca, navegación, contenido y footer', () => {
    renderLayout()
    expect(screen.getAllByRole('link', { name: /pj6 vivero/i }).length).toBeGreaterThan(0)
    expect(screen.getByRole('navigation', { name: 'Principal' })).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Catálogo' }).length).toBeGreaterThan(0)
    expect(screen.getByText('contenido de prueba')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toHaveTextContent('pj6 vivero')
    expect(screen.getByRole('link', { name: 'Acceso administradores' })).toBeInTheDocument()
  })

  it('alterna el tema claro/oscuro y lo persiste', async () => {
    renderLayout()
    const user = userEvent.setup()

    expect(document.documentElement.dataset.theme).toBe('light')
    await user.click(screen.getByRole('button', { name: 'Activar tema oscuro' }))
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')

    await user.click(screen.getByRole('button', { name: 'Activar tema claro' }))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('abre el menú móvil como drawer con la navegación', async () => {
    renderLayout()
    const user = userEvent.setup()

    // capturar el trigger ANTES de abrir: Radix marca el resto con aria-hidden
    const trigger = screen.getByRole('button', { name: 'Abrir menú' })
    await user.click(trigger)

    const dialog = await screen.findByRole('dialog')
    expect(dialog).toHaveTextContent('Menú')
    expect(screen.getByRole('navigation', { name: 'Menú móvil' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar menú' })).toBeInTheDocument()
  })

  it('incluye un enlace para saltar al contenido principal', () => {
    renderLayout()
    const skipLink = screen.getByRole('link', { name: 'Saltar al contenido' })
    expect(skipLink).toHaveAttribute('href', '#contenido')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'contenido')
  })
})