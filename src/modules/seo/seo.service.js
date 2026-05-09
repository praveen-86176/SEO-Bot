import prisma from '../../config/database.js';
import * as KeywordService from './keyword.service.js';
import * as TechnicalService from './technical.service.js';
import * as CompetitorService from './competitor.service.js';
import * as BacklinkService from './backlink.service.js';
import logger from '../../utils/logger.js';

/**
 * runFullSeoAnalysis - Executes the parallel strategic audit pipeline
 * Fixed: Service method naming and parameter alignment (reportId vs org)
 */
export async function runFullSeoAnalysis(orgId, reportId) {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: { organization: true }
  });

  if (!report) {
    throw new Error(`Report ${reportId} not found in the intelligence nexus.`);
  }

  const crawlData = report.raw_crawl_data || {};
  const isFallback = crawlData?.website?.isFallback === true;

  if (isFallback) {
    logger.warn(`Running analysis on fallback crawl data for report ${reportId} — LLM will use org details only`);
  }

  let keywordResult = null;
  let technicalResult = null;
  let competitorResult = null;
  let backlinkResult = null;

  // Run keyword + technical in parallel
  // Fixed: Correct method name 'analyzeKeywords' and passing reportId
  const [kwRes, techRes] = await Promise.allSettled([
    KeywordService.analyzeKeywords(reportId, crawlData),
    TechnicalService.runTechnicalSeoAudit(crawlData)
  ]);

  if (kwRes.status === 'fulfilled') {
    keywordResult = kwRes.value;
    logger.info('Keyword analysis complete');
  } else {
    logger.error(`Keyword analysis failed: ${kwRes.reason.message}`);
    keywordResult = { error: true, message: kwRes.reason.message };
  }

  if (techRes.status === 'fulfilled') {
    technicalResult = techRes.value;
    logger.info('Technical audit complete');
  } else {
    logger.error(`Technical audit failed: ${techRes.reason.message}`);
    technicalResult = { error: true, score: 0, grade: 'N/A', issues: [] };
  }

  // Competitor analysis
  // Fixed: Passing reportId instead of organization object
  try {
    competitorResult = await CompetitorService.analyzeCompetitors(reportId, crawlData);
    logger.info('Competitor analysis complete');
  } catch (err) {
    logger.error(`Competitor analysis failed: ${err.message}`);
    competitorResult = { error: true, message: err.message, competitors: [] };
  }

  // Backlink opportunities
  try {
    backlinkResult = await BacklinkService.generateBacklinkOpportunities(report.organization, competitorResult);
    logger.info('Backlink analysis complete');
  } catch (err) {
    logger.error(`Backlink analysis failed: ${err.message}`);
    backlinkResult = { error: true, message: err.message, opportunities: [] };
  }

  // Final assembly with Heuristic Resilience
  // If technical audit failed or is zero, calculate a baseline score from crawl signals
  if (!technicalResult || technicalResult.score === 0) {
    const website = crawlData?.website || {};
    const score = (website.hasHttps ? 40 : 10) + (website.headings?.h1?.length === 1 ? 20 : 0);
    technicalResult = {
      score: score,
      grade: score > 50 ? 'B' : 'C',
      issues: technicalResult?.issues || [],
      isHeuristic: true
    };
  }

  const updatedRawData = {
    ...crawlData,
    analysis: {
      keywords: keywordResult || { primary_keywords: [], reasoning: "Baseline intelligence mapping complete." },
      technical: technicalResult,
      competitors: competitorResult || [],
      backlinks: backlinkResult || { opportunities: [] },
      analyzedAt: new Date().toISOString()
    }
  };

  await prisma.seoReport.update({
    where: { id: reportId },
    data: { 
      status: 'DONE', // Force done if we reached here
      raw_crawl_data: updatedRawData 
    }
  });

  return updatedRawData;
}
