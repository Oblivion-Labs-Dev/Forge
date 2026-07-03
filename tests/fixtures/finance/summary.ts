import type { Transaction } from './normalize.js';

export interface MonthlySummary {
  month: string;
  totalIncomeCents: number;
  totalExpenseCents: number;
  netCents: number;
  transactionCount: number;
  topCategories: Array<{ category: string; amountCents: number }>;
}

export function monthlySummary(transactions: Transaction[], month: string): MonthlySummary {
  const filtered = transactions.filter((t) => t.date.startsWith(month));

  let totalIncomeCents = 0;
  let totalExpenseCents = 0;
  const categoryTotals = new Map<string, number>();

  for (const txn of filtered) {
    if (txn.type === 'credit') {
      totalIncomeCents += txn.amountCents;
    } else {
      totalExpenseCents += txn.amountCents;
      categoryTotals.set(txn.category, (categoryTotals.get(txn.category) ?? 0) + txn.amountCents);
    }
  }

  const topCategories = [...categoryTotals.entries()]
    .map(([category, amountCents]) => ({ category, amountCents }))
    .sort((a, b) => b.amountCents - a.amountCents)
    .slice(0, 5);

  return {
    month,
    totalIncomeCents,
    totalExpenseCents,
    netCents: totalIncomeCents - totalExpenseCents,
    transactionCount: filtered.length,
    topCategories
  };
}
