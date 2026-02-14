---
inclusion: fileMatch
fileMatchPattern: '**/*.{css,tsx,jsx}'
description: CSS patterns, design tokens, and semantic HTML reference for project
---

# CSS & HTML Reference

## Semantic HTML Elements

| Element | Purpose | project Use |
|---------|---------|------------|
| `<header>` | Page/section header | MenuBar |
| `<main>` | Primary content | Canvas workspace |
| `<aside>` | Complementary content | NodePalette sidebar |
| `<nav>` | Navigation | Menu navigation (future) |
| `<section>` | Thematic grouping | Feature sections |
| `<button type="button">` | Actions | Always specify `type` to prevent form submission |

ARIA landmarks (`role="main"`, `role="complementary"`) provide explicit clarity for assistive tech.

## Design Token Usage

Always use `var(--token)` — never hardcode hex/rgb values in component CSS.

```css
/* ✅ */ background: var(--color-bg-primary);
/* ✅ */ padding: var(--space-md);
/* ❌ */ background: #1a1a2e;
/* ❌ */ padding: 13px;
```

## 8-Point Grid

All spacing must be multiples of 8px (4px for tight spaces):

```css
--space-xs: 4px;   --space-sm: 8px;
--space-md: 16px;  --space-lg: 24px;  --space-xl: 32px;
```

## Logical Properties

Use logical properties for RTL support:

| Physical | Logical |
|----------|---------|
| `margin-left/right` | `margin-inline` |
| `margin-top/bottom` | `margin-block` |
| `padding-left/right` | `padding-inline` |
| `padding-top/bottom` | `padding-block` |
| `left/right` | `inset-inline` |
| `width` | `inline-size` |
| `height` | `block-size` |

## Container Queries

Use container queries for component-level responsiveness (nodes, panels). Media queries only for app-level layout shifts.

```css
.node { container-type: inline-size; container-name: node; }

@container node (max-width: 220px) {
  .node__content { padding-inline: var(--space-sm); font-size: 0.875rem; }
}
```

Container query units: `cqw` (1% container width), `cqi` (1% inline size), `cqb` (1% block size).

Naming: name containers for clarity. Use content-based breakpoints, not device-based. Modify children inside `@container`, never the container itself (avoids loops).

## CSS Math Functions

```css
/* clamp(MIN, PREFERRED, MAX) — fluid sizing */
font-size: clamp(0.875rem, 2vw + 0.5rem, 1.25rem);
padding: clamp(0.5rem, 3cqi, 2rem);

/* min() — responsive upper bound */
width: min(300px, 90cqi);

/* max() — responsive lower bound, accessibility */
min-height: max(44px, 3rem);  /* touch-friendly */
```

Use `rem` units in clamp() for accessibility (respects user font preferences).

## Modern CSS Patterns

- ✅ `:focus-visible` (not `:focus`)
- ✅ `gap` property (not margins on children)
- ✅ CSS Grid for 2D layouts, Flexbox for 1D
- ✅ CSS custom properties for all design values
- ❌ No `!important` (fix specificity instead)
- ❌ No floats for layout
- ❌ No fixed font sizes (use clamp())

## Icon Buttons

Always provide `aria-label` on icon-only buttons:

```tsx
<button type="button" onClick={handleAdd} aria-label="Add generator node">
  <PlusIcon />
</button>
```
