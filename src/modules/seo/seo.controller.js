import { Router } from 'express';
import prisma from '../../config/database.js';
import * as SeoService from './seo.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import AppError from '../../utils/appError.js';

const router = Router();

/**
 * @swagger
 * /seo/analyze/{reportId}:
 *   post:
 *     tags: [SEO Analysis]
 *     summary: Manually trigger SEO analysis for a report (Keywords, Competitors, Technical, Backlinks)
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Analysis completed
 */
router.post(
  '/analyze/:reportId',
  asyncWrapper(async (req, res) => {
    const { reportId } = req.params;

    const report = await prisma.seoReport.findUnique({
      where: { id: reportId },
    });

    if (!report) throw new AppError('Report not found', 404);
    
    // Allow analysis if it's in a state that has crawl data
    if (report.status === 'PENDING') {
      throw new AppError('Crawl has not started yet', 400);
    }

    const result = await SeoService.runFullSeoAnalysis(report.org_id, reportId);

    return sendSuccess(res, result, 'Analysis completed');
  })
);

/**
 * @swagger
 * /seo/analysis/{reportId}:
 *   get:
 *     tags: [SEO Analysis]
 *     summary: Get full SEO analysis data for a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Full analysis data
 */
router.get(
  '/analysis/:reportId',
  asyncWrapper(async (req, res) => {
    const { reportId } = req.params;

    const report = await prisma.seoReport.findUnique({
      where: { id: reportId },
      include: {
        keyword_analysis: true,
        competitor_analysis: true,
      },
    });

    if (!report) throw new AppError('Report not found', 404);

    const crawlData = report.raw_crawl_data || {};
    const analysis = crawlData.analysis || {};

    return sendSuccess(res, {
      report: {
        id: report.id,
        status: report.status,
        createdAt: report.created_at,
      },
      keywords: report.keyword_analysis || analysis.keywords,
      competitors: report.competitor_analysis.length > 0 ? report.competitor_analysis : analysis.competitors,
      technical: analysis.technical,
      backlinks: analysis.backlinks,
      crawl: crawlData.website,
    });
  })
);

/**
 * @swagger
 * /seo/keywords/{reportId}:
 *   get:
 *     tags: [SEO Analysis]
 *     summary: Get keyword analysis data only
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Keyword data
 */
router.get('/keywords/:reportId', asyncWrapper(async (req, res) => {
  const report = await prisma.keywordAnalysis.findUnique({ where: { report_id: req.params.reportId } });
  if (!report) throw new AppError('Keyword analysis not found', 404);
  return sendSuccess(res, report);
}));

/**
 * @swagger
 * /seo/technical/{reportId}:
 *   get:
 *     tags: [SEO Analysis]
 *     summary: Get technical SEO audit results only
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Technical audit data
 */
router.get('/technical/:reportId', asyncWrapper(async (req, res) => {
  const report = await prisma.seoReport.findUnique({ where: { id: req.params.reportId } });
  if (!report || !report.raw_crawl_data?.analysis?.technical) throw new AppError('Technical audit not found', 404);
  return sendSuccess(res, report.raw_crawl_data.analysis.technical);
}));

/**
 * @swagger
 * /seo/competitors/{reportId}:
 *   get:
 *     tags: [SEO Analysis]
 *     summary: Get competitor gap analysis data only
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Competitor data
 */
router.get('/competitors/:reportId', asyncWrapper(async (req, res) => {
  const report = await prisma.competitorAnalysis.findMany({ where: { report_id: req.params.reportId } });
  if (!report || report.length === 0) throw new AppError('Competitor analysis not found', 404);
  return sendSuccess(res, report);
}));

export default router;
