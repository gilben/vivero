# UX/UI Skills

These skills define the design rules for this project.
Agents read them from `.agents/skills/` (and `.claude/skills/` for impeccable).

> Verification rule: a skill is installed ONLY if its SKILL.md exists on disk.
> Do not trust the checkmarks below without checking the paths.

## Status

### emilkowalski ✓ installed
Animations, interactions, accessibility (sonner, vaul, motion patterns)
Verify: `.agents/skills/emil-design-eng/SKILL.md`

```bash
npx skills add emilkowalski/skill
```

### impeccable ⚠ needs manual install
Spacing system, visual hierarchy, layout consistency + anti-pattern detector
Verify: `.agents/skills/impeccable/SKILL.md`

```bash
npx impeccable skills install --yes
```

Windows: if it fails with `'unzip' is not recognized`, add an `unzip.cmd` shim
on PATH that runs `tar -xf %2 -C %4` (create %4 first), then retry.

Quality gate after building UI:

```bash
npx impeccable detect src/
```

### design-taste-frontend ✓ installed
Aesthetic refinement, color calibration, form/contrast rules
Verify: `.agents/skills/design-taste-frontend/SKILL.md`

```bash
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"
```

## How to install manually

Run from the project root:

```bash
node install-skills.js
```