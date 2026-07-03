import { execSync } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS_DIR = join(ROOT, 'reports');

interface StepResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  durationMs: number;
  details?: string;
}

interface QualityGateResults {
  timestamp: string;
  project: string;
  overall: 'pass' | 'fail';
  steps: StepResult[];
  coverage?: CoverageSummary;
  tests?: TestSummary;
}

interface CoverageSummary {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

interface TestSummary {
  passed: number;
  failed: number;
  total: number;
}

const results: StepResult[] = [];

function runStep(name: string, command: string, optional = false): void {
  const start = Date.now();
  process.stdout.write(`\n▶ ${name}\n`);
  try {
    execSync(command, { stdio: 'inherit', cwd: ROOT, env: { ...process.env, CI: 'true' } });
    results.push({ name, status: 'pass', durationMs: Date.now() - start });
  } catch (error) {
    if (optional) {
      results.push({
        name,
        status: 'skip',
        durationMs: Date.now() - start,
        details: error instanceof Error ? error.message : 'Skipped'
      });
      return;
    }
    results.push({
      name,
      status: 'fail',
      durationMs: Date.now() - start,
      details: error instanceof Error ? error.message : 'Failed'
    });
    saveResults('fail');
    process.exit(1);
  }
}

function readCoverage(): CoverageSummary | undefined {
  const summaryPath = join(ROOT, 'coverage/coverage-summary.json');
  if (!existsSync(summaryPath)) return undefined;
  const summary = JSON.parse(readFileSync(summaryPath, 'utf-8')) as {
    total?: {
      statements: { pct: number };
      branches: { pct: number };
      functions: { pct: number };
      lines: { pct: number };
    };
  };
  const total = summary.total;
  if (!total) return undefined;
  return {
    statements: total.statements.pct,
    branches: total.branches.pct,
    functions: total.functions.pct,
    lines: total.lines.pct
  };
}

function readTestSummary(): TestSummary | undefined {
  const junitPath = join(REPORTS_DIR, 'junit.xml');
  if (!existsSync(junitPath)) return undefined;
  const xml = readFileSync(junitPath, 'utf-8');
  const testsMatch = xml.match(/tests="(\d+)"/);
  const failuresMatch = xml.match(/failures="(\d+)"/);
  const total = testsMatch ? parseInt(testsMatch[1], 10) : 0;
  const failed = failuresMatch ? parseInt(failuresMatch[1], 10) : 0;
  return { total, failed, passed: total - failed };
}

function saveResults(overall: 'pass' | 'fail'): void {
  mkdirSync(REPORTS_DIR, { recursive: true });
  const payload: QualityGateResults = {
    timestamp: new Date().toISOString(),
    project: 'Forge OS',
    overall,
    steps: results,
    coverage: readCoverage(),
    tests: readTestSummary()
  };
  writeFileSync(join(REPORTS_DIR, 'quality-gate-results.json'), JSON.stringify(payload, null, 2));
}

function main(): void {
  console.log('═══════════════════════════════════════');
  console.log('  Forge OS Quality Gate');
  console.log('═══════════════════════════════════════');

  mkdirSync(REPORTS_DIR, { recursive: true });

  runStep('TypeScript', 'pnpm typecheck');
  runStep('ESLint', 'pnpm lint');
  runStep('Unit Tests', 'pnpm test:unit');
  runStep('Coverage', 'pnpm test:coverage');
  runStep('Contract Tests', 'pnpm test:contracts');
  runStep('Golden Tests', 'pnpm test:golden');
  runStep('Integration Tests', 'pnpm test:integration');
  runStep('Playwright', 'pnpm test:e2e');
  runStep('AI Evaluation Tests', 'pnpm test:evals');
  runStep('Build', 'pnpm build');

  saveResults('pass');

  console.log('\n✓ Quality gate passed');
  execSync('pnpm quality:report', { stdio: 'inherit', cwd: ROOT });
}

main();
