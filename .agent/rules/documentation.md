# Documentation Rules

## When to Update Docs

Update documentation when:

* Public APIs change
* Architecture changes
* Testing strategy changes
* Agent workflows change
* Quality gate steps change

## Documentation Locations

| Topic              | Location                          |
|--------------------|-----------------------------------|
| Agent startup      | `.agent/startup.md`               |
| Agent completion   | `.agent/completion.md`            |
| Testing strategy   | `docs/quality/testing-strategy.md`|
| Coverage           | `docs/quality/coverage.md`        |
| Quality architecture | `docs/quality/architecture.md`  |
| Package-specific   | `AGENTS.md`, `packages/*/README.md`|

## Writing Standards

* Complete sentences, clear headings.
* Include runnable command examples.
* Link related documents.
* Keep docs synchronized with CI configuration.

## Self-Documenting Code

* Exported functions need JSDoc when behavior is non-obvious.
* Schemas are documentation — keep Zod schemas as source of truth for contracts.
