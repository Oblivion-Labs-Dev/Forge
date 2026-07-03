import { z } from 'zod';

export const AiFinanceOutputSchema = z.object({
  recommendations: z.array(z.string()).min(1),
  riskScore: z.number().min(0).max(1),
  categories: z.array(z.string()).min(1),
  estimatedSavingsCents: z.number().min(0),
  merchants: z.array(z.string())
});

export type AiFinanceOutput = z.infer<typeof AiFinanceOutputSchema>;

const KNOWN_MERCHANTS = new Set([
  'Whole Foods Market',
  'Uber Trip',
  'Rent Payment',
  'Gas Station',
  'Salary Deposit',
  'Random Purchase'
]);

export function validateAiOutput(output: unknown): AiFinanceOutput {
  const parsed = AiFinanceOutputSchema.parse(output);

  const uniqueRecs = new Set(parsed.recommendations);
  if (uniqueRecs.size !== parsed.recommendations.length) {
    throw new Error('Duplicate recommendations detected');
  }

  for (const merchant of parsed.merchants) {
    if (!KNOWN_MERCHANTS.has(merchant)) {
      throw new Error(`Unknown merchant (possible hallucination): ${merchant}`);
    }
  }

  if (parsed.estimatedSavingsCents > 1_000_000) {
    throw new Error('Unreasonable savings estimate');
  }

  return parsed;
}
