#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Doctor script - diagnose development environment issues
 * Run with: pnpm doctor
 */

import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const REQUIRED_NODE_VERSION = 20;
const REQUIRED_PNPM_VERSION = 9;

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function check(name, fn) {
  try {
    const result = fn();
    if (result.ok) {
      log(`✓ ${name}: ${result.message}`, 'green');
      return true;
    }
    log(`✗ ${name}: ${result.message}`, 'red');
    if (result.fix) {
      log(`  Fix: ${result.fix}`, 'dim');
    }
    return false;
  } catch (err) {
    log(`✗ ${name}: ${err.message}`, 'red');
    return false;
  }
}

function getVersion(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch {
    return null;
  }
}

function parseVersion(version) {
  const match = version?.match(/(\d+)\.(\d+)\.(\d+)/);
  if (match) {
    return {
      major: Number.parseInt(match[1], 10),
      minor: Number.parseInt(match[2], 10),
      patch: Number.parseInt(match[3], 10),
    };
  }
  return null;
}

console.log('\n🩺 Node Pulse Tracker - Environment Check\n');
console.log('─'.repeat(50));

let allPassed = true;

// Check Node.js
allPassed =
  check('Node.js', () => {
    const version = getVersion('node --version');
    if (!version) {
      return {
        ok: false,
        message: 'Not installed',
        fix: 'Install Node.js from https://nodejs.org',
      };
    }
    const parsed = parseVersion(version);
    if (!parsed || parsed.major < REQUIRED_NODE_VERSION) {
      return {
        ok: false,
        message: `${version} (need ${REQUIRED_NODE_VERSION}+)`,
        fix: 'Update Node.js',
      };
    }
    return { ok: true, message: version };
  }) && allPassed;

// Check pnpm
allPassed =
  check('pnpm', () => {
    const version = getVersion('pnpm --version');
    if (!version) {
      return { ok: false, message: 'Not installed', fix: 'npm install -g pnpm' };
    }
    const parsed = parseVersion(version);
    if (!parsed || parsed.major < REQUIRED_PNPM_VERSION) {
      return {
        ok: false,
        message: `${version} (need ${REQUIRED_PNPM_VERSION}+)`,
        fix: 'npm install -g pnpm@latest',
      };
    }
    return { ok: true, message: version };
  }) && allPassed;

// Check Rust (optional)
check('Rust', () => {
  const version = getVersion('rustc --version');
  if (!version) {
    return {
      ok: false,
      message: 'Not installed (optional, for WASM)',
      fix: 'curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh',
    };
  }
  return { ok: true, message: version.replace('rustc ', '') };
});

// Check wasm-pack (optional)
check('wasm-pack', () => {
  const version = getVersion('wasm-pack --version');
  if (!version) {
    return {
      ok: false,
      message: 'Not installed (optional, for WASM)',
      fix: 'cargo install wasm-pack',
    };
  }
  return { ok: true, message: version.replace('wasm-pack ', '') };
});

console.log('─'.repeat(50));

// Check project files
allPassed =
  check('package.json', () => {
    if (!existsSync('package.json')) {
      return { ok: false, message: 'Not found', fix: 'Run from project root directory' };
    }
    return { ok: true, message: 'Found' };
  }) && allPassed;

allPassed =
  check('node_modules', () => {
    if (!existsSync('node_modules')) {
      return { ok: false, message: 'Not installed', fix: 'pnpm install' };
    }
    return { ok: true, message: 'Installed' };
  }) && allPassed;

// Check TypeScript config
allPassed =
  check('tsconfig.json', () => {
    if (!existsSync('tsconfig.json')) {
      return { ok: false, message: 'Not found' };
    }
    return { ok: true, message: 'Found' };
  }) && allPassed;

// Check Vite config
allPassed =
  check('vite.config.ts', () => {
    if (!existsSync('vite.config.ts')) {
      return { ok: false, message: 'Not found' };
    }
    return { ok: true, message: 'Found' };
  }) && allPassed;

console.log('─'.repeat(50));

// Check if tests pass
check('Tests', () => {
  try {
    execSync('pnpm test', { stdio: 'pipe', timeout: 120000 });
    return { ok: true, message: 'Passing' };
  } catch {
    return { ok: false, message: 'Failing', fix: 'pnpm test to see details' };
  }
});

// Check if lint passes
check('Lint', () => {
  try {
    execSync('pnpm lint', { stdio: 'pipe' });
    return { ok: true, message: 'Clean' };
  } catch {
    return { ok: false, message: 'Issues found', fix: 'pnpm lint:fix' };
  }
});

// Check if types pass
check('TypeScript', () => {
  try {
    execSync('pnpm typecheck', { stdio: 'pipe' });
    return { ok: true, message: 'No errors' };
  } catch {
    return { ok: false, message: 'Type errors', fix: 'pnpm typecheck to see details' };
  }
});

console.log('─'.repeat(50));

if (allPassed) {
  log('\n✅ Environment is ready for development!\n', 'green');
  log('Quick start:', 'blue');
  log('  pnpm dev        # Start development server', 'dim');
  log('  pnpm test:watch # Run tests in watch mode', 'dim');
  log('  pnpm validate   # Run all checks\n', 'dim');
} else {
  log('\n⚠️  Some issues need to be fixed.\n', 'yellow');
  log('Run the suggested fixes above, then run: pnpm doctor\n', 'dim');
  process.exit(1);
}
