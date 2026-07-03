# Tests

Cross-cutting verification suites for the Forge quality gate.

| Directory     | Purpose                          | Command               |
|---------------|----------------------------------|-----------------------|
| `unit/`       | Isolated function/class tests    | `pnpm test:unit`      |
| `integration/`| Multi-component behavior         | `pnpm test:integration` |
| `contracts/`  | Schema and API contract validation | `pnpm test:contracts` |
| `golden/`     | Deterministic output comparison  | `pnpm test:golden`    |
| `evals/`      | AI output evaluation             | `pnpm test:evals`     |
| `e2e/`        | Pointer to Playwright in dashboard | `pnpm test:e2e`     |
| `fixtures/`   | Shared test data and helpers     | —                     |

See [docs/quality/testing-strategy.md](../docs/quality/testing-strategy.md).
