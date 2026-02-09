---
name: Spec Maintenance and Refresh
description: How to keep specs up-to-date as requirements evolve and implementation reveals insights
inclusion: fileMatch
fileMatchPattern: "**/.kiro/specs/**"
priority: medium
---

# Spec Maintenance and Refresh

## Purpose

Specs are living documents that evolve as you learn more about the problem and solution. This guide shows when and how to update specs to keep them accurate and useful.

---

## When to Refresh a Spec

### Trigger 1: New Requirements

**Scenario**: User feedback or business needs reveal new requirements

**Example**:
> User feedback: "I need to undo node deletions"
> 
> Action: Add undo/redo requirements to spec

**Process**:
1. Document new requirement in requirements.md
2. Update design.md with undo/redo architecture
3. Add tasks to tasks.md
4. Re-run evaluation framework
5. Implement new tasks

### Trigger 2: Implementation Blockers

**Scenario**: Implementation reveals technical constraints not considered in design

**Example**:
> Blocker: "IndexedDB has 50MB limit, but design assumes unlimited storage"
> 
> Action: Update design with storage limits and cleanup strategy

**Process**:
1. Stop implementation
2. Engage in dialogue with developer about constraints
3. Update design.md with new constraints
4. Update tasks.md with new approach
5. Resume implementation

### Trigger 3: Performance Issues

**Scenario**: Implementation meets functional requirements but fails performance targets

**Example**:
> Issue: "Rendering 1000 nodes takes 5 seconds (target: <100ms)"
> 
> Action: Update design with virtualization strategy

**Process**:
1. Document performance issue
2. Research solutions (virtualization, pagination, etc.)
3. Update design.md with optimization approach
4. Add optimization tasks to tasks.md
5. Implement optimizations

### Trigger 4: Security Concerns

**Scenario**: Security review reveals vulnerabilities

**Example**:
> Concern: "User input not validated, XSS vulnerability"
> 
> Action: Add input validation requirements and design

**Process**:
1. Document security concern
2. Update requirements.md with security criteria
3. Update design.md with validation strategy
4. Add validation tasks to tasks.md
5. Implement security measures

### Trigger 5: User Experience Issues

**Scenario**: User testing reveals UX problems

**Example**:
> Issue: "Users can't find the 'Add Node' button"
> 
> Action: Update design with improved UI layout

**Process**:
1. Document UX issue
2. Update design.md with UI improvements
3. Update tasks.md with UI changes
4. Implement improvements

### Trigger 6: Implementation Learnings

**Scenario**: Implementation reveals better approaches

**Example**:
> Learning: "Zustand middleware simplifies persistence (vs. manual calls)"
> 
> Action: Update design to use middleware pattern

**Process**:
1. Document learning
2. Update design.md with new pattern
3. Update tasks.md if needed
4. Refactor implementation

---

## Refresh Process

### Step 1: Identify What Needs Updating

**Questions to ask**:
- What changed? (requirements, constraints, approach)
- Why did it change? (feedback, blocker, learning)
- What impact does it have? (scope, timeline, architecture)

**Document the change**:
```markdown
## Change Log

### 2024-02-07: Add Undo/Redo Support
**Trigger**: User feedback
**Impact**: New requirements, design changes, 5 new tasks
**Reason**: Users need to undo accidental deletions
```

### Step 2: Update Requirements (if needed)

**When to update**:
- New user needs identified
- Business priorities changed
- Acceptance criteria incomplete

**How to update**:
1. Add new user stories
2. Add new acceptance criteria (GIVEN-WHEN-THEN)
3. Update value proposition if needed
4. Update success metrics if needed

**Example**:
```markdown
## 2. Undo/Redo Support (NEW)

### User Story
As a user, I want to undo and redo actions so that I can recover from mistakes.

### Acceptance Criteria

**2.1: Undo Action**
GIVEN user has performed an action (add, delete, move node)
WHEN user presses Ctrl+Z
THEN the last action is undone
AND the project returns to previous state

**2.2: Redo Action**
GIVEN user has undone an action
WHEN user presses Ctrl+Shift+Z
THEN the undone action is reapplied
AND the project returns to state before undo

**2.3: Undo Stack Limit**
GIVEN user has performed 100+ actions
WHEN user presses Ctrl+Z
THEN only the last 50 actions can be undone
AND older actions are discarded
```

### Step 3: Update Design (if needed)

**When to update**:
- Architecture changes
- New components needed
- New correctness properties
- Performance optimizations
- Security measures

**How to update**:
1. Update architecture section
2. Add new component specifications
3. Add new correctness properties
4. Update integration points
5. Update performance targets

**Example**:
```markdown
## Undo/Redo Architecture (NEW)

### State Management
- Add `history` array to store (stores past states)
- Add `historyIndex` to track current position
- Add `maxHistorySize` constant (50 actions)

### Actions
- `undo()`: Move back in history
- `redo()`: Move forward in history
- Wrap all state-modifying actions to record history

### Correctness Properties
- Property 14: Undo followed by redo returns to original state
- Property 15: History never exceeds max size
- Property 16: Undo/redo preserves all invariants (e.g., one master output)
```

### Step 4: Update Tasks (if needed)

**When to update**:
- New features to implement
- Existing tasks need modification
- Task dependencies changed

**How to update**:
1. Add new tasks with full specifications
2. Update existing tasks if approach changed
3. Update dependencies
4. Re-number if needed

**Example**:
```markdown
## Phase 4: Undo/Redo Implementation (NEW)

- [ ] **Task 4.1: Implement History State Management**
  - Add history tracking to Zustand store
  - **Value**: Enables undo/redo functionality
  - **Files**:
    - `src/store/index.ts` (modify - add history state)
    - `src/store/history.ts` (create - history utilities)
  - **Dependencies**: None
  - **Acceptance Criteria**:
    - [ ] History array stores past states
    - [ ] History limited to 50 entries
    - [ ] History index tracks current position
  - **Testing**:
    - Property 15: History never exceeds max size

- [ ] **Task 4.2: Implement Undo Action**
  - Add undo() action to store
  - **Value**: Users can recover from mistakes
  - **Files**:
    - `src/store/index.ts` (modify - add undo action)
  - **Dependencies**: Task 4.1
  - **Acceptance Criteria**:
    - [ ] Ctrl+Z triggers undo
    - [ ] State reverts to previous
    - [ ] Undo disabled when at start of history
  - **Testing**:
    - Property 14: Undo/redo round-trip
    - Unit tests: Undo at start, undo after multiple actions

- [ ] **Task 4.3: Implement Redo Action**
  - Add redo() action to store
  - **Value**: Users can reapply undone actions
  - **Files**:
    - `src/store/index.ts` (modify - add redo action)
  - **Dependencies**: Task 4.2
  - **Acceptance Criteria**:
    - [ ] Ctrl+Shift+Z triggers redo
    - [ ] State moves forward in history
    - [ ] Redo disabled when at end of history
  - **Testing**:
    - Property 14: Undo/redo round-trip
    - Unit tests: Redo at end, redo after undo
```

### Step 5: Re-run Evaluation Framework

**Why**: Ensure changes don't introduce gaps

**Process**:
1. Review updated spec with Product Trio
2. Check for new specialist needs (e.g., Performance Engineer)
3. Validate evidence for new requirements
4. Ensure tasks are fully specified
5. Update EVALUATION.md

**Example**:
```markdown
## Evaluation Update: 2024-02-07

### New Requirements: Undo/Redo
- Product Manager: ✅ Approved (high user demand)
- Engineering Lead: ✅ Approved (feasible with history state)
- UX Designer: ✅ Approved (standard keyboard shortcuts)

### New Concerns:
- Performance: History storage may impact memory
  - Mitigation: Limit to 50 entries, use structural sharing
- Testing: Need properties for undo/redo correctness
  - Mitigation: Property 14-16 added to design

### Action Items:
- [ ] Implement history with structural sharing
- [ ] Add memory usage monitoring
- [ ] Write property tests for undo/redo
```

### Step 6: Communicate Changes

**Who to notify**:
- Development team
- Product manager
- Stakeholders

**What to communicate**:
- What changed
- Why it changed
- Impact on timeline/scope
- Next steps

**Example**:
```markdown
## Spec Update: web-tracker-daw

**Date**: 2024-02-07
**Changes**: Added undo/redo support

**Reason**: User feedback showed high demand for undo functionality

**Impact**:
- 3 new tasks (estimated 2 days)
- New correctness properties to test
- Slight increase in memory usage (mitigated)

**Next Steps**:
- Implement Task 4.1-4.3
- Write property tests
- Validate in browser
```

---

## Versioning Strategy

### Semantic Versioning for Specs

**Format**: `MAJOR.MINOR.PATCH`

**MAJOR**: Breaking changes to requirements or architecture
- Example: Switching from IndexedDB to cloud storage

**MINOR**: New features or significant enhancements
- Example: Adding undo/redo support

**PATCH**: Bug fixes, clarifications, minor updates
- Example: Fixing typo in acceptance criteria

### Version Tracking

**In spec files**:
```markdown
---
version: 1.2.0
last_updated: 2024-02-07
---
```

**In CHANGELOG.md**:
```markdown
# Changelog: web-tracker-daw

## [1.2.0] - 2024-02-07
### Added
- Undo/redo support (Requirements 2.1-2.3)
- History state management (Design section 5)
- Tasks 4.1-4.3 for implementation

### Changed
- Store architecture to include history tracking

### Reason
- User feedback showed high demand for undo functionality

## [1.1.0] - 2024-02-01
### Added
- Node collapse/expand feature
- Performance targets for 1000+ nodes

## [1.0.0] - 2024-01-25
### Initial Release
- Basic node management
- Persistence with IndexedDB
- ReactFlow integration
```

---

## Handling Breaking Changes

### What Qualifies as Breaking?

**Breaking changes**:
- Removing features
- Changing core architecture
- Incompatible data format changes
- Removing acceptance criteria

**Non-breaking changes**:
- Adding features
- Enhancing existing features
- Clarifying requirements
- Adding acceptance criteria

### Breaking Change Process

1. **Document the break**:
   ```markdown
   ## BREAKING CHANGE: Storage Migration
   
   **Old**: IndexedDB with custom schema
   **New**: IndexedDB with versioned schema
   **Reason**: Support data migrations
   **Impact**: Existing projects need migration
   ```

2. **Create migration plan**:
   ```markdown
   ## Migration Plan
   
   1. Detect old schema version
   2. Read old data
   3. Transform to new schema
   4. Write to new schema
   5. Delete old data
   ```

3. **Add migration tasks**:
   ```markdown
   - [ ] Task 5.1: Implement schema migration
   - [ ] Task 5.2: Test migration with real data
   - [ ] Task 5.3: Add migration UI (progress bar)
   ```

4. **Update version**: Increment MAJOR version (e.g., 1.2.0 → 2.0.0)

---

## Spec Drift Prevention

### Common Causes of Drift

1. **Implementation without updating spec**
   - Developer implements feature differently
   - Spec becomes outdated

2. **Quick fixes without documentation**
   - Bug fix changes behavior
   - Spec doesn't reflect fix

3. **Verbal agreements not documented**
   - Team agrees on change in meeting
   - Spec never updated

### Prevention Strategies

**Strategy 1: Spec-First Rule**
- No implementation without spec update
- Spec is source of truth

**Strategy 2: Review Checklist**
- Before marking task complete, verify spec accuracy
- Update spec if implementation differs

**Strategy 3: Regular Spec Audits**
- Monthly review: Does spec match implementation?
- Fix any drift immediately

**Strategy 4: Automated Checks**
- Hook validates spec completeness
- CI checks for spec-code alignment

---

## Spec Refresh Checklist

Before marking spec refresh complete:

- [ ] **Requirements updated** (if needed)
  - [ ] New user stories added
  - [ ] New acceptance criteria added
  - [ ] Value proposition updated
  - [ ] Success metrics updated

- [ ] **Design updated** (if needed)
  - [ ] Architecture changes documented
  - [ ] New components specified
  - [ ] New correctness properties added
  - [ ] Integration points updated
  - [ ] Performance targets updated

- [ ] **Tasks updated** (if needed)
  - [ ] New tasks added with full specifications
  - [ ] Existing tasks modified if needed
  - [ ] Dependencies updated
  - [ ] Acceptance criteria updated

- [ ] **Evaluation re-run**
  - [ ] Product Trio reviewed changes
  - [ ] Specialists consulted if needed
  - [ ] EVALUATION.md updated
  - [ ] No blocking concerns

- [ ] **Version updated**
  - [ ] Version number incremented
  - [ ] CHANGELOG.md updated
  - [ ] Last updated date set

- [ ] **Communication sent**
  - [ ] Team notified of changes
  - [ ] Impact communicated
  - [ ] Next steps clear

---

## Example: Complete Refresh

### Scenario
User feedback reveals need for undo/redo. Implementation is 50% complete.

### Step 1: Stop and Assess
- Current state: Tasks 1-3 complete, Task 4 in progress
- New requirement: Undo/redo support
- Impact: Moderate (new feature, not breaking)

### Step 2: Update Requirements
```markdown
## 2. Undo/Redo Support (NEW - v1.2.0)

### User Story
As a user, I want to undo and redo actions so that I can recover from mistakes.

### Acceptance Criteria
[... as shown above ...]
```

### Step 3: Update Design
```markdown
## Undo/Redo Architecture (NEW - v1.2.0)
[... as shown above ...]

### Correctness Properties
- Property 14: Undo followed by redo returns to original state
- Property 15: History never exceeds max size
- Property 16: Undo/redo preserves all invariants
```

### Step 4: Update Tasks
```markdown
## Phase 4: Undo/Redo Implementation (NEW - v1.2.0)
- [ ] Task 4.1: Implement History State Management
- [ ] Task 4.2: Implement Undo Action
- [ ] Task 4.3: Implement Redo Action
```

### Step 5: Re-evaluate
```markdown
## Evaluation Update: 2024-02-07
- Product Manager: ✅ Approved
- Engineering Lead: ✅ Approved
- UX Designer: ✅ Approved
```

### Step 6: Update Version
```markdown
---
version: 1.2.0
last_updated: 2024-02-07
---
```

### Step 7: Update Changelog
```markdown
## [1.2.0] - 2024-02-07
### Added
- Undo/redo support
```

### Step 8: Communicate
```markdown
Team: Spec updated with undo/redo support.
Impact: 3 new tasks, ~2 days.
Next: Complete Task 4, then implement 4.1-4.3.
```

### Step 9: Resume Implementation
- Finish Task 4
- Implement Tasks 4.1-4.3
- Validate undo/redo works

---

## Quick Reference

### When to Refresh
- New requirements
- Implementation blockers
- Performance issues
- Security concerns
- UX issues
- Implementation learnings

### Refresh Process
1. Identify what changed
2. Update requirements (if needed)
3. Update design (if needed)
4. Update tasks (if needed)
5. Re-run evaluation
6. Update version
7. Communicate changes

### Version Increments
- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes, clarifications

### Drift Prevention
- Spec-first rule
- Review checklist
- Regular audits
- Automated checks

---

## Conclusion

Specs are living documents that evolve with your understanding. Refresh them when you learn new information, encounter blockers, or receive feedback. Keep them accurate, communicate changes, and prevent drift. A well-maintained spec is a valuable asset that guides development and prevents rework.

**Remember**: Spec drift is technical debt. Fix it immediately, don't let it accumulate.
