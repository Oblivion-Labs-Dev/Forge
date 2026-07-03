import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../../fixtures/finance/csv.js';
import { normalizeTransactions } from '../../fixtures/finance/normalize.js';
import { calculateBudget } from '../../fixtures/finance/budget.js';
import { monthlySummary } from '../../fixtures/finance/summary.js';

const FIXTURES = join(import.meta.dirname, '../../fixtures/finance');
const EXPECTED = join(import.meta.dirname, 'expected');

function loadExpected<T>(filename: string): T {
  return JSON.parse(readFileSync(join(EXPECTED, filename), 'utf-8')) as T;
}

describe('Finance golden tests', () => {
  const csv = readFileSync(join(FIXTURES, 'sample-transactions.csv'), 'utf-8');
  const rows = parseCsv(csv);
  const transactions = normalizeTransactions(rows);

  it('normalizes transactions to expected output', () => {
    const expected = loadExpected<unknown[]>('normalized-transactions.json');
    expect(transactions).toEqual(expected);
  });

  it('calculates monthly summary', () => {
    const summary = monthlySummary(transactions, '2025-05');
    const expected = loadExpected<ReturnType<typeof monthlySummary>>('monthly-summary.json');
    expect(summary).toEqual(expected);
  });

  it('calculates budget results', () => {
    const limits = [
      { category: 'groceries', limitCents: 50000 },
      { category: 'housing', limitCents: 200000 },
      { category: 'transport', limitCents: 10000 }
    ];
    const results = calculateBudget(transactions, limits);
    const expected = loadExpected<ReturnType<typeof calculateBudget>>('budget-results.json');
    expect(results).toEqual(expected);
  });
});
