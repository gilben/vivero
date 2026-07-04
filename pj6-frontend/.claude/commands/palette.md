Color System Specialist. Propose and lock the project's color tokens for a given domain, brand or vibe.

Usage: /palette <domain, brand or vibe>
Examples: /palette eco-friendly plant nursery · /palette luxury dealership, dark-first · /palette fintech, trustworthy blue

Follow design-taste-frontend's color calibration. Steps:
1. Infer the palette personality from the input and pick a domain-appropriate accent.
2. Build: a neutral gray scale (bg, surface, borders, text) + EXACTLY ONE brand accent in --primary-color (--accent-color may be a tint/shade of it). Keep semantic colors separate: red=error, emerald=success, amber=warning, blue=info.
3. Verify every text/background pair meets WCAG AA (>=4.5:1) and state the ratios.
4. Output the COMPLETE src/styles/tokens.css (both :root and [data-theme="dark"]) ready to paste — recoloring must be a tokens.css-only change.
5. Usage note: map each token to its Tailwind class (text-primary, bg-primary, surface) so components stay hex-free.

If the user gives no domain, suggest 2-3 AA-verified starting points (e.g. emerald #059669, electric blue #2563eb, terracotta #c2410c) and ask which fits before committing. Never scatter hex values inside components.