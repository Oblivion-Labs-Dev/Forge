# Build Quality Gate

Every Pull Request must pass the full quality gate. No exceptions.

## Pipeline

```
TypeScript
  ↓
ESLint
  ↓
Unit Tests
  ↓
Coverage
  ↓
Contract Tests
  ↓
Golden Tests
  ↓
Integration Tests
  ↓
Playwright
  ↓
AI Evaluation Tests
  ↓
Build
```

## Local Execution

```bash
pnpm quality:gate
```

This runs `scripts/quality-gate.ts` which executes each step sequentially and fails on first error.

## Report Generation

After tests complete:

```bash
pnpm quality:report
```

Generates:

* `reports/quality-dashboard/index.html` — Premium HTML dashboard
* `reports/quality-report.json` — Machine-readable summary
* Coverage HTML/JSON/lcov in `coverage/`
* JUnit in `reports/junit.xml`

## CI

* `.github/workflows/quality-gate.yml` — Runs full pipeline on PR/push
* `.github/workflows/pr-report.yml` — Posts PR comment with results

## Artifacts

CI uploads:

* `coverage/` (HTML, JSON, lcov)
* `reports/` (JUnit, quality report, dashboard)
* Playwright report

**Never commit generated reports.**

## Failure Policy

If any step fails, the PR fails. Fix the issue — do not disable checks without team approval.
