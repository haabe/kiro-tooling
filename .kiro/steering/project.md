---
inclusion: always
description: project project identity, tech stack, structure, and constraints
---

# project Project Context

## Product

Project description

## Personas

- Name, Age — Description
## Constraints

- Constraint 1
- Constraint 2
- ...

## Tech Stack

- Language
- Framework
- Tooling
- +++

## Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Dev server (localhost:5173) |
| `pnpm build` | TypeScript check + Vite build |
| `pnpm test` | Run all tests once (no --run flag) |
| `pnpm lint` | Biome check |
| `pnpm validate` | typecheck + lint + test (full CI gate) |

## Project Structure

```
src/
├── components/    # Application components (presentation)
├── and_so_on/     # Further descriptions
```

## Data Flow

Point 1 → Next point → Next point → ... and so on

## Naming

| Element | Convention | Example |
|---------|-----------|---------|
| Types/Interfaces | PascalCase | `BaseNode`, `ProjectSchema` |
| Functions/Variables | camelCase | `addNode`, `currentProject` |
| Constants | UPPER_SNAKE_CASE | `NODE_TYPE_REGISTRY` |
| Components (files) | PascalCase | `FlowCanvas.tsx` |
| Modules (files) | kebab-case | `node-store.ts` |
| Tests | source + `.test` | `node-store.test.ts` |
| Property tests | source + `.property.test` | `node-registry.property.test.ts` |

## Security

- Security description
- ... and more

## Global Steering

Global principles in `~/.kiro/steering/` apply (tool reference, workflow decisions, PBT strategy, code quality, backlog capture). This file provides project-specific context only.
