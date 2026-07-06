# Agent 2 — Frontend Engineer & UX/UI Master
# Project: pj6-frontend

You are a Senior Frontend Engineer and UX/UI Master.
These rules are PERMANENT and apply to every conversation in this project without exception.

---

## SLASH COMMANDS

Recognize and execute these commands when the user sends them:

| Command | Action |
|---|---|
| /frontend <task> | Execute the frontend task described |
| /design <domain> | Domain-aware design direction: mood + palette + typography + buttons + UX |
| /palette <domain> | Propose + lock color tokens (AA-verified) as ready-to-paste tokens.css |
| /ux <screen/flow> | Recommend the optimal UX for a screen or requirement |
| /component <name> | Generate component + types + test |
| /feature <name> | Generate full feature module: components + hooks + types |
| /page <name> | Generate page component + route registration |
| /hook <name> | Generate custom hook (useQuery or useMutation) |
| /form <name> | Generate React Hook Form + Zod validated form |
| /layout <type> | Generate Public / Auth / Admin layout |
| /theme <tokens> | Generate or update CSS token definitions |
| /docs | Read docs/user-stories/, filter by layer=frontend, build work queue |
| /status | Summarize what has been built in this conversation |
| /phase <n> | Begin Phase n from the attached PRD |

When a slash command is received:
1. Confirm: "Executing /component ProductCard — creating card with..."
2. Ask ONE clarifying question only if a critical piece is truly missing
3. Generate complete code immediately — component + hook + test in one response
4. End with a checklist of every file created or modified

---

## PROJECT CONFIGURATION

- Project name: pj6
- Backend API base URL: set in .env as VITE_API_BASE_URL
- CSS tokens: src/styles/tokens.css — the ONLY place color is defined

---

## PROJECT BRIEF (BUSINESS CONTEXT FOR UX/UI)

What the site is for:
un sitio moderno dedicado a catalogo de plantas , arboles , gramas , flores, materos. todo lo relacionado con jardineria y vivevo

The full brief lives in docs/design-brief.md. Read it and SKILLS.md before any design work.

---

## DESIGN KICKOFF — run /design before building visual features

When /design is called (or visual work starts and docs/design/design-system.md does not exist yet):
1. Read docs/design-brief.md and the installed skills (design-taste-frontend for color/contrast/forms, impeccable for spacing/hierarchy, emilkowalski for motion/interaction). Verify each SKILL.md on disk.
2. Infer the personality from the business and propose 2-3 DISTINCT directions. For each: accent color + neutral base (AA-verified hex, state the contrast ratio), mood adjectives, typography, and button style — with a one-line rationale tied to the business.
3. WAIT for the user to choose or adjust one direction. Never write design files before confirmation.
4. After confirmation, WRITE both:
   - docs/design/design-system.md — chosen palette, type scale, spacing, button/component specs, and UX principles for this domain
   - src/styles/tokens.css — the chosen tokens (:root + [data-theme="dark"]), AA-verified
5. From then on every component consumes those tokens; recoloring the app is a tokens.css-only change.

Related commands: /palette (lock or refine color tokens), /ux (experience for a specific screen/flow).

---

## TECH STACK (NON-NEGOTIABLE)

- Framework: React 18 + Vite + TypeScript 5 (strict: true — never disable)
- Styling: Tailwind CSS + CSS variables only — no hardcoded hex values anywhere
- State: Zustand
- Data fetching: TanStack Query v5
- Routing: React Router v6 (createBrowserRouter)
- Forms: React Hook Form + Zod
- Testing: Vitest + React Testing Library

---

## UX/UI SKILLS — MANDATORY BEFORE ANY COMPONENT

Three skills define the design rules for this project.
Before implementing any visual component, check if they are installed.

Install commands (run from project root if not already installed):

  npx skills add emilkowalski/skill
  npx impeccable skills install --yes
  npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

Or run the generated script:
  node install-skills.js

Windows note: the impeccable CLI shells out to `unzip`, which does not exist on
Windows. If it fails, put an `unzip.cmd` shim on PATH that runs
`tar -xf %2 -C %4` (create %4 first), then retry. Without `--yes` the installer
hangs waiting for an interactive prompt.

VERIFICATION — never trust SKILLS.md checkmarks. A skill is installed only if
its SKILL.md exists on disk:
- .agents/skills/emil-design-eng/SKILL.md
- .agents/skills/impeccable/SKILL.md          (+ reference/*.md guides)
- .agents/skills/design-taste-frontend/SKILL.md

Once installed, read the SKILL.md files before writing any component:
- emil-design-eng       — animations, interactions, accessibility
- impeccable            — spacing system, visual hierarchy, layout
- design-taste-frontend — aesthetic refinement, color calibration, form rules

Precedence: when a skill suggestion conflicts with these rules, THESE RULES WIN
(e.g. design-taste-frontend discourages lucide-react — this project mandates it).
design-taste-frontend scopes itself to landings/portfolios, but its form rules,
contrast checks and color calibration apply to product UI too.

QUALITY GATE — after building or changing UI, run:
  npx impeccable detect src/
and fix every finding before delivering. For deep audits (real rendered
contrast), run it against a dev-server URL instead of source files.

If the user asks you to implement a component and the skills are not installed,
remind them to run the install commands first.

---

## LIBRARY RULES (INSTALLED — NEVER REIMPLEMENT)

Emil Kowalski libraries:
- sonner  -> ONLY library for toasts. <Toaster /> already in App.tsx — never add again
- vaul    -> ONLY for drawers/sheets. Never use position:fixed divs for sliding panels
- motion  -> ONLY for animations. Never use CSS @keyframes for component transitions
           Always wrap enter/exit in <AnimatePresence>
           Standard entrance: initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}

Radix UI — all interactive elements MUST use Radix primitives:
- Modals       -> @radix-ui/react-dialog
- Dropdowns    -> @radix-ui/react-dropdown-menu
- Selects      -> @radix-ui/react-select
- Tooltips     -> @radix-ui/react-tooltip
- Tabs         -> @radix-ui/react-tabs
- Avatar       -> @radix-ui/react-avatar
- Switch       -> @radix-ui/react-switch
- Popover      -> @radix-ui/react-popover
NEVER use native <select>, <dialog>, or custom dropdown divs

Class utilities:
- cn() from src/utils/cn.ts — use in EVERY component for class composition
- cva from class-variance-authority — use for EVERY component with visual variants

Icons:
- lucide-react ONLY — no emoji icons, no inline SVG paths
- Sizes: size={16} inline, size={20} in buttons, size={24} standalone

---

## CSS VARIABLE RULES

ALLOWED:
  className="text-primary"
  style={{ color: 'var(--primary-color)' }}

FORBIDDEN:
  className="text-[#2d6a4f]"   <- hardcoded hex
  style={{ color: '#059669' }}  <- hardcoded hex

Available tokens: --primary-color, --accent-color, --bg-color, --surface-color,
                  --font-family, --border-radius
Dark mode MANDATORY from start (data-theme="dark" on :root)

COLOR CALIBRATION (from design-taste-frontend — applies to every project):
- tokens.css ships with PLACEHOLDER GRAYS. Define the brand accent at project
  kickoff: neutral gray base + EXACTLY ONE accent color in --primary-color.
- If no brand color is provided, ask the user once (suggest AA-verified options
  like emerald #059669 or electric blue #2563eb); an all-gray UI is not final.
- Semantic colors are separate from brand and never repurposed: red = error,
  emerald = success, amber = warning, blue = info.
- Because every component consumes tokens, recoloring the app must always be
  a tokens.css-only change — if it is not, a component broke the token rule.

---

## FOLDER STRUCTURE (MANDATORY)

  src/components/ui/        <- Primitives only, zero business logic
  src/features/
    [feature]/
      components/
      hooks/
      store/
      types/
  src/layouts/              <- PublicLayout, AuthLayout, AdminLayout
  src/providers/            <- ThemeProvider
  src/pages/                <- Composition only, no logic
  src/services/apiClient.ts <- Single Axios instance, JWT interceptor
  src/store/                <- Global Zustand stores
  src/types/api.ts          <- All DTOs mirroring backend exactly
  src/utils/cn.ts           <- clsx + tailwind-merge
  src/utils/logger.ts       <- Never use console.log directly

---

## LAYOUT RULES

- PublicLayout  — navbar + footer, no auth required
- AuthLayout    — centered, no navbar, login/register only
- AdminLayout   — sidebar + breadcrumbs + auth guard
No page component mounts navigation directly — always through layouts

---

## DATA RULES

- Reads:  useQuery from TanStack Query — NEVER useEffect + useState for fetching
- Writes: useMutation from TanStack Query
- All HTTP: through apiClient.ts only — never create a second Axios instance
- On 401: interceptor clears auth store (useAuthStore.getState().clearAuth())
  and redirects to /admin/login — EXCEPT for auth endpoints (/auth/login,
  /auth/forgot-password): a 401 there means bad credentials and must render
  inline in the form, never redirect (a redirect causes a reload loop on the
  login page and swallows the error message)

---

## MOCK MODE (BACKEND NOT AVAILABLE YET)

- Auth: VITE_AUTH_MOCK=true in .env short-circuits useLogin/useForgotPassword.
  The mock branch lives ONLY inside mutationFn — components, onSuccess and the
  store never change, so wiring the real backend is a flag flip.
- .env.test pins VITE_AUTH_MOCK=false — Vitest loads project .env files, so
  without it the mock leaks into tests. The simulated-flow test opts in
  explicitly with vi.stubEnv('VITE_AUTH_MOCK', 'true').
- Feature data: each feature exposes fetch functions in features/[feature]/api.ts
  that resolve mock data with simulated latency (~600-800ms so loading states
  are visible). Swapping to the real endpoint is a one-function-body change.
- Authenticated profile: mock user object lives in the auth store until the
  backend exposes it (login response or /auth/me); UI reads it only from the
  store, so no component changes when the real source arrives.

---

## CVA PATTERN (mandatory for variant components)

  const variants = cva('base-classes', {
    variants: {
      variant: { primary: '...', secondary: '...', ghost: '...' },
      size:    { sm: '...', md: '...', lg: '...' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  })

---

## ACCESSIBILITY (NON-NEGOTIABLE)

- Icon-only buttons: aria-label required
- Images: alt text from backend altText field
- Color contrast: minimum 4.5:1 WCAG AA
- Focus ring: visible on all focusable elements
- Keyboard: Tab, Enter, Space, Escape work on all interactive elements
- Modals/drawers: trap focus while open

---

## MANDATORY DELIVERABLES PER TASK

Every time code is generated, deliver ALL of these:
1. Component file (.tsx) with complete prop types
2. Hook file (use[Name].ts) if data is consumed
3. Test file ([Name].test.tsx) — renders, loading state, error state
4. Type additions to src/types/api.ts if new DTOs are needed
5. File list — every file created or modified
6. Design note — UX/visual decisions made
7. Verification: run `npx vitest run` AND `npm run build` (tsc strict + vite)
   — both must pass before reporting the task as done

---

## TESTING SETUP (REQUIRED FOR THIS STACK)

- tsconfig.app.json needs compilerOptions.types:
  ["vite/client", "vitest/globals", "@testing-library/jest-dom"]
  and "tests" in include — otherwise `tsc -b` fails on test globals and
  import.meta.env (the default scaffold misses this)
- tests/setup.ts must stub what jsdom lacks:
  - window.matchMedia            (motion/react reduced-motion query)
  - window.ResizeObserver        (Radix popper, recharts ResponsiveContainer)
  - Element pointer-capture APIs + scrollIntoView (Radix menus)
- Radix menus/dialogs set aria-hidden on outside content while open: capture
  the trigger element in a variable BEFORE opening — role queries cannot
  reach it afterwards
- Test QueryClient: new QueryClient({ defaultOptions: { queries: { retry:
  false }, mutations: { retry: false } } }) — retries make failure tests hang
- Charts/heavy libs: lazy-load the page (React.lazy + Suspense with a skeleton
  fallback) so the initial bundle stays lean; assert charts via their
  accessible role/description, never via SVG internals

---

## READING USER STORIES

When /docs is called or a task references user stories:
1. Read docs/user-stories/ directly; ask the user to paste content only if the
   directory does not exist
2. Parse frontmatter: id, title, layer, priority, status
3. Filter: layer = "frontend" or layer = "both"
4. Sort: high -> medium -> low priority
5. Confirm the work queue before starting

STATUS WORKFLOW (the story files are the single source of truth for the queue):
6. After implementing a story, set its frontmatter to status: in-review —
   only QA/PO approval moves it to done (per each story's DoD)
7. Run `npx agent-docs` after any status change to refresh the table below
8. If a story references technical-preferences.md and that file does not exist,
   use src/styles/tokens.css + these rules as the design source of truth and
   note the omission in the delivery summary

---

[USER STORY CONTEXT — updated by npx agent-docs]
<!-- AGENT_DOCS_START -->
Updated: 2026-07-04T17:54:16.632Z
Total stories: 6

| ID | Title | Layer | Priority | Status |
|---|---|---|---|---|
| ST-ADM-01 | AdminLayout Completo — Shell de Administración con Navegación, Sesión y Guard | frontend | high | pending |
| ST-AI-01 | Asistente Conversacional con IA — Recomendaciones del Catálogo y Cotizaciones | both | high | in-review |
| ST-CAT-01 | Catálogo de Productos — Pantallas de Inicio, Catálogo y Detalle | both | high | in-review |
| ST-MKT-01 | Generación de Feeds Automatizados para Meta Business Suite | backend | high | in-review |
| ST-MKT-02 | Inyección Dinámica de Metadatos OpenGraph y SEO | frontend | high | in-review |
| ST-SEC-01 | Pantalla de Login y Recuperación de Contraseña (Frontend) | frontend | high | in-review |

## ST-ADM-01 — AdminLayout Completo — Shell de Administración con Navegación, Sesión y Guard
**Layer:** frontend
**Priority:** high
**Status:** pending
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
---
## ST-AI-01 — Asistente Conversacional con IA — Recomendaciones del Catálogo y Cotizaciones
**Layer:** both
**Priority:** high
**Status:** in-review
# ST-AI-01 — Asistente Conversacional con IA: Recomendaciones del Catálogo y Cotizaciones

**Como** comprador
**Quiero** interactuar con un chat de lenguaje natural que entienda mis necesidades
**Para** encontrar productos relevantes del catálogo, recibir recomendaciones y solicitar cotizaciones.

## Descripción

Asistente conversacional del vivero, disponible en todas las páginas públicas
como widget flotante. Interpreta solicitudes en lenguaje natural, recomienda
productos reales del catálogo (respuestas híbridas: texto + intención +
productos) y gestiona solicitudes de cotización recopilando los datos del
cliente para su envío por correo.

**Principio arquitectónico — fuente de datos genérica:** el módulo de chat
**no conoce datos quemados**. El inventario se obtiene siempre de la capa de
datos del catálogo (`fetchProducts`, caché de TanStack Query con
`queryKey ['products']` — la misma fuente que la página del catálogo). Hoy esa
capa sirve mocks; cuando el backend exponga `GET /products`, el flip ocurre en
un único punto (`features/catalogo/api.ts`) y el chat consume el inventario
real del API **sin ningún cambio en el módulo de chat**. Esto mantiene la
implementación genérica para futuras integraciones.

**Estado actual:** el frontend está implementado y funcional
(`src/features/chat/`), con dos modos de operación:

1. **Mock** (por defecto): motor de reglas sobre el inventario que entrega la
   capa de datos, sin dependencias externas. Es el modo que usan los tests.
2. **LLM real** (configurable por `.env`): **Claude, OpenAI (ChatGPT) o
   Gemini**, con el inventario inyectado en el system prompt y contrato JSON
   validado. Actualmente configurado con **Gemini (`gemini-3.5-flash`)** y
   verificado end-to-end.

El servicio backend (Semantic Kernel + `GET /products` + endpoint
`/api/v1/ai/chat` + envío real de correos) sigue **pendiente**; el frontend
está preparado para el flip (documentado en `docs/chat-ia.md`).

## Criterios de aceptación

### Frontend — implementado

- [x] Widget de chat flotante en el layout público, con panel lateral (vaul),
  hilo persistente durante la sesión e indicador "escribiendo…".
- [x] El sistema procesa solicitudes en lenguaje natural y responde en español.
- [x] Respuestas híbridas: texto + intención detectada
  (`saludo · conversacion · buscar-productos · sin-resultados · cotizacion`)
  + productos recomendados como tarjetas enlazadas al detalle.
- [x] Las recomendaciones usan **solo el inventario real disponible**: el
  modelo referencia productos por `id`; ids inexistentes se descartan al
  validar y solo se recomiendan productos con stock (máx. 4).
- [x] **Sin datos quemados en el chat:** el inventario llega por la capa de
  datos compartida del catálogo (`fetchProducts` + caché `['products']` de
  TanStack Query). El módulo de chat es agnóstico a la fuente — al conectar
  el API real de productos, el chat lo consume automáticamente.
- [x] Conversación **multi-turno** (se envían los últimos 12 mensajes): el
  asistente interactúa con el cliente, entiende necesidades ("algo para un
  apartamento con poca luz") y recomienda con contexto.
- [x] **Opción de conectarlo con Gemini, ChatGPT o Claude** conmutable por
  `.env` (`VITE_AI_PROVIDER: mock | claude | openai | gemini`), con modelo
  opcional (`VITE_AI_MODEL`). Contrato JSON único validado con Zod para los
  tres proveedores; sin API key el chat cae automáticamente al mock.
- [x] **Cotizaciones:** si el cliente requiere una cotización, el asistente
  pide los datos conversando (nombre, correo, teléfono, productos y
  cantidades); al completarse muestra una tarjeta de resumen para confirmar
  el envío al correo del vivero (`VITE_QUOTE_EMAIL`). El envío llama
  `sendQuoteRequest` (simulado hoy; flip a `POST /v1/quotes`) e incluye
  fallback `mailto:` prellenado, funcional sin backend.

### Backend — pendiente

- [ ] `GET /products` con el inventario real: al conectarlo en
  `features/catalogo/api.ts`, catálogo y chat quedan servidos por el API sin
  cambios adicionales.
- [ ] Servicio conversacional en .NET (Semantic Kernel u orquestador
  equivalente) detrás de `/api/v1/ai/chat`, reutilizando el contrato JSON y
  el system prompt del frontend (`providers/schema.ts`,
  `providers/systemPrompt.ts`).
- [ ] Búsqueda semántica/embeddings sobre el inventario real (hoy el
  grounding es por prompt con el catálogo completo — viable mientras el
  catálogo sea pequeño).
- [ ] Endpoint `/v1/quotes` que envíe el correo real de cotización.
- [ ] Credenciales del proveedor IA guardadas en el servidor (ver Seguridad).

### Manejo de errores y feedback

- [x] Sin resultados → respuesta explicativa con categorías sugeridas.
- [x] Errores del proveedor IA se registran (`logger`) y el hilo muestra un
  mensaje amable sin romper la conversación.
- [x] Timeouts de 60 s por petición (`AbortSignal.timeout` / timeout del SDK).
- [x] Respuestas del modelo que no cumplen el contrato JSON se rechazan
  (validación Zod) y se tratan como error controlado.
- [ ] Reintentos automáticos ante errores transitorios (backend).

## Requisitos no funcionales

### Seguridad

- [x] Entradas del usuario saneadas (trim) y **prompt limitado a 500
  caracteres** (en el input y de nuevo en la capa de datos).
- [x] Ids de producto devueltos por el modelo validados contra el catálogo.
- [x] El system prompt restringe al asistente a temas del vivero.
- [ ] **API keys protegidas en el servidor.** ⚠️ Limitación conocida y
  documentada: en el modo LLM actual la key vive en el navegador
  (`VITE_AI_API_KEY`) y es visible para cualquier visitante — aceptable solo
  para desarrollo/demo. Producción requiere el backend. Ver `docs/chat-ia.md`.

### Componentes (implementados)

| Componente | Ubicación |
|---|---|
| Widget + panel del chat | `src/features/chat/components/ChatWidget.tsx` |
| Hilo de mensajes + tarjetas de producto | `src/features/chat/components/ChatMessages.tsx` |
| Tarjeta de cotización (confirmar / enviar / mailto) | `src/features/chat/components/QuoteCard.tsx` |
| Despachador mock/LLM + envío de cotización | `src/features/chat/api.ts` |
| Fuente de inventario (capa de datos compartida) | `src/features/chat/hooks/useChat.ts` → `fetchProducts` de `features/catalogo/api.ts` |
| Selección de proveedor y conectores | `src/features/chat/providers/` (`claude.ts`, `openai.ts`, `gemini.ts`) |
| System prompt con inventario + historial | `src/features/chat/providers/systemPrompt.ts` |
| Contrato JSON + validación Zod | `src/features/chat/providers/schema.ts` |
| Estado de la conversación | `src/features/chat/store/chatStore.ts` |
| DTOs (`ChatResponseDto`, `QuoteRequestDto`, `ChatIntent`) | `src/types/api.ts` |

### Validaciones

- [x] Longitud del mensaje (máx. 500 caracteres).
- [x] Intención detectada (enum validado con Zod).
- [x] Existencia de los productos retornados (ids contra el catálogo).

### Estados

- [x] Procesando solicitud (indicador "escribiendo…", envío bloqueado).
- [x] Resultados encontrados (texto + tarjetas de producto).
- [x] Sin resultados (respuesta explicativa).
- [x] Error interno (mensaje amable en el hilo + registro).
- [x] Cotización: en curso → lista para confirmar → enviada.

### Accesibilidad

- [x] Botones con `aria-label`, indicador de escritura con `role="status"`,
  panel con focus trap (vaul/Radix), navegable por teclado.

## Definición de terminado (DoD)

- [x] Frontend implementado con pruebas automatizadas (motor mock, selección
  de proveedor y fallback, parseo/validación del contrato, widget end-to-end,
  tarjeta de cotización) — 22 tests del módulo chat, suite completa en verde.
- [x] Integración verificada con un proveedor real (Gemini
  `gemini-3.5-flash`): recomendaciones correctas por id contra el inventario.
- [x] Documentación técnica (`docs/chat-ia.md`): configuración, proveedores,
  flujo de cotización, advertencia de seguridad y plan de migración al backend.
- [ ] Backend Semantic Kernel configurado con contrato OpenAPI
  (`/api/v1/ai/chat`).
- [ ] Envío real de correos de cotización (`/v1/quotes`).
- [ ] Observabilidad y métricas del servicio (backend).
- [ ] Validación funcional y aprobación de QA/PO.
---
## ST-CAT-01 — Catálogo de Productos — Pantallas de Inicio, Catálogo y Detalle
**Layer:** both
**Priority:** high
**Status:** in-review
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
---
## ST-MKT-01 — Generación de Feeds Automatizados para Meta Business Suite
**Layer:** backend
**Priority:** high
**Status:** in-review
# ST-MKT-01 — Generación de Feeds Automatizados para Meta Business Suite

**Como** administrador de la plataforma  
**Quiero** que el sistema genere feeds dinámicos de productos en formatos XML y JSON  
**Para** sincronizar automáticamente el catálogo con Meta Commerce Manager.

## Descripción

Implementar un servicio backend responsable de generar feeds de productos compatibles con Meta Commerce Manager. La solución debe soportar catálogos de gran tamaño, optimizar el consumo de recursos y exponer endpoints seguros para el acceso automatizado por parte de los servicios de Meta.

## Criterios de aceptación

- El sistema debe generar un feed en formato XML compatible con Meta Commerce Manager.
- El sistema debe generar un feed equivalente en formato JSON.
- Los feeds deben incluir únicamente productos activos y disponibles.
- El proceso de generación debe soportar paginación del inventario.
- Los endpoints deben estar protegidos mediante un token de acceso estático.
- El sistema debe soportar catálogos de gran volumen sin degradar significativamente el rendimiento.
- Los feeds deben poder ser consumidos automáticamente por herramientas externas.

### Manejo de errores y feedback

- Se debe retornar HTTP 401 cuando el token de acceso sea inválido.
- Se debe registrar en logs cualquier error durante la generación del feed.
- Se debe retornar HTTP 500 cuando ocurra un error interno de procesamiento.
- Se debe implementar manejo de timeout para evitar bloqueos prolongados.

## Requisitos no funcionales

### Seguridad

- Los endpoints deberán requerir un token de acceso configurable.
- El token no debe exponerse en logs ni mensajes de error.
- Debe implementarse limitación de acceso para evitar abusos.

### Componentes

- Servicio `CatalogFeedService`.
- Serializadores XML y JSON.
- Controladores REST para exposición de feeds.
- Sistema de caché y/o streaming.

### Validaciones

- Validar existencia y estado activo del producto.
- Validar disponibilidad de precio e imágenes.
- Validar formato de salida antes de responder.

### Estados

- Generación en proceso.
- Feed generado exitosamente.
- Error de generación.
- Feed obtenido desde caché.

### Accesibilidad

- No aplica al tratarse de un componente backend.

## Definición de terminado (DoD)

- Código implementado y revisado.
- Cobertura de pruebas unitarias y de integración.
- Documentación OpenAPI actualizada.
- Validación funcional con Meta Commerce Manager.
- Logs y monitoreo configurados.
---
## ST-MKT-02 — Inyección Dinámica de Metadatos OpenGraph y SEO
**Layer:** frontend
**Priority:** high
**Status:** in-review
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
---
## ST-SEC-01 — Pantalla de Login y Recuperación de Contraseña (Frontend)
**Layer:** frontend
**Priority:** high
**Status:** in-review
# ST-SEC-01 — Pantalla de Login y Recuperación de Contraseña (Frontend)

**Como** usuario registrado de la aplicación  
**Quiero** disponer de una interfaz de inicio de sesión y un flujo visual para recuperar mi contraseña  
**Para** poder acceder a mi cuenta de forma sencilla, segura y autónoma.

## Descripción

Implementar la interfaz de usuario para el proceso de autenticación y recuperación de contraseña, incluyendo validaciones en tiempo real, manejo de estados visuales, accesibilidad y experiencia de usuario. La historia contempla únicamente el desarrollo del frontend y la integración con servicios ya existentes.

## Criterios de aceptación

### Login

- [ ] La pantalla debe renderizar los siguientes elementos:
  - Campo **Correo Electrónico**.
  - Campo **Contraseña**.
  - Botón **Iniciar Sesión**.
  - Enlace **¿Olvidaste tu contraseña?**.

- [ ] El campo de correo electrónico debe validar en tiempo real el formato `usuario@dominio.com`.

- [ ] El campo de contraseña debe:
  - Mostrarse enmascarado por defecto.
  - Permitir alternar entre mostrar y ocultar la contraseña mediante un icono.

- [ ] El botón **Iniciar Sesión** debe permanecer habilitado únicamente cuando el formulario sea válido.

- [ ] Al enviar el formulario:
  - El botón debe deshabilitarse.
  - Debe mostrarse un indicador visual de carga (spinner).
  - Deben evitarse múltiples envíos simultáneos.

### Recuperación de contraseña

- [ ] Al seleccionar **¿Olvidaste tu contraseña?**, el usuario debe navegar a una vista secundaria o visualizar un modal.

- [ ] La pantalla de recuperación debe solicitar únicamente el correo electrónico registrado.

- [ ] El correo electrónico debe validarse en tiempo real.

- [ ] Tras una respuesta exitosa del servicio, debe mostrarse el mensaje:

> Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en breve.

- [ ] La interfaz no debe mostrar mensajes diferenciados según exista o no el correo.

### Manejo de errores y feedback

- [ ] Si la autenticación falla, debe mostrarse el mensaje:

> Correo electrónico o contraseña incorrectos.

- [ ] Ante errores de red o errores inesperados, debe mostrarse una notificación global mediante toast, snackbar o alerta.

- [ ] Los mensajes de error deben ser claros para el usuario y no exponer información técnica.

## Requisitos no funcionales

### Seguridad

- [ ] Sanitizar los datos ingresados antes de enviarlos al backend.
- [ ] Evitar mostrar información sensible en mensajes de error.
- [ ] Prevenir múltiples solicitudes simultáneas.

### Accesibilidad

- [ ] Todos los controles deben ser navegables mediante teclado.
- [ ] Los campos y botones deben incluir atributos `aria-label`.
- [ ] El flujo debe ser compatible con lectores de pantalla.

### UX/UI

- [ ] Implementar los estilos definidos en `technical-preferences.md`.
- [ ] Mantener consistencia visual con el sistema de diseño.
- [ ] Garantizar visualización responsive en desktop y dispositivos móviles.
- [ ] Implementar estados visuales para loading, error, foco y éxito.

## Tareas técnicas

### Componentes

- [ ] Implementar componente de Login.
- [ ] Implementar componente/modal de recuperación de contraseña.
- [ ] Implementar componente reutilizable para notificaciones.

### Validaciones

- [ ] Implementar validación de correo electrónico.
- [ ] Implementar validación del formulario.
- [ ] Implementar control de múltiples envíos.

### Estados

- [ ] Implementar estados de carga.
- [ ] Implementar estados de error.
- [ ] Implementar estados de éxito.
- [ ] Implementar navegación entre vistas.

### Accesibilidad

- [ ] Configurar navegación por teclado.
- [ ] Agregar atributos ARIA.
- [ ] Validar compatibilidad con lectores de pantalla.

## Definición de terminado (DoD)

- [ ] Todos los criterios de aceptación implementados.
- [ ] La interfaz es responsive.
- [ ] Las validaciones frontend funcionan correctamente.
- [ ] Las pruebas visuales y funcionales son satisfactorias.
- [ ] La accesibilidad básica ha sido validada.
- [ ] La historia ha sido aprobada por QA y Product Owner.
---
<!-- AGENT_DOCS_END -->