---
id: ST-MKT-02
title: Inyección Dinámica de Metadatos OpenGraph y SEO
layer: frontend
priority: high
status: in-review

---

# ST-MKT-02 — Inyección Dinámica de Metadatos OpenGraph y SEO

**Como** especialista en marketing  
**Quiero** que las páginas de producto contengan metadatos dinámicos y etiquetas OpenGraph  
**Para** optimizar el posicionamiento SEO y la visualización en redes sociales.

## Descripción

Implementar la generación dinámica de metadatos OpenGraph, SEO y datos estructurados JSON-LD en las páginas de detalle de producto, utilizando capacidades SSR o renderizado híbrido para garantizar la correcta indexación por motores de búsqueda y plataformas sociales.

## Criterios de aceptación

- Cada página de producto debe generar dinámicamente las etiquetas OpenGraph.
- Deben incluirse las etiquetas `og:title`, `og:image`, `og:description` y `og:price:amount`.
- Debe generarse el esquema JSON-LD de tipo `Product`.
- Los motores de búsqueda deben poder indexar correctamente el contenido.
- Las previsualizaciones en redes sociales deben mostrar información actualizada.
- Los metadatos deben actualizarse automáticamente cuando cambie el producto.

### Manejo de errores y feedback

- Si un producto no posee imagen principal, se debe utilizar una imagen por defecto.
- Si un producto no existe, se debe retornar la página 404 correspondiente.
- Se deben registrar errores de generación de metadatos.

## Requisitos no funcionales

### Seguridad

- Escapar y sanitizar todos los datos inyectados en el HTML.
- Evitar vulnerabilidades XSS en las etiquetas dinámicas.

### Componentes

- Componente SEO Head.
- Generador OpenGraph.
- Generador JSON-LD.
- Middleware SSR o prerender.

### Validaciones

- Validar existencia del producto.
- Validar URLs de imágenes.
- Validar longitud de descripciones SEO.

### Estados

- Página cargando.
- Metadatos generados.
- Error de generación.
- Producto no encontrado.

### Accesibilidad

- Mantener compatibilidad con lectores de pantalla.
- Garantizar correcta semántica HTML.

## Definición de terminado (DoD)

- Validación mediante OpenGraph Debugger.
- Validación mediante Rich Results Test de Google.
- Pruebas SEO automatizadas ejecutadas.
- Documentación técnica actualizada.
- Revisión y aprobación del equipo de marketing.