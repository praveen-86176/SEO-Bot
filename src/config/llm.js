import Anthropic from '@anthropic-ai/sdk';
import Groq from 'groq-sdk';
import { env } from './env.js';
import logger from '../utils/logger.js';

export const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
}) : null;

export const groq = env.GROQ_API_KEY ? new Groq({
  apiKey: env.GROQ_API_KEY,
}) : null;

if (anthropic) logger.info('Anthropic client initialized');
if (groq) logger.info('Groq client initialized');

export const AI_CONFIG = {
  anthropic: {
    model: 'claude-3-5-sonnet-20240620',
  },
  groq: {
    model: 'llama-3.3-70b-versatile',
  }
};
