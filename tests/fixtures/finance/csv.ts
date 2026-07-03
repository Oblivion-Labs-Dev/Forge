export interface CsvRow {
  date: string;
  description: string;
  amount: string;
  category?: string;
}

export function parseCsv(content: string): CsvRow[] {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const dateIdx = headers.indexOf('date');
  const descIdx = headers.indexOf('description');
  const amountIdx = headers.indexOf('amount');
  const categoryIdx = headers.indexOf('category');

  if (dateIdx === -1 || descIdx === -1 || amountIdx === -1) {
    throw new Error('CSV must contain date, description, and amount columns');
  }

  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    return {
      date: cols[dateIdx] ?? '',
      description: cols[descIdx] ?? '',
      amount: cols[amountIdx] ?? '0',
      category: categoryIdx >= 0 ? cols[categoryIdx] : undefined
    };
  });
}
