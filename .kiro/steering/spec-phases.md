---
inclusion: fileMatch
fileMatchPattern: '**/.kiro/specs/**'
description: project-specific spec phase criteria, refresh triggers, and evaluation
---

# project Spec Phases

General spec workflow is in `~/.kiro/steering/01-spec-workflow.md`. This file covers project-specific details only.

## project Phase Exit Criteria

### Requirements Phase
- Personas addressed (Alex, Sam, Jordan, Riley, Morgan — which ones?)
- IndexedDB persistence considered (private browsing fallback?)
- Master output node constraints documented if relevant
- Accessibility requirements explicit (Riley persona)

### Design Phase
- Entry point chain specified (index.html → main.tsx → App.tsx)
- Zustand store integration documented (which components use store?)
- Persistence integration detailed (when/where data saves/loads)
- ReactFlow compatibility addressed (custom node constraints)
- Correctness properties linked to acceptance criteria

### Tasks Phase
- Files listed explicitly (create vs modify)
- Property tests planned with generator requirements
- Two-phase structure for design tokens: define AND apply (prevent define-vs-apply gap)

## Dialogue Patterns

- Clarify: "I need clarification on X. Could you explain..."
- Options: "I see approaches A, B, C. Trade-offs: ..."
- Trade-offs: "Simpler but less flexible vs more robust but complex. Priority?"
- Iterate: "Based on feedback, adjusting to..."

## Spec Refresh Triggers

Refresh the spec when:
- New requirements emerge (user feedback, business needs)
- Implementation blockers discovered (technical constraints)
- Performance issues found (optimization needed)
- Security concerns raised (vulnerability discovered)
- UX issues identified (user testing reveals problems)
- Better approaches learned (implementation insights)

## Context Refresh Schedule

| Trigger | Action |
|---------|--------|
| Starting new spec | Read requirements + design + tasks |
| Every 3-5 tasks | Re-read requirements + design |
| Switching subsystems | Re-read design (architecture section) |
| Feeling uncertain | Re-read all spec files |
| Writing tests | Re-read design (correctness properties) |

## project Evaluation Criteria

Beyond general spec evaluation (`~/.kiro/steering/08-spec-evaluation-framework.md`):
- Architecture fits Zustand + Immer + Zod + IndexedDB stack
- ReactFlow compatibility verified for custom node features
- IndexedDB private browsing handled gracefully
- Accessibility (Riley persona) not deferred to "later"
- No orphaned components — everything wired to App.tsx
