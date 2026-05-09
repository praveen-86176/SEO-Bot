import express from 'express';
import * as botService from './bot.service.js';

const router = express.Router();

router.post('/:reportId/chat', async (req, res, next) => {
  try {
    const { message, history } = req.body;
    const { reportId } = req.params;
    
    const response = await botService.getBotResponse(reportId, message, history);
    res.json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
});

router.post('/:reportId/execute/:recId', async (req, res, next) => {
  try {
    const { reportId, recId } = req.params;
    const response = await botService.executeRecommendation(reportId, recId);
    res.json({ success: true, data: response });
  } catch (err) {
    next(err);
  }
});

export default router;
