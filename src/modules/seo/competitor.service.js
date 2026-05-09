import { ai } from '../../utils/ai.js';
import prisma from '../../config/database.js';
import logger from '../../utils/logger.js';

export async function analyzeCompetitors(reportId, crawlData, searchData = {}) {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: { organization: true }
  });

  const org = report.organization;

  try {
    const prompt = `
      Perform an elite competitor analysis for ${org.name}.
      
      MARKET DATA:
      - Search Results: ${JSON.stringify(searchData)}
      - Stated Competitors: ${JSON.stringify(org.competitors)}
      
      Identify the top 3 market competitors and analyze:
      1. CONTENT FOCUS: What topics do they prioritize?
      2. KEYWORD USAGE: What are their power keywords?
      
      Return a JSON array of competitor objects:
      [{ "competitor_url": "url", "focus": "string", "top_keywords": ["kw1", "kw2"], "strategy": "string" }]
    `;

    const competitors = await ai.generateJson(prompt);

    if (Array.isArray(competitors)) {
      // Clear existing
      await prisma.competitorAnalysis.deleteMany({ where: { report_id: reportId } });

      // Save new
      for (const comp of competitors) {
        await prisma.competitorAnalysis.create({
          data: {
            report_id: reportId,
            competitor_url: comp.competitor_url,
            data: {
              focus: comp.focus,
              top_keywords: comp.top_keywords,
              strategy: comp.strategy
            }
          }
        });
      }
    }

    return competitors;

  } catch (error) {
    logger.error(`Competitor analysis failed: ${error.message}`);
    return [];
  }
}
