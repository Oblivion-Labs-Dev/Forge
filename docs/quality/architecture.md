# Quality Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Pull Request                          │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              .github/workflows/quality-gate.yml          │
│  TypeScript → ESLint → Unit → Coverage → Contract →    │
│  Golden → Integration → Playwright → Evals → Build     │
└─────────────────────────┬───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    coverage/        reports/      playwright-report/
          │               │
          └───────┬───────┘
                  ▼
    scripts/generate-quality-report.ts
                  │
                  ▼
    reports/quality-dashboard/index.html
                  │
                  ▼
    .github/workflows/pr-report.yml → PR comment
```

## Components

| Component | Purpose |
|-----------|---------|
| `.agent/` | Agent operating manual — startup, rules, checklists |
| `tests/` | Verification suites by type |
| `scripts/quality-gate.ts` | Local + CI orchestration |
| `scripts/generate-quality-report.ts` | HTML dashboard + JSON report |
| `docs/quality/` | Human-readable quality documentation |
| `.github/workflows/` | CI enforcement and PR reporting |

## Agent Integration

Every agent must:

1. Read `.agent/startup.md` before changes
2. Follow `.agent/rules/*`
3. Complete `.agent/completion.md` before finishing

## Artifact Policy

Generated outputs are **never committed**:

* `coverage/`
* `reports/`
* `test-results/`
* `playwright-report/`

CI uploads them as GitHub artifacts for review.

## Extension Points

To add a new quality step:

1. Add test suite or script
2. Register in `scripts/quality-gate.ts`
3. Add CI step in `quality-gate.yml`
4. Update `generate-quality-report.ts` dashboard
5. Document in `docs/quality/testing-strategy.md`
