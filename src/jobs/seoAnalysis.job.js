import { Worker } from 'bullmq';
import redis from '../config/redis.js';
import prisma from '../config/database.js';
import logger from '../utils/logger.js';
import { runCrawler } from '../modules/crawler/crawler.service.js';
import { runFullSeoAnalysis } from '../modules/seo/seo.service.js';
import { generateRecommendations } from '../modules/recommendations/recommendation.service.js';

async function processJob(job) {
  const { orgId, reportId } = job.data;
  const jobStart = Date.now();

  logger.info(`[Job ${job.id}] Pipeline starting for report ${reportId}`);

  // ── PHASE 2: CRAWL ──────────────────────────────────────
  try {
    logger.info(`[Job ${job.id}] Phase 2: Crawling website`);
    await runCrawler(orgId, reportId);
    await job.updateProgress(25);
    logger.info(`[Job ${job.id}] Phase 2: Complete`);
  } catch (err) {
    logger.error(`[Job ${job.id}] Phase 2 hard failure: ${err.message}`);
    await prisma.seoReport.update({
      where: { id: reportId },
      data: { status: 'FAILED' }
    });
    throw err;
  }

  // ── PHASE 3: SEO ANALYSIS ────────────────────────────────
  try {
    logger.info(`[Job ${job.id}] Phase 3: Running SEO analysis`);
    await runFullSeoAnalysis(orgId, reportId);
    await job.updateProgress(55);
    logger.info(`[Job ${job.id}] Phase 3: Complete`);
  } catch (err) {
    logger.error(`[Job ${job.id}] Phase 3 partial failure: ${err.message}`);
  }

  // ── PHASE 4: RECOMMENDATIONS ─────────────────────────────
  try {
    logger.info(`[Job ${job.id}] Phase 4: Generating recommendations`);
    await generateRecommendations(reportId);
    await job.updateProgress(90);
    logger.info(`[Job ${job.id}] Phase 4: Complete`);
  } catch (err) {
    logger.error(`[Job ${job.id}] Phase 4 partial failure: ${err.message}`);
  }

  // ── MARK DONE ────────────────────────────────────────────
  await prisma.seoReport.update({
    where: { id: reportId },
    data: { status: 'DONE' }
  });
  await job.updateProgress(100);

  const duration = Date.now() - jobStart;
  logger.info(`[Job ${job.id}] Pipeline complete in ${duration}ms`);
}

const worker = new Worker(
  process.env.BULL_QUEUE_NAME || 'seo-analysis',
  processJob,
  {
    connection: redis,
    concurrency: 2,
    limiter: {
      max: 10,
      duration: 60000
    }
  }
);

worker.on('active', (job) => {
  logger.info(`[Job ${job.id}] Started processing`);
});

worker.on('completed', (job) => {
  logger.info(`[Job ${job.id}] Completed successfully`);
});

worker.on('failed', (job, err) => {
  logger.error(`[Job ${job.id}] Failed: ${err.message}`);
});

worker.on('error', (err) => {
  logger.error(`Worker error: ${err.message}`);
});

export default worker;
