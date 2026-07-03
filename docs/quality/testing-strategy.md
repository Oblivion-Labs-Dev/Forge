# Testing Strategy

Forge is a **test-first, self-validating** engineering workspace. Every change must be verified through automated quality gates.

## Test Pyramid

```
        E2E / Playwright
       Integration
      Contract / Golden
     Unit
```

## Suite Locations

| Suite        | Directory              | Command               |
|--------------|------------------------|-----------------------|
| Unit         | `tests/unit/`          | `pnpm test:unit`      |
| Integration  | `tests/integration/`   | `pnpm test:integration` |
| Contract     | `tests/contracts/`     | `pnpm test:contracts` |
| Golden       | `tests/golden/`        | `pnpm test:golden`    |
| E2E          | `apps/dashboard/e2e/`  | `pnpm test:e2e`       |
| AI Eval      | `tests/evals/`         | `pnpm test:evals`     |
| Fixtures     | `tests/fixtures/`      | Shared test data      |

## When Tests Are Required

### Finance Logic

Unit + golden + edge cases + regression tests.

### API

Contract + integration + failure handling.

### AI Prompts

Schema validation, hallucination checks, evaluation datasets.

### UI

Playwright, visual regression, empty/loading/error states, accessibility.

### Shared Libraries

Unit + integration + consumer compatibility.

## Regression Protection

Every bug fix **must** include a regression test. Never fix a bug without a test.

## Golden Tests

Golden tests compare deterministic outputs against stored fixtures.

1. Add input to `tests/fixtures/`
2. Add expected output to `tests/golden/**/expected/`
3. Run `pnpm test:golden`
4. Update expected files only after deliberate review

## AI Evaluation Tests

Evaluation datasets live in `tests/fixtures/evals/`.

Validators check:

* No hallucinations
* No duplicate recommendations
* Valid JSON and schema compliance
* No fake merchants or numbers
* Correct risk scores and categories

## Adding Tests

1. Choose the correct suite directory.
2. Follow naming: `<module>.test.ts` or `<module>.contract.test.ts`.
3. Import fixtures from `tests/fixtures/`.
4. Run the relevant suite locally before opening a PR.

## Debugging Failures

1. Read terminal output or `reports/junit.xml`
2. Open `coverage/index.html` for coverage gaps
3. Open `reports/quality-dashboard/index.html` for full picture
4. For Playwright: check `apps/dashboard/playwright-report/`

## Full Gate

```bash
pnpm quality:gate
```

See `.agent/rules/build-quality-gate.md` for pipeline order.
