import { Worker } from 'bullmq';
import { redis } from '../../config/redis.js';
import prisma from '../../config/database.js';
import { scrapeWebsite, fetchSearchIntelligence } from '../crawler/scraper.service.js';
import { analyzeKeywords } from './keyword.service.js';
import { analyzeCompetitors } from './competitor.service.js';
import { generateRecommendations } from '../recommendations/recommendation.service.js';
import logger from '../../utils/logger.js';

export const seoWorker = new Worker('seo-analysis', async (job) => {
  const { reportId, website, name, current_keywords = [] } = job.data;
  
  try {
    logger.info(`Protocol Start: SEO Intelligence Pipeline for ${website} (Job: ${job.id})`);
    
    // PHASE 1: Technical Audit (Crawler)
    await job.updateProgress(10);
    const crawlData = await scrapeWebsite(website);
    
    // PHASE 2: Market Intelligence (Search Fetching)
    await job.updateProgress(30);
    const searchData = await fetchSearchIntelligence(name, current_keywords);
    
    // Save partial data
    await prisma.seoReport.update({
      where: { id: reportId },
      data: { 
        raw_crawl_data: { 
          crawl: crawlData,
          search: searchData,
          analysis: {
            technical: {
              score: crawlData.isFallback ? 0 : 85,
              issues: crawlData.isFallback ? [{ issue: "Website blocked access", fix: "Check robots.txt" }] : []
            }
          }
        },
        status: 'PROCESSING'
      }
    });

    // PHASE 3: Keyword Intelligence (Primary/Secondary/Long-tail)
    await job.updateProgress(50);
    const keywordAnalysis = await analyzeKeywords(reportId, crawlData, searchData);
    
    // PHASE 4: Rival Intelligence (Competitors)
    await job.updateProgress(70);
    const competitorAnalysis = await analyzeCompetitors(reportId, crawlData, searchData);

    // Update report with deep analysis
    await prisma.seoReport.update({
      where: { id: reportId },
      data: {
        raw_crawl_data: {
          crawl: crawlData,
          search: searchData,
          analysis: {
            technical: {
              score: calculateTechnicalScore(crawlData),
              issues: generateTechnicalIssues(crawlData)
            },
            keywords: keywordAnalysis,
            competitors: competitorAnalysis
          }
        }
      }
    });

    // PHASE 5: Strategic Roadmap (Recommendations)
    await job.updateProgress(90);
    await generateRecommendations(reportId);

    // Finalize
    await prisma.seoReport.update({
      where: { id: reportId },
      data: { status: 'DONE' }
    });

    await job.updateProgress(100);
    logger.info(`Protocol Complete: ${reportId}`);

  } catch (error) {
    logger.error(`Pipeline failure for ${reportId}: ${error.message}`);
    await prisma.seoReport.update({
      where: { id: reportId },
      data: { status: 'FAILED' }
    });
    throw error;
  }
}, { connection: redis });

// Helper Logic for Score & Issues
function calculateTechnicalScore(data) {
  if (data.isFallback) return 30;
  let score = 100;
  if (!data.seo.title) score -= 20;
  if (!data.seo.metaDescription) score -= 20;
  if (data.headings.h1.length === 0) score -= 20;
  if (!data.technical.hasHttps) score -= 10;
  if (!data.technical.hasSitemap) score -= 10;
  return Math.max(score, 0);
}

function generateTechnicalIssues(data) {
  const issues = [];
  if (!data.seo.title) issues.push({ issue: "Missing Title Tag", fix: "Add a descriptive <title> to your homepage." });
  if (!data.seo.metaDescription) issues.push({ issue: "Missing Meta Description", fix: "Add a meta description to improve CTR in search results." });
  if (data.headings.h1.length === 0) issues.push({ issue: "Missing H1 Heading", fix: "Ensure your main topic is wrapped in an <h1> tag." });
  if (!data.technical.hasSitemap) issues.push({ issue: "Sitemap Not Found", fix: "Create a sitemap.xml to help Google index your pages." });
  return issues;
}
