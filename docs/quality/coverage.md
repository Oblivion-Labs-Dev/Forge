# Coverage

## Thresholds

Enforced minimums (see `vitest.config.ts`):

| Metric     | Threshold |
|------------|-----------|
| Statements | 80%       |
| Branches   | 75%       |
| Functions  | 80%       |
| Lines      | 80%       |

Changed-files coverage target: **85%**.

## Report Formats

Generated on `pnpm test:coverage`:

| Format        | Location                        |
|---------------|---------------------------------|
| HTML          | `coverage/index.html`           |
| JSON summary  | `coverage/coverage-summary.json`|
| Full JSON     | `coverage/coverage-final.json`  |
| lcov          | `coverage/lcov.info`            |
| JUnit         | `reports/junit.xml`             |

## Premium Dashboard

```bash
pnpm quality:report
```

Opens aggregated view at `reports/quality-dashboard/index.html` including:

* Coverage trend
* Module heatmap
* Largest untested modules
* Test/build duration
* AI eval and contract success rates

## Policy

* Never commit generated coverage files.
* Do not lower thresholds without a remediation plan.
* New packages must include tests before merge.

## How Coverage Works

Vitest collects coverage via `@vitest/coverage-v8` across:

* `tests/unit/`, `tests/integration/`, `tests/contracts/`, `tests/golden/`, `tests/evals/`
* `packages/*/src/`
* `apps/dashboard/src/` (unit tests)

E2E tests do not contribute to line coverage but are required by the quality gate.
