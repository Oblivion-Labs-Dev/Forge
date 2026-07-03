import type { CsvRow } from './csv.js';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amountCents: number;
  category: string;
  type: 'debit' | 'credit';
}

export function normalizeTransaction(row: CsvRow, index: number): Transaction {
  const parsed = parseFloat(row.amount.replace(/[^0-9.-]/g, ''));
  const amountCents = Math.round(Math.abs(parsed) * 100);
  const isCredit = parsed >= 0;

  return {
    id: `txn-${index + 1}`,
    date: row.date,
    merchant: row.description.trim(),
    amountCents,
    category: row.category?.trim() || inferCategory(row.description),
    type: isCredit ? 'credit' : 'debit'
  };
}

function inferCategory(description: string): string {
  const lower = description.toLowerCase();
  if (lower.includes('grocery') || lower.includes('market')) return 'groceries';
  if (lower.includes('rent') || lower.includes('mortgage')) return 'housing';
  if (lower.includes('uber') || lower.includes('gas')) return 'transport';
  if (lower.includes('salary') || lower.includes('payroll')) return 'income';
  return 'uncategorized';
}

export function normalizeTransactions(rows: CsvRow[]): Transaction[] {
  return rows.map((row, i) => normalizeTransaction(row, i));
}
