# Test Fixtures

Shared fixtures for unit, golden, contract, and evaluation tests.

## Finance

| File | Purpose |
|------|---------|
| `finance/sample-transactions.csv` | Raw CSV input |
| `finance/csv.ts` | CSV parser |
| `finance/normalize.ts` | Transaction normalization |
| `finance/budget.ts` | Budget calculations |
| `finance/summary.ts` | Monthly summaries |
| `finance/insights.ts` | Insights, recommendations, anomalies |

## Runtime

| File | Purpose |
|------|---------|
| `runtime-snapshot.json` | Valid ForgeRuntimeSnapshot fixture |

## AI Evaluations

| File | Purpose |
|------|---------|
| `evals/finance-eval-dataset.json` | Evaluation dataset |
| `evals/validators.ts` | Output validation helpers |

## Adding Fixtures

1. Add input data here.
2. Reference from the appropriate test suite.
3. For golden tests, add expected output to `tests/golden/**/expected/`.
