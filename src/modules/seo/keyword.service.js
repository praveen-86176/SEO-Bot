import { ai } from '../../utils/ai.js';
import prisma from '../../config/database.js';
import logger from '../../utils/logger.js';

export async function analyzeKeywords(reportId, crawlData, searchData = {}) {
  const report = await prisma.seoReport.findUnique({
    where: { id: reportId },
    include: { organization: true }
  });

  const org = report.organization;
  const websiteContent = crawlData.seo?.title + ' ' + crawlData.seo?.metaDescription;

  try {
    const prompt = `
      Perform advanced keyword research for ${org.name} in the ${org.industry} sector.
      
      INPUT SIGNALS:
      - Website Content: ${websiteContent}
      - User Target Keywords: ${JSON.stringify(org.current_keywords)}
      - Market Context (Search Results): ${JSON.stringify(searchData)}
      
      Generate a surgical keyword strategy classified into:
      1. PRIMARY: High-volume, high-intent terms.
      2. SECONDARY: Semantic variations and supporting terms.
      3. LONG-TAIL: Specific, high-conversion phrases.
      
      Return JSON:
      {
        "primary_keywords": ["kw1", "kw2"],
        "secondary_keywords": ["kw3", "kw4"],
        "longtail_keywords": ["kw5", "kw6"],
        "reasoning": "string"
      }
    `;

    const result = await ai.generateJson(prompt);

    // Save to Database
    await prisma.keywordAnalysis.upsert({
      where: { report_id: reportId },
      create: {
        report_id: reportId,
        primary_keywords: result.primary_keywords || [],
        secondary_keywords: result.secondary_keywords || [],
        longtail_keywords: result.longtail_keywords || [],
        reasoning: result.reasoning
      },
      update: {
        primary_keywords: result.primary_keywords || [],
        secondary_keywords: result.secondary_keywords || [],
        longtail_keywords: result.longtail_keywords || [],
        reasoning: result.reasoning
      }
    });

    return result;

  } catch (error) {
    logger.error(`Keyword analysis failed: ${error.message}`);
    // Fallback to basic keywords from input
    return {
      primary_keywords: org.current_keywords.slice(0, 5),
      secondary_keywords: [],
      longtail_keywords: [],
      reasoning: "AI analysis failed, using provided target keywords."
    };
  }
}
