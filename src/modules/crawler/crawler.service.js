import prisma from '../../config/database.js';
import { scrapeWebsite } from './scraper.service.js';
import { fetchMultipleSearchResults } from './search.service.js';
import AppError from '../../utils/appError.js';
import logger from '../../utils/logger.js';

export async function runCrawler(orgId, reportId) {
  logger.info(`Starting crawler for report ${reportId}`);

  // 1. Fetch Organization (Hard Failure)
  const org = await prisma.organization.findUnique({ where: { id: orgId } });
  if (!org) {
    await prisma.seoReport.update({ where: { id: reportId }, data: { status: 'FAILED' } });
    throw new AppError('Organization not found', 404);
  }

  // 2. Initial Status
  await prisma.seoReport.update({
    where: { id: reportId },
    data: { status: 'PROCESSING' }
  });

  // 3. Scrape Website (Never Throws)
  const websiteData = await scrapeWebsite(org.website);
  if (websiteData.isFallback) {
    logger.warn(`Crawler fallback for ${org.website}: ${websiteData.fallbackReason}`);
  } else {
    logger.info(`Successfully scraped ${org.website}`);
  }

  // 4. Fetch Search Results (Graceful Failure)
  let searchData = [];
  try {
    const queries = [
      { query: org.name, type: 'org_name' },
      ...(org.current_keywords || []).slice(0, 3).map(kw => ({ query: kw, type: 'keyword' }))
    ];
    searchData = await fetchMultipleSearchResults(queries);
    logger.info(`Fetched ${searchData.length} search results from SerpAPI`);
  } catch (err) {
    logger.warn(`Search fetch failed: ${err.message} — continuing without live SERP data`);
    searchData = [];
  }

  // 5. Final Save
  const rawCrawlData = {
    website: websiteData,
    searchResults: searchData,
    crawledAt: new Date().toISOString()
  };

  await prisma.seoReport.update({
    where: { id: reportId },
    data: { raw_crawl_data: rawCrawlData }
  });

  logger.info(`Crawler complete for report ${reportId}`, { isFallback: websiteData.isFallback });
  return rawCrawlData;
}
