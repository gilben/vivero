# docs — pj6-backend

This folder is the **source of truth** for the backend agent.

## Structure

```
docs/
├── user-stories/     ← User stories (.md files, one per story)
├── api-contracts/    ← OpenAPI specs or endpoint descriptions
└── README.md
```

## Adding a user story

Create a `.md` file in `user-stories/` following the frontmatter format:

```markdown
---
id: US-001
title: User registration
layer: backend
priority: high
status: pending
---
```

Then run from the project root:

```bash
npx agent-docs
```

This injects all stories into `.cursorrules` and `CLAUDE.md`.
