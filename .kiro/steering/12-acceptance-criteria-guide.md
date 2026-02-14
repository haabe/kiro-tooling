---
name: Acceptance Criteria Writing Guide
description: How to write testable, unambiguous acceptance criteria that map to correctness properties
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**/requirements.md"
priority: critical
---

# Acceptance Criteria Writing Guide

## Purpose

Acceptance criteria define what "done" looks like for a feature. Well-written criteria are testable, unambiguous, and map directly to correctness properties. This guide shows how to write effective acceptance criteria.

---

## What Are Acceptance Criteria?

**Definition**: Specific conditions that must be met for a feature to be considered complete.

**Purpose**:
- Define clear success conditions
- Enable testability (property-based + unit tests)
- Prevent ambiguity and misunderstanding
- Provide basis for validation
- Link requirements to implementation

---

## The GIVEN-WHEN-THEN Format

### Structure

```
GIVEN [preconditions/context]
WHEN [action/event]
THEN [expected outcome]
```

### Why This Format?

- **GIVEN**: Establishes context (what state are we in?)
- **WHEN**: Defines trigger (what happens?)
- **THEN**: Specifies outcome (what should result?)

### Example

**❌ Bad (Vague)**:
> User can add nodes

**✅ Good (Specific)**:
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas with unique ID at default position

---

## Testability Checklist

Every acceptance criterion MUST be:

### 1. Observable
Can you see/measure the outcome?

**❌ Not Observable**:
> System processes data efficiently

**✅ Observable**:
> System processes 1000 nodes in under 100ms

### 2. Measurable
Can you quantify success/failure?

**❌ Not Measurable**:
> UI is responsive

**✅ Measurable**:
> UI maintains 60 FPS during node dragging

### 3. Automatable
Can you write a test for it?

**❌ Not Automatable**:
> UI looks good

**✅ Automatable**:
> All interactive elements have minimum 44x44px touch target

### 4. Unambiguous
Is there only one interpretation?

**❌ Ambiguous**:
> Nodes can be connected

**✅ Unambiguous**:
> User can drag from output port to input port to create connection

### 5. Verifiable
Can you prove it's met?

**❌ Not Verifiable**:
> System is secure

**✅ Verifiable**:
> All user input is validated against Zod schema before processing

---

## Linking Criteria to Properties

### Mapping Process

1. **Write acceptance criterion** (GIVEN-WHEN-THEN)
2. **Identify universal property** (what must ALWAYS be true?)
3. **Write property test** (validate with fast-check)
4. **Link back to criterion** (comment in test)

### Example Mapping

**Acceptance Criterion 1.2**:
> GIVEN a project with multiple nodes
> WHEN user adds a new node
> THEN the new node has a unique ID that doesn't conflict with existing nodes

**Universal Property**:
> Property 5: All node IDs in a project are unique (invariant)

**Property Test**:
```typescript
// Feature: project, Property 5: All node IDs are unique
// Validates: Requirements 1.2 - Each node must have unique identifier
test.prop([fc.array(nodeArb)], { numRuns: 100 })(
  'Property 5: All node IDs are unique',
  (nodes) => {
    const project = createProjectWithNodes(nodes);
    const ids = project.nodes.map(n => n.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  }
);
```

**Unit Test** (specific example):
```typescript
// Validates: Requirements 1.2 - Specific case
test('adding node generates unique ID', () => {
  const project = createProject();
  const node1 = addNode(project, NodeType.GENERATOR);
  const node2 = addNode(project, NodeType.GENERATOR);
  expect(node1.id).not.toBe(node2.id);
});
```

---

## Common Patterns

### Pattern 1: Data Integrity

**Criterion**:
> GIVEN a project with data
> WHEN user saves the project
> THEN all project data persists and can be loaded without loss

**Property**:
> Round-trip: `load(save(project)) === project`

**Test**:
```typescript
test.prop([projectArb], { numRuns: 100 })(
  'Property: Project survives save/load round-trip',
  async (project) => {
    await saveProject(project);
    const loaded = await loadProject(project.id);
    expect(loaded).toEqual(project);
  }
);
```

### Pattern 2: Invariants

**Criterion**:
> GIVEN any project state
> WHEN any operation is performed
> THEN project always has exactly one master output node

**Property**:
> Invariant: `project.nodes.filter(n => n.type === MASTER_OUTPUT).length === 1`

**Test**:
```typescript
test.prop([fc.array(nodeOperationArb)], { numRuns: 100 })(
  'Property: Project always has exactly one master output',
  (operations) => {
    let project = createProject();
    operations.forEach(op => project = applyOperation(project, op));
    
    const masterOutputs = project.nodes.filter(
      n => n.type === NodeType.MASTER_OUTPUT
    );
    expect(masterOutputs.length).toBe(1);
  }
);
```

### Pattern 3: Constraints

**Criterion**:
> GIVEN a master output node
> WHEN user attempts to delete it
> THEN deletion is prevented and error message is shown

**Property**:
> Constraint: `canDelete(node) === false` when `node.type === MASTER_OUTPUT`

**Test**:
```typescript
test.prop([projectArb], { numRuns: 100 })(
  'Property: Master output cannot be deleted',
  (project) => {
    const masterOutput = project.nodes.find(
      n => n.type === NodeType.MASTER_OUTPUT
    );
    expect(() => deleteNode(project, masterOutput.id)).toThrow();
  }
);
```

### Pattern 4: State Transitions

**Criterion**:
> GIVEN a collapsed node
> WHEN user clicks expand button
> THEN node transitions to expanded state

**Property**:
> State transition: `expand(collapsed) === expanded`

**Test**:
```typescript
test.prop([nodeArb], { numRuns: 100 })(
  'Property: Expanding collapsed node makes it expanded',
  (node) => {
    const collapsed = { ...node, collapsed: true };
    const expanded = toggleCollapse(collapsed);
    expect(expanded.collapsed).toBe(false);
  }
);
```

### Pattern 5: Boundaries

**Criterion**:
> GIVEN a node at canvas position
> WHEN user drags node
> THEN node position updates to cursor position within canvas bounds

**Property**:
> Boundary: `0 <= node.position.x <= canvasWidth`

**Test**:
```typescript
test.prop([
  fc.record({
    x: fc.integer({ min: -1000, max: 3000 }),
    y: fc.integer({ min: -1000, max: 3000 })
  })
], { numRuns: 100 })(
  'Property: Node position constrained to canvas bounds',
  (position) => {
    const node = createNode();
    const updated = updateNodePosition(node, position);
    
    expect(updated.position.x).toBeGreaterThanOrEqual(0);
    expect(updated.position.x).toBeLessThanOrEqual(CANVAS_WIDTH);
    expect(updated.position.y).toBeGreaterThanOrEqual(0);
    expect(updated.position.y).toBeLessThanOrEqual(CANVAS_HEIGHT);
  }
);
```

---

## Writing Effective Criteria

### Start with User Actions

**Think**: What does the user DO?

**❌ Implementation-focused**:
> System stores node data in IndexedDB

**✅ User-focused**:
> GIVEN user has created nodes
> WHEN user closes and reopens the application
> THEN all nodes are restored in their previous positions

### Be Specific About Outcomes

**❌ Vague**:
> Node is added successfully

**✅ Specific**:
> New node appears on canvas with:
> - Unique ID
> - Default position (center of viewport)
> - Collapsed state (false)
> - Empty data object

### Include Edge Cases

**Don't just test happy path**:

**Happy Path**:
> GIVEN project with 5 nodes
> WHEN user adds a node
> THEN project has 6 nodes

**Edge Cases**:
> GIVEN empty project
> WHEN user adds first node
> THEN project has 1 node (plus master output)

> GIVEN project with 1000 nodes
> WHEN user adds a node
> THEN project has 1001 nodes and UI remains responsive

### Specify Error Conditions

**Include what should NOT happen**:

**✅ Good**:
> GIVEN a master output node
> WHEN user attempts to delete it
> THEN deletion is prevented
> AND error message "Cannot delete master output" is shown
> AND node remains in project

---

## Anti-Patterns

### 1. Implementation Details

**❌ Bad**:
> GIVEN Zustand store is initialized
> WHEN addNode action is dispatched
> THEN store state is updated with new node

**✅ Good**:
> GIVEN a project is open
> WHEN user adds a node
> THEN new node appears on canvas

**Why**: Criteria should describe WHAT, not HOW. Implementation can change.

### 2. Multiple Outcomes in One Criterion

**❌ Bad**:
> GIVEN user adds a node
> THEN node appears, has unique ID, is persisted, and UI updates

**✅ Good** (separate criteria):
> 1.1: Node appears on canvas
> 1.2: Node has unique ID
> 1.3: Node persists across sessions
> 1.4: UI updates immediately

**Why**: Each criterion should test one thing. Makes debugging easier.

### 3. Untestable Criteria

**❌ Bad**:
> System is performant

**✅ Good**:
> System processes 1000 nodes in under 100ms

**Why**: "Performant" is subjective. "Under 100ms" is measurable.

### 4. Missing Context

**❌ Bad**:
> WHEN user clicks button
> THEN node is added

**✅ Good**:
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas

**Why**: Context matters. What button? What state?

### 5. Assuming Happy Path Only

**❌ Bad**:
> User can delete nodes

**✅ Good**:
> User can delete nodes EXCEPT master output node

**Why**: Edge cases and constraints are critical.

---

## Criteria Review Checklist

Before finalizing acceptance criteria, verify:

- [ ] Uses GIVEN-WHEN-THEN format
- [ ] Observable (can see the outcome)
- [ ] Measurable (can quantify success)
- [ ] Automatable (can write a test)
- [ ] Unambiguous (only one interpretation)
- [ ] Verifiable (can prove it's met)
- [ ] User-focused (not implementation details)
- [ ] Specific (not vague)
- [ ] Includes edge cases
- [ ] Specifies error conditions
- [ ] Maps to at least one property test
- [ ] One outcome per criterion

---

## Example: Complete Criteria Set

### Feature: Node Management

**1.1: Node Creation**
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas at center of viewport
> AND node has a unique ID
> AND node is in collapsed state (false)

**Maps to**:
- Property 5: All node IDs are unique
- Property 7: Nodes persist after save/load

---

**1.2: Node Deletion (Happy Path)**
> GIVEN a project with multiple nodes
> WHEN user selects a non-master-output node and presses Delete key
> THEN the selected node is removed from canvas
> AND project node count decreases by 1

**Maps to**:
- Property 8: Deleting node removes it from project

---

**1.3: Node Deletion (Master Output Protection)**
> GIVEN a project with master output node
> WHEN user attempts to delete the master output node
> THEN deletion is prevented
> AND error message "Cannot delete master output" is shown
> AND master output node remains in project

**Maps to**:
- Property 9: Master output cannot be deleted
- Property 10: Project always has exactly one master output

---

**1.4: Node Position Update**
> GIVEN a node on canvas
> WHEN user drags node to new position
> THEN node position updates to cursor position
> AND position is constrained to canvas bounds
> AND new position persists after page refresh

**Maps to**:
- Property 11: Node position within canvas bounds
- Property 7: Node position persists after save/load

---

**1.5: Node Collapse/Expand**
> GIVEN a node in any state
> WHEN user clicks collapse/expand button
> THEN node toggles between collapsed and expanded states
> AND collapsed state persists after page refresh

**Maps to**:
- Property 12: Collapse state toggles correctly
- Property 7: Collapse state persists after save/load

---

## Criteria Evolution

### When to Update Criteria

- Implementation reveals edge cases
- User feedback identifies gaps
- Testing uncovers ambiguity
- Requirements change

### How to Update

1. **Identify the gap**: What's missing or unclear?
2. **Engage in dialogue**: Discuss with developer
3. **Update criterion**: Add specificity or new criterion
4. **Update properties**: Ensure tests still cover criteria
5. **Re-validate**: Ensure implementation still meets criteria

### Example Evolution

**Original (Vague)**:
> User can add nodes

**After Implementation Discussion**:
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas

**After Testing Reveals Edge Case**:
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas at center of viewport
> AND node has a unique ID
> AND if project is empty, master output is also created

**After User Feedback**:
> GIVEN a project is open
> WHEN user clicks "Add Generator Node" button
> THEN a new generator node appears on canvas at center of viewport
> AND node has a unique ID
> AND if project is empty, master output is also created
> AND node creation is undoable via Ctrl+Z

---

## Quick Reference

### Good Criterion Template
```
GIVEN [specific context/state]
WHEN [specific user action]
THEN [specific observable outcome]
AND [additional outcomes if needed]
```

### Testability Questions
- Can I see it? (Observable)
- Can I measure it? (Measurable)
- Can I automate it? (Automatable)
- Is it clear? (Unambiguous)
- Can I prove it? (Verifiable)

### Property Mapping
- Criterion → Property → Test → Link back

### Red Flags
- 🚩 Vague language ("successfully", "properly", "correctly")
- 🚩 Implementation details (store, API, database)
- 🚩 Multiple outcomes in one criterion
- 🚩 No GIVEN context
- 🚩 Untestable outcome
- 🚩 Missing edge cases

---

## Conclusion

Well-written acceptance criteria are the foundation of successful spec-driven development. They provide clarity, enable testing, and ensure everyone agrees on what "done" means. Use GIVEN-WHEN-THEN format, ensure testability, map to properties, and iterate based on feedback.

**Remember**: If you can't test it, you can't verify it. If you can't verify it, you can't claim it's done.
