---
name: Spec Workflow Phases
description: Step-by-step guide for spec-driven development phases - requirements, design, tasks, implementation
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**"
priority: critical
---

# Spec Workflow Phases

## Purpose

Provide clear guidance for moving through spec-driven development phases: Requirements → Design → Tasks → Implementation. Each phase has specific goals, deliverables, and exit criteria.

## When to Use Spec-Driven Development

| Scenario | Use Spec? | Rationale |
|----------|-----------|-----------|
| New feature (>1 day) | ✅ YES | Complexity requires planning |
| Bug fix | ❌ NO | Direct fix with validation |
| Small change (<1 day) | ❌ NO | Overhead not justified |
| Exploration/POC | ❌ NO | Vibe code, formalize if viable |
| Refactoring | ✅ YES | Define properties to preserve |
| Cross-system feature | ✅ YES | Integration complexity requires design |

---

## Core Principle: Dialogue Over Assumptions

### The Dialogue-First Approach

Spec-driven development is a **collaborative process**, not a one-way specification. The AI agent and developer work together to refine requirements, design, and implementation through continuous dialogue.

### When to Engage in Dialogue

**ALWAYS ask when**:
- Requirements are vague or ambiguous
- Multiple valid approaches exist
- Trade-offs need to be evaluated
- Edge cases are unclear
- Technical constraints are uncertain
- Tests reveal unexpected behavior
- Implementation reveals spec gaps

**NEVER assume when**:
- Spec is unclear
- Multiple interpretations possible
- Developer's priorities unknown
- Expected behavior ambiguous
- Performance requirements unspecified

### Dialogue Patterns

#### 1. Clarifying Questions
```
Agent: "I need clarification on X. Could you explain..."
User: [Provides context]
Agent: "Got it. So you want... Is that correct?"
```

#### 2. Presenting Options
```
Agent: "I see three approaches: A, B, C.
- A: [pros/cons]
- B: [pros/cons]
- C: [pros/cons]
Which aligns better with your goals?"
```

#### 3. Revealing Trade-offs
```
Agent: "This design choice has trade-offs:
- Simpler implementation BUT less flexible
- More robust BUT adds complexity
What's more important for this feature?"
```

#### 4. Iterating on Feedback
```
Agent: "Based on your feedback, I'll adjust the design to..."
User: "Actually, let's also consider..."
Agent: "Good point. Updated approach: ..."
```

### Benefits of Dialogue

| Without Dialogue | With Dialogue |
|------------------|---------------|
| Hours of rework | Minutes of clarification |
| Wrong assumptions | Aligned understanding |
| Spec-code mismatch | Spec-code alignment |
| Frustration | Collaboration |
| Guesswork | Confidence |

### Dialogue Accelerates Development

- **2-minute conversation** > 2-hour rework
- **Clarifying questions** prevent wrong implementations
- **Collaborative problem-solving** finds better solutions
- **Developer knows the domain** better than the agent
- **Agent knows the technical patterns** better than the developer
- **Together** = optimal solution

---

## Phase 1: Requirements Gathering

### Goal
Establish WHAT we're building and WHY it matters through collaborative dialogue.

### CRITICAL: Dialogue Over Assumptions

**When to Ask for Clarification**:
- Requirements are vague or ambiguous
- Multiple interpretations possible
- Complex domain logic unclear
- Edge cases not specified
- Conflicting requirements detected
- Technical constraints unclear
- User needs not well-defined

**How to Engage in Dialogue**:
1. **State what you understand**: "Based on your description, I understand you want..."
2. **Identify ambiguities**: "I'm unclear about X. Could you clarify..."
3. **Propose options**: "I see two approaches: A or B. Which aligns better with..."
4. **Ask probing questions**: "What should happen when...", "How should the system handle..."
5. **Iterate until agreement**: Continue dialogue until both parties agree on the solution

**Example Dialogue**:
```
User: "I want users to add nodes to the canvas"

Agent: "I understand you want node creation. A few questions:
1. Should there be a limit on number of nodes?
2. What happens if the canvas is full?
3. Can users add nodes while audio is playing?
4. Should node creation be undoable?

Let's clarify these before I write the requirements."

User: "Good questions. No limit on nodes, canvas should auto-expand,
nodes can be added anytime, and yes - undo/redo for all operations."

Agent: "Perfect. I'll document these as acceptance criteria."
```

**Never Assume**: If something is unclear, ASK. A 2-minute dialogue prevents hours of rework.

### Key Activities
1. **User Story Definition** (through dialogue)
   - Who is the user?
   - What problem are they solving?
   - What value do they get?
   - **Ask**: What's the user's context? What are they trying to achieve?

2. **Acceptance Criteria Writing** (through dialogue)
   - GIVEN-WHEN-THEN format
   - Testable and observable
   - Linked to correctness properties
   - **Ask**: What edge cases exist? What should happen when...?

3. **Evidence Collection** (through dialogue)
   - User research (interviews, surveys, analytics)
   - Market analysis (competitors, demand)
   - Business case (TAM/SAM, ROI, success metrics)
   - **Ask**: What evidence supports this need? Who are the competitors?

4. **Value Proposition** (through dialogue)
   - User value: How does this improve user's life?
   - Product value: How does this improve our product?
   - Company value: How does this impact business?
   - **Ask**: What's the expected impact? How do we measure success?

### Deliverable
`requirements.md` containing:
- User stories
- Acceptance criteria (testable)
- Evidence (user research, market data, business case)
- Value proposition (user/product/company)
- Success metrics (KPIs)

### Exit Criteria
- [ ] Product Trio approval (PM, Engineering Lead, UX Designer)
- [ ] All acceptance criteria testable
- [ ] Evidence validates user need
- [ ] Value proposition clear
- [ ] Success metrics defined
- [ ] No blocking concerns from evaluation

### Common Pitfalls
- ❌ **Assuming instead of asking** (biggest mistake!)
- ❌ Vague acceptance criteria ("user can add nodes")
- ❌ Missing evidence (no user research)
- ❌ Unclear value proposition
- ❌ Skipping Product Trio review
- ❌ Moving forward with ambiguity

### Decision Point: Proceed to Design?
**YES if**: All exit criteria met, Product Trio approved
**NO if**: Missing evidence, unclear value, blocking concerns
**Action if NO**: Iterate on requirements, gather more evidence

---

## Phase 2: Technical Design

### Goal
Establish HOW we're building it - architecture, components, correctness properties through collaborative design.

### CRITICAL: Dialogue for Complex Design Decisions

**When to Engage in Design Dialogue**:
- Multiple architectural approaches possible
- Trade-offs between performance/complexity
- Unclear integration points
- Complex state management scenarios
- Performance requirements unclear
- Security implications significant

**Design Dialogue Pattern**:
1. **Present options**: "I see three approaches: A, B, C. Here are the trade-offs..."
2. **Explain implications**: "Approach A is simpler but slower. Approach B is faster but more complex..."
3. **Recommend with reasoning**: "I recommend B because... Does this align with your priorities?"
4. **Iterate on feedback**: Adjust design based on developer's priorities and constraints

**Example Design Dialogue**:
```
Agent: "For state management, I see two approaches:

Option A: Single Zustand store
- Pros: Simple, centralized
- Cons: Can become large, harder to test

Option B: Multiple domain-specific stores
- Pros: Better separation, easier testing
- Cons: More boilerplate, coordination needed

Given your emphasis on KISS and testability, I recommend Option B.
Does this align with your vision?"

User: "Actually, let's start with A for simplicity. We can split later if needed."

Agent: "Good call. I'll design a single store with clear domain sections
that can be extracted later if needed."
```

### Key Activities
1. **Architecture Design** (through dialogue)
   - Component structure
   - Data models and schemas
   - State management approach
   - Persistence strategy
   - **Ask**: What are the performance priorities? What's the expected scale?

2. **Entry Point Specification** (explicit)
   - CRITICAL: Define index.html → main.tsx → App.tsx chain
   - Component hierarchy (what renders what)
   - Initialization logic (useEffect, mount behavior)
   - **Ask**: Any specific initialization requirements? Loading states?

3. **Integration Planning** (through dialogue)
   - State management wiring (which components use store)
   - Persistence integration (when/where data is saved/loaded)
   - Third-party library integration (ReactFlow, Zustand, etc.)
   - **Ask**: How should components communicate? When should data persist?

4. **Correctness Properties Definition** (through dialogue)
   - Identify universal properties from acceptance criteria
   - Define property-based tests
   - Plan unit tests for edge cases
   - **Ask**: What invariants must always hold? What can never happen?

5. **Performance & Security** (through dialogue)
   - Performance targets (FPS, memory, load time)
   - Scalability limits (max nodes, max projects)
   - Security measures (input validation, data privacy)
   - Browser compatibility (IndexedDB private browsing, Web Audio API)
   - **Ask**: What are acceptable performance thresholds? What security concerns exist?

### Deliverable
`design.md` containing:
- Architecture overview
- Component specifications
- Data models and schemas
- State management design
- Persistence strategy
- **Application Entry Point** (explicit file structure)
- Correctness properties (linked to acceptance criteria)
- Performance targets
- Security considerations
- Browser compatibility handling

### Exit Criteria
- [ ] Technical feasibility confirmed
- [ ] Architecture aligns with existing system
- [ ] Entry point explicitly defined (index.html, main.tsx, App.tsx)
- [ ] Component wiring documented
- [ ] Persistence integration detailed
- [ ] All acceptance criteria mapped to properties
- [ ] Performance targets set
- [ ] Security measures defined
- [ ] Browser compatibility addressed
- [ ] No blocking technical concerns

### Common Pitfalls
- ❌ **Choosing architecture without discussing trade-offs**
- ❌ Missing entry point specification (leads to orphaned components)
- ❌ Vague component wiring (components never connected to store)
- ❌ Weak correctness properties (not universal)
- ❌ Ignoring browser compatibility (IndexedDB, Web Audio API)
- ❌ No performance targets
- ❌ Assuming developer's priorities without asking

### Decision Point: Proceed to Tasks?
**YES if**: All exit criteria met, design is implementable
**NO if**: Technical blockers, missing integration details, weak properties
**Action if NO**: Iterate on design, clarify integration, strengthen properties

---

## Phase 3: Task Decomposition

### Goal
Break design into actionable, testable implementation tasks.

### Key Activities
1. **Task Identification**
   - Break design into logical units
   - Order by dependencies (types → schemas → store → components)
   - Group related tasks

2. **File Specification**
   - List ALL files to create/modify
   - Specify exact changes (add method X, modify interface Y)
   - Include test files

3. **Dependency Mapping**
   - Identify task prerequisites
   - Note blocking dependencies
   - Plan parallel vs. sequential execution

4. **Acceptance Criteria per Task**
   - What does "done" look like?
   - How to verify completion?
   - What tests must pass?

5. **Property Test Planning**
   - Which tasks implement properties?
   - What generators are needed?
   - Minimum 100 iterations per property

### Deliverable
`tasks.md` containing:
- Numbered task list with checkboxes
- File specifications (create/modify)
- Dependencies (prerequisites)
- Acceptance criteria (testable)
- Property test specifications
- Value statement (why this task matters)
- Evidence (research/data supporting approach)

### Task Format
```markdown
- [ ] **Task X.Y: Task Description**
  - Detailed description of work
  - **Value**: User/product/company benefit
  - **Evidence**: Research/data supporting approach
  - **Files**:
    - `src/path/to/NewComponent.tsx` (create)
    - `src/path/to/ExistingService.ts` (modify - add method X)
  - **Dependencies**: Task X.Y must complete first
  - **Acceptance Criteria**:
    - [ ] Criterion 1 (testable)
    - [ ] Criterion 2 (testable)
  - **Testing**:
    - Property test: Property N (100 iterations)
    - Unit tests: Edge cases A, B, C
  - **Validation**:
    - getDiagnostics clean
    - Tests pass
    - Browser works (if UI)
```

### Exit Criteria
- [ ] All tasks actionable (clear what to do)
- [ ] All tasks specify files (create/modify)
- [ ] All tasks have acceptance criteria (testable)
- [ ] All tasks have value statements
- [ ] Dependencies mapped
- [ ] Property tests planned
- [ ] No ambiguous tasks

### Common Pitfalls
- ❌ Vague tasks ("implement feature X")
- ❌ Missing file specifications
- ❌ No acceptance criteria
- ❌ Unclear dependencies
- ❌ No test planning

### Decision Point: Proceed to Implementation?
**YES if**: All exit criteria met, tasks are implementable
**NO if**: Ambiguous tasks, missing files, unclear acceptance criteria
**Action if NO**: Refine tasks, add file specs, clarify acceptance criteria

---

## Phase 4: Implementation

### Goal
Execute tasks, validate continuously, deliver working feature through iterative dialogue.

### CRITICAL: Dialogue During Implementation

**When to Ask During Implementation**:
- Encountering unexpected technical constraints
- Discovering ambiguity in task specification
- Finding multiple valid implementation approaches
- Hitting performance issues
- Discovering edge cases not in spec
- Tests revealing unclear behavior
- Integration issues arising

**Implementation Dialogue Pattern**:
1. **Describe the issue**: "While implementing X, I discovered Y..."
2. **Present options**: "I can handle this by: A, B, or C..."
3. **Explain trade-offs**: "A is simpler but less flexible. B is more robust but adds complexity..."
4. **Ask for direction**: "Which approach aligns better with your goals?"
5. **Implement agreed solution**: Proceed with clarity

**Example Implementation Dialogue**:
```
Agent: "While implementing node deletion, I discovered an edge case:
What should happen when deleting a node that has connections?

Options:
A. Delete node and all connections (simple, but data loss)
B. Prevent deletion if connections exist (safe, but limiting)
C. Show confirmation dialog (user-friendly, but more UI work)

The spec doesn't specify this. Which approach do you prefer?"

User: "Good catch. Let's go with C - show a confirmation dialog
listing the connections that will be removed."

Agent: "Perfect. I'll add this to the spec and implement it."
```

**CRITICAL: When Tests Reveal Unclear Behavior**:
If a property test fails with a valid counterexample, but it's unclear if the test, code, or spec is wrong:
1. **Stop implementation**
2. **Present the counterexample**: "Property test failed with input X, producing output Y..."
3. **Ask for clarification**: "Is this the expected behavior? Or should it behave differently?"
4. **Update spec if needed**: Document the agreed behavior
5. **Resume with clarity**

### Key Activities
1. **Task Execution** (with dialogue)
   - Execute tasks in dependency order
   - ONE task at a time (don't jump ahead)
   - Validate after each task
   - **Ask**: If task is ambiguous or multiple approaches exist

2. **Continuous Validation** (with dialogue)
   - Run getDiagnostics after each file
   - Fix errors immediately (zero tolerance)
   - Run tests after each task
   - Verify in browser (if UI)
   - **Ask**: If errors reveal spec ambiguity

3. **Integration Checkpoints** (with dialogue)
   - After component tasks: Verify wiring to store
   - After store tasks: Verify persistence integration
   - After persistence tasks: Verify data saves/loads
   - After UI tasks: Verify in browser
   - **Ask**: If integration reveals missing requirements

4. **Property Test Execution** (with dialogue)
   - Run property tests (minimum 100 iterations)
   - Triage counterexamples:
     - Is the test wrong? Fix test
     - Is the code wrong? Fix code
     - Is the spec wrong? **Ask user** (NEVER assume!)
   - Get all properties passing
   - **Ask**: If counterexample reveals unclear expected behavior

5. **Browser Validation** (with dialogue)
   - Start dev server (`pnpm dev`)
   - Verify feature visible
   - Test interactions
   - Test persistence (refresh page)
   - Test private browsing mode
   - Test across browsers (Chrome, Firefox, Safari)
   - **Ask**: If browser behavior reveals UX issues not in spec

### Validation Checklist (Per Task)
- [ ] All specified files created/modified
- [ ] getDiagnostics clean (no TypeScript errors)
- [ ] Unit tests pass
- [ ] Property tests pass (if applicable)
- [ ] Browser works (if UI task)
- [ ] Acceptance criteria met

### Integration Validation Checklist
- [ ] Entry point chain works (index.html → main.tsx → App.tsx)
- [ ] Components render in browser
- [ ] Store connected to components
- [ ] Persistence saves/loads data
- [ ] No console errors
- [ ] No orphaned components

### Exit Criteria (Feature Complete)
- [ ] All tasks completed
- [ ] All tests passing (unit + property)
- [ ] getDiagnostics clean
- [ ] Feature works in browser
- [ ] Persistence works (refresh test)
- [ ] Private browsing handled gracefully
- [ ] Cross-browser tested
- [ ] No console errors
- [ ] Documentation updated

### Common Pitfalls
- ❌ **Implementing without asking when unclear** (biggest mistake!)
- ❌ **Assuming spec is correct when tests reveal issues**
- ❌ Jumping ahead to next task before validating current
- ❌ Deferring error fixes ("I'll fix later")
- ❌ Skipping browser validation
- ❌ Not testing persistence
- ❌ Ignoring private browsing mode
- ❌ Claiming complete without browser test
- ❌ Working around ambiguity instead of clarifying

### Decision Point: Feature Complete?
**YES if**: All exit criteria met, feature works in browser
**NO if**: Tests failing, errors present, browser issues
**Action if NO**: Fix issues, don't mark complete until all criteria met

---

## Phase Transitions

### Requirements → Design
**Trigger**: Product Trio approval, all requirements exit criteria met
**Validation**: Re-read requirements before starting design
**Context**: Keep requirements.md open during design

### Design → Tasks
**Trigger**: Technical feasibility confirmed, all design exit criteria met
**Validation**: Re-read requirements + design before creating tasks
**Context**: Keep requirements.md + design.md open during task creation

### Tasks → Implementation
**Trigger**: All tasks actionable, all task exit criteria met
**Validation**: Re-read requirements + design + tasks before implementing
**Context**: Keep all spec files open during implementation

### Implementation → Complete
**Trigger**: All tasks done, all implementation exit criteria met
**Validation**: Full browser validation, all tests passing
**Context**: Verify against original requirements (did we solve the problem?)

---

## Iteration & Refinement

### When to Iterate Back
- **Design → Requirements**: Technical blocker discovered, requirements unclear
- **Tasks → Design**: Design ambiguity discovered, integration unclear
- **Implementation → Tasks**: Task ambiguity discovered, acceptance criteria unclear
- **Implementation → Design**: Architecture issue discovered, design needs revision

### How to Iterate (Through Dialogue)
1. **Identify the issue**: What's blocking progress?
2. **Engage in dialogue**: "I discovered X. Here are options: A, B, C. Which aligns with your goals?"
3. **Determine root cause**: Requirements? Design? Tasks?
4. **Update the appropriate document**: Don't just work around it
5. **Get agreement**: Ensure developer agrees with the change
6. **Re-validate**: Ensure fix doesn't break other parts
7. **Resume implementation**: Continue from where you left off

### Iteration is Normal (and Expected)
- Specs are not perfect on first try
- Implementation reveals issues
- User feedback drives changes
- **Dialogue during iteration prevents misalignment**
- Iterate quickly, don't get stuck
- **Ask questions, don't make assumptions**

### Dialogue Accelerates Iteration
- 2-minute conversation > 2-hour rework
- Clarifying questions prevent wrong implementations
- Collaborative problem-solving finds better solutions
- Developer knows the domain better than the agent

---

## Context Management During Implementation

### CRITICAL: Always Read Spec Files First
Before executing ANY task:
1. Read `requirements.md` (understand the problem)
2. Read `design.md` (understand the solution)
3. Read `tasks.md` (understand the current task)

### Re-read Periodically
- After every 3-5 tasks
- When switching between subsystems
- When feeling uncertain about direction
- When making architecture decisions

### Maintain Consistency
- Establish patterns early (naming, file structure)
- Validate against patterns before proceeding
- Use steering docs to enforce standards (code-principles, spec-integration)
- Don't switch patterns mid-implementation

---

## Success Metrics

### Spec Quality
- % of specs passing evaluation on first try (target: 90%+)
- % of acceptance criteria testable (target: 100%)
- % of properties passing on first implementation (target: 85%+)

### Implementation Success
- % of tasks completed without rework (target: 85%+)
- # of integration failures (target: 0)
- % of features working on first browser test (target: 95%+)

### Efficiency
- Time from requirements to implementation start (target: <2 days)
- Time from implementation start to feature complete (target: as estimated)
- # of iterations back to previous phase (target: <2 per spec)

---

## Quick Reference

### Phase Checklist
- [ ] **Phase 1: Requirements** - Product Trio approved, evidence collected
- [ ] **Phase 2: Design** - Technical feasibility confirmed, entry point defined
- [ ] **Phase 3: Tasks** - All tasks actionable, files specified
- [ ] **Phase 4: Implementation** - All tests passing, browser validated

### Red Flags (Stop and Fix)
- 🚩 Vague acceptance criteria
- 🚩 Missing entry point specification
- 🚩 Ambiguous tasks
- 🚩 TypeScript errors
- 🚩 Failing tests
- 🚩 Blank page in browser
- 🚩 Console errors

### Golden Rules
1. **Ask when unclear** - Dialogue prevents rework (MOST IMPORTANT!)
2. **One phase at a time** - Don't skip ahead
3. **Validate continuously** - Fix errors immediately
4. **Read spec files first** - Always understand context
5. **Test in browser** - "Code looks right" is not enough
6. **Iterate when needed** - Don't work around issues
7. **Never assume** - If uncertain, ask

---

## Conclusion

Spec-driven development is a structured, collaborative approach to building features with confidence. Follow the phases, validate continuously, engage in dialogue when unclear, and iterate when needed. The goal is not perfection on first try, but systematic refinement toward a working, correct implementation through developer-agent collaboration.

**Remember**: 
- If you can't see it working in the browser, it's not done.
- If something is unclear, ASK - don't assume.
- Dialogue prevents rework and builds better solutions.
