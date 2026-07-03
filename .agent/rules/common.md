# Common Rules

## Core Principles

* Code must be clean, modular, and strictly typed.
* No `any` types unless absolutely unavoidable and documented.
* Respect package boundaries at all times.
* Every change must leave the repository stronger than before.

## Quality Expectations

* Add unit tests for constructors, validation, and failure paths.
* Every bug fix requires a regression test.
* Never decrease coverage without an approved remediation plan.
* Never bypass the quality gate.

## Agent Behavior

* Read `.agent/startup.md` before making changes.
* Complete `.agent/completion.md` before declaring work done.
* Prefer extending existing patterns over inventing new ones.
* When uncertain, read `docs/quality/` and package `AGENTS.md` files.

## Repository Layout

* `packages/*` — Forge domain implementations
* `apps/*` — CLI, API, dashboard
* `tests/*` — Cross-cutting test suites
* `../Arsenal/packages/*` — Shared library (product-agnostic)
* `.agent/` — Agent operating manual
* `docs/quality/` — Quality engineering documentation
