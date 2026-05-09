import { z } from 'zod';

export const updateContentSchema = z.object({
  content: z.string().min(10).max(5000),
});

export const rejectContentSchema = z.object({
  reason: z.string().max(500).optional(),
});

export const generatePlanSchema = z.object({
  reportId: z.string().uuid(),
});
