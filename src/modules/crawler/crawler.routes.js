import express from 'express';
import * as crawlerController from './crawler.controller.js';

const router = express.Router();

router.get('/progress/:reportId', crawlerController.getCrawlerProgress);

export default router;
