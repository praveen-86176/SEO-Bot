import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(100),
  website: z.string().url(),
  industry: z.string().optional(),
  target_audience: z.string().optional(),
  geography: z.string().optional(),
  services: z.array(z.string()).optional(),
  competitors: z.array(z.string().url()).optional(),
  current_keywords: z.array(z.string()).optional(),
});
