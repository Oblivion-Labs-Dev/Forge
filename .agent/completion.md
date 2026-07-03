# Agent Completion Checklist

An implementation is not complete until every applicable item below has been satisfied.

## Code Quality

* Type checking passes (`pnpm typecheck`).
* Linting passes (`pnpm lint`).
* Formatting is consistent.
* No unnecessary code remains.
* No TODOs were introduced without justification.

## Testing

Confirm which tests were added or updated.

Run all applicable suites:

* Unit — `pnpm test:unit`
* Integration — `pnpm test:integration`
* Contract — `pnpm test:contracts`
* Golden — `pnpm test:golden`
* End-to-End — `pnpm test:e2e`
* AI Evaluation — `pnpm test:evals`

Or run the full gate: `pnpm quality:gate`

Explain why any skipped suite was not applicable.

## Coverage

Verify coverage does not decrease below repository thresholds.

If coverage decreases, explain why and provide a remediation plan.

See `docs/quality/coverage.md` for thresholds and report locations.

## Documentation

Update documentation when:

* APIs change
* Architecture changes
* Agent behavior changes
* Testing strategy changes
* Public interfaces change

## Validation

Confirm:

* Build succeeds (`pnpm build`)
* CI configuration remains valid
* Generated reports are produced (`pnpm quality:report`)
* No generated artifacts are committed
* Repository remains in a releasable state

## Final Summary

Before marking the task complete, provide:

1. Summary of changes.
2. Files modified.
3. Tests added or updated.
4. Validation performed.
5. Remaining limitations or follow-up work.
6. Any architectural decisions made during implementation.

Never declare success without completing this checklist.
