---
id: ST-ADM-01
title: AdminLayout Completo — Shell de Administración con Navegación, Sesión y Guard
layer: frontend
priority: high
status: pending

---

# ST-ADM-01 — AdminLayout Completo: Shell de Administración con Navegación, Sesión y Guard

**Como** administrador del vivero autenticado
**Quiero** un shell de administración con navegación lateral, encabezado con contexto y control de mi sesión
**Para** moverme entre las secciones del panel de forma clara y segura desde cualquier dispositivo.

## Descripción

Completar el layout de administración (`src/layouts/AdminLayout.tsx`) que hoy
es un esqueleto mínimo. El shell envuelve todas las rutas bajo `/admin`
(excepto autenticación, que usa `AuthLayout`) y provee: guard de sesión,
navegación lateral con estado activo, encabezado con breadcrumbs, menú de
usuario con cierre de sesión y toggle de tema. Ninguna página de administración
monta navegación propia — siempre a través de este layout.

**Principio de datos:** el usuario autenticado se lee **únicamente del
`authStore`** (hoy poblado por el login simulado; cuando el backend exponga el
perfil en la respuesta de login o `/auth/me`, ningún componente del layout
cambia). La navegación se define como datos (arreglo de secciones), de modo
que agregar secciones futuras (productos, cotizaciones) no toque la estructura.

**Nota de diseño:** esta historia **no especifica diseño** (colores,
tipografía, espaciados, motion). Todo lo visual lo gobierna el design system
del proyecto (`docs/design/design-system.md` + `src/styles/tokens.css`),
responsabilidad del agente frontend. Los criterios describen contenido,
comportamiento y estados.

**Estado actual:** existe el guard de autenticación y un shell mínimo
(sidebar estática con marca, header vacío, `<Outlet/>`); el dashboard es un
placeholder con saludo. Todo lo demás está pendiente.

## Criterios de aceptación

### Guard de sesión

- [x] Sin sesión activa, cualquier ruta bajo `/admin` redirige a
  `/admin/login`.
- [ ] Tras iniciar sesión, el usuario regresa a la ruta que intentaba abrir
  (se conserva el destino original en la redirección).
- [ ] Cerrar sesión limpia el estado (`clearAuth`) y lleva a `/admin/login`.

### Navegación lateral (sidebar)

- [ ] Marca del vivero con enlace al panel y acceso rápido "Ver sitio" hacia
  el sitio público.
- [ ] Navegación por secciones definida como datos (mínimo: Panel; preparada
  para Productos y Cotizaciones como secciones futuras sin cambios
  estructurales).
- [ ] La sección activa se resalta y expone `aria-current="page"`.
- [ ] En móvil la sidebar colapsa a un drawer (vaul) accesible desde el
  header, que se cierra al navegar.

### Encabezado (header)

- [ ] Breadcrumbs derivados de la ruta activa (Panel · Productos · …), con el
  nivel actual no enlazado.
- [ ] Toggle de tema claro/oscuro (mismo `ThemeProvider` del sitio público).
- [ ] Menú de usuario (Radix dropdown) con nombre y correo del `authStore`,
  y acción **Cerrar sesión**.

### Contenido

- [x] Las páginas se montan vía `<Outlet/>`; ninguna página admin monta
  navegación directamente.
- [ ] Página de panel (dashboard) como composición inicial del shell: saludo
  con el usuario de la sesión y accesos a las secciones (sin métricas
  inventadas — los datos reales llegarán con sus historias).

## Requisitos no funcionales

### Seguridad

- [x] Rutas admin protegidas por guard en el layout (no por página).
- [ ] El menú de usuario nunca muestra el token; solo nombre/correo del store.
- [ ] El cierre de sesión no deja rutas admin accesibles con "atrás" del
  navegador (el guard re-evalúa en cada render).

### Accesibilidad

- [ ] Landmarks semánticos: `nav` (con `aria-label`), `header`, `main`.
- [ ] Drawer móvil con focus trap y cierre con Escape (vaul/Radix).
- [ ] Menú de usuario navegable por teclado (Radix dropdown).
- [ ] Foco visible en todos los controles; skip-link al contenido.

### Diseño

- Gobernado por el design system del agente (tokens CSS, componentes cva,
  motion con reduced-motion). No se especifica en esta historia.

### Componentes

| Componente | Ubicación | Estado |
|---|---|---|
| Shell + guard | `src/layouts/AdminLayout.tsx` | Esqueleto — completar |
| Navegación lateral + drawer móvil | `src/layouts/AdminLayout.tsx` (o subcomponentes en `src/components/`) | Pendiente |
| Breadcrumbs | derivados de la ruta (React Router) | Pendiente |
| Menú de usuario | Radix `@radix-ui/react-dropdown-menu` | Pendiente |
| Toggle de tema | reutiliza `src/providers/ThemeProvider.tsx` | Implementado (reutilizar) |
| Página de panel | `src/pages/AdminDashboardPage.tsx` | Placeholder — completar |
| Sesión (usuario/logout) | `src/store/authStore.ts` | Implementado (consumir) |

### Estados

- [ ] Autenticado (shell completo con usuario en el header).
- [ ] No autenticado (redirección al login, conservando destino).
- [ ] Sección activa resaltada en la navegación.
- [ ] Drawer móvil abierto/cerrado.

## Definición de terminado (DoD)

- [ ] Todos los criterios de aceptación implementados.
- [ ] Responsive: sidebar fija en desktop, drawer en móvil; ambos temas.
- [ ] Pruebas automatizadas: guard (redirige sin sesión, renderiza con
  sesión, conserva destino), navegación activa, logout (limpia store y
  redirige), menú de usuario y drawer móvil.
- [ ] Accesibilidad básica validada (landmarks, teclado, foco, aria-current).
- [ ] Validación funcional y aprobación de QA/PO.
