import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProductDetail from './ProductDetail'
import { formatPrice } from './ProductCard'
import { fetchProductById, fetchProducts } from '../api'
import type { ProductDto } from '@/types/api'

vi.mock('../api', () => ({
  fetchProductById: vi.fn(),
  fetchProducts: vi.fn(),
}))

const mockedFetchById = vi.mocked(fetchProductById)
const mockedFetchAll = vi.mocked(fetchProducts)

const MONSTERA: ProductDto = {
  id: 'p-1', name: 'Monstera', botanicalName: 'Monstera deliciosa',
  category: 'plantas', price: 65000, imageUrl: 'https://example.com/monstera.jpg',
  altText: 'Planta de Monstera',
  description: 'Planta de interior de hojas grandes y perforadas.',
  light: 'media-sombra', water: 'medio', inStock: true,
}

const POTHOS: ProductDto = {
  id: 'p-2', name: 'Pothos dorado', botanicalName: 'Epipremnum aureum',
  category: 'plantas', price: 32000, imageUrl: 'https://example.com/pothos.jpg',
  altText: 'Pothos dorado', light: 'sombra', water: 'medio', inStock: true,
}

const MATERO: ProductDto = {
  id: 'm-1', name: 'Matero de barro', category: 'materos', price: 28000,
  imageUrl: 'https://example.com/matero.jpg', altText: 'Matero de barro', inStock: true,
}

function renderDetail(id = 'p-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/catalogo/${id}`]}>
        <Routes>
          <Route path="/catalogo/:id" element={<ProductDetail />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

beforeEach(() => {
  vi.clearAllMocks()
  mockedFetchAll.mockResolvedValue([MONSTERA, POTHOS, MATERO])
})

describe('ProductDetail', () => {
  it('muestra un skeleton con la forma del detalle mientras carga', () => {
    mockedFetchById.mockReturnValue(new Promise(() => {}))
    renderDetail()
    expect(screen.getByRole('status', { name: 'Cargando producto' })).toBeInTheDocument()
  })

  it('renderiza el producto completo: nombre, botánico, precio, stock, descripción y cuidados', async () => {
    mockedFetchById.mockResolvedValue(MONSTERA)
    renderDetail()

    expect(await screen.findByRole('heading', { level: 1, name: 'Monstera' })).toBeInTheDocument()
    expect(screen.getByText('Monstera deliciosa')).toBeInTheDocument()
    expect(screen.getByText(formatPrice(65000))).toBeInTheDocument()
    expect(screen.getByText('Disponible')).toBeInTheDocument()
    expect(screen.getByText('Planta de interior de hojas grandes y perforadas.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cuidados' })).toBeInTheDocument()
    expect(screen.getByText('Media sombra')).toBeInTheDocument()
    expect(screen.getByText('Riego medio')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Planta de Monstera' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Volver al catálogo/ })).toHaveAttribute(
      'href',
      '/catalogo'
    )
  })

  it('muestra productos relacionados de la misma categoría, excluyendo el actual', async () => {
    mockedFetchById.mockResolvedValue(MONSTERA)
    renderDetail()

    await screen.findByRole('heading', { level: 1, name: 'Monstera' })
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: 'Más en plantas' })).toBeInTheDocument()
    )
    expect(screen.getByText('Pothos dorado')).toBeInTheDocument()
    // ni el producto actual ni otras categorías aparecen como relacionados
    expect(screen.queryByText('Matero de barro')).not.toBeInTheDocument()
  })

  it('los materos no muestran sección de cuidados', async () => {
    mockedFetchById.mockResolvedValue(MATERO)
    renderDetail('m-1')

    await screen.findByRole('heading', { level: 1, name: 'Matero de barro' })
    expect(screen.queryByRole('heading', { name: 'Cuidados' })).not.toBeInTheDocument()
  })

  it('inyecta metadatos OpenGraph y JSON-LD del producto en el head', async () => {
    mockedFetchById.mockResolvedValue(MONSTERA)
    renderDetail()

    await screen.findByRole('heading', { level: 1, name: 'Monstera' })

    expect(document.title).toBe('Monstera — pj6 vivero')
    expect(
      document.head
        .querySelector('meta[property="og:price:amount"][data-seo]')
        ?.getAttribute('content')
    ).toBe('65000')
    expect(
      document.head.querySelector('meta[property="og:type"][data-seo]')?.getAttribute('content')
    ).toBe('product')

    const script = document.head.querySelector('script[type="application/ld+json"][data-seo]')
    expect(script).not.toBeNull()
    expect(JSON.parse(script!.textContent!)).toMatchObject({
      '@type': 'Product',
      name: 'Monstera',
      offers: { price: 65000, priceCurrency: 'COP' },
    })
  })

  it('el estado no encontrado marca la página con robots noindex', async () => {
    mockedFetchById.mockResolvedValue(null)
    renderDetail('no-existe')

    await screen.findByRole('heading', { name: 'Producto no encontrado' })
    expect(
      document.head.querySelector('meta[name="robots"][data-seo]')?.getAttribute('content')
    ).toBe('noindex')
    expect(document.title).toBe('Producto no encontrado — pj6 vivero')
  })

  it('muestra el estado de producto no encontrado', async () => {
    mockedFetchById.mockResolvedValue(null)
    renderDetail('no-existe')

    expect(
      await screen.findByRole('heading', { name: 'Producto no encontrado' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: /Volver al catálogo/ }).length).toBeGreaterThan(0)
  })

  it('muestra el estado de error y permite reintentar', async () => {
    mockedFetchById.mockRejectedValueOnce(new Error('Network Error'))
    mockedFetchById.mockResolvedValueOnce(MONSTERA)
    renderDetail()
    const user = userEvent.setup()

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('No pudimos cargar el producto.')

    await user.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Monstera' })).toBeInTheDocument()
  })
})