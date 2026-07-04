import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import Catalog from './Catalog'
import { formatPrice } from './ProductCard'
import { fetchProducts } from '../api'
import type { ProductDto } from '@/types/api'

vi.mock('../api', () => ({ fetchProducts: vi.fn() }))

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

function renderCatalog(initialEntry = '/catalogo') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Catalog />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('Catalog', () => {
  it('muestra skeletons con la forma de la grilla mientras carga', () => {
    mockedFetch.mockReturnValue(new Promise(() => {}))
    renderCatalog()
    expect(screen.getByRole('status', { name: 'Cargando catálogo' })).toBeInTheDocument()
  })

  it('renderiza productos con nombre, nombre botánico, precio COP y agotados', async () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderCatalog()

    expect(await screen.findByText('Monstera')).toBeInTheDocument()
    expect(screen.getByText('Monstera deliciosa')).toBeInTheDocument()
    expect(screen.getByText(formatPrice(65000))).toBeInTheDocument()
    expect(screen.getByText('Agotado')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Planta de Monstera' })).toBeInTheDocument()
    // glifos de cuidado accesibles
    expect(screen.getByRole('img', { name: 'Luz: Media sombra' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Riego medio' })).toBeInTheDocument()
    // la tarjeta enlaza al detalle
    expect(screen.getByRole('link', { name: /Monstera deliciosa/ })).toHaveAttribute(
      'href',
      '/catalogo/p-1'
    )
  })

  it('filtra por categoría al instante con los chips y permite volver a Todos', async () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderCatalog()
    const user = userEvent.setup()

    await screen.findByText('Monstera')

    const materosChip = screen.getByRole('button', { name: 'Materos' })
    await user.click(materosChip)
    expect(materosChip).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('Matero de barro')).toBeInTheDocument()
    expect(screen.queryByText('Monstera')).not.toBeInTheDocument()
    // el filtrado es client-side: no dispara otra petición
    expect(mockedFetch).toHaveBeenCalledTimes(1)

    await user.click(screen.getByRole('button', { name: 'Todos' }))
    expect(screen.getByText('Monstera')).toBeInTheDocument()
  })

  it('lee la categoría inicial desde el parámetro ?categoria= de la URL', async () => {
    mockedFetch.mockResolvedValue(PRODUCTS)
    renderCatalog('/catalogo?categoria=materos')

    expect(await screen.findByText('Matero de barro')).toBeInTheDocument()
    expect(screen.queryByText('Monstera')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Materos' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('muestra el estado vacío cuando la categoría no tiene productos', async () => {
    mockedFetch.mockResolvedValue([PRODUCTS[0]])
    renderCatalog()
    const user = userEvent.setup()

    await screen.findByText('Monstera')
    await user.click(screen.getByRole('button', { name: 'Flores' }))
    expect(screen.getByText('No hay productos en esta categoría todavía.')).toBeInTheDocument()
  })

  it('muestra el estado de error y permite reintentar', async () => {
    mockedFetch.mockRejectedValueOnce(new Error('Network Error'))
    mockedFetch.mockResolvedValueOnce(PRODUCTS)
    renderCatalog()
    const user = userEvent.setup()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No pudimos cargar el catálogo.')

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    await waitFor(() => expect(screen.getByText('Monstera')).toBeInTheDocument())
  })
})