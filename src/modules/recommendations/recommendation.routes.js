import express from 'express';
import prisma from '../../config/database.js';
import * as recommendationService from './recommendation.service.js';

const router = express.Router();

/**
 * Trigger new generation
 */
router.post('/generate/:reportId', async (req, res, next) => {
  try {
    const { orgId } = req.body;
    const result = await recommendationService.generateRecommendations(orgId, req.params.reportId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

/**
 * Fetch existing recommendations for a report
 */
router.get('/:reportId', async (req, res, next) => {
  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { report_id: req.params.reportId },
      orderBy: { impact_score: 'desc' }
    });
    res.json({ success: true, data: recommendations });
  } catch (err) {
    next(err);
  }
});

export default router;
