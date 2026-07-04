import type { LightLevel, ProductCategory, WaterLevel } from '@/types/api'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  plantas: 'Plantas',
  arboles: 'Árboles',
  gramas: 'Gramas',
  flores: 'Flores',
  materos: 'Materos',
}

export const LIGHT_LABELS: Record<LightLevel, string> = {
  sol: 'Sol pleno',
  'media-sombra': 'Media sombra',
  sombra: 'Sombra',
}

export const WATER_LABELS: Record<WaterLevel, string> = {
  bajo: 'Riego bajo',
  medio: 'Riego medio',
  alto: 'Riego alto',
}