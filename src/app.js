import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { env } from './config/env.js';
import prisma from './config/database.js';
import redis from './config/redis.js';

// Middleware
import { requestLogger } from './middleware/requestLogger.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

// Routers
import organizationRoutes from './modules/organization/organization.routes.js';
import crawlerRouter from './modules/crawler/crawler.routes.js';
import seoRouter from './modules/seo/seo.routes.js';
import recommendationRouter from './modules/recommendations/recommendation.routes.js';
import botRouter from './modules/bot/bot.routes.js';
import reportRouter from './modules/report/report.controller.js';

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));

// Body parsing
app.use(express.json({ limit: '10mb' }));

// Logging
app.use(requestLogger);

// Rate limiting
app.use(rateLimiter);

// Health Checks
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

app.get('/api/v1/health/detailed', async (req, res) => {
  const start = Date.now();
  const health = {
    status: 'ok',
    services: {
      database: { status: 'error', latencyMs: 0 },
      redis: { status: 'error', latencyMs: 0 },
      llm: { status: env.GROQ_API_KEY ? 'configured' : 'missing' },
    },
    timestamp: new Date().toISOString(),
  };

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    health.services.database.status = 'ok';
    health.services.database.latencyMs = Date.now() - dbStart;
  } catch (err) {
    health.status = 'degraded';
  }

  try {
    const redisStart = Date.now();
    await redis.ping();
    health.services.redis.status = 'ok';
    health.services.redis.latencyMs = Date.now() - redisStart;
  } catch (err) {
    health.status = 'degraded';
  }

  res.status(health.status === 'ok' ? 200 : 207).json(health);
});

// Swagger Documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// API Routes
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/crawler', crawlerRouter);
app.use('/api/v1/seo', seoRouter);
app.use('/api/v1/recommendations', recommendationRouter);
app.use('/api/v1/bot', botRouter);
app.use('/api/v1/reports', reportRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 404,
    },
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
