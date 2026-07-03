# Git Rules

## Commits

* Write clear commit messages focused on *why*.
* One logical change per commit when possible.
* Never commit secrets (`.env`, credentials).
* Never commit generated artifacts (`coverage/`, `reports/`, `playwright-report/`).

## Pull Requests

* Complete `.agent/checklists/pr.md` before opening.
* Ensure `pnpm quality:gate` passes locally.
* Link related issues.
* Include test evidence in PR description.

## Branching

* Feature branches from `main`.
* Keep branches focused and short-lived.
* Rebase before merge when requested.

## Protected Changes

* Do not modify CI to skip failing checks without explicit approval.
* Do not lower coverage thresholds without remediation plan.
* Do not force-push to `main`.
