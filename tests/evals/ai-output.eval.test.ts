import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { validateAiOutput } from '../fixtures/evals/validators.js';

interface EvalCase {
  id: string;
  input: string;
  output: unknown;
}

describe('AI evaluation tests', () => {
  const dataset: EvalCase[] = JSON.parse(
    readFileSync(join(import.meta.dirname, '../fixtures/evals/finance-eval-dataset.json'), 'utf-8')
  );

  for (const evalCase of dataset) {
    it(`validates eval case ${evalCase.id}`, () => {
      const result = validateAiOutput(evalCase.output);
      expect(result.riskScore).toBeGreaterThanOrEqual(0);
      expect(result.riskScore).toBeLessThanOrEqual(1);
      expect(result.recommendations.length).toBeGreaterThan(0);
    });
  }

  it('rejects hallucinated merchants', () => {
    expect(() =>
      validateAiOutput({
        recommendations: ['Check Fake Store spending'],
        riskScore: 0.5,
        categories: ['shopping'],
        estimatedSavingsCents: 100,
        merchants: ['Fake Store Inc']
      })
    ).toThrow('Unknown merchant');
  });

  it('rejects duplicate recommendations', () => {
    expect(() =>
      validateAiOutput({
        recommendations: ['Same tip', 'Same tip'],
        riskScore: 0.3,
        categories: ['groceries'],
        estimatedSavingsCents: 0,
        merchants: ['Whole Foods Market']
      })
    ).toThrow('Duplicate recommendations');
  });

  it('rejects invalid JSON schema', () => {
    expect(() => validateAiOutput({ bad: 'data' })).toThrow();
  });
});
