import type { Transaction } from './normalize.js';

export interface Insight {
  id: string;
  type: 'spending' | 'savings' | 'anomaly';
  title: string;
  message: string;
  severity: 'info' | 'warn' | 'critical';
}

export function generateInsights(transactions: Transaction[]): Insight[] {
  const insights: Insight[] = [];
  const debits = transactions.filter((t) => t.type === 'debit');
  const totalSpent = debits.reduce((sum, t) => sum + t.amountCents, 0);

  if (totalSpent > 500000) {
    insights.push({
      id: 'insight-high-spend',
      type: 'spending',
      title: 'High Monthly Spending',
      message: `Total spending exceeds $${(totalSpent / 100).toFixed(0)} this period.`,
      severity: 'warn'
    });
  }

  const uncategorized = debits.filter((t) => t.category === 'uncategorized');
  if (uncategorized.length > 2) {
    insights.push({
      id: 'insight-uncategorized',
      type: 'anomaly',
      title: 'Uncategorized Transactions',
      message: `${uncategorized.length} transactions need categorization.`,
      severity: 'info'
    });
  }

  return insights;
}

export function generateRecommendations(transactions: Transaction[]): string[] {
  const recommendations: string[] = [];
  const categories = new Map<string, number>();

  for (const txn of transactions) {
    if (txn.type !== 'debit') continue;
    categories.set(txn.category, (categories.get(txn.category) ?? 0) + txn.amountCents);
  }

  for (const [category, amount] of categories) {
    if (amount > 20000) {
      recommendations.push(`Review ${category} spending — $${(amount / 100).toFixed(2)} this period.`);
    }
  }

  if (recommendations.length === 0) {
    recommendations.push('Spending is within normal ranges. Keep tracking.');
  }

  return recommendations;
}

export function detectAnomalies(transactions: Transaction[]): Transaction[] {
  const debits = transactions.filter((t) => t.type === 'debit');
  if (debits.length === 0) return [];

  const amounts = debits.map((t) => t.amountCents);
  const mean = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const threshold = mean * 3;

  return debits.filter((t) => t.amountCents > threshold);
}
