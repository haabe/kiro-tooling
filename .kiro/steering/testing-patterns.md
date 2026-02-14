---
inclusion: fileMatch
fileMatchPattern: '**/*.{test,spec}.*'
description: project-specific PBT generators, property patterns, and test conventions
---

# project Testing Patterns

General PBT strategy is in `~/.kiro/steering/04-testing-strategy.md`. This file covers project-specific patterns only.

## project Generators

| Generator | Construction | Notes |
|-----------|-------------|-------|
| `nodeTypeArb` | `fc.constantFrom(...Object.values(NodeType))` | All valid node types |
| `positionArb` | `fc.record({ x: fc.integer(0, 5000), y: fc.integer(0, 5000) })` | Canvas coordinates |
| `nodeArb` | `fc.record({ id: fc.uuid(), type: nodeTypeArb, position: positionArb, collapsed: fc.boolean(), data: fc.constant({}) })` | Base node |
| `projectArb` | Build from `nodeArb` array, `.map()` to prepend master output node | Always includes exactly one master output |

## project Property Patterns

### Master Output Invariant
After any sequence of operations, exactly one master output node exists and it cannot be deleted.

### Node ID Uniqueness
All node IDs in a project are unique after any add/remove sequence.

### Persistence Round-Trip
`load(save(project))` deeply equals the original project (Zod schema validates both directions).

## Counterexample Triage

When a property test fails:
1. **Test wrong?** — Does the property match the spec? Fix the test.
2. **Code wrong?** — Does the code violate the spec? Fix the code.
3. **Spec wrong?** — Is the spec missing something? Ask the user before changing.

Never change acceptance criteria without user input.

## Test File Conventions

- Unit tests: `foo.test.ts` (co-located with source)
- Property tests: `foo.property.test.ts` (co-located with source)
- Link properties to design: `**Validates: Requirements X.Y**`
- Min 100 iterations: `{ numRuns: 100 }`

## Console Output

Suppress `fake-indexeddb` noise: `onConsoleLog: (log) => log.includes('indexedDB') ? false : undefined`

## Running Tests

`pnpm test` (runs once, exits). `pnpm test:coverage` for coverage. Never use `--run` flag or `vitest` directly.
