# Coding Rules

## TypeScript

* Strict mode always on.
* Explicit return types on exported functions.
* Prefer `interface` for object shapes; use `type` for unions/intersections.
* Use Zod for runtime validation at boundaries.

## Style

* Match surrounding code conventions.
* Keep functions focused — one responsibility.
* Avoid premature abstraction.
* Comments explain *why*, not *what*.

## Naming (Forge Domain)

* Forge = central runtime
* Arsenal = shared library system
* Blueprint = goal or plan
* Workpiece = unit of work
* Artisan = AI worker
* HammerStrike = domain event
* Artifact = final output

See `rules/naming.md` for full mapping.

## Error Handling

* Fail fast with typed errors at boundaries.
* Never swallow errors silently.
* Log with context at integration points.

## Testing Code

* Tests live beside source OR in `tests/` by suite type.
* Use descriptive `describe` / `it` blocks.
* One assertion focus per test when practical.
* No flaky tests — fix or quarantine with issue reference.
