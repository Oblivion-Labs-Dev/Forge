# Agent System Instructions

> [!IMPORTANT]
> **Mandatory Startup Rule:** Before making any changes, read:
>
> 1. [`.agent/startup.md`](./.agent/startup.md)
> 2. [`.agent/completion.md`](./.agent/completion.md) (before declaring work done)
> 3. [`.agent/rules/common.md`](./.agent/rules/common.md)
> 4. [`.agent/rules/architecture.md`](./.agent/rules/architecture.md)
> 5. [`.agent/rules/coding.md`](./.agent/rules/coding.md)
> 6. [`.agent/rules/testing.md`](./.agent/rules/testing.md)
> 7. [`.agent/rules/documentation.md`](./.agent/rules/documentation.md)
> 8. [`.agent/rules/build-quality-gate.md`](./.agent/rules/build-quality-gate.md)
> 9. [`.agent/rules/git.md`](./.agent/rules/git.md)
> 10. Legacy rules under `rules/` (naming, forge, arsenal)
> 11. Any package-specific `AGENTS.md`
>
> Do not make modifications until these files have been read.

---

## Repository Layout

- `../Arsenal/packages/*` — Core reusable blocks (product-agnostic)
- `packages/*` — Forge-specific domain implementations
- `apps/*` — Applications layer (cli, api, dashboard)
- `tests/*` — Cross-cutting verification suites
- `.agent/` — Agent operating manual
- `docs/quality/` — Quality engineering documentation
- `rules/` — Style guidelines and domain mappings

## Quality Gate

Every PR must pass the full quality gate:

```bash
pnpm quality:gate
```

See [docs/quality/testing-strategy.md](./docs/quality/testing-strategy.md) and [.agent/rules/build-quality-gate.md](./.agent/rules/build-quality-gate.md).

## Commands

Run from this directory (`Forge/`):

```bash
pnpm install
pnpm typecheck
pnpm lint
pnpm test:unit
pnpm test:coverage
pnpm quality:gate
pnpm build
pnpm forge:poc
pnpm --filter forge-dashboard dev
```
