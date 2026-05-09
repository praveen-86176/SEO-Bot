import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SEO Analysis & Execution Bot API',
    version: '1.0.0',
    description: `
      A production-grade SEO analysis system that:
      - Collects organization information
      - Crawls websites and fetches search data
      - Performs AI-powered SEO analysis
      - Generates actionable recommendations
      - Provides an ethical execution assistant (Bot Layer)
    `,
    contact: {
      name: 'API Support',
      email: 'support@seobot.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:{port}/api/v1',
      variables: {
        port: { default: '3000' }
      },
      description: 'Development server'
    }
  ],
  tags: [
    { name: 'Organizations', description: 'Organization management' },
    { name: 'Crawler', description: 'Web crawling and data fetching' },
    { name: 'SEO Analysis', description: 'AI-powered SEO analysis' },
    { name: 'Recommendations', description: 'SEO recommendations engine' },
    { name: 'Bot Layer', description: 'Execution assistant (ethical)' },
    { name: 'Reports', description: 'Unified report access' }
  ],
  components: {
    schemas: {
      Organization: {
        type: 'object',
        required: ['name', 'website', 'industry', 'target_audience', 'services'],
        properties: {
          name: { type: 'string', example: 'FitLife India' },
          website: { type: 'string', format: 'uri', example: 'https://fitlifeindia.com' },
          industry: { type: 'string', example: 'Fitness & Wellness' },
          target_audience: { type: 'string', example: 'Urban professionals aged 25-40' },
          geography: { type: 'string', example: 'India' },
          services: { type: 'array', items: { type: 'string' }, example: ['Personal Training', 'Online Coaching'] },
          competitors: { type: 'array', items: { type: 'string' }, example: ['https://competitor1.com'] },
          current_keywords: { type: 'array', items: { type: 'string' }, example: ['fitness trainer india'] }
        }
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              code: { type: 'number' }
            }
          }
        }
      },
      ReportStatus: {
        type: 'string',
        enum: ['PENDING', 'PROCESSING', 'DONE', 'FAILED']
      },
      ExecutionContentStatus: {
        type: 'string',
        enum: ['DRAFT', 'APPROVED', 'REJECTED']
      },
      ContentType: {
        type: 'string',
        enum: ['BLOG_POST_IDEA', 'BLOG_COMMENT', 'SOCIAL_POST', 'DIRECTORY_SUBMISSION', 'OUTREACH_EMAIL', 'FORUM_POST']
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.controller.js', './src/modules/**/*.routes.js']
};

export const swaggerSpec = swaggerJsdoc(options);
