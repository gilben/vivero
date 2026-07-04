# SEO y OpenGraph (ST-MKT-02)

## Qué hace

Cada página de detalle de producto (`/catalogo/:id`) genera dinámicamente:

- `<title>` y `meta description` (truncada a 160 caracteres)
- OpenGraph: `og:site_name`, `og:type=product`, `og:title`, `og:description`,
  `og:image`, `og:url`, `og:price:amount`, `og:price:currency` + `twitter:card`
- `<link rel="canonical">`
- JSON-LD `Product` de schema.org (nombre, sku, marca, imagen, oferta con
  precio COP y disponibilidad `InStock`/`OutOfStock`)

Home y Catálogo definen título y descripción propios (el catálogo refleja la
categoría activa). El estado "producto no encontrado" emite `robots: noindex`.
`index.html` trae los metadatos base del sitio como fallback estático.

## Dónde vive

| Pieza | Archivo |
|---|---|
| Componente SEO Head | `src/features/seo/components/SeoHead.tsx` |
| Generador OpenGraph | `src/features/seo/openGraph.ts` |
| Generador JSON-LD | `src/features/seo/jsonLd.ts` |
| Constantes (marca, imagen por defecto, límites) | `src/features/seo/constants.ts` |

## Comportamiento y seguridad

- Los tags gestionados llevan `data-seo`: se regeneran al cambiar el producto
  y se limpian al desmontar la página (el título vuelve al default).
- **XSS:** los metadatos se escriben con `setAttribute`/`textContent` (nunca
  `innerHTML`) — el DOM escapa los datos. El JSON-LD se serializa escapando
  `<` como `\u003c`, de modo que un dato malicioso no puede cerrar el
  `<script>` (cubierto por test).
- **Imagen por defecto:** si el producto no tiene imagen o la URL no es
  http(s) absoluta, se usa `DEFAULT_OG_IMAGE` y se registra con `logger`.
- Errores de generación se capturan y registran; nunca rompen la página.

## Limitación conocida: SPA sin SSR

Este proyecto es una SPA (Vite + React, sin SSR por decisión de stack).

- **Google** ejecuta JavaScript e indexa estos metadatos correctamente.
- **Facebook/WhatsApp/LinkedIn NO ejecutan JS**: sus scrapers ven solo los
  metadatos estáticos de `index.html`. Para previews sociales por producto se
  necesita prerender en infraestructura (elige una al integrar el backend):
  1. Prerender/edge middleware (p. ej. prerender.io, Cloudflare Workers) que
     sirva HTML renderizado a los bots.
  2. Generación del HTML de `/catalogo/:id` en el backend con los mismos
     builders (los generadores son funciones puras reutilizables).

## Validación (DoD)

- Automatizada: `npx vitest run` cubre builders, SeoHead e integración en el
  detalle (12 tests del módulo).
- Manual, tras desplegar con prerender:
  - OpenGraph Debugger: https://developers.facebook.com/tools/debug/
  - Rich Results Test: https://search.google.com/test/rich-results
  - En local (Google-style): pegar la URL del producto y verificar el bloque
    `application/ld+json` en DevTools → Elements → `<head>`.
