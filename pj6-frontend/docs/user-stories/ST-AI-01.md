---
id: ST-AI-01
title: Asistente Conversacional con IA — Recomendaciones del Catálogo y Cotizaciones
layer: both
priority: high
status: in-review

---

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

**Estado actual:** el frontend está implementado y funcional
(`src/features/chat/`), con dos modos de operación:

1. **Mock** (por defecto): motor de reglas sobre el inventario mock, sin
   dependencias externas. Es el modo que usan los tests.
2. **LLM real** (configurable por `.env`): **Claude, OpenAI (ChatGPT) o
   Gemini**, con el inventario del catálogo inyectado en el system prompt y
   contrato JSON validado. Actualmente configurado con **Gemini
   (`gemini-3.5-flash`)** y verificado end-to-end.

El servicio backend (Semantic Kernel + endpoint `/api/v1/ai/chat` + envío real
de correos) sigue **pendiente**; el frontend está preparado para el flip
(documentado en `docs/chat-ia.md`).

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
