/*
 * SEO EXECUTION ASSISTANT — ETHICAL COMPLIANCE NOTICE
 *
 * This bot layer is designed with strict ethical boundaries:
 * ✅ Generates content drafts for human review
 * ✅ Suggests platforms based on relevance
 * ✅ Requires explicit user approval per item
 * ✅ Allows editing before approval
 * ❌ Does NOT auto-post to any platform
 * ❌ Does NOT create fake accounts
 * ❌ Does NOT mass-comment or spam
 * ❌ Does NOT bypass platform Terms of Service
 *
 * Every approved item must be manually posted by the user.
 */

import { Router } from 'express';
import prisma from '../../config/database.js';
import * as BotService from './bot.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';
import validate from '../../middleware/validate.js';
import { updateContentSchema, rejectContentSchema } from './bot.validator.js';
import AppError from '../../utils/appError.js';

const router = Router();

/**
 * @swagger
 * /bot/generate/{reportId}:
 *   post:
 *     tags: [Bot Layer]
 *     summary: Generate execution content drafts for all recommendations in a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       202:
 *         description: Content generation started
 */
router.post(
  '/generate/:reportId',
  asyncWrapper(async (req, res) => {
    const summary = await BotService.generateExecutionPlan(req.params.reportId);
    return sendSuccess(res, summary, 'Execution plan generation started', 202);
  })
);

/**
 * @swagger
 * /bot/plan/{reportId}:
 *   get:
 *     tags: [Bot Layer]
 *     summary: Get full grouped execution plan for a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Grouped execution plan
 */
router.get(
  '/plan/:reportId',
  asyncWrapper(async (req, res) => {
    const plan = await BotService.getExecutionPlan(req.params.reportId);
    
    // Map to expected output shape
    const executionAssistant = Object.values(plan).flatMap(group => {
      return group.content.map(c => ({
        recommendationId: group.recommendation.id,
        recommendationTitle: group.recommendation.title,
        type: c.type,
        platform: c.platform,
        content: c.content,
        status: c.status,
        hashtags: c.hashtags,
        editUrl: `/api/v1/bot/content/${c.id}`,
        approveUrl: `/api/v1/bot/content/${c.id}/approve`,
        rejectUrl: `/api/v1/bot/content/${c.id}/reject`,
      }));
    });

    return sendSuccess(res, { executionAssistant });
  })
);

/**
 * @swagger
 * /bot/content/{recommendationId}:
 *   get:
 *     tags: [Bot Layer]
 *     summary: Get execution content for a specific recommendation
 *     parameters:
 *       - in: path
 *         name: recommendationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of content drafts
 */
router.get(
  '/content/:recommendationId',
  asyncWrapper(async (req, res) => {
    const drafts = await BotService.getContentByRecommendation(req.params.recommendationId);
    return sendSuccess(res, drafts);
  })
);

/**
 * @swagger
 * /bot/content/{contentId}:
 *   put:
 *     tags: [Bot Layer]
 *     summary: Edit a specific content draft
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content: { type: string, minLength: 10 }
 *     responses:
 *       200:
 *         description: Content updated
 */
router.put(
  '/content/:contentId',
  validate(updateContentSchema),
  asyncWrapper(async (req, res) => {
    const updated = await BotService.updateContent(req.params.contentId, req.body.content);
    return sendSuccess(res, updated, 'Content updated');
  })
);

/**
 * @swagger
 * /bot/content/{contentId}/approve:
 *   post:
 *     tags: [Bot Layer]
 *     summary: Approve a content draft for manual execution
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Content approved
 */
router.post(
  '/content/:contentId/approve',
  asyncWrapper(async (req, res) => {
    const approved = await BotService.approveContent(req.params.contentId);
    return sendSuccess(res, {
      ...approved,
      approvedAt: new Date().toISOString(),
      reminder: "Remember to manually post this content. This system does NOT auto-post."
    }, 'Content approved');
  })
);

/**
 * @swagger
 * /bot/content/{contentId}/reject:
 *   post:
 *     tags: [Bot Layer]
 *     summary: Reject a content draft
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason: { type: string }
 *     responses:
 *       200:
 *         description: Content rejected
 */
router.post(
  '/content/:contentId/reject',
  validate(rejectContentSchema),
  asyncWrapper(async (req, res) => {
    const rejected = await BotService.rejectContent(req.params.contentId, req.body.reason);
    return sendSuccess(res, rejected, 'Content rejected');
  })
);

/**
 * @swagger
 * /bot/content/{contentId}/regenerate:
 *   post:
 *     tags: [Bot Layer]
 *     summary: Regenerate a content draft using AI
 *     parameters:
 *       - in: path
 *         name: contentId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Content regenerated
 */
router.post(
  '/content/:contentId/regenerate',
  asyncWrapper(async (req, res) => {
    const draft = await BotService.regenerateContent(req.params.contentId);
    return sendSuccess(res, draft, 'Content regenerated');
  })
);

/**
 * @swagger
 * /bot/stats/{reportId}:
 *   get:
 *     tags: [Bot Layer]
 *     summary: Get execution statistics for a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Bot stats
 */
router.get(
  '/stats/:reportId',
  asyncWrapper(async (req, res) => {
    const stats = await BotService.getExecutionStats(req.params.reportId);
    return sendSuccess(res, stats);
  })
);

/**
 * @swagger
 * /bot/approved/{reportId}:
 *   get:
 *     tags: [Bot Layer]
 *     summary: Get all approved content drafts for a report
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of approved content
 */
router.get(
  '/approved/:reportId',
  asyncWrapper(async (req, res) => {
    const approvedItems = await prisma.executionContent.findMany({
      where: { 
        report_id: req.params.reportId,
        status: 'APPROVED'
      }
    });

    return sendSuccess(res, {
      message: "These items are approved for manual posting",
      reminder: "Post these manually on the suggested platforms. This system does NOT automate posting.",
      data: approvedItems
    });
  })
);

export default router;
