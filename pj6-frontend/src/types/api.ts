/**
 * All DTOs must mirror backend contracts exactly.
 * Update this file when backend DTOs change.
 */

export interface ApiError { status: number; title: string; detail: string }

export interface UserDto {
  id: string
  name: string
  email: string
  role: 'admin' | 'customer'
}

export interface LoginRequestDto { email: string; password: string }

export interface LoginResponseDto {
  accessToken: string
  expiresAt: string
  user: UserDto
}

export interface ForgotPasswordRequestDto { email: string }

export interface ForgotPasswordResponseDto { message: string }

export type ProductCategory = 'plantas' | 'arboles' | 'gramas' | 'flores' | 'materos'

export type LightLevel = 'sol' | 'media-sombra' | 'sombra'

export type WaterLevel = 'bajo' | 'medio' | 'alto'

export interface ChatRequestDto {
  message: string
}

export type ChatIntent =
  | 'saludo'
  | 'conversacion'
  | 'buscar-productos'
  | 'sin-resultados'
  | 'cotizacion'

/** Solicitud de cotización recopilada por el asistente. */
export interface QuoteRequestDto {
  name: string
  email: string
  phone: string
  /** Productos y cantidades solicitados, en texto. */
  detail: string
}

/** Respuesta híbrida del asistente: texto + intención detectada + recomendaciones. */
export interface ChatResponseDto {
  reply: string
  intent: ChatIntent
  products: ProductDto[]
  /** Presente solo cuando el asistente completó los datos de una cotización. */
  quote?: QuoteRequestDto | null
}

export interface ProductDto {
  id: string
  name: string
  /** Nombre botánico en latín; los materos no lo tienen. */
  botanicalName?: string
  category: ProductCategory
  /** Precio en COP, sin decimales. */
  price: number
  imageUrl: string
  altText: string
  description?: string
  light?: LightLevel
  water?: WaterLevel
  inStock: boolean
}

export interface PaginatedResponse<T> {
  items: T[]; total: number; page: number; pageSize: number;
}