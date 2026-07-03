import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname);

export default defineConfig({
  resolve: {
    alias: {
      '@forge/core': resolve(root, '../Arsenal/packages/core/src/index.ts'),
      '@forge/contracts': resolve(root, '../Arsenal/packages/contracts/src/index.ts'),
      '@forge/config': resolve(root, '../Arsenal/packages/config/src/index.ts'),
      '@forge/logging': resolve(root, '../Arsenal/packages/logging/src/index.ts'),
      '@forge/events': resolve(root, '../Arsenal/packages/events/src/index.ts'),
      '@forge/telemetry': resolve(root, '../Arsenal/packages/telemetry/src/index.ts'),
      '@forge/models': resolve(root, '../Arsenal/packages/models/src/index.ts'),
      '@forge/tools': resolve(root, '../Arsenal/packages/tools/src/index.ts'),
      '@forge/memory': resolve(root, '../Arsenal/packages/memory/src/index.ts'),
      '@forge/scheduler': resolve(root, '../Arsenal/packages/scheduler/src/index.ts'),
      '@forge/evaluation': resolve(root, '../Arsenal/packages/evaluation/src/index.ts'),
      '@forge/testing': resolve(root, '../Arsenal/packages/testing/src/index.ts'),
      '@forge/runtime': resolve(root, 'packages/runtime/src/index.ts'),
      '@forge/engine': resolve(root, 'packages/engine/src/index.ts'),
      '@forge/goals': resolve(root, 'packages/goals/src/index.ts'),
      '@forge/guilds': resolve(root, 'packages/guilds/src/index.ts'),
      '@forge/artisans': resolve(root, 'packages/artisans/src/index.ts'),
      '@forge/workshops': resolve(root, 'packages/workshops/src/index.ts'),
      '@forge/archive': resolve(root, 'packages/archive/src/index.ts'),
      '@forge/codex': resolve(root, 'packages/codex/src/index.ts'),
      '@forge/gateways': resolve(root, 'packages/gateways/src/index.ts')
    }
  },
  test: {
    environment: 'node',
    globals: false,
    root,
    passWithNoTests: false,
    include: [
      'tests/unit/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/contracts/**/*.test.ts',
      'tests/golden/**/*.test.ts',
      'tests/evals/**/*.test.ts',
      'packages/**/src/**/*.test.ts',
      'apps/dashboard/src/**/*.test.ts'
    ],
    exclude: ['**/node_modules/**', '**/dist/**', 'tests/e2e/**'],
    reporters: ['default', ['junit', { outputFile: 'reports/junit.xml' }]],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['text', 'json', 'json-summary', 'html', 'lcov'],
      include: [
        'packages/engine/src/**',
        'packages/runtime/src/**',
        'tests/fixtures/finance/**'
      ],
      exclude: ['**/*.test.ts', '**/dist/**'],
      thresholds: {
        statements: 80,
        branches: 75,
        functions: 80,
        lines: 80
      }
    }
  }
});
