# Agent Startup Instructions

Before making any modification to this repository, you MUST complete the following sequence.

## Step 1 — Read Repository Rules

Read, understand, and follow:

* `.agent/rules/common.md`
* `.agent/rules/architecture.md`
* `.agent/rules/coding.md`
* `.agent/rules/testing.md`
* `.agent/rules/documentation.md`
* `.agent/rules/build-quality-gate.md`
* `.agent/rules/git.md`
* Any package-specific `AGENTS.md`

Never assume conventions.

If documentation conflicts, stop and explain the conflict before making changes.

---

## Step 2 — Understand the Task

Identify:

* Goal
* Scope
* Risks
* Dependencies
* Affected modules
* Existing tests
* Existing documentation

Do not begin implementation until the impact is understood.

---

## Step 3 — Plan

Create a short implementation plan that includes:

* Files to modify
* Tests to add or update
* Documentation updates
* Possible regressions

---

## Step 4 — Implement

Prefer extending existing patterns over introducing new ones.

Avoid duplication.

Maintain backward compatibility unless intentionally changing behavior.

---

## Step 5 — Validate Continuously

Run validation throughout development rather than only at the end.

```bash
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm quality:gate   # full pipeline before PR
```

Never allow broken code to accumulate.

---

## Engineering Principles

* Test-first whenever practical.
* Every bug fix gets a regression test.
* Every new behavior gets a corresponding test.
* Never decrease maintainability.
* Leave the repository cleaner than you found it.
* Optimize for readability over cleverness.
* Prefer deterministic behavior.
* Preserve type safety.
* Do not bypass quality gates.

If you cannot satisfy a rule, explain why instead of silently ignoring it.
