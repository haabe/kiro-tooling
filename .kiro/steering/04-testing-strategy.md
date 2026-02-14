---
name: Property-Based Testing Strategy
description: Comprehensive guide for writing effective property-based tests with fast-check
inclusion: fileMatch
fileMatchPattern: "**/*.{test,spec}.*"
priority: critical
---

# Property-Based Testing Strategy

## Purpose

Property-based testing (PBT) validates universal correctness by testing properties that should hold for ALL inputs, not just specific examples. This guide shows how to identify, write, and debug property tests using fast-check.

---

## CRITICAL: Test Integrity Rules

### Rule 1: NEVER Mock the Code Under Test

**FORBIDDEN**:
```typescript
// ❌ WRONG: Mocking the actual function being tested
test('addNode adds a node', () => {
  const mockAddNode = vi.fn().mockReturnValue({ nodes: [newNode] });
  const result = mockAddNode(project, newNode);
  expect(result.nodes).toContain(newNode);
});
```

**Why This Is Wrong**: You're testing the mock, not the real code! The test will pass even if the real `addNode` is completely broken.

**CORRECT**:
```typescript
// ✅ RIGHT: Testing the actual implementation
test('addNode adds a node', () => {
  const project = createProject();
  const result = addNode(project, newNode);
  expect(result.nodes).toContain(newNode);
});
```

### Rule 2: NEVER Simplify Tests to Avoid Testing Real Behavior

**FORBIDDEN**:
```typescript
// ❌ WRONG: Skipping persistence to make test "easier"
test('project saves successfully', () => {
  const project = createProject();
  // Just check that save function exists
  expect(typeof saveProject).toBe('function');
});
```

**Why This Is Wrong**: You're not testing if saving actually works! The test passes but the feature might be broken.

**CORRECT**:
```typescript
// ✅ RIGHT: Actually testing persistence
test('project saves and loads correctly', async () => {
  const project = createProject();
  await saveProject(project);
  const loaded = await loadProject(project.id);
  expect(loaded).toEqual(project);
});
```

### Rule 3: Tests Must Validate Real Functionality

**The Purpose of Tests**:
- Prove the code works correctly
- Catch bugs before production
- Document expected behavior
- Enable confident refactoring

**Tests Are NOT**:
- Formalities to check off
- Obstacles to avoid
- Things to simplify until they pass
- Decorations for the codebase

### Rule 4: If a Test Is Hard to Write, Fix the Code

**FORBIDDEN**:
```typescript
// ❌ WRONG: Mocking because code is hard to test
test('complex function works', () => {
  const mockDependency = vi.fn();
  const result = complexFunction(mockDependency);
  expect(mockDependency).toHaveBeenCalled();
});
```

**CORRECT**:
```typescript
// ✅ RIGHT: Refactor code to be testable
// Before: Hard to test
function complexFunction(dependency) {
  // Tightly coupled, hard to test
}

// After: Easy to test
function complexFunction(data) {
  const processed = processData(data);
  return validateResult(processed);
}

test('complex function works', () => {
  const result = complexFunction(testData);
  expect(result).toEqual(expectedResult);
});
```

### When Mocking IS Allowed

**ONLY mock external dependencies**, never the code under test:

```typescript
// ✅ ALLOWED: Mocking external API
test('fetches user data', async () => {
  const mockFetch = vi.fn().mockResolvedValue({ data: userData });
  global.fetch = mockFetch;
  
  const result = await getUserData(userId);
  expect(result).toEqual(userData);
});

// ✅ ALLOWED: Mocking browser APIs
test('saves to IndexedDB', async () => {
  const mockIndexedDB = createMockIndexedDB();
  global.indexedDB = mockIndexedDB;
  
  await saveProject(project);
  expect(mockIndexedDB.data).toContain(project);
});
```

**Key Distinction**:
- ✅ Mock: External APIs, browser APIs, third-party services
- ❌ Mock: Your own code, the function being tested, business logic

---

## CRITICAL: Console Output Management

### The Problem: Polluted Test Output

**Symptom**: Test stderr is filled with expected warnings/errors that make it impossible to see real issues.

**Example of Bad Output**:
```
stderr | test.ts
Cannot save: IndexedDB unavailable. Changes will not persist.
Cannot save: IndexedDB unavailable. Changes will not persist.
Cannot save: IndexedDB unavailable. Changes will not persist.
An update to NodeWrapper inside a test was not wrapped in act(...)
An update to App inside a test was not wrapped in act(...)
Failed to initialize node abc123: Error: Init failed
```

**Why This Is Bad**:
- Real errors are hidden in noise
- Developers ignore all stderr output
- CI/CD logs become unreadable
- Debugging becomes painful

### The Solution: Suppress Expected Output at Config Level

**Use `vitest.config.ts` `onConsoleLog` to filter expected warnings**:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    // ... other config
    onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
      // Suppress expected warnings
      if (type === 'stderr') {
        if (
          log.includes('Cannot save: IndexedDB unavailable') ||
          log.includes('Expected error message from test')
        ) {
          return false; // Don't print this log
        }
      }
      // Allow all other console output
      return true;
    },
  },
});
```

### What to Suppress

**✅ SUPPRESS (Expected Behavior)**:
- IndexedDB unavailable warnings in test environment (fake-indexeddb limitation)
- Memory-only persistence warnings (expected in tests)
- React act() warnings from third-party libraries (ReactFlow internals)
- Intentional error logs from error-handling tests
- Console output from logger tests (testing console methods)

**❌ NEVER SUPPRESS (Real Issues)**:
- Unexpected errors
- Test failures
- Assertion failures
- Unhandled promise rejections
- Real bugs in your code

### Anti-Pattern: Suppressing in Individual Tests

**FORBIDDEN**:
```typescript
// ❌ WRONG: Suppressing console in every test
test('saves project', () => {
  const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  
  await saveProject(project);
  
  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});
```

**Why This Is Wrong**:
- Repetitive code in every test
- Easy to forget to restore
- Doesn't actually suppress stderr output
- Makes tests harder to read

**CORRECT**:
```typescript
// ✅ RIGHT: Suppress at config level
// vitest.config.ts handles suppression

test('saves project', async () => {
  await saveProject(project);
  // Warning is automatically suppressed
  // Test is clean and focused
});
```

### When Console Spies ARE Needed

**Use spies ONLY when testing that console methods are called**:

```typescript
// ✅ CORRECT: Testing logger functionality
test('logs to console when enabled', () => {
  const consoleSpy = vi.spyOn(console, 'info').mockImplementation(() => {});
  const logger = new Logger({ enableConsole: true });

  logger.info('Test message');

  expect(consoleSpy).toHaveBeenCalled();
  consoleSpy.mockRestore();
});
```

**Key Difference**: You're testing that the console method IS called, not suppressing expected output.

### React act() Warnings

**Problem**: ReactFlow and other libraries have internal async state updates that trigger act() warnings.

**Solution**: Suppress these warnings at config level since they're from third-party code:

```typescript
// vitest.config.ts
onConsoleLog(log: string, type: 'stdout' | 'stderr'): boolean | void {
  if (type === 'stderr') {
    if (
      log.includes('An update to NodeWrapper inside a test was not wrapped in act') ||
      log.includes('An update to App inside a test was not wrapped in act')
    ) {
      return false;
    }
  }
  return true;
}
```

**When to Fix vs Suppress**:
- ✅ Suppress: Third-party library internals (ReactFlow, etc.)
- ❌ Suppress: Your own component state updates
- ✅ Fix: Use `waitFor()` for your async operations
- ✅ Fix: Use `await` for all promises in tests

### Best Practices for Clean Test Output

1. **Suppress expected warnings at config level** - Use `onConsoleLog` in `vitest.config.ts`
2. **Never suppress in individual tests** - Leads to repetitive, brittle code
3. **Document what you suppress** - Add comments explaining why
4. **Only suppress expected behavior** - Never hide real errors
5. **Use `waitFor()` for async operations** - Properly await all state updates
6. **Test console methods with spies** - When testing logger functionality
7. **Keep stderr clean** - Zero tolerance for noise in test output

### Consequences of Violating Test Integrity

**What Happens**:
1. Tests pass but code is broken
2. Bugs reach production
3. Refactoring breaks things silently
4. False confidence in code quality
5. Technical debt accumulates

**Example of Disaster**:
```typescript
// ❌ Test mocks the code under test
test('node IDs are unique', () => {
  const mockGenerateId = vi.fn()
    .mockReturnValueOnce('id1')
    .mockReturnValueOnce('id2');
  
  const node1 = createNode(mockGenerateId);
  const node2 = createNode(mockGenerateId);
  
  expect(node1.id).not.toBe(node2.id); // Passes!
});

// Real code in production:
function generateId() {
  return 'id1'; // Always returns same ID!
}

// Result: Test passes, production has duplicate IDs, data corruption!
```

### Test Integrity Checklist

Before marking a test complete, verify:
- [ ] Test calls the REAL implementation, not a mock
- [ ] Test validates ACTUAL behavior, not simplified behavior
- [ ] Test would FAIL if the code is broken
- [ ] Test uses REAL data, not fake/stub data
- [ ] Mocks are ONLY for external dependencies
- [ ] Test is not simplified to avoid testing hard parts
- [ ] Test proves the feature actually works

**If you can't check all boxes, the test is invalid. Fix it.**

---

## Why Property-Based Testing?

### Traditional Unit Testing
```typescript
// Tests specific examples
test('adding nodes increases count', () => {
  const project = createProject();
  addNode(project, NodeType.GENERATOR);
  expect(project.nodes.length).toBe(1);
});
```

**Limitation**: Only tests ONE case. What about 100 nodes? 1000 nodes? Empty project?

### Property-Based Testing
```typescript
// Tests universal property across ALL inputs
test.prop([fc.array(fc.record({ type: fc.constantFrom(...nodeTypes) }))])(
  'Property: All node IDs are unique',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const ids = project.nodes.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  }
);
```

**Advantage**: Tests 100+ random cases automatically. Finds edge cases you didn't think of.

---

## What Makes a Good Property?

### Characteristics
1. **Universal**: Holds for ALL valid inputs, not just some
2. **Testable**: Can be verified programmatically
3. **Meaningful**: Catches real bugs, not trivial truths
4. **Independent**: Doesn't depend on implementation details

### Examples

#### ✅ Good Properties
- "All node IDs are unique" (universal, testable, meaningful)
- "Decoding encoded data returns original data" (round-trip)
- "Sorting twice gives same result as sorting once" (idempotent)
- "Adding node increases count by 1" (invariant)

#### ❌ Bad Properties
- "Function returns a value" (trivial, not meaningful)
- "Node has correct internal structure" (implementation detail)
- "Function runs without error" (too vague)
- "Result matches expected output for input X" (specific example, not universal)

---

## Property Patterns

### 1. Round-Trip Properties
**Pattern**: `decode(encode(x)) === x`

**Use When**: You have encode/decode, serialize/deserialize, save/load pairs

**Examples**:
```typescript
// Persistence round-trip
test.prop([fc.record({ /* project structure */ })])(
  'Property: Saved project can be loaded',
  async (project) => {
    await persistenceAdapter.saveProject(project);
    const loaded = await persistenceAdapter.loadProject(project.id);
    expect(loaded).toEqual(project);
  }
);

// JSON round-trip
test.prop([fc.record({ /* node structure */ })])(
  'Property: Node survives JSON round-trip',
  (node) => {
    const json = JSON.stringify(node);
    const parsed = JSON.parse(json);
    expect(parsed).toEqual(node);
  }
);
```

### 2. Invariant Properties
**Pattern**: Property that never changes regardless of operations

**Use When**: You have constraints that must always hold

**Examples**:
```typescript
// Uniqueness invariant
test.prop([fc.array(fc.record({ /* node */ }))])(
  'Property: All node IDs are unique',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const ids = project.nodes.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
);

// Master output invariant
test.prop([fc.array(fc.record({ /* node */ }))])(
  'Property: Project always has exactly one master output',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const masterOutputs = project.nodes.filter(
      n => n.type === NodeType.MASTER_OUTPUT
    );
    expect(masterOutputs.length).toBe(1);
  }
);
```

### 3. Idempotent Properties
**Pattern**: `f(f(x)) === f(x)`

**Use When**: Operation should have same effect when applied multiple times

**Examples**:
```typescript
// Sorting idempotence
test.prop([fc.array(fc.integer())])(
  'Property: Sorting twice gives same result',
  (arr) => {
    const sorted1 = [...arr].sort();
    const sorted2 = [...sorted1].sort();
    expect(sorted2).toEqual(sorted1);
  }
);

// Normalization idempotence
test.prop([fc.string()])(
  'Property: Normalizing twice gives same result',
  (str) => {
    const normalized1 = normalize(str);
    const normalized2 = normalize(normalized1);
    expect(normalized2).toBe(normalized1);
  }
);
```

### 4. Metamorphic Properties
**Pattern**: Relationship between inputs and outputs

**Use When**: You can relate different inputs/outputs without knowing exact values

**Examples**:
```typescript
// Commutativity
test.prop([fc.integer(), fc.integer()])(
  'Property: Addition is commutative',
  (a, b) => {
    expect(add(a, b)).toBe(add(b, a));
  }
);

// Monotonicity
test.prop([fc.array(fc.record({ /* node */ })), fc.record({ /* node */ })])(
  'Property: Adding node increases count',
  (nodes, newNode) => {
    const project1 = createProjectWithNodes(nodes);
    const count1 = project1.nodes.length;
    
    const project2 = addNode(project1, newNode);
    const count2 = project2.nodes.length;
    
    expect(count2).toBe(count1 + 1);
  }
);
```

### 5. Oracle Properties
**Pattern**: Compare to reference implementation

**Use When**: You have a simple (but slow) reference implementation

**Examples**:
```typescript
// Compare optimized to naive implementation
test.prop([fc.array(fc.integer())])(
  'Property: Optimized sort matches naive sort',
  (arr) => {
    const optimized = fastSort(arr);
    const naive = naiveSort(arr);
    expect(optimized).toEqual(naive);
  }
);
```

---

## Writing Generators

### Basic Generators (fast-check)

```typescript
// Primitives
fc.integer()              // Any integer
fc.integer({ min: 0, max: 100 })  // Range
fc.string()               // Any string
fc.boolean()              // true or false
fc.constantFrom('a', 'b', 'c')  // One of these values

// Collections
fc.array(fc.integer())    // Array of integers
fc.array(fc.string(), { minLength: 1, maxLength: 10 })  // Constrained array
fc.record({               // Object with specific shape
  id: fc.string(),
  count: fc.integer()
})

// Combinations
fc.tuple(fc.string(), fc.integer())  // [string, number]
fc.oneof(fc.string(), fc.integer())  // string OR number
```

### Custom Generators

#### Node Generator
```typescript
const nodeTypeArb = fc.constantFrom(
  NodeType.GENERATOR,
  NodeType.EFFECT,
  NodeType.MASTER_OUTPUT
);

const positionArb = fc.record({
  x: fc.integer({ min: 0, max: 1920 }),
  y: fc.integer({ min: 0, max: 1080 })
});

const nodeArb = fc.record({
  id: fc.uuid(),
  type: nodeTypeArb,
  position: positionArb,
  collapsed: fc.boolean(),
  data: fc.record({})  // Extend based on node type
});
```

#### Project Generator
```typescript
const projectArb = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  nodes: fc.array(nodeArb, { minLength: 1 }),  // At least one node
  createdAt: fc.date(),
  updatedAt: fc.date()
}).chain(project => {
  // Ensure at least one master output
  const hasMasterOutput = project.nodes.some(
    n => n.type === NodeType.MASTER_OUTPUT
  );
  
  if (hasMasterOutput) {
    return fc.constant(project);
  } else {
    return fc.constant({
      ...project,
      nodes: [
        ...project.nodes,
        {
          id: generateId(),
          type: NodeType.MASTER_OUTPUT,
          position: { x: 0, y: 0 },
          collapsed: false,
          data: {}
        }
      ]
    });
  }
});
```

### Generator Strategies

#### 1. Constrain to Valid Input Space
```typescript
// ❌ Bad: Generates invalid data
fc.record({
  age: fc.integer()  // Can be negative!
});

// ✅ Good: Constrained to valid range
fc.record({
  age: fc.integer({ min: 0, max: 120 })
});
```

#### 2. Use Preconditions
```typescript
test.prop([fc.array(fc.integer())])(
  'Property: Non-empty arrays can be sorted',
  (arr) => {
    fc.pre(arr.length > 0);  // Skip empty arrays
    const sorted = sort(arr);
    expect(sorted.length).toBe(arr.length);
  }
);
```

#### 3. Generate Related Data
```typescript
// Generate array and valid index
const arrayWithIndexArb = fc.array(fc.integer(), { minLength: 1 })
  .chain(arr => fc.tuple(
    fc.constant(arr),
    fc.integer({ min: 0, max: arr.length - 1 })
  ));

test.prop([arrayWithIndexArb])(
  'Property: Can access element at valid index',
  ([arr, index]) => {
    expect(arr[index]).toBeDefined();
  }
);
```

---

## Configuring Property Tests

### Minimum Iterations
```typescript
test.prop([fc.integer()], { numRuns: 100 })(  // Minimum 100 iterations
  'Property: ...',
  (x) => { /* test */ }
);
```

### Seed for Reproducibility
```typescript
test.prop([fc.integer()], { seed: 42 })(  // Same inputs every run
  'Property: ...',
  (x) => { /* test */ }
);
```

### Timeout
```typescript
test.prop([fc.array(fc.integer())], { timeout: 5000 })(  // 5 second timeout
  'Property: ...',
  (arr) => { /* test */ }
);
```

---

## Debugging Failing Properties

### Understanding Counterexamples

When a property fails, fast-check provides a counterexample:

```
Property failed after 23 runs with counterexample:
  [{ id: "abc", type: "generator", position: { x: 0, y: 0 } }]
```

### Triage Process

#### 1. Is the Test Wrong?
**Symptom**: Counterexample is valid, but test fails

**Example**:
```typescript
// ❌ Bad test: Assumes specific order
test.prop([fc.array(fc.integer())])(
  'Property: Sorted array starts with smallest',
  (arr) => {
    const sorted = sort(arr);
    expect(sorted[0]).toBe(Math.min(...arr));  // Fails on empty array!
  }
);

// ✅ Fixed test: Handle edge case
test.prop([fc.array(fc.integer())])(
  'Property: Sorted array starts with smallest',
  (arr) => {
    fc.pre(arr.length > 0);  // Skip empty arrays
    const sorted = sort(arr);
    expect(sorted[0]).toBe(Math.min(...arr));
  }
);
```

#### 2. Is the Code Wrong?
**Symptom**: Counterexample reveals a bug

**Example**:
```typescript
// Property fails with counterexample: [{ id: "abc" }, { id: "abc" }]
test.prop([fc.array(nodeArb)])(
  'Property: All node IDs are unique',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const ids = project.nodes.map(n => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  }
);

// Bug found: generateId() doesn't guarantee uniqueness!
// Fix: Use UUID or check for duplicates
```

#### 3. Is the Spec Wrong?
**Symptom**: Counterexample is valid, test is correct, but property doesn't match requirements

**Example**:
```typescript
// Property fails with counterexample: project with 2 master outputs
test.prop([fc.array(nodeArb)])(
  'Property: Project has exactly one master output',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const masterOutputs = project.nodes.filter(
      n => n.type === NodeType.MASTER_OUTPUT
    );
    expect(masterOutputs.length).toBe(1);
  }
);

// Spec says "at least one master output", not "exactly one"
// Action: Ask user which is correct
```

**CRITICAL**: Never change acceptance criteria without user input!

### Shrinking

fast-check automatically shrinks counterexamples to minimal failing case:

```
Original counterexample: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
Shrunk counterexample: [1, 2]
```

This helps identify the root cause faster.

---

## Integration with Unit Tests

### Complementary Approaches

**Property Tests**: Universal correctness
**Unit Tests**: Specific examples and edge cases

### Example: Comprehensive Testing (NO MOCKS!)

```typescript
describe('Node Management', () => {
  // Property test: Universal correctness
  // ✅ Tests REAL implementation with REAL data
  test.prop([fc.array(nodeArb)], { numRuns: 100 })(
    'Property: All node IDs are unique',
    (nodes) => {
      const project = createProjectWithNodes(nodes);
      const ids = project.nodes.map(n => n.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  );
  
  // Unit tests: Specific edge cases
  // ✅ Tests REAL implementation with REAL data
  test('empty project has only master output', () => {
    const project = createProject();
    expect(project.nodes.length).toBe(1);
    expect(project.nodes[0].type).toBe(NodeType.MASTER_OUTPUT);
  });
  
  test('cannot delete master output', () => {
    const project = createProject();
    const masterOutput = project.nodes[0];
    expect(() => deleteNode(project, masterOutput.id)).toThrow();
  });
  
  test('adding node increases count', () => {
    const project = createProject();
    const initialCount = project.nodes.length;
    addNode(project, NodeType.GENERATOR);
    expect(project.nodes.length).toBe(initialCount + 1);
  });
  
  // ✅ Tests REAL persistence (not mocked!)
  test('project persists across sessions', async () => {
    const project = createProject();
    addNode(project, NodeType.GENERATOR);
    
    await saveProject(project);
    const loaded = await loadProject(project.id);
    
    expect(loaded.nodes.length).toBe(project.nodes.length);
    expect(loaded.nodes).toEqual(project.nodes);
  });
});
```

### CRITICAL: Test Real Integration

**FORBIDDEN**:
```typescript
// ❌ WRONG: Mocking store to test component
test('component displays nodes', () => {
  const mockStore = { nodes: [mockNode] };
  render(<NodeList store={mockStore} />);
  expect(screen.getByText(mockNode.name)).toBeInTheDocument();
});
```

**CORRECT**:
```typescript
// ✅ RIGHT: Testing with real store
test('component displays nodes', () => {
  const store = createStore();
  store.addNode(NodeType.GENERATOR);
  
  render(<NodeList />); // Uses real store
  expect(screen.getByText('Generator')).toBeInTheDocument();
});
```

---

## Linking Properties to Acceptance Criteria

### Format
Every property test MUST include a comment linking to acceptance criteria:

```typescript
// Feature: project, Property 5: All node IDs are unique
// Validates: Requirements 1.2 - Each node must have a unique identifier
test.prop([fc.array(nodeArb)], { numRuns: 100 })(
  'Property 5: All node IDs are unique',
  (nodes) => {
    // Test implementation
  }
);
```

### Mapping Process
1. Read acceptance criteria in requirements.md
2. Identify universal properties
3. Write property test
4. Link back to criteria with comment

### Example Mapping

**Acceptance Criteria**:
> 1.2: Each node must have a unique identifier that persists across sessions

**Properties**:
- Property 5: All node IDs are unique (invariant)
- Property 7: Node IDs persist after save/load (round-trip)

---

## Common Mistakes

### 1. Mocking the Code Under Test (FORBIDDEN!)
```typescript
// ❌ FORBIDDEN: Mocking the function being tested
test('addNode works', () => {
  const mockAddNode = vi.fn().mockReturnValue(project);
  const result = mockAddNode(project, node);
  expect(result).toBe(project);
});

// ✅ CORRECT: Testing the real function
test('addNode works', () => {
  const project = createProject();
  const result = addNode(project, node);
  expect(result.nodes).toContain(node);
});
```

### 2. Simplifying Tests to Avoid Real Testing (FORBIDDEN!)
```typescript
// ❌ FORBIDDEN: Not testing actual persistence
test('project saves', () => {
  const project = createProject();
  expect(() => saveProject(project)).not.toThrow();
});

// ✅ CORRECT: Testing actual persistence
test('project saves and loads', async () => {
  const project = createProject();
  await saveProject(project);
  const loaded = await loadProject(project.id);
  expect(loaded).toEqual(project);
});
```

### 3. Testing Implementation Details
```typescript
// ❌ Bad: Tests internal structure
test.prop([nodeArb])(
  'Property: Node has _id field',
  (node) => {
    expect(node).toHaveProperty('_id');
  }
);

// ✅ Good: Tests observable behavior
test.prop([nodeArb])(
  'Property: Node has unique identifier',
  (node) => {
    expect(node.id).toBeDefined();
    expect(typeof node.id).toBe('string');
  }
);
```

### 4. Weak Properties
```typescript
// ❌ Bad: Trivial property
test.prop([fc.integer()])(
  'Property: Function returns a value',
  (x) => {
    expect(compute(x)).toBeDefined();
  }
);

// ✅ Good: Meaningful property
test.prop([fc.integer()])(
  'Property: Output is always non-negative',
  (x) => {
    expect(compute(x)).toBeGreaterThanOrEqual(0);
  }
);
```

### 5. Unconstrained Generators
```typescript
// ❌ Bad: Generates invalid data
fc.record({
  email: fc.string()  // Not a valid email!
});

// ✅ Good: Constrained to valid format
fc.record({
  email: fc.emailAddress()
});
```

### 6. Ignoring Preconditions
```typescript
// ❌ Bad: Doesn't handle empty arrays
test.prop([fc.array(fc.integer())])(
  'Property: First element is smallest',
  (arr) => {
    const sorted = sort(arr);
    expect(sorted[0]).toBe(Math.min(...arr));  // Fails on empty!
  }
);

// ✅ Good: Uses precondition
test.prop([fc.array(fc.integer())])(
  'Property: First element is smallest',
  (arr) => {
    fc.pre(arr.length > 0);
    const sorted = sort(arr);
    expect(sorted[0]).toBe(Math.min(...arr));
  }
);
```

---

## Best Practices

### 1. NEVER Mock Code Under Test (MOST IMPORTANT!)
- Only mock external dependencies (APIs, browser APIs)
- Never mock your own business logic
- Never simplify tests to avoid testing real behavior
- If code is hard to test, refactor the code, don't mock it

### 2. Test Real Integration
- Test with real stores, not mock stores
- Test with real persistence, not fake persistence
- Test with real data, not stub data
- Tests must prove the feature actually works

### 3. Start with Simple Properties
- Begin with obvious invariants (uniqueness, bounds)
- Add complex properties as understanding grows
- Don't try to test everything at once

### 4. Use Meaningful Names
```typescript
// ❌ Bad: Vague name
test.prop([...])('Property 1', ...);

// ✅ Good: Descriptive name
test.prop([...])('Property 5: All node IDs are unique', ...);
```

### 5. Keep Properties Independent
- Each property should test one thing
- Don't combine multiple properties into one test
- Makes debugging easier

### 6. Document Generators
```typescript
// ✅ Good: Documented generator
/**
 * Generates valid project with at least one master output node
 */
const projectArb = fc.record({
  // ...
});
```

### 7. Run Enough Iterations
- Minimum 100 iterations per property
- Increase for complex properties (500-1000)
- Balance coverage vs. test speed

### 8. Tests Are Not Optional
- Tests exist for a reason: to prove correctness
- Don't skip tests because they're hard
- Don't simplify tests to make them pass
- Don't mock to avoid testing real behavior
- Tests are your safety net - don't cut holes in it!

---

## Quick Reference

### Property Patterns
- **Round-trip**: `decode(encode(x)) === x`
- **Invariant**: Property that never changes
- **Idempotent**: `f(f(x)) === f(x)`
- **Metamorphic**: Relationship between inputs/outputs
- **Oracle**: Compare to reference implementation

### Common Generators
- `fc.integer()`, `fc.string()`, `fc.boolean()`
- `fc.array()`, `fc.record()`, `fc.tuple()`
- `fc.constantFrom()`, `fc.oneof()`
- `fc.uuid()`, `fc.emailAddress()`, `fc.date()`

### Debugging Checklist
- [ ] Is the test wrong? (Fix test)
- [ ] Is the code wrong? (Fix code)
- [ ] Is the spec wrong? (Ask user)

### Configuration
- `numRuns`: Minimum 100
- `seed`: For reproducibility
- `timeout`: For slow tests

---

## Conclusion

Property-based testing provides strong correctness guarantees by testing universal properties across many inputs. Combined with unit tests for specific edge cases, PBT ensures your code works correctly for ALL inputs, not just the ones you thought to test.

**Remember**: 
- Properties validate universal correctness. Unit tests validate specific examples. You need both.
- **NEVER mock the code under test** - you'll be testing the mock, not the real code.
- **NEVER simplify tests to avoid real testing** - tests exist to prove correctness.
- Tests are your safety net. Don't cut holes in it by mocking or simplifying.
- If a test is hard to write, fix the code, don't mock the test.
