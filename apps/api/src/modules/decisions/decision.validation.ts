import { z } from 'zod';

export const createDecisionSchema = z.object({
  decisionOptionId: z.string().uuid(),
});

export type CreateDecisionInput = z.infer<typeof createDecisionSchema>;
