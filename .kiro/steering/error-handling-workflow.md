---
inclusion: always
description: Escalation workflow for handling code, linting, and test errors without premature deletion
---

# Error Handling Workflow

## Purpose

Prevent premature deletion of code or files when encountering errors. Follow a structured escalation process that exhausts all fix attempts before considering removal.

## Escalation Levels

### Level 1: Direct Fix (First Attempt)
Analyze the error and apply the most obvious fix:
- TypeScript errors: Add types, fix syntax, resolve imports
- Linting errors: Apply Biome auto-fixes, adjust formatting
- Test failures: Fix logic bugs, update assertions, correct test setup

**Action**: Apply fix → run `getDiagnostics` or test → verify

### Level 2: Alternative Approach (Second Attempt)
If Level 1 fails, try a different solution strategy:
- Refactor the implementation (different algorithm, data structure)
- Adjust type definitions (use generics, conditional types, type guards)
- Rewrite test logic (different test structure, better mocks/stubs)
- Check for dependency version conflicts or missing packages

**Action**: Apply alternative fix → run `getDiagnostics` or test → verify

### Level 3: Research Best Practice (Third Attempt)
If Level 2 fails, conduct deep research:
1. Use Context7 to fetch official library documentation
2. Search for similar error patterns in official docs
3. Web search for best practices and common solutions
4. Review project codebase for similar patterns that work

**Action**: Apply researched solution → run `getDiagnostics` or test → verify

### Level 4: User Consultation (Before Deletion)
If Level 3 fails, **STOP and consult the user** before any deletion:

```
I've attempted to fix [error type] through:
1. Direct fix: [what was tried]
2. Alternative approach: [what was tried]
3. Research-based solution: [what was tried]

The error persists: [error message]

Options:
- Delete [file/code] and refactor dependent code
- Investigate root cause together
- Accept technical debt and document limitation

What would you like to do?
```

**NEVER delete code or files without explicit user approval after Level 3 failure.**

## Error Type Specifics

### TypeScript Errors
- Level 1: Fix types, imports, syntax
- Level 2: Refactor type definitions, use type guards
- Level 3: Research TypeScript patterns for the specific error code
- Level 4: Ask before removing type-safe code

### Linting Errors
- Level 1: Apply Biome auto-fix (`pnpm lint --write`)
- Level 2: Manually adjust code to meet style rules
- Level 3: Research if rule should be disabled (rare, needs justification)
- Level 4: Ask before disabling rules or removing code

### Test Failures
- Level 1: Fix test logic or implementation bug
- Level 2: Rewrite test with different approach
- Level 3: Research testing patterns for the scenario
- Level 4: Ask before removing tests or features

## Forbidden Actions (Without User Approval)

- Deleting test files because tests fail
- Removing type annotations to silence TypeScript
- Disabling linting rules to avoid fixes
- Commenting out failing code
- Deleting entire features or modules

## Validation Commands

After each fix attempt, validate with:
- `getDiagnostics` for TypeScript/lint errors
- `pnpm test` for test failures
- `pnpm validate` for full CI gate

## Exception: Obvious Mistakes

You may delete without escalation if:
- Duplicate file created by mistake in same session
- Temporary debug code (console.logs, commented blocks)
- Scaffolding code explicitly marked as placeholder

## Integration with Spec Workflow

When executing spec tasks:
- Apply this workflow to all errors encountered
- Document persistent errors in task notes
- Mark task as blocked if Level 4 reached
- Never mark task complete with unresolved errors

## Communication Template

At each level, communicate progress:

**Level 1-3**: "Attempting [fix description]..."
**Level 4**: Use the consultation template above

Keep user informed but don't spam with every micro-step.
