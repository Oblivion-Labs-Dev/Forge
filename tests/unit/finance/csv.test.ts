import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseCsv } from '../../fixtures/finance/csv.js';

describe('parseCsv', () => {
  it('parses sample transactions CSV', () => {
    const content = readFileSync(
      join(import.meta.dirname, '../../fixtures/finance/sample-transactions.csv'),
      'utf-8'
    );
    const rows = parseCsv(content);
    expect(rows).toHaveLength(7);
    expect(rows[0].description).toBe('Salary Deposit');
  });

  it('throws on missing required columns', () => {
    expect(() => parseCsv('foo,bar\n1,2')).toThrow('CSV must contain');
  });
});
