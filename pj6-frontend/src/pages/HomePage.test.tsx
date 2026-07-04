import { render, screen, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import { fetchProducts } from '@/features/catalogo/api'
import type { ProductDto } from '@/types/api'

vi.mock('@/features/catalogo/api', () => ({
  fetchProducts: vi.fn(),
  fetchProductById: vi.fn(),
}))

const mockedFetch = vi.mocked(fetchProducts)

const PRODUCTS: ProductDto[] = [
  {
    id: 'p-1', name: 'Monstera', botanicalName: 'Monstera deliciosa',
    category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
    altText: 'Planta de Monstera', light: 'media-sombra', water: 'medio', inStock: true,
  },
  {
    id: 'a-1', name: 'Limonero', botanicalName: 'Citrus × limon',
    category: 'arboles', price: 95000, imageUrl: 'https://example.com/limonero.jpg',
    altText: 'Limonero joven', light: 'sol', water: 'alto', inStock: false,
  },
  {
    id: 'm-1', name: 'Matero de barro', category: 'materos', price: 28000,
    imageUrl: 'https://example.com/matero.jpg', altText: 'Matero de barro', inStock: true,
  },
]

function renderHome() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/']}>
        <HomePage />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HomePage', () => {
  it('renderiza el hero con titular, subtexto, CTA e imagen', () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderHome()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tu jardín empieza aquí' })
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver catálogo/ })).toHaveAttribute('href', '/catalogo')
    expect(
      screen.getByRole('img', { name: 'Interior del vivero con plantas en exhibición' })
    ).toBeInTheDocument()
  })

  it('los tiles de categoría enlazan al catálogo ya filtrado', () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderHome()

    expect(screen.getByRole('link', { name: 'Flores' })).toHaveAttribute(
      'href',
      '/catalogo?categoria=flores'
    )
    expect(screen.getByRole('link', { name: 'Materos' })).toHaveAttribute(
      'href',
      '/catalogo?categoria=materos'
    )
  })

  it('muestra skeletons en destacados mientras cargan los productos', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}))
    renderHome()
    expect(screen.getByRole('status', { name: 'Cargando destacados' })).toBeInTheDocument()
  })

  it('muestra como destacados solo productos disponibles', async () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderHome()

    expect(await screen.findByText('Monstera')).toBeInTheDocument()
    expect(screen.getByText('Matero de barro')).toBeInTheDocument()
    // el limonero está agotado: no aparece en destacados
    expect(screen.queryByText('Limonero')).not.toBeInTheDocument()
  })

  it('oculta la sección de destacados si la carga falla', async () => {
    mockedFetch.mockRejectedValue(new Error('Network Error'))
    renderHome()

    // el hero sigue visible; la sección de destacados desaparece sin error ruidoso
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tu jardín empieza aquí' })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(
        screen.queryByRole('heading', { name: 'Destacados del vivero' })
      ).not.toBeInTheDocument()
    )
  })
})