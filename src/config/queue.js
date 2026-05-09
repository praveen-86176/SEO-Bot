import { Queue } from 'bullmq';
import { env } from './env.js';
import redis from './redis.js';

export const seoQueue = new Queue(env.BULL_QUEUE_NAME, {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
