---
name: Task Execution Guide (TDD + SDD)
description: How to execute spec tasks using Test-Driven Development principles
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**/tasks.md"
priority: high
---

# Task Execution Guide: TDD + SDD

## Purpose

Combine Test-Driven Development (TDD) with Spec-Driven Development (SDD) for maximum confidence and minimal rework. Write tests first, implement to pass tests, validate against spec.

---

## The Combined Workflow

### Overview

```
Spec (SDD) → Properties (TDD) → Unit Tests (TDD) → Implementation (TDD) → Validation (SDD)
```

**Key Principle**: Tests define "done" before code is written.

---

## Phase 1: Read the Spec (SDD)

**ALWAYS start by reading**:
1. `requirements.md` - What are we building? Why?
2. `design.md` - How are we building it?
3. `tasks.md` - What's the current task?

**Extract from current task**:
- Acceptance criteria (what must be true when done?)
- Files to create/modify
- Dependencies (what must be done first?)
- Correctness properties (what must ALWAYS be true?)

**Example**:
```markdown
Task 3.2: Implement node ID generation
- Acceptance Criteria:
  - [ ] generateId() returns unique IDs
  - [ ] IDs are URL-safe strings
  - [ ] Property 5 test passes (all IDs unique)
- Files:
  - src/utils/id-generator.ts (create)
  - src/utils/id-generator.test.ts (create)
```

---

## Test Command Reference

**CRITICAL**: Use the correct test commands to avoid blocking execution:

```bash
# ✅ CORRECT: Run all tests once and exit
pnpm test

# ✅ CORRECT: Run tests with UI (for debugging)
pnpm test:ui

# ✅ CORRECT: Run tests with coverage
pnpm test:coverage

# ❌ WRONG: Never use these (they block or are incorrect)
pnpm test --run      # Unnecessary flag, vitest runs once by default
vitest --watch       # Starts watch mode, never exits
vitest               # May start watch mode depending on config
```

**Key Points**:
- `pnpm test` runs `vitest` which executes tests once and exits (configured in vitest.config.ts)
- Do NOT add `--run` flag - it's not needed and may cause confusion
- Watch mode is ONLY for interactive development, never for automated execution
- Always use `pnpm test` for task validation

---

## Phase 2: Write Property Tests First (TDD + SDD)

**Before writing ANY implementation code**, write property tests.

### Step 1: Identify Properties from Spec

From `design.md`:
> Property 5: All node IDs in a project are unique (invariant)

### Step 2: Write Property Test (Will Fail)

```typescript
// src/utils/id-generator.test.ts

import { test } from 'vitest';
import { fc } from 'fast-check';
import { generateId } from './id-generator'; // Doesn't exist yet!

// Feature: project, Property 5: All node IDs are unique
// Validates: Requirements 1.2 - Each node must have unique identifier
test.prop([fc.integer({ min: 1, max: 1000 })], { numRuns: 100 })(
  'Property 5: generateId produces unique IDs',
  (count) => {
    const ids = Array.from({ length: count }, () => generateId());
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  }
);
```

### Step 3: Run Test (Expect Failure)

```bash
pnpm test
# FAIL: Cannot find module './id-generator'
```

**This is GOOD!** Red phase of TDD.

---

## Phase 3: Write Unit Tests for Edge Cases (TDD)

**Before implementation**, write unit tests for specific cases.

```typescript
// src/utils/id-generator.test.ts

describe('generateId', () => {
  test('returns a string', () => {
    const id = generateId(); // Doesn't exist yet!
    expect(typeof id).toBe('string');
  });
  
  test('returns non-empty string', () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
  });
  
  test('returns URL-safe string', () => {
    const id = generateId();
    expect(id).toMatch(/^[a-zA-Z0-9_-]+$/);
  });
  
  test('consecutive calls return different IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });
});
```

### Run Tests (Expect Failures)

```bash
pnpm test
# FAIL: Cannot find module './id-generator'
```

**Still good!** We're defining "done" before writing code.

---

## Phase 4: Implement Minimal Solution (TDD)

**Now write the MINIMAL code to pass tests**.

### Step 1: Create File

```typescript
// src/utils/id-generator.ts

export function generateId(): string {
  return ''; // Minimal (will fail tests)
}
```

### Step 2: Run Tests (Still Failing)

```bash
pnpm test
# FAIL: Expected string length > 0
```

### Step 3: Implement to Pass Tests

```typescript
// src/utils/id-generator.ts

import { nanoid } from 'nanoid';

export function generateId(): string {
  return nanoid();
}
```

### Step 4: Run Tests (Should Pass)

```bash
pnpm test
# PASS: All tests passing
```

**Green phase of TDD!**

---

## Phase 5: Validate Against Spec (SDD)

**Tests pass, but are we DONE?** Check spec validation:

### Validation Checklist

- [ ] **All specified files created/modified**
  - `src/utils/id-generator.ts` ✅
  - `src/utils/id-generator.test.ts` ✅

- [ ] **getDiagnostics clean**
  ```bash
  # Run diagnostics
  # Should show zero errors
  ```

- [ ] **All tests pass**
  - Unit tests ✅
  - Property tests (100+ iterations) ✅

- [ ] **Acceptance criteria met**
  - generateId() returns unique IDs ✅
  - IDs are URL-safe strings ✅
  - Property 5 test passes ✅

- [ ] **No forbidden patterns**
  - No `any` types ✅
  - No mocking code under test ✅
  - Tests validate real behavior ✅

- [ ] **Integration** (if applicable)
  - Function exported ✅
  - Used in other modules (next task)

**If all checkboxes checked**: Task is DONE ✅

---

## Phase 6: Refactor (TDD)

**Now that tests pass, improve code quality**.

### What to Refactor

- Extract repeated logic
- Improve naming
- Add comments for complex logic
- Optimize performance (if needed)

### Refactoring Rules

1. **Tests must still pass** after each refactor
2. **Run tests after each change**
3. **Don't change behavior**, only structure
4. **Stop if tests fail** - revert and try different approach

### Example Refactor

**Before**:
```typescript
export function generateId(): string {
  return nanoid();
}
```

**After** (add configuration):
```typescript
const ID_LENGTH = 21; // Standard nanoid length

export function generateId(): string {
  return nanoid(ID_LENGTH);
}

// For testing: allow custom length
export function generateIdWithLength(length: number): string {
  return nanoid(length);
}
```

**Run tests**: Still passing ✅

---

## Task Execution Order

### 1. Read Spec Files
- requirements.md
- design.md
- tasks.md (current task)

### 2. Write Tests FIRST
- Property tests (from design.md properties)
- Unit tests (from task acceptance criteria)
- Run tests (expect failures)

### 3. Implement MINIMAL Code
- Write simplest code to pass tests
- Run tests frequently
- Stop when tests pass

### 4. Validate Against Spec
- All files created
- getDiagnostics clean
- All tests pass
- Acceptance criteria met
- No forbidden patterns

### 5. Refactor (Optional)
- Improve code quality
- Keep tests passing
- Stop if tests fail

### 6. Mark Task Complete
- Update tasks.md: `- [x] Task X.Y`
- Move to next task

---

## Common Patterns

### Pattern 1: Pure Function

**Task**: Implement data transformation function

**TDD Workflow**:
1. Write property test (round-trip, idempotent, etc.)
2. Write unit tests (edge cases)
3. Implement function
4. Validate
5. Refactor

**Example**:
```typescript
// Test first
test.prop([fc.record({ /* node */ })])(
  'Property: Node survives JSON round-trip',
  (node) => {
    const json = JSON.stringify(node);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(node);
  }
);

// Implement
export function serializeNode(node: Node): string {
  return JSON.stringify(node);
}

export function deserializeNode(json: string): Node {
  return JSON.parse(json);
}
```

### Pattern 2: State Management (Zustand)

**Task**: Implement store action

**TDD Workflow**:
1. Write property test (invariants)
2. Write unit tests (specific cases)
3. Implement action
4. Validate
5. Refactor

**Example**:
```typescript
// Test first
test.prop([fc.array(nodeArb)])(
  'Property: All node IDs unique after adding nodes',
  (nodes) => {
    const store = createStore();
    nodes.forEach(node => store.addNode(node.type));
    
    const ids = store.getState().project.nodes.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
);

// Implement
export const useStore = create<AppState>()(
  immer((set, get) => ({
    project: null,
    addNode: (type: NodeType) => {
      set((draft) => {
        const newNode = {
          id: generateId(), // Uses tested function!
          type,
          position: { x: 0, y: 0 },
          collapsed: false,
          data: {}
        };
        draft.project?.nodes.push(newNode);
      });
    }
  }))
);
```

### Pattern 3: React Component

**Task**: Implement UI component

**TDD Workflow**:
1. Write integration test (component + store)
2. Write unit tests (rendering, interactions)
3. Implement component
4. Validate in browser
5. Refactor

**Example**:
```typescript
// Test first
test('NodePalette renders node types', () => {
  render(<NodePalette />);
  expect(screen.getByText('Generator')).toBeInTheDocument();
  expect(screen.getByText('Effect')).toBeInTheDocument();
});

test('clicking node type adds node', () => {
  const store = createStore();
  render(<NodePalette />);
  
  fireEvent.click(screen.getByText('Generator'));
  
  const nodes = store.getState().project.nodes;
  expect(nodes.some(n => n.type === NodeType.GENERATOR)).toBe(true);
});

// Implement
export function NodePalette() {
  const addNode = useStore(state => state.addNode);
  
  return (
    <div className="node-palette">
      <button onClick={() => addNode(NodeType.GENERATOR)}>
        Generator
      </button>
      <button onClick={() => addNode(NodeType.EFFECT)}>
        Effect
      </button>
    </div>
  );
}
```

### Pattern 4: Persistence

**Task**: Implement save/load

**TDD Workflow**:
1. Write property test (round-trip)
2. Write unit tests (edge cases: empty, large, corrupted)
3. Implement persistence
4. Validate in browser (IndexedDB)
5. Refactor

**Example**:
```typescript
// Test first
test.prop([projectArb], { numRuns: 100 })(
  'Property: Project survives save/load round-trip',
  async (project) => {
    await saveProject(project);
    const loaded = await loadProject(project.id);
    expect(loaded).toEqual(project);
  }
);

test('handles corrupted data gracefully', async () => {
  // Manually corrupt IndexedDB data
  await corruptProjectData(projectId);
  
  const loaded = await loadProject(projectId);
  expect(loaded).toBeNull(); // Graceful failure
});

// Implement
export async function saveProject(project: Project): Promise<void> {
  const db = await openDatabase();
  await db.put('projects', project);
}

export async function loadProject(id: string): Promise<Project | null> {
  try {
    const db = await openDatabase();
    return await db.get('projects', id);
  } catch (error) {
    console.error('Failed to load project:', error);
    return null; // Graceful failure
  }
}
```

---

## Handling Test Failures

### During Implementation (Expected)

**Symptom**: Tests fail while writing code

**Action**: Keep implementing until tests pass

**Example**:
```typescript
// Test
test('generateId returns unique IDs', () => {
  const id1 = generateId();
  const id2 = generateId();
  expect(id1).not.toBe(id2);
});

// First attempt (fails)
export function generateId(): string {
  return 'id'; // Always same!
}

// Second attempt (passes)
export function generateId(): string {
  return nanoid(); // Unique!
}
```

### After Implementation (Unexpected)

**Symptom**: Tests fail after code was working

**Possible Causes**:
1. **Regression**: New code broke existing functionality
2. **Test is wrong**: Test doesn't match spec
3. **Spec is wrong**: Spec doesn't match reality

**Action**: Triage (see 04-testing-strategy.md)

---

## Integration with Spec Validation

### TDD Validates: Code Correctness
- Tests pass ✅
- No TypeScript errors ✅
- Code works as expected ✅

### SDD Validates: Feature Completeness
- Acceptance criteria met ✅
- Properties validated ✅
- Browser works ✅
- Integration complete ✅

### Both Required for "Done"

**TDD alone**: Code works in isolation
**SDD alone**: Feature works in theory
**TDD + SDD**: Feature works in practice ✅

---

## Benefits of TDD + SDD

### 1. Confidence
- Tests prove code works
- Properties prove it works for ALL inputs
- Spec proves it solves the problem

### 2. Fast Feedback
- Tests fail immediately when code is wrong
- No waiting for manual testing
- Catch bugs before browser testing

### 3. Living Documentation
- Tests document expected behavior
- Spec documents requirements
- Both stay in sync with code

### 4. Fearless Refactoring
- Tests ensure behavior unchanged
- Properties ensure invariants preserved
- Refactor with confidence

### 5. Minimal Rework
- Write tests first = clear target
- Implement to pass tests = minimal code
- Validate against spec = no surprises

---

## Anti-Patterns to Avoid

### 1. Writing Code Before Tests

**❌ Wrong**:
```typescript
// Write implementation first
export function generateId(): string {
  return nanoid();
}

// Then write tests
test('generateId works', () => {
  expect(generateId()).toBeDefined(); // Weak test!
});
```

**✅ Right**:
```typescript
// Write tests first
test('generateId returns unique IDs', () => {
  const id1 = generateId();
  const id2 = generateId();
  expect(id1).not.toBe(id2);
});

// Then implement
export function generateId(): string {
  return nanoid();
}
```

### 2. Skipping Property Tests

**❌ Wrong**:
```typescript
// Only unit tests
test('generateId returns string', () => {
  expect(typeof generateId()).toBe('string');
});
```

**✅ Right**:
```typescript
// Property test + unit tests
test.prop([fc.integer({ min: 1, max: 1000 })])(
  'Property: All generated IDs are unique',
  (count) => {
    const ids = Array.from({ length: count }, () => generateId());
    expect(new Set(ids).size).toBe(ids.length);
  }
);

test('generateId returns string', () => {
  expect(typeof generateId()).toBe('string');
});
```

### 3. Mocking Code Under Test

**❌ Wrong**:
```typescript
test('addNode works', () => {
  const mockAddNode = vi.fn();
  mockAddNode(node);
  expect(mockAddNode).toHaveBeenCalled();
});
```

**✅ Right**:
```typescript
test('addNode works', () => {
  const store = createStore();
  store.addNode(NodeType.GENERATOR);
  expect(store.getState().project.nodes.length).toBe(2); // 1 master + 1 new
});
```

### 4. Weak Tests

**❌ Wrong**:
```typescript
test('function works', () => {
  expect(generateId()).toBeDefined();
});
```

**✅ Right**:
```typescript
test('generateId returns unique IDs', () => {
  const id1 = generateId();
  const id2 = generateId();
  expect(id1).not.toBe(id2);
});
```

### 5. Skipping Browser Validation

**❌ Wrong**:
```typescript
// Tests pass, mark task complete
test('component renders', () => {
  render(<NodePalette />);
  expect(screen.getByText('Generator')).toBeInTheDocument();
});
// Task marked complete without checking browser!
```

**✅ Right**:
```typescript
// Tests pass
test('component renders', () => {
  render(<NodePalette />);
  expect(screen.getByText('Generator')).toBeInTheDocument();
});

// THEN validate in browser:
// - pnpm dev
// - Open browser
// - Verify component visible
// - Test interactions
// - Check console for errors
// NOW mark task complete
```

---

## Quick Reference

### TDD Cycle
1. **Red**: Write failing test
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code quality

### SDD Validation
1. **Read spec**: Understand requirements
2. **Write tests**: Define "done"
3. **Implement**: Pass tests
4. **Validate**: Check spec criteria
5. **Complete**: Mark task done

### Task Execution Checklist
- [ ] Read requirements.md + design.md + tasks.md
- [ ] Write property tests (will fail)
- [ ] Write unit tests (will fail)
- [ ] Implement minimal code
- [ ] Run tests (should pass)
- [ ] Run getDiagnostics (should be clean)
- [ ] Validate in browser (if UI)
- [ ] Check acceptance criteria (all met)
- [ ] Refactor (optional)
- [ ] Mark task complete

---

## Conclusion

TDD and SDD are a perfect match. TDD provides the micro-level feedback loop (test → code → refactor), while SDD provides the macro-level structure (requirements → design → tasks → validation). Together, they create a powerful workflow that maximizes confidence and minimizes rework.

**Remember**: 
- Tests define "done" before code is written
- Properties validate universal correctness
- Spec ensures feature completeness
- All three together = working, correct, complete feature
