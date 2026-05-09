import app from './src/app.js';
import { env } from './src/config/env.js';
import logger from './src/utils/logger.js';
import prisma, { pool } from './src/config/database.js';
import './src/jobs/seoAnalysis.job.js';

const PORT = env.PORT || 3000;

async function startServer() {
  // Start listening immediately to avoid timeouts
  const server = app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
  });

  try {
    // Then connect to the database
    await prisma.$connect();
    logger.info('✅ Successfully connected to the database.');

    // Handle graceful shutdown
    const shutdown = async () => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed.');
        await prisma.$disconnect();
        await pool.end();
        logger.info('Database disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    logger.error('❌ Database connection failed at startup:', error);
    // We keep the server running so we can at least see the health check errors
  }
}

startServer();
