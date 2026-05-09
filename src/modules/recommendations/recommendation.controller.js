import { Router } from 'express';
import { z } from 'zod';
import prisma from '../../config/database.js';
import * as RecommendationService from './recommendation.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import validate from '../../middleware/validate.js';
import { updatePrioritySchema } from './recommendation.validator.js';
import AppError from '../../utils/appError.js';

const router = Router();

/**
 * @swagger
 * /recommendations/generate/{reportId}:
 *   post:
 *     tags: [Recommendations]
 *     summary: Generate 15 prioritized SEO recommendations using AI
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recommendations generated
 */
router.post(
  '/generate/:reportId',
  asyncWrapper(async (req, res) => {
    const { reportId } = req.params;

    const report = await prisma.seoReport.findUnique({
      where: { id: reportId },
    });

    if (!report) throw new AppError('Report not found', 404);

    const result = await RecommendationService.generateRecommendations(report.org_id, reportId);

    const stats = {
      total: result.recommendations.length,
      byCategory: result.recommendations.reduce((acc, r) => {
        acc[r.category.toLowerCase()] = (acc[r.category.toLowerCase()] || 0) + 1;
        return acc;
      }, {}),
      byPriority: result.recommendations.reduce((acc, r) => {
        acc[r.priority.toLowerCase()] = (acc[r.priority.toLowerCase()] || 0) + 1;
        return acc;
      }, {}),
    };

    return sendSuccess(res, {
      ...stats,
      executiveSummary: result.executive_summary,
      quickWins: result.quick_wins,
      estimatedTimeline: result.estimated_timeline,
      recommendations: result.recommendations,
    }, 'Recommendations generated successfully');
  })
);

/**
 * @swagger
 * /recommendations/{reportId}:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get paginated and filtered recommendations for a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: priority
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of recommendations
 */
router.get(
  '/:reportId',
  asyncWrapper(async (req, res) => {
    const { reportId } = req.params;
    const { category, priority, effort, timeframe } = req.query;

    const { recommendations, meta } = await RecommendationService.getRecommendations(reportId);

    let filtered = recommendations;

    if (category) filtered = filtered.filter(r => r.category.toLowerCase() === category.toLowerCase());
    if (priority) filtered = filtered.filter(r => r.priority.toLowerCase() === priority.toLowerCase());
    if (effort) filtered = filtered.filter(r => r.effort.toLowerCase() === effort.toLowerCase());
    if (timeframe) filtered = filtered.filter(r => r.timeframe?.toLowerCase() === timeframe.toLowerCase());

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const results = filtered.slice(startIndex, endIndex);

    return sendSuccess(res, {
      recommendations: results,
      meta,
      filters: { category, priority, effort, timeframe },
      total: filtered.length,
      page,
      limit,
    });
  })
);

/**
 * @swagger
 * /recommendations/{reportId}/summary:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get high-level summary of recommendations
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recommendation summary
 */
router.get(
  '/:reportId/summary',
  asyncWrapper(async (req, res) => {
    const { recommendations, meta } = await RecommendationService.getRecommendations(req.params.reportId);
    
    if (!meta) throw new AppError('No recommendations found for this report', 404);

    return sendSuccess(res, {
      executiveSummary: meta.executive_summary,
      quickWins: meta.quick_wins,
      stats: {
        total: recommendations.length,
        highPriority: recommendations.filter(r => r.priority === 'HIGH').length,
      },
      estimatedTimeline: meta.estimated_timeline,
      expectedTrafficImpact: meta.expected_traffic_impact,
    });
  })
);

/**
 * @swagger
 * /recommendations/single/{recommendationId}:
 *   get:
 *     tags: [Recommendations]
 *     summary: Get a single recommendation by ID
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Recommendation details
 */
router.get(
  '/single/:recommendationId',
  asyncWrapper(async (req, res) => {
    const recommendation = await RecommendationService.getRecommendationById(req.params.recommendationId);
    if (!recommendation) throw new AppError('Recommendation not found', 404);
    return sendSuccess(res, recommendation);
  })
);

/**
 * @swagger
 * /recommendations/{recommendationId}/priority:
 *   patch:
 *     tags: [Recommendations]
 *     summary: Update the priority of a specific recommendation
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               priority: { type: string, enum: [HIGH, MEDIUM, LOW] }
 *     responses:
 *       200:
 *         description: Priority updated
 */
router.patch(
  '/:recommendationId/priority',
  validate(updatePrioritySchema),
  asyncWrapper(async (req, res) => {
    const updated = await RecommendationService.updateRecommendationPriority(
      req.params.recommendationId,
      req.body.priority
    );
    return sendSuccess(res, updated, 'Priority updated');
  })
);

export default router;
