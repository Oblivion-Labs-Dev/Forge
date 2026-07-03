import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../../fixtures/finance/csv.js';
import { normalizeTransactions } from '../../fixtures/finance/normalize.js';
import { calculateBudget } from '../../fixtures/finance/budget.js';
import { monthlySummary } from '../../fixtures/finance/summary.js';
import {
  generateInsights,
  generateRecommendations,
  detectAnomalies
} from '../../fixtures/finance/insights.js';

describe('Finance domain logic', () => {
  const csv = readFileSync(
    join(import.meta.dirname, '../../fixtures/finance/sample-transactions.csv'),
    'utf-8'
  );
  const transactions = normalizeTransactions(parseCsv(csv));

  it('normalizes all sample transactions', () => {
    expect(transactions).toHaveLength(7);
    expect(transactions[0].type).toBe('credit');
    expect(transactions[1].type).toBe('debit');
  });

  it('calculates budget with limits', () => {
    const results = calculateBudget(transactions, [
      { category: 'groceries', limitCents: 50000 }
    ]);
    expect(results[0].overBudget).toBe(false);
  });

  it('generates monthly summary', () => {
    const summary = monthlySummary(transactions, '2025-05');
    expect(summary.transactionCount).toBe(7);
    expect(summary.netCents).toBeGreaterThan(0);
  });

  it('generates insights and recommendations', () => {
    const insights = generateInsights(transactions);
    const recommendations = generateRecommendations(transactions);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(Array.isArray(insights)).toBe(true);
  });

  it('detects spending anomalies', () => {
    const anomalies = detectAnomalies(transactions);
    expect(anomalies.some((a) => a.merchant === 'Rent Payment')).toBe(true);
  });
});
