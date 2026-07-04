import { render } from '@testing-library/react'
import SeoHead from './SeoHead'
import { DEFAULT_TITLE } from '../constants'

function getMeta(attr: 'name' | 'property', key: string): string | null {
  return (
    document.head
      .querySelector<HTMLMetaElement>(`meta[${attr}="${key}"][data-seo]`)
      ?.getAttribute('content') ?? null
  )
}

afterEach(() => {
  document.head.querySelectorAll('[data-seo]').forEach(el => el.remove())
})

describe('SeoHead', () => {
  it('inyecta título, OpenGraph, precio, canonical y JSON-LD en el head', () => {
    render(
      <SeoHead
        title="Monstera — pj6 vivero"
        description="Planta de interior."
        image="https://example.com/monstera.jpg"
        url="https://pj6vivero.com/catalogo/p-01"
        type="product"
        price={{ amount: 65000, currency: 'COP' }}
        jsonLd={{ '@type': 'Product', name: 'Monstera' }}
      />
    )

    expect(document.title).toBe('Monstera — pj6 vivero')
    expect(getMeta('property', 'og:title')).toBe('Monstera — pj6 vivero')
    expect(getMeta('property', 'og:type')).toBe('product')
    expect(getMeta('property', 'og:description')).toBe('Planta de interior.')
    expect(getMeta('name', 'description')).toBe('Planta de interior.')
    expect(getMeta('property', 'og:image')).toBe('https://example.com/monstera.jpg')
    expect(getMeta('property', 'og:price:amount')).toBe('65000')
    expect(getMeta('property', 'og:price:currency')).toBe('COP')
    expect(
      document.head.querySelector('link[rel="canonical"][data-seo]')?.getAttribute('href')
    ).toBe('https://pj6vivero.com/catalogo/p-01')

    const script = document.head.querySelector('script[type="application/ld+json"][data-seo]')
    expect(script).not.toBeNull()
    expect(JSON.parse(script!.textContent!)).toMatchObject({ '@type': 'Product', name: 'Monstera' })
  })

  it('actualiza los metadatos cuando cambian las props (cambio de producto)', () => {
    const { rerender } = render(<SeoHead title="Monstera — pj6 vivero" />)
    expect(document.title).toBe('Monstera — pj6 vivero')

    rerender(<SeoHead title="Limonero — pj6 vivero" />)
    expect(document.title).toBe('Limonero — pj6 vivero')
    expect(getMeta('property', 'og:title')).toBe('Limonero — pj6 vivero')
    // no se acumulan tags duplicados
    expect(document.head.querySelectorAll('meta[property="og:title"][data-seo]').length).toBe(1)
  })

  it('agrega robots noindex para páginas no indexables', () => {
    render(<SeoHead title="Producto no encontrado" noindex />)
    expect(getMeta('name', 'robots')).toBe('noindex')
  })

  it('limpia los tags gestionados y restaura el título al desmontar', () => {
    const { unmount } = render(
      <SeoHead title="Monstera — pj6 vivero" description="x" jsonLd={{ '@type': 'Product' }} />
    )
    expect(document.head.querySelectorAll('[data-seo]').length).toBeGreaterThan(0)

    unmount()
    expect(document.head.querySelectorAll('[data-seo]').length).toBe(0)
    expect(document.title).toBe(DEFAULT_TITLE)
  })
})