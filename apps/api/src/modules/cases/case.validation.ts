import { z } from 'zod';

export const caseIdentifierSchema = z.object({
  id: z.string().min(1),
});
