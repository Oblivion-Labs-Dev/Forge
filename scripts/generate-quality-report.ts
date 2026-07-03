import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dirname, '..');
const REPORTS_DIR = join(ROOT, 'reports');
const DASHBOARD_DIR = join(REPORTS_DIR, 'quality-dashboard');
const HISTORY_PATH = join(REPORTS_DIR, 'quality-history.json');

interface StepResult {
  name: string;
  status: 'pass' | 'fail' | 'skip';
  durationMs: number;
}

interface GateResults {
  timestamp: string;
  project: string;
  overall: 'pass' | 'fail';
  steps: StepResult[];
  coverage?: {
    statements: number;
    branches: number;
    functions: number;
    lines: number;
  };
  tests?: {
    passed: number;
    failed: number;
    total: number;
  };
}

interface HistoryEntry {
  timestamp: string;
  coverage: number;
  testsPassed: number;
  buildDurationMs: number;
  overall: string;
}

function loadGateResults(): GateResults {
  const path = join(REPORTS_DIR, 'quality-gate-results.json');
  if (existsSync(path)) {
    return JSON.parse(readFileSync(path, 'utf-8')) as GateResults;
  }
  return {
    timestamp: new Date().toISOString(),
    project: 'Forge OS',
    overall: 'pass',
    steps: [],
    coverage: { statements: 0, branches: 0, functions: 0, lines: 0 },
    tests: { passed: 0, failed: 0, total: 0 }
  };
}

function loadHistory(results: GateResults): HistoryEntry[] {
  let history: HistoryEntry[] = [];
  if (existsSync(HISTORY_PATH)) {
    history = JSON.parse(readFileSync(HISTORY_PATH, 'utf-8')) as HistoryEntry[];
  }
  const avgCoverage = results.coverage
    ? (results.coverage.statements +
        results.coverage.branches +
        results.coverage.functions +
        results.coverage.lines) /
      4
    : 0;
  const buildStep = results.steps.find((s) => s.name === 'Build');
  history.push({
    timestamp: results.timestamp,
    coverage: Math.round(avgCoverage * 10) / 10,
    testsPassed: results.tests?.passed ?? 0,
    buildDurationMs: buildStep?.durationMs ?? 0,
    overall: results.overall
  });
  if (history.length > 20) history = history.slice(-20);
  writeFileSync(HISTORY_PATH, JSON.stringify(history, null, 2));
  return history;
}

function moduleCoverage(): Array<{ module: string; pct: number }> {
  const finalPath = join(ROOT, 'coverage/coverage-final.json');
  if (!existsSync(finalPath)) return [];
  const data = JSON.parse(readFileSync(finalPath, 'utf-8')) as Record<
    string,
    { s: Record<string, number> }
  >;
  const modules = new Map<string, { covered: number; total: number }>();

  for (const [filePath, entry] of Object.entries(data)) {
    const rel = filePath.replace(/\\/g, '/');
    const parts = rel.split('/');
    const module = parts.includes('packages')
      ? parts.slice(parts.indexOf('packages'), parts.indexOf('packages') + 2).join('/')
      : parts.includes('fixtures')
        ? 'tests/fixtures/finance'
        : 'other';
    const stats = entry.s ?? {};
    const total = Object.keys(stats).length;
    const covered = Object.values(stats).filter((v) => v > 0).length;
    const existing = modules.get(module) ?? { covered: 0, total: 0 };
    modules.set(module, {
      covered: existing.covered + covered,
      total: existing.total + total
    });
  }

  return [...modules.entries()]
    .map(([module, { covered, total }]) => ({
      module,
      pct: total > 0 ? Math.round((covered / total) * 1000) / 10 : 0
    }))
    .sort((a, b) => a.pct - b.pct);
}

function svgLineChart(history: HistoryEntry[], width: number, height: number): string {
  if (history.length < 2) {
    return `<text x="${width / 2}" y="${height / 2}" text-anchor="middle" fill="#6b6864" font-size="12">Collecting trend data…</text>`;
  }
  const padding = 30;
  const maxY = 100;
  const points = history.map((h, i) => {
    const x = padding + (i / (history.length - 1)) * (width - padding * 2);
    const y = height - padding - (h.coverage / maxY) * (height - padding * 2);
    return `${x},${y}`;
  });
  return `
    <polyline points="${points.join(' ')}" fill="none" stroke="#d4af37" stroke-width="2" class="chart-line"/>
    ${history
      .map((h, i) => {
        const x = padding + (i / (history.length - 1)) * (width - padding * 2);
        const y = height - padding - (h.coverage / maxY) * (height - padding * 2);
        return `<circle cx="${x}" cy="${y}" r="3" fill="#d4af37"/>`;
      })
      .join('')}
  `;
}

function svgBar(value: number, max: number, width: number): string {
  const pct = max > 0 ? value / max : 0;
  const barWidth = Math.max(4, pct * width);
  return `<rect x="0" y="0" width="${barWidth}" height="8" rx="4" fill="url(#goldGrad)"/>`;
}

function statusBadge(status: string): string {
  const color = status === 'pass' ? '#4ade80' : status === 'fail' ? '#f87171' : '#d4af37';
  return `<span class="badge" style="--badge-color:${color}">${status.toUpperCase()}</span>`;
}

function generateHtml(results: GateResults, history: HistoryEntry[], modules: ReturnType<typeof moduleCoverage>): string {
  const cov = results.coverage ?? { statements: 0, branches: 0, functions: 0, lines: 0 };
  const avgCov = (cov.statements + cov.branches + cov.functions + cov.lines) / 4;
  const tests = results.tests ?? { passed: 0, failed: 0, total: 0 };
  const untested = modules.filter((m) => m.pct < 80).slice(0, 5);
  const stepRows = results.steps
    .map(
      (s) =>
        `<tr><td>${s.name}</td><td>${statusBadge(s.status)}</td><td>${(s.durationMs / 1000).toFixed(1)}s</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Forge OS Quality Dashboard</title>
  <style>
    :root {
      --bg: #060608; --surface: #111114; --gold: #d4af37; --text: #f0ede8;
      --muted: #6b6864; --success: #4ade80; --fail: #f87171;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg); color: var(--text);
      min-height: 100vh; line-height: 1.5;
    }
    .hero {
      padding: 2rem 2.5rem;
      background: linear-gradient(135deg, rgba(212,175,55,0.08), transparent);
      border-bottom: 1px solid rgba(212,175,55,0.15);
      animation: fadeIn 0.6s ease;
    }
    .hero h1 { font-size: 1.8rem; letter-spacing: 0.06em; }
    .hero p { color: var(--muted); margin-top: 0.25rem; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem; padding: 1.5rem 2.5rem;
    }
    .card {
      background: var(--surface);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 1.25rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      animation: slideUp 0.5s ease backwards;
    }
    .card:nth-child(2) { animation-delay: 0.05s; }
    .card:nth-child(3) { animation-delay: 0.1s; }
    .card:nth-child(4) { animation-delay: 0.15s; }
    .card h2 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--gold); margin-bottom: 0.75rem; }
    .metric { font-size: 2rem; font-weight: 700; font-variant-numeric: tabular-nums; }
    .metric-label { font-size: 0.7rem; color: var(--muted); margin-top: 0.25rem; }
    .badge {
      display: inline-block; padding: 0.15rem 0.5rem; border-radius: 999px;
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em;
      background: color-mix(in srgb, var(--badge-color) 15%, transparent);
      color: var(--badge-color); border: 1px solid color-mix(in srgb, var(--badge-color) 30%, transparent);
    }
    table { width: 100%; border-collapse: collapse; font-size: 0.8rem; }
    th, td { padding: 0.5rem 0; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.05); }
    th { color: var(--muted); font-weight: 500; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.08em; }
    .cov-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; }
    .cov-label { width: 90px; font-size: 0.75rem; color: var(--muted); }
    .cov-bar { flex: 1; background: rgba(255,255,255,0.06); border-radius: 999px; height: 8px; overflow: hidden; }
    .wide { grid-column: 1 / -1; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
    .chart-line { stroke-dasharray: 1000; stroke-dashoffset: 1000; animation: drawLine 1.5s ease forwards; }
    @keyframes drawLine { to { stroke-dashoffset: 0; } }
  </style>
</head>
<body>
  <header class="hero">
    <h1>Forge OS Quality Dashboard</h1>
    <p>Generated ${new Date(results.timestamp).toLocaleString()} · Overall ${statusBadge(results.overall)}</p>
  </header>

  <div class="grid">
    <div class="card">
      <h2>Overall Coverage</h2>
      <div class="metric">${avgCov.toFixed(1)}%</div>
      <div class="metric-label">Average across statements, branches, functions, lines</div>
    </div>
    <div class="card">
      <h2>Tests</h2>
      <div class="metric">${tests.passed}</div>
      <div class="metric-label">${tests.total} total · ${tests.failed} failed</div>
    </div>
    <div class="card">
      <h2>Latest Build</h2>
      <div class="metric">${statusBadge(results.overall)}</div>
      <div class="metric-label">${results.steps.find((s) => s.name === 'Build') ? `${((results.steps.find((s) => s.name === 'Build')!.durationMs) / 1000).toFixed(1)}s build time` : 'No build data'}</div>
    </div>
    <div class="card">
      <h2>AI Evaluations</h2>
      <div class="metric">${results.steps.find((s) => s.name === 'AI Evaluation Tests')?.status === 'pass' ? '100%' : '—'}</div>
      <div class="metric-label">Schema & hallucination validation</div>
    </div>

    <div class="card wide">
      <h2>Coverage Breakdown</h2>
      ${(['statements', 'branches', 'functions', 'lines'] as const)
        .map((key) => {
          const val = cov[key];
          return `<div class="cov-row"><span class="cov-label">${key}</span><div class="cov-bar"><svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none"><defs><linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#b87333"/><stop offset="100%" stop-color="#d4af37"/></linearGradient></defs>${svgBar(val, 100, 200)}</svg></div><span>${val.toFixed(1)}%</span></div>`;
        })
        .join('')}
    </div>

    <div class="card wide">
      <h2>Coverage Trend</h2>
      <svg width="100%" height="160" viewBox="0 0 400 160">${svgLineChart(history, 400, 160)}</svg>
    </div>

    <div class="card wide">
      <h2>Quality Gate Steps</h2>
      <table><thead><tr><th>Step</th><th>Status</th><th>Duration</th></tr></thead><tbody>${stepRows}</tbody></table>
    </div>

    <div class="card">
      <h2>Module Coverage</h2>
      ${modules
        .map(
          (m) =>
            `<div class="cov-row"><span class="cov-label">${m.module}</span><div class="cov-bar"><svg width="100%" height="8" viewBox="0 0 200 8" preserveAspectRatio="none"><defs><linearGradient id="goldGrad2" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="#b87333"/><stop offset="100%" stop-color="#d4af37"/></linearGradient></defs>${svgBar(m.pct, 100, 200)}</svg></div><span>${m.pct}%</span></div>`
        )
        .join('') || '<p style="color:var(--muted);font-size:0.8rem">No module data</p>'}
    </div>

    <div class="card">
      <h2>Largest Untested Modules</h2>
      ${
        untested.length
          ? `<ul style="list-style:none;font-size:0.8rem">${untested.map((m) => `<li style="padding:0.25rem 0;color:var(--muted)">${m.module} — ${m.pct}%</li>`).join('')}</ul>`
          : '<p style="color:var(--success);font-size:0.8rem">All modules above threshold</p>'
      }
    </div>

    <div class="card">
      <h2>Contract & Golden Status</h2>
      <p style="font-size:0.85rem;margin-bottom:0.5rem">Contracts: ${statusBadge(results.steps.find((s) => s.name === 'Contract Tests')?.status ?? 'skip')}</p>
      <p style="font-size:0.85rem">Golden: ${statusBadge(results.steps.find((s) => s.name === 'Golden Tests')?.status ?? 'skip')}</p>
    </div>
  </div>
</body>
</html>`;
}

function generatePrMarkdown(results: GateResults): string {
  const cov = results.coverage;
  const tests = results.tests;
  const step = (name: string) => results.steps.find((s) => s.name === name);

  return `## Forge OS Quality Report

| Check | Status |
|-------|--------|
| Type Check | ${step('TypeScript')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| Lint | ${step('ESLint')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| Tests | ${tests ? `${tests.passed} Passed` : '—'} |
| Contract Tests | ${step('Contract Tests')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| Golden Tests | ${step('Golden Tests')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| Playwright | ${step('Playwright')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| AI Evaluations | ${step('AI Evaluation Tests')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |
| Build | ${step('Build')?.status === 'pass' ? '✅ PASS' : '❌ FAIL'} |

### Coverage

| Metric | Value |
|--------|-------|
| Statements | ${cov?.statements.toFixed(0) ?? '—'}% |
| Branches | ${cov?.branches.toFixed(0) ?? '—'}% |
| Functions | ${cov?.functions.toFixed(0) ?? '—'}% |
| Lines | ${cov?.lines.toFixed(0) ?? '—'}% |

📊 [Quality Dashboard artifact](reports/quality-dashboard/index.html)`;
}

function main(): void {
  mkdirSync(DASHBOARD_DIR, { recursive: true });
  const results = loadGateResults();
  const history = loadHistory(results);
  const modules = moduleCoverage();
  const html = generateHtml(results, history, modules);

  writeFileSync(join(DASHBOARD_DIR, 'index.html'), html);
  writeFileSync(
    join(REPORTS_DIR, 'quality-report.json'),
    JSON.stringify({ results, history, modules }, null, 2)
  );
  writeFileSync(join(REPORTS_DIR, 'pr-comment.md'), generatePrMarkdown(results));

  console.log(`Quality dashboard: ${join(DASHBOARD_DIR, 'index.html')}`);
  console.log(`PR comment: ${join(REPORTS_DIR, 'pr-comment.md')}`);
}

main();
