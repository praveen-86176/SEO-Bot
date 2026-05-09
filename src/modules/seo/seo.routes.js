import express from 'express';
import * as seoService from './seo.service.js';

const router = express.Router();

// Logic for manual trigger if needed
router.post('/analyze/:reportId', async (req, res, next) => {
  try {
    const { orgId } = req.body;
    const result = await seoService.runFullSeoAnalysis(orgId, req.params.reportId);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
