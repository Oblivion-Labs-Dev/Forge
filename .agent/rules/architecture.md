# Architecture Rules

## Dependency Direction

* `forge/` imports and composes `arsenal/` capabilities.
* `arsenal/` must **never** import `forge/`.
* Shared utilities belong in Arsenal packages.
* Domain layer must be separated from UI/app layer.

## Package Boundaries

| Layer        | Location           | Responsibility              |
|--------------|--------------------|-----------------------------|
| Arsenal      | `../Arsenal/packages/*` | Product-agnostic primitives |
| Forge Domain | `packages/*`       | Forge-specific domain       |
| Apps         | `apps/*`           | CLI, API, dashboard         |
| Tests        | `tests/*`          | Cross-cutting verification  |

## Quality Architecture

The quality system is first-class infrastructure:

```
.agent/          → Agent operating manual
docs/quality/    → Human + agent documentation
tests/           → Verification suites
scripts/         → Report generation & gate orchestration
.github/         → CI enforcement
reports/         → Generated artifacts (never committed)
coverage/        → Generated coverage (never committed)
```

## Design Constraints

* Prefer composition over inheritance.
* Use runtime validation (Zod) at system boundaries.
* Events (HammerStrikes) and DTOs must have contract tests.
* UI must not embed business logic that belongs in packages.
