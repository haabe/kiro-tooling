# Git Hooks

This directory contains git hooks for the project to ensure code quality and prevent broken commits.

## Available Hooks

### pre-commit

Runs the complete validation pipeline before allowing commits:

1. **TypeScript type check** (`pnpm run typecheck`)
   - Ensures zero TypeScript errors
   - Validates strict type safety

2. **Linting and formatting** (`pnpm run lint`)
   - Runs Biome checks for code quality
   - Ensures consistent formatting

3. **Tests** (`pnpm run test`)
   - Runs unit tests, property tests, and integration tests
   - Ensures all tests pass before commit

## Setup

### Automatic Setup (Recommended)

Run the setup script to install all hooks:

```bash
pnpm run setup:hooks
```

### Manual Setup

If you need to set up hooks manually:

```bash
# Copy the pre-commit hook
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit

# Make it executable
chmod +x .git/hooks/pre-commit
```

## Usage

Once installed, the hooks run automatically:

```bash
# This will trigger the pre-commit hook
git commit -m "feat: add new feature"
```

If validation fails, the commit will be blocked:

```
🔍 Running pre-commit validation...
📝 Running TypeScript type check...
❌ TypeScript errors found. Please fix them before committing.
Run 'pnpm run typecheck' to see the errors.
```

### Bypassing Hooks (NOT RECOMMENDED)

In rare cases where you need to bypass the validation (e.g., work-in-progress commits):

```bash
git commit --no-verify -m "wip: work in progress"
```

**⚠️ Warning**: Bypassing hooks should be avoided as it can introduce broken code into the repository.

## Hook Details

### Validation Pipeline

The pre-commit hook enforces the same quality gates as the CI pipeline:

| Check | Command | Purpose |
|-------|---------|---------|
| TypeScript | `pnpm run typecheck` | Zero type errors |
| Linting | `pnpm run lint` | Code quality and formatting |
| Tests | `pnpm run test` | All tests pass |

### Performance

The validation typically takes 30-60 seconds depending on:
- Number of changed files
- Test suite size
- System performance

### Troubleshooting

**Hook not running?**
- Check if the hook file exists: `ls -la .git/hooks/pre-commit`
- Verify it's executable: `chmod +x .git/hooks/pre-commit`
- Run setup script: `pnpm run setup:hooks`

**Validation taking too long?**
- Consider running tests in watch mode during development: `pnpm run test:watch`
- Use `pnpm run validate` to run the same checks manually

**Need to commit urgently?**
- Fix the validation errors (recommended)
- Or use `--no-verify` flag (not recommended)

## Development Workflow

With hooks enabled, the recommended workflow is:

1. **During development**: Use watch modes for fast feedback
   ```bash
   pnpm run test:watch        # Tests in watch mode
   pnpm run typecheck:watch   # TypeScript in watch mode
   ```

2. **Before committing**: Run validation manually to catch issues early
   ```bash
   pnpm run validate
   ```

3. **Commit**: The hook will run automatically
   ```bash
   git commit -m "feat: implement feature"
   ```

This ensures that only high-quality, validated code enters the repository.