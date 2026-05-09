import { z } from 'zod';

export const updatePrioritySchema = z.object({
  body: z.object({
    priority: z.enum(['HIGH', 'MEDIUM', 'LOW', 'high', 'medium', 'low']),
  }),
});
