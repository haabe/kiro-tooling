---
name: Context Management for AI Agents
description: Strategies for maintaining context consistency during spec implementation
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**"
priority: critical
---

# Context Management for AI Agents

## Purpose

AI agents can lose context during long implementations, leading to inconsistent decisions, forgotten requirements, and integration failures. This guide provides strategies for maintaining context consistency throughout spec execution.

---

## The Context Problem

### Symptoms of Lost Context
- Implementing features not in the spec
- Forgetting acceptance criteria
- Inconsistent naming/patterns
- Orphaned components (not wired to app)
- Violating established principles (using `any` types, skipping tests)
- Re-asking questions already answered in spec

### Root Causes
- Long conversation history
- Not re-reading spec files
- Jumping between tasks without context refresh
- Focusing on implementation details, losing sight of requirements

---

## Context Loading Strategy

### CRITICAL: Always Read Spec Files First

Before executing ANY task, read these files in order:

1. **requirements.md** - Understand the problem
   - What are we building?
   - Why does it matter?
   - What are the acceptance criteria?

2. **design.md** - Understand the solution
   - How are we building it?
   - What's the architecture?
   - What are the correctness properties?

3. **tasks.md** - Understand the current task
   - What specific work is needed?
   - What files to create/modify?
   - What are the acceptance criteria for THIS task?

### Context Refresh Schedule

| Trigger | Action |
|---------|--------|
| Starting new spec | Read requirements + design + tasks |
| Every 3-5 tasks | Re-read requirements + design |
| Switching subsystems | Re-read design (architecture section) |
| Feeling uncertain | Re-read all spec files |
| Making architecture decision | Re-read design + code-principles |
| Writing tests | Re-read design (correctness properties) |
| Integration work | Re-read spec-integration steering doc |

---

## Prompt Engineering for Spec Tasks

### Task Execution Prompt Template

```
I'm executing Task X.Y from the web-tracker-daw spec.

**Context**:
- Feature: [Feature name from requirements]
- Requirement: [Specific requirement this task addresses]
- Property: [Correctness property this task implements]
- Acceptance Criteria: [Criteria from task]

**Task**:
[Task description from tasks.md]

**Files to modify**:
[List from tasks.md]

**Constraints**:
- No `any` types (strict TypeScript)
- Property-based tests (minimum 100 iterations)
- getDiagnostics must be clean
- Browser validation required (if UI)
- Follow code-principles.md (KISS, DRY, SoC)
- Follow spec-integration.md (entry point, wiring)

**Validation**:
- [ ] All specified files created/modified
- [ ] getDiagnostics clean
- [ ] Tests pass (unit + property)
- [ ] Browser works (if UI)
- [ ] Acceptance criteria met
```

### Why This Works
- **Explicit context**: Reminds agent of requirements/properties
- **Explicit constraints**: Prevents common mistakes
- **Explicit validation**: Clear definition of "done"

---

## Maintaining Consistency

### 1. Establish Patterns Early

**First Task**: Set the pattern
```typescript
// Establish naming convention
export interface BaseNode {
  id: string;
  type: NodeType;
  position: Position;
}

// Establish file structure
src/
  types/
    node.ts
  schemas/
    node-schema.ts
  store/
    node-store.ts
```

**Subsequent Tasks**: Follow the pattern
- Same naming convention (PascalCase for types, camelCase for functions)
- Same file structure (types → schemas → store → components)
- Same import style (named exports, barrel exports)

### 2. Validate Against Patterns

Before proceeding with a task, check:
- [ ] Does this follow established naming conventions?
- [ ] Does this follow established file structure?
- [ ] Does this follow established code patterns?
- [ ] Does this align with code-principles.md?

If NO to any: Stop and align with patterns first.

### 3. Use Steering Docs as Guardrails

**code-principles.md**: Enforce KISS, DRY, SoC, SRP
**spec-integration.md**: Enforce entry point, wiring, browser validation
**04-testing-strategy.md**: Enforce property-based testing

Before making decisions, ask:
- What do the steering docs say about this?
- Am I following the established principles?

---

## Context Pruning

### What to Keep in Context
- ✅ Current spec files (requirements, design, tasks)
- ✅ Relevant steering docs (code-principles, spec-integration)
- ✅ Current task details
- ✅ Established patterns (naming, file structure)
- ✅ Recent validation results (getDiagnostics, test output)

### What to Prune
- ❌ Irrelevant conversation history
- ❌ Completed task details (keep only summary)
- ❌ Unrelated features
- ❌ Exploratory code that was discarded
- ❌ Debugging output from resolved issues

### Pruning Strategy
- After completing 5 tasks: Summarize progress, prune details
- After switching subsystems: Prune previous subsystem details
- After resolving issue: Prune debugging output, keep solution

---

## Handling Context Loss

### Detection
You've lost context if:
- Implementing features not in spec
- Forgetting acceptance criteria
- Inconsistent with previous decisions
- Re-asking answered questions
- Violating established principles

### Recovery
1. **Stop immediately** - Don't continue with lost context
2. **Re-read spec files** - requirements + design + tasks
3. **Re-read steering docs** - code-principles + spec-integration
4. **Review recent work** - Check for inconsistencies
5. **Validate current state** - getDiagnostics, tests, browser
6. **Resume with full context** - Continue from where you left off

---

## Context for Different Task Types

### Type Definition Tasks
**Context Needed**:
- requirements.md (acceptance criteria)
- design.md (data models section)
- code-principles.md (naming conventions)

**Key Questions**:
- What data does this represent?
- What are the constraints?
- How does this relate to other types?

### Schema Definition Tasks (Zod)
**Context Needed**:
- Type definitions (just created)
- requirements.md (validation rules)
- design.md (data validation section)

**Key Questions**:
- What validation rules apply?
- What are the edge cases?
- How do I infer types from schemas?

### Store Implementation Tasks (Zustand)
**Context Needed**:
- Type definitions
- Schema definitions
- design.md (state management section)
- spec-integration.md (persistence integration)

**Key Questions**:
- What state do I manage?
- What actions do I expose?
- When do I persist?

### Component Implementation Tasks (React)
**Context Needed**:
- Store implementation
- design.md (component hierarchy)
- spec-integration.md (entry point, wiring)
- code-principles.md (React best practices)

**Key Questions**:
- What does this component render?
- What store state does it need?
- Where does it fit in the hierarchy?
- How does it connect to App.tsx?

### Property Test Tasks
**Context Needed**:
- requirements.md (acceptance criteria)
- design.md (correctness properties)
- 04-testing-strategy.md (property patterns)
- Implementation code (to test)

**Key Questions**:
- What property am I testing?
- What generator do I need?
- How do I link to acceptance criteria?

---

## Context Checkpoints

### After Each Task
- [ ] Did I follow the spec?
- [ ] Did I meet acceptance criteria?
- [ ] Did I maintain consistency?
- [ ] Did I validate (getDiagnostics, tests, browser)?

### After Every 3-5 Tasks
- [ ] Re-read requirements (still aligned?)
- [ ] Re-read design (following architecture?)
- [ ] Check patterns (still consistent?)
- [ ] Validate integration (components wired?)

### Before Marking Feature Complete
- [ ] Re-read entire spec (all requirements met?)
- [ ] Validate all properties (all tests passing?)
- [ ] Browser validation (actually works?)
- [ ] Cross-browser testing (Chrome, Firefox, Safari?)

---

## Common Context Pitfalls

### 1. Assumption Creep
**Problem**: Making assumptions not in spec

**Example**:
- Spec says "user can add nodes"
- Agent implements "user can add, duplicate, and clone nodes"
- Duplicate and clone were NOT in spec!

**Prevention**: Before implementing, ask "Is this in the spec?"

### 2. Pattern Drift
**Problem**: Switching patterns mid-implementation

**Example**:
- First 5 components use named exports
- Next 5 components use default exports
- Inconsistent!

**Prevention**: Establish patterns early, validate before proceeding

### 3. Requirement Amnesia
**Problem**: Forgetting acceptance criteria

**Example**:
- Requirement: "Master output cannot be deleted"
- Agent implements delete without checking node type
- Forgot the requirement!

**Prevention**: Re-read requirements before each task

### 4. Integration Blindness
**Problem**: Creating components without wiring them

**Example**:
- Agent creates NodePalette component
- Never imports it in App.tsx
- Orphaned component!

**Prevention**: Follow spec-integration.md, wire as you go

### 5. Principle Violations
**Problem**: Violating established principles

**Example**:
- code-principles.md says "No `any` types"
- Agent uses `any` for convenience
- Violates principle!

**Prevention**: Re-read code-principles.md before making decisions

---

## Context Management Tools

### 1. Spec File References
Always include spec file references in prompts:

```
From requirements.md:
> 1.2: Each node must have a unique identifier

From design.md:
> Property 5: All node IDs are unique (invariant)

From tasks.md:
> Task 3.2: Implement node ID generation with uniqueness guarantee
```

### 2. Acceptance Criteria Checklist
Keep acceptance criteria visible:

```
Task 3.2 Acceptance Criteria:
- [ ] generateId() returns unique IDs
- [ ] IDs persist across sessions
- [ ] IDs are URL-safe strings
- [ ] Property 5 test passes
```

### 3. Pattern Documentation
Document patterns as you establish them:

```
Established Patterns:
- Naming: PascalCase (types), camelCase (functions)
- File structure: types → schemas → store → components
- Imports: Named exports, barrel exports (index.ts)
- Testing: Property tests (100+ iterations) + unit tests
```

### 4. Validation Checklist
Use consistent validation checklist:

```
Validation:
- [ ] getDiagnostics clean
- [ ] Unit tests pass
- [ ] Property tests pass
- [ ] Browser works (if UI)
- [ ] Acceptance criteria met
```

---

## Context for Long-Running Implementations

### Multi-Day Implementations
**Challenge**: Context loss between sessions

**Strategy**:
1. **End of session**: Write summary of progress
   - What was completed
   - What patterns were established
   - What's next
2. **Start of session**: Read summary + spec files
   - Re-establish context
   - Validate current state
   - Resume with full context

### Multi-Week Implementations
**Challenge**: Spec may evolve

**Strategy**:
1. **Track spec changes**: Use CHANGELOG.md
2. **Re-validate periodically**: Ensure implementation still aligns
3. **Refresh context weekly**: Re-read entire spec
4. **Update tasks**: Reflect spec changes in tasks.md

---

## Success Metrics

### Context Consistency
- % of tasks completed without rework (target: 85%+)
- # of inconsistent decisions (target: <2 per spec)
- # of forgotten requirements (target: 0)
- # of orphaned components (target: 0)

### Context Efficiency
- Time to context refresh (target: <2 minutes)
- # of spec file re-reads (target: every 3-5 tasks)
- # of steering doc references (target: as needed)

---

## Quick Reference

### Context Loading Checklist
- [ ] Read requirements.md
- [ ] Read design.md
- [ ] Read tasks.md
- [ ] Read relevant steering docs
- [ ] Establish/review patterns
- [ ] Validate current state

### Context Refresh Triggers
- Starting new spec
- Every 3-5 tasks
- Switching subsystems
- Feeling uncertain
- Making architecture decision
- Before marking complete

### Context Validation
- [ ] Following spec?
- [ ] Meeting acceptance criteria?
- [ ] Maintaining consistency?
- [ ] Following principles?
- [ ] Wiring components?

### Red Flags (Context Lost)
- 🚩 Implementing features not in spec
- 🚩 Forgetting acceptance criteria
- 🚩 Inconsistent patterns
- 🚩 Re-asking answered questions
- 🚩 Violating principles
- 🚩 Orphaned components

---

## Conclusion

Context management is critical for successful spec implementation. Always read spec files first, refresh context periodically, maintain consistency, and validate continuously. The goal is to keep the spec as the source of truth throughout implementation.

**Remember**: If you're uncertain, re-read the spec. It's faster than fixing mistakes later.
