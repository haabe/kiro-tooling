#!/usr/bin/env node
/**
 * Git Hooks Setup Script
 *
 * Sets up git hooks for the this project.
 * This ensures all developers have the same validation pipeline.
 */

import { execSync } from 'node:child_process';
import { chmodSync, copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const hooks = [
  {
    name: 'pre-commit',
    description: 'Runs validation pipeline before commits',
  },
];

function setupHooks() {
  console.log('🔧 Setting up git hooks...');

  for (const hook of hooks) {
    const sourcePath = join('scripts', 'git-hooks', hook.name);
    const targetPath = join('.git', 'hooks', hook.name);

    if (!existsSync(sourcePath)) {
      console.log(`⚠️  Warning: Hook source file not found: ${sourcePath}`);
      continue;
    }

    try {
      // Copy the hook file
      copyFileSync(sourcePath, targetPath);

      // Make it executable
      chmodSync(targetPath, 0o755);

      console.log(`✅ Installed ${hook.name} hook: ${hook.description}`);
    } catch (error) {
      console.error(`❌ Failed to install ${hook.name} hook:`, error.message);
      process.exit(1);
    }
  }

  console.log('🎉 Git hooks setup complete!');
  console.log('');
  console.log('ℹ️  The pre-commit hook will now run validation before each commit.');
  console.log('   To bypass the hook (NOT RECOMMENDED), use: git commit --no-verify');
}

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.error('❌ Error: Not in a git repository');
  process.exit(1);
}

setupHooks();
