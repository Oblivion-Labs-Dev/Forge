# Forge Dashboard

A premium, luxury-grade real-time visualization cockpit for the Forge autonomous software engineering operating system.

## Design Philosophy

The Forge Dashboard features a dark luxury theme characterized by:
- Deep graphite and obsidian tones.
- Elegant gold and amber forge highlights.
- Clear state transitions using high-performance Framer Motion animations.
- Custom interactive Node Flow diagrams using React Flow.
- Glassmorphic panels and thin, clean borders.

## Architectural Overview

### 1. Swappable Data Layer (`src/lib/forge-client`)
The dashboard interacts with the backend purely through the `ForgeClient` interface defined in [types.ts](src/lib/forge-client/types.ts).
By default, the application utilizes [mock.ts](src/lib/forge-client/mock.ts) to simulate real-time workflow progression, active workpiece logs, and `HammerStrikeEvent` events.
This layer can be effortlessly swapped to use SSE, WebSockets, REST, or static files without changing the UI code.

### 2. Static Manifest Generation
To inspect rules, skills, and monorepo structure, run the manifest generator at the workspace root:
```bash
npx tsx scripts/generate-manifests.ts
```
This utility scans the local folder structure (`Arsenal/packages/*`, `Forge/packages/*`, `rules/*`) and ejections compile manifests directly into the dashboard's public directory.

## Getting Started

Run inside the workspace root:
```bash
pnpm install
pnpm dev
pnpm build
```
