# Design System — Vivero Fresco (pj6)

> Chosen direction (confirmed 2026-07-03): **A — Vivero Fresco**.
> Natural, calm, organic, honest, airy. The plants are the heroes; the UI stays
> quiet and lets photography carry the warmth.
> Source of truth for tokens: `src/styles/tokens.css`. Recoloring the app is a
> tokens.css-only change — always.

---

## 1. Palette

Strategy: **restrained** — neutral stone base + exactly ONE brand accent
(deep leaf green). Semantic colors are separate and never repurposed as brand.

### Light (`:root`)

| Token | Hex | Role | Contrast (vs bg unless noted) |
|---|---|---|---|
| `--bg-color` | `#fafaf9` | page background (cool off-white, chroma ≈ 0 — deliberately not cream/beige) | — |
| `--surface-color` | `#ffffff` | cards, panels, inputs | — |
| `--primary-color` | `#2d6a4f` | brand accent: CTAs, links, active states | **6.4:1** on white — AA ✓ (white text on it also 6.4:1 ✓) |
| `--accent-color` | `#1b4332` | pressed/hover shade of primary, emphasis | **11.1:1** on white ✓ |
| `--text-color` | `#1c1917` | primary text (warm-neutral ink) | ~16:1 ✓ |
| `--text-muted` | `#57534e` | secondary text, captions | **7.3:1** ✓ |
| `--border-color` | `#e7e5e4` | hairlines, input borders | decorative (3:1 not required) |

### Dark (`[data-theme="dark"]`)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bg-color` | `#14201a` | green-tinted charcoal (never pure black) | — |
| `--surface-color` | `#1c2a22` | cards, panels | — |
| `--primary-color` | `#7fbf9b` | brand accent on dark | **7.9:1** on bg ✓ (dark ink text on it 7.9:1 ✓) |
| `--accent-color` | `#a7d7bd` | hover/emphasis shade | ~10:1 ✓ |
| `--text-color` | `#e7e5e4` | primary text | ~13:1 ✓ |
| `--text-muted` | `#a8a29e` | secondary text | ~6.9:1 ✓ |
| `--border-color` | `#2a3a30` | hairlines | — |

### Semantic (never brand, never repurposed)

| Meaning | Light | Dark | Light contrast on bg |
|---|---|---|---|
| Error | `#dc2626` | `#f87171` | 4.8:1 ✓ |
| Success | `#047857` | `#34d399` | 5.5:1 ✓ (distinct from brand green: bluer, brighter) |
| Warning | `#b45309` | `#fbbf24` | 5.0:1 ✓ |
| Info | `#2563eb` | `#60a5fa` | 5.2:1 ✓ |

Rule: brand green (`--primary-color`) marks *interaction*; success emerald
marks *outcome*. A "plant added to cart" toast uses success, not primary.

---

## 2. Typography

**One family, weight contrast** (no similar-sans pairing): **Satoshi**
(humanist-geometric, Fontshare — free license), fallback `Inter → system-ui`.

- Install (follow-up task, not part of /design): self-host Satoshi woff2 via
  `@font-face` + `font-display: swap` in `globals.css`. Until then the Inter/
  system fallback in `--font-sans` renders correctly.

| Level | Size | Weight | Notes |
|---|---|---|---|
| Display (hero) | `clamp(2.25rem, 5vw, 3.75rem)` | 700 | `tracking -0.02em`, `text-wrap: balance`, max 2 lines |
| H1 (page title) | `2rem` / `text-3xl` | 700 | |
| H2 (section) | `1.5rem` / `text-2xl` | 600 | |
| H3 (card/group) | `1.125rem` / `text-lg` | 600 | |
| Body | `1rem`, `leading-relaxed` | 400 | max width `65ch` |
| Small / meta | `0.875rem` | 400–500 | `--text-muted` |
| Botanical name | `0.875rem` italic | 400 | *Monstera deliciosa* — muted, under the common name |

Letter-spacing floor on display type: never tighter than `-0.04em`.
No eyebrows/kickers as default scaffolding — max 1 per 3 sections.

---

## 3. Spacing & Layout (impeccable)

4px base scale — existing tokens stay: `4 / 8 / 16 / 24 / 32 / 48` plus
section spacing `64 (--spacing-3xl)` and `96 (--spacing-4xl)`.

- Page container: `max-w-7xl mx-auto px-4 md:px-6`.
- Catalog grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6`
  (product cards); responsive without breakpoints where possible:
  `repeat(auto-fit, minmax(240px, 1fr))`.
- Vertical rhythm: sections `py-16 md:py-24`; inside a section, heading →
  content gap `--spacing-lg`.
- Cards only where elevation means something (product = card; filters,
  metadata lists = `divide-y` / whitespace). **Never nested cards.**
- Full-height heroes: `min-h-[100dvh]`, never `h-screen`.
- z-index scale (semantic, no 999s): dropdown 10 → sticky 20 →
  modal-backdrop 30 → modal 40 → toast 50 → tooltip 60.

---

## 4. Buttons (cva spec)

Shape: **soft 12px radius** (`--radius-lg`) — calm, organic. Pills reserved
for filter chips and badges. `Button.tsx` currently uses `--radius-md`;
switch it to `--radius-lg` on the next component pass.

Base (all variants): `inline-flex items-center justify-center gap-2
rounded-[var(--radius-lg)] font-medium select-none transition-[transform,background-color,color]
duration-150 ease-out focus-visible:outline-none focus-visible:ring-2
focus-visible:ring-primary focus-visible:ring-offset-2
active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none`

| Variant | Rest | Hover | Active | Disabled |
|---|---|---|---|---|
| `primary` | bg `--primary-color`, text white (dark theme: text `#14201a`) | bg `--accent-color` | scale 0.97 (base) | 50% opacity, no events |
| `secondary` | bg `--surface-color`, text `--text-color`, border `--border-color` | border + text shift to `--primary-color` | scale 0.97 | idem |
| `ghost` | transparent, text `--text-color` | bg `color-mix(in srgb, var(--primary-color) 8%, transparent)` | scale 0.97 | idem |
| `danger` | bg `--error-color`, text white | darken (`#b91c1c` via token `--error-strong`) | scale 0.97 | idem |

Sizes: `sm h-8 px-3 text-sm` · `md h-10 px-4` · `lg h-12 px-6 text-base`.
Icon sizes (lucide): 16 inline, 20 in buttons, 24 standalone.
CTA labels: 1–3 words, one line at desktop, one label per intent per page.

---

## 5. Motion (emil)

Personality: calm and responsive — fast, no bounce, no decoration loops.

- **Tokens:** `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`,
  `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`,
  `--duration-fast: 150ms`, `--duration-base: 200ms`, `--duration-slow: 300ms`.
- Standard entrance (motion/react, inside `<AnimatePresence>`):
  `initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}` — 200ms ease-out.
- Press feedback everywhere pressable: `scale(0.97)`, 150ms ease-out.
- Durations: tooltips 125–200ms · dropdowns/selects 150–250ms ·
  modals/drawers (vaul) 250–400ms with the drawer curve
  `cubic-bezier(0.32, 0.72, 0, 1)`. Everything UI stays ≤ 300ms.
- Never `ease-in`; never animate from `scale(0)` (floor 0.95 + opacity);
  never `transition: all`; only animate `transform`/`opacity`.
- Popovers/dropdowns scale from their trigger:
  `transform-origin: var(--radix-popover-content-transform-origin)`.
- Keyboard-initiated actions: no animation.
- Catalog grid entrance: stagger 40ms/item, `once: true`, never blocks input.
- `prefers-reduced-motion: reduce` → keep opacity fades, drop movement
  (`useReducedMotion()` in every animated component).

---

## 6. Signature domain UX moves

1. **Photography-first product card.** 4:5 image, hairline border
   (`--border-color`), no drop shadow at rest; on hover the image scales to
   1.03 (300ms ease-out) inside `overflow-hidden` — the card itself doesn't
   move. Common name (H3) + botanical name in italic muted underneath +
   price. Alt text always from the backend `altText` field.
2. **Care-glyph badges.** Every plant card/detail shows quick-scan care
   icons (lucide): `Sun`/`CloudSun`/`Cloud` (light), `Droplets` (water
   1–3), `Sprout` (difficulty). Icon-only → `aria-label` required
   ("Riego: moderado"). Color: muted ink, never semantic colors.
3. **Ambiente filter chips.** Horizontal scroll-snap pill chips (Interior ·
   Exterior · Sombra · Sol pleno · Materos…) above the catalog grid; active
   chip = primary bg. Filters are instant (client-side over the cached
   query) — no "apply" button.
4. **Skeletons shaped like the grid.** Loading states mirror the product
   card layout (image block + two text lines); no spinners. Mock latency
   600–800ms makes them visible in dev.

---

## 7. Accessibility notes

- All text AA ≥ 4.5:1 (verified per token above); large text ≥ 3:1.
- Focus visible on every interactive element: 2px ring in `--primary-color`
  with 2px offset.
- Radix primitives for all interactive elements (dialog, dropdown, select,
  tooltip, tabs…), which gives keyboard + focus-trap behavior for free.
- Hover effects gated behind `@media (hover: hover) and (pointer: fine)`.
- Icon-only buttons: `aria-label`. Images: backend `altText`.
- Placeholders are not labels; labels above inputs, errors below (form rules).
- Dark mode is first-class: both themes ship from day one via
  `[data-theme="dark"]`; theme lock — sections never invert individually.
