import { z } from 'zod';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  BULL_QUEUE_NAME: z.string().min(1),
  CORS_ORIGIN: z.string().default('*'),
  SERP_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
});

const envParse = envSchema.safeParse(process.env);

if (!envParse.success) {
  logger.error('❌ Invalid environment variables:', envParse.error.format());
  process.exit(1);
}

export const env = envParse.data;
