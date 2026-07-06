---
id: ST-CAT-01
title: Catálogo de Productos — Pantallas de Inicio, Catálogo y Detalle
layer: both
priority: high
status: in-review

---

# ST-CAT-01 — Catálogo de Productos: Pantallas de Inicio, Catálogo y Detalle

**Como** visitante del sitio del vivero
**Quiero** explorar los productos desde el inicio, navegar el catálogo por categorías y ver el detalle de cada producto
**Para** encontrar y evaluar plantas, árboles, gramas, flores y materos antes de comprar o cotizar.

## Descripción

Generación de las tres pantallas públicas del catálogo:

1. **Inicio (`/`)**: presentación del vivero con acceso directo al catálogo,
   exploración por categorías y productos destacados.
2. **Catálogo (`/catalogo`)**: listado completo con filtro por categoría.
3. **Detalle (`/catalogo/:id`)**: ficha completa del producto con
   recomendaciones relacionadas.

**Principio arquitectónico — fuente de datos genérica:** las pantallas **no
conocen datos quemados**. Todo el inventario llega por la capa de datos del
catálogo (`features/catalogo/api.ts`: `fetchProducts`, `fetchProductById`)
consumida con TanStack Query (caché compartida `['products']` /
`['products', id]` entre inicio, catálogo, detalle y el asistente de ST-AI-01).
Hoy esa capa sirve mocks con latencia simulada; cuando el backend exponga
`GET /products` y `GET /products/:id`, el flip ocurre en un único archivo y
**todas las pantallas consumen el API real sin cambios**.

**Nota de diseño:** esta historia **no especifica diseño** (colores,
tipografía, espaciados, motion). Todo lo visual lo gobierna el design system
del proyecto (`docs/design/design-system.md` + `src/styles/tokens.css`),
responsabilidad del agente frontend. Los criterios describen contenido,
comportamiento y estados.

**Estado actual:** frontend implementado y funcional. Backend (`GET /products`,
`GET /products/:id`) pendiente.

## Criterios de aceptación

### Inicio (`/`) — implementado

- [x] Presentación del vivero con llamado a la acción único hacia el catálogo.
- [x] Exploración por categoría: cada categoría enlaza al catálogo **ya
  filtrado** (`/catalogo?categoria=…`).
- [x] Productos destacados: solo productos **disponibles** (los agotados se
  excluyen), reutilizando la misma tarjeta y caché del catálogo.
- [x] Carga con skeletons; si la carga de destacados falla, la sección se
  oculta sin error ruidoso (el inicio nunca muestra fallas de red en primera
  plana).

### Catálogo (`/catalogo`) — implementado

- [x] Grilla responsive de productos (tarjeta con nombre, nombre botánico,
  precio en COP, indicador de agotado y glifos de cuidado accesibles).
- [x] Filtro por categoría (Todos · Plantas · Árboles · Gramas · Flores ·
  Materos) **instantáneo y client-side** sobre la caché — sin peticiones
  adicionales al filtrar.
- [x] La categoría activa vive en la URL (`?categoria=…`): el filtro es
  compartible, navegable con atrás/adelante y enlazable desde el inicio.
  Valores inválidos caen a "Todos".
- [x] Cada tarjeta enlaza al detalle del producto.
- [x] Estados: skeletons con la forma de la grilla · vacío por categoría con
  mensaje explicativo · error con acción de reintento.

### Detalle (`/catalogo/:id`) — implementado

- [x] Ficha completa: nombre, nombre botánico, categoría, precio COP,
  disponibilidad, descripción y ficha de cuidados (luz/riego) cuando aplica
  (los materos no llevan cuidados).
- [x] Productos relacionados de la misma categoría (excluyendo el actual,
  máx. 4), servidos desde la caché compartida — sin petición extra.
- [x] Producto inexistente → estado "no encontrado" con retorno al catálogo
  (y `robots: noindex`, ver ST-MKT-02).
- [x] Metadatos SEO/OpenGraph + JSON-LD dinámicos del producto (cubierto por
  **ST-MKT-02**; el detalle los consume).
- [x] Estados: skeleton con la forma del detalle · error con reintento ·
  navegación de regreso al catálogo.

### Transversal — implementado

- [x] **Sin datos quemados en las pantallas:** todo el inventario proviene de
  la capa de datos (`fetchProducts` / `fetchProductById`) vía TanStack Query.
  Genérico para futuras implementaciones: conectar el API real no toca
  ninguna pantalla.
- [x] Lecturas con `useQuery` (nunca `useEffect` + `useState`); claves de
  caché compartidas entre pantallas y con el asistente (ST-AI-01).
- [x] Rutas registradas bajo el layout público (navbar/footer, ver layout).

### Backend — pendiente

- [ ] `GET /products` (listado, con paginación si el catálogo crece) y
  `GET /products/:id` (404 → estado no encontrado). El contrato `ProductDto`
  ya está definido en `src/types/api.ts` (incluye `altText` para
  accesibilidad de imágenes).
- [ ] Fotografía real de productos (hoy placeholders); las URLs llegan por el
  mismo DTO, sin cambios de código.

## Requisitos no funcionales

### Accesibilidad

- [x] Imágenes con `alt` proveniente del campo `altText` del DTO.
- [x] Glifos de cuidado con etiquetas accesibles (`role="img"` + `aria-label`).
- [x] Filtros con `aria-pressed`; foco visible y navegación por teclado en
  tarjetas, chips y acciones.
- [x] Jerarquía semántica de encabezados por pantalla.

### Rendimiento

- [x] Imágenes con `loading="lazy"`; filtrado client-side sin re-fetch;
  relacionados y destacados desde caché.

### Diseño

- Gobernado por el design system del agente (tokens CSS, componentes cva,
  motion con reduced-motion). No se especifica en esta historia.

### Componentes (implementados)

| Componente | Ubicación |
|---|---|
| Capa de datos (punto único de flip al API) | `src/features/catalogo/api.ts` |
| Hooks de datos | `src/features/catalogo/hooks/useProducts.ts` · `useProduct.ts` |
| Grilla + filtros del catálogo | `src/features/catalogo/components/Catalog.tsx` · `CategoryChips.tsx` |
| Tarjeta de producto + skeleton | `src/features/catalogo/components/ProductCard.tsx` · `ProductCardSkeleton.tsx` |
| Glifos de cuidado | `src/features/catalogo/components/CareBadges.tsx` |
| Detalle + relacionados | `src/features/catalogo/components/ProductDetail.tsx` |
| Secciones del inicio | `src/features/catalogo/components/CategoryTiles.tsx` · `FeaturedProducts.tsx` |
| Páginas (composición) | `src/pages/HomePage.tsx` · `CatalogoPage.tsx` · `ProductoDetallePage.tsx` |
| DTOs (`ProductDto`, `ProductCategory`, `LightLevel`, `WaterLevel`) | `src/types/api.ts` |

### Estados

- [x] Cargando (skeletons con la forma del contenido en las tres pantallas).
- [x] Contenido cargado.
- [x] Vacío (categoría sin productos).
- [x] Error con reintento (catálogo y detalle) / sección oculta (inicio).
- [x] Producto no encontrado.

## Definición de terminado (DoD)

- [x] Las tres pantallas implementadas con pruebas automatizadas (grilla,
  filtros por chip y por URL, estados de carga/vacío/error, ficha completa,
  relacionados, no encontrado, destacados solo disponibles) — 19 tests de
  pantallas de catálogo, suite completa en verde.
- [x] Responsive y en ambos temas (claro/oscuro) vía tokens del design system.
- [x] Accesibilidad básica validada (alt, aria, teclado, foco).
- [ ] Conexión al API real de productos (`GET /products`, `GET /products/:id`).
- [ ] Fotografía real del inventario cargada por el backend.
- [ ] Validación funcional y aprobación de QA/PO.
