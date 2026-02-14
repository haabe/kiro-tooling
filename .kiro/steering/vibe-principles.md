---
inclusion: fileMatch
fileMatchPattern: '**/*.{css,tsx,jsx}'
description: Visual, interaction, and architecture principles to prevent vibe-coded feel
---

# Vibe Prevention Principles

Reference principles only — checklists are in `pre-commit` and `vibe-check` hooks.

## Visual Consistency

- 8-point grid for all spacing (4px for tight spaces). No ad-hoc values.
- One border-radius token per component category. No per-element improvisation.
- One shadow style per elevation level. Reuse everywhere.
- Colors from defined palette only. Every color serves hierarchy (primary, secondary, muted, danger).
- One type ramp with consistent sizes and line heights. No excessive bold/light.
- Single icon set, proportional to adjacent text. No emoji as UI elements.

## Interaction Quality

- Every button, toggle, collapsible, and link must work. No `href="#"`.
- Loading states mandatory for all async operations (IndexedDB, save, init).
- Animations: subtle with proper easing, or none. No bounce/wiggle/overshoot.
- Keyboard navigation required for all interactive elements (Riley persona). `:focus-visible` for focus styles.

## Architecture Consistency

| Concern | Pattern | Never |
|---------|---------|-------|
| State | Zustand + Immer | Direct setState, Redux, Context for global |
| Validation | Zod schemas | Manual if-checks, joi, yup |
| Persistence | IndexedDB adapter | localStorage, direct IDB from components |
| Styling | CSS files per component | CSS-in-JS, inline styles, Tailwind |
| Testing | Vitest + fast-check | Jest, Mocha, ad-hoc runners |

One pattern per concern. New patterns replace old ones everywhere — no coexistence.

## DRY Enforcement

Extract immediately when duplication appears across 2+ files. Watch for: duplicated validation logic, repeated store access patterns, similar error handling boilerplate.

## Responsiveness

- Test at 320px, 768px, 1024px, 1440px minimum
- Container queries for component-level adaptation
- Media queries only for app-level layout shifts
- Text must never overflow its container

## Content & Copy

- Specific, grounded copy. No generic taglines ("Build your dreams").
- Correct copyright, descriptive page title, meta description, OG image, favicon.

## Security Awareness

- Validate all IndexedDB data on load (could be corrupted/tampered)
- Zod at boundaries. No `eval()`, `innerHTML`, `dangerouslySetInnerHTML`.
- File imports (future): validate format, size, content before parsing.
