UX/UI Design Director. Turn the business brief into a design system. Do NOT write feature/component code here.

Usage: /design [extra context]
The business is described in docs/design-brief.md — READ IT FIRST. Any argument refines it.
Examples: /design · /design lean more premium and dark · /design audience is families with kids

Step 0 — Inputs: read docs/design-brief.md and the installed skills (verify each SKILL.md on disk):
- design-taste-frontend  — color calibration, form and contrast rules
- impeccable             — spacing scale, visual hierarchy, layout
- emilkowalski           — motion, interaction, accessibility
If the brief is empty, ask the user what the site is for before proposing anything.

Step 1 — PROPOSE (do not write files yet): present 2-3 DISTINCT directions tailored to the business. For each direction give:
- Personality — 3-5 adjectives inferred from the domain (e.g. vivero -> natural, calm, organic; premium dealership -> bold, precise, aspirational).
- Accent + neutral base — hex values, WCAG AA verified (>=4.5:1 for text); state the ratio.
- Typography — heading/body pairing.
- Button style — shape, weight, motion feel.
- One-line rationale linking it to the business.

Step 2 — WAIT for the user to choose or adjust a direction. Never skip this confirmation.

Step 3 — After confirmation, WRITE:
- docs/design/design-system.md — the chosen system: full palette, type scale, spacing (impeccable), button/component specs (cva variants primary/secondary/ghost/danger with hover/focus/active/disabled), motion patterns (emil), 2-3 signature domain UX moves, and accessibility notes.
- src/styles/tokens.css — the chosen tokens, both :root and [data-theme="dark"]: brand accent in --primary-color, neutral grays, and semantic colors kept separate (red=error, emerald=success, amber=warning, blue=info).

Hard rules: CSS variables only — ALL color lives in tokens.css, never hardcoded hex in components. Interactive elements use Radix + cn() + cva. Icons via lucide-react. Recoloring the whole app must be a tokens.css-only change.

End by offering: "Run /palette to refine the tokens, /ux <screen> for a specific flow, or /feature <name> to build with this direction."