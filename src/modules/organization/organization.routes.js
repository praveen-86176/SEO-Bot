import { Router } from 'express';
import * as OrganizationController from './organization.controller.js';
import validate from '../../middleware/validate.js';
import { createOrganizationSchema } from './organization.validator.js';

const router = Router();

/**
 * @swagger
 * /organizations:
 *   post:
 *     tags: [Organizations]
 *     summary: Create organization and queue SEO analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Organization'
 *     responses:
 *       202:
 *         description: Organization created, analysis queued
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post(
  '/',
  validate(createOrganizationSchema),
  OrganizationController.createOrganization
);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     tags: [Organizations]
 *     summary: Get organization details by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Organization details
 *       404:
 *         description: Organization not found
 */
router.get('/:id', OrganizationController.getOrganization);

export default router;
