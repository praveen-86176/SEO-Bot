import { Router } from 'express';
import * as ReportService from './report.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { asyncWrapper } from '../../utils/asyncWrapper.js';

const router = Router();

/**
 * @swagger
 * /reports/{reportId}:
 *   get:
 *     tags: [Reports]
 *     summary: Get full SEO report with all analysis and recommendations
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Full report data
 *       404:
 *         description: Report not found
 */
router.get(
  '/:reportId',
  asyncWrapper(async (req, res) => {
    const report = await ReportService.getFullReport(req.params.reportId);
    return sendSuccess(res, report);
  })
);

/**
 * @swagger
 * /reports/{reportId}/summary:
 *   get:
 *     tags: [Reports]
 *     summary: Get lightweight report summary for dashboards
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report summary
 */
router.get(
  '/:reportId/summary',
  asyncWrapper(async (req, res) => {
    const summary = await ReportService.getReportSummary(req.params.reportId);
    return sendSuccess(res, summary);
  })
);

/**
 * @swagger
 * /reports/{reportId}/status:
 *   get:
 *     tags: [Reports]
 *     summary: Get analysis status and progress
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current status and progress
 */
router.get(
  '/:reportId/status',
  asyncWrapper(async (req, res) => {
    const status = await ReportService.getReportStatus(req.params.reportId);
    return sendSuccess(res, status);
  })
);

/**
 * @swagger
 * /reports/org/{orgId}:
 *   get:
 *     tags: [Reports]
 *     summary: Get all reports for an organization
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of reports
 */
router.get(
  '/org/:orgId',
  asyncWrapper(async (req, res) => {
    const reports = await ReportService.getReportsByOrg(req.params.orgId);
    return sendSuccess(res, reports);
  })
);

/**
 * @swagger
 * /reports/{reportId}:
 *   delete:
 *     tags: [Reports]
 *     summary: Delete a report and all its related data
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted
 */
router.delete(
  '/:reportId',
  asyncWrapper(async (req, res) => {
    const result = await ReportService.deleteReport(req.params.reportId);
    return sendSuccess(res, result, 'Report deleted successfully');
  })
);

/**
 * @swagger
 * /reports/{reportId}/export:
 *   get:
 *     tags: [Reports]
 *     summary: Export full report as JSON file
 *     parameters:
 *       - in: path
 *         name: reportId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: JSON file download
 */
router.get(
  '/:reportId/export',
  asyncWrapper(async (req, res) => {
    const report = await ReportService.getFullReport(req.params.reportId);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=seo-report-${req.params.reportId}.json`);
    return res.send(JSON.stringify(report, null, 2));
  })
);

export default router;
