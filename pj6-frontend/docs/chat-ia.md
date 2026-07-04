# Chat IA — proveedores, recomendaciones y cotizaciones

El asistente del vivero (`src/features/chat/`) puede funcionar con un motor
mock (por defecto) o conectado a un LLM real: **Claude, OpenAI o Gemini**.

## Configuración

En `.env`:

```
VITE_AI_PROVIDER=claude        # mock | claude | openai | gemini
VITE_AI_API_KEY=sk-...         # API key del proveedor elegido
VITE_AI_MODEL=                 # opcional; defaults abajo
VITE_QUOTE_EMAIL=ventas@pj6vivero.com
```

| Proveedor | Modelo por defecto | Mecanismo |
|---|---|---|
| `claude` | `claude-opus-4-8` | SDK oficial `@anthropic-ai/sdk` (import dinámico) con **structured outputs** (`messages.parse` + `zodOutputFormat`) — la respuesta llega validada contra el esquema |
| `openai` | `gpt-4o-mini` | `fetch` a Chat Completions con `response_format: json_object` |
| `gemini` | `gemini-3.5-flash` | `fetch` a `generateContent` con `responseMimeType: application/json` |

Sin `VITE_AI_API_KEY` el chat cae automáticamente al mock (nunca queda roto).
Los tests siempre usan el mock (`.env.test`).

## ⚠️ Seguridad — leer antes de usar en producción

**Una API key en el frontend es pública.** Cualquier visitante puede abrir las
DevTools y extraerla (el SDK de Anthropic exige el opt-in explícito
`dangerouslyAllowBrowser` justamente por esto). Este modo existe para
**desarrollo y demos**. En producción:

1. El chat debe llamar al backend (`/api/v1/ai/chat`, historia ST-AI-01), que
   guarda las credenciales del proveedor en el servidor.
2. El flip está preparado: `sendChatTurn` en `features/chat/api.ts` pasa a
   llamar `apiClient.post('/v1/ai/chat', ...)` y la capa `providers/` se mueve
   al backend tal cual (el system prompt y el esquema son reutilizables).

## Cómo funciona

- **Grounding en el catálogo:** el system prompt
  (`providers/systemPrompt.ts`) incluye el inventario real (id, nombre,
  precio COP, luz, riego, stock). El modelo solo puede recomendar por `id`;
  ids inventados se descartan al validar (`providers/schema.ts`) y solo se
  recomiendan productos disponibles.
- **Contrato JSON:** todos los proveedores devuelven
  `{reply, intent, productIds, quote}`, validado con Zod. Intenciones:
  `saludo · conversacion · buscar-productos · sin-resultados · cotizacion`.
- **Multi-turno:** se envían los últimos 12 mensajes del hilo, lo que permite
  al modelo recopilar datos de cotización a lo largo de varios turnos.
- **Timeouts:** 60 s por petición (`AbortSignal.timeout` / timeout del SDK);
  los errores se registran con `logger` y el hilo muestra un mensaje amable.

## Flujo de cotización

1. El cliente pide una cotización; el asistente recopila conversacionalmente
   nombre, correo, teléfono y productos/cantidades (un dato por turno).
2. Con todos los datos, el modelo responde `intent: "cotizacion"` con `quote`
   completo; el hilo muestra la **tarjeta de resumen** (`QuoteCard`) para que
   el cliente confirme.
3. "Enviar solicitud" llama `sendQuoteRequest` — hoy **simulado** (el
   navegador no puede enviar correos por sí solo). Cuando exista el backend,
   el cuerpo pasa a ser `apiClient.post('/v1/quotes', quote)` y el backend
   envía el correo a `VITE_QUOTE_EMAIL`.
4. Mientras tanto, la tarjeta ofrece el fallback "o envíala desde tu correo"
   (`mailto:` prellenado), que sí funciona hoy sin backend.

## Probarlo

```
# .env → VITE_AI_PROVIDER=claude + VITE_AI_API_KEY=sk-ant-...
npm run dev
```

Abrir el asistente y probar: "¿qué me recomiendas para un apartamento con
poca luz?" · "quiero una cotización de 10 materos de barro".
