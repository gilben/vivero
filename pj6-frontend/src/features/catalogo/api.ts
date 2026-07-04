import type { ProductDto } from '@/types/api'

// Latencia simulada para que los skeletons sean visibles en desarrollo
const MOCK_LATENCY_MS = 700

const delay = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/750`

// <!-- mock --> Datos de ejemplo hasta que el backend exponga /products
// (exportado: el mock del chat busca sobre este mismo inventario)
export const MOCK_PRODUCTS: ProductDto[] = [
  {
    id: 'p-01', name: 'Monstera', botanicalName: 'Monstera deliciosa',
    category: 'plantas', price: 65000, imageUrl: img('monstera-deliciosa'),
    altText: 'Planta de Monstera deliciosa en matero de vivero',
    description: 'Planta de interior de hojas grandes y perforadas. Crece bien en espacios luminosos sin sol directo.',
    light: 'media-sombra', water: 'medio', inStock: true,
  },
  {
    id: 'p-02', name: 'Lengua de suegra', botanicalName: 'Sansevieria trifasciata',
    category: 'plantas', price: 38000, imageUrl: img('sansevieria'),
    altText: 'Sansevieria de hojas verticales verdes con bordes amarillos',
    description: 'Muy resistente y de poco riego. Ideal para principiantes y espacios con poca luz.',
    light: 'media-sombra', water: 'bajo', inStock: true,
  },
  {
    id: 'p-03', name: 'Pothos dorado', botanicalName: 'Epipremnum aureum',
    category: 'plantas', price: 32000, imageUrl: img('pothos-dorado'),
    altText: 'Pothos dorado colgante con hojas variegadas',
    description: 'Colgante de crecimiento rápido con hojas variegadas. Tolera sombra y riegos irregulares.',
    light: 'sombra', water: 'medio', inStock: true,
  },
  {
    id: 'a-01', name: 'Guayacán amarillo', botanicalName: 'Handroanthus chrysanthus',
    category: 'arboles', price: 120000, imageUrl: img('guayacan-amarillo'),
    altText: 'Árbol joven de guayacán amarillo en bolsa de vivero',
    description: 'Árbol ornamental de floración amarilla intensa. Para jardines amplios y zonas verdes a pleno sol.',
    light: 'sol', water: 'medio', inStock: true,
  },
  {
    id: 'a-02', name: 'Limonero', botanicalName: 'Citrus × limon',
    category: 'arboles', price: 95000, imageUrl: img('limonero'),
    altText: 'Limonero joven con frutos verdes',
    description: 'Cítrico frutal para matero grande o jardín. Necesita sol directo y riego constante.',
    light: 'sol', water: 'alto', inStock: false,
  },
  {
    id: 'g-01', name: 'Grama San Agustín', botanicalName: 'Stenotaphrum secundatum',
    category: 'gramas', price: 18000, imageUrl: img('grama-san-agustin'),
    altText: 'Tapete de grama San Agustín verde',
    description: 'Grama en tapete de hoja ancha, densa y de buen color. Precio por metro cuadrado.',
    light: 'sol', water: 'medio', inStock: true,
  },
  {
    id: 'g-02', name: 'Maní forrajero', botanicalName: 'Arachis pintoi',
    category: 'gramas', price: 15000, imageUrl: img('mani-forrajero'),
    altText: 'Cubresuelo de maní forrajero con flores amarillas',
    description: 'Cubresuelo de bajo mantenimiento con flor amarilla. Reemplaza el césped en taludes y jardineras.',
    light: 'media-sombra', water: 'bajo', inStock: true,
  },
  {
    id: 'f-01', name: 'Orquídea Cattleya', botanicalName: 'Cattleya trianae',
    category: 'flores', price: 85000, imageUrl: img('orquidea-cattleya'),
    altText: 'Orquídea Cattleya con flores lila en matero colgante',
    description: 'La flor nacional de Colombia. Florece en ambientes frescos con luz filtrada y buena ventilación.',
    light: 'media-sombra', water: 'medio', inStock: true,
  },
  {
    id: 'f-02', name: 'Geranio', botanicalName: 'Pelargonium hortorum',
    category: 'flores', price: 22000, imageUrl: img('geranio-rojo'),
    altText: 'Geranio con flores rojas en matero de barro',
    description: 'Floración abundante casi todo el año. Perfecto para balcones y ventanas con sol.',
    light: 'sol', water: 'medio', inStock: true,
  },
  {
    id: 'm-01', name: 'Matero de barro', category: 'materos', price: 28000,
    imageUrl: img('matero-barro'), altText: 'Matero artesanal de barro cocido',
    description: 'Barro cocido artesanal que regula la humedad de la raíz. Diámetro 25 cm.',
    inStock: true,
  },
  {
    id: 'm-02', name: 'Matera colgante de fibra', category: 'materos', price: 35000,
    imageUrl: img('matera-colgante'), altText: 'Matera colgante tejida en fibra natural',
    description: 'Tejida en fibra natural con soporte para colgar. Ideal para pothos y helechos.',
    inStock: true,
  },
  {
    id: 'm-03', name: 'Matera de cemento', category: 'materos', price: 42000,
    imageUrl: img('matera-cemento'), altText: 'Matera minimalista de cemento gris',
    description: 'Acabado minimalista en cemento pulido con orificio de drenaje. Diámetro 20 cm.',
    inStock: true,
  },
]

// Cuando el backend exponga /products este cuerpo pasa a ser:
//   const res = await apiClient.get<ProductDto[]>('/products')
//   return res.data
export async function fetchProducts(): Promise<ProductDto[]> {
  await delay(MOCK_LATENCY_MS)
  return MOCK_PRODUCTS
}

// Cuando el backend exponga /products/:id este cuerpo pasa a ser:
//   const res = await apiClient.get<ProductDto>(`/products/${id}`)
//   return res.data
// (un 404 del backend se traducirá a null en ese momento)
export async function fetchProductById(id: string): Promise<ProductDto | null> {
  await delay(MOCK_LATENCY_MS)
  return MOCK_PRODUCTS.find(p => p.id === id) ?? null
}