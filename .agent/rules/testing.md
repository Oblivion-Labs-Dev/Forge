# Testing Rules

## When Tests Are Required

### Finance Logic

Required: unit, golden, edge cases, regression.

Place tests in `tests/unit/finance/`, `tests/golden/finance/`.

### API / Services

Required: contract, integration, failure handling.

Place tests in `tests/contracts/`, `tests/integration/`.

### AI Prompts / LLM Output

Required: schema validation, hallucination prevention, output validation, evaluation dataset.

Place tests in `tests/evals/`.

### UI

Required: Playwright, visual regression, empty states, loading, errors, accessibility.

Place tests in `apps/dashboard/e2e/` and `tests/e2e/`.

### Shared Library

Required: unit, integration, consumer compatibility, version compatibility.

## Regression Protection

Every bug fixed → must receive a regression test.

Every production issue → gets a permanent regression test.

**Never fix a bug without adding a test.**

Name regression tests: `regression.<issue-id>.test.ts` or include issue reference in describe block.

## Golden Tests

* Store inputs in `tests/fixtures/`
* Store expected outputs in `tests/golden/**/expected/`
* Compare deterministically — normalize dates and IDs when needed
* Update golden files intentionally via `pnpm test:golden -- -u` only after review

## Coverage Thresholds

Minimum thresholds (enforced in CI):

| Metric     | Threshold |
|------------|-----------|
| Statements | 80%       |
| Branches   | 75%       |
| Functions  | 80%       |
| Lines      | 80%       |

Changed-files coverage target: 85%.

## Running Tests

```bash
pnpm test:unit
pnpm test:integration
pnpm test:contracts
pnpm test:golden
pnpm test:evals
pnpm test:e2e
pnpm test:coverage
pnpm quality:gate
```

## Debugging Failures

1. Read JUnit output in `reports/junit.xml`
2. Open HTML coverage at `coverage/index.html`
3. Open quality dashboard at `reports/quality-dashboard/index.html`
4. For Playwright: `apps/dashboard/playwright-report/`

See `docs/quality/testing-strategy.md` for full details.
