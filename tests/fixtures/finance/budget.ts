import type { Transaction } from './normalize.js';

export interface BudgetLimit {
  category: string;
  limitCents: number;
}

export interface BudgetResult {
  category: string;
  spentCents: number;
  limitCents: number;
  remainingCents: number;
  overBudget: boolean;
}

export function calculateBudget(
  transactions: Transaction[],
  limits: BudgetLimit[]
): BudgetResult[] {
  const spentByCategory = new Map<string, number>();

  for (const txn of transactions) {
    if (txn.type !== 'debit') continue;
    const current = spentByCategory.get(txn.category) ?? 0;
    spentByCategory.set(txn.category, current + txn.amountCents);
  }

  return limits.map((limit) => {
    const spentCents = spentByCategory.get(limit.category) ?? 0;
    const remainingCents = limit.limitCents - spentCents;
    return {
      category: limit.category,
      spentCents,
      limitCents: limit.limitCents,
      remainingCents,
      overBudget: remainingCents < 0
    };
  });
}
